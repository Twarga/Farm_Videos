# Shore publication read model

Implemented in src/lib/public-catalog.ts and the pure src/lib/shore-offer.ts adapter. This extends the existing backend; it is not another publication pipeline.

## Server access

- getPublicShoreCatalog(): approved offer projections and their metadata, read inside one SQLite transaction and request-cached through React.
- getPublicOffers(): the same approved projections, never the mockup fixture.
- getPublicCatalogMeta(): eligible count/provider count, total published count, active snapshot ID/version/date and explicit availability/source state. An unavailable publication has null counts and dates, not invented zero inventory.

The full approved publication remains addressable. Only list-eligible offers have a numeric rank; unranked canonical details retain rank=null. Ranking uses existing filterOffers and sortOffers over the full eligible cohort. Changing commission flags cannot change positions. Components must look up already ranked rows instead of re-ranking a filtered page.

## Data semantics

The field names intentionally match the approved mockup where useful. Native-currency amounts: eff, adv, intro, ren, setup, cash. USD amounts: usd (displayPriceUsd basis) and real (reviewedPrice projection). Missing conversion returns null, never 1:1. Original source/date remain url/checked; outgoing purchase actions use outboundPath=/go/[id], not url. providerId is the internal filter ID; pid is the canonical provider slug.

Unknown numbers/booleans remain null. Real zero setup fees and false reviewed facts remain 0/false. Unreviewed terms and draft editorial are withheld. tr retains the existing bounded terms-review meaning; UI must use the existing review-scope wording, never describe a provider as globally verified. Source rating/check-date fields remain separate. No affiliate tracking template, private actor, draft evidence or import row enters the projection.

## URL compatibility

Canonical keys remain q, ram, cpu, disk, providers, locations, regions, honesty, price, trust, sort, dir, view, per and page. Read aliases prov/loc/flags/tp; serialize canonical keys only. Canonical keys win even when empty. Sort aliases value/price/bw/tp map to recommended/real/bandwidth/trustpilot. Mock rank-ascending becomes recommended-descending (best first); price alias defaults ascending. Retired workload links are accepted and ignored, as the V1 handoff requires; internal workload-domain helpers remain unchanged.

page defaults to 1, ignores malformed/unsafe integers, serializes only above 1 and clamps to actual results in createCatalogPage. Existing real-price sort still puts missing reviewed totals last; it is not redefined as an advertised-price claim. Recommendation direction now honors explicit reversal without altering its default order.

## Verification

- src/lib/shore-offer.test.ts: nulls, held claims, zero/false preservation, native/USD separation, missing FX, complete-cohort/commission-independent ranks, reverse direction, unrated identity retention and canonical slug versus internal ID.
- src/lib/catalog-shore-url.test.ts and existing catalog URL tests: canonical keys, aliases, malformed input, retired links, paging and approved slider steps.
- scripts/check_public_parity.ts: a disposable DB verifies unavailable/empty states and exact snapshot/API/offer/provider/home/sitemap/outbound/read-model parity, metadata/ranks and no private tracking-template leak.
- scripts/check_catalog_payload.ts: production-rendered first-page DOM and payload budget; uses a local disposable database.

No deployment or new provider-price publication is authorized by this adapter.
