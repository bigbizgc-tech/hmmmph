// 404: "This file was burned." A charred dossier, embers drifting through the searchlight,
// and four ways back into the Archive. No `file` property, no clearance, noindex.
import { BIZ } from '../data/business.mjs';

// A jagged burn line across the bottom-right of the sheet (seeded, so every build is identical).
const BURN = (() => {
  let seed = 404;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const pts = ['0 0', '100% 0', '100% 38%'];
  const N = 18;
  for (let i = 1; i < N; i++) {
    const t = i / N, off = (rnd() - 0.5) * (i % 3 === 0 ? 9 : 5);
    pts.push(`${(100 - t * 64 + off * 0.68).toFixed(1)}% ${(38 + t * 62 + off * 0.73).toFixed(1)}%`);
  }
  pts.push('36% 100%', '0 100%');
  return `polygon(${pts.join(',')})`;
})();

const css = `
/* ── Hero: the burned file ── */
.bn-hero{position:relative;overflow:hidden;isolation:isolate;border-bottom:1px solid var(--smoke);--x:30%;--y:55%}
.bn-hero::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(clamp(240px,34vw,520px) circle at var(--x) var(--y),rgba(217,178,95,.16),rgba(217,178,95,.04) 45%,transparent 72%)}
.bn-ash{position:absolute;inset:0;width:100%;height:100%;z-index:-2;display:block}
.bn-in{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,380px);gap:clamp(32px,5vw,80px);align-items:center;padding-block:clamp(40px,6vw,88px) clamp(56px,7vw,104px)}
@media (max-width:900px){.bn-in{grid-template-columns:minmax(0,1fr)}}
.bn-main{display:grid;gap:clamp(18px,2.4vw,26px);min-width:0;container-type:inline-size}
.bn-title{margin:0;display:grid;gap:clamp(8px,1.2vw,16px)}
.bn-pre{display:block;font-family:var(--f-serif);font-style:italic;font-weight:500;font-size:clamp(32px,4.4vw,60px);line-height:1;color:var(--gold)}
.bn-stack{display:grid;--x:30%;--y:50%;font-family:var(--f-display);font-weight:900;text-transform:uppercase;font-size:clamp(88px,30cqi,250px);line-height:.8;letter-spacing:-.012em}
.bn-stack>span{grid-area:1/1}
.bn-dark{color:transparent;-webkit-text-stroke:2px rgba(242,234,216,.45)}
.bn-lit{color:var(--gold-hi);text-shadow:0 0 42px rgba(243,212,138,.38);-webkit-mask-image:radial-gradient(clamp(150px,22vw,330px) circle at var(--x) var(--y),#000 0 34%,transparent 74%);mask-image:radial-gradient(clamp(150px,22vw,330px) circle at var(--x) var(--y),#000 0 34%,transparent 74%)}
.no-js .bn-lit{-webkit-mask-image:none;mask-image:none}
.bn-hero .lede{max-width:50ch}
.bn-code{font-family:var(--f-type);font-size:14px;letter-spacing:.06em;color:var(--ash)}
.bn-code a{color:var(--paper);font-weight:700;text-underline-offset:3px;text-decoration-color:var(--brass)}
.bn-code a:hover{color:var(--gold-hi)}

/* the charred sheet */
.bn-sheet{position:relative;width:100%;max-width:380px;justify-self:end;filter:drop-shadow(0 40px 50px rgba(0,0,0,.85))}
@media (max-width:900px){.bn-sheet{justify-self:center;max-width:300px;margin-top:8px}}
.bn-paper{position:relative;aspect-ratio:38/48;padding:26px 24px;display:grid;align-content:start;gap:12px;color:var(--ink);transform:rotate(-2.4deg);clip-path:${BURN};background:linear-gradient(130deg,transparent 0 54%,rgba(138,109,52,.35) 59%,rgba(23,20,15,.85) 64.5%,var(--ink) 68%),repeating-linear-gradient(transparent 0 31px,rgba(23,20,15,.06) 31px 32px),var(--paper)}
.bn-paper::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(130deg,transparent 0 62.5%,rgba(229,72,77,.75) 65.6%,rgba(243,212,138,.95) 66.8%,rgba(229,72,77,.6) 67.6%,transparent 69%);mix-blend-mode:screen;animation:bnGlow 2.6s ease-in-out infinite alternate}
@keyframes bnGlow{0%{opacity:.55}45%{opacity:1}70%{opacity:.7}100%{opacity:.95}}
.bn-paper__head{display:flex;justify-content:space-between;gap:10px;font-family:var(--f-type);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute)}
.bn-paper__title{font-family:var(--f-display);font-weight:900;font-size:34px;line-height:.9;text-transform:uppercase;margin-top:4px}
.bn-paper__label{font-family:var(--f-type);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute);margin-top:6px}
.bn-bar{display:block;height:13px;width:var(--w,90%);background:var(--ink)}
.bn-stamp.stamp{position:absolute;left:18px;bottom:5%;width:132px;font-size:24px;padding:12px;box-shadow:inset 0 0 0 5px var(--paper),inset 0 0 0 6.5px var(--signal);transform:rotate(-14deg)}
.bn-stamp small{font-size:9.5px}

/* ── Ways back ── */
.bn-doors{row-gap:36px}
.bn-doors .file__name{font-size:clamp(40px,3.6vw,52px)}
.bn-doors .file--flag::after{content:"A real person"}
.bn-call{margin-top:clamp(36px,5vw,56px);display:flex;flex-wrap:wrap;gap:10px 24px;align-items:baseline;font-family:var(--f-serif);font-style:italic;font-size:clamp(20px,2vw,24px);color:var(--ash)}
.bn-call a{font-family:var(--f-display);font-style:normal;font-weight:900;font-size:clamp(30px,3.4vw,42px);line-height:1;color:var(--gold);text-decoration:none}
.bn-call a:hover{color:var(--gold-hi)}
`;

