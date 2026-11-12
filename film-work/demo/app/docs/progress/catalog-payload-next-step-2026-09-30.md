# Task 1.7: remaining catalog payload target

**Status (resolved, 30 September 2026):** the shared responsive DOM proposal below was executed. Page-one raw HTML measured **109,008 bytes** (< the 150,000 target) via `CATALOG_CHECK_ORIGIN=http://127.0.0.1:3109 npx tsx scripts/check_catalog_payload.ts`. Owner decision: the server page is **24 rows** (`CATALOG_PAGE_SIZE`), which lets the byte budget stand without dropping row features. `MobileDealList`/`MobileOfferRow` were deleted; `DealTable` renders one `<table>` whose rows reflow into cards under 760 px; mobile keeps a 20-row progressive window. Verified: 252 unit tests, 240 browser checks, runtime-rendering, accessibility and bundle checks all pass.

The completion measurements below are kept as the historical record of the dual-layout architecture's floor (258,141 bytes), which is why the shared DOM was required rather than further diet.

## Historical record

The dual SSR structure reached 258,141 bytes (from 719,062) and could not reach 150,000 while rendering each offer twice plus the ~42 KB hydration payload. The proposal below was approved and implemented with the 24-row page-size adjustment.

<details>
<summary>Original proposal (approved 30 Sep)</summary>

Authorize only a shared responsive result DOM as the remaining part of Task 1.7:

1. Add a shared responsive result-row component and short semantic classes; desktop remains a semantic table, mobile keeps its existing identity/price/specs, Details disclosure, compare and paid-link actions.
2. Update CatalogClient to render one server page. Preserve mobile progressive reveal and reset it on filtering; preserve all rows, dated currency evidence, unknown facts, full billing details and URL pagination.
3. Narrow and compact the transport representation without replacing known facts with defaults. Keep facets based on the full published scope.
4. Add real rendering/transport tests and browser cases for filtered off-page results, mobile Details, compare, share/reload, and pagination/Back.
5. Verify raw page-one HTML below 150 KB on the real `/tmp` backup, then run mobile Lighthouse, serious/critical axe gates and 390/1024/1440 light/dark captures. Preserve the existing interaction and appearance; fix regressions before committing.

</details>
