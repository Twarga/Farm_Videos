# Owner items: Batch b08-misc (2026-11-01)

## BLOCKED providers & plans
- **InterServer**: `https://www.interserver.net/vps/` returned HTTP 403 Forbidden on multiple plain fetches in this session. Existing plans (`1-slice`, `4-slices`) were not re-verified and no rows were emitted per contract rule 2.
- **HOSTKEY**: `https://hostkey.com/vps/` returned HTTP 403 Forbidden on multiple plain fetches in this session. Existing plans (`hostkey-pico`, `hostkey-nano`, `hostkey-mini`, `hostkey-v3-pico`, `hostkey-v3-nano`, `hostkey-v3-mini`, `hostkey-v3-medium`, `hostkey-ryzen-8`) were not re-verified and no rows were emitted per contract rule 2.

## Vanished / Disappeared plans
- None from the reachable providers. All previously tracked plans for SSD Nodes, Render, Railway, VDSina, Njalla, FlokiNET, ServerMania, RoseHosting, HostSailor, Privex, Shinjiru, OrangeWebsite, alwaysdata, Cockbox, and Yourserver remain published and active.
- ServerMania has an additional Starter plan (`sm-starter`) published at $8.93/mo (1 vCPU, 1 GB RAM, 15 GB SSD, 1 TB transfer), which was added to the batch.
- VDSina full standard tiers (1 Core 1 GB, 1 Core 2 GB, 2 Core 4 GB, 4 Core 8 GB) were extracted from `/pricing/standard`, updating the previous floor-only row `vdsina-standard-from` and adding individual SKU rows.

## Trustpilot snapshot findings
Per contract rule 4, Trustpilot URLs return HTTP 403 Forbidden when fetched via automated HTTP read, so `trustpilot_score`, `trustpilot_reviews`, and `trustpilot_url` are withheld (blank) on emitted rows pending browser-based snapshot verification:
- **CloudCone**: Active in DB, no CSV rows exist in `vps-offers-2026-08-31.csv` so 0 plan rows were emitted. Trustpilot URL tried: `https://www.trustpilot.com/review/cloudcone.com` (HTTP 403 on direct fetch; web search shows claimed profile with ~1.9 rating, 127 reviews).
- **Cockbox**: In CSV (4 rows emitted). Trustpilot URL tried: `https://www.trustpilot.com/review/cockbox.org`. No Trustpilot rating page exists (confirmed via search: no rating page for cockbox.org).
- **Yourserver**: In CSV (4 rows emitted). Trustpilot URL tried: `https://www.trustpilot.com/review/yourserver.se`. No Trustpilot rating page exists (confirmed via search: no rating page for yourserver.se).
- **SSD Nodes**: `https://www.trustpilot.com/review/www.ssdnodes.com` (HTTP 403)
- **Render**: `https://www.trustpilot.com/review/render.com` (HTTP 403)
- **Railway**: `https://www.trustpilot.com/review/railway.com` (HTTP 403)
- **VDSina**: `https://www.trustpilot.com/review/vdsina.com` (HTTP 403)
- **Njalla**: `https://www.trustpilot.com/review/njal.la` (HTTP 403)
- **FlokiNET**: `https://www.trustpilot.com/review/flokinet.is` (HTTP 403)
- **ServerMania**: `https://www.trustpilot.com/review/servermania.com` (HTTP 403)
- **RoseHosting**: `https://www.trustpilot.com/review/rosehosting.com` (HTTP 403)
- **HostSailor**: `https://www.trustpilot.com/review/www.hostsailor.com` (HTTP 403)
- **Privex**: `https://www.trustpilot.com/review/www.privex.io` (HTTP 403)
- **Shinjiru**: `https://www.trustpilot.com/review/www.shinjiru.com` (HTTP 403)
- **OrangeWebsite**: `https://www.trustpilot.com/review/www.orangewebsite.com` (HTTP 403)
- **alwaysdata**: `https://www.trustpilot.com/review/alwaysdata.com` (HTTP 403)
- **InterServer**: `https://www.trustpilot.com/review/interserver.net` (HTTP 403)
- **HOSTKEY**: `https://hostkey.com/review/hostkey.com` (HTTP 403)

## Ambiguous pricing and billing notes
- **SSD Nodes**: Prominently advertises $X/year rates (e.g. $66/yr, $113/yr) that require a 3-year (36-month) upfront commitment. Halloween promotional code `TREAT20` offering 20% off was active on the landing page, but standard list prices were retained in accordance with contract rules.
- **Shinjiru**: Landing page displays "As low as" rates tied to 24-month commitments ($9.90, $14.90, $22.90, $29.90). The 1-month term options ($12.90, $18.90, $28.90, $36.90) from the form selector were recorded as the standard monthly rates.
- **OrangeWebsite**: Prices displayed in EUR starting at €29.90/mo for 1-month terms; longer 1–3 year cycles offer 5% to 25% discounts.
- **alwaysdata**: Free plan is a managed PaaS container (¼ CPU, 256 MB RAM, 1 GB SSD) at 0 €/mo. Plus plan is an unmetered-site managed cloud starting from 5 €/mo VAT excluded.
