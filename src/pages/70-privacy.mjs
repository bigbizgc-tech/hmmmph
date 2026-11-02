// Privacy policy. Plain-English draft for the owner to have reviewed.
// Written against what the site actually does (see src/assets/js/site.js, src/layout.mjs, src/config.mjs):
// the lead form posts JSON to config.formEndpoint (FormSubmit by default), the X Pixel loads when
// config.xPixelId is set, clearance lives in localStorage key "bs2.clearance.v1", the form and
// thank-you page use sessionStorage for the current tab only, and fonts load from Google Fonts.
// This module also exports the shared legal-page pieces that 71-terms.mjs imports.
import { BIZ, SOCIALS, XP } from '../data/business.mjs';
import { OFFERS } from '../data/offers.mjs';
import config from '../config.mjs';

export const SITE_HOST = new URL(config.siteUrl).host;
const pad = (i) => String(i + 1).padStart(2, '0');
const mail = `<a href="mailto:${BIZ.email}">${BIZ.email}</a>`;
const tel = `<a href="${BIZ.phoneHref}">${BIZ.phone}</a>`;
const andList = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

// ── Shared legal-page pieces (imported by 71-terms.mjs) ──────────────────────
export const LEGAL_CSS = `
/* ── Head ── */
.lg-head__grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,370px);gap:clamp(28px,5vw,72px);align-items:end}
@media (max-width:940px){.lg-head__grid{grid-template-columns:1fr;align-items:start}.lg-card{max-width:520px}}
.lg-head__main{display:grid;gap:22px;min-width:0}
.lg-title{overflow-wrap:anywhere}
.lg-title .whisper{display:block;font-size:clamp(26px,3.4vw,46px);line-height:1.05;margin-top:.3em}
.lg-card{position:relative;background:var(--coal);border:1px solid var(--smoke);padding:22px 22px 18px;display:grid;gap:12px;min-width:0}
.lg-card::before{content:"";position:absolute;inset:-1px -1px auto auto;width:30px;height:30px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.lg-card__top{display:flex;justify-content:space-between;align-items:center;gap:14px}
.lg-card__top .label{max-width:16ch}
.lg-card .stamp{width:112px;font-size:18px;flex:none;margin:-6px -4px -2px 0}
.lg-card .ledger dd{overflow-wrap:anywhere}
.lg-card .ledger a{color:var(--gold);text-decoration:none;border-bottom:1px solid var(--brass)}
.lg-card .ledger a:hover{color:var(--gold-hi)}

/* ── The short version (paper) ── */
.lg-short__head{display:grid;gap:14px;margin-bottom:clamp(26px,3.5vw,38px)}
.lg-short__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:rgba(23,20,15,.18);border:1px solid rgba(23,20,15,.18)}
.lg-short__grid>div{background:var(--paper);padding:22px 22px 20px;display:grid;gap:10px;align-content:start;min-width:0}
.lg-short__grid b{font-family:var(--f-display);font-weight:900;font-size:clamp(24px,2.4vw,30px);line-height:1;text-transform:uppercase}
.lg-short__grid p{font-size:15.5px;color:var(--ink-mute)}
.lg-short__grid a{font-family:var(--f-type);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--brass);width:fit-content;margin-top:auto}
.lg-short__grid a:hover{color:var(--brass)}
.lg-short__fine{margin-top:18px;font-size:15px;color:var(--ink-mute)}
@media (max-width:600px){.lg-short__grid{grid-template-columns:1fr}}

/* ── Index ── */
.lg-index{display:grid;gap:14px;margin-bottom:clamp(20px,3vw,32px)}
.lg-index h2{font-weight:400}
.lg-index ol{list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--smoke);border:1px solid var(--smoke);counter-reset:none}
.lg-index a{display:grid;grid-template-columns:44px minmax(0,1fr);gap:10px;align-items:center;padding:12px 16px;background:var(--void);color:var(--paper);text-decoration:none;font-size:15.5px;line-height:1.3;min-height:100%;transition:background .25s,color .25s}
.lg-index a:hover{background:var(--coal);color:var(--gold-hi)}
.lg-index__n{font-family:var(--f-display);font-weight:900;font-size:26px;line-height:.8;color:transparent;-webkit-text-stroke:1px var(--gold);transition:color .25s}
.lg-index a:hover .lg-index__n{color:var(--gold)}
@media (max-width:600px){.lg-index ol{grid-template-columns:1fr}}

/* ── Sections ── */
.lg-prose{max-width:none;gap:0}
.lg-sec{position:relative;isolation:isolate;display:grid;grid-template-columns:84px minmax(0,1fr);gap:0 28px;padding-block:clamp(34px,4.4vw,52px);border-top:1px solid var(--smoke)}
.lg-sec:last-child{padding-bottom:0}
.lg-sec__side{display:grid;gap:12px;align-content:start;justify-items:start}
.lg-sec__n{font-family:var(--f-display);font-weight:900;font-size:62px;line-height:.8;color:transparent;-webkit-text-stroke:1.5px var(--gold);transition:color .5s}
.lg-sec__top{font-family:var(--f-type);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);text-decoration:none;line-height:1.3}
.prose .lg-sec__top{color:var(--ash)}
.prose .lg-sec__top:hover{color:var(--gold)}
.lg-sec__body{display:grid;gap:1em;max-width:66ch;min-width:0}
.prose .lg-sec__body>h2{margin-top:0;font-size:clamp(32px,3.8vw,46px)}
.prose .lg-sec__body h3{margin-top:.5em}
.prose .lg-sec__body ul,.prose .lg-sec__body ol{gap:.55em}
.prose .ticks{padding-left:0}
.prose .btn{color:var(--fg)}
.prose .lines__note{color:var(--ash)}
.prose .muted{color:var(--ash)}
.lg-sec:hover .lg-sec__n{color:rgba(217,178,95,.22)}
/* the searchlight finds the section you asked for */
.lg-sec::after{content:"";position:absolute;left:-60px;top:-20px;width:min(640px,100%);height:300px;z-index:-1;pointer-events:none;opacity:0;background:radial-gradient(closest-side,rgba(217,178,95,.2),transparent);transform-origin:15% 35%}
.lg-sec:target::after{animation:lgBeam 1.8s var(--ease) forwards}
.lg-sec:target .lg-sec__n{color:var(--gold)}
.lg-sec:target .lg-sec__body>h2{animation:lgLit 1.8s var(--ease)}
@keyframes lgBeam{0%{opacity:0;transform:translateX(-40px) scale(.5)}40%{opacity:1}100%{opacity:.9;transform:none}}
@keyframes lgLit{0%,100%{text-shadow:none}35%{color:var(--gold-hi);text-shadow:0 0 30px rgba(243,212,138,.55)}}
@media (max-width:640px){
  .lg-sec{grid-template-columns:1fr;gap:16px}
  .lg-sec__side{grid-auto-flow:column;justify-content:space-between;align-items:end;width:100%}
  .lg-sec__n{font-size:46px}
}

/* ── Callouts inside the text ── */
.lg-quote{border-left:3px solid var(--gold);padding:4px 0 4px 18px;font-family:var(--f-serif);font-style:italic;font-size:clamp(21px,2.2vw,25px);line-height:1.4}
.prose .lg-quote{color:var(--paper)}
.lg-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.lg-pair>div{border:1px solid var(--smoke);background:var(--coal);padding:18px 18px 20px;display:grid;gap:12px;align-content:start;min-width:0}
.lg-pair .ticks{gap:9px;font-size:15.5px}
@media (max-width:600px){.lg-pair{grid-template-columns:1fr}}
.lg-steps{counter-reset:lg}
.prose .lg-steps{list-style:none;padding-left:0}
.lg-steps>li{counter-increment:lg;display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px}
.lg-steps>li::before{content:counter(lg,decimal-leading-zero);font-family:var(--f-type);color:var(--gold);font-size:14px;padding-top:3px}

/* ── Closing ── */
.lg-close{display:grid;gap:clamp(22px,3vw,30px)}
.lg-close__row{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:18px 28px}
.lg-close__row p{color:var(--ash);max-width:52ch}
`;

