/* Blackout Syndicate 2.0 — core engine.
   Clearance (XP + levels), searchlight, redaction, drawer, toasts, lead form, X pixel events.
   Exposes window.BS for page scripts: BS.award(), BS.track(), BS.toast(), BS.state(), BS.stamps(), BS.level(). */
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
  const file = fileFor(PATH);
  const TOTAL_MARKS = 3;
  const ARW = '<svg class="arw" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>';
  const escHtml = (s) => String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));

  /* ── Storage (per-viewer convenience; site works without it) ───────── */
  // localStorage first; then this tab's sessionStorage; then window.name, which survives
  // same-tab navigation on the same site when a browser blocks all site storage.
  const KEY = 'bs2.clearance.v1';
  let storeKind = 'none';
  const store = (() => { for (const k of ['localStorage', 'sessionStorage']) { try { const s = window[k]; s.setItem('bs2.t', '1'); s.removeItem('bs2.t'); storeKind = k; return s; } catch (e) { /* blocked */ } } return null; })();
  const load = () => { try { return JSON.parse(store ? store.getItem(KEY) : (window.name.startsWith('bs2:') ? window.name.slice(4) : 'null')) || null; } catch (e) { return null; } };
  const blank = () => ({ xp: 0, seen: {}, read: {}, marks: {}, quiz: false, lead: false, blackout: false, broken: {}, cl: {}, cleared: false });
  let S = Object.assign(blank(), load() || {});
  const save = () => { const v = JSON.stringify(S); try { if (store) store.setItem(KEY, v); else window.name = 'bs2:' + v; } catch (e) { /* storage blocked */ } };
  // Re-read before every write, so two open tabs never overwrite each other's progress.
  const sync = () => { const d = load(); if (d) S = Object.assign(blank(), d); };
  const ss = {
    get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* blocked */ } },
  };
  const LEAD_TOKEN = 'bs2.leadToken'; // one-time proof that this tab just sent the lead form

  const levelFor = (xp) => LEVELS.reduce((a, l) => (xp >= l.xp ? l : a), LEVELS[0]);
  const nextOf = (L) => LEVELS[L.lv + 1] || null;
  const progress = () => {
    const L = levelFor(S.xp), N = nextOf(L);
    if (!N) return { L, N, pct: 100 };
    return { L, N, pct: Math.round(((S.xp - L.xp) / (N.xp - L.xp)) * 100) };
  };
  // A level's reward lives in classified blocks whose id matches its `cl` ("math-" matches every math-*).
  const clMatch = (id, cl) => !!cl && (cl.endsWith('-') ? id.startsWith(cl) : id === cl);
  const isReward = (id) => LEVELS.some((l) => l.cl && l.cl !== 'vault' && clMatch(id, l.cl));
  const blockHere = (cl) => $$('[data-classified]').find((el) => clMatch(el.dataset.classified, cl));
  // Where a level's reward can be read: on this page if it is here, otherwise its home page.
  const hrefFor = (l) => { const here = l.cl && blockHere(l.cl); return here ? '#cl-' + here.dataset.classified : l.href ? ROOT + l.href : ''; };
  const pulseHud = () => { const hud = $('[data-hud]'); if (hud) { hud.classList.remove('is-pulse'); void hud.offsetWidth; hud.classList.add('is-pulse'); } };

  /* ── Toasts ────────────────────────────────────────────────────────── */
  // toast(main, sub, big, tone, href, note). A toast never takes a tap or click meant for the page:
  // the toast ignores the pointer, and only its small link label (when href is given) can be tapped.
  // '#clearance' opens the drawer. Phones show one toast at a time, pinned under the top bar, and a
  // scroll sends it away; desktop shows at most two, top right under the clearance meter.
  // Toasts wait while a lead form is on screen or any field is in use, while a classified sheet is
  // declassifying, while the drawer or phone menu is open and while the lights are out. When the way
  // is clear, the important ones (level-ups, links) show and small stale ones are dropped.
  // opt (engine only): { go: link label, force: show even while held, transient: drop if held }.
  const toastBox = $('[data-toasts]');
  const narrow = matchMedia('(max-width: 600px)');
  const leadForms = $$('form[data-lead]');
  let live = [], waiting = [], swapT = 0, swapNext = null, releaseT = 0, formSeen = false, dark = false;
  const priOf = (tone, href) => (tone === 'level' || href ? 2 : 1);
  function held() {
    const a = document.activeElement;
    return formSeen || dark || drawerOpen || !!(topbar && topbar.hasAttribute('data-open'))
      || !!(a && a.closest && (a.closest('form[data-lead]') || a.matches('input, textarea, select, [contenteditable="true"]')))
      || !!$('.classified.is-opening');
  }
  function dropToast(t) {
    clearTimeout(t.timer);
    live = live.filter((x) => x !== t);
    if (t.el.classList.contains('is-out')) return;
    t.el.classList.add('is-out');
    setTimeout(() => t.el.remove(), 380);
  }
  const clearToasts = () => live.slice().forEach(dropToast);
  function placeToasts() {
    // sit just under the sticky top bar (its height changes with the breakpoint and the safe area)
    const bar = topbar && topbar.getBoundingClientRect();
    if (bar && bar.bottom > 0) toastBox.style.setProperty('--toast-top', Math.round(bar.bottom + 8) + 'px');
    const end = $('.topbar__end');
    if (end) toastBox.style.setProperty('--toast-right', Math.max(16, Math.round(document.documentElement.clientWidth - end.getBoundingClientRect().right)) + 'px');
  }
  function showToast(t) {
    if (narrow.matches) {
      // one at a time: a newer toast replaces the one on screen, but a level-up gets a moment first
      const cur = live[live.length - 1];
      if (cur) {
        const left = (cur.pri > 1 ? 1600 : 900) - (Date.now() - cur.shown);
        if (left > 0 && cur.pri > t.pri) {
          if (!swapNext || t.pri >= swapNext.pri) swapNext = t;
          clearTimeout(swapT); swapT = setTimeout(() => { const n = swapNext; swapNext = null; if (n) showToast(n); }, left);
          return;
        }
        clearToasts();
      }
    } else while (live.length >= 2) dropToast(live[0]);
    placeToasts();
    const el = document.createElement('div');
    el.className = 'toast' + (t.tone ? ' toast--' + t.tone : '') + (t.big ? '' : ' toast--plain') + (t.href ? ' toast--link' : '');
    const go = t.go || (t.href === '#clearance' ? 'See your clearance' : /#syndicate-id/.test(t.href) ? 'Get your Syndicate ID' : /vault\.html/.test(t.href) ? 'Go to the Vault' : 'Read it now');
    el.innerHTML = `${t.big ? `<b class="toast__big">${t.big}</b>` : ''}<span class="toast__txt"><span class="toast__main">${t.main}</span>${t.sub ? `<small class="toast__sub">${t.sub}</small>` : ''}${t.note ? `<span class="toast__note">${t.note}</span>` : ''}</span>${t.href ? `<a class="toast__go" href="${t.href}">${go} →</a>` : ''}`;
    const link = $('.toast__go', el);
    if (link && t.href === '#clearance') link.addEventListener('click', (e) => { e.preventDefault(); openDrawer(); });
    toastBox.appendChild(el);
    t.el = el; t.shown = Date.now(); t.y0 = scrollY;
    live.push(t);
    const time = narrow.matches ? (t.pri > 1 ? 3600 : 3000) : t.note ? 6500 : t.pri > 1 ? 6000 : 4200;
    const out = () => { if (el.contains(document.activeElement)) t.timer = setTimeout(out, 1500); else dropToast(t); };
    t.timer = setTimeout(out, time);
  }
  function release() {
    clearTimeout(releaseT);
    releaseT = setTimeout(() => {
      if (!waiting.length) return;
      // a sheet mid-declassify is done in about 1.5 s: look again then; everything else calls back here
      if (held()) { if ($('.classified.is-opening')) release(); return; }
      const now = Date.now();
      // level-ups and links always get shown; a small "+10" that waited more than 12 s is old news
      const keep = waiting.filter((t) => t.pri > 1 || now - t.at < 12000).sort((a, b) => b.pri - a.pri || b.at - a.at).slice(0, narrow.matches ? 1 : 2).reverse();
      waiting = [];
      keep.forEach((t, i) => setTimeout(() => showToast(t), i * 300));
    }, 500);
  }
  function toast(main, sub = '', big = '', tone = '', href = '', note = '', opt = {}) {
    if (!toastBox) return;
    const t = { main, sub, big, tone, href, note, go: opt.go, pri: priOf(tone, href), at: Date.now() };
    if (held() && !opt.force) {
      if (opt.transient) return;
      waiting.push(t);
      if (waiting.length > 4) waiting.shift();
      release();
      return;
    }
    showToast(t);
  }
  if (toastBox) {
    // a phone toast goes away once the visitor scrolls on
    addEventListener('scroll', () => {
      if (!narrow.matches) return;
      live.slice().forEach((t) => { if (Date.now() - t.shown > 700 && Math.abs(scrollY - t.y0) > 48) dropToast(t); });
    }, { passive: true });
    // a lead form on screen clears the way and holds new toasts until it is gone again
    if (leadForms.length && 'IntersectionObserver' in window) {
      const seen = new Set();
      const io = new IntersectionObserver((ens) => {
        ens.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
        formSeen = seen.size > 0;
        if (formSeen) clearToasts(); else release();
      });
      leadForms.forEach((f) => io.observe(f));
    }
    document.addEventListener('focusin', (e) => { if (e.target.closest && e.target.closest('form[data-lead]')) clearToasts(); });
    document.addEventListener('focusout', release);
  }

  /* ── Awarding clearance ────────────────────────────────────────────── */
  // kind: seen | read | mark | quiz | lead | blackout
  // One award makes one toast: the biggest news leads (all three marks, Archive cleared, a new level)
  // and the clearance it paid rides along on the small line. opt (engine only): { quiet, href }.
  const ID_HREF = ROOT + 'vault.html#syndicate-id';
  const ARCHIVE_NOTE = 'bs2.archiveNote';
  function award(kind, id, amount, label, opt = {}) {
    sync();
    if (kind === 'seen' || kind === 'read' || kind === 'mark') {
      const bag = S[kind === 'mark' ? 'marks' : kind];
      if (bag[id]) return false;
      bag[id] = 1;
    } else {
      if (S[kind]) return false;
      S[kind] = true;
    }
    const first = S.xp === 0;
    const before = levelFor(S.xp);
    S.xp += amount;
    const after = levelFor(S.xp), up = after.lv > before.lv;
    const allMarks = kind === 'mark' && Object.keys(S.marks).length >= TOTAL_MARKS;
    const cleared = kind === 'read' && !S.cleared && FILES.length > 0 && FILES.every((f) => S.read[f.path]);
    if (cleared) S.cleared = true;
    save();
    const plus = '+' + amount;
    const lvLine = `Level ${after.lv}: ${after.name}`;
    const unlocked = LEVELS.filter((l) => l.lv > before.lv && l.lv <= after.lv).map((l) => l.unlock).join(' + ');
    // The Archive seal on the contact page would pull people off the form: it waits for the next page.
    const holdSeal = cleared && PATH === 'contact.html';
    if (holdSeal) ss.set(ARCHIVE_NOTE, 1);
    if (allMarks) toast('All three marks. The fedora is yours.', `${plus} · ${up ? 'Clearance raised to ' + lvLine : 'Hidden mark 3 of 3'}`, '3/3', 'level', ID_HREF);
    else if (cleared && !holdSeal) toast('Archive cleared. Every file read.', `${plus} · ${up ? 'Clearance raised to ' + lvLine : 'The whole Archive is yours'}`, FILES.length + '/' + FILES.length, 'level', ID_HREF);
    else if (up) toast(`Clearance raised to ${lvLine}`, `${plus} · ${label}`, 'LV' + after.lv, 'level', hrefFor(after), 'Unlocked: ' + unlocked);
    // A first-time visitor (often straight from an ad) learns what clearance is, once.
    else if (first) toast(label, 'Clearance', plus, '', '#clearance', 'Every page you read raises your clearance and opens classified files.', { go: 'How clearance works' });
    else if (!opt.quiet) toast(label, 'Clearance', plus, '', opt.href || '');
    if (first || up) pulseHud();
    render(true);
    return true;
  }

  /* ── Rendering clearance everywhere ────────────────────────────────── */
  function render(animate) {
    if (PATH === 'vault.html' && levelFor(S.xp).lv >= 5 && !S.cl.vault) { sync(); S.cl.vault = 1; save(); }
    const { L, N, pct } = progress();
    $$('[data-hud-lv]').forEach((e) => (e.textContent = L.lv));
    $$('[data-hud-name]').forEach((e) => (e.textContent = L.name));
    $$('[data-hud-bar]').forEach((e) => e.style.setProperty('--p', pct + '%'));
    const opened = FILES.filter((f) => S.seen[f.path]).length;
    const readN = FILES.filter((f) => S.read[f.path]).length, allRead = FILES.length > 0 && readN === FILES.length;
    $$('[data-files-count]').forEach((e) => (e.textContent = `${opened} / ${FILES.length}`));
    // visitor card(s)
    $$('[data-visitor]').forEach((card) => {
      const set = (k, v) => $$(`[data-v="${k}"]`, card).forEach((e) => (e.textContent = v));
      set('lv', L.lv); set('name', L.name); set('xp', S.xp); set('opened', `${opened} / ${FILES.length}`);
      set('next', N ? `${N.unlock} (Level ${N.lv})` : allRead ? 'Everything. Archive cleared.' : `The Archive seal: read every file (${readN} / ${FILES.length})`);
      set('marks', `${Object.keys(S.marks).length} / ${TOTAL_MARKS}`);
      set('status', L.lv === 0 ? 'Uncleared' : L.lv >= 5 ? 'Inner Circle' : 'Cleared · LV ' + L.lv);
      $$('[data-v="bar"]', card).forEach((e) => e.style.setProperty('--p', pct + '%'));
    });
    renderClassified(animate);
    $$('[data-mark]').forEach((m) => { if (S.marks[m.dataset.mark]) { m.classList.add('is-found'); m.setAttribute('aria-label', 'Hidden mark, already claimed'); } });
    // Never rebuild the drawer under an open "Burn it?" question.
    if (drawerOpen && !$('[data-burn-yes]', drawer)) renderDrawer();
    document.dispatchEvent(new CustomEvent('bs:change', { detail: { xp: S.xp, lv: levelFor(S.xp).lv } }));
    renderJump();
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
  let declassToasted = false;
  const isOpenFor = (el) => levelFor(S.xp).lv >= +el.dataset.level || (el.hasAttribute('data-bypass') && !!S.broken[el.dataset.classified]);
  function renderClassified(animate) {
    const L = levelFor(S.xp);
    $$('[data-classified]').forEach((el) => {
      const need = +el.dataset.level;
      const id = el.dataset.classified;
      const open = isOpenFor(el);
      const status = $('[data-classified-status]', el);
      const links = $$('.classified__body a', el);
      // A level's reward that hasn't been read yet waits for the visitor, then declassifies in view.
      const fresh = open && !S.cl[id] && isReward(id) && !reduce && 'IntersectionObserver' in window;
      if (fresh) {
        if (el.dataset.watch) return;
        el.dataset.watch = '1';
        el.classList.add('is-locked'); el.classList.remove('is-open');
        links.forEach((a) => (a.tabIndex = -1));
        if (status) { status.dataset.sig = ''; status.innerHTML = `<span>Cleared at Level ${L.lv}. Declassifying as you read.</span>`; }
        const io = new IntersectionObserver(([en]) => {
          if (!en.isIntersecting) return;
          io.disconnect(); delete el.dataset.watch;
          sync();
          if (isOpenFor(el)) {
            S.cl[id] = 1; save();
            el.classList.add('is-opening');
            setTimeout(() => el.classList.remove('is-opening'), 1500);
            if (!declassToasted) { declassToasted = true; toast('Declassified: ' + ($('.classified__title', el) || {}).textContent, 'Clearance ' + need); }
          }
          render(false);
        }, { rootMargin: '0px 0px -25% 0px' });
        io.observe(el);
        return;
      }
      if (open) {
        if (!S.cl[id]) { sync(); S.cl[id] = 1; save(); }
        if (el.classList.contains('is-locked') && animate) {
          el.classList.add('is-opening');
          setTimeout(() => el.classList.remove('is-opening'), 1500);
        }
        el.classList.remove('is-locked'); el.classList.add('is-open');
        links.forEach((a) => a.removeAttribute('tabindex'));
        if (status) { status.textContent = ''; status.dataset.sig = ''; }
      } else {
        el.classList.add('is-locked'); el.classList.remove('is-open');
        // Redacted links stay in the page for screen readers but leave the tab order.
        links.forEach((a) => (a.tabIndex = -1));
        if (status) {
          const target = LEVELS[need] || LEVELS[LEVELS.length - 1];
          const gap = Math.max(0, target.xp - S.xp);
          const pending = (file && !S.read[PATH] ? XP.read : 0) + (file && !S.seen[PATH] ? XP.visit : 0);
          const left = gap - pending;
          const markHere = $$('[data-mark]').some((m) => !S.marks[m.dataset.mark]);
          const n = Math.max(1, Math.ceil(left / (XP.visit + XP.read)));
          const match = `<a href="${PATH === 'packages.html' ? '' : ROOT + 'packages.html'}#match">three-question package match</a> (+${XP.quiz})`;
          // the fastest real next step first; a hidden mark on this page is mentioned as a bonus
          const tip = (left <= 0 ? 'Read this page to the end and it opens.'
            : !S.quiz && gap <= XP.quiz ? `Take the ${match} and it opens now.`
            : !S.quiz && left <= XP.quiz ? `Take the ${match} and read this page to the end, and it opens.`
            : `About ${n} more file${n === 1 ? '' : 's'} read to the end gets you there.`)
            + (left > 0 && markHere ? ` There’s also a hidden mark on this page worth +${XP.mark}.` : '');
          const msg = `Clearance ${need} required. You are Level ${L.lv}. ${tip}`;
          if (status.dataset.sig === msg) return; // unchanged: keep the buttons (and any focus on them)
          status.dataset.sig = msg;
          status.innerHTML = `<span>${msg}</span>`;
          const how = document.createElement('button');
          how.type = 'button'; how.textContent = 'How do I get clearance?';
          how.addEventListener('click', openDrawer);
          status.appendChild(how);
          if (el.hasAttribute('data-bypass')) {
            const b = document.createElement('button');
            b.type = 'button'; b.textContent = 'Break the seal anyway';
            b.addEventListener('click', () => { sync(); S.broken[id] = 1; S.cl[id] = 1; save(); render(true); toast('Seal broken. No clearance for that one.', 'The Vault'); });
            status.appendChild(b);
          }
        }
      }
    });
  }

  /* ── "Just declassified": the next-file slot points at a reward the visitor hasn't read ── */
  function renderJump() {
    const slot = $('[data-jump]');
    if (!slot) return;
    const L = levelFor(S.xp);
    const seen = (cl) => Object.keys(S.cl).some((x) => clMatch(x, cl));
    const here = (cl) => !!blockHere(cl) || (cl === 'vault' && PATH === 'vault.html');
    const due = LEVELS.filter((l) => l.lv && l.lv <= L.lv && l.href && l.cl && !seen(l.cl) && !here(l.cl)).pop();
    const sig = due ? String(due.lv) : '';
    if (slot.dataset.sig === sig) return;
    slot.dataset.sig = sig;
    slot.hidden = !due;
    slot.innerHTML = due ? `<a class="nextfile__card nextfile__card--jump" href="${ROOT + due.href}"><span class="label">Just declassified · Level ${due.lv}: ${due.name}</span><span class="nextfile__title">${due.unlock}</span><span class="nextfile__go">${due.lv >= 5 ? 'Enter the Vault' : 'Read it now'} ${ARW}</span></a>` : '';
  }

  /* ── Drawer (a modal dialog: the page behind it is inert while it is open) ── */
  const drawer = $('[data-drawer]'), scrim = $('[data-scrim]');
  const drawerBody = $('[data-drawer-body]');
  let drawerOpen = false, lastFocus = null;
  const behindDrawer = () => [$('.skip'), $('[data-topbar]'), $('main'), $('.foot')].filter(Boolean);
  function renderDrawer() {
    const body = drawerBody;
    if (!body) return;
    const focusables = () => $$('a, button', body);
    const f = focusables().indexOf(document.activeElement);
    const { L, N, pct } = progress();
    const markCount = Object.keys(S.marks).length;
    const readN = FILES.filter((x) => S.read[x.path]).length, allRead = FILES.length > 0 && readN === FILES.length;
    const earn = [
      ['Open a file', `+${XP.visit} each`, FILES.some((x) => S.seen[x.path])],
      ['Read a file to the end', `+${XP.read} each`, FILES.some((x) => S.read[x.path])],
      ['Find your package match', `+${XP.quiz}`, S.quiz, 'packages.html#match'],
      [`Find a hidden mark (${markCount}/${TOTAL_MARKS} found)`, `+${XP.mark} each`, markCount >= TOTAL_MARKS],
      ['Send the contact form', `+${XP.lead}`, S.lead, 'contact.html'],
      finePointer ? ['Say the name on the door. Just type it.', `+${XP.blackout}`, S.blackout] : ['Say the name on the door (there’s a box in the Vault)', `+${XP.blackout}`, S.blackout, 'vault.html#get-in'],
    ];
    const unlocks = LEVELS.slice(1).map((l) => {
      const done = S.xp >= l.xp, href = done ? hrefFor(l) : '';
      const txt = href ? `<a href="${href}">${l.unlock}</a>` : l.unlock;
      // the next level's prize is readable, so there's something to aim at; further ones stay redacted
      const hide = !done && l.lv > L.lv + 1;
      return `<li class="${done ? 'is-done' : ''}"><span>${done ? '✓' : l.lv}</span><span${hide ? ' class="is-locked-text"' : ''}>${txt}</span><span>LV ${l.lv}</span></li>`;
    }).join('');
    const kept = storeKind === 'localStorage' ? 'Clearance lives in this browser only.' : 'This browser blocks site storage, so clearance only lasts while this tab is open.';
    body.innerHTML = `
      <div class="dlv"><span class="dlv__num">${L.lv}</span><span class="dlv__name">${L.name}</span><span class="dlv__xp">${S.xp} clearance${N ? ` · ${N.xp - S.xp} to Level ${N.lv}: ${N.name}` : ` · ${readN}/${FILES.length} files read${allRead ? ' · Archive cleared' : ' · read them all for the Archive seal'}`}</span></div>
      <div class="meter" aria-hidden="true"><i style="--p:${pct}%"></i></div>
      <div class="dsec"><h3>Unlocks</h3><ul class="dlist">${unlocks}</ul></div>
      <div class="dsec"><h3>Earn clearance</h3><ul class="dlist">${earn.map(([t, x, done, href]) => `<li class="${done ? 'is-done' : ''}"><span>${done ? '✓' : '·'}</span><span>${href && !done ? `<a href="${ROOT + href}">${t}</a>` : t}</span><span>${x}</span></li>`).join('')}</ul></div>
      <div class="dsec"><h3>Files opened · ${FILES.filter((x) => S.seen[x.path]).length} / ${FILES.length}</h3><div class="dfiles">${FILES.map((x) => `<a href="${ROOT + x.path}" class="${S.seen[x.path] ? 'is-open' : ''}"><small>${x.file}${S.read[x.path] ? ' · read' : ''}</small>${x.title}</a>`).join('')}</div></div>
      ${L.lv >= 5 ? `<a class="btn btn--block" href="${ROOT}vault.html">Enter the Vault</a>` : `<a class="btn btn--ghost btn--block" href="${ROOT}vault.html">See the Vault door</a>`}
      <div class="dfoot" data-burn><span>${kept}</span><button type="button" data-burn-ask>Burn my file</button></div>`;
    if (f >= 0 && drawerOpen) (focusables()[f] || drawer).focus();
    const burn = $('[data-burn]', body);
    $('[data-burn-ask]', burn).addEventListener('click', () => {
      burn.innerHTML = '<span>Wipe your clearance and start over?</span><button type="button" data-burn-yes>Burn it</button><button type="button" data-burn-no>Keep it</button>';
      $('[data-burn-yes]', burn).addEventListener('click', () => {
        S = blank(); save();
        // Keep 'bs2.leadTracked' so the X conversion is never counted twice.
        try { localStorage.removeItem('bs2.match'); } catch (e) { /* blocked */ }
        try { sessionStorage.removeItem('bs2.lead'); sessionStorage.removeItem('bs2.vaultHello'); } catch (e) { /* blocked */ }
        $$('[data-mark].is-found').forEach((m) => { m.classList.remove('is-found'); m.setAttribute('aria-label', 'Hidden mark. Claim it for clearance.'); });
        render();
        renderDrawer();
        const ask = $('[data-burn-ask]', body); (ask || drawer).focus();
        toast('File burned. Welcome back, Outsider.');
      });
      $('[data-burn-no]', burn).addEventListener('click', () => { renderDrawer(); const ask = $('[data-burn-ask]', body); (ask || drawer).focus(); });
      $('[data-burn-no]', burn).focus();
    });
  }
  function openDrawer() {
    if (!drawer || drawerOpen) return;
    if (topbar && topbar.hasAttribute('data-open')) setMenu(false);
    lastFocus = document.activeElement;
    drawerOpen = true;
    clearToasts();
    renderDrawer();
    drawer.hidden = false; scrim.hidden = false;
    behindDrawer().forEach((el) => (el.inert = true));
    $$('[data-hud]').forEach((h) => h.setAttribute('aria-expanded', 'true'));
    drawer.focus();
  }
  function closeDrawer(restore = true) {
    if (!drawerOpen) return;
    behindDrawer().forEach((el) => (el.inert = false));
    drawer.hidden = true; scrim.hidden = true; drawerOpen = false;
    $$('[data-hud]').forEach((h) => h.setAttribute('aria-expanded', 'false'));
    release();
    if (!restore) return;
    // a toast that opened the drawer may be gone by now: fall back to the HUD
    const back = lastFocus && lastFocus.isConnected && !lastFocus.closest('[data-toasts]') ? lastFocus : $('[data-hud]');
    if (back && back.focus) back.focus();
  }
  $$('[data-hud], [data-hud-open]').forEach((b) => b.addEventListener('click', () => (drawerOpen ? closeDrawer() : openDrawer())));
  $$('[data-drawer-close]').forEach((b) => b.addEventListener('click', () => closeDrawer()));
  scrim && scrim.addEventListener('click', () => closeDrawer());
  // following a link inside the drawer (often to a spot on this same page) closes it
  drawerBody && drawerBody.addEventListener('click', (e) => { if (e.target.closest('a')) closeDrawer(false); });

  /* ── Nav ───────────────────────────────────────────────────────────── */
  const topbar = $('[data-topbar]'), burger = $('[data-burger]');
  // While the phone menu is open, everything it covers is inert, so Tab stays in the menu and the burger.
  const behindMenu = () => [$('.skip'), $('main'), $('.foot'), $('[data-hud]'), $('.topbar__cta'), ...(topbar ? $$('.brand', topbar) : [])].filter(Boolean);
  function setMenu(open, refocus) {
    if (!burger || !topbar) return;
    const was = topbar.hasAttribute('data-open');
    open ? topbar.setAttribute('data-open', '') : topbar.removeAttribute('data-open');
    burger.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open === was) return;
    if (open) clearToasts(); else release();
    behindMenu().forEach((el) => (el.inert = open));
    if (open) { const a = $('#menu a'); if (a) a.focus(); }
    else if (refocus || (document.activeElement && document.activeElement.closest('#menu'))) burger.focus();
  }
  if (burger && topbar) {
    burger.addEventListener('click', () => setMenu(!topbar.hasAttribute('data-open')));
    $$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    // rotating or resizing to desktop width closes the phone menu (and gives the page its scroll back)
    const wide = matchMedia('(min-width: 961px)');
    const onWide = (e) => { if (e.matches) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide); else if (wide.addListener) wide.addListener(onWide);
  }
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (drawerOpen) { closeDrawer(); return; }
    if (topbar && topbar.hasAttribute('data-open')) setMenu(false, true);
  });
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
    if (!b.dataset.label) b.dataset.label = b.textContent;
    const done = (txt) => {
      b.textContent = txt; b.classList.add('is-done');
      toast(txt === 'Copied' ? 'Copied to clipboard' : 'Selected. Copy it from your menu.', '', '', '', '', '', { transient: true });
      setTimeout(() => { b.textContent = b.dataset.label; b.classList.remove('is-done'); }, 1800);
    };
    const fallback = () => {
      const s = getSelection(), r = document.createRange();
      const alert = b.closest('[data-form-alert]');
      const target = b.previousElementSibling || (alert && $('pre', alert)) || b;
      r.selectNodeContents(target); s.removeAllRanges(); s.addRange(r); done('Selected');
    };
    try { navigator.clipboard.writeText(v).then(() => done('Copied'), fallback); } catch (err) { fallback(); }
  });

  /* ── Hidden marks ──────────────────────────────────────────────────── */
  $$('[data-mark]').forEach((m) => m.addEventListener('click', () => {
    sync();
    const n = Object.keys(S.marks).length + (S.marks[m.dataset.mark] ? 0 : 1);
    if (award('mark', m.dataset.mark, XP.mark, `Hidden mark found. ${n} of ${TOTAL_MARKS}.`)) m.classList.add('is-found');
  }));

  /* ── Lights out: type "blackout" anywhere (on touch screens: the box in the Vault) ── */
  const veil = $('[data-veil]');
  let buf = '';
  // In the dark there is one toast: how to get the lights back, carrying the +20 the first time.
  // Anything else (a level-up the +20 caused, page toasts) waits until the lights come back.
  const setDark = (on) => {
    if (!veil) return;
    dark = on; veil.hidden = !on;
    if (toastBox) toastBox.classList.toggle('is-dark', on);
    if (on) {
      clearToasts();
      const paid = award('blackout', '', XP.blackout, 'You said the name on the door.', { quiet: true });
      toast(finePointer ? 'Lights out. Move your pointer to search the dark. Type it again or press Esc to bring them back.' : 'Lights out. Tap to search the dark. Say it again in the Vault box to bring them back.', paid ? `+${XP.blackout} · You said the name on the door` : 'The name on the door', paid ? '+' + XP.blackout : '', '', '', '', { force: true });
    } else { clearToasts(); release(); }
  };
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dark) return setDark(false);
    if (e.target.closest('input, textarea, select, [contenteditable]') || e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-8);
    if (buf === 'blackout') { buf = ''; setDark(!dark); }
  });
  const moveVeil = (e) => { if (dark && veil) { veil.style.setProperty('--mx', e.clientX + 'px'); veil.style.setProperty('--my', e.clientY + 'px'); } };
  addEventListener('pointermove', moveVeil, { passive: true });
  addEventListener('pointerdown', moveVeil, { passive: true });

  /* ── X pixel events ────────────────────────────────────────────────── */
  // An event whose ID is still '' in config does nothing.
  function track(name, params) {
    const id = (CFG.xEvents || {})[name];
    try { if (id && typeof window.twq === 'function') window.twq('event', id, params || {}); } catch (e) { /* never break the page */ }
  }
  if (['boost', 'plan', 'addon', 'service'].includes(KIND)) track('packageView', { contents: [{ content_id: host.dataset.offer, content_name: document.title }] });
  if (PATH === 'contact.html') track('contactView');
  // Calls, texts and emails: one listener for every tel:, sms: and mailto: link on the page, including
  // ones added later (the failed-send message). It tells X which package or page the tap came from.
  const HOW = { tel: 'Call', sms: 'Text', mailto: 'Email' };
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="tel:"], a[href^="sms:"], a[href^="mailto:"]');
    if (!a) return;
    const how = HOW[a.getAttribute('href').split(':')[0].toLowerCase()];
    track('call', { contents: [{ content_id: host.dataset.offer || PATH, content_name: how }] });
  }, true);

  /* ── Where a visitor came from (X click ID, UTM tags), kept for this tab and sent with the form ── */
  (() => {
    const qs = new URLSearchParams(location.search);
    const src = ['twclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].filter((k) => qs.get(k)).map((k) => k + '=' + encodeURIComponent(qs.get(k).slice(0, 200))).join('&');
    if (src && !ss.get('bs2.src')) ss.set('bs2.src', { src, landing: PATH });
  })();

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
      const src = ss.get('bs2.src') || {}, lastPkg = ss.get('bs2.pkg');
      const payload = {
        ...data, interest: interestLabel, page: PATH,
        ...(src.src ? { source: src.src, landing: src.landing || '' } : {}),
        ...(lastPkg ? { last_package: String(lastPkg) } : {}),
        _subject: `Blackout Syndicate lead: ${interestLabel}`, _template: 'table', _captcha: 'false',
      };
      const summary = Object.entries({ Name: data.name, 'Business / channel': data.business, Email: data.email, Phone: data.phone, 'Interested in': interestLabel, Platform: data.platform, 'Best way to reach': data.reach, Message: data.message }).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
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
        // A one-time token: kept in this tab and put in the thank-you address. The thank-you page
        // counts the Lead only when the two match, then spends the token, so a reload, a shared
        // link or a direct visit never counts. Each new send counts once.
        const token = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
        ss.set('bs2.lead', { name: (data.name || '').split(' ')[0], interest: interestLabel, slug: sel?.selectedOptions[0]?.dataset.slug || '', preview: !!CFG.previewMode, id: token });
        ss.set(LEAD_TOKEN, token);
        track('formSubmit', { contents: [{ content_name: interestLabel }] });
        // give the X beacon a moment to leave before the page changes
        setTimeout(() => { location.href = ROOT + 'thank-you.html?sent=' + token; }, CFG.xPixelId && typeof window.twq === 'function' ? 400 : 0);
        return;
      }
      btn.disabled = false; btn.innerHTML = label;
      if (alertBox) {
        alertBox.hidden = false;
        const mail = CFG.email ? `mailto:${CFG.email}?subject=${encodeURIComponent('Blackout Syndicate lead: ' + interestLabel)}&body=${encodeURIComponent(summary)}` : '';
        const reach = CFG.phone && CFG.email
          ? `Call or text <a href="${escHtml(CFG.phoneHref)}">${escHtml(CFG.phone)}</a>, or <a href="${escHtml(mail)}">email ${escHtml(CFG.email)}</a> with this message filled in:`
          : 'Call, text or email us and paste this in:';
        alertBox.innerHTML = `<strong>It didn’t go through. Your message is safe below.</strong><span>${reach}</span><pre style="white-space:pre-wrap;margin:0;font-family:var(--f-type);font-size:14px;color:var(--paper)">${escHtml(summary)}</pre><span><button class="copy" type="button" data-copy="${escHtml(summary)}">Copy message</button></span>`;
        alertBox.tabIndex = -1;
        alertBox.focus({ preventScroll: true });
        alertBox.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      }
    });
  });
  // remember which package a visitor was looking at, so the form can preselect it
  if (host.dataset.offer) ss.set('bs2.pkg', host.dataset.offer);

  /* ── Thank-you page ────────────────────────────────────────────────── */
  // The Lead conversion fires only for a real send from this browser: the ?sent= token must match the
  // one-time token the form left in this tab, which is then spent. If this browser blocks
  // sessionStorage, a token minted in the last 15 minutes is accepted instead (the address is cleaned
  // right away, so a reload still never counts twice).
  if (PATH === 'thank-you.html') {
    const q = new URLSearchParams(location.search).get('sent') || '';
    const saved = ss.get('bs2.lead');
    const ssOK = (() => { try { sessionStorage.setItem('bs2.t', '1'); sessionStorage.removeItem('bs2.t'); return true; } catch (e) { return false; } })();
    const minted = parseInt(q.split('-')[0], 36);
    const fresh = minted > 0 && Date.now() - minted < 15 * 60e3 && minted - Date.now() < 60e3;
    const real = !!q && (ssOK ? ss.get(LEAD_TOKEN) === q : fresh);
    if (saved) {
      $$('[data-lead-name]').forEach((e) => (e.textContent = saved.name || 'friend'));
      $$('[data-lead-interest]').forEach((e) => (e.textContent = saved.interest || 'your file'));
      $$('[data-lead-preview]').forEach((e) => (e.hidden = !saved.preview));
    }
    if (real) {
      try { sessionStorage.removeItem(LEAD_TOKEN); } catch (e) { /* blocked */ }
      if (ss.get('bs2.leadTracked') !== q) {
        track('lead', { conversion_id: q, contents: [{ content_name: (saved && saved.interest) || '' }] });
        ss.set('bs2.leadTracked', q);
      }
      // the Archive seal held back on the contact page lands here, with the contact
      const seal = !!ss.get(ARCHIVE_NOTE);
      if (seal) { try { sessionStorage.removeItem(ARCHIVE_NOTE); } catch (e) { /* blocked */ } }
      setTimeout(() => award('lead', '', XP.lead, seal ? 'Contact made and the whole Archive read.' : 'Contact made. Your file is on the desk.', seal ? { href: ID_HREF } : {}), 900);
    }
    // drop ?sent= so a reload never counts the same lead twice
    if (q) { try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* ignore */ } }
  }
  // An Archive seal held back on the contact page shows on the next page the visitor opens.
  if (PATH !== 'contact.html' && PATH !== 'thank-you.html' && ss.get(ARCHIVE_NOTE)) {
    try { sessionStorage.removeItem(ARCHIVE_NOTE); } catch (e) { /* blocked */ }
    setTimeout(() => toast('Archive cleared. Every file read.', 'The whole Archive is yours', FILES.length + '/' + FILES.length, 'level', ID_HREF), 2400);
  }

  /* ── Other tabs and back/forward restores stay in step ─────────────── */
  addEventListener('storage', (e) => { if (e.key === KEY) { sync(); render(false); } });
  addEventListener('pageshow', (e) => { if (e.persisted) { sync(); render(false); } });

  /* ── Page visit + read-to-the-end ──────────────────────────────────── */
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

  // What the visitor has earned, ready for badges (the Vault's ID card stamps): read-only numbers.
  const stamps = () => {
    const read = FILES.filter((f) => S.read[f.path]).length, marks = Object.keys(S.marks).length;
    return { level: levelFor(S.xp).lv, xp: S.xp, files: FILES.length, opened: FILES.filter((f) => S.seen[f.path]).length, read, archive: FILES.length > 0 && read >= FILES.length, marks, allMarks: marks >= TOTAL_MARKS, quiz: !!S.quiz, blackout: !!S.blackout, lead: !!S.lead };
  };
  window.BS = { award, track, toast, state: () => S, stamps, level: () => levelFor(S.xp), progress, open: openDrawer, say: () => setDark(!dark), XP, LEVELS, FILES, reduce, finePointer };
  document.dispatchEvent(new CustomEvent('bs:ready'));
})();
