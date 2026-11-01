import { BIZ, SOCIALS, PLATFORMS, REEL } from '../data/business.mjs';

const css = `
/* ── Hero: the searchlight ── */
.hero{position:relative;overflow:hidden;isolation:isolate;border-bottom:1px solid var(--smoke);--x:30%;--y:45%}
.hero::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(clamp(240px,34vw,520px) circle at var(--x) var(--y),rgba(217,178,95,.17),rgba(217,178,95,.05) 45%,transparent 72%)}
.hero__sky{position:absolute;inset:0;width:100%;height:100%;z-index:-2;display:block}
.hero__in{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,340px);gap:clamp(28px,4vw,64px);align-items:end;padding-block:clamp(40px,6vw,84px) clamp(48px,7vw,96px)}
.hero__main{display:grid;gap:clamp(20px,2.6vw,30px);min-width:0}
.hero__title{margin:0;font-family:var(--f-display);font-weight:900;text-transform:uppercase;font-size:clamp(104px,36vw,288px);line-height:.8;letter-spacing:-.012em}
.hero__stack{display:grid;--x:30%;--y:50%}
.hero__stack>span{grid-area:1/1}
.hero__dark{color:transparent;-webkit-text-stroke:2px rgba(242,234,216,.5)}
.hero__lit{color:var(--gold-hi);text-shadow:0 0 42px rgba(243,212,138,.38);-webkit-mask-image:radial-gradient(clamp(150px,22vw,330px) circle at var(--x) var(--y),#000 0 34%,transparent 74%);mask-image:radial-gradient(clamp(150px,22vw,330px) circle at var(--x) var(--y),#000 0 34%,transparent 74%)}
.no-js .hero__lit{-webkit-mask-image:none;mask-image:none}
.hero__whisper{display:block;font-family:var(--f-serif);font-style:italic;font-weight:500;text-transform:none;font-size:clamp(24px,3.4vw,46px);letter-spacing:0;color:var(--gold);line-height:1;margin-top:.3em}
.hero .lede{max-width:52ch}
.hero__call{font-family:var(--f-type);font-size:14px;letter-spacing:.08em;color:var(--ash)}
.hero__call a{color:var(--paper);text-decoration:none;border-bottom:1px solid var(--brass);white-space:nowrap}
.visitor{background:color-mix(in srgb,var(--coal) 88%,transparent);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid var(--smoke);padding:22px 20px 20px;display:grid;gap:14px;position:relative;min-width:0}
.visitor::before{content:"";position:absolute;inset:-1px -1px auto auto;width:30px;height:30px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.visitor__head{display:flex;justify-content:space-between;align-items:center;gap:10px}
.visitor .ledger{font-size:13.5px}
.visitor__next{display:grid;gap:4px;font-size:14.5px}
.visitor__how{font-size:14px;color:var(--ash);line-height:1.5}
.no-js [data-hud-open]{display:none}
@media (max-width:900px){.hero__in{grid-template-columns:1fr;align-items:start}.visitor{max-width:460px}}

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
.plats .fresh span{color:var(--signal)}

/* ── Files ── */
.files-sub{margin-top:clamp(48px,6vw,72px)}
.svc-row{display:flex;flex-wrap:wrap;gap:10px}
.svc-row a{font-family:var(--f-display);font-weight:800;font-size:24px;text-transform:uppercase;letter-spacing:.03em;padding:10px 18px;border:1px solid var(--brass);color:var(--paper);text-decoration:none;display:inline-flex;gap:10px;align-items:center;transition:background .2s,color .2s}
.svc-row a:hover{background:var(--gold);color:var(--void);border-color:var(--gold)}
.svc-row .arw{width:18px;height:18px}
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

/* ── Reel ── */
.reel{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
@media (max-width:1000px){.reel{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:520px){.reel{grid-template-columns:1fr}}
.clip{--tone:var(--gold);position:relative;display:grid;align-content:end;aspect-ratio:9/13;max-width:100%;overflow:hidden;text-decoration:none;color:var(--paper);background:var(--coal);border:1px solid var(--smoke);isolation:isolate;transition:border-color .3s}
.clip--red{--tone:var(--signal)}.clip--smoke{--tone:var(--ash)}
.clip::before{content:"";position:absolute;inset:-40%;z-index:-2;background:conic-gradient(from 200deg at 50% 50%,transparent 0 60%,color-mix(in srgb,var(--tone) 30%,transparent) 70%,transparent 80%);animation:sweep 9s linear infinite}
.clip::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,transparent 30%,rgba(7,7,8,.95) 78%),repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 2px,transparent 2px 4px)}
@keyframes sweep{to{transform:rotate(360deg)}}
.clip:hover{border-color:var(--tone)}
.clip__badge{position:absolute;top:12px;left:12px;font-family:var(--f-type);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;background:var(--void);border:1px solid var(--smoke);padding:4px 8px}
.clip__play{position:absolute;top:42%;left:50%;width:70px;height:70px;margin:-35px 0 0 -35px;border-radius:50%;border:1.5px solid var(--paper);display:grid;place-items:center;transition:transform .3s var(--ease),background .3s,border-color .3s}
.clip__play::after{content:"";border-left:19px solid var(--paper);border-block:11px solid transparent;margin-left:5px}
.clip:hover .clip__play{transform:scale(1.12);background:var(--tone);border-color:var(--tone)}
.clip:hover .clip__play::after{border-left-color:var(--void)}
.clip__meta{display:grid;gap:6px;padding:18px}
.clip__meta b{font-family:var(--f-display);font-weight:900;font-size:27px;line-height:.95;text-transform:uppercase}

/* ── Final call ── */
.final{display:grid;gap:clamp(24px,3vw,36px);justify-items:start}
.final h2{font-family:var(--f-display);font-weight:900;font-size:clamp(70px,13vw,200px);line-height:.8;text-transform:uppercase}
.final p{font-size:var(--t-lede);max-width:52ch}
.final .btn{--bg:var(--void);--fg:var(--gold);--bd:var(--void)}
.final .btn--ghost{--bg:transparent;--fg:var(--void);--bd:var(--void)}
.final .btn--ghost:hover{--bg:var(--void);--fg:var(--gold)}
.final__phone{font-family:var(--f-display);font-weight:900;font-size:clamp(34px,4vw,48px);color:var(--void);text-decoration:none;line-height:1}
`;

