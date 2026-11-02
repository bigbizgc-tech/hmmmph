// Zero-dependency static site generator for Blackout Syndicate 2.0.
//   node build.mjs              → docs/      (deployable site)
//   node build.mjs --preview    → .preview/  (self-contained pages, form in preview mode)
import { readdir, mkdir, writeFile, rm, cp, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import baseConfig from './src/config.mjs';
import { renderPage } from './src/layout.mjs';
import { XP, BIZ, levelsFor } from './src/data/business.mjs';
import { OFFERS, offerPath } from './src/data/offers.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PREVIEW = process.argv.includes('--preview');
const OUT = join(ROOT, process.env.OUT_DIR || (PREVIEW ? '.preview' : 'docs'));
// LENIENT=1: skip page modules that fail to load (parallel editing) and report broken links as warnings.
const LENIENT = !!process.env.LENIENT;
// BS_CONFIG_OVERRIDE='{"xPixelId":"test"}' lets QA build a variant without editing src/config.mjs.
const override = process.env.BS_CONFIG_OVERRIDE ? JSON.parse(process.env.BS_CONFIG_OVERRIDE) : {};
const config = { ...baseConfig, ...(PREVIEW ? { previewMode: true, xPixelId: '' } : {}), ...override };

// Catch a half-finished setup before it ships.
if (!PREVIEW && config.xPixelId && !config.xEvents?.lead) {
  console.warn('⚠ xPixelId is set but xEvents.lead is empty: the X Lead conversion will not fire. Paste the tw-... event ID from Events Manager into xEvents.lead (see README, "Turn on the X Pixel").');
}
if (!PREVIEW && !process.env.OUT_DIR && config.previewMode) {
  console.error('✗ previewMode is true in a docs/ build: the form would skip sending and no lead would reach ' + BIZ.email + '. Set previewMode: false in src/config.mjs. Nothing was written.');
  process.exit(1);
}

async function loadPages() {
  const dir = join(ROOT, 'src/pages');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.mjs')).sort();
  const pages = [];
  for (const f of files) {
    let exp;
    try {
      const mod = await import(pathToFileURL(join(dir, f)).href + (LENIENT ? '?t=' + process.hrtime.bigint() : ''));
      exp = mod.default;
      // A module may export a function: it gets the merged config (src/config.mjs + BS_CONFIG_OVERRIDE)
      // and returns a page, a list of pages, or [] to build nothing (e.g. washington.html without a donateUrl).
      if (typeof exp === 'function') exp = await exp(config);
    } catch (e) {
      if (!LENIENT) throw new Error(`${f}: ${e.message}`);
      console.warn(`⚠ skipped ${f}: ${e.message}`);
      continue;
    }
    for (const p of Array.isArray(exp) ? exp : exp ? [exp] : []) {
      for (const k of ['path', 'title', 'description', 'body']) if (!p[k]) throw new Error(`${f}: page missing "${k}"`);
      pages.push(p);
    }
  }
  const seen = new Set();
  for (const p of pages) { if (seen.has(p.path)) throw new Error(`duplicate page path ${p.path}`); seen.add(p.path); }
  return pages;
}

// The "files" a visitor can open for clearance, in reading order.
function registry(pages) {
  return pages
    .filter((p) => p.file && p.xp !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((p) => ({ path: p.path, title: p.navTitle || p.title, file: p.file }));
}

// extra: links that only exist in script (the clearance ladder), checked like any other link.
function checkLinks(outFiles, extra = []) {
  const problems = [];
  const have = new Set(outFiles.map((f) => f.path));
  const ids = new Map(outFiles.map((f) => [f.path, new Set([...f.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
  for (const f of outFiles) {
    const base = f.path.split('/').slice(0, -1);
    const markup = f.html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
    const hrefs = [...markup.matchAll(/\shref="([^"]+)"/g)].map((m) => [f.path, m[1]]);
    if (f.path === 'index.html') hrefs.push(...extra.map((h) => ['business.mjs LEVELS', h]));
    for (const [from, href] of hrefs) {
      if (/^(https?:|mailto:|tel:|sms:|data:)/.test(href)) continue;
      const [pathPart, hash] = href.split('#');
      let target = f.path;
      if (pathPart) {
        const rooted = pathPart.startsWith('/');
        const parts = rooted ? [] : [...base];
        for (const seg of pathPart.split('?')[0].split('/')) {
          if (seg === '..') parts.pop(); else if (seg && seg !== '.') parts.push(seg);
        }
        target = parts.join('/') || 'index.html';
        if (target.endsWith('/')) target += 'index.html';
      }
      if (target.startsWith('assets/')) continue;
      if (!have.has(target)) problems.push(`${from}: broken link → ${href}`);
      else if (hash && !ids.get(target)?.has(hash)) problems.push(`${from}: missing anchor → ${href}`);
    }
  }
  return problems;
}

async function main() {
  const pages = await loadPages();
  const files = registry(pages);
  // The engine needs the contact lines too (failed-send message), so they never drift from BIZ.
  const clientConfig = { ...config, phone: BIZ.phone, phoneHref: BIZ.phoneHref, email: BIZ.email };
  const configJs = `window.BS_CONFIG=${JSON.stringify(clientConfig)};window.BS_FILES=${JSON.stringify(files)};window.BS_LEVELS=${JSON.stringify(levelsFor(config))};window.BS_XP=${JSON.stringify(XP)};`;
  const css = await readFile(join(ROOT, 'src/assets/css/site.css'), 'utf8');
  const siteJs = await readFile(join(ROOT, 'src/assets/js/site.js'), 'utf8');

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const out = [];
  for (const page of pages) {
    const assets = PREVIEW
      ? { inline: true, css, siteJs, configJs, bare: page.path === 'index.html' }
      : { inline: false };
    let html;
    try { html = renderPage(page, pages, config, assets); }
    catch (e) { if (!LENIENT) throw new Error(`${page.path}: ${e.message}`); console.warn(`⚠ skipped ${page.path}: ${e.message}`); continue; }
    out.push({ path: page.path, html });
    await mkdir(dirname(join(OUT, page.path)), { recursive: true });
    await writeFile(join(OUT, page.path), html);
  }

  await cp(join(ROOT, 'src/assets'), join(OUT, 'assets'), { recursive: true });
  await writeFile(join(OUT, 'assets/js/config.js'), configJs + '\n');
  await cp(join(ROOT, 'src/assets/img/favicon.ico'), join(OUT, 'favicon.ico'));

  if (!PREVIEW) {
    const urls = pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${config.siteUrl}/${p.path === 'index.html' ? '' : p.path}</loc></url>`).join('\n');
    await writeFile(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
    await writeFile(join(OUT, '.nojekyll'), '');
    // Netlify / Cloudflare Pages: old Wix product pages (shared and indexed) land on the new package pages.
    const moved = OFFERS.filter((o) => o.store && o.store.includes('/product-page/'))
      .map((o) => `${new URL(o.store).pathname} /${offerPath(o)} 301`);
    await writeFile(join(OUT, '_redirects'), moved.join('\n') + '\n');
  }

  // Clearance-ladder rewards are linked from script (toasts, drawer, "just declassified" card).
  const problems = checkLinks(out, levelsFor(config).filter((l) => l.href).map((l) => l.href));
  console.log(`Built ${out.length} pages → ${OUT.replace(ROOT + '/', '')}/  (${files.length} clearance files)`);
  if (problems.length) {
    console.error(problems.join('\n'));
    if (!LENIENT) process.exitCode = 1;
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
