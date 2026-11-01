# Blackout Syndicate 2.0

The all-new blackoutsyn.com. Pitch black, gold light, noir dossiers, and a site that rewards people for going deeper:
every page a visitor opens raises their **clearance**, redacted "classified" files unlock as they level up, three hidden
marks are tucked into the site, and Level 5 opens **the Vault**. Everything a buyer needs (prices, packages, contact) is
always visible. The game is the bonus layer on top.

The deployable site is in **`docs/`**: plain HTML, CSS and JS. No framework, no database, nothing to install.

## Built for the X Ads checklist

| X asked for | Where it lives |
|---|---|
| X Pixel on every page, tracking visits and form submissions | Pixel base code is emitted into every page's `<head>` once `xPixelId` is set. Events: `formSubmit` (form sent), `lead` (thank-you page, the conversion), `packageView`, `contactView`. See *Turn on the X Pixel*. |
| Separate page for each package | `packages/spark.html`, `boost`, `blitz`, `surge`, `overdrive`, `total-blackout`, `post-kit`, `profile-fix`, plus `services/website-design.html`, `ai-consulting`, `ai-automation`, `creator-systems`. Each has a description, what you get, how it runs, fit, FAQ, price and a clear call to action. |
| Complete content | Every page is written out: home, packages, how it works, FAQ, about, the reel, contact, privacy, terms and refunds. No placeholders. |
| Dedicated Thank You page | `thank-you.html`. The contact form redirects there after a successful send. It fires the `lead` conversion. |
| Separate Contact page | `contact.html`: phone, email, service area, socials and the inquiry form. |
| Social links in the footer | Every page footer: X, TikTok, Instagram, Facebook, YouTube, Discord, with icons. |

## Everything you'd flip lives in one file

`src/config.mjs`:

```js
xPixelId: '',          // paste your X Pixel ID
xEvents: { lead: '', formSubmit: '', packageView: '', contactView: '' },
formEndpoint: 'https://formsubmit.co/ajax/info@blackoutsyn.com',
showPayLinks: false,   // true = package pages also show "Pay online" store links
```

Then rebuild: `npm run build` (or `node build.mjs`). That rewrites `docs/`.

### Turn on the X Pixel

1. In X Ads Manager go to **Tools → Events Manager → Add event source → X Pixel**. Copy the pixel ID.
2. Paste it into `xPixelId`.
3. In Events Manager, **Add events**. Create at least:
   - **Lead** (the conversion): paste its event ID (looks like `tw-xxxxx-yyyyy`) into `xEvents.lead`. It fires once when someone lands on `thank-you.html` after sending the form.
   - Optional: **Form submit**, **Content view** (package pages) and **Page view** (contact page) events for `formSubmit`, `packageView`, `contactView`.
4. Rebuild and deploy. Check with the **X Pixel Helper** Chrome extension on the live site.

If you'd rather track the conversion by URL, set the Lead event in Events Manager to "page URL contains `thank-you`". The page only loads after a successful form send.

### The contact form

The form posts to `formEndpoint`. The default is FormSubmit, which needs no account:

1. Deploy the site.
2. Send one test message through the form.
3. FormSubmit emails an **activation link** to `info@blackoutsyn.com`. Click it once.
4. Every message after that lands in that inbox, and the visitor goes to the thank-you page.

To use Formspree, Basin or anything else that accepts a JSON POST, paste its endpoint instead. If a send fails, the visitor
sees your phone number and email plus a copy of their message, so no lead is lost.

### Checkout links

`showPayLinks` is **off**. Every package's main button is "Claim it", which opens the contact form with that package selected.
This works no matter what the payment processor is doing. Turn it on once checkout is confirmed working, and the one-time
packages also get a "Pay online" button pointing at the matching store product page.

## Editing prices and packages

All package facts live in `src/data/offers.mjs` (names, prices, what's included, FAQs). Business facts, socials, the reel
and the clearance ladder live in `src/data/business.mjs`. Every page reads from those files. Change a price once, rebuild,
and it changes everywhere: cards, package pages, footer, comparison tables and structured data.

The refund and billing wording is in `POLICY` in `src/data/business.mjs`. **It is a draft. Confirm it before launch.**

## Putting it online

`docs/` is a finished static site. Any of these works:

- **Netlify or Cloudflare Pages:** drag the `docs` folder into Netlify Drop, or point either service at this repo with
  build command `node build.mjs` and output folder `docs`. Then connect `blackoutsyn.com` in their domain settings.
- **GitHub Pages:** repo Settings → Pages → Deploy from branch → choose the branch and the `/docs` folder.
- **Any web host:** upload the contents of `docs/` to the web root.

Moving `blackoutsyn.com` off Wix means pointing the domain's DNS at the new host. Keep the Wix site live until the new one is
confirmed working.

## How the clearance game works

| Earn | Clearance |
|---|---|
| Open a file (page) for the first time | +10 |
| Read a file to the end | +15 |
| Finish the package matcher | +30 |
| Find a hidden mark (3 in the site) | +25 each |
| Send the contact form | +50 |
| Type the name on the door anywhere on the site | +20 |

| Level | Name | Unlocks |
|---|---|---|
| 1 | Lookout (25) | Playbook Rule 01 on the home page |
| 2 | Associate (60) | The pricing math on every package page |
| 3 | Operative (110) | How a push is actually aimed (How it works) |
| 4 | Lieutenant (170) | The founder's full file (About) |
| 5 | Inner Circle (240) | The Vault: the full Syndicate Playbook and a Syndicate ID card |

Progress is saved only in the visitor's own browser. Redacted text stays in the page for screen readers and search engines;
the redaction is visual only.

## Working on the site

```bash
npm run build           # build docs/
npm run serve           # preview docs/ at http://localhost:8080
npm run shots           # screenshot every page at desktop and phone width into .shots/
npm run build:preview   # self-contained pages for previews (form skips the network)
```

- `src/pages/*.mjs`: one module per page. See `COMPONENTS.md` for the page format, helpers and design rules.
- `src/layout.mjs`: head, nav, footer, next-file teaser, clearance drawer.
- `src/assets/css/site.css`: the design system. `src/assets/js/site.js`: the clearance engine, form and pixel events.
- The build checks every internal link and anchor and fails if one is broken.