const js = `
(() => {
  const hero = document.querySelector('.hero');
  const cv = document.querySelector('[data-sky]');
  if (!hero || !cv) return;
  const g = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, D = 1, towers = [], motes = [], visible = true;
  function seedRand(s){ return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
  function build(){
    const r = hero.getBoundingClientRect(); D = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = Math.round(r.width * D); H = cv.height = Math.round(r.height * D);
    const rnd = seedRand(11); towers = []; let x = -10 * D;
    while (x < W) {
      const w = (34 + rnd() * 70) * D, h = H * (0.07 + rnd() * 0.2) + (rnd() < .12 ? H * .14 : 0);
      const cols = Math.max(2, Math.floor(w / (11 * D))), rows = Math.max(2, Math.floor(h / (14 * D)));
      const wins = []; for (let c = 0; c < cols; c++) for (let rr = 0; rr < rows; rr++) if (rnd() < .55) wins.push([x + 6 * D + c * (w - 12 * D) / cols, H - h + 8 * D + rr * 14 * D]);
      towers.push({ x, w, h, wins }); x += w + rnd() * 6 * D;
    }
    motes = Array.from({ length: Math.round(W / (16 * D)) }, () => ({ x: rnd() * W, y: rnd() * H * .85, r: (0.6 + rnd() * 1.6) * D, s: 0.1 + rnd() * 0.35, p: rnd() * 6.28 }));
  }
  function lightPos(){
    const cs = hero.style; const px = parseFloat(cs.getPropertyValue('--x')), py = parseFloat(cs.getPropertyValue('--y'));
    return [isNaN(px) ? W * .3 : px * D, isNaN(py) ? H * .45 : py * D];
  }
  function frame(t){
    if (!visible) return;
    g.clearRect(0, 0, W, H);
    const [lx, ly] = lightPos(), R = Math.max(W, H) * 0.28;
    // dust in the beam
    for (const m of motes) {
      m.y -= m.s * D; m.x += Math.sin(t / 1800 + m.p) * .15 * D; if (m.y < -4) { m.y = H * .9; }
      const d = Math.hypot(m.x - lx, m.y - ly), a = Math.max(0, 1 - d / R);
      if (a <= 0.02) continue;
      g.fillStyle = 'rgba(243,212,138,' + (a * .75).toFixed(3) + ')'; g.beginPath(); g.arc(m.x, m.y, m.r, 0, 6.283); g.fill();
    }
    // skyline: buildings in black, windows light up as the beam passes over them
    for (const tw of towers) {
      g.fillStyle = '#040405'; g.fillRect(tw.x, H - tw.h, tw.w + 1, tw.h);
      for (const [wx, wy] of tw.wins) {
        const d = Math.hypot(wx - lx, wy - ly), a = Math.max(0, 1 - d / (R * 1.25));
        g.fillStyle = a > .02 ? 'rgba(243,212,138,' + (0.08 + a * .85).toFixed(3) + ')' : 'rgba(242,234,216,.05)';
        g.fillRect(wx, wy, 4 * D, 6 * D);
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  build(); addEventListener('resize', () => { build(); if (reduce) frame(0); });
  new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was && !reduce) requestAnimationFrame(frame); }).observe(hero);
  requestAnimationFrame(frame);
})();

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
  let auto = setInterval(() => set(document.querySelector('[data-crowd-mode="feed"]').getAttribute('aria-pressed') === 'true' ? 'paid' : 'feed'), 4200);
  document.querySelector('.crowd__toggle').addEventListener('click', () => clearInterval(auto), { once: true });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) clearInterval(auto);
})();
`;

