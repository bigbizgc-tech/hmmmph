// Terms and refunds. Plain-English draft for the owner to have reviewed.
// Every refund and billing line comes from POLICY (src/data/business.mjs) word for word,
// every price from src/data/offers.mjs. Shared legal-page pieces live in 70-privacy.mjs.
import { BIZ, XP } from '../data/business.mjs';
import { OFFERS, BOOSTS, PLANS, ADDONS, SERVICES, offerPath, bySlug } from '../data/offers.mjs';
import { LEGAL_CSS, legalHead, legalShort, legalBody, legalClose } from './70-privacy.mjs';

const mail = `<a href="mailto:${BIZ.email}">${BIZ.email}</a>`;
const tel = `<a href="${BIZ.phoneHref}">${BIZ.phone}</a>`;
const andList = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const GROUPS = [
  { kind: 'boost', t: 'One-time boosts', list: BOOSTS },
  { kind: 'plan', t: 'Monthly plans', list: PLANS },
  { kind: 'addon', t: 'Add-ons', list: ADDONS },
  { kind: 'service', t: 'Quoted work', list: SERVICES },
];

// The packages whose ad money is stated in offers.mjs: every boost, plus Surge.
const SPLIT = OFFERS.filter((o) => /About \$[\d,]+/.test(o.spend));
const adMoney = (o) => 'About ' + o.spend.match(/About (\$[\d,]+)/)[1] + (o.kind === 'plan' ? ' a month' : '');
const recapOf = (o) => {
  const line = o.includes.find((x) => /recap/i.test(x)) || '';
  return line.includes(':') ? cap(line.split(':').slice(1).join(':').trim()) : 'Spend and reach';
};

