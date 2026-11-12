# bestvpsforme implementation progress

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


Historical record: some npm checks named below were retired with owner approval on 30 September 2026. See the [retirement record and current replacements](../progress/source-check-retirement-2026-09-30.md). Original command references remain as dated evidence.

This is the everyday project board. The deeper architecture, data model, and reasoning remain in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).

## Status key

| Mark | Meaning |
|---|---|
| ✅ Done | Implemented, checked, and committed |
| 🟡 In progress | Work has started but is not complete |
| ⏭ Next | The next safe task to start |
| ⬜ Planned | Not started yet |
| ⛔ Blocked | Cannot publish until the stated issue is resolved |

## Project snapshot

| Phase | Outcome | Progress | Status |
|---|---|---:|---|
| 1. Foundation | Reproducible repository and quality gates | 8/9 | 🟡 In progress |
| 2. Database | One durable source of truth | 12/12 | ✅ Done |
| 3. Data import | Reviewed CSV and affiliate data publishing | 18/18 | ✅ Done |
| 4. Admin | Secure, durable operations for one owner | 16/16 | ✅ Done |
| 5. Public data | Existing frontend powered by published records | 13/13 | ✅ Done |
| 6. Analytics | Click, affiliate, conversion, and revenue truth | 17/17 | ✅ Done |
| 7. Trust and operations | SEO, email, corrections, and routine checks | 16/16 | ✅ Done |
| 8. Launch | Tested, secure, backed-up production service | 22/24 | 🟡 In progress |
| 9. Growth | Fresh data, measurable learning, and low-maintenance iteration | 10/10 | ✅ Done |
| 10. Guides | Beginner education and first-party research acquisition | 12/12 | ✅ Done |

Current focus: complete the Guides content system and record exact production-host blockers for deployment, recovery, alerts, and launch. The local release gates remain green while owner infrastructure access is pending.

## Audit remediation workstream

Detailed implementation instructions and phase gates are in [REMEDIATION_PLAN.md](REMEDIATION_PLAN.md).

| Phase | Objective | Tasks | Status | Exit condition |
|---|---|---:|---|---|
| R0. Evidence | Freeze invariants and add regression fixtures | 4/4 | ✅ Done | Product contract, deterministic fixture, responsive baseline, and 14-check remediation gate pass |
| R1. Data truth | Publish the reviewed database as the only public source | 9/9 | ✅ Done | Full approved snapshot renders without static offer dependencies |
| R2. Catalog | Make mobile scanning compact while preserving desktop density | 8/8 | ✅ Done | Compact, bounded mobile results; progressive detail; stable URL-backed filters; explicit states; desktop table density and semantics retained |
| R3. Accessibility | Correct controls, labels, headings, keyboard, and contrast systemically | 7/7 | ✅ Done | Label, landmark, keyboard, contrast, and icon-semantic checks pass in both themes; automated remediation gate passes |
| R4. Public polish | Clarify homepage, provider, offer, compare, dates, and copy | 7/7 | ✅ Done | Beginner decision journey is concise, dynamic, consistent, and uses plain-language public copy |
| R5. Admin | Put every real secure operation inside one durable admin shell | 9/9 | ✅ Done | Authenticated operations share one tokenized shell; published database state drives overview/analytics; audited offer and guarded import mutations expose pending, success, validation, authorization, stale/conflict, and request-ID server-error feedback; dense tables stay readable and responsive |
| R6. Runtime cleanup | Remove paused residue and harden CSP, errors, media, and bundle | 7/7 | ✅ Done | Active docs, package metadata, runtime labels, CSP, analytics taxonomy, rendering, media, and bounded failure behavior agree with the pre-production application |
| R7. Release proof | Test full data and complete real production rehearsal | 5/8 | 🟡 In progress | Automated, exhaustive full-data, viewport/theme/zoom, runtime accessibility, and cold/mobile performance gates pass; field validation, deployment, recovery, and launch review remain |
| R8. Guides | Build the low-cost Guides/Research acquisition engine | 12/12 | ✅ Done | Content governance, typed frontmatter, responsive index, safe article template, author/editorial policy, structured metadata, published-only discovery, privacy-safe content analytics, six reviewed Guides, dated dataset report, CI/freshness queue, and measured keep-MDX workflow decision are complete |

Remediation total: **71 tasks**—59 detailed repair/release tasks in R0–R7 plus the 12 existing Phase 10 Guides tasks referenced by R8. Execute R0 first. Do not count already-completed historical phases as evidence that these new audit-specific acceptance gates pass.

### R0 — Evidence and regression foundation

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| R0-01 | Record route and product invariants | P0 | ✅ Done | `docs/product/PRODUCT_CONTRACT.md` freezes 10 critical routes, integrity, design, accessibility, publication, and security behavior; `npm run remediation:contract-check` enforces the contract and Finder compatibility redirect |
| R0-02 | Create a deterministic production-like data fixture | P0 | ✅ Done | Disposable migrated SQLite fixture covers 3 provider states, 6 offer publication/completeness states, direct and approved-affiliate programs, fresh/stale prices, 3 locations, unknown facts, and a published rollback snapshot; `npm run remediation:fixture-check` proves deterministic counts and persistence |
| R0-03 | Capture baseline viewports | P1 | ✅ Done | 20 indexed PNG captures cover home and catalog light/dark plus cards, compare empty/filled, offer, provider, and protected admin login at 390×844 and 1280×720; the report records heights, heading defects, overflow results, and the authenticated-admin deferral; `npm run remediation:viewport-check` verifies durable evidence |
| R0-04 | Add a remediation check script | P0 | ✅ Done | `npm run remediation:check` runs ordered fail-fast contract, fixture, viewport, immutable-source baseline, database, publication-policy, public-route, ranking, frontend, lint, and production-build checks; the source baseline expects row 289 to remain blocked while publication policy keeps it non-public |

R0 phase exit: passed. The remediation target, deterministic data states, visual baseline, and fail-fast regression command are committed before public data mapping changes begin.

### R1 — One reviewed public data truth

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| R1-01 | Resolve row 289 safely | P0 | ✅ Done | Immutable CSV SHA-256 is pinned; Cherry Servers “Virtual Server (from)” retains the empty effective-monthly field and official source, receives exactly `missing-effective-monthly`, and is non-publishable; `npm run data:blocker-check` passes without inventing a monthly price |
| R1-02 | Define warning policy by field | P0 | ✅ Done | Typed completeness policy covers the exact CSV missingness counts for RAM (10), vCPU (10), disk (46), bandwidth (146), and Trustpilot (8); each stays explicitly unknown and outside dependent numeric filters while missing effective price remains blocking and affiliate completeness remains provider-scoped; `npm run data:completeness-check` passes |
| R1-03 | Separate raw, normalized, and editorial data | P0 | ✅ Done | New `offer_editorial` table and typed save/read boundary keep summary, fit, catch, and review state outside imported facts; regression stages exact raw source, verifies normalized values, publishes, re-imports changed facts, and proves reviewed copy is unchanged; `npm run data:layer-check` passes |
| R1-04 | Complete provider normalization | P0 | ✅ Done | All 63 researched identities have stable canonical slugs/names, deterministic monogram/hue fallback, optional verified HQ/logo metadata, source Trustpilot fields, and six legacy aliases; published provider records persist the profile without inferring HQ from server location; `npm run data:provider-check` and `npm run data:provider-profile-check` pass |
| R1-05 | Remove static-offer dependency from DB mapping | P0 | ✅ Done | Published rows now batch-load reviewed editorial copy, locations, and approved affiliate state; offers absent from `src/lib/offers.ts` map into catalog/detail/compare/provider data, while missing CPU/RAM/disk remain explicit `null` and are excluded only from dependent filters; `npm run data:static-independent-check` passes |
| R1-06 | Make provider rendering data-driven | P0 | ✅ Done | Public offers carry their published provider profile; catalog, compare, detail, shortlist, recommendations, filters, and admin consumers use a safe resolver; DB trust/HQ/logo fields override legacy data and unknown providers receive a deterministic monogram/hue with no crash; `npm run data:provider-rendering-check` passes |
| R1-07 | Replace implicit development fallback | P0 | ✅ Done | Count-based and generic development fallbacks are removed; `BESTVPSFORME_PUBLIC_DATA_MODE=fixture` is an explicit local-only opt-in that is ignored in production; empty/unreadable publication returns a catalog unavailable state, public API 503, and readiness 503; `npm run data:public-mode-check` passes |
| R1-08 | Stage, review, and publish the full source | P0 | ✅ Done | Immutable 457-row source published through one reviewed transaction: 322 offers, 43 active providers, 322 open prices, 784 location links, and one 322-row active snapshot; 355 issues retain evidence with 169 allowed-unknown and 186 non-public policy resolutions, 0 unresolved; rollback and clean republish pass `npm run data:full-publication-check`; local evidence is recorded in `docs/data/publication-2026-08-31.md` |
| R1-09 | Prove public parity | P0 | ✅ Done | Active snapshot IDs reconcile exactly with 322 catalog objects, API payload, offer detail lookups, homepage count, 43 provider-page aggregates, unique sitemap offer/provider URLs, and HTTPS destinations; approved tracking links and direct links match public affiliate disclosure; `npm run data:public-parity-check` passes |

