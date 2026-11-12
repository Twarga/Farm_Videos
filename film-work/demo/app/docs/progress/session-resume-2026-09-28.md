# Devin session continuation — 28 September 2026

## Recovered state

The private Devin transcript is unavailable. This ledger is reconstructed from the working tree, `bigone.md`, and saved artifacts; it does not assert approval of decisions listed in that plan.

- Existing work: 22 modified tracked files, an untracked terms route, `bigone.md`, `.ralph/`, and `brand/`.
- Existing app work includes table/filter changes, provider logos/flags, price and snapshot copy, and terms navigation. Initial `npx tsc --noEmit` passed.
- Brand exploration exists: Mona Sans/Geist Mono fonts, volt/ink tokens, SVG logo family, page mockups, marketing assets and previews. These are not integrated into the live Next.js app. The product contract still specifies Plex/crimson.
- Video has a production brief and six static keyframes; there is no Remotion project or rendered film. Fixed scene visibility and caption-selector bugs and visually checked all six regenerated keyframes.
- `brand/BRAND.md` referenced by the video brief does not exist. The brief references Phase 8, but the saved roadmap ends at Phase 7.
- Roadmap checkboxes are not a trustworthy completion ledger: all are unchecked. Production mapping still imports static offer facts; detail siblings still come from demo offers; hourly sorting uses monthly prices.

## Continuation order

Preserve existing work. Complete data correctness before applying design concepts or making price claims in a video. Destructive cleanup is deferred because its explicit owner approval is absent. The existing diff was saved to `/tmp/bestvpsforme-before-session-resume.patch`; all files remain in the working tree on `codex/resume-overhaul`.

- [x] Reconstruct the saved state and establish the typecheck baseline.
- [x] Add the Vitest harness needed by Phase 1 (part of Task 2.1).
- [x] Remove fixture enrichment from published offers and static sibling suggestions (Task 1.1).
- [x] Preserve unknown billing, management, backup, GPU and editorial facts in public displays (Task 1.1).
- [x] Sort using published numeric bandwidth/hourly values; keep unknowns last (Task 1.2).
- [x] Run behavioral tests, typecheck, lint and relevant existing integration checks.

No production database changes, commits, publishing, or deletion of the previous session's work are implied by this ledger.

## Implementation completed in this continuation

- Pinned Vitest 4.1.11 (published 18 August 2026) with TypeScript aliases, `npm test`, and `test:watch`. An earlier 4.0.18 pin was replaced after npm audit identified a critical development-server issue; the final install reports only four pre-existing moderate Drizzle-toolchain advisories.
- Added real in-memory SQLite tests for publication mapping, reviewed-vs-draft editorial copy, missing billing values, persisted curation, sibling visibility, numeric sort data and production fixture gating.
- Removed demo defaults from catalog helpers. Their source is now explicit. Added ESLint restrictions against direct demo-offer imports from production surfaces; explicit development fixture mode has one gated access point.
- Offer siblings now come from the published repository, excluding self, hidden/unpriced offers and other providers. Provider pages map their already-loaded rows directly, removing redundant per-offer reads.
- Published management, backups and GPU values remain null because the current schema has no reviewed fields for them. Workload tags remain empty rather than copying demo claims. **The schema/editorial-entry portion of Task 1.1 is still pending; that entire roadmap task is not complete.**
- Cash due, advertised price and commitment preserve null; pricing helpers and UI distinguish missing values and an explicitly zero minimum term. Hourly and bandwidth sorts use published numeric fields. Missing numeric values sort last in either direction.
- Offer/mobile/card verdicts omit absent editorial notes. Compare shows absent catch as not published. Homepage copy no longer claims weekly curation or labels a catch as a recommendation reason.
- Updated the older homepage check to seed rated providers explicitly after asserting unrated seed providers are excluded. This preserves the previous session's Trustpilot filter instead of weakening it.

## Verification

- `npm test`: 25 passed across four suites. The initial run had 16 failing cases that demonstrated the original mapping, sorting and formatting defects. A rendered table test additionally reproduced the false month-to-month caption before its fix.
- `npx tsc --noEmit`: passed.
- `npx eslint src scripts tests vitest.config.mts`: passed.
- Existing integration checks passed: static-independent offers, public catalog, public offer, public homepage and ranking independence.
- `git diff --check`: passed.
- Chromium render inspection: catalog at 1440×1080, netcup offer at 1440×1080 and 390×844; screenshots in `/tmp/bestvpsforme-resume-qa/`. Catalog shows 314 plans. No clipping found in the changed offer content. Existing desktop Filters button remains visible (Task 1.6).
- `npm run build`: passed (Turbopack, TypeScript and all 17 static pages). The sandboxed attempt stalled; the bounded unrestricted retry completed successfully.

- Independent read-only code review: no actionable regressions found in this continuation; prior WIP and explicitly deferred schema work were distinguished from the reviewed changes.

## Remaining roadmap / next task

1. Finish Task 1.1's reviewed structured-fact storage: nullable management/backups/GPU and workload tags, generated migration, reviewed entry and snapshot/rollback handling. Until then these facts remain unknown, and specific workload filters cannot claim suitability.
2. Task 1.3: affiliate disclosure before commercial surfaces and sponsored outbound links.
3. Finish Task 1.4: human-readable region/location labels and snapshot-labelled shortlist. The raw MULTI label is still visible in the current offer page.
4. Tasks 1.5–1.8: theme flash, cascade layers, server-rendered/paginated catalog, safe JSON-LD and request-deduplicated reads.
5. Remaining Phase 2: port broader tests, browser/axe coverage and CI integration. The new harness does not replace the existing release gates.
6. Reconcile the later Mona/volt brand artifacts with `DESIGN.md` and `docs/product/PRODUCT_CONTRACT.md` before brand integration. Preserve the assets and missing-document/video discrepancies noted above.
7. Phases 3–7 and the Remotion film remain unfinished. Do not treat the six storyboard PNGs as a completed video.

The local dev server was started at `http://localhost:3002` for inspection. No commits or remote pushes were made.

## Update — 30 September 2026 (brand/plan session)

- `brand/BRAND.md` and `brand/README.md` now exist. `bigone.md` Parts C–D were rewritten for the Highlighter identity, and it now includes Phase 8 (marketing + Remotion), Task 3.0 (contract gate), and Tasks 1.9–1.10.
- New P0 data findings recorded in `bigone.md` B1: D12 (216 EUR/GBP prices stored as USD with no exchange rate) and D13 (renewal and due-today equal the effective price in all 322 published offers; the real terms exist only in `billing_notes`). No price claim should ship until Tasks 1.9–1.10 land.
- No application source, database, or git state was changed by this session.

## Update — 30 September 2026 (takeover checkpoint)

