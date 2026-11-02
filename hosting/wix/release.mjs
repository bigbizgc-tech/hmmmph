#!/usr/bin/env node
// Builds the Wix release zip from the current docs/:
//
//   node hosting/wix/release.mjs [--out <file.zip>]      (default: hosting/wix/release.zip)
//
// Installs the pinned dependencies when node_modules is missing (npm ci), copies docs/ into
// public/, runs `astro build` (the Wix hosting adapter writes dist/ and .wix/build-metadata.json)
// and zips .wix/ and dist/: the build zip Wix's UploadHeadlessWebsiteFiles releases.
// It does not release anything.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { crc32, deflateRawSync } from "node:zlib";
import { ROOT } from "./scripts/sync-site.mjs";
import { runAstro } from "./scripts/astro.mjs";

const outFlag = process.argv.indexOf("--out");
const OUT = outFlag > 0 ? resolve(process.argv[outFlag + 1]) : join(ROOT, "release.zip");

const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 22 || (major === 22 && minor < 12)) throw new Error(`Node >= 22.12 is required (this is ${process.version})`);

if (!existsSync(join(ROOT, "node_modules/.package-lock.json"))) {
  const r = spawnSync("npm", ["ci", "--no-audit", "--no-fund"], { cwd: ROOT, stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) throw new Error("npm ci failed");
}

for (const dir of ["dist", ".wix"]) rmSync(join(ROOT, dir), { recursive: true, force: true });
runAstro(["build"]);
for (const required of [".wix/build-metadata.json", "dist/server/index.mjs", "dist/client/index.html"]) {
  if (!existsSync(join(ROOT, required))) throw new Error(`the build produced no ${required}`);
}

// A plain zip of .wix/ and dist/ (files only, fixed timestamps, sorted), so the same build
// gives the same bytes on any OS without a zip binary.
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
const entries = [...walk(join(ROOT, ".wix")), ...walk(join(ROOT, "dist"))]
  .map((abs) => ({ abs, name: relative(ROOT, abs).split(sep).join("/") }))
  .sort((a, b) => (a.name < b.name ? -1 : 1));

const DOS_DATE = (0 << 9) | (1 << 5) | 1; // 1980-01-01 00:00
const locals = [];
const centrals = [];
let offset = 0;
for (const { abs, name } of entries) {
  const data = readFileSync(abs);
  const deflated = deflateRawSync(data, { level: 9 });
  const [method, body] = deflated.length < data.length ? [8, deflated] : [0, data];
  const nameBuf = Buffer.from(name, "utf8");
  const crc = crc32(data);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6); // UTF-8 names
  local.writeUInt16LE(method, 8);
  local.writeUInt16LE(0, 10);
  local.writeUInt16LE(DOS_DATE, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(body.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  local.writeUInt16LE(0, 28);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE((3 << 8) | 20, 4); // made by Unix, so the mode below applies
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0x0800, 8);
  central.writeUInt16LE(method, 10);
  central.writeUInt16LE(0, 12);
  central.writeUInt16LE(DOS_DATE, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(body.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt32LE(((0o100644 << 16) >>> 0), 38);
  central.writeUInt32LE(offset, 42);

  locals.push(local, nameBuf, body);
  centrals.push(central, nameBuf);
  offset += local.length + nameBuf.length + body.length;
}
const centralDir = Buffer.concat(centrals);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(entries.length, 8);
end.writeUInt16LE(entries.length, 10);
end.writeUInt32LE(centralDir.length, 12);
end.writeUInt32LE(offset, 16);
writeFileSync(OUT, Buffer.concat([...locals, centralDir, end]));

console.log(`\nrelease zip: ${OUT}`);
console.log(`size: ${statSync(OUT).size} bytes (${entries.length} files: .wix/ and dist/)`);
