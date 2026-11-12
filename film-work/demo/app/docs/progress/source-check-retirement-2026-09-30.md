# Task 2.3: reviewable source-check retirement proposal

**Status:** applied after the owner explicitly approved this exact 21-file retirement proposal on 30 September 2026. Exactly the listed 21 tracked scripts and 21 npm entries have been removed. This approval does not grant publication, production migration or price-term approval. The original deletion lists below remain the record of the approved scope.

Every deletion candidate below was read in full. Candidate selection is limited to eight checks whose behavior is ported and thirteen checks whose only operation is reading human documentation and asserting literal phrases. The documentation itself stays in place. Mixed runtime/config/content/source checks remain retained even where part of their coverage is obsolete.

## Current inventory

| Inventory on 30 September 2026 | Before approval | Applied result |
|---|---:|---:|
| Tracked `scripts/check_*.ts` files | 152 | 131 |
| Checks reading `src/` text, including mixed source/runtime checks | 62 | 61 |
| Other TS checks: data, DB, docs, built assets, configuration, runtime | 90 | 70 |
| npm script entries | 171 | 150 |
| Direct TS check command entries | 153 | 132 |
| Direct Python data check entries | 1 | 1 |
| Other operational/development/aggregate commands | 17 | 17 |

Counting method: a source-text check reads a quoted repository path beginning `src/`, directly or through a list/helper. Imports from `../src/` and paths used only as Vitest command arguments do not count as source-grep checks. A broad grep currently finds 62 files containing both `readFileSync` and a quoted `src/` path; its extra match is the R7 dispatcher, which reads a package/report and passes test paths to npm rather than reading those test sources. Two npm entries invoke `check_analytics_metrics.ts`, so TS command entries exceed TS files by one. The master plan’s “50 scripts” is an earlier inventory, not the current count. Removing 21 entries does not meet the fewer-than-15 target; that target stays open until the remaining genuine behavior is ported.

## Eight fully replaced checks: approved tracked deletions

| Tracked script to delete | Exact npm entry to remove | Passing replacement | Contract retained |
|---|---|---|---|
| `scripts/check_catalog_url.ts` | `public:catalog-url-check` | `src/lib/catalog-url.test.ts` | All filter state, real-price sorting and view round-trip; malformed options and zero budget. |
| `scripts/check_import_policy.ts` | `data:blocker-check` | `src/db/import-policy.test.ts` | Required facts, unsafe URL/date formats, invalid prices, immutable research SHA-256 and actual missing-price Cherry Servers row. |
| `scripts/check_normalization.ts` | `data:normalize-check` | `src/db/row-normalization.test.ts` | All 457 real rows validate, fractional specs survive, missing/invalid facts stay null, review metadata cannot enter from CSV. |
| `scripts/check_csrf.ts` | `admin:csrf-check` | `src/lib/csrf.test.ts` | Actual signed token, nonce/signature tampering, deployment secret rotation and missing-secret failure. |
| `scripts/check_admin_auth.ts` | `admin:auth-check` | `src/lib/admin-auth.test.ts` | Real scrypt and RFC TOTP, owner/password/MFA authentication, hashed sessions, expiry/revocation, one-use recovery and login lockout. |
| `scripts/check_secure_logging.ts` | `launch:logging-check` | `src/lib/secure-log.test.ts` | Safe request IDs plus captured log content excludes message, stack and attached credentials. |
| `scripts/check_analytics_taxonomy.ts` | `analytics:taxonomy-check` | `src/lib/analytics-events.test.ts` | Real ingestion handler rejects legacy events without storage; historical rows remain queryable and stay outside current KPIs. |
| `scripts/check_ranking_independence.ts` | `analytics:ranking-check` | `src/lib/catalog.test.ts` | All 16 affiliate assignments over varied offers leave recommendation order unchanged; replaces the prior source grep and tautological self-comparison. |

Verification rerun at 16:43: **78 passing tests / 12 passing suites** using the twelve unit files covering this work. Real Drizzle repository tests use `DATABASE_URL=:memory:` and committed migrations. CSRF/auth tests restore temporary secrets; rate-limit/session tests restore the clock. No Drizzle mocks, real database writes or dataset publication were used. The initial two failures were invalid chronological fixtures, corrected without production changes. These checks characterize existing behavior; no artificial red phase was invented.

## Thirteen documentation-only checks: approved tracked deletions

