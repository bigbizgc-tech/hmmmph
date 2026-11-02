// Shared page chrome + component helpers. Every page renders through renderPage().
import { readFileSync } from 'node:fs';
import { BIZ, SOCIALS, LEVELS, POLICY, PLATFORMS, REEL } from './data/business.mjs';
import { ICONS } from './data/icons.mjs';
import { LOCKUP, CELL, snapbrim } from './data/logo.mjs';
import { OFFERS, BOOSTS, PLANS, ADDONS, SERVICES, offerPath } from './data/offers.mjs';

export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ── Small building blocks ────────────────────────────────────────────────────
// The snap-brim fedora (secondary icon) is also the clearance game's hidden mark.
export const logoMark = snapbrim;

export const icon = (key, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="${ICONS[key]}"/></svg>`;

export const arrow = `<svg class="arw" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>`;

export function makeCtx(page, all, config = {}) {
  const depth = page.path.split('/').length - 1;
  const r = depth ? '../'.repeat(depth) : '';
  const link = (p) => r + p;
  const btn = (text, href, v = '') => `<a class="btn${v ? ' btn--' + v.split(' ').join(' btn--') : ''}" href="${href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('sms:') ? href : link(href)}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;

  // A redacted dossier block that opens at a clearance level.
  const classified = ({ id, level, title, body, bypass = false }) => `
<section class="classified" data-classified="${id}" data-level="${level}"${bypass ? ' data-bypass' : ''} aria-labelledby="cl-${id}">
  <div class="classified__sheet">
    <header class="classified__head">
      <span class="classified__stamp">Classified</span>
      <span class="label">Clearance ${level} · ${LEVELS[level].name}</span>
    </header>
    <h3 class="classified__title" id="cl-${id}">${title}</h3>
    <div class="classified__body">${body}</div>
    <p class="classified__status" data-classified-status aria-live="polite"></p>
  </div>
</section>`;

  // One of three hidden marks in the whole site.
  const mark = (id) => `<button class="hidden-mark" type="button" data-mark="${id}" aria-label="Hidden mark. Claim it for clearance.">${logoMark()}</button>`;

  const offerCard = (o, opts = {}) => `
<a class="file${o.flagship ? ' file--flag' : ''}" href="${link(offerPath(o))}" data-spot>
  <span class="file__tab">${o.file}</span>
  <span class="file__top"><span class="label">${o.cadence}</span><span class="label label--dim">${o.run}</span></span>
  <span class="file__name">${o.name}</span>
  <span class="file__tag">${o.tagline}</span>
  <span class="file__foot">
    <span class="price">${o.price}${o.suffix ? `<small>${o.suffix}</small>` : ''}</span>
    <span class="file__open">Open file ${arrow}</span>
  </span>
  ${o.oneMonth && !opts.compact ? `<span class="file__note">One month only: ${o.oneMonth}, billed once</span>` : ''}
</a>`;

  const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((it, i) => i === items.length - 1 ? `<li aria-current="page">${it.t}</li>` : `<li><a href="${link(it.p)}">${it.t}</a></li>`).join('')}</ol></nav>`;

  const contactLines = () => `
<div class="lines">
  <div class="lines__row"><a class="lines__big" href="${BIZ.phoneHref}" aria-label="Call ${BIZ.phone}">${BIZ.phone}</a><span class="lines__acts"><a class="copy lines__act" href="${BIZ.phoneHref}">Call</a><a class="copy lines__act" href="${BIZ.sms}">Text</a><button class="copy" type="button" data-copy="${BIZ.phone}">Copy</button></span></div>
  <div class="lines__row"><a class="lines__mail" href="mailto:${BIZ.email}">${BIZ.email}</a><button class="copy" type="button" data-copy="${BIZ.email}">Copy</button></div>
  <p class="lines__note">Call or text. ${BIZ.area.join(', ')} and anywhere online.</p>
