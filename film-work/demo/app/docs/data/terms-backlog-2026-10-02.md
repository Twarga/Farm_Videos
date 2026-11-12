# Current price-terms backlog — 2 October worklist, checked 3 October 2026

No production price, publication snapshot, renewal correction, or site setting was changed. The inventory comes from a read-only SQLite backup of `data/bestvpsforme.db`. Initial smoke writes ran in `/tmp/bestvpsforme-terms-research/catalog.db`; the final migration-0016 smoke used a fresh backup at `/tmp/bestvpsforme-phase6-review/catalog.db`.

## Scope and counts

- 47 long-term/intro targets: 15 reviewed with a usable renewal, 12 quarantined, 20 open.
- Full queue: 67 rows — 20 open, 16 quarantined and 31 setup-fee candidates with a usable reviewed renewal. Monthly reviewed rows without a setup fee are included.
- The plan’s **43 guard-accepted rows** include 12 stamped rows whose renewal is null. Those 12 overlap the 20 open renewals. D6-5 also says to leave the 20 open renewals untouched; the intersection leaves **31 eligible setup-only reviews**, not 43 usable projections. No unknown renewal is promoted to a known value.
- All 16 quarantined rows render read-only; the transactional writer also refuses a forged mutation against their current price. This does not resolve or amend the owner-gated correction queue.

## Provider setup-fee evidence, checked 2026-10-03

### DreamHost

Source: https://www.dreamhost.com/hosting/vps/

Pricing page retrieved; no explicit server setup-fee amount found. Bandwidth overage wording is not setup-fee evidence.

### FastComet

Source: https://www.fastcomet.com/vps-pricing

Pricing page retrieved; “Free Site Setup” describes site assistance, not an explicit VPS provisioning fee. Leave unknown.

### Hostinger

Source: https://www.hostinger.com/vps-hosting

Provider Markdown pricing source retrieved; no explicit setup-fee statement found. Leave unknown.

### IONOS

Source: https://www.ionos.com/servers/vps

Explicit zero: “Unlimited traffic and no setup fees.” Price drift documented below.

### Liquid Web

Source: https://www.liquidweb.com/pricing/

Pricing page retrieved; “No hidden fees” elsewhere on the page is not an explicit Cloud VPS setup-fee value. Leave unknown.

### ScalaHosting

Source: https://www.scalahosting.com/vps-hosting.html

Provider redirected to managed-cloud pricing/Markdown. Free migration and SPanel are not setup-fee evidence. Leave unknown.

### Time4VPS

Source: https://www.time4vps.com/linux-vps/

Linux VPS source returned HTTP 403. Search results do not establish a setup-fee amount. Leave unknown.

### IONOS price drift

