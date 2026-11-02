// Share card + touch icon. Renders two inline HTML cards in headless Chromium and saves:
//   src/assets/img/og.png               1200x630  (og:image / twitter:image, summary_large_image)
//   src/assets/img/apple-touch-icon.png  180x180  (iOS home screen)
//   node scripts/og.mjs                 (OG_OUT=some/dir writes somewhere else, for previews)
// Uses the same Playwright as scripts/shots.mjs and the same Google Fonts as the site. The facts on
// the card (tagline, towns, platforms) come from src/data/business.mjs, the platform icons from
// src/data/icons.mjs and the fedora mark from src/layout.mjs, so re-running this after a change
// there keeps the card in step with the site. Output is deterministic: same inputs, same pixels.
import { readFile, mkdir } from 'node:fs/promises';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { logoMark } from '../src/layout.mjs';
import { BIZ, PLATFORMS } from '../src/data/business.mjs';
import { ICONS } from '../src/data/icons.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, process.env.OG_OUT || 'src/assets/img');

// Same stylesheet the site loads. Read it out of layout.mjs so the two never drift apart.
const layoutSrc = await readFile(join(ROOT, 'src/layout.mjs'), 'utf8');
const FONTS = (layoutSrc.match(/const FONTS = '([^']+)'/) || [])[1]
  || 'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,400..800;1,100,400&family=Big+Shoulders+Display:wght@600;800;900&family=Bodoni+Moda:ital,opsz,wght@1,6..96,500;1,6..96,700&family=Courier+Prime:wght@400;700&display=swap';

const FACES = [
  "900 100px 'Big Shoulders Display'",
  "italic 700 100px 'Bodoni Moda'",
  "700 20px 'Courier Prime'",
  "800 40px 'Archivo'",
];

const C = { void: '#070708', gold: '#d9b25f', goldHi: '#f3d48a', paper: '#f2ead8', ash: '#aaa396' };

// Deterministic randomness so every run draws the same skyline and dust.
const seeded = (s) => () => (s = (s * 9301 + 49297) % 233280) / 233280;

// Where the searchlight lands on the card (px), and how wide the pool of light is.
const LIGHT = { x: 330, y: 300, r: 330 };
// Top-left corner of the GET SEEN. headline.
const WORD = { x: 56, y: 40 };

function skyline(W, H, base) {
  const rnd = seeded(11);
  let x = -8, rects = '', wins = '';
  while (x < W) {
    const w = 34 + rnd() * 66;
    const h = 24 + rnd() * 54 + (rnd() < 0.14 ? 34 : 0);
    const top = base - h;
    rects += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${(w + 1).toFixed(1)}" height="${(H - top).toFixed(1)}"/>`;
    const cols = Math.max(2, Math.floor(w / 11)), rows = Math.max(2, Math.floor(h / 14));
    for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
      if (rnd() >= 0.55) continue;
      const wx = x + 6 + (c * (w - 12)) / cols, wy = top + 8 + r * 14;
      const d = Math.hypot(wx - LIGHT.x, wy - LIGHT.y), a = Math.max(0, 1 - d / (LIGHT.r * 1.55));
      const fill = a > 0.02 ? `rgba(243,212,138,${(0.1 + a * 0.85).toFixed(3)})` : 'rgba(242,234,216,.06)';
      wins += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="4" height="6" fill="${fill}"/>`;
    }
    x += w + rnd() * 6;
  }
  return `<svg class="sky" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><g fill="#040405">${rects}</g>${wins}</svg>`;
}

// Premiere-style searchlights sweeping up from behind the skyline. [sourceX, sourceY, endX, endY, alpha]
const BEAMS = [[600, 660, 150, -80, 0.2], [170, 660, 1010, -90, 0.1]];
function beams(W, H) {
  let defs = '', polys = '';
  BEAMS.forEach(([sx, sy, ex, ey, a], i) => {
    const len = Math.hypot(ex - sx, ey - sy), nx = -(ey - sy) / len, ny = (ex - sx) / len;
    const w0 = 10, w1 = 150;
    const pts = [[sx + nx * w0, sy + ny * w0], [ex + nx * w1, ey + ny * w1], [ex - nx * w1, ey - ny * w1], [sx - nx * w0, sy - ny * w0]];
    defs += `<linearGradient id="b${i}" gradientUnits="userSpaceOnUse" x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}"><stop offset="0" stop-color="#f3d48a" stop-opacity="${a}"/><stop offset=".55" stop-color="#f3d48a" stop-opacity="${(a * 0.45).toFixed(3)}"/><stop offset="1" stop-color="#f3d48a" stop-opacity="0"/></linearGradient>`;
    polys += `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="url(#b${i})"/>`;
  });
  return `<svg class="beams" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><defs>${defs}<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter></defs><g filter="url(#soft)">${polys}</g></svg>`;
}

