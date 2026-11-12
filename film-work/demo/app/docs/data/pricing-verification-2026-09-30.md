# Pricing verification — 30 September 2026

Branch: `codex/resume-overhaul`. Task 1.9 implementation is verified. Task 1.10's conversion, publication guards, display and full disposable publication are verified. The initial checkpoint waited for approval under the instruction to ask before **any snapshot**; the owner subsequently asked to start the proposed series, authorizing the prepared disposable test. No terms in the owner's review queue were approved.

D-7 fixes the real-price horizon at 36 months. D-9 uses ECB reference observations on the price check date and preserves provider-listed VAT. Unknown renewal, upfront billing, setup fee or FX remains unknown in the public display and dependent calculations.

## Fresh command output

Checks run between 15:09 and 15:15 local time:

```text
$ npm test
> bestvpsforme@0.2.0 test
> vitest run
RUN v4.1.11 /home/twarga/Documents/bestvpsforme
Test Files  14 passed (14)
Tests       72 passed (72)
Start at    15:15:34
Duration    1.49s
exit 0

$ npx tsc --noEmit
(no diagnostics)
exit 0

$ npx eslint src scripts tests
(no diagnostics)
exit 0

$ git diff --check
(no diagnostics)
exit 0

$ DATABASE_URL=/tmp/bestvpsforme-pricing-ykaym217/catalog.db npm run build
> next build --turbopack
Next.js 16.3.3 (Turbopack)
Compiled successfully in 403ms
Finished TypeScript in 2.7s
Generating static pages using 19 workers (16/16) in 377ms
Finalizing page optimization
exit 0
```

The build database was created using SQLite backup from a read-only production connection. Only this disposable copy received migrations `0011_offer_price_terms.sql` and `0012_currency_vat.sql` and the two dated ECB rates. Both migrations are additive and nullable; they perform no price backfill. Application and publication tests use isolated in-memory databases with test-only reviewed terms.

## Live page evidence

Development command, ready in 206 ms:

```sh
DATABASE_URL=/tmp/bestvpsforme-pricing-ykaym217/catalog.db npm run dev -- --hostname 127.0.0.1 --port 3002
```

GET `/offers/hostinger-kvm-1` returned HTTP 200. This excerpt from the returned HTML shows the unreviewed price and billing rows:

```html
<span class="price-summary"><strong>$6.49<!-- --> / mo</strong><small>Renewal not reviewed</small></span>
<div class="offer-cost"><dt>Due today</dt><dd>Not published</dd></div>
<div class="offer-cost"><dt>Renewal</dt><dd>Not published</dd></div>
```

The visible page also says `Due today not published` and `VAT basis unknown`. Automated text assertions confirm it contains neither `$6.49 renewal` nor `$6.49 due today`. The exact source note still discloses the unapproved `$11.99/mo` renewal as evidence in the billing notes; it is not treated as approved structured terms.

![Hostinger unreviewed billing](hostinger-pricing-proof.jpg)

GET `/offers/netcup-vps-1000-g12` returned HTTP 200 and displayed:

```text
Effective monthly price
$12.01 / mo
€10.36 · ECB 1.1596 on 31 Aug
Renewal not reviewed
Price includes VAT
```

Inspected desktop dark and narrow light displays; the price, rate and VAT labels fit. At the narrow viewport, document width and scroll width were both 375 px. Existing styles are retained, with 12 px muted price annotations; no Phase 3 brand work was started.

![netcup dated conversion on mobile](netcup-mobile-pricing-proof.jpg)

Raw HTML/text and the downloaded official ECB CSV are retained under `/tmp/bestvpsforme-pricing-ykaym217/`. Screenshots above are durable repository artifacts.

## Currency and publication evidence