</div>`;

  const socialRow = (cls = 'socials') => `<ul class="${cls}">${SOCIALS.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}: ${esc(s.handle)}">${icon(s.key)}<span>${s.label}</span></a></li>`).join('')}</ul>`;

  return { POLICY, PLATFORMS, REEL, config, page, all, r, link, btn, classified, mark, offerCard, crumbs, contactLines, socialRow, icon, arrow, logoMark, esc, BIZ, SOCIALS, LEVELS, OFFERS, BOOSTS, PLANS, ADDONS, SERVICES, offerPath };
}

// ── Chrome ───────────────────────────────────────────────────────────────────
const NAV = [
  { key: 'packages', t: 'Packages', p: 'packages.html' },
  { key: 'how', t: 'How it works', p: 'how-it-works.html' },
  { key: 'work', t: 'The Reel', p: 'work.html' },
  { key: 'about', t: 'About', p: 'about.html' },
  { key: 'faq', t: 'FAQ', p: 'faq.html' },
  { key: 'contact', t: 'Contact', p: 'contact.html' },
];

function topbar(ctx) {
  const { page, link } = ctx;
  return `
<header class="topbar" data-topbar>
  <div class="wrap topbar__in">
    <a class="brand" href="${link('index.html')}" aria-label="Blackout Syndicate home">${LOCKUP}</a>
    <a class="brand brand--compact" href="${link('index.html')}" aria-label="Blackout Syndicate home">${CELL}</a>
    <nav class="menu" id="menu" aria-label="Main">
      <ul>${NAV.map((n) => `<li><a href="${link(n.p)}"${page.section === n.key ? ' aria-current="page"' : ''}>${n.t}</a></li>`).join('')}</ul>
      <a class="btn btn--sm menu__cta" href="${link('contact.html')}">Make contact</a>
      <div class="menu__line">
        <p class="label">Or call or text</p>
        <a class="menu__num" href="${BIZ.phoneHref}">${BIZ.phone}</a>
        <div class="menu__acts"><a class="btn btn--sm" href="${BIZ.phoneHref}">Call</a><a class="btn btn--sm btn--ghost" href="${BIZ.sms}">Text</a></div>
      </div>
    </nav>
    <div class="topbar__end">
      <button class="hud" type="button" data-hud aria-controls="clearance" aria-expanded="false">
        <span class="sr">Clearance </span><span class="hud__lv">LV <b data-hud-lv>0</b></span>
        <span class="hud__name" data-hud-name>Outsider</span>
        <span class="hud__bar" aria-hidden="true"><i data-hud-bar></i></span>
      </button>
      <a class="btn btn--sm topbar__cta" href="${link('contact.html')}">Make contact</a>
      <button class="burger" type="button" data-burger aria-controls="menu" aria-expanded="false"><span class="burger__lines" aria-hidden="true"></span><span class="sr">Menu</span></button>
    </div>
  </div>
</header>`;
}

function nextFile(ctx) {
  const { page, all, link } = ctx;
  if (!page.next) return '';
  const n = all.find((p) => p.path === page.next);
  if (!n) throw new Error(`next file "${page.next}" not found (from ${page.path})`);
  const words = (n.teaser || n.description).split(' ');
  const cut = Math.max(2, Math.ceil(words.length * 0.45));
  const shown = words.slice(0, cut).join(' ');
  const hidden = words.slice(cut).map((w) => `<span class="rx-word">${w}</span>`).join(' ');
  // Wide screens fill the card's right side with the next file's number, outlined and lit by the
  // searchlight. Files without a number (the Index, the Vault) get redaction bars instead.
  const no = String(n.file || '').replace(/\D/g, '');
  const bars = '<i></i><i></i><i></i><i></i>';
  const art = no ? `<span class="nextfile__dark">${no}</span><span class="nextfile__lit">${no}</span>` : `<span class="nextfile__dark">${bars}</span><span class="nextfile__lit">${bars}</span>`;
  return `
<section class="nextfile band band--tight" aria-label="Next file">
  <div class="wrap">
    <div data-jump hidden></div>
    <a class="nextfile__card nextfile__card--art" href="${link(n.path)}" data-spot>
      <span class="label">Next file${n.file ? ' · ' + n.file : ''}</span>
      <span class="nextfile__title">${n.navTitle || n.h1 || n.title}</span>
      <span class="nextfile__teaser">${shown} ${hidden}</span>
      <span class="nextfile__go">Open it ${arrow}</span>
      <span class="nextfile__no${no ? '' : ' nextfile__no--bars'}" data-spot-layer aria-hidden="true">${art}</span>
    </a>
  </div>
</section>`;
}

