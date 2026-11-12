# Owner Items: Batch b03-big-clouds (Big Clouds / Hyperscalers)

**Date:** 2026-11-01  
**Batch:** `b03-big-clouds`  
**Providers covered:** DigitalOcean, AWS Lightsail, AWS EC2, Google Cloud, Microsoft Azure, Oracle Cloud, Alibaba Cloud  

---

### 1. Blocked Providers / URLs (Trustpilot HTTP 403)
- **Trustpilot Review Pages:** Direct fetches of Trustpilot URLs for all assigned providers returned HTTP 403 (Cloudflare automated access challenge):
  - DigitalOcean: `https://www.trustpilot.com/review/digitalocean.com` (HTTP 403)
  - AWS Lightsail / AWS EC2: `https://www.trustpilot.com/review/aws.amazon.com` (HTTP 403)
  - Google Cloud: `https://www.trustpilot.com/review/cloud.google.com` (HTTP 403)
  - Microsoft Azure: `https://www.trustpilot.com/review/azure.microsoft.com` (HTTP 403)
  - Oracle Cloud: `https://www.trustpilot.com/review/oracle.com` (HTTP 403)
  - Alibaba Cloud: `https://www.trustpilot.com/review/alibabacloud.com` (HTTP 403)
- **Action Taken:** Per contract Rule 2 and Rule 4, no anti-bot or proxy bypass was attempted. Trustpilot fields (`trustpilot_score`, `trustpilot_reviews`, `trustpilot_url`) are left blank for all rows in this batch. Owner should refresh ratings via interactive browser or official API if required.

---

### 2. Provider Duplicate to Clean Up
- **`aws-lightsail-aws`:** Verified existing duplicate provider record in the administrative catalog / ready plan (`docs/V1_READY_PLAN.md` items 60 & 126).
- **Recommendation:** Approve deleting `aws-lightsail-aws` (or merging into `AWS Lightsail` / `aws-lightsail`) via the admin panel. No plans were emitted under `aws-lightsail-aws`.

---

### 3. Plans That Disappeared From Official Pages
- **Alibaba Cloud — `aliyun-ssd-starter` ($2.50/mo):**
  - The historical promotional URL `https://www.alibabacloud.com/starter-packages/general` now redirects to Simple Application Server (`https://www.alibabacloud.com/en/product/swas`). The unverified $2.50 entry plan is no longer offered.
  - **Replacement:** Emitted 6 standard Linux fixed-price packages under Simple Application Server (SWAS: `sas-2c-05g`, `sas-2c-1g`, `sas-2c-2g`, `sas-2c-4g`, `sas-4c-8g`, `sas-4c-16g`), starting at $4/mo.

---

### 4. Hyperscaler Representative Tiers & Pricing Model Notes
Per contract rules and prompt guidance, hyperscalers emit representative small/mid configurations rather than full 100+ SKU instance matrices:

- **DigitalOcean (31 rows emitted):**
  - Droplets pricing page: `https://www.digitalocean.com/pricing/droplets`.
  - Confirmed: Basic Droplets (Regular CPU: 512 MiB through 16 GiB), CPU-Optimized (4 GiB to 96 GiB), General Purpose (8 GiB to 160 GiB), Memory-Optimized (16 GiB to 256 GiB NVMe), and Storage-Optimized (16 GiB to 256 GiB NVMe).
  - Terms: Per-second billing with 60-second minimum or $0.01 since 2026-01-01; monthly cap 672 hours. Bundled IPv4 included. v5 a-la-carte and GPU Droplets skipped per cutoff rules.
- **AWS Lightsail (25 rows emitted):**
  - Pricing page: `https://aws.amazon.com/lightsail/pricing/`.
  - Confirmed: Linux/Unix bundles with public IPv4 address across General Purpose (Nano $5 to 16XLarge $1,764), Memory Optimized (16 GB $74 to 512 GB $2,344), and Compute Optimized (4 GB $42 to 144 GB $1,688).
  - Note: Hourly rate based on AWS monthly cap / 730 hours. Data transfer allowance is halved in select APAC regions and São Paulo.
- **AWS EC2 (1 row emitted):**
  - Free tier page: `https://aws.amazon.com/free/`.
  - Re-checked: Free plan now provides up to $200 credits for 6 months ($100 on signup + $100 for milestone activities). Legacy 750h/mo t2/t3.micro applies only to accounts created before 2025-07-15. Public IPv4 and EBS volumes incur separate charges.
- **Google Cloud (10 rows emitted):**
  - Pages: `https://docs.cloud.google.com/free/docs/free-cloud-features` (Always Free) and `https://cloud.google.com/products/compute/pricing/general-purpose` (General Purpose On-Demand, Iowa us-central1).
  - Confirmed: 1 Always Free `e2-micro-always-free` (30 GB standard persistent disk, 1 GB egress/mo), plus on-demand E2 shared-core (`e2-micro`, `e2-small`, `e2-medium`), E2 standard (`e2-standard-2` to `e2-standard-32`), and legacy `f1-micro`.
  - Note: Paid on-demand prices reflect baseline compute only; boot persistent disks, external IPv4, and egress are billed separately.
- **Microsoft Azure (1 row emitted):**
  - Free services page: `https://azure.microsoft.com/en-us/pricing/free-services/` and terms `https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p/`.
  - Confirmed: 750 hours/month B1s Linux virtual machines free for 12 months for new accounts with spending limit and $200 30-day credit. OS disk, public IPv4, and bandwidth can incur charges.
- **Oracle Cloud (4 rows emitted):**
  - Always Free docs: `https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm` and Arm Compute: `https://www.oracle.com/cloud/compute/arm/`.
  - Confirmed Always Free: `vm-standard-a1-flex-always-free` (2 OCPUs + 12 GB RAM, 1,500 OCPU-hrs + 9,000 GB-hrs/mo) and `vm-standard-e2-1-micro` (1/8 OCPU, 1 GB RAM). Boot volumes allocated from 200 GB Always Free Block Volume storage. Idle instances (<20% CPU/memory/net over 7 days) subject to reclamation.
  - Confirmed Paid Flex: `a1-flex-1-6` ($13.87/mo) and `a1-flex-4-24` ($55.48/mo) at $0.01/OCPU-hr + $0.0015/GB-hr across all commercial regions.
- **Alibaba Cloud (6 rows emitted):**
  - Page: `https://www.alibabacloud.com/en/product/swas`.
  - Confirmed: Simple Application Server (SWAS) fixed-price packages from 0.5 GiB / 2 vCPU ($4/mo) to 16 GiB / 4 vCPU ($48/mo).

---

### 5. Pricing Ambiguities & VAT
- All emitted prices are in source currency USD.
- Hyperscaler prices are quoted net of taxes (sales tax, VAT, or GST added where required by local tax laws).
- Hyperscaler bandwidth and disk extras: Where storage or bandwidth is not bundled in fixed packages (e.g. EC2, GCP on-demand, Azure on-demand, OCI Paid Flex), exact pricing requires attached block storage and egress metering as detailed in `billing_notes`.