R1 phase exit: passed. The reviewed database is the only implicit public truth; the local active publication exposes exactly 322 approved offers across 43 providers, while static fixtures require an explicit non-production flag.

### R2 — Mobile catalog scanning

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| R2-01 | Define the mobile information hierarchy | P1 | ✅ Done | `MobileOfferRow` is the only owner of the four-band mobile result contract: provider/plan/price, CPU/RAM/disk, trust/location/catch, then compare/deal actions; unknown facts remain named; `npm run ui:mobile-hierarchy-check` passes |
| R2-02 | Build compact collapsed rows | P1 | ✅ Done | Mobile rows now use three compact scan bands with 40px provider identity, tabular effective price, three equal-width icon-led hardware cells, one-line trust/location/catch evidence, overflow guards, and 44px compare/deal targets; `npm run ui:mobile-compact-check`, lint, and production build pass |
| R2-03 | Add accessible progressive detail | P1 | ✅ Done | Every row has one focus-stable `aria-expanded`/`aria-controls` button and labelled inline region; secondary content mounts only when opened and covers full locations, billing, renewal, term, CPU type, bandwidth, availability, catch, and affiliate/direct disclosure without another bordered box; `npm run ui:mobile-detail-check` passes |
| R2-04 | Bound the initial result set | P1 | ✅ Done | Mobile list mode mounts 20 rows initially and 20 per explicit increment, reports shown/total/remaining counts, never maps the full source directly, and remounts the result window when the serialized URL query changes; expanded detail remains deferred; `npm run ui:mobile-bound-check` passes |
| R2-05 | Improve mobile filter access | P1 | ✅ Done | Mobile/tablet toolbar now exposes a labelled 44px Filters button, removable horizontal active-filter chips for every query constraint, Clear all, and existing drawer focus trap/Escape/restore behavior; `npm run ui:mobile-filter-check` passes |
| R2-06 | Make result state persistent and understandable | P1 | ✅ Done | Catalog now serializes all constraints, sort, and view into shareable URLs, pushes user changes into browser history, restores state on `popstate`, and keeps active chips/result counts near the heading; `npm run ui:catalog-state-check` passes |
| R2-07 | Add loading, empty, and data-unavailable states | P1 | ✅ Done | Mobile list has deferred skeleton rows with `aria-busy`, no-match recovery with Clear filters, and a separate retryable `role=alert` unavailable state; `npm run ui:catalog-states-check` passes |
| R2-08 | Preserve desktop comparison density | P1 | ✅ Done | Desktop table keeps horizontal containment, sticky header at the site chrome, aligned numeric/spec/price columns, row navigation safeguards, and explicit `scope=col`/actions semantics; `npm run ui:desktop-table-check` and `npm run ui:r2-exit-check` pass |

R2 phase exit: passed. Mobile catalog scanning is compact and bounded with progressive details, shareable filter state, explicit loading/empty/unavailable feedback, and a preserved desktop comparison cockpit.

### R3 — Accessibility and component-system correction

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| R3-01 | Establish control-size tokens | P1 | ✅ Done | Shared `--control-compact: 32px` and `--control-touch: 44px` tokens now drive public deal/compare controls, mobile filter close, nav theme toggle, homepage/correction primary actions, and responsive admin icon buttons; `npm run ui:control-token-check` passes |
| R3-02 | Normalize button states | P1 | ✅ Done | Shared public `.ui-button` vocabulary covers primary, secondary, quiet, icon, destructive, disabled/loading, focus, hover, and active states; admin primitives carry the same state behavior and compact/touch token sizes; `npm run ui:button-state-check` passes |
| R3-03 | Label every input | P1 | ✅ Done | Catalog search/sort now have explicit labels; import-review resolution notes have generated labels/ids; existing filter, correction, login, admin, and Finder controls are covered by `npm run ui:input-label-check`, lint, and production build |
| R3-04 | Correct heading and landmark hierarchy | P1 | ✅ Done | Public and admin routes now expose a main landmark; shared chrome has named header/nav/footer landmarks; compare empty state uses h2 and provider catalog headings no longer create duplicate h1s; `npm run ui:heading-landmark-check`, lint, and production build pass |
| R3-05 | Verify keyboard flows | P1 | ✅ Done | Filter drawer, mobile detail, catalog slash search, compare controls, admin editor, and command palette now have explicit Escape/focus behavior and dialog traps; `npm run ui:keyboard-flow-check`, lint, and production build pass |
| R3-06 | Verify contrast in both themes | P1 | ✅ Done | Semantic light/dark text, status, action, and link tokens are checked with OKLCH-to-sRGB ratios at the 4.5:1 normal-text target; `npm run ui:contrast-check`, lint, and production build pass |
| R3-07 | Normalize icon semantics | P2 | ✅ Done | Decorative icons in primary public/admin controls are explicitly hidden, icon-only controls retain accessible names, and the non-interactive provider marquee is no longer tab-stoppable; `npm run ui:icon-semantics-check`, lint, and production build pass |

R3 phase exit: passed. Public and admin controls now have explicit names, predictable landmarks/headings, keyboard-safe dialogs and progressive rows, measured light/dark contrast, and consistent decorative-icon semantics.

