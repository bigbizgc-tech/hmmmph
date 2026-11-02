// packages.html: the index of every file, the package matcher and the side-by-side comparisons.
import { BIZ, LEVELS, POLICY } from '../data/business.mjs';
import { OFFERS, BOOSTS, PLANS, ADDONS, SERVICES, bySlug, offerPath } from '../data/offers.mjs';

// ── Facts pulled from offers.mjs (never hard-code a price) ───────────────────
const num = (p) => Number(String(p).replace(/[^0-9.]/g, ''));
const adOf = (o) => { const m = /About \$(\d+)/.exec(o.spend || ''); return m ? Number(m[1]) : null; };
const range = (list) => `${list[0].price} to ${list[list.length - 1].price}${list[list.length - 1].suffix || ''}`;
const MAX_AD = Math.max(...BOOSTS.map(adOf));
const POST_KIT = bySlug['post-kit'];
const SURGE = bySlug.surge;

// Boost table: wording lifted from each boost's includes in offers.mjs.
const BOOST_ROWS = {
  spark: { plat: 'One platform you pick', tiktok: '', recap: 'Spend, reach, and clicks or views', kit: 'Included free' },
  boost: { plat: 'One platform you pick', tiktok: 'On TikTok it runs as a one-day burst', recap: 'Spend, reach, clicks or views, and follows', kit: `Add it for ${POST_KIT.price}` },
  blitz: { plat: 'Any one platform', tiktok: 'On TikTok it runs for 2 days', recap: 'Spend, reach, clicks or views, and follows', kit: `Add it for ${POST_KIT.price}` },
};
// Plan table: wording lifted from each plan's includes, notForYou and ladder in offers.mjs.
const PLAN_ROWS = {
  surge: { ads: `Every month on up to 2 platforms. About $${adOf(SURGE)} a month goes into the ads`, posting: '', ai: '', web: '', adds: 'Ads every month. No restarting from zero' },
  overdrive: { ads: 'Everything in Surge', posting: 'Automatic posting set up on your accounts', ai: 'AI tools set up for the repeat work in your business', web: '', adds: 'Automatic posting and AI tools' },
  'total-blackout': { ads: 'Paid promotion through the platforms your people use', posting: 'AI-made posts and promos for your pages', ai: 'An AI assistant that answers customers and captures their contact info', web: 'A clean web page with your hours, location and contact', adds: 'The customer-answering AI assistant and a clean web page' },
};

const GROUPS = [
  { id: 'boosts', no: '01', name: 'One-time boosts', meta: `${BOOSTS.length} files · ${range(BOOSTS)}` },
  { id: 'plans', no: '02', name: 'Monthly plans', meta: `${PLANS.length} files · ${range(PLANS)}` },
  { id: 'addons', no: '03', name: 'Add-ons', meta: `${ADDONS.length} files · ${range(ADDONS)}` },
  { id: 'built', no: '04', name: 'Built to order', meta: `${SERVICES.length} files · Quoted per job` },
];

// ── Matcher questions (the answer keys drive the mapping in the page script) ─
const QUESTIONS = [
  { key: 'what', short: 'Pushing', title: 'What are you pushing?', opts: [
    { a: 'channel', t: 'A channel or stream', d: 'Videos, Shorts, live streams or music' },
    { a: 'shop', t: 'A local shop or service', d: 'People nearby who could walk in, call or book' },
    { a: 'event', t: 'An event, launch or opening', d: 'Something with a date on the calendar' },
    { a: 'messy', t: 'A brand-new or messy page', d: 'It doesn’t say what you do yet' },
  ] },
  { key: 'len', short: 'Run', title: 'How long do you need the push?', opts: [
    { a: 'night', t: 'One night or one drop', d: 'A stream, a release, a sale' },
    { a: 'weeks', t: 'A week or two', d: 'A longer run, or a build-up to a date' },
    { a: 'monthly', t: 'Every month', d: 'Keep it running without starting over' },
  ] },
  { key: 'hand', short: 'Handled', title: 'How much do you want handled?', opts: [
    { a: 'ads', t: 'Just the ads', d: 'You keep doing your own posting' },
    { a: 'posting', t: 'Ads plus posting', d: 'Your page stays active without you' },
    { a: 'all', t: 'Everything', d: 'Ads, posts, an AI assistant that answers customers and a web page' },
  ] },
];

// No-JS fallback: the same logic, written out.
const GUIDE = [
  { if: 'have never run a paid ad, or your page is brand new', slug: 'spark', and: 'profile-fix' },
  { if: 'have one night that matters: a stream, a drop, a sale', slug: 'boost' },
  { if: 'have an event, an opening or a big announcement on the calendar', slug: 'blitz' },
  { if: 'want ads running every month without restarting', slug: 'surge' },
  { if: 'want ads every month and the posting off your plate', slug: 'overdrive' },
  { if: 'want everything handled: ads, posts, an AI assistant and a web page', slug: 'total-blackout' },
  { if: 'have a page that doesn’t say what you do in one look', slug: 'profile-fix' },
  { if: 'never know what to post', slug: 'post-kit' },
];

const RULES = [
  { t: 'Never run an ad? Start small.', d: `Spark is the cheapest real test: about $${adOf(bySlug.spark)} in the ad, a ${bySlug.spark.run}, and the 30-Day Post Kit comes with it. You find out what real reach feels like before you spend more.` },
  { t: 'Fix the page before you buy the traffic.', d: 'If your bio doesn’t say what you do, where you are and what to do next, an ad just sends more people to a page that loses them. Profile Fix first.' },
  { t: 'One date? Buy a boost. Every week? Get a plan.', d: `A boost is one push for one moment. If you keep buying them, stop. Three Blitzes cost about what Surge costs for a month, and Surge never restarts from zero.` },
  { t: 'Pay for the help you’ll actually use.', d: 'If you’ll post yourself, Surge is enough. If posting never happens, Overdrive. If you want the whole operation off your plate, Total Blackout.' },
];

const none = '<span class="pk-none" aria-hidden="true"></span><span class="sr">Not included</span>';
// A launch price is only "locked in" when the offer itself says so (or sets lockIn) in offers.mjs.
const lockedIn = (o) => o.lockIn ?? /locked in/i.test([o.spend, ...(o.includes || [])].join(' '));
const priceHtml = (o) => `${o.price}${o.suffix ? `<small>${o.suffix}</small>` : ''}`;

