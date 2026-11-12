# Browser verification

`npm run test:e2e` prepares a deterministic SQLite fixture in memory, backs it up to `/tmp/bestvpsforme-e2e/catalog.db`, applies additive migrations on that copy, builds, and starts the production server on port 3100. Chromium covers desktop light/dark at 1440×1000 and mobile at 390×844. Tests fail on serious/critical axe issues. Visual snapshots allow at most 1% pixel difference.

Provider ratings and affiliate approval in this fixture are synthetic test inputs. Billing terms remain unreviewed. No publication API, dataset snapshot creation, production database migration, or owner term approval runs. The public interface uses the published repository, not demo UI mode.

The coordinator always uses synthetic fixtures: the standard suite, a separate 50-row large catalog suite and a separate audited admin-action suite. Those profiles use distinct `/tmp` databases; none can target the real database.

For an additional current-data integration run, invoke `npx playwright test` directly with `E2E_FIXTURE=0` after preparing/building its disposable copy. This backs up `data/bestvpsforme.db` through a read-only SQLite connection; only the `/tmp` backup is migrated or written. Visual baselines are intentionally generated from deterministic fixtures, so use `--grep-invert 'visual baseline'` for a current-data run.

The fixture ECB CSV is the actual 31 August 2026 reference observation retrieved from [the ECB data API](https://data-api.ecb.europa.eu/service/data/EXR/D.USD+GBP.EUR.SP00.A?startPeriod=2026-08-31&endPeriod=2026-08-31&format=csvdata): USD/EUR 1.1596 and GBP/EUR 0.85648. It provides exact dated rates without a CI network dependency.

`E2E_REUSE_BUILD=1` starts the production server without rebuilding, for CI after its explicit build. The coordinator refreshes its standard fixture and prepares separate large/action copies. Reports and traces appear in ignored `playwright-report/` and `test-results/`.
