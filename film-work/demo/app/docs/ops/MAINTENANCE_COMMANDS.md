# Maintenance commands

`npm run release:check` runs lint, typecheck, unit tests, security, editorial checks and the browser pipeline. The browser pipeline prepares deterministic `/tmp` databases and builds before testing. Retained specialist checks below remain directly runnable; their presence does not assert they ran in the current session.

Use an isolated `/tmp` database for checks, builds and development. Owner approval is required before production migration, snapshot publication, term approval or tracked-file deletion. Operational recheck/backup/import commands must be reviewed for their target before execution.

Former npm aliases are preserved in historical reports as evidence of the commands used at the time; find the equivalent direct check by its script filename here. Removed source-only scripts are recorded in the retirement proposal; they are not current commands.

Useful commands:

```bash
npx tsx scripts/check_db_setup.ts
npx tsx scripts/import_fx_rates.ts --help
npx tsx scripts/recheck_offers.ts --strict
npx tsx scripts/recheck_commercial.ts
npx tsx scripts/check_destination_links.ts
npm run db:backup
npm run ops:purge-corrections
npx vitest
```

`npm run ops:purge-corrections` erases the email address of every correction resolved more than 90 days ago. It keeps the claim, source and resolution note and prints how many addresses it removed. Run it daily from the administration image (the standalone app image has no `scripts/` folder); an open or recently resolved correction keeps its address so a reply is still possible.

## Current check inventory

The owner approved the exact 56-file retirement on 30 September 2026. The retained check inventory below also includes the Phase 7 runtime gates; source-only checks and obsolete dispatchers have been removed.

- `npx tsx scripts/check_accessibility_runtime.mts` (requires an existing `/tmp` `RUNTIME_SOURCE_DATABASE` online backup and sanitized production `RUNTIME_BUILD_DIR`; see `docs/qa/phase-7/accessibility.md`)
- `npx tsx scripts/check_admin_catalog.ts`
- `npx tsx scripts/check_affiliate_import.ts`
- `npx tsx scripts/check_affiliate_schema.ts`
- `npx tsx scripts/check_analytics_click.ts`
- `npx tsx scripts/check_analytics_metrics.ts`
- `npx tsx scripts/check_analytics_reporting.ts`
- `npx tsx scripts/check_analytics_schema.ts`
- `npx tsx scripts/check_author_editorial.ts`
- `npx tsx scripts/check_backup_restore.ts`
- `npx tsx scripts/check_bundle_rendering.ts`
- `npx tsx scripts/check_catalog_payload.ts`
- `npx tsx scripts/check_commercial_rechecks.ts`
- `npx tsx scripts/check_completeness_policy.ts`
- `npx tsx scripts/check_conversion_import.ts`
- `npx tsx scripts/check_data_layer_separation.ts`
- `npx vitest run src/lib/dataset-stats.test.ts src/components/guides/dataset-guide.test.tsx`
- `npx tsx scripts/check_db.ts`
- `npx tsx scripts/check_db_ready.ts`
- `npx tsx scripts/check_db_setup.ts`
- `npx tsx scripts/check_destination_links.ts`
- `npx tsx scripts/check_failure_states.ts`
- `npx tsx scripts/check_full_dataset_qa.ts`
- `npx tsx scripts/check_full_publication.ts`
- `npx tsx scripts/check_guides_analytics.ts`
- `npx tsx scripts/check_guides_article.ts`
- `npx tsx scripts/check_guides_content.ts`
- `npx tsx scripts/check_guides_discovery.ts`
- `npx tsx scripts/check_guides_freshness.ts`
- `npx tsx scripts/check_guides_index.ts`
- `npx tsx scripts/check_guides_metadata.ts`
- `npx tsx scripts/check_guides_workflow.ts`
- `npx tsx scripts/check_import_job.ts`
- `npx tsx scripts/check_import_preview.ts`
- `npx tsx scripts/check_import_publish.ts`
- `npx tsx scripts/check_import_review.ts`
- `npx tsx scripts/check_import_schema.ts`
- `npx tsx scripts/check_location_schema.ts`
- `npx tsx scripts/check_locations.ts`
- `npx tsx scripts/check_media_behavior.ts`
- `npx tsx scripts/check_offer_rechecks.ts`
- `npx tsx scripts/check_offer_schema.ts`
- `npx tsx scripts/check_ops_alerts.ts`
- `npx tsx scripts/check_performance_runtime.mts` (requires an existing `/tmp` `RUNTIME_SOURCE_DATABASE` online backup and sanitized production `RUNTIME_BUILD_DIR`)
- `npx tsx scripts/check_phase7_js_budget.ts` (same sanitized runtime requirements as performance; includes framework/shared scripts in the strict budget)
- `npx tsx scripts/check_phase7_freshness.ts` (owns a synthetic `/tmp` fixture and server; requires sanitized `RUNTIME_BUILD_DIR`)
- `npx tsx scripts/check_phase7_recovery.ts` (owns a synthetic `/tmp` fixture and server; requires sanitized `RUNTIME_BUILD_DIR`)
- `npx tsx scripts/check_phase3.ts`
- `npx tsx scripts/check_price_schema.ts`
- `npx tsx scripts/check_product_classification.ts`
- `npx tsx scripts/check_provider_normalization.ts`
- `npx tsx scripts/check_provider_publication_profile.ts`
- `npx tsx scripts/check_provider_rendering.ts`
- `npx tsx scripts/check_provider_schema.ts`
- `npx tsx scripts/check_public_catalog.ts`
- `npx tsx scripts/check_public_data_mode.ts`
- `npx tsx scripts/check_public_destination.ts`
- `npx tsx scripts/check_public_home.ts`
- `npx tsx scripts/check_public_offer.ts`
- `npx tsx scripts/check_public_parity.ts`
- `npx tsx scripts/check_public_provider.ts`
- `npx tsx scripts/check_public_redirects.ts`
- `npx tsx scripts/check_publication_policy.ts`
- `npx tsx scripts/check_publication_snapshot.ts`
- `npx tsx scripts/check_raw_preservation.ts`
- `npx tsx scripts/check_redirect_latency.ts`
- `npx tsx scripts/check_remediation_fixture.ts`
- `npx tsx scripts/check_repository.ts`
- `npx tsx scripts/check_runtime_rendering.ts`
- `npx tsx scripts/check_security_headers.ts`
- `npx tsx scripts/check_security_schema.ts`
- `npx tsx scripts/check_staging.ts`
- `npx tsx scripts/check_static_independent_offers.ts`
- `npx tsx scripts/check_viewport_baseline.ts`
- `npx tsx scripts/check_viewport_theme_matrix.ts`
