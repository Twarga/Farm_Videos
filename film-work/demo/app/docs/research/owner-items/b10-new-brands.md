# Research Owner Items: Batch b10-new-brands

Research date: 2026-11-01
Scope: NEW providers (no existing catalog rows) — A2 Hosting (VPS), Bluehost (VPS), HostGator (VPS), Strato (DE VPS), Fasthosts (UK VPS), UltaHost.

---

## 1. BLOCKED Providers & Plans

- **A2 Hosting (VPS)**:
  - **Official URLs**: `https://www.a2hosting.com/` (redirects to `https://hosting.com/`), `https://hosting.com/hosting/vps-hosting/`, `https://hosting.com/hosting/vps-hosting/unmanaged/linux/`.
  - **Reason**: A2 Hosting underwent a major brand transition to "hosting.com" (trading under A2 Hosting, LLC). While unmanaged and managed VPS plan tiers are presented on marketing pages (Self Managed Linux 2GB, 4GB, 8GB, 16GB, 32GB; Managed Linux 2, 4, 8, 16 cores), prices are absent in the static HTML and Nuxt client payload (empty currency override object). Furthermore, checkout order endpoints (`https://checkout.hosting.com/product/add/<uuid>`) return a holding screen: *"Something exciting is around the corner — Almost there! Getting things ready for you."* showing that the VPS ordering cart is not yet functional/launched. Per Rule 2, no price rows are invented; provider is marked BLOCKED pending cart launch.
- **Bluehost (VPS)**:
  - **Official URLs**: `https://www.bluehost.com/`, `https://www.bluehost.com/hosting/vps`.
  - **Reason**: Target URL returns HTTP 403 Forbidden on automated fetch due to Cloudflare anti-bot verification. Per Rule 2 ("If a page is 403/captcha/JS-only/geo-blocked: do NOT bypass... list the provider/plan as BLOCKED"), no rows are emitted.
- **HostGator (VPS)**:
  - **Official URLs**: `https://www.hostgator.com/`, `https://www.hostgator.com/vps-hosting`.
  - **Reason**: Target URL returns HTTP 403 Forbidden on automated fetch due to Cloudflare anti-bot challenge. Per Rule 2, no rows are emitted.

---

## 2. Provider Identity Facts (All 6 Assigned Providers)

- **A2 Hosting (now hosting.com)**:
  - **Legal Entity**: A2 Hosting, LLC (trading as "hosting.com").
  - **HQ Country**: United States (Registered in Delaware, USA; Postal Address: 1201 North Market Street, Suite 111-N73, Wilmington, DE 19801 USA; original headquarters Ann Arbor, Michigan; phone: +1 (734) 222-4678).
  - **Official Site URL**: `https://www.a2hosting.com/` (canonical redirect to `https://hosting.com/`).
- **Bluehost**:
  - **Legal Entity**: Bluehost Inc. (subsidiary of Newfold Digital).
  - **HQ Country**: United States (Burlington, Massachusetts / Jacksonville, Florida / Orem, Utah).
  - **Official Site URL**: `https://www.bluehost.com/`.
- **HostGator**:
  - **Legal Entity**: HostGator.com LLC (subsidiary of Newfold Digital).
  - **HQ Country**: United States (Houston, Texas / Jacksonville, Florida).
  - **Official Site URL**: `https://www.hostgator.com/`.
- **Strato**:
  - **Legal Entity**: STRATO GmbH (subsidiary of United Internet AG / IONOS Group).
  - **HQ Country**: Germany (Otto-Ostrowski-Straße 7, 10249 Berlin, Germany; Amtsgericht Berlin-Charlottenburg HRB 270570 B).
  - **Official Site URL**: `https://www.strato.de/`.
- **Fasthosts**:
  - **Legal Entity**: Fasthosts Internet Limited (subsidiary of IONOS / United Internet AG).
  - **HQ Country**: United Kingdom (Discovery House, 154 Southgate Street, Gloucester, GL1 2EX, United Kingdom; Company No. 03656431).
  - **Official Site URL**: `https://www.fasthosts.co.uk/`.
- **UltaHost**:
  - **Legal Entity**: UltaHost, Inc. (founded 2018 by Scriptsun Ltd, legally incorporated in the USA in 2021 as UltaHost, Inc.; global corporate branches in Dubai UAE, UK, Turkey).
  - **HQ Country**: United States (Governed by the laws of the United States of America).
  - **Official Site URL**: `https://ultahost.com/`.

---

## 3. Trustpilot Observations