const css = LEGAL_CSS + `
/* ── Price tables ── */
.lg-tablewrap{overflow-x:auto;border:1px solid var(--smoke);background:var(--void)}
.lg-table{width:100%;border-collapse:collapse;font-size:15.5px;line-height:1.35}
.lg-table caption{caption-side:top;text-align:left;font-family:var(--f-type);font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);padding:12px 16px;border-bottom:1px solid var(--smoke);background:var(--coal)}
.lg-table th,.lg-table td{padding:11px 16px;text-align:left;vertical-align:baseline;border-bottom:1px solid var(--smoke)}
.lg-table tbody:last-child tr:last-child>*{border-bottom:0}
.lg-table thead th{font-family:var(--f-type);font-weight:400;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash)}
.lg-table .lg-grp th{font-family:var(--f-display);font-weight:800;font-size:19px;letter-spacing:.04em;text-transform:uppercase;color:var(--gold);background:var(--coal);padding-block:9px 7px;text-align:left}
.lg-table tbody th{font-weight:600}
.lg-table tbody th a{color:var(--paper);text-decoration:none;border-bottom:1px solid var(--brass)}
.lg-table tbody th a:hover{color:var(--gold-hi);border-color:var(--gold)}
.lg-table .num{font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--gold-hi);font-weight:600}
.lg-table .num small{display:block;font-weight:400;font-size:12.5px;color:var(--ash);white-space:normal}
.lg-table td:last-child,.lg-table thead th:last-child{text-align:right}

/* ── Where the money goes: pick a package, read the breakdown ── */
.lg-split{display:grid;gap:16px;border:0;padding:0;margin:.4em 0;min-width:0}
.lg-split legend{font-family:var(--f-type);font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);padding:0;margin-bottom:12px}
.lg-slips{display:grid;gap:18px}
.lg-slip{position:relative;display:grid;gap:12px;background:var(--paper);color:var(--ink);padding:22px 22px 20px;box-shadow:0 30px 60px -30px rgba(0,0,0,.85);background-image:repeating-linear-gradient(transparent 0 31px,rgba(23,20,15,.05) 31px 32px);transform:rotate(-.5deg)}
.lg-slip::before{content:"";position:absolute;top:0;right:0;width:34px;height:34px;background:linear-gradient(225deg,var(--void) 50%,var(--paper-2) 50%)}
.lg-slip__head{display:flex;justify-content:space-between;align-items:baseline;gap:6px 14px;flex-wrap:wrap;padding:0 34px 10px 0;border-bottom:1px dashed rgba(23,20,15,.35)}
.lg-slip__head b{font-family:var(--f-display);font-weight:900;font-size:clamp(32px,3.6vw,42px);line-height:.9;text-transform:uppercase}
.lg-slip__head span{font-family:var(--f-display);font-weight:800;font-size:28px;line-height:1;color:var(--brass)}
.lg-slip__head small{font-family:var(--f-body);font-weight:400;font-size:14px;color:var(--ink-mute);margin-left:3px}
.lg-slip dl{display:grid;margin:0;font-family:var(--f-type);font-size:14.5px;line-height:1.45}
.lg-slip dl>div{display:flex;align-items:baseline;gap:10px;padding-block:5px}
.lg-slip dt{display:flex;align-items:baseline;gap:8px;flex:1 1 auto;min-width:0;color:var(--ink-mute)}
.lg-slip dt::after{content:"";flex:1 1 16px;min-width:16px;border-bottom:1.5px dotted rgba(23,20,15,.35)}
.lg-slip dd{margin:0;text-align:right;color:var(--ink);font-weight:700;max-width:58%}
.lg-slip .is-ad dd{background:var(--gold);padding:0 6px}
.prose .lg-slip p{color:var(--ink-mute);font-size:14.5px}
.prose .lg-slip .lg-slip__head{color:var(--ink)}
@media (max-width:520px){
  .lg-table th,.lg-table td{padding:10px 12px}
  .lg-slip{padding:20px 18px 18px}
  .lg-slip dl>div{display:grid;gap:1px;padding-block:7px;border-bottom:1px dotted rgba(23,20,15,.25)}
  .lg-slip dl>div:last-child{border-bottom:0}
  .lg-slip dt{font-size:12px;letter-spacing:.06em;text-transform:uppercase}
  .lg-slip dt::after{content:none}
  .lg-slip dd{text-align:left;max-width:none}
  .lg-slip .is-ad dd{justify-self:start}
}
.lg-slip__foot{border-top:1px dashed rgba(23,20,15,.35);padding-top:12px}
.lg-slip__foot b{display:block;font-family:var(--f-type);font-weight:400;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--brass);margin-bottom:4px}
.prose .lg-slip__foot b{color:var(--brass)}
@supports selector(:has(*)){
  .lg-slip{display:none}
  ${SPLIT.map((o) => `.lg-split:has(input[value="${o.slug}"]:checked) .lg-slip[data-split="${o.slug}"]`).join(',')}{display:grid;animation:lgSlip .45s var(--ease)}
}
@keyframes lgSlip{from{opacity:0;transform:translateY(10px) rotate(1.5deg)}to{opacity:1;transform:rotate(-.5deg)}}

/* ── Refund rules, word for word ── */
.lg-rules{display:grid;gap:12px}
.lg-rule{display:grid;grid-template-columns:minmax(0,180px) minmax(0,1fr);gap:8px 22px;padding:18px 20px;border:1px solid var(--smoke);background:var(--coal)}
.lg-rule h3{margin:0!important;font-size:22px!important;color:var(--gold)}
.lg-rule h3 small{display:block;font-family:var(--f-type);font-weight:400;font-size:11.5px;letter-spacing:.12em;color:var(--ash);margin-top:6px}
.lg-rule p{font-size:16.5px}
@media (max-width:640px){.lg-rule{grid-template-columns:1fr}}
`;

const priceCell = (o) => {
  if (o.kind === 'service') return `Quoted<small>per job, in writing</small>`;
  if (o.kind === 'plan') return `${o.price}${o.suffix}${o.regular ? `<small>launch price</small>` : ''}`;
  return `${o.price}<small>one time</small>`;
};