// ── Page script: the matcher. Serialized with toString(), so it must stay self-contained. ──
function matcher() {
  const root = document.querySelector('[data-quiz]');
  const dataEl = document.getElementById('pk-data');
  if (!root || !dataEl) return;
  let D;
  try { D = JSON.parse(dataEl.textContent); } catch (e) { return; }
  const $ = (s, el) => (el || root).querySelector(s);
  const $$ = (s, el) => [...(el || root).querySelectorAll(s)];
  const qs = $$('[data-q]');
  const res = $('[data-result]');
  const back = $('[data-back]');
  const restartBtns = $$('[data-restart]');
  const segs = $$('[data-seg]');
  const stepText = $('[data-step-text]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const KEY = 'bs2.match';
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
    del() { try { localStorage.removeItem(KEY); } catch (e) { /* storage blocked */ } },
  };
  const A = [null, null, null];
  let step = 0;

  // answers → one file (+ an add-on when it fits)
  function pick(a) {
    const what = a[0], len = a[1], hand = a[2];
    let main;
    if (hand === 'all') main = 'total-blackout';
    else if (len === 'monthly') main = hand === 'posting' ? 'overdrive' : 'surge';
    else if (what === 'messy') main = 'spark';
    else if (what === 'event' || len === 'weeks') main = 'blitz';
    else main = 'boost';
    let addon = null;
    if (what === 'messy' && main !== 'total-blackout') addon = 'profile-fix';
    else if (hand === 'posting' && (main === 'boost' || main === 'blitz')) addon = 'post-kit';
    return { main, addon };
  }
  const THING = { channel: 'your channel', shop: 'your shop', event: 'your events', messy: 'your page' };
  function why(slug, a) {
    const o = D[slug];
    switch (slug) {
      case 'total-blackout': return 'You want the whole thing handled. ' + o.name + ' covers the ads, the posts, an AI assistant that answers ' + (a[0] === 'channel' ? 'the people who message you' : 'your customers') + ' and a clean web page.' + (a[1] !== 'monthly' && o.oneMonth ? ' Only need one month? It’s ' + o.oneMonth + ', no commitment.' : '');
      case 'overdrive': return 'You want ads every month and the posting off your plate. Overdrive is everything in Surge, plus automatic posting and AI tools for the repeat work.';
      case 'surge': return 'You want ' + THING[a[0]] + ' in front of people every month without starting cold. Surge keeps real paid ads running on up to 2 platforms, with about $' + o.ad + ' a month in the ads.';
      case 'blitz': return a[0] === 'event'
        ? 'A date on the calendar needs a crowd. Blitz is a full ' + o.run + ' with about $' + o.ad + ' in the ad itself, so book it at least a week before the date.'
        : 'You need more than one night. Blitz is our biggest single push: a full ' + o.run + ' on one platform, with about $' + o.ad + ' in the ad itself.';
      case 'boost': return a[0] === 'channel'
        ? 'One night that matters. Boost puts about $' + o.ad + ' of real ad money behind your stream, drop or release over a ' + o.run + ', or as a one-day burst on TikTok.'
        : 'One sale, one drop, one big day. Boost puts about $' + o.ad + ' of real ad money behind it over a ' + o.run + ', aimed at your area.';
      case 'spark': return 'Your page is new or still rough, so start small. Spark is a real ' + o.run + ' with about $' + o.ad + ' in the ad, and the 30-Day Post Kit comes with it.';
      default: return '';
    }
  }
  // the add-on line speaks to whoever answered: a channel gets "your channel", everyone else "your business"
  const ADDON_WHY = {
    'profile-fix': () => 'Fix the page first. We rewrite your bio and plan your pinned posts and highlights, so people from the ads get what you do in three seconds.',
    'post-kit': (a) => 'A 30-day posting calendar and 12 captions written for ' + (a[0] === 'channel' ? 'your channel' : 'your business') + '. You hit publish while the ad brings people in.',
  };

  function setPrice(el, o) {
    el.textContent = o.price;
    if (o.suffix) { const s = document.createElement('small'); s.textContent = o.suffix; el.appendChild(s); }
  }
  function label(qi, val) {
    const b = qs[qi] && qs[qi].querySelector('[data-a="' + val + '"] .pk-opt__t');
    return b ? b.textContent : val;
  }

  function fill(fromStore) {
    const r = pick(A), o = D[r.main];
    $('[data-r="kicker"]').textContent = (fromStore ? 'Your match on file · ' : 'Match found · ') + o.file;
    $('[data-r="name"]').textContent = o.name;
    setPrice($('[data-r="price"]'), o);
    $('[data-r="cadence"]').textContent = o.cadence;
    $('[data-r="why"]').textContent = why(r.main, A);
    $('[data-r="open"]').href = o.href;
    $('[data-r="claim"]').href = o.claim;
    const ad = $('[data-r="addon"]');
    if (r.addon) {
      const x = D[r.addon];
      ad.hidden = false;
      const link = $('[data-r="addon-link"]');
      link.href = x.href; link.textContent = x.name;
      $('[data-r="addon-price"]').textContent = x.price;
      $('[data-r="addon-why"]').textContent = ADDON_WHY[r.addon] ? ADDON_WHY[r.addon](A) : '';
    } else ad.hidden = true;
    const later = $('[data-r="later"]');
    if (o.ladder && r.main !== 'total-blackout') { later.hidden = false; $('[data-r="later-text"]').textContent = o.ladder; }
    else later.hidden = true;
    const dl = $('[data-r="answers"]');
    dl.innerHTML = '';
    ['Pushing', 'Run', 'Handled'].forEach((k, i) => {
      const row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = k; dd.textContent = label(i, A[i]);
      row.append(dt, dd); dl.appendChild(row);
    });
    const stamp = $('[data-r="stamp"]');
    stamp.classList.remove('is-slam'); void stamp.offsetWidth; if (!reduce) stamp.classList.add('is-slam');
    return r;
  }

  function show(i, focus) {
    step = i;
    qs.forEach((q, k) => { q.hidden = k !== i; });
    res.hidden = i < qs.length;
    segs.forEach((s, k) => { s.classList.toggle('is-done', k < i); s.classList.toggle('is-on', k === i); });
    stepText.textContent = i < qs.length ? 'Question ' + (i + 1) + ' of ' + qs.length : 'Match found';
    back.disabled = i === 0;
    restartBtns.forEach((b) => { b.hidden = b.closest('[data-result]') ? false : (i === qs.length || (i === 0 && !A[0])); });
    qs.forEach((q, k) => $$('[data-a]', q).forEach((b) => b.setAttribute('aria-pressed', String(A[k] === b.dataset.a))));
    const panel = i < qs.length ? qs[i] : res;
    if (!reduce) { panel.classList.remove('is-in'); void panel.offsetWidth; panel.classList.add('is-in'); }
    if (focus) {
      const top = root.getBoundingClientRect().top;
      if (top < 60 || top > innerHeight * 0.55) root.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      const target = i < qs.length ? $('.pk-q__title', qs[i]) : res;
      target.focus({ preventScroll: true });
    }
  }

  qs.forEach((q, qi) => $$('[data-a]', q).forEach((b) => b.addEventListener('click', () => {
    A[qi] = b.dataset.a;
    if (qi < qs.length - 1) return show(qi + 1, true);
    const r = fill(false);
    store.set({ a: A.slice() });
    show(qs.length, true);
    if (window.BS && window.BS.award) window.BS.award('quiz', '', window.BS.XP.quiz, 'Package match found');
    try { sessionStorage.setItem('bs2.pkg', JSON.stringify(r.main)); } catch (e) { /* blocked */ }
  })));
  back.addEventListener('click', () => { if (step > 0) show(step - 1, true); });
  restartBtns.forEach((b) => b.addEventListener('click', () => { A[0] = A[1] = A[2] = null; store.del(); show(0, true); }));

  // a returning visitor sees the match they already have on file
  const saved = store.get();
  const valid = saved && Array.isArray(saved.a) && saved.a.length === qs.length && saved.a.every((v, k) => qs[k].querySelector('[data-a="' + v + '"]'));
  if (valid) { saved.a.forEach((v, k) => (A[k] = v)); fill(true); show(qs.length, false); }
  else show(0, false);
  root.classList.add('is-live');
}