- Read the repository instructions, this ledger, the master plan, product contract, brand guidelines and both token files. Opened all ten mockup HTML pages and inspected a contact sheet of all 20 saved previews. The Highlighter assets remain design references; Task 3.0 approval is still required for integration.
- Fresh starting state: branch `codex/resume-overhaul`, 40 modified tracked files, untracked terms route, four test suites, two fixture files, Vitest configuration, `bigone.md`, `brand/`, this ledger, and `.ralph/`. The plan's older 22-file Task 0.1 scope was updated to preserve the actual work, including test dependencies.
- Task 0.1 app checkpoint committed as `4e15cec` (`Checkpoint catalog, filter, and terms work before overhaul`): 48 files, 1,891 insertions and 306 deletions. Existing app changes were preserved without additional application edits. Brand and planning artifacts are saved separately with this ledger update.
- Read-only SQLite inspection confirms 322 published offers and 314 with a Trustpilot score; `offer_editorial` has zero rows. Every published offer has renewal and cash due equal to effective monthly, including 43 long-term offers. Across all price history, 202 EUR and 14 GBP records have no FX rate; the current records are 99 EUR and seven GBP, also all missing rates. The audit's 216 non-USD count includes historical rows, rather than 216 current plans. Tasks 1.9–1.10 remain P0 blockers.
- Verified mapping/siblings and numeric sorts in the existing source and tests. The reviewed structured-fact schema part of Task 1.1 is still pending. No new Phase 1 completion claims were made.

Fresh verification results before the checkpoint:

| Command | Actual result |
|---|---|
| `npm test` | Exit 0; `Test Files 4 passed (4)`, `Tests 25 passed (25)`, duration 1.78 s |
| `npx tsc --noEmit` | Exit 0; no diagnostics |
| `npx eslint src scripts tests` | Exit 0; no diagnostics |
| `DATABASE_URL=/tmp/bestvpsforme-checkpoint-tfjg_tkw/catalog.db npm run build` | Exit 0; Next.js 16.3.3, compiled in 1,299 ms, TypeScript completed, `Generating static pages ... (17/17)` |
| `git diff --check` / app checkpoint `git diff --cached --check` | Exit 0; no whitespace errors |

The build used a consistent SQLite backup opened from a read-only source connection. Unit repository tests use in-memory SQLite. No migration, publication, production database mutation, push, deletion or tracked-file move was performed. Task 0.1 saves WIP; this verification does not constitute approval to release the existing price claims.

The brand checkpoint's whitespace check identifies one existing trailing space on line 21 of each bundled OFL license. The original third-party license files are preserved verbatim. The check excluding those two files passes.

Next: wait for explicit D-6 approval of [the exact Task 0.2–0.4 cleanup scope](phase-0-cleanup-approval-2026-09-30.md), then execute the approved cleanup. After that, follow the requested Phase 1 order: 1.9, 1.10, remaining 1.1, then 1.3–1.8. Obtain D-7/D-9 decisions before implementing their dependent pricing rules and D-8 before brand integration.

## Update — 30 September 2026 (Task 0.2 cleanup)

- The owner explicitly approved the seven local cleanup paths after they were listed in this chat. Task 0.2 is complete. Approval for tracked-file cleanup and documentation moves, Tasks 0.3–0.4, remains pending.
- Automatic approval review rejected the planned force-delete command (`rm -rf`) with the reason that `rm -f` style commands are not permitted. Used `gio trash` to remove exactly `.next/`, `third design/`, `tmp/`, `research-app/`, `tsconfig.tsbuildinfo`, `.ralph/`, and `.impeccable/`. All seven paths were confirmed absent immediately afterward. These files remain recoverable in system Trash; this operation does not reclaim their disk space. Verification subsequently regenerated `.next/` and `tsconfig.tsbuildinfo` as expected.
- Added `/.ralph/` to `.gitignore`. `git check-ignore .ralph/full-remediation.state.json` returned the path with exit 0. No application code, dependencies, tracked-file locations, or production data changed.
- Created `/tmp/bestvpsforme-cleanup-abwi5hnm/catalog.db` using SQLite backup from a read-only source connection. Started `DATABASE_URL=/tmp/bestvpsforme-cleanup-abwi5hnm/catalog.db npm run dev -- --hostname 127.0.0.1 --port 3002`; it reported ready in 193 ms. A GET to `/` returned `HTTP 200`; the server logged `GET / 200 in 1696ms`. Stopped this temporary development server afterward.

Fresh verification:

| Command | Actual result |
|---|---|
| `npm test` | Exit 0; `Test Files 4 passed (4)`, `Tests 25 passed (25)`, duration 1.31 s |
| `npx tsc --noEmit` | Exit 0; no diagnostics |
| `npx eslint src scripts tests` | Exit 0; no diagnostics |
| `DATABASE_URL=/tmp/bestvpsforme-cleanup-abwi5hnm/catalog.db npm run build` | Exit 0; compiled in 3.3 s, TypeScript completed in 3.9 s, all 17 static pages generated |
| `git diff --check` | Exit 0; no whitespace errors |

