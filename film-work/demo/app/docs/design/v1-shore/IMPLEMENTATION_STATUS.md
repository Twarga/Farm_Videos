# V1 Shore implementation

## Understanding (five lines)
1. Port the finished Shore mockup without changing its appearance, interactions, class names or CSS.
2. Reuse the existing publication, pricing, ranking, admin authentication and staged-review backend.
3. Publish snapshot-backed facts only; preserve unknowns, evidence dates and /go/[id] outbound links.
4. Deliver public routes and the complete admin panel in implementation-plan Phase 0–7 order.
5. Require green phase gates, visual parity and production recovery/monitoring evidence before launch.

## Conflicts found before implementation
- The catalog is in src/pages/catalog.tsx, not src/app/catalog as the handoff table states. Preserve the Pages/App Router split unless measured migration proves safe.
- docs/product/PRODUCT_CONTRACT.md still requires Highlighter/Mona Sans, a paused Finder and no public search. The approved Shore mockup supersedes the old visual direction; reconcile binding design contracts before Phase 1 public UI changes. Catalog search stays hidden by D-1.
- The earlier design plan has a different phase sequence and D1–D5 register. The implementation plan §3 and §9 take precedence; do not confuse their decision IDs.
- The mockup README Limits section describes only five screens, but its newer Pages section and shore.js implement additional routes. Use the actual mockup routes for baselines.
- Existing uncommitted edits predate this work (deployment, backups, QA receipts and other docs). Preserve them; no commits, destructive git operations or database writes performed.

## Phase 0 checklist
- [x] Read the five required documents and repository instructions.
- [x] Create v1-shore from the current branch, preserving the working tree.
- [x] Copy fonts/logos byte-for-byte to public/shore and the character kit to src/shore/kit; do not copy data.js.
- [x] Record D-1…D-5 defaults in Scope.md §32.3.
- [x] Add repeatable Chromium capture script covering all mockup route templates and all six guides at 390/768/1440 in day/night, plus cards, empty catalog and selected/empty compare.
- [x] Complete 144 baseline captures; inspect the six home width/theme views, desktop catalog and mobile offer receipt. No page/request errors, broken images or horizontal overflow detected.
- [x] Final npm run lint && npm run typecheck && npm test passed: 81 files, 497 tests. Unchanged-app production build passed; capture verifies all copied assets byte-for-byte.

## Safe defaults used
D-1: provider-name search only; catalog search off. D-2: no email collection. D-3: displayPriceUsd for list/budget consistency. D-4: existing legal copy. D-5: verified staged provider expansion, not a launch blocker.

## Phase 0 outcome
Phase 0 completed on v1-shore. At that milestone, public application code and backend behavior were unchanged. Baselines and manifest are in docs/design/v1-shore/baseline/. The capture script waits for offscreen lazy logos and animated counters before capture; the mockup source is untouched. No application-to-mockup parity claim is made yet.

The older design document says scenes remain night in both themes; the finished mockup visibly has day-shore artwork. Follow the approved mockup, not the superseded scene instruction.

## Phase 1 — complete
- Actual application foundations use the original Shore CSS/classes and trusted Patchwork art in both routers. Accessible shared controls, mobile menu, pail, lantern theme transition, skip/tide behavior, local Ubuntu fonts, simplified icons, lockups and OG assets are integrated.
- Source styles remain unchanged except font URLs; the small day-footer evidence-ink accessibility correction is documented in DESIGN.md. The obsolete legacy nav rule was removed to prevent a border/position collision.
- Verification: npm run lint && npm run typecheck && npm test passed (85 files, 525 tests); the production build passed. Eighteen anti-alias-aware visual comparisons, six axe scans and menu/Escape/focus/theme/overflow checks passed at 390/768/1440 day/night. Evidence: phase-1/shell-checks.json. Comparison uses the existing project's .2 perceptual threshold / 1% pixel allowance; raw RGB raster differences are diagnostic, not substituted for that gate.
- Fixed the reviewed broken footer link: /affiliate-disclosure now renders existing disclosure copy, has canonical metadata, sitemap coverage and a route test. Verified navigation in the embedded browser.
- Fixed a development-only Turbopack failure caused by a type import before the MobileMenu client directive; a source regression test now covers directive order.

