// ─────────────────────────────────────────────────────────────────────────────
//  BLACKOUT SYNDICATE 2.0 — SITE SWITCHBOARD
//  Everything you'd ever need to flip lives here. Edit, then run `npm run build`.
// ─────────────────────────────────────────────────────────────────────────────
export default {
  // Public address of the live site (used for canonical links, sitemap, share cards).
  siteUrl: 'https://www.blackoutsyn.com',

  // ── X PIXEL ────────────────────────────────────────────────────────────────
  // X Ads Manager → Tools → Events Manager → "Add event source" → X Pixel.
  // Paste the pixel ID (looks like "o1a2b"). Leave '' to load no tracking at all.
  xPixelId: 'rhx35',
  // Event IDs come from Events Manager → "Add events". They look like "tw-o1a2b-o3c4d".
  // An event left as '' simply doesn't fire.
  xEvents: {
    lead: 'tw-rhx35-rid9b',          // THE conversion: fires once on thank-you.html after a real send from this browser
    formSubmit: '',    // secondary: fires the moment the form is sent (same send as lead; don't count both)
    packageView: '',   // fires on every package / service page view
    contactView: '',   // fires when someone opens contact.html
    call: '',          // fires when someone taps a phone (call), text or email link on any page
  },

  // ── LEAD FORM ──────────────────────────────────────────────────────────────
  // Any endpoint that accepts a JSON POST works (FormSubmit, Formspree, Basin, your own).
  // FormSubmit needs no account: the very first submission sends an activation
  // email to the address below. Click it once and every lead after lands in that inbox.
  formEndpoint: 'https://formsubmit.co/ajax/info@blackoutsyn.com',

  // ── CHECKOUT ───────────────────────────────────────────────────────────────
  // false = every package routes to the lead form (works no matter what payment processor does).
  // true  = package pages also show a "Pay online" link to the store product page.
  // The store pages show prices, so keep this false while showPrices is false.
  showPayLinks: false,

  // ── PRICES ─────────────────────────────────────────────────────────────────
  // false = no package prices anywhere on the site. Every price spot says "Ask us for pricing" and the
  //         "Claim it" buttons become "Get pricing" (they open the form with the package picked).
  //         Learn Claude With Me keeps its class price either way (CLASSES in src/data/offers.mjs).
  // true  = every price shows again, read from src/data/offers.mjs. Nothing there was removed.
  showPrices: false,

  // ── WASHINGTON TRIP ────────────────────────────────────────────────────────
  // Biz's trip to NVIDIA GTC in Washington, D.C., Nov 29 to Dec 3 (pass, travel and hotel).
  // Paste the donation link here (PayPal, Cash App, Venmo, GoFundMe...).
  // Set   = washington.html is built, with a big Donate button to this link, and linked from the
  //         footer, Get started and the class page.
  // Empty = no page and no links anywhere. Empty it again once the trip is over.
  donateUrl: 'https://www.paypal.biz/blackoutsyn',
  // Biz's PayPal Business page. The Pay page and every Pay button open it; the payer types the amount on PayPal.
  payUrl: 'https://www.paypal.biz/blackoutsyn',

  // Preview mode: the form skips the network and goes straight to the thank-you page.
  // The build turns this on automatically for `npm run build:preview`.
  previewMode: false,
};
