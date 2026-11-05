// Live PayPal "customer set price" buttons (Payment Links & Buttons, stacked).
// The client ID and hosted button ID are public values from the button code.
// They are not secrets. Empty or invalid values leave the paypal.biz link in place.
// Never point this at sandbox.paypal.com. A live client ID on www.paypal.com/sdk/js
// charges the live Business account.

const SAFE = /^[A-Za-z0-9_-]{10,100}$/;
const DOM = /^[A-Za-z][A-Za-z0-9_-]{0,40}$/;

export function paypalCheckout(config, buttonKey) {
  const clientId = String(config?.paypalLiveClientId || '').trim();
  const buttonId = String(config?.[buttonKey] || '').trim();
  if (!SAFE.test(clientId) || !SAFE.test(buttonId)) return null;
  return { clientId, buttonId };
}

// One widget per page. PayPal only renders the first copy of a hosted button ID.
export function paypalWidget(config, buttonKey, domId) {
  const got = paypalCheckout(config, buttonKey);
  if (!got || !DOM.test(domId)) return '';
  const src = 'https://www.paypal.com/sdk/js?client-id='
    + encodeURIComponent(got.clientId)
    + '&components=hosted-buttons&currency=USD';
  const box = domId + '-btn';
  return `<div class="pp-pay" id="${domId}">
<script src="${src}"></script>
<div id="${box}"></div>
<script>paypal.HostedButtons({hostedButtonId:${JSON.stringify(got.buttonId)}}).render("#${box}");</script>
</div>`;
}