Per Research Contract Rule 4 ("read https://www.trustpilot.com/review/<domain>; fill trustpilot_score, trustpilot_reviews, trustpilot_url on every row of the provider ONLY if the page loads and shows them; else blank + owner item"), all direct Trustpilot URL fetches returned HTTP 403 Forbidden under automated requests. Trustpilot columns in the CSV are therefore left blank.

- `https://www.trustpilot.com/review/a2hosting.com` & `https://www.trustpilot.com/review/hosting.com`: HTTP 403. (Official marketing site displays a badge claiming 4.8 / 7,274+ reviews).
- `https://www.trustpilot.com/review/bluehost.com`: HTTP 403.
- `https://www.trustpilot.com/review/hostgator.com`: HTTP 403.
- `https://www.trustpilot.com/review/strato.de`: HTTP 403.
- `https://www.trustpilot.com/review/fasthosts.co.uk` (or `https://uk.trustpilot.com/review/fasthosts.co.uk`): HTTP 403 on direct fetch. (Official Fasthosts homepage and VPS landing pages embed a verified Trustpilot widget citing **Rated 4.8 out of 5 from 22,389 reviews**).
- `https://www.trustpilot.com/review/ultahost.com`: HTTP 403. (Official site cites HostAdvice 4.9/5 from 2,500+ reviews).

---

## 4. Emitted Plans & Pricing Details (22 rows across 3 accessible providers)

### A. Strato (9 rows: 5 Linux VPS + 4 Windows VPS)
- **Official URLs**: `https://www.strato.de/server/linux-vserver/`, `https://www.strato.de/server/windows-vserver/`.
- **Currency & VAT**: EUR, prices include 19% German VAT ("Preise inkl. MwSt.").
- **Contract Terms**:
  - 1-month contract: setup fee 9 €, no introductory discount (e.g. Linux VPS S is 4 €/mo).
  - 6-month contract: setup fee 0 €, 1 month introductory discount.
  - 12-month contract: setup fee 0 €, 3 months introductory promotional discount (e.g. Linux VPS S is 2 €/mo for 3 mo then 4 €/mo; first year total 42 €, effective monthly 3.50 €). Emitted at term_months=12.
- **Hardware/Network**: KVM virtualization, NVMe storage, 1 IPv4 included, unmetered traffic up to 1,000 MBit/s port, hosted in German high-security data centers (Berlin / Karlsruhe).
- **Emitted Plan Slugs**:
  - `linux-vps-s`: 1 vCPU, 2 GB RAM, 60 GB NVMe (12m: 2 €/mo for 3 mo then 4 €/mo; eff 3.50 €/mo).
  - `linux-vps-m`: 2 vCPU, 4 GB RAM, 120 GB NVMe (12m: 3 €/mo for 3 mo then 10 €/mo; eff 8.25 €/mo).
  - `linux-vps-l`: 4 vCPU, 8 GB RAM, 240 GB NVMe (12m: 5 €/mo for 3 mo then 20 €/mo; eff 16.25 €/mo).
  - `linux-vps-xl`: 8 vCPU, 16 GB RAM, 480 GB NVMe (12m: 8 €/mo for 3 mo then 39 €/mo; eff 31.25 €/mo).
  - `linux-vps-xxl`: 12 vCPU, 24 GB RAM, 720 GB NVMe (12m: 10 €/mo for 3 mo then 56 €/mo; eff 44.50 €/mo).
  - `windows-vps-m`: 2 vCPU, 4 GB RAM, 120 GB NVMe, Windows Server 2025/2022 Datacenter (12m: 13 €/mo for 3 mo then 20 €/mo; eff 18.25 €/mo).
  - `windows-vps-l`: 4 vCPU, 8 GB RAM, 240 GB NVMe, Windows Server 2025/2022 Datacenter (12m: 25 €/mo for 3 mo then 40 €/mo; eff 36.25 €/mo).
  - `windows-vps-xl`: 8 vCPU, 16 GB RAM, 480 GB NVMe, Windows Server 2025/2022 Datacenter (12m: 48 €/mo for 3 mo then 79 €/mo; eff 71.25 €/mo).
  - `windows-vps-xxl`: 12 vCPU, 24 GB RAM, 720 GB NVMe, Windows Server 2025/2022 Datacenter (12m: 70 €/mo for 3 mo then 116 €/mo; eff 104.50 €/mo).