The current [VPS page](https://www.ionos.com/servers/vps) explicitly says **“Unlimited traffic and no setup fees.”** This covers the M+, L+, XL+ and XXL+ family in the stored worklist. The live page lists different promotional/regular prices (M+ $5/$14, L+ $8/$25, XL+ $14/$47) from the 31 August snapshot (M+ $4/$11, L+ $6/$21, XL+ $11/$44). That is recorded in the setup citation; no old price, renewal, intro duration, check date or review stamp is rewritten. The zero-fee candidates need owner approval before any production save.

## Disposable admin smoke

Four IONOS setup fees were saved as zero through the actual authenticated `/admin/terms` form, not direct SQL. Each save closed the prior validity row, inserted a current row and persisted `admin.price_terms_reviewed` with before/after and the request ID.

| Measure | Before | After (copy only) |
|---|---:|---:|
| Public reviewed projections | 0 | 4 |
| Plans with valueScore > -1 | 0 | 4 |
| X-ray eligible plans | 0 | 0 |

X-ray eligibility remains zero because no real-offer editorial draft has been owner-published. A setup fee alone cannot satisfy the reviewed-catch gate. The IONOS M+ offer page displayed **$10.42/mo**, $375 over three years, a $0 setup fee and unknown due-today; this is a service-cost projection, not a payment schedule.

The final smoke deep-compared all 20 open and all 16 quarantined current rows with their originals: unchanged. Every existing IONOS candidate field other than setup fee, its separate evidence field, row identity and validity/creation timestamps also remained unchanged. In particular, renewal evidence and its original reviewer/date stayed exact.

| Candidate | Real USD/month | Copy-only audit request ID |
|---|---:|---|
| ionos-vps-m-plus | 10.42 | fde13804-d19a-43dd-a26e-ac2de0693ab1 |
| ionos-vps-l-plus | 19.75 | 95e6833a-b798-4662-9f56-bd599fc8f786 |
| ionos-vps-xl-plus | 41.25 | b24667b2-452b-44cd-968f-61cb7d47a681 |
| ionos-vps-xxl-plus | 63.83 | 53ecd196-2db7-4c36-a7e0-5878787f47ff |

## 47-row target worklist

Stored billing notes and existing renewal citations follow each target. A blank due-today or setup fee stays unknown; parser suggestions are not evidence or approval. All dates below are the source snapshot date, not a claim of a new price check.

### aws-ec2-ec2-t3-micro-free

AWS EC2 t3.micro Free Tier; state **open**; source https://aws.amazon.com/free/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal; due-today amount.
- Billing evidence: 12-month free tier for accounts created before 2025-07-15: 750 h/mo t2.micro or t3.micro. Accounts on/after 2025-07-15: Free plan is up to $200 credits for 6 months (not a forever VM). Not always-free. EBS + public IPv4 can bill.
- Renewal citation: Not published

### buyvm-slice-512

BuyVM SLICE 512; state **open**; source https://buyvm.net/kvm-dedicated-server-slices/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: USD. Las Vegas, New York, Luxembourg. Unmetered bandwidth. DirectAdmin included. SLICE 512 billed yearly only.
- Renewal citation: Note: 'SLICE 512 billed yearly only' at $2.25/mo equivalent → $27 due. Renewal change not stated.

### microsoft-azure-azure-b1s-free

Microsoft Azure B1s Linux (free account); state **open**; source https://azure.microsoft.com/en-us/pricing/free-services/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal; due-today amount.
- Billing evidence: 12-month free tier: 750 hours/month of B1s (Linux and Windows each advertised) on an Azure free account. Not always-free. OS disk, IPv4, and bandwidth can still bill. After 12 months, PAYG. Always-free Azure list does not include a VM.
- Renewal citation: Not published

### namecheap-hypernova

Namecheap Hypernova; state **open**; source https://www.namecheap.com/hosting/vps/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal; due-today amount.
- Billing evidence: Five plan names confirmed on Namecheap KB (updated 2026-04-06). Numeric prices from 2026 public checkout roundups (official VPS HTML 403 on fetch). Yearly intro / renewal. UNVERIFIED if you need pixel-perfect checkout. Renewal ~$634.56/yr.
- Renewal citation: Not published

### namecheap-magnetar

Namecheap Magnetar; state **open**; source https://www.namecheap.com/hosting/vps/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal; due-today amount.
- Billing evidence: Five plan names confirmed on Namecheap KB (updated 2026-04-06). Numeric prices from 2026 public checkout roundups (official VPS HTML 403 on fetch). Yearly intro / renewal. UNVERIFIED if you need pixel-perfect checkout. Renewal ~$346.56/yr.
- Renewal citation: Not published

### namecheap-pulsar

Namecheap Pulsar; state **open**; source https://www.namecheap.com/hosting/vps/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal; due-today amount.
- Billing evidence: Five plan names confirmed on Namecheap KB (updated 2026-04-06). Numeric prices from 2026 public checkout roundups (official VPS HTML 403 on fetch). Yearly intro / renewal. UNVERIFIED if you need pixel-perfect checkout. Renewal ~$106.56/yr.
- Renewal citation: Not published

### namecheap-quasar

Namecheap Quasar; state **open**; source https://www.namecheap.com/hosting/vps/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal; due-today amount.
- Billing evidence: Five plan names confirmed on Namecheap KB (updated 2026-04-06). Numeric prices from 2026 public checkout roundups (official VPS HTML 403 on fetch). Yearly intro / renewal. UNVERIFIED if you need pixel-perfect checkout. Renewal ~$190.56/yr.
- Renewal citation: Not published

### namecheap-spark

Namecheap Spark; state **open**; source https://www.namecheap.com/hosting/vps/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal; due-today amount.
- Billing evidence: Five plan names confirmed on Namecheap KB (updated 2026-04-06). Numeric prices from 2026 public checkout roundups (official VPS HTML 403 on fetch). Yearly intro / renewal. UNVERIFIED if you need pixel-perfect checkout. Renewal ~$58.56/yr.
- Renewal citation: Not published

### racknerd-kvm-512

RackNerd KVM 512 MB; state **open**; source https://www.racknerd.com/kvm-vps; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal; due-today amount.
- Billing evidence: USD. Standard KVM from racknerd.com/kvm-vps (monthly except 512MB yearly). RAID-10 SSD. 1 IPv4.
- Renewal citation: Not published

### racknerd-special-1gb

RackNerd Specials 1 GB KVM; state **open**; source https://www.racknerd.com/specials/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). Lifetime lock typically on continuous renewal.
- Renewal citation: Note: 'Promo yearly from racknerd.com/specials/.' Renewal stated only as 'lifetime lock typically' (hedged) — not approved.

### racknerd-special-2gb

RackNerd Specials 2 GB KVM; state **open**; source https://www.racknerd.com/specials/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). Lifetime lock typically on continuous renewal.
- Renewal citation: Note: 'Promo yearly from racknerd.com/specials/.' Renewal stated only as 'lifetime lock typically' (hedged) — not approved.

### racknerd-special-4gb

RackNerd Specials 4 GB KVM; state **open**; source https://www.racknerd.com/specials/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). Lifetime lock typically on continuous renewal.
- Renewal citation: Note: 'Promo yearly from racknerd.com/specials/.' Renewal stated only as 'lifetime lock typically' (hedged) — not approved.

### racknerd-special-6gb

RackNerd Specials 6 GB KVM; state **open**; source https://www.racknerd.com/specials/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). KVM/SolusVM, 1 Gbps, 1 IPv4. Lifetime lock typically on continuous renewal.
- Renewal citation: Note: 'Promo yearly from racknerd.com/specials/.' Renewal stated only as 'lifetime lock typically' (hedged) — not approved.

### racknerd-special-8gb

RackNerd Specials 8 GB KVM; state **open**; source https://www.racknerd.com/specials/; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). KVM/SolusVM, 1 Gbps, 1 IPv4. Lifetime lock typically on continuous renewal.
- Renewal citation: Note: 'Promo yearly from racknerd.com/specials/.' Renewal stated only as 'lifetime lock typically' (hedged) — not approved.

### ssd-nodes-kvm-16xl

SSD Nodes KVM 16X-LARGE; state **open**; source https://www.ssdnodes.com/pricing/; checked 2026-08-31.

- Stored term: 36 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.
- Renewal citation: Note: 'Prices on page are 3-year billing cycle' ($23/mo × 36 = $828). Renewal after term not stated.

### ssd-nodes-kvm-2xl

SSD Nodes KVM 2X-LARGE; state **open**; source https://www.ssdnodes.com/pricing/; checked 2026-08-31.

- Stored term: 36 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.
- Renewal citation: Note: 'Prices on page are 3-year billing cycle' ($11.08/mo × 36 = $398.88). Renewal after term not stated.

### ssd-nodes-kvm-4xl

SSD Nodes KVM 4X-LARGE; state **open**; source https://www.ssdnodes.com/pricing/; checked 2026-08-31.

- Stored term: 36 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.
- Renewal citation: Note: 'Prices on page are 3-year billing cycle' ($16.42/mo × 36 = $591.12). Renewal after term not stated.

### ssd-nodes-kvm-8xl

SSD Nodes KVM 8X-LARGE; state **open**; source https://www.ssdnodes.com/pricing/; checked 2026-08-31.

- Stored term: 36 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.
- Renewal citation: Note: 'Prices on page are 3-year billing cycle' ($18/mo × 36 = $648). Renewal after term not stated.

### ssd-nodes-kvm-medium

SSD Nodes KVM MEDIUM; state **open**; source https://www.ssdnodes.com/pricing/; checked 2026-08-31.

- Stored term: 36 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.
- Renewal citation: Note: 'Prices on page are 3-year billing cycle' ($9.42/mo × 36 = $339.12). Renewal after term not stated.

### ssd-nodes-kvm-small

SSD Nodes KVM SMALL; state **open**; source https://www.ssdnodes.com/pricing/; checked 2026-08-31.

- Stored term: 36 months; intro: unknown months at unknown stored units; renewal: unknown stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; usable reviewed renewal.
- Billing evidence: USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.
- Renewal citation: Note: 'Prices on page are 3-year billing cycle' ($5.50/mo × 36 = $198). Renewal after term not stated.

### contabo-cloud-vps-12

Contabo Cloud VPS 12; state **quarantined**; source https://www.contabo.com/en/vps/; checked 2026-08-31.

- Stored term: 24 months; intro: unknown months at unknown stored units; renewal: 28.99 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).
- Renewal citation: Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

