// Local preview of a build (run `npm run build` first), served the way Wix hosting does it:
// files of dist/client at their exact paths, everything else through the server bundle
// (dist/server/index.mjs, the adapter's Node path):  node scripts/serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ROOT } from "./sync-site.mjs";

const CLIENT = join(ROOT, "dist/client");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".woff2": "font/woff2",
};
// Wix injects the app's secrets at runtime; stand-ins locally.
const ENV = { WIX_CLIENT_INSTANCE_ID: "local", WIX_CLIENT_PUBLIC_KEY: "local", WIX_CLIENT_SECRET: "local" };

async function staticFile(pathname) {
  let rel;
  try { rel = normalize(decodeURIComponent(pathname)); } catch { return null; }
  const file = join(CLIENT, rel);
  if (!file.startsWith(CLIENT + "/") || /\/(_headers|\.assetsignore)$/.test(file)) return null;
  const s = await stat(file).catch(() => null);
  return s?.isFile() ? file : null;
}

export async function startServer(port = 4321, extraEnv = {}) {
  const worker = (await import(pathToFileURL(join(ROOT, "dist/server/index.mjs")).href)).default;
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const file = req.method === "GET" || req.method === "HEAD" ? await staticFile(url.pathname) : null;
      if (file) {
        res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream", "X-Served-By": "static" });
        return res.end(req.method === "HEAD" ? undefined : await readFile(file));
      }
      const hasBody = req.method !== "GET" && req.method !== "HEAD";
      const body = hasBody ? Buffer.concat(await req.toArray()) : undefined;
      const response = await worker.fetch(new Request(url, { method: req.method, headers: req.headers, body }), { ...ENV, ...extraEnv });
      res.writeHead(response.status, { ...Object.fromEntries(response.headers), "X-Served-By": "server" });
      if (response.body && req.method !== "HEAD") Readable.fromWeb(response.body).pipe(res);
      else res.end();
    } catch (error) {
      res.writeHead(500).end(String(error?.stack ?? error));
    }
  });
  await new Promise((ok) => server.listen(port, "127.0.0.1", ok));
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await startServer(Number(process.argv[2] ?? 4321));
  console.log(`serving ${CLIENT} + dist/server on http://127.0.0.1:${server.address().port}`);
}
