# Phase 7 delivery ledger

The 10 October results below are historical and describe the App Router catalog. The [12 October pre-Phase-7 repair handoff](pre-phase-7-repairs-2026-10-12.md) records subsequent catalog routing, packaging, test and data-evidence repairs. Full Phase 7 acceptance still requires current-build measurements and human accessibility verification. No public deployment or production content write was performed.

## What changed

- Each rendered HTML response gets its own CSP nonce, matching the theme and framework scripts. Production scripts have no inline/eval exception; missing routes retain protection. Existing forms, themes, navigation and authenticated actions work under the policy.
- Next.js is pinned to 16.3.8 with the updated lockfile. The fresh production dependency audit reports zero vulnerabilities.
- Cache Components/PPR were evaluated and deferred because the installed nonce-CSP guide requires dynamic rendering. Public data remains request-fresh. Separate-process reviewed/draft/terms/publication/rollback changes were verified across warmed public pages and the sitemap.
- Genuine SQLite failures display useful recovery feedback and recover through Try again. Publication-history failures no longer look like an empty history. Missing URLs return HTTP 404; update-history ties have deterministic ordering.
- Analytics responses finish their streams. Catalog rows no longer automatically prefetch unused detail pages; plan navigation remains available.
- Comparison controls wait for saved selections to restore, preventing an early new pick from being overwritten. Delayed-response regressions cover catalog and offer controls in all six browser projects.
- Mobile navigation, cards, price bounds, hardware alignment, provider/admin wrapping and sticky-header validation focus were repaired. Skip links and compact-menu reverse Tab work. Reviewed marks and dark selected-row disclosures have corrected contrast. The existing design, ranking, facts and pricing calculations remain intact.
- Lighthouse/web-vitals tooling now records valid mobile loads and scripted lab interactions. Complete first-load JavaScript accounting includes framework/shared scripts. CI runs nonce, freshness, recovery, accessibility and strict JavaScript regressions.

## Exact build and verification

Sanitized isolated build: **`kfsfRayDWDzMr7Vzz_twm`**, Next 16.3.8, React 19.2.0, Node 24.17.0. [Build evidence](../qa/phase-7/build-evidence.json) confirms 207 application/build input files match the working source. The user's root `.next` and port-3115 preview were not rebuilt or interrupted.

| Gate | Final evidence |
| --- | --- |
| Research CSV | Passed: zero errors, seven documented missing-data warnings |
| Lint / TypeScript | Passed after final source/test changes |
| Unit suite | **495 passed**, 82 files, final quiet run 7.17 seconds |
| Isolated production build | Passed |
| Production dependency audit | **Zero vulnerabilities** |
| Complete browser coordinator | **885 passed**, 207 intentional fixture/profile skips, zero failures; all matching profiles executed |
| Freshness / recovery | Passed separate disposable runtime gates, including real dependency failure/restore and both themes |
| Current-data accessibility | **Zero automated violations/errors**; 261 ordinary page scans, 50 actual-zoom scans, keyboard/modal states retained |
| Actual browser zoom | Measured 200%: same window 1440 → 720 CSS pixels; supplementary uncropped images reviewed |
| Final mobile load / interaction matrix | **42/42 valid loads and 24/24 valid interaction runs passed**; worst LCP 1018.478ms, CLS 0.01216666, lab INP 176ms |
| Complete catalog JavaScript | **168903 gzip-9 bytes**, fails the strict `<120000` gate; later journeys completed |
| Production data | **All 23 tables unchanged** versus the online backup; integrity and foreign-key checks passed |

Evidence for 10 October: [quality receipts](../qa/phase-7/quality-results.json), [browser results](../qa/phase-7/browser-results.json), [freshness](../qa/phase-7/freshness-results.json), [recovery](../qa/phase-7/recovery-results.json), [accessibility](../qa/phase-7/accessibility-results.json), [performance](../qa/phase-7/performance-final.json), [archived full JS](../qa/phase-7/catalog-js-budget-app-router-2026-10-10.json), [data preservation](../qa/phase-7/data-preservation.json).

## Remaining acceptance requirements