Next: request approval for [Tasks 0.3–0.4's exact tracked-file cleanup and documentation moves](phase-0-cleanup-approval-2026-09-30.md). The price-data P0 blockers and the later contract/brand approval gate remain open.

## Update — 30 September 2026 (Task 0.3 tracked cleanup)

- The owner explicitly approved Task 0.3 in this chat. Removed the five unused starter SVGs, the three generated PDFs under `output/pdf/`, and `src/app/for-me/page.tsx` using `git rm`. Moved the three research Markdown documents into `docs/archive/research/` using `git mv`; byte comparisons against HEAD confirmed all three were preserved exactly.
- Read the bundled Next.js 16.3.3 redirect and config-testing guides. Added a permanent `/for-me` → `/catalog` redirect in `next.config.ts`. The two new behavioral Vitest cases first failed with `expected 200 to be 308` when no config redirect was registered, then passed after implementation. They test the bare URL and query preservation.
- Updated Finder archive, product contract and frontend readiness checks to inspect Next.js's real config response. Their first direct `tsx` run failed because Next.js's experimental test utilities need its Node baseline initialized; importing the bundled baseline before those utilities resolved the runtime error. All three checks now pass.
- The first typecheck found stale generated references to the removed route in `.next/dev/types` and `.next/types`. Starting the dev server regenerated development types; `npx next typegen` refreshed production types. The final `npx tsc --noEmit` passed without changing typecheck scope.
- Development verification used `/tmp/bestvpsforme-task03-3mxkce2e/catalog.db`, a fresh SQLite backup from a read-only source connection. `HEAD /for-me` returned `HTTP/1.1 308 Permanent Redirect` with `location: /catalog`; `HEAD /for-me?ram=4&region=EU` returned 308 with `location: /catalog?ram=4&region=EU`. Stopped the temporary server after verification.

Fresh verification:

| Command | Actual result |
|---|---|
| `npm test` | Exit 0; `Test Files 5 passed (5)`, `Tests 27 passed (27)`, duration 1.14 s |
| `npx tsc --noEmit` | Exit 0 after route-type regeneration; no diagnostics |
| `npx eslint src scripts tests` | Exit 0; no diagnostics |
| `DATABASE_URL=/tmp/bestvpsforme-task03-3mxkce2e/catalog.db npm run build` | Exit 0; compiled in 652 ms, TypeScript completed in 4.7 s, all 16 static pages generated; `/for-me` is now a config redirect rather than a page |
| `npx tsx scripts/check_finder_archive.ts` | Exit 0; Finder archive check passed |
| `npx tsx scripts/check_product_contract.ts` | Exit 0; 10 critical routes and integrity invariants protected |
| `npx tsx scripts/check_frontend_readiness.ts` | Exit 0; frontend readiness check passed |
| `git diff HEAD --check` | Exit 0; no whitespace errors |

No production database mutation, publication, push, brand integration or Task 0.4 documentation move occurred. Next: obtain approval for [Task 0.4's 27 document moves and README consolidation](phase-0-cleanup-approval-2026-09-30.md), then follow the previously requested Phase 1 pricing-first order.

## Update — 30 September 2026 (Task 0.4 documentation consolidation)

- The owner requested the next task after Task 0.4's exact scope was presented. Moved the 27 listed root documents into `docs/product/`, `docs/data/`, `docs/ops/`, `docs/growth/`, and `docs/archive/`. The root now contains `README.md`, `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, and the master plan `bigone.md`.
- The binding contract is now [docs/product/PRODUCT_CONTRACT.md](../product/PRODUCT_CONTRACT.md). Its only content change is correcting its three relative links; every integrity, route, design, accessibility, publication and security rule is unchanged. All 27 moved documents were compared against HEAD with only reference paths normalized; contents otherwise match.
- Updated paths in 18 affected checks, the master plan, the ledger and links between archived documents. Verified all 39 local Markdown document links resolve. README is 40 lines and provides local run instructions, verification commands and links to current and historical documentation.
- Added a behavioral navigation test: README previously did not expose a link to the binding contract, so the test failed; after the rewrite it passes and every README documentation link opens a readable file.
- Removed three obsolete README wording assertions from the runtime status check (table-count copy, a blanket vulnerability claim and a workflow sentence). Its remaining status and admin checks still pass; the new test checks documentation navigation. The editorial independence check initially failed on a pre-existing requirement for the literal word `independent`; the page already states `Affiliate status never changes the order`. Updated the check to enforce that substantive promise and retained the existing commercial-field prohibition. It now passes. No application UI was changed.

Fresh verification:

| Command / check | Actual result |
|---|---|
| `npm test` | Exit 0; `Test Files 6 passed (6)`, `Tests 28 passed (28)`, duration 1.33 s |
| `npx tsc --noEmit` | Exit 0; no diagnostics |
| `npx eslint src scripts tests` | Exit 0; no diagnostics |
| `DATABASE_URL=/tmp/bestvpsforme-task04-yheil3du/catalog.db npm run build` | Exit 0; compiled in 358 ms, TypeScript completed in 1,766 ms, all 16 static pages generated |
| All 18 affected `npx tsx scripts/check_*.ts` commands | Exit 0 after the editorial check correction; content guide/review, data schedule, dependency cadence, deployment, independence, email, growth KPIs, launch, monitoring, operating checklist, partnerships, performance budget, post-launch review, privacy operations, product contract, release runbook and runtime status checks passed |
| Document preservation / links / README length | All 27 documents preserve content apart from references; 39 links resolve; README has 40 lines |
| `git diff HEAD --check` | Exit 0; no whitespace errors |

Build verification used a fresh SQLite backup from a read-only source connection. No production database mutation, publication, push, or brand integration occurred. Phase 0 is complete.

Next: Task 1.9 (reviewed renewal, intro, commitment, upfront billing and setup-fee terms), then Task 1.10 (dated FX and VAT basis). Obtain owner decisions D-7 and D-9 before their dependent implementation. Recommended defaults remain a 36-month horizon and ECB rates on the check date with VAT shown as the provider lists it. Task 3.0 / D-8 approval is still required before any brand integration.


## Update — 30 September 2026 (pricing session / root cause)

- Owner recorded D-7: 36-month horizon, labelled “3-year real price”. D-9: EUR/GBP use ECB reference rates on the price check date; preserve provider-listed VAT and state incl./excl./unknown on offer pages. D-8 remains unapproved.
- Starting checks: 28 tests passed; typecheck and lint exited 0. Preserved the owner's Task 1.9 file-list edit and untracked saved prompt.
- A real in-memory publication test reproduced D13: an approved Hostinger import with unreviewed terms wrote 6.49 for both cash due and renewal. The failing assertion expected null. Import publication and seed now leave these fields null. This root fix does not approve any terms or rewrite existing records.
- Task 1.9 is in progress; existing legacy records still require display gating and the reviewed terms schema.


## Update — 30 September 2026 (Task 1.9 implementation)

- Generated `0011_offer_price_terms.sql` with Drizzle: seven nullable additions, no backfill. Applied only to `/tmp/bestvpsforme-pricing-ykaym217/catalog.db`. Legacy copied due/renewal values remain in storage but the public mapper suppresses them unless terms have reviewer, date and evidence. Real-price display additionally requires a known setup fee; unknown is not silently zeroed.
- Implemented the four exact master-plan calculation cases plus setup fee, lower renewal, one-month intro, unknown term and unknown projection tests. The model follows the plan's monthly renewal series after the reviewed introductory/prepay period.
- Parser tests use the real CSV billing notes. It leaves Hostinger upfront billing and Time4VPS intro duration unknown where the text is insufficient. AlphaVPS monthly/annual alternatives are not conflated. A first Time4VPS assertion used 4.49; inspecting the exact source showed 5.77 and corrected the fixture expectation.
- Added an authenticated per-row terms review form showing suggestions beside exact evidence, editable nullable terms, a required evidence note and an explicit confirmation. Batch approval never approves terms. Review metadata and terms survive snapshot rollback; the rollback regression first failed with dropped nullable columns, then passed. No owner terms were approved by this session.
- Public catalog/cards/mobile/home/offer prices distinguish reviewed 3-year prices from effective prices with “Renewal not reviewed”. The new sort keeps unknowns last in either direction.
- Review queue: [price-terms-review-2026-09-30.md](../data/price-terms-review-2026-09-30.md), all 43 long-term current plans plus 25 additional monthly plans mentioning intro/renewal. Contains exact notes, stored values and parser suggestions. Current missing FX is 99 EUR + 7 GBP; 216 includes history.
- Verification: 51 tests / 10 suites; typecheck, lint and whitespace checks exit 0. Build passed on the migrated disposable copy (16 static pages). Dev HTML at `/offers/hostinger-kvm-1` contains “Renewal not reviewed”, “Due today not published”, and “Not published” in billing rows; no “$6.49 renewal” or “$6.49 due today”. HTML/text evidence is under `/tmp/bestvpsforme-pricing-ykaym217/hostinger-before-review.*`. Browser inspection caught reduced hero price typography after nesting; updated selectors and visually confirmed the original hierarchy was restored.
- No real database migration, publication, price-term approval, tracked deletion, push or brand integration occurred. Task 1.10 is next.

## Update — 30 September 2026 (Task 1.10 implementation and pricing verification)

- Implemented dated ECB conversion and `fx_rates`. Drizzle migration `0012_currency_vat.sql` creates the rate table and adds nullable VAT basis with an inline CHECK; no price backfill or table rebuild. Applied only to disposable databases. Actual ECB observations on 31 August are USD/EUR 1.1596 and GBP/EUR 0.85648; GBP/USD is derived from those same-date observations. Missing dates, invalid rates, non-reference CSV data and conflicting stored observations are rejected; no 1.0 or prior-day fallback.
- `toUsd` passes the exact 5.91 × 1.09 = 6.44 / missing-rate-null cases. Review policy blocks foreign rows without check-date FX. The publisher checks again before touching existing prices, then stores original effective amount, converted USD amounts, rate/date and provider-listed VAT basis. Snapshot rollback preserves the new VAT field and dated conversion metadata, verified in memory.
- USD is primary on catalog/home/mobile/compare/offer pages. The source amount and dated rate appear below it; offer pages show VAT incl./excl./unknown. Legacy rows retain source currency in public mapping and need actual FX before any USD value is displayed. Price filters and sorting exclude unknown conversions appropriately; admin averages, medians, histogram and country/provider prices now use known USD values.
- Found the same copied-renewal bug in manual admin price entry. New failing tests reproduced invented renewal and expiration of the old price before a missing-rate rejection. The fix leaves unreviewed renewal/due today null and checks FX before an atomic write. Additional failing tests covered a changed renewal without intro duration and a partly reviewed monthly record; both now retain an unknown three-year price.
- Full-data pre-publication review on `/tmp/bestvpsforme-pricing-ykaym217/publication-check.db`: 457 staged rows; 322 publishable, 76 hidden, 59 rejected; zero missing-rate blockers and zero snapshots. Owner approval was requested before `data:publish-full`, as required by the instruction to ask before any snapshot. No full-data snapshot publication was run. Task 1.10 Step 4 remains unchecked.
- Fresh required verification: `npm test` exits 0 (72 tests / 14 suites, 1.49 s); `npx tsc --noEmit`, `npx eslint src scripts tests` and `git diff --check` exit 0. Build on `/tmp/bestvpsforme-pricing-ykaym217/catalog.db` exits 0: compiled in 403 ms, TypeScript in 2.7 s, 16 static pages generated. The final full suite includes the extended conversion metadata rollback assertion.
- Dev server runs on the backup copy at `http://127.0.0.1:3002` (ready in 206 ms). Hostinger HTML returns 200 and explicitly says “Renewal not reviewed”, with “Not published” due-today/renewal rows. Assertions reject “$6.49 renewal” and “$6.49 due today”. netcup shows `$12.01`, `€10.36 · ECB 1.1596 on 31 Aug`, and “Price includes VAT”. Desktop dark and narrow light screenshot evidence is saved with the [complete verification record](../data/pricing-verification-2026-09-30.md).
- The [43-plan owner review queue](../data/price-terms-review-2026-09-30.md) remains unapproved. It also contains 25 additional monthly intro/renewal leads and all 106 current foreign prices. A final read-only production audit confirms 99 EUR + 7 GBP missing rates, 216 including history, and neither new migration applied.
- Confirmed `output/` was empty and untracked before removing it. No tracked file was deleted. Kept the owner's untracked saved prompt. Phase 0's table line is unchanged; Phase 1 and Phase 2 lines now reflect verified pricing implementation and 72 tests.
- `src/lib/finder-redirect.test.ts` retains Next's experimental `unstable_getResponseFromNextConfig`; it may need updating when Next.js is upgraded.
- No production database mutation, owner terms approval, real snapshot publication, push or Phase 3 brand work occurred. D-7/D-9 are recorded; D-8 remains unapproved. Next: owner approval for the disposable full-publication verification, then owner review of terms and separately approved production rollout.
- Implementation commits: `d58b785` (root null-value fix and owner decisions), `2f2d7fc` (reviewed terms, 36-month model and review queue), `233b07b` (dated ECB conversion, VAT and final safeguards). This documentation update records the verified scope and remaining approval gate.


## Update — 30 September 2026 (approved task series / Task 1.10 final check)

- The owner asked to start the proposed series after the exact prepared `/tmp` publication test was presented. This authorizes that disposable snapshot test; it does not authorize production migration/publication, terms approval, tracked deletions or D-8 brand integration.
- `DATABASE_URL=/tmp/bestvpsforme-pricing-ykaym217/publication-check.db npm run data:publish-full` exited 0: 322 eligible rows published, 43 providers, 784 location links; 76 hidden and 59 rejected. Current foreign prices are 99 EUR + 7 GBP, with zero missing or mismatched check-date rates. All current renewal/due-today fields remain null and zero terms were approved. Hostinger is 6.49 effective / null due / null renewal. Task 1.10 Step 4 is now verified. See [full pricing proof](../data/pricing-verification-2026-09-30.md).
- Fresh starting verification: 72 tests / 14 suites pass (1.44 s), TypeScript and lint exit 0. The pre-existing untracked saved prompt remains preserved. Production remains untouched.
- Continuing Task 1.1, then browser harness and Tasks 1.3–1.8, followed by remaining unit coverage and CI. Tracked-script retirement will be prepared as a coverage mapping for explicit deletion approval. D-8 will require a concrete contract review before brand implementation.

## Update — 30 September 2026 (Task 1.1 schema and fixture boundary)

- Generated additive migration 0013 for nullable reviewed `niches`, `managed`, `backups`, and `gpus` in `offer_editorial`. Reviewed false/zero values round-trip; draft values remain absent from public offers. Migration applied only in memory and to the disposable pricing copies. No real database change or editorial approval.
- A persistence regression exposed an initially generated migration against the wrong table before it was applied. Corrected the schema location and regenerated through Drizzle; the final SQL adds only the four editorial columns.
- Completed the published-provider sibling repository and shared `SpecValue` absence renderer. ESLint now rejects relative fixture imports too, while the sole development fixture entry has a targeted documented exception.
- Rendered homepage regression reproduced 27 static providers beside an empty publication. The homepage now reports zero and uses only published provider profiles. Fixed the offer specification definition-list structure exposed by axe.
- Fresh targeted verification at 16:52: four suites / 19 tests passed; TypeScript and full src/scripts/tests ESLint passed. The concurrent full suite intentionally caught six red cases from the separate raw-data CLI task; those do not affect this commit and are being fixed before final verification.

## Update — 30 September 2026 (Task 2.1 listed behavior ports)

- Added 78 behavior cases across 12 suites: full-source catalog filtering/scoring, URL round-trips, every real CSV row’s normalization, import and publication policy, provider facts, real CSRF and scrypt/TOTP sessions, rate limits, captured log redaction and actual analytics ingestion/KPIs. All 16 affiliate assignments across varied offers preserve ranking.
- Fresh targeted verification at 17:15: 12 suites / 78 tests passed. Repository and handler tests use migrated in-memory SQLite, not Drizzle mocks or real-database writes. Existing behavior was characterized; no artificial failing implementation phase was invented.
- Owner approved the separate exact21-file retirement proposal. Deletions/manifest follow-through are staged for a later atomic commit with dependency/configuration changes after browser verification. The remaining retirement and fewer-than-15 target are explicitly open.

## Update — 30 September 2026 (Task 1.5 before-paint theme)

- Added a self-contained synchronous head bootstrap with valid saved preferences and system fallback. The layout-effect toggle re-applies the preference and synchronizes its accessible action; switching still updates the DOM when storage is blocked.
- Eight VM tests first failed for missing bootstrap/blocked storage, then passed. Nine production-browser cases across three projects passed: saved dark before delayed hydration/CPU throttle, system dark, and blocked-storage switching. These passed during the 91-pass/8-fail pre-layer browser run; remaining failures concerned separate CSS/contrast tasks.
- Fresh theme/compare/offer/JSON-LD targeted run passed before commit. All builds and browser servers use disposable `/tmp` databases.

## Update — 30 September 2026 (raw staging validation for Task 2.4)

- The real CSV check previously blocked Cherry Servers’ legitimate unpriced row289, preventing the planned CI gate, while accepting NaN/infinity. Ten real Python subprocess cases reproduced six failures before implementation. Missing effective price now emits an explicit raw-staging/nonpublishable warning; malformed, negative and nonfinite supplied numbers are errors across all numeric columns.
- Publication policy remains strict: row289 cannot publish until price evidence exists. The immutable CSV was compared byte-for-byte and is unchanged. No price was inferred or approved.
- Fresh CLI/import-policy verification: 22 tests across two suites passed. Full `npm run data:check`: 457 rows, 24 columns, 63 providers; zero errors, seven warnings. CI/browser configuration verification remains in progress.

## Update — 30 September 2026 (Task 1.8 structured data)

- Added shared escaped JSON-LD output to offer/provider/guide pages and removed the offer’s unreviewed InStock claim. Three regressions failed before safe serialization/availability changes and now pass. Wrapped offer and snapshot database reads in request-scoped React cache following the bundled Next deduplication guide; this is not persistent data caching.
- Fetched actual Hostinger HTML from the disposable-copy dev server: exactly one parseable escaped JSON-LD script, no availability. Submitted its public structured data to Schema Markup Validator’s code test: zero errors, zero warnings, Product and BreadcrumbList detected. Screenshot: `docs/qa/2026-09-30/hostinger-schema-validator.jpg`.
- The retained guide metadata check now renders/parses the shared helper instead of requiring its MIME string inside the page file. Fresh helper/public mapping tests and that retained check pass. Provider JSON-LD is staged separately from its concurrent catalog pagination edits.

## Update — 30 September 2026 (Task 2.3 approved retirement)

- Owner explicitly approved the exact21-file proposal through the approval question. Removed exactly its eight replaced behavioral checks and thirteen documentation-phrase checks plus their npm entries. Documentation remains; historical commands are annotated and live callers use actual replacement tests.
- Updated scheduled normalization and content aggregate commands, retained remediation/R7 dispatch callers and raw-staging diagnostics. All direct check paths and npm aggregate references resolve. No additional tracked deletion occurred.
- Replacement tests pass; all ten retained content commands pass on the disposable fixture database, as does the scheduled-data contract. Full legacy remediation/R7 aggregates were not run because they include migrations/publications requiring separate authorization; they are not claimed verified.
- Remaining inventory is 131 tracked TS checks, including 61 actual source-text readers, and 150 npm entries after the concurrent browser setup. The fewer-than-15 target and further behavior replacement remain open. Package index for this commit includes only retirement changes; browser setup remains for its own verified commit.

## Update — 30 September 2026 (Tasks 1.2–1.4 and comparison URLs)

- Preserved the original numeric-sort red/green evidence; fresh catalog tests verify unknowns last in both directions. Task 1.2 checkboxes now reflect that evidence.
- New unit and browser regressions reproduced missing sponsored attributes, disclosure ordering, unsupported shortlist wording and raw region codes. Commission notes now precede paid links, labels are 12 px with a decorative link icon, and direct provider links describe their actual commission basis. The shortlist uses the actual snapshot date and only reviewed fit/catch copy.
- Added comparison share URLs and published-ID validation, including reload, blocked storage and soft navigation. Independent review found URL restoration and trimmed-search draft bugs; browser regressions failed before each fix and pass afterward.
- The initial complete production-browser run passed 159 tests: 105 behavior/axe/theme cases and 54 visual comparisons with no baseline updates. Full unit verification passed 179 cases in 37 suites. A newly published critical Next advisory failed the fresh audit; upgraded Next and its lint config to the minimal patched 16.3.6, with production audit now reporting zero vulnerabilities. Patched-version build/browser verification follows before final completion.
- All browser data is synthetic or a disposable backup; no production migration/publication or real price-term approval occurred.

## Update — 30 September 2026 (Task 1.7 SSR and transport)

- Catalog and provider pages now await server search parameters, filter/sort the full published scope before pagination and send 50 slim result DTOs. Facets retain the complete eligible scope; mobile renders 20 initial results with progressive reveal. Both layouts exist in SSR and CSS selects the viewport presentation.
- Six DTO/filter/pagination cases and three draft-query cases pass. Actual browser cases verify pre-hydration rows, filter → URL → Back, comparison restoration and whitespace-preserving typing. Shared decorative SVG assets retain their exact geometry; star markup regression failed at 5,084 bytes and now stays below 1,000.
- The actual copied catalog contains 314 eligible offers. Page-one raw HTML is 306,127 bytes (previously 719,062), gzip about 21.2 KB: table 171,321, mobile 66,001, scripts 54,064, shell 14,741. No rows or billing/source evidence were removed to improve the count.
- Mobile Lighthouse measured performance 94, LCP 2,567 ms, TBT 94.5 ms and CLS 0.0912, with a slow-page/incomplete-results warning. These are measurements, not a claim that every performance target passed. Task 1.7 remains partial; its shared-row alternative is explicitly Phase 4 in the master plan, so the narrow exception proposal awaits owner approval.

## Update — 30 September 2026 (Task 3.0 concrete approval gate)

- Prepared the exact three-file Highlighter contract patch and readable approval summary in `docs/progress/highlighter-contract-{proposal,approval}-2026-09-30.*`. Binding DESIGN/PRODUCT/PRODUCT_CONTRACT files remain unchanged. All contract sections outside Design invariants and PRODUCT sections outside Personality/Anti-references are byte-identical.
- D-8 approval remains pending. No Phase 3 assets, fonts, tokens or brand implementation have landed. The separate Task 1.7 shared-row exception also remains pending; elapsed time is not approval.

## Update — 30 September 2026 (Task 1.6 CSS cascade)

- Wrapped custom token/element rules in base and class rules in components; Tailwind theme remains outside. Merged four duplicated base selectors while preserving their responsive overrides. Desktop mobile-filter visibility failed before layering and passes afterward.
- Compared 108 before/after route/viewport/theme images (18 routes × 390/1024/1440 × light/dark): zero overflow and theme mismatch. Reviewed price/source-evidence wrapping and disclosure spacing; source notes now remain legible at both widths. Removed entrance-opacity choreography, made active-navigation inversion atomic and corrected dark selected-action contrast exposed by axe.
- Final Next 16.3.6 production browser run: 159 passed in 50.0 s, including all 54 unchanged visual comparisons and all serious/critical accessibility gates. Compact comparison/Lighthouse evidence is saved in `docs/qa/2026-09-30/`.

## Update — 30 September 2026 (Tasks 2.2 / 2.4 final local gates)

- Added pinned-lock Playwright/axe dependencies, three viewport/theme projects, 54 visual baselines and 159 executable browser cases. Default browser runs create a deterministic synthetic in-memory SQLite backup in `/tmp`, migrate only that copy, build and start production. No actual snapshot API or real terms approval is involved.
- CI now installs cleanly, audits production dependencies, validates raw CSV, lints, typechecks, runs units and retained guide checks, prepares the synthetic database, builds, installs Chromium and runs the browser gate. The job has a 20-minute limit and uploads reports/traces on failure. Remote Actions was not run and nothing was pushed.
- Fresh production audit failed with critical GHSA-vcvr-r3jv-pc5j; Next/eslint-config-next upgraded to patched 16.3.6. Production audit now reports zero vulnerabilities. Clean `npm ci` exits 0; its development-only advisory output is outside the configured production audit gate. Finder experimental config helper still passes its existing test.
- Final patched production build and unchanged-baseline browser suite pass: 159 cases in 50.0 s. After clean install, required commands pass: 179 tests / 37 suites (2.18 s), TypeScript and full src/scripts/tests ESLint exit 0; build on `/tmp/bestvpsforme-pricing-ykaym217/catalog.db` compiles in 1,213 ms, TypeScript in 1,937 ms and generates 16 static pages.
- Preserved the existing content CI aggregate; its analytics check uses a separate disposable database. Its workflow assertion first failed after the pipeline rewrite and passed when retained; all ten content commands and data/CI schedule checks pass. The retained source-baseline assertion also failed because it expected the obsolete row-289 staging error; updated it to the actual seven warnings / nonpublishable-row policy and confirmed it passes. No additional tracked file was deleted.
- Dev review server is running on the actual migrated `/tmp` backup at `http://127.0.0.1:3002`. Fresh Hostinger HTML is 200 and says “Renewal not reviewed”; expanded due-today and renewal values are “Not published”. Saved excerpt and screenshot: `docs/qa/2026-09-30/hostinger-final-{excerpt.txt,pricing.jpg}`.
- Phase 0 remains unchanged. Phase 1 leaves only the Task 1.7 payload target and owner terms/production gates open; Phase 2 leaves further retirement/coverage work and the fewer-than-15 npm target open. D-8 remains pending. The owner’s saved prompt is preserved; no production database mutation or push occurred.

## Update — 30 September 2026 (remaining Task 2.3 scope)

- Independent read-only review identified four defensible next retirements and nine precise coverage gaps; saved `docs/progress/source-check-next-batch-2026-09-30.md`. It does not claim the remaining 131 checks are all redundant. No further deletion is authorized or performed.
- The next executable series is: remaining Task 1.7 rendering target if its narrow exception is approved; four-file retirement approval and listed coverage ports; owner review of the 43-plan terms queue; separately approved production migration/publication; D-8 contract gate and a detailed Phase 3 plan before brand code.
- Latest implementation commits: `b67bd0d` disclosures/labels/comparison, `7b20ee9` SSR/transport, `b98a3b4` exact contract proposal, `8a79354` CSS layers/readability, `8e00fa9` browser/CI/security patch and final proof. Review server remains running on `/tmp`; saved prompt is the only expected untracked file.

### 30 September — Phase 1/2 completion goal, behavior coverage

- Owner requested finishing both implementation phases. Execution plan: `docs/progress/phase-1-2-completion-plan-2026-09-30.md`. Completion remains conditional on actual catalog payload and the remaining owner-approved script retirement. No completion checkbox is inferred from intent.
- Fresh `npm test`: 246 tests / 50 suites passed at 18:53 (67 additional cases). New real SQLite/server/rendered tests cover admin authentication, audit/revision feedback, import confirmation/publication/rollback/cache calls on synthetic in-memory fixtures, correction validation/rate limiting/Turnstile boundaries, health responses, metadata/sitemap, email transport boundaries, published JSON-LD, editorial disclosure, media geometry, catalog failures, active snapshot dates and partnership fields. Correct existing behavior was characterized without inventing failing production behavior.
- Fifteen retained mixed CLIs now exercise real behavior or assets instead of inspecting application source/report phrases. All fifteen targeted commands passed; full TypeScript and src/scripts/tests ESLint passed. The separate production failure matrix passed with owned disposable SQLite databases. Useful maintenance checks remain available. No tracked file was deleted.
- Read-only admin browser contracts and public decision/navigation/reduced-motion contracts passed targeted runs; the complete expanded browser gate remains pending. New large-fixture browser checks exposed mobile paid-link target size, mobile admin command naming and raw search text under `query_hash`; fixes and fresh verification remain in progress.
- Real pricing terms, actual production migration/publication and the D-8 brand gate remain unapproved. The real database and saved prompt are preserved. No push.

### Completion-goal implementation and copied-data verification

- Fresh unit gate: 252 tests / 53 suites passed; full tsc and src/scripts/tests ESLint passed. Production audit reported 0 vulnerabilities; raw 457-row CSV validator passed with 7 documented missing-fact warnings.
- Reproduced real browser failures before fixing mobile paid-link 44px targets, mobile admin command accessible name and raw search query leakage. SHA256 fingerprints now replace raw filter text; the server drops malformed hashes/raw search fields. Unit regressions failed before the fixes and pass afterward; browser confirmation remains underway.
- Implemented lossless field-position/string-pool transport and semantic helper classes. The HTTP payload guard independently measured 50 desktop / 20 mobile rows: 306,062 bytes before; 258,141 after. The 150,000-byte target remains failing, so Task 1.7 and Phase 1 are not complete. The narrow shared-row exception remains pending.
- Actual-copy Next 16.3.6 build passed 16 static pages. Both retained runtime and full-dataset integration CLIs passed, using read-only backups and unchanged snapshot counts: 322 published offers / 43 providers, 314 recommendation-eligible offers, exhaustive routes/API/sitemap / HTTPS destinations/admin/analytics checks and actual lazy-logo failure fallback.
- The 14-entry npm menu, direct editorial CI commands, browser profile coordinator and active runbook updates are prepared. Exact 56-file deletion proposal is recorded; none of those files has been deleted and the prior21-file approval is not reused. Remaining independent checks still run directly.
- Dev server 3002 uses `/tmp/bestvpsforme-e2e/current-data.db`. Hostinger HTML proof is `docs/qa/2026-09-30/hostinger-goal-pricing-excerpt.txt`: due today/renewal are unknown, with no fake $6.49 claims. Manual browser focus commands timed out; the requested HTML alternative is saved. No real database change, snapshot publication, term approval or push occurred.

### Owner-approved final retirement and Phase 2 completion

- Owner explicitly approved the exact 56-file proposal. All 56 listed tracked files were deleted; prior 21 + new 56 = 77 approved retirements. Retained 76 meaningful checks have no direct application-source readers. Npm menu 14; active callers/workflow/runbooks updated and 19 historical reports annotated. No other tracked deletion is authorized.
- Final browser coordinator passed 240 checks on 16.3.6: 210 standard, 24 large, 6 synthetic authenticated admin actions. 54 visual baselines pass; only three mobile paid-link target captures updated after review. Fixture/build mismatch was corrected and home/privacy baselines preserved. Four actual browser regressions were reproduced and fixed.
- After retirement: 252 tests / 53 suites, full TypeScript/ESLint passed. All ten explicit editorial CI commands pass. Production audit 0, raw CSV pass, both actual-copy and synthetic-fixture builds pass. Complete local CI component gate verified; remote Actions unrun because pushing is prohibited.
- Phase 2 implementation is Complete, including Tasks 2.1–2.4. Phase 1 Task 1.7 remains open: 258,141 raw bytes exceeds 150,000. Shared responsive-row scope is still pending; pricing terms and production rollout remain separate owner decisions. The active completion goal is not marked achieved.

- Final actual-copy build passed again after all app fixes (stdout saved in required-checks). Fresh 16.3.6 Lighthouse: performance 94, LCP 2568ms, TBT 132.5ms, CLS 0.0912; slow-load/incomplete-results warning persists. No performance acceptance pass is inferred; raw page 258,141 bytes still exceeds 150,000.

### 30 September — Phase 1 complete: production rollout + shared responsive catalog DOM

- **Production rollout (Tasks 1.9 + 1.10) executed on the real database** after rehearsal on a disposable copy. Backup: `data/bestvpsforme.db.pre-phase1-rollout-*`. Steps: migration applied, dated ECB rates imported for 2026-08-31 (EUR 1.1596, GBP ~1.3537), reviewed price terms applied to 59 plans (`terms_reviewed_by/at` + `renewal_source` audit fields on price rows), 263 fabricated renewal/due-today values nulled, 106 EUR/GBP rows converted to USD with `exchange_rate` evidence, publication snapshot v5 created. Terms were approved only where stored provider notes explicitly state them (`data/price-terms-review-2026-08-31.json`); unknowns stay unreviewed rather than invented.
- **Task 1.7 completed via the shared responsive DOM.** `DealTable` now renders each offer once in a semantic `<table>`; rows reflow into cards under 760 px with the mobile-only Details toggle (aria-expanded/controls + labelledby region), catch and location inside the same `<tr>`. `MobileDealList`/`MobileOfferRow` and the dead `.mobile-deal` card-chrome CSS were deleted; icons moved to the `catalog.svg` sprite; provider logos use bare 46×46 frames; spec cells use terse b/i markup with explicit "Not published" wording.
- **Owner decision recorded:** `CATALOG_PAGE_SIZE` 50 → 24 so the shared DOM fits the 150 KB budget with all row features intact; mobile shows 20 rows then "Show 4 more". Measured **109,008 bytes** raw HTML for page one (from 719,062 originally; dual-layout floor was 258,141).
- **Verified end to end:** 252 unit tests / 53 suites, tsc and ESLint clean, production build passes, catalog payload check 109,008 B (< 150,000), runtime-rendering check (24 shared rows, table at 1440 px / 20-row windowed cards at 390 px, logo fallback), accessibility runtime (axe, keyboard disclosure, reduced motion), full e2e coordinator 240 checks (210 + 24 large + 6 admin), bundle route ceilings. Visual baselines regenerated for the intentional layout change. Live pages spot-checked: netcup shows "€5.91 · ECB 1.1596 on 31 Aug" → $6.85; Hostinger shows "Terms reviewed" + $11.99 renewal.
- **Phase 1 is now complete.** Remaining gates are the D-8 brand contract approval (Phase 3) and the Phase 4–8 work in bigone.md. Nothing pushed; remote Actions still unrun.

### 30 September — Phase 3 complete: Highlighter brand foundations landed in the app

- **D-8 gate committed** (`c203d65`): PRODUCT_CONTRACT, DESIGN.md and PRODUCT.md updated to the Highlighter identity (Mona Sans + Geist Mono, ink/paper/volt/vermilion, volt never as text on paper, sticker once per page, pill buttons, 24–32 px hero radii). All integrity/a11y/data invariants unchanged.
- **Tokens:** `src/styles/tokens.css` mirrors `brand/tokens/tokens.css` inside `@layer base`; `globals.css` adds `@theme inline` semantic mappings plus temporary legacy aliases (legacy `--primary` maps to ink, not volt, because existing code uses it as a text color). New Vitest contrast suite (`src/styles/tokens.contrast.test.ts`) parses the token file, resolves var-chains per theme, and asserts all ten BRAND.md §3.4 pairs meet WCAG AA — 10/10 pass.
- **Fonts:** variable `MonaSans.woff2`/`GeistMono.woff2` (axes preserved: Mona `wdth` 75–125, `wght` 200–900) served through `next/font/local` in `layout.tsx`; IBM Plex removed entirely.
- **Brand components:** `src/components/brand/{Mark,Wordmark,Lockup}.tsx` generated inline SVGs (generator: `brand/logo/build_components.py`) — theme-aware via `currentColor`/`var(--bg)`, letters over the volt band keep literal ink, `aria-label="bestvpsforme"`. The shell wordmark link renders the horizontal lockup.
- **Icons:** `src/app/icon.svg` (brand favicon), `apple-icon.png`, `manifest.ts` with 192/512 marks and `theme_color #0E1116`; `icon.tsx` deleted; `public/icons/mark-{192,512}.png` added.
- **OG images:** `src/app/opengraph-image.tsx` and `src/app/offers/[id]/opengraph-image.tsx` reproduce the marketing templates via `ImageResponse`; both verified live as `image/png` 1200×630. Adaptation: Satori rejects WOFF2 and variable TTF tables, so `src/lib/og-fonts/` carries static instances (Mona 500/600/700/800, Geist Mono 500/600) built with `fontTools.varLib.instancer` pinning all axes. Also fixed a Next 16 `params` Promise await and an advertised-vs-headline duplicate row. `public/og-default.svg` deleted.
- **Provider marks:** 22 self-hosted marks in `public/logos/marks/` (provider SVGs where published, normalized 64px PNG favicons otherwise; cockbox uses the designed fallback). `providerFaviconSrc` and the DuckDuckGo CSP host removed; the 22 obsolete logo files and `trustpilot.svg`/`trustpilot-star.svg`/`rating-star.svg` deleted.
- **ProviderMark + Trustpilot:** `.pmark` normalized tile (24% radius, 16% inset, inset hairline) wraps `ProviderLogo`; TrustStars renders plain text only per D-5 (score · "Trustpilot" · review count) — star art gone; tests updated to the new contract.
- **Verified:** 262 unit tests / 54 suites, tsc + ESLint clean, production build passes (both OG routes generate), catalog payload 116,830 B (< 150,000), runtime rendering + accessibility runtime checks pass, e2e green (150 public-routes incl. 54 regenerated visual baselines, 27 ui-contracts, 24 large-catalog). Home and catalog spot-checked on the real DB with the new lockup, Mona Sans and self-hosted marks rendering.
- **Phase 3 complete.** Next: Phase 4 — component system, shell, home and catalog rebuilt to `brand/mockups/`. Nothing pushed; remote Actions still unrun.

### 30 September — Phase 4 complete: shell, home and catalog on the Highlighter system

- **Shell:** `SiteChrome` replaced by `SiteHeader` (⌘K command palette, theme toggle, compare link, mobile menu), `DisclosureBar`, `SiteFooter`, and a global `CompareTray`. `/` focuses catalog search; ⌘K opens the palette.
- **Home (§D2):** X-ray card driven by an admin-chosen published offer (`site_settings` table, migration 0014), provider ribbon, mad-lib fit line, proof/method/FAQ sections — every number sourced from `getSnapshotStats()`.
- **Catalog (§D3):** token-styled filter rail (price bands, honesty switches, regions, provider counts), dot-scatter summary strip, catch column, 24-row pagination, density toggle, mobile sheet with focus trap. `/system` dev-only gallery added (404 in production).
- **CSS:** `system/home/catalog.css` under `@layer components`; ~1,370 dead CSS lines removed; zero arbitrary Tailwind values in components.
- **Standalone fix:** `postbuild` copies `public/` + `.next/static` into `.next/standalone/` so `node .next/standalone/server.js` serves assets.
- **Verified:** 261 unit tests, tsc + ESLint clean, 240 browser checks (186 standard + 24 large + 6 admin-actions + 24 admin-readonly), 54 regenerated baselines, catalog HTML ~130 KB.

### 30 September — Phase 5 complete: offer, compare, providers, guides, methodology, system pages

- **Offer (§D4):** receipt with 3-year real price, cumulative cost chart vs ad-implied cost, honest spec grid, evidence cards, cross-provider alternatives, sibling chips, sticky mobile buy bar, correct `sponsored nofollow` CTA semantics.
- **Compare (§D5):** server-rendered from `?p=`, best-in-row highlight with tie handling, all/differences toggle, verdict cards, empty-state presets, copyable share URL.
- **Providers (§D6):** index with aggregated cards + detail pages (identity, Trustpilot, what-to-know cards, plan inventory).
- **Guides (§D7):** topic-filtered index, article layout with TOC + aside, `:::callout`/`:::formula`/`:::plans` directives.
- **Methodology (§D8):** renders `VALUE_WEIGHTS` from `src/lib/score.ts`; published independence statement.
- **System (§D9):** `/updates` snapshot history with added/removed/changed diffs, 404, error boundary, admin token adoption.
- **Morph:** `PlanMorph` + `planViewName` give catalog rows and the offer hero a shared `view-transition-name`, with a no-op fallback where `React.ViewTransition` is unavailable and instant behavior under reduced motion.
- **Verified:** 253 unit tests, tsc + ESLint clean, 240 browser checks across three profiles, 54 regenerated baselines.

### 1 October — Audit correction pass: evidence gate restored end to end

- **Trigger:** read-only audit found the new Phase 4/5 surfaces recomputing projections with `usdTerms`/`costSeries`, bypassing the publication mapper's reviewed-price decision — unreviewed plans displayed fabricated "3-year real" prices.
- **Boundary:** `reviewedPrice(offer)` in `src/lib/real-price.ts` is now the single public projection; it returns null unless the mapper approved `realMonthly` (reviewed terms + setup + renewal). Offer page, cost chart, compare, provider ranges, alternatives, home X-ray, `PlansMentioned` and the value score all consume it. A `score -1` keeps unreviewed plans out of "recommended" ranking.
- **Cash timing:** the chart's "Day 1: due" claim removed — the series allocates service cost, never payment dates; receipt labels "prepay" only from reviewed `billedUpfrontMonths` and renewal timing from intro/upfront months, not commitment length.
- **Honest labels:** X-ray card and catalog rows show "Effective price · Renewal not reviewed" instead of a fake real price; "No catch found" now requires editorial review, not just price-term review (`editorialReviewed` field).
- **Evidence quarantine:** `unsupportedRenewalReason` rejects "flat rate" renewals inferred from silence — in `mapPublishedRow`, `approvePriceTerms`, `publishImportJob`, and the standalone `apply_price_terms_publish.ts` validator (which now requires a human `approval` block before touching a DB). The 16 suspect published rows are queued for owner review in `docs/data/renewal-correction-queue-2026-10-01.*`; no production data was changed.
- **Compare:** real semantic `<table>` (row/column headers, `headers` attributes), RAM + catch + location rows added, "Only differences" equality includes descriptive facts and treats known-vs-unknown as different, Clear navigates the URL to the empty comparison, verdict math fixed (ratio not raw count), columns labeled "Your selection" instead of a false sort claim.
- **Mobile:** compare tray reserves space above the offer buy-bar via `--offer-buy-bar-height`; alternatives table scrolls in a bounded region; provider filter links use `aria-current`; guide TOC tracks the current section.
- **Admin X-ray save:** `saveHomeXraySetting` requires an eligible reviewed offer + mandatory reason, writes settings and audit log atomically, returns `AdminActionResult` feedback, and revalidates `/`.
- **Coverage:** six browser projects (desktop light/dark, tablet light/dark, mobile light/dark); `/providers` + populated `/compare` added to the route matrix; dedicated `audit` fixture profile (`E2E_AUDIT_FIXTURE`) exercising reviewed/unknown mixed data; `check_guides_index` and `check_catalog_payload` rewritten against the current DOM; `check_accessibility_runtime` rewritten on Playwright instead of raw CDP.
- **Status:** unit/typecheck/lint green; full browser coordinator and baseline regeneration verified below. No push; remote Actions still unrun.
