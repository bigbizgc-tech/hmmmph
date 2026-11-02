// File 14: FAQ. Grouped, deep-linkable, searchable. Answers come from offers.mjs and POLICY only.
import { BIZ, PLATFORMS, POLICY } from '../data/business.mjs';
import { BOOSTS, PLANS, SERVICES, bySlug, offerPath } from '../data/offers.mjs';

const andList = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const SURGE = PLANS[0];
const OVERDRIVE = bySlug.overdrive;
const TOTAL = bySlug['total-blackout'];
const tel = `<a href="${BIZ.phoneHref}">${BIZ.phone}</a>`;
const mail = `<a href="mailto:${BIZ.email}">${BIZ.email}</a>`;

// Each answer is a function of the page context (for c.link) and `ld` (true when building JSON-LD).
const GROUPS = [
  {
    id: 'buying', t: 'Buying and paying', blurb: 'How to buy, where the money goes, and the refund policy word for word.',
    items: [
      { id: 'how-to-buy', q: 'How do I buy a package?', a: (c) => `<p>Send the form on the <a href="${c.link('contact.html')}">contact page</a>, or call or text ${tel}. Tell us what you’re promoting and which package you want. The Claim button on any package page fills that package in for you.</p><p>${POLICY.payment} For boosts, our target is live within 24 hours of payment.</p>` },
      { id: 'ad-money', q: 'How much of my price goes into the actual ad?', a: (c) => `<p>Here is the ad money in each one:</p><ul>${[...BOOSTS, SURGE].map((o) => `<li><a href="${c.link(offerPath(o))}"><strong>${o.name}</strong></a>: ${lc(o.spend)}</li>`).join('')}</ul><p>The rest covers setup, aiming it and your recap. ${OVERDRIVE.name} includes everything in ${SURGE.name}.</p>` },
      { id: 'refunds', q: 'What is your refund policy?', a: (c) => `<p>Word for word:</p><ul><li><strong>Boosts:</strong> ${POLICY.boosts}</li><li><strong>Monthly plans:</strong> ${POLICY.plans}</li><li><strong>Add-ons:</strong> ${POLICY.addons}</li><li><strong>Quoted jobs:</strong> ${POLICY.quoted}</li><li><strong>Rejected ads:</strong> ${POLICY.rejected}</li></ul><p>The full terms are on the <a href="${c.link('terms.html')}">terms and refunds page</a>.</p>` },
      { id: 'quoted', q: 'How do you price websites and AI work?', a: (c) => `<p>${andList(SERVICES.map((o) => `<a href="${c.link(offerPath(o))}">${o.name}</a>`))} are quoted per job. After a short call you get a written quote with the price and what’s included, before any work starts.</p><p>${POLICY.quoted}</p>` },
    ],
  },
  {
    id: 'ads', t: 'The ads', blurb: 'What runs, who sees it, where it runs and how fast.',
    items: [
      { id: 'real-ads', q: 'Are these real ads? Who sees them?', a: () => `<p>Yes. Every push is a real paid placement, bought through the platform’s own ad tools, the same ones any business uses. No bots, no fake followers, no engagement pods.</p><p>It’s shown to the people you pick: your area, or the audience you name. Local shops usually aim by place. Creators usually aim by the kind of viewer.</p>` },
      { id: 'what-promote', q: 'What can I promote? Do I need to make a new ad?', a: (c) => `<p>Your post, page, channel, website or booking line. A boost puts money behind something you already have, so you don’t need a new video to start.</p><p>If you want content made, the <a href="${c.link('packages/post-kit.html')}">30-Day Post Kit</a> gives you a month of captions, and <a href="${c.link(offerPath(TOTAL))}">${TOTAL.name}</a> includes AI-made posts and promos.</p>` },
      { id: 'platforms', q: 'Which platforms do you run ads on?', a: () => `<p>${andList(PLATFORMS.map((p) => p.name))}. ${PLATFORMS.filter((p) => p.fresh).map((p) => `${p.name} is the newest, and we’re booking it now.`).join(' ')}</p><p>Each boost runs on one platform you pick. ${SURGE.name} and ${OVERDRIVE.name} run on up to 2. If a platform is the wrong fit for you, we’ll tell you straight.</p>` },
      { id: 'how-fast', q: 'How fast does a boost go live?', a: () => `<p>Our target is live within 24 hours of payment. For an event, book at least a week ahead so the whole run lands before the date. Monthly plans start with the intake call.</p>` },
      { id: 'rejected', q: 'What if a platform rejects my ad?', a: () => `<p>Every platform reviews ads before they run. ${POLICY.rejected}</p>` },
    ],
  },
  {
    id: 'results', t: 'Results', blurb: 'What to expect, and what you get at the end.',
    items: [
      { id: 'how-many', q: 'How many views or followers will I get?', a: () => `<p>${BIZ.resultsNote}</p><p>Nobody honest can promise you a number. What you get is a real ad in front of real people, aimed where you want it, and a straight recap of what it did.</p>` },
      { id: 'recap', q: 'What do I get at the end of a run?', a: (c) => `<p>A recap. ${BOOSTS[0].name}’s covers spend, reach, and clicks or views. ${andList(BOOSTS.slice(1).map((o) => o.name))} add follows. Monthly plans get a recap every month with spend, reach, clicks or views, and follows.</p><p>Every recap shows what was spent and what it reached. <a href="${c.link('how-it-works.html#recap')}">What each number means</a>.</p>` },
      { id: 'small', q: 'Is a small boost even worth it?', a: (c) => `<p><a href="${c.link(offerPath(BOOSTS[0]))}">${BOOSTS[0].name}</a> is a test, and that’s its job. ${BOOSTS[0].spend} Real people see a real placement, and you find out whether a bigger push makes sense before you spend more.</p>` },
      { id: 'flop', q: 'What if the ad doesn’t do much?', a: (c) => `<p>Then you learned something real for the price of a test, and we’ll tell you straight what we’d change: the post, the aim, the platform, or the page people land on.</p><p>Sometimes the honest answer is to fix your page before you spend another dollar. That’s what <a href="${c.link('packages/profile-fix.html')}">Profile Fix</a> is for.</p>` },
    ],
  },
  {
    id: 'plans', t: 'Monthly plans', blurb: 'Contracts, cancelling, launch prices and how the three plans differ.',
    items: [
      { id: 'contract', q: 'Is there a contract on the monthly plans?', a: () => `<p>No long contract. Monthly plans run month to month. The monthly price is for staying month to month.</p><p>Just want one month? ${andList(PLANS.filter((o) => o.oneMonth).map((o) => `${o.name} is ${o.oneMonth}`))}, with no commitment.</p>` },
      { id: 'cancel', q: 'How do I cancel a plan?', a: (c) => `<p>Call, text or email us. ${POLICY.plans}</p><p>The full terms are on the <a href="${c.link('terms.html')}">terms and refunds page</a>.</p>` },
      { id: 'launch-price', q: 'What does “launch price” mean?', a: () => `<p>${PLANS.filter((o) => o.regular).map((o) => `${o.name} is ${o.price} a month at launch. Its regular price is ${o.regular.replace('/mo', ' a month')}.`).join(' ')}</p><p>Start at the launch price and you keep it for as long as you stay. New clients after the launch pay the regular price.</p>` },
      { id: 'which-plan', q: 'What’s the difference between the three plans?', a: (c) => `<ul><li><a href="${c.link(offerPath(SURGE))}"><strong>${SURGE.name}</strong></a> (${SURGE.price}${SURGE.suffix}): paid promotion every month on up to 2 platforms, with a monthly recap.</li><li><a href="${c.link(offerPath(OVERDRIVE))}"><strong>${OVERDRIVE.name}</strong></a> (${OVERDRIVE.price}${OVERDRIVE.suffix}): everything in ${SURGE.name}, plus automatic posting and AI tools for the repeat work in your business.</li><li><a href="${c.link(offerPath(TOTAL))}"><strong>${TOTAL.name}</strong></a> (${TOTAL.price}${TOTAL.suffix}): ads, AI-made posts, an AI assistant that answers your customers, and a clean web page, all set up and run for you.</li></ul><p>You can move up any month.</p>` },
    ],
  },
  {
    id: 'accounts', t: 'Your accounts and privacy', blurb: 'Your logins, your OK, your information.',
    items: [
      { id: 'passwords', q: 'Do I have to give you my passwords?', a: () => `<p>Not for Profile Fix. You publish the changes yourself, so nobody else needs your login.</p><p>For ads and automatic posting, we go over exactly what access your package needs before anything is set up. Your accounts stay yours.</p>` },
      { id: 'your-ok', q: 'Will anything go out under my name without my OK?', a: () => `<p>No. Nothing runs without your OK, and nothing goes out under your name that you haven’t seen. AI replies and automations are written around your business and approved by you before they go live.</p>` },
      { id: 'form', q: 'What happens to what I send in the contact form?', a: (c) => `<p>It’s emailed to us so we can get back to you about what you asked. The <a href="${c.link('privacy.html')}">privacy page</a> covers what we collect and why.</p>` },
      { id: 'clearance-meter', q: 'What is the clearance meter on this site?', a: (c, ld) => `<p>Every page here is a file. Open one and read it to the end and your clearance goes up. Higher levels open the classified blocks: the pricing math, how a push is aimed, the founder’s file, and at Level 5 the Vault.</p><p>Clearance is saved in your own browser only, and you can burn it from the clearance panel any time. Separately, the site can use the X pixel, a measurement tag from X, to count visits and form sends that come from our ads. The <a href="${c.link('privacy.html')}">privacy page</a> has the details.</p>${ld ? '' : `<p class="qa__secret">There are three hidden marks on this site. One of them is right here. ${c.mark('m3')}</p>`}` },
    ],
  },
  {
    id: 'local', t: 'Local, and who we work with', blurb: 'Where we are, who we’re for, and who runs it.',
    items: [
      { id: 'where', q: 'Where are you? Do I have to be local?', a: (c) => `<p>We’re in ${BIZ.city}, ${BIZ.regionLong}, and we work with people in ${andList(BIZ.area)}. You don’t have to be local. Ads, posts and setups all work from anywhere online.</p><p><a href="${c.link(offerPath(bySlug['ai-consulting']))}">AI Consulting</a> can be done in person around ${andList(BIZ.area)}, or on a call.</p>` },
      { id: 'who-for', q: 'Who do you work with?', a: () => `<p>Creators, streamers, solo businesses and local shops. Musicians and events too.</p><p>Not sure you fit? Ask. We’ll tell you straight which package makes sense, or whether you need one at all.</p>` },
      { id: 'who-runs', q: 'Who is behind Blackout Syndicate?', a: (c) => `<p>${BIZ.founder}, known as ${BIZ.founderShort}. A ${BIZ.city} guy who spent ten years building things with his hands before he started building reach. ${BIZ.name} is a ${BIZ.legal} company.</p><p>His file is on the <a href="${c.link('about.html')}">About page</a>. You can also call or text ${tel} or email ${mail} and talk to a real person.</p>` },
    ],
  },
];
const TOTAL_Q = GROUPS.reduce((n, g) => n + g.items.length, 0);
const plain = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/\s([.,:;?!])/g, '$1').trim();

