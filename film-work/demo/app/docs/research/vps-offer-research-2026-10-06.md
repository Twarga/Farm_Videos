# VPS offer fact-check and discovery — 6 October 2026

Researched 41 provider brands, checked all 20 Phase 6 batch-1 entries, and recorded 49 candidate plan/term combinations. This is a review document: no production rows, draft payloads, frozen snapshots or ranking rules were changed. Candidate rows include existing-plan refreshes and holds, not only new offers.

## Findings that need attention before loading batch 1

- IONOS M+: stored $4 intro / $11 later differs from the current $5 / $14 advertisement. Review the price and catch together.
- RackNerd and Namecheap now provide stronger renewal evidence; their draft “unknown” wording needs owner review.
- Time4VPS €2.88 / €5.77 is the 24-month option, while stored termMonths is 1. AlphaVPS annual evidence also needs a separate annual term rather than its monthly row.
- UpCloud Starter storage is described as standard SSD, while the stored row says MaxIOPS. HOSTKEY displays €2.46 at 0% VAT versus stored native €2.92; resolve tax/region basis.
- Alibaba’s old $2.50 ECS identity remains unresolved. InterServer and Scaleway have partial current verification because direct retrieval was blocked/too large.

## Batch-1 checks

Status counts: {'partial': 2, 'review_update': 7, 'confirmed': 10, 'unresolved': 1}. “Confirmed” covers the price/specs/catch stated below, not stock, every add-on, reliability, or a blanket renewal guarantee. Stored amounts are native original amounts, not normalized USD equivalents.

