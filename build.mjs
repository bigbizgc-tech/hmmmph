// Zero-dependency static site generator for Blackout Syndicate 2.0.
//   node build.mjs              → docs/      (deployable site)
//   node build.mjs --preview    → .preview/  (self-contained pages, form in preview mode)
import { readdir, mkdir, writeFile, rm, cp, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import baseConfig from './src/config.mjs';
import { renderPage } from './src/layout.mjs';
import { LEVELS, XP } from './src/data/business.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PREVIEW = process.argv.includes('--preview');
const OUT = join(ROOT, PREVIEW ? '.preview' : 'docs');
const config = { ...baseConfig, ...(PREVIEW ? { previewMode: true, xPixelId: '' } : {}) };

async function loadPages() {
  const dir = join(ROOT, 'src/pages');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.mjs')).sort();
  const pages = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(join(dir, f)).href);
    let exp = mod.default;
    if (typeof exp === 'function') exp = await exp();
    for (const p of Array.isArray(exp) ? exp : [exp]) {
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

function checkLinks(outFiles) {
  const problems = [];
  const have = new Set(outFiles.map((f) => f.path));
  const ids = new Map(outFiles.map((f) => [f.path, new Set([...f.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
  for (const f of outFiles) {
    const base = f.path.split('/').slice(0, -1);
    for (const m of f.html.matchAll(/\shref="([^"]+)"/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|tel:|sms:|data:)/.test(href)) continue;
      const [pathPart, hash] = href.split('#');
      let target = f.path;
      if (pathPart) {
        const parts = [...base];
        for (const seg of pathPart.split('?')[0].split('/')) {
          if (seg === '..') parts.pop(); else if (seg && seg !== '.') parts.push(seg);
        }
        target = parts.join('/');
      }
      if (target.startsWith('assets/')) continue;
      if (!have.has(target)) problems.push(`${f.path}: broken link → ${href}`);
      else if (hash && !ids.get(target)?.has(hash)) problems.push(`${f.path}: missing anchor → ${href}`);
    }
  }
  return problems;
}

async function main() {
  const pages = await loadPages();
  const files = registry(pages);
  const configJs = `window.BS_CONFIG=${JSON.stringify(config)};window.BS_FILES=${JSON.stringify(files)};window.BS_LEVELS=${JSON.stringify(LEVELS)};window.BS_XP=${JSON.stringify(XP)};`;
  const css = await readFile(join(ROOT, 'src/assets/css/site.css'), 'utf8');
  const siteJs = await readFile(join(ROOT, 'src/assets/js/site.js'), 'utf8');

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const out = [];
  for (const page of pages) {
    const assets = PREVIEW
      ? { inline: true, css, siteJs, configJs, bare: page.path === 'index.html' }
      : { inline: false };
    const html = renderPage(page, pages, config, assets);
    out.push({ path: page.path, html });
    await mkdir(dirname(join(OUT, page.path)), { recursive: true });
    await writeFile(join(OUT, page.path), html);
  }

  await cp(join(ROOT, 'src/assets'), join(OUT, 'assets'), { recursive: true });
  await writeFile(join(OUT, 'assets/js/config.js'), configJs + '\n');

  if (!PREVIEW) {
    const urls = pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${config.siteUrl}/${p.path === 'index.html' ? '' : p.path}</loc></url>`).join('\n');
    await writeFile(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
    await writeFile(join(OUT, '.nojekyll'), '');
  }

  const problems = checkLinks(out);
  console.log(`Built ${out.length} pages → ${OUT.replace(ROOT + '/', '')}/  (${files.length} clearance files)`);
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exitCode = 1;
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