const css = `
/* ── Head ── */
.faq-title .whisper{display:block;font-size:clamp(24px,3.2vw,44px);line-height:1.05;margin-top:.35em}
.faq-tools{display:grid;gap:18px;margin-top:10px}
.faq-find{display:grid;gap:10px;max-width:660px}
.faq-find[hidden]{display:none}
.faq-find label{font-family:var(--f-type);font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash)}
.faq-find__box{position:relative}
.faq-find__box svg{position:absolute;left:16px;top:50%;width:20px;height:20px;margin-top:-10px;color:var(--gold);pointer-events:none}
.faq-find input{width:100%;font:inherit;font-size:18px;color:var(--paper);background:var(--coal);border:1px solid var(--smoke);border-radius:0;padding:16px 16px 16px 50px;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none;appearance:none}
.faq-find input::placeholder{color:#6f695f}
.faq-find input:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(217,178,95,.18)}
.faq-find input::-webkit-search-cancel-button{filter:sepia(1) saturate(3) hue-rotate(5deg);cursor:pointer}
.faq-find__status{font-family:var(--f-type);font-size:13px;letter-spacing:.06em;color:var(--ash);min-height:1.4em}
.faq-find__status b{color:var(--gold);font-weight:700}
.faq-index ol{list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--smoke);border:1px solid var(--smoke)}
.faq-index a{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:14px;align-items:center;padding:16px 18px;background:var(--void);color:var(--paper);text-decoration:none;transition:background .25s,opacity .3s;min-height:100%}
.faq-index a:hover{background:var(--coal)}
.faq-index a:hover b{color:var(--gold-hi)}
.faq-index__n{font-family:var(--f-display);font-weight:900;font-size:34px;line-height:.8;color:transparent;-webkit-text-stroke:1.2px var(--gold);transition:color .25s}
.faq-index a:hover .faq-index__n{color:var(--gold)}
.faq-index b{font-family:var(--f-display);font-weight:800;font-size:22px;line-height:1;text-transform:uppercase;letter-spacing:.02em;transition:color .25s}
.faq-index small{font-family:var(--f-type);font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);white-space:nowrap}
.faq-index a.is-empty{opacity:.35}
@media (max-width:900px){.faq-index ol{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.faq-index ol{grid-template-columns:1fr}.faq-index a{padding:13px 16px}.faq-index b{font-size:20px}}

/* ── Groups ── */
.faq-body{padding-top:clamp(48px,7vw,96px)}
.faq-body.is-empty{display:none}
.faq-group{display:grid;grid-template-columns:minmax(0,.78fr) minmax(0,1.4fr);gap:clamp(28px,5vw,80px);align-items:start;padding-block:clamp(48px,6vw,84px);border-top:1px solid var(--smoke)}
.faq-group:first-of-type{border-top:0;padding-top:0}
.faq-group[hidden]{display:none}
.faq-group__head{position:sticky;top:104px;display:grid;gap:14px;min-width:0}
.faq-group__head h2{font-family:var(--f-display);font-weight:900;font-size:clamp(40px,4.6vw,66px);line-height:.88;text-transform:uppercase}
.faq-group__head p:not(.label){color:var(--ash);max-width:36ch}
.faq-group__top{font-family:var(--f-type);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);text-decoration:none;width:fit-content;border-bottom:1px solid var(--smoke)}
.faq-group__top:hover{color:var(--gold);border-color:var(--gold)}
@media (max-width:900px){.faq-group{grid-template-columns:1fr;gap:22px}.faq-group__head{position:static}.faq-group__top{display:none}}
.faq-list{min-width:0}
.faq-list .qa[hidden]{display:none}
.faq-list .qa{scroll-margin-top:96px}
.faq-list .qa:target summary{color:var(--gold-hi)}
.faq-list .qa > div{max-width:62ch}
.faq-list .qa ul{padding-left:1.2em;display:grid;gap:.5em}
.faq-list .qa li::marker{color:var(--brass)}
.faq-list .qa strong{color:var(--paper);font-weight:600}
.faq-list .qa a{text-underline-offset:3px}
.faq-list .qa a strong{color:inherit}
.faq-list .qa[open] > div > *{animation:scanIn .6s var(--ease) both}
.faq-list .qa[open] > div > :nth-child(2){animation-delay:.07s}
.faq-list .qa[open] > div > :nth-child(3){animation-delay:.14s}
.faq-list .qa[open] > div > :nth-child(n+4){animation-delay:.2s}
@keyframes scanIn{from{clip-path:inset(0 100% 0 0);opacity:.15}to{clip-path:inset(0 -2% 0 0);opacity:1}}
.qa__link{font-family:var(--f-type);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash) !important;text-decoration:none;width:fit-content;border-bottom:1px dashed var(--smoke);padding-bottom:2px}
.qa__link:hover{color:var(--gold) !important;border-color:var(--gold)}
.qa__secret{font-family:var(--f-type);font-size:14px}
.qa__secret .hidden-mark{margin-left:6px}
mark.hit{background:var(--gold);color:var(--void);padding:0 .08em}
.faq-empty{display:grid;gap:14px;justify-items:start;padding:clamp(20px,3vw,32px);border:1px dashed var(--brass)}
.faq-empty[hidden]{display:none}
.faq-empty p:not(.label){font-size:var(--t-lede)}

/* ── Close (paper) ── */
.ask{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:clamp(32px,6vw,90px);align-items:end;position:relative}
@media (max-width:900px){.ask{grid-template-columns:1fr;align-items:start}}
.ask__main{display:grid;gap:22px;justify-items:start;min-width:0}
.ask__main .lede{color:var(--ink)}
.ask__lines{display:grid;gap:10px;padding:26px 24px;border:1.5px solid var(--ink);box-shadow:10px 10px 0 rgba(23,20,15,.12);min-width:0;position:relative}
.ask__phone{font-family:var(--f-display);font-weight:900;font-size:clamp(38px,4.4vw,56px);line-height:1;color:var(--ink);text-decoration:none;font-variant-numeric:tabular-nums}
.ask__phone:hover{color:var(--brass)}
.ask__mail{font-size:19px;color:var(--ink);overflow-wrap:anywhere;text-underline-offset:4px;text-decoration-color:var(--brass)}
.ask__note{font-size:15px;color:var(--ink-mute)}
.ask .stamp{position:absolute;right:0;top:-62px;width:128px;font-size:20px;box-shadow:inset 0 0 0 5px var(--paper),inset 0 0 0 6.5px var(--signal)}
@media (max-width:560px){.ask .stamp{width:104px;font-size:17px;top:-48px;right:-4px}}
`;