const js = `
/* embers drifting up through the searchlight */
(() => {
  const hero = document.querySelector('.bn-hero'), cv = document.querySelector('[data-ash]');
  if (!hero || !cv || !cv.getContext) return;
  const g = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, D = 1, bits = [], visible = true, seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  function build() {
    const r = hero.getBoundingClientRect(); D = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = Math.round(r.width * D); H = cv.height = Math.round(r.height * D); seed = 7;
    bits = Array.from({ length: Math.round(W / (13 * D)) }, () => ({ x: rnd() * W, y: rnd() * H, r: (0.7 + rnd() * 1.7) * D, vy: (0.25 + rnd() * 0.65) * D, p: rnd() * 6.283, hot: rnd() < 0.4 }));
  }
  function light() {
    const px = parseFloat(hero.style.getPropertyValue('--x')), py = parseFloat(hero.style.getPropertyValue('--y'));
    return [isNaN(px) ? W * 0.3 : px * D, isNaN(py) ? H * 0.55 : py * D];
  }
  function frame(t) {
    if (!visible) return;
    g.clearRect(0, 0, W, H);
    const [lx, ly] = light(), R = Math.max(W, H) * 0.3;
    for (const b of bits) {
      if (!reduce) { b.y -= b.vy; b.x += Math.sin(t / 1400 + b.p) * 0.25 * D; if (b.y < -6) { b.y = H + 6; b.x = rnd() * W; } }
      const near = Math.max(0, 1 - Math.hypot(b.x - lx, b.y - ly) / R);
      const flick = 0.55 + 0.45 * Math.sin(t / 260 + b.p * 3);
      const a = (0.12 + near * 0.75) * flick * Math.min(1, b.y / (H * 0.25));
      if (a < 0.02) continue;
      g.fillStyle = (b.hot ? 'rgba(229,72,77,' : 'rgba(243,212,138,') + a.toFixed(3) + ')';
      g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.283); g.fill();
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  build();
  addEventListener('resize', () => { build(); if (reduce) frame(1000); });
  new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was && !reduce) requestAnimationFrame(frame); }).observe(hero);
  requestAnimationFrame(frame);
})();
`;

