# Phase 4 + 5 implementation record — 1 October 2026

**Status: completed and corrected.** The detailed pre-implementation task plans required by `bigone.md` Part G were not written before these phases shipped; this document is the as-built record produced during the 1 October audit correction pass. It records scope, decisions and verification — it does not retroactively grant the skipped approval gate.

Spec sources: `bigone.md` §D2–D9 (design contracts) and `brand/mockups/` (reference surfaces). Corrections: `docs/progress/audit-correction-plan-2026-10-01.md` and the 1 October audit report.

## Phase 4 — shell, home, catalog (30 September)

- Shell: `SiteHeader` (⌘K palette, theme toggle, compare link, mobile menu), `DisclosureBar`, `SiteFooter`, `CompareTray` replaced `SiteChrome`. Keybind split: `/` focuses catalog search, ⌘K opens the palette.
- Home: X-ray card (operator-selectable via `site_settings`, migration 0014), provider ribbon, fit-line form, proof/method/FAQ — all counts via `getSnapshotStats()`.
- Catalog: filter rail (price bands, honesty switches, regions, providers), dot-scatter strip, catch column, 24-row pagination, density toggle, mobile sheet with focus trap.
- `/system` component gallery is dev-gated (404 in production).
- `postbuild` copies `public/` + `.next/static` into `.next/standalone/` (standalone server previously shipped no assets — zero hydration).
- Acceptance evidence: 261 unit tests; 240 browser checks; 54 baselines; catalog HTML ~130 KB.

## Phase 5 — offer, compare, providers, guides, methodology, system (30 September)

- Offer (§D4): receipt (3-year real price), cost chart, spec grid with honest unknowns, evidence cards, cross-provider alternatives, sibling chips, sticky mobile buy bar, sponsored/nofollow CTA semantics.
- Compare (§D5): server-rendered `?p=` state, best-in-row highlight, differences toggle, verdict cards, share link.
- Providers (§D6): index + detail (identity, Trustpilot, strengths/catches/watch, plan inventory).
- Guides (§D7): topic index, TOC + aside article layout, `:::callout`/`:::formula`/`:::plans` directives.
- Methodology (§D8): weights rendered from `src/lib/score.ts`; independence statement.
- System (§D9): `/updates` snapshot diffs, 404, error boundary, admin token adoption.
- `PlanMorph`/`planViewName`: catalog-row → offer-hero `ViewTransition` with no-op fallback and reduced-motion handling.
- Acceptance evidence at ship: 253 unit tests; 240 browser checks; 54 baselines.

## 1 October audit corrections (what the record must not lose)

- Single projection boundary: `reviewedPrice(offer)` returns null unless the publication mapper approved `realMonthly`; all consumers switched to it.
- Cash vs service cost: the chart allocates service cost; "Day 1 due" claims removed; prepay/renewal labels now come from reviewed billing facts only.
- Scoring: `valueScore` uses the reviewed price; unreviewed offers score −1 and cannot outrank reviewed ones.
- Labels: "No catch found" requires editorial review (`editorialReviewed`); unpriced renewals show "Renewal not reviewed".
- Evidence quarantine: `unsupportedRenewalReason` rejects inferred flat renewals in mapping, import review, publication and the standalone publish script; 16 suspect rows queued for owner action (`docs/data/renewal-correction-queue-2026-10-01.*`).
- Compare semantics: real `<table>` with row/column headers, RAM/catch/location rows, fact-based equality, URL-synchronized Clear, corrected verdict arithmetic.
- Mobile: tray/buy-bar coexistence via `--offer-buy-bar-height`; bounded alternatives scroll region.
- Coverage: six browser projects (desktop/tablet/mobile × light/dark), `/providers` + populated `/compare` in the route matrix, dedicated audit fixture profile, rewritten guides-index/payload/accessibility checks.
- Outstanding owner decision: the correction queue is a proposal only — no production row was changed; applying it requires the explicit approval flow.

## 1 October re-audit corrections (second pass)

- `/system` gallery: the documented `/_system` route was unreachable — App Router treats underscore-prefixed folders as private. Moved to `src/app/system/page.tsx`; verified 200 on `next dev`, 404 on `next start`.
- Home mad-lib: added the missing region select and the live result count. `src/lib/home-ask.ts` precomputes `buildAskCounts(offers)` over the same published set and `filterOffers` the catalog uses, so "Show N plans" is honest for every workload × budget × region combination.
- Command palette: rebuilt the listbox on the APG grouped pattern (`listbox → group → option`) — the old `li > li[role=option]` nesting failed `aria-required-parent`. Palette now also indexes published plans (name + provider) and navigates to `/offers/{id}`; covered by an e2e spec that axe-scans the open dialog.
- "Real price" filter: it tested `usd(offer)` (intro/effective) while the label promised the real price. New `displayPriceUsd(offer)` — reviewed `realMonthly` when present, else effective — now drives the max-price filter, price bounds, histogram and catalog summary. Regression test: an intro-$4/real-$8 plan fails an "under $5" filter.
- `eslint.config.mjs` now ignores `playwright-report/` and `test-results/` (generated artifacts that broke `eslint .`).
- Verification: 353 unit tests, tsc + ESLint clean, 448 standard browser checks + 44 large + 12 actions + 44 audit green, mobile home baselines regenerated for the new select.