const js = `
(() => {
  const root = document.querySelector('[data-faq]');
  if (!root) return;
  const items = [...root.querySelectorAll('details.qa')];
  const groups = [...root.querySelectorAll('[data-faq-group]')];

  /* Deep links: #question-id opens that answer */
  const openFromHash = () => {
    let id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
    const el = id && document.getElementById(id);
    if (el && el.matches('details.qa')) el.open = true;
  };
  openFromHash();
  addEventListener('hashchange', openFromHash);

  /* "Link to this answer" also copies the link */
  root.addEventListener('click', (e) => {
    const a = e.target.closest('[data-qa-link]');
    if (!a) return;
    const url = location.href.split('#')[0] + a.getAttribute('href');
    try { navigator.clipboard.writeText(url).then(() => { if (window.BS) window.BS.toast('Link copied. Send it to whoever asked.', 'FAQ'); }, () => {}); } catch (err) { /* the address bar has it */ }
  });

  /* Search the answers */
  const box = document.querySelector('[data-faq-find]');
  const input = document.querySelector('[data-faq-input]');
  const status = document.querySelector('[data-faq-status]');
  const empty = document.querySelector('[data-faq-empty]');
  const emptyQ = document.querySelector('[data-faq-empty-q]');
  if (!box || !input) return;
  box.hidden = false;
  const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[\\u2018\\u2019]/g, "'").replace(/[\\u201c\\u201d]/g, '"');
  const textOf = (d) => { const t = d.cloneNode(true); t.querySelectorAll('[data-qa-link], .hidden-mark, .qa__secret').forEach((n) => n.remove()); return fold(t.textContent); };
  const texts = items.map(textOf);
  const opened = new Set();
  const esc = (w) => w.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&').replace(/'/g, "['\\u2019]");
  const unmark = () => root.querySelectorAll('mark.hit').forEach((m) => { const p = m.parentNode; m.replaceWith(document.createTextNode(m.textContent)); p.normalize(); });
  const markIn = (el, re) => {
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement.closest('[data-qa-link], .qa__secret, mark') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    const nodes = []; while (walk.nextNode()) nodes.push(walk.currentNode);
    nodes.forEach((n) => {
      const s = n.nodeValue; re.lastIndex = 0; if (!re.test(s)) return;
      re.lastIndex = 0; const frag = document.createDocumentFragment(); let last = 0, m;
      while ((m = re.exec(s))) { if (!m[0]) { re.lastIndex++; continue; } frag.append(s.slice(last, m.index)); const k = document.createElement('mark'); k.className = 'hit'; k.textContent = m[0]; frag.append(k); last = m.index + m[0].length; }
      frag.append(s.slice(last)); n.replaceWith(frag);
    });
  };
  const run = () => {
    const raw = input.value.trim();
    const words = fold(raw).split(/\\s+/).filter((w) => w.length > 1);
    unmark();
    if (!words.length) {
      items.forEach((d) => { d.hidden = false; if (opened.has(d)) { d.open = false; } });
      opened.clear();
      groups.forEach((g) => (g.hidden = false));
      document.querySelectorAll('[data-faq-tab]').forEach((a) => a.classList.remove('is-empty'));
      status.textContent = ''; empty.hidden = true;
      root.closest('.faq-body').classList.remove('is-empty');
      return;
    }
    /* Highlight whole words that start with what was typed, so a link or word isn't chopped mid-way */
    const re = new RegExp('(?:' + words.map((w) => (/^\\w/.test(w) ? '\\\\b' : '') + esc(w)).join('|') + ')[\\\\w\\u2019\\']*', 'gi');
    let n = 0;
    const hits = [];
    items.forEach((d, i) => { const ok = words.every((w) => texts[i].includes(w)); d.hidden = !ok; if (ok) { n++; hits.push(d); markIn(d, re); } });
    opened.forEach((d) => { if (!hits.includes(d) || hits.length > 3) { d.open = false; opened.delete(d); } });
    if (hits.length <= 3) hits.forEach((d) => { if (!d.open) { d.open = true; opened.add(d); } });
    groups.forEach((g) => { const any = g.querySelector('details.qa:not([hidden])'); g.hidden = !any; const tab = document.querySelector('[data-faq-tab="' + g.id + '"]'); if (tab) tab.classList.toggle('is-empty', !any); });
    empty.hidden = n > 0;
    if (emptyQ) emptyQ.textContent = raw;
    status.innerHTML = n ? '<b>' + n + '</b> answer' + (n === 1 ? '' : 's') + ' on file' : '<span class="sr">Nothing on file for that. Ask us below.</span>';
    root.closest('.faq-body').classList.toggle('is-empty', n === 0);
  };
  input.addEventListener('input', run);
  input.addEventListener('search', run);
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { input.value = ''; run(); } });
})();
`;

