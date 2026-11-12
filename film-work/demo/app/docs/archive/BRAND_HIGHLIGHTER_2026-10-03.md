# bestvpsforme brand guidelines, v1.1 (3 Oct 2026)

Identity name: **Highlighter**. Everything in this folder is the source of truth for the product UI, marketing, and video. Tokens live in `tokens/`. If a value here disagrees with `tokens/tokens.css`, the CSS wins. Fix this file.

The 3 October 2026 product redesign supersedes the oversized mockups in this folder. [DESIGN.md](../DESIGN.md) defines the current comparison UI: restrained headings, readable prices, ordinary filters and no search palette or promotional rack graphics.

---

## 1. Essence

| | |
|---|---|
| **Idea** | We read the fine print. |
| **Promise** | See what a server really costs before you pay for it. |
| **Tagline** | We read the fine print. You pick the server. |
| **Short line** | The real price of a server. |
| **Category** | Independent VPS price research. Not a hosting directory, not a "best of" list. |
| **For** | Beginner builders and practical self-hosters picking a first or next VPS for a real job: WordPress, n8n, Coolify, Docker, a game server, a VPN. |
| **Enemy** | The headline price. Ads that lead with a number only valid for three months on a two-year contract. |

### Proof pillars (every page shows at least one)
1. **The 3-year real price.** One comparable number: total cost of the first 36 months ÷ 36, with terms, intros, and renewals included.
2. **The catch.** One plain sentence per plan, next to the price, never hidden.
3. **Dated evidence.** Every fact carries a check date and a source.
4. **Money-blind order.** Commission never touches rank, and the formula is public.

### Personality
Sharp, calm, a little dry. A friend who reads contracts for fun and tells you the one line that matters. Confident enough to be loud visually, precise enough never to exaggerate.

| We are | We are not |
|---|---|
| Direct | Salesy |
| Precise | Pedantic |
| Bold | Loud for its own sake |
| Plain-spoken | Jokey |
| Independent | Contrarian |

---

## 2. Logo

### 2.1 The Pick (mark)
A rounded-square ink tile holding three rack units. The middle unit is pulled out and highlighted in volt. It reads three ways at once: *a server*, *a list*, and *the one you picked*.

Construction on a 64-unit grid (see `logo/build_logo.py`):

| Element | Value |
|---|---|
| Tile | 64 × 64, radius 15 (23.4%) |
| Units | 36 × 10.5, radius 3 |
| Unit positions | top x10 y13.5 · pick x18 y26.75 · bottom x10 y40 |
| LED | circle r2 at unit x+5.5, vertically centred |
| Vent | 6 × 2.4 bar, radius 1.2, at unit x+26, 55% opacity |
| Pick offset | +8 units (22% of unit width) to the right |

### 2.2 Wordmark
`bestvpsforme`, all lowercase, set in **Mona Sans Wide ExtraBold** (wdth 125, wght 800), tracking −2.8%, kerned by HarfBuzz and outlined. A volt highlighter swipe sits behind **forme** ("for me"). The swipe has a 3.5% skew, starts at the f, and extends 0.06 em past the e.

Never type the wordmark in live text as the logo. In running copy, write "bestvpsforme" in the surrounding font, lowercase, no styling.

### 2.3 Files

| File | Use |
|---|---|
| `logo/lockup-horizontal-light.svg` | Default. Nav, docs, light backgrounds |
| `logo/lockup-horizontal-dark.svg` | Dark UI, footer, night backgrounds |
| `logo/lockup-horizontal-on-volt.svg` | Volt backgrounds (ink swipe, volt letters) |
| `logo/lockup-stacked-{light,dark}.svg` | Square formats, splash, end cards |
| `logo/wordmark-{light,dark}.svg` | Where the mark already appears nearby |
| `logo/wordmark-mono-{ink,paper}.svg` | One-colour print, embossing, fax-grade contexts |
| `logo/mark.svg` | App icon, avatar, favicon source |
| `logo/mark-on-dark.svg` | Mark on ink or night |
| `logo/mark-volt.svg` | Mark on volt surfaces |
| `logo/glyph-{ink,paper}.svg` | Tile-less mark for watermarks and loaders |
| `logo/favicon.svg` | Browser tab, auto light/dark |
| `logo/app-icon-512.svg`, `png/app-icon-1024.png` | iOS/Android/PWA (full-bleed tile, the OS rounds it) |
| `logo/png/*` | Raster exports at 16–1024 px and 2000 px wide lockups |