const css = `
/* ── Page head: the cabinet ── */
.pk-head__grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,420px);gap:clamp(32px,5vw,80px);align-items:end}
@media (max-width:940px){.pk-head__grid{grid-template-columns:1fr;align-items:start}}
.pk-head__main{display:grid;gap:22px;min-width:0}
.pk-head__main .whisper{display:block;margin-top:.18em}
.pk-cab{display:grid;gap:12px;min-width:0}
.pk-cab ol{list-style:none;display:grid;gap:6px}
.pk-cab a{--x:50%;--y:50%;position:relative;display:grid;grid-template-columns:44px minmax(0,1fr) auto;align-items:center;gap:4px 14px;padding:13px 16px 13px 14px;background:var(--coal);border:1px solid var(--smoke);color:var(--paper);text-decoration:none;overflow:hidden;isolation:isolate;transition:transform .35s var(--ease),border-color .25s}
.pk-cab a::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(200px circle at var(--x) var(--y),rgba(217,178,95,.16),transparent 70%);opacity:0;transition:opacity .3s}
.pk-cab a::after{content:"";position:absolute;left:50%;bottom:6px;width:46px;height:3px;margin-left:-23px;background:var(--smoke);transition:background .25s}
.pk-cab a:hover,.pk-cab a:focus-visible{transform:translateX(-10px);border-color:var(--brass)}
.pk-cab a:hover::before,.pk-cab a:focus-visible::before{opacity:1}
.pk-cab a:hover::after,.pk-cab a:focus-visible::after{background:var(--gold)}
.pk-cab__no{grid-row:span 2;font-family:var(--f-display);font-weight:900;font-size:34px;line-height:.8;color:transparent;-webkit-text-stroke:1.2px var(--gold);transition:color .25s}
.pk-cab a:hover .pk-cab__no,.pk-cab a:focus-visible .pk-cab__no{color:var(--gold)}
.pk-cab__name{font-family:var(--f-display);font-weight:800;font-size:23px;line-height:1;text-transform:uppercase;letter-spacing:.02em}
.pk-cab__meta{grid-column:2;font-family:var(--f-type);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);font-variant-numeric:tabular-nums}
.pk-cab .arw{grid-row:span 2;grid-column:3;width:18px;height:18px;color:var(--gold);transition:transform .25s var(--ease)}
.pk-cab a:hover .arw{transform:translateX(4px)}
.pk-cab__first{border-color:var(--brass)!important;background:linear-gradient(120deg,#211a0d,var(--coal) 70%)!important}
@media (max-width:560px){.pk-cab a{padding:11px 14px 12px 12px;grid-template-columns:38px minmax(0,1fr) auto}.pk-cab__no{font-size:28px}.pk-cab__name{font-size:21px}}

/* ── Matcher ── */
.pk-match{display:grid;grid-template-columns:minmax(0,.78fr) minmax(0,1.22fr);gap:clamp(32px,5vw,80px);align-items:start}
@media (max-width:940px){.pk-match{grid-template-columns:1fr}}
.pk-match__intro{display:grid;gap:20px;align-content:start;min-width:0}
@media (min-width:941px){.pk-match__intro{position:sticky;top:110px}}
.pk-match__intro>p:not(.label){color:var(--ash);max-width:46ch}
.pk-match__list{list-style:none;display:grid;gap:10px;font-size:15.5px}
.pk-match__list li{display:grid;grid-template-columns:18px 1fr;gap:12px}
.pk-match__list li::before{content:"";width:14px;height:4px;margin-top:11px;background:var(--gold)}
.pk-match__xp{display:none;font-family:var(--f-type);font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);border:1px dashed var(--brass);padding:10px 12px;width:fit-content}
.js .pk-match__xp{display:block}
.pk-jsonly{display:none!important}
.js .pk-jsonly{display:grid!important}
@media (max-width:520px){.pk-quiz{padding:18px 14px 20px}.pk-result{padding:22px 18px}.pk-opt{padding:14px 14px 14px 12px;gap:3px 12px;grid-template-columns:32px minmax(0,1fr) auto}.pk-opt__key{font-size:30px}}
.pk-match__call{font-size:15px;color:var(--ash)}
.pk-match__call a{color:var(--paper);text-decoration:none;border-bottom:1px solid var(--brass)}

.pk-quiz{display:none;position:relative;background:var(--void);border:1px solid var(--smoke);padding:clamp(20px,3vw,34px);min-width:0;scroll-margin-top:16px}
.js .pk-quiz{display:grid;gap:24px;align-content:start}
.js .pk-guide{display:none}
.pk-quiz::before{content:"";position:absolute;inset:-1px -1px auto auto;width:34px;height:34px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.pk-quiz__top{display:flex;align-items:center;justify-content:space-between;gap:12px 18px;flex-wrap:wrap;padding-bottom:18px;border-bottom:1px dashed var(--smoke)}
.pk-prog{display:flex;align-items:center;gap:14px}
.pk-segs{display:flex;gap:5px}
.pk-segs i{display:block;width:38px;height:5px;background:var(--smoke);transition:background .4s var(--ease)}
.pk-segs i.is-done{background:var(--brass)}
.pk-segs i.is-on{background:var(--gold-hi);box-shadow:0 0 12px rgba(243,212,138,.5)}
.pk-prog__t{font-family:var(--f-type);font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash);font-variant-numeric:tabular-nums}
.pk-ctl{display:flex;gap:8px}
.pk-ctl button{background:none;border:1px solid var(--smoke);color:var(--ash);padding:8px 12px;font-family:var(--f-type);font-size:12px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:color .2s,border-color .2s}
.pk-ctl button:hover:not([disabled]){color:var(--paper);border-color:var(--gold)}
.pk-ctl button[disabled]{opacity:.35;cursor:default}
.pk-ctl button[hidden]{display:none}
@media (max-width:560px){.pk-quiz__top{flex-wrap:nowrap}.pk-segs i{width:22px}.pk-prog{gap:10px}.pk-prog__t{font-size:11.5px;letter-spacing:.1em}}
.pk-q{display:grid;gap:20px}
.pk-q[hidden]{display:none}
.pk-q__title{font-family:var(--f-display);font-weight:900;font-size:clamp(36px,4.2vw,56px);line-height:.9;text-transform:uppercase}
.pk-q__title:focus{outline:none}
.pk-opts{display:grid;gap:10px}
.pk-opt{--x:50%;--y:50%;position:relative;display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:3px 16px;align-items:center;width:100%;text-align:left;background:var(--coal);border:1px solid var(--smoke);padding:16px 18px 16px 16px;cursor:pointer;color:var(--paper);overflow:hidden;isolation:isolate;transition:border-color .2s,transform .2s var(--ease)}
.pk-opt::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(240px circle at var(--x) var(--y),rgba(217,178,95,.15),transparent 70%);opacity:0;transition:opacity .25s}
.pk-opt:hover,.pk-opt:focus-visible{border-color:var(--gold)}
.pk-opt:hover::before,.pk-opt:focus-visible::before{opacity:1}
.pk-opt:active{transform:scale(.99)}
.pk-opt__key{grid-row:span 2;font-family:var(--f-display);font-weight:900;font-size:36px;line-height:.8;color:transparent;-webkit-text-stroke:1.2px var(--gold);transition:color .2s}
.pk-opt__t{font-family:var(--f-display);font-weight:800;font-size:clamp(23px,2.3vw,28px);line-height:1;text-transform:uppercase;letter-spacing:.015em}
.pk-opt__d{grid-column:2;font-size:14.5px;line-height:1.45;color:var(--ash)}
.pk-opt .arw{grid-row:1/span 2;grid-column:3;width:20px;height:20px;color:var(--gold);opacity:.35;transition:opacity .2s,transform .25s var(--ease)}
.pk-opt:hover .pk-opt__key,.pk-opt:focus-visible .pk-opt__key,.pk-opt[aria-pressed="true"] .pk-opt__key{color:var(--gold)}
.pk-opt:hover .arw,.pk-opt:focus-visible .arw{opacity:1;transform:translateX(4px)}
.pk-opt[aria-pressed="true"]{border-color:var(--brass);background:linear-gradient(90deg,rgba(217,178,95,.1),var(--coal) 70%)}
.pk-q.is-in,.pk-result.is-in{animation:pkIn .45s var(--ease)}
@keyframes pkIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}

/* result: the dossier slides out under the light */
.pk-result{position:relative;display:grid;gap:18px;background:var(--paper);color:var(--ink);padding:clamp(22px,3.4vw,36px);background-image:repeating-linear-gradient(transparent 0 31px,rgba(23,20,15,.05) 31px 32px);box-shadow:0 30px 60px -30px rgba(0,0,0,.85)}
.pk-result[hidden]{display:none}
.pk-result:focus{outline:none}
.pk-result:focus-visible{outline:2px solid var(--gold-hi);outline-offset:4px}
.pk-result::before{content:"";position:absolute;top:0;right:0;width:42px;height:42px;background:linear-gradient(225deg,var(--void) 50%,var(--paper-2) 50%)}
.pk-result .label{color:var(--brass)}
.pk-result__head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding-right:22px}
.pk-result__id{display:grid;gap:10px;min-width:0}
.pk-result__name{font-family:var(--f-display);font-weight:900;font-size:clamp(56px,6.6vw,96px);line-height:.82;text-transform:uppercase;overflow-wrap:anywhere}
.pk-result__price{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
.pk-result__price .price{color:var(--ink);font-size:clamp(40px,4.4vw,54px)}
.pk-result__price .price small{color:var(--ink-mute)}
.pk-result__cad{font-family:var(--f-type);font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-mute)}
.pk-result .stamp{flex:none;width:118px;font-size:20px;margin-top:6px;color:var(--ink);box-shadow:inset 0 0 0 5px var(--paper),inset 0 0 0 6.5px var(--signal)}
.pk-result .stamp small{max-width:8em}
.pk-result__why{font-family:var(--f-type);font-size:16.5px;line-height:1.65;max-width:58ch}
.pk-result__addon{display:grid;gap:6px;padding:14px 16px;border:1px dashed var(--brass);background:rgba(138,109,52,.06)}
.pk-result__addon[hidden]{display:none}
.pk-result__addon p:not(.label){font-size:15px;color:var(--ink-mute);max-width:58ch}
.pk-result__addon .pk-result__an{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;color:var(--ink)}
.pk-result__addon a{font-family:var(--f-display);font-weight:900;font-size:28px;line-height:1;text-transform:uppercase;color:var(--ink);text-decoration:none;border-bottom:2px solid var(--brass)}
.pk-result__addon a:hover{color:var(--brass)}
.pk-result__addon b{font-family:var(--f-display);font-weight:800;font-size:24px;color:var(--brass);font-variant-numeric:tabular-nums}
.pk-result .ledger>div{border-color:rgba(23,20,15,.16)}
.pk-result .ledger dt{color:var(--ink-mute)}
.pk-result .ledger dd{color:var(--ink)}
.pk-result__later{font-size:14.5px;color:var(--ink-mute);display:grid;gap:4px;border-top:1px solid rgba(23,20,15,.16);padding-top:14px}
.pk-result__later[hidden]{display:none}
.pk-result__foot{display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center;justify-content:space-between}
.pk-result__again{background:none;border:0;padding:0 0 2px;border-bottom:1px solid var(--brass);font-family:var(--f-type);font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink);cursor:pointer}
.pk-result__again:hover{color:var(--brass)}
.pk-result__again[hidden]{display:none}
/* phones: the name gets the full card width (whole words only), the stamp drops beside the price */
@media (max-width:520px){
  .pk-result__head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px 14px;padding-right:0}
  .pk-result__id{display:contents}
  .pk-result__id>.label{grid-column:1/-1;padding-right:36px}
  .pk-result__name{grid-column:1/-1;font-size:clamp(38px,13.5vw,60px);overflow-wrap:break-word}
  .pk-result__price{grid-column:1}
  .pk-result .stamp{grid-column:2;width:84px;font-size:14px;padding:10px;margin-top:0}
  .pk-result .stamp small{font-size:7.5px}
}

/* no-JS guide */
.pk-guide{display:grid;gap:16px;min-width:0}
.pk-guide>p{color:var(--ash)}
.pk-guide ul{list-style:none;border-top:1px solid var(--smoke)}
.pk-guide li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 24px;align-items:baseline;padding:14px 0;border-bottom:1px solid var(--smoke)}
.pk-guide li>span{color:var(--ash)}
.pk-guide li>span b{color:var(--paper);font-weight:600}
.pk-guide__pick{display:grid;justify-items:end;gap:2px;text-align:right}
.pk-guide a{font-family:var(--f-display);font-weight:800;font-size:24px;line-height:1;text-transform:uppercase;color:var(--gold);text-decoration:none}
.pk-guide a:hover{color:var(--gold-hi)}
.pk-guide small{font-family:var(--f-type);font-size:12.5px;color:var(--ash);font-variant-numeric:tabular-nums}
@media (max-width:560px){.pk-guide li{grid-template-columns:1fr}.pk-guide__pick{justify-items:start;text-align:left}}

/* ── Groups ── */
.pk-grid{margin-top:8px}
.pk-policy{margin-top:clamp(18px,2.4vw,26px);font-size:14px;color:var(--ash);max-width:80ch}
.pk-policy b{font-family:var(--f-type);font-weight:400;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-right:8px}

/* comparison tables */
.pk-compare{margin-top:clamp(48px,6vw,76px);display:grid;gap:16px}
.pk-compare__head{display:flex;justify-content:space-between;align-items:baseline;gap:8px 20px;flex-wrap:wrap;padding-bottom:14px;border-bottom:1px solid var(--smoke)}
.pk-compare__head .h3{color:var(--paper)}
.pk-swipe{display:none}
@media (max-width:820px){.pk-swipe{display:inline}}
.pk-scroll{position:relative;overflow-x:auto;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;border:1px solid var(--smoke);background:var(--void);scrollbar-color:var(--brass) var(--coal)}
.pk-scroll:focus-visible{outline:2px solid var(--gold-hi);outline-offset:3px}
.band--coal .pk-scroll{background:var(--void)}
.pk-table{width:100%;min-width:720px;table-layout:fixed;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:15px;line-height:1.45}
.pk-table th,.pk-table td{padding:15px 18px;text-align:left;vertical-align:top;border-top:1px solid var(--smoke)}
.pk-table thead th{border-top:0;vertical-align:bottom;padding-top:20px;padding-bottom:16px}
.pk-table thead th a{display:grid;gap:6px;color:var(--paper);text-decoration:none}
.pk-table thead th a b{font-family:var(--f-display);font-weight:900;font-size:clamp(30px,3vw,40px);line-height:.85;text-transform:uppercase;transition:color .2s}
.pk-table thead th a:hover b{color:var(--gold-hi)}
.pk-table thead th a span{font-family:var(--f-type);font-weight:400;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash)}
.pk-table thead th a .arw{width:15px;height:15px;color:var(--gold);vertical-align:-2px;margin-left:4px}
.pk-table th[scope="row"],.pk-table thead td{position:sticky;left:0;z-index:1;width:190px;background:var(--void);font-family:var(--f-type);font-weight:400;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);box-shadow:1px 0 0 var(--smoke)}
.pk-table thead td{border-top:0}
.pk-table td{color:var(--paper)}
.pk-table tbody tr{transition:background .2s}
.pk-table tbody tr:hover td{background:rgba(217,178,95,.045)}
.pk-table .pk-flag{background:rgba(217,178,95,.045)}
.pk-table thead .pk-flag{box-shadow:inset 0 2px 0 var(--gold)}
.pk-num{display:block;font-family:var(--f-display);font-weight:800;font-size:32px;line-height:.95;color:var(--gold);letter-spacing:.01em}
.pk-num small{font-family:var(--f-body);font-weight:400;font-size:14px;color:var(--ash);margin-left:3px;letter-spacing:0}
.pk-sub{display:block;font-size:13.5px;color:var(--ash);margin-top:4px}
.pk-tag{display:inline-block;font-family:var(--f-type);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--void);background:var(--gold);padding:2px 7px;margin-bottom:6px}
.pk-bar{display:block;height:6px;max-width:220px;background:var(--smoke);margin-top:10px;position:relative;overflow:hidden}
.pk-bar i{position:absolute;inset:0 auto 0 0;width:var(--w);background:linear-gradient(90deg,var(--brass),var(--gold-hi))}
.js .pk-bar i{transform-origin:left;transform:scaleX(0);transition:transform 1.2s var(--ease) var(--d,0s)}
.js .pk-compare.is-lit .pk-bar i{transform:none}
@media (prefers-reduced-motion:reduce){.js .pk-bar i{transform:none}}
@media (max-width:560px){.pk-table{min-width:590px;font-size:14.5px}.pk-table th,.pk-table td{padding:13px 12px}.pk-table th[scope="row"],.pk-table thead td{width:116px;font-size:11px;letter-spacing:.08em}.pk-num{font-size:28px}}
.pk-none{display:inline-block;width:18px;height:2px;background:var(--smoke);vertical-align:middle}
.pk-compare__foot{display:flex;flex-wrap:wrap;gap:10px 28px;justify-content:space-between;align-items:baseline;font-size:14px;color:var(--ash)}
.pk-compare__foot .textlink{font-size:15px}
.pk-seal{display:flex;gap:10px 14px;align-items:center;flex-wrap:wrap}
.pk-seal__tag{font-family:var(--f-display);font-weight:900;font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:var(--signal);border:2px solid var(--signal);padding:2px 8px 1px;transform:rotate(-3deg);white-space:nowrap}

/* add-ons */
.pk-pair{display:flex;flex-wrap:wrap;gap:12px 28px;align-items:center;width:fit-content;max-width:100%;margin-top:clamp(22px,3vw,30px);padding:18px 20px;border:1px dashed var(--brass)}
.pk-pair p{color:var(--ash);font-size:15px;max-width:70ch}
.pk-pair strong{color:var(--paper);font-weight:600}

/* built to order */
.pk-built{list-style:none;border-top:1px solid var(--smoke)}
.pk-built a{--x:50%;--y:50%;position:relative;display:grid;grid-template-columns:100px minmax(0,1.25fr) minmax(0,1fr) auto;gap:8px 32px;align-items:center;padding:26px 8px;border-bottom:1px solid var(--smoke);color:var(--paper);text-decoration:none;overflow:hidden;isolation:isolate}
.pk-built a::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(217,178,95,.13),transparent 72%);transform:translateX(-101%);transition:transform .5s var(--ease)}
.pk-built a:hover::before,.pk-built a:focus-visible::before{transform:none}
.pk-built__file{font-family:var(--f-type);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash)}
.pk-built__main{display:grid;gap:8px;min-width:0}
.pk-built__name{font-family:var(--f-display);font-weight:900;font-size:clamp(34px,4vw,54px);line-height:.86;text-transform:uppercase;transition:color .3s,letter-spacing .5s var(--ease);overflow-wrap:anywhere}
.pk-built a:hover .pk-built__name{color:var(--gold-hi);letter-spacing:.02em}
.pk-built__tag{color:var(--ash);font-size:15.5px;line-height:1.45}
.pk-built__best{font-size:15px;color:var(--ash);line-height:1.45}
.pk-built__best b{display:block;font-family:var(--f-type);font-weight:400;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:4px}
.pk-built__go{display:grid;justify-items:end;gap:6px;text-align:right}
.pk-built__go .file__open{white-space:nowrap}
.pk-built__q{font-family:var(--f-display);font-weight:800;font-size:22px;text-transform:uppercase;letter-spacing:.03em;color:var(--gold);white-space:nowrap}
@media (max-width:900px){.pk-built a{grid-template-columns:minmax(0,1fr) auto;gap:10px 20px;padding:22px 4px}.pk-built__file{grid-column:1/-1}.pk-built__best{grid-column:1}.pk-built__go{grid-column:2;grid-row:2/span 2;align-self:start}}
@media (max-width:560px){.pk-built a{grid-template-columns:1fr}.pk-built__go{grid-column:1;grid-row:auto;justify-items:start;text-align:left;grid-auto-flow:column;align-items:baseline;gap:18px}}

/* ── How to choose (paper) ── */
.pk-choose{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:clamp(32px,6vw,90px);align-items:start}
@media (max-width:940px){.pk-choose{grid-template-columns:1fr}}
.pk-choose__head{display:grid;gap:18px;align-content:start;justify-items:start}
.pk-choose__head>p:not(.label){color:var(--ink-mute);max-width:44ch}
.pk-rules{list-style:none;display:grid;gap:1px;background:rgba(23,20,15,.18);border:1px solid rgba(23,20,15,.18);counter-reset:r}
.pk-rules li{counter-increment:r;background:var(--paper);display:grid;grid-template-columns:64px minmax(0,1fr);gap:4px 22px;padding:24px 24px 26px 20px}
.pk-rules li::before{content:counter(r,decimal-leading-zero);grid-row:span 2;font-family:var(--f-display);font-weight:900;font-size:58px;line-height:.8;color:transparent;-webkit-text-stroke:1.4px var(--brass)}
.pk-rules h3{font-family:var(--f-display);font-weight:900;font-size:clamp(26px,2.6vw,32px);line-height:.95;text-transform:uppercase}
.pk-rules p{color:var(--ink-mute);font-size:15.5px;max-width:58ch;margin-top:6px}
.pk-record{display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px 22px;align-items:center;margin-top:clamp(28px,4vw,44px);padding-top:clamp(22px,3vw,30px);border-top:2px solid var(--ink)}
.pk-record .stamp{width:112px;font-size:17px;color:var(--ink);box-shadow:inset 0 0 0 5px var(--paper),inset 0 0 0 6.5px var(--signal)}
.pk-record p{font-family:var(--f-type);font-size:17px;line-height:1.6;max-width:62ch}
@media (max-width:520px){.pk-record{grid-template-columns:1fr}.pk-rules li{grid-template-columns:1fr;padding:22px 18px}.pk-rules li::before{grid-row:auto;font-size:46px}}

/* ── Closing call ── */
.pk-final{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:clamp(28px,5vw,72px);align-items:end}
@media (max-width:900px){.pk-final{grid-template-columns:1fr;align-items:start}}
.pk-final__main{display:grid;gap:clamp(20px,2.6vw,30px);justify-items:start;min-width:0}
.pk-final h2{font-family:var(--f-display);font-weight:900;font-size:clamp(68px,11vw,170px);line-height:.86;text-transform:uppercase}
.pk-final__main>p:not(.label){font-size:var(--t-lede);max-width:46ch}
.pk-final .btn{--bg:var(--void);--fg:var(--gold);--bd:var(--void)}
.pk-final .btn--ghost{--bg:transparent;--fg:var(--void);--bd:var(--void)}
.pk-final .btn--ghost:hover{--bg:var(--void);--fg:var(--gold)}
.pk-final__side{display:grid;gap:10px;min-width:0;padding-left:clamp(0px,3vw,36px);border-left:2px solid var(--void)}
@media (max-width:900px){.pk-final__side{padding-left:0;border-left:0;border-top:2px solid var(--void);padding-top:22px}}
.pk-final__phone{font-family:var(--f-display);font-weight:900;font-size:clamp(40px,5vw,62px);line-height:1;color:var(--void);text-decoration:none;font-variant-numeric:tabular-nums}
.pk-final__phone:hover{text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:6px}
.pk-final__side p:not(.label){font-size:15.5px;max-width:42ch}
`;

