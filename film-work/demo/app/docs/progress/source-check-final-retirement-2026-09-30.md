# Exact remaining source-check retirement proposal — 30 September 2026

Status: owner approved the exact 56-file proposal on 30 September 2026; all 56 tracked files were removed as listed. This supersedes the earlier next-batch proposal, and does not reuse the previous 21-file approval.

The exact proposal removes 56 tracked check scripts. Real behavior ports and the complete expanded browser gate pass. The 14-entry npm menu and active workflow/runbook callers are already edited and reviewable in the working tree. No real database migration, publication or price-term approval is included.

| Exact tracked path | Reason / replacement |
|---|---|
| `scripts/check_admin_action_feedback.ts` | Admin controls/actions: src/app/admin/actions.test.ts; src/app/admin/imports/actions.test.ts; tests/e2e/admin-readonly.spec.ts; tests/e2e/admin-actions.spec.ts |
| `scripts/check_admin_analytics.ts` | Admin controls/actions: src/app/admin/actions.test.ts; src/app/admin/imports/actions.test.ts; tests/e2e/admin-readonly.spec.ts; tests/e2e/admin-actions.spec.ts |
| `scripts/check_admin_imports.ts` | Admin controls/actions: src/app/admin/actions.test.ts; src/app/admin/imports/actions.test.ts; tests/e2e/admin-readonly.spec.ts; tests/e2e/admin-actions.spec.ts |
| `scripts/check_admin_login.ts` | Admin controls/actions: src/app/admin/actions.test.ts; src/app/admin/imports/actions.test.ts; tests/e2e/admin-readonly.spec.ts; tests/e2e/admin-actions.spec.ts |
| `scripts/check_admin_mutations.ts` | Admin controls/actions: src/app/admin/actions.test.ts; src/app/admin/imports/actions.test.ts; tests/e2e/admin-readonly.spec.ts; tests/e2e/admin-actions.spec.ts |
| `scripts/check_admin_overview_data.ts` | Admin controls/actions: src/app/admin/actions.test.ts; src/app/admin/imports/actions.test.ts; tests/e2e/admin-readonly.spec.ts; tests/e2e/admin-actions.spec.ts |
| `scripts/check_admin_publication_confirmation.ts` | Admin controls/actions: src/app/admin/actions.test.ts; src/app/admin/imports/actions.test.ts; tests/e2e/admin-readonly.spec.ts; tests/e2e/admin-actions.spec.ts |
| `scripts/check_admin_shell.ts` | Admin controls/actions: src/app/admin/actions.test.ts; src/app/admin/imports/actions.test.ts; tests/e2e/admin-readonly.spec.ts; tests/e2e/admin-actions.spec.ts |
| `scripts/check_admin_tables.ts` | Admin controls/actions: src/app/admin/actions.test.ts; src/app/admin/imports/actions.test.ts; tests/e2e/admin-readonly.spec.ts; tests/e2e/admin-actions.spec.ts |
| `scripts/check_button_states.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_catalog_states.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_compare_states.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_control_tokens.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_desktop_table.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_headings_landmarks.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_icon_semantics.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_input_labels.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_keyboard_flows.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_mobile_compact_rows.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_mobile_filters.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_mobile_hierarchy.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_mobile_progressive_detail.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_mobile_result_bound.ts` | Catalog/keyboard/mobile: tests/e2e/public-routes.spec.ts; tests/e2e/catalog-large.spec.ts; tests/e2e/ui-contracts.spec.ts; src/components/catalog-failure.test.tsx |
| `scripts/check_analytics_funnel.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_cache_contract.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_corrections.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_email_ops.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_health_endpoints.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_partnership_fields.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_plain_language.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_privacy_page.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_public_protection.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_public_seo.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_runtime_status_copy.ts` | Policy/API/SEO: src/lib/analytics-events.test.ts; src/app/api/corrections/route.test.ts; src/app/api/health/health.test.ts; src/app/admin/imports/actions.test.ts; src/app/metadata-surfaces.test.tsx; src/lib/email.test.ts; src/db/partnership-contract.test.ts; browser privacy/corrections/analytics cases |
| `scripts/check_catalog_state.ts` | Public surfaces: src/lib/catalog-url.test.ts; src/components/editorial-disclosure.test.tsx; src/lib/published-structured-data.test.tsx; tests/e2e/ui-contracts.spec.ts |
| `scripts/check_chrome_polish.ts` | Public surfaces: src/lib/catalog-url.test.ts; src/components/editorial-disclosure.test.tsx; src/lib/published-structured-data.test.tsx; tests/e2e/ui-contracts.spec.ts |
| `scripts/check_editorial_independence.ts` | Public surfaces: src/lib/catalog-url.test.ts; src/components/editorial-disclosure.test.tsx; src/lib/published-structured-data.test.tsx; tests/e2e/ui-contracts.spec.ts |
| `scripts/check_home_polish.ts` | Public surfaces: src/lib/catalog-url.test.ts; src/components/editorial-disclosure.test.tsx; src/lib/published-structured-data.test.tsx; tests/e2e/ui-contracts.spec.ts |
| `scripts/check_offer_polish.ts` | Public surfaces: src/lib/catalog-url.test.ts; src/components/editorial-disclosure.test.tsx; src/lib/published-structured-data.test.tsx; tests/e2e/ui-contracts.spec.ts |
| `scripts/check_operations_trust.ts` | Public surfaces: src/lib/catalog-url.test.ts; src/components/editorial-disclosure.test.tsx; src/lib/published-structured-data.test.tsx; tests/e2e/ui-contracts.spec.ts |
| `scripts/check_provider_polish.ts` | Public surfaces: src/lib/catalog-url.test.ts; src/components/editorial-disclosure.test.tsx; src/lib/published-structured-data.test.tsx; tests/e2e/ui-contracts.spec.ts |
| `scripts/check_structured_data.ts` | Public surfaces: src/lib/catalog-url.test.ts; src/components/editorial-disclosure.test.tsx; src/lib/published-structured-data.test.tsx; tests/e2e/ui-contracts.spec.ts |
| `scripts/check_r2_exit.ts` | Legacy surface checks: src/app/metadata-surfaces.test.tsx; src/components/snapshot-surfaces.test.tsx; public viewport/keyboard/axe suites |
| `scripts/check_seo_metadata.ts` | Legacy surface checks: src/app/metadata-surfaces.test.tsx; src/components/snapshot-surfaces.test.tsx; public viewport/keyboard/axe suites |
| `scripts/check_snapshot_dates.ts` | Legacy surface checks: src/app/metadata-surfaces.test.tsx; src/components/snapshot-surfaces.test.tsx; public viewport/keyboard/axe suites |
| `scripts/check_updates_surface.ts` | Legacy surface checks: src/app/metadata-surfaces.test.tsx; src/components/snapshot-surfaces.test.tsx; public viewport/keyboard/axe suites |
| `scripts/check_analytics_session.ts` | Redundant/obsolete dispatchers: Real session cases; rendered axe states; immutable 457-row subprocess cases; release pipeline replacing obsolete dispatchers |
| `scripts/check_contrast.ts` | Redundant/obsolete dispatchers: Real session cases; rendered axe states; immutable 457-row subprocess cases; release pipeline replacing obsolete dispatchers |
| `scripts/check_source_baseline.ts` | Redundant/obsolete dispatchers: Real session cases; rendered axe states; immutable 457-row subprocess cases; release pipeline replacing obsolete dispatchers |
| `scripts/check_remediation.ts` | Redundant/obsolete dispatchers: Real session cases; rendered axe states; immutable 457-row subprocess cases; release pipeline replacing obsolete dispatchers |
| `scripts/check_r7_automated_gate.ts` | Redundant/obsolete dispatchers: Real session cases; rendered axe states; immutable 457-row subprocess cases; release pipeline replacing obsolete dispatchers |
| `scripts/check_ci_workflow.ts` | Documentation/config wording only: Configuration/documentation retained; these only inspect tokens/file existence and do not execute deployment, updates or hosted Actions |
| `scripts/check_data_schedule.ts` | Documentation/config wording only: Configuration/documentation retained; these only inspect tokens/file existence and do not execute deployment, updates or hosted Actions |
| `scripts/check_dependency_cadence.ts` | Documentation/config wording only: Configuration/documentation retained; these only inspect tokens/file existence and do not execute deployment, updates or hosted Actions |
| `scripts/check_issue_templates.ts` | Documentation/config wording only: Configuration/documentation retained; these only inspect tokens/file existence and do not execute deployment, updates or hosted Actions |
| `scripts/check_deployment_artifacts.ts` | Documentation/config wording only: Configuration/documentation retained; these only inspect tokens/file existence and do not execute deployment, updates or hosted Actions |