// Page header: crumbs, title, lede and the "file status" card with Last updated.
export const legalHead = (c, { crumb, kicker, title, whisper, lede, stamp, meta }) => `
<header class="pagehead">
  <div class="wrap pagehead__in">
    ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: crumb }])}
    <div class="lg-head__grid">
      <div class="lg-head__main">
        <p class="label">${kicker}</p>
        <h1 class="h1 lg-title">${title}<span class="whisper">${whisper}</span></h1>
        <p class="lede">${lede}</p>
      </div>
      <aside class="lg-card" aria-label="About this policy">
        <div class="lg-card__top">
          <p class="label">File status</p>
          <span class="stamp stamp--gold is-slam" aria-hidden="true">${stamp[0]}<br>${stamp[1]}<small>${stamp[2]}</small></span>
        </div>
        <dl class="ledger">${meta.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
      </aside>
    </div>
  </div>
</header>`;

// "The short version": four plain cells on a paper band, each pointing at its full section.
export const legalShort = ({ id, label, h2, cells, fine = '' }) => `
<section class="band band--paper band--tight" aria-labelledby="${id}">
  <div class="wrap wrap--narrow">
    <div class="lg-short__head rv"><p class="label">${label}</p><h2 class="h2" id="${id}">${h2}</h2></div>
    <div class="lg-short__grid rv" style="--d:.06s">${cells.map((x) => `<div><b>${x.t}</b><p>${x.p}</p><a href="#${x.go}">${x.link} ↓</a></div>`).join('')}</div>
    ${fine ? `<p class="lg-short__fine rv">${fine}</p>` : ''}
  </div>
</section>`;

