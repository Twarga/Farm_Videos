# Owner Items: Batch b05-netcup-hostinger-ionos

Checked date: 2026-11-01
Batch: `b05-netcup-hostinger-ionos`
Providers: netcup, Hostinger, IONOS, Webdock, Time4VPS, Clouding.io

## 1. BLOCKED Providers / Plans
- None blocked. All 6 assigned provider official pages loaded successfully and pricing was verified. (Note: Time4VPS required `:raw` mode to bypass web content-negotiation header issues, returning valid HTML containing full JSON pricing tables).

## 2. Missing Trustpilot Snapshots (Rule 4)
- **All 6 providers** (`netcup.com`, `hostinger.com`, `ionos.com`, `webdock.io`, `time4vps.com`, `clouding.io`):
  - `https://www.trustpilot.com/review/<domain>` returned **HTTP 403 Forbidden** (Cloudflare bot protection) for all automated fetches.
  - Per Rule 4 and Rule 2 of the research contract, no proxies, headers, or bypasses were attempted.
  - `trustpilot_score`, `trustpilot_reviews`, and `trustpilot_url` columns are left blank on all rows and flagged here for manual owner review or authenticated API lookup.

## 3. Ambiguous Prices, Multiple Prices, and VAT Details
- **netcup**:
  - The pricing page displays multiple adjacent prices per tier: 1-month baseline (crossed-out on 12M view), 12-month commitment (-13%), and 24-month commitment (-26% to -27%).
  - Prices include 19% German VAT (`EUR incl. 19% VAT`).
  - Recorded 12-month contract period rates with default IPv4+IPv6 connectivity:
    - VPS: VPS 500 €8.26/mo (1m baseline €9.50), VPS 1000 €14.50/mo (1m €16.68), VPS 2000 €26.92/mo (1m €30.96), VPS 4000 €45.36/mo (1m €52.16), VPS 8000 €67.11/mo (1m €77.16).
    - Root Server (dedicated AMD EPYC 9645 cores): RS 500 €12.93/mo (1m €14.87), RS 1000 €21.73/mo (1m €25.00), RS 2000 €40.70/mo (1m €46.81), RS 4000 €77.83/mo (1m €89.50), RS 8000 €148.42/mo (1m €170.69), RS 12000 €216.89/mo (1m €249.43), RS 16000 €289.46/mo (1m €332.88).
    - Network toggle: opting for IPv6-only or Cloud vLAN only gives a €0.60/mo discount. Setup fees are €0.00 across all plans.
- **Hostinger**:
  - Advertised monthly rates ($6.49, $8.79, $12.99, $25.99) are intro rates requiring 24-month upfront prepayment ($155.76, $210.96, $311.76, $623.76).
  - Renewal rates for subsequent 24-month terms are significantly higher ($11.99, $14.99, $28.99, $49.99/mo).
  - Note: KVM 2 intro price was updated to $8.79/mo (previously cataloged at $8.99/mo).
  - Crossed-out baseline list rates are $19.49, $24.49, $42.99, $73.99/mo.
- **IONOS**:
  - Advertised headline rates ($2, $5, $8, $14, $20/mo) are introductory prices valid only for the first 3 months with a 1-year contract.
  - Months 4–12 renew at standard monthly rates ($6, $14, $25, $47, $68/mo).
  - The effective monthly price across the full 12-month commitment is recorded in `effective_monthly_usd` ($5.00, $11.75, $20.75, $38.75, $56.00/mo).
  - Sales tax is not included in advertised USD rates. Unlimited bandwidth on 1 Gbps port.
- **Webdock**:
  - Month-to-month EUR rates (€2.15, €4.30, €19.60).
  - Billed for a full month upfront; payments are strictly non-refundable upon cancellation.
  - Prices exclude VAT; 25% Danish VAT is applied to EU customers lacking a valid VAT ID.
  - Outgoing bandwidth is metered (1 TB, 1 TB, 7 TB); incoming traffic is free; overage is billed at €2.50/TB.
- **Time4VPS**:
  - Multi-tier period discounts. Linux 1 requires a minimum 3-month order (€2.99/mo, or €2.48/mo on 1y).
  - For Linux 2–64, month-to-month introductory promo rates were emitted: Linux 2 €2.40/mo (renews €7.99), Linux 4 €3.90/mo (renews €12.99), Linux 8 €6.00/mo (renews €19.99), Linux 16 €10.50/mo (renews €34.99), Linux 24 €19.50/mo (renews €64.99), Linux 32 €38.70/mo (renews €128.99), Linux 48 €72.00/mo (renews €239.99), Linux 64 €144.00/mo (renews €479.99).
  - 1-year and 2-year renewal schedules and base list prices are fully documented in `billing_notes`.
  - Prices exclude VAT (added based on EU customer destination member state).
- **Clouding.io**:
  - Strictly billed by the hour with monthly maximum caps (€3.00, €8.00, €16.00, €370.00).
  - Prepaid balance billing (minimum €2 reload).
  - Prices exclude 21% Spanish VAT. 4 TB monthly data transfer included across all presets, then €0.004/GB.

## 4. Plans That Vanished / Superseded
- **netcup Generation 12 (G12)**:
  - All older G12 plans have been retired from new sales per official FAQ:
    - `vps-500-g12`, `vps-1000-g12`, `vps-2000-g12`, `vps-4000-g12`, `vps-8000-g12`
    - `rs-1000-g12`, `rs-2000-g12`, `rs-4000-g12`, `rs-8000-g12`
  - Replaced by the Generation 12.5 lineup:
    - VPS: `vps-500-g12-5`, `vps-1000-g12-5`, `vps-2000-g12-5`, `vps-4000-g12-5`, `vps-8000-g12-5`
    - Root Server: `rs-500-g12-5`, `rs-1000-g12-5`, `rs-2000-g12-5`, `rs-4000-g12-5`, `rs-8000-g12-5`, `rs-12000-g12-5`, `rs-16000-g12-5`
- **IONOS VPS XS**:
  - The prompt listed "IONOS (VPS XS..XXL)". No `VPS XS` exists on the current official product pages or application JSON; current VPS+ lineup starts at `VPS S+` and goes through `VPS XXL+`.

## 5. Provider Identity Facts
- All 6 providers are existing catalog providers with verified official domains.
