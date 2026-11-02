// File 06A: The Reel (it follows File 06, Total Blackout, on the reading path). The crew's own clips as poster cards (they open on YouTube), what the crew makes,
// an honest line on client results, the Graveshift crew, and where to follow.
import { BIZ, SOCIALS, REEL } from '../data/business.mjs';
import { BOOSTS, bySlug, offerPath } from '../data/offers.mjs';
import { VS, artFor, clipArt, CLIP_ART_CSS } from '../data/clipart.mjs';

const YT = SOCIALS.find((s) => s.key === 'youtube');
const DISCORD = SOCIALS.find((s) => s.key === 'discord');
const pad = (n) => String(n).padStart(2, '0');
const EXT = '<svg class="rl-ext" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>';

const card = (r, i) => {
  const k = artFor(r);
  return `<li class="${r.kind === 'Short' ? 'is-tall' : 'is-wide'}">
  <a class="rl-card rl-card--${r.tone} rl-card--${k}" href="${r.url}" target="_blank" rel="noopener">
    ${clipArt(r, k)}
    <span class="rl-card__top"><span class="rl-card__badge">${r.kind} · ${r.length}</span><span class="rl-card__no" aria-hidden="true">Reel ${pad(i + 1)}</span></span>
    <span class="rl-card__play" aria-hidden="true"></span>
    <span class="rl-card__meta"><span class="label">${r.who}</span><h3 class="rl-card__title">${r.title}</h3><span class="rl-card__go">${r.kind === 'Channel' ? 'Open the channel' : 'Watch on YouTube'} ${EXT}</span></span>
    <span class="sr">(opens YouTube in a new tab)</span>
  </a>
</li>`;
};

// What the crew makes. Each genre points at a real clip on the reel when there is one.
const SPOT = REEL.find((r) => r.who === BIZ.name);
const GAME = REEL.find((r) => /graveshift/i.test(r.who));
const SHOW = REEL.find((r) => VS.test(r.title));
const ICONS = {
  spot: '<path d="M4 9.5v5h3l7 4.5V5L7 9.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M17.5 8.5c1.2 1 1.8 2.2 1.8 3.5s-.6 2.5-1.8 3.5M20 6c2 1.7 3 3.7 3 6s-1 4.3-3 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  short: '<rect x="6.5" y="2.5" width="11" height="19" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 9.5v5l4-2.5Z" fill="currentColor"/>',
  game: '<path d="M7 8h10a5 5 0 0 1 4.6 7l-.6 1.6a2.4 2.4 0 0 1-4 .6L15 15H9l-2 2.2a2.4 2.4 0 0 1-4-.6L2.4 15A5 5 0 0 1 7 8Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 10.5v3M5.5 12h3" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="11" r="1" fill="currentColor"/><circle cx="18" cy="13" r="1" fill="currentColor"/>',
  ai: '<rect x="2.5" y="6.5" width="7" height="11" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="14.5" y="6.5" width="7" height="11" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M13 3.5 11 12h2.2l-2 8.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
};
const MAKES = [
  { i: 'spot', t: 'Ad spots', d: 'Short promos that say who you are, where you are and what to do next.', clip: SPOT, go: SPOT && `Watch ${SPOT.title.split('.')[0]}` },
  { i: 'short', t: 'Shorts', d: 'Vertical clips cut short and sharp for the feeds people actually scroll.', clip: { url: YT.url }, go: 'Browse the channel' },
  { i: 'game', t: 'Gaming highlights', d: 'The Graveshift crew’s best moments, cut down to the good part.', clip: GAME, go: GAME && `Watch ${GAME.title.split(':')[0]}` },
  { i: 'ai', t: 'AI tool showdowns', d: 'Two AI tools, one job, side by side, so you can see which one handles it.', clip: SHOW, go: SHOW && `Watch ${SHOW.title}` },
];

