# Research Batch b09-new-budget Owner Items

Batch: `b09-new-budget`  
Date: 2026-11-01  
Assigned Providers: VirMach, Hosteons, Servarica, Letbox, PQ Hosting  

---

## 1. Provider Identity Facts (All 5 NEW Providers)

### VirMach
- **Legal Entity Name:** Virtual Machine Solutions, LLC
- **HQ Country:** United States (Governing law: State of Oklahoma, USA; corporate documentation confirms US incorporation)
- **Official Site URL:** `https://virmach.com/`
- **Trustpilot:** `https://www.trustpilot.com/review/virmach.com` (Blocked by HTTP 403 on automated fetch; score left blank in CSV)
- **Status:** Active. 21 public VPS plans emitted across AMD Ryzen KVM VPS, KVM Lite, Windows Remote Desktop VPS, and Cloud Storage VPS.

### Hosteons
- **Legal Entity Name:** Hosteons Pte. Ltd.
- **HQ Country:** Singapore (Officially registered in Singapore; corporate phone +65 31584717; servers hosted across US and EU)
- **Official Site URL:** `https://hosteons.com/`
- **Trustpilot:** `https://www.trustpilot.com/review/hosteons.com` (Blocked by HTTP 403 on automated fetch)
- **Status:** BLOCKED. All official public endpoints (`https://hosteons.com/`, `https://www.hosteons.com/`, `https://my.hosteons.com/`) returned HTTP 403 Forbidden (Cloudflare WAF / bot-protection) during automated fetch. Per contract rule 11, automated bypass was not attempted and 0 rows were emitted.

### Servarica
- **Legal Entity Name:** Rica Web Services
- **HQ Country:** Canada (Based in Montreal, Quebec, Canada; "Canadian server provider since 2010... Canadian-owned, not a reseller; 100% Hydro-Québec renewable power")
- **Official Site URL:** `https://servarica.com/`
- **Trustpilot:** `https://www.trustpilot.com/review/servarica.com` (Blocked by HTTP 403 on automated fetch; score left blank in CSV)
- **Status:** Active. 47 public VPS plans emitted from `https://servarica.com/vps/`.

### Letbox
- **Legal Entity Name:** LetBox Limited (UK Company number 10824846, registered office at 85 Great Portland Street, London, England, W1W 7LT; Companies House records indicate dissolved in November 2025)
- **HQ Country:** United Kingdom
- **Official Site URL:** `https://letbox.com/` (Homepage displays "under maintenance" and links to client portal `https://my.letbox.com/`)
- **Trustpilot:** `https://www.trustpilot.com/review/letbox.com` (Blocked by HTTP 403 on automated fetch; score left blank in CSV)
- **Status:** Degraded / Partially out of stock. 4 legacy fixed plans emitted from WHMCS group `gid=2` (Dallas Storage SBox), all currently marked "Out of Stock".

### PQ Hosting (rebranded to THE.Hosting)
- **Legal Entity Name:** PQ Hosting / THE.Hosting (Originally registered in Chișinău, Moldova; assets and infrastructure transferred to Dutch entity WorkTitans B.V. in May 2025 during rebrand to THE.Hosting)
- **HQ Country:** Moldova / Netherlands
- **Official Site URL:** `https://pq.hosting/` (Converted to a third-party hosting comparison/directory marketplace) and `https://the.hosting/` (Operational hosting brand)
- **Trustpilot:** `https://www.trustpilot.com/review/pq.hosting` (Blocked by HTTP 403 on automated fetch)
- **Status:** DISCONTINUED / SHUT DOWN. On 2026-05-30, THE.Hosting officially published a "Notice of Service Discontinuation and Account Closure" (`https://the.hosting/en/news/notice-of-service-discontinuation-and-account-closure`), declaring a permanent shutdown of all operational services and disabling all registrations, orders, and renewals due to force majeure. Billing portal DNS (`client.the.hosting`) does not resolve (`ENOTFOUND`). 0 rows emitted.

---

## 2. BLOCKED Providers and Pages

- **Hosteons (Provider-level block):**
  - URLs: `https://hosteons.com/`, `https://www.hosteons.com/`, `https://my.hosteons.com/`
  - Reason: HTTP 403 Forbidden returned on automated fetch (Cloudflare bot management / WAF).
  - Impact: Per Rule 11 of research contract, no bypass was attempted; provider marked as BLOCKED and 0 rows emitted.
- **Trustpilot (Platform-wide block for automated fetches):**
  - URLs: `https://www.trustpilot.com/review/virmach.com`, `https://www.trustpilot.com/review/hosteons.com`, `https://www.trustpilot.com/review/servarica.com`, `https://www.trustpilot.com/review/letbox.com`, `https://www.trustpilot.com/review/pq.hosting`
  - Reason: HTTP 403 Forbidden returned on all automated queries.
  - Impact: Per Rule 4 of research contract, Trustpilot columns (`trustpilot_score`, `trustpilot_reviews`, `trustpilot_url`) are left blank for all rows.

---

## 3. Discontinued / Retired Providers

- **PQ Hosting / THE.Hosting:**
  - Finding: PQ.Hosting rebranded to THE.Hosting in May 2025, and `pq.hosting` was repurposed as a hosting comparison catalog. On 2026-05-30, THE.Hosting officially posted a permanent shutdown announcement ("Notice of Service Discontinuation and Account Closure") citing unavoidable force majeure, advising customers to immediately back up data, and disabling all ordering and renewal mechanisms. The billing portal (`client.the.hosting`) is unreachable with NXDOMAIN/ENOTFOUND.
  - Action: No active public VPS offers exist for PQ Hosting; 0 rows emitted.

---

## 4. Ambiguous Prices, Discrepancies, and Billing Notes