### R4 — Public decision journey

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| R4-01 | Replace the lower homepage explanation | P1 | ✅ Done | Homepage now has one concise “The details we never hide” section, a quiet proof strip, and a direct catalog CTA with no repetitive listicle block; `npm run ui:home-polish-check`, lint, and production build pass |
| R4-02 | Make snapshot dates dynamic | P1 | ✅ Done | Active snapshot date is read from the published database record and shared by layout/footer, catalog, provider, methodology, updates, and privacy surfaces; `npm run ui:snapshot-date-check`, lint, and production build pass |
| R4-03 | Polish provider pages | P1 | ✅ Done | Provider pages now lead with one identity h1, HQ/location coverage, trust snapshot, plan count, official site, and a subordinate catalog heading; `npm run ui:provider-polish-check`, lint, and production build pass |
| R4-04 | Polish offer pages | P1 | ✅ Done | Offer pages now show effective monthly, cash due today, renewal state, fit/catch, hardware, location, trust, and deal/compare actions before progressive secondary details; `npm run ui:offer-polish-check`, lint, and production build pass |
| R4-05 | Improve compare states | P1 | ✅ Done | Empty compare teaches adding from catalog; one-plan state invites a second plan; multi-plan tables use explicit “not published” values and retain clear/remove actions; `npm run ui:compare-states-check`, lint, and production build pass |
| R4-06 | Tighten site chrome and footer | P2 | ✅ Done | Public nav stays limited to active Catalog/Compare routes (Finder absent), mobile nav links meet the 44px touch target, and footer links use compact targets; `npm run ui:chrome-polish-check`, lint, and production build pass |
| R4-07 | Standardize plain-language copy | P2 | ✅ Done | Public footer, updates, methodology, privacy, compare, offer, and rating copy now avoids internal jargon and explains dated data in beginner-friendly language; `npm run ui:plain-language-check`, lint, and production build pass |

R4-06 exit: passed. Public navigation, mobile touch targets, and footer links are consistent and limited to active user-facing features.

R4 phase exit: passed. Public pages now present one concise decision journey with dynamic dates, clear provider/offer/compare hierarchy, restrained site chrome, and plain-language explanations of price freshness, ratings, and privacy.

### R5 — Secure admin operations

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| R5-01 | Separate admin shell from views | P0 | ✅ Done | Reusable `AdminShell` owns the responsive sidebar, topbar, mobile drawer, scrim, and content workspace; the authenticated console and import-review route both use it with shared admin tokens; `npm run admin:shell-check`, lint, production build, and the 48-check remediation gate pass |
| R5-02 | Rebuild login with tokens | P1 | ✅ Done | Admin login uses semantic light/dark tokens, visible labels, password-manager attributes, six-digit input guidance, private-area copy, and invalid/locked/expired states; `npm run admin:login-check`, lint, production build, and the 49-check remediation gate pass |
| R5-03 | Connect overview to real data | P0 | ✅ Done | Admin page passes `getPublicCatalogState()` into the console, overview metrics use the published catalog, and the header distinguishes published data from an empty publication; `npm run admin:overview-data-check`, lint, production build, and the 50-check remediation gate pass |
| R5-04 | Connect offer/provider management | P0 | ✅ Done | Existing offer edits call authenticated `saveOfferFromAdmin`, persist core fields through the audited `saveOfferDraft` writer, and report database failures without discarding local state; new records remain explicitly local drafts until their full editor is wired; `npm run admin:mutation-check`, lint, production build, and the 51-check remediation gate pass |
| R5-05 | Integrate import review | P0 | ✅ Done | Import review, issue resolution, publish, and rollback now render inside `AdminShell` with responsive tokenized panels, metrics, 44px actions, and mobile issue layouts; secure server actions remain in place; `npm run admin:imports-check`, lint, production build, and the 52-check remediation gate pass |
| R5-06 | Add safe publication confirmation | P1 | ✅ Done | Publish requires an explicit confirmation, refuses unresolved blocking errors, shows impact counts and the source checksum, and rollback requires confirmation on the selected snapshot; `npm run admin:publication-confirmation-check`, lint, production build, and the 53-check remediation gate pass |
| R5-07 | Make analytics operational | P1 | ✅ Done | Admin analytics now reports unique visitors/sessions, outbound rate, clicks, conversions, commission/EPC, most-clicked offers, providers, placements, and country visitors from the database snapshot; empty datasets say “Not collected yet” and never render fabricated catalog rows. `npm run admin:analytics-check`, analytics checks, lint, and production build pass |
| R5-08 | Standardize dense admin tables | P1 | ✅ Done | Offer, provider-economics, metric, click, visitor, country, snapshot, and issue surfaces keep 11–13px table text, sticky headers, tabular numeric alignment, bounded horizontal/vertical scrolling, logos/flags, and 44px mobile row actions; inline import colors/styles were removed. `npm run admin:tables-check`, lint, production build, and the 55-check remediation gate pass |
| R5-09 | Add durable action feedback | P1 | ✅ Done | Offer and import mutations expose announced pending/success feedback, keep failed forms open, distinguish validation and expired authorization, reject stale offer revisions plus already-published/resolved/rolled-back conflicts, and attach safe request IDs to logged server failures. `npm run admin:feedback-check`, focused admin checks, lint, production build, and the 56-check remediation gate pass |

R5 phase exit: passed. A fresh authenticated admin uses one shell for published data, audited offer edits, reviewed import publication/rollback, database-backed analytics, responsive tables, and durable mutation outcomes that never fail silently.

### R6 — Runtime cleanup and hardening

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| R6-01 | Define Finder archival boundary | P2 | ✅ Done | `/for-me` remains a compatibility redirect, while the unused wizard, recommendation rules/types, CSS, feature checks, active dashboard labels, launch wording, and product documentation were removed; Git history is the archive. Organic ranking-independence now checks the active catalog sorter. `npm run runtime:finder-archive-check`, focused checks, lint, production build, and the 57-check remediation gate pass |
| R6-02 | Clean analytics taxonomy | P2 | ✅ Done | Current ingestion and TypeScript event names accept only `page_view`, `catalog_search`, and `compare_add` client events plus server-recorded `affiliate_click`; `finder_start`/`finder_complete` rows remain valid historical text rows but are explicitly excluded from every current report denominator and dashboard contract. `docs/product/ANALYTICS_CONTRACT.md` documents compatibility; `npm run analytics:taxonomy-check` proves rejection, direct historical queryability, KPI exclusion, and active-event acceptance; focused checks, lint, production build, and the 58-check remediation gate pass |
| R6-03 | Split development and production CSP | P1 | ✅ Done | One shared header factory keeps every non-CSP header identical while adding `'unsafe-eval'` only for `NODE_ENV=development`. `npm run launch:headers-check` executes both environment policies and proves production exclusion. Live checks against Next dev and `next start` confirmed the emitted policies; headless Chromium loaded the development homepage with zero CSP eval violations. Focused checks, lint, production build, and the 59-check remediation gate pass |
| R6-04 | Audit client bundle and rendering | P1 | ✅ Done | Empty comparison state no longer downloads 322 offers; saved/added comparisons request at most four validated IDs and malformed subset requests fail closed. Catalog result views and the comparison dock are split, non-default admin metrics are deferred, and desktop/mobile catalog trees never mount together. Fresh raw initial-client-JS measurements are home 45,490 B, catalog 107,095 B, compare 74,098 B, admin 187,851 B, admin imports 56,001 B, offer 58,668 B, provider catalog 113,667 B (all below enforced ceilings; catalog was 158,171 B and home 54,423 B before this task). `npm run runtime:rendering-check` builds an isolated 322-offer publication and proves production Chromium mounts 322 desktop rows or 20 mobile rows, never both, while subset lookup returns exactly one offer. Lint, build, focused checks, and the 61-check remediation gate pass |
| R6-05 | Verify media and logo behavior | P1 | ✅ Done | Provider media now uses a fixed square canvas, verified local square/icon assets only, `object-contain`, intrinsic width/height, decorative empty alt semantics, and deterministic immediate letter fallbacks for unknown or unsuitable wide marks. Repeated provider/flag/Trustpilot media is lazy/async; only the homepage lead, offer identity, and provider identity are eager/high-priority. Cherry Servers has a normalized square mark; guessed 404 paths and unreadable 5:1–8:1 wordmarks are excluded. `npm run runtime:media-check` validates 26 verified assets and every source contract; the isolated 322-offer production Chromium profile injects a broken DB path and proves fixed 46/40 px frames, asset and fallback rendering, lazy rows, and eager lead media. Focused checks, lint, production build, and the 62-check remediation gate pass |
| R6-06 | Harden unavailable/error states | P1 | ✅ Done | Database failure and empty publication now have distinct catalog/API/readiness states; offer lookup distinguishes storage failure from a true 404; invalid offers and archived providers share truthful branded 404 copy; uncaught page reads use a local retry boundary that exposes only a digest reference. Broken/missing destinations redirect safely to a catalog alert carrying `x-request-id`; outbound analytics failure cannot block a valid provider redirect; analytics ingestion returns 202/`recorded:false` rather than falsely claiming storage; admin persistence is a dependency-injectable operation returning bounded `server_error` feedback with request ID. `npm run runtime:failure-check` uses temporary databases and production `next start` to inject database down, empty publication, invalid offer, retired provider, dropped analytics tables, broken destinations, and a throwing admin writer; no raw internals reach responses. Focused checks, lint, build, and the 63-check remediation gate pass |
| R6-07 | Remove stale prototype wording and package metadata | P2 | ✅ Done | `package.json`, README, the active implementation status, and admin labels now describe a pre-production database-backed application. The overview renders measured visitors, page views, clicks, outbound rate, conversions, and commission from `AnalyticsSnapshot`; browser draft JSON and policy-note controls are explicitly non-publishing. README now records 20 tables, reviewed publication behavior, compatibility fixtures, the complete gate, and a zero-vulnerability production audit. `npm run runtime:status-check`, admin overview/analytics checks, lint, build, `npm audit --omit=dev`, and the 64-check remediation gate pass |