| Tracked script to delete | Exact npm entry to remove | Documentation retained |
|---|---|---|
| `scripts/check_content_guide.ts` | `content:guide-check` | `docs/product/CONTENT_GUIDE.md` |
| `scripts/check_content_review.ts` | `growth:content-check` | `docs/growth/CONTENT_REVIEW.md` |
| `scripts/check_growth_kpis.ts` | `growth:kpi-check` | `docs/growth/GROWTH_KPIS.md` |
| `scripts/check_launch_checklist.ts` | `launch:checklist-check` | `docs/ops/LAUNCH_CHECKLIST.md` |
| `scripts/check_launch_review_report.ts` | `release:launch-review-check` | `docs/qa/2026-09-01-launch-review.md` |
| `scripts/check_monitoring.ts` | `launch:monitoring-check` | `docs/ops/MONITORING.md` |
| `scripts/check_operating_checklist.ts` | `operations:checklist-check` | `docs/ops/OPERATING_CHECKLIST.md` |
| `scripts/check_partnership_pipeline.ts` | `growth:partnership-check` | `docs/growth/PARTNERSHIP_PIPELINE.md` |
| `scripts/check_performance_budget.ts` | `launch:performance-check` | `docs/ops/PERFORMANCE_BUDGET.md` |
| `scripts/check_post_launch_review.ts` | `growth:review-check` | `docs/growth/POST_LAUNCH_REVIEW.md` |
| `scripts/check_privacy_operations.ts` | `growth:privacy-check` | `docs/ops/PRIVACY_OPERATIONS.md` |
| `scripts/check_recovery_report.ts` | `release:recovery-check` | `docs/qa/2026-09-01-recovery-alerts.md` |
| `scripts/check_release_runbook.ts` | `launch:runbook-check` | `docs/ops/RELEASE_RUNBOOK.md` |

These scripts test phrase presence, not monitoring, recovery, performance, compliance, launch readiness, editorial quality or actual production deployment. Removing the scripts does not remove any owner release requirement. Mixed checks such as `check_dataset_report.ts`, `check_guides_volume.ts`, `check_guides_freshness.ts`, `check_guides_workflow.ts`, deployment/config checks and evidence image checks are intentionally excluded.

## Exact dependent command updates

Approval scope includes these two small follow-through edits so removed entries do not leave broken callers:

- `.github/workflows/data-quality.yml`: replace `npm run data:normalize-check` with `npm test -- src/db/row-normalization.test.ts`. Keep the scheduled immutable CSV Python validation unchanged.
- `package.json` → `content:ci-check`: remove its initial `npm run content:guide-check && ` segment only; retain the remaining ten content checks.

The new main CI workflow runs lint, TypeScript, Vitest and browser tests; it does not invoke any of the proposed removed entries. Human runbook references to retired check names should be updated alongside retirement or annotated with their Vitest replacement; documentation-only checks have no automated replacement because they did not verify runtime behavior.

The caller scan also found retained `check_remediation.ts` and `check_r7_automated_gate.ts` invoking retired entries. Their affected behavior calls now invoke the exact Vitest replacements above; their retired documentation-only calls are removed. `check_data_schedule.ts` recognizes the normalization test command. R7's raw-data diagnostic now expects the current successful staging check and explicit non-publishable row-289 warning. No additional script was deleted. The retained guide metadata check now renders/parses the shared `JsonLd` component instead of demanding its moved MIME string in the page source, restoring the content aggregate.

Exact npm entry removals, in addition to the aggregator edit above:

```text
public:catalog-url-check
data:blocker-check
data:normalize-check
admin:csrf-check
admin:auth-check
launch:logging-check
analytics:taxonomy-check
analytics:ranking-check
content:guide-check
growth:content-check
growth:kpi-check
launch:checklist-check
release:launch-review-check
launch:monitoring-check
operations:checklist-check
growth:partnership-check
launch:performance-check
growth:review-check
growth:privacy-check
release:recovery-check
launch:runbook-check
```

## Remaining source-text checks: complete retention checklist

All 61 remain tracked and keep their npm entries. The gap column identifies what must be verified before another retirement proposal. Basic route/axe or unit coverage alone is not treated as full replacement.

