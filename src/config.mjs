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
  xPixelId: '',
  // Event IDs come from Events Manager → "Add events". They look like "tw-o1a2b-o3c4d".
  xEvents: {
    lead: '',          // fires once on thank-you.html after a form is sent (the conversion)
    formSubmit: '',    // fires the moment the contact form is sent successfully
    packageView: '',   // fires on every package / service page view
    contactView: '',   // fires when someone opens contact.html
  },

  // ── LEAD FORM ──────────────────────────────────────────────────────────────
  // Any endpoint that accepts a JSON POST works (FormSubmit, Formspree, Basin, your own).
  // FormSubmit needs no account: the very first submission sends an activation
  // email to the address below. Click it once and every lead after lands in that inbox.
  formEndpoint: 'https://formsubmit.co/ajax/info@blackoutsyn.com',

  // ── CHECKOUT ───────────────────────────────────────────────────────────────
  // false = every package routes to the lead form (works no matter what payment processor does).
  // true  = package pages also show a "Pay online" link to the store product page.
  showPayLinks: false,

  // Preview mode: the form skips the network and goes straight to the thank-you page.
  // The build turns this on automatically for `npm run build:preview`.
  previewMode: false,
};