const SECTIONS = (c) => [
  {
    id: 'who', t: 'Who you’re dealing with',
    body: `
<p>These terms cover anything you buy from ${BIZ.name}, a ${BIZ.legal} company in ${BIZ.city}, ${BIZ.regionLong}, run by founder ${BIZ.founder}. “We” and “us” means ${BIZ.name}. “You” means the person or business buying.</p>
<p>Paying for a package or service means you agree to these terms. For quoted work, the written quote you approve is part of the deal too.</p>
<p>You need to be at least 18 to buy, or have a parent or guardian handle it for you.</p>`,
  },
  {
    id: 'what-we-sell', t: 'What we sell',
    body: `
<p>Four kinds of work. Each one has its own page with the full details.</p>
<ul>
  <li><strong>One-time boosts:</strong> ${andList(BOOSTS.map((o) => o.name))}. One real paid push on one platform, with no contract.</li>
  <li><strong>Monthly plans:</strong> ${andList(PLANS.map((o) => o.name))}. Promotion that keeps running month to month.</li>
  <li><strong>Add-ons:</strong> the ${andList(ADDONS.map((o) => o.name))}. One-time pieces that pair with any boost.</li>
  <li><strong>Quoted work:</strong> ${andList(SERVICES.map((o) => o.name))}. Priced per job in a written quote.</li>
</ul>
${c.priced ? `<div class="lg-tablewrap">
  <table class="lg-table">
    <caption>Prices as listed on this site</caption>
    <thead><tr><th scope="col">Package</th><th scope="col">Price</th></tr></thead>
    ${GROUPS.map((g) => `<tbody><tr class="lg-grp"><th colspan="2" scope="colgroup">${g.t}</th></tr>${g.list.map((o) => `<tr><th scope="row"><a href="${c.link(offerPath(o))}">${o.name}</a></th><td class="num">${priceCell(o)}</td></tr>`).join('')}</tbody>`).join('')}
  </table>
</div>
` : ''}<p><a href="${c.link('packages.html')}">Compare every package side by side</a>.</p>`,
  },
  {
    id: 'prices', t: 'Prices',
    body: c.priced ? `
<p>Prices are in US dollars. You pay the price listed on this site when you buy. For quoted work, you pay the price in your written quote.</p>
<p>We can change the prices on the site. A change never touches something you’ve already paid for, and a launch price on a monthly plan stays locked for as long as you stay on that plan.</p>` : `
<p>Prices are in US dollars. ${c.ASK.line} on any package and you have the price before you buy. You pay the price we confirmed with you. For quoted work, you pay the price in your written quote.</p>
<p>We can change our prices. A change never touches something you’ve already paid for.</p>`,
  },
  {
    id: 'paying', t: 'Paying',
    body: `
<p class="lg-quote">${c.POLICY.payment}</p>
<ul>
  <li><strong>One-time boosts:</strong> our target is live within 24 hours of payment. That is a target. Platform review can take longer.</li>
  <li><strong>Monthly plans:</strong> paid month to month. Your first month starts with the intake call.</li>
  <li><strong>Add-ons:</strong> the ${bySlug['post-kit'].name} is emailed as a PDF within 2 business days. Profile Fix is delivered for you to publish yourself.</li>
  <li><strong>Quoted work:</strong> paid the way your written quote says.</li>
</ul>`,
  },
  {
    id: 'ad-money', t: 'Where the ad money goes',
    body: `
<p>Part of what you pay for a boost or a monthly plan is ad money. It’s paid to the platform, through the platform’s own ad tools, for the ad itself. The rest covers setup, aiming it and your recap.</p>
${c.priced ? `<fieldset class="lg-split">
  <legend>Pick one. See where the money goes.</legend>
  <div class="chips">${SPLIT.map((o, i) => `<label class="chip"><input type="radio" name="split" value="${o.slug}"${i === 0 ? ' checked' : ''}><span>${o.name}</span></label>`).join('')}</div>
  <div class="lg-slips" aria-live="polite">
    ${SPLIT.map((o) => `
    <div class="lg-slip" data-split="${o.slug}">
      <p class="lg-slip__head"><b>${o.name}</b><span>${o.price}<small>${o.suffix || 'one time'}</small></span></p>
      <dl>
        <div class="is-ad"><dt>Ad money, paid to the platform</dt><dd>${adMoney(o)}</dd></div>
        <div><dt>Setup, aiming it and your recap</dt><dd>The rest</dd></div>
        <div><dt>Run</dt><dd>${o.run}</dd></div>
        ${o.oneMonth ? `<div><dt>One month only</dt><dd>${o.oneMonth}, no commitment</dd></div>` : ''}
        <div><dt>${o.kind === 'plan' ? 'Monthly recap' : 'Your recap'}</dt><dd>${recapOf(o)}</dd></div>
      </dl>
      <p class="lg-slip__foot"><b>If you cancel</b>${o.kind === 'plan' ? c.POLICY.plans : c.POLICY.boosts}</p>
    </div>`).join('')}
  </div>
</fieldset>
<p>${bySlug.overdrive.name} includes everything in ${bySlug.surge.name}. Every recap shows what was spent and what it reached.</p>` : `<p>Every recap shows what was spent and what it reached.</p>`}`,
  },
  {
    id: 'platform-rules', t: 'Platform rules and rejected ads',
    body: `
<p>Every ad runs through the platform’s own ad tools, so it has to follow that platform’s ad rules. Each platform reviews ads before they run, and it can reject an ad or stop one. The platforms also change their rules, review times and prices on their own. We don’t control that.</p>
<p class="lg-quote">${c.POLICY.rejected}</p>
<p>We won’t run an ad that breaks a platform’s rules or the law, even if you ask.</p>`,
  },
  {
    id: 'results', t: 'No guaranteed results',
    body: `
<p class="lg-quote">${BIZ.resultsNote}</p>
<p>Nobody honest can promise you a number. What you get is a real paid placement, bought through the platform’s own ad tools, aimed where we agreed, and a recap of what was spent and what it reached.</p>`,
  },
  {
    id: 'your-ok', t: 'Your OK before anything runs',
    body: `
<p>Nothing runs under your name until you say go. That covers ads, posts, AI replies and automations. You see it first and you approve it first.</p>
<p>Want something changed? Tell us before you approve it, and we’ll change it.</p>`,
  },
  {
    id: 'your-part', t: 'Your part',
    body: `
<ul>
  <li><strong>Give us accurate information.</strong> What you sell, your prices, your hours or area, and the links you want promoted.</li>
  <li><strong>Only send what you have the rights to.</strong> Photos, video, music, logos and words you send us must be yours, or cleared for you to use in ads.</li>
  <li><strong>Keep it allowed.</strong> What you sell and what the ad says has to be legal and allowed on the platform.</li>
  <li><strong>Answer when we ask for your OK.</strong> Nothing runs until you approve it, so a slow answer means a slower start.</li>
</ul>
<p>Before anything is set up, we go over exactly what access your package needs. Profile Fix needs no login at all. Your accounts stay yours.</p>
<p>If a claim comes up because of something you sent us without the rights to use it, that is your responsibility.</p>`,
  },
  {
    id: 'refunds', t: 'Refunds and cancellations',
    body: `
<p>Here is the refund policy, word for word. It’s the same wording used everywhere on this site.</p>
<div class="lg-rules">
  <div class="lg-rule"><h3 id="refund-boosts">One-time boosts<small>${andList(BOOSTS.map((o) => o.name))}</small></h3><p>${c.POLICY.boosts}</p></div>
  <div class="lg-rule"><h3 id="refund-plans">Monthly plans<small>${andList(PLANS.map((o) => o.name))}</small></h3><p>${c.POLICY.plans}</p></div>
  <div class="lg-rule"><h3 id="refund-addons">Add-ons<small>${andList(ADDONS.map((o) => o.name))}</small></h3><p>${c.POLICY.addons}</p></div>
  <div class="lg-rule"><h3 id="refund-quoted">Quoted work<small>${SERVICES.length} services, quoted per job</small></h3><p>${c.POLICY.quoted}</p></div>
</div>
<p>Rejected ads are covered in <a href="#platform-rules">Platform rules and rejected ads</a>.</p>
<h3>How to cancel</h3>
<p>Call, text or email us and tell us what you’re cancelling: ${tel} or ${mail}.</p>`,
  },
  {
    id: 'monthly-plans', t: c.priced ? 'Monthly plans and one-month prices' : 'Monthly plans and one month only',
    body: c.priced ? `
<p>Each plan has two ways in: stay month to month at the monthly price, or take one month only at the one-month price, with no commitment.</p>
<div class="lg-tablewrap">
  <table class="lg-table">
    <caption>Monthly plan prices</caption>
    <thead><tr><th scope="col">Plan</th><th scope="col">Month to month</th><th scope="col">One month only</th></tr></thead>
    <tbody>${PLANS.map((o) => `<tr><th scope="row"><a href="${c.link(offerPath(o))}">${o.name}</a></th><td class="num">${o.price}${o.suffix}${o.regular ? `<small>launch price, regular ${o.regular}</small>` : ''}</td><td class="num">${o.oneMonth || 'Ask us'}</td></tr>`).join('')}</tbody>
  </table>
</div>
<ul>
  <li><strong>Launch prices:</strong> ${andList(PLANS.filter((o) => o.regular).map((o) => o.name))} are at launch prices. Start at the launch price and you keep it for as long as you stay. New clients after the launch pay the regular price.</li>
  <li><strong>Moving up:</strong> you can move up to a bigger plan any month.</li>
  <li><strong>Cancelling:</strong> ${c.POLICY.plans}</li>
</ul>` : `
<p>Each plan has two ways in: stay month to month, or take one month only, billed once with no commitment.</p>
<ul>
  <li><strong>Moving up:</strong> you can move up to a bigger plan any month.</li>
  <li><strong>Cancelling:</strong> ${c.POLICY.plans}</li>
</ul>`,
  },
  {
    id: 'ownership', t: 'Who owns what',
    body: `
<ul>
  <li><strong>Your content stays yours.</strong> Your photos, videos, posts, logo, name and accounts belong to you. We use them only for the work you approve.</li>
  <li><strong>${bySlug['post-kit'].name} and ${bySlug['profile-fix'].name} are yours once paid.</strong> The posting calendar and captions, and the rewritten bio, pinned post plan, highlight list and shot list, are yours to use however you like.</li>
  <li><strong>Quoted work</strong> follows the written quote, including who owns what at the end.</li>
  <li><strong>Your recaps</strong> are yours to keep.</li>
</ul>`,
  },
  {
    id: 'liability', t: 'Limits on what we’re responsible for',
    body: `
<p>We do the work we agree to, with care, and we’ll tell you straight if something goes wrong. Some things are out of our hands, and we aren’t responsible for them:</p>
<ul>
  <li>What the platforms do: rejecting or stopping ads, changing rules or prices, outages, or limiting an account</li>
  <li>Results: views, likes, followers, sales or bookings</li>
  <li>Problems caused by information or content you gave us</li>
</ul>
<p>If we get something wrong, the most we owe you is what you paid us for that piece of work. For a monthly plan, that means the month it happened in. We aren’t responsible for indirect losses, like lost sales or lost profit.</p>
<p>Nothing here takes away a right the law says can’t be taken away.</p>`,
  },
  {
    id: 'indiana-law', t: 'Indiana law',
    body: `
<p>These terms are governed by the laws of the State of ${BIZ.regionLong}.</p>
<p>If we ever disagree, call us first. Most things get settled with a straight conversation. If it does go further, it’s handled in the courts of St. Joseph County, ${BIZ.regionLong}.</p>`,
  },
  {
    id: 'changes', t: 'Changes to these terms',
    body: `
<p>We may update these terms. When we do, we change the date at the top. The terms in place when you paid are the ones that apply to that purchase. For monthly plans, a change applies from your next billing date.</p>
<p>Last updated: <strong>${c.POLICY.updated}</strong>.</p>`,
  },
  {
    id: 'contact', t: 'Contact',
    body: `
<p>Question about these terms? Ask before you buy. A real person in ${BIZ.city} answers.</p>
${c.contactLines()}
<p class="small muted">${BIZ.name} · a ${BIZ.legal} company · ${BIZ.city}, ${BIZ.regionLong} · How we handle your information is on the <a href="${c.link('privacy.html')}">privacy page</a>.</p>`,
  },
];

