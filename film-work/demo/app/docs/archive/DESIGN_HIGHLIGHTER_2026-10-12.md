# DESIGN.md

## Product
bestvpsforme.com — plain-language VPS comparison built from reviewed offer evidence.

## Scene
Highlighter, restrained for comparison work: white paper, near-black ink, a small volt accent for selections and primary actions, vermilion for caveats. The owner's 3 October 2026 redesign request supersedes the oversized promotional mockups. The visual system retains [brand/BRAND.md](brand/BRAND.md) colors and local fonts, but prioritizes readable content and ordinary browsing controls.

## Theme
Light by default. Dark is a first-class twin with the same hierarchy. Components use semantic tokens rather than hard-coded colors.

## Color strategy
Ink and paper dominate. Volt is a fill behind ink text on paper, with an ink boundary where needed; never volt text on white. Vermilion shapes and icons accompany caveat words. Catch text uses the accessible light/dark vermilion text tokens. Color never carries meaning alone.

## Typography
Mona Sans carries UI, body and headings at normal width. Geist Mono carries aligned prices and specifications. Page titles use a restrained responsive scale, with no forced line breaks, word-by-word highlights or oversized display numbers. Body text is 16 px with a comfortable line height; supporting table text remains at least 14 px.

## Shape
Controls use restrained rounding and clear borders. Content groups use spacing and row dividers instead of nested cards. No tilted stickers, giant background wordmarks or repeated promotional panels.

## Density
The homepage explains VPS comparison and offers a direct path to published plans in its first viewport. Catalog rows group identity, cost and hardware; desktop filters stay in a left rail and narrow screens use a labeled filter drawer. Offer pages put the price beside the hardware rather than leaving an empty hero. Articles use a readable prose column with a compact header. Admin tables and forms keep clear labels and room for evidence.

## Motion
Brief state feedback only, with visible keyboard focus and reduced-motion support. Content is visible immediately; no scroll-reveal opacity gates, animated highlighter swipes or decorative page morphs.

## Signature
The highlighted choice, visible catch, dated evidence and money-blind ordering. An unreviewed price or fact stays unknown; visual emphasis never makes an unsupported claim. Each offer keeps a canonical page. Accessibility, integrity, data and route rules remain binding in [the product contract](docs/product/PRODUCT_CONTRACT.md).