### VirMach
- **Base vs. Promotional Pricing:** VirMach displays prominent promo codes on its sales pages:
  - Ryzen KVM VPS: NVMe1G displays $5/mo base price and promotes coupon `RYZEN30` for 30% recurring discount ($3.50/mo); NVMe2G displays $10/mo base price and promotes coupon `RYZEN` for 40% recurring discount ($6/mo); NVMe4G and NVMe8G promote coupon `30` for 30% recurring discount ($14/mo and $25/mo respectively).
  - Windows VPS: Base monthly prices ($12.50, $25, $50, $100) are discounted via coupon `30` (30% recurring) or `WIN40` (40% recurring).
  - Treatment: The official standard base list prices are emitted in `price_monthly_usd` and `effective_monthly_usd`, and recurring promotional coupon codes and terms are explicitly documented in `billing_notes`.
- **STORAGE-1T Typo on Official Page:**
  - The pricing card on `https://virmach.com/cloud-storage-servers/` displays: "$5.60/month OR $4.80 PER YEAR". Mathematically and contextually across the tiers, $4.80/year is a site typographical error for $44.80/year ($5.60 * 8 = $44.80). Documented in `billing_notes`.
- **STORAGE-250G Minimum Term:**
  - Storage-250G has no monthly billing option; the minimum commitment is quarterly ($4.90/quarter = $1.63/mo) or annual ($16.80/year = $1.40/mo). Emitted with `term_months` = 3 and `price_yearly_usd` = 16.80.
- **Win 32GB Cloud PC RAM Discrepancy:**
  - The plan card on `https://virmach.com/windows-remote-desktop-vps/` is titled "32GB RAM Cloud PC", but one bullet line erroneously states "16GB DDR4 RAM". Emitted with 32 GB RAM per the plan tier naming and noted in `billing_notes`.
- **Hardware Discrepancies (Cards vs. Table):**
  - On `https://virmach.com/amd-ryzen-kvm-vps-with-nvme-ssd/`, NVMe2G is listed with 60GB NVMe SSD in the full table but 50GB on the feature card; NVMe4G is listed with 120GB in the table but 60GB on the card. Emitted with the full table specifications and noted in `billing_notes`.

### Servarica
- **Stock Status (31 of 47 Out of Stock):**
  - 31 out of 47 plans listed on `https://servarica.com/vps/` are currently marked "Out of stock" (e.g. Opossum 1 & 2, Chimera Hybrid 1-4, Shrimp 1 & 2, Polar Bear, Killer Whale, Lobster, Penguin, Mammoth, Horse, Unlimited Expanding 1-3, V3 FAT Slice 6/8/12/16/24/32/40/48, V3 Slim Slice 32/40/48, V2 FAT Slice 6/8/16).
  - Per Rule 3, all 31 out-of-stock plans are tagged `out-of-stock` in `tags`, and annotated with "Currently unavailable / out of stock on official site." in `billing_notes`.
- **Auto-Expanding Storage Plans:**
  - Plans such as Shrimp 1 (+1 GB/day), Shrimp 2 (+2 GB/day), Lobster (+3 GB/day), Unlimited Expanding 1 (+3 GB/day), Unlimited Expanding 2 (+6 GB/day), and Unlimited Expanding 3 (+15 GB/day) feature daily auto-expanding disk capacity. The initial starting capacity is stored in `disk_gb`, and the growth rate is documented in `billing_notes`.
- **Hybrid Storage Plans (Chimera 1–4):**
  - Combine fast NVMe SSD storage with bulk HDD storage (e.g. 65GB NVMe + 2TB HDD on Chimera -1). The total capacity in GB is stored in `disk_gb`, `disk_type` is marked `NVMe + HDD (RAIDZ2)`, and the exact breakdown is recorded in `billing_notes`.
- **Bandwidth Model:**
  - Every Servarica VPS includes a choice at checkout between: (1) unlimited transfer starting on a 250Mbps port that auto-expands +1Mbps/day up to 1Gbps, or (2) a high-speed 10Gbps port with a fixed monthly cap (throttled to 10Mbps unmetered after cap). The monthly cap is recorded in `bandwidth_tb`, and the flexible bandwidth policy is documented in `billing_notes`.
- **Currency:**
  - Servarica quotes prices in USD and CAD. USD is recorded as the primary source currency in `currency`.

### Letbox
- **Configurable Starting-At Series on `/store/vps`:**
  - Letbox's VPS store page (`https://my.letbox.com/index.php?rp=/store/vps`) lists 5 configurable lines: VPS Windows NVME SSD ("From $7.00/mo"), VPS Linux Storage ("From $3.00/mo"), VPS Linux NVME SSD ("From $3.00/mo"), VPS Linux NVME SSD Ryzen ("From $3.50/mo"), and VPS Linux NVME Block Storage ("From $4.00/mo").
  - Each item specifies only maximum ceilings ("Up to 8 CPU cores, Up to 16GB Dedicated RAM, Up to 100GB NVME SSD Disk, Up to 20TB/Month"), without stating base specs for the starting price, and clicking "Order Now" loops back to the store category.
  - Per contract Rule 5 ("Configurable-only pricing: emit only fixed published presets with the exact config"), these variable starting-tier cards cannot be emitted without speculative estimation and are omitted.
- **Dallas Storage SBox (`cart.php?gid=2`):**
  - 4 fixed published plans exist in WHMCS product group 2: E5-250GB ($3.00/mo), E5-500GB ($5.70/mo), E5-1TB ($6.75/mo), and E5-SBox-1.5TB ($15.00/mo).
  - All 4 are currently marked "Out of Stock". They are emitted with exact specs, tagged `out-of-stock`, and noted "Currently unavailable / out of stock on official site."
