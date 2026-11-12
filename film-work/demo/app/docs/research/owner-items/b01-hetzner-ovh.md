# Owner Items: Batch b01-hetzner-ovh

Date: 2026-11-01  
Batch: `b01-hetzner-ovh`  
Providers: Hetzner, OVHcloud

---

## 1. BLOCKED Pages & URLs
- **Trustpilot (`https://www.trustpilot.com/review/hetzner.com` & `https://www.trustpilot.com/review/ovhcloud.com`)**: Both URLs returned HTTP 403 (automated Cloudflare bot protection). Per contract rule 4, `trustpilot_score`, `trustpilot_reviews`, and `trustpilot_url` are left blank on all rows for both providers.

---

## 2. Excluded Bare-Metal Dedicated (Per Assignment Instructions)
- **Hetzner Dedicated Root Servers**: Plans such as AX42-1, AX41-1-LTD, EX63-1, etc. (which were present in lines 367–369 of `data/vps-offers-2026-08-31.csv`) are bare-metal dedicated servers and are excluded from this refresh.
- **Kimsufi / SoYouStart (OVHcloud Eco Dedicated)**: Plans such as KS-B, KS-1, SYS-1, SYS-GAME-1 (present in lines 377–380 of `data/vps-offers-2026-08-31.csv`) are bare-metal dedicated Eco servers and are excluded from VPS offers.
- **Scaleway Dedibox**: Bare-metal dedicated server range is excluded.

---

## 3. Pricing, VAT & Stock Status: Hetzner
- **Stock Status (Out-of-Stock)**: All Hetzner Cloud instances on public marketing pages (`/cloud/cost-optimized/`, `/cloud/regular-performance/`, `/cloud/general-purpose/`) currently display "This product is currently unavailable. Please check back later" when attempting to create without an authenticated session. In accordance with the prompt and research contract rule 3, all Hetzner rows are flagged with `out-of-stock` in `tags` and noted as currently unavailable in `billing_notes`.
- **Primary IPv4 Unbundling**: Hetzner separates Primary IPv4 addresses from compute instances. Instances include free Primary IPv6, while Primary IPv4 is billed as an optional add-on at €0.50/mo excl. VAT (€0.60 incl. 19% German VAT) or €0.0008/hr. Base prices in `price_monthly_usd` / `effective_monthly_usd` reflect the compute price excluding IPv4, matching Hetzner's official documentation (`https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/`), with the full breakdown documented in `billing_notes`.
- **VAT Rates**: Hetzner lists prices excluding VAT on its international site. With Germany's 19% VAT, sample monthly prices (excl. IPv4) are:
  - CX23: €5.49 excl. VAT / €6.53 incl. VAT (with IPv4: €5.99 excl. / €7.13 incl.)
  - CX33: €8.49 excl. VAT / €10.10 incl. VAT (with IPv4: €8.99 excl. / €10.70 incl.)
  - CX43: €15.99 excl. VAT / €19.03 incl. VAT (with IPv4: €16.49 excl. / €19.62 incl.)
  - CX53: €29.49 excl. VAT / €35.09 incl. VAT (with IPv4: €29.99 excl. / €35.69 incl.)
  - CAX11: €5.99 excl. VAT / €7.13 incl. VAT (with IPv4: €6.49 excl. / €7.72 incl.)
  - CAX21: €10.49 excl. VAT / €12.48 incl. VAT (with IPv4: €10.99 excl. / €13.08 incl.)
  - CAX31: €20.99 excl. VAT / €24.98 incl. VAT (with IPv4: €21.49 excl. / €25.57 incl.)
  - CAX41: €40.99 excl. VAT / €48.78 incl. VAT (with IPv4: €41.49 excl. / €49.37 incl.)
  - CPX02: €5.99 excl. VAT / €7.13 incl. VAT (with IPv4: €6.49 excl. / €7.72 incl.)
  - CPX12: €11.49 excl. VAT / €13.67 incl. VAT (with IPv4: €11.99 excl. / €14.27 incl.)
  - CPX22: €19.49 excl. VAT / €23.19 incl. VAT (with IPv4: €19.99 excl. / €23.79 incl.)
  - CPX32: €35.49 excl. VAT / €42.23 incl. VAT (with IPv4: €35.99 excl. / €42.83 incl.)
  - CPX42: €69.49 excl. VAT / €82.69 incl. VAT (with IPv4: €69.99 excl. / €83.29 incl.)
  - CPX52: €100.49 excl. VAT / €119.58 incl. VAT (with IPv4: €100.99 excl. / €120.18 incl.)
  - CPX62: €129.99 excl. VAT / €154.69 incl. VAT (with IPv4: €130.49 excl. / €155.28 incl.)
  - CCX13: €42.99 excl. VAT / €51.16 incl. VAT (with IPv4: €43.49 excl. / €51.75 incl.)
  - CCX23: €85.99 excl. VAT / €102.33 incl. VAT (with IPv4: €86.49 excl. / €102.92 incl.)
  - CCX33: €138.49 excl. VAT / €164.80 incl. VAT (with IPv4: €138.99 excl. / €165.40 incl.)
  - CCX43: €275.99 excl. VAT / €328.43 incl. VAT (with IPv4: €276.49 excl. / €329.02 incl.)
  - CCX53: €533.49 excl. VAT / €634.85 incl. VAT (with IPv4: €533.99 excl. / €635.45 incl.)
  - CCX63: €853.49 excl. VAT / €1015.65 incl. VAT (with IPv4: €853.99 excl. / €1016.25 incl.)