| Offer | Stored native amount / term | Current provider advertisement | Result and next review |
|---|---|---|---|
| [scaleway-stardust1-s](https://www.scaleway.com/en/pricing/virtual-instances/) | EUR 0.43; term 1m | EUR 0.0006/hour; provider approximates EUR 0.43/month | **partial** — Pricing index agrees with compute rate. Full pricing fetch exceeds tool size limit; complete current storage/IP charges and stock remain unverified. June 2026 pricing update independently supports hourly rate. |
| [racknerd-special-1gb](https://www.racknerd.com/specials/) | USD 1.83; term 12m | USD 21.99/year | **review_update** — 1 CPU, 1 GB, 20 GB SSD, 3 TB transfer match. FAQ now expressly states same-rate renewal; draft renewal-unknown wording needs review. |
| [ramnode-lite-1gb](https://ramnode.com/products/cloud-vps) | USD 2; term 1m | USD 2/month; IPv4 adds USD 2/month | **confirmed** — 1 CPU, 1 GB, 15 GB NVMe, 500 GB transfer. IPv6 base plan and IPv4 surcharge confirmed. |
| [buyvm-slice-512](https://buyvm.net/kvm-dedicated-server-slices/) | USD 2; term 12m | USD 24/year | **confirmed** — 512 MB, 1 shared core, 10 GB SSD; yearly-only billing confirmed. No inference of available stock. |
| [webdock-essential](https://webdock.io/pricing) | EUR 2.15; term 1m | EUR 2.15/month | **confirmed** — 1 CPU, 2 GB, 15 GB NVMe, 1 TB outgoing; extra outgoing EUR 2.50/TB in 100 GB increments. |
| [alibaba-cloud-aliyun-ssd-starter](https://www.alibabacloud.com/starter-packages/general) | USD 2.5; term 1m | Old USD 2.50 ECS identity not recovered | **unresolved** — URL redirects to Simple Application Server. Keep identity/specs hold; do not substitute a different SKU. |
| [interserver-1-slice](https://www.interserver.net/vps/) | USD 3; term 1m | USD 3/month in provider search index | **partial** — Indexed 1 CPU/2 GB/40 GB agrees. Direct fetch 403; current 2 TB allowance and checkout not verified. |
| [time4vps-linux-2](https://www.time4vps.com/linux-vps/) | EUR 2.88; term 1m | EUR 2.88/month on 24-month option; renewal EUR 5.77/month | **review_update** — 1 CPU, 2 GB, 25 GB, 4 TB match. Monthly option EUR 4 then 7.99; annual EUR 3.19 then 6.38. Stored termMonths=1 conflicts with discount term; qualify draft renewal by term. |
| [hostkey-hostkey-pico](https://hostkey.com/vps/) | EUR 2.92; term 1m | EUR 2.46/month displayed with 0% VAT | **review_update** — 1 CPU, 1 GB, 40 GB SSD, 3 TB match. Stored native amount EUR 2.92 differs; resolve region/tax basis before treating as a price change. |
| [alphavps-alpha-c2g](https://alphavps.com/cheap-vps) | EUR 2.99; term 1m | EUR 2.99/month or EUR 30.50/year | **review_update** — 2 CPU, 2 GB, 30 GB NVMe, 3 TB match; explicit flat renewal. Annual equivalent 2.54 is valid only for annual term; stored termMonths=1 needs term-specific review. |
| [clouding-io-clouding-1gb](https://clouding.io/en/) | EUR 3; term 1m | EUR 0.004/hour; EUR 3 monthly cap | **confirmed** — 0.5 CPU, 1 GB, 5 GB NVMe; 4 TB then EUR 0.004/GB confirmed. |
| [upcloud-starter-1xcpu-1gb](https://upcloud.com/products/cloud-servers/) | EUR 3; term 1m | EUR 3/month | **review_update** — 1 CPU, 1 GB, 10 GB and five-instance limit match. Starter is described as standard SSD; stored MaxIOPS label needs correction review. |
| [namecheap-spark](https://www.namecheap.com/hosting/vps/) | USD 3.88; term 12m | USD 46.56 first year; USD 58.56/year renewal | **review_update** — 1 CPU, 1 GB, 20 GB SSD, 1 TB match. Direct official pricing now supplies renewal evidence; owner review still required. |
| [digitalocean-basic-512mb](https://www.digitalocean.com/pricing/droplets) | USD 4; term 1m | USD 4/month cap | **confirmed** — 1 CPU, 512 MiB, 10 GiB SSD, 500 GiB transfer. Preserve binary units; no VPN tag below catalog RAM floor. |
| [ionos-vps-m-plus](https://www.ionos.com/servers/vps) | USD 4; term 12m | USD 5/month for 3 months, then USD 14/month; 1-year term | **review_update** — 2 CPU, 4 GB, 120 GB NVMe match. Stored USD 4/11 is stale relative to current advertisement; do not load unchanged catch as current advice. |
| [ovhcloud-vps-1](https://www.ovhcloud.com/en/vps/) | USD 4.54; term 1m | From USD 4.54/month on worldwide page | **confirmed** — 2 CPU, 4 GB, 40 GB NVMe match. APAC 500 GB then 10 Mbps confirmed; from-price remains configuration/region dependent. |
| [hostsailor-hs-mini-nvme](https://hostsailor.com/kvm-vps) | USD 4.99; term 1m | USD 4.99/month | **confirmed** — 1 CPU, 1 GB, 30 GB NVMe, 1 TB transfer match. Do not attach expired forum coupon. |
| [hostwinds-ul-1](https://www.hostwinds.com/vps/unmanaged-linux) | USD 4.99; term 1m | USD 4.99/month | **confirmed** — Official current path confirms unmanaged Linux, 1 CPU, 1 GB, 30 GB SSD, 1 TB. Replace old source path in future evidence. |
| [liquid-web-lw-1g](https://www.liquidweb.com/pricing/) | USD 5; term 1m | From USD 5/month | **confirmed** — 1 CPU, 1 GB, 30 GB SSD, 1 TB match. Other discounted plans are separate; do not apply their introduction to this tier. |
| [knownhost-entry](https://www.knownhost.com/unmanaged-vps) | USD 5; term 1m | From USD 5/month | **confirmed** — 1 CPU, 1 GB, 25 GB NVMe, 2 TB, two IPs match. Current unmanaged source path confirmed. |

Scaleway hourly-rate cross-check: [provider June 2026 pricing update](https://www.scaleway.com/en/blog/a-transparent-update-on-scaleway-pricing/). Scaleway/InterServer index evidence is weaker than a fully fetched current pricing page. Workload suitability remains editorial judgment; this research supplies no workload benchmarks.

## Candidate offers

Each table is sourced from its linked provider page, retrieved or indexed on 2026-10-06. Monthly equivalents are arithmetic in the original currency and exclude unknown taxes/add-ons. An annual price is payable annually. No expiry date was verified for any candidate; an empty deadline does not mean permanent availability.

Priority for review: CloudCone Halloween, GreenCloud stocked sale SKUs, and DediOne stocked specials supply new promotional inventory. RackNerd is an existing-plan refresh. HostBrr/ServaRica add regular or annual-discount options. Provider due diligence is still needed for new brands; low price alone does not establish trust.

### CloudCone — seasonal_sale

[Provider source](https://hello.cloudcone.com/halloween-vps-sale-2026/). Annual prepayment. No end date published. Same-rate renewal stated for unchanged plan. Public order form totals remain dynamic; promotional plans cannot be upgraded/swapped.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| Frankenstein-26-SSD-VPS-1 | 2 / 1.25 GB / 30 GB SSD | USD 20.25 / 12m | 1.69 | 20.25 / 12m | advertised_not_checkout_verified |
| Frankenstein-26-SSD-VPS-2 | 4 / 2.5 GB / 50 GB SSD | USD 37 / 12m | 3.08 | 37 / 12m | advertised_not_checkout_verified |
| Frankenstein-26-SSD-VPS-3 | 5 / 3.5 GB / 70 GB SSD | USD 49 / 12m | 4.08 | 49 / 12m | advertised_not_checkout_verified |
| Frankenstein-26-SSD-VPS-4 | 8 / 5 GB / 100 GB SSD | USD 69 / 12m | 5.75 | 69 / 12m | advertised_not_checkout_verified |
| Frankenstein-26-SSD-VPS-5 | 12 / 9 GB / 180 GB SSD | USD 119.99 / 12m | 10.00 | 119.99 / 12m | advertised_not_checkout_verified |

### GreenCloudVPS — limited_stock_sale

[Provider source](https://greencloudvps.com/billing/store/budget-kvm-sale). No refunds. Stock is a store observation; renewal guarantee not established.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| BudgetKVMNYC-3 | 4 / 8 GB / 60 GB NVMe | USD 45 / 12m | 3.75 | Unverified | store_reports_stock (3 shown) |
| BudgetKVMNYC-2 | 2 / 4 GB / 35 GB NVMe | USD 25 / 12m | 2.08 | Unverified | out_of_stock (0 shown) |

### GreenCloudVPS — limited_stock_sale

[Provider source](https://greencloudvps.com/billing/store/premium-kvm-sale). No refunds. EPYCNYC-1 order link redirected to Budget store; resolve this before publication.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| EPYCNYC-1 | 1 / 2 GB / 25 GB NVMe | USD 25 / 12m | 2.08 | Unverified | store_stock_but_order_redirect (8 shown) |
| EPYCNYC-2 | 2 / 3 GB / 35 GB NVMe | USD 35 / 12m | 2.92 | Unverified | store_reports_stock (5 shown) |
| EPYCNYC-3 | 4 / 8 GB / 60 GB NVMe | USD 20 / 3m | 6.67 | Unverified | store_reports_stock (1 shown) |

### DediOne — limited_stock_sale

[Provider source](https://dedione.com/store/special-vps-plans). Annual prepayment. Renewal amount not established. LAX order link returned category page; provider due diligence and checkout needed.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| 20260520-LAX.VPS.INTL.1C1G20G-Special-12.99 | 1 / 1 GB / 20 GB SSD | USD 12.99 / 12m | 1.08 | Unverified | store_stock_but_order_redirect (45 shown) |
| 20260616-KC.VPS.CN.2C2G50G-Special-25.99 | 2 / 2 GB / 50 GB NVMe | USD 25.99 / 12m | 2.17 | Unverified | store_reports_stock (103 shown) |
| 20260520-LAX.VPS.CN.2C2G40G-Special-25.99 | 2 / 2 GB / 40 GB SSD | USD 25.99 / 12m | 2.17 | Unverified | store_reports_stock (236 shown) |

### RackNerd — recurring_special

[Provider source](https://www.racknerd.com/specials/). Annual prepayment. FAQ expressly permits same-rate renewal; no sale deadline supplied. BlackFriday path redirects here.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| Specials 1 GB KVM | 1 / 1 GB / 20 GB SSD | USD 21.99 / 12m | 1.83 | 21.99 / 12m | advertised_not_checkout_verified |
| Specials 2 GB KVM | 2 / 2 GB / 35 GB SSD | USD 35.99 / 12m | 3.00 | 35.99 / 12m | advertised_not_checkout_verified |
| Specials 4 GB KVM | 3 / 4 GB / 60 GB SSD | USD 59.99 / 12m | 5.00 | 59.99 / 12m | advertised_not_checkout_verified |
| Specials 6 GB KVM | 6 / 6 GB / 100 GB SSD | USD 89.99 / 12m | 7.50 | 89.99 / 12m | advertised_not_checkout_verified |
| Specials 8 GB KVM | 7 / 8 GB / 150 GB SSD | USD 119.99 / 12m | 10.00 | 119.99 / 12m | advertised_not_checkout_verified |

### CloudCone — regular

[Provider source](https://cloudcone.com/vps/). Annual payment, despite monthly-equivalent display. Distinct from Halloween campaign; renewal not separately captured for these plans.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| SSD VPS 1 | 2 / 1 GB / 30 GB SSD | USD 28 / 12m | 2.33 | Unverified | advertised_not_checkout_verified |
| SSD VPS 2 | 4 / 2 GB / 60 GB SSD | USD 46 / 12m | 3.83 | Unverified | advertised_not_checkout_verified |
| SSD VPS 3 | 6 / 3 GB / 90 GB SSD | USD 69 / 12m | 5.75 | Unverified | advertised_not_checkout_verified |

### HostBrr — regular

[Provider source](https://hostbrr.com/vps.html). Monthly base plan. Public IPv4 price/inclusion unresolved; cPanel NEWLAUNCH discount is unrelated to VPS.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| Value 2GB | 1 / 2 GB / 25 GB NVMe | EUR 2 / 1m | 2.00 | Unverified | advertised_not_checkout_verified |

### HostHatch — regular

[Provider source](https://hosthatch.com/products). Provider search index only; direct extraction empty. From-prices; APAC transfer differs. Require direct configurator verification.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| NVMe 2 GB | 1 / 2 GB / 10 GB NVMe | USD 4 / 1m | 4.00 | Unverified | index_only_requires_verification |
| NVMe 4 GB | 2 / 4 GB / 20 GB NVMe | USD 6 / 1m | 6.00 | Unverified | index_only_requires_verification |
| NVMe 8 GB | 2 / 8 GB / 35 GB NVMe | USD 9 / 1m | 9.00 | Unverified | index_only_requires_verification |

### ServaRica — annual_discount

[Provider source](https://servarica.com/browse/). Amounts in USD, also CAD on source. Dedicated-core claim is provider-reported. Order link advertised; stock not purchased/guaranteed.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| V3 KVM Slim Slice 4 | 4 / 4 GB / 120 GB NVMe | USD 132 / 12m | 11.00 | Unverified | order_link_advertised |
| V3 KVM FAT Slice 4 | 4 / 8 GB / 120 GB NVMe | USD 176 / 12m | 14.67 | Unverified | order_link_advertised |
| V2 KVM Slim Slice 2 | 2 / 8 GB / 250 GB NVMe | USD 165 / 12m | 13.75 | Unverified | order_link_advertised |
| Shrimp 1 expanding storage | 2 / 2 GB / 500 GB HDD; +1 GB/day | USD 55 / 12m | 4.58 | Unverified | out_of_stock |

### netcup — term_discount

[Provider source](https://www.netcup.com/en/server/vps/vps-500-g12.5-iv-24m-eu). 24-month contract and billing. EUR price includes 19% VAT in fetched locale; residence can change tax. Traffic >2 TB/24h throttles temporarily to 200 Mbps. This SKU is not an observed flash deal.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| VPS 500 G12.5 iv 24M EU | 2 / 4 GB / 64 GB SSD | EUR 168.72 / 24m | 7.03 | Unverified | advertised_not_checkout_verified |

### AlphaVPS — annual_discount

[Provider source](https://alphavps.com/cheap-vps). Yearly rate separately billed; flat renewal expressly stated. Do not use annual equivalent for monthly contract.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| C2G annual | 2 / 2 GB / 30 GB NVMe | EUR 30.5 / 12m | 2.54 | 30.5 / 12m | advertised_not_checkout_verified |
| C4G annual | 2 / 4 GB / 40 GB NVMe | EUR 40.7 / 12m | 3.39 | 40.7 / 12m | advertised_not_checkout_verified |
| C8G annual | 4 / 8 GB / 75 GB NVMe | EUR 66.2 / 12m | 5.52 | 66.2 / 12m | advertised_not_checkout_verified |

### Liquid Web — intro_discount

[Provider source](https://www.liquidweb.com/pricing/). 50% first two months; later regular price explicit. Management/software choices require checkout.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| Cloud VPS 4 GB intro | 2 / 4 GB / 80 GB SSD | USD 8.5 / 1m | 8.50 | 17 / 1m | advertised_not_checkout_verified |
| Cloud VPS 8 GB intro | 4 / 8 GB / 240 GB SSD | USD 22.5 / 1m | 22.50 | 45 / 1m | advertised_not_checkout_verified |

### IONOS — intro_discount

[Provider source](https://www.ionos.com/servers/vps). Three-month intro with one-year contract. Zero setup advertised. Region, tax and first invoice still need checkout.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| VPS S+ | 1 / 2 GB / 60 GB NVMe | USD 2 / 1m | 2.00 | 6 / 1m | advertised_not_checkout_verified |
| VPS M+ | 2 / 4 GB / 120 GB NVMe | USD 5 / 1m | 5.00 | 14 / 1m | advertised_not_checkout_verified |

### Hostinger — intro_discount

[Provider source](https://www.hostinger.com/vps-hosting). Upfront payment. Page specifies two-year renewal but initial-term selector not captured; initial term/upfront total remain unresolved. Do not assume 24-month introductory total.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| KVM 1 | 1 / 4 GB / 50 GB NVMe | USD 6.49/m advertised; initial term unresolved | — | 287.76 / 24m | advertised_term_unresolved |
| KVM 2 | 2 / 8 GB / 100 GB NVMe | USD 8.99/m advertised; initial term unresolved | — | 359.76 / 24m | advertised_term_unresolved |
| KVM 4 | 4 / 16 GB / 200 GB NVMe | USD 12.99/m advertised; initial term unresolved | — | 695.76 / 24m | advertised_term_unresolved |
| KVM 8 | 8 / 32 GB / 400 GB NVMe | USD 25.99/m advertised; initial term unresolved | — | 1199.76 / 24m | advertised_term_unresolved |

### Evoxt — regular

[Provider source](https://evoxt.com/pricing/). Use Standard network column; Premium/Premium Plus have different transfer. Storage medium and IPv4 not confirmed in captured table.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| VM-0.5 Standard | 1 / 0.5 GB / 5 GB medium unverified | USD 2.99 / 1m | 2.99 | Unverified | advertised_not_checkout_verified |
| VM-0.75 Standard | 1 / 1 GB / 10 GB medium unverified | USD 4.99 / 1m | 4.99 | Unverified | advertised_not_checkout_verified |
| VM-1 Standard | 1 / 2 GB / 20 GB medium unverified | USD 5.99 / 1m | 5.99 | Unverified | advertised_not_checkout_verified |

### Cloudfanatic — regular_with_coupon_lead

[Provider source](https://cloudfanatic.net/pricing/). Unmetered is fair-share. KVM10OFF advertises lifetime 10% on selected servers; eligibility not tested, so base price retained.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| Standard 1 GB | 1 / 1 GB / 30 GB NVMe | USD 2.99 / 1m | 2.99 | Unverified | advertised_not_checkout_verified |
| Standard 2 GB | 2 / 2 GB / 60 GB NVMe | USD 4.5 / 1m | 4.50 | Unverified | advertised_not_checkout_verified |

### Layer7 — regular

[Provider source](https://www.layer7.net/cloud-server). VAT excluded. Configurable from-prices: range minima require cart confirmation. Annual 20% prepayment discount advertised, not applied here.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| Xeon SP 2nd Gen VPS Paris from | 4 / 8 GB / 120 GB NVMe | EUR 4.99 / 1m | 4.99 | Unverified | configurable_from_requires_cart |
| Ryzen 9950X3D VPS Paris from | 2 / 4 GB / 80 GB NVMe | EUR 5.99 / 1m | 5.99 | Unverified | configurable_from_requires_cart |

### BandwagonHost — regular

[Provider source](https://bandwagonhost.com/). Self-managed KVM. Current headline prices, not a verified flash campaign; IP, stock and renewal need cart check.

| Plan | CPU / RAM / disk | Charge | Monthly equivalent | Renewal per period | Observed availability |
|---|---|---|---|---|---|
| 20G KVM VPS | 2 / 1 GB / 20 GB SSD | USD 49.99 / 12m | 4.17 | Unverified | advertised_not_checkout_verified |

CloudCone order forms for all five Halloween plans opened without a sold-out banner, but specs/totals were placeholders in extraction. This supports a current advertisement, not verified checkout availability. [Plan 1 order form](https://app.cloudcone.com/vps/536/create?token=frankenstein-26-ssd-vps-1) also states promotional plans cannot be upgraded/swapped. GreenCloud EPYCNYC-1 and DediOne LAX links returned category pages; keep those routing issues as publication holds.

## Excluded campaigns and further leads

| Provider | Evidence outcome |
|---|---|
| [GreenCloudVPS](https://greencloudvps.com/billing/store/holiday-sale-2026) | **empty_store** — No visible products; not an active candidate. |
| [GreenCloudVPS](https://blog.greencloudvps.com/celebrating-12-years-of-greencloud.php) | **expired** — Article dated 2025-10-19; flash window October 20–27, 2025. No verified 2026 anniversary schedule. |
| [CloudCone](https://app.cloudcone.com/vps/9/create?token=preblackfriday-vps-5) | **out_of_stock** — Public form explicitly sold out; no recoverable current price. |
| [RackNerd](https://www.racknerd.com/BlackFriday/) | **redirect** — Redirects to current specials, not a separate verified Black Friday campaign. |
| [Hetzner](https://www.hetzner.com/cloud/) | **dynamic_price_unresolved** — Text extraction omitted numerical cloud prices; verify configurator rather than reuse historical prices. |
| [Contabo](https://contabo.com/en/vps/) | **fetch_blocked** — VPS fetch error; pricing fallback 403. No verified current quote retained. |
| [Crunchbits](https://www.crunchbits.com/vps) | **fetch_blocked** — Provider search index found VPS/specials; direct fetch blocked. Do not reuse historical Black Friday prices. |
| [Advin Servers](https://advinservers.com/vps) | **dynamic_stock_unresolved** — Monthly service confirmed; live stock/pricing grid remained loading. Home from USD 6 insufficient to identify SKU. |
| [WebHorizon](https://webhorizon.net/) | **dynamic_price_unresolved** — Homepage extraction empty. NAT/OVZ search leads require virtualization, IP and price confirmation. |
| [VDSina](https://vdsina.ru/) | **discovery_only** — Primary homepage indexed; no current exact SKU checked. |
| [Vultr](https://www.vultr.com/promo/) | **fetch_blocked** — 403; third-party credit amounts not promoted to verified offers. Credits are separate from recurring plan prices. |
| [Inception Hosting](https://inceptionhosting.com/) | **redirect** — Redirects to Clouvider VPS; do not treat historical Inception plans as current. |
| [OneProvider](https://oneprovider.com/onecloud/pricing?c=usd) | **regular_screened** — High Performance from USD 12/month-equivalent, 1 CPU/2 GB/50 GB NVMe; hourly USD 0.0167. Not a flash campaign. |
| [HostSailor](https://stock.vpsknow.com/offers) | **secondary_expired_lead** — Discovery listing showed 60% annual campaign expiring 2026-10-01; excluded pending primary-provider revalidation. |

## How flash deals should enter this catalog

Use separate evidence for campaign availability and service billing. A sale end date is different from the annual renewal date; a stock counter is an observation, not a promise. Keep an offer’s identity tied to provider, exact SKU, location/network, billing term and IP option. Refresh existing matching rows instead of adding duplicate plans.

For each proposed addition, re-open the exact public order/configurator, confirm stock, initial term and upfront charge, record setup fee and tax basis, capture an explicit renewal statement or leave renewal unknown, and preserve its source URL and check date. Only show a countdown when the provider gives an exact deadline and timezone. Mark missing/expired/sold-out offers accordingly; no guessed urgency. Suggested recheck interval for limited-stock offers is hours, with a mandatory final check before publication. No recurring monitoring has been scheduled.

Owner review remains required before changing production prices or importing offers. The earlier admin actor requirement still applies to any editorial write; this research JSON is deliberately not accepted as a draft-loader payload. Resolve batch-1 discrepancies before the next load.

Machine-readable companion: `vps-offer-research-2026-10-06.json` contains transfer/IP details, stock observations, native terms, evidence grades, catalog relation and unresolved fields. All candidates have `publishable: false` and `review_status: research_only`.
