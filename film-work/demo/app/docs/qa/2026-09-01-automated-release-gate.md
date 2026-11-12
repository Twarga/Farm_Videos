# Automated release gate — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


Historical evidence: the command groups and counts below describe the 1 September run. The [30 September retirement record](../progress/source-check-retirement-2026-09-30.md) lists retired names and actual Vitest replacements; documentation-only checks were removed and their owner review requirements remain. The current release gate uses `npm run release:check`.

## Result

**Pass.** The local automated release gate found no unresolved P0 or P1 failures.

Rerun from the repository root:

```bash
npm ci
npm run release:automated-check
```

The verified working-tree run completed in 180.8 seconds on 2026-09-01.

## Environment

| Item | Value |
|---|---|
| Node.js | v24.17.0 |
| npm | 11.13.0 |
| Next.js | 16.3.3 |
| Platform | Linux x64 |
| Database | SQLite through better-sqlite3 and Drizzle |

## Commands covered

`npm run release:automated-check` runs these groups and stops on an unexpected result:

| Group | Commands |
|---|---|
| Remediation | `npm run remediation:check` (82 product, data, UI, admin, runtime, security, lint, build, bundle, full-dataset, viewport, accessibility, performance, recovery, launch-review, content-guide, frontmatter, Guides index/article/author/metadata/discovery/analytics/volume/dataset-report/freshness/workflow, rendering, and injected-failure checks) |
| Database | `npm run db:setup-check`, `db:provider-check`, `db:offer-check`, `db:price-check`, `db:location-check`, `db:affiliate-check`, `db:import-check`, `db:security-check`, `db:analytics-check`, `db:repository-check` |
| Import | `npm run data:phase3-check` |
| Admin security | `npm run admin:auth-check`, `admin:csrf-check`, `admin:catalog-check` |
| Public routes | `npm run public:catalog-url-check`, `public:seo-check`, `public:redirect-check`, `public:destination-check` |
| Analytics | `npm run analytics:click-check`, `analytics:latency-check`, `analytics:session-check`, `analytics:funnel-check`, `analytics:reporting-check`, `analytics:metrics-check`, `analytics:conversion-check` |
| Operations | `npm run operations:trust-check`, `operations:privacy-check`, `operations:corrections-check`, `operations:protection-check`, `operations:email-check`, `operations:partnership-check`, `operations:seo-check`, `operations:structured-data-check`, `operations:offer-recheck-check`, `operations:commercial-recheck-check`, `operations:destination-check`, `operations:alerts-check`, `operations:checklist-check`, `operations:independence-check` |
| Launch artifacts | `npm run launch:logging-check`, `launch:health-check`, `launch:performance-check`, `launch:deployment-check`, `launch:monitoring-check`, `launch:backup-check`, `launch:runbook-check`, `launch:checklist-check` |
| CI and dependencies | `npm run growth:ci-check`, `growth:dependency-check`, `npm audit --omit=dev --json` |
| Immutable source diagnostic | `npm run data:check` with an enforced expected exit status and exact blocker classification |

## Counts and measured evidence

- Raw research source: 457 rows, 24 columns, 63 providers.
- Reviewed publication profile: 322 public offers and 43 providers.
- Database readiness: 20 required tables.
- Full public parity: homepage, catalog API, 43 provider pages, 322 offer pages, sitemap entries, and outbound disclosures reconcile.
- Production bundle ceilings passed: home 46,770 B, catalog 109,072 B, compare 75,474 B, admin 190,259 B, admin imports 57,265 B, offer 60,012 B, provider 115,708 B initial client JS.
- Full-data browser profile mounted 322 desktop rows or 20 mobile rows, with no duplicate responsive tree.
- Local outbound lookup p95: 1.14 ms against the 100 ms target.
- Production dependency audit: 0 vulnerabilities.
- Automated coverage: 82 remediation checks and 49 supplemental checks, plus 126 route/theme/viewport captures, the runtime accessibility matrix, cold/mobile performance measurements, recovery report contract, launch review contract, content-guide, frontmatter, and Guides index/article/author/metadata contracts, source diagnostic, and production audit.

## Classified source diagnostic

The immutable research CSV contains one known error and six warning classes. Row 289 has no `effective_monthly_usd`. The import policy blocks that row, and the reviewed publication checks prove it cannot enter the 322-offer public snapshot. The release command fails if the diagnostic count, row, field, or exit status changes.

This source finding is resolved at the publication boundary. It is not an unresolved public-data P0/P1 failure.

## Failure review

| Severity | Unresolved count | Evidence |
|---|---:|---|
| P0 | 0 | Publication, auth/CSRF, production headers, database readiness, rollback code, encrypted local restore, and bounded failure checks pass |
| P1 | 0 | Primary UI, accessibility contracts, bundle ceilings, full-data rendering, media, analytics, and operations checks pass |
| P2 | 0 found by this gate | R7 manual QA may still identify polish work |

## Scope boundary

This report proves R7-01 on the local release candidate. It does not claim a real VPS deployment, production DNS/TLS, off-host R2 upload, received external alert, clean-host recovery, manual viewport matrix, assistive-technology review, or field Core Web Vitals. R7-03 through R7-08 own those checks.
