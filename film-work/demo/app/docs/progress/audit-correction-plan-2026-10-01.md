# Overhaul audit correction plan — 1 October 2026

**Goal:** Repair all findings in the 1 October audit before further phase implementation, with truthful public pricing and fresh acceptance evidence.

**Architecture:** Preserve one reviewed projection decision across all public consumers. Keep amortized service cost separate from reviewed cash-payment timing. Comparison uses URL state and semantic tables; editorial review remains separate from price-term review.

**Spec:** `bigone.md` Tasks 1.9–1.10, sections D2–D11 and the audit at `/tmp/bestvpsforme-audit-20261001/audit.md`.

**Constraints:** Work on `codex/resume-overhaul`; use `/tmp` database backups or synthetic fixtures. No real database mutation, snapshot publication, price approval, tracked-file deletion or push. Any required production correction is rehearsed and presented for explicit owner approval.

## 1. Reviewed prices and ranking

Files: `src/lib/real-price.ts`, `score.ts`, `public-catalog.ts`, `public-providers.ts`, offer route/components, and new pricing/score/render regression tests.

- [x] Write and run failing tests: unreviewed monthly plans and unknown setup fees have no real-price projection; missing cash cadence never becomes day-one due; promo prices cannot outrank a lower reviewed real price.
- [x] Add a shared reviewed-offer projection helper with USD monthly price, total and service-cost series; every consumer uses its result.
- [x] Repair receipt renewal timing/prepay labels and chart cash claims; retain explicit effective-price and unknown labels.
- [x] Verify provider ranges, alternatives and ranking against mixed reviewed/unknown fixtures.

## 2. Home, editorial and review workflow

Files: home components/data, catalog offer table, settings/action helpers, review artifact/rollout script, new rendered/SQLite tests and a data correction proposal.

- [x] Reproduce false X-ray real-price/no-catch claims with failing rendered tests.
- [x] Use published eligible evidence for the homepage example; hide projections or show explicit effective-price fallback when incomplete.
- [x] Separate editorial status from price-term status and preserve unknown catches.
- [x] Quarantine unsupported flat-renewal evidence in public mapping; prepare exact current-row correction list without approving facts.
- [x] Add reviewed homepage-choice validation, a required reason, durable audit record and cache invalidation; rehearse pending migrations on copies only.

## 3. Comparison behavior

Files: compare route/client, `CompareProvider`, comparison styles and behavior tests.

- [x] Write and run failing tests for known-versus-unknown differences, differing types, Clear plus reload, mixed RAM and CPU arithmetic.
- [x] Render a native table with row/column headers and RAM/catch/location facts.
- [x] Include unknown status and all rendered factual subvalues in equality; synchronize Clear with the URL.
- [x] Correct sorting descriptions and verdict arithmetic; verify server rendering and keyboard use.

## 4. Mobile and accessibility

Files: offer/compare/system styles, provider index, guide TOC/plans blocks and browser tests.

- [x] Reproduce alternatives overflow, tray interception and provider-index axe errors in browser assertions.
- [x] Bound alternatives to responsive/scrolling markup and reserve distinct tray/buy-bar space.
- [x] Correct provider navigation semantics; implement guide current-section tracking and dated live-plan references.
- [x] Cover real populated states at 390/1024/1440 in both themes.

## 5. Verification, evidence and status

Files: browser fixtures/matrix, retained runtime/guide/payload checks, `bigone.md`, ledger and QA artifacts.

- [x] Repair retained checks to assert supported behavior rather than retired markup or incidental copy.
- [x] Diagnose the four reproducible visual failures before accepting new baselines; preserve integrity assertions.
- [x] Run full tests, TypeScript, ESLint, explicit CI editorial checks, all browser profiles, and an actual-copy build/payload check.
- [x] Review final diff; make small verified commits without pushing.
- [x] Update phase table/checklists and ledger from proof; distinguish code completion from owner-gated production rollout.

## Final evidence — 1 October 2026

- `npx tsc --noEmit`: clean.
- `npx eslint src scripts tests`: clean.
- `npm test`: 334 tests / 64 suites, all pass.
- Browser coordinator `scripts/run_browser_checks.ts`: all four profiles pass — standard 444, large-catalog 44, admin-actions 12, audit fixture 32 (4 conditional TOC skips). 120 visual baselines across six projects regenerated after intentional copy/layout changes were diagnosed; the offer/tablet diffs trace to the removed legacy `.offer-decision__actions` flex rule that had been leaking past the viewport.
- Explicit editorial CI commands: all 10 pass, including previously failing `check_guides_index.ts` and rewritten `check_catalog_payload.ts`.
- `check_full_publication.ts`: 457 reviewed → 322 public offers, 43 providers, rollback + clean republish.
- `check_public_parity.ts`: snapshot, catalog API, home shortlist, provider pages, offer URLs and outbound disclosures reconcile.
- `check_runtime_rendering.ts` and `check_accessibility_runtime.ts`: pass (Playwright/Axe).
- Layout fixes beyond the plan: `position: relative` on `.alts__scroll`/`.tablewrap` stops `display:table` min-width propagating to `documentElement.scrollWidth`; `.ohero` collapses to `minmax(0, 1fr)` ≤1023px; `offer-decision__actions` renamed to `receipt__actions`; ~1,600 lines of retired offer/catalog/compare CSS removed from `globals.css` after dead-class audit.
- Not verified here: remote CI, external checkout prices, Lighthouse budgets, assistive-technology pass, real-database corrections (queued for owner approval, not applied).
