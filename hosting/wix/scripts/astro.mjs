// Runs the Astro CLI on this project after syncing docs/ into it, with the environment the
// Wix integration needs at build time:  node scripts/astro.mjs <build|dev|...> [astro flags]
//
// WIX_CLIENT_ID is the site's public OAuth client id (wix.config.json appId). The three
// secrets are injected by Wix hosting at runtime; the build only checks that they exist, so
// stand-ins are used here, as the Wix Headless kit does for builds without a Wix CLI login
// (github.com/wix/skills, skills/wix-headless-kit/install/setup.mjs, writePluginEnv).
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, syncSite } from "./sync-site.mjs";

export function astroEnv() {
  const { appId } = JSON.parse(readFileSync(join(ROOT, "wix.config.json"), "utf8"));
  return {
    ...process.env,
    WIX_CLIENT_ID: appId,
    WIX_CLOUD_PROVIDER: process.env.WIX_CLOUD_PROVIDER ?? "KUBERNETES",
    WIX_CLIENT_INSTANCE_ID: process.env.WIX_CLIENT_INSTANCE_ID ?? "set-at-release",
    WIX_CLIENT_PUBLIC_KEY: process.env.WIX_CLIENT_PUBLIC_KEY ?? "set-at-release",
    WIX_CLIENT_SECRET: process.env.WIX_CLIENT_SECRET ?? "set-at-release",
    ASTRO_TELEMETRY_DISABLED: "1",
  };
}

export function runAstro(args) {
  const synced = syncSite();
  console.log(`synced ${synced.files} files from ${synced.from} into public/`);
  const astro = join(ROOT, "node_modules/astro/bin/astro.mjs");
  const r = spawnSync(process.execPath, [astro, ...args], { cwd: ROOT, env: astroEnv(), stdio: "inherit" });
  if (r.status !== 0) throw new Error(`astro ${args.join(" ")} exited with ${r.status ?? r.signal}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runAstro(process.argv.slice(2));
}