### B. Fasthosts (9 rows: 5 General Purpose + 4 RAM-optimised)
- **Official URL**: `https://www.fasthosts.co.uk/virtual-private-servers`.
- **Currency & VAT**: GBP, prices exclude 20% UK VAT ("All prices exclude VAT at 20%").
- **Contract Terms**:
  - 1-month rolling or 12-month contract.
  - 12-month contract features introductory pricing for the first 3 months, then standard renewal rate. Emitted at term_months=12.
- **Hardware/Network**: KVM architecture, NVMe storage, 1 IPv4 included, unlimited free IPv6, 1 Gbit/s bandwidth, unlimited traffic. Choice of UK, Germany, Spain, and US data centres.
- **Emitted Plan Slugs**:
  - `vps-1`: 1 vCPU, 2 GB RAM, 60 GB NVMe (12m: £2/mo for 3 mo then £5/mo; eff £4.25/mo).
  - `vps-2`: 2 vCPU, 4 GB RAM, 120 GB NVMe (12m: £4/mo for 3 mo then £12/mo; eff £10.00/mo).
  - `vps-4`: 4 vCPU, 8 GB RAM, 240 GB NVMe (12m: £7/mo for 3 mo then £22/mo; eff £18.25/mo).
  - `vps-8`: 8 vCPU, 16 GB RAM, 480 GB NVMe (12m: £12/mo for 3 mo then £38/mo; eff £31.50/mo).
  - `vps-12`: 12 vCPU, 24 GB RAM, 720 GB NVMe (12m: £17/mo for 3 mo then £58/mo; eff £47.75/mo).
  - `vps-ram-2`: 2 vCPU, 8 GB RAM, 120 GB NVMe (12m: £12/mo for 3 mo then £17/mo; eff £15.75/mo).
  - `vps-ram-4`: 4 vCPU, 16 GB RAM, 240 GB NVMe (12m: £14/mo for 3 mo then £24/mo; eff £21.50/mo).
  - `vps-ram-8`: 8 vCPU, 32 GB RAM, 480 GB NVMe (12m: £24/mo for 3 mo then £45/mo; eff £39.75/mo).
  - `vps-ram-16`: 16 vCPU, 64 GB RAM, 960 GB NVMe (12m: £48/mo for 3 mo then £97/mo; eff £84.75/mo).

### C. UltaHost (4 rows: Core Managed Linux VPS)
- **Official URL**: `https://ultahost.com/vps-hosting` (and verified via official backend `https://ultahost.com/xhr.php?first=get-packages`).
- **Currency & VAT**: USD, prices exclude taxes (Customer responsible for applicable taxes per Terms).
- **Contract Terms**:
  - Monthly: Basic $6.89, Business $12.29, Professional $19.59, Enterprise $25.89.
  - 1-Year (Yearly -30%): Basic $6.33/mo ($75.96 total), Business $11.27/mo ($135.24 total), Professional $18.39/mo ($220.68 total), Enterprise $24.14/mo ($289.68 total).
  - 2-Year (Biennially -40%, default landing page promo): Basic $5.52/mo ($132.48 total), Business $9.78/mo ($234.72 total), Professional $15.87/mo ($380.88 total), Enterprise $20.69/mo ($496.56 total). Renews at same rate for 2 years. Emitted at term_months=24 per catalog multi-year convention (matches Contabo/Hostinger 24m rows).
  - 3-Year (Triennially -50%): Basic $4.59/mo, Business $8.04/mo, Professional $13.23/mo, Enterprise $17.24/mo.
- **Hardware/Network**: Managed server, Dual Intel Xeon Gold 6148 processors, DDR5 RAM, NVMe SSD storage, 1 IPv4 Dedicated IP included, 4 to 8 IPv6 included, unlimited/unmetered bandwidth, 30-day money-back guarantee. 30+ global data centers.
- **Emitted Plan Slugs**:
  - `vps-basic`: 1 vCPU, 1 GB RAM DDR5, 30 GB NVMe ($5.52/mo for 24m, renews at $5.52/mo; 12m is $6.33/mo; 1m is $6.89/mo).
  - `vps-business`: 2 vCPU, 2 GB RAM DDR5, 50 GB NVMe ($9.78/mo for 24m, renews at $9.78/mo; 12m is $11.27/mo; 1m is $12.29/mo).
  - `vps-professional`: 3 vCPU, 4 GB RAM DDR5, 75 GB NVMe ($15.87/mo for 24m, renews at $15.87/mo; 12m is $18.39/mo; 1m is $19.59/mo).
  - `vps-enterprise`: 4 vCPU, 6 GB RAM DDR5, 100 GB NVMe ($20.69/mo for 24m, renews at $20.69/mo; 12m is $24.14/mo; 1m is $25.89/mo).