1. **JavaScript size:** at least 48904 bytes must be removed from the complete initial download to satisfy the strict limit. The supported webpack experiment was larger and was discarded. Shared/framework/application-shell scripts already exceed the total target. A measured architecture decision is needed; the threshold and denominator were not weakened, and essential controls were not delayed to manipulate the result. The strict CI size gate currently fails for this documented reason.
2. **Human accessibility:** perform a real NVDA or VoiceOver journey on a supported workstation. Neither is available on this Linux host. Retained axe incomplete contrast/ARIA/table items have representative visual/code review and a concrete human follow-up ledger in [accessibility.md](../qa/phase-7/accessibility.md). Zero automated findings is not WCAG conformance.
3. **External launch:** DNS/HTTPS, private configuration, credential setup, Turnstile on the real origin, off-host backup/restore, alert receipt and traffic opening remain deployment steps in the [launch checklist](../qa/phase-7/launch-checklist.md).

Field INP is unavailable for this local project; scripted results are labeled **lab INP**. The old baseline had an instrumentation failure, so no unsupported before/after timing gain is claimed. The preserved first final matrix passed its 42 loads but lost a comparison selection in one interaction run; that failed report is historical evidence of the subsequently repaired race, not final acceptance.

## Data preserved

330 stored published offers, 62 reviewed editorial entries, 38 held editorial drafts and 660 price rows remain unchanged. The 20 open renewals and 16 correction holds were not cleared. The default reviewed catalog shows 317 eligible plans because its existing Trustpilot-score rule excludes providers with unknown scores; this is not lost publication data or an expired-promotion count.

All mutation/validation tests used disposable databases and synthetic authenticated sessions. No live correction submission, provider checkout, migration, credential rotation or external deployment was used as a test.

## Reproduction

The immutable online backup is `/tmp/bestvpsforme-phase7-final-2h22bhi3/source.db`; the credential-free build is `/tmp/bestvpsforme-phase7-final-2h22bhi3/build`. Recreate these if removed. Never substitute the production database for a test fixture, or run a mutation gate from a dotenv-bearing build.

From the repository, target the already-built isolated workspace:

```sh
RUNTIME_SOURCE_DATABASE=/tmp/bestvpsforme-phase7-final-2h22bhi3/source.db \
RUNTIME_BUILD_DIR=/tmp/bestvpsforme-phase7-final-2h22bhi3/build \
PERFORMANCE_PHASE=final PERF_REPORT_PATH=docs/qa/phase-7/performance-final.json \
PERF_ARTIFACT_DIR=/tmp/bestvpsforme-phase7-final-2h22bhi3/final-lighthouse-current \
node --import tsx scripts/check_performance_runtime.mts

RUNTIME_SOURCE_DATABASE=/tmp/bestvpsforme-phase7-final-2h22bhi3/source.db \
RUNTIME_BUILD_DIR=/tmp/bestvpsforme-phase7-final-2h22bhi3/build \
ACCESSIBILITY_REPORT=/tmp/bestvpsforme-phase7-final-2h22bhi3/accessibility-final.json \
node --import tsx scripts/check_accessibility_runtime.mts

RUNTIME_SOURCE_DATABASE=/tmp/bestvpsforme-phase7-final-2h22bhi3/source.db \
RUNTIME_BUILD_DIR=/tmp/bestvpsforme-phase7-final-2h22bhi3/build \
JS_BUDGET_REPORT_PATH=docs/qa/phase-7/catalog-js-budget.json \
node --import tsx scripts/check_phase7_js_budget.ts
```

The last command intentionally exits nonzero while the documented size budget fails. Run performance with no competing builds/browser/test jobs. Do not replace `.next` while a server is using it. Browser coordinator command, executed from the isolated build:

```sh
E2E_FIXTURE=1 E2E_REUSE_BUILD=1 E2E_PORT=3127 \
E2E_DATABASE_URL=/tmp/bestvpsforme-phase7-final-2h22bhi3/browser-fixture/catalog.db \
DATABASE_URL=/tmp/bestvpsforme-phase7-final-2h22bhi3/browser-fixture/catalog.db \
npm run test:e2e
```

## Rollback and continuation

Phase 7 adds no migration. Rollback restores the previous application release and lockfile while keeping the published database intact; preserve any newer owner edits. A database restore is not needed merely to reverse UI/rendering changes.

Continue from the acceptance requirements above. Do not repeat completed editorial research, publish held drafts, enable shared nonce caching or mark the remaining master checkboxes complete without new evidence. Raw timing/screenshot artifacts are in the documented `/tmp` workspace; sanitized durable reports and representative public images are committed with this delivery.
