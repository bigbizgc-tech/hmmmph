// pay.html: pay Blackout Syndicate any amount. With paypalLiveClientId + paypalPayButtonId
// (src/config.mjs) this renders PayPal's live customer-set-price button, so the payer
// types the amount and can pay by card without a PayPal login. Until those are set,
// the button stays the paypal.biz link (payUrl). Not a clearance file. No dollar figures.
import { BIZ } from '../data/business.mjs';
import { donateHref, esc, arrow } from '../layout.mjs';
import { paypalCheckout, paypalWidget } from '../paypal.mjs';

const css = `
.pay-head .lede{max-width:54ch}
.pay-head .ctas .btn--lg{min-width:min(100%,280px)}
.pay-steps{counter-reset:s;display:grid;gap:14px;margin:0;padding:0;list-style:none}
.pay-steps li{counter-increment:s;display:grid;grid-template-columns:44px 1fr;gap:14px;align-items:start;font-size:clamp(18px,1.7vw,21px)}
.pay-steps li::before{content:counter(s);font-family:var(--f-display);font-weight:900;font-size:40px;line-height:.9;color:var(--gold)}
.pp-pay{background:var(--paper);color:var(--ink);padding:clamp(16px,2.4vw,24px);display:grid;gap:14px;max-width:440px}
.pp-pay a{color:var(--ink)}
@media (max-width:560px){.pay-head .ctas .btn{width:100%}}
`;

const page = (config) => {
  const href = donateHref(config.payUrl);
  const hosted = paypalCheckout(config, 'paypalPayButtonId');
  const pay = (cls = '') => hosted
    ? `<a class="btn${cls ? ' ' + cls : ''}" href="#pay-now">Pay with PayPal ${arrow}</a>`
    : `<a class="btn${cls ? ' ' + cls : ''}" href="${esc(href)}" target="_blank" rel="noopener">Pay with PayPal ${arrow}<span class="sr"> (opens PayPal in a new tab)</span></a>`;
  const steps = hosted
    ? `<li><span>Type the amount in the box. Add your name and package if it asks.</span></li>
      <li><span>Pay with PayPal, or with a debit or credit card. A card does not need a PayPal login.</span></li>
      <li><span>You get a receipt from PayPal.</span></li>`
    : `<li><span>Tap <strong>Pay with PayPal</strong>. PayPal opens in a new tab.</span></li>
      <li><span>Type the amount we agreed on. Add a note with your name and package if PayPal asks.</span></li>
      <li><span>Pay with PayPal or a card. You get a receipt from PayPal.</span></li>`;
  const widget = hosted
    ? `${paypalWidget(config, 'paypalPayButtonId', 'pay-box')}
    <p class="small muted">If the buttons do not load, <a href="${esc(href)}" target="_blank" rel="noopener">open PayPal</a> and type the amount there.</p>`
    : `<div class="ctas">${pay('btn--lg')}</div>`;
  return {
    path: 'pay.html',
    section: 'contact',
    title: 'Pay',
    h1: 'Pay',
    description: hosted
      ? `Pay ${BIZ.name} securely through PayPal. Type any amount, then pay with PayPal or a card.`
      : `Pay ${BIZ.name} securely through PayPal. You type the amount on PayPal.`,
    teaser: 'Pay through PayPal. You choose the amount.',
    next: 'contact.html',
    css,
    body: (c) => `
<header class="pagehead pay-head" data-spot>
  <div class="wrap pagehead__in">
    ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'Pay' }])}
    <p class="label">Pay · ${BIZ.name}</p>
    <h1 class="h1">Pay <span class="whisper">here.</span></h1>
    <p class="lede">Pay ${BIZ.name} through PayPal. You type the amount${hosted ? ' here' : ' on PayPal'}, so it works for any package, any service or any amount we agreed on.</p>
    <div class="ctas">${pay('btn--lg')}${c.btn('Call ' + BIZ.phone, BIZ.phoneHref, 'ghost lg')}</div>
  </div>
</header>

<section class="band" id="pay-now" aria-labelledby="pay-how-h">
  <div class="wrap wrap--narrow rv" style="display:grid;gap:20px">
    <p class="label">How it works</p>
    <h2 class="h2" id="pay-how-h">Three steps</h2>
    <ol class="pay-steps">
      ${steps}
    </ol>
    ${widget}
    <p class="small muted">Not sure what to pay? <a href="${c.link('contact.html')}">Ask for a free quote</a> first, or call or text <a href="${BIZ.phoneHref}">${BIZ.phone}</a>. The refund and cancel rules for each package are on its page and in the <a href="${c.link('terms.html')}">Terms</a>.</p>
  </div>
</section>`,
  };
};

export default (config = {}) => (config.payUrl || paypalCheckout(config, 'paypalPayButtonId') ? page(config) : []);
