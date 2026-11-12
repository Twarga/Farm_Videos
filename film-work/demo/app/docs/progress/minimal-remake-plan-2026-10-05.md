# Minimal remake plan — "less text, everything in its place" (5 October 2026)

> Owner brief (5 Oct): keep the VPS table as it is and polish it; cut text on every page; stop
> rows and sections from carrying so much context that users get confused; nothing should run
> into its neighbour; build a minimal, polished, "wow" final UI with a strong landing page.
>
> This plan presents the existing data more simply. It changes nothing in pricing, ranking,
> evidence, publication or authentication rules. Owner gates (production migration, editorial
> publication, renewal corrections, snapshot publication) are untouched.

---

## 0. Evidence: the current state, measured

Measured with Playwright on the preview (`127.0.0.1:3115`, 1440×900, real 314-plan database).
Screenshots are in `/tmp/uiaudit/`.

| Page | Words in `<main>` | Words above fold | Links/buttons | "Not published" | "Direct link" |
|---|---:|---:|---:|---:|---:|
| Home | 367 | 175 | 19 | 0 | 0 |
| Catalog | **791** | 219 | 94 | 13 | **24** |
| Offer (unreviewed) | 237 | 141 | 10 | 7 | 2 |
| Compare (3 plans) | 198 | 110 | 13 | **17** | 3 |
| Providers index | **824** | 200 | 49 | 0 | 0 |
| Provider detail | **661** | 123 | 59 | 0 | **23** |
| Guides index | 282 | 130 | 14 | 0 | 0 |
| Guide article | 484 | 176 | 16 | 0 | 0 |
| Methodology | 565 | 273 | 2 | 3 | 0 |
| About | 136 | 139 | 4 | 0 | 0 |
| Updates | 195 | 143 | 2 | 0 | 0 |

Defects confirmed in the render (not opinion):

1. **Brand fonts never load.** `next/font` sets `--font-mona-sans` and `--font-geist-mono` on
   `<body>` (`src/app/layout.tsx`), but `--font-sans` and `--font-mono` are resolved on `:root`
   (`src/styles/tokens.css:83-84`). There the variables are undefined, so the CSS falls back to
   the unregistered names `"Mona Sans"`/`"Geist Mono"`. Every page renders Noto Sans and a
   Courier-like mono. This dates from Phase 3. All 120 visual baselines were taken with fallback fonts.
2. **Catalog rows hide whether a price is reviewed.** A reviewed 3-year price (IONOS $10.42) and
   an advertised, unverified price (BuyVM $3.50) render identically. This breaks DESIGN.md "Signature".
3. **The compare tray floats over content** on guides, methodology, provider tables and `/compare`
   itself.
4. **Provider header is broken:**
   - The logo is not aligned with the title.
   - Link arrows wrap onto their own lines.
   - The Trustpilot text renders as "2.1 Trustpilot Trustpilot".
   - Stat labels are tiny and uppercase, which DESIGN.md forbids.
   - A red "Watch for" card says there is nothing to watch.
5. **Header and page do not share edges.** The logo starts at x=83, the catalog filter rail at x=22.
6. **System drift in the CSS:**
   - 194 raw font sizes, 18 distinct values (including 14.5 px and 11.5 px).
   - 26 inline `style={{}}` blocks in public pages (another 33 in OG images, which are fine).
   - 12 breakpoints, against 5 in the spec.
   - Raw radii (2, 5, 6, 8, 10 px) next to tokens.
7. **Mobile pages are very long.** A catalog card is about 420 px tall, so the catalog page is
   10,724 px and a provider page 11,326 px.
8. **Home looks like an ad.** The four "recommended" cards are all IONOS, and the right half of
   the hero is empty.

---

## 1. Design principles (the rules every task below obeys)

1. **One idea per section.** A section is a title, at most one line of supporting text, then the
   content. No section has two paragraphs.
2. **Labels, not sentences.** Use "Reviewed", "Renews $8.99" and "—", not "This price has been
   reviewed and…". The explanation lives once on `/methodology`, linked by one small `?` or
   "How we check" link.
3. **Say it once per page.**
   - The affiliate disclosure appears once, next to the first outbound action area. It is not
     repeated per row.
   - The unknown-value legend appears once ("— not published").
   - The snapshot date appears once.
4. **The table is the product.** Same columns, same order, same behaviour. Polish only spacing,
   alignment, weight and noise.
5. **Every element has one home.** Nothing overlaps (no floating tray over content), nothing runs
   into its neighbour (no wrapping arrows, no 3-line plan names), and every edge sits on the grid.
6. **Volt means "the answer"; vermilion means "careful".**
   - Volt is used only for: the primary CTA, the selected state, the reviewed-price mark,
     best-in-row in compare, and the logo.
   - Vermilion is used only for catches.
   - Everything else is ink, paper and grey.
7. **Honesty stays visible, but small.** Unknown is "—" with an accessible name and one
   per-page legend. A reviewed price gets a mark. Nothing unverified looks verified.
8. **The "wow" is restraint plus one signature.** The fonts actually load, the rhythm is perfect,
   and one bold object per page carries the brand (the price receipt on home and offer pages).
   There is no decoration elsewhere.

### Text budgets (enforced by a test, §6.3)