const CS = bySlug['creator-systems'];
const andList = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
// What every recap shows (the same numbers the offers list). Follows come with the bigger boosts and the plans.
const RECAP = [
  ['Spend', 'What the platform charged'],
  ['Reach', 'People who saw it'],
  ['Clicks or views', 'Whichever matches your goal'],
  ['Follows', andList([...BOOSTS.slice(1).map((o) => o.name), 'plans'])],
];
const BOOST = bySlug.boost;

const css = CLIP_ART_CSS + `
/* ── Opening: the countdown leader ── */
.rl-head__in{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(28px,5vw,72px);align-items:center}
@media (max-width:900px){.rl-head__in{grid-template-columns:minmax(0,1fr)}}
.rl-head__main{display:grid;gap:22px;min-width:0}
.rl-head .btn .ico{width:22px;height:22px}
.rl-leader{position:relative;width:100%;max-width:520px;justify-self:end;padding:0 30px;background:var(--void);border:1px solid var(--smoke);box-shadow:0 40px 80px -40px rgba(0,0,0,.95)}
@media (max-width:900px){.rl-leader{justify-self:start;max-width:460px}}
.rl-leader::before,.rl-leader::after{content:"";position:absolute;top:0;bottom:0;width:30px;background:repeating-linear-gradient(180deg,transparent 0 10px,var(--smoke) 10px 24px,transparent 24px 34px);background-size:12px 34px;background-repeat:repeat-y;background-position:center}
.rl-leader::before{left:0;border-right:1px solid var(--smoke)}
.rl-leader::after{right:0;border-left:1px solid var(--smoke)}
.rl-leader__frame{--a:0deg;position:relative;aspect-ratio:4/3;overflow:hidden;background:radial-gradient(70% 80% at 50% 50%,#1d1a15,var(--coal) 60%,#050506);display:grid;place-items:center;isolation:isolate;animation:rlFlicker 3.2s steps(1) infinite}
.rl-leader__sweep{position:absolute;left:50%;top:50%;width:150%;aspect-ratio:1;transform:translate(-50%,-50%);background:conic-gradient(rgba(217,178,95,.26) 0 var(--a),transparent var(--a));z-index:-1}
.rl-leader__ring{position:absolute;left:50%;top:50%;width:66%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;border:2px solid rgba(242,234,216,.55)}
.rl-leader__ring--2{width:54%;border-color:rgba(242,234,216,.3)}
.rl-leader__cross{position:absolute;inset:0;background:linear-gradient(rgba(242,234,216,.28),rgba(242,234,216,.28)) 50% 0/1.5px 100% no-repeat,linear-gradient(rgba(242,234,216,.28),rgba(242,234,216,.28)) 0 50%/100% 1.5px no-repeat}
.rl-leader__num{position:relative;font-family:var(--f-display);font-weight:900;font-size:clamp(110px,14vw,190px);line-height:.8;color:var(--paper);text-shadow:0 0 30px rgba(0,0,0,.6);font-variant-numeric:tabular-nums}
.rl-leader.is-roll .rl-leader__num{font-size:clamp(60px,7vw,96px);color:var(--gold-hi);letter-spacing:.04em;text-transform:uppercase;text-shadow:0 0 40px rgba(243,212,138,.6)}
.rl-leader.is-roll .rl-leader__frame{background:radial-gradient(70% 80% at 50% 50%,#3a2d12,var(--coal) 62%,#050506)}
.rl-leader__scratch{position:absolute;top:0;bottom:0;width:1px;background:rgba(242,234,216,.18);left:23%;animation:rlScratch 1.7s steps(1) infinite}
.rl-leader__scratch--2{left:71%;animation-duration:2.3s;animation-delay:-.8s}
.rl-leader__cap{display:flex;justify-content:space-between;gap:12px;padding:10px 2px;font-family:var(--f-type);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ash)}
.rl-leader__cap b{color:var(--gold);font-weight:400}
.rl-leader__cap span{white-space:nowrap}
@media (max-width:480px){.rl-leader__cap span:nth-child(2){display:none}}
@keyframes rlFlicker{0%,100%{filter:brightness(1)}31%{filter:brightness(1.12)}33%{filter:brightness(.92)}64%{filter:brightness(1.06)}66%{filter:brightness(1)}}
@keyframes rlScratch{0%{transform:translateX(0);opacity:.8}25%{transform:translateX(14px);opacity:0}50%{transform:translateX(-9px);opacity:.5}75%{transform:translateX(30px);opacity:0}}

/* ── The clips ── */
.rl-clips{position:relative}
.rl-clips__head .ctas{gap:16px}
.rl-dim{display:none}
.js .rl-dim{display:inline-flex}
.rl-dim[aria-pressed="true"]{--bg:var(--gold);--fg:var(--void)}
.rl-grid{list-style:none;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.3fr);grid-auto-rows:minmax(330px,auto);grid-auto-flow:dense;gap:16px}
.rl-grid>li{display:grid;min-width:0}
.rl-grid>li.is-tall{grid-row:span 2}
@media (max-width:1000px){.rl-grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:minmax(300px,auto)}}
@media (max-width:600px){.rl-grid{grid-template-columns:minmax(0,1fr);grid-auto-rows:auto}.rl-grid>li.is-tall{grid-row:auto}.is-tall .rl-card{aspect-ratio:4/5}.is-wide .rl-card{aspect-ratio:1/1}}
.rl-card{--tone:var(--gold);position:relative;display:grid;grid-template-rows:auto 1fr auto;overflow:hidden;isolation:isolate;text-decoration:none;color:var(--paper);background:var(--void);border:1px solid var(--smoke);transition:border-color .3s,transform .45s var(--ease),box-shadow .45s}
.rl-card--red{--tone:var(--signal)}.rl-card--smoke{--tone:var(--ash)}
.rl-card:hover,.rl-card:focus-visible{border-color:var(--tone);transform:translateY(-4px);box-shadow:0 30px 60px -34px color-mix(in srgb,var(--tone) 55%,transparent)}
.rl-card::after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(180deg,rgba(7,7,8,.55) 0,transparent 22%,transparent 46%,rgba(7,7,8,.96) 86%),repeating-linear-gradient(0deg,rgba(255,255,255,.022) 0 2px,transparent 2px 4px)}
.rl-card__top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:14px}
.rl-card__badge,.rl-card__no{font-family:var(--f-type);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;background:var(--void);border:1px solid var(--smoke);padding:4px 8px;white-space:nowrap}
.rl-card__no{color:var(--tone);border-color:color-mix(in srgb,var(--tone) 45%,var(--smoke))}
.rl-card__play{place-self:center;width:84px;height:84px;border-radius:50%;border:1.5px solid var(--paper);display:grid;place-items:center;background:rgba(7,7,8,.45);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);transition:transform .35s var(--ease),background .3s,border-color .3s}
.rl-card__play::after{content:"";border-left:22px solid var(--paper);border-block:13px solid transparent;margin-left:6px}
.rl-card:hover .rl-card__play,.rl-card:focus-visible .rl-card__play{transform:scale(1.12);background:var(--tone);border-color:var(--tone)}
.rl-card:hover .rl-card__play::after,.rl-card:focus-visible .rl-card__play::after{border-left-color:var(--void)}
.rl-card__meta{grid-row:3;display:grid;gap:8px;padding:20px 20px 22px}
.rl-card .label{color:var(--tone)}
.rl-card--smoke .label{color:var(--ash)}
.rl-card__title{font-family:var(--f-display);font-weight:900;font-size:clamp(30px,2.9vw,44px);line-height:.9;text-transform:uppercase;letter-spacing:.005em;overflow-wrap:anywhere}
.rl-card__go{display:inline-flex;align-items:center;gap:8px;font-family:var(--f-type);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--paper);opacity:.8}
.rl-ext{width:15px;height:15px;transition:transform .3s var(--ease)}
.rl-card:hover .rl-ext{transform:translate(3px,-3px)}
.rl-card:hover .rl-card__go{opacity:1}

/* the posters themselves live in src/data/clipart.mjs (shared with the home reel) */
.is-tall .rl-card--beam .rl-card__play{align-self:end;margin-bottom:6%}
.rl-card--vs .rl-card__play{display:none}
@media (max-width:600px){.rl-grid{--ret-w:min(78%,340px)}}

/* theater mode: the house lights go down on everything but the reel */
.rl-house{position:fixed;inset:0;z-index:55;background:rgba(3,3,4,.9);opacity:0;visibility:hidden;transition:opacity .6s var(--ease),visibility 0s .6s}
.rl-dark .rl-house{opacity:1;visibility:visible;transition:opacity .6s var(--ease)}
.rl-dark .rl-clips{z-index:56}
.rl-dark .rl-card{border-color:color-mix(in srgb,var(--tone) 45%,var(--smoke));box-shadow:0 0 50px -20px color-mix(in srgb,var(--tone) 60%,transparent)}

/* ── What the crew makes ── */
.rl-make{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--smoke);border:1px solid var(--smoke)}
.rl-make li{background:var(--coal);padding:28px 24px 26px;display:grid;grid-template-rows:auto auto 1fr auto;gap:14px;min-width:0;transition:background .3s}
.rl-make li:hover{background:var(--vault)}
.rl-make svg{width:34px;height:34px;color:var(--gold)}
.rl-make h3{font-family:var(--f-display);font-weight:900;font-size:clamp(30px,2.6vw,38px);line-height:.92;text-transform:uppercase}
.rl-make p{color:var(--ash);font-size:15.5px}
.rl-make .textlink{font-size:15px}
@media (max-width:1000px){.rl-make{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.rl-make{grid-template-columns:minmax(0,1fr)}}
.rl-hire{margin-top:clamp(28px,4vw,44px);display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr) minmax(0,1.1fr);gap:clamp(18px,3vw,36px);align-items:start;padding:clamp(22px,3vw,32px);border:1px dashed var(--brass)}
.rl-hire h3{font-family:var(--f-display);font-weight:900;font-size:clamp(30px,3vw,42px);line-height:.9;text-transform:uppercase}
.rl-hire__opt{display:grid;gap:8px}
.rl-hire__opt p{color:var(--ash);font-size:15.5px}
.rl-hire__opt b{font-family:var(--f-display);font-weight:800;font-size:24px;line-height:1;text-transform:uppercase;letter-spacing:.02em}
.rl-hire__opt .price{font-size:24px;margin-left:8px}
@media (max-width:900px){.rl-hire{grid-template-columns:minmax(0,1fr)}.rl-hire__opt{border-top:1px dashed var(--smoke);padding-top:18px}}

/* ── On the record (paper) ── */
.rl-record{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(36px,6vw,88px);align-items:center}
@media (max-width:900px){.rl-record{grid-template-columns:minmax(0,1fr)}}
.rl-record__text{display:grid;gap:20px;min-width:0}
.rl-record__text p:not(.label):not(.lede){color:var(--ink-mute)}
.rl-board{position:relative;aspect-ratio:5/4;border:2px dashed rgba(23,20,15,.32);display:grid;place-items:center;text-align:center;padding:clamp(24px,4vw,44px);background:repeating-linear-gradient(transparent 0 31px,rgba(23,20,15,.05) 31px 32px),var(--paper-2)}
.rl-board__pin{position:absolute;width:14px;height:14px;border-radius:50%;background:var(--signal);box-shadow:0 3px 0 rgba(23,20,15,.35)}
.rl-board__pin:nth-child(1){top:16px;left:16px}.rl-board__pin:nth-child(2){top:16px;right:16px}.rl-board__pin:nth-child(3){bottom:16px;left:16px}.rl-board__pin:nth-child(4){bottom:16px;right:16px}
.rl-board__in{display:grid;gap:16px;justify-items:center;width:100%;max-width:420px}
.rl-board__in .label{color:var(--brass)}
.rl-board__in b{font-family:var(--f-display);font-weight:900;font-size:clamp(40px,4.6vw,64px);line-height:.86;text-transform:uppercase;color:var(--ink)}
.rl-board__in .ledger{width:100%;text-align:left;border-top:1.5px solid var(--ink)}
.rl-board__foot{display:flex;align-items:center;justify-content:space-between;gap:18px;width:100%;text-align:left;padding-top:4px}
.rl-board__foot>span:first-child{font-family:var(--f-type);font-size:13.5px;letter-spacing:.06em;color:var(--ink-mute);max-width:26ch}
.rl-board .stamp{flex:none;width:112px;font-size:18px;box-shadow:inset 0 0 0 5px var(--paper-2),inset 0 0 0 6.5px var(--signal)}
@media (max-width:900px){.rl-board{aspect-ratio:auto}}
@media (max-width:600px){.rl-board{padding:52px 22px 44px}.rl-board .stamp{width:96px;font-size:16px}}

/* ── Follow ── */
.rl-follow{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}
@media (max-width:900px){.rl-follow{grid-template-columns:minmax(0,1fr)}}
.rl-panel{position:relative;display:grid;gap:18px;align-content:start;padding:clamp(24px,3.4vw,40px);border:1px solid var(--smoke);background:var(--coal);min-width:0;overflow:hidden;isolation:isolate}
.rl-panel h3{font-family:var(--f-display);font-weight:900;font-size:clamp(40px,4.6vw,64px);line-height:.86;text-transform:uppercase}
.rl-panel p{color:var(--ash);max-width:46ch}
.rl-panel .btn .ico{width:22px;height:22px}
.rl-panel--gs{border-color:rgba(229,72,77,.5);background:radial-gradient(90% 80% at 100% 0,rgba(229,72,77,.16),transparent 62%),var(--coal)}
.rl-panel--gs::after{content:"";position:absolute;right:-60px;bottom:-60px;width:220px;height:220px;border-radius:50%;border:1.5px dashed rgba(229,72,77,.35);z-index:-1}
.rl-panel--gs h3 i{font-style:normal;color:transparent;-webkit-text-stroke:1.5px var(--signal)}
.rl-panel .socials{margin-top:4px}

/* ── Close ── */
.rl-close{display:grid;gap:clamp(22px,3vw,34px);justify-items:start}
.rl-close h2{font-family:var(--f-display);font-weight:900;font-size:clamp(50px,11vw,170px);line-height:.84;text-transform:uppercase}
.rl-close p{font-size:var(--t-lede);max-width:52ch}
.rl-close .btn{--bg:var(--void);--fg:var(--gold);--bd:var(--void)}
.rl-close .btn--ghost{--bg:transparent;--fg:var(--void);--bd:var(--void)}
.rl-close .btn--ghost:hover{--bg:var(--void);--fg:var(--gold)}
.rl-close__phone{font-family:var(--f-display);font-weight:900;font-size:clamp(34px,4vw,48px);color:var(--void);text-decoration:none;line-height:1}
`;

