// URL routing for the static site on Wix-managed Astro hosting.
//
// Wix serves every file of public/ (= docs/) at its exact path before the server is asked, so
// this only sees the other requests: "/" (the home page), clean or trailing-slash URLs, old Wix
// URLs, and unknown paths. The data comes from src/generated/site.mjs, written from docs/ and
// src/redirects.json by scripts/sync-site.mjs at build time.
import { files, redirects, indexHtml, notFoundHtml } from "./generated/site.mjs";

const fileByKey = new Map(files.map((f) => [f.toLowerCase(), f]));
const prefixes = Object.entries(redirects.prefix);

/** What a path resolves to: { home: true } | { redirect: "/x.html" } | { notFound: true }. */
export function resolve(pathname) {
  let path;
  try {
    path = decodeURIComponent(pathname).replace(/\/{2,}/g, "/");
  } catch {
    return { notFound: true };
  }
  const key = path.replace(/\/+$/, "").toLowerCase() || "/";
  if (key === "/" || key === "/index.html") {
    return path === "/" || path === "/index.html" ? { home: true } : { redirect: "/" };
  }

  // A file under another spelling (/About.html, /about.html/), the page behind a clean URL
  // (/about, /about/, /packages/spark), or a folder's index page.
  const target = fileByKey.get(key) ?? fileByKey.get(`${key}.html`) ?? fileByKey.get(`${key}/index.html`);
  if (target) {
    if (target === "/index.html") return { redirect: "/" };
    // The exact path of a file reached the server: the static layer did not serve it, and
    // redirecting would loop.
    if (target === path) return { notFound: true };
    return { redirect: target };
  }

  const legacy = redirects.exact[key] ?? prefixes.find(([p]) => key === p || key.startsWith(`${p}/`))?.[1];
  return legacy ? { redirect: legacy } : { notFound: true };
}

/** Appends the request's query string to a redirect target (before any #fragment). */
export function withQuery(target, search) {
  if (!search || search === "?") return target;
  const hashAt = target.indexOf("#");
  const [base, hash] = hashAt < 0 ? [target, ""] : [target.slice(0, hashAt), target.slice(hashAt)];
  return `${base}${base.includes("?") ? `&${search.slice(1)}` : search}${hash}`;
}

const html = (body, status, cacheControl) =>
  new Response(body, {
    status,
    // Exactly "text/html; charset=utf-8", so @wix/astro's HTML-embeds middleware leaves the
    // page as it is (it only rewrites "text/html"), like the static pages Wix serves directly.
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": cacheControl },
  });

/** The response for a URL that reached the server. */
export function respond(url) {
  const r = resolve(url.pathname);
  if (r.redirect) {
    return new Response(null, {
      status: 301,
      // A path, not an absolute URL: behind Wix's edge the server sees an internal host.
      headers: { Location: withQuery(encodeURI(r.redirect), url.search), "Cache-Control": "public, max-age=3600" },
    });
  }
  if (r.home) return html(indexHtml, 200, "public, max-age=0, must-revalidate");
  return html(notFoundHtml, 404, "no-store");
}