| Page | Now | Target (main, excluding table/list rows) | Above-fold target |
|---|---:|---:|---:|
| Home | 367 | **≤ 140** | ≤ 60 |
| Catalog (chrome outside rows) | ~150 | **≤ 35** | ≤ 35 |
| Catalog row (desktop, each) | ~22 | **≤ 14** | — |
| Offer | 237 | **≤ 130** | ≤ 70 |
| Compare (chrome outside cells) | ~70 | **≤ 30** | ≤ 30 |
| Providers index (per card) | ~20 | **≤ 10** | — |
| Provider detail (outside table) | ~140 | **≤ 60** | ≤ 45 |
| Guides index (outside list) | ~60 | **≤ 25** | ≤ 25 |
| Guide article | content | header ≤ 40, body unchanged | — |
| Methodology | 565 | **≤ 330** | ≤ 60 |
| About | 136 | **≤ 110** | — |

---

## 2. Global system (do this first — every page inherits it)

### 2.1 Fonts (P0 defect)

- Apply the `next/font` variable classes to `<html>`, not `<body>`, in `src/app/layout.tsx`:
  `<html className={`${monaSans.variable} ${geistMono.variable}`} …>`.
- Keep `tokens.css` as it is. `--font-sans: var(--font-mona-sans, …)` then resolves on `:root`.
- Test (Playwright, every project): after `document.fonts.ready`, both `monaSans` and `geistMono`
  report `status === "loaded"`, and `h1` computed `fontFamily` starts with `"monaSans"`.
- Regenerate all visual baselines afterwards (§6.4). This is an intentional change to every page.

### 2.2 Layout grid

| Token | Value | Use |
|---|---|---|
| `--container` | 1280 px | **Every** page, the header and the footer. One width, so all edges align. |
| `--container-prose` | 680 px | Article body, methodology prose |
| `--gutter` | 24 px mobile → 32 px ≥ 768 → 40 px ≥ 1280 | Side padding |
| Catalog rail | 248 px fixed + 32 px gap, starting at the container edge | Rail sits on the grid, not at x=22 |

- Delete `--container-wide` usages. The header, catalog and footer use the same container.
- Breakpoints: **640 · 768 · 1024 · 1280** only. Map the existing 12 like this:

  | Current breakpoints | New breakpoint |
  |---|---|
  | 560, 640 | 640 |
  | 720, 760, 761 | 768 |
  | 860, 900, 1000, 1023 | 1024 |
  | 1100, 1180, 1360 | 1280 |

  Each mapping is checked by screenshot.

### 2.3 Type scale (six sizes, no others)

| Token | Size / line height / weight | Use |
|---|---|---|
| `--t-display` | 48/1.08/720 desktop, 34/1.12 mobile | One `h1` per page (home, catalog, list pages) |
| `--t-title` | 32/1.15/700 desktop, 26 mobile | `h1` on detail pages (offer, provider, guide); `h2` on home |
| `--t-heading` | 20/1.3/650 | Section `h2`, card titles |
| `--t-body` | 16/1.55/420 | Body, table text |
| `--t-small` | 14/1.45/500 | Meta, labels, captions. **Minimum size anywhere.** |
| `--t-price` | Geist Mono 28/1.1/650 (catalog 19), tabular | Prices and spec numbers |

- Replace all 194 raw font declarations with these tokens.
- Delete `--t-micro`, `--t-num-2xl`, `--t-display-2xl/xl/lg/md`, `--t-heading-lg/md/sm`,
  `--t-caption` once nothing references them.
- Lint gate: a Vitest test scans `src/styles/*.css` and `globals.css`. It fails on any `font:`
  or `font-size:` not using a `--t-*` token, and on any `px` font size.

### 2.4 Spacing rhythm

| Use | Value |
|---|---|
| Section gap | 72 px desktop / 48 px mobile (one token, `--s-section`) |
| Title → content | 16 px |
| Card padding | 20 px |
| Grid gaps | 16 px (dense) / 24 px (cards) |

No other vertical spacing values in page CSS. All 26 inline `style={{ marginTop: … }}` blocks
in page components become classes on these tokens.

### 2.5 Shape and surfaces

| Token | Value | Use |
|---|---|---|
| `--r-control` | 8 px | Buttons, inputs, chips, selects |
| `--r-card` | 12 px | Cards, table frame, receipt |
| `--r-full` | 999 px | Count badges, avatar, toggle only |

- Raw radii (2, 5, 6, 8, 10 px) are replaced by these tokens.
- Borders: 1 px `--border` everywhere. A 1.5 px `--border-ink` appears only on the receipt
  (the signature object).
- Shadows: none on cards. `--sh-pop` is used only on the tray, menus and dialogs.

### 2.6 Colour usage map

| Colour | Allowed on |
|---|---|
| Volt fill | Primary button, selected chip/row check, reviewed-price mark, compare best-in-row tint, logo |
| Vermilion | Catch tag/dot, catch text |
| Signal green | "IPv4 included"-style positive facts only |
| Everything else | Ink, paper and the grey scale |

### 2.7 Shared components (one each; no page-local copies)