### contabo-cloud-vps-16

Contabo Cloud VPS 16; state **quarantined**; source https://www.contabo.com/en/vps/; checked 2026-08-31.

- Stored term: 24 months; intro: unknown months at unknown stored units; renewal: 42.91 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).
- Renewal citation: Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

### contabo-cloud-vps-18

Contabo Cloud VPS 18; state **quarantined**; source https://www.contabo.com/en/vps/; checked 2026-08-31.

- Stored term: 24 months; intro: unknown months at unknown stored units; renewal: 56.82 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).
- Renewal citation: Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

### contabo-cloud-vps-4

Contabo Cloud VPS 4; state **quarantined**; source https://www.contabo.com/en/vps/; checked 2026-08-31.

- Stored term: 24 months; intro: unknown months at unknown stored units; renewal: 6.38 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).
- Renewal citation: Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

### contabo-cloud-vps-6

Contabo Cloud VPS 6; state **quarantined**; source https://www.contabo.com/en/vps/; checked 2026-08-31.

- Stored term: 24 months; intro: unknown months at unknown stored units; renewal: 8.7 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).
- Renewal citation: Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

### contabo-cloud-vps-8

Contabo Cloud VPS 8; state **quarantined**; source https://www.contabo.com/en/vps/; checked 2026-08-31.

- Stored term: 24 months; intro: unknown months at unknown stored units; renewal: 16.23 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).
- Renewal citation: Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

### netcup-rs-1000-g12

netcup RS 1000 G12; state **quarantined**; source https://www.netcup.com/en/server/root-server/rs-1000-g12-ip-iv-12m; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: 14.83 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR incl. 19% VAT. RS 1000 G12 12-month from official product page €12.79. Other G12 VPS/RS sizes: specs from netcup public G12 lineup; monthly prices left empty where the public matrix did not show a firm number (UNVERIFIED). 12-month term; 1-month term costs more (page showed +€2.59 vs 12-month).
- Renewal citation: Note: 'EUR incl. 19% VAT. RS 1000 G12 12-month from official product page €12.79. 12-month term; 1-month term costs more (+€2.59).'

### netcup-vps-1000-g12

netcup VPS 1000 G12; state **quarantined**; source https://www.netcup.com/en/server/vps/vps-1000-g12-iv-12m; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: 12.01 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €10.36. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).
- Renewal citation: Note: 'EUR incl. 19% VAT. 12-month ... €10.36.' No renewal change stated; flat rate.

### netcup-vps-2000-g12

netcup VPS 2000 G12; state **quarantined**; source https://www.netcup.com/en/server/vps/vps-2000-g12-iv-12m; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: 22.31 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €19.24. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).
- Renewal citation: Note: 'EUR incl. 19% VAT. 12-month ... €19.24.' No renewal change stated; flat rate.

### netcup-vps-4000-g12

netcup VPS 4000 G12; state **quarantined**; source https://www.netcup.com/en/server/vps/vps-4000-g12-iv-12m; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: 37.58 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €32.41. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).
- Renewal citation: Note: 'EUR incl. 19% VAT. 12-month ... €32.41.' No renewal change stated; flat rate.

### netcup-500-g12

netcup VPS 500 G12; state **quarantined**; source https://www.netcup.com/en/server/vps/vps-500-g12-iv-12m; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: 6.85 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €5.91. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).
- Renewal citation: Note: 'EUR incl. 19% VAT. 12-month ... from official product page €5.91.' No renewal change stated; flat rate.

### netcup-vps-8000-g12

netcup VPS 8000 G12; state **quarantined**; source https://www.netcup.com/en/server/vps/vps-8000-g12-iv-12m; checked 2026-08-31.

- Stored term: 12 months; intro: unknown months at unknown stored units; renewal: 55.59 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount; owner-approved renewal correction.
- Billing evidence: EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €47.94. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).
- Renewal citation: Note: 'EUR incl. 19% VAT. 12-month ... €47.94.' No renewal change stated; flat rate.

### dreamhost-dh-stack16

DreamHost Stack 16; state **reviewed**; source https://www.dreamhost.com/hosting/vps/; checked 2026-08-31.

- Stored term: 1 months; intro: 3 months at 22.99 stored units; renewal: 34.99 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: Promo first 3 months $22.99/mo from official VPS page; auto-renews at $34.99/mo. Unmetered bandwidth (fair use). AMD EPYC + KVM.
- Renewal citation: Note: 'Promo first 3 months $22.99/mo from official VPS page; auto-renews at $34.99/mo.'

### dreamhost-dh-stack32

