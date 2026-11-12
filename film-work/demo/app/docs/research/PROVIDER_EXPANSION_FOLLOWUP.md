# V1 provider research follow-up

Observed at: 2026-10-24T13:40:11.267Z. Research only: no import, publication or database changes. Advertised facts are not approved terms. This research does not advance the implementation phases.

## Recommended V1 priorities

1. **netcup**: expand G12.5 shared VPS and dedicated-vCPU Root Server coverage. The latter are KVM VMs, not bare-metal servers. VPS 500 shows 2 vCPU / 4 GB / 64 GB SSD; VPS 1000 shows 4 / 8 / 128. Both list a 12-month contract. Extraction displays multiple adjacent euro prices, so prices are withheld pending checkout/tax/discount verification.
2. **HostHatch**: add small compute and storage candidates. Official products list NVMe 2 GB from $4/month (1 fair-share core, 10 GB NVMe), 4 GB from $6 and storage 1 TB from $5. These are FROM prices; regional quotes and APAC transfer must be reviewed.
3. **BuyVM**: small annual/monthly plans. SLICE 512 is $24/year, SLICE 1024 $3.50/month, SLICE 2048 $7/month. One IPv4 listed. Shared CPU must not be called dedicated at these sizes; unmetered bandwidth remains a textual claim, not an invented numeric limit.
4. **GreenCloud**: regular Budget KVM starts at $6/month for 1 GB / 1 core / 15 GB SSD; APAC has half the listed US/EU transfer. Sale evidence is separate (below).
5. **AlphaVPS**: provider/product discovery confirmed; landing page distinguishes cloud, high-performance, Ryzen and storage. Do not attach a landing-page minimum to an unspecified plan. Plan-level price/terms still needed.
6. **Webdock**: pricing FAQ confirms full month upfront, non-refundable payments and month-to-month options; a complete plan table was not extracted. No plan price captured from the headline alone.
7. **Vultr**: official pricing returned a 403/challenge. No inferred price imported. Manual official-page review required; do not bypass access controls.

Hetzner, OVHcloud, Kamatera, DigitalOcean, Hostinger and IONOS remain in the earlier research queue; this follow-up does not revalidate their older numbers.

## Special offers: found versus publishable

- **RackNerd official specials**: 1 GB $21.99/year; 2 GB $35.99/year; 4 GB $59.99/year; 6 GB $89.99/year; 8 GB $119.99/year. FAQ explicitly says lifetime recurring / same renewal rate. Annual amounts are payable by billing period, not monthly subscriptions. No end date was established; no countdown or made-up discount. Checkout eligibility, locations, tax/setup and terms approval remain outstanding. **Research candidates only, not ready for V1 special-offers publication.**
- **netcup deals**: official deals landing page exists; the official RSS response contained no item entries when checked. Do not claim an active limited promotion from the landing page alone. Regular G12.5 plans remain useful candidates.
- **GreenCloud sales**: old vps-special-sale.php returns 404. The official top-provider-sale store has no visible products. Budget sale lists location-specific stock (many zero, some available), but extracted plan prices were missing. Storage sale similarly lacks usable extracted prices. **Hold all sale rows**, not a claim that every GreenCloud sale is sold out. No-refund wording is present.

## Evidence and files

- Observations: data/research/provider-followup-observations.csv (21 candidates). Separate research schema, deliberately NOT an admin-import CSV. Native currency, billing period and review status remain explicit; blanks are unknown, never zero.
- Evidence excerpts: docs/research/evidence/provider-followup.json. Provider marketing assertions are not independent proof of uptime/performance or a review stamp.
- No Trustpilot rating was fabricated. Snapshot publication eligibility still requires its existing rating/review policy.

## Official sources checked

- https://www.netcup.com/en/server/vps
- https://www.netcup.com/en/server/root-server
- https://www.netcup.com/en/deals
- https://www.netcup.com/rss/deals/en
- https://hosthatch.com/products
- https://buyvm.net/kvm-dedicated-server-slices/
- https://www.racknerd.com/BlackFriday/
- https://greencloudvps.com/budget-kvm-vps.php
- https://greencloudvps.com/billing/store/budget-kvm-sale
- https://greencloudvps.com/billing/store/storage-kvm-sale
- https://greencloudvps.com/billing/store/top-provider-sale
- https://alphavps.com/
- https://webdock.io/en/pricing
- https://www.vultr.com/pricing/

## Before any publication

Verify native-currency price, exact plan/location, term, annual/upfront payment, renewal, setup, IPv4 and tax basis on the official checkout/terms; retain source/date/evidence; collect the required rating snapshot; stage and review through the existing admin. Specials additionally need supported promotion/expiry eligibility under public-special-offers.ts. Commission never changes ranking. Unknown facts stay unknown. No provider was added to production in this task.
