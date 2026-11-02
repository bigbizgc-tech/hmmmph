import { BIZ, SOCIALS, PLATFORMS, REEL } from '../data/business.mjs';
import { artFor, clipArt, CLIP_ART_CSS } from '../data/clipart.mjs';

// What each reel clip is, in words a shop owner reads at a glance (keyed by its poster).
const WHAT = { beam: 'Our own ad spot', reticle: 'Creator clip', vs: 'Creator clip', strip: 'Our YouTube channel' };
const whatOf = (r, k) => WHAT[k] + (r.who === BIZ.name || r.who === 'YouTube' ? '' : ' · ' + r.who);
// the lowest-priced offer in a list (prices are strings such as "$300")
const cheapest = (list) => list.reduce((a, o) => (parseFloat(o.price.replace(/[^\d.]/g, '')) < parseFloat(a.price.replace(/[^\d.]/g, '')) ? o : a));

const css = CLIP_ART_CSS + `
/* ── Hero: straight over the city (the backdrop every page shares, src/assets/js/sky.js) ── */
.hero{position:relative;isolation:isolate;border-bottom:1px solid var(--smoke);min-height:calc(100vh - 64px);min-height:calc(100svh - 64px);--x:30%;--y:45%}
.hero::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(clamp(240px,34vw,520px) circle at var(--x) var(--y),rgba(217,178,95,.17),rgba(217,178,95,.05) 45%,transparent 72%)}
.hero__in{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,340px);gap:clamp(28px,4vw,64px);align-items:end;padding-block:clamp(28px,4vw,56px) clamp(40px,5vw,72px)}
.hero__main{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(20px,2.6vw,30px);min-width:0}
.hero__title{margin:0;font-family:var(--f-display);font-weight:900;text-transform:uppercase;font-size:clamp(72px,min(11vw,17vh),164px);line-height:.86;letter-spacing:-.006em;display:flex;flex-wrap:wrap;align-items:baseline;gap:0 .2em}
.hero__get{color:var(--paper)}
.hero__seen{position:relative;display:inline-block;color:var(--gold-hi)}
.hero__seen::after{content:"";position:absolute;left:.02em;right:.04em;bottom:-.1em;height:max(3px,.045em);background:var(--gold);opacity:.85}
.hero__bar{position:absolute;inset:.04em -.06em .02em -.05em;background:var(--paper);transform-origin:100% 50%;transform:scaleX(0);pointer-events:none}
.js .hero__bar{animation:heroBar 1.05s var(--snap) .4s both}
@keyframes heroBar{from{transform:scaleX(1)}to{transform:scaleX(0)}}
.hero__pitch{font-family:var(--f-body);font-weight:700;font-size:clamp(21px,2.3vw,30px);line-height:1.2;letter-spacing:-.01em;color:var(--paper);max-width:28ch;text-wrap:balance}
.hero__facts{list-style:none;display:flex;flex-wrap:wrap;align-items:center;gap:10px 0;font-family:var(--f-type);font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash)}
.hero__facts li{display:flex;align-items:center}
.hero__facts li+li::before{content:"";width:5px;height:5px;background:var(--brass);margin:0 14px;transform:rotate(45deg)}
.hero__facts b{color:var(--gold);font-weight:700}
.hero__facts a{color:var(--paper);text-decoration:none;border-bottom:1px solid var(--brass);white-space:nowrap}
.hero__facts a:hover{color:var(--gold-hi)}
.hero__prices{display:flex;flex-wrap:wrap;gap:4px 0;font-size:15.5px;line-height:1.4;color:var(--ash)}
.hero__prices span{white-space:nowrap}
.hero__prices span+span::before{content:"·";margin:0 .55em;color:var(--brass)}
@media (max-width:560px){.hero__prices{gap:4px 18px}.hero__prices span+span::before{content:none}}
.hero__prices b{color:var(--paper);font-weight:600;font-variant-numeric:tabular-nums}
@media (max-width:560px){.hero__facts{flex-direction:column;align-items:flex-start;gap:7px}.hero__facts li::before,.hero__facts li+li::before{content:"";width:5px;height:5px;background:var(--brass);margin:0 12px 0 1px;transform:rotate(45deg)}}
.hero .lede{max-width:52ch}
.visitor{background:color-mix(in srgb,var(--coal) 88%,transparent);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid var(--smoke);padding:22px 20px 20px;display:grid;gap:14px;position:relative;min-width:0}
.visitor::before{content:"";position:absolute;inset:-1px -1px auto auto;width:30px;height:30px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.visitor__head{display:flex;justify-content:space-between;align-items:center;gap:10px}
.visitor .ledger{font-size:13.5px}
.visitor__next{display:grid;gap:4px;font-size:14.5px}
.visitor__how{font-size:14px;color:var(--ash);line-height:1.5}
.no-js [data-hud-open]{display:none}
@media (max-width:900px){
  .hero__in{grid-template-columns:1fr;align-items:start}
  .hero__title{font-size:clamp(72px,min(18vw,24vh),164px)}
  .visitor{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px 32px;align-items:start}
  .visitor__head,.visitor .ledger,.visitor .meter{grid-column:1/-1}
  .visitor .ledger{grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:32px}
}
/* phones: the offer comes second, so the visitor file steps aside (the LV chip in the top bar opens it) */
@media (max-width:600px){.visitor{display:none}}

/* ── Packages and prices, right under the hero (phones and tablets) ── */
.quick{display:none;border-bottom:1px solid var(--smoke);background:var(--glass-coal);padding-block:22px 26px}
@media (max-width:900px){.quick{display:block}}
.quick__head{display:flex;justify-content:space-between;align-items:baseline;gap:8px 16px;flex-wrap:wrap;margin-bottom:10px}
.quick__h{font-family:var(--f-type);font-weight:400;font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
.quick__head .textlink{font-size:15px}
.quick__list{list-style:none;border-top:1px solid var(--smoke)}
.quick__list a{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"name price" "meta price";column-gap:16px;align-items:center;padding:12px 0;border-bottom:1px solid var(--smoke);color:var(--paper);text-decoration:none}
.quick__list b{grid-area:name;font-family:var(--f-display);font-weight:900;font-size:28px;line-height:.95;text-transform:uppercase;transition:color .2s}
.quick__list a:hover b{color:var(--gold-hi)}
.quick__list span:not(.price){grid-area:meta;font-size:14px;color:var(--ash);margin-top:3px}
.quick__list .price{grid-area:price;font-size:32px;text-align:right}
.quick__list .price small{font-size:13px}

/* ── The problem ── */
.truth{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:clamp(32px,6vw,90px);align-items:center}
@media (max-width:900px){.truth{grid-template-columns:1fr}}
.crowd{display:grid;gap:16px}
.crowd__toggle{display:inline-flex;border:1px solid var(--smoke);width:fit-content}
.crowd__toggle button{background:none;border:0;padding:10px 16px;font-family:var(--f-type);font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash);cursor:pointer}
.crowd__toggle button[aria-pressed="true"]{background:var(--gold);color:var(--void)}
.crowd__grid{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:6px;padding:18px;border:1px solid var(--smoke);background:var(--coal)}
.crowd__grid i{aspect-ratio:1;border-radius:50%;background:var(--smoke);transition:background .5s var(--ease),box-shadow .5s,transform .5s var(--ease)}
.crowd__grid i.on{background:var(--gold-hi);box-shadow:0 0 12px rgba(243,212,138,.6);transform:scale(1.15)}
.crowd__cap{font-size:14px;color:var(--ash);min-height:3em}
.crowd__cap b{color:var(--paper);font-weight:600}
@media (max-width:480px){.crowd__grid{grid-template-columns:repeat(12,minmax(0,1fr));gap:5px;padding:12px}}

/* ── Platforms ── */
.plats{list-style:none;border-top:1px solid var(--smoke)}
.plats li{display:flex;justify-content:space-between;align-items:center;gap:16px;padding-block:14px;border-bottom:1px solid var(--smoke);position:relative;overflow:hidden;isolation:isolate}
.plats li::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(217,178,95,.14),transparent 70%);transform:translateX(-101%);transition:transform .5s var(--ease)}
.plats li:hover::before{transform:none}
.plats b{font-family:var(--f-display);font-weight:900;font-size:clamp(40px,6vw,76px);line-height:.9;text-transform:uppercase;transition:color .3s,letter-spacing .5s var(--ease)}
.plats li:hover b{color:var(--gold-hi);letter-spacing:.03em}
.plats span{font-family:var(--f-type);font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);text-align:right}
.plats .fresh span{color:var(--signal);text-shadow:var(--halo)}

/* ── Files ── */
.files-sub{margin-top:clamp(48px,6vw,72px)}
.svc-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--smoke);border:1px solid var(--smoke)}
@media (max-width:980px){.svc-row{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.svc-row{grid-template-columns:1fr}}
.svc{--x:50%;--y:0%;position:relative;display:flex;flex-direction:column;gap:10px;padding:22px 20px;background:var(--coal);color:var(--paper);text-decoration:none;isolation:isolate;min-width:0;transition:background .3s}
.svc::before{content:"";position:absolute;inset:0;z-index:-1;opacity:0;background:radial-gradient(240px circle at var(--x) var(--y),rgba(217,178,95,.16),transparent 70%);transition:opacity .3s}
.svc:hover::before,.svc:focus-visible::before{opacity:1}
.svc b{font-family:var(--f-display);font-weight:900;font-size:clamp(28px,2.6vw,34px);line-height:.92;text-transform:uppercase;transition:color .3s}
.svc:hover b{color:var(--gold-hi)}
.svc span:not(.label):not(.file__open){color:var(--ash);font-size:15px;line-height:1.45}
.svc .file__open{margin-top:auto;padding-top:12px}
.svc:hover .file__open .arw{transform:translateX(5px)}
.svc-row-old a{font-family:var(--f-display);font-weight:800;font-size:24px;text-transform:uppercase;letter-spacing:.03em;padding:10px 18px;border:1px solid var(--brass);color:var(--paper);text-decoration:none;display:inline-flex;gap:10px;align-items:center;transition:background .2s,color .2s}
.svc-row-old a:hover{background:var(--gold);color:var(--void);border-color:var(--gold)}

.match-cta{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:20px 32px;padding:clamp(22px,3vw,32px);border:1px dashed var(--brass);margin-top:clamp(36px,5vw,56px)}
.match-cta h3{font-family:var(--f-display);font-weight:900;font-size:clamp(30px,3.6vw,46px);line-height:.9;text-transform:uppercase}
.match-cta p{color:var(--ash);margin-top:8px;max-width:52ch}

/* ── Promise (paper) ── */
.promise{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(32px,6vw,80px);align-items:end}
@media (max-width:860px){.promise{grid-template-columns:1fr}}
.promise h2{font-family:var(--f-display);font-weight:900;font-size:clamp(64px,10vw,150px);line-height:.82;text-transform:uppercase}
.promise h2 s{text-decoration:none;position:relative}
.promise h2 s::after{content:"";position:absolute;left:-3%;right:-3%;top:44%;height:.17em;background:var(--signal);transform:rotate(-4deg)}
.promise blockquote{margin:0;display:grid;gap:16px}
.promise blockquote p{font-size:clamp(19px,2vw,23px);line-height:1.45;max-width:46ch}
.promise cite{font-family:var(--f-serif);font-style:italic;font-size:30px;color:var(--brass)}
.rules{margin-top:clamp(40px,5vw,64px);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:rgba(23,20,15,.18);border:1px solid rgba(23,20,15,.18)}
.rules div{background:var(--paper);padding:22px 20px;display:grid;gap:8px;align-content:start}
.rules b{font-family:var(--f-display);font-weight:900;font-size:24px;line-height:1;text-transform:uppercase}
.rules p{font-size:15px;color:var(--ink-mute)}
@media (max-width:900px){.rules{grid-template-columns:1fr 1fr}}
@media (max-width:520px){.rules{grid-template-columns:1fr}}

/* ── Reel: each clip shows its own poster (art from src/data/clipart.mjs, sized to the card) ── */
.reel{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.clip{--tone:var(--gold);--art-words:30cqw;--art-top:max(46px,12cqh);--vs-size:15.5cqw;--vs-a:max(52px,14cqh);--vs-b:52cqh;--vs-x:38cqh;--ret-w:min(70cqw,300px);--ret-top:max(44px,11cqh);container-type:size;position:relative;display:grid;align-content:end;aspect-ratio:9/13;max-width:100%;overflow:hidden;text-decoration:none;color:var(--paper);background:var(--void);border:1px solid var(--smoke);isolation:isolate;transition:border-color .3s,transform .45s var(--ease),box-shadow .45s}
.clip--red{--tone:var(--signal)}.clip--smoke{--tone:var(--ash)}
@media (max-width:1100px){.reel{grid-template-columns:repeat(2,minmax(0,1fr))}.clip{aspect-ratio:4/5}}
@media (max-width:520px){.reel{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:82%;overflow-x:auto;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;padding-bottom:6px}.clip{scroll-snap-align:start;aspect-ratio:3/4}}
@media (max-width:360px){.clip{aspect-ratio:2/3}}
.clip::after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(180deg,rgba(7,7,8,.5) 0,transparent 18%,transparent 52%,rgba(7,7,8,.96) 84%),repeating-linear-gradient(0deg,rgba(255,255,255,.022) 0 2px,transparent 2px 4px)}
.clip:hover,.clip:focus-visible{border-color:var(--tone);transform:translateY(-4px);box-shadow:0 30px 60px -34px color-mix(in srgb,var(--tone) 55%,transparent)}
.clip__badge{position:absolute;top:12px;left:12px;font-family:var(--f-type);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;background:var(--void);border:1px solid var(--smoke);padding:4px 8px;white-space:nowrap}
.clip__play{position:absolute;top:42%;left:50%;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;border:1.5px solid var(--paper);display:grid;place-items:center;background:rgba(7,7,8,.45);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);transition:transform .3s var(--ease),background .3s,border-color .3s}
.clip__play::after{content:"";border-left:18px solid var(--paper);border-block:10.5px solid transparent;margin-left:5px}
.clip:hover .clip__play,.clip:focus-visible .clip__play{transform:scale(1.12);background:var(--tone);border-color:var(--tone)}
.clip:hover .clip__play::after,.clip:focus-visible .clip__play::after{border-left-color:var(--void)}
.clip--beam .clip__play{position:static;margin:0 0 6px;justify-self:center}
.clip--reticle .clip__play{top:calc(var(--ret-top) + min(38cqw,150px))}
.clip--strip .clip__play{top:39%}
.clip--vs .clip__play{display:none}
.clip__meta{display:grid;gap:6px;padding:16px 18px 18px}
.clip__meta .label{color:var(--tone)}
.clip--smoke .clip__meta .label{color:var(--ash)}
.clip__meta b{font-family:var(--f-display);font-weight:900;font-size:clamp(22px,9.4cqw,30px);line-height:.95;text-transform:uppercase}
.reel-note{margin-top:18px;font-size:14.5px;color:var(--ash);max-width:70ch}

/* ── Final call: the pitch on the left, the open line on the right ── */
.final{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(32px,5vw,80px);align-items:end}
@media (max-width:860px){.final{grid-template-columns:minmax(0,1fr)}}
.final__main{display:grid;gap:clamp(24px,3vw,36px);justify-items:start;min-width:0}
.final h2{font-family:var(--f-display);font-weight:900;font-size:clamp(70px,11vw,176px);line-height:.86;text-transform:uppercase}
.final p{font-size:var(--t-lede);max-width:52ch}
.final .btn{--bg:var(--void);--fg:var(--gold);--bd:var(--void)}
.final .btn--ghost{--bg:transparent;--fg:var(--void);--bd:var(--void)}
.final .btn--ghost:hover{--bg:var(--void);--fg:var(--gold)}
.final__line{position:relative;display:grid;gap:12px;align-content:start;min-width:0;padding:clamp(26px,3vw,36px) clamp(22px,2.6vw,32px);border:2px solid var(--void)}
.final__line .label{padding-right:110px}
.final__stamp.stamp{position:absolute;top:-58px;right:6px;width:136px;font-size:26px;color:var(--void);border-color:var(--void);box-shadow:inset 0 0 0 5px var(--gold),inset 0 0 0 6.5px var(--void)}
.final__stamp small{font-size:9.5px}
.final__phone{font-family:var(--f-display);font-weight:900;font-size:clamp(40px,4vw,60px);color:var(--void);text-decoration:none;line-height:.95;font-variant-numeric:tabular-nums;white-space:nowrap}
.final__phone:hover{text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:6px}
.final .final__note{font-size:16px;line-height:1.5}
.final__mail{font-family:var(--f-type);font-size:15px;color:var(--void);overflow-wrap:anywhere;text-underline-offset:3px;border-top:1.5px dashed rgba(7,7,8,.35);padding-top:12px}
@media (max-width:860px){.final__line{max-width:460px;width:100%;margin-top:40px}}
@media (max-width:400px){.final__stamp.stamp{width:112px;font-size:21px;top:-48px;right:6px}.final__line .label{padding-right:90px}.final__phone{font-size:clamp(34px,11vw,40px)}}
`;