- **Hourly Cap & Billing Model**: Hourly billing with a monthly price cap (instances billed until deleted, whether running or powered off). Included egress is 20 TB for EU instances (30–60 TB on larger CCX plans).

---

## 4. OVHcloud Range (VPS 2027 Lineup) & Retired Plans
- **Current Range (VPS 2027)**: The live OVHcloud VPS lineup consists of four models: VPS-1 (2 vCore / 4 GB / 40 GB NVMe), VPS-2 (4 vCore / 8 GB / 75 GB NVMe), VPS-3 (6 vCore / 12 GB / 100 GB NVMe), and VPS-4 (8 vCore / 24 GB / 200 GB NVMe).
- **Commitment vs. Monthly Pricing**: Advertised "From" prices on the English VPS page reflect a 12-month commitment. Month-to-month pricing is also verified via the OVH public catalog API:
  - VPS-1: $4.54/mo (12-mo commitment, upfront $54.48/yr) vs. $5.35/mo (no commitment)
  - VPS-2: $8.50/mo (12-mo commitment, upfront $102.00/yr) vs. $10.00/mo (no commitment)
  - VPS-3: $12.32/mo (12-mo commitment, upfront $147.84/yr) vs. $14.50/mo (no commitment)
  - VPS-4: $23.37/mo (12-mo commitment, upfront $280.44/yr) vs. $27.50/mo (no commitment)
- **Requested VPS-5 and VPS-6 Status**: The prompt requested VPS-1..VPS-6. In the previous 2025/2026 range, OVHcloud offered VPS-5 (16 vCPU / 64 GB / 350 GB) and VPS-6 (24 vCPU / 96 GB / 400 GB). In the current VPS 2027 range (launched June 2026), VPS-5 and VPS-6 have been retired from the public site and cannot be ordered for new customers (OVH documentation directs users needing more resources than VPS-4 to their dedicated server lineup). In compliance with the research contract ("plans that vanished: list in the report, do not emit"), only active models VPS-1 through VPS-4 are emitted in the dataset.

---

## 5. Summary of Emitted Rows
- **Hetzner**: 21 rows (4 CX cost-optimized, 4 CAX Arm, 7 CPX regular including new CPX02/CPX12, 6 CCX dedicated-vCPU).
- **OVHcloud**: 4 rows (VPS-1, VPS-2, VPS-3, VPS-4).
- **Total Rows**: 25 rows, 0 errors against `scripts/check_vps_data.py`.