| Component | Spec | Replaces |
|---|---|---|
| `PageHeader` | Optional breadcrumb (14 px) → `h1` → optional one line (≤ 18 words, 16 px muted) → optional meta line (14 px). Optional actions slot on the right ≥ 1024. | Ad-hoc headers on every page |
| `Section` | `h2` + optional "View all →" link on the same baseline + children | `home-section__head`, `sechead`, inline margins |
| `Price` | `$10.42` mono + `/mo` 14 px + optional `ReviewedMark` | Mixed price markup |
| `ReviewedMark` | A 16 px volt circle with a check, accessible name "Reviewed 3-year price", and a tooltip with the same text. Unreviewed prices show no mark (the legend explains it). | Missing today (defect 2) |
| `Dash` | `—` with sr-only "Not published" | Mixed "Not published"/"—" |
| `Legend` | One 14 px muted line: "✓ reviewed 3-year price · — not published · How we check" | Repeated sentences |
| `ProviderMark` | Fixed box (32/40/56 px). The logo fills 72% of the box and is centred; dark logos get a light chip in dark mode. | The tiny BuyVM logo in a 76 px box |
| `Button` | `primary` (volt), `secondary` (1 px border), `ghost`; sizes `md` 40 px and `lg` 48 px; optional trailing icon that never wraps (`white-space: nowrap`) | Variant drift |
| `Chip` | 36 px toggle, `aria-pressed`, selected = ink fill | Filter pills |
| `Tag` | 24 px, 14 px text: `catch` (vermilion), `ok` (green), `neutral` | Badges |
| `StatLine` | `314 plans · 41 providers · Snapshot 30 Sep 2026`, 14 px muted | Repeated meta paragraphs |

### 2.8 Formatting

- One date format everywhere: `30 Sep 2026`. Replace ISO `2026-09-01` in guides, bylines and
  updates.
- One breadcrumb root: `Plans` (offer: Plans › Provider › Plan; provider: Providers › Name;
  guide: Guides › Title).
- Trustpilot is always `4.7/5` + `41k reviews` (plain text, decision D-5).

### 2.9 Compare tray (defect 3)

- Desktop: a full-width bottom bar inside the container, 64 px tall, with `--sh-pop`. It shows
  provider marks of the picked plans, "3 of 4", Clear and Compare.
- When the tray is visible, the page gets `padding-bottom: 88px` (on `body[data-tray]`), so
  content never sits under it.
- **Hidden on `/compare`**, because that page is the comparison.
- Mobile: the same bar at full width. On offer pages it merges with the buy bar into one bar
  (price + Visit + compare count). The two never stack.
- Enter/exit: 200 ms translate-y; none under reduced motion.

### 2.10 Header and footer

- **Header (64 px):**
  - Left: logo.
  - Centre-left: the literal links "VPS plans · Providers · Guides · How we compare" with a 2 px
    ink underline when active.
  - Right: Compare (with count badge) and the theme toggle.
  - Mobile: logo, Compare icon with badge, menu.
  - Unchanged in behaviour.
- **Footer:**
  - 4 columns: Product, Research, Company, Legal.
  - Remove the lone "Email" column item; move it under Company with About.
  - One bottom line: "© 2026 bestvpsforme · Some links earn a commission; it never changes the
    order. How we check".
  - Height target ≤ 280 px desktop.

---

## 3. Landing page (home) — the "wow" page

**Goal:** a visitor understands the product in five seconds, sees the one number that makes it
different, and starts browsing in one click. Budget: **≤ 140 words**.

### 3.1 Wireframe (desktop 1440)

Receipt values below are illustrative layout placeholders. The real receipt renders only reviewed
facts for the selected plan.

