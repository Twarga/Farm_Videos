# Pre-Phase-7 repairs, 12 October 2026

The earlier-phase code, packaging and verification repairs are complete. The final local release gate passes with retries disabled. This handoff does not claim full Phase 7 acceptance or an external deployment.

## Repairs delivered

- Build and typecheck clear stale dev-generated route validators. Typecheck also runs the installed `next typegen` command before `tsc`, so production route definitions refresh without requiring a build first. A removed App Router catalog page no longer breaks verification through an old validator import.
- Runtime checks create one private, credential-free measurement build for local browser verification. They use disposable data and allowlisted build environment variables, preserve rejection of explicitly supplied dotenv-bearing build directories, and remove owned temporary builds on exit. Freshness/recovery failures now expose their cause in the browser test assertion.
- Local release checks and CI enforce dependency audit, research-data validation, lint, typecheck, unit tests, security, editorial checks, browser profiles and the strict catalog JavaScript budget. CI uploads the coordinator's measured receipt rather than running a duplicate budget check.
- All seven guides now have generated OpenGraph images from their published title, description and author. Frontmatter no longer names a deleted asset. JSON-LD points at the generated image. Standalone packaging includes the required TTF fonts and branded lockup.
- The admin correction queue lives in application sources, with its frozen content unchanged. Active documentation links follow the move.
- Removed nine unreachable internal components, three obsolete component/helper tests, three stale source-file-layout checkers and the guide-volume copy/count check. Kept the documented specialist maintenance tools and the dynamically imported admin metric inventory.
- Removed only proven-unused CSS. Dynamic offer tags and the shared offer receipt styles remain.
- Removed stale guide wording/count/layout assertions while retaining topic filtering, safe rendering, author/canonical metadata, discovery, freshness and invalid-content checks.
- Fixed a delayed-navigation regression test that intercepted only App Router requests; it now holds the actual catalog request and verifies the accessible loading state.
- Fixed a real transient contrast defect: Visit-button foreground and background now change together. The old animated midpoint measured 2.14:1; the focused ink-on-volt pair measures 16.36:1. Border feedback still transitions.

## Final verification

Command: `CI= npm run release:check`. Clearing `CI` selects zero retries in the existing Playwright configuration; no failure was retried into a pass in this final run.

| Check | Result |
| --- | --- |
| Production dependency audit | Zero vulnerabilities |
| Immutable research CSV | Zero errors, seven documented missing-data warnings |
| Lint and TypeScript | Passed |
| Unit suite | 497 passed, 81 files |
| Production builds | Passed, including the credential-free measurement build |
| Security and eight editorial checks | Passed |
| Full browser coordinator | 891 passed, 207 intentional profile/viewport skips, zero failures or flaky outcomes |
| Delayed catalog navigation, repeated without retries | 18 passed across six projects |
| Keyboard/contrast journey, repeated without retries | 30 passed across six projects |
| Freshness and failure/restore/retry | Passed in disposable databases |
| Strict complete first-load catalog JS | 118,706 gzip bytes, below the unchanged 120,000 exclusive limit |

The first full attempt exposed the stale request interceptor. A later run found the transient contrast issue and passed that check on retry. Both findings were repaired at their cause; the final full run above uses no retries. Existing visual baselines were not regenerated to hide differences.

After the full run, the typecheck command was tightened to `rm -rf .next/dev && next typegen && tsc --noEmit` and verified separately with `npm run typecheck`. This changes verification setup, not the measured application runtime.

Receipts: [quality](../qa/pre-phase7-2026-10-12-quality.json), [standalone images and shell](../qa/pre-phase7-2026-10-12-smoke.json), [final keyboard contrast](../qa/pre-phase7-2026-10-12-contrast.json), [freshness](../qa/pre-phase7-2026-10-12-freshness.json), [recovery](../qa/pre-phase7-2026-10-12-recovery.json), [production data preservation](../qa/pre-phase7-2026-10-12-data.json).

The packaged-app smoke served all seven guide images with HTTP 200, PNG signatures and 1200×630 dimensions. Browser screenshots confirmed the complete guide card, 390px light catalog and 1440px dark catalog. Home and catalog retained the same navigation/footer, one main region, working menu/Escape, theme persistence and no document overflow. Rapid navigations canceled outstanding prefetches; those are recorded rather than mislabeled as JavaScript exceptions.

## Catalog routing and measured tradeoff

The existing catalog work is preserved: Pages Router for `/catalog`, App Router elsewhere, shared domain functions and shell components. The stricter budget is unchanged; no essential control waits for interaction to hydrate.

Measured build: `6laP8FWQHs7sJtc76DsdX`, Next 16.3.8, React 19.2.0, Node 24.17.0, webpack. The disposable large fixture has 53 published offers; this is a runtime/byte gate, not a new publication count for production.

The [current receipt](../qa/phase-7/catalog-js-budget.json) includes all framework/shared scripts: 118,706 gzip bytes initially, another 144,297 fetched during the filter/sort/pagination/compare/theme journeys, and 7,910 gzip bytes for the separate SVG sprite. Cross-router visits therefore still download a second runtime. The passing first-load result does not establish a lower total journey cost. Webpack is required for the measured pass; the earlier same-tree Turbopack experiment measured 136,589 bytes and failed.

The [10 October App Router receipt](../qa/phase-7/catalog-js-budget-app-router-2026-10-10.json) is preserved unchanged. Its older Lighthouse matrix cannot certify the new routing/build. Full Phase 7 performance acceptance remains open until that matrix is refreshed.

## Data evidence and safety

Production offers, prices, editorial, snapshots and settings match the pre-repair read-only backup. Integrity is `ok`; foreign-key errors are zero. Counts remain 330 published offers, 62 reviewed editorial entries, 38 held drafts and 17 migrations.

The public mapper accepts 43 reviewed-term rows, 31 usable renewals and four complete Liquid Web projections. The current terms queue contains 28 open, 16 quarantined and 27 reviewed setup-fee targets. The [evidence refresh](../data/terms-evidence-refresh-2026-10-12.md) records primary-source checks and price/SKU mismatches. No additional plan acquired complete approval-grade evidence, so this work changes no production price or review stamp and publishes no held draft.

The earlier audit's 68-script deletion recommendation, unused-admin-component claim and claim that GitHub CI never ran were wrong. The corrected [audit](phase-0-6-audit-2026-10-12.md) withdraws them. GitHub shows failed runs on older `main`; these local repairs have not been pushed or remotely verified.

## Phase 7 resumes here

1. Refresh the full performance and current-data accessibility matrices on one exact release build, without competing build/test jobs. Keep the complete first-load denominator and report cross-router costs.
2. Complete the real VoiceOver/NVDA journey and retained incomplete contrast/announcement checks on a supported workstation. Automation is not screen-reader acceptance or a WCAG conformance claim.
3. Preserve the existing editorial/renewal holds. Source-backed SKU/term/fee reconciliation remains separate evidence work, as allowed by the Phase 6 closure.
4. Follow the existing external launch checklist for secrets, HTTPS, backups, monitoring and deployment. None of those external actions occurred here.