function dust(n) {
  const rnd = seeded(29);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = LIGHT.x + (rnd() - 0.5) * LIGHT.r * 2.4, y = LIGHT.y + (rnd() - 0.5) * LIGHT.r * 2;
    const d = Math.hypot(x - LIGHT.x, y - LIGHT.y), a = Math.max(0, 1 - d / (LIGHT.r * 1.1));
    if (a < 0.05) continue;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.7 + rnd() * 1.7).toFixed(2)}" fill="rgba(243,212,138,${(a * 0.8).toFixed(3)})"/>`;
  }
  return `<svg class="dust" viewBox="0 0 1200 630" width="1200" height="630" aria-hidden="true">${out}</svg>`;
}

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const head = (w, h, css) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:${C.void}}
body{--void:${C.void};color:${C.paper};-webkit-font-smoothing:antialiased}
${css}
</style></head>`;

function cardHtml() {
  const W = 1200, H = 630;
  const [l1, l2, l3] = BIZ.tagline.split(/(?<=\.)\s+/);
  const towns = BIZ.area.join(' · ');
  const mask = `radial-gradient(circle ${LIGHT.r}px at ${LIGHT.x - WORD.x}px ${LIGHT.y - WORD.y}px,#000 0 36%,transparent 76%)`;
  const plats = PLATFORMS.filter((p) => ICONS[p.name.toLowerCase()]).map((p) => `<svg viewBox="0 0 24 24" role="img" aria-label="${p.name}"><path fill="currentColor" d="${ICONS[p.name.toLowerCase()]}"/></svg>`).join('');
  const css = `
.card{position:relative;width:${W}px;height:${H}px;overflow:hidden;isolation:isolate;
  background:
    radial-gradient(circle ${LIGHT.r * 1.15}px at ${LIGHT.x}px ${LIGHT.y}px,rgba(217,178,95,.30),rgba(217,178,95,.11) 42%,transparent 72%),
    radial-gradient(ellipse 900px 520px at 78% 18%,rgba(42,39,48,.55),transparent 70%),
    ${C.void}}
.beams{position:absolute;left:0;top:0;z-index:0;mix-blend-mode:screen}
.sky{position:absolute;left:0;top:0;z-index:1;-webkit-mask-image:linear-gradient(90deg,#000 0 50%,rgba(0,0,0,.35) 80%,rgba(0,0,0,.2));mask-image:linear-gradient(90deg,#000 0 50%,rgba(0,0,0,.35) 80%,rgba(0,0,0,.2))}
.dust{position:absolute;left:0;top:0;z-index:3;pointer-events:none}
.vig{position:absolute;inset:0;z-index:4;pointer-events:none;background:radial-gradient(ellipse 130% 120% at 40% 45%,transparent 55%,rgba(0,0,0,.6))}
.grain{position:absolute;inset:0;z-index:5;opacity:.07;mix-blend-mode:overlay;background-image:${GRAIN}}

.word{position:absolute;left:${WORD.x}px;top:${WORD.y}px;z-index:2;display:grid;font-family:'Big Shoulders Display';font-weight:900;text-transform:uppercase;font-size:300px;line-height:.835;letter-spacing:-.012em}
.word>span{grid-area:1/1;white-space:nowrap}
.word__dark{color:transparent;-webkit-text-stroke:3px rgba(242,234,216,.58)}
.word__lit{color:${C.goldHi};text-shadow:0 0 46px rgba(243,212,138,.4);-webkit-mask-image:${mask};mask-image:${mask}}

.side{position:absolute;z-index:2;left:716px;right:56px;top:44px;bottom:92px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:18px;color:${C.gold}}
.brand svg{width:92px;height:92px;flex:none}
.brand__words{display:grid;line-height:1}
.brand__words b{font-family:'Bodoni Moda';font-style:italic;font-weight:700;font-size:66px;letter-spacing:.01em;color:${C.gold}}
.brand__words small{font-family:'Courier Prime';font-weight:700;font-size:19px;letter-spacing:.58em;color:${C.ash};margin-top:10px;text-transform:uppercase}
.rule{height:2px;margin:34px 0 30px;background:linear-gradient(90deg,${C.gold},rgba(217,178,95,.15))}
.tag{font-family:'Archivo';font-weight:800;font-stretch:100%;font-size:66px;line-height:1;letter-spacing:-.01em;color:${C.paper}}
.tag span{display:block}
.tag .hi{color:${C.goldHi}}
.plats{display:flex;align-items:center;gap:20px;margin-top:34px;color:${C.gold}}
.plats span{font-family:'Courier Prime';font-weight:700;font-size:16px;letter-spacing:.16em;text-transform:uppercase;color:${C.ash};margin-right:4px}
.plats svg{width:30px;height:30px;display:block}
.towns{margin-top:auto;font-family:'Courier Prime';font-weight:700;font-size:18px;letter-spacing:.14em;text-transform:uppercase;color:${C.gold};white-space:nowrap}
.towns::before{content:"";display:block;height:1px;background:rgba(170,163,150,.35);margin-bottom:16px}
`;
  return `${head(W, H, css)}<body><div class="card">
${beams(W, H)}
${skyline(W, H, H + 6)}
<h1 class="word" aria-label="Get seen."><span class="word__dark">Get<br>Seen.</span><span class="word__lit">Get<br>Seen.</span></h1>
<div class="side">
  <div class="brand">${logoMark()}<span class="brand__words"><b>Blackout</b><small>Syndicate</small></span></div>
  <div class="rule"></div>
  <p class="tag"><span>${l1}</span><span>${l2}</span><span class="hi">${l3}</span></p>
  <div class="plats"><span>Ads on</span>${plats}</div>
  <p class="towns">${towns}</p>
</div>
${dust(140)}
<div class="vig"></div><div class="grain"></div>
</div></body></html>`;
}

