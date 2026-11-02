// washington.html: Biz's trip to NVIDIA GTC in Washington, D.C. Built only when config.donateUrl is set
// (src/config.mjs). With the link empty this module builds nothing, and the footer, Get started and the
// class page show no link to it (c.washington is false). Not a clearance file (no `file`), so the game counts don't change.
// Facts only from the owner's budget note: the event, the dates, and that the money covers the pass, travel and hotel.
// No goal amount and no totals: none are confirmed. No dollar figures on this page.
import { BIZ } from '../data/business.mjs';
import { bySlug, offerPath, CLASSES } from '../data/offers.mjs';
import { TRIP, donateHref, esc, arrow } from '../layout.mjs';

const css = `
.wt-head .whisper{display:block;margin-top:.12em}
.wt-head .lede{max-width:54ch}
.wt-head .ctas .btn--lg{min-width:min(100%,260px)}
.wt-facts .ledger dd{text-align:right}
.wt-cover{display:grid;gap:18px;align-content:start}
.wt-cover .ticks{font-size:clamp(19px,1.8vw,22px);font-weight:600}
.wt-cover .ticks li::before{margin-top:13px}
.wt-final{display:grid;gap:clamp(20px,2.6vw,28px);justify-items:start}
.wt-final h2{font-family:var(--f-display);font-weight:900;font-size:clamp(68px,11vw,168px);line-height:.86;text-transform:uppercase}
.wt-final>p:not(.label){font-size:var(--t-lede);max-width:52ch}
.wt-final .btn{--bg:var(--void);--fg:var(--gold);--bd:var(--void)}
.wt-final .btn:hover{--bg:#000;--fg:var(--gold-hi)}
.wt-final .wt-donate{font-size:clamp(28px,3.4vw,40px);padding:clamp(20px,2.4vw,26px) clamp(34px,4vw,52px)}
.wt-final .wt-donate .arw{width:26px;height:26px}
.wt-final .wt-fine{font-size:15px;line-height:1.5;max-width:60ch;border-top:1.5px dashed rgba(7,7,8,.35);padding-top:14px}
.wt-final .wt-fine a{color:var(--void);font-weight:600;text-underline-offset:3px}
@media (max-width:560px){.wt-final .wt-donate{width:100%}}
`;

const page = (config) => {
  const href = donateHref(config.donateUrl);
  let host = '';
  try { host = new URL(href).hostname.replace(/^www\./, ''); } catch (e) { /* shown as "the donation page" */ }
  const where = host ? esc(host) : 'the donation page';
  // The one action on this page: an outside donation link, always in a new tab.
  const donate = (cls = '') => `<a class="btn${cls ? ' ' + cls : ''}" href="${esc(href)}" target="_blank" rel="noopener">Donate ${arrow}<span class="sr"> (opens ${where} in a new tab)</span></a>`;
  const K = CLASSES[0];

  return {
    path: TRIP.path,
    section: 'about',
    title: TRIP.title,
    h1: TRIP.title,
    description: `Help send Biz, founder of ${BIZ.name}, to ${TRIP.event} in ${TRIP.where}, ${TRIP.when}. Donations cover his conference pass, travel and hotel.`,
    teaser: `Chip in and help get Biz to ${TRIP.event} in ${TRIP.where}.`,
    next: 'about.html',
    css,
    body: (c) => `
<header class="pagehead wt-head" data-spot>
  <div class="wrap pagehead__in">
    ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'About', p: 'about.html' }, { t: TRIP.title }])}
    <p class="label">The Washington trip · ${TRIP.event} · ${TRIP.when}</p>
    <h1 class="h1">Send Biz <span class="whisper">to Washington.</span></h1>
    <p class="lede">Biz, the guy behind ${BIZ.name}, is headed to <strong>${TRIP.event}</strong> in ${TRIP.where}, ${TRIP.when}. If you want to help get him there, chip in. The money covers his conference pass, travel and hotel.</p>
    <div class="ctas">${donate('btn--lg')}${c.btn('What it covers', '#covers', 'ghost lg')}</div>
  </div>
</header>

<section class="band" id="covers" aria-labelledby="wt-trip-h">
  <div class="wrap split">
    <div class="wt-facts rv" style="display:grid;gap:18px;align-content:start">
      <p class="label">The trip</p>
      <h2 class="h2" id="wt-trip-h">Where he’s going</h2>
      <dl class="ledger">
        <div><dt>Who</dt><dd>Biz (${BIZ.founder}), founder</dd></div>
        <div><dt>What</dt><dd>${TRIP.event}, NVIDIA’s AI conference</dd></div>
        <div><dt>Where</dt><dd>${TRIP.where}</dd></div>
        <div><dt>When</dt><dd>${TRIP.when}</dd></div>
      </dl>
    </div>
    <aside class="panel wt-cover rv" style="--d:.08s" aria-labelledby="wt-cover-h">
      <p class="label" id="wt-cover-h">What the money covers</p>
      <ul class="ticks">${TRIP.covers.map((t) => `<li>${t}</li>`).join('')}</ul>
      <div class="ctas">${donate()}</div>
    </aside>
  </div>
</section>

<section class="band band--coal" aria-labelledby="wt-why-h">
  <div class="wrap wrap--narrow rv" style="display:grid;gap:20px">
    <p class="label">Why it matters</p>
    <h2 class="h2" id="wt-why-h">Why go <span class="whisper">at all.</span></h2>
    <div class="prose">
      <p>A lot of what we do runs on AI: the AI tools in our monthly plans, <a href="${c.link(offerPath(bySlug['ai-consulting']))}">AI Consulting</a>, <a href="${c.link(offerPath(bySlug['ai-automation']))}">AI Automation</a> and the <a href="${c.link(K.path)}">${K.name}</a> class.</p>
      <p>${TRIP.event} is where NVIDIA shows what’s coming in AI. Biz wants to see it first-hand, ask his questions in person, and bring what he learns back to ${BIZ.city} in plain English.</p>
      <p>That’s the whole pitch. You’re helping one local guy get in the room.</p>
    </div>
  </div>
</section>

<section class="band band--gold" id="donate" aria-labelledby="wt-final-h">
  <div class="wrap wt-final">
    <p class="label">Chip in</p>
    <h2 id="wt-final-h">Send him<br>to D.C.</h2>
    <p>Give what you want. It goes toward the pass, the travel and the hotel.</p>
    ${donate('wt-donate')}
    <p class="wt-fine">The button opens ${where} in a new tab. Questions? Call or text <a href="${BIZ.phoneHref}">${BIZ.phone}</a>.</p>
  </div>
</section>`,
  };
};

// No donation link, no page.
export default (config = {}) => (config.donateUrl ? page(config) : []);