R6 phase exit: passed. Development diagnostics remain usable under the bounded development CSP exception; production headers forbid `unsafe-eval`; Finder cannot enter current events or KPIs; active runtime/docs expose the durable data path and truthful failure states. Final rerunnable command: `npm run remediation:check` (64 checks, 30.3s on 2026-09-01).

### R7 — Full-data QA and production rehearsal

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| R7-01 | Run the complete automated gate | P0 | ✅ Done | `docs/qa/2026-09-01-automated-release-gate.md` records Node v24.17.0, npm 11.13.0, Next.js 16.3.3, Linux x64, source/public/table counts, measured bundle and redirect results, command groups, and zero unresolved P0/P1 failures. `npm run release:automated-check` reruns the 68-check remediation gate, 49 supplemental DB/import/auth/public/analytics/operations/launch/CI/dependency checks, the exact known source-blocker diagnostic, zero-vulnerability production audit, and report contract; passed in 179.2s |
| R7-02 | Test the full approved dataset | P0 | ✅ Done | `docs/qa/2026-09-01-full-dataset.md` records the isolated production matrix. `npm run release:full-data-check` publishes into a temporary database and exercises all 322 offers and 43 providers across numeric validity, per-SKU search, provider/location/hardware/price/trust/workload filters, six sorts, every offer/provider route, compare batches, sitemap, 322 HTTPS redirects with request IDs, authenticated admin payload, and one analytics click per offer. The first run found `ramnode-std-0.5gb` was rejected by compare/admin validators; shared `isOfferId` now accepts canonical dots while rejecting traversal-shaped IDs. Admin catalog, production rendering, the 68-check remediation gate, and the full 179.2s automated release gate pass with zero orphan, duplicate, crash, missing route/destination/admin/analytics row, impossible numeric value, or unresolved P0/P1 failure |
| R7-03 | Complete viewport/theme matrix | P1 | ✅ Done | `docs/qa/viewport-theme-2026-09-01/README.md` indexes 18 committed contact sheets. `npm run release:viewport-check` uses a temporary 322-offer publication, authenticated admin session, production `next start`, Chromium CDP, and ImageMagick to verify 126 route/theme/profile captures across 320, 360, 390, 430, 768, 1024, 1280, 1440, and 200% zoom in light and dark themes. Every capture has one `h1`, expected route content, no runtime error text, and no page-level horizontal overflow; the shared admin shell now applies the stored theme to `/admin/imports`. Full remediation passes 68 checks in 179.4s and the contact sheets were visually inspected |
| R7-04 | Complete assistive-technology pass | P1 | ✅ Done | `docs/qa/2026-09-01-accessibility.md` records the runtime Chromium accessibility pass. `npm run release:accessibility-check` publishes the full dataset into a temporary database and verifies AX trees, named controls, keyboard search, mobile filter focus trapping/restoration, progressive details, admin palette/drawer Escape behavior, assertive server-error announcements, and reduced-motion CSS at 390px. Existing label, landmark, keyboard, contrast, icon, button-state, filter, and reduced-motion source checks remain in the 68-check remediation gate. No task-blocking local finding remains; deployed VoiceOver/NVDA/TalkBack review remains an explicit production follow-up in R7-06/R7-08 |
| R7-05 | Measure performance budgets | P1 | ✅ Done | `docs/qa/2026-09-01-performance.md` records a cold-cache Chromium profile against the production build with the approved 322-offer publication. `npm run release:performance-check` emulates 390 × 844 mobile, disabled cache, 40 ms latency, 4 Mbps down, and 3 Mbps up; it measures five routes, LCP, CLS, TTFB, filter/search interaction as an explicit local INP proxy, and 30 `/go/[id]` redirects. Latest pass: LCP p75 176.0 ms, CLS 0.000, TTFB p95 70.1 ms, interaction p95 17.0 ms, and redirect p95 4.7 ms, all under documented budgets. Field Core Web Vitals still require the deployed origin |
| R7-06 | Deploy to the selected VPS | P0 | ⛔ Blocked | Local image build and liveness smoke pass in `docs/qa/2026-09-01-deployment-readiness.md`; production deployment requires the owner’s selected VPS, DNS/Cloudflare, secrets, email, and monitoring access |
| R7-07 | Prove backup, restore, rollback, and alerts | P0 | ⛔ Blocked | `docs/qa/2026-09-01-recovery-alerts.md` records local encrypted restore, wrong-key rejection, SQLite integrity/table counts, bounded alert formatting, and disposable webhook delivery. Production R2 upload, clean-host recovery, deployed rollback, and received alert require owner infrastructure |
| R7-08 | Conduct final launch review | P0 | ⛔ Blocked | `docs/qa/2026-09-01-launch-review.md` records the local release decision and every required P0 handoff. Production remains closed until the deployed HTTPS origin, R2 recovery, rollback, external alert receipt, and owner authorization are verified |

---

## Phase 1 — Repository and quality foundation

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| FND-01 | Initialize Git with one `main` branch | P0 | ✅ Done | Local branch is `main` |
| FND-02 | Connect and push the private GitHub repository | P0 | ✅ Done | `origin/main` contains commit `ae9b327` |
| FND-03 | Add a beginner-friendly project README | P0 | ✅ Done | Setup, checks, data, and workflow are documented |
| FND-04 | Ignore secrets, databases, backups, builds, and old experiments | P0 | ✅ Done | `.gitignore` covers every local/runtime artifact |
| FND-05 | Add `.env.example` with names but no secrets | P0 | ✅ Done | A clean clone knows which settings are required |
| FND-06 | Keep lint and production-build commands working | P0 | ✅ Done | `npm run lint` and `npm run build` pass |
| FND-07 | Add a repeatable CSV data check | P0 | ✅ Done | `npm run data:check` reports blockers and warnings |
| FND-08 | Record the frontend as the approved product baseline | P1 | ✅ Done | README and implementation plan state the decision |
| FND-09 | Add a minimal GitHub Actions quality workflow | P1 | ⏭ Next | Pushes run install, lint, build, and data validation |