export default {
  path: '404.html',
  title: 'File not found',
  description: 'This file was burned. The page you asked for doesn’t exist or has moved. Head back to the home page, the packages, the package match or contact.',
  noindex: true,
  // For the live host: a 404 can be served at any depth, so the lead may give this page <base href="/"> (see report).
  base: '/',
  css, js,
  body: (c) => `
<header class="bn-hero" data-spot data-spot-idle>
  <canvas class="bn-ash" data-ash aria-hidden="true"></canvas>
  <div class="wrap bn-in">
    <div class="bn-main">
      <p class="label label--red">Error 404 · File missing</p>
      <h1 class="bn-title"><span class="bn-pre">This file was</span><span class="sr">burned.</span><span class="bn-stack" data-spot-layer aria-hidden="true"><span class="bn-dark">Burned.</span><span class="bn-lit">Burned.</span></span></h1>
      <p class="lede">The page you asked for doesn’t exist, or it moved. Whatever was on it went up in smoke. <strong>The good files are all still here.</strong></p>
      <div class="ctas">
        ${c.btn('Back to the home page ' + c.arrow, 'index.html', 'lg')}
        ${c.btn('See the packages', 'packages.html', 'ghost lg')}
      </div>
      <p class="bn-code">Typed the address yourself? Check the spelling. Followed a link here? <a href="${c.link('contact.html')}">Tell us</a> and we’ll fix it.</p>
    </div>
    <div class="bn-sheet" aria-hidden="true">
      <div class="bn-paper">
        <div class="bn-paper__head"><span>${BIZ.name}</span><span>File 404</span></div>
        <p class="bn-paper__title">Subject:<br>[Redacted]</p>
        <span class="bn-bar" style="--w:92%"></span>
        <span class="bn-bar" style="--w:78%"></span>
        <span class="bn-bar" style="--w:86%"></span>
        <p class="bn-paper__label">Contents</p>
        <span class="bn-bar" style="--w:64%"></span>
        <span class="bn-bar" style="--w:88%"></span>
        <span class="bn-bar" style="--w:52%"></span>
        <span class="bn-bar" style="--w:70%"></span>
        <div class="stamp bn-stamp">Burned<small>Do not reopen</small></div>
      </div>
    </div>
  </div>
</header>

<section class="band" aria-labelledby="bn-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">Still on file</p>
      <h2 class="h2" id="bn-h">Pick up <span class="whisper">the trail.</span></h2>
      <p>Four ways back into the Archive. Every one of them still exists.</p>
    </div>
    <div class="grid grid--4 bn-doors rv">
      <a class="file" href="${c.link('index.html')}" data-spot>
        <span class="file__tab">File 00</span>
        <span class="file__top"><span class="label">Start over</span></span>
        <span class="file__name">Home</span>
        <span class="file__tag">${BIZ.tagline} The front door of the Archive.</span>
        <span class="file__foot"><span class="file__open">Open file ${c.arrow}</span></span>
      </a>
      <a class="file" href="${c.link('packages.html')}" data-spot>
        <span class="file__tab">The files</span>
        <span class="file__top"><span class="label">Prices up front</span></span>
        <span class="file__name">Packages</span>
        <span class="file__tag">Every boost, plan and add-on, from a ${c.BOOSTS[0].price} test push to a monthly plan.</span>
        <span class="file__foot"><span class="file__open">Open file ${c.arrow}</span></span>
      </a>
      <a class="file" href="${c.link('packages.html#match')}" data-spot>
        <span class="file__tab">Three questions</span>
        <span class="file__top"><span class="label">Not sure?</span></span>
        <span class="file__name">The match</span>
        <span class="file__tag">Answer three questions and we point you at the package that fits.</span>
        <span class="file__foot"><span class="file__open">Take it ${c.arrow}</span></span>
      </a>
      <a class="file file--flag" href="${c.link('contact.html')}" data-spot>
        <span class="file__tab">Make contact</span>
        <span class="file__top"><span class="label">Talk to a person</span></span>
        <span class="file__name">Contact</span>
        <span class="file__tag">Tell us what you’re pushing. Call, text or send the form.</span>
        <span class="file__foot"><span class="file__open">Make contact ${c.arrow}</span></span>
      </a>
    </div>
    <p class="bn-call rv">Rather just ask? <a href="${BIZ.phoneHref}">${BIZ.phone}</a></p>
  </div>
</section>`,
};