export default {
  path: 'faq.html',
  file: 'File 14',
  order: 31,
  navTitle: 'FAQ',
  section: 'faq',
  title: 'FAQ',
  description: 'Straight answers on buying, refunds, the ads, results, monthly plans, your accounts and privacy, from Blackout Syndicate in South Bend, Indiana.',
  teaser: 'Every question people ask before they buy, answered straight.',
  next: 'about.html',
  css,
  js,
  jsonld: (ctx) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GROUPS.flatMap((g) => g.items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: plain(it.a(ctx, true)) } }))),
  }),
  body: (c) => `
<header class="pagehead">
  <div class="wrap pagehead__in">
    ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'FAQ' }])}
    <p class="label">File 14 · Asked and answered</p>
    <h1 class="h1 faq-title">FAQ<span class="whisper">Every question people ask before they buy.</span></h1>
    <p class="lede">${TOTAL_Q} straight answers about buying, the ads, results, monthly plans, your accounts and who we work with. Policy wording is quoted word for word.</p>
    <div class="faq-tools" id="faq-index">
      <div class="faq-find" data-faq-find hidden>
        <label for="faq-q">Search the answers</label>
        <div class="faq-find__box">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>
          <input type="search" id="faq-q" data-faq-input placeholder="Try “refund”, “TikTok” or “cancel”" autocomplete="off" spellcheck="false" aria-describedby="faq-q-status">
        </div>
        <p class="faq-find__status" id="faq-q-status" data-faq-status aria-live="polite"></p>
        <div class="faq-empty" data-faq-empty hidden>
          <p class="label label--red">No match</p>
          <p>Nothing on file for “<span data-faq-empty-q></span>”. Ask it straight and you’ll get a straight answer.</p>
          ${c.btn('Ask us ' + c.arrow, 'contact.html')}
        </div>
      </div>
      <nav class="faq-index" aria-label="FAQ sections">
        <ol>
          ${GROUPS.map((g, i) => `<li><a href="#${g.id}" data-faq-tab="${g.id}"><span class="faq-index__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><b>${g.t}</b><small>${g.items.length} answers</small></a></li>`).join('')}
        </ol>
      </nav>
    </div>
  </div>
