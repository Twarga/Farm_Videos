# bestvpsforme: remake on the company system, monetization, scope

> Superseded discussion draft. Read [the current roadmap](ROADMAP_START_HERE.md) and [researched strategy](PRODUCT_STRATEGY_AND_RESEARCH_2026-10-23.md). This draft incorrectly mandates the older v5 logo, treats all editorial holds as launch blockers, and overstates animation-budget/theme conclusions.

Status: proposal for discussion. No code changed. Decisions are marked **D**.

## 1. What stays (layout and behaviour)

Keep the information architecture and the integrity rules:
- Home decision door, catalog (table + cards), offer page, compare, providers, guides, methodology, updates, corrections, admin.
- Ranking by published facts only. Commission never enters the score. Unknown stays unknown. Reviewed ✓ only where a 3-year price exists.
- Stack can change if it buys real motion. Current: Next 16 + React 19 + Drizzle/SQLite. Motion stays live (scroll, state, mascot), not static.

## 2. What changes (visual layer, to the company system)

| Element | Now (Highlighter) | Target (company system) |
|---|---|---|
| Logo | bestvpsforme wordmark, volt "iorme" box | v5 "First light" family: night tile, chalk horizon, own product mark above the horizon |
| Mascot | none | Hermit Crab (`design_system/brand/characters/v2/lore.js`, `bvp`), "The Shell Shopper" film already rendered in `demo_glmf_vps/` |
| Art | none | Art engine (`design_system/art/`): seeded stitched pictures for home hero, offer headers, OG cards, empty states. One focal subject, one accent thread |
| Type | Mona Sans + Geist Mono | **D1**: keep Mona Sans for UI, or adopt the suite face (Work Sans in v5 lockups, Patrick Hand in notebook editions) |
| Palette | ink / paper / volt / vermilion | **D2**: keep volt as the product accent, or move to the art palettes (ochre, indigo, paper, riso, ink) |
| Motion | minimal, reduced-motion only | Live: crab reacts to filters/selection (idle, working, success, error moves from lore), art draws on first view, scroll-linked chapter on home |
| Theme | light default, dark twin | Keep. Fix: screenshots showed dark on first load |

Rule: the mascot and art are decoration around evidence, never evidence. No mascot on price cells, no animation that delays a price.

## 3. How to get there without breaking the release gate

1. **Tokens first.** Map the suite palette/type onto the existing `--t-*` and color tokens. Layout untouched.
2. **Logo and mark.** Build bestvpsforme's v5 product mark in `design_system/media/logos/v5/` (same tile, horizon, 16px silhouette test). Swap header/footer/favicon.
3. **Crab.** Port the five crab moves to an inline SVG component with the existing sprite. Trigger on catalog states only.
4. **Art.** Generate header art and OG cards with the engine. Reuse `ArtCanvas`-style lazy build.
5. **Motion.** Add in one place (`motion` lib or CSS), respect `prefers-reduced-motion`.
6. **Re-run gates.** `npm run release:check`, Playwright journeys, contrast (WCAG AA), JS budget (120 kB gzip first load). Motion libs count against that budget: measure first.

Open risk: the JS budget (118,706 of 120,000 bytes). Adding a motion library will exceed it. Use CSS and the crab as SVG first.

## 4. Monetization (study from zero)

Current model in the code and docs:
- **Affiliate links** on offers, labelled "Ad" next to the link. Commission never changes rank (`docs/product/EDITORIAL_INDEPENDENCE.md`).
- **Provider partnerships** tracked in the affiliate record (`docs/growth/PARTNERSHIP_PIPELINE.md`). Store terms; never promise position.
- **Special offers** list (`/special-offers`), one promotion per provider.
- **KPIs** already defined: offer CTR, outbound rate, conversion, EPC (`docs/growth/GROWTH_KPIS.md`).

Options, ranked by trust risk:
- **M1. Affiliate only** (current). Lowest risk. Revenue depends on conversions. Start here.
- **M2. Price alerts / saved comparisons, free account.** Adds retention and first-party email. No ranking effect.
- **M3. Paid "Pro" for alerts, full price history, export.** Needs accounts and billing. Beginners may not pay. Test after traffic exists.
- **M4. Sponsored placement.** Allowed only if labelled and kept outside organic ranking. Highest trust risk. Not recommended for MVP.
- **M5. Provider listings/directory fees.** Conflicts with "cannot buy a position". Avoid.

Recommendation: M1 for launch, add M2 to build an audience, decide M3 with data from GROWTH_KPIS.

**D3**: confirm M1 for launch and whether M2 is in MVP.

## 5. Scope

MVP (launch):
- Verified catalog, offer pages, compare, providers, guides, methodology, corrections.
- Reviewed 3-year price only where evidence exists (D12/D13 resolved first).
- Dated evidence and snapshots.
- New visual layer (sections 2–3).

Blocked before launch:
- 38 held editorial drafts, 28 open terms items (`docs/progress/pre-phase-7-repairs-2026-10-12.md`).
- Human screen-reader acceptance.
- VPS, DNS, backups, monitoring (`docs/ops/LAUNCH_CHECKLIST.md`).

After launch (in order):
1. Price history chart from snapshots (data exists).
2. Price-drop alerts (M2).
3. Workload picker ("I run n8n" → shortlist). Matches the "job" framing in PRODUCT.md.
4. Guides from search demand.
5. Pro tier (M3), only after data.

Out of scope: user reviews, forums, hosting of customer sites, any ranking by commission.

## 6. Decisions needed

- **D1** Type: Mona Sans or suite face.
- **D2** Palette: volt accent or art palette.
- **D3** Monetization: M1 at launch, M2 in MVP?
- **D4** Stack: keep Next + CSS motion, or add a motion library and accept the budget cost.
- **D5** Mascot: Hermit Crab (lore) and the Shell Shopper film as the bestvpsforme identity.
- **D6** Launch date and who runs VPS/DNS/backups.
