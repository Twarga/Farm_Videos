# Reviewed catalog publication — 31 August 2026

## Source and decision record

- Immutable source: `data/vps-offers-2026-08-31.csv`
- SHA-256: `f66167460173cd27aefd726153932ec5ad002057e9e7ebe927cd833f8d63adc1`
- Source rows: 457
- Import job: `a8b2f1c4-f273-4369-abd9-ad5b37497186`
- Publicly approved: 322 offers across 43 active providers
- Review-only: 76 rows retained outside the VPS catalog
- Rejected/non-public: 59 rows, including the immutable row-289 missing-price blocker
- Rows with warnings: 205
- Verification issues: 355 original records retained; 169 classified as allowed explicit unknowns and 186 classified as retained non-public; 0 unresolved

## Active local publication evidence

- Active snapshot: version 4, `c1c0ef74-a7fd-4a98-a3c5-097e82bb704d`
- Snapshot offer records: 322
- Published offers: 322
- Current open prices: 322
- Publicly mapped offers: 322
- Location links processed per publication: 784
- Affiliate research: 61 entries parsed, 30 source-backed programs upserted, 31 entries skipped because no source URL was present

The publication transaction archives stale seed/public offers, closes their prices, upserts the approved replacement, writes new price-history rows, normalizes active providers, and creates the active snapshot atomically. The rehearsal restored the two-offer baseline and republished the 322-offer source twice; the first rehearsal exposed a price-ID collision, which is now covered by the rollback/republish regression.

The SQLite runtime database is intentionally ignored by Git. A deployment must run the same migration and `npm run data:publish-full` workflow against its production database before readiness can return 200.
