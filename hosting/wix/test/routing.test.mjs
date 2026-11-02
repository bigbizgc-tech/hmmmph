// Routing checks against the built site (npm run build, or node release.mjs, first), served by
// scripts/serve.mjs the way Wix serves it.  npm test
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { ROOT } from "../scripts/sync-site.mjs";
import { startServer } from "../scripts/serve.mjs";

if (!existsSync(join(ROOT, "dist/server/index.mjs"))) throw new Error("no build: run `npm run build` first");
const page = (f) => readFileSync(join(ROOT, "dist/client", f), "utf8");

let server, base;
before(async () => {
  server = await startServer(0);
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
const get = (path) => fetch(base + path, { redirect: "manual", headers: { accept: "text/html" } });

test("files are served at their exact paths", async () => {
  for (const [path, type] of [
    ["/index.html", "text/html"], ["/about.html", "text/html"], ["/packages/spark.html", "text/html"],
    ["/assets/css/site.css", "text/css"], ["/assets/js/site.js", "text/javascript"],
    ["/assets/img/og.png", "image/png"], ["/favicon.ico", "image/x-icon"],
    ["/robots.txt", "text/plain"], ["/sitemap.xml", "application/xml"],
  ]) {
    const res = await get(path);
    assert.equal(res.status, 200, path);
    assert.ok(res.headers.get("content-type").startsWith(type), `${path}: ${res.headers.get("content-type")}`);
  }
});

test("/ is the home page", async () => {
  const res = await get("/?utm_source=qr");
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(await res.text(), page("index.html"));
});

const redirects = {
  "/about": "/about.html",
  "/about/": "/about.html",
  "/About": "/about.html",
  "/about.html/": "/about.html",
  "/getstarted": "/getstarted.html",
  "/getstarted/": "/getstarted.html",
  "/GetStarted": "/getstarted.html",
  "/packages": "/packages.html",
  "/packages/": "/packages.html",
  "/packages/spark": "/packages/spark.html",
  "/packages/spark/": "/packages/spark.html",
  "/services/ai-automation": "/services/ai-automation.html",
  "/index": "/",
  "/index/": "/",
  "/product-page/spark-get-seen-boost": "/packages/spark.html",
  "/product-page/boost-get-seen-boost": "/packages/boost.html",
  "/product-page/blitz-get-seen-boost": "/packages/blitz.html",
  "/product-page/30-day-post-kit": "/packages/post-kit.html",
  "/product-page/profile-fix": "/packages/profile-fix.html",
  "/product-page/profile-fix/": "/packages/profile-fix.html",
  "/product-page/some-old-product": "/packages.html",
  "/shop": "/packages.html",
  "/shop/": "/packages.html",
  "/category/all-products": "/packages.html",
  "/services": "/packages.html",
  "/services/": "/packages.html",
  "/book-online": "/packages.html",
  "/service-page/free-consultation": "/packages.html",
  "/pricing-plans/list": "/packages.html",
  "/plans-pricing": "/packages.html",
  "/blank": "/getstarted.html",
  "/contact-us": "/contact.html",
  "/about-us": "/about.html",
};

test("clean, trailing-slash and old Wix URLs redirect with 301", async () => {
  for (const [from, to] of Object.entries(redirects)) {
    const res = await get(from);
    assert.equal(res.status, 301, from);
    assert.equal(res.headers.get("location"), to, from);
    assert.equal(res.headers.get("set-cookie"), null, from);
  }
});

test("redirects keep the query string", async () => {
  for (const [from, to] of [
    ["/getstarted?utm_source=qr&utm_medium=flyer&utm_campaign=fall", "/getstarted.html?utm_source=qr&utm_medium=flyer&utm_campaign=fall"],
    ["/getstarted/?twclid=2-abc%20def", "/getstarted.html?twclid=2-abc%20def"],
    ["/product-page/profile-fix?utm_source=ig", "/packages/profile-fix.html?utm_source=ig"],
    ["/shop?fbclid=x", "/packages.html?fbclid=x"],
  ]) {
    const res = await get(from);
    assert.equal(res.status, 301, from);
    assert.equal(res.headers.get("location"), to, from);
  }
});

test("unknown paths are a 404 with the site's 404 page", async () => {
  for (const path of ["/nope", "/packages/nope", "/wp-admin/", "/assets/", "/about.htm", "/getstarted.html.bak"]) {
    const res = await get(path);
    assert.equal(res.status, 404, path);
    assert.equal(res.headers.get("content-type"), "text/html; charset=utf-8", path);
    const body = await res.text();
    assert.equal(body, page("404.html"), path);
    assert.match(body, /<base href="\/">/, path);
  }
});
