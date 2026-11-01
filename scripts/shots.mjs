// Visual QA: serves docs/ locally and screenshots pages at desktop + phone widths.
//   node scripts/shots.mjs                     → every page
//   node scripts/shots.mjs index.html faq.html → just those
// Output: .shots/<page>--desktop.png / --phone.png, plus console errors and overflow report.
import { createServer } from 'node:http';
import { readFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
const OUT = join(ROOT, '.shots');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

async function listPages(dir = DOCS, base = '') {
  const out = [];
  for (const f of await readdir(dir)) {
    const p = join(dir, f);
    if ((await stat(p)).isDirectory()) { if (f !== 'assets') out.push(...(await listPages(p, base + f + '/'))); }
    else if (f.endsWith('.html')) out.push(base + f);
  }
  return out.sort();
}

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const body = await readFile(join(DOCS, p));
    res.writeHead(200, { 'Content-Type': TYPES[extname(p)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('nf'); }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const pages = process.argv.slice(2).length ? process.argv.slice(2) : await listPages();
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const report = [];
for (const [label, vp] of [['desktop', { width: 1366, height: 860 }], ['phone', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: 'reduce', hasTouch: label === 'phone' });
  for (const page of pages) {
    const tab = await ctx.newPage();
    const errors = [];
    tab.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    tab.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await tab.goto(`http://localhost:${port}/${page}`, { waitUntil: 'networkidle' }).catch((e) => errors.push('goto: ' + e.message));
    await tab.evaluate(() => document.fonts && document.fonts.ready);
    const overflow = await tab.evaluate(() => {
      const w = document.documentElement.clientWidth; const bad = [];
      for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); if (r.right > w + 1 && r.width > 0 && getComputedStyle(el).position !== 'fixed') bad.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') + ` (${Math.round(r.right)}px)`); }
      return { scrollW: document.documentElement.scrollWidth, w, bad: [...new Set(bad)].slice(0, 6) };
    });
    const name = page.replace(/\//g, '_').replace('.html', '');
    await tab.screenshot({ path: join(OUT, `${name}--${label}.png`), fullPage: true });
    report.push({ page, label, errors, overflow: overflow.scrollW > overflow.w ? overflow : null });
    await tab.close();
  }
  await ctx.close();
}
await browser.close();
server.close();
for (const r of report) {
  const issues = [...r.errors, ...(r.overflow ? [`horizontal overflow ${r.overflow.scrollW}>${r.overflow.w}: ${r.overflow.bad.join(', ')}`] : [])];
  console.log(`${issues.length ? '✗' : '✓'} ${r.page} [${r.label}]${issues.length ? '\n    ' + issues.join('\n    ') : ''}`);
}
console.log(`Screenshots in ${OUT}`);