DreamHost Stack 32; state **reviewed**; source https://www.dreamhost.com/hosting/vps/; checked 2026-08-31.

- Stored term: 1 months; intro: 3 months at 45.99 stored units; renewal: 59.99 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: Promo first 3 months $45.99/mo from official VPS page; auto-renews at $59.99/mo. Unmetered bandwidth (fair use). AMD EPYC + KVM.
- Renewal citation: Note: 'Promo first 3 months $45.99/mo from official VPS page; auto-renews at $59.99/mo.'

### dreamhost-dh-stack4

DreamHost Stack 4; state **reviewed**; source https://www.dreamhost.com/hosting/vps/; checked 2026-08-31.

- Stored term: 1 months; intro: 3 months at 8.99 stored units; renewal: 15.99 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: Promo first 3 months $8.99/mo from official VPS page; auto-renews at $15.99/mo. Unmetered bandwidth (fair use). AMD EPYC + KVM.
- Renewal citation: Note: 'Promo first 3 months $8.99/mo from official VPS page; auto-renews at $15.99/mo.'

### dreamhost-dh-stack8

DreamHost Stack 8; state **reviewed**; source https://www.dreamhost.com/hosting/vps/; checked 2026-08-31.

- Stored term: 1 months; intro: 3 months at 13.99 stored units; renewal: 21.99 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: Promo first 3 months $13.99/mo from official VPS page; auto-renews at $21.99/mo. Unmetered bandwidth (fair use). AMD EPYC + KVM.
- Renewal citation: Note: 'Promo first 3 months $13.99/mo from official VPS page; auto-renews at $21.99/mo.'

### hostinger-kvm-1

Hostinger KVM 1; state **reviewed**; source https://www.hostinger.com/vps-hosting; checked 2026-08-31.

- Stored term: 24 months; intro: 24 months at 6.49 stored units; renewal: 11.99 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: USD. Intro price for current promo; renews at higher rate for 2 years (listed). Cancel anytime. NVMe. Regular/renewal $11.99/mo. Crossed-out list also shown ($19.49...).
- Renewal citation: Note: 'Intro price for current promo; renews at higher rate for 2 years (listed). Regular/renewal $11.99/mo.'

### hostinger-kvm-2

Hostinger KVM 2; state **reviewed**; source https://www.hostinger.com/vps-hosting; checked 2026-08-31.

- Stored term: 24 months; intro: 24 months at 8.99 stored units; renewal: 14.99 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: USD. Intro price for current promo; renews at higher rate for 2 years (listed). Cancel anytime. NVMe. Regular/renewal $14.99/mo. Crossed-out list also shown ($...).
- Renewal citation: Note: 'Intro price for current promo; renews at higher rate for 2 years (listed). Regular/renewal $14.99/mo.'

### hostinger-kvm-4

Hostinger KVM 4; state **reviewed**; source https://www.hostinger.com/vps-hosting; checked 2026-08-31.

- Stored term: 24 months; intro: 24 months at 12.99 stored units; renewal: 28.99 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: USD. Intro price for current promo; renews at higher rate for 2 years (listed). Cancel anytime. NVMe. Regular/renewal $28.99/mo. Crossed-out list also shown ($...).
- Renewal citation: Note: 'Intro price for current promo; renews at higher rate for 2 years (listed). Regular/renewal $28.99/mo.'

### hostinger-kvm-8

Hostinger KVM 8; state **reviewed**; source https://www.hostinger.com/vps-hosting; checked 2026-08-31.

- Stored term: 24 months; intro: 24 months at 25.99 stored units; renewal: 49.99 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: USD. Intro price for current promo; renews at higher rate for 2 years (listed). Cancel anytime. NVMe. Regular/renewal $49.99/mo. Crossed-out list also shown ($...).
- Renewal citation: Note: 'Intro price for current promo; renews at higher rate for 2 years (listed). Regular/renewal $49.99/mo.'

### ionos-vps-l-plus

IONOS VPS L+; state **reviewed**; source https://www.ionos.com/servers/vps; checked 2026-08-31.

- Stored term: 12 months; intro: 3 months at 6 stored units; renewal: 21 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: USD. Intro 3 months with 1-year term, then regular monthly. Unlimited traffic. US/UK/DE/ES. IPv4 included. After intro: $21/mo.
- Renewal citation: Note: 'Intro 3 months with 1-year term, then regular monthly. After intro: $21/mo.'

### ionos-vps-m-plus

IONOS VPS M+; state **reviewed**; source https://www.ionos.com/servers/vps; checked 2026-08-31.

- Stored term: 12 months; intro: 3 months at 4 stored units; renewal: 11 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: USD. Intro 3 months with 1-year term, then regular monthly. Unlimited traffic. US/UK/DE/ES. IPv4 included. After intro: $11/mo.
- Renewal citation: Note: 'Intro 3 months with 1-year term, then regular monthly. After intro: $11/mo.'

### ionos-vps-xl-plus

IONOS VPS XL+; state **reviewed**; source https://www.ionos.com/servers/vps; checked 2026-08-31.

- Stored term: 12 months; intro: 3 months at 11 stored units; renewal: 44 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: USD. Intro 3 months with 1-year term, then regular monthly. Unlimited traffic. US/UK/DE/ES. IPv4 included. After intro: $44/mo.
- Renewal citation: Note: 'Intro 3 months with 1-year term, then regular monthly. After intro: $44/mo.'

### ionos-vps-xxl-plus

IONOS VPS XXL+; state **reviewed**; source https://www.ionos.com/servers/vps; checked 2026-08-31.

- Stored term: 12 months; intro: 3 months at 18 stored units; renewal: 68 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: USD. Intro 3 months with 1-year term, then regular monthly. Unlimited traffic. US/UK/DE/ES. IPv4 included. After intro: $68/mo.
- Renewal citation: Note: 'Intro 3 months with 1-year term, then regular monthly. After intro: $68/mo.'

### scalahosting-scala-b1

ScalaHosting Build #1; state **reviewed**; source https://www.scalahosting.com/vps-hosting.html; checked 2026-08-31.