| Retain | Coverage still needed |
|---|---|
| `scripts/check_admin_action_feedback.ts` | Pending/validation/auth/conflict/server-error forms and import actions need authenticated interaction cases. |
| `scripts/check_admin_analytics.ts` | Taxonomy/KPI unit cases do not cover all console breakdowns, rendered measured values and empty states. |
| `scripts/check_admin_imports.ts` | Authenticated review/resolve/publish/rollback journeys and responsive shell remain untested end to end. |
| `scripts/check_admin_login.ts` | Basic gate coverage does not exercise invalid/locked/expired state rendering or password-manager attributes. |
| `scripts/check_admin_mutations.ts` | Writer tests do not cover the authenticated save action, drawer feedback and audited form operation together. |
| `scripts/check_admin_overview_data.ts` | Published-data mapping is covered partly; authenticated admin overview and inventory counts are not. |
| `scripts/check_admin_publication_confirmation.ts` | Explicit publish/rollback form confirmation and unresolved-error blocking need authenticated tests. |
| `scripts/check_admin_shell.ts` | Authenticated desktop/mobile navigation drawer interaction remains uncovered. |
| `scripts/check_admin_tables.ts` | Sticky dense tables, bounded scrolling and import-action touch targets need geometry tests. |
| `scripts/check_analytics_funnel.ts` | Endpoint taxonomy is covered; client catalog/compare emission and privacy behavior are not. |
| `scripts/check_author_editorial.ts` | Author lookup/linkage and standards/corrections content are not covered by full behavioral cases. |
| `scripts/check_bundle_rendering.ts` | Contains genuine built-bundle byte ceilings and deferred chunk assertions beyond basic route coverage. |
| `scripts/check_button_states.ts` | Disabled/loading/focus/hover/active and destructive control states need real rendering/interaction tests. |
| `scripts/check_cache_contract.ts` | Publication and rollback invalidation effects are not exercised by current suites. |
| `scripts/check_catalog_state.ts` | URL parser is covered; browser Back/Forward restoration coverage must pass before retiring history assertions. |
| `scripts/check_catalog_states.ts` | Basic catalog scenario omits loading, empty filtering recovery and database-error retry states. |
| `scripts/check_chrome_polish.ts` | Active navigation text is partial; responsive target sizes and footer geometry are not covered. |
| `scripts/check_compare_states.ts` | Shared compare URL coverage does not yet prove empty/one-plan/all-null fact states and clear/max behavior. |
| `scripts/check_control_tokens.ts` | Computed desktop/mobile dimensions and responsive hit targets remain uncovered. |
| `scripts/check_corrections.ts` | Sourced form submission, HTTPS validation and persisted/email outcomes are not tested. |
| `scripts/check_desktop_table.ts` | Column semantics alone do not cover row-click safeguards, sticky overflow, responsive columns and geometry. |
| `scripts/check_editorial_independence.ts` | Affiliate ranking invariance is covered; rendered public independence disclosure still needs a case. |
| `scripts/check_email_ops.ts` | Outbound adapter behavior/configuration is not tested; this is mixed source/document checking. |
| `scripts/check_failure_states.ts` | Substantial database, readiness, analytics-storage, outbound and admin failure matrix exceeds current tests. |
| `scripts/check_finder_archive.ts` | Permanent redirect is covered; active chrome/sitemap/admin omission and archive cleanup are not fully covered. |
| `scripts/check_frontend_readiness.ts` | Redirect/basic routes are covered; full critical journeys, reduced motion and responsive readiness are partial. |
| `scripts/check_guides_analytics.ts` | Guide link emission, placement/target data and Do Not Track behavior remain unported. |
| `scripts/check_guides_article.ts` | Markdown block rendering, safe links/raw HTML rejection and complete article sections remain unported. |
| `scripts/check_guides_discovery.ts` | Published-only RSS/sitemap, draft exclusion and topic noindex remain unported. |
| `scripts/check_guides_index.ts` | Topic filtering, featured/latest index and empty topic state remain unported. |
| `scripts/check_guides_metadata.ts` | Safe JSON-LD serialization is covered; exact visible-fact BlogPosting/Breadcrumb metadata remains unported. |
| `scripts/check_headings_landmarks.ts` | Route axe coverage is partial until all defined public/admin surfaces and heading relationships pass. |
| `scripts/check_health_endpoints.ts` | Basic e2e readiness does not exercise unavailable DB/empty publication/request-ID/no-store contracts. |
| `scripts/check_home_polish.ts` | Homepage route coverage does not assert the particular proof strip/details/CTA hierarchy. |
| `scripts/check_icon_semantics.ts` | Accessible-name coverage does not yet cover every public/admin icon control and decoration. |
| `scripts/check_input_labels.ts` | Axe route coverage omits authenticated admin/import and correction field cases. |
| `scripts/check_keyboard_flows.ts` | Tab traps, Escape close, focus restoration, slash search and admin dialogs remain unported. |
| `scripts/check_media_behavior.ts` | Actual asset dimensions/aspect checks and eager/lazy/broken-logo behavior exceed provider identity tests. |
| `scripts/check_mobile_compact_rows.ts` | Mobile row band order, truncation evidence and computed 44px geometry remain uncovered. |
| `scripts/check_mobile_filters.ts` | Chip removal/clear, focus trap/restoration and pointer slider commits are not fully tested. |
| `scripts/check_mobile_hierarchy.ts` | Row/list separation and all unknown hardware/location labels need rendered mobile assertions. |
| `scripts/check_mobile_progressive_detail.ts` | Deferred detail mounting, toggle naming/region and stable focus need interaction tests. |
| `scripts/check_mobile_result_bound.ts` | 20-row initial/increment limit and query reset need DOM count tests. |
| `scripts/check_offer_polish.ts` | Price honesty is covered; verdict/spec/action/progressive disclosure composition is not fully covered. |
| `scripts/check_operations_trust.ts` | Full methodology, footer and offer affiliate-disclosure placement remains partially covered. |
| `scripts/check_partnership_fields.ts` | Persisted affiliate lifecycle fields need repository behavior tests, beyond schema text. |
| `scripts/check_plain_language.ts` | Public copy assertions are mixed product checks; full rendered copy review is not represented. |
| `scripts/check_privacy_page.ts` | Rendered notice/cookie/Do Not Track/raw IP/retention contract remains unported. |
| `scripts/check_product_contract.ts` | Ranking and Finder redirect are covered; route, publication, unknown-data, hit-target and release invariants remain partial. |
| `scripts/check_provider_polish.ts` | Provider route coverage does not cover trust/header/official-site/plan-count semantics completely. |
| `scripts/check_provider_rendering.ts` | Unknown resolver and every public/admin consumer fallback need a focused consumer suite. |
| `scripts/check_public_data_mode.ts` | Old explicit-fixture expectations conflict with Task 1.1; current published-only/readiness/error contracts require replacement, not blind deletion. |
| `scripts/check_public_protection.ts` | Rate limiting unit tests do not cover correction endpoint Retry-After and optional Turnstile validation. |
| `scripts/check_public_redirects.ts` | Finder redirect coverage does not cover every registered offer/provider legacy URL. |
| `scripts/check_public_seo.ts` | Published-only sitemap, active providers and offer canonical output remain unported. |
| `scripts/check_r2_exit.ts` | Mixed mobile/desktop geometry, result bounds, URL history and semantics exceed current e2e scope. |
| `scripts/check_runtime_status_copy.ts` | Contains admin rendered status and measured metrics assertions in addition to doc/package text. |
| `scripts/check_seo_metadata.ts` | Layout/social card metadata, robots policy and image existence require output cases. |
| `scripts/check_snapshot_dates.ts` | Active snapshot date mapping is partly covered; every public rendered date surface is not. |
| `scripts/check_structured_data.ts` | Safe script serialization does not prove Product/Breadcrumb facts or unsupported-rating exclusion. |
| `scripts/check_updates_surface.ts` | Rendered update snapshot, correction/methodology links and sitemap inclusion remain unported. |