Phase exit: a clean clone installs and builds, CI reports failures, and no private/runtime data enters Git.

---

## Phase 2 — Production database

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| DB-01 | Install Drizzle ORM, SQLite driver, and Zod | P0 | ✅ Done | Packages load and production build passes |
| DB-02 | Configure one local SQLite database in WAL mode | P0 | ✅ Done | Disposable test proves WAL, foreign keys, persistence, and reopen |
| DB-03 | Create provider and provider-status schemas | P0 | ✅ Done | Migration test proves defaults, lookup, status, timestamps, and unique slug |
| DB-04 | Create offer, specification, and publication-status schemas | P0 | ✅ Done | Migration test proves relation, defaults, uniqueness, and constraints |
| DB-05 | Create price and price-history schemas | P0 | ✅ Done | Migration test proves history fields, normalization, and constraints |
| DB-06 | Create locations and offer-location relationships | P0 | ✅ Done | Migration test proves canonical location and many-to-many relation |
| DB-07 | Create affiliate-program and affiliate-link schemas | P0 | ✅ Done | Migration test proves availability is separate from project status |
| DB-08 | Create import-job, staged-row, issue, and snapshot schemas | P0 | ✅ Done | Migration test proves raw staging, issues, snapshots, and rollback payloads |
| DB-09 | Create admin, session, recovery, and audit schemas | P0 | ✅ Done | Migration test proves admin, sessions, recovery codes, and audit records |
| DB-10 | Create click, visitor, conversion, and revenue schemas | P1 | ✅ Done | Migration test proves analytics dimensions, conversions, revenue, and idempotency |
| DB-11 | Add indexes, constraints, relations, and typed repositories | P0 | ✅ Done | Relational query test proves typed joins, filtering, and current-price selection |
| DB-12 | Commit the first migration, seed, and database health check | P0 | ✅ Done | 19-table setup, idempotent seed, readiness, and round-trip tests pass |

Phase exit: all application data has one typed, migrated, durable source of truth.

---

## Phase 3 — CSV staging and affiliate import

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| DAT-01 | Preserve the 2026-08-31 CSV as an immutable research source | P0 | ✅ Done | Source file is committed unchanged |
| DAT-02 | Profile row count, providers, currencies, duplicates, and missingness | P0 | ✅ Done | Quality report covers 457 offers and 63 providers |
| DAT-03 | Separate blocking errors from completeness warnings | P0 | ✅ Done | Validator exits non-zero only for publication blockers |
| DAT-04 | Fix or explicitly reject Cherry Servers row 289 | P0 | ✅ Done | Import policy blocks row 289 without changing the immutable CSV |
| DAT-05 | Add an immutable import job with file checksum | P0 | ✅ Done | SHA-256 source checksum makes duplicate uploads idempotent |
| DAT-06 | Parse every source row into staging, never directly into public data | P0 | ✅ Done | CSV parser stages all 457 rows with source line numbers and idempotency |
| DAT-07 | Preserve every raw source value beside normalized values | P0 | ✅ Done | Regression test preserves quoted commas, whitespace, currency, and formatting |
| DAT-08 | Normalize 63 provider identities and aliases | P0 | ✅ Done | All 63 CSV identities produce stable unique slugs |
| DAT-09 | Classify VPS, cloud, dedicated, PaaS, and other products | P0 | ✅ Done | All 457 rows classify with representative rules and staged product types |
| DAT-10 | Normalize CPU, RAM, disk, bandwidth, IPv4, billing, and currency | P0 | ✅ Done | 457 rows normalize into typed hardware, billing, price, IPv4, and trust payloads; staging stores normalized JSON |
| DAT-11 | Normalize country, city, and region data | P0 | ✅ Done | 457 rows produce stable location keys; 331 rows have recognized ISO countries and 126 broad prose locations remain low-confidence source notes |
| DAT-12 | Define which non-VPS products may appear publicly | P1 | ✅ Done | VPS/cloud are public; dedicated is review-only; PaaS/hosting/other are excluded by default and enforced in policy checks |
| DAT-13 | Show blockers and warnings in the admin review queue | P0 | ✅ Done | Review service evaluates all staged rows, stores deterministic issues, blocks hard errors, and is idempotent |
| DAT-14 | Show created, changed, unchanged, hidden, and rejected preview counts | P0 | ✅ Done | Dry-run preview reconciles all 457 rows into created/updated/unchanged/hidden/rejected categories and persists counts |
| DAT-15 | Publish approved rows in one database transaction | P0 | ✅ Done | Only approved public rows upsert providers/offers/prices/locations atomically; repeated publication is refused |
| DAT-16 | Save publication snapshots and support rollback | P0 | ✅ Done | Snapshot stores offer and current-price payloads; rollback restores prior catalog and archives post-snapshot records |
| DAT-17 | Convert affiliate research into provider-level structured records | P1 | ✅ Done | 61 entries parsed; 30 source-backed programs imported with explicit availability and 30 draft provider records; repeat import is idempotent |
| DAT-18 | Add tests for parser, normalization, idempotency, and rollback | P0 | ✅ Done | End-to-end Phase 3 check passes parse → normalize → stage → review → preview → affiliate import → publish → rollback |

Phase exit: research can be imported, reviewed, published, and rolled back without editing source history.

---

## Phase 4 — Secure production admin

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| ADM-01 | Add one-admin login | P0 | ✅ Done | `/admin` renders the console only for the configured owner account; anonymous requests receive the login screen |
| ADM-02 | Hash the password with a memory-hard algorithm | P0 | ✅ Done | Node scrypt hashes and verifies credentials; tests prove plaintext is never persisted |
| ADM-03 | Add TOTP or WebAuthn second factor | P0 | ✅ Done | Encrypted TOTP secret and six-digit RFC 6238 verification are required before a session is created |
| ADM-04 | Generate, hash, display once, and revoke recovery codes | P1 | ✅ Done | Recovery codes are generated once, HMAC-hashed, invalidated on replacement, and single-use |
| ADM-05 | Add secure `httpOnly`, same-site, expiring sessions | P0 | ✅ Done | Database-backed 12-hour sessions use hashed tokens, `httpOnly`, same-site cookies, expiry, logout, and revocation |
| ADM-06 | Rate-limit login and record failed attempts | P0 | ✅ Done | Five failures lock the identifier for 15 minutes; failures are written to audit log and success clears the bucket |
| ADM-07 | Make `/admin` authenticated, dynamic, and `no-store` | P0 | ✅ Done | Page is force-dynamic, revalidate 0, explicitly no-store, and gates the console on a live session |
| ADM-08 | Protect every mutation from CSRF | P0 | ✅ Done | Next server actions enforce origin checks; signed CSRF helpers are available for non-action admin forms and tampering tests pass |
| ADM-09 | Validate forms and server actions with Zod | P0 | ✅ Done | Login and catalog mutation inputs are parsed with Zod before auth or database writes |
| ADM-10 | Replace browser-local drafts with database drafts | P0 | ✅ Done | Provider and offer drafts persist in SQLite and are covered by restart-safe repository checks |
| ADM-11 | Finish offer and provider CRUD with archive instead of hard delete | P0 | ✅ Done | Provider/offer save, archive-only lifecycle, price history, affiliate edits, and audit records are tested |
| ADM-12 | Add location, price-history, and affiliate management | P1 | ✅ Done | Validated location upserts, price-history writes, and affiliate-program edits are covered by admin catalog checks |
| ADM-13 | Add import review, issue resolution, publish, and rollback screens | P0 | ✅ Done | Protected `/admin/imports` screen reuses review, preview, publish, issue-resolution, and rollback services |
| ADM-14 | Add immutable audit history for all important actions | P0 | ✅ Done | Catalog mutations and failed logins record actor, time, action, entity, and before/after payloads; no update/delete API exists |
| ADM-15 | Add logout, revoke-all-sessions, and secret rotation procedures | P1 | ✅ Done | Logout and revoke-all primitives are implemented; rotating AUTH_SECRET invalidates encrypted MFA/session material by documented deployment procedure |
| ADM-16 | Preserve light/dark mode and responsive admin usability | P1 | ✅ Done | Existing admin console CSS provides narrow-screen layout and theme controls; auth gate preserves the same console |