- Stored term: 12 months; intro: 12 months at 29.95 stored units; renewal: 54.95 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: 12-month intro $29.95/mo from official managed cloud table; renews $54.95/mo. Fully managed SPanel. Monthly term is the higher renewal rate.
- Renewal citation: Note: '12-month intro $29.95/mo from official managed cloud table; renews $54.95/mo.'

### scalahosting-scala-b2

ScalaHosting Build #2; state **reviewed**; source https://www.scalahosting.com/vps-hosting.html; checked 2026-08-31.

- Stored term: 12 months; intro: 12 months at 44.95 stored units; renewal: 96.95 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: 12-month intro $44.95/mo from official managed cloud table; renews $96.95/mo. Fully managed SPanel. Monthly term is the higher renewal rate.
- Renewal citation: Note: '12-month intro $44.95/mo from official managed cloud table; renews $96.95/mo.'

### scalahosting-scala-b3

ScalaHosting Build #3; state **reviewed**; source https://www.scalahosting.com/vps-hosting.html; checked 2026-08-31.

- Stored term: 12 months; intro: 12 months at 69.95 stored units; renewal: 170.95 stored units. Monetary values here are raw stored values, not necessarily original-currency amounts.
- Missing: verified setup fee; due-today amount.
- Billing evidence: 12-month intro $69.95/mo from official managed cloud table; renews $170.95/mo. Fully managed SPanel. Monthly term is the higher renewal rate.
- Renewal citation: Note: '12-month intro $69.95/mo from official managed cloud table; renews $170.95/mo.'

## All 43 guard-accepted setup-fee coverage rows

The 12 open-renewal overlaps remain locked out of agent setup review under D6-5. Of the 31 remaining rows, four have an explicit zero-fee provider statement; the other 27 remain unknown. No “free migration”, “free site setup”, “no hidden fees”, or omitted fee is treated as a zero provisioning fee.

| Offer | Renewal state | Setup evidence result |
|---|---|---|
| buyvm-slice-512 | open | Out of scope: open renewal |
| racknerd-special-1gb | open | Out of scope: open renewal |
| racknerd-special-2gb | open | Out of scope: open renewal |
| racknerd-special-4gb | open | Out of scope: open renewal |
| racknerd-special-6gb | open | Out of scope: open renewal |
| racknerd-special-8gb | open | Out of scope: open renewal |
| ssd-nodes-kvm-16xl | open | Out of scope: open renewal |
| ssd-nodes-kvm-2xl | open | Out of scope: open renewal |
| ssd-nodes-kvm-4xl | open | Out of scope: open renewal |
| ssd-nodes-kvm-8xl | open | Out of scope: open renewal |
| ssd-nodes-kvm-medium | open | Out of scope: open renewal |
| ssd-nodes-kvm-small | open | Out of scope: open renewal |
| dreamhost-dh-stack16 | reviewed | Unknown; provider result above |
| dreamhost-dh-stack32 | reviewed | Unknown; provider result above |
| dreamhost-dh-stack4 | reviewed | Unknown; provider result above |
| dreamhost-dh-stack8 | reviewed | Unknown; provider result above |
| fastcomet-cloud-2 | reviewed | Unknown; provider result above |
| fastcomet-cloud-3 | reviewed | Unknown; provider result above |
| fastcomet-cloud-4 | reviewed | Unknown; provider result above |
| hostinger-kvm-1 | reviewed | Unknown; provider result above |
| hostinger-kvm-2 | reviewed | Unknown; provider result above |
| hostinger-kvm-4 | reviewed | Unknown; provider result above |
| hostinger-kvm-8 | reviewed | Unknown; provider result above |
| ionos-vps-l-plus | reviewed | Verified zero candidate; copy-only audit above |
| ionos-vps-m-plus | reviewed | Verified zero candidate; copy-only audit above |
| ionos-vps-xl-plus | reviewed | Verified zero candidate; copy-only audit above |
| ionos-vps-xxl-plus | reviewed | Verified zero candidate; copy-only audit above |
| liquid-web-lw-1g | reviewed | Unknown; provider result above |
| liquid-web-lw-2g | reviewed | Unknown; provider result above |
| liquid-web-lw-4g | reviewed | Unknown; provider result above |
| liquid-web-lw-6g | reviewed | Unknown; provider result above |
| scalahosting-scala-b1 | reviewed | Unknown; provider result above |
| scalahosting-scala-b2 | reviewed | Unknown; provider result above |
| scalahosting-scala-b3 | reviewed | Unknown; provider result above |
| time4vps-linux-1 | reviewed | Unknown; provider result above |
| time4vps-linux-16 | reviewed | Unknown; provider result above |
| time4vps-linux-2 | reviewed | Unknown; provider result above |
| time4vps-linux-24 | reviewed | Unknown; provider result above |
| time4vps-linux-32 | reviewed | Unknown; provider result above |
| time4vps-linux-4 | reviewed | Unknown; provider result above |
| time4vps-linux-48 | reviewed | Unknown; provider result above |
| time4vps-linux-64 | reviewed | Unknown; provider result above |
| time4vps-linux-8 | reviewed | Unknown; provider result above |

## Tooling and verification

The form reuses `PriceTermsFields` with staged import review. Source-currency input is normalized only using the row’s stored check-date FX basis. Setup-only saves preserve every existing intro/renewal term and its original reviewer/date. Full review accepts only explicitly typed terms; blank and zero remain different. Returned drafts survive rejection, and pending forms disable submission. A stale price ID conflicts instead of overwriting another review; audit insertion failure rolls back both price windows.

Migration 0016 adds only nullable `offer_prices.setup_fee_source`, after migration 0015. No backfill, table rebuild, correction or publication is included. Existing rows remain null; new setup reviews write evidence separately from renewal citations. Snapshot rollback restores that evidence with the price. Apply only after owner approval; application rollback can leave the additive column in place. Normal SQLite schema-write locking applies. Migrations 0014 and 0015 were not rewritten.