// Index + numbered sections, all on one narrow reading column.
export const legalBody = (label, sections) => `
<section class="band lg-body" aria-label="${label}">
  <div class="wrap wrap--narrow">
    <nav class="lg-index rv" id="index" aria-labelledby="index-h">
      <h2 class="label" id="index-h">In this file · ${sections.length} sections</h2>
      <ol>${sections.map((s, i) => `<li><a href="#${s.id}"><span class="lg-index__n" aria-hidden="true">${pad(i)}</span><span>${s.t}</span></a></li>`).join('')}</ol>
    </nav>
    <div class="prose lg-prose">
      ${sections.map((s, i) => `
      <section class="lg-sec rv" id="${s.id}" aria-labelledby="${s.id}-h">
        <div class="lg-sec__side"><span class="lg-sec__n" aria-hidden="true">${pad(i)}</span><a class="lg-sec__top" href="#index" aria-label="Back to the index">↑ Index</a></div>
        <div class="lg-sec__body">
          <h2 id="${s.id}-h">${s.t}</h2>
          ${s.body}
        </div>
      </section>`).join('')}
    </div>
  </div>
</section>`;

// Closing: the next file card (global .nextfile styles) plus a row of ways in.
export const legalClose = (c, { label, title, teaser, href, line, ctas }) => `
<section class="band band--tight nextfile" aria-label="Where to next">
  <div class="wrap lg-close">
    <a class="nextfile__card" href="${c.link(href)}" data-spot>
      <span class="label">${label}</span>
      <span class="nextfile__title">${title}</span>
      <span class="nextfile__teaser">${teaser}</span>
      <span class="nextfile__go">Open it ${c.arrow}</span>
    </a>
    <div class="lg-close__row rv">
      <p>${line}</p>
      <div class="ctas">${ctas}</div>
    </div>
  </div>
</section>`;

// ── Privacy-only pieces ──────────────────────────────────────────────────────
const PKG_NAMES = Object.fromEntries(OFFERS.map((o) => [o.slug, o.name]));

const css = LEGAL_CSS + `
/* ── Live readout of what this browser holds ── */
.lg-mine{position:relative;display:grid;gap:12px;padding:clamp(18px,2.6vw,26px);background:var(--coal);border:1px solid var(--brass);margin-block:.4em}
.lg-mine::before{content:"";position:absolute;inset:-1px auto auto -1px;width:28px;height:28px;border-top:2px solid var(--gold);border-left:2px solid var(--gold)}
.lg-mine__head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.lg-mine__key{font-family:var(--f-type);font-size:12.5px;letter-spacing:.06em;color:var(--brass);margin-top:6px;overflow-wrap:anywhere}
.prose .lg-mine__key{color:var(--brass)}
.lg-mine .ledger{font-size:14px}
.lg-mine .ledger dd{overflow-wrap:anywhere}
.lg-mine .ledger dd.is-on{color:var(--gold-hi)}
.lg-mine .ledger dd.is-off{color:var(--ash)}
.lg-mine__foot{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;padding-top:6px}
.prose .lg-mine__foot p{color:var(--ash);max-width:40ch}
.no-js [data-mine-open]{display:none}
`;