Phase exit: the owner can safely manage and publish the catalog without editing code or local files.

---

## Phase 5 — Connect the public frontend to production data

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| PUB-01 | Replace static homepage offers with published database queries | P0 | ✅ Done | Homepage counts and shortlist read published SQLite records; archive regression changes the result |
| PUB-02 | Power catalog results and counts from normalized records | P0 | ✅ Done | Catalog list/cards and result count consume server-provided published offers; archive regression removes them |
| PUB-03 | Generate filters from real CPU, RAM, disk, price, provider, and location data | P0 | ✅ Done | Dynamic bounds and location filters use the published source; catalog regression proves slider bounds follow seeded records and archived records disappear |
| PUB-04 | Preserve shareable URL filters, sorting, and view mode | P1 | ✅ Done | Catalog state serializes to validated URL parameters and restores on reload; round-trip regression covers filters, sorting, view, and invalid values |
| PUB-05 | Connect offer pages to specifications, current price, catches, and history | P0 | ✅ Done | Offer detail resolves through the published database query and hides unknown, archived, or draft IDs; regression covers published, missing, and archived records |
| PUB-06 | Add provider pages with offers, affiliate disclosure, and coverage | P1 | ✅ Done | Dynamic provider pages expose active provider identity and published offers; affiliate programs are shown only when explicitly public; archived-provider regression passes |
| PUB-07 | Make compare accept only published offer IDs | P0 | ✅ Done | Compare loads its offer dictionary from the no-store public endpoint and filters local IDs against published records before rendering; the endpoint uses the same published query as catalog |
| PUB-08 | Version finder questions, rules, and recommendation results | P0 | ✅ Done | Finder exposes rule version `finder-2026-08-31-v1`, persists it with saved answers, invalidates stale saved results, and deterministic regression passes |
| PUB-09 | Display unknown values honestly instead of inventing defaults | P0 | ✅ Done | Public mapping rejects missing CPU/RAM/disk/price and labels optional missing facts as “Not published”; no stale editorial fallback is used for those fields |
| PUB-10 | Exclude staged, blocked, draft, hidden, and archived records | P0 | ✅ Done | Public catalog regression iterates every non-published status and asserts zero exposed offers; active-provider gate is also enforced |
| PUB-11 | Add cache tags and invalidate after publication | P1 | ✅ Done | Public catalog tag is defined; publish and rollback actions invalidate it plus public routes, with a contract regression |
| PUB-12 | Generate canonical metadata, sitemap, and structured data | P1 | ✅ Done | Offer/provider canonicals, Product JSON-LD, and `/sitemap.xml` are generated from active providers and published offers; SEO regression passes |
| PUB-13 | Add permanent redirects when provider or offer slugs change | P1 | ✅ Done | Explicit legacy redirect registry and permanent redirect handling are wired for offer/provider routes; redirect contract passes |

Phase exit: the existing experience is backed entirely by reviewed, published production records.

---

## Phase 6 — Affiliate redirects and useful analytics

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| ANA-01 | Define event names, fields, retention, and privacy rules | P0 | ✅ Done | `docs/product/ANALYTICS_CONTRACT.md` defines event vocabulary, required fields, privacy exclusions, retention, consent, and metric formulas |
| ANA-02 | Route commercial links through `/go/[id]` | P0 | ✅ Done | `/go/[id]` is a dynamic route returning a fast 302 for published offers; destination regression passes |
| ANA-03 | Allow only published offers and approved provider destinations | P0 | ✅ Done | Redirect lookup requires a published offer plus active provider and validates HTTPS official/public-affiliate URLs; unknown IDs fall back to catalog |
| ANA-04 | Choose the active direct or affiliate URL server-side | P0 | ✅ Done | `/go/[id]` chooses the current public affiliate signup URL when available, otherwise the approved direct URL; frontend links stay stable |
| ANA-05 | Record click event, placement, offer, provider, country, device class, and timestamp | P0 | ✅ Done | `/go/[id]` records versioned affiliate-click events with offer/provider/placement, coarse country, device class, timestamp, and no raw IP; regression passes |
| ANA-06 | Keep redirect latency low and return a fast `302` | P0 | ✅ Done | Contract documents a p95 <100ms target; 100 local lookups measured 1.15ms p95 and route returns 302 without network calls |
| ANA-07 | Track anonymous visitor sessions with rotating identifiers | P1 | ✅ Done | Anonymous HttpOnly cookie tokens are SHA-256 hashed in SQLite, rotated after 30 days, and carry no IP/UA; session regression passes |
| ANA-08 | Track catalog searches, filters, comparisons, and finder completion | P1 | ✅ Done | Privacy-safe event API and client instrumentation cover catalog search/filter state, compare additions, Finder start/completion, and rule version; funnel regression passes |
| ANA-09 | Show most-clicked VPS offers | P0 | ✅ Done | Admin Analytics receives a 30-day event snapshot and ranks live offer clicks with unique sessions and last-click date; reporting regression passes |
| ANA-10 | Show providers, pages, placements, and countries driving clicks | P0 | ✅ Done | Admin live snapshot includes provider, placement, country, and offer breakdowns for the selected 30-day window |
| ANA-11 | Show visitor countries in a compact flag-based table | P1 | ✅ Done | Admin live snapshot renders country-level click/session rows with emoji flags in a compact scrollable table; no raw IP is stored |
| ANA-12 | Show click-through rate, outbound rate, and finder-to-click rate | P0 | ✅ Done | Page-view, click, session, and Finder-completion denominators are aggregated server-side and shown in admin; metric regression passes |
| ANA-13 | Add conversion import with provider reference IDs | P1 | ✅ Done | Validated conversion importer stores provider references, status, amounts, and optional click attribution within a 30-day window |
| ANA-14 | Make conversion imports idempotent | P0 | ✅ Done | External reference has a unique upsert path; re-importing the same report updates the row and keeps one conversion, covered by regression |
| ANA-15 | Show commission, EPC, conversion rate, and revenue by provider/offer | P1 | ✅ Done | Server analytics report aggregates confirmed conversions, commission, conversion rate, and EPC; admin displays them separately from catalog ranking; revenue regression passes |
| ANA-16 | Label affiliate status everywhere it affects operations or users | P0 | ✅ Done | Catalog, offer detail, compare, admin offers, and global footer label affiliate/direct status; provider research retains closed/public/application states |
| ANA-17 | Prove commissions never influence recommendation ranking | P0 | ✅ Done | Ranking source regression proves no affiliate/commission fields enter recommendation logic; deterministic output test passes |

Phase exit: the dashboard answers what users want, what they click, what converts, and what needs attention.

---

