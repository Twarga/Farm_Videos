# Full approved-dataset QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** All 322 approved offers and 43 active providers completed the isolated production-mode matrix.

Rerun from the repository root:

```bash
npm run build
npm run release:full-data-check
```

The check creates a temporary migrated SQLite database, stages the immutable 457-row source, reviews every issue, publishes 322 approved offers, starts `next start`, runs the matrix, and removes the temporary database.

## Coverage

- 322 unique public offer IDs and 43 unique provider IDs.
- Finite, non-negative prices and valid optional hardware values for each public offer.
- Search lookup for each offer SKU.
- Provider filters and provider pages partition the publication without omissions or duplicate ownership.
- Every published location plus RAM, CPU, disk, price, trust, workload, and all six sort modes obey their filter contracts.
- All 322 production offer routes and all 43 production provider routes return 200 without application-error, `NaN`, or `Infinity` output.
- Compare API batches return each of the 322 published IDs, including dotted canonical IDs.
- Sitemap contains every public offer and provider route.
- All 322 outbound routes return the expected HTTPS destination and preserve request IDs.
- Authenticated admin payload contains every published offer ID.
- One outbound event per offer produces 322 analytics clicks; offer and provider aggregates cover all 322 offers and 43 providers.

## Defect found and fixed

The first run found that `ramnode-std-0.5gb` was public but unavailable to compare. The compare API and saved-comparison parser accepted hyphens but rejected dots. The admin draft schema had the same mismatch, so an owner could not save that published record.

`src/lib/offer-id.ts` now defines the shared boundary. Public API lookup, saved comparisons, and admin writes accept canonical dotted IDs while rejecting traversal-shaped or malformed input. The admin catalog and production rendering regressions include dotted IDs.

## Findings

| Finding | Count |
|---|---:|
| Orphaned offers | 0 |
| Orphaned providers | 0 |
| Duplicate public IDs | 0 |
| Failed public routes | 0 |
| Missing sitemap entries | 0 |
| Missing or non-HTTPS destinations | 0 |
| Impossible numeric values | 0 |
| Published records missing from admin | 0 |
| Published records missing from analytics aggregates | 0 |
| Unresolved P0/P1 failures | 0 |
