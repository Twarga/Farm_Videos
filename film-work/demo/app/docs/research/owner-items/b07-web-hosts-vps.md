# Owner items: Batch b07-web-hosts-vps

Observed on: 2026-11-01

## 1. Trustpilot Blocked (HTTP 403)
All Trustpilot domain review endpoints returned HTTP 403 Forbidden under direct fetch during this session:
- `https://www.trustpilot.com/review/knownhost.com` (403)
- `https://www.trustpilot.com/review/20i.com` (403)
- `https://www.trustpilot.com/review/dreamhost.com` (403)
- `https://www.trustpilot.com/review/inmotionhosting.com` (403)
- `https://www.trustpilot.com/review/liquidweb.com` (403)
- `https://www.trustpilot.com/review/scalahosting.com` (403)
- `https://www.trustpilot.com/review/www.fastcomet.com` (403)
- `https://www.trustpilot.com/review/namecheap.com` (403)
- `https://www.trustpilot.com/review/hostwinds.com` (403)
- `https://www.trustpilot.com/review/cloudways.com` (403)

Per research contract rule 4, Trustpilot fields (`trustpilot_score`, `trustpilot_reviews`, `trustpilot_url`) are left blank for all rows in this batch, with no old values retained without verification.

## 2. Plans That Vanished from Official Pages
- **Liquid Web**: `lw-1g` (Cloud VPS 1 GB, previously $5/mo). The official published table on `https://www.liquidweb.com/vps-hosting/` now starts at 2 GB RAM ($11/mo). The 1 GB tier is no longer listed in the published plans matrix and was not emitted.
- **FastComet**: `cloud-1` (Cloud 1, previously 1 vCPU / 2 GB / 50 GB). The published table on `https://www.fastcomet.com/vps-pricing` starts at Cloud 2 ($53.87/mo intro / $76.95 regular). A generic footnote mentions "starting at $46.16/mo", but no Cloud 1 plan or specification is available on the official VPS pricing page. Omitted from fresh plan rows.

## 3. Plan Additions / Expansions
- **InMotion Hosting**: Expanded unmanaged VPS lineup now includes `inmotion-12vcpu` (12 vCPU / 24 GB / 360 GB NVMe, $31.99/mo intro on 24-mo term) and `inmotion-16vcpu` (16 vCPU / 32 GB / 460 GB NVMe, $39.99/mo intro on 24-mo term). Added both rows.
- **Liquid Web**: Expanded published General Compute lineup to include `lw-8g`, `lw-12g`, `lw-16g`, `lw-24g`, and `lw-32g`.
- **ScalaHosting**: Added `scala-b4` (Build #4: 12 vCPU / 24 GB / 200 GB NVMe, $71.21/mo intro on 12-mo term, renews at $244.95/mo).
- **Hostwinds**: Added higher unmanaged Linux tiers `ul-5` through `ul-10` directly published on `https://www.hostwinds.com/vps/unmanaged-linux`.
- **Cloudways**: Added published Flexible DigitalOcean Medium (`cloudways-do-medium`, $88/mo) and 8XL (`cloudways-do-8xl`, $342/mo).

## 4. Ambiguous / Notable Billing Terms
- **20i**: Prices quoted in GBP (£) on `https://www.20i.com/vps` are exclusive of VAT according to Section 8.1 of 20i Terms and Conditions. Bandwidth is advertised as unlimited.
- **DreamHost**: Promotional pricing for first 3 months ($8.99/mo, $13.99/mo, $22.99/mo, $45.99/mo); renews at regular rate ($15.99/mo, $21.99/mo, $34.99/mo, $59.99/mo). Bandwidth is unmetered subject to fair-use terms.
- **InMotion Hosting**: Advertised prices are 24-month upfront terms with intro discount rates, renewing at higher rates.
- **ScalaHosting**: Advertised prices on `https://www.scalahosting.com/managed-cloud-hosting.html` reflect 12-month terms with Black Friday intro discounts; renewal prices are significantly higher (e.g., Build #1 renews at $54.95/mo).
- **Namecheap**: Highlighted yearly prices ($3.88/mo, $6.88/mo, etc.) require 1-year prepayment and auto-renew at higher annual rates. Monthly billing rates are also documented in notes.