function iconHtml() {
  const S = 180;
  const css = `
.icon{width:${S}px;height:${S}px;display:grid;place-items:center;color:${C.gold};
  background:radial-gradient(circle 86px at 50% 46%,rgba(217,178,95,.2),rgba(217,178,95,.06) 55%,transparent 80%),${C.void}}
.icon svg{width:124px;height:124px;display:block;transform:translateY(-1px)}
`;
  return `${head(S, S, css)}<body><div class="icon">${logoMark()}</div></body></html>`;
}

async function render(browser, html, w, h, file, { text = true } = {}) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  const missing = await page.evaluate(async (faces) => {
    await Promise.all(faces.map((f) => document.fonts.load(f).catch(() => null)));
    await document.fonts.ready;
    return faces.filter((f) => !document.fonts.check(f));
  }, FACES);
  if (text && missing.length) throw new Error(`fonts did not load (${missing.join(', ')}). Check the network and try again.`);
  await page.screenshot({ path: join(OUT, file), clip: { x: 0, y: 0, width: w, height: h } });
  await page.close();
  console.log(`✓ ${relative(ROOT, join(OUT, file))} (${w}x${h})`);
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  await render(browser, cardHtml(), 1200, 630, 'og.png');
  await render(browser, iconHtml(), 180, 180, 'apple-touch-icon.png', { text: false });
} finally {
  await browser.close();
}
