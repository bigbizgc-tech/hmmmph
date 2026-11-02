# Blackout Syndicate logo system

**Blacked Out.** BLACKOUT is cut out of a redaction bar, so its letters are made of the dark. SYNDICATE sits under it in gold light. Read top to bottom, the name goes from hidden to seen: *you're in the dark until the light finds you.* The mark is the first cell of that bar, a B that is redacted on top and lit gold below.

Open **`logo-sheet.html`** for the full guide. It covers every lockup and colourway, the logo on the site's Chicago skyline, clear space, minimum sizes, the palette, type, and do's and don'ts.

## Which file goes where

| Where | Use | Notes |
|---|---|---|
| **Website nav** | `nav-snippet.html` | Inline SVG of the horizontal lockup at 38 px tall (113 px wide), 30 px on phones, and the B cell alone under 350 px. The gold parts are `currentColor`, the paper parts are `var(--paper)` and the B is `var(--void)`. The page includes the CSS and the new snap-brim `logoMark()` for the hidden-mark game. |
| **Favicon** | `favicon.svg`, `favicon.ico`, `png/favicon-32.png` | The mark sits on its own dark tile, so it reads in light and dark tabs. The ICO holds a 16 px version drawn on the pixel grid, plus 32 and 48. |
| **Apple touch / app icon** | `png/favicon-180.png`, `png/favicon-512.png` | Full-bleed void background. The mark sits inside the maskable safe zone. |
| **X / Instagram / TikTok avatar** | `png/avatar-1000.png` (or `avatar-400.png`) | The mark on void with a low gold glow. It is safe for circle crops, and its corners sit inside the circle. |
| **X / YouTube / Facebook header** | `png/x-header-1500x500.png` | The horizontal lockup over site 2.0's own Chicago skyline, with the searchlight lighting the windows. |
| **Video end card** | `png/endcard-1920x1080.png` | The stacked lockup on the skyline, with a beacon sweeping from Willis Tower, "Get Seen." and blackoutsyn.com. |
| **Business card** | Front: `svg/lockup-stacked-gold.svg` on black. Back: `svg/lockup-horizontal-black.svg` on paper | Minimum print sizes: stacked 0.75 in wide, horizontal 0.3 in tall. |
| **Sticker / merch** | `svg/stamp-gold.svg` (die-cut on black), `svg/stamp-black.svg`, `svg/stamp-white.svg`, `svg/snapbrim-*.svg` | Send printers the SVG. `png/stamp-1200.png` is for proofs. Use the stamp at 1 in / 96 px or larger, and never as the avatar. |
| **Flyers / signs** | `svg/lockup-stacked-gold.svg` on dark stock, `svg/lockup-stacked-black.svg` on white stock | `png/lockup-stacked-2000.png` is ready-made on black. |
| **Invoices, proposals, Google Business Profile, chamber** | `svg/lockup-horizontal-black.svg` | The plain, trust-first version: black on paper. |
| **Lower thirds, banners, footers** | `svg/wordmark-*.svg` | One line, 8.3:1. Never used in the nav. |
| **Tools that won't take SVG** | `png/lockup-horizontal-1600.png`, `png/mark-1024.png` | Transparent PNGs. |

### Favicon tags

Copy `favicon.svg` and `favicon.ico` to the site root, and `png/favicon-180.png` to `assets/img/apple-touch-icon.png`. Then use:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
```

## Colourways

Every logo comes in three colourways:

- **`-gold`** uses paper `#f2ead8` and gold `#d9b25f`, and the letters carry their own ink `#070708`. Use it on black, on dark photos and on the skyline. Don't use it on white or light backgrounds, where the paper parts vanish.
- **`-black`** is one colour, `#070708`. Use it on paper, white, invoices and rubber stamps. The letters are true knockouts.
- **`-white`** is one colour, `#ffffff`. Use it on dark garments, busy video and photos, and for screen print. The letters are true knockouts.

Every SVG has its text outlined to paths, flat fills, no filters, masks or external references, a tight viewBox, and explicit `width`/`height`.

## The system

| File | What it is | Smallest on screen |
|---|---|---|
| `lockup-stacked` | **Primary.** BLACKOUT cut out of the bar, with SYNDICATE justified to the bar's width (Big Shoulders Display Black / ExtraBold) | 72 px wide |
| `lockup-horizontal` | The B cell beside the name in two lines. The cell's paper half sits beside BLACKOUT and its gold half beside SYNDICATE | 24 px tall (30 px on phones) |
| `wordmark` | One line | 18 px tall |
| `mark` | The B cell | 48 px; below that use `mark-small` |
| `mark-small` | The B cell redrawn on a 32-unit grid, with stems on whole pixels | 16 px |
| `stamp` | The clearance stamp: a ring, the bar across it, the snap-brim above it and "Get Seen." below | 96 px / 1 in |
| `snapbrim` | **Secondary icon.** The site's fedora redrawn as a cocked 1930s Chicago snap-brim. It is used for the hidden marks and merch, never next to the name, and never in place of the B | 16 px |

**Clear space:** keep at least **x** clear on every side, where x is half the height of the redaction: half the bar for the stacked lockup and the wordmark, half the B cell for the horizontal lockup and the mark.

## Palette

| | Hex | Role |
|---|---|---|
| Void | `#070708` | The blackout. Backgrounds, and the ink inside the letters |
| Paper | `#f2ead8` | The redaction bar and the top half of the B |
| Gold | `#d9b25f` | The light. SYNDICATE and the lit half of the B |
| Gold Hi | `#f3d48a` | Glows and hover only |
| Brass | `#8a6d34` | Gold text on paper, found hidden marks |
| Signal | `#e5484d` | Site stamps and live dots only. **Never in the logo.** |

Type: Big Shoulders Display (the logo and headlines), Bodoni Moda Italic (the "Get Seen." accent, not part of the logo) and Courier Prime (dossier labels). The logo files need no fonts.

## Don't

Don't use the gold files on white. Don't recolour the logo or add red. Don't stretch it. Don't make a "BS" monogram. Don't add glows, shadows or outlines to the logo itself (light the scene behind it instead). Don't set the snap-brim next to the name as a lockup.
