/* Blackout Syndicate 2.0: the city behind every page.
   Chicago from the lakefront, Willis to Hancock, drawn to scale (in feet) from plain shapes into one
   fixed, full-screen canvas (<canvas data-sky>, added by src/layout.mjs) that sits behind all content.
   The skyline stands on the bottom of the screen. The silhouettes, dim windows, haze and lake are
   painted once to an offscreen layer; each frame adds only what the searchlights touch: gold windows,
   lit facades and a backlit skyline edge. Three beams rise from behind the city: the centre one follows
   the pointer on desktop and drifts on its own on touch screens; the outer two sweep.
   Kept light for phones: one canvas; 1x pixels on touch and small screens, 1.5x at most on desktop;
   30 frames a second at most; nothing drawn while the tab is hidden or the phone menu or clearance
   panel covers the page; on touch screens the loop rests after 8 s without a touch or scroll and wakes
   on the next one. Reduced motion: one still frame. Resizes are debounced and ignore the phone's
   address bar sliding in and out (the canvas is sized to the large viewport in CSS). */
(() => {
  'use strict';
  const cv = document.querySelector('[data-sky]');
  const g = cv && cv.getContext && cv.getContext('2d');
  if (!g || !window.Path2D || !window.matchMedia) { if (cv) cv.classList.add('is-lit'); return; }
  const mq = (q) => matchMedia(q).matches;
  const reduce = mq('(prefers-reduced-motion: reduce)');
  const touch = mq('(pointer: coarse)') || !mq('(hover: hover)');
  // offscreen: the still city (painted once per size) and the beams (half resolution: they are soft
  // gradients, and a quarter of the pixels to fill is most of the frame's cost on a phone)
  const st = document.createElement('canvas'), sg = st.getContext('2d');
  const bc = document.createElement('canvas'), bg = bc.getContext('2d'), Q = .5;
  const INK = '#040405', GOLD = '243,212,138', PAPER = '242,234,216';
  const FPS = 30, IDLE = 8000, POINTER_IDLE = 2600;
  let W = 0, H = 0, D = 1, gy = 0, bt = 0, lake = 0, key = '', top0 = 0;
  let wins = new Float32Array(0), glows = [], rims = [], motes = [], tips = [];
  // the light: where the centre beam aims and the windows glow (canvas px), eased toward its target
  let lx = -1, ly = -1, px = -1, py = -1, lastMove = -1e9, aimA = -Math.PI / 2;
  let clock = 0, last = 0, raf = 0, lastInput = performance.now(), hold = 0, hidden = document.hidden, covered = false;

  const seedRand = (s) => () => (s = (s * 9301 + 49297) % 233280) / 233280;
  // feet: x across the face from the building's centre line, y up from the street
  const R = (x0, x1, y0, y1) => [[x0, y0], [x0, y1], [x1, y1], [x1, y0]];
  const M = (x, y0, y1, b, t) => [[x - b / 2, y0], [x - t / 2, y1], [x + t / 2, y1], [x + b / 2, y0]];
  const pip = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
  function landmarks() {
    const chase = []; for (let i = 0; i <= 14; i++) { const y = 850 * i / 14; chase.push([-(52 + 50 * Math.pow(1 - y / 850, 1.5)), y]); }
    const cob = (cx) => { const r = [[50, 0]], f = 587 / 61; for (let k = 0; k < 61; k++) { const y = k * f, o = k > 20 ? 11 : 3; r.push([45, y + f * .1], [45 + o, y + f * .5], [45, y + f * .9]); } r.push([50, 587], [44, 592], [30, 596]); return r.map(([x, y]) => [cx + x, y]).concat(r.slice().reverse().map(([x, y]) => [cx - x, y])); };
    const dome = []; for (let i = 0; i <= 10; i++) dome.push([34 * Math.cos(Math.PI * i / 10), 938 + 23 * Math.sin(Math.PI * i / 10)]);
    const gab = []; for (let i = 0; i < 4; i++) { const h = 60 - 12 * i, y = 770 + 34 * i; gab.push([[-h, y], [-h, y + 34], [0, y + 48], [h, y + 34], [h, y]]); }
    const reg = (h, w) => [[-w, 0], [-w - 7, h * .33], [-w + 4, h * .34], [-w - 7, h * .66], [-w + 4, h * .67], [-w + 2, h], [w - 2, h], [w - 4, h * .67], [w + 7, h * .66], [w - 4, h * .34], [w + 7, h * .33], [w, 0]];
    return [
      // John Hancock Center: tapered, twin masts; the X-braces read as dark diagonals through the windows
      { u: .965, z: 1.0, roof: 1128, beacon: 1, on: .85, parts: [[[-130, 0], [-80, 1128], [80, 1128], [130, 0]], R(-64, 64, 1128, 1146)], masts: [M(-34, 1146, 1500, 10, 3), M(34, 1146, 1452, 10, 3)],
        skip: (x, y) => { const k = Math.min(4, Math.floor(y / 225.6)), t = y / 225.6 - k, n = x / (130 - 50 * y / 1128); return t < .06 || Math.abs(n) > .88 || Math.abs(n - (2 * t - 1)) < .2 || Math.abs(n + (2 * t - 1)) < .2; } },
      // St. Regis: three stacked, faceted glass towers (left out on narrow screens)
      { u: .86, z: 1.1, roof: 1191, wide: 1, parts: [reg(1191, 40).map(([x, y]) => [x + 4, y]), reg(860, 30).map(([x, y]) => [x - 62, y]), reg(1010, 30).map(([x, y]) => [x + 64, y])] },
      // Trump International: setbacks at the Wrigley, River Plaza and IBM cornice lines, then the spire
      { u: .585, z: 1.2, roof: 1105, parts: [R(-118, 118, 0, 195), R(-102, 102, 195, 372), R(-86, 86, 372, 640), R(-68, 68, 640, 1105), R(-56, 56, 1105, 1171), R(-30, 30, 1171, 1196)], masts: [M(0, 1196, 1388, 16, 2)] },
      // Willis Tower: bundled tubes stepping back at the 50th, 66th and 90th floors; mechanical belts; twin antennas
      { u: .245, z: 1.3, roof: 1451, beacon: 1, parts: [R(-154, 154, 0, 670), R(-154, 116, 670, 900), R(-116, 116, 900, 1210), R(-116, 51, 1210, 1451), R(-104, -38, 1451, 1470), R(-22, 34, 1451, 1462)], masts: [M(-70, 1470, 1729, 10, 3), M(0, 1462, 1704, 10, 3)],
        skip: (x, y) => y < 40 || [412, 882, 1192, 1428].some((b) => Math.abs(y - b) < 15) },
      // 311 South Wacker: the lit glass drum with its four turrets
      { u: .17, z: 1.4, roof: 835, parts: [R(-110, 110, 0, 85), R(-78, 78, 0, 700), R(-68, 68, 700, 770), R(-56, 56, 770, 835), R(-56, -40, 835, 880), [[-58, 880], [-48, 910], [-38, 880]], R(40, 56, 835, 880), [[38, 880], [48, 910], [58, 880]], R(-34, 34, 835, 940), dome], crown: [R(-34, 34, 835, 940), dome] },
      // Aon Center: the plain white slab, fine vertical fins
      { u: .755, z: 1.5, roof: 1136, parts: [R(-97, 97, 0, 1136), R(-90, 90, 1136, 1142)], pc: 3, ww: 1, wh: 3.4 },
      // Two Prudential Plaza: stacked chevron gables and a needle
      { u: .69, z: 1.6, roof: 770, parts: [R(-68, 68, 0, 770), ...gab, [[-14, 906], [0, 950], [14, 906]]], masts: [M(0, 940, 995, 6, 1.5)] },
      // Chase Tower: the curved, swooping sides
      { u: .38, z: 1.7, roof: 850, parts: [chase.concat(chase.slice().reverse().map(([x, y]) => [-x, y])), R(-30, 30, 850, 862)] },
      // Marina City: the corncobs, parking spiral below, petal balconies above
      { u: .5, z: 3, roof: 587, parts: [R(-128, 128, 0, 34), cob(-68), cob(68)], bands: 587 / 61, low: 200, on: .8, pc: 2.4, ww: 1.6 },
      // Wrigley Building: floodlit white terra cotta, clock tower at the river end
      { u: .628, z: 4, roof: 205, glow: 1, parts: [R(-92, 70, 0, 210), R(80, 172, 0, 186), R(68, 82, 118, 140), R(-62, -8, 210, 302), R(-57, -13, 302, 348), R(-50, -20, 348, 378), [[-48, 378], [-35, 408], [-22, 378]]], masts: [M(-35, 400, 425, 3, 1)], clock: [-35, 325, 12], pc: 6, ww: 1.4 },
    ];
  }
  function filler(rnd, h, w, z) {
    const v = Math.floor(rnd() * 6), P = [];
    if (v === 1) P.push(R(-w / 2, w / 2, 0, h * .8), R(-w * .34, w * .34, h * .8, h));
    else if (v === 2) P.push(R(-w / 2, w / 2, 0, h), [[-w / 2, h], [0, h + w * .3], [w / 2, h]]);
    else if (v === 3) P.push(R(-w / 2, w / 2, 0, h * .62), R(-w * .4, w * .4, h * .62, h * .84), R(-w * .26, w * .26, h * .84, h));
    else P.push(R(-w / 2, w / 2, 0, h), R(-w * .2, w * .14, h, h + 10));
    return { z, roof: h, parts: P, masts: v === 4 && h > 420 ? [M(w * .1, h + 10, h + 60, 4, 1)] : [] };
  }

  // Lays the city out for the canvas's current size. Returns false when nothing changed.
  function build() {
    const cw = cv.clientWidth, ch = cv.clientHeight;
    if (!cw || !ch) return false;
    // 1x on touch and small screens; up to 1.5x on desktop
    const d = touch || cw < 700 ? 1 : Math.min(devicePixelRatio || 1, 1.5);
    const k = [cw, ch, d].join();
    if (k === key) return false; key = k;
    D = d; W = cv.width = Math.round(cw * D); H = cv.height = Math.round(ch * D);
    bc.width = Math.ceil(W * Q); bc.height = Math.ceil(H * Q);
    top0 = cv.getBoundingClientRect().top;
    lake = Math.round(Math.min(Math.max(H * .03, 14 * D), 34 * D));
    gy = H - lake;
    // one scale for every building, so heights stay true to life; spacing follows the screen's width
    const s = Math.min(.36 * H / 1451, W / 1800), u0 = cw < 600 ? .12 : 0;
    const X = (u) => (u - u0) / (1 - u0) * W;
    const span = (b) => { let a = 1e9, z = -1e9, t = 0; b.parts.forEach((P) => P.forEach(([x, y]) => { a = Math.min(a, x); z = Math.max(z, x); t = Math.max(t, y); })); return [a, z, t]; };
    const L = landmarks().filter((b) => !b.wide || cw > 700).map((b) => { const [a, z] = span(b); b.cx = Math.min(Math.max(X(b.u), -a * s + 2 * D), W - z * s - 2 * D); b.x0 = b.cx + a * s; b.x1 = b.cx + z * s; return b; });
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
    all.forEach((b) => { const [a, z, t] = span(b); b.x0 = b.cx + a * s; b.x1 = b.cx + z * s; b.t = t; });
    bt = Math.max(0, Math.floor(gy - 1760 * s - 12 * D));
    const bh = Math.min(H, gy + lake) - bt, gb = gy - bt;
    st.width = W; st.height = bh;
    const haze = sg.createLinearGradient(0, gb, 0, 0);
    haze.addColorStop(0, 'rgba(217,178,95,.06)'); haze.addColorStop(.4, 'rgba(217,178,95,.022)'); haze.addColorStop(1, 'rgba(217,178,95,0)');
    sg.fillStyle = haze; sg.fillRect(0, 0, W, gb);
    const top = new Float32Array(W).fill(gb), lit = [];
    tips = []; glows = [];
    // a gold window must not shine through a building standing in front of it
    all.forEach((b, i) => { b.occ = all.slice(i + 1).filter((o) => o.x1 > b.x0 && o.x0 < b.x1); });
    const covers = (b, x, y) => { for (const o of b.occ) { if (x < o.x0 || x > o.x1 || y < gb - o.t * s) continue; if (o.parts.some((P) => pip(P, (x - o.cx) / s, (gb - y) / s))) return true; } return false; };
    all.forEach((b, i) => {
      const rw = seedRand(97 + i * 31), p = new Path2D(), cx = b.cx;
      // outline: every polygon wound the same way so overlapping parts fill as one
      const add = (P, path) => { let a = 0; P.forEach((q, j) => { const n = P[(j + 1) % P.length]; a += q[0] * n[1] - n[0] * q[1]; }); (a > 0 ? P.slice().reverse() : P).forEach(([x, y], j) => path[j ? 'lineTo' : 'moveTo'](cx + x * s, gb - y * s)); path.closePath(); };
      // the skyline's top edge, column by column, for the backlight
      const trace = (P) => { for (let j = 0; j < P.length; j++) { const p0 = P[j], p1 = P[(j + 1) % P.length]; if (p0[0] === p1[0]) continue; const xa = cx + Math.min(p0[0], p1[0]) * s, xb = cx + Math.max(p0[0], p1[0]) * s; for (let cc = Math.max(0, Math.ceil(xa - .5)); cc <= Math.min(W - 1, Math.floor(xb - .5)); cc++) { const t = ((cc + .5 - cx) / s - p0[0]) / (p1[0] - p0[0]), y = gb - (p0[1] + t * (p1[1] - p0[1])) * s; if (y < top[cc]) top[cc] = y; } } };
      b.parts.forEach((P) => { add(P, p); trace(P); });
      (b.masts || []).forEach((P) => { add(P, p); trace(P); const mx = Math.round(cx + (P[1][0] + P[2][0]) / 2 * s - .5), my = gb - P[1][1] * s; if (mx >= 0 && mx < W && my < top[mx]) top[mx] = my; if (b.beacon) tips.push([mx + .5, my + bt]); });
      sg.fillStyle = INK; sg.fill(p);
      if (b.glow) { sg.fillStyle = 'rgba(' + PAPER + ',.07)'; sg.fill(p); }
      // windows: a seeded grid per building, kept inside the outline
      const pc = (b.pc || 4) * D, ww = Math.max(1, Math.round((b.ww || 1.7) * D));
      const fl = b.bands ? b.bands * s : 0, pr = fl ? fl * Math.ceil(2.6 * D / fl) : 5.2 * D, wh = Math.max(1, Math.round(fl ? fl * .45 : (b.wh || 2.6) * D));
      const ins = (x, y) => b.parts.some((P) => pip(P, x, y));
      const mx = (ww / 2 + .8 * D) / s, my = (wh / 2 + .8 * D) / s, n = Math.floor((b.x1 - b.x0 + 2) / pc) || 1;
      const dim = [], late = [];
      for (let yc = gb - (fl ? fl * .55 : pr * .9); yc > gb - b.roof * s; yc -= pr) {
        for (let j = 0; j < n; j++) {
          const xc = cx + (j - (n - 1) / 2) * pc, xf = (xc - cx) / s, yf = (gb - yc) / s;
          if (!(ins(xf - mx, yf - my) && ins(xf + mx, yf - my) && ins(xf - mx, yf + my) && ins(xf + mx, yf + my))) continue;
          if (b.skip && b.skip(xf, yf)) continue;
          const on = rw() < (b.low && yf < b.low ? .12 : b.on || .55), lv = rw(), wx = Math.round(xc - ww / 2), wy = Math.round(yc - wh / 2);
          if (b.glow) { dim.push(wx, wy); continue; }
          if (!on) continue;
          dim.push(wx, wy); if (lv > .965 && b.z !== 0) late.push(wx, wy);
          if (!covers(b, xc, yc) && !covers(b, wx, wy) && !covers(b, wx + ww, wy) && !covers(b, wx, wy + wh) && !covers(b, wx + ww, wy + wh)) lit.push([wx, wy + bt, ww, wh, .5 + lv * .5]);
        }
      }
      sg.fillStyle = b.glow ? 'rgba(4,4,5,.55)' : 'rgba(' + PAPER + ',.05)'; for (let j = 0; j < dim.length; j += 2) sg.fillRect(dim[j], dim[j + 1], ww, wh);
      sg.fillStyle = 'rgba(' + GOLD + ',.16)'; for (let j = 0; j < late.length; j += 2) sg.fillRect(late[j], late[j + 1], ww, wh);
      const clock = (ctx, a) => { if (!b.clock) return; const [x, y, rr] = b.clock; ctx.fillStyle = 'rgba(' + GOLD + ',' + a + ')'; ctx.beginPath(); ctx.arc(cx + x * s, gb - y * s, Math.max(1.2 * D, rr * s), 0, 6.283); ctx.fill(); };
      const bars = (ctx) => { ctx.fillStyle = INK; for (let x = -26; x <= 26; x += 13) ctx.fillRect(cx + x * s - D / 2, gb - 938 * s, D, 100 * s); };
      if (b.glow) { clock(sg, .3); glows.push({ p, x: cx, y: gy - 200 * s, fill: 'rgba(' + GOLD + ',.3)', after: (ctx) => { ctx.fillStyle = 'rgba(4,4,5,.6)'; for (let j = 0; j < dim.length; j += 2) ctx.fillRect(dim[j], dim[j + 1], ww, wh); clock(ctx, .9); } }); }
      if (b.crown) { const q = new Path2D(); b.crown.forEach((P) => add(P, q)); sg.fillStyle = 'rgba(' + PAPER + ',.07)'; sg.fill(q); bars(sg); glows.push({ p: q, x: cx, y: gy - 900 * s, fill: 'rgba(' + GOLD + ',.55)', after: bars }); }
    });
    // the backlit edge: a polyline along the top of the whole skyline, faint in the still layer and cut
    // into short pieces, so each frame strokes only the pieces near the light, each in one flat colour
    const edge = (x0, x1, path) => { let pen = false, ys = 0, n = 0; for (let x = x0; x <= x1; x++) { const y = top[x]; if (y >= gb - .5) { pen = false; continue; } if (!pen) { path.moveTo(x, y); pen = true; } else if (x === x1 || y !== top[x - 1] || y !== top[x + 1]) path.lineTo(x + .5, y); ys += y; n++; } return n ? ys / n : -1; };
    const rim = new Path2D(); edge(0, W - 1, rim);
    sg.strokeStyle = 'rgba(' + GOLD + ',.07)'; sg.lineWidth = 1.2 * D; sg.lineJoin = 'round'; sg.stroke(rim);
    rims = []; const B = Math.round(14 * D);
    for (let x0 = 0; x0 < W - 1; x0 += B) { const p = new Path2D(), y = edge(x0, Math.min(W - 1, x0 + B), p); if (y >= 0) rims.push({ p, x: x0 + B / 2, y }); }
    lit.sort((a, b) => a[0] - b[0]); wins = Float32Array.from(lit.flat());
    // the lake: a squashed, broken reflection of the city, fading into the dark
    if (lake) {
      const cp = document.createElement('canvas'); cp.width = W; cp.height = gb; cp.getContext('2d').drawImage(st, 0, 0);
      sg.save(); sg.globalAlpha = .5; sg.translate(0, gb); sg.scale(1, -1 / 3); sg.drawImage(cp, 0, gb - lake * 3, W, lake * 3, 0, -lake * 3, W, lake * 3); sg.restore();
      cp.width = cp.height = 0;
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
    const rm = seedRand(5);
    motes = Array.from({ length: Math.round(W / (16 * D)) }, () => ({ x: rm() * W, y: rm() * H * .85, r: (0.6 + rm() * 1.6) * D, s: 0.1 + rm() * 0.35, p: rm() * 6.28 }));
    if (lx < 0) { const [x, y] = driftAt(0); lx = x; ly = y; }
    return true;
  }

  // Where the light wanders when nobody is pointing: a slow loop over the middle of the screen.
  function driftAt(ms) {
    const t = ms / 1000;
    return [W * (.5 + .3 * Math.sin(t * .42)), H * (.44 + .12 * Math.sin(t * .77 + 1.2))];
  }
  // Moves the light and the dust for one frame; dt in ms.
  function step(dt) {
    clock += dt;
    const f = dt / 16.7;
    const pointing = !touch && px >= 0 && performance.now() - lastMove < POINTER_IDLE;
    const [tx, ty] = pointing ? [px * D, (py - top0) * D] : driftAt(clock);
    const k = 1 - Math.pow(pointing ? .7 : .94, f);
    lx += (tx - lx) * k; ly += (ty - ly) * k;
    for (const m of motes) { m.y -= m.s * D * f; m.x += Math.sin(clock / 1800 + m.p) * .15 * D * f; if (m.y < -4) m.y = H * .9; }
  }

  // v1's searchlights: three beams rise from behind the city. The centre one swings to the light;
  // the outer two sweep on their own.
  const BEAMS = [[.15, .75, 1.15], [.5, 1, 0], [.86, .8, .8]];
  function beams(f) {
    const len = Math.hypot(W, H) * 1.2, sy = gy - 2 * D;
    bg.setTransform(1, 0, 0, 1, 0, 0); bg.clearRect(0, 0, bc.width, bc.height);
    bg.setTransform(Q, 0, 0, Q, 0, 0); bg.globalCompositeOperation = 'lighter';
    BEAMS.forEach(([fx, str, sp], k) => {
      const sx = W * fx; let a;
      if (k === 1) { const want = Math.min(-.22, Math.max(-Math.PI + .22, Math.atan2(ly - sy, lx - sx))); aimA += (want - aimA) * (reduce ? 1 : 1 - Math.pow(.93, f)); a = aimA; }
      else a = -Math.PI / 2 + (reduce ? (k ? .36 : -.4) : Math.sin(clock * .00034 * sp + k * 2.1) * .48);
      const col = k === 1 ? GOLD : PAPER, ca = Math.cos(a), sa = Math.sin(a);
      for (const [spread, alpha] of [[k === 1 ? .2 : .14, .05], [k === 1 ? .075 : .055, .21]]) {
        const gr = bg.createLinearGradient(sx, sy, sx + ca * len, sy + sa * len);
        gr.addColorStop(0, 'rgba(' + col + ',' + (alpha * str).toFixed(3) + ')');
        gr.addColorStop(.5, 'rgba(' + col + ',' + (alpha * str * .32).toFixed(3) + ')');
        gr.addColorStop(1, 'rgba(' + col + ',0)');
        bg.fillStyle = gr; bg.beginPath(); bg.moveTo(sx, sy);
        bg.lineTo(sx + Math.cos(a - spread) * len, sy + Math.sin(a - spread) * len);
        bg.lineTo(sx + Math.cos(a + spread) * len, sy + Math.sin(a + spread) * len);
        bg.closePath(); bg.fill();
      }
    });
    g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(bc, 0, 0, W, H); g.restore();
  }
  function draw(f) {
    g.clearRect(0, 0, W, H);
    const R = Math.max(W, H) * 0.28, RL = R * 1.25;
    // dust in the beam (each page head paints its own soft glow around the pointer in CSS)
    for (const m of motes) {
      const a = Math.max(0, 1 - Math.hypot(m.x - lx, m.y - ly) / R);
      if (a <= 0.02) continue;
      g.fillStyle = 'rgba(' + GOLD + ',' + (a * .75).toFixed(3) + ')'; g.beginPath(); g.arc(m.x, m.y, m.r, 0, 6.283); g.fill();
    }
    beams(f);
    // the city in black (it hides the searchlights' bases), then gold windows wherever the light reaches
    g.drawImage(st, 0, bt);
    g.fillStyle = 'rgb(' + GOLD + ')';
    const nw = wins.length / 5; let i = 0, j = nw;
    while (i < j) { const m = (i + j) >> 1; if (wins[m * 5] < lx - RL) i = m + 1; else j = m; }
    for (; i < nw; i++) {
      const o = i * 5, x = wins[o]; if (x > lx + RL) break;
      const a = wins[o + 4] * .9 * (1 - Math.hypot(x - lx, wins[o + 1] - ly) / RL);
      if (a < .02) continue;
      g.globalAlpha = a; g.fillRect(x, wins[o + 1], wins[o + 2], wins[o + 3]);
    }
    g.globalAlpha = 1;
    g.save(); g.translate(0, bt);
    for (const o of glows) { const a = 1 - Math.hypot(o.x - lx, o.y - ly) / RL; if (a <= 0) continue; g.globalAlpha = a * .9; g.fillStyle = o.fill; g.fill(o.p); o.after(g); }
    g.globalAlpha = 1;
    // the backlit edge: .6 gold at the light, .3 at 45% of the reach, gone at the edge of it
    g.lineWidth = 1.2 * D; g.lineJoin = 'round';
    for (const r of rims) {
      const q = Math.hypot(r.x - lx, r.y + bt - ly) / RL; if (q >= 1) continue;
      g.strokeStyle = 'rgba(' + GOLD + ',' + (q < .45 ? .6 - q / .45 * .3 : .3 * (1 - (q - .45) / .55)).toFixed(3) + ')'; g.stroke(r.p);
    }
    g.restore();
    // the beam laid across the water, and the red beacons on the masts
    if (lake) {
      const rows = Math.max(3, Math.round(lake / (3 * D)));
      for (let k = 0; k < rows; k++) {
        const y = gy + Math.round((k + .6) * lake / rows), fr = 1 - k / rows, sp = R * (.1 + .22 * k / rows);
        for (let q = -3; q <= 3; q++) {
          const off = q * sp / 3 + (reduce ? 0 : Math.sin(clock / 700 + k * 2.1 + q * 1.7) * 4 * D), a = .17 * fr * (1 - Math.abs(q) / 4.2), len = (8 + 10 * fr) * D;
          g.fillStyle = 'rgba(' + GOLD + ',' + a.toFixed(3) + ')'; g.fillRect(lx + off - len / 2, y, len, Math.max(1, D * .75));
        }
      }
    }
    tips.forEach(([x, y], k) => { const a = reduce ? .5 : .3 + .3 * Math.sin(clock / 1100 + k * 1.9); g.fillStyle = 'rgba(229,72,77,' + a.toFixed(3) + ')'; g.beginPath(); g.arc(x, y, 1.1 * D, 0, 6.283); g.fill(); });
  }

  // ── The loop: 30 fps at most, and only while it shows ──
  const resting = () => hidden || covered || (touch && performance.now() - lastInput > IDLE);
  function frame(t) {
    raf = 0;
    if (!W || resting()) return;
    raf = requestAnimationFrame(frame);
    // right after a touch, leave the frames to the tap's own response
    if (t - last < 1000 / FPS - 3 || performance.now() < hold) return;
    const dt = Math.min(100, last ? t - last : 16.7); last = t;
    step(dt); draw(dt / 16.7);
  }
  function wake() {
    if (reduce || raf || !W || resting()) return;
    last = 0; raf = requestAnimationFrame(frame);
  }
  const still = () => { if (W) { step(0); draw(1); } };
  function first() {
    build();
    if (reduce) still(); else { step(16.7); draw(1); wake(); }
    cv.classList.add('is-lit');
  }

  // resize (rotation, desktop window): debounced; the address bar sliding on a phone doesn't count
  let wait = 0;
  const resized = () => { clearTimeout(wait); wait = setTimeout(() => { if (build()) { if (reduce || !raf) still(); } }, 160); };
  if (window.ResizeObserver) new ResizeObserver(resized).observe(cv); else addEventListener('resize', resized);

  // the pointer steers the centre beam on desktop; on touch screens any touch or scroll wakes the loop
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    px = e.clientX; py = e.clientY; lastMove = performance.now(); wake();
  }, { passive: true });
  const nudge = () => { lastInput = performance.now(); wake(); };
  const press = () => { hold = performance.now() + 250; nudge(); };
  if (touch) { addEventListener('scroll', nudge, { passive: true }); addEventListener('pointerdown', press, { passive: true }); }
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; if (!hidden) nudge(); });

  // a full-screen panel (phone menu, clearance panel) covers the city: rest until it closes
  const bar = document.querySelector('[data-topbar]'), drawer = document.querySelector('[data-drawer]');
  const check = () => { const was = covered; covered = !!(bar && bar.hasAttribute('data-open')) || !!(drawer && !drawer.hidden); if (was && !covered) nudge(); };
  if (window.MutationObserver) {
    const mo = new MutationObserver(check);
    if (bar) mo.observe(bar, { attributes: true, attributeFilter: ['data-open'] });
    if (drawer) mo.observe(drawer, { attributes: true, attributeFilter: ['hidden'] });
  }

  // lay the city out after the first paint, so it never holds up the page
  requestAnimationFrame(() => setTimeout(first, 0));
})();