const js = `
(${matcher.toString()})();
/* the cabinet drawers and quiz answers catch the light */
document.querySelectorAll('.pk-cab a, .pk-opt').forEach(function (el) {
  el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); el.style.setProperty('--x', (e.clientX - r.left) + 'px'); el.style.setProperty('--y', (e.clientY - r.top) + 'px'); });
});
/* ad-money bars fill when the comparison scrolls into view */
(function () {
  var cmps = document.querySelectorAll('.pk-compare');
  if (!('IntersectionObserver' in window)) { cmps.forEach(function (c) { c.classList.add('is-lit'); }); return; }
  var io = new IntersectionObserver(function (ens) { ens.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-lit'); io.unobserve(en.target); } }); }, { threshold: 0.25 });
  cmps.forEach(function (c) { io.observe(c); });
})();
`;

export default {
  path: 'packages.html',
  file: 'Index',
  order: 5,
  navTitle: 'The Files',
  section: 'packages',
  title: 'Packages',
  description: `Every Blackout Syndicate package side by side: boosts from ${BOOSTS[0].price}, monthly plans from ${PLANS[0].price}, add-ons and quoted builds. Find yours in 3 questions.`,
  teaser: 'Every file on the table. Pick your size.',
  next: 'packages/spark.html',
  css, js,
  jsonld: (ctx, config) => ({
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: `${BIZ.name} packages`,
    url: config.siteUrl + '/packages.html',
    itemListElement: OFFERS.map((o) => ({
      '@type': 'Offer',
      name: o.name,
      description: o.tagline,
      url: config.siteUrl + '/' + offerPath(o),
      ...(o.kind === 'service' ? {} : { price: String(num(o.price)), priceCurrency: 'USD' }),
      itemOffered: { '@type': 'Service', name: o.name, provider: { '@type': 'LocalBusiness', name: BIZ.name } },
    })),
  }),
  body: (c) => {
    const data = Object.fromEntries(OFFERS.filter((o) => o.kind !== 'service').map((o) => [o.slug, {
      name: o.name, file: o.file, price: o.price, suffix: o.suffix, cadence: o.cadence, run: o.run, oneMonth: o.oneMonth || '',
      ad: adOf(o), ladder: o.ladder ? o.ladder.text : '', href: c.link(offerPath(o)), claim: c.link('contact.html?pkg=' + o.slug + '#intake'),
    }]));
    const dataJson = JSON.stringify(data).replace(/</g, '\\u003c');
    const keys = ['A', 'B', 'C', 'D'];
    const colHead = (o) => `<th scope="col"${o.flagship ? ' class="pk-flag"' : ''}><a href="${c.link(offerPath(o))}"><span>${o.file}${o.flagship ? ' · Flagship' : ''}</span><b>${o.name}</b><span>Open file ${c.arrow}</span></a></th>`;
    const cell = (o, html) => `<td${o.flagship ? ' class="pk-flag"' : ''}>${html}</td>`;

    return `
<header class="pagehead pk-head">
  <div class="wrap pagehead__in">
    ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'Packages' }])}
    <div class="pk-head__grid">
      <div class="pk-head__main">
        <p class="label">Index · ${OFFERS.length} files on the table</p>
        <h1 class="h1">The Files <span class="whisper">Pick your size.</span></h1>
        <p class="lede">Every package we sell, in one place. <strong>One-time boosts</strong> for a single moment, <strong>monthly plans</strong> that keep the push running, add-ons that get your page ready, and bigger jobs we quote and build to order.</p>
        <div class="ctas">
          ${c.btn('Find my file ' + c.arrow, '#match', 'lg')}
          ${c.btn('Compare side by side', '#compare-boosts', 'ghost lg')}
        </div>
      </div>
      <nav class="pk-cab" aria-label="Jump to a section">
        <p class="label label--dim">The cabinet · pull a drawer</p>
        <ol>
          <li><a class="pk-cab__first" href="#match"><span class="pk-cab__no" aria-hidden="true">00</span><span class="pk-cab__name">Find your file</span><span class="pk-cab__meta">3 questions · 1 match</span>${c.arrow}</a></li>
          ${GROUPS.map((g) => `<li><a href="#${g.id}"><span class="pk-cab__no" aria-hidden="true">${g.no}</span><span class="pk-cab__name">${g.name}</span><span class="pk-cab__meta">${g.meta}</span>${c.arrow}</a></li>`).join('')}
          <li><a href="#choose"><span class="pk-cab__no" aria-hidden="true">05</span><span class="pk-cab__name">How to choose</span><span class="pk-cab__meta">4 rules of thumb</span>${c.arrow}</a></li>
        </ol>
      </nav>
    </div>
  </div>
</header>

<section class="band band--coal" id="match" aria-labelledby="match-h">
  <div class="wrap pk-match">
    <div class="pk-match__intro rv">
      <p class="label">Find your file</p>
      <h2 class="h2" id="match-h">Find <span class="whisper">your file.</span></h2>
      <p>Tell us what you’re pushing, for how long, and how much you want off your plate. We point you at the one file that fits, plus an add-on when your page needs it.</p>
      <ul class="pk-match__list pk-jsonly">
        <li>One recommendation, with the reason why</li>
        <li>The price, straight from the file</li>
        <li>No email needed to see it</li>
      </ul>
      <p class="pk-match__xp">First match: +30 clearance</p>
      <p class="pk-match__call">Rather talk it through? Call <a href="${BIZ.phoneHref}">${BIZ.phone}</a>, or <a href="${BIZ.sms}">send a text</a>.</p>
    </div>

    <div class="pk-quiz rv" style="--d:.08s" data-quiz>
      <div class="pk-quiz__top">
        <div class="pk-prog">
          <span class="pk-segs" aria-hidden="true">${QUESTIONS.map(() => '<i data-seg></i>').join('')}</span>
          <span class="pk-prog__t" data-step-text>Question 1 of ${QUESTIONS.length}</span>
        </div>
        <div class="pk-ctl">
          <button type="button" data-back disabled>Back</button>
          <button type="button" data-restart hidden>Start over</button>
        </div>
      </div>
      ${QUESTIONS.map((q, qi) => `
      <div class="pk-q" data-q="${q.key}" role="group" aria-labelledby="pk-q${qi}"${qi ? ' hidden' : ''}>
        <p class="label">Question 0${qi + 1} / 0${QUESTIONS.length}</p>
        <h3 class="pk-q__title" id="pk-q${qi}" tabindex="-1">${q.title}</h3>
        <div class="pk-opts">
          ${q.opts.map((o, oi) => `<button type="button" class="pk-opt" data-a="${o.a}" aria-pressed="false"><span class="pk-opt__key" aria-hidden="true">${keys[oi]}</span><span class="pk-opt__t">${o.t}</span><span class="pk-opt__d">${o.d}</span>${c.arrow}</button>`).join('')}
        </div>
      </div>`).join('')}
      <div class="pk-result" data-result data-toast-quiet tabindex="-1" aria-labelledby="pk-r-name" hidden>
        <div class="pk-result__head">
          <div class="pk-result__id">
            <p class="label" data-r="kicker">Match found</p>
            <h3 class="pk-result__name" id="pk-r-name" data-r="name">Your file</h3>
            <div class="pk-result__price"><span class="price" data-r="price"></span><span class="pk-result__cad" data-r="cadence"></span></div>
          </div>
          <span class="stamp" data-r="stamp" aria-hidden="true">Match<small>Cleared for you</small></span>
        </div>
        <p class="pk-result__why" data-r="why"></p>
        <div class="pk-result__addon" data-r="addon" hidden>
          <p class="label">Pair it with</p>
          <p class="pk-result__an"><a data-r="addon-link" href="${c.link('packages/profile-fix.html')}">Add-on</a><b data-r="addon-price"></b></p>
          <p data-r="addon-why"></p>
        </div>
        <dl class="ledger" data-r="answers"></dl>
        <div class="pk-result__foot">
          <div class="ctas">
            <a class="btn btn--paper" data-r="open" href="${c.link('packages.html')}">Open the file ${c.arrow}</a>
            <a class="btn btn--paper btn--ghost" data-r="claim" href="${c.link('contact.html#intake')}">Claim it</a>
          </div>
          <button class="pk-result__again" type="button" data-restart hidden>Start over</button>
        </div>
        <p class="pk-result__later" data-r="later" hidden><span class="label">When you’re ready for more</span><span data-r="later-text"></span></p>
      </div>
    </div>

    <div class="pk-guide">
      <p class="label">The short guide</p>
      <p>Find your line. Start with that file.</p>
      <ul>
        ${GUIDE.map((g) => { const o = bySlug[g.slug]; const x = g.and && bySlug[g.and]; return `<li><span><b>If you</b> ${g.if}</span><span class="pk-guide__pick"><a href="${c.link(offerPath(o))}">${o.name}</a><small>${o.price}${o.suffix}${x ? ` · plus ${x.name} ${x.price}` : ''}</small></span></li>`; }).join('')}
      </ul>
    </div>
  </div>
  <script type="application/json" id="pk-data">${dataJson}</script>
</section>

<section class="band" id="boosts" aria-labelledby="boosts-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div>
        <p class="label">Drawer 01 · ${BOOSTS.length} files · No contract</p>
        <h2 class="h2 pk-h2" id="boosts-h">One-time boosts</h2>
        <p>One push for one moment. Pick the size, point it at your post, page, channel or site, and we run a real paid placement on one platform through its own ad tools. Our target is live within 24 hours of payment. Platform ad review can take longer.</p>
      </div>
      <a class="textlink" href="#compare-boosts">Compare the three ${c.arrow}</a>
    </div>
    <div class="grid grid--3 pk-grid rv">${BOOSTS.map((o) => c.offerCard(o)).join('')}</div>

    <div class="pk-compare rv" id="compare-boosts">
      <div class="pk-compare__head"><h3 class="h3" id="cmp-boosts-h">Boosts side by side</h3><span class="label label--dim pk-swipe">Swipe the table ${'→'}</span></div>
      <div class="pk-scroll" role="region" aria-labelledby="cmp-boosts-h" tabindex="0">
        <table class="pk-table">
          <caption class="sr">Spark, Boost and Blitz compared: price, ad money, run length, platform, recap and Post Kit.</caption>
          <thead><tr><td><span class="sr">Detail</span></td>${BOOSTS.map(colHead).join('')}</tr></thead>
          <tbody>
            <tr><th scope="row">Price</th>${BOOSTS.map((o) => cell(o, `<span class="pk-num">${o.price}</span><span class="pk-sub">One time</span>`)).join('')}</tr>
            <tr><th scope="row">In the ad itself</th>${BOOSTS.map((o, i) => cell(o, `About $${adOf(o)}<span class="pk-bar" aria-hidden="true"><i style="--w:${Math.round((adOf(o) / MAX_AD) * 100)}%;--d:${(i * 0.15).toFixed(2)}s"></i></span>`)).join('')}</tr>
            <tr><th scope="row">Run length</th>${BOOSTS.map((o) => cell(o, o.run.replace(/^./, (m) => m.toUpperCase()))).join('')}</tr>
            <tr><th scope="row">Platform</th>${BOOSTS.map((o) => cell(o, `${BOOST_ROWS[o.slug].plat}${BOOST_ROWS[o.slug].tiktok ? `<span class="pk-sub">${BOOST_ROWS[o.slug].tiktok}</span>` : ''}`)).join('')}</tr>
            <tr><th scope="row">Recap</th>${BOOSTS.map((o) => cell(o, BOOST_ROWS[o.slug].recap)).join('')}</tr>
            <tr><th scope="row">30-Day Post Kit</th>${BOOSTS.map((o) => cell(o, BOOST_ROWS[o.slug].kit)).join('')}</tr>
            <tr><th scope="row">Best for</th>${BOOSTS.map((o) => cell(o, o.bestFor)).join('')}</tr>
          </tbody>
        </table>
      </div>
      <p class="pk-policy"><b>Refunds</b>${POLICY.boosts}</p>
      <div class="pk-compare__foot">
        <p class="pk-seal"><span class="pk-seal__tag">Sealed</span><span>Each file has a sealed page with the math behind its price. It opens at Clearance 2: ${LEVELS[2].name}.</span></p>
        <a class="textlink" href="${c.link(offerPath(BOOSTS[0]))}">Start with File 01: ${BOOSTS[0].name} ${c.arrow}</a>
      </div>
    </div>
  </div>
</section>

<section class="band band--coal" id="plans" aria-labelledby="plans-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div>
        <p class="label">Drawer 02 · ${PLANS.length} files · Month to month</p>
        <h2 class="h2 pk-h2" id="plans-h">Monthly plans</h2>
        <p>The push keeps running every month, so you never start cold. Every plan starts with a twenty-minute intake call and ends each month with a recap in plain English. Want to try one first? Every plan comes as one month only, with no commitment.</p>
      </div>
      <a class="textlink" href="#compare-plans">Compare the three ${c.arrow}</a>
    </div>
    <div class="grid grid--3 pk-grid rv">${PLANS.map((o) => c.offerCard(o)).join('')}</div>

    <div class="pk-compare rv" id="compare-plans">
      <div class="pk-compare__head"><h3 class="h3" id="cmp-plans-h">Plans side by side</h3><span class="label label--dim pk-swipe">Swipe the table ${'→'}</span></div>
      <div class="pk-scroll" role="region" aria-labelledby="cmp-plans-h" tabindex="0">
        <table class="pk-table">
          <caption class="sr">Surge, Overdrive and Total Blackout compared: monthly price, regular price, one month only price, and what each plan includes.</caption>
          <thead><tr><td><span class="sr">Detail</span></td>${PLANS.map(colHead).join('')}</tr></thead>
          <tbody>
            <tr><th scope="row">Monthly price</th>${PLANS.map((o) => cell(o, `${o.regular ? '<span class="pk-tag">Launch price</span>' : ''}<span class="pk-num">${priceHtml(o)}</span>${lockedIn(o) ? '<span class="pk-sub">Locked in while you stay</span>' : '<span class="pk-sub">Month to month</span>'}`)).join('')}</tr>
            <tr><th scope="row">Regular price</th>${PLANS.map((o) => cell(o, o.regular ? `${o.regular}${lockedIn(o) ? '<span class="pk-sub">What new clients pay after the launch</span>' : ''}` : none)).join('')}</tr>
            <tr><th scope="row">One month only</th>${PLANS.map((o) => cell(o, `${o.oneMonth}<span class="pk-sub">No commitment</span>`)).join('')}</tr>
            <tr><th scope="row">Paid ads</th>${PLANS.map((o) => cell(o, PLAN_ROWS[o.slug].ads)).join('')}</tr>
            <tr><th scope="row">Posting</th>${PLANS.map((o) => cell(o, PLAN_ROWS[o.slug].posting || none)).join('')}</tr>
            <tr><th scope="row">AI</th>${PLANS.map((o) => cell(o, PLAN_ROWS[o.slug].ai || none)).join('')}</tr>
            <tr><th scope="row">Web page</th>${PLANS.map((o) => cell(o, PLAN_ROWS[o.slug].web || none)).join('')}</tr>
            <tr><th scope="row">Monthly recap</th>${PLANS.map((o) => cell(o, 'Spend, reach, clicks or views, and follows')).join('')}</tr>
            <tr><th scope="row">Adds over the tier below</th>${PLANS.map((o) => cell(o, PLAN_ROWS[o.slug].adds)).join('')}</tr>
            <tr><th scope="row">Best for</th>${PLANS.map((o) => cell(o, o.bestFor)).join('')}</tr>
          </tbody>
        </table>
      </div>
      <p class="pk-policy"><b>Billing</b>${POLICY.plans}</p>
      <div class="pk-compare__foot">
        <p>Start on any plan and move up any month.</p>
        <a class="textlink" href="${c.link(offerPath(bySlug['total-blackout']))}">Open the flagship: ${bySlug['total-blackout'].name} ${c.arrow}</a>
      </div>
    </div>
  </div>
</section>

<section class="band" id="addons" aria-labelledby="addons-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">Drawer 03 · ${ADDONS.length} files · Get the page ready</p>
      <h2 class="h2 pk-h2" id="addons-h">Add-ons</h2>
      <p>Small one-time jobs that make every push work harder. A clear page and a month of posts mean the people an ad sends you have a reason to stay.</p>
    </div>
    <div class="grid grid--2 pk-grid rv">${ADDONS.map((o) => c.offerCard(o)).join('')}</div>
    <div class="pk-pair rv">
      <p><strong>Pairs with any boost.</strong> The ${POST_KIT.name} already comes free with every ${bySlug.spark.name}. Profile Fix is best done before your first ad runs, and you publish the changes yourself, so nobody needs your login.</p>
    </div>
    <p class="pk-policy rv"><b>Refunds</b>${POLICY.addons}</p>
  </div>
</section>

<section class="band band--coal" id="built" aria-labelledby="built-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div>
        <p class="label">Drawer 04 · ${SERVICES.length} files · Quoted per job</p>
        <h2 class="h2 pk-h2" id="built-h">Built to order</h2>
        <p>Bigger jobs that don’t fit one price: websites, AI setup and creator systems. Every one starts with a short call, and you get the price in writing before work starts.</p>
      </div>
      ${c.btn('Ask for a quote ' + c.arrow, 'contact.html#intake', 'ghost')}
    </div>
    <ul class="pk-built rv">
      ${SERVICES.map((o) => `<li><a href="${c.link(offerPath(o))}">
        <span class="pk-built__file">${o.file}</span>
        <span class="pk-built__main"><span class="pk-built__name">${o.name}</span><span class="pk-built__tag">${o.tagline}</span></span>
        <span class="pk-built__best"><b>Best for</b>${o.bestFor}</span>
        <span class="pk-built__go"><span class="pk-built__q">Quoted</span><span class="file__open">Open file ${c.arrow}</span></span>
      </a></li>`).join('')}
    </ul>
    <p class="pk-policy rv"><b>Quotes</b>${POLICY.quoted}</p>
  </div>
</section>

<section class="band band--paper" id="choose" aria-labelledby="choose-h">
  <div class="wrap">
    <div class="pk-choose">
      <div class="pk-choose__head rv">
        <p class="label">Four rules of thumb</p>
        <h2 class="h2" id="choose-h">How to choose</h2>
        <p>If the questions didn’t settle it, these will. They are the same rules we use when someone calls and asks which file to buy.</p>
        ${c.btn('Take the 3 questions', '#match', 'paper')}
      </div>
      <ol class="pk-rules rv" style="--d:.08s">
        ${RULES.map((r) => `<li><h3>${r.t}</h3><p>${r.d}</p></li>`).join('')}
      </ol>
    </div>
    <div class="pk-record rv">
      <span class="stamp" aria-hidden="true">On the<br>record</span>
      <p><span class="sr">On the record: </span>${BIZ.resultsNote}</p>
    </div>
  </div>
</section>

<section class="band band--gold" aria-labelledby="pk-final-h">
  <div class="wrap pk-final">
    <div class="pk-final__main">
      <p class="label">Make contact</p>
      <h2 id="pk-final-h">Still<br>deciding?</h2>
      <p>Tell us what you’re pushing and when. We’ll point you at one file, or tell you to keep your money.</p>
      <div class="ctas">${c.btn('Make contact ' + c.arrow, 'contact.html', 'lg')}${c.btn('Find my file', '#match', 'ghost lg')}</div>
    </div>
    <div class="pk-final__side">
      <p class="label">Call or text</p>
      <a class="pk-final__phone" href="${BIZ.phoneHref}">${BIZ.phone}</a>
      <p>${POLICY.payment}</p>
    </div>
  </div>
</section>`;
  },
};