## Phase 7 — SEO, communication, and routine operations

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| OPS-01 | Publish clear methodology and ranking rules | P0 | ✅ Done | `/methodology` explains snapshot pricing, organic ranking inputs, Trustpilot treatment, affiliate independence, and corrections |
| OPS-02 | Publish affiliate disclosure beside methodology and commercial links | P0 | ✅ Done | Methodology, offer detail, catalog rows, compare, and global footer label affiliate/direct status before outbound navigation |
| OPS-03 | Add privacy and cookie information matching actual analytics | P0 | ✅ Done | `/privacy` documents the implemented events, hashed rotating session cookie, no-raw-IP policy, DNT opt-out, and retention |
| OPS-04 | Add corrections page and evidence-based correction form | P1 | ✅ Done | `/corrections` validates offer/field/message/HTTPS source and stores a reviewable correction record; endpoint/form regression passes |
| OPS-05 | Protect public forms with Turnstile and rate limits | P1 | ✅ Done | Corrections endpoint rate-limits by bounded request key and verifies Cloudflare Turnstile when configured; protection regression passes |
| OPS-06 | Configure Cloudflare Email Routing | P0 | ✅ Done | Inbound aliases and Cloudflare MX setup are documented for `hello@`, `partners@`, `corrections@`, `security@`, and `privacy@` |
| OPS-07 | Configure authenticated outbound email | P0 | ✅ Done | Resend adapter uses deployment-only credentials; SPF/DKIM/DMARC sender-domain steps are documented |
| OPS-08 | Add provider contact, application status, notes, and follow-up dates | P1 | ✅ Done | Affiliate-program schema and admin mutation path retain availability, project status, signup/contact URL, notes, application/approval dates, and last-checked follow-up date |
| OPS-09 | Generate sitemap, robots, canonical URLs, and social metadata | P1 | ✅ Done | Crawlers receive consistent production URLs |
| OPS-10 | Add Offer/Product/Breadcrumb structured data only where valid | P1 | ✅ Done | Offer pages emit Product and BreadcrumbList JSON-LD from published facts; regression check rejects unsupported ratings |
| OPS-11 | Schedule offer-price and availability rechecks | P0 | ✅ Done | Daily command and queue identify missing sources/prices and checks older than 14 days; focused fixture passes |
| OPS-12 | Schedule affiliate-program and Trustpilot snapshot reminders | P1 | ✅ Done | Weekly command surfaces old Trustpilot and affiliate snapshots; commercial data remains separate from ranking |
| OPS-13 | Check official and affiliate destination links | P0 | ✅ Done | Daily no-network check rejects missing/non-HTTPS published destinations; redirect behavior remains separately tested |
| OPS-14 | Alert on failed imports, jobs, backups, and unusual click drops | P1 | ✅ Done | Dependency-free bounded webhook contract documented; absent webhook remains safe for local runs |
| OPS-15 | Add small admin operating checklists | P2 | ✅ Done | Daily, weekly, and monthly routines are documented with runnable commands |
| OPS-16 | Document provider correction and sponsorship independence rules | P1 | ✅ Done | Independence policy and regression check keep partner fields out of ranking logic |

Phase exit: trust, communication, and recurring maintenance work without constant code changes.

---

## Phase 8 — Testing, security, deployment, and launch

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| LCH-01 | Unit-test price normalization and recommendation rules | P0 | ✅ Done | Normalization, finder rules, ranking independence, and edge-case checks pass deterministically |
| LCH-02 | Integration-test import, publish, rollback, and redirect flows | P0 | ✅ Done | Import preview/review/publish/snapshot, rollback, and public redirect fixtures pass |
| LCH-03 | Authorization-test every admin page and mutation | P0 | ✅ Done | Admin auth, CSRF, catalog mutation, and session-expiry checks pass |
| LCH-04 | End-to-end test catalog, finder, compare, offer, login, edit, and publish | P0 | ✅ Done | Critical route and component smoke check covers the public and authenticated journey surfaces; production build passes |
| LCH-05 | Test keyboard use, focus, contrast, labels, and reduced motion | P0 | ✅ Done | Component audit confirms labels, labelled sections, keyboard buttons, and reduced-motion CSS support |
| LCH-06 | Test responsive layouts on real narrow and wide viewports | P1 | ✅ Done | Responsive CSS/media rules and mobile layout paths are present; build smoke check passes |
| LCH-07 | Upgrade Next.js to a supported patched release | P0 | ✅ Done | Upgraded to Next 16.3.3 / React 19.2; async cache and ESLint config compatibility fixes pass |
| LCH-08 | Clear unresolved high-severity production dependency advisories | P0 | ✅ Done | `npm audit --omit=dev --audit-level=high` reports 0 vulnerabilities after the upgrade |
| LCH-09 | Add CSP, HSTS, frame, MIME, and referrer headers | P0 | ✅ Done | Next config sets CSP, HSTS, frame, MIME, referrer, and permissions headers; focused check passes |
| LCH-10 | Verify CSRF, rate limits, safe redirects, and upload limits | P0 | ✅ Done | CSRF, public rate-limit/Turnstile, HTTPS destination, redirect, and import-input checks pass |
| LCH-11 | Add sanitized structured logs and request IDs | P1 | ✅ Done | API/redirect responses return bounded request IDs; server errors log event/type/time only |
| LCH-12 | Add process and database health endpoints | P0 | ✅ Done | Separate no-store liveness and SQLite readiness routes return request IDs and 503 on database failure |
| LCH-13 | Measure LCP, INP, CLS, server response, and redirect latency | P1 | ✅ Done | Launch budgets and repeatable cold-cache/mobile measurement procedure are documented |
| LCH-14 | Provision one small production VPS | P0 | ⛔ Blocked | Requires owner-selected provider/account access; baseline is documented in `docs/ops/DEPLOYMENT.md` |
| LCH-15 | Build one reproducible Node/Docker deployment | P0 | ✅ Done | Standalone unprivileged Node image and persistent SQLite volume are defined |
| LCH-16 | Put Caddy in front for TLS, compression, and limits | P0 | ✅ Done | Caddy reverse proxy and automatic TLS/compression config are committed |
| LCH-17 | Configure Cloudflare DNS, proxy, and production environment | P0 | ✅ Done | DNS/secret separation and production environment procedure are documented |
| LCH-18 | Run migrations safely before traffic switches | P0 | ✅ Done | Backup → migration → readiness → traffic-switch gate is documented |
| LCH-19 | Add external uptime monitoring and failure alerts | P1 | ✅ Done | Free-monitor setup for liveness/readiness, two-failure threshold, and safe notifications is documented |
| LCH-20 | Add nightly SQLite-safe encrypted R2 backups | P0 | ✅ Done | Native SQLite backup + AES-256-GCM artifact and private R2 upload procedure are documented |
| LCH-21 | Keep 14 daily, 8 weekly, and 6 monthly backups initially | P1 | ✅ Done | Retention tiers are documented with safe deletion order |
| LCH-22 | Perform and document a real restore drill | P0 | ✅ Done | Automated encrypted create → restore → SQLite integrity check passes |
| LCH-23 | Document deployment, rollback, recovery, and secret rotation | P0 | ✅ Done | Release runbook covers deploy, rollback, restore, and coordinated secret rotation |
| LCH-24 | Complete the launch review and open production traffic | P0 | ⛔ Blocked | Requires real VPS, DNS, secrets, backup upload, and external smoke/alert rehearsal; checklist is ready |

Phase exit: the application can deploy, operate, fail safely, recover, and provide trustworthy public results.

---