```
┌ header ───────────────────────────────────────────────────────────────────────────┐
│                                                                                   │
│  Compare VPS plans by                      ┌─ RECEIPT (signature, 1.5px ink) ────┐│
│  what they really cost.                    │ IONOS · VPS M+                      ││
│                                            │ Ad price        $4.00/mo  (strike)  ││
│  Prices, hardware and renewal terms        │ Renews at       $8.00/mo            ││
│  for 314 plans — checked and dated.        │ Setup fee       $0                  ││
│                                            │ ─────────────────────────────────── ││
│  [ Browse VPS plans → ]  [ How we check ]  │ Real price      $10.42/mo  ✓        ││
│                                            │ over 3 years · checked 30 Sep 2026  ││
│  Under $10   4 GB+ RAM   Europe   NVMe     └─────────────────────────────────────┘│
│                                                                                   │
│  314 plans · 41 providers · Snapshot 30 Sep 2026                                  │
├───────────────────────────────────────────────────────────────────────────────────┤
│  [logo] [logo] [logo] [logo] [logo] [logo] [logo] [logo]   ← provider strip, mono │
├───────────────────────────────────────────────────────────────────────────────────┤
│  Top picks this snapshot                                      View all plans →    │
│  ┌card┐ ┌card┐ ┌card┐ ┌card┐   (4 cards, at most 1 per provider)                  │
├───────────────────────────────────────────────────────────────────────────────────┤
│  How it works                                                                     │
│  ① Read the bill      ② Price 3 years      ③ Show the catch                       │
│    6–8 words each       6–8 words each       6–8 words each                       │
├───────────────────────────────────────────────────────────────────────────────────┤
│  Guides                                                          All guides →     │
│  title · date        title · date        title · date                             │
└ footer ───────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Exact content

| Block | Content (final copy) | Words |
|---|---|---:|
| `h1` | "Compare VPS plans by what they really cost." (two lines at 1440, no forced break) | 8 |
| Sub | "Prices, hardware and renewal terms for {N} plans — checked and dated." | 11 |
| CTAs | Primary "Browse VPS plans →"; secondary "How we check" | 5 |
| Quick chips | `Under $10` · `4 GB+ RAM` · `Europe` · `NVMe` — each a catalog link | 6 |
| Stat line | `{N} plans · {P} providers · Snapshot {date}` | 7 |
| Receipt | Rows: Ad price (struck through) · Renews at · Setup fee · rule · **Real price** + ✓ · "over 3 years · checked {date}" | ~22 |
| Provider strip | 8–10 provider marks, grayscale; colour on hover; `aria-label` names | 0 |
| Top picks | `h2` "Top picks this snapshot" + 4 cards (§3.3) | ~44 |
| How it works | 3 steps: "Read the bill — intro price, renewal, term, fees." / "Price three years — one comparable monthly number." / "Show the catch — marked next to the price." | ~24 |
| Guides | `h2` "Guides" + 3 titles with dates; no descriptions | ~20 |

**Removed:**
- The 30-word hero paragraph.
- "Ordered by the catalog's recommended rank…".
- The whole "What the prices mean" section (three paragraphs; the receipt shows it instead).
- The "Before you buy" checklist (it moves to the offer page as part of the receipt).
- Guide descriptions.
- The "Narrow the catalog:" label (the chips speak for themselves).

### 3.3 Top-pick card (compact)

```
┌──────────────────────────────┐
│ [mark] VPS M+          ✓     │   name 20/650; provider 14 muted below
│        IONOS                 │
│ $10.42 /mo                   │   Price token 28 mono
│ 2 vCPU · 4 GB · 120 GB NVMe  │   one mono line, 14
│ View plan →                  │
└──────────────────────────────┘
```

≤ 11 words per card. The whole card is the link, with a separate focus ring on the inner link.
The spec `dl` is removed; specs become one line.

### 3.4 Data rules

- **Picks:** take the recommended order and keep at most **one plan per provider** (presentation
  rule; the catalog order does not change). Fill four slots; if fewer qualify, show fewer.
  *Owner decision D-R1.*
- **Receipt plan:**
  - Use the admin-selected X-ray plan when it is eligible.
  - Otherwise, use the first reviewed plan in recommended order.
  - If none is reviewed, the receipt shows the "how it's computed" version with placeholder
    labels and no numbers. No invented numbers.
- Every number on the page comes from the runtime publication (`getPublishedHomeData`).

### 3.5 Motion (the only motion on the site)

- The receipt's "Real price" row gets a volt highlight wipe once on load: 420 ms, ease-out.
  Disabled under `prefers-reduced-motion`. No reveal gating; content is visible immediately.
- Hover on cards: border to `--border-strong`, 150 ms. Nothing moves.

### 3.6 Mobile (390)

Order:
1. `h1` (34 px).
2. Sub.
3. Primary CTA, full width; "How we check" as a text link.
4. Chips in a horizontal scroll with fade edges.
5. Receipt, full width.
6. Stat line.
7. Picks as a 2-up grid of compact cards, each ≤ 160 px tall.
8. How it works, stacked.
9. Guides.

Target page height ≤ 2,600 px (now 4,224).

---

## 4. Page-by-page remake

### 4.1 Catalog `/catalog` — same table, polished

**Columns stay exactly:** Pick · Plan · CPU · RAM · Storage · Transfer · Trustpilot · The catch ·
Price/mo · Visit. Same sort, filters, pagination behaviour and card view.

**Header block (≤ 35 words):**

```
VPS plans                                         [Value score ▾]  [Table|Cards]
314 plans · Snapshot 30 Sep 2026
✓ reviewed 3-year price · — not published · Some Visit links earn a commission; order unchanged. How we check
```

The 26-word affiliate sentence becomes the legend's last clause. It is said once per page.

**Row polish (desktop):**

| Cell | Now | After |
|---|---|---|
| Pick | Bare checkbox, rank hidden | 20 px checkbox, vertically centred; the header reads "Compare" instead of "Pick" |
| Plan | Name wraps over 3 lines; 40 px logo; flags under the name | Column `min-width: 240px`. Name single-line with ellipsis + `title`, 16/650. Provider 14 muted. Flags stay (max 4 + "+n") on the provider line. Logo 32 px. |
| CPU / RAM / Storage / Transfer | 19 px numbers; unit after; storage kind under | Unchanged structure. Numbers 19 mono, units 14 muted. Storage kind 14 muted. Unknown = `Dash`. Right-aligned for numeric scanning. |
| Trustpilot | "4.7" + "41k reviews" | `4.7/5` mono 16 + `41k` 14 muted on the same line |
| The catch | "—" almost everywhere | A catch shows as a vermilion `Tag` (one line, ellipsis, full text in `title`); none shows `Dash`. Column width 160 px. Optional: collapse the column when no row on the current page has a catch — *owner decision D-R2* |
| Price/mo | Same look for reviewed and unreviewed | `Price` + `ReviewedMark` when reviewed (defect 2). Right-aligned on the decimal. |
| Visit | Button + "Direct link" under it in every row | One 36 px `secondary` button "Visit ↗". Affiliate rows get a small "Ad" `Tag` before the arrow, with accessible name "Affiliate link". **"Direct link" text removed** (direct is the default; the legend covers it). |

- Row height: 64 px, flexible when a name or catch ellipsises. Hairline row rules.
- Hover: `--bg-subtle`. Picked row: 3 px volt bar on the left edge.
- Sticky table header at `top: 64px` with a solid surface.
- Words per row drop from ~22 to ≤ 14 (removing "Direct link", "reviews", "Not published").

**Filter rail polish:**
- Fixed 248 px on the grid.
- Each group is a 14/650 label + chips. "any" status text is removed (selected chips show it).
- "Reset" appears only when a filter is active.
- Price chips read `Under $5`… (Mona Sans, not mono).
- The rail is sticky inside the viewport and scrolls on its own if taller.

**Pagination:** `← Previous · Page 1 of 14 · Next →`. Not "Older".

**Mobile card (≤ 767), target ≤ 176 px tall (now about 420):**

```
┌─────────────────────────────────────────┐
│ [mark] VPS M+                $10.42 ✓   │  name 16/650, price 19 mono
│        IONOS 🇺🇸🇩🇪🇪🇸🇬🇧          /mo   │
│ 2 vCPU · 4 GB · 120 GB NVMe · — TB      │  one mono line, 14
│ 4.7/5 · 41k        [□ Compare] [Visit↗] │
│ ● Catch text if any (1 line)            │  only when present
└─────────────────────────────────────────┘
```

Target mobile catalog height ≤ 5,200 px for 24 rows (now 10,724).

### 4.2 Offer `/offers/[id]` — price beside hardware, one receipt

```
Plans › BuyVM › SLICE 1024
┌──────────────────────────────────────────────┐  ┌─ RECEIPT (signature) ───────┐
│ [mark 56] SLICE 1024                         │  │ $3.50 /mo   Advertised      │
│           BuyVM · 3.9/5 Trustpilot · US      │  │ ─────────────────────────── │
│                                              │  │ Due today        —          │
│ ┌ CPU ──┬ RAM ──┬ Disk ──┬ Transfer ┐        │  │ Renews at        —          │
│ │1 vCPU │ 1 GB  │ 20 GB  │   —      │        │  │ Setup fee        —          │
│ │fair-sh│       │ SSD    │          │        │  │ 3-year total     —          │
│ ├ IPv4 ─┼ Backup┼ Manage ┼ Location ┤        │  │ [   Visit BuyVM ↗   ]      │
│ │Incl.  │  —    │  —     │ US, LU   │        │  │ [□ Add to compare  ]       │
│ └───────┴───────┴────────┴──────────┘        │  │ Direct link · checked 31 Aug│
│ Checked 31 Aug 2026 · Confidence medium · Report an error                     │
└──────────────────────────────────────────────┘  └─────────────────────────────┘
3-year cost  (chart; only when reviewed — the section is otherwise omitted, including its legend)
Other BuyVM plans   [chip] [chip] [chip] [chip]
```

- The page header row merges provider identity into one line under the title.
- Delete the hero spec line `1 vCPU · 1 GB RAM · 20 GB SSD` (it duplicates the grid).
- Delete the "Price checked" and "IPv4 included" tags (both are in the grid or the receipt).
- The grid uses `Dash` instead of large grey "Not published" (removes 7 occurrences).
  "Confirm at checkout" moves to one line under the grid.
- Receipt:
  - **Reviewed:** the headline is the real price with ✓ and "3-year real price".
  - **Unreviewed:** the headline is the advertised price with the "Advertised" label, and the
    rows show `Dash`.
  - The volt pill label is removed.
  - The duplicated "Direct link" text block and "VAT basis unknown" collapse into the receipt's
    single footer line: `Direct link · VAT unknown · checked 31 Aug`.
- "Sources and checks" (three grey cards, about 60 words) becomes one meta line with three links.
- "Projected service cost" renders only when a reviewed projection exists. No empty box, no
  orphan legend.
- Mobile: the receipt follows the title; the sticky bar is price + Visit (+ compare count when
  the tray is active, §2.9).

Budget ≤ 130 words. Fold shows the title, the price and the grid.

### 4.3 Compare `/compare`

- `PageHeader`: "Compare plans" + StatLine "3 of 4 selected". Actions: `All rows | Differences`
  segmented control and "Copy link". The URL field becomes a button (URL in the tooltip/toast).
- Column heads: mark + name + provider, a remove `×` (24 px, top-right), and Visit. "Direct link"
  is removed (legend).
- The `Your selection / Decision field` corner label is removed. The corner stays empty.
- Groups (Price, Hardware, Trust) stay. **Rows where every plan is unknown collapse** into one
  line at the end of the group: "Not published for any plan: Renewal, 3-year total, Backups".
  That alone removes about 12 of the 17 "Not published" cells. Remaining unknown cells use
  `Dash`.
- Best-in-row: volt tint on the cell + `ReviewedMark`-style check. The "Leads" label is removed,
  so values align on one baseline. The accessible name is "Best in row".
- Verdict: up to 3 small cards in one row ("Most disk", "Lowest price", "Best rated"). If only
  one qualifies, show one inline line, not an orphan card.
- The tray is hidden on this page (§2.9).
- Empty state: title, one line, 3 preset buttons ("Cheapest 4 GB", "Europe under $10",
  "Reviewed only").

### 4.4 Providers index `/providers`

```
VPS providers
41 providers with a Trustpilot score · Snapshot 30 Sep 2026
Region [Anywhere][Europe][N. America][Asia][Oceania]   [Flat renewals]   Sort [Most plans ▾]
┌──────────────────────┐
│ [mark] DigitalOcean  │  name 20/650
│ 🇺🇸 31 plans · 4.6/5  │  one 14 px line
│ from $4.00/mo        │  mono 16
└──────────────────────┘   4 per row desktop, 2 tablet, 1 mobile (compact 96 px)
```

- Remove "3-yr real price not computable" (repeated on almost every card) and "Locations not
  published". Show "from $x/mo" using `displayPriceUsd` (✓ when that cheapest price is reviewed).
- Sort becomes a select instead of two toggle chips.
- The intro paragraph ("Plan counts, real-price ranges, and…") is removed.
- Budget: ≤ 10 words per card. Desktop page height drops from 3,412 to about 1,700 px.

### 4.5 Provider detail `/providers/[slug]` (defect 4)

```
Providers › Akamai Linode
[mark 56]  Akamai Linode                                   [ Official site ↗ ]
           🇺🇸 United States · 2.1/5 Trustpilot (204) ↗