## Navigation and content decisions
- 2026-10-09 — Below 640px, the header wordmark may shrink within its available width; navigation controls retain 44px targets. The comparison count sits on its button as a badge so selections do not widen the header at 320px.
- 2026-10-09 — Narrow catalog cards retain four specification columns, while rating, Compare and Visit use their natural widths and may wrap when they cannot fit. This is an exception to the fixed three-row mobile card at the smallest widths: usable controls take priority over a fixed row count.
- 2026-10-06 — Home board heading reads "Ranked by value score" (voice rule §9: no "best"); rendered-copy voice spec covers public routes.
- 2026-10-03 — Owner-requested search removal: no public global search, command palette, catalog search box or keyboard-search shortcut. Browse through plan filters, provider inventories and guide topics. Admin command search is removed; essential record-management filters remain explicit.
- 2026-10-03 — Navigation uses literal destinations: VPS plans, Providers, Guides and How we compare, with one Compare action showing the current selection count.
- 2026-10-03 — Titles name the page or task. Remove slogans such as “the price the ad doesn't show”, “nothing here is a secret” and “plans fit”; keep dated facts and explicit unknown values.
- 2026-10-03 — Compact shared footer, no giant wordmark. Affiliate disclosure stays next to outbound actions; no unsupported trust or coverage claims.
- 2026-10-03 — Light/dark parity, keyboard operation, mobile reflow and read-only owner gates remain required. Redesign changes presentation, not pricing, ranking, authentication or publication.
- 2026-10-03 — Admin navigation links target the named view through `/admin?view=…`; console view changes retain that destination on reload. Sidebar surfaces follow the current theme rather than inverting it.
- 2026-10-04 — Fixed comparison and mobile purchase bars reserve clearance at the end of the footer, not between the offer and footer. The disclosure link remains clickable with either bar or both bars present.
- 2026-10-04 — Filter sheets use the shared overlay stacking token. Footer disclosure links retain a minimum 32 px target; admin sidebar supporting text uses the solid muted-text token rather than an alpha mix.
- 2026-10-04 — Social cards describe published inventory without promising verified costs for unreviewed plans. Counts and snapshot dates come from the runtime publication; the date label says “Snapshot”, not “Checked”. Unavailable catalog data remains unknown.
- 2026-10-05 — Owner-requested catalog simplification restores separate CPU, RAM, storage and transfer columns with prominent numeric values. Catalog and provider inventories show one monthly price per row, without an advertised-price strike-through or billing paragraph underneath. Reviewed-price selection is unchanged; full billing terms and evidence remain on the plan page.
- 2026-10-05 — Minimal-remake execution (plan: `docs/progress/minimal-remake-plan-2026-10-05.md`). Four canonical breakpoints — 640/768/1024/1280 — written as `width < Npx` / `min-width: Npx` (breakpoints are the smallest width of the next tier; e2e guards match). Six text-size tokens (`--t-display/title/heading/body/small` + `--t-num*`), three radii, one container edge for header/content/footer. Guarded by `src/styles/css-system.test.ts`.
- 2026-10-05 — Reviewed mark is the small volt ✓ (`ReviewedMark`, `aria-label="Reviewed 3-year price"`) shown only where `realMonthly` exists — catalog rows, home picks, offer hero, provider stats. Unreviewed prices render identical layout without the mark; the distinction is presence, not color alone.
- 2026-10-05 — The comparison tray never renders on `/compare` (redundant with the table). Footer disclosure stays clickable under tray and mobile buy bars.
- 2026-10-05 — Owner review on real data: the catalog table has no catch column (desktop, Cards view and mobile card). Catches stay on the plan page only (compare row removed 2026-10-06). Supersedes plan decision D-R2 ("keep the column").
- 2026-10-05 — Catalog Trustpilot cell is one line: star + score; review count lives in the `title` and screen-reader text. Mobile/Cards card is three rows — plan + price, four specs, then rating · Compare · Visit — with a hairline above the action row.
- 2026-10-06 — Home uses the same surfaces as every other page (no ink band, glow, grid texture, 3D tilt, stickers, stats band or closing CTA band — owner called them AI slop and off-system). Structure: meta line, `--fs-hero` headline with the solid volt `.hl` on "really cost.", a RAM/budget finder built from the shared `.select` + volt button (GET `/catalog?ram=&price=`), and a "Ranked by value score" board in catalog row language (first row = picked-row volt bar). Then provider marquee, numbered steps on a hairline, guide cards. Supersedes the 2026-10-05 home entries.
- 2026-10-06 — Catalog page size is a URL fact: `per=24|48|96` (`CatalogQuery.perPage`, default 24 omitted). Pager = "Show 24·48·96" segmented control, mono range "1–24 of 314", Previous / numbered window (1 … 4 5 6 … 14) / Next; numbers hide under 640px.
- 2026-10-06 — Cards view card: name (2-line clamp) → large mono price → four labelled spec cells on a hairline → rating · Compare · Visit on a hairline. No disk-type sub-line in cards.
- 2026-10-06 — Favicon: ink tile in every color scheme (no dark-mode white flip) with a 14% white inner hairline; `favicon.ico` 16/32/48; `apple-icon.png` and `maskable-512.png` are full-bleed ink squares with the glyph inside the safe zone.
- 2026-10-06 — Reading pages (guide article, methodology) share one layout: sticky left "On this page" rail ≥1280px, a single 720px column, `--fs-read` (18px) body. Guide end = one CTA box + one note line (published date, snapshot, commission, corrections) + related guide cards; no right sidebar, no repeated disclosure headings. Methodology h1 matches the nav: "How we compare"; rules are check cards, "never" is an ✕ list.
- 2026-10-06 — Compare: rows unknown for every selected plan collapse into one "Not published" line per section listing their labels; "Leads" marks only a single winner (ties carry the class, no label); no catch row (catches live on the plan page).
- 2026-10-06 — Updates timeline: human dates, status chip (Active / Replaced / Rolled back), import labels shown as "Catalog import" (no internal file names), counts as a mono line. Provider stat strip hides stats it can't fill instead of showing dashes.
- 2026-10-05 — Header is opaque `--bg` (no translucency — content never shows through). Links default to a 1px underline at `.2em` offset; CSS uses `text-decoration-line` so component rules never fall back to the font's heavy metric underline.
- 2026-10-05 — Provider cards: plan count + "from $X/mo" (advertised floor; "Free tier" when it is $0) unless a reviewed 3-yr range exists; star rating row; HQ line hidden when unknown.
- 2026-10-05 — Plan page: the top affiliate banner renders only for affiliate plans (direct plans state "Direct link" once in the receipt). Unknown hardware cells show `—` plus the checkout note; the receipt keeps "Not published" lines as the honesty record.
- 2026-10-05 — Brand fonts are binding: `next/font` variables live on `<html>` so `:root` tokens resolve; `--font-sans`/`--font-mono` are the only stacks. Stale rules referencing removed families (e.g. `--font-plex-*`) are defects — the ui-defects spec asserts loaded faces.

- 2026-10-07 — Special offers use the existing hairline rows, shared provider marks and type tokens. Show the advertised period total before the monthly equivalent and link dated provider evidence. No countdown without a verified provider deadline. Home shows one promotion per provider; the full list lives at `/special-offers`. Stale, mismatched, unpublished and sold-out entries disappear from the promotional list.

10 October 2026: at narrow widths, provider-card contents and admin status/action groups wrap within their containers. Selected catalog rows use the existing muted text color for Ad disclosures to retain AA contrast in dark mode. Native correction fields reserve sticky-header scroll clearance. These changes preserve all text, data, tokens and primary control sizes.

10 October 2026, narrow catalog follow-up: mobile price cells keep the full amount, monthly unit and reviewed mark at their natural width. If the plan and price do not fit beside each other, the price wraps to its own line. The four hardware specifications always start together on the next row, followed by the rating and actions. This replaces the fixed one-third price width that clipped the reviewed mark at 320px.

12 October 2026: catalog Visit buttons switch text and background together on hover/focus; only the border transitions. Independent color interpolation briefly produced low-contrast text in dark-mode keyboard browsing.