const js = `
/* Live readout: shows exactly what this browser holds for the clearance game. Read-only. */
(() => {
  const box = document.querySelector('[data-mine]');
  if (!box) return;
  const list = box.querySelector('[data-mine-list]');
  const sess = box.querySelector('[data-mine-session]');
  const note = box.querySelector('[data-mine-note]');
  const NAMES = ${JSON.stringify(PKG_NAMES)};
  const LEVELS = window.BS_LEVELS || [{ lv: 0, name: 'Outsider', xp: 0 }];
  const FILES = window.BS_FILES || [];
  const count = (o) => (o && typeof o === 'object' ? Object.keys(o).length : 0);
  const get = (kind, key) => {
    try { const raw = window[kind].getItem(key); return { ok: true, v: raw ? JSON.parse(raw) : null }; }
    catch (e) { return { ok: false, v: null }; }
  };
  const fill = (dl, rows) => {
    dl.textContent = '';
    rows.forEach(([t, d, tone]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = t;
      const dd = document.createElement('dd'); dd.textContent = d; if (tone) dd.className = tone;
      row.append(dt, dd); dl.appendChild(row);
    });
  };
  const yes = (b, on, off) => [b ? on : off, b ? 'is-on' : 'is-off'];
  let last = '';
  function draw() {
    const L = get('localStorage', 'bs2.clearance.v1');
    const pkg = get('sessionStorage', 'bs2.pkg');
    const lead = get('sessionStorage', 'bs2.lead');
    const counted = get('sessionStorage', 'bs2.leadTracked');
    const sig = JSON.stringify([L, pkg, lead, counted]);
    if (sig === last) return; last = sig;
    if (!L.ok) {
      fill(list, [['Clearance file', 'This browser blocks site storage, so nothing is saved. Clearance resets when you leave.', 'is-off']]);
    } else if (!L.v) {
      fill(list, [['Clearance file', 'Empty. Nothing saved yet.', 'is-off']]);
    } else {
      const S = L.v, xp = +S.xp || 0;
      const lv = LEVELS.reduce((a, l) => (xp >= l.xp ? l : a), LEVELS[0]);
      fill(list, [
        ['Clearance', xp + ' points · Level ' + lv.lv + ', ' + lv.name, 'is-on'],
        ['Files opened', count(S.seen) + ' of ' + FILES.length],
        ['Read to the end', String(count(S.read))],
        ['Hidden marks', count(S.marks) + ' of 3'],
        ['Package match'].concat(yes(S.quiz, 'Found', 'Not yet')),
        ['Contact form sent'].concat(yes(S.lead, 'Yes', 'No')),
        ['Name on the door'].concat(yes(S.blackout, 'Said', 'Not yet')),
        ['Seals broken early', String(count(S.broken))],
      ]);
    }
    const rows = [];
    if (pkg.v) rows.push(['Last package viewed', NAMES[pkg.v] || String(pkg.v)]);
    if (lead.v) rows.push(['Thank-you greeting', [lead.v.name, lead.v.interest].filter(Boolean).join(' · ') || 'Saved']);
    if (counted.v) rows.push(['Thank-you visit counted', 'Yes']);
    fill(sess, rows.length ? rows : [['Tab notes', pkg.ok ? 'None' : 'Blocked by this browser', 'is-off']]);
    note.textContent = 'Read straight from this browser just now. None of it is sent to us.';
  }
  draw();
  const soon = () => setTimeout(draw, 80);
  document.addEventListener('click', soon);
  document.addEventListener('keyup', soon);
  addEventListener('storage', draw);
  addEventListener('pageshow', draw);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) draw(); });
  const open = box.querySelector('[data-mine-open]');
  if (open) open.addEventListener('click', () => { if (window.BS && window.BS.open) window.BS.open(); });
})();
`;

