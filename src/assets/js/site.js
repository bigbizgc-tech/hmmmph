/* Blackout Syndicate 2.0 — core engine.
   Clearance (XP + levels), searchlight, redaction, drawer, toasts, lead form, X pixel events.
   Exposes window.BS for page scripts: BS.award(), BS.track(), BS.toast(), BS.state(), BS.level(). */
(() => {
  'use strict';
  const CFG = window.BS_CONFIG || {};
  const FILES = window.BS_FILES || [];
  const LEVELS = window.BS_LEVELS || [{ lv: 0, name: 'Outsider', xp: 0, unlock: '' }];
  const XP = window.BS_XP || { visit: 10, read: 15, quiz: 30, lead: 50, mark: 25, blackout: 20 };
  const host = document.querySelector('[data-path]') || document.body;
  const PATH = host.dataset.path || 'index.html';
  const ROOT = host.dataset.root || '';
  const KIND = host.dataset.kind || '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fileFor = (p) => FILES.find((f) => f.path === p);
  const TOTAL_MARKS = 3;

  /* ── Storage (per-viewer convenience; site works without it) ───────── */
  const KEY = 'bs2.clearance.v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const blank = () => ({ xp: 0, seen: {}, read: {}, marks: {}, quiz: false, lead: false, blackout: false, broken: {} });
  let S = Object.assign(blank(), load() || {});
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked */ } };
  const ss = {
    get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* blocked */ } },
  };

  const levelFor = (xp) => LEVELS.reduce((a, l) => (xp >= l.xp ? l : a), LEVELS[0]);
  const nextOf = (L) => LEVELS[L.lv + 1] || null;
  const progress = () => {
    const L = levelFor(S.xp), N = nextOf(L);
    if (!N) return { L, N, pct: 100 };
    return { L, N, pct: Math.round(((S.xp - L.xp) / (N.xp - L.xp)) * 100) };
  };

  /* ── Toasts ────────────────────────────────────────────────────────── */
  const toastBox = $('[data-toasts]');
  function toast(main, sub = '', big = '', tone = '') {
    if (!toastBox) return;
    const t = document.createElement('div');
    t.className = 'toast' + (tone ? ' toast--' + tone : '');
    t.innerHTML = `${big ? `<b>${big}</b>` : ''}<span>${main}</span>${sub ? `<small>${sub}</small>` : ''}`;
    if (!big) t.style.gridTemplateColumns = '1fr';
    toastBox.appendChild(t);
    while (toastBox.children.length > 3) toastBox.firstElementChild.remove();
    setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 400); }, tone === 'level' ? 6500 : 4200);
  }

  /* ── Awarding clearance ────────────────────────────────────────────── */
  // kind: seen | read | mark | quiz | lead | blackout
  function award(kind, id, amount, label) {
    if (kind === 'seen' || kind === 'read' || kind === 'mark') {
      if (S[kind === 'mark' ? 'marks' : kind][id]) return false;
      S[kind === 'mark' ? 'marks' : kind][id] = 1;
    } else {
      if (S[kind]) return false;
      S[kind] = true;
    }
    const before = levelFor(S.xp);
    S.xp += amount;
    save();
    const after = levelFor(S.xp);
    toast(label, 'Clearance', '+' + amount);
    if (after.lv > before.lv) {
      setTimeout(() => {
        toast(`Clearance raised to Level ${after.lv}: ${after.name}`, 'Unlocked · ' + after.unlock, 'LV' + after.lv, 'level');
        const hud = $('[data-hud]');
        if (hud) { hud.classList.remove('is-pulse'); void hud.offsetWidth; hud.classList.add('is-pulse'); }
      }, 700);
    }
    render(true);
    return true;
  }

  /* ── Rendering clearance everywhere ────────────────────────────────── */
  function render(animate) {
    const { L, N, pct } = progress();
    $$('[data-hud-lv]').forEach((e) => (e.textContent = L.lv));
    $$('[data-hud-name]').forEach((e) => (e.textContent = L.name));
    $$('[data-hud-bar]').forEach((e) => e.style.setProperty('--p', pct + '%'));
    const opened = FILES.filter((f) => S.seen[f.path]).length;
    $$('[data-files-count]').forEach((e) => (e.textContent = `${opened} / ${FILES.length}`));
    // visitor card(s)
    $$('[data-visitor]').forEach((card) => {
      const set = (k, v) => $$(`[data-v="${k}"]`, card).forEach((e) => (e.textContent = v));
      set('lv', L.lv); set('name', L.name); set('xp', S.xp); set('opened', `${opened} / ${FILES.length}`);
      set('next', N ? `${N.unlock} (Level ${N.lv})` : 'Everything. You are Inner Circle.');
      set('marks', `${Object.keys(S.marks).length} / ${TOTAL_MARKS}`);
      set('status', L.lv === 0 ? 'Uncleared' : L.lv >= 5 ? 'Inner Circle' : 'Cleared · LV ' + L.lv);
      $$('[data-v="bar"]', card).forEach((e) => e.style.setProperty('--p', pct + '%'));
    });
    renderClassified(animate);
    $$('[data-mark]').forEach((m) => { if (S.marks[m.dataset.mark]) { m.classList.add('is-found'); m.setAttribute('aria-label', 'Hidden mark, already claimed'); } });
    if (drawerOpen) renderDrawer();
  }

  /* ── Classified blocks ─────────────────────────────────────────────── */
  function wrapRx(el) {
    $$('.classified__body', el).forEach((b) => {
      const targets = $$(':scope > p, :scope li, :scope > h4, :scope dd, :scope dt, :scope td, :scope th', b);
      targets.forEach((t) => {
        if (t.querySelector(':scope > .rx')) return;
        const span = document.createElement('span');
        span.className = 'rx';
        while (t.firstChild) span.appendChild(t.firstChild);
        t.appendChild(span);
      });
    });
  }
  function renderClassified(animate) {
    const L = levelFor(S.xp);
    $$('[data-classified]').forEach((el) => {
      const need = +el.dataset.level;
      const id = el.dataset.classified;
      const open = L.lv >= need || (el.hasAttribute('data-bypass') && S.broken[id]);
      const status = $('[data-classified-status]', el);
      if (open) {
        if (el.classList.contains('is-locked') && animate) {
          el.classList.add('is-opening');
          setTimeout(() => el.classList.remove('is-opening'), 1500);
        }
        el.classList.remove('is-locked'); el.classList.add('is-open');
        if (status) status.textContent = '';
      } else {
        el.classList.add('is-locked'); el.classList.remove('is-open');
        if (status) {
          const target = LEVELS[need] || LEVELS[LEVELS.length - 1];
          const gap = Math.max(0, target.xp - S.xp);
          const files = Math.max(1, Math.ceil(gap / (XP.visit + XP.read)));
          status.innerHTML = `<span>Clearance ${need} required. You are Level ${L.lv}. About ${files} more file${files === 1 ? '' : 's'} read to the end gets you there.</span>`;
          const how = document.createElement('button');
          how.type = 'button'; how.textContent = 'How do I get clearance?';
          how.addEventListener('click', openDrawer);
          status.appendChild(how);
          if (el.hasAttribute('data-bypass')) {
            const b = document.createElement('button');
            b.type = 'button'; b.textContent = 'Break the seal anyway';
            b.addEventListener('click', () => { S.broken[id] = 1; save(); render(true); toast('Seal broken. No clearance for that one.', 'The Vault'); });
            status.appendChild(b);
          }
        }
      }
    });
  }

  /* ── Drawer ────────────────────────────────────────────────────────── */
  const drawer = $('[data-drawer]'), scrim = $('[data-scrim]');
  let drawerOpen = false, lastFocus = null;
  function renderDrawer() {
    const body = $('[data-drawer-body]');
    if (!body) return;
    const { L, N, pct } = progress();
    const markCount = Object.keys(S.marks).length;
    const earn = [
      ['Open a file', `+${XP.visit} each`, FILES.some((f) => S.seen[f.path])],
      ['Read a file to the end', `+${XP.read} each`, FILES.some((f) => S.read[f.path])],
      ['Find your package match', `+${XP.quiz}`, S.quiz, 'packages.html#match'],
      [`Find a hidden mark (${markCount}/${TOTAL_MARKS} found)`, `+${XP.mark} each`, markCount >= TOTAL_MARKS],
      ['Send the contact form', `+${XP.lead}`, S.lead, 'contact.html'],
      ['Say the name on the door. Just type it.', `+${XP.blackout}`, S.blackout],
    ];
    body.innerHTML = `
      <div class="dlv"><span class="dlv__num">${L.lv}</span><span class="dlv__name">${L.name}</span><span class="dlv__xp">${S.xp} clearance${N ? ` · ${N.xp - S.xp} to Level ${N.lv}: ${N.name}` : ' · maximum'}</span></div>
      <div class="meter" aria-hidden="true"><i style="--p:${pct}%"></i></div>
      <div class="dsec"><h3>Unlocks</h3><ul class="dlist">${LEVELS.slice(1).map((l) => `<li class="${S.xp >= l.xp ? 'is-done' : ''}"><span>${S.xp >= l.xp ? '✓' : l.lv}</span><span${S.xp >= l.xp ? '' : ' class="is-locked-text"'}>${l.unlock}</span><span>LV ${l.lv}</span></li>`).join('')}</ul></div>
      <div class="dsec"><h3>Earn clearance</h3><ul class="dlist">${earn.map(([t, x, done, href]) => `<li class="${done ? 'is-done' : ''}"><span>${done ? '✓' : '·'}</span><span>${href && !done ? `<a href="${ROOT + href}">${t}</a>` : t}</span><span>${x}</span></li>`).join('')}</ul></div>
      <div class="dsec"><h3>Files opened · ${FILES.filter((f) => S.seen[f.path]).length} / ${FILES.length}</h3><div class="dfiles">${FILES.map((f) => `<a href="${ROOT + f.path}" class="${S.seen[f.path] ? 'is-open' : ''}"><small>${f.file}${S.read[f.path] ? ' · read' : ''}</small>${f.title}</a>`).join('')}</div></div>
      ${L.lv >= 5 ? `<a class="btn btn--block" href="${ROOT}vault.html">Enter the Vault</a>` : `<a class="btn btn--ghost btn--block" href="${ROOT}vault.html">See the Vault door</a>`}
      <div class="dfoot" data-burn><span>Clearance lives in this browser only.</span><button type="button" data-burn-ask>Burn my file</button></div>`;
    const burn = $('[data-burn]', body);
    $('[data-burn-ask]', burn).addEventListener('click', () => {
      burn.innerHTML = '<span>Wipe your clearance and start over?</span><button type="button" data-burn-yes>Burn it</button><button type="button" data-burn-no>Keep it</button>';
      $('[data-burn-yes]', burn).addEventListener('click', () => { S = blank(); save(); render(); toast('File burned. Welcome back, Outsider.'); });
      $('[data-burn-no]', burn).addEventListener('click', renderDrawer);
    });
  }
  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    renderDrawer();
    drawer.hidden = false; scrim.hidden = false; drawerOpen = true;
    $$('[data-hud]').forEach((h) => h.setAttribute('aria-expanded', 'true'));
    drawer.focus();
  }
  function closeDrawer() {
    if (!drawerOpen) return;
    drawer.hidden = true; scrim.hidden = true; drawerOpen = false;
    $$('[data-hud]').forEach((h) => h.setAttribute('aria-expanded', 'false'));
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-hud], [data-hud-open]').forEach((b) => b.addEventListener('click', () => (drawerOpen ? closeDrawer() : openDrawer())));
  $$('[data-drawer-close]').forEach((b) => b.addEventListener('click', closeDrawer));
  scrim && scrim.addEventListener('click', closeDrawer);

  /* ── Nav ───────────────────────────────────────────────────────────── */
  const topbar = $('[data-topbar]'), burger = $('[data-burger]');
  if (burger && topbar) {
    const setMenu = (open) => { open ? topbar.setAttribute('data-open', '') : topbar.removeAttribute('data-open'); burger.setAttribute('aria-expanded', String(open)); document.documentElement.style.overflow = open ? 'hidden' : ''; };
    burger.addEventListener('click', () => setMenu(!topbar.hasAttribute('data-open')));
    $$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMenu(false); closeDrawer(); } });
  }
  const onScroll = () => topbar && topbar.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ── Searchlight: [data-spot] follows the pointer; [data-spot-idle] drifts on its own ── */
  function spot(el) {
    const layers = $$('[data-spot-layer]', el);
    let px = null, py = null, raf = 0, lastMove = 0, visible = true, t0 = performance.now();
    const apply = () => {
      raf = 0;
      el.style.setProperty('--x', px + 'px'); el.style.setProperty('--y', py + 'px');
      if (layers.length) {
        const er = el.getBoundingClientRect();
        layers.forEach((l) => { const lr = l.getBoundingClientRect(); l.style.setProperty('--x', px - (lr.left - er.left) + 'px'); l.style.setProperty('--y', py - (lr.top - er.top) + 'px'); });
      }
    };
    const move = (x, y) => { px = x; py = y; if (!raf) raf = requestAnimationFrame(apply); };
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); lastMove = performance.now(); move(e.clientX - r.left, e.clientY - r.top); });
    // idle drift is centred on the first lit layer (the headline), so phones see the light too
    const aim = () => {
      const r = el.getBoundingClientRect(), L = layers[0] ? layers[0].getBoundingClientRect() : r;
      return [L.left - r.left + L.width / 2, L.top - r.top + L.height / 2, L.width * 0.42, L.height * 0.32];
    };
    if (el.hasAttribute('data-spot-idle')) {
      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) tick(); }, { threshold: 0 });
      io.observe(el);
      const tick = () => {
        if (!visible) return;
        const now = performance.now();
        if (now - lastMove > 2600) {
          const [cx, cy, ax, ay] = aim(), t = (now - t0) / 1000;
          move(cx + ax * Math.sin(t * 0.42), cy + ay * Math.sin(t * 0.77 + 1.2));
        }
        if (!reduce) requestAnimationFrame(tick);
      };
      const [cx, cy, ax] = aim();
      move(cx - ax * 0.4, cy);
      tick();
    }
  }
  $$('[data-spot]').forEach(spot);
  // inner page headers glow toward the pointer
  $$('.pagehead').forEach((ph) => ph.addEventListener('pointermove', (e) => { const r = ph.getBoundingClientRect(); ph.style.setProperty('--x', ((e.clientX - r.left) / r.width) * 100 + '%'); ph.style.setProperty('--y', ((e.clientY - r.top) / r.height) * 100 + '%'); }));

  /* ── Reveal (only what starts below the fold, so the first frame is complete) ── */
  const rvs = $$('.rv');
  if (rvs.length && 'IntersectionObserver' in window && !reduce) {
    const vh = innerHeight;
    const io = new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('rv-in'); en.target.classList.remove('rv-wait'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rvs.forEach((el) => { if (el.getBoundingClientRect().top > vh * 0.92) { el.classList.add('rv-wait'); io.observe(el); } });
  }

  /* ── Copy buttons ──────────────────────────────────────────────────── */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const v = b.dataset.copy;
    const done = (txt) => { const o = b.textContent; b.textContent = txt; b.classList.add('is-done'); setTimeout(() => { b.textContent = o === 'Copied' ? 'Copy' : o; b.classList.remove('is-done'); }, 1800); };
    const fallback = () => { const s = getSelection(), r = document.createRange(); const target = b.previousElementSibling || b; r.selectNodeContents(target); s.removeAllRanges(); s.addRange(r); done('Selected'); };
    try { navigator.clipboard.writeText(v).then(() => done('Copied'), fallback); } catch (err) { fallback(); }
  });

  /* ── Hidden marks ──────────────────────────────────────────────────── */
  $$('[data-mark]').forEach((m) => m.addEventListener('click', () => {
    const n = Object.keys(S.marks).length + (S.marks[m.dataset.mark] ? 0 : 1);
    if (award('mark', m.dataset.mark, XP.mark, `Hidden mark found. ${n} of ${TOTAL_MARKS}.`)) m.classList.add('is-found');
  }));

  /* ── Lights out: type "blackout" anywhere ──────────────────────────── */
  const veil = $('[data-veil]');
  let buf = '', dark = false;
  const setDark = (on) => {
    dark = on; if (!veil) return; veil.hidden = !on;
    if (on) { toast('Lights out. Move to search. Type it again or press Esc to bring them back.', 'The name on the door'); award('blackout', '', XP.blackout, 'You said the name on the door.'); }
  };
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dark) return setDark(false);
    if (e.target.closest('input, textarea, select, [contenteditable]') || e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-8);
    if (buf === 'blackout') { buf = ''; setDark(!dark); }
  });
  addEventListener('pointermove', (e) => { if (dark && veil) { veil.style.setProperty('--mx', e.clientX + 'px'); veil.style.setProperty('--my', e.clientY + 'px'); } }, { passive: true });

  /* ── X pixel events ────────────────────────────────────────────────── */
  function track(name, params) {
    const id = (CFG.xEvents || {})[name];
    try { if (id && typeof window.twq === 'function') window.twq('event', id, params || {}); } catch (e) { /* never break the page */ }
  }
  if (['boost', 'plan', 'addon', 'service'].includes(KIND)) track('packageView', { contents: [{ content_id: host.dataset.offer, content_name: document.title }] });
  if (PATH === 'contact.html') track('contactView');

  /* ── Lead form ─────────────────────────────────────────────────────── */
  $$('form[data-lead]').forEach((form) => {
    const params = new URLSearchParams(location.search);
    const pre = params.get('pkg') || (ss.get('bs2.pkg') || '');
    const sel = form.querySelector('[name="interest"]');
    if (sel && pre) { const opt = [...sel.options].find((o) => o.value === pre || o.dataset.slug === pre); if (opt) sel.value = opt.value; }
    const alertBox = form.querySelector('[data-form-alert]');
    const btn = form.querySelector('[type="submit"]');
    const fieldErr = (input, msg) => {
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const err = form.querySelector(`[data-err-for="${input.name}"]`);
      if (err) err.textContent = msg || '';
    };
    form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') fieldErr(e.target, ''); });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.querySelector('[name="_honey"]')?.value) return;
      let first = null;
      $$('[required]', form).forEach((inp) => {
        let msg = '';
        if (!inp.value.trim()) msg = inp.dataset.msg || 'This one is needed.';
        else if (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value.trim())) msg = 'That email looks off. Check for a typo.';
        fieldErr(inp, msg); if (msg && !first) first = inp;
      });
      if (first) { first.focus(); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      delete data._honey;
      const interestLabel = sel ? sel.options[sel.selectedIndex].text : data.interest;
      const payload = { ...data, interest: interestLabel, page: PATH, _subject: `Blackout Syndicate lead: ${interestLabel}`, _template: 'table', _captcha: 'false' };
      const summary = Object.entries({ Name: data.name, 'Business / channel': data.business, Email: data.email, Phone: data.phone, 'Interested in': interestLabel, Platform: data.platform, Message: data.message }).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
      btn.disabled = true; const label = btn.innerHTML; btn.textContent = 'Sending…';
      if (alertBox) alertBox.hidden = true;
      let ok = false;
      if (CFG.previewMode || !CFG.formEndpoint) ok = true;
      else {
        try {
          const res = await fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
          const j = await res.json().catch(() => ({}));
          ok = res.ok && j.success !== false && j.success !== 'false' && j.ok !== false;
        } catch (err) { ok = false; }
      }
      if (ok) {
        ss.set('bs2.lead', { name: (data.name || '').split(' ')[0], interest: interestLabel, slug: sel?.selectedOptions[0]?.dataset.slug || '', preview: !!CFG.previewMode });
        track('formSubmit', { contents: [{ content_name: interestLabel }] });
        location.href = ROOT + 'thank-you.html';
        return;
      }
      btn.disabled = false; btn.innerHTML = label;
      if (alertBox) {
        alertBox.hidden = false;
        alertBox.innerHTML = `<strong>It didn’t go through. Your message is safe below.</strong><span>Call or text (574) 213-9097, or email info@blackoutsyn.com and paste this in:</span><pre style="white-space:pre-wrap;margin:0;font-family:var(--f-type);font-size:14px;color:var(--paper)">${summary.replace(/[<&]/g, (c) => (c === '<' ? '&lt;' : '&amp;'))}</pre><span><button class="copy" type="button" data-copy="${summary.replace(/"/g, '&quot;')}">Copy message</button></span>`;
        alertBox.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      }
    });
  });
  // remember which package a visitor was looking at, so the form can preselect it
  if (host.dataset.offer) ss.set('bs2.pkg', host.dataset.offer);

  /* ── Thank-you page ────────────────────────────────────────────────── */
  if (PATH === 'thank-you.html') {
    const lead = ss.get('bs2.lead');
    if (lead) {
      $$('[data-lead-name]').forEach((e) => (e.textContent = lead.name || 'friend'));
      $$('[data-lead-interest]').forEach((e) => (e.textContent = lead.interest || 'your file'));
      $$('[data-lead-preview]').forEach((e) => (e.hidden = !lead.preview));
      if (!ss.get('bs2.leadTracked')) { track('lead', { contents: [{ content_name: lead.interest }] }); ss.set('bs2.leadTracked', true); }
      setTimeout(() => award('lead', '', XP.lead, 'Contact made. Your file is on the desk.'), 900);
    }
  }

  /* ── Page visit + read-to-the-end ──────────────────────────────────── */
  const file = fileFor(PATH);
  wrapRx(document);
  render(false);
  if (file) {
    setTimeout(() => award('seen', PATH, XP.visit, `File opened: ${file.title}`), 1100);
    const sentinel = $('[data-read]');
    const start = performance.now();
    if (sentinel && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        const wait = Math.max(0, 3500 - (performance.now() - start));
        setTimeout(() => award('read', PATH, XP.read, `File read to the end: ${file.title}`), wait);
        io.disconnect();
      });
      io.observe(sentinel);
    }
  }

  $$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));

  window.BS = { award, track, toast, state: () => S, level: () => levelFor(S.xp), progress, open: openDrawer, XP, LEVELS, FILES, reduce, finePointer };
  document.dispatchEvent(new CustomEvent('bs:ready'));
})();