Integrated verification: 439 unit tests across 74 files, TypeScript and ESLint passed; the disposable production build passed. The final fresh-backup admin smoke saved all four candidates with separate setup-fee evidence, produced four audits and preserved all 36 open/quarantined rows exactly. Six-project browser/axe checks are recorded in the Phase 6 plan.

## Evidence refresh and per-row disposition — 7 October 2026

This addendum preserves the historical 3 October record above. It records a fresh provider-page search and an explicit disposition for every frozen target. It changes no production price, setup fee, renewal, review stamp, snapshot or authentication record. Research completion does not mean an unknown price term became verified.

**31 setup-only candidates:** 4 Liquid Web zero-fee candidates now have matching product evidence; 4 IONOS zero-fee candidates remain on price reconciliation hold; 23 remain unknown. The 20 open renewals and all 16 quarantined correction rows remain excluded. The 47-row target inventory remains 15 reviewed, 12 quarantined, 20 open.

### Fresh provider evidence

- **DreamHost** — checked 2026-10-07: [DreamHost provider source](https://www.dreamhost.com/hosting/vps/). Stack pricing and renewal statements are available, but no explicit VPS provisioning/setup fee amount or waiver was found. Root access, deployment and bandwidth statements do not establish a setup fee.
- **FastComet** — checked 2026-10-07: [FastComet provider source](https://www.fastcomet.com/vps-pricing). Explicit wording: “Free Site Setup”. Site assistance and server configuration services are described, but no explicit VPS provisioning fee amount or waiver was found. Site setup is not a server provisioning fee.
- **Hostinger** — checked 2026-10-07: [Hostinger provider source](https://www.hostinger.com/vps-hosting). KVM pricing is accessible; no explicit setup fee amount or waiver found. Included apps, backups and instant provisioning do not establish a zero fee.
- **IONOS** — checked 2026-10-07: [IONOS provider source](https://www.ionos.com/servers/vps). Explicit wording: “Unlimited traffic and no setup fees”. Explicit zero fee covers VPS+ family, but stored introductory/regular rates are stale. Keep production setup-only saves on hold until price reconciliation; do not refresh old price check/reviewer stamps using this setup-only research.
- **Liquid Web** — checked 2026-10-07: [Liquid Web provider source](https://www.liquidweb.com/vps-hosting/cloud-vps/). Explicit wording: “Zero setup fees.”. Cloud VPS product-family fee waiver is explicit. Compute table matches all four stored plans: 1 GB $5/month, 2 GB $11/month, 4 GB $17/month and 6 GB $22/month. Applies to base Cloud VPS provisioning, not optional add-ons or a complete due-today/tax quotation.
- **ScalaHosting** — checked 2026-10-07: [ScalaHosting provider source](https://www.scalahosting.com/managed-cloud-hosting.html). Provider redirects to managed cloud. Intro/renewal pricing, migration and SPanel are visible, but no explicit VPS setup fee amount or waiver found. Domain-reseller zero setup wording belongs to another product.
- **Time4VPS** — checked 2026-10-07: [Time4VPS provider source](https://www.time4vps.com/linux-vps/). Linux VPS page was retrieved successfully on this check, unlike the historical 403. No explicit setup fee amount or waiver found; a blank fee remains unknown.

IONOS rate drift on the current page: M+ $5 introductory / $14 regular versus stored $4 / $11; L+ $8 / $25 versus $6 / $21; XL+ $14 / $47 versus $11 / $44; XXL+ $20 / $68 versus $18 / $68. Current introductory periods remain 3 months with a 1-year term. Zero setup evidence alone must not certify those historical price rows as current.

Liquid Web’s [custom VPS FAQ](https://www.liquidweb.com/vps-hosting/custom/) also describes a setup waiver, but the actual evidence used for these four candidates is the matching **Cloud VPS** product page. The Cloud VPS table’s compute configurations match the stored RAM, price and monthly term. A high-availability database setup charge is a different product and is not applied.

### All 47 original long-term / introductory targets

| Offer | Frozen state | Exact disposition reason |
|---|---|---|
| aws-ec2-ec2-t3-micro-free | open | Usable reviewed renewal is missing; original citation: Not published Preserve the current row; setup-only review is excluded by D6-5. Due-today is also unverified. |
| buyvm-slice-512 | open | Usable reviewed renewal is missing; original citation: Note: 'SLICE 512 billed yearly only' at $2.25/mo equivalent → $27 due. Renewal change not stated. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| microsoft-azure-azure-b1s-free | open | Usable reviewed renewal is missing; original citation: Not published Preserve the current row; setup-only review is excluded by D6-5. Due-today is also unverified. |
| namecheap-hypernova | open | Usable reviewed renewal is missing; original citation: Not published Preserve the current row; setup-only review is excluded by D6-5. Due-today is also unverified. |
| namecheap-magnetar | open | Usable reviewed renewal is missing; original citation: Not published Preserve the current row; setup-only review is excluded by D6-5. Due-today is also unverified. |
| namecheap-pulsar | open | Usable reviewed renewal is missing; original citation: Not published Preserve the current row; setup-only review is excluded by D6-5. Due-today is also unverified. |
| namecheap-quasar | open | Usable reviewed renewal is missing; original citation: Not published Preserve the current row; setup-only review is excluded by D6-5. Due-today is also unverified. |
| namecheap-spark | open | Usable reviewed renewal is missing; original citation: Not published Preserve the current row; setup-only review is excluded by D6-5. Due-today is also unverified. |
| racknerd-kvm-512 | open | Usable reviewed renewal is missing; original citation: Not published Preserve the current row; setup-only review is excluded by D6-5. Due-today is also unverified. |
| racknerd-special-1gb | open | Usable reviewed renewal is missing; original citation: Note: 'Promo yearly from racknerd.com/specials/.' Renewal stated only as 'lifetime lock typically' (hedged) — not approved. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| racknerd-special-2gb | open | Usable reviewed renewal is missing; original citation: Note: 'Promo yearly from racknerd.com/specials/.' Renewal stated only as 'lifetime lock typically' (hedged) — not approved. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| racknerd-special-4gb | open | Usable reviewed renewal is missing; original citation: Note: 'Promo yearly from racknerd.com/specials/.' Renewal stated only as 'lifetime lock typically' (hedged) — not approved. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| racknerd-special-6gb | open | Usable reviewed renewal is missing; original citation: Note: 'Promo yearly from racknerd.com/specials/.' Renewal stated only as 'lifetime lock typically' (hedged) — not approved. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| racknerd-special-8gb | open | Usable reviewed renewal is missing; original citation: Note: 'Promo yearly from racknerd.com/specials/.' Renewal stated only as 'lifetime lock typically' (hedged) — not approved. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| ssd-nodes-kvm-16xl | open | Usable reviewed renewal is missing; original citation: Note: 'Prices on page are 3-year billing cycle' ($23/mo × 36 = $828). Renewal after term not stated. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| ssd-nodes-kvm-2xl | open | Usable reviewed renewal is missing; original citation: Note: 'Prices on page are 3-year billing cycle' ($11.08/mo × 36 = $398.88). Renewal after term not stated. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| ssd-nodes-kvm-4xl | open | Usable reviewed renewal is missing; original citation: Note: 'Prices on page are 3-year billing cycle' ($16.42/mo × 36 = $591.12). Renewal after term not stated. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| ssd-nodes-kvm-8xl | open | Usable reviewed renewal is missing; original citation: Note: 'Prices on page are 3-year billing cycle' ($18/mo × 36 = $648). Renewal after term not stated. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| ssd-nodes-kvm-medium | open | Usable reviewed renewal is missing; original citation: Note: 'Prices on page are 3-year billing cycle' ($9.42/mo × 36 = $339.12). Renewal after term not stated. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| ssd-nodes-kvm-small | open | Usable reviewed renewal is missing; original citation: Note: 'Prices on page are 3-year billing cycle' ($5.50/mo × 36 = $198). Renewal after term not stated. Preserve the current row; setup-only review is excluded by D6-5. No due-today amount is inferred. |
| contabo-cloud-vps-12 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| contabo-cloud-vps-16 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| contabo-cloud-vps-18 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| contabo-cloud-vps-4 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| contabo-cloud-vps-6 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| contabo-cloud-vps-8 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| netcup-rs-1000-g12 | quarantined | A listed price or contract term was used to infer renewal. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| netcup-vps-1000-g12 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| netcup-vps-2000-g12 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| netcup-vps-4000-g12 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| netcup-500-g12 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| netcup-vps-8000-g12 | quarantined | The evidence explicitly says renewal was not stated. Owner-gated renewal correction remains unresolved; keep the current price read-only and exclude setup review. |
| dreamhost-dh-stack16 | reviewed | Stack pricing and renewal statements are available, but no explicit VPS provisioning/setup fee amount or waiver was found. Root access, deployment and bandwidth statements do not establish a setup fee. Due-today remains unknown. |
| dreamhost-dh-stack32 | reviewed | Stack pricing and renewal statements are available, but no explicit VPS provisioning/setup fee amount or waiver was found. Root access, deployment and bandwidth statements do not establish a setup fee. Due-today remains unknown. |
| dreamhost-dh-stack4 | reviewed | Stack pricing and renewal statements are available, but no explicit VPS provisioning/setup fee amount or waiver was found. Root access, deployment and bandwidth statements do not establish a setup fee. Due-today remains unknown. |
| dreamhost-dh-stack8 | reviewed | Stack pricing and renewal statements are available, but no explicit VPS provisioning/setup fee amount or waiver was found. Root access, deployment and bandwidth statements do not establish a setup fee. Due-today remains unknown. |
| hostinger-kvm-1 | reviewed | KVM pricing is accessible; no explicit setup fee amount or waiver found. Included apps, backups and instant provisioning do not establish a zero fee. Due-today remains unknown. |
| hostinger-kvm-2 | reviewed | KVM pricing is accessible; no explicit setup fee amount or waiver found. Included apps, backups and instant provisioning do not establish a zero fee. Due-today remains unknown. |
| hostinger-kvm-4 | reviewed | KVM pricing is accessible; no explicit setup fee amount or waiver found. Included apps, backups and instant provisioning do not establish a zero fee. Due-today remains unknown. |
| hostinger-kvm-8 | reviewed | KVM pricing is accessible; no explicit setup fee amount or waiver found. Included apps, backups and instant provisioning do not establish a zero fee. Due-today remains unknown. |
| ionos-vps-l-plus | reviewed | Explicit zero fee covers VPS+ family, but stored introductory/regular rates are stale. Keep production setup-only saves on hold until price reconciliation; do not refresh old price check/reviewer stamps using this setup-only research. Due-today remains unknown. |
| ionos-vps-m-plus | reviewed | Explicit zero fee covers VPS+ family, but stored introductory/regular rates are stale. Keep production setup-only saves on hold until price reconciliation; do not refresh old price check/reviewer stamps using this setup-only research. Due-today remains unknown. |
| ionos-vps-xl-plus | reviewed | Explicit zero fee covers VPS+ family, but stored introductory/regular rates are stale. Keep production setup-only saves on hold until price reconciliation; do not refresh old price check/reviewer stamps using this setup-only research. Due-today remains unknown. |
| ionos-vps-xxl-plus | reviewed | Explicit zero fee covers VPS+ family, but stored introductory/regular rates are stale. Keep production setup-only saves on hold until price reconciliation; do not refresh old price check/reviewer stamps using this setup-only research. Due-today remains unknown. |
| scalahosting-scala-b1 | reviewed | Provider redirects to managed cloud. Intro/renewal pricing, migration and SPanel are visible, but no explicit VPS setup fee amount or waiver found. Domain-reseller zero setup wording belongs to another product. Due-today remains unknown. |
| scalahosting-scala-b2 | reviewed | Provider redirects to managed cloud. Intro/renewal pricing, migration and SPanel are visible, but no explicit VPS setup fee amount or waiver found. Domain-reseller zero setup wording belongs to another product. Due-today remains unknown. |
| scalahosting-scala-b3 | reviewed | Provider redirects to managed cloud. Intro/renewal pricing, migration and SPanel are visible, but no explicit VPS setup fee amount or waiver found. Domain-reseller zero setup wording belongs to another product. Due-today remains unknown. |

### All 31 eligible setup-only candidates

| Offer | Result on 7 October | Source |
|---|---|---|
| dreamhost-dh-stack16 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.dreamhost.com/hosting/vps/) |
| dreamhost-dh-stack32 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.dreamhost.com/hosting/vps/) |
| dreamhost-dh-stack4 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.dreamhost.com/hosting/vps/) |
| dreamhost-dh-stack8 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.dreamhost.com/hosting/vps/) |
| fastcomet-cloud-2 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.fastcomet.com/vps-pricing) |
| fastcomet-cloud-3 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.fastcomet.com/vps-pricing) |
| fastcomet-cloud-4 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.fastcomet.com/vps-pricing) |
| hostinger-kvm-1 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.hostinger.com/vps-hosting) |
| hostinger-kvm-2 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.hostinger.com/vps-hosting) |
| hostinger-kvm-4 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.hostinger.com/vps-hosting) |
| hostinger-kvm-8 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.hostinger.com/vps-hosting) |
| ionos-vps-l-plus | Explicit zero; HOLD for price reconciliation. | [Provider source](https://www.ionos.com/servers/vps) |
| ionos-vps-m-plus | Explicit zero; HOLD for price reconciliation. | [Provider source](https://www.ionos.com/servers/vps) |
| ionos-vps-xl-plus | Explicit zero; HOLD for price reconciliation. | [Provider source](https://www.ionos.com/servers/vps) |
| ionos-vps-xxl-plus | Explicit zero; HOLD for price reconciliation. | [Provider source](https://www.ionos.com/servers/vps) |
| liquid-web-lw-1g | Explicit zero; matching Cloud VPS product-family evidence. | [Provider source](https://www.liquidweb.com/vps-hosting/cloud-vps/) |
| liquid-web-lw-2g | Explicit zero; matching Cloud VPS product-family evidence. | [Provider source](https://www.liquidweb.com/vps-hosting/cloud-vps/) |
| liquid-web-lw-4g | Explicit zero; matching Cloud VPS product-family evidence. | [Provider source](https://www.liquidweb.com/vps-hosting/cloud-vps/) |
| liquid-web-lw-6g | Explicit zero; matching Cloud VPS product-family evidence. | [Provider source](https://www.liquidweb.com/vps-hosting/cloud-vps/) |
| scalahosting-scala-b1 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.scalahosting.com/managed-cloud-hosting.html) |
| scalahosting-scala-b2 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.scalahosting.com/managed-cloud-hosting.html) |
| scalahosting-scala-b3 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.scalahosting.com/managed-cloud-hosting.html) |
| time4vps-linux-1 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.time4vps.com/linux-vps/) |
| time4vps-linux-16 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.time4vps.com/linux-vps/) |
| time4vps-linux-2 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.time4vps.com/linux-vps/) |
| time4vps-linux-24 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.time4vps.com/linux-vps/) |
| time4vps-linux-32 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.time4vps.com/linux-vps/) |
| time4vps-linux-4 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.time4vps.com/linux-vps/) |
| time4vps-linux-48 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.time4vps.com/linux-vps/) |
| time4vps-linux-64 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.time4vps.com/linux-vps/) |
| time4vps-linux-8 | Unknown; explicit fee amount/waiver not found. | [Provider source](https://www.time4vps.com/linux-vps/) |

### Quarantine and newly added plans

All 16 rows in [the frozen correction queue](../../src/app/admin/terms/correction-queue.json) retain their existing owner-gated disposition. Twelve overlap the 47-row target list; four monthly targets are outside it. The machine-readable addendum lists all 16 individually and repeats their original reason. No correction was applied.

The following **8 new special plans** were added after the frozen Phase 6 terms worklist was defined. They are recorded separately, rather than silently expanding the 47 / 31 denominators. This setup search does not establish setup fees, reviewed renewals or three-year projections for them.

- cloudcone-frankenstein-26-ssd-vps-1
- cloudcone-frankenstein-26-ssd-vps-2
- cloudcone-frankenstein-26-ssd-vps-3
- cloudcone-frankenstein-26-ssd-vps-4
- cloudcone-frankenstein-26-ssd-vps-5
- greencloudvps-budgetkvmnyc-3-sale
- greencloudvps-epycnyc-2-sale
- greencloudvps-epycnyc-3-sale

The five highlighted existing RackNerd Specials remain among the 20 open renewal rows. Promotion evidence does not change their reviewed-renewal status here.

Machine-readable evidence, all 47 reasons, all 31 setup dispositions, all 16 quarantine reasons and the 8-plan scope note: [setup-fee-research-2026-10-07.json](setup-fee-research-2026-10-07.json). Unknowns and holds are recorded outcomes, not approved production mutations.

### Production setup saves — 7 October 2026

After the fresh-copy rehearsal, the four matching Liquid Web setup candidates were saved with the active local owner's audit identity. Current setup fees are $0; reviewed monthly projections are $5, $11, $17 and $22. The setup-only operation preserved the prior source price dates, renewal amounts and review stamps. It closed four previous price revisions and added four current revisions; the other 652 historical price records were unchanged. The 20 open renewal rows and 16 quarantined rows were not changed. IONOS remains on hold because of current price disagreements.

The research JSON above records the pre-write research state. Actual production mutations are in `../progress/phase-6-setup-production-receipts-2026-10-07.json`; the final status and verification are in `../progress/phase-6-delivery-2026-10-07.md`.