const js = `
/* who sees it: the feed picks vs you pick (illustration) */
(() => {
  const grid = document.querySelector('[data-crowd]');
  if (!grid) return;
  const cap = document.querySelector('[data-crowd-cap]');
  const n = grid.children.length, cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const modes = {
    feed: { cap: '<b>The feed picks.</b> A few scattered people, chosen by an algorithm that has never heard of your town.', pick: (i, r) => r < .1 },
    paid: { cap: '<b>You pick.</b> Your town, your kind of customer, your kind of viewer. A real paid placement puts you in front of them.', pick: (i, r, x, y) => { const c = cols; const cx = i % c, cy = Math.floor(i / c); return Math.hypot(cx - c * .62, (cy - 2.6) * 1.6) < c * .26; } },
  };
  let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const rs = Array.from({ length: n }, rnd);
  function set(m){
    [...grid.children].forEach((d, i) => d.classList.toggle('on', modes[m].pick(i, rs[i])));
    cap.innerHTML = modes[m].cap;
    document.querySelectorAll('[data-crowd-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.crowdMode === m)));
  }
  document.querySelectorAll('[data-crowd-mode]').forEach((b) => b.addEventListener('click', () => set(b.dataset.crowdMode)));
  set('feed');
  // Auto-flip only while the section is on screen, never with reduced motion, and stop for good once the visitor takes over.
  let auto = 0, touched = false;
  const flip = () => set(document.querySelector('[data-crowd-mode="feed"]').getAttribute('aria-pressed') === 'true' ? 'paid' : 'feed');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  new IntersectionObserver(([e]) => { clearInterval(auto); auto = 0; if (e.isIntersecting && !touched && !reduce) auto = setInterval(flip, 4200); }).observe(grid);
  document.querySelector('.crowd__toggle').addEventListener('click', () => { touched = true; clearInterval(auto); cap.setAttribute('aria-live', 'polite'); }, true);
})();
`;