</header>

<section class="band faq-body" aria-label="Questions and answers">
  <div class="wrap" data-faq>
    ${GROUPS.map((g, i) => `
    <section class="faq-group" id="${g.id}" data-faq-group aria-labelledby="${g.id}-h">
      <div class="faq-group__head rv">
        <p class="label">Section ${String(i + 1).padStart(2, '0')} · ${g.items.length} answers</p>
        <h2 id="${g.id}-h">${g.t}</h2>
        <p>${g.blurb}</p>
        <a class="faq-group__top" href="#faq-index">Back to the index</a>
      </div>
      <div class="faq-list rv" style="--d:.08s">
        ${g.items.map((it) => `<details class="qa" id="${it.id}"><summary><span>${it.q}</span></summary><div>${it.a(c, false)}<a class="qa__link" href="#${it.id}" data-qa-link>Link to this answer</a></div></details>`).join('')}
      </div>
    </section>`).join('')}
  </div>
</section>

<section class="band band--paper" aria-labelledby="ask-h">
  <div class="wrap ask">
    <div class="ask__main rv">
      <p class="label">Not on file</p>
      <h2 class="h2" id="ask-h">Didn’t see <span class="whisper">your question?</span></h2>
      <p class="lede">Ask it straight. A real person in ${BIZ.city} reads it and gives you a straight answer, in plain English.</p>
      <div class="ctas">${c.btn('Ask us ' + c.arrow, 'contact.html', 'paper lg')}${c.btn('How it works', 'how-it-works.html', 'paper ghost lg')}</div>
    </div>
    <div class="ask__lines rv" style="--d:.1s">
      <span class="stamp" aria-hidden="true">On the<br>record<small>Straight answers</small></span>
      <p class="label">Or reach us direct</p>
      <a class="ask__phone" href="${BIZ.phoneHref}">${BIZ.phone}</a>
      <a class="ask__mail" href="mailto:${BIZ.email}">${BIZ.email}</a>
      <p class="ask__note">Call or text. ${andList(BIZ.area)}, and anywhere online.</p>
    </div>
  </div>
</section>`,
};
