# Owner Items: Batch b02-vultr-kamatera-linode

Date: 2026-11-01
Batch: `b02-vultr-kamatera-linode`
Providers: Vultr, Kamatera, Akamai Linode

## BLOCKED Pages & URLs
- **Akamai Linode (`https://www.linode.com/pricing/`, `https://www.akamai.com/pricing`)**: Both URLs returned HTTP 403 (automated bot mitigation). Plan specifications and pricing were retrieved and verified via Akamai Linode's official public REST API (`https://api.linode.com/v4/linode/types`) and documentation (`https://techdocs.akamai.com/cloud-computing/docs/compute-instance-plan-types`).
- **Trustpilot (`https://www.trustpilot.com/review/<domain>`)**: All Trustpilot review pages (`vultr.com`, `kamatera.com`, `www.linode.com`) returned HTTP 403. Per contract rule 4, `trustpilot_score`, `trustpilot_reviews`, and `trustpilot_url` are left blank on all rows.

## Pricing & Plan Anomalies
- **Vultr Hourly Display vs API Rate**: Vultr's public marketing pricing table on `https://www.vultr.com/pricing/` displays hourly rates rounded to 3 decimal places (e.g. $0.009/hr for $6/mo, $0.015/hr for $10/mo, $0.022/hr for $15/mo, $0.03/hr for $20/mo, $0.06/hr for $40/mo). The underlying billing API (`https://api.vultr.com/v2/plans`) specifies the actual billing hourly rates with 672-hour monthly cap ($0.008/hr, $0.014/hr, $0.021/hr, $0.027/hr, $0.055/hr). The exact billing API hourly rates are recorded in the CSV.
- **Vultr Surcharges**: Certain data centers (notably São Paulo `sao`) carry a 50% regional surcharge in the API, documented in `billing_notes`.
- **Akamai Linode G8 & GPU Cutoff**: Akamai Linode introduced G8 Dedicated instances (`g8-dedicated-*`) as of July 2026 which bill true-hourly with no monthly price cap (`monthly: null` in API). In line with the previous dataset cutoff, GPU, Accelerated (VPU), and G8 true-hourly instances are excluded from VPS offers. G6 Dedicated and G7 Premium/Dedicated plans retain predictable monthly price caps.
- **Kamatera Presets**: Per contract rule 5, Kamatera provides a custom configurator starting at $4/mo, but only the 3 published fixed presets from `https://www.kamatera.com/pricing/` (Basic, Standard, Pro) are emitted.

## Vanished Plans
- None. All 44 Vultr plans, 3 Kamatera preset plans, and 31 Akamai Linode plans from the previous release remain active, public, and priced identically.

## Provider Identity Facts
- All three providers (Vultr, Kamatera, Akamai Linode) are existing providers previously integrated in `data/vps-offers-2026-08-31.csv`.