const SECTIONS = (c) => [
  {
    id: 'who-we-are', t: 'Who we are',
    body: `
<p>${BIZ.name} is a small marketing business in ${BIZ.city}, ${BIZ.regionLong}. We run paid social media ads, content and AI setup for creators, streamers, solo businesses and local shops. ${BIZ.name} is a ${BIZ.legal} company, run by founder ${BIZ.founder}.</p>
<p>This policy covers this website, ${SITE_HOST}, and what happens to anything you send us through it. When we say “we” or “us”, we mean ${BIZ.name}.</p>
<p>Questions about your information go to ${mail} or ${tel}, by call or text.</p>`,
  },
  {
    id: 'contact-form', t: 'What the contact form collects',
    body: `
<p>The form on the <a href="${c.link('contact.html')}">contact page</a> asks for:</p>
<ul>
  <li>Your name (required)</li>
  <li>Your email (required)</li>
  <li>Your business or channel name</li>
  <li>Your phone number, if you want a call or a text</li>
  <li>The package or service you’re asking about (required, and “Not sure yet” counts)</li>
  <li>The platform you want to run on</li>
  <li>How you’d like us to reach you: call, text or email</li>
  <li>Your message</li>
</ul>
<p>The form also notes which page it was sent from. Everything not marked required is up to you. Leave out anything you’d rather not share.</p>
<h3>How it reaches us</h3>
<p>When you press send, the form goes over an encrypted connection to a third-party form-delivery service, which emails it to our inbox at ${BIZ.email}. Right now that service is <a href="https://formsubmit.co" target="_blank" rel="noopener">FormSubmit</a>. It handles your message under its own terms and privacy policy. If we switch to a different delivery service, we’ll update this page.</p>
<h3>What we use it for</h3>
<ul>
  <li>To answer your question or send you a quote</li>
  <li>To confirm the details and how you’d like to pay, before anything starts</li>
  <li>To set up and run the work you approve</li>
  <li>To send your recaps</li>
</ul>
<p>Sending the form doesn’t put you on a mailing list.</p>`,
  },
  {
    id: 'calls-email', t: 'Calls, texts and email',
    body: `
<p>If you call, text or email us, we get your phone number or email address and whatever you tell us. We use it the same way: to answer you and do the work.</p>
<p>Those messages travel through phone carriers and email providers, ours and yours, under their own policies.</p>`,
  },
  {
    id: 'x-pixel', t: 'The X Pixel',
    body: `
<p>This site uses the X Pixel, a small piece of code from X (the platform that used to be Twitter). We run ads on X, and the pixel tells us whether those ads lead to real visits and real inquiries.</p>
<h3>What it measures</h3>
<ul>
  <li>Visits to pages on this site</li>
  <li>Views of package and service pages, with the name of the package</li>
  <li>Visits to the contact page</li>
  <li>A successful form send and the thank-you page after it, with the package you picked</li>
</ul>
<div class="lg-pair">
  <div><p class="label">What X can see</p><ul class="ticks">
    <li>Cookies or similar identifiers the pixel sets in your browser</li>
    <li>Your IP address, browser and device type</li>
    <li>The page you’re on and the page that sent you</li>
    <li>Your X account, if you’re logged in to X</li>
  </ul></div>
  <div><p class="label label--red">What we never pass to X</p><ul class="ticks ticks--no">
    <li>Your name</li>
    <li>Your email or phone number</li>
    <li>Your message</li>
    <li>Your clearance file</li>
  </ul></div>
</div>
<p>X handles pixel data under its own <a href="https://x.com/en/privacy" target="_blank" rel="noopener">privacy policy</a>. What we get back is reporting in our X ads account, like how many visits or form sends followed an ad. Those reports don’t tell us who you are.</p>
<h3>How to limit it</h3>
<ul>
  <li><strong>On X:</strong> open Settings and privacy, then Privacy and safety. Under Ads preferences, turn off personalized ads. The data sharing settings on the same screen limit it further. <a href="https://x.com/settings/privacy_and_safety" target="_blank" rel="noopener">Your X privacy settings</a>.</li>
  <li><strong>In your browser:</strong> block third-party cookies, clear cookies for this site, or use a content blocker that stops tracking pixels.</li>
</ul>
<p>Blocking the pixel doesn’t break anything here. Every page still works.</p>`,
  },
  {
    id: 'clearance', t: 'The clearance game',
    body: `
<p>As you read this site, you earn clearance and open classified files. Your progress is saved in your own browser, in a spot called local storage. It stays on your device and never reaches us. It holds:</p>
<ul>
  <li>Your clearance points and level</li>
  <li>Which files you opened and which you read to the end</li>
  <li>Which hidden marks you found</li>
  <li>Whether you found your package match, sent the form or said the name on the door</li>
  <li>Which classified seals you broke early</li>
</ul>
<p>A few notes are kept for the current browser tab only, in session storage. They clear when you close the tab:</p>
<ul>
  <li>The last package page you looked at, so the form can fill it in for you</li>
  <li>After you send the form, your first name and the package you picked, so the thank-you page can greet you</li>
  <li>A note so a thank-you visit is only counted once</li>
</ul>
<p><strong>To wipe it:</strong> open the clearance panel with the LV meter at the top of the page and press Burn my file at the bottom. Clearing this site’s data in your browser does the same thing.</p>
<div class="lg-mine" data-mine role="group" aria-label="What this browser holds">
  <div class="lg-mine__head"><p class="label">Live readout · this browser</p><span class="badge badge--gold">Never sent to us</span></div>
  <p class="lg-mine__key">Local storage · bs2.clearance.v1</p>
  <dl class="ledger" data-mine-list><div><dt>Clearance file</dt><dd class="is-off">None. With JavaScript off, the game doesn’t run and nothing is saved.</dd></div></dl>
  <p class="lg-mine__key">Session storage · this tab only</p>
  <dl class="ledger" data-mine-session><div><dt>Tab notes</dt><dd class="is-off">None</dd></div></dl>
  <div class="lg-mine__foot">
    <p class="small" data-mine-note>This list fills in from your own browser when JavaScript is on.</p>
    <button class="btn btn--sm btn--ghost" type="button" data-mine-open>Open the clearance panel</button>
  </div>
</div>`,
  },
  {
    id: 'fonts-hosting', t: 'Fonts and hosting',
    body: `
<p>The lettering on this site comes from Google Fonts. To show it, your browser asks Google’s servers for the font files, which tells Google your IP address and browser details. Google handles that under its <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">privacy policy</a>. If the fonts are blocked, the site falls back to fonts already on your device.</p>
<p>Like any website, the service that hosts this site may keep standard server logs: IP address, browser type, the page asked for and the time. Those logs are used to run and protect the site.</p>
<p>Besides the X Pixel, this site runs no other tracking or analytics.</p>`,
  },
  {
    id: 'links', t: 'Links to YouTube and social platforms',
    body: `
<p>This site links out to our pages on ${andList(SOCIALS.map((s) => s.label))}, and to videos on YouTube. A link takes you to that platform, and what happens there is governed by that platform’s own privacy policy and settings.</p>`,
  },
  {
    id: 'hire-us', t: 'If you hire us',
    body: `
<p>To run the work you approve, we share what that work needs with the platforms and tools it runs on. For an ad, that means the post, page or link being promoted, the ad itself and who it should reach. Each platform handles that under its own policies.</p>
<p>Before anything is set up, we go over exactly what access your package needs. Your accounts stay yours. Work like automatic posting or an AI assistant is set up the way we agree with you first.</p>
<p>This website doesn’t collect card numbers. When it’s time to pay, we confirm how you’d like to pay before anything starts.</p>`,
  },
  {
    id: 'no-selling', t: 'We don’t sell your information',
    body: `
<p class="lg-quote">We don’t sell your personal information. We don’t rent it or trade it either.</p>
<p>The only outside companies that handle it are the ones named on this page: the form-delivery service, our email and phone providers, X for the pixel, Google for the fonts, our web host, and the platforms that run the work you approve. We would also share information if the law required it.</p>`,
  },
  {
    id: 'how-long', t: 'How long we keep it',
    body: `
<ul>
  <li><strong>Inquiries and messages:</strong> as long as we need them to answer you and do the work. After that, ask and we’ll delete them.</li>
  <li><strong>Records the law makes a business keep,</strong> like payment records for taxes: as long as the law requires.</li>
  <li><strong>Your clearance file:</strong> in your browser until you burn it or clear this site’s data.</li>
  <li><strong>Tab notes:</strong> until you close the tab.</li>
</ul>`,
  },
  {
    id: 'your-choices', t: 'Your choices',
    body: `
<ul>
  <li><strong>Ask what we have.</strong> We’ll tell you what we hold about you.</li>
  <li><strong>Fix it.</strong> Tell us what’s wrong and we’ll correct it.</li>
  <li><strong>Delete it.</strong> Ask and we’ll delete your inquiry and contact details, except records the law makes us keep.</li>
  <li><strong>Limit the X Pixel.</strong> Use your X settings or your browser settings, as explained in <a href="#x-pixel">The X Pixel</a>.</li>
  <li><strong>Burn your clearance.</strong> Burn my file, at the bottom of the clearance panel.</li>
</ul>
<p>To ask, email ${mail} or call or text ${tel}. We may ask you to confirm it’s you before we hand over or delete anything.</p>`,
  },
  {
    id: 'children', t: 'Children under 13',
    body: `
<p>This site is for business owners and creators. It isn’t meant for children under 13, and we don’t knowingly collect information from them. If you think a child under 13 sent us something, tell us and we’ll delete it.</p>`,
  },
  {
    id: 'changes', t: 'Changes to this policy',
    body: `
<p>When the site changes what it collects, like adding a new tool, we update this page and the date at the top. That date tells you when it last changed.</p>
<p>Last updated: <strong>${c.POLICY.updated}</strong>.</p>`,
  },
  {
    id: 'contact-us', t: 'Contact us',
    body: `
<p>Anything about your information, ask us straight.</p>
${c.contactLines()}
<p class="small muted">${BIZ.name} · a ${BIZ.legal} company · ${BIZ.city}, ${BIZ.regionLong}</p>`,
  },
];