## Remaining checks without source-text reads: complete retention checklist

These 70 checks are outside the approved deletion proposal. Coverage equivalence has not been established for their full data/repository/operational/configuration contracts. Port each genuine behavior before removal. Some may need updating for the dated-FX policy; retain them until that review is concrete.

| Retain | Reason |
|---|---|
| `scripts/check_accessibility_runtime.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_admin_catalog.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_affiliate_import.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_affiliate_schema.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_analytics_click.ts` | Analytics/conversion/session/latency contract; taxonomy examples cover only part of this workflow. |
| `scripts/check_analytics_metrics.ts` | Analytics/conversion/session/latency contract; taxonomy examples cover only part of this workflow. |
| `scripts/check_analytics_reporting.ts` | Analytics/conversion/session/latency contract; taxonomy examples cover only part of this workflow. |
| `scripts/check_analytics_schema.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_analytics_session.ts` | Analytics/conversion/session/latency contract; taxonomy examples cover only part of this workflow. |
| `scripts/check_backup_restore.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_ci_workflow.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_commercial_rechecks.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_completeness_policy.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_contrast.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_conversion_import.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_data_layer_separation.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_data_schedule.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_dataset_report.ts` | Actual guide/content/config behavior mixed with evidence checks; not documentation-only. |
| `scripts/check_db.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_db_ready.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_db_setup.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_dependency_cadence.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_deployment_artifacts.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_destination_links.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_full_dataset_qa.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_full_publication.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_guides_content.ts` | Actual guide/content/config behavior mixed with evidence checks; not documentation-only. |
| `scripts/check_guides_freshness.ts` | Actual guide/content/config behavior mixed with evidence checks; not documentation-only. |
| `scripts/check_guides_volume.ts` | Actual guide/content/config behavior mixed with evidence checks; not documentation-only. |
| `scripts/check_guides_workflow.ts` | Actual guide/content/config behavior mixed with evidence checks; not documentation-only. |
| `scripts/check_import_job.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_import_preview.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_import_publish.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_import_review.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_import_schema.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_issue_templates.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_location_schema.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_locations.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_offer_rechecks.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_offer_schema.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_ops_alerts.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_performance_runtime.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_phase3.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_price_schema.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_product_classification.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_provider_normalization.ts` | Real identity/logo coverage exists; legacy alias resolution still needs a consumer test before full retirement. |
| `scripts/check_provider_publication_profile.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_provider_schema.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_public_catalog.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_public_destination.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_public_home.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_public_offer.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_public_parity.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_public_provider.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_publication_policy.ts` | Product visibility is covered; complete real CSV classification/publication policy evaluation still needs porting. |
| `scripts/check_publication_snapshot.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_r7_automated_gate.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_raw_preservation.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_redirect_latency.ts` | Analytics/conversion/session/latency contract; taxonomy examples cover only part of this workflow. |
| `scripts/check_remediation.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_remediation_fixture.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_repository.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_runtime_rendering.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_security_headers.ts` | Operational/configuration or recovery behavior; no complete replacement verified. |
| `scripts/check_security_schema.ts` | DB/schema/repository integrity check; complete in-memory equivalent not yet established. |
| `scripts/check_source_baseline.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_staging.ts` | Data/import/publication contract; existing unit examples do not replace all dataset and transaction assertions. |
| `scripts/check_static_independent_offers.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_viewport_baseline.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |
| `scripts/check_viewport_theme_matrix.ts` | Runtime, repository or artifact behavior not yet fully ported; preserve until its assertions have behavioral equivalents. |

## Approval boundary and follow-through

- [x] Replacement unit tests pass.
- [x] Exact 21 tracked files and 21 npm entries identified.
- [x] Mixed and partially covered checks retained; complete remaining inventory listed.
- [x] Owner approves these deletions and dependent command updates.
- [x] Apply exactly 21 tracked deletions and remove exactly 21 npm entries; preserve all other entries and concurrent browser setup.
- [x] Verify all direct script paths and npm aggregate callers resolve; no retired name remains in executable scripts, workflows or package entries.
- [x] Re-run targeted lint, TypeScript, replacement Vitest suites, scheduled data equivalents and the content aggregate.
- [ ] Update master/ledger Task 2.3 status with actual removed counts; keep the fewer-than-15 target open.

Applied verification: **58 tests / 8 replacement suites passed**; TypeScript and changed-script ESLint passed. `npm run data:check` passed with 457 rows, 0 errors and 7 warnings; the missing price stays explicitly non-publishable. `npm run growth:data-check` passed. All ten retained `content:ci-check` commands passed with `DATABASE_URL=/tmp/bestvpsforme-e2e/catalog.db`. Git staged-deletion inventory equals the exact 21-file list. Current inventory is **131 tracked TS checks, 61 source-reading checks, 150 npm entries and 132 direct TS check entries**.

The full legacy remediation/R7 aggregates were not executed during retirement because they include database publication/migration and build operations. Their affected dispatch arguments were inspected and resolve to existing commands/tests; the actual replacement suites were run above. Historical QA/archive reports retain original claims with a retirement annotation instead of rewriting past evidence. Production data remains untouched.