function footer(ctx) {
  const { link, BIZ, offerPath } = ctx;
  // Same rule as the build's clearance registry, so the no-JS fallback shows the real total.
  const totalFiles = ctx.all.filter((p) => p.file && p.xp !== false).length;
  const col = (title, items) => `<div class="foot__col"><p class="label">${title}</p><ul>${items.map((i) => `<li><a href="${link(i.p)}">${i.t}</a></li>`).join('')}</ul></div>`;
  return `
<footer class="foot">
  <div class="wrap">
    <div class="foot__top">
      <div class="foot__brand">
        <a class="brand brand--lg" href="${link('index.html')}" aria-label="Blackout Syndicate home">${LOCKUP}</a>
        <p class="foot__line">${BIZ.tagline}</p>
        ${ctx.contactLines()}
      </div>
      <div class="foot__cols">
        ${col('One-time boosts', [...BOOSTS, ...ADDONS].map((o) => ({ t: `${o.name} <span class="foot__price">${o.price}</span>`, p: offerPath(o) })))}
        ${col('Monthly plans', PLANS.map((o) => ({ t: `${o.name} <span class="foot__price">${o.price}${o.suffix}</span>`, p: offerPath(o) })))}
        ${col('Built to order', SERVICES.map((o) => ({ t: o.name, p: offerPath(o) })))}
        ${col('The Syndicate', [{ t: 'How it works', p: 'how-it-works.html' }, { t: 'The Reel', p: 'work.html' }, { t: 'About', p: 'about.html' }, { t: 'FAQ', p: 'faq.html' }, { t: 'Contact', p: 'contact.html' }, { t: 'The Vault', p: 'vault.html' }])}
      </div>
    </div>
    <div class="foot__social">
      <p class="label">Follow the Syndicate</p>
      ${ctx.socialRow('socials socials--foot')}
    </div>
    <div class="foot__base">
      <p>© <span data-year>2026</span> ${BIZ.name} · a ${BIZ.legal} company · ${BIZ.city}, ${BIZ.regionLong}</p>
      <p class="foot__legal"><a href="${link('privacy.html')}">Privacy</a><a href="${link('terms.html')}">Terms &amp; refunds</a><button class="foot__files" type="button" data-hud-open>Files opened <b data-files-count>0 / ${totalFiles}</b></button></p>
    </div>
  </div>
</footer>`;
}

function drawer() {
  return `
<div class="scrim" data-scrim hidden></div>
<aside class="drawer" id="clearance" data-drawer hidden role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabindex="-1">
  <div class="drawer__in">
    <div class="drawer__head">
      <p class="label">Visitor file</p>
      <button class="drawer__x" type="button" data-drawer-close aria-label="Close">×</button>
    </div>
    <h2 class="drawer__title" id="drawer-title">Your clearance</h2>
    <div data-drawer-body></div>
  </div>
</aside>
<div class="toasts" data-toasts role="status" aria-live="polite"></div>
<div class="veil" data-veil hidden></div>`;
}

// ── Pixel (X) ────────────────────────────────────────────────────────────────
function pixel(config) {
  if (!config.xPixelId) return '';
  return `<script>
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','${esc(config.xPixelId)}');
</script>`;
}

// Only what the site uses: Archivo upright 400-700 (no width axis, no italics), Big Shoulders 800 and 900,
// Bodoni Moda italic 500 and 700 at one optical size (the accent words), Courier Prime 400 and 700.
// About 110 KB of Latin font files instead of 202 KB. site.css has metric-matched fallbacks for the swap.
const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400..700&family=Big+Shoulders+Display:wght@800;900&family=Bodoni+Moda:ital,opsz,wght@1,48,500;1,48,700&family=Courier+Prime:wght@400;700&display=swap';