export default {
  path: 'index.html',
  file: 'File 00',
  order: 0,
  navTitle: 'Home',
  section: 'home',
  title: 'Blackout Syndicate · Get Seen in South Bend',
  description: 'Real ads. Real people. No bots. Blackout Syndicate puts paid reach behind creators, streamers, solo businesses and local shops in South Bend, Mishawaka and Elkhart.',
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
<header class="hero" data-spot data-spot-idle>
  <canvas class="hero__sky" data-sky aria-hidden="true"></canvas>
  <div class="wrap hero__in">
    <div class="hero__main">
      <p class="label">File 00 · ${BIZ.area.join(' · ')}</p>
      <h1 class="hero__title"><span class="sr">Get seen.</span><span class="hero__stack" data-spot-layer aria-hidden="true"><span class="hero__dark">Get<br>Seen.</span><span class="hero__lit">Get<br>Seen.</span></span><span class="hero__whisper">You’ve been in the dark long enough.</span></h1>
      <p class="lede"><strong>Real ads. Real people. No bots.</strong> We put paid reach behind creators, streamers, solo businesses and local shops, on the feeds your people already scroll.</p>
      <div class="ctas">
        ${c.btn('Open the files ' + c.arrow, 'packages.html', 'lg')}
        ${c.btn('Find my package', 'packages.html#match', 'ghost lg')}
      </div>
      <p class="hero__call">Rather talk? Call or text <a href="${BIZ.phoneHref}">${BIZ.phone}</a></p>
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
      <p class="crowd__cap" data-crowd-cap aria-live="polite"><b>The feed picks.</b> A few scattered people, chosen by an algorithm that has never heard of your town.</p>
      <p class="label label--dim">Illustration, not data</p>
    </div>
  </div>
</section>

<section class="band band--coal" aria-labelledby="how-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div><p class="label">The play</p><h2 class="h2" id="how-h">Three moves. <span class="whisper">Then you’re seen.</span></h2></div>
      <a class="textlink" href="${c.link('how-it-works.html')}">The full play, step by step ${c.arrow}</a>
    </div>
    <ol class="steps rv" style="--n:3">
      <li><h3>Pick your size</h3><p>A one-time boost to test the water, or a monthly plan that keeps the push running every week.</p></li>
      <li><h3>Point it</h3><p>Your post, page, channel, website or booking line. Tell us where you want new people to land.</p></li>
      <li><h3>We push</h3><p>A real paid placement on the platform you choose, aimed at your area or your audience. You get a recap of what ran.</p></li>
    </ol>
  </div>
</section>

<section class="band" aria-labelledby="where-h">
  <div class="wrap split">
    <div class="rv" style="display:grid;gap:20px;align-content:start">
      <p class="label">Where we push</p>
      <h2 class="h2" id="where-h">Every feed <span class="whisper">that matters.</span></h2>
      <p class="muted">Five platforms. We put your money where your people actually scroll, and tell you straight when a platform is the wrong fit.</p>
    </div>
    <ul class="plats rv" style="--d:.1s">${PLATFORMS.map((p) => `<li class="${p.fresh ? 'fresh' : ''}"><b>${p.name}</b><span>${p.note}</span></li>`).join('')}</ul>
  </div>
</section>

<section class="band band--coal" id="files" aria-labelledby="files-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div><p class="label">The files</p><h2 class="h2" id="files-h">Start small. <span class="whisper">Or go all in.</span></h2><p>Boosts are one-time buys with no contract. Plans keep the push running month after month. Every file opens to the full details.</p></div>
      <a class="textlink" href="${c.link('packages.html')}">Compare every package ${c.arrow}</a>
    </div>
    <div class="drawer-label rv"><h3 class="h3">One-time boosts</h3><span class="label label--dim">No contract</span></div>
    <div class="grid grid--3 rv">${c.BOOSTS.map((o) => c.offerCard(o)).join('')}</div>
    <div class="drawer-label files-sub rv"><h3 class="h3">Monthly plans</h3><span class="label label--dim">Stay or walk, month to month</span></div>
    <div class="grid grid--3 rv">${c.PLANS.map((o) => c.offerCard(o)).join('')}</div>
    <div class="drawer-label files-sub rv"><h3 class="h3">Add-ons</h3><span class="label label--dim">Pair with any boost</span></div>
    <div class="grid grid--2 rv">${c.ADDONS.map((o) => c.offerCard(o)).join('')}</div>
    <div class="drawer-label files-sub rv"><h3 class="h3">Built to order</h3><span class="label label--dim">Quoted per job</span></div>
    <div class="svc-row rv">${c.SERVICES.map((o) => `<a href="${c.link(c.offerPath(o))}">${o.name} ${c.arrow}</a>`).join('')}</div>
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
      <div><p class="label">The reel</p><h2 class="h2" id="reel-h">Watch <span class="whisper">the work.</span></h2><p>Spots cut for Blackout Syndicate and the Graveshift Gaming crew. Opens on YouTube.</p></div>
      <a class="textlink" href="${c.link('work.html')}">The whole reel ${c.arrow}</a>
    </div>
    <div class="reel rv">${REEL.map((r) => `<a class="clip clip--${r.tone}" href="${r.url}" target="_blank" rel="noopener"><span class="clip__badge">${r.kind} · ${r.length}</span><span class="clip__play" aria-hidden="true"></span><span class="clip__meta"><span class="label">${r.who}</span><b>${r.title}</b></span></a>`).join('')}</div>
  </div>
</section>

<section class="band band--gold" aria-labelledby="final-h">
  <div class="wrap final">
    <p class="label">Make contact</p>
    <h2 id="final-h">Step into<br>the light.</h2>
    <p>Tell us what you’re pushing. We’ll tell you straight which file fits, or whether you need one at all.</p>
    <div class="ctas">${c.btn('Make contact ' + c.arrow, 'contact.html', 'lg')}${c.btn('See the packages', 'packages.html', 'ghost lg')}</div>
    <a class="final__phone" href="${BIZ.phoneHref}">${BIZ.phone}</a>
  </div>
</section>`,
};