## Phase 2 — complete
- Added the public Shore projection and transaction-consistent, request-cached snapshot metadata through the existing publication backend. Native versus USD amounts, nulls, true zero/false facts, held claims, canonical provider slugs versus internal IDs and full-cohort/commission-independent ranks are covered by tests.
- Canonical filter keys remain stable. Mockup aliases normalize to them; malformed values are ignored; retired workload links are ignored as required; approved RAM/CPU/storage steps and clamped page state are implemented. Reverse recommended ordering now respects its direction without changing default ranks.
- Header/footer metadata comes from the publication, not the fixture. Unavailable counts/dates remain unknown.
- Verification: lint/typecheck and all 538 tests passed; production build and extended public parity passed. The first 24-result catalog page measured 138,716 raw HTML bytes against the unchanged 150,000-byte gate, with nine semantic columns, 24 unique offer links and matching /go actions. The stale seven-column assertion was corrected to the nine-column layout already present in the baseline, with additional column/cell checks.
- Re-ran all 18 shell visual comparisons, six axe scans and menu/focus/theme/overflow checks successfully. Component captures anchor footer layout at a common origin so unrelated upstream content cannot introduce fractional raster offsets.

## Phase 3 — implementation complete; visual gate pending
- All public Shore page routes are wired to the active publication, existing reviewed guide/legal copy, canonical URLs and `/go` actions. Corrections submit to a persistent queue; unavailable dates and facts stay explicit.
- Verification: public parity, phase-3 import/publish/rollback integration, security headers, content checks, lint, typecheck and 562 unit tests pass. Automated axe checks pass for all 21 route templates, and responsive accessibility checks pass at 320/390/768/1024/1440.
- 2026-10-25 follow-up: isolated Highlighter `.finder` rules from the Shore home, reset inherited `.field` chrome, and corrected Shore colors for comparison, unknown facts and guide metadata. Finder geometry plus all-route axe/keyboard journeys pass in desktop day/night.
- Remaining phase-3 gate: selected `/compare` still uses the legacy Highlighter grid and winner panel instead of the mockup's sewing table. Port it, then review the remaining screenshot baselines against the approved mockup at 390/768/1440 day/night; do not call visual parity complete yet.

## Phase 4 — in progress
- Added owner-guarded Publications, Corrections, Providers, Affiliates, Audit, Health and Settings views. Provider identity/status/rating evidence and affiliate program status/source fields now save with revision checks and transactional audit records. Publication rollback, import publish/issue resolution and correction accept/reject are also audited; accepted corrections must link an approved staged row for the same offer.
- 2026-10-25 follow-up: provider and affiliate save actions pass isolated Playwright coverage for evidence dates, actor audit records and separate affiliate changes.
- Remaining: provider logo upload, complete OPS view/action matrix (including backup and outbound monitoring integrations), action-level browser coverage for other new management screens and final admin visual review.

## Remaining release dependencies
Phase 3 visual review and Phase 4–6 release gates remain before a production-ready release candidate; Phase 7 deployment is deferred. Target production changes, destructive actions and owner launch sign-off require the owner's authorization at their gates. A real human screen-reader journey cannot be replaced by an automated scan. Provider/special-offer research rows remain unpublished until exact billing terms and source checks are approved.

## 27 October 2026 — V1 finish plan implementation in progress
- Admin navigation now points to route-based jobs; Overview, Offers, Providers, Affiliates, Price terms, Editorial, Data quality and Analytics have server-rendered list or summary routes. Provider, affiliate, terms, editorial and offer details render one record at a time. The admin overview no longer sends the full public catalog as client props; Settings uses an offer ID input validated on the server.
- A direct admin facts edit is limited to draft/staged/blocked offers. Published and historical records require the reviewed import/publication path. Annual special-offer cards now retain the full billed amount, term, source and check date alongside the monthly equivalent.
- Current local checks: lint and typecheck pass; 25 focused test files / 95 tests pass; `git diff --check` passes. The broad Vitest run reports 608 passes and 16 child-process `EPERM` failures in this sandbox. Next's production build stops while parsing TypeScript `--showConfig`; direct `tsc --showConfig` produces valid JSON. These environment failures are unresolved, so no release-readiness claim is made.
- Still open from `docs/V1_FINISH_PLAN.md`: admin shared-component/CSS consolidation, full real-size DOM budgets, remaining admin details and operational features, public mockup motion/visual parity, the catalog JavaScript budget, dated data refresh and publication, recovery proof, full browser matrix, accessibility sign-off and release gate. Deployment remains deferred.
- Later 27 October work: the Corrections queue is a 50-row paginated table, with a one-record detail route for sourced review and accept/reject. Acceptance still requires an approved staged row for the same offer. Audit has URL filters, paginated records and before/after inspection; Publications shows added/removed/changed snapshot diffs and one typed rollback control. The public chart entrance, true-cost tag motion and pointer hints now follow the mockup behavior, and the offer outbound action uses a plain link.
- The first local checks passed lint, typecheck and 31 focused tests. The import review route and other remaining plan packages still need work; no screenshot or motion parity claim is made.
- F8 source check: the mockup's walking bear is used for the catalog loading row, not the footer. The app's 404 fishing state now includes the Keeper SVG that was missing from the mockup markup. The footer retains its separate existing bear/crab crew.
- Build blocker isolated: in this sandbox, a Node child spawned with piped stdout returns exit code 0 and zero output for `tsc --showConfig`. Next now uses the installed TypeScript compiler API; CLI tests capture real child output through temporary files. Step 1 gates rerun after those changes: lint exit 0, typecheck exit 0, Vitest 117 files / 628 tests passed, production build exit 0. Browser and release gates remain unverified.