### 2.4 Clear space and minimum size
- Clear space on all sides = 2 × the height of one rack unit (≈ 33% of the mark height).
- Minimum lockup height: 20 px on screen, 8 mm in print.
- Minimum mark: 16 px (the favicon is hand-tuned at that size).

### 2.5 Misuse
Don't recolour the swipe or the pick. Don't put the light lockup on volt (use `on-volt`). Don't add shadows, outlines, or gradients. Don't rotate, stretch, or animate letters individually except in the approved bumper (`video/README.md` §6). Don't pair the mark with another logo inside one tile. Don't write "BestVPSForMe".

---

## 3. Colour

### 3.1 Palette

| Name | Hex | Role |
|---|---|---|
| Ink 950 | `#0E1116` | Text, primary buttons, the tile |
| Paper | `#FFFFFF` | Canvas. Never cream, never off-white paper textures |
| Volt 400 | `#D4FF3A` | The highlighter: picks, key numbers, the one commercial CTA |
| Vermilion 500 | `#F4511E` | The catch: dots, strikes, numbered pins |
| Vermilion 700 | `#B53A12` | Catch text on paper (5.87:1) |
| Ink 600 | `#474F5C` | Secondary text (8.26:1) |
| Ink 500 | `#636B78` | Tertiary text (5.38:1) |
| Signal 700 | `#0B7A4C` | Verified/positive text (5.38:1) |
| Night | `#0A0C10` | Dark canvas |

Full scales and dark-mode roles: `tokens/tokens.css`.

### 3.2 Proportion
Ink ~70% · Paper ~20% · Volt ≤ 8% · Vermilion ≤ 2%. On any single screen, volt appears in at most three places: one highlight, one CTA, and picks.

### 3.3 Hard rules
- **Volt is never text on paper and never the only boundary on white** (1.16:1). On paper, volt is always a fill behind ink text, or a fill with an ink outline.
- On dark backgrounds, volt *can* be text (16.4:1).
- Vermilion 500 is for shapes and icons only. Text uses Vermilion 700 on light and Vermilion 300 on dark.
- Colour never carries meaning alone. Catches always pair the vermilion dot with words, and picks pair volt with a checkmark.

### 3.4 Contrast (checked)
| Pair | Ratio |
|---|---|
| Ink 950 on Volt 400 | 16.36 |
| Ink 600 on Paper | 8.26 |
| Ink 500 on Paper | 5.38 |
| Vermilion 700 on Paper | 5.87 |
| Vermilion 700 on Vermilion 50 | 5.36 |
| Volt 800 on Paper | 6.65 |
| Dark: fg-muted on Night | 8.96 |
| Dark: Vermilion 300 on Night | 9.18 |

---

## 4. Typography

| Role | Face | Settings |
|---|---|---|
| Display | Mona Sans | wdth 100, wght 700–760, 30–48 px, line-height 1.1–1.2 |
| Headings | Mona Sans | wdth 100, wght 650–720, 20–32 px, line-height 1.2–1.3 |
| UI and body | Mona Sans | wdth 100, wght 420–620, 16 px, line-height 1.5–1.7 |
| Supporting text | Mona Sans | wdth 100, wght 500–650, at least 14 px |
| Table numbers, receipts, stamps | Geist Mono | wght 500–650, tabular, slashed zero |
| Prices | Geist Mono | wght 600–700, 22–40 px, with a visible billing label |

Both families are OFL 1.1 (`fonts/OFL-*.txt`). In the app, load them with `next/font/local` using the variable files so the `wdth` axis is available (the Google Fonts API cuts some axes).

Scale (px): 14 · 16 · 20 · 24 · 30 · 32 · 40 · 48.

Rules: titles name the page or task. No forced line breaks, word-by-word highlights or giant display numbers. Numbers are never smaller than their labels. Body text measure 45–72 characters.

---

## 5. Signature devices

| Device | Spec | Use |
|---|---|---|
| **Selection highlight** | Small solid volt fill with an ink label; no first-view swipe animation | Selected plans, primary actions and best-in-row comparisons; not every heading |
| **Catch mark** | `text-decoration: underline wavy` Vermilion 500, 1.5 px, offset 0.22 em | Fine print inside running text |
| **Dated evidence** | Neutral bordered label, at least 14 px text, explicit checked date; icon optional | Reviewed prices and source dates |
| **Evidence panel** | Simple border, semantic surface and restrained radius; no offset shadow or rotation | Price breakdowns and field provenance |
| **Tags** | At least 14 px text, restrained radius, status color accompanied by words | catch (vermilion), ok (signal), volt (selection), neutral |

