# bestvpsforme

Pre-production VPS comparison app built with Next.js, React, Drizzle and SQLite. Public pages show reviewed database facts; the owner admin handles imports, publication and corrections. Billing terms and currency conversion remain under remediation; see the progress ledger.

## Run locally

```bash
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3002
```

Configure `.env.local` using `.env.example`, including a local `DATABASE_URL`. For a new development database, run `npm run db:migrate` and `npm run db:seed`. Keep credentials and database files out of Git.

Open [the website](http://127.0.0.1:3002), [catalog](http://127.0.0.1:3002/catalog) or [private admin](http://127.0.0.1:3002/admin). Admin access requires the authentication settings described in `.env.example`.

Public pages require reviewed database records. `BESTVPSFORME_PUBLIC_DATA_MODE=fixture` enables isolated development fixtures; production ignores it. The legacy `/for-me` URL permanently redirects to `/catalog`.

## Verify

```bash
npm run release:check
```

Use a disposable `DATABASE_URL` for verification. `npm run data:check` validates the immutable research CSV; `npx tsx scripts/check_db_setup.ts` verifies a disposable migrated database. Research is staged and approved before publication; publishing is an explicit owner action.

The release gate includes dependency/data checks, lint, typecheck, unit tests, security, editorial checks, browser journeys and the strict catalog JavaScript budget. Local runtime gates automatically build a disposable credential-free workspace when dotenv files are present. An explicitly supplied `RUNTIME_BUILD_DIR` must already be sanitized. Production build and typecheck commands clear stale generated dev route validators.

## Documentation

- [Binding product contract](docs/product/PRODUCT_CONTRACT.md), [product brief](PRODUCT.md) and [current design](DESIGN.md).
- [Master roadmap](bigone.md), [current progress ledger](docs/progress/session-resume-2026-09-28.md) and [brand references](brand/README.md).
- [Data quality](docs/data/DATA_QUALITY.md) and [refresh workflow](docs/data/DATA_REFRESH.md).
- [Deployment](docs/ops/DEPLOYMENT.md), [release runbook](docs/ops/RELEASE_RUNBOOK.md), [backups](docs/ops/BACKUPS.md) and [launch checklist](docs/ops/LAUNCH_CHECKLIST.md).
- [Editorial independence](docs/product/EDITORIAL_INDEPENDENCE.md), [analytics contract](docs/product/ANALYTICS_CONTRACT.md) and [content guide](docs/product/CONTENT_GUIDE.md).
- [Growth metrics](docs/growth/GROWTH_KPIS.md) and [content review](docs/growth/CONTENT_REVIEW.md).
- Historical [implementation plan](docs/archive/IMPLEMENTATION_PLAN.md), [remediation plan](docs/archive/REMEDIATION_PLAN.md) and [progress board](docs/archive/PROJECT_PROGRESS.md).

The immutable offer evidence is `data/vps-offers-2026-08-31.csv`; affiliate research is stored separately under `data/`. Commission never changes organic ranking. Unknown facts stay unknown, and prices are dated snapshots.