## Caller and command changes

- Keep 14 npm entries: dev, build, start, lint, typecheck, test, test:e2e, test:e2e:prepare, data:check, db:migrate, db:seed, db:backup, data:publish-full and release:check.
- Keep useful schema, migration, import transaction, destination, maintenance, content, failure, asset, bundle and full-dataset checks as direct `npx tsx scripts/…` commands. Their real assertions are retained.
- Replace the editorial CI aggregate alias with its ten explicit retained commands. The complete browser command runs standard, large-catalog and synthetic admin-action fixture suites.
- Repair active README/operations/content commands and publish the retained inventory in docs/ops/MAINTENANCE_COMMANDS.md. Historical commands stay labeled as historical; source-only dispatchers no longer remain executable callers.
- Runtime/full-dataset checks use read-only backups and preserve snapshot count. No actual CSV approval/publication is performed by these checks.

## Current evidence

- 252 unit tests / 53 suites passed. TypeScript and full ESLint passed.
- Mixed retained checks, content checks and production failure/runtime rendering checks passed. Full-dataset routes/API passed; full-dataset and runtime checks both passed on the actual-copy build.
- Final browser coordinator:240 passed, with54 visual baselines (51 unchanged; three reviewed mobile44px link updates). Read-only admin/public contracts, large-catalog interactions and synthetic audited saves all pass.
- Source-only deletion requires explicit owner approval, per the session rule. The approval authorizes only these 56 files and the described caller/menu changes. Phase statuses remain conditional on final verification.