// ── The city behind every page ───────────────────────────────────────────────
// One fixed canvas, drawn by src/assets/js/sky.js (the build copies it with the other assets).
// Without JS, the canvas's CSS gradient is the backdrop; in print it is hidden.
const readAsset = (p) => { try { return readFileSync(new URL('./assets/' + p, import.meta.url), 'utf8'); } catch (e) { return ''; } };
const SKY_JS = readAsset('js/sky.js');
// Short content hash for asset URLs, so a returning visitor never runs new pages on a cached old
// stylesheet or script (site.css and sky.js change together with the page markup).
const ver = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const V = { css: ver(readAsset('css/site.css')), site: ver(readAsset('js/site.js')), sky: ver(SKY_JS) };

// ── Full document ────────────────────────────────────────────────────────────
export function renderPage(page, all, config, assets) {
  const ctx = makeCtx(page, all, config);
  const { r } = ctx;
  const body = page.body(ctx);
  const canonical = config.siteUrl + '/' + (page.path === 'index.html' ? '' : page.path);
  // The artifact preview's entry page is named like a product in the gallery.
  const title = page.path === 'index.html' ? (assets.bare ? 'Blackout Syndicate 2.0' : page.title) : `${page.title} · Blackout Syndicate`;
  const ld = page.jsonld ? `<script type="application/ld+json">${JSON.stringify(page.jsonld(ctx, config))}</script>` : '';
  const css = assets.inline ? `<style>${assets.css}</style>` : `<link rel="stylesheet" href="${r}assets/css/site.css?v=${V.css}">`;
  const cfg = assets.inline ? `<script>${assets.configJs}</script>` : `<script src="${r}assets/js/config.js"></script>`;
  const js = assets.inline ? `<script>${assets.siteJs}</script>` : `<script src="${r}assets/js/site.js?v=${V.site}"></script>`;
  const sky = assets.inline ? `<script>${SKY_JS}</script>` : `<script src="${r}assets/js/sky.js?v=${V.sky}"></script>`;

  const head = `<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#070708">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Blackout Syndicate">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${config.siteUrl}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Blackout Syndicate: Get seen. Real ads. Real people. No bots. South Bend, Mishawaka, Elkhart.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@BzTheG">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${config.siteUrl}/assets/img/og.png">
<meta name="twitter:image:alt" content="Blackout Syndicate: Get seen. Real ads. Real people. No bots. South Bend, Mishawaka, Elkhart.">
${page.noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="icon" href="${r}assets/img/favicon.ico" sizes="any">
<link rel="icon" href="${r}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${r}assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
${css}
<script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js')</script>
${cfg}
${pixel(config)}
${page.css ? `<style>${page.css}</style>` : ''}
${ld}`;

  const bodyAttrs = `data-path="${page.path}" data-root="${r}"${page.kind ? ` data-kind="${page.kind}"` : ''}${page.offer ? ` data-offer="${page.offer}"` : ''}`;
  const inner = `<a class="skip" href="#main">Skip to content</a>
<canvas class="sky" data-sky aria-hidden="true"></canvas>
<div class="grain" aria-hidden="true"></div>
${topbar(ctx)}
<main id="main" tabindex="-1">
${body}
<div class="read-sentinel" data-read aria-hidden="true"></div>
${nextFile(ctx)}
</main>
${footer(ctx)}
${drawer()}
${js}
${page.js ? `<script>${page.js}</script>` : ''}
${sky}`;

  if (assets.bare) {
    // Artifact entry page: the host supplies doctype/html/head/body.
    return `${head}\n<div class="page" ${bodyAttrs} data-bare>\n${inner}\n</div>\n`;
  }
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${page.base && !assets.inline ? `<base href="${esc(page.base)}">` : ''}
${head}
</head>
<body ${bodyAttrs}>
${inner}
</body>
</html>
`;
}