const js = `
/* Countdown leader: 3, 2, 1, roll. Loops while it's on screen. */
(() => {
  const L = document.querySelector('[data-leader]');
  if (!L) return;
  const num = L.querySelector('[data-leader-num]'), frame = L.querySelector('.rl-leader__frame');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { frame.style.setProperty('--a', '250deg'); return; }
  let visible = true, running = false, shown = '';
  const t0 = performance.now();
  const show = (s) => { if (s !== shown) { num.textContent = s; shown = s; } };
  const tick = (now) => {
    if (!visible) { running = false; return; }
    const c = ((now - t0) / 1000) % 4.8;
    if (c < 3) { show(String(3 - Math.floor(c))); frame.style.setProperty('--a', ((c % 1) * 360).toFixed(1) + 'deg'); L.classList.remove('is-roll'); }
    else { show('Roll'); frame.style.setProperty('--a', '360deg'); L.classList.add('is-roll'); }
    requestAnimationFrame(tick);
  };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !running) { running = true; requestAnimationFrame(tick); } }).observe(L);
})();

/* House lights: dim everything but the reel. */
(() => {
  const btn = document.querySelector('[data-dim]');
  if (!btn) return;
  const house = document.querySelector('[data-house]'), txt = btn.querySelector('[data-dim-t]'), root = document.documentElement;
  let on = false;
  const set = (v) => {
    on = v; root.classList.toggle('rl-dark', v);
    btn.setAttribute('aria-pressed', String(v));
    txt.textContent = v ? 'Bring the lights up' : 'Dim the house lights';
  };
  btn.addEventListener('click', () => set(!on));
  house && house.addEventListener('click', () => set(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && on) set(false); });
})();
`;

