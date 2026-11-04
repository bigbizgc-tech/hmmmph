// pay.html: one page to pay Blackout Syndicate through Biz's PayPal Business page. Built only when config.payUrl is set.
// The payer types the amount on PayPal. Not a clearance file (no `file`), so the game counts don't change. No dollar figures.
import { BIZ } from '../data/business.mjs';
import { donateHref, esc, arrow } from '../layout.mjs';

const css = `
.pay-head .lede{max-width:54ch}
.pay-head .ctas .btn--lg{min-width:min(100%,280px)}
.pay-steps{counter-reset:s;display:grid;gap:14px;margin:0;padding:0;list-style:none}
.pay-steps li{counter-increment:s;display:grid;grid-template-columns:44px 1fr;gap:14px;align-items:start;font-size:clamp(18px,1.7vw,21px)}
.pay-steps li::before{content:counter(s);font-family:var(--f-display);font-weight:900;font-size:40px;line-height:.9;color:var(--gold)}
@media (max-width:560px){.pay-head .ctas .btn{width:100%}}
`;

const page = (config) => {
  const href = donateHref(config.payUrl);
  const pay = (cls = '') => `<a class="btn${cls ? ' ' + cls : ''}" href="${esc(href)}" target="_blank" rel="noopener">Pay with PayPal ${arrow}<span class="sr"> (opens PayPal in a new tab)</span></a>`;
  return {
    path: 'pay.html',
    section: 'contact',
    title: 'Pay',
    h1: 'Pay',
    description: `Pay ${BIZ.name} securely through PayPal. You type the amount on PayPal.`,
    teaser: 'Pay through PayPal. You choose the amount.',
    next: 'contact.html',
    css,
    body: (c) => `
<header class="pagehead pay-head" data-spot>
  <div class="wrap pagehead__in">
    ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'Pay' }])}
    <p class="label">Pay · ${BIZ.name}</p>
    <h1 class="h1">Pay <span class="whisper">here.</span></h1>
    <p class="lede">Pay ${BIZ.name} through PayPal. You type the amount on PayPal, so it works for any package, any service or any amount we agreed on.</p>
    <div class="ctas">${pay('btn--lg')}${c.btn('Call ' + BIZ.phone, BIZ.phoneHref, 'ghost lg')}</div>
  </div>
</header>

<section class="band" aria-labelledby="pay-how-h">
  <div class="wrap wrap--narrow rv" style="display:grid;gap:20px">
    <p class="label">How it works</p>
    <h2 class="h2" id="pay-how-h">Three steps</h2>
    <ol class="pay-steps">
      <li><span>Tap <strong>Pay with PayPal</strong>. PayPal opens in a new tab.</span></li>
      <li><span>Type the amount we agreed on. Add a note with your name and package if PayPal asks.</span></li>
      <li><span>Pay with PayPal or a card. You get a receipt from PayPal.</span></li>
    </ol>
    <div class="ctas">${pay('btn--lg')}</div>
    <p class="small muted">Not sure what to pay? <a href="${c.link('contact.html')}">Ask for a free quote</a> first, or call or text <a href="${BIZ.phoneHref}">${BIZ.phone}</a>. The refund and cancel rules for each package are on its page and in the <a href="${c.link('terms.html')}">Terms</a>.</p>
  </div>
</section>`,
  };
};

export default (config = {}) => (config.payUrl ? page(config) : []);