export default {
  path: 'terms.html',
  title: 'Terms and refunds',
  description: 'Terms and refunds for Blackout Syndicate: what you buy, where the ad money goes, refunds for boosts, plans and add-ons, and why no results are guaranteed.',
  teaser: 'What you buy, where the money goes, and what happens if you cancel.',
  css,
  body: (c) => {
    const sections = SECTIONS(c);
    return `
${legalHead(c, {
  crumb: 'Terms and refunds',
  kicker: 'Policy file · Terms and refunds',
  title: 'Terms and refunds',
  whisper: 'The deal, in plain words.',
  lede: `What you’re buying, where the money goes, what happens if you cancel, and the one thing nobody honest can promise you. <strong>If anything here isn’t clear, ask before you buy.</strong>`,
  stamp: ['No fine', 'print', 'Same size as the rest'],
  meta: [
    ['Last updated', c.POLICY.updated],
    ['Covers', 'Every package and service'],
    ['Sold by', BIZ.legal],
    ['Governed by', `${BIZ.regionLong} law`],
    ['Questions', `<a href="mailto:${BIZ.email}">${BIZ.email}</a>`],
  ],
})}

${legalShort({
  id: 'short-h',
  label: 'The deal on one page',
  h2: 'Four things <span class="whisper">to know.</span>',
  cells: [
    { t: 'Your OK first', p: 'Nothing runs under your name until you say go.', go: 'your-ok', link: 'Your OK' },
    { t: 'Ad money goes to the platform', p: 'Part of every boost and plan is paid straight to the platform for the ad itself.', go: 'ad-money', link: 'Where the money goes' },
    { t: 'No set numbers', p: BIZ.resultsNote, go: 'results', link: 'No guaranteed results' },
    { t: 'Plans run month to month', p: c.POLICY.plans, go: 'refunds', link: 'Refunds and cancellations' },
  ],
  fine: `The fine print: there isn’t any. Everything that matters is on this page, at the same size as everything else.`,
})}

${legalBody('Terms and refunds', sections)}

${legalClose(c, {
  label: 'Back to the files',
  title: 'The packages',
  teaser: c.priced ? 'Every package and every price, side by side. Start small or go all in.' : 'Every package, side by side. Start small or go all in.',
  href: 'packages.html',
  line: `Read the deal? Now find the file that fits. Three questions, and the match is worth +${XP.quiz} clearance.`,
  ctas: `${c.btn('Find my match ' + c.arrow, 'packages.html#match')}${c.btn('Make contact', 'contact.html', 'ghost')}`,
})}`;
  },
};