---

## 6. Layout

- Grid: max content 1240 px, wide 1280 px, prose 720 px. Gutter `clamp(20px, 3.2vw, 40px)`.
- Spacing: 4-point scale (4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160). Browsing sections generally use 24–48 px, not oversized promotional gaps.
- Radius: 6 controls · 10 inputs/tiles · 16 cards · 20 larger surfaces. Circular toggles may use a full radius.
- Breakpoints: 640 · 768 · 1024 · 1280 · 1536.
- Density: catalog rows grow to fit price caveats and missing evidence. Body text is 16 px; supporting data is at least 14 px. Do not truncate decision fields to meet a fixed row height.
- Structure comes from hairline rules and spacing first, surfaces second. No nested cards.

---

## 7. Iconography and imagery

- Icons: 24-grid line icons, 1.8 stroke, round caps (Phosphor "regular" in the app). 16 px in UI, 20 px in headings. Ink or muted ink only; never volt icons on paper.
- Provider logos: always inside the white `pmark` tile (radius 24% of size, 16% padding, 1 px inner line). Never recoloured, cropped, or animated. On dark UI the tile stays white.
- Flags: 18 × 13, radius 2, 1 px hairline. Always paired with a country name somewhere accessible.
- Illustration: only the rack and real UI. No stock photos, no 3D servers, no people with laptops.
- Data viz: ink dots and lines, volt for the highlighted subset, a dashed median, Geist Mono labels. No pie charts.

---

## 8. Motion

| Token | Value | Use |
|---|---|---|
| fast | 140 ms | hover, press |
| base | 200 ms | toggles, chips |
| slow | 320 ms | tray, sheets (spring) |
| highlight | 520 ms | swipe |
| reveal | 640 ms | first-view section reveal (14 px rise + fade) |
| ease-out | `cubic-bezier(.22,1,.36,1)` | default |
| spring (CSS) | `linear(...)` in tokens | tray, switch thumb, pick |
| springs (video) | snappy 20/220 · smooth 26/120 · pick 14/170/0.9 · heavy 30/90/1.4 | Remotion |

Buttons scale to 0.97 on press. Never animate from `scale(0)`. `prefers-reduced-motion` removes swipes, reveals, and springs; content shows instantly.

---

## 9. Voice

Short sentences. Numbers before adjectives. Say what the ad leaves out, and date it.

| Instead of | Write |
|---|---|
| Blazing-fast VPS from $4! | $4 for 3 months. Then $11/mo on a 1-year contract. |
| Best VPS 2026 | Cheapest 4 GB real price in the 31 Aug snapshot |
| Featured partner | *(nothing: we don't have partners in the ranking)* |
| N/A | Not published |
| Get deal | Visit Hostinger |
| Unlimited* | Unlimited, fair use (throttled above 2 TB/day) |

Words we use: *real price, the catch, checked, not published, pick, due today, renews at*.
Words we don't: *best, #1, top, deal, exclusive, blazing, unbeatable, partner pick, live price*.

Every rewrite goes through the `stop-slop` skill before shipping.

---

## 10. Third-party marks

- Provider names and logos are shown for identification only, unmodified, and smaller and less prominent than our own brand (per e.g. DigitalOcean's trademark guidelines).
- Trustpilot: until there's an agreement, show "4.7 Trustpilot · 66,058 reviews · checked 31 Aug 2026" as plain text with a link. No Trustpilot logo, no star graphics (Trustpilot Legal Brand Guidelines, Sept 2026).
- Footer line on every page: "Provider names and logos belong to their owners."

---

## 11. Folder index

```
brand/
  BRAND.md              this file
  README.md             how to open, rebuild, and use everything
  fonts/                Mona Sans + Geist Mono variable TTFs + OFL licences
  logo/                 SVG system, build_logo.py, png/ exports
  tokens/               tokens.css (web), tokens.json (Remotion, Figma, anything else)
  mockups/              clickable HTML for every screen (index.html = gallery)
  marketing/            OG + social templates, png/ exports
  video/                Remotion brief, storyboard.html, frames/
  previews/             PNG screenshots of every mockup (desktop, mobile, dark)
```