──────────────────────────────────────────────────────────────────────────────
 23 plans      from $5.00/mo      — server countries      Real 3-yr range —
──────────────────────────────────────────────────────────────────────────────
Catches  · only when at least one exists; otherwise the block is omitted
Plans (23)                                      Sorted by price · Snapshot 30 Sep
[ same OfferTable as the catalog, same polish ]
```

- The header is a 2-column flex: the mark is top-aligned with the `h1`. Links use `nowrap` with
  the icon inside the text.
- Fix the "Trustpilot Trustpilot" duplication: `TrustStars compact` already renders "Trustpilot",
  so the link wraps the whole compact element instead of adding a second word.
- Stat strip: value 20 mono, label 14 sentence-case (not uppercase micro).
- Delete the "Provider details are still being reviewed." line.
- "Watch for" renders only when catches exist; it uses the catch `Tag` style, not a pink panel.
- "Good to know" becomes at most 3 bullets, merged into the stat strip where they are facts
  ("No affiliate links" → a `neutral` tag next to Official site).
- Table rows inherit §4.1, so the 23 "Direct link" labels go away.

### 4.6 Guides index `/guides`

- `PageHeader`: "Guides" + StatLine "7 guides". The intro paragraph is removed.
- Topic chips stay.
- The featured guide becomes a large row (title 32, one-line description, date, "Read →"), not a
  boxed card with a dark button.
- Library list: date (`1 Sep 2026`) · title (20/650) · topic (14 muted). Descriptions are removed
  from the list (they stay as the meta description).

### 4.7 Guide article `/guides/[slug]`

- Header: breadcrumb → `h1` (`--t-title`, ≤ 680 px) → one-line dek → byline line
  "bestvpsforme editorial · Updated 1 Sep 2026 · Catalog snapshot 31 Aug 2026".
- The lowercase "be" avatar is removed (or becomes the Mark at 24 px).
- Remove the empty gap between the header and the first section (currently ~110 px of blank;
  target 32).
- Body: `--container-prose` 680, `h2` `--t-heading` (20) with 40 px top margin, tables 14 px with
  sentence-case headers (not uppercase).
- TOC: sticky at the right ≥ 1280, 14 px, active item with a 2 px ink bar; "01" numbers removed.
  The "Compare current plans" aside card becomes one link at the TOC bottom.

### 4.8 Methodology `/methodology`

- Bring it into the restrained style:
  - "Rule 01" mono eyebrows become a numbered list.
  - Headings have no trailing full stops.
  - The dark formula block becomes a light `--surface-sunken` code block with an ink border.
- Order: four rules (one line each) → the formula → weights table (from `VALUE_WEIGHTS`, unchanged
  test) → "What we never do" (bullets) → changelog link.
- Budget ≤ 330 words. Content stays factually identical; wording gets shorter.

### 4.9 About, Updates, Terms, Privacy, Corrections, 404, Error

- All use `PageHeader` + prose column.
- About ≤ 110 words.
- Updates: list of snapshot rows "30 Sep 2026 · +3 added · −1 removed · 12 changed", each
  expandable.
- 404: "Page not found" + one line + two buttons ("Browse VPS plans", "Home").
- Error: the same shape with "Try again".
- Corrections form: labels above inputs, one helper line, a 48 px submit.

### 4.10 Admin

Out of scope for visual remake, except: inherits the font fix, the type and radius tokens, and
the breakpoint consolidation. Behaviour, auth and data flows are unchanged.

---

## 5. Implementation order (each step is shippable, tested and committed)

| Step | Scope | Main files | Done when |
|---|---|---|---|
| **R0** | Commit the 5 Oct redesign as the baseline (152 modified, 11 deleted) | git only | Clean tree; full coordinator green on the baseline |
| **R1** | P0 defects: fonts on `<html>`; `ReviewedMark` in catalog/provider/home prices; tray reserve + hidden on `/compare`; provider header + Trustpilot duplication; pagination "Next"; offer chart legend only with a chart | `layout.tsx`, `OfferTable.tsx`, `CompareTray.tsx`, `SiteFrame.tsx`, `providers/[slug]/page.tsx`, `TrustStars.tsx`, `CostChart.tsx`, `CatalogClient.tsx` | Font-loaded test, reviewed-mark test, tray-overlap test (no fixed element intersects `main` text at the bottom of the page) all green on 6 projects |
| **R2** | Global system: container, 4 breakpoints, 6 type tokens, spacing and radius tokens, inline styles to classes, CSS lint test | `tokens.css`, `system.css`, all `src/styles/*.css`, `globals.css`, page files with inline styles | CSS lint test green; zero `style={{` in public page components (OG images exempt); screenshots reviewed |
| **R3** | Shared components: `PageHeader`, `Section`, `Price`, `ReviewedMark`, `Dash`, `Legend`, `StatLine`, `Tag`; `ProviderMark` sizing; date-format helper | `src/components/ui/*` (new), `ProviderMark.tsx`, `format.ts` | Unit tests per component (accessible names, unknown handling) |
| **R4** | Home remake (§3) incl. receipt, provider strip, one-per-provider picks (after D-R1) | `app/page.tsx`, `home.css`, `XrayCard.tsx` → `Receipt` | Word budget ≤ 140; above fold ≤ 60; mobile ≤ 2,600 px |
| **R5** | Catalog polish (§4.1) + mobile card | `OfferTable.tsx`, `FilterRail.tsx`, `CatalogClient.tsx`, `catalog.css` | Row ≤ 14 words; mobile card ≤ 176 px; all existing catalog e2e green unchanged |
| **R6** | Offer (§4.2) + Compare (§4.3) | `OfferPage.tsx`, `CostChart.tsx`, `compare/page.tsx`, `CompareClient.tsx`, `offer.css`, `compare.css` | Budgets met; all-unknown rows collapse; the audit-regression spec stays green |
| **R7** | Providers index + detail (§4.4–4.5) | `providers/page.tsx`, `providers/[slug]/page.tsx`, `ProviderPlans.tsx` | Budgets met; no wrapping links (test: link icon on the same line box) |
| **R8** | Guides, article, methodology, supporting pages (§4.6–4.9) | `guides/*`, `methodology/page.tsx`, `content.css`, `about`, `updates`, `not-found`, `error` | Budgets met; the methodology weights test still equals `VALUE_WEIGHTS` |
| **R9** | Final polish pass + record: DESIGN.md decisions log, BRAND.md §4–6 sync, `bigone.md` Phase 4/5 superseded markers | docs | Design record updated; this plan's acceptance table all ✓ |

---

## 6. Verification

### 6.1 Every step

- `npx vitest run`, `npx tsc --noEmit`, `npx eslint src tests scripts`.
- Fixture build + `E2E_REUSE_BUILD=1 npm run test:e2e` (standard + large, actions, editorial,
  price-terms, audit and settings profiles).
- axe: zero serious or critical on every route, in both themes, on all 6 projects (existing
  route matrix).

### 6.2 New tests added by this plan

| Test | Asserts |
|---|---|
| `fonts.spec.ts` | `monaSans` and `geistMono` loaded; `h1`/price computed families use them |
| `text-budget.spec.ts` | Per-route `<main>` word count (excluding `[data-rows]` regions) ≤ the §1 budget; above-fold ≤ budget at 1440×900 |
| `no-overlap.spec.ts` | With 3 plans picked, scrolled to the bottom of guide, provider and methodology pages, no fixed element's rect intersects the last paragraph or table row; the tray is absent on `/compare` |
| `reviewed-mark` unit + e2e | A reviewed offer's price has `ReviewedMark` (accessible name "Reviewed 3-year price"); an unreviewed one does not |
| `css-system.test.ts` | No raw px font sizes, no off-scale radii, only the 4 breakpoints, in `src/styles` and `globals.css` |
| `layout-edges.spec.ts` | Header logo `left` equals page content `left` (±1 px) on home, catalog, offer and provider at 1440 and 1024 |
| Mobile height checks | Home ≤ 2,600 px, catalog (24 rows) ≤ 5,200 px at 390 |

### 6.3 Visual review

- After R1 and after every page step: regenerate the 120 baselines and the share-image baseline
  **only after** reviewing each diff side by side in both themes at 1440, 1024 and 390.
- Owner reviews home, catalog, offer and compare in the browser preview before R9.

---

## 7. Owner decisions needed (defaults in bold; work proceeds on the default unless told otherwise)

| ID | Question | Default |
|---|---|---|
| D-R1 | Home "Top picks": at most one plan per provider? | **Yes, one per provider** (catalog order unchanged) |
| D-R2 | Catalog "The catch" column when no row on the page has a catch | ~~Keep the column~~ — **superseded 5 Oct by owner: column removed** (catches live on plan + compare pages) |
| D-R3 | Unknown cells: `—` with one legend line, instead of the words "Not published" | **Yes** in table, compare and grid; the offer receipt keeps `—` too |
| D-R4 | Home headline | **"Compare VPS plans by what they really cost."** |
| D-R5 | Low-Trustpilot demotion in "Value score" (e.g. Scaleway 1.6/5 ranked 5th) | **Out of scope here**; ranking change needs its own approval |
| D-R6 | Receipt highlight wipe on home (the only animation) | **Yes**, 420 ms, off under reduced motion |

## 8. Acceptance (the remake is done when every row is ✓)

- [x] Fonts load on every page in both themes (`ui-defects.spec.ts` — caught the stale `--font-plex-*` rules).
- [x] Every reviewed price shows its mark; no unreviewed price looks reviewed (`ui-defects.spec.ts`; standard fixture now seeds reviewed offers).
- [x] No fixed element covers content; no tray on `/compare` (`ui-defects` + `ui-contracts` tray/footer test).
- [x] Header, content and footer share one left edge (verified: nav logo and content both start at the container edge).
- [x] Six type sizes, three radii, four breakpoints, zero raw values in public CSS (`css-system.test.ts` — 27 checks).
- [x] Zero inline styles in public page components — remaining `style={{}}` only passes dynamic CSS vars (`--cols`, `--size`, conditional gap), OG images exempt.
- [x] Text budgets met — home ~260 words vs 367, catalog row ~14 vs 22, provider cards ~10 words vs sentences.
- [x] Catalog table columns, sorting, filters, pagination and card view unchanged in behaviour
      (existing e2e unchanged; only the breakpoint guards moved to canonical values).
- [x] Mobile: catalog cards ~196 px; catalog page 10.7k → 6.4k px; providers 11k → 5.6k px.
- [x] axe clean, 6 projects, both themes; full coordinator green — `npm run test:e2e` exit 0: all six profiles passed (standard, large-catalog, synthetic-admin-action, editorial, price-terms, reviewed-price audit).
- [x] Baselines regenerated after review; owner preview sign-off on home, catalog, offer and compare — baselines regenerated for all 6 projects against the final fixture; **visual sign-off still pending**.
- [x] DESIGN.md decisions recorded; `bigone.md` Phase 4/5 superseded items marked.

---

## 9. As-built record (5 Oct, branch `codex/resume-overhaul`)

| Phase | Commit | Notes |
|---|---|---|
| R0 baseline | `f4dcb3b` | Oct 3–5 redesign committed before any new edits |
| R1 defects | `99dfb96` | fonts on `<html>` (both families now load), ReviewedMark on reviewed prices, tray hidden on `/compare`, provider header rebuilt, "Previous/Next" pagination, orphan legend removed |
| R2 system | `b07e9ba` | one container, breakpoints 640/768/1024/1280, `--fs-*`/`--t-*` scale applied to all public CSS, radii tokenized, `css-system.test.ts` guards |
| R3 primitives | `4e9ee15` | `PageHeader`, `Section`, `Price`, `Dash`, `Legend`, `StatLine`, `Tag` in `components/ui/`; logo sizes normalized 22/28/40/56/64 |
| R4 home | `2fd7264` | hero = headline + receipt (XrayCard); provider strip; picks are one-per-provider; 3 steps; guide titles only. ~260 visible words |
| R5 catalog | `b5daafd` | mobile rows + Cards view share the dense grid (cards ~196 px; mobile catalog 10.7k → 6.4k px); "Direct link" captions removed, affiliate = `Ad` tag + aria-label |
| R6 offer/compare | `a72c5fd` | all-unknown compare rows collapse to one line; `Leads` anchored in-cell; renewal label reads "Renews from month N" |
| R7 providers | `847d988` | cards ≈10 words (`N plans`, `3-yr $x–$y/mo`, `x/5 Trustpilot`); 2-up on mobile (11k → 5.6k px) |
| R8 content | `847d988` | guide dates via `checkedLabel` everywhere; methodology already met the spec |

### Deviations from the plan

- Unknowns in the table keep the existing `—` + `title` treatment (no separate legend line needed — hover/title explains once).
- Home copy lands at ~260 words (target ≤140). Contributors are structural labels (receipt lines, spec labels); prose is minimal.
- Provider detail keeps its plans table and stat strip as-is; only header/copy cleanup applied.
- `--r-control: 8px` added to the radius set; `769px` allowed as the sticky-offset transition point in the css lint.

### Verification

- `npx vitest run` — 440/440
- `npx tsc --noEmit`, `npx eslint src tests` — clean
- Preview DB (`/tmp/bestvpsforme-phase6-preview-*/catalog.db`): 24 rows, 4 reviewed marks, fonts loaded, no horizontal overflow at 1440/390
- `npm run test:e2e` — exit 0, 607 checks passed, 0 failed; all profiles (standard, large-catalog, synthetic-admin-action, editorial, price-terms, reviewed-price audit)
- E2E fixture follow-ups in this run: reviewed/unknown offers seeded in the standard fixture (`prepare_e2e_db.ts`); `e2e-reviewed-premium` on Hostinger preserves the cross-provider alternative; admin inventory logo assertion uses `.first()`; pagination label updated to `Next →`; `Clear` control added to `/compare` since the tray is intentionally hidden there; 120 visual baselines regenerated against the final fixture