export default {
  path: 'privacy.html',
  title: 'Privacy',
  description: 'What this site collects and why: the contact form, the X Pixel, your clearance file and Google Fonts. Blackout Syndicate never sells your information.',
  teaser: 'What we collect, where it goes, and how to make us delete it.',
  css, js,
  body: (c) => {
    const sections = SECTIONS(c);
    return `
${legalHead(c, {
  crumb: 'Privacy',
  kicker: 'Policy file · Privacy',
  title: 'Privacy',
  whisper: 'What we collect, and why.',
  lede: `Everything this site collects, where it goes and how to make us delete it. You decide what you send us, the X Pixel measures our ads, your clearance stays in your browser, and <strong>we never sell your information.</strong>`,
  stamp: ['Never', 'redacted', 'Open at every level'],
  meta: [
    ['Last updated', c.POLICY.updated],
    ['Clearance needed', 'None'],
    ['Covers', SITE_HOST],
    ['Run by', BIZ.legal],
    ['Questions', `<a href="mailto:${BIZ.email}">${BIZ.email}</a>`],
  ],
})}

${legalShort({
  id: 'short-h',
  label: 'The short version',
  h2: 'Four things <span class="whisper">to know.</span>',
  cells: [
    { t: 'What you send us', p: 'The contact form, calls, texts and email. We use it to answer you and do the work.', go: 'contact-form', link: 'The contact form' },
    { t: 'What X sees', p: 'The X Pixel counts visits and form sends from our X ads. X handles that under its own policy.', go: 'x-pixel', link: 'The X Pixel' },
    { t: 'What stays with you', p: 'Your clearance lives in your own browser. Burn it any time.', go: 'clearance', link: 'The clearance game' },
    { t: 'What we never do', p: 'Sell your information. Or rent it, or trade it.', go: 'no-selling', link: 'No selling' },
  ],
  fine: `Every other file on this site has blacked-out lines until you earn the clearance. This one is open to everyone, at every level.`,
})}

${legalBody('Privacy policy', sections)}

${legalClose(c, {
  label: 'Next policy file',
  title: 'Terms and refunds',
  teaser: 'What you’re buying, where the ad money goes, and what happens if you cancel.',
  href: 'terms.html',
  line: `That’s the whole privacy file. The rest of the archive is still waiting, and every file you open is worth +${XP.visit} clearance.`,
  ctas: `${c.btn('Open the packages ' + c.arrow, 'packages.html')}${c.btn('Make contact', 'contact.html', 'ghost')}`,
})}`;
  },
};