## 27 October 2026 — ordered release run
- Step 1 committed as `2aeb911` (admin routes), `7e8a125` (annual deal evidence), `6550deb` (Shore behavior), `48bf110` (build/test execution), and `5e7385f` (plan and review evidence). The four required gates were run with exit 0: lint, typecheck, Vitest (628/628), and build.
- Step 2 is blocked at the browser server startup in this environment. `E2E_PORT=3399 npm run test:e2e` initially hit the `tsx` CLI IPC socket restriction; after switching to Node's `--import tsx`, fixture preparation and the isolated build ran. `npm start -- --hostname 127.0.0.1 --port 3399` then independently failed with `listen EPERM: operation not permitted 127.0.0.1:3399`. No browser result or screenshot comparison can be claimed from this run. Static selector/contract updates are uncommitted pending the full browser matrix.
- Steps 3–8 have not started in this ordered run. No deployment.

## Admin page-size budget, measured 1 Nov 2026

Disposable copy of the live catalog (`/tmp/bvf-full/catalog.db`: 457 published offers, 51 providers, 8 snapshots), production build, Chromium, night theme, `scripts/audit/route-dom-audit.mjs`. Budgets (V1_FINISH_PLAN §3.1): ≤ 1,500 elements, ≤ 150 KB HTML, ≤ 6,000 px list height at 1440, no horizontal overflow at 390.

| Route | Elements | Forms | HTML KB | Height 1440 / 390 px | Overflow 390 |
|---|---|---|---|---|---|
| `/admin` | 382 | 1 | 67 | 900 / 1565 | 0 |
| `/admin/offers` | 920 | 1 | 122 | 4678 / 5046 | 0 |
| `/admin/offers/digitalocean-basic-1gb` | 356 | 0 | 67 | 900 / 939 | 0 |
| `/admin/providers` | 1034 | 1 | 136 | 3945 / 4082 | 0 |
| `/admin/providers/digitalocean` | 455 | 1 | 82 | 1593 / 2442 | 0 |
| `/admin/quality` | 656 | 0 | 96 | 3162 / 4704 | 0 |
| `/admin/analytics` | 349 | 0 | 66 | 900 / 1210 | 0 |
| `/admin/editorial` | 708 | 1 | 95 | 4144 / 4433 | 0 |
| `/admin/editorial/digitalocean-basic-1gb` | 436 | 1 | 73 | 1553 / 2405 | 0 |
| `/admin/terms` | 811 | 0 | 118 | 3260 / 4615 | 0 |
| `/admin/imports` | 365 | 2 | 72 | 1019 / 1184 | 0 |
| `/admin/imports?job=<job>` | 715 | 12 | 147 | 2238 / 2573 | 0 |
| `/admin/corrections` | 333 | 0 | 64 | 900 / 900 | 0 |
| `/admin/publications` | 480 | 1 | 86 | 1266 / 3599 | 0 |
| `/admin/affiliates` | 673 | 1 | 97 | 2705 / 2926 | 0 |
| `/admin/affiliates/affiliate_02bd540305671396a79e` | 368 | 1 | 70 | 1195 / 1545 | 0 |
| `/admin/audit` | 481 | 1 | 122 | 1316 / 1692 | 0 |
| `/admin/health` | 376 | 0 | 69 | 900 / 1354 | 0 |
| `/admin/settings` | 354 | 2 | 65 | 900 / 1113 | 0 |

All routes meet the element, HTML and overflow budgets. Fixes made while measuring: admin documents no longer render the public brand sprite, header art and footer (≈45 KB per page); `/admin/audit` pages at 10 rows (was 50 rows, 348 KB); `/admin/imports` shows one rollback form with a snapshot selector (was one form per snapshot) and pages price-term review 10 rows at a time (was one form per staged row: 552 forms, 3.9 MB HTML).

Known exception to the one-form rule: `/admin/imports?job=<id>` is a workflow page and renders the publish form, ≤ 10 price-term forms and ≤ 20 issue-resolution forms. `/admin/settings` keeps its two forms.

## Final gate, 1 Nov 2026

`npm run release:check` exit 0 (npm audit 0 vulnerabilities; data:check pass on `data/vps-offers-2026-11-01.csv`; lint; typecheck; 630 unit tests; security headers; content checks; browser matrix and large-catalog budget). Also passed: `check:phase7:recovery`, `check:security`, `npm audit --omit=dev --audit-level=high`. Logs and the catalog JavaScript measurement are in `docs/qa/v1-release/`.
