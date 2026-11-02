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
  /* Chicago from the lakefront, Willis to Hancock, drawn to scale (feet) from plain shapes.
     Silhouettes, dim windows and the lake sit on a static layer; the gold windows and the
     backlit edges sit on a second layer that only the searchlight reveals as it drifts. */
  const hero = document.querySelector('.hero');
  const cv = document.querySelector('[data-sky]');
  const g = cv && cv.getContext && cv.getContext('2d');
  if (!hero || !g || !window.Path2D) return;
  const card = hero.querySelector('[data-visitor]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layer = () => { const c = document.createElement('canvas'); return [c, c.getContext('2d')]; };
  const [st, sg] = layer(), [li, lg] = layer(), [tm, tg] = layer();
  const INK = '#040405', GOLD = '243,212,138', PAPER = '242,234,216';
  let W = 0, H = 0, D = 1, gy = 0, bt = 0, bh = 0, lake = 0, sky = null, skyH = 0, motes = [], tips = [], visible = true, key = '', raf = 0;
  const seedRand = (s) => () => (s = (s * 9301 + 49297) % 233280) / 233280;
  // feet: x across the face from the building's centre line, y up from the street
  const R = (x0, x1, y0, y1) => [[x0, y0], [x0, y1], [x1, y1], [x1, y0]];
  const M = (x, y0, y1, b, t) => [[x - b / 2, y0], [x - t / 2, y1], [x + t / 2, y1], [x + b / 2, y0]];
  const pip = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
  function landmarks(){
    const chase = []; for (let i = 0; i <= 14; i++) { const y = 850 * i / 14; chase.push([-(52 + 50 * Math.pow(1 - y / 850, 1.5)), y]); }
    const cob = (cx) => { const r = [[50, 0]], f = 587 / 61; for (let k = 0; k < 61; k++) { const y = k * f, o = k > 20 ? 11 : 3; r.push([45, y + f * .1], [45 + o, y + f * .5], [45, y + f * .9]); } r.push([50, 587], [44, 592], [30, 596]); return r.map(([x, y]) => [cx + x, y]).concat(r.slice().reverse().map(([x, y]) => [cx - x, y])); };
    const dome = []; for (let i = 0; i <= 10; i++) dome.push([34 * Math.cos(Math.PI * i / 10), 938 + 23 * Math.sin(Math.PI * i / 10)]);
    const gab = []; for (let i = 0; i < 4; i++) { const h = 60 - 12 * i, y = 770 + 34 * i; gab.push([[-h, y], [-h, y + 34], [0, y + 48], [h, y + 34], [h, y]]); }
    const reg = (h, w) => [[-w, 0], [-w - 7, h * .33], [-w + 4, h * .34], [-w - 7, h * .66], [-w + 4, h * .67], [-w + 2, h], [w - 2, h], [w - 4, h * .67], [w + 7, h * .66], [w - 4, h * .34], [w + 7, h * .33], [w, 0]];
    return [
      { u: .965, z: 1.0, roof: 1128, beacon: 1, parts: [[[-130, 0], [-80, 1128], [80, 1128], [130, 0]], R(-64, 64, 1128, 1146)], masts: [M(-34, 1146, 1500, 10, 3), M(34, 1146, 1452, 10, 3)],
        // John Hancock Center: the X-braces read as dark diagonals through the windows
        on: .85, skip: (x, y) => { const k = Math.min(4, Math.floor(y / 225.6)), t = y / 225.6 - k, n = x / (130 - 50 * y / 1128); return t < .06 || Math.abs(n) > .88 || Math.abs(n - (2 * t - 1)) < .2 || Math.abs(n + (2 * t - 1)) < .2; } },
      { u: .86, z: 1.1, roof: 1191, wide: 1, parts: [reg(1191, 40).map(([x, y]) => [x + 4, y]), reg(860, 30).map(([x, y]) => [x - 62, y]), reg(1010, 30).map(([x, y]) => [x + 64, y])] },
      { u: .585, z: 1.2, roof: 1105, parts: [R(-118, 118, 0, 195), R(-102, 102, 195, 372), R(-86, 86, 372, 640), R(-68, 68, 640, 1105), R(-56, 56, 1105, 1171), R(-30, 30, 1171, 1196)], masts: [M(0, 1196, 1388, 16, 2)] },
      { u: .245, z: 1.3, roof: 1451, beacon: 1, parts: [R(-154, 154, 0, 670), R(-154, 116, 670, 900), R(-116, 116, 900, 1210), R(-116, 51, 1210, 1451), R(-104, -38, 1451, 1470), R(-22, 34, 1451, 1462)], masts: [M(-70, 1470, 1729, 10, 3), M(0, 1462, 1704, 10, 3)],
        // Willis Tower: mechanical floors leave dark belts across the face
        skip: (x, y) => y < 40 || [412, 882, 1192, 1428].some((b) => Math.abs(y - b) < 15) },
      { u: .17, z: 1.4, roof: 835, parts: [R(-110, 110, 0, 85), R(-78, 78, 0, 700), R(-68, 68, 700, 770), R(-56, 56, 770, 835), R(-56, -40, 835, 880), [[-58, 880], [-48, 910], [-38, 880]], R(40, 56, 835, 880), [[38, 880], [48, 910], [58, 880]], R(-34, 34, 835, 940), dome], crown: [R(-34, 34, 835, 940), dome] },
      { u: .755, z: 1.5, roof: 1136, parts: [R(-97, 97, 0, 1136), R(-90, 90, 1136, 1142)], pc: 3, ww: 1, wh: 3.4 },
      { u: .69, z: 1.6, roof: 770, parts: [R(-68, 68, 0, 770), ...gab, [[-14, 906], [0, 950], [14, 906]]], masts: [M(0, 940, 995, 6, 1.5)] },
      { u: .38, z: 1.7, roof: 850, parts: [chase.concat(chase.slice().reverse().map(([x, y]) => [-x, y])), R(-30, 30, 850, 862)] },
      { u: .5, z: 3, roof: 587, parts: [R(-128, 128, 0, 34), cob(-68), cob(68)], bands: 587 / 61, low: 200, on: .8, pc: 2.4, ww: 1.6 },
      { u: .628, z: 4, roof: 205, glow: 1, parts: [R(-92, 70, 0, 210), R(80, 172, 0, 186), R(68, 82, 118, 140), R(-62, -8, 210, 302), R(-57, -13, 302, 348), R(-50, -20, 348, 378), [[-48, 378], [-35, 408], [-22, 378]]], masts: [M(-35, 400, 425, 3, 1)], clock: [-35, 325, 12], pc: 6, ww: 1.4 },
    ];
  }
  function filler(rnd, h, w, z){
    const v = Math.floor(rnd() * 6), P = [];
    if (v === 1) P.push(R(-w / 2, w / 2, 0, h * .8), R(-w * .34, w * .34, h * .8, h));
    else if (v === 2) P.push(R(-w / 2, w / 2, 0, h), [[-w / 2, h], [0, h + w * .3], [w / 2, h]]);
    else if (v === 3) P.push(R(-w / 2, w / 2, 0, h * .62), R(-w * .4, w * .4, h * .62, h * .84), R(-w * .26, w * .26, h * .84, h));
    else P.push(R(-w / 2, w / 2, 0, h), R(-w * .2, w * .14, h, h + 10));
    return { z, roof: h, parts: P, masts: v === 4 && h > 420 ? [M(w * .1, h + 10, h + 60, 4, 1)] : [] };
  }
  function build(){
    const r = hero.getBoundingClientRect(), c = card && card.getBoundingClientRect();
    const k = [r.width, r.height, c && c.left - r.left, c && c.top - r.top, devicePixelRatio].join();
    if (k === key) return false; key = k;
    D = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = Math.round(r.width * D); H = cv.height = Math.round(r.height * D);
    const cl = c ? (c.left - r.left) * D : W, cr = c ? (c.right - r.left) * D : W, ct = c ? (c.top - r.top) * D : H;
    const side = !!c && cl > W * .45, stacked = !!c && !side && ct > H * .3;
    lake = Math.round(Math.min(Math.max(H * .03, 14 * D), 34 * D));
    // phones: the visitor file covers the bottom, so the city stands on its top edge instead
    gy = stacked ? Math.min(H - lake, Math.round(ct + 4 * D)) : H - lake;
    const s = Math.min(.36 * (stacked ? gy / .85 : H) / 1451, W / 1800), u0 = W / D < 600 ? .12 : 0;
    const A = cl - 6 * D, fit = side && W - cr > 520 * s, edge = side && !fit ? A : W;
    const X = (u) => !side ? (u - u0) / (1 - u0) * W : !fit ? u * A : u <= .8 ? u / .8 * A : u <= .93 ? A + (u - .8) / .13 * (cr - A) : cr + (u - .93) / .07 * (W - cr);
    const span = (b) => { let a = 1e9, z = -1e9; b.parts.forEach((P) => P.forEach(([x]) => { a = Math.min(a, x); z = Math.max(z, x); })); return [a, z]; };
    const L = landmarks().filter((b) => !b.wide || W / D > 700).map((b) => { const [a, z] = span(b); b.cx = Math.min(Math.max(X(b.u), -a * s + 2 * D), edge - z * s - 2 * D); b.x0 = b.cx + a * s; b.x1 = b.cx + z * s; return b; });
    const rnd = seedRand(11), all = L.slice(), lo = Math.min(...L.map((b) => b.x0)), hi = L[0].x1;
    const cap = (x0, x1, h) => { for (const b of L) if (!b.glow && x1 > b.x0 && x0 < b.x1) h = Math.min(h, b.roof * .66); return h; };
    for (let x = -20 * D; x < W + 20 * D;) {
      const w = 70 + rnd() * 120, cx = x + w * s / 2, far = cx < lo || cx > hi;
      const h = cap(cx - w * s / 2, cx + w * s / 2, (220 + rnd() * 400) * (far ? .6 : 1) + (rnd() < .12 ? 160 : 0));
      all.push(Object.assign(filler(rnd, h, w, 0), { cx })); x += w * s * (.75 + rnd() * .45);
    }
    for (let x = -10 * D; x < W + 10 * D;) {
      const w = 60 + rnd() * 110, cx = x + w * s / 2;
      all.push(Object.assign(filler(rnd, 100 + rnd() * 220, w, 2), { cx })); x += w * s * (1 + rnd() * .9);
    }
    all.sort((a, b) => a.z - b.z);
    bt = Math.max(0, Math.floor(gy - 1760 * s - 12 * D)); bh = Math.min(H, gy + lake) - bt;
    for (const cc of [st, li, tm]) { cc.width = W; cc.height = bh; }
    const gb = gy - bt; tips = [];
    all.forEach((b, i) => {
      const rw = seedRand(97 + i * 31), p = new Path2D(), cx = b.cx;
      const add = (P, path) => { let a = 0; P.forEach((q, j) => { const n = P[(j + 1) % P.length]; a += q[0] * n[1] - n[0] * q[1]; }); (a > 0 ? P.slice().reverse() : P).forEach(([x, y], j) => path[j ? 'lineTo' : 'moveTo'](cx + x * s, gb - y * s)); path.closePath(); };
      b.parts.forEach((P) => add(P, p)); (b.masts || []).forEach((P) => { add(P, p); if (b.beacon) tips.push([cx + (P[1][0] + P[2][0]) / 2 * s, gy - P[1][1] * s]); });
      sg.fillStyle = lg.fillStyle = INK; sg.fill(p); lg.fill(p);
      if (b.glow) { sg.fillStyle = 'rgba(' + PAPER + ',.07)'; sg.fill(p); lg.fillStyle = 'rgba(' + GOLD + ',.3)'; lg.fill(p); }
      if (b.crown) { const q = new Path2D(); b.crown.forEach((P) => add(P, q)); sg.fillStyle = 'rgba(' + PAPER + ',.07)'; sg.fill(q); lg.fillStyle = 'rgba(' + GOLD + ',.55)'; lg.fill(q);
        sg.fillStyle = lg.fillStyle = INK; for (let x = -26; x <= 26; x += 13) { sg.fillRect(cx + x * s - D / 2, gb - 938 * s, D, 100 * s); lg.fillRect(cx + x * s - D / 2, gb - 938 * s, D, 100 * s); } }
      // windows: a seeded grid per building, kept inside the outline
      const pc = (b.pc || 4) * D, ww = Math.max(1, Math.round((b.ww || 1.7) * D));
      const fl = b.bands ? b.bands * s : 0, pr = fl ? fl * Math.ceil(2.6 * D / fl) : 5.2 * D, wh = Math.max(1, Math.round(fl ? fl * .45 : (b.wh || 2.6) * D));
      const ins = (x, y) => b.parts.some((P) => pip(P, x, y));
      const mx = (ww / 2 + .8 * D) / s, my = (wh / 2 + .8 * D) / s, n = Math.floor((b.x1 - b.x0 + 2) / pc) || 1;
      const dim = [], late = [], gold = [];
      for (let yc = gb - (fl ? fl * .55 : pr * .9); yc > gb - b.roof * s; yc -= pr) {
        for (let j = 0; j < n; j++) {
          const xc = cx + (j - (n - 1) / 2) * pc, xf = (xc - cx) / s, yf = (gb - yc) / s;
          if (!(ins(xf - mx, yf - my) && ins(xf + mx, yf - my) && ins(xf - mx, yf + my) && ins(xf + mx, yf + my))) continue;
          if (b.skip && b.skip(xf, yf)) continue;
          const on = rw() < (b.low && yf < b.low ? .12 : b.on || .55), lv = rw(), wx = Math.round(xc - ww / 2), wy = Math.round(yc - wh / 2);
          if (b.glow) { dim.push(wx, wy); continue; }
          if (!on) continue;
          dim.push(wx, wy); gold.push(wx, wy, .5 + lv * .5); if (lv > .965 && b.z !== 0) late.push(wx, wy);
        }
      }
      sg.fillStyle = b.glow ? 'rgba(4,4,5,.55)' : 'rgba(' + PAPER + ',.05)'; for (let j = 0; j < dim.length; j += 2) sg.fillRect(dim[j], dim[j + 1], ww, wh);
      sg.fillStyle = 'rgba(' + GOLD + ',.16)'; for (let j = 0; j < late.length; j += 2) sg.fillRect(late[j], late[j + 1], ww, wh);
      if (b.glow) { lg.fillStyle = 'rgba(4,4,5,.6)'; for (let j = 0; j < dim.length; j += 2) lg.fillRect(dim[j], dim[j + 1], ww, wh); }
      lg.fillStyle = 'rgb(' + GOLD + ')'; for (let j = 0; j < gold.length; j += 3) { lg.globalAlpha = gold[j + 2]; lg.fillRect(gold[j], gold[j + 1], ww, wh); } lg.globalAlpha = 1;
      if (b.clock) { const [x, y, rr] = b.clock; for (const [cg, a] of [[sg, .3], [lg, .9]]) { cg.fillStyle = 'rgba(' + GOLD + ',' + a + ')'; cg.beginPath(); cg.arc(cx + x * s, gb - y * s, Math.max(1.2 * D, rr * s), 0, 6.283); cg.fill(); } }
      b.path = p;
    });
    // backlight: a hairline just outside the whole skyline, revealed only near the beam
    tg.clearRect(0, 0, W, bh); tg.lineWidth = 2.4 * D; tg.lineJoin = 'round'; tg.strokeStyle = 'rgb(' + GOLD + ')';
    all.forEach((b) => tg.stroke(b.path));
    tg.globalCompositeOperation = 'destination-out'; all.forEach((b) => tg.fill(b.path)); tg.globalCompositeOperation = 'source-over';
    tg.clearRect(0, gb, W, bh - gb); lg.globalAlpha = .55; lg.drawImage(tm, 0, 0); sg.globalAlpha = .07; sg.drawImage(tm, 0, 0); lg.globalAlpha = sg.globalAlpha = 1;
    // the lake: a squashed, broken reflection fading into the dark
    if (lake) {
      tg.clearRect(0, 0, W, bh); tg.drawImage(st, 0, 0);
      sg.save(); sg.globalAlpha = .5; sg.translate(0, gb); sg.scale(1, -1 / 3); sg.drawImage(tm, 0, gb - lake * 3, W, lake * 3, 0, -lake * 3, W, lake * 3); sg.restore();
      sg.globalCompositeOperation = 'destination-out';
      for (let y = gb + D; y < gb + lake; y += 2 * D) { sg.fillStyle = 'rgba(0,0,0,' + (.3 + rnd() * .45).toFixed(2) + ')'; sg.fillRect(0, y, W, D); }
      const fade = sg.createLinearGradient(0, gb, 0, gb + lake); fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)');
      sg.fillStyle = fade; sg.fillRect(0, gb, W, lake);
      sg.globalCompositeOperation = 'destination-over';
      const water = sg.createLinearGradient(0, gb, 0, gb + lake); water.addColorStop(0, 'rgba(3,3,4,.9)'); water.addColorStop(1, 'rgba(3,3,4,0)');
      sg.fillStyle = water; sg.fillRect(0, gb, W, lake);
      sg.globalCompositeOperation = 'source-over';
      sg.fillStyle = 'rgba(' + PAPER + ',.045)'; sg.fillRect(0, gb, W, Math.max(1, Math.round(D * .75)));
    }
    skyH = Math.min(gy, H * .62);
    sky = g.createLinearGradient(0, gy, 0, gy - skyH);
    sky.addColorStop(0, 'rgba(217,178,95,.06)'); sky.addColorStop(.35, 'rgba(217,178,95,.024)'); sky.addColorStop(1, 'rgba(217,178,95,0)');
    const rm = seedRand(5);
    motes = Array.from({ length: Math.round(W / (16 * D)) }, () => ({ x: rm() * W, y: rm() * H * .85, r: (0.6 + rm() * 1.6) * D, s: 0.1 + rm() * 0.35, p: rm() * 6.28 }));
    return true;
  }
  function lightPos(){
    const cs = hero.style; const px = parseFloat(cs.getPropertyValue('--x')), py = parseFloat(cs.getPropertyValue('--y'));
    return [isNaN(px) ? W * .3 : px * D, isNaN(py) ? H * .45 : py * D];
  }
  function frame(t){
    if (!visible) return;
    g.clearRect(0, 0, W, H);
    g.fillStyle = sky; g.fillRect(0, gy - skyH, W, skyH);
    const [lx, ly] = lightPos(), R = Math.max(W, H) * 0.28, RL = R * 1.25;
    // dust in the beam
    for (const m of motes) {
      if (!reduce) { m.y -= m.s * D; m.x += Math.sin(t / 1800 + m.p) * .15 * D; if (m.y < -4) m.y = H * .9; }
      const d = Math.hypot(m.x - lx, m.y - ly), a = Math.max(0, 1 - d / R);
      if (a <= 0.02) continue;
      g.fillStyle = 'rgba(' + GOLD + ',' + (a * .75).toFixed(3) + ')'; g.beginPath(); g.arc(m.x, m.y, m.r, 0, 6.283); g.fill();
    }
    // the city in black, then its gold windows and backlit edges wherever the beam reaches
    g.drawImage(st, 0, bt);
    const x0 = Math.max(0, Math.floor(lx - RL)), x1 = Math.min(W, Math.ceil(lx + RL)), y0 = Math.max(bt, Math.floor(ly - RL)), y1 = Math.min(bt + bh, Math.ceil(ly + RL));
    if (x1 > x0 && y1 > y0) {
      const w = x1 - x0, h = y1 - y0, gr = tg.createRadialGradient(lx - x0, ly - y0, 0, lx - x0, ly - y0, RL);
      gr.addColorStop(0, 'rgba(0,0,0,.85)'); gr.addColorStop(.45, 'rgba(0,0,0,.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      tg.clearRect(0, 0, w, h); tg.drawImage(li, x0, y0 - bt, w, h, 0, 0, w, h);
      tg.globalCompositeOperation = 'destination-in'; tg.fillStyle = gr; tg.fillRect(0, 0, w, h); tg.globalCompositeOperation = 'source-over';
      g.drawImage(tm, 0, 0, w, h, x0, y0, w, h);
    }
    // the beam laid across the water, and the red beacons on the masts
    if (lake) {
      const rows = Math.max(3, Math.round(lake / (3 * D)));
      for (let i = 0; i < rows; i++) {
        const y = gy + Math.round((i + .6) * lake / rows), f = 1 - i / rows, sp = R * (.1 + .22 * i / rows);
        for (let j = -3; j <= 3; j++) {
          const off = j * sp / 3 + (reduce ? 0 : Math.sin(t / 700 + i * 2.1 + j * 1.7) * 4 * D), a = .17 * f * (1 - Math.abs(j) / 4.2), len = (8 + 10 * f) * D;
          g.fillStyle = 'rgba(' + GOLD + ',' + a.toFixed(3) + ')'; g.fillRect(lx + off - len / 2, y, len, Math.max(1, D * .75));
        }
      }
    }
    tips.forEach(([x, y], i) => { const a = reduce ? .5 : .3 + .3 * Math.sin(t / 1100 + i * 1.9); g.fillStyle = 'rgba(229,72,77,' + a.toFixed(3) + ')'; g.beginPath(); g.arc(x, y, 1.1 * D, 0, 6.283); g.fill(); });
    if (!reduce) requestAnimationFrame(frame);
  }
  // a running loop picks up a rebuild by itself; a still frame has to be redrawn
  const redraw = () => { raf = 0; build(); if (reduce) frame(performance.now()); };
  const later = () => { if (!raf) raf = requestAnimationFrame(redraw); };
  build();
  addEventListener('resize', later);
  if (window.ResizeObserver) new ResizeObserver(later).observe(hero);
  // reduced motion: one still frame, redrawn only when the light is moved
  if (reduce && window.MutationObserver) new MutationObserver(later).observe(hero, { attributes: true, attributeFilter: ['style'] });
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