export default {
  path: 'work.html',
  file: 'File 06A',
  order: 17,
  navTitle: 'The Reel',
  section: 'work',
  title: 'The Reel',
  description: 'Watch the Reel: ad spots, shorts, Graveshift Gaming highlights and AI tool showdowns cut by the Blackout Syndicate crew in South Bend. Opens on YouTube.',
  teaser: 'Ad spots, shorts and showdowns cut by the crew. Press play.',
  next: 'about.html',
  css, js,
  jsonld: (ctx, config) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The Reel · Blackout Syndicate',
    url: config.siteUrl + '/work.html',
    hasPart: REEL.map((r) => ({ '@type': r.kind === 'Channel' ? 'WebPage' : 'CreativeWork', name: r.title, url: r.url, creator: { '@type': 'Organization', name: r.who === 'YouTube' ? BIZ.name : r.who } })),
  }),
  body: (c) => `
<header class="pagehead rl-head">
  <div class="wrap rl-head__in">
    <div class="rl-head__main">
      ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'The Reel' }])}
      <p class="label">${c.page.file} · The Reel · Cut by the crew</p>
      <h1 class="h1">The Reel. <span class="whisper">Press play.</span></h1>
      <p class="lede"><strong>Ad spots, shorts, gaming highlights and AI tool showdowns.</strong> Everything here was made by the crew. Every clip opens on YouTube.</p>
      <div class="ctas">
        ${c.btn('Roll the reel ' + c.arrow, '#clips', 'lg')}
        ${c.btn(c.icon('youtube') + ' YouTube channel', YT.url, 'ghost lg')}
      </div>
    </div>
    <div class="rl-leader" data-leader aria-hidden="true">
      <div class="rl-leader__frame">
        <span class="rl-leader__sweep"></span>
        <span class="rl-leader__ring"></span><span class="rl-leader__ring rl-leader__ring--2"></span>
        <span class="rl-leader__cross"></span>
        <span class="rl-leader__scratch"></span><span class="rl-leader__scratch rl-leader__scratch--2"></span>
        <span class="rl-leader__num" data-leader-num>3</span>
      </div>
      <p class="rl-leader__cap"><span>Reel <b>16</b></span><span>${BIZ.name}</span><span>${pad(REEL.length)} clips</span></p>
    </div>
  </div>
</header>

<div class="rl-house" data-house aria-hidden="true"></div>

<section class="band rl-clips" id="clips" aria-labelledby="clips-h">
  <div class="wrap">
    <div class="band__head band__head--row rl-clips__head rv">
      <div><p class="label">Now showing</p><h2 class="h2" id="clips-h">The clips. Lights down.</h2><p>The crew’s own work, cut for the feeds. Each card opens the clip on YouTube in a new tab.</p></div>
      <div class="ctas"><button class="btn btn--ghost btn--sm rl-dim" type="button" data-dim aria-pressed="false"><span data-dim-t>Dim the house lights</span></button></div>
    </div>
    <ul class="rl-grid rv">${REEL.map(card).join('')}</ul>
  </div>
</section>

<section class="band band--coal" aria-labelledby="make-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">What the crew makes</p>
      <h2 class="h2" id="make-h">Four kinds of cut.</h2>
      <p>Everything on the reel falls into one of these. Each one has a clip you can watch right now.</p>
    </div>
    <ul class="rl-make rv">
      ${MAKES.map((m) => `<li><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[m.i]}</svg><h3>${m.t}</h3><p>${m.d}</p>${m.clip ? `<a class="textlink" href="${m.clip.url}" target="_blank" rel="noopener">${m.go} ${c.arrow}<span class="sr"> (opens YouTube in a new tab)</span></a>` : ''}</li>`).join('')}
    </ul>
    <div class="rl-hire rv">
      <div><p class="label">Want this behind your name?</p><h3>Two ways in.</h3></div>
      <div class="rl-hire__opt">
        <b>${CS.name}</b>
        <p>${CS.tagline} Clip workflows, posting schedules and templates, built around how you already film.</p>
        <a class="textlink" href="${c.link(offerPath(CS))}">Open the file ${c.arrow}</a>
      </div>
      <div class="rl-hire__opt">
        <b>${BOOST.name} <span class="price">${BOOST.price}</span></b>
        <p>Already have a clip that deserves more eyes? A ${BOOST.run.toLowerCase()} of real paid reach behind it. ${BOOST.spend}</p>
        <a class="textlink" href="${c.link(offerPath(BOOST))}">Open the file ${c.arrow}</a>
      </div>
    </div>
  </div>
</section>

<section class="band band--paper" aria-labelledby="record-h">
  <div class="wrap rl-record">
    <div class="rl-record__text rv">
      <p class="label">On the record</p>
      <h2 class="h2" id="record-h">Client results. <span class="whisper">With permission only.</span></h2>
      <p class="lede">This reel is the crew’s own work. We don’t post a client’s numbers without the client’s OK.</p>
      <p>You won’t find made-up case studies, borrowed logos or invented numbers on this site. If a client says yes, we share their real recap: what was spent, what it reached, and the clicks or views it got.</p>
      <p>${BIZ.resultsNote}</p>
    </div>
    <div class="rl-board rv" style="--d:.1s">
      <span class="rl-board__pin" aria-hidden="true"></span><span class="rl-board__pin" aria-hidden="true"></span><span class="rl-board__pin" aria-hidden="true"></span><span class="rl-board__pin" aria-hidden="true"></span>
      <div class="rl-board__in"><p class="label">What you get back</p><b>Every client recap</b><dl class="ledger">${RECAP.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><div class="rl-board__foot"><span>Shared publicly only with the client’s OK.</span><span class="stamp" aria-hidden="true">Client<br>OK<small>Required</small></span></div></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="follow-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">Follow the work</p>
      <h2 class="h2" id="follow-h">The crew and the channel.</h2>
    </div>
    <div class="rl-follow rv">
      <div class="rl-panel rl-panel--gs">
        <p class="label label--red">The crew</p>
        <h3>Grave<i>shift</i> Gaming</h3>
        <p>GC’s gaming crew. It lives on Discord. Come say hi.</p>
        <div class="ctas">
          ${c.btn(c.icon('discord') + ' Join on Discord', DISCORD.url)}
          <a class="textlink" href="${c.link('about.html#graveshift')}">Meet the crew ${c.arrow}</a>
        </div>
      </div>
      <div class="rl-panel">
        <p class="label">The channel</p>
        <h3>Catch every drop</h3>
        <p>New clips land on the ${BIZ.name} YouTube channel. Follow wherever you scroll.</p>
        <div class="ctas">${c.btn(c.icon('youtube') + ' Open YouTube', YT.url)}</div>
        ${c.socialRow()}
      </div>
    </div>
  </div>
</section>

<section class="band band--gold" aria-labelledby="close-h">
  <div class="wrap rl-close">
    <p class="label">Make contact</p>
    <h2 id="close-h">Seen the work.<br>Now get seen.</h2>
    <p>Tell us what you’re pushing. We’ll tell you straight which file fits, or whether you need one at all.</p>
    <div class="ctas">${c.btn('Make contact ' + c.arrow, 'contact.html', 'lg')}${c.btn('See the packages', 'packages.html', 'ghost lg')}</div>
    <a class="rl-close__phone" href="${BIZ.phoneHref}">${BIZ.phone}</a>
  </div>
</section>`,
};
