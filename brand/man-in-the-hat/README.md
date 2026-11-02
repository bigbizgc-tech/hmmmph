# Blackout Syndicate: the man in the hat

The man in the hat was Blackout Syndicate's first logo (Logo Pack B). He keeps his head down, his face is lost under the brim, and only the grin shows. This folder rebuilds that same man as a real logo. It uses flat shapes and three colours, stays sharp at 16 px, and works on black and on paper. The name uses the site's own "Blacked Out" lockup: BLACKOUT is cut out of a paper redaction bar, with SYNDICATE in gold below it. That way the redacted face and the redacted name are one idea, and the gold disc of light says *Get Seen*.

Open **`logo-sheet.html`** for the full guide. It covers every lockup and colourway, the original next to the new mark, clear space, minimum sizes, the palette, type, and do's and don'ts.

## Which file goes where

| Where | Use | Notes |
|---|---|---|
| **Website nav** | `nav-snippet.html` | Inline SVG at 38 px tall, 32 px on phones, and the coin alone under 360 px. Gold parts are `currentColor`, the redaction bar and grin are `var(--paper)`, and the man is `var(--void)`. It replaces the old B cell, so the man is now the only mark. |
| **Favicon** | `favicon.svg`, `favicon.ico` | The gold disc carries its own background, so it reads in light and dark tabs without a tile. The ICO holds 16 px (drawn pixel by pixel), 32 px and 48 px. |
| **Apple touch / app icon** | `png/favicon-180.png`, `png/favicon-512.png` | The mark on void. The 512 keeps the coin inside the maskable safe zone. |
| **X / Instagram / TikTok avatar** | `png/x-avatar-1000.png` (or `-400`) | The gold coin fills the circle crop with no dark ring, so it is the avatar the eye lands on at 40 px. |
| **X / YouTube header** | `png/x-header-1500x500.png` | The horizontal lockup over the site's Chicago night skyline. The bottom-left, where X puts the avatar, stays clear. |
| **Video end card** | `png/endcard-1920x1080.png` | The hero form: the void man in rim light with the lettered hatband. The Blacked Out bar crosses his chest, and *Get Seen.* and blackoutsyn.com sit below. |
| **Business card** | Front: `svg/lockup-stacked-gold.svg` on black. Back: `svg/lockup-horizontal-black.svg` on paper | Show a shop owner the paper side first. |
| **Invoices, proposals, Google Business, chamber** | `svg/lockup-horizontal-black.svg` | Black on paper puts trust first. For a seal, use `svg/badge-black.svg`. |
| **Stickers, patches, pins, door decal, rubber stamp** | `svg/badge-gold.svg` / `-white` / `-black` | Secondary badge: BLACKOUT SYNDICATE over the top and SOUTH BEND · INDIANA below. Use it at 1 in / 96 px or larger, and never as the avatar. `png/badge-1200.png` is for proofs. |
| **Merch and signage** | `svg/mark-lettered-*.svg` | The original's hatband lettering, at 2 in / 200 px or larger only. |
| **Site hero, posters** | `svg/hero-rimlight.svg` (`-flat` has no glow) | The void man in rim light for big surfaces over the skyline, in place of a big gold plate. It is never the avatar or the nav mark. |
| **Tools that won't take SVG** | `png/lockup-horizontal-1600.png`, `png/mark-1024.png`, `png/lockup-stacked-2000.png` | All transparent except the stacked lockup, which sits on void. |

### Favicon tags

Copy `favicon.svg` and `favicon.ico` to the site root, and copy `png/favicon-180.png` to `assets/img/apple-touch-icon.png`. Then use:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
```

## The system

| File | What it is | Smallest on screen / in print |
|---|---|---|
| `mark` | **The coin.** The man cut out of a gold disc of light: a cocked fedora with a two-lobe crown, a gold band, the face lost under the brim, a 5-over-4 grin with the smirk rising right, a sparkle on black, and a gold collar V inside the disc | 48 px / 0.5 in |
| `mark-small` | The same man redrawn for 16–47 px: a heavier band, one bright two-row grin inside a black jaw, and no sparkle | 16 px / 0.25 in |
| `lockup-stacked` | **Primary.** The coin over the Blacked Out name. The disc is 78% of the bar's width, so the character leads | 96 px wide / 0.9 in |
| `lockup-horizontal` | The coin beside the two-line name. The coin's height matches the name's height | 48 px tall with the full drawing. For a nav under 48 px, use `nav-snippet.html`, which swaps in mark-small |
| `wordmark` | The name on one line | 16 px tall |
| `badge` | Secondary seal for stickers, patches, stamps and invoices | 96 px / 1 in |
| `mark-lettered` | The coin with BLACKOUT SYNDICATE on the hatband | 200 px / 2 in |
| `hero-rimlight` | The hero illustration: the void man, rim light from the searchlight, the lettered band and an optional glow | Hero surfaces only |

**Clear space:** keep **x** clear on every side, where x is half the height of the BLACKOUT bar. For the coin alone, x is 1/6 of the disc.

## Colourways

The man is always the darkest thing in the logo and the grin is always the brightest.

- **`-gold`** uses void `#070708`, gold `#d9b25f` and paper `#f2ead8`. Every part has its own fill, so the files are self-contained. Use it on black, on dark photos and on the skyline. The colour **coin** is also allowed on white, because the disc carries its own light. Never use the gold **lockups** on paper: the paper bar disappears and gold type is too faint.
- **`-white`** is one colour, `#ffffff`, and follows the light. The disc, grin, band and collar are white, and the man is cut out. Use it on dark garments, busy video and screen print.
- **`-black`** is one colour, `#070708`, and follows the shadow. The man is ink inside an ink ring, and the grin, band, collar and sparkle stay paper. On paper the bar inverts, so it reads as an ink bar with paper letters. It is the default for invoices, proposals, Google Business and rubber stamps.

Every SVG has its text outlined to paths, flat explicit fills, no filters, masks, gradients or external references, and a tight viewBox. The one exception is `hero-rimlight.svg`, whose first `<circle>` is an optional radial-gradient glow you can delete.

## Palette

| Colour | Hex | Role |
|---|---|---|
| Void | `#070708` | The man, the ink, the page (was Pack B `#0A0A0A`) |
| Gold | `#d9b25f` | The light: disc, band, collar, SYNDICATE (was `#C9A84C`) |
| Paper | `#f2ead8` | The grin, the sparkle, the redaction bar (was tooth cream `#FFF3D6`) |
| Highlight | `#f3d48a` | Nav hover and hero glow only |
| Shadow gold `#8a6d34`, stamp red `#e5484d` | | Site UI only, never in the logo |

## Type

Big Shoulders Display Black (BLACKOUT, cut out of the bar) and ExtraBold (SYNDICATE, the badge and the hatband). Bodoni Moda italic is for *Get Seen.* only. Courier Prime is for labels and Archivo for body copy. Cinzel is retired.

## Don't

- Show his face. No eyes, no features: the grin is the only light on him.
- Recolour, rotate, outline, add a glow to or stretch the coin, or drop the band. The grin, sparkle and band are what make him ownable, so keep them.
- Put gold lockups on paper. Use `-black`.
- Use the badge or the rim-light hero as an avatar or nav mark.
- Use the lettered hatband below 200 px.