export default {
  path: 'index.html',
  file: 'File 00',
  order: 0,
  navTitle: 'Home',
  section: 'home',
  title: 'Blackout Syndicate · Get Seen in South Bend',
  description: 'Real ads. Real people. No bots. Paid reach for creators, streamers, solo businesses and local shops in South Bend, Mishawaka and Elkhart, Indiana.',
  teaser: 'Real ads, real people, no bots. Step into the light.',
  next: 'packages.html',
  css, js,
  jsonld: (ctx, config) => ({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: BIZ.name,
    url: config.siteUrl + '/',
    image: config.siteUrl + '/assets/img/og.png',
    telephone: '+1-574-213-9097',
    email: BIZ.email,
    slogan: BIZ.tagline,
    description: 'Paid social media ads, content and AI setup for creators, streamers and local businesses.',
    founder: { '@type': 'Person', name: BIZ.founder },
    parentOrganization: { '@type': 'Organization', name: BIZ.legal },
    address: { '@type': 'PostalAddress', addressLocality: 'South Bend', addressRegion: 'IN', addressCountry: 'US' },
    areaServed: BIZ.area.map((c) => ({ '@type': 'City', name: c + ', IN' })),
    sameAs: SOCIALS.map((s) => s.url),
  }),
  body: (c) => `
<header class="hero" data-spot>
  <div class="wrap hero__in">
    <div class="hero__main">
      <p class="label">File 00 · Paid social ads · ${BIZ.area.join(' · ')}</p>
      <h1 class="hero__title"><span class="hero__get">Get</span> <span class="hero__seen">Seen.<span class="hero__bar" aria-hidden="true"></span></span></h1>
      <p class="hero__pitch">Paid social ads for South Bend shops, creators and streamers.</p>
      <p class="lede"><strong>Real ads. Real people. No bots.</strong> We buy real placements through each platform’s own ad tools, aim them at your people, and show you what every dollar did.</p>
      <ul class="hero__facts">
        <li>No contract on boosts</li>
        <li>Call or text&nbsp;<a href="${BIZ.phoneHref}">${BIZ.phone}</a></li>
      </ul>
      <div class="ctas">
        ${c.btn('See packages and prices ' + c.arrow, 'packages.html', 'lg')}
        ${c.btn('Find my package', 'packages.html#match', 'ghost lg')}
      </div>
      <p class="hero__prices">${c.BOOSTS.map((o) => `<span>${o.name} <b>${o.price}</b></span>`).join('')}<span>Plans from <b>${cheapest(c.PLANS).price}${cheapest(c.PLANS).suffix}</b></span></p>
    </div>
    <aside class="visitor" data-visitor aria-label="Your visitor file">
      <div class="visitor__head"><span class="label">Visitor file</span><span class="badge badge--red" data-v="status">Uncleared</span></div>
      <dl class="ledger">
        <div><dt>Name</dt><dd>Unknown</dd></div>
        <div><dt>Clearance</dt><dd>LV <span data-v="lv">0</span> · <span data-v="name">Outsider</span></dd></div>
        <div><dt>Files opened</dt><dd data-v="opened">0 / ${c.all.filter((p) => p.file && p.xp !== false).length}</dd></div>
        <div><dt>Marks found</dt><dd data-v="marks">0 / 3</dd></div>
      </dl>
      <div class="meter" aria-hidden="true"><i data-v="bar"></i></div>
      <p class="visitor__next"><span class="label label--dim">Next unlock</span><span data-v="next">Playbook Rule 01 (Level 1)</span></p>
      <p class="visitor__how">Every file you open raises your clearance. Read one to the end for more. Level 5 opens the Vault.</p>
      <button class="textlink" type="button" data-hud-open>How clearance works ${c.arrow}</button>
    </aside>
  </div>
</header>

<section class="quick" aria-labelledby="quick-h">
  <div class="wrap">
    <div class="quick__head"><h2 class="quick__h" id="quick-h">Packages and prices</h2><a class="textlink" href="${c.link('packages.html')}">Compare every package ${c.arrow}</a></div>
    <ul class="quick__list">
      ${c.BOOSTS.map((o) => `<li><a href="${c.link(c.offerPath(o))}"><b>${o.name}</b><span>${o.cadence} · ${o.run} · No contract</span><span class="price">${o.price}</span></a></li>`).join('')}
      <li><a href="${c.link('packages.html#plans')}"><b>Monthly plans</b><span>${c.PLANS.map((o) => o.name).join(', ')}</span><span class="price"><small>from </small>${c.PLANS[0].price}<small>${c.PLANS[0].suffix}</small></span></a></li>
    </ul>
  </div>
</section>

<div class="ticker" aria-hidden="true"><div class="ticker__track">${[0, 1].map(() => ['Creators', 'Streamers', 'Solo businesses', 'Local shops', 'Musicians', 'Events', ...BIZ.area].map((t) => `<span>${t}</span>`).join('')).join('')}</div></div>

<section class="band" aria-labelledby="truth-h">
  <div class="wrap truth">
    <div class="rv" style="display:grid;gap:22px">
      <p class="label">The problem</p>
      <h2 class="h2" id="truth-h">You posted it. <span class="whisper">Nobody saw it.</span></h2>
      <p class="lede">The feed decides who sees your post, and it doesn’t owe you anything.</p>
      <p class="muted">Paid placement flips that. You pick the people: your town, your kind of customer, your kind of viewer. A real ad, bought through the platform’s own tools, puts you in front of them. No bots, no fake followers, no engagement pods.</p>
      <a class="textlink" href="${c.link('how-it-works.html')}">How a push works ${c.arrow}</a>
    </div>
    <div class="crowd rv" style="--d:.1s">
      <div class="crowd__toggle" role="group" aria-label="Who sees your post">
        <button type="button" data-crowd-mode="feed" aria-pressed="true">The feed picks</button>
        <button type="button" data-crowd-mode="paid" aria-pressed="false">You pick</button>
      </div>
      <div class="crowd__grid" data-crowd aria-hidden="true">${'<i></i>'.repeat(96)}</div>
      <p class="crowd__cap" data-crowd-cap><b>The feed picks.</b> A few scattered people, chosen by an algorithm that has never heard of your town.</p>
      <p class="label label--dim">Illustration, not data</p>
    </div>
  </div>
</section>

<section class="band band--coal" aria-labelledby="how-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div><p class="label">The play</p><h2 class="h2" id="how-h">Three moves. Then you’re seen.</h2></div>
      <a class="textlink" href="${c.link('how-it-works.html')}">The full play, step by step ${c.arrow}</a>
    </div>
    <ol class="steps rv" style="--n:3">
      <li><h3>Pick your size</h3><p>A one-time boost to test the water, or a monthly plan that keeps the push running all month, every month.</p></li>
      <li><h3>Point it</h3><p>Your post, page, channel, website or booking line. Tell us where you want new people to land.</p></li>
      <li><h3>We push</h3><p>A real paid placement on the platform you choose, aimed at your area or your audience. You get a recap of what ran.</p></li>
    </ol>
  </div>
</section>

<section class="band" aria-labelledby="where-h">
  <div class="wrap split">
    <div class="rv" style="display:grid;gap:20px;align-content:start">
      <p class="label">Where we push</p>
      <h2 class="h2" id="where-h">Every feed that matters.</h2>
      <p class="muted">Five platforms. We put your money where your people actually scroll, and tell you straight when a platform is the wrong fit.</p>
    </div>
    <ul class="plats rv" style="--d:.1s">${PLATFORMS.map((p) => `<li class="${p.fresh ? 'fresh' : ''}"><b>${p.name}</b><span>${p.note}</span></li>`).join('')}</ul>
  </div>
</section>

<section class="band band--coal" id="files" aria-labelledby="files-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div><p class="label">The files</p><h2 class="h2" id="files-h">Start small. Or go all in.</h2><p>Boosts are one-time buys with no contract. Plans keep the push running month after month. Every file opens to the full details.</p></div>
      <a class="textlink" href="${c.link('packages.html')}">Compare every package ${c.arrow}</a>
    </div>
    <div class="drawer-label rv"><h3 class="h3">One-time boosts</h3><span class="label label--dim">No contract</span></div>
    <div class="grid grid--3 rv">${c.BOOSTS.map((o) => c.offerCard(o)).join('')}</div>
    <div class="drawer-label files-sub rv"><h3 class="h3">Monthly plans</h3><span class="label label--dim">Stay or walk, month to month</span></div>
    <div class="grid grid--3 rv">${c.PLANS.map((o) => c.offerCard(o)).join('')}</div>
    <div class="drawer-label files-sub rv"><h3 class="h3">Add-ons</h3><span class="label label--dim">Pair with any boost</span></div>
    <div class="grid grid--2 rv">${c.ADDONS.map((o) => c.offerCard(o)).join('')}</div>
    <div class="drawer-label files-sub rv"><h3 class="h3">Built to order</h3><span class="label label--dim">Quoted per job</span></div>
    <div class="svc-row rv">${c.SERVICES.map((o) => `<a class="svc" href="${c.link(c.offerPath(o))}" data-spot><span class="label label--dim">${o.file} · Quoted</span><b>${o.name}</b><span>${o.tagline}</span><span class="file__open">Open file ${c.arrow}</span></a>`).join('')}</div>
    <div class="match-cta rv">
      <div><h3>Not sure which file is yours?</h3><p>Three questions. We’ll point you at the one that fits, and it’s worth clearance.</p></div>
      ${c.btn('Find my match ' + c.arrow, 'packages.html#match')}
    </div>
  </div>
</section>

<section class="band" aria-label="Classified">
  <div class="wrap wrap--narrow">
    ${c.classified({ id: 'rule-01', level: 1, title: 'Playbook Rule 01: Fix the landing before you buy the traffic', body: `
      <p>Before you put one dollar behind a post, open your own profile like a stranger would.</p>
      <p>In three seconds they should know three things: <strong>what you do, where you are, and what to do next</strong>. Follow, book, buy, show up.</p>
      <p>If any of those is missing, an ad just sends more people to a page that loses them. Fix the bio first. Pin your best post. Put one link in your bio, not five.</p>
      <p>That is the whole reason Profile Fix exists. Do it yourself or let us do it. Just don’t skip it.</p>` })}
  </div>
</section>

<section class="band band--paper" aria-labelledby="promise-h">
  <div class="wrap">
    <div class="promise">
      <h2 id="promise-h">No <s>bots.</s><br>No fluff.</h2>
      <blockquote>
        <p>“I’m a South Bend guy who built things with my hands for ten years. Now I build reach. Every dollar you hand me is accounted for, and if I can’t help you, I’ll tell you straight.”</p>
        <cite>${BIZ.founder} · founder</cite>
      </blockquote>
    </div>
    <div class="rules">
      <div><b>Real ads</b><p>Bought through each platform’s own ad tools. The same ones any business uses.</p></div>
      <div><b>Your OK first</b><p>Nothing runs under your name until you say go.</p></div>
      <div><b>You see the spend</b><p>Every recap shows what was spent and what it reached.</p></div>
      <div><b>No fake promises</b><p>${BIZ.resultsNote}</p></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="reel-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div><p class="label">The reel</p><h2 class="h2" id="reel-h">Our own spots and creator work</h2><p>An ad spot we cut for ourselves, plus gaming highlights and AI tool showdowns from the crew’s channel. Every clip opens on YouTube.</p></div>
      <a class="textlink" href="${c.link('work.html')}">The whole reel ${c.arrow}</a>
    </div>
    <div class="reel rv">${REEL.map((r) => { const k = artFor(r); return `<a class="clip clip--${r.tone} clip--${k}" href="${r.url}" target="_blank" rel="noopener">${clipArt(r, k)}<span class="clip__badge">${r.kind} · ${r.length}</span><span class="clip__play" aria-hidden="true"></span><span class="clip__meta"><span class="label">${whatOf(r, k)}</span><b>${r.title}</b></span><span class="sr">(opens YouTube in a new tab)</span></a>`; }).join('')}</div>
    <p class="reel-note rv">This is the crew’s own work. Client results go up only with the client’s OK.</p>
  </div>
</section>

<section class="band band--gold" aria-labelledby="final-h">
  <div class="wrap final">
    <div class="final__main">
      <p class="label">Make contact</p>
      <h2 id="final-h">Step into<br>the light.</h2>
      <p>Tell us what you’re pushing. We’ll tell you straight which file fits, or whether you need one at all.</p>
      <div class="ctas">${c.btn('Make contact ' + c.arrow, 'contact.html', 'lg')}${c.btn('See the packages', 'packages.html', 'ghost lg')}</div>
    </div>
    <div class="final__line">
      <span class="stamp final__stamp" aria-hidden="true">Open<br>line<small>Call or text</small></span>
      <p class="label">The direct line</p>
      <a class="final__phone" href="${BIZ.phoneHref}">${BIZ.phone}</a>
      <p class="final__note">Call or text. You deal with a person in ${BIZ.city}.</p>
      <a class="final__mail" href="mailto:${BIZ.email}">${BIZ.email}</a>
    </div>
  </div>
</section>`,
};