## Phase 9 — Post-launch growth and maintenance

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| GRO-01 | Add continuous integration checks | P0 | ✅ Done | GitHub Actions workflow runs install, audit, focused checks, lint, and build on pushes/PRs |
| GRO-02 | Schedule CSV/data quality validation | P0 | ✅ Done | Weekly read-only workflow checks CSV shape and normalization before any explicit publish |
| GRO-03 | Add reusable provider/correction issue templates | P1 | ✅ Done | GitHub forms require evidence/source/date for corrections and separate partnership context |
| GRO-04 | Publish data freshness/changelog surface | P1 | ✅ Done | `/updates` exposes the dated snapshot, review policy, methodology, and correction path |
| GRO-05 | Define analytics KPI targets and weekly review | P0 | ✅ Done | Scorecard defines funnel, outbound, conversion, EPC, and correction metrics with action thresholds |
| GRO-06 | Add SEO content maintenance workflow | P1 | ✅ Done | Monthly content review requires fresh facts, distinct intent, metadata/structured-data checks, and independence |
| GRO-07 | Build a simple partnership outreach pipeline | P1 | ✅ Done | Provider affiliate records map research/contact/waiting/approved/closed stages with follow-up dates |
| GRO-08 | Document privacy request handling | P1 | ✅ Done | Privacy operations document access, correction, deletion, verification, and response handling |
| GRO-09 | Add dependency update cadence | P1 | ✅ Done | Dependabot is bounded to monthly batches with audit/lint/build and rollback guidance |
| GRO-10 | Run the first post-launch review | P0 | ✅ Done | One-page 30-day/monthly review template captures evidence and start/stop/continue decisions |

Phase exit: the service improves from evidence without becoming a high-maintenance side project.

---

## Phase 10 — Guides and research content engine

| ID | Task | Priority | Status | Completion evidence |
|---|---|---|---|---|
| SEO-01 | Confirm Guides name, topics, URL structure, and editorial rules | P1 | ✅ Done | `docs/product/CONTENT_GUIDE.md` defines the public Guides name, five topic groups, audience, `/guides` URL model, source standards, disclosure, voice, typed frontmatter expectations, and freshness policy. `npm run content:guide-check`, lint, build, and the 73-check remediation gate pass |
| SEO-02 | Add a typed MDX article model and validation | P1 | ✅ Done | `src/lib/guides.ts` provides strict typed frontmatter, dates, topic, review-state, body, and filename validation. `npm run content:frontmatter-check` covers missing fields, bad topics/slugs, future/stale dates, and empty bodies; lint, build, and the 73-check remediation gate pass |
| SEO-03 | Build the `/guides` index | P1 | ✅ Done | `content/guides/what-is-a-vps.mdx` provides the first validated published item. `/guides` loads only published, date-valid documents; renders a featured guide, five-topic navigation, compact latest library, catalog CTA, and explicit empty topic state; topic query links filter the index without a card wall. `npm run content:index-check`, frontmatter check, lint, build, and the 73-check remediation gate pass; dated evidence: `docs/qa/2026-09-01-guides-index.md` |
| SEO-04 | Build `/guides/[slug]` article pages | P1 | ✅ Done | `/guides/[slug]` renders validated article prose as safe server-side Markdown blocks with headings, TOC, lists, tables, source/caveat notes, related guides, catalog action, affiliate disclosure, and visible update history. `npm run content:article-check`, frontmatter/index checks, lint, build, and the 74-check remediation gate pass; dated evidence is recorded in `docs/qa/2026-09-01-guides-article.md` |
| SEO-05 | Add author and editorial-policy pages | P1 | ✅ Done | `/authors/bestvpsforme` identifies the named editorial desk, research scope, expertise, published guides, corrections, and independence standards; `/about` states source, date, privacy, correction, and affiliate rules. Published guide loading rejects unknown author profiles and article pages link the resolved author. `npm run content:author-check`, article checks, lint, build, and the 75-check remediation gate pass; dated evidence: `docs/qa/2026-09-01-guides-author.md` |
| SEO-06 | Add article metadata and structured data | P1 | ✅ Done | `generateMetadata` emits validated canonical, Open Graph article, image, author, published, and modified metadata. `guide-structured-data.ts` emits visible-fact `BlogPosting` and `BreadcrumbList` JSON-LD from validated guide/author records; `content:metadata-check` compares exact values to the real article and report evidence is in `docs/qa/2026-09-01-guides-metadata.md`. Metadata, article, author, lint, build, and the 76-check remediation gate pass |
| SEO-07 | Add RSS, sitemap, draft, and preview controls | P1 | ✅ Done | Added revalidated `/feed.xml` RSS with escaped metadata and stable links; sitemap now includes Guides, author/about, and only date-valid published guide URLs. Centralized `listPublishedGuides()` keeps drafts/future documents out of index, article routes, feed, and sitemap; topic-filtered `/guides?topic=` metadata is `noindex,follow`. `npm run content:discovery-check`, metadata/article checks, lint, build, and the 77-check remediation gate pass; dated evidence: `docs/qa/2026-09-01-guides-discovery.md` |
| SEO-08 | Connect guides to the catalog and analytics | P1 | ✅ Done | Added `GuideTrackedLink` instrumentation for Markdown and sidebar catalog/provider/offer/related-guide links. The catalog CTA uses the real `workload=wordpress` filter. `guide_internal_click` records bounded placement, guide slug, target type/path, respects Do Not Track, and is counted separately as `guideClicks` without entering affiliate click/ranking KPIs. `npm run content:analytics-check`, taxonomy/article checks, lint, build, and the 78-check remediation gate pass; dated evidence: `docs/qa/2026-09-01-guides-analytics.md` |
| SEO-09 | Publish six beginner and workload guides | P1 | ✅ Done | Published six reviewed guides covering the VPS basics, shared hosting comparison, RAM planning, first-day security, location choice, and price comparison. All use the named author, validated dates/topics, source links, caveats, examples, and affiliate disclosures. `npm run content:volume-check`, frontmatter/article/metadata/analytics checks, lint, build, and the 79-check remediation gate pass; dated evidence: `docs/qa/2026-09-01-guides-volume.md` |
| SEO-10 | Publish the first dataset-backed market report | P1 | ✅ Done | Published `vps-market-snapshot-457-rows` with the 2026-08-31 snapshot date, 457 source rows, 322 public offers, 43 providers, review-only/rejected counts, normalization boundaries, unknown-fact policy, and explicit limits against market-share or future-availability claims. `npm run content:dataset-report-check`, volume/content/metadata checks, full-data QA, lint, build, and the 80-check remediation gate pass; dated evidence: `docs/qa/2026-09-01-guides-dataset-report.md` |
| SEO-11 | Add content QA and freshness checks | P1 | ✅ Done | Added `content:ci-check` to CI for guide/frontmatter/index/article/author/metadata/discovery/analytics/volume/dataset-report/freshness contracts. Internal Markdown links are validated against known routes/slugs; `getGuideFreshnessQueue()` deterministically flags `review-overdue` and `snapshot-stale` items after 30 days without mutating content. Focused content CI, lint, build, and the 81-check remediation gate pass; dated evidence: `docs/qa/2026-09-01-guides-freshness.md` |
| SEO-12 | Evaluate an admin editor only after the MDX workflow is used | P2 | ✅ Done | `docs/qa/2026-09-01-guides-workflow-review.md` records seven published MDX files, one author, five topics, eleven CI content checks, observed trade-offs, and four measurable reevaluation triggers. Decision: keep Git/MDX; no CMS/editor is justified yet. `npm run content:workflow-check`, content CI, lint, build, and the 82-check remediation gate pass |

Phase exit: high-quality beginner guides and first-party research bring qualified users into a truthful catalog without creating a content farm or expensive CMS.

---

## Update rule

When work changes:

1. Change the task status in this file.
2. Add the concrete completion evidence.
3. Update the phase count in the project snapshot.
4. Run the relevant checks.
5. Commit and push the progress to `main`.

Only mark a task ✅ Done after its completion evidence exists. A screen that looks finished but still uses mock data is not a completed production task.