The actual [ECB reference observations for 31 August 2026](https://data-api.ecb.europa.eu/service/data/EXR/D.USD+GBP.EUR.SP00.A?startPeriod=2026-08-31&endPeriod=2026-08-31&format=csvdata) report USD per EUR `1.1596`, and GBP per EUR `0.85648`. Therefore GBP/USD is `1.1596 / 0.85648` (approximately `1.353913693255`). The illustrative `1.09` remains a unit-test input, not a production rate. No previous-day, weekend or 1.0 fallback is used.

Read-only production audit after verification:

```text
Current missing FX: EUR 99, GBP 7 (106 current rows)
All-history missing FX: 216
Production fx_rates table: absent
Production intro_months / terms_reviewed_at / vat_basis columns: absent
```

The [owner review list](price-terms-review-2026-09-30.md) includes all 43 current long-term plans, exact stored values and note text, suggestions, 25 additional monthly plans mentioning intro/renewal, and all 106 current foreign prices requiring rates. Suggestions never approve terms, and batch row approval does not approve terms.

Prepared `/tmp/bestvpsforme-pricing-ykaym217/publication-check.db`, migrated it, imported the two actual ECB rates, and staged/reviewed the full CSV without approving terms or publishing:

```json
{
  "total": 457,
  "created": 322,
  "hidden": 76,
  "rejected": 59,
  "fxBlockers": 0,
  "snapshots": 0
}
```

After explicit owner approval, the remaining check is:

```sh
DATABASE_URL=/tmp/bestvpsforme-pricing-ykaym217/publication-check.db npm run data:publish-full
```

The approved follow-up created disposable snapshots and published the 322 eligible rows with unreviewed billing terms left null. Then verify zero current foreign prices without a check-date rate, matching original amounts and conversions, and no approved terms. It ran successfully in the approved follow-up; results below. Production migrations, production publication and approval of the 43-plan terms queue remain separate owner actions.

## Additional safeguards and cleanup

- The original importer and seed no longer copy effective price into renewal or due today. A second path, manual admin price entry, received the same fix; missing FX is checked before expiring the prior price.
- The real-price model rejects a changed renewal with an unknown introductory duration. Public mapping rejects partially reviewed monthly pricing as a known three-year total. Reviewed terms, reviewer, evidence, FX and VAT survive snapshot rollback.
- USD conversions are used by public price filters, sorting, comparison and admin catalog price statistics. Missing-rate plans sort last and do not satisfy USD budget filters or contribute guessed values to averages.
- The empty, untracked `output/` directory was inspected and removed. No tracked file was deleted.
- `src/lib/finder-redirect.test.ts` retains Next's experimental `unstable_getResponseFromNextConfig`; it may need updating when Next.js is upgraded.
- No production database mutation, owner price-term approval, real snapshot publication, push or Phase 3 work occurred.

## Approved follow-up: full publication

Command: `DATABASE_URL=/tmp/bestvpsforme-pricing-ykaym217/publication-check.db npm run data:publish-full` (exit 0).

```text
totalRows: 457
blockedRows: 59
hidden: 76
approved/publishedRows/pricesInserted: 322
providersUpserted: 43
locationsLinked: 784
snapshotVersion: 2
current prices: 322
current foreign prices: EUR 99, GBP 7
current foreign prices without an exact check-date rate: 0
reviewed terms: 0
current non-null renewal or due-today values: 0
Hostinger: effectiveMonthly 6.49, cashDueToday null, renewalMonthly null
```

Snapshot id: `a29a09eb-b67a-4ef6-9c01-ec36a410b288`. SQLite verification checked current amounts and metadata on the disposable database. Fresh baseline: 72 tests passed (14 suites, 1.44 s); TypeScript and lint exited 0. Production remains unchanged.

## Final overhaul checks after pricing

Next 16.3.6: 179 unit tests / 37 suites, TypeScript, full src/scripts/tests lint and `/tmp`-copy build pass; 159 production browser tests include unreviewed Hostinger, dated EUR/VAT and unchanged visual comparisons. See [required command excerpts](../qa/2026-09-30/required-checks.md) and [fresh Hostinger HTML excerpt](../qa/2026-09-30/hostinger-final-excerpt.txt). Dev review server is `http://127.0.0.1:3002` on `/tmp/bestvpsforme-pricing-ykaym217/catalog.db`. Terms remain unapproved; the production database remains unmigrated and unpublished.
