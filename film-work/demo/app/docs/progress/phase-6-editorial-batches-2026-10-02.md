# Phase 6 editorial batches — 2 October worklist, prepared 3 October 2026

## Publication boundary

No production editorial, price or publication snapshot was changed. The worklist is exported from the original catalog on a read-only-backup copy **before** the disposable setup-fee smoke altered four IONOS rows. Provider coverage leads, then recommended rank; queue position and recommended rank are different numbers.

D6-2 requires agent drafts and owner publication. D6-3 permits stored evidence; dated provider research is cited separately where fetched and any disagreement remains in the citation. Subsequent batches wait for owner review of batch 1.

## Frozen top-100 worklist (exported before prose)

The following JSON is the stored evidence available to the writer, not a new provider price check. Missing hardware facts remain null. No absent renewal becomes a claim of flat pricing.

```json
[
  {
    "position": 1,
    "recommendedRank": 1,
    "id": "scaleway-stardust1-s",
    "provider": "Scaleway",
    "sourceUrl": "https://www.scaleway.com/en/pricing/virtual-instances/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR before tax, PAR-1. Approx monthly as published (~730h). Storage and public IPv4 billed separately; egress+IPv6 in list price. Cutoff: Development (PLAY2/DEV1/STARDUST) + PRO2 + GP1 + BASIC3. Skip POP2/BASIC2/STANDARD2/STANDARD3/COMPUTE3/MEMORY3 (older or specialized matrix).",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": null,
      "diskKind": "block/local extra",
      "cpuKind": "shared"
    },
    "ipv4Status": "extra",
    "transfer": "Not published",
    "locations": [
      "FR",
      "NL",
      "PL"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 2,
    "recommendedRank": 2,
    "id": "racknerd-special-1gb",
    "provider": "RackNerd",
    "sourceUrl": "https://www.racknerd.com/specials/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). Lifetime lock typically on continuous renewal.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 20,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": true
  },
  {
    "position": 3,
    "recommendedRank": 3,
    "id": "ramnode-lite-1gb",
    "provider": "RamNode",
    "sourceUrl": "https://ramnode.com/products/cloud-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Lite Cloud: IPv6; +$2/mo IPv4.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 15,
      "diskKind": "NVMe",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "extra",
    "transfer": "0.5 TB",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 4,
    "recommendedRank": 4,
    "id": "buyvm-slice-512",
    "provider": "BuyVM",
    "sourceUrl": "https://buyvm.net/kvm-dedicated-server-slices/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Las Vegas, New York, Luxembourg. Unmetered bandwidth. DirectAdmin included. SLICE 512 billed yearly only.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 0.5,
      "diskGb": 10,
      "diskKind": "SSD",
      "cpuKind": "fair-share 3.50+ GHz"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "LU"
    ],
    "confidence": "medium",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": true
  },
  {
    "position": 5,
    "recommendedRank": 6,
    "id": "webdock-essential",
    "provider": "Webdock",
    "sourceUrl": "https://webdock.io/en/pricing",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR month-to-month. Featured bundles on pricing page. Custom VPS from €4.30 (CPU €1.60, RAM €0.60/GB, disk €0.10/GB). DK-DC1 Denmark. IPv4 included. Overage €2.50/TB.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 15,
      "diskKind": "NVMe",
      "cpuKind": "Xeon Gold"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "DK"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 6,
    "recommendedRank": 7,
    "id": "alibaba-cloud-aliyun-ssd-starter",
    "provider": "Alibaba Cloud",
    "sourceUrl": "https://www.alibabacloud.com/starter-packages/general",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD from official alibabacloud.com/product/ecs/pricing starter package ('SSD Cloud server and data transfer for only $2.50 a month'). Full ECS SKU specs UNVERIFIED. Promo/new-user — not always-free.",
    "hardware": {
      "vcpu": null,
      "ramGb": null,
      "diskGb": null,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 7,
    "recommendedRank": 8,
    "id": "interserver-1-slice",
    "provider": "InterServer",
    "sourceUrl": "https://www.interserver.net/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Official slice examples on interserver.net/vps (2026-08-31): 1 slice $3/mo 1c/2GB/40GB/2TB; 4 slices $12/mo 2c/8GB/160GB/8TB. Full order flow 1–32 slices. Price-lock advertised. Secaucus NJ typical.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 40,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 8,
    "recommendedRank": 11,
    "id": "time4vps-linux-2",
    "provider": "Time4VPS",
    "sourceUrl": "https://www.time4vps.com/linux-vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR. Official linux-vps page: list / intro / renewal. Linux 1 has no discount. Lithuania. Optional backups/NVMe add-ons. List €7.99/mo; renews €5.77/mo.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 25,
      "diskKind": "SSD",
      "cpuKind": "KVM 2.6 GHz"
    },
    "ipv4Status": "included",
    "transfer": "4 TB",
    "locations": [
      "LT"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": 5.77,
    "termsReviewed": true
  },
  {
    "position": 9,
    "recommendedRank": 12,
    "id": "hostkey-hostkey-pico",
    "provider": "HOSTKEY",
    "sourceUrl": "https://hostkey.com/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official hostkey.com/vps/ library. 1 Gbit/s, 3 TB included. Skip GPU SKUs.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 40,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [
      "NL",
      "FI",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 10,
    "recommendedRank": 13,
    "id": "alphavps-alpha-c2g",
    "provider": "AlphaVPS",
    "sourceUrl": "https://alphavps.com/cheap-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official alphavps.com/cheap-vps. Monthly €2.99; annual billed €2.54/mo (€30.5/yr), flat at renewal. Xeon Scalable KVM. 14-day money-back.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 30,
      "diskKind": "NVMe RAID-10",
      "cpuKind": "Xeon Scalable shared"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [
      "DE",
      "GB",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 11,
    "recommendedRank": 15,
    "id": "clouding-io-clouding-1gb",
    "provider": "Clouding.io",
    "sourceUrl": "https://clouding.io/en/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR. Hourly 0.004€, monthly cap 3€ from official clouding.io/en. 4 TB transfer then 0.004€/GB. Hourly billing, no monthly minimum. Fixed IPv4.",
    "hardware": {
      "vcpu": 0.5,
      "ramGb": 1,
      "diskGb": 5,
      "diskKind": "NVMe",
      "cpuKind": "½ vCore KVM"
    },
    "ipv4Status": "included",
    "transfer": "4 TB",
    "locations": [
      "ES"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 12,
    "recommendedRank": 16,
    "id": "upcloud-starter-1xcpu-1gb",
    "provider": "UpCloud",
    "sourceUrl": "https://upcloud.com/products/cloud-servers/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR excl tax. Hourly billed, capped 28 days/month. IPv4 included on Starter. Zero-cost egress with fair-use. 1GB plan max 5 concurrent per customer. USD prices also published ($3.5 for 1GB).",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 10,
      "diskKind": "MaxIOPS",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "AU"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 13,
    "recommendedRank": 18,
    "id": "namecheap-spark",
    "provider": "Namecheap",
    "sourceUrl": "https://www.namecheap.com/hosting/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Five plan names confirmed on Namecheap KB (updated 2026-04-06). Numeric prices from 2026 public checkout roundups (official VPS HTML 403 on fetch). Yearly intro / renewal. UNVERIFIED if you need pixel-perfect checkout. Renewal ~$58.56/yr.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 20,
      "diskKind": "SSD RAID 10",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 14,
    "recommendedRank": 19,
    "id": "digitalocean-basic-512mb",
    "provider": "DigitalOcean",
    "sourceUrl": "https://www.digitalocean.com/pricing/droplets",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Per-second billing (min 60s/$0.01) since 2026-01-01; monthly cap 672h. Regular CPU option as shown on pricing page. IPv4 included on bundled plans. Skip: v5 a-la-carte, GPU Droplets.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 0.5,
      "diskGb": 10,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "0.5 TB",
    "locations": [
      "US",
      "AU",
      "CA",
      "DE",
      "IN",
      "NL",
      "SG",
      "GB"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 15,
    "recommendedRank": 21,
    "id": "ionos-vps-m-plus",
    "provider": "IONOS",
    "sourceUrl": "https://www.ionos.com/servers/vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Intro 3 months with 1-year term, then regular monthly. Unlimited traffic. US/UK/DE/ES. IPv4 included. After intro: $11/mo.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 4,
      "diskGb": 120,
      "diskKind": "NVMe",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "DE",
      "ES",
      "GB"
    ],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": 11,
    "termsReviewed": true
  },
  {
    "position": 16,
    "recommendedRank": 23,
    "id": "ovhcloud-vps-1",
    "provider": "OVHcloud",
    "sourceUrl": "https://www.ovhcloud.com/en/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Advertised 'from' monthly on OVHcloud EN VPS page (VPS 2027 range). Unlimited traffic except APAC quota (VPS-1 500GB, VPS-2/3 1TB, VPS-4 3TB then cap 10Mbps). Daily backup included. IPv4 included. Bandwidth field: unlimited*.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 4,
      "diskGb": 40,
      "diskKind": "NVMe",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 17,
    "recommendedRank": 25,
    "id": "hostsailor-hs-mini-nvme",
    "provider": "HostSailor",
    "sourceUrl": "https://hostsailor.com/kvm-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD monthly from official clients.hostsailor.com/index.php?rp=/store/kvm-vps-nvme (also listed on hostsailor.com/kvm-vps). Netherlands NVMe KVM. 1 Gbit. 1 IPv4 + /64 IPv6. Yearly listed as 12× monthly. Dubai-registered; NL/RO DCs. Crypto accepted.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 30,
      "diskKind": "NVMe",
      "cpuKind": "KVM AMD EPYC"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "NL"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 18,
    "recommendedRank": 26,
    "id": "hostwinds-ul-1",
    "provider": "Hostwinds",
    "sourceUrl": "https://www.hostwinds.com/unmanaged-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD unmanaged Linux. 1c/1GB $4.99 from public 2026 plan listings (hostwinds.com/vps is JS). Higher unmanaged tiers from the same public table. Entry confirmed on multiple 2026 plan databases.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 30,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "US",
      "NL"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 19,
    "recommendedRank": 28,
    "id": "liquid-web-lw-1g",
    "provider": "Liquid Web",
    "sourceUrl": "https://www.liquidweb.com/pricing/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD from official liquidweb.com/pricing/ Cloud VPS table (regular starting-at, not the 50%-off-2-months promo). Some SKUs show a 50% intro for 2 months — listed here at the regular rate.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 30,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": 5,
    "termsReviewed": true
  },
  {
    "position": 20,
    "recommendedRank": 29,
    "id": "knownhost-entry",
    "provider": "KnownHost",
    "sourceUrl": "https://www.knownhost.com/unmanaged-vps.html",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD starting-at unmanaged NVMe. ATL/SEA/AMS. 2 IPv4 included. Managed VPS is a separate higher line from $43.25.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 25,
      "diskKind": "NVMe",
      "cpuKind": "dedicated resources (unmanaged)"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [
      "US",
      "NL"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 21,
    "recommendedRank": 30,
    "id": "aws-lightsail-ls-gp-nano-v4",
    "provider": "AWS Lightsail",
    "sourceUrl": "https://aws.amazon.com/lightsail/pricing/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Linux/Unix bundles with public IPv4. Hourly up to monthly cap. APAC Mumbai/Sydney/Jakarta/Malaysia/HK and Sao Paulo get half the transfer. Skip Windows and IPv6-only (IPv6-only GP starts $3.50). Cutoff: Lightsail VM bundles only (not containers/DBs).",
    "hardware": {
      "vcpu": 2,
      "ramGb": 0.5,
      "diskGb": 20,
      "diskKind": "SSD",
      "cpuKind": "burstable/shared (GP) or dedicated-class (MO/CO)"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 22,
    "recommendedRank": 31,
    "id": "akamai-linode-g6-nanode-1",
    "provider": "Akamai Linode",
    "sourceUrl": "https://www.linode.com/pricing/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Hourly billed, monthly cap except G8/GPU (excluded). Transfer pooled. Official types from api.linode.com/v4/linode/types. Cutoff: skip GPU, accelerated, G8 (true hourly, no monthly cap since 2026-07-01).",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 25,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 23,
    "recommendedRank": 35,
    "id": "ssd-nodes-kvm-small",
    "provider": "SSD Nodes",
    "sourceUrl": "https://www.ssdnodes.com/pricing/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 8,
      "diskGb": 160,
      "diskKind": "SSD",
      "cpuKind": "Intel Xeon Silver"
    },
    "ipv4Status": "included",
    "transfer": "4 TB",
    "locations": [],
    "confidence": "medium",
    "termMonths": 36,
    "renewalMonthly": null,
    "termsReviewed": true
  },
  {
    "position": 24,
    "recommendedRank": 36,
    "id": "google-cloud-f1-micro",
    "provider": "Google Cloud",
    "sourceUrl": "https://cloud.google.com/products/compute/pricing/general-purpose",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD on-demand Default rate, Iowa (us-central1) as listed on official General Purpose VM pricing. Persistent disk extra. e2-micro Always Free in us-west1/us-central1/us-east1 until monthly hour cap. Cutoff: E2 shared-core + E2 standard 2–32 + f1-micro; not the full N4/C4 matrix.",
    "hardware": {
      "vcpu": 0.2,
      "ramGb": 0.6,
      "diskGb": null,
      "diskKind": "persistent disk extra",
      "cpuKind": "shared N1 legacy"
    },
    "ipv4Status": "extra",
    "transfer": "Not published",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 25,
    "recommendedRank": 38,
    "id": "leaseweb-vps-1-eu",
    "provider": "Leaseweb",
    "sourceUrl": "https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "New-contract prices from 1 Aug 2026, official Leaseweb blog. EUR for NL/DE. USD US-region also published. Specs for VPS 1/2/3/5 from public VPSBenchmarks plan sheet (4c/6GB/100GB etc.). VPS 4/6 specs UNVERIFIED.",
    "hardware": {
      "vcpu": 4,
      "ramGb": 6,
      "diskGb": 100,
      "diskKind": "SSD",
      "cpuKind": "shared VPS"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "NL",
      "DE"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 26,
    "recommendedRank": 39,
    "id": "yourserver-ys-1gb",
    "provider": "Yourserver",
    "sourceUrl": "https://www.yourserver.se/en/linux",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official yourserver.se/en/linux. KVM on Xeon + SSD. Unmetered transfer, 1 Gbps. Sweden or Latvia. 1 IPv4 + IPv6.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 10,
      "diskKind": "SSD",
      "cpuKind": "KVM Xeon"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "SE",
      "LV"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 27,
    "recommendedRank": 41,
    "id": "greencloudvps-gcvps-ryzenkvm-1",
    "provider": "GreenCloudVPS",
    "sourceUrl": "https://green.cloud/ryzen-kvm-vps.php",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Official green.cloud/ryzen-kvm-vps.php USA/EU table. 1 core @ 3.5+ GHz. 1 Gbps port.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 15,
      "diskKind": "NVMe",
      "cpuKind": "1 core Ryzen 3.5+ GHz"
    },
    "ipv4Status": "included",
    "transfer": "1.5 TB",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 28,
    "recommendedRank": 45,
    "id": "contabo-cloud-vps-4",
    "provider": "Contabo",
    "sourceUrl": "https://www.contabo.com/en/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).",
    "hardware": {
      "vcpu": 4,
      "ramGb": 8,
      "diskGb": 100,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "DE",
      "AU",
      "JP",
      "SG",
      "GB",
      "US"
    ],
    "confidence": "high",
    "termMonths": 24,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 29,
    "recommendedRank": 46,
    "id": "hostinger-kvm-1",
    "provider": "Hostinger",
    "sourceUrl": "https://www.hostinger.com/vps-hosting",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Intro price for current promo; renews at higher rate for 2 years (listed). Cancel anytime. NVMe. Regular/renewal $11.99/mo. Crossed-out list also shown ($19.49...).",
    "hardware": {
      "vcpu": 1,
      "ramGb": 4,
      "diskGb": 50,
      "diskKind": "NVMe",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "4 TB",
    "locations": [],
    "confidence": "high",
    "termMonths": 24,
    "renewalMonthly": 11.99,
    "termsReviewed": true
  },
  {
    "position": 30,
    "recommendedRank": 47,
    "id": "netcup-500-g12",
    "provider": "netcup",
    "sourceUrl": "https://www.netcup.com/en/server/vps/vps-500-g12-iv-12m",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €5.91. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).",
    "hardware": {
      "vcpu": 2,
      "ramGb": 4,
      "diskGb": 128,
      "diskKind": "NVMe",
      "cpuKind": "2 vCore KVM AMD EPYC G12"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "DE",
      "AT",
      "NL",
      "US"
    ],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 31,
    "recommendedRank": 49,
    "id": "cherry-servers-c-vps-2-g2",
    "provider": "Cherry Servers",
    "sourceUrl": "https://www.cherryservers.com/pricing",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR monthly as sold/tested publicly 2025-06 to 2026-06 (VPSBenchmarks). Confirm in Cherry console. Official site only publishes from $0.018/hr.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 40,
      "diskKind": "SSD",
      "cpuKind": "shared cloud VPS"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "LT"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 32,
    "recommendedRank": 55,
    "id": "privex-privex-v1-se-ssd",
    "provider": "Privex",
    "sourceUrl": "https://pay.privex.io/order/choose-server-nojs",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD from official pay.privex.io/order/choose-server-nojs. Privex Inc. (Belize). Sign-up with alias + email; crypto in-house. No setup fee on these VPS SKUs.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 25,
      "diskKind": "SSD",
      "cpuKind": "KVM"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "SE"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 33,
    "recommendedRank": 64,
    "id": "dreamhost-dh-stack4",
    "provider": "DreamHost",
    "sourceUrl": "https://www.dreamhost.com/hosting/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Promo first 3 months $8.99/mo from official VPS page; auto-renews at $15.99/mo. Unmetered bandwidth (fair use). AMD EPYC + KVM.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 4,
      "diskGb": 75,
      "diskKind": "NVMe SSD",
      "cpuKind": "AMD EPYC shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": 15.99,
    "termsReviewed": true
  },
  {
    "position": 34,
    "recommendedRank": 65,
    "id": "flokinet-floki-ro-i",
    "provider": "FlokiNET",
    "sourceUrl": "https://flokinet.is/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official flokinet.is/vps/ Romania table (SSR). 1 Gbit uplink. 1 IPv4 & /64 IPv6. KVM. DDoS 1Tbps+. Iceland / Netherlands / Finland tabs exist; those prices are JS and were not in the fetched HTML so they were not invented.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 20,
      "diskKind": "NVMe",
      "cpuKind": "KVM"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [
      "RO"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 35,
    "recommendedRank": 72,
    "id": "cockbox-cb-hdd-ro-1",
    "provider": "Cockbox",
    "sourceUrl": "https://cockbox.org/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD from official cockbox.org on 2026-08-31. Tor-friendly; BTC/XMR. All listed VPS SKUs showed Sold Out on this fetch. 1 TB bandwidth.",
    "hardware": {
      "vcpu": 0.5,
      "ramGb": 1,
      "diskGb": 60,
      "diskKind": "HDD",
      "cpuKind": "KVM"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "RO"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 36,
    "recommendedRank": 98,
    "id": "20i-1-core",
    "provider": "20i",
    "sourceUrl": "https://www.20i.com/vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "GBP as shown on 20i.com/vps. Unlimited bandwidth. UK or US. Renewable-energy claim. 1 IPv4 included.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 25,
      "diskKind": "SSD",
      "cpuKind": "shared VPS"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "GB",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 37,
    "recommendedRank": 99,
    "id": "oracle-cloud-a1-flex-1-6",
    "provider": "Oracle Cloud",
    "sourceUrl": "https://www.oracle.com/cloud/compute/arm/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Paid Flex. Unit prices from oracle.com Ampere A1 page: $0.01/OCPU-hr + $0.0015/GB-hr all regions. Disk extra. Paid tenancies historically also get a free A1 allowance (docs still mention 3k OCPU-hrs for paid in some price-list copy; Always Free tenancy cap is 2/12 as of Aug 2026).",
    "hardware": {
      "vcpu": 1,
      "ramGb": 6,
      "diskGb": 50,
      "diskKind": "block extra",
      "cpuKind": "Ampere Altra ARM"
    },
    "ipv4Status": "extra",
    "transfer": "Not published",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 38,
    "recommendedRank": 116,
    "id": "atlantic-net-g3-2gb-win",
    "provider": "Atlantic.net",
    "sourceUrl": "https://www.atlantic.net/vps-hosting/windows-vps-hosting/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Official Windows VPS pricing table (monthly / hourly). Longer terms cheaper.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 50,
      "diskKind": "SSD",
      "cpuKind": "shared GP Windows"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [
      "US",
      "CA",
      "SG",
      "GB"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 39,
    "recommendedRank": 120,
    "id": "njalla-njalla-15",
    "provider": "Njalla",
    "sourceUrl": "https://njal.la/servers/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR. Official njal.la/pricing/ and njal.la/servers/. INCUS + Ceph. 1 IPv4 + 1 IPv6. SSH root. Outgoing SMTP blocked.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1.5,
      "diskGb": 15,
      "diskKind": "SSD",
      "cpuKind": "KVM/INCUS"
    },
    "ipv4Status": "included",
    "transfer": "1.5 TB",
    "locations": [
      "SE"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 40,
    "recommendedRank": 158,
    "id": "scalahosting-scala-b1",
    "provider": "ScalaHosting",
    "sourceUrl": "https://www.scalahosting.com/vps-hosting.html",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "12-month intro $29.95/mo from official managed cloud table; renews $54.95/mo. Fully managed SPanel. Monthly term is the higher renewal rate.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 4,
      "diskGb": 50,
      "diskKind": "NVMe",
      "cpuKind": "shared (scalable)"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US"
    ],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": 54.95,
    "termsReviewed": true
  },
  {
    "position": 41,
    "recommendedRank": 187,
    "id": "fastcomet-cloud-1",
    "provider": "FastComet",
    "sourceUrl": "https://www.fastcomet.com/vps-pricing",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Official vps-pricing: intro then regular. Cloud 1 mentioned as from $46.16/mo on same page footnote. Fully managed + cPanel. Intro from $46.16/mo (page footnote); regular often listed $65.95. Specs from companion public tables (1 vCPU/2GB/50GB/2TB).",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 50,
      "diskKind": "SSD/NVMe",
      "cpuKind": "shared managed"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [
      "US",
      "AU",
      "BR",
      "CA",
      "DE",
      "IN",
      "IT",
      "JP",
      "SG",
      "GB"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 42,
    "recommendedRank": 320,
    "id": "microsoft-azure-azure-b1s-free",
    "provider": "Microsoft Azure",
    "sourceUrl": "https://azure.microsoft.com/en-us/pricing/free-services/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "12-month free tier: 750 hours/month of B1s (Linux and Windows each advertised) on an Azure free account. Not always-free. OS disk, IPv4, and bandwidth can still bill. After 12 months, PAYG. Always-free Azure list does not include a VM.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": null,
      "diskKind": "OS disk billed separately",
      "cpuKind": "shared burstable"
    },
    "ipv4Status": "extra",
    "transfer": "Not published",
    "locations": [],
    "confidence": "medium",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 43,
    "recommendedRank": 322,
    "id": "aws-ec2-ec2-t3-micro-free",
    "provider": "AWS EC2",
    "sourceUrl": "https://aws.amazon.com/free/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "12-month free tier for accounts created before 2025-07-15: 750 h/mo t2.micro or t3.micro. Accounts on/after 2025-07-15: Free plan is up to $200 credits for 6 months (not a forever VM). Not always-free. EBS + public IPv4 can bill.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 1,
      "diskGb": null,
      "diskKind": "EBS billed separately",
      "cpuKind": "burstable shared"
    },
    "ipv4Status": "extra",
    "transfer": "Not published",
    "locations": [],
    "confidence": "medium",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 44,
    "recommendedRank": 5,
    "id": "racknerd-kvm-512",
    "provider": "RackNerd",
    "sourceUrl": "https://www.racknerd.com/kvm-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Standard KVM from racknerd.com/kvm-vps (monthly except 512MB yearly). RAID-10 SSD. 1 IPv4.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 0.5,
      "diskGb": 30,
      "diskKind": "RAID-10 SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "0.5 TB",
    "locations": [
      "US"
    ],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 45,
    "recommendedRank": 9,
    "id": "ramnode-lite-2gb",
    "provider": "RamNode",
    "sourceUrl": "https://ramnode.com/products/cloud-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Lite Cloud: IPv6; +$2/mo IPv4.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 20,
      "diskKind": "NVMe",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "extra",
    "transfer": "0.5 TB",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 46,
    "recommendedRank": 10,
    "id": "racknerd-special-2gb",
    "provider": "RackNerd",
    "sourceUrl": "https://www.racknerd.com/specials/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). Lifetime lock typically on continuous renewal.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 35,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "5 TB",
    "locations": [],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": true
  },
  {
    "position": 47,
    "recommendedRank": 14,
    "id": "time4vps-linux-1",
    "provider": "Time4VPS",
    "sourceUrl": "https://www.time4vps.com/linux-vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR. Official linux-vps page: list / intro / renewal. Linux 1 has no discount. Lithuania. Optional backups/NVMe add-ons. List €2.99/mo; renews €2.99/mo.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 10,
      "diskKind": "SSD",
      "cpuKind": "KVM 2.6 GHz"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "LT"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": 2.99,
    "termsReviewed": true
  },
  {
    "position": 48,
    "recommendedRank": 17,
    "id": "buyvm-slice-1024",
    "provider": "BuyVM",
    "sourceUrl": "https://buyvm.net/kvm-dedicated-server-slices/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Las Vegas, New York, Luxembourg. Unmetered bandwidth. DirectAdmin included. SLICE 512 billed yearly only.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 20,
      "diskKind": "SSD",
      "cpuKind": "fair-share 3.50+ GHz"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "LU"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 49,
    "recommendedRank": 20,
    "id": "ramnode-std-0.5gb",
    "provider": "RamNode",
    "sourceUrl": "https://ramnode.com/products/cloud-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Official Standard Cloud VPS table. Hourly. 1 IPv4 included on Standard. Lite Cloud is IPv6 +$2 for IPv4.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 0.5,
      "diskGb": 20,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 50,
    "recommendedRank": 22,
    "id": "hostkey-hostkey-nano",
    "provider": "HOSTKEY",
    "sourceUrl": "https://hostkey.com/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official hostkey.com/vps/ library. 1 Gbit/s, 3 TB included. Skip GPU SKUs.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 60,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [
      "NL",
      "FI",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 51,
    "recommendedRank": 24,
    "id": "alphavps-alpha-c4g",
    "provider": "AlphaVPS",
    "sourceUrl": "https://alphavps.com/cheap-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official alphavps.com/cheap-vps. Monthly €3.99; annual billed €3.39/mo (€40.7/yr), flat at renewal. Xeon Scalable KVM. 14-day money-back.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 4,
      "diskGb": 40,
      "diskKind": "NVMe RAID-10",
      "cpuKind": "Xeon Scalable shared"
    },
    "ipv4Status": "included",
    "transfer": "5 TB",
    "locations": [
      "DE",
      "GB",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 52,
    "recommendedRank": 27,
    "id": "webdock-advanced",
    "provider": "Webdock",
    "sourceUrl": "https://webdock.io/en/pricing",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR month-to-month. Featured bundles on pricing page. Custom VPS from €4.30 (CPU €1.60, RAM €0.60/GB, disk €0.10/GB). DK-DC1 Denmark. IPv4 included. Overage €2.50/TB.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 15,
      "diskKind": "NVMe",
      "cpuKind": "EPYC Milan+"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "DK"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 53,
    "recommendedRank": 32,
    "id": "racknerd-special-4gb",
    "provider": "RackNerd",
    "sourceUrl": "https://www.racknerd.com/specials/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). Lifetime lock typically on continuous renewal.",
    "hardware": {
      "vcpu": 3,
      "ramGb": 4,
      "diskGb": 60,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "7 TB",
    "locations": [],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": true
  },
  {
    "position": 54,
    "recommendedRank": 33,
    "id": "ramnode-std-1gb",
    "provider": "RamNode",
    "sourceUrl": "https://ramnode.com/products/cloud-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Official Standard Cloud VPS table. Hourly. 1 IPv4 included on Standard. Lite Cloud is IPv6 +$2 for IPv4.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 40,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 55,
    "recommendedRank": 34,
    "id": "time4vps-linux-4",
    "provider": "Time4VPS",
    "sourceUrl": "https://www.time4vps.com/linux-vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR. Official linux-vps page: list / intro / renewal. Linux 1 has no discount. Lithuania. Optional backups/NVMe add-ons. List €12.99/mo; renews €8.76/mo.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 4,
      "diskGb": 50,
      "diskKind": "SSD",
      "cpuKind": "KVM 2.6 GHz"
    },
    "ipv4Status": "included",
    "transfer": "8 TB",
    "locations": [
      "LT"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": 8.76,
    "termsReviewed": true
  },
  {
    "position": 56,
    "recommendedRank": 37,
    "id": "alphavps-alpha-c6g",
    "provider": "AlphaVPS",
    "sourceUrl": "https://alphavps.com/cheap-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official alphavps.com/cheap-vps. Monthly €4.99; annual billed €4.24/mo (€50.9/yr), flat at renewal. Xeon Scalable KVM. 14-day money-back.",
    "hardware": {
      "vcpu": 3,
      "ramGb": 6,
      "diskGb": 55,
      "diskKind": "NVMe RAID-10",
      "cpuKind": "Xeon Scalable shared"
    },
    "ipv4Status": "included",
    "transfer": "6 TB",
    "locations": [
      "DE",
      "GB",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 57,
    "recommendedRank": 40,
    "id": "digitalocean-basic-1gb",
    "provider": "DigitalOcean",
    "sourceUrl": "https://www.digitalocean.com/pricing/droplets",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Per-second billing (min 60s/$0.01) since 2026-01-01; monthly cap 672h. Regular CPU option as shown on pricing page. IPv4 included on bundled plans. Skip: v5 a-la-carte, GPU Droplets.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 25,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "US",
      "AU",
      "CA",
      "DE",
      "IN",
      "NL",
      "SG",
      "GB"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 58,
    "recommendedRank": 42,
    "id": "greencloudvps-gcvps-ssdkvm-1",
    "provider": "GreenCloudVPS",
    "sourceUrl": "https://green.cloud/budget-kvm-vps.php",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Official green.cloud/budget-kvm-vps.php. APAC bandwidth 750 GB. 10 Gbps port. Linux. Addons $3/GB RAM, $3/core, $3/10GB SSD.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 15,
      "diskKind": "SSD",
      "cpuKind": "1 core KVM"
    },
    "ipv4Status": "included",
    "transfer": "1.5 TB",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 59,
    "recommendedRank": 43,
    "id": "ionos-vps-l-plus",
    "provider": "IONOS",
    "sourceUrl": "https://www.ionos.com/servers/vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Intro 3 months with 1-year term, then regular monthly. Unlimited traffic. US/UK/DE/ES. IPv4 included. After intro: $21/mo.",
    "hardware": {
      "vcpu": 4,
      "ramGb": 8,
      "diskGb": 240,
      "diskKind": "NVMe",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "DE",
      "ES",
      "GB"
    ],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": 21,
    "termsReviewed": true
  },
  {
    "position": 60,
    "recommendedRank": 44,
    "id": "google-cloud-e2-micro",
    "provider": "Google Cloud",
    "sourceUrl": "https://cloud.google.com/products/compute/pricing/general-purpose",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD on-demand Default rate, Iowa (us-central1) as listed on official General Purpose VM pricing. Persistent disk extra. e2-micro Always Free in us-west1/us-central1/us-east1 until monthly hour cap. Cutoff: E2 shared-core + E2 standard 2–32 + f1-micro; not the full N4/C4 matrix.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 1,
      "diskGb": null,
      "diskKind": "persistent disk extra",
      "cpuKind": "shared E2"
    },
    "ipv4Status": "extra",
    "transfer": "Not published",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 61,
    "recommendedRank": 48,
    "id": "namecheap-pulsar",
    "provider": "Namecheap",
    "sourceUrl": "https://www.namecheap.com/hosting/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Five plan names confirmed on Namecheap KB (updated 2026-04-06). Numeric prices from 2026 public checkout roundups (official VPS HTML 403 on fetch). Yearly intro / renewal. UNVERIFIED if you need pixel-perfect checkout. Renewal ~$106.56/yr.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 40,
      "diskKind": "SSD RAID 10",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 62,
    "recommendedRank": 50,
    "id": "upcloud-starter-1xcpu-2gb",
    "provider": "UpCloud",
    "sourceUrl": "https://upcloud.com/products/cloud-servers/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR excl tax. Hourly billed, capped 28 days/month. IPv4 included on Starter. Zero-cost egress with fair-use. 1GB plan max 5 concurrent per customer. USD prices also published ($3.5 for 1GB).",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 20,
      "diskKind": "MaxIOPS",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "AU"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 63,
    "recommendedRank": 51,
    "id": "leaseweb-vps-1-us",
    "provider": "Leaseweb",
    "sourceUrl": "https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "New-contract prices from 1 Aug 2026, official Leaseweb blog. EUR for NL/DE. USD US-region also published. Specs for VPS 1/2/3/5 from public VPSBenchmarks plan sheet (4c/6GB/100GB etc.). VPS 4/6 specs UNVERIFIED.",
    "hardware": {
      "vcpu": 4,
      "ramGb": 6,
      "diskGb": 100,
      "diskKind": "SSD",
      "cpuKind": "shared VPS"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 64,
    "recommendedRank": 52,
    "id": "aws-lightsail-ls-gp-micro-v4",
    "provider": "AWS Lightsail",
    "sourceUrl": "https://aws.amazon.com/lightsail/pricing/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Linux/Unix bundles with public IPv4. Hourly up to monthly cap. APAC Mumbai/Sydney/Jakarta/Malaysia/HK and Sao Paulo get half the transfer. Skip Windows and IPv6-only (IPv6-only GP starts $3.50). Cutoff: Lightsail VM bundles only (not containers/DBs).",
    "hardware": {
      "vcpu": 2,
      "ramGb": 1,
      "diskGb": 40,
      "diskKind": "SSD",
      "cpuKind": "burstable/shared (GP) or dedicated-class (MO/CO)"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 65,
    "recommendedRank": 53,
    "id": "buyvm-slice-2048",
    "provider": "BuyVM",
    "sourceUrl": "https://buyvm.net/kvm-dedicated-server-slices/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Las Vegas, New York, Luxembourg. Unmetered bandwidth. DirectAdmin included. SLICE 512 billed yearly only.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 40,
      "diskKind": "SSD",
      "cpuKind": "fair-share 3.50+ GHz"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "LU"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 66,
    "recommendedRank": 54,
    "id": "hostkey-hostkey-mini",
    "provider": "HOSTKEY",
    "sourceUrl": "https://hostkey.com/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official hostkey.com/vps/ library. 1 Gbit/s, 3 TB included. Skip GPU SKUs.",
    "hardware": {
      "vcpu": 4,
      "ramGb": 6,
      "diskGb": 120,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [
      "NL",
      "FI",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 67,
    "recommendedRank": 56,
    "id": "racknerd-special-6gb",
    "provider": "RackNerd",
    "sourceUrl": "https://www.racknerd.com/specials/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). KVM/SolusVM, 1 Gbps, 1 IPv4. Lifetime lock typically on continuous renewal.",
    "hardware": {
      "vcpu": 6,
      "ramGb": 6,
      "diskGb": 100,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "12 TB",
    "locations": [],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": true
  },
  {
    "position": 68,
    "recommendedRank": 57,
    "id": "alphavps-alpha-c8g",
    "provider": "AlphaVPS",
    "sourceUrl": "https://alphavps.com/cheap-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official alphavps.com/cheap-vps. Monthly €6.49; annual billed €5.52/mo (€66.2/yr), flat at renewal. Xeon Scalable KVM. 14-day money-back.",
    "hardware": {
      "vcpu": 4,
      "ramGb": 8,
      "diskGb": 75,
      "diskKind": "NVMe RAID-10",
      "cpuKind": "Xeon Scalable shared"
    },
    "ipv4Status": "included",
    "transfer": "8 TB",
    "locations": [
      "DE",
      "GB",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 69,
    "recommendedRank": 58,
    "id": "scaleway-dev1-s",
    "provider": "Scaleway",
    "sourceUrl": "https://www.scaleway.com/en/pricing/virtual-instances/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR before tax, PAR-1. Approx monthly as published (~730h). Storage and public IPv4 billed separately; egress+IPv6 in list price. Cutoff: Development (PLAY2/DEV1/STARDUST) + PRO2 + GP1 + BASIC3. Skip POP2/BASIC2/STANDARD2/STANDARD3/COMPUTE3/MEMORY3 (older or specialized matrix).",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": null,
      "diskKind": "block/local extra",
      "cpuKind": "shared"
    },
    "ipv4Status": "extra",
    "transfer": "Not published",
    "locations": [
      "FR",
      "NL",
      "PL"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 70,
    "recommendedRank": 59,
    "id": "time4vps-linux-8",
    "provider": "Time4VPS",
    "sourceUrl": "https://www.time4vps.com/linux-vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR. Official linux-vps page: list / intro / renewal. Linux 1 has no discount. Lithuania. Optional backups/NVMe add-ons. List €19.99/mo; renews €14.24/mo.",
    "hardware": {
      "vcpu": 3,
      "ramGb": 8,
      "diskGb": 100,
      "diskKind": "SSD",
      "cpuKind": "KVM 2.6 GHz"
    },
    "ipv4Status": "included",
    "transfer": "16 TB",
    "locations": [
      "LT"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": 14.24,
    "termsReviewed": true
  },
  {
    "position": 71,
    "recommendedRank": 60,
    "id": "ovhcloud-vps-2",
    "provider": "OVHcloud",
    "sourceUrl": "https://www.ovhcloud.com/en/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Advertised 'from' monthly on OVHcloud EN VPS page (VPS 2027 range). Unlimited traffic except APAC quota (VPS-1 500GB, VPS-2/3 1TB, VPS-4 3TB then cap 10Mbps). Daily backup included. IPv4 included. Bandwidth field: unlimited*.",
    "hardware": {
      "vcpu": 4,
      "ramGb": 8,
      "diskGb": 75,
      "diskKind": "NVMe",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 72,
    "recommendedRank": 61,
    "id": "contabo-cloud-vps-6",
    "provider": "Contabo",
    "sourceUrl": "https://www.contabo.com/en/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).",
    "hardware": {
      "vcpu": 6,
      "ramGb": 12,
      "diskGb": 200,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "DE",
      "AU",
      "JP",
      "SG",
      "GB",
      "US"
    ],
    "confidence": "high",
    "termMonths": 24,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 73,
    "recommendedRank": 62,
    "id": "hostinger-kvm-2",
    "provider": "Hostinger",
    "sourceUrl": "https://www.hostinger.com/vps-hosting",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Intro price for current promo; renews at higher rate for 2 years (listed). Cancel anytime. NVMe. Regular/renewal $14.99/mo. Crossed-out list also shown ($...).",
    "hardware": {
      "vcpu": 2,
      "ramGb": 8,
      "diskGb": 100,
      "diskKind": "NVMe",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "8 TB",
    "locations": [],
    "confidence": "high",
    "termMonths": 24,
    "renewalMonthly": 14.99,
    "termsReviewed": true
  },
  {
    "position": 74,
    "recommendedRank": 63,
    "id": "hostsailor-hs-sailor-nvme",
    "provider": "HostSailor",
    "sourceUrl": "https://hostsailor.com/kvm-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD monthly from official clients.hostsailor.com/index.php?rp=/store/kvm-vps-nvme (also listed on hostsailor.com/kvm-vps). Netherlands NVMe KVM. 1 Gbit. 1 IPv4 + /64 IPv6. Yearly listed as 12× monthly. Dubai-registered; NL/RO DCs. Crypto accepted.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 50,
      "diskKind": "NVMe",
      "cpuKind": "KVM AMD EPYC"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [
      "NL"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 75,
    "recommendedRank": 66,
    "id": "clouding-io-clouding-2gb",
    "provider": "Clouding.io",
    "sourceUrl": "https://clouding.io/en/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR. Hourly 0.011€, monthly cap 8€ from official clouding.io/en. 4 TB transfer then 0.004€/GB.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 30,
      "diskKind": "NVMe",
      "cpuKind": "1 vCore KVM"
    },
    "ipv4Status": "included",
    "transfer": "4 TB",
    "locations": [
      "ES"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 76,
    "recommendedRank": 67,
    "id": "upcloud-starter-2xcpu-2gb",
    "provider": "UpCloud",
    "sourceUrl": "https://upcloud.com/products/cloud-servers/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR excl tax. Hourly billed, capped 28 days/month. IPv4 included on Starter. Zero-cost egress with fair-use. 1GB plan max 5 concurrent per customer. USD prices also published ($3.5 for 1GB).",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 30,
      "diskKind": "MaxIOPS",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "AU"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 77,
    "recommendedRank": 68,
    "id": "hostkey-hostkey-v3-pico",
    "provider": "HOSTKEY",
    "sourceUrl": "https://hostkey.com/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official hostkey.com/vps/ library. 1 Gbit/s, 3 TB included. Skip GPU SKUs.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 40,
      "diskKind": "NVMe",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [
      "NL",
      "FI",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 78,
    "recommendedRank": 69,
    "id": "ssd-nodes-kvm-medium",
    "provider": "SSD Nodes",
    "sourceUrl": "https://www.ssdnodes.com/pricing/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.",
    "hardware": {
      "vcpu": 4,
      "ramGb": 16,
      "diskGb": 320,
      "diskKind": "SSD",
      "cpuKind": "Intel Xeon Silver"
    },
    "ipv4Status": "included",
    "transfer": "8 TB",
    "locations": [],
    "confidence": "medium",
    "termMonths": 36,
    "renewalMonthly": null,
    "termsReviewed": true
  },
  {
    "position": 79,
    "recommendedRank": 70,
    "id": "hostwinds-ul-2",
    "provider": "Hostwinds",
    "sourceUrl": "https://www.hostwinds.com/unmanaged-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD unmanaged Linux. 1c/1GB $4.99 from public 2026 plan listings (hostwinds.com/vps is JS). Higher unmanaged tiers from the same public table. Same public table; treat as advertised unmanaged Linux line.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 50,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "NL"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 80,
    "recommendedRank": 71,
    "id": "knownhost-entry-plus",
    "provider": "KnownHost",
    "sourceUrl": "https://www.knownhost.com/unmanaged-vps.html",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD starting-at unmanaged NVMe. ATL/SEA/AMS. 2 IPv4 included. Managed VPS is a separate higher line from $43.25.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 50,
      "diskKind": "NVMe",
      "cpuKind": "dedicated resources (unmanaged)"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [
      "US",
      "NL"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 81,
    "recommendedRank": 73,
    "id": "greencloudvps-gcvps-ryzenkvm-2",
    "provider": "GreenCloudVPS",
    "sourceUrl": "https://green.cloud/ryzen-kvm-vps.php",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Official green.cloud/ryzen-kvm-vps.php USA/EU table.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 30,
      "diskKind": "NVMe",
      "cpuKind": "1 core Ryzen 3.5+ GHz"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 82,
    "recommendedRank": 74,
    "id": "greencloudvps-gcvps-ssdkvm-2",
    "provider": "GreenCloudVPS",
    "sourceUrl": "https://green.cloud/budget-kvm-vps.php",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Official green.cloud/budget-kvm-vps.php. APAC bandwidth 1 TB. 10 Gbps port.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 15,
      "diskKind": "SSD",
      "cpuKind": "1 core KVM"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 83,
    "recommendedRank": 75,
    "id": "racknerd-special-8gb",
    "provider": "RackNerd",
    "sourceUrl": "https://www.racknerd.com/specials/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). KVM/SolusVM, 1 Gbps, 1 IPv4. Lifetime lock typically on continuous renewal.",
    "hardware": {
      "vcpu": 7,
      "ramGb": 8,
      "diskGb": 150,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "20 TB",
    "locations": [],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": true
  },
  {
    "position": 84,
    "recommendedRank": 76,
    "id": "ramnode-std-2gb",
    "provider": "RamNode",
    "sourceUrl": "https://ramnode.com/products/cloud-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Official Standard Cloud VPS table. Hourly. 1 IPv4 included on Standard. Lite Cloud is IPv6 +$2 for IPv4.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 80,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "4 TB",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 85,
    "recommendedRank": 77,
    "id": "privex-privex-v1-se-nvme",
    "provider": "Privex",
    "sourceUrl": "https://pay.privex.io/order/choose-server-nojs",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD from official pay.privex.io/order/choose-server-nojs. Privex Inc. (Belize). Sign-up with alias + email; crypto in-house. No setup fee on these VPS SKUs.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 1,
      "diskGb": 20,
      "diskKind": "NVMe",
      "cpuKind": "KVM"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "SE"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 86,
    "recommendedRank": 78,
    "id": "privex-privex-v2-se-ssd",
    "provider": "Privex",
    "sourceUrl": "https://pay.privex.io/order/choose-server-nojs",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD from official pay.privex.io/order/choose-server-nojs. Privex Inc. (Belize). Sign-up with alias + email; crypto in-house. No setup fee on these VPS SKUs.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 35,
      "diskKind": "SSD",
      "cpuKind": "KVM"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [
      "SE"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 87,
    "recommendedRank": 79,
    "id": "hostkey-hostkey-v3-nano",
    "provider": "HOSTKEY",
    "sourceUrl": "https://hostkey.com/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official hostkey.com/vps/ library. 1 Gbit/s, 3 TB included. Skip GPU SKUs.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 4,
      "diskGb": 60,
      "diskKind": "NVMe",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [
      "NL",
      "FI",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 88,
    "recommendedRank": 80,
    "id": "alphavps-alpha-c12g",
    "provider": "AlphaVPS",
    "sourceUrl": "https://alphavps.com/cheap-vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR from official alphavps.com/cheap-vps. Monthly €8.99; annual billed €7.64/mo (€91.7/yr), flat at renewal. Xeon Scalable KVM. 14-day money-back.",
    "hardware": {
      "vcpu": 4,
      "ramGb": 12,
      "diskGb": 100,
      "diskKind": "NVMe RAID-10",
      "cpuKind": "Xeon Scalable shared"
    },
    "ipv4Status": "included",
    "transfer": "10 TB",
    "locations": [
      "DE",
      "GB",
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 89,
    "recommendedRank": 81,
    "id": "leaseweb-vps-2-eu",
    "provider": "Leaseweb",
    "sourceUrl": "https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "New-contract prices from 1 Aug 2026, official Leaseweb blog. EUR for NL/DE. USD US-region also published. Specs for VPS 1/2/3/5 from public VPSBenchmarks plan sheet (4c/6GB/100GB etc.). VPS 4/6 specs UNVERIFIED.",
    "hardware": {
      "vcpu": 6,
      "ramGb": 16,
      "diskGb": 200,
      "diskKind": "SSD",
      "cpuKind": "shared VPS"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "NL",
      "DE"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 90,
    "recommendedRank": 82,
    "id": "cherry-servers-c-vps-4-g2",
    "provider": "Cherry Servers",
    "sourceUrl": "https://www.cherryservers.com/pricing",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR monthly as sold/tested publicly 2025-06 to 2026-06 (VPSBenchmarks). Confirm in Cherry console. Official site only publishes from $0.018/hr.",
    "hardware": {
      "vcpu": 4,
      "ramGb": 4,
      "diskGb": 80,
      "diskKind": "SSD",
      "cpuKind": "shared cloud VPS"
    },
    "ipv4Status": "included",
    "transfer": "1 TB",
    "locations": [
      "LT"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 91,
    "recommendedRank": 83,
    "id": "leaseweb-vps-2-us",
    "provider": "Leaseweb",
    "sourceUrl": "https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "New-contract prices from 1 Aug 2026, official Leaseweb blog. EUR for NL/DE. USD US-region also published. Specs for VPS 1/2/3/5 from public VPSBenchmarks plan sheet (4c/6GB/100GB etc.). VPS 4/6 specs UNVERIFIED.",
    "hardware": {
      "vcpu": 6,
      "ramGb": 16,
      "diskGb": 200,
      "diskKind": "SSD",
      "cpuKind": "shared VPS"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 92,
    "recommendedRank": 84,
    "id": "liquid-web-lw-2g",
    "provider": "Liquid Web",
    "sourceUrl": "https://www.liquidweb.com/pricing/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD from official liquidweb.com/pricing/ Cloud VPS table (regular starting-at, not the 50%-off-2-months promo). Some SKUs show a 50% intro for 2 months — listed here at the regular rate.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 60,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": 11,
    "termsReviewed": true
  },
  {
    "position": 93,
    "recommendedRank": 85,
    "id": "ionos-vps-xl-plus",
    "provider": "IONOS",
    "sourceUrl": "https://www.ionos.com/servers/vps",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Intro 3 months with 1-year term, then regular monthly. Unlimited traffic. US/UK/DE/ES. IPv4 included. After intro: $44/mo.",
    "hardware": {
      "vcpu": 8,
      "ramGb": 16,
      "diskGb": 480,
      "diskKind": "NVMe",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "DE",
      "ES",
      "GB"
    ],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": 44,
    "termsReviewed": true
  },
  {
    "position": 94,
    "recommendedRank": 86,
    "id": "ssd-nodes-kvm-2xl",
    "provider": "SSD Nodes",
    "sourceUrl": "https://www.ssdnodes.com/pricing/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.",
    "hardware": {
      "vcpu": 8,
      "ramGb": 32,
      "diskGb": 480,
      "diskKind": "SSD",
      "cpuKind": "Intel Xeon Silver"
    },
    "ipv4Status": "included",
    "transfer": "16 TB",
    "locations": [],
    "confidence": "medium",
    "termMonths": 36,
    "renewalMonthly": null,
    "termsReviewed": true
  },
  {
    "position": 95,
    "recommendedRank": 87,
    "id": "upcloud-starter-1xcpu-4gb",
    "provider": "UpCloud",
    "sourceUrl": "https://upcloud.com/products/cloud-servers/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR excl tax. Hourly billed, capped 28 days/month. IPv4 included on Starter. Zero-cost egress with fair-use. 1GB plan max 5 concurrent per customer. USD prices also published ($3.5 for 1GB).",
    "hardware": {
      "vcpu": 1,
      "ramGb": 4,
      "diskGb": 30,
      "diskKind": "MaxIOPS",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "US",
      "AU"
    ],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 96,
    "recommendedRank": 88,
    "id": "interserver-4-slices",
    "provider": "InterServer",
    "sourceUrl": "https://www.interserver.net/vps/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Official slice examples on interserver.net/vps (2026-08-31): 1 slice $3/mo 1c/2GB/40GB/2TB; 4 slices $12/mo 2c/8GB/160GB/8TB. Full order flow 1–32 slices. Price-lock advertised. Secaucus NJ typical.",
    "hardware": {
      "vcpu": 2,
      "ramGb": 8,
      "diskGb": 160,
      "diskKind": "SSD",
      "cpuKind": "shared KVM"
    },
    "ipv4Status": "included",
    "transfer": "8 TB",
    "locations": [
      "US"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 97,
    "recommendedRank": 89,
    "id": "digitalocean-basic-2gb",
    "provider": "DigitalOcean",
    "sourceUrl": "https://www.digitalocean.com/pricing/droplets",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Per-second billing (min 60s/$0.01) since 2026-01-01; monthly cap 672h. Regular CPU option as shown on pricing page. IPv4 included on bundled plans. Skip: v5 a-la-carte, GPU Droplets.",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 50,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [
      "US",
      "AU",
      "CA",
      "DE",
      "IN",
      "NL",
      "SG",
      "GB"
    ],
    "confidence": "high",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 98,
    "recommendedRank": 90,
    "id": "aws-lightsail-ls-gp-small-v4",
    "provider": "AWS Lightsail",
    "sourceUrl": "https://aws.amazon.com/lightsail/pricing/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "USD. Linux/Unix bundles with public IPv4. Hourly up to monthly cap. APAC Mumbai/Sydney/Jakarta/Malaysia/HK and Sao Paulo get half the transfer. Skip Windows and IPv6-only (IPv6-only GP starts $3.50). Cutoff: Lightsail VM bundles only (not containers/DBs).",
    "hardware": {
      "vcpu": 2,
      "ramGb": 2,
      "diskGb": 60,
      "diskKind": "SSD",
      "cpuKind": "burstable/shared (GP) or dedicated-class (MO/CO)"
    },
    "ipv4Status": "included",
    "transfer": "3 TB",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 99,
    "recommendedRank": 91,
    "id": "akamai-linode-g6-standard-1",
    "provider": "Akamai Linode",
    "sourceUrl": "https://www.linode.com/pricing/",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "Hourly billed, monthly cap except G8/GPU (excluded). Transfer pooled. Official types from api.linode.com/v4/linode/types. Cutoff: skip GPU, accelerated, G8 (true hourly, no monthly cap since 2026-07-01).",
    "hardware": {
      "vcpu": 1,
      "ramGb": 2,
      "diskGb": 50,
      "diskKind": "SSD",
      "cpuKind": "shared"
    },
    "ipv4Status": "included",
    "transfer": "2 TB",
    "locations": [],
    "confidence": "medium",
    "termMonths": 1,
    "renewalMonthly": null,
    "termsReviewed": false
  },
  {
    "position": 100,
    "recommendedRank": 92,
    "id": "netcup-vps-1000-g12",
    "provider": "netcup",
    "sourceUrl": "https://www.netcup.com/en/server/vps/vps-1000-g12-iv-12m",
    "checkedAt": "2026-08-31T00:00:00.000Z",
    "billing": "EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €10.36. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).",
    "hardware": {
      "vcpu": 4,
      "ramGb": 8,
      "diskGb": 256,
      "diskKind": "NVMe",
      "cpuKind": "4 vCore KVM AMD EPYC G12"
    },
    "ipv4Status": "included",
    "transfer": "Not published",
    "locations": [
      "DE",
      "AT",
      "NL",
      "US"
    ],
    "confidence": "high",
    "termMonths": 12,
    "renewalMonthly": null,
    "termsReviewed": false
  }
]
```

## Batch 1 — queue positions 1–20

Stop-slop review: each catch names a stored cost or limit; each nonempty fit names a workload and numeric hardware facts. No benchmark, flat-renewal assumption, backup inclusion, management flag or GPU count is invented. Alibaba’s fit stays empty because CPU, RAM and disk are unverified. Alibaba and the two 0.5 GB plans have no workload tag: missing specs and sub-floor RAM cannot be hidden under `other`, whose floor is 2 GB. Monetary catches are dated snapshot statements, not live checkout quotes.

### 1. scaleway-stardust1-s (recommended rank 1)

- Catch: Storage and public IPv4 are billed separately from the instance rate.
- Fit: A small VPN has 1 vCPU and 1 GB RAM to work with; storage needs a separate budget.
- Niches: vpn
- Catch evidence: https://www.scaleway.com/en/pricing/virtual-instances/; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: EUR before tax, PAR-1. Approx monthly as published (~730h). Storage and public IPv4 billed separately; egress+IPv6 in list price. Cutoff: Development (PLAY2/DEV1/STARDUST) + PRO2 + GP1 + BASIC3. Skip POP2/BASIC2/STANDARD2/STANDARD3/COMPUTE3/MEMORY3 (older or specialized matrix).
- Fit evidence: https://www.scaleway.com/en/pricing/virtual-instances/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 2. racknerd-special-1gb (recommended rank 2)

- Catch: The promotional rate uses yearly billing, and the renewal amount is not verified.
- Fit: One vCPU and 1 GB RAM suit a small VPN without a control panel.
- Niches: vpn
- Catch evidence: https://www.racknerd.com/specials/; offer.billing, termMonths=12 and renewalMonthly=null, snapshot checked 2026-08-31. Verified billing excerpt: "Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31)." The separate hedged lifetime-lock wording is not used as a renewal claim.
- Fit evidence: https://www.racknerd.com/specials/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 20 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 3. ramnode-lite-1gb (recommended rank 3)

- Catch: Public IPv4 adds $2/month to the IPv6-only Lite rate.
- Fit: With 1 vCPU and 1 GB RAM, this is a starting point for a small VPN.
- Niches: vpn
- Catch evidence: https://ramnode.com/products/cloud-vps; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: Lite Cloud: IPv6; +$2/mo IPv4.
- Fit evidence: https://ramnode.com/products/cloud-vps; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 15 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 4. buyvm-slice-512 (recommended rank 4)

- Catch: The 512 MB Slice is billed yearly only.
- Fit: A minimal Linux test box gets 1 vCPU and 0.5 GB RAM; this is below the catalog’s 1 GB VPN floor.
- Niches: none — below every named workload floor.
- Catch evidence: https://buyvm.net/kvm-dedicated-server-slices/; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: USD. Las Vegas, New York, Luxembourg. Unmetered bandwidth. DirectAdmin included. SLICE 512 billed yearly only.
- Fit evidence: https://buyvm.net/kvm-dedicated-server-slices/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 0.5 GB RAM, 10 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 5. webdock-essential (recommended rank 6)

- Catch: Transfer over the included allowance costs €2.50/TB.
- Fit: A small WordPress site can use the 2 GB RAM and 15 GB disk; leave space for updates.
- Niches: wordpress
- Catch evidence: https://webdock.io/en/pricing; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: EUR month-to-month. Featured bundles on pricing page. Custom VPS from €4.30 (CPU €1.60, RAM €0.60/GB, disk €0.10/GB). DK-DC1 Denmark. IPv4 included. Overage €2.50/TB.
- Fit evidence: https://webdock.io/en/pricing; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 15 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 6. alibaba-cloud-aliyun-ssd-starter (recommended rank 7)

- Catch: The $2.50 starter rate is a new-user promotion, not an always-free tier.
- Fit: Empty — source hardware is unverified.
- Niches: none — hardware unverified.
- Catch evidence: https://www.alibabacloud.com/starter-packages/general; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: USD from official alibabacloud.com/product/ecs/pricing starter package ('SSD Cloud server and data transfer for only $2.50 a month'). Full ECS SKU specs UNVERIFIED. Promo/new-user — not always-free. Provider URL checked 2026-10-03 now redirects to https://www.alibabacloud.com/en/product/swas?_p_lc=1 (Simple Application Server, from $3.50/month), not an identifiable $2.50 ECS starter SKU. No hardware or current price is borrowed from that different product. Owner must resolve identity before publication.
- Fit evidence: Not asserted.
- Publication: draft only; owner review pending.

### 7. interserver-1-slice (recommended rank 8)

- Catch: Monthly transfer is capped at 2 TB.
- Fit: A small WordPress site gets 2 GB RAM and 40 GB disk for the OS and uploads.
- Niches: wordpress
- Catch evidence: https://www.interserver.net/vps/; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: USD. Official slice examples on interserver.net/vps (2026-08-31): 1 slice $3/mo 1c/2GB/40GB/2TB; 4 slices $12/mo 2c/8GB/160GB/8TB. Full order flow 1–32 slices. Price-lock advertised. Secaucus NJ typical.
- Fit evidence: https://www.interserver.net/vps/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 40 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 8. time4vps-linux-2 (recommended rank 11)

- Catch: The reviewed renewal is €5.77/month, not the introductory rate.
- Fit: A small WordPress site gets 2 GB RAM and 25 GB disk; media storage needs a budget.
- Niches: wordpress
- Catch evidence: https://www.time4vps.com/linux-vps/; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: EUR. Official linux-vps page: list / intro / renewal. Linux 1 has no discount. Lithuania. Optional backups/NVMe add-ons. List €7.99/mo; renews €5.77/mo. Source-page fetch attempted 2026-10-03 returned HTTP 403. No current-page claim is made.
- Fit evidence: https://www.time4vps.com/linux-vps/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 25 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 9. hostkey-hostkey-pico (recommended rank 12)

- Catch: The included transfer allowance stops at 3 TB/month.
- Fit: A small VPN gets 1 vCPU, 1 GB RAM and 40 GB disk without needing a full web panel.
- Niches: vpn
- Catch evidence: https://hostkey.com/vps/; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: EUR from official hostkey.com/vps/ library. 1 Gbit/s, 3 TB included. Skip GPU SKUs.
- Fit evidence: https://hostkey.com/vps/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 40 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 10. alphavps-alpha-c2g (recommended rank 13)

- Catch: The €2.54/month option uses annual billing; monthly billing is €2.99.
- Fit: A small WordPress site gets 2 vCPU, 2 GB RAM and 30 GB disk.
- Niches: wordpress
- Catch evidence: https://alphavps.com/cheap-vps; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: EUR from official alphavps.com/cheap-vps. Monthly €2.99; annual billed €2.54/mo (€30.5/yr), flat at renewal. Xeon Scalable KVM. 14-day money-back.
- Fit evidence: https://alphavps.com/cheap-vps; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 30 GB NVMe RAID-10. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 11. clouding-io-clouding-1gb (recommended rank 15)

- Catch: Transfer above 4 TB costs €0.004/GB.
- Fit: A lightweight VPN has 1 GB RAM but only 0.5 vCPU, so CPU headroom is limited.
- Niches: vpn
- Catch evidence: https://clouding.io/en/; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: EUR. Hourly 0.004€, monthly cap 3€ from official clouding.io/en. 4 TB transfer then 0.004€/GB. Hourly billing, no monthly minimum. Fixed IPv4.
- Fit evidence: https://clouding.io/en/; offer specs row, snapshot checked 2026-08-31: 0.5 vCPU, 1 GB RAM, 5 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 12. upcloud-starter-1xcpu-1gb (recommended rank 16)

- Catch: The 1 GB Starter plan is limited to five concurrent instances per customer.
- Fit: One vCPU and 1 GB RAM fit a small VPN; the 10 GB disk calls for a lean installation.
- Niches: vpn
- Catch evidence: https://upcloud.com/products/cloud-servers/; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: EUR excl tax. Hourly billed, capped 28 days/month. IPv4 included on Starter. Zero-cost egress with fair-use. 1GB plan max 5 concurrent per customer. USD prices also published ($3.5 for 1GB).
- Fit evidence: https://upcloud.com/products/cloud-servers/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 10 GB MaxIOPS. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 13. namecheap-spark (recommended rank 18)

- Catch: The yearly term is 12 months, and the renewal price is not reviewed.
- Fit: A small VPN can use the 1 vCPU and 1 GB RAM; the 20 GB disk is for the OS and logs.
- Niches: vpn
- Catch evidence: https://www.namecheap.com/hosting/vps/; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: Five plan names confirmed on Namecheap KB (updated 2026-04-06). Numeric prices from 2026 public checkout roundups (official VPS HTML 403 on fetch). Yearly intro / renewal. UNVERIFIED if you need pixel-perfect checkout. Renewal ~$58.56/yr.
- Fit evidence: https://www.namecheap.com/hosting/vps/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 20 GB SSD RAID 10. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 14. digitalocean-basic-512mb (recommended rank 19)

- Catch: This tier includes only 0.5 GB RAM.
- Fit: For a minimal Linux test box, there is 1 vCPU and 0.5 GB RAM; the catalog’s VPN floor is 1 GB.
- Niches: none — below every named workload floor.
- Catch evidence: https://www.digitalocean.com/pricing/droplets; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: Per-second billing (min 60s/$0.01) since 2026-01-01; monthly cap 672h. Regular CPU option as shown on pricing page. IPv4 included on bundled plans. Skip: v5 a-la-carte, GPU Droplets.
- Fit evidence: https://www.digitalocean.com/pricing/droplets; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 0.5 GB RAM, 10 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 15. ionos-vps-m-plus (recommended rank 21)

- Catch: The $4/month intro ends after three months, then $11/month applies on the 12-month term.
- Fit: A small Docker stack gets 2 vCPU, 4 GB RAM and 120 GB NVMe storage.
- Niches: docker
- Catch evidence: https://www.ionos.com/servers/vps; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: USD. Intro 3 months with 1-year term, then regular monthly. Unlimited traffic. US/UK/DE/ES. IPv4 included. After intro: $11/mo. Provider page also checked 2026-10-03: M+ currently advertises $5/month for three months with $14/month regular pricing; these differ from the stored $4/$11 snapshot. Draft preserves the dated snapshot, not a current checkout quote; owner must review this disagreement before publication.
- Fit evidence: https://www.ionos.com/servers/vps; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 4 GB RAM, 120 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 16. ovhcloud-vps-1 (recommended rank 23)

- Catch: In APAC, VPS-1 transfer is capped at 500 GB before bandwidth drops to 10 Mbps.
- Fit: Two vCPU and 4 GB RAM support a small Docker stack within the 40 GB disk allowance.
- Niches: docker
- Catch evidence: https://www.ovhcloud.com/en/vps/; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: Advertised 'from' monthly on OVHcloud EN VPS page (VPS 2027 range). Unlimited traffic except APAC quota (VPS-1 500GB, VPS-2/3 1TB, VPS-4 3TB then cap 10Mbps). Daily backup included. IPv4 included. Bandwidth field: unlimited*.
- Fit evidence: https://www.ovhcloud.com/en/vps/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 4 GB RAM, 40 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 17. hostsailor-hs-mini-nvme (recommended rank 25)

- Catch: Monthly transfer is capped at 1 TB.
- Fit: A small VPN gets 1 vCPU, 1 GB RAM and 30 GB NVMe storage.
- Niches: vpn
- Catch evidence: https://hostsailor.com/kvm-vps; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: USD monthly from official clients.hostsailor.com/index.php?rp=/store/kvm-vps-nvme (also listed on hostsailor.com/kvm-vps). Netherlands NVMe KVM. 1 Gbit. 1 IPv4 + /64 IPv6. Yearly listed as 12× monthly. Dubai-registered; NL/RO DCs. Crypto accepted.
- Fit evidence: https://hostsailor.com/kvm-vps; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 30 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 18. hostwinds-ul-1 (recommended rank 26)

- Catch: The price is for unmanaged Linux, so server administration is your job.
- Fit: A small VPN has 1 vCPU and 1 GB RAM; the 30 GB SSD can hold the OS and logs.
- Niches: vpn
- Catch evidence: https://www.hostwinds.com/unmanaged-vps; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: USD unmanaged Linux. 1c/1GB $4.99 from public 2026 plan listings (hostwinds.com/vps is JS). Higher unmanaged tiers from the same public table. Entry confirmed on multiple 2026 plan databases.
- Fit evidence: https://www.hostwinds.com/unmanaged-vps; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 30 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 19. liquid-web-lw-1g (recommended rank 28)

- Catch: Outbound transfer is limited to 1 TB/month.
- Fit: For a small VPN, the plan includes 1 vCPU, 1 GB RAM and 30 GB SSD storage.
- Niches: vpn
- Catch evidence: https://www.liquidweb.com/pricing/; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: USD from official liquidweb.com/pricing/ Cloud VPS table (regular starting-at, not the 50%-off-2-months promo). Some SKUs show a 50% intro for 2 months — listed here at the regular rate. Provider pricing page checked 2026-10-03 still lists the 1 GB VPS with 1 TB bandwidth.
- Fit evidence: https://www.liquidweb.com/pricing/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 30 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 20. knownhost-entry (recommended rank 29)

- Catch: The Entry plan is unmanaged; managed VPS is a separate product.
- Fit: A small VPN gets 1 vCPU, 1 GB RAM and 25 GB NVMe storage.
- Niches: vpn
- Catch evidence: https://www.knownhost.com/unmanaged-vps.html; offer.billing and structured price/specs fields, snapshot checked 2026-08-31. Stored billing evidence: USD starting-at unmanaged NVMe. ATL/SEA/AMS. 2 IPv4 included. Managed VPS is a separate higher line from $43.25.
- Fit evidence: https://www.knownhost.com/unmanaged-vps.html; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 25 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.



## Batch 1 audited disposable entry

All 20 entries were saved through the actual authenticated `/admin/editorial` browser form as **drafts** on the copy database. No direct editorial SQL writes were used. The copy contains 21 successful audit events: Alibaba was saved a second time to record the source redirect. The first RackNerd submission was rejected because its quoted source contained the hedged lifetime-lock word; only the verifiable yearly-billing excerpt was then cited. No flat-renewal claim was adopted.

Database proof: 20 draft rows; reviewed timestamps/reviewers null; catch, fit, evidence and niches equal the authored payloads; 17 workload-tagged rows; one empty fit (Alibaba); zero public catches/fits/tags exposed from the drafts. BuyVM and DigitalOcean 0.5 GB entries remain untagged because every named workload floor is higher. The 20 open renewal rows and 16 corrections remain unchanged.

| Offer | Copy-only audit request ID | Saved at (UTC) |
|---|---|---|
| scaleway-stardust1-s | c53bb802-1c70-47a2-b195-c3ea499eac33 | 2026-10-03T14:28:38.000Z |
| racknerd-special-1gb | 1e2043f2-939a-4cb0-8b94-26211be36251 | 2026-10-03T14:30:32.000Z |
| ramnode-lite-1gb | 3d66079f-6e5b-4db2-b758-82717e5a43e1 | 2026-10-03T14:30:34.000Z |
| buyvm-slice-512 | 60594dfb-1618-4fb4-a1b2-872804deb13c | 2026-10-03T14:30:36.000Z |
| webdock-essential | 562a480c-caf8-465c-9bed-2af7ba8d9779 | 2026-10-03T14:30:38.000Z |
| alibaba-cloud-aliyun-ssd-starter | 5e287b1e-b479-480d-b1a0-6dc87552931f | 2026-10-03T14:30:39.000Z |
| interserver-1-slice | f48fa68e-c749-4c87-ab13-428e9cce6dc6 | 2026-10-03T14:30:41.000Z |
| time4vps-linux-2 | d3b0a043-0d61-4318-bf1c-362058bf5a64 | 2026-10-03T14:30:44.000Z |
| hostkey-hostkey-pico | e6465dbb-d413-4155-89c1-08c5d0392028 | 2026-10-03T14:30:46.000Z |
| alphavps-alpha-c2g | 1ccd07a0-5d4f-4c03-9c6e-32043ac2913a | 2026-10-03T14:30:47.000Z |
| clouding-io-clouding-1gb | 1d157a51-baad-4970-ad6d-08da645029b9 | 2026-10-03T14:31:05.000Z |
| upcloud-starter-1xcpu-1gb | 6dcd2871-fac2-470d-85fc-9c6f01304d1b | 2026-10-03T14:31:08.000Z |
| namecheap-spark | 68b28aee-c49c-4375-800f-0bb1e256e724 | 2026-10-03T14:31:10.000Z |
| digitalocean-basic-512mb | a1e552f9-3b79-4c7f-9dc0-7ab252da5c9a | 2026-10-03T14:31:12.000Z |
| ionos-vps-m-plus | 13f3483d-cffe-4292-bb48-6f3b4e7b529b | 2026-10-03T14:31:14.000Z |
| ovhcloud-vps-1 | 97b9b956-adef-4eb1-896a-0e134d1c1015 | 2026-10-03T14:31:16.000Z |
| hostsailor-hs-mini-nvme | c3a6920e-d01d-4c25-93f4-2d434901963a | 2026-10-03T14:31:18.000Z |
| hostwinds-ul-1 | 82f8e068-3e25-47aa-acbd-f4b1337f1463 | 2026-10-03T14:31:20.000Z |
| liquid-web-lw-1g | aa36cd44-91f1-4063-8d08-9c2eb514c357 | 2026-10-03T14:31:22.000Z |
| knownhost-entry | d03e2f86-02ed-4289-af88-23841355abca | 2026-10-03T14:31:24.000Z |
| alibaba-cloud-aliyun-ssd-starter | 52e41c43-4abb-4ab5-852d-f77a2a3d96aa | 2026-10-03T14:33:29.000Z |

## Owner review before batch 2

The review artifact is this file; the drafts are **not in the production DB**. Migrations 0014–0016 were owner-approved and applied on 6 October; production draft writes still await separate approval and an existing admin actor. Owner publication of batch 1 then gates the public offer-page catch/fit and workload-filter smoke and the remaining 80 drafts. Do not publish the Alibaba entry until its old ECS starter identity and hardware are established; its source now redirects to a different Simple Application Server product. Review the IONOS old/current price disagreement explicitly.

## G1 partial approval — 6 October 2026

The owner approved backup, migration rehearsal and production migrations only. Backup: `data/backups/bestvpsforme-pre-phase6-20261006-173437.db` (UTC filename); integrity check returned `ok`. A SQLite backup copy at `/tmp/bestvpsforme-phase6-g1-k4mzfcey/catalog.db` migrated from 14 to 17 migrations before production did. Both integrity and foreign-key checks passed, and every pre-existing table's original columns and rows matched the backup after migration.

Production after migration: 17 migrations, 322 published offers, 0 editorial entries, 0 audit records, 0 admin users, 0 site settings. No editorial, price, renewal, publication snapshot or home setting was changed.

The owner selected script option B. `scripts/load_editorial_drafts.ts` defaults to read-only dry-run, validates the entire batch, forces draft status, and refuses `--write` without an existing active `admin_users` actor and the audit actor foreign key. It preserves owner-reviewed editorial and saves drafts with audits atomically. `docs/progress/phase-6-batch-1-drafts.json` contains the unchanged batch-1 prose and evidence; Alibaba's fit is null, and Alibaba/BuyVM 512/DigitalOcean 512 MB have no niches.

All 20 entries passed dry-run on the migrated copy. Attempts to write with no actor or an unknown actor failed, leaving the copy byte-for-byte unchanged. Successful writes and audit rollback were tested only with synthetic admin actors on disposable `/tmp` databases. **Production draft saving remains pending:** the owner will log in to create their admin user and then provide its id and approval to write.

```bash
npx tsx scripts/load_editorial_drafts.ts \
  --input docs/progress/phase-6-batch-1-drafts.json \
  --database /tmp/bestvpsforme-phase6-g1-k4mzfcey/catalog.db --dry-run
```

## Remaining batches prepared — 7 October 2026

The owner requested completion of Phase 6 and authorized continuing the remaining draft preparation. Positions 21–100 retain their frozen queue order and recommended ranks. These entries use stored evidence checked 2026-08-31, not a new provider check. Draft preparation does not approve publication. Known disagreements and secondary-source facts have explicit publication holds below. Blank catches contain no claim that there is no catch. Evidence excerpts omit unsupported hedged sentences; the frozen JSON above remains unchanged.

The `stop-slop` writing skill was applied to these notes: direct costs and limits, numeric hardware, no promotional adjectives or invented performance claims.

## Batch 2 — queue positions 21–40

### 21. aws-lightsail-ls-gp-nano-v4 (recommended rank 30)

- Catch: Several Asia-Pacific locations and São Paulo include half the listed transfer.
- Fit: A Linux test box has 2 vCPU and 0.5 GB RAM; it is below the 1 GB VPN floor.
- Niches: none — RAM is below the 1 GB VPN floor
- Catch evidence: https://aws.amazon.com/lightsail/pricing/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Linux/Unix bundles with public IPv4. Hourly up to monthly cap. APAC Mumbai/Sydney/Jakarta/Malaysia/HK and Sao Paulo get half the transfer. Skip Windows and IPv6-only (IPv6-only GP starts $3.50). Cutoff: Lightsail VM bundles only (not containers/DBs).
- Fit evidence: https://aws.amazon.com/lightsail/pricing/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 0.5 GB RAM, 20 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 22. akamai-linode-g6-nanode-1 (recommended rank 31)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://www.linode.com/pricing/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Hourly billed, monthly cap except G8/GPU (excluded). Transfer pooled. Official types from api.linode.com/v4/linode/types. Cutoff: skip GPU, accelerated, G8 (true hourly, no monthly cap since 2026-07-01).
- Fit evidence: https://www.linode.com/pricing/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 25 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 23. ssd-nodes-kvm-small (recommended rank 35)

- Catch: The advertised monthly equivalent requires a 36-month billing cycle.
- Fit: A Docker stack has 2 vCPU and 8 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.ssdnodes.com/pricing/; offer billing notes and structured termMonths=36, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.
- Fit evidence: https://www.ssdnodes.com/pricing/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 8 GB RAM, 160 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 24. google-cloud-f1-micro (recommended rank 36)

- Catch: Persistent disk costs extra beyond the VM rate.
- Fit: A Linux test box has 0.2 vCPU and 0.6 GB RAM; it is below the 1 GB VPN floor.
- Niches: none — RAM is below the 1 GB VPN floor
- Catch evidence: https://cloud.google.com/products/compute/pricing/general-purpose; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=extra, snapshot checked 2026-08-31. Stored billing excerpt: USD on-demand Default rate, Iowa (us-central1) as listed on official General Purpose VM pricing. Persistent disk extra. e2-micro Always Free in us-west1/us-central1/us-east1 until monthly hour cap. Cutoff: E2 shared-core + E2 standard 2–32 + f1-micro; not the full N4/C4 matrix.
- Fit evidence: https://cloud.google.com/products/compute/pricing/general-purpose; offer specs row, snapshot checked 2026-08-31: 0.2 vCPU, 0.6 GB RAM, disk capacity not published. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 25. leaseweb-vps-1-eu (recommended rank 38)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: (none — hardware requires provider confirmation; secondary source is not a verified provider SKU)
- Niches: none — hardware requires provider confirmation; secondary source is not a verified provider SKU
- Catch evidence: https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: New-contract prices from 1 Aug 2026, official Leaseweb blog. EUR for NL/DE. USD US-region also published. Specs for VPS 1/2/3/5 from public VPSBenchmarks plan sheet (4c/6GB/100GB etc.). VPS 4/6 specs UNVERIFIED. Publication hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication.
- Fit evidence: https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 6 GB RAM, 100 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication. No fit or workload tag asserted until hardware is confirmed.
- Publication: draft only; owner review pending. **Hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication.**

### 26. yourserver-ys-1gb (recommended rank 39)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://www.yourserver.se/en/linux; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR from official yourserver.se/en/linux. KVM on Xeon + SSD. Unmetered transfer, 1 Gbps. Sweden or Latvia. 1 IPv4 + IPv6.
- Fit evidence: https://www.yourserver.se/en/linux; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 10 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 27. greencloudvps-gcvps-ryzenkvm-1 (recommended rank 41)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://green.cloud/ryzen-kvm-vps.php; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Official green.cloud/ryzen-kvm-vps.php USA/EU table. 1 core @ 3.5+ GHz. 1 Gbps port.
- Fit evidence: https://green.cloud/ryzen-kvm-vps.php; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 15 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 28. contabo-cloud-vps-4 (recommended rank 45)

- Catch: The advertised monthly equivalent requires a 24-month subscription; unlimited traffic remains subject to fair use.
- Fit: A Docker stack has 4 vCPU and 8 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.contabo.com/en/vps/; offer billing notes and structured termMonths=24, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).
- Fit evidence: https://www.contabo.com/en/vps/; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 8 GB RAM, 100 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 29. hostinger-kvm-1 (recommended rank 46)

- Catch: The 24-month introductory rate renews at $11.99/month.
- Fit: A Docker stack has 1 vCPU and 4 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.hostinger.com/vps-hosting; offer billing notes and structured termMonths=24, renewalMonthly=11.99, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Intro price for current promo; renews at higher rate for 2 years (listed). Cancel anytime. NVMe. Regular/renewal $11.99/mo. Crossed-out list also shown ($19.49...).
- Fit evidence: https://www.hostinger.com/vps-hosting; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 4 GB RAM, 50 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 30. netcup-500-g12 (recommended rank 47)

- Catch: Transfer throttles to 200 Mbps when the 24-hour average exceeds 2 TB.
- Fit: A Docker stack has 2 vCPU and 4 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.netcup.com/en/server/vps/vps-500-g12-iv-12m; offer billing notes and structured termMonths=12, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €5.91. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).
- Fit evidence: https://www.netcup.com/en/server/vps/vps-500-g12-iv-12m; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 4 GB RAM, 128 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 31. cherry-servers-c-vps-2-g2 (recommended rank 49)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: (none — hardware requires provider confirmation; secondary source is not a verified provider SKU)
- Niches: none — hardware requires provider confirmation; secondary source is not a verified provider SKU
- Catch evidence: https://www.cherryservers.com/pricing; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR monthly as sold/tested publicly 2025-06 to 2026-06 (VPSBenchmarks). Confirm in Cherry console. Official site only publishes from $0.018/hr. Publication hold: Stored plan facts use a secondary VPSBenchmarks table; confirm hardware and current console price before publication.
- Fit evidence: https://www.cherryservers.com/pricing; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 40 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Stored plan facts use a secondary VPSBenchmarks table; confirm hardware and current console price before publication. No fit or workload tag asserted until hardware is confirmed.
- Publication: draft only; owner review pending. **Hold: Stored plan facts use a secondary VPSBenchmarks table; confirm hardware and current console price before publication.**

### 32. privex-privex-v1-se-ssd (recommended rank 55)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://pay.privex.io/order/choose-server-nojs; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD from official pay.privex.io/order/choose-server-nojs. Privex Inc. (Belize). Sign-up with alias + email; crypto in-house. No setup fee on these VPS SKUs.
- Fit evidence: https://pay.privex.io/order/choose-server-nojs; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 25 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 33. dreamhost-dh-stack4 (recommended rank 64)

- Catch: After the first three months, the plan renews at $15.99/month.
- Fit: A Docker stack has 2 vCPU and 4 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.dreamhost.com/hosting/vps/; offer billing notes and structured termMonths=1, renewalMonthly=15.99, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Promo first 3 months $8.99/mo from official VPS page; auto-renews at $15.99/mo. Unmetered bandwidth (fair use). AMD EPYC + KVM.
- Fit evidence: https://www.dreamhost.com/hosting/vps/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 4 GB RAM, 75 GB NVMe SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 34. flokinet-floki-ro-i (recommended rank 65)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://flokinet.is/vps/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR from official flokinet.is/vps/ Romania table (SSR). 1 Gbit uplink. 1 IPv4 & /64 IPv6. KVM. DDoS 1Tbps+. Iceland / Netherlands / Finland tabs exist; those prices are JS and were not in the fetched HTML so they were not invented.
- Fit evidence: https://flokinet.is/vps/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 20 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 35. cockbox-cb-hdd-ro-1 (recommended rank 72)

- Catch: The stored provider page marked this plan sold out on 2026-08-31.
- Fit: A VPN has 0.5 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://cockbox.org/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD from official cockbox.org on 2026-08-31. Tor-friendly; BTC/XMR. All listed VPS SKUs showed Sold Out on this fetch. 1 TB bandwidth. Publication hold: The frozen provider fetch marked every listed SKU sold out; check availability before publication.
- Fit evidence: https://cockbox.org/; offer specs row, snapshot checked 2026-08-31: 0.5 vCPU, 1 GB RAM, 60 GB HDD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: The frozen provider fetch marked every listed SKU sold out; check availability before publication.
- Publication: draft only; owner review pending. **Hold: The frozen provider fetch marked every listed SKU sold out; check availability before publication.**

### 36. 20i-1-core (recommended rank 98)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://www.20i.com/vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: GBP as shown on 20i.com/vps. Unlimited bandwidth. UK or US. Renewable-energy claim. 1 IPv4 included.
- Fit evidence: https://www.20i.com/vps; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 25 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 37. oracle-cloud-a1-flex-1-6 (recommended rank 99)

- Catch: Disk costs extra beyond the paid compute and RAM rate.
- Fit: An ARM-compatible Docker stack has 1 OCPU and 6 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.oracle.com/cloud/compute/arm/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=extra, snapshot checked 2026-08-31. Stored billing excerpt: Paid Flex. Unit prices from oracle.com Ampere A1 page: $0.01/OCPU-hr + $0.0015/GB-hr all regions. Disk extra. Paid tenancies historically also get a free A1 allowance (docs still mention 3k OCPU-hrs for paid in some price-list copy; Always Free tenancy cap is 2/12 as of Aug 2026). Publication hold: Paid A1 SKU only: do not borrow the historical free allowance. Confirm billed architecture and disk cost before publication.
- Fit evidence: https://www.oracle.com/cloud/compute/arm/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 6 GB RAM, 50 GB block extra. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Paid A1 SKU only: do not borrow the historical free allowance. Confirm billed architecture and disk cost before publication.
- Publication: draft only; owner review pending. **Hold: Paid A1 SKU only: do not borrow the historical free allowance. Confirm billed architecture and disk cost before publication.**

### 38. atlantic-net-g3-2gb-win (recommended rank 116)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A Windows test environment has 1 vCPU and 2 GB RAM.
- Niches: other
- Catch evidence: https://www.atlantic.net/vps-hosting/windows-vps-hosting/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Official Windows VPS pricing table (monthly / hourly). Longer terms cheaper. Publication hold: This is a Windows SKU; confirm the intended workload and Windows licensing before publication.
- Fit evidence: https://www.atlantic.net/vps-hosting/windows-vps-hosting/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 50 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: This is a Windows SKU; confirm the intended workload and Windows licensing before publication.
- Publication: draft only; owner review pending. **Hold: This is a Windows SKU; confirm the intended workload and Windows licensing before publication.**

### 39. njalla-njalla-15 (recommended rank 120)

- Catch: Outgoing SMTP is blocked.
- Fit: A VPN has 1 vCPU and 1.5 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://njal.la/servers/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR. Official njal.la/pricing/ and njal.la/servers/. INCUS + Ceph. 1 IPv4 + 1 IPv6. SSH root. Outgoing SMTP blocked.
- Fit evidence: https://njal.la/servers/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1.5 GB RAM, 15 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 40. scalahosting-scala-b1 (recommended rank 158)

- Catch: The 12-month introductory rate renews at $54.95/month.
- Fit: A Docker stack has 2 vCPU and 4 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.scalahosting.com/vps-hosting.html; offer billing notes and structured termMonths=12, renewalMonthly=54.95, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: 12-month intro $29.95/mo from official managed cloud table; renews $54.95/mo. Fully managed SPanel. Monthly term is the higher renewal rate.
- Fit evidence: https://www.scalahosting.com/vps-hosting.html; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 4 GB RAM, 50 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

Batch 2: 20 prepared drafts; 5 publication holds. Loader input: `docs/progress/phase-6-batch-2-drafts.json`. Production saves and audit receipts are recorded separately after an authorized write.

## Batch 3 — queue positions 41–60

### 41. fastcomet-cloud-1 (recommended rank 187)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: (none — hardware requires provider confirmation; secondary source is not a verified provider SKU)
- Niches: none — hardware requires provider confirmation; secondary source is not a verified provider SKU
- Catch evidence: https://www.fastcomet.com/vps-pricing; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Official vps-pricing: intro then regular. Cloud 1 mentioned as from $46.16/mo on same page footnote. Fully managed + cPanel. Intro from $46.16/mo (page footnote); regular often listed $65.95. Specs from companion public tables (1 vCPU/2GB/50GB/2TB). Publication hold: Hardware comes from companion public tables and the stored regular price is hedged; confirm provider SKU and price before publication.
- Fit evidence: https://www.fastcomet.com/vps-pricing; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 50 GB SSD/NVMe. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Hardware comes from companion public tables and the stored regular price is hedged; confirm provider SKU and price before publication. No fit or workload tag asserted until hardware is confirmed.
- Publication: draft only; owner review pending. **Hold: Hardware comes from companion public tables and the stored regular price is hedged; confirm provider SKU and price before publication.**

### 42. microsoft-azure-azure-b1s-free (recommended rank 320)

- Catch: The free-account allowance lasts 12 months; OS disk, public IPv4 and bandwidth can still incur charges.
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://azure.microsoft.com/en-us/pricing/free-services/; offer billing notes and structured termMonths=12, renewalMonthly=None, ipv4Status=extra, snapshot checked 2026-08-31. Stored billing excerpt: 12-month free tier: 750 hours/month of B1s (Linux and Windows each advertised) on an Azure free account. Not always-free. OS disk, IPv4, and bandwidth can still bill. After 12 months, PAYG. Always-free Azure list does not include a VM. Publication hold: Dated account-specific allowance: verify the account creation rules and current provider eligibility before publication.
- Fit evidence: https://azure.microsoft.com/en-us/pricing/free-services/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, disk capacity not published. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Dated account-specific allowance: verify the account creation rules and current provider eligibility before publication.
- Publication: draft only; owner review pending. **Hold: Dated account-specific allowance: verify the account creation rules and current provider eligibility before publication.**

### 43. aws-ec2-ec2-t3-micro-free (recommended rank 322)

- Catch: Older accounts have a 12-month VM allowance; newer accounts use a six-month credit plan, with EBS and IPv4 charges.
- Fit: A VPN has 2 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://aws.amazon.com/free/; offer billing notes and structured termMonths=12, renewalMonthly=None, ipv4Status=extra, snapshot checked 2026-08-31. Stored billing excerpt: 12-month free tier for accounts created before 2025-07-15: 750 h/mo t2.micro or t3.micro. Accounts on/after 2025-07-15: Free plan is up to $200 credits for 6 months (not a forever VM). Not always-free. EBS + public IPv4 can bill. Eligibility fields: older account creation before 2025-07-15; newer account credit plan on or after 2025-07-15. The stored allowance is not a current-account promise. Publication hold: Dated account-specific allowance: verify the account creation rules and current provider eligibility before publication.
- Fit evidence: https://aws.amazon.com/free/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 1 GB RAM, disk capacity not published. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Dated account-specific allowance: verify the account creation rules and current provider eligibility before publication.
- Publication: draft only; owner review pending. **Hold: Dated account-specific allowance: verify the account creation rules and current provider eligibility before publication.**

### 44. racknerd-kvm-512 (recommended rank 5)

- Catch: The 512 MB plan requires yearly billing.
- Fit: A Linux test box has 1 vCPU and 0.5 GB RAM; it is below the 1 GB VPN floor.
- Niches: none — RAM is below the 1 GB VPN floor
- Catch evidence: https://www.racknerd.com/kvm-vps; offer billing notes and structured termMonths=12, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Standard KVM from racknerd.com/kvm-vps (monthly except 512MB yearly). RAID-10 SSD. 1 IPv4.
- Fit evidence: https://www.racknerd.com/kvm-vps; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 0.5 GB RAM, 30 GB RAID-10 SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 45. ramnode-lite-2gb (recommended rank 9)

- Catch: Public IPv4 adds $2/month to the IPv6-only Lite rate.
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://ramnode.com/products/cloud-vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=extra, snapshot checked 2026-08-31. Stored billing excerpt: Lite Cloud: IPv6; +$2/mo IPv4.
- Fit evidence: https://ramnode.com/products/cloud-vps; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 20 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 46. racknerd-special-2gb (recommended rank 10)

- Catch: The promotional rate requires yearly billing; the frozen snapshot has no verified renewal amount.
- Fit: A WordPress site has 2 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://www.racknerd.com/specials/; offer billing notes and structured termMonths=12, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31).
- Fit evidence: https://www.racknerd.com/specials/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 35 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 47. time4vps-linux-1 (recommended rank 14)

- Catch: Backups and NVMe upgrades cost extra.
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://www.time4vps.com/linux-vps/; offer billing notes and structured termMonths=1, renewalMonthly=2.99, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR. Official linux-vps page: list / intro / renewal. Linux 1 has no discount. Lithuania. Optional backups/NVMe add-ons. List €2.99/mo; renews €2.99/mo. Publication hold: Current provider research found billing-term disagreement in this product line; verify this exact SKU term before publication.
- Fit evidence: https://www.time4vps.com/linux-vps/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 10 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research found billing-term disagreement in this product line; verify this exact SKU term before publication.
- Publication: draft only; owner review pending. **Hold: Current provider research found billing-term disagreement in this product line; verify this exact SKU term before publication.**

### 48. buyvm-slice-1024 (recommended rank 17)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://buyvm.net/kvm-dedicated-server-slices/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Las Vegas, New York, Luxembourg. Unmetered bandwidth. DirectAdmin included. SLICE 512 billed yearly only.
- Fit evidence: https://buyvm.net/kvm-dedicated-server-slices/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 20 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 49. ramnode-std-0.5gb (recommended rank 20)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A Linux test box has 1 vCPU and 0.5 GB RAM; it is below the 1 GB VPN floor.
- Niches: none — RAM is below the 1 GB VPN floor
- Catch evidence: https://ramnode.com/products/cloud-vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Official Standard Cloud VPS table. Hourly. 1 IPv4 included on Standard. Lite Cloud is IPv6 +$2 for IPv4.
- Fit evidence: https://ramnode.com/products/cloud-vps; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 0.5 GB RAM, 20 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 50. hostkey-hostkey-nano (recommended rank 22)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 2 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://hostkey.com/vps/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR from official hostkey.com/vps/ library. 1 Gbit/s, 3 TB included. Skip GPU SKUs. Publication hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.
- Fit evidence: https://hostkey.com/vps/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 60 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.
- Publication: draft only; owner review pending. **Hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.**

### 51. alphavps-alpha-c4g (recommended rank 24)

- Catch: The €3.39/month annual equivalent requires yearly billing; monthly billing costs €3.99.
- Fit: A Docker stack has 2 vCPU and 4 GB RAM to work with.
- Niches: docker
- Catch evidence: https://alphavps.com/cheap-vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR from official alphavps.com/cheap-vps. Monthly €3.99; annual billed €3.39/mo (€40.7/yr), flat at renewal. Xeon Scalable KVM. 14-day money-back. Publication hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.
- Fit evidence: https://alphavps.com/cheap-vps; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 4 GB RAM, 40 GB NVMe RAID-10. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.
- Publication: draft only; owner review pending. **Hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.**

### 52. webdock-advanced (recommended rank 27)

- Catch: Transfer beyond the included allowance costs €2.50/TB.
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://webdock.io/en/pricing; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR month-to-month. Featured bundles on pricing page. Custom VPS from €4.30 (CPU €1.60, RAM €0.60/GB, disk €0.10/GB). DK-DC1 Denmark. IPv4 included. Overage €2.50/TB.
- Fit evidence: https://webdock.io/en/pricing; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 15 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 53. racknerd-special-4gb (recommended rank 32)

- Catch: The promotional rate requires yearly billing; the frozen snapshot has no verified renewal amount.
- Fit: A Docker stack has 3 vCPU and 4 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.racknerd.com/specials/; offer billing notes and structured termMonths=12, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31).
- Fit evidence: https://www.racknerd.com/specials/; offer specs row, snapshot checked 2026-08-31: 3 vCPU, 4 GB RAM, 60 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 54. ramnode-std-1gb (recommended rank 33)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://ramnode.com/products/cloud-vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Official Standard Cloud VPS table. Hourly. 1 IPv4 included on Standard. Lite Cloud is IPv6 +$2 for IPv4.
- Fit evidence: https://ramnode.com/products/cloud-vps; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 40 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 55. time4vps-linux-4 (recommended rank 34)

- Catch: Backups and NVMe upgrades cost extra.
- Fit: A Docker stack has 2 vCPU and 4 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.time4vps.com/linux-vps/; offer billing notes and structured termMonths=1, renewalMonthly=8.76, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR. Official linux-vps page: list / intro / renewal. Linux 1 has no discount. Lithuania. Optional backups/NVMe add-ons. List €12.99/mo; renews €8.76/mo. Publication hold: Current provider research found billing-term disagreement in this product line; verify this exact SKU term before publication.
- Fit evidence: https://www.time4vps.com/linux-vps/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 4 GB RAM, 50 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research found billing-term disagreement in this product line; verify this exact SKU term before publication.
- Publication: draft only; owner review pending. **Hold: Current provider research found billing-term disagreement in this product line; verify this exact SKU term before publication.**

### 56. alphavps-alpha-c6g (recommended rank 37)

- Catch: The €4.24/month annual equivalent requires yearly billing; monthly billing costs €4.99.
- Fit: A Docker stack has 3 vCPU and 6 GB RAM to work with.
- Niches: docker
- Catch evidence: https://alphavps.com/cheap-vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR from official alphavps.com/cheap-vps. Monthly €4.99; annual billed €4.24/mo (€50.9/yr), flat at renewal. Xeon Scalable KVM. 14-day money-back. Publication hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.
- Fit evidence: https://alphavps.com/cheap-vps; offer specs row, snapshot checked 2026-08-31: 3 vCPU, 6 GB RAM, 55 GB NVMe RAID-10. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.
- Publication: draft only; owner review pending. **Hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.**

### 57. digitalocean-basic-1gb (recommended rank 40)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://www.digitalocean.com/pricing/droplets; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Per-second billing (min 60s/$0.01) since 2026-01-01; monthly cap 672h. Regular CPU option as shown on pricing page. IPv4 included on bundled plans. Skip: v5 a-la-carte, GPU Droplets.
- Fit evidence: https://www.digitalocean.com/pricing/droplets; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 25 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 58. greencloudvps-gcvps-ssdkvm-1 (recommended rank 42)

- Catch: Asia-Pacific locations include 750 GB transfer, below the stored 1.5 TB allowance.
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://green.cloud/budget-kvm-vps.php; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Official green.cloud/budget-kvm-vps.php. APAC bandwidth 750 GB. 10 Gbps port. Linux. Addons $3/GB RAM, $3/core, $3/10GB SSD.
- Fit evidence: https://green.cloud/budget-kvm-vps.php; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 15 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 59. ionos-vps-l-plus (recommended rank 43)

- Catch: The three-month introductory rate requires a one-year term, then changes to $21/month.
- Fit: A Docker stack has 4 vCPU and 8 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.ionos.com/servers/vps; offer billing notes and structured termMonths=12, renewalMonthly=21, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Intro 3 months with 1-year term, then regular monthly. Unlimited traffic. US/UK/DE/ES. IPv4 included. After intro: $21/mo. Publication hold: Known IONOS price drift requires reconciliation of this exact SKU with the provider page before publication.
- Fit evidence: https://www.ionos.com/servers/vps; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 8 GB RAM, 240 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Known IONOS price drift requires reconciliation of this exact SKU with the provider page before publication.
- Publication: draft only; owner review pending. **Hold: Known IONOS price drift requires reconciliation of this exact SKU with the provider page before publication.**

### 60. google-cloud-e2-micro (recommended rank 44)

- Catch: Persistent disk costs extra beyond the VM rate.
- Fit: A VPN has 2 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://cloud.google.com/products/compute/pricing/general-purpose; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=extra, snapshot checked 2026-08-31. Stored billing excerpt: USD on-demand Default rate, Iowa (us-central1) as listed on official General Purpose VM pricing. Persistent disk extra. e2-micro Always Free in us-west1/us-central1/us-east1 until monthly hour cap. Cutoff: E2 shared-core + E2 standard 2–32 + f1-micro; not the full N4/C4 matrix.
- Fit evidence: https://cloud.google.com/products/compute/pricing/general-purpose; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 1 GB RAM, disk capacity not published. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

Batch 3: 20 prepared drafts; 9 publication holds. Loader input: `docs/progress/phase-6-batch-3-drafts.json`. Production saves and audit receipts are recorded separately after an authorized write.

## Batch 4 — queue positions 61–80

### 61. namecheap-pulsar (recommended rank 48)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 2 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://www.namecheap.com/hosting/vps/; offer billing notes and structured termMonths=12, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Five plan names confirmed on Namecheap KB (updated 2026-04-06). Numeric prices from 2026 public checkout roundups (official VPS HTML 403 on fetch). Yearly intro / renewal. UNVERIFIED if you need pixel-perfect checkout. Renewal ~$106.56/yr. Publication hold: The stored numeric price uses secondary checkout roundups; verify the exact Pulsar checkout and renewal before publication.
- Fit evidence: https://www.namecheap.com/hosting/vps/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 40 GB SSD RAID 10. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: The stored numeric price uses secondary checkout roundups; verify the exact Pulsar checkout and renewal before publication.
- Publication: draft only; owner review pending. **Hold: The stored numeric price uses secondary checkout roundups; verify the exact Pulsar checkout and renewal before publication.**

### 62. upcloud-starter-1xcpu-2gb (recommended rank 50)

- Catch: Egress is subject to fair use; the hourly bill caps at 28 days per month.
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://upcloud.com/products/cloud-servers/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR excl tax. Hourly billed, capped 28 days/month. IPv4 included on Starter. Zero-cost egress with fair-use. 1GB plan max 5 concurrent per customer. USD prices also published ($3.5 for 1GB). Publication hold: Current provider research identifies Starter disks as standard SSD; the frozen snapshot says MaxIOPS. Owner must reconcile disk type.
- Fit evidence: https://upcloud.com/products/cloud-servers/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 20 GB MaxIOPS. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identifies Starter disks as standard SSD; the frozen snapshot says MaxIOPS. Owner must reconcile disk type.
- Publication: draft only; owner review pending. **Hold: Current provider research identifies Starter disks as standard SSD; the frozen snapshot says MaxIOPS. Owner must reconcile disk type.**

### 63. leaseweb-vps-1-us (recommended rank 51)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: (none — hardware requires provider confirmation; secondary source is not a verified provider SKU)
- Niches: none — hardware requires provider confirmation; secondary source is not a verified provider SKU
- Catch evidence: https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: New-contract prices from 1 Aug 2026, official Leaseweb blog. EUR for NL/DE. USD US-region also published. Specs for VPS 1/2/3/5 from public VPSBenchmarks plan sheet (4c/6GB/100GB etc.). VPS 4/6 specs UNVERIFIED. Publication hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication.
- Fit evidence: https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 6 GB RAM, 100 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication. No fit or workload tag asserted until hardware is confirmed.
- Publication: draft only; owner review pending. **Hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication.**

### 64. aws-lightsail-ls-gp-micro-v4 (recommended rank 52)

- Catch: Several Asia-Pacific locations and São Paulo include half the listed transfer.
- Fit: A VPN has 2 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://aws.amazon.com/lightsail/pricing/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Linux/Unix bundles with public IPv4. Hourly up to monthly cap. APAC Mumbai/Sydney/Jakarta/Malaysia/HK and Sao Paulo get half the transfer. Skip Windows and IPv6-only (IPv6-only GP starts $3.50). Cutoff: Lightsail VM bundles only (not containers/DBs).
- Fit evidence: https://aws.amazon.com/lightsail/pricing/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 1 GB RAM, 40 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 65. buyvm-slice-2048 (recommended rank 53)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://buyvm.net/kvm-dedicated-server-slices/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Las Vegas, New York, Luxembourg. Unmetered bandwidth. DirectAdmin included. SLICE 512 billed yearly only.
- Fit evidence: https://buyvm.net/kvm-dedicated-server-slices/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 40 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 66. hostkey-hostkey-mini (recommended rank 54)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A Docker stack has 4 vCPU and 6 GB RAM to work with.
- Niches: docker
- Catch evidence: https://hostkey.com/vps/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR from official hostkey.com/vps/ library. 1 Gbit/s, 3 TB included. Skip GPU SKUs. Publication hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.
- Fit evidence: https://hostkey.com/vps/; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 6 GB RAM, 120 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.
- Publication: draft only; owner review pending. **Hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.**

### 67. racknerd-special-6gb (recommended rank 56)

- Catch: The promotional rate requires yearly billing; the frozen snapshot has no verified renewal amount.
- Fit: A Docker stack has 6 vCPU and 6 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.racknerd.com/specials/; offer billing notes and structured termMonths=12, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). KVM/SolusVM, 1 Gbps, 1 IPv4.
- Fit evidence: https://www.racknerd.com/specials/; offer specs row, snapshot checked 2026-08-31: 6 vCPU, 6 GB RAM, 100 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 68. alphavps-alpha-c8g (recommended rank 57)

- Catch: The €5.52/month annual equivalent requires yearly billing; monthly billing costs €6.49.
- Fit: A Docker stack has 4 vCPU and 8 GB RAM to work with.
- Niches: docker
- Catch evidence: https://alphavps.com/cheap-vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR from official alphavps.com/cheap-vps. Monthly €6.49; annual billed €5.52/mo (€66.2/yr), flat at renewal. Xeon Scalable KVM. 14-day money-back. Publication hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.
- Fit evidence: https://alphavps.com/cheap-vps; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 8 GB RAM, 75 GB NVMe RAID-10. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.
- Publication: draft only; owner review pending. **Hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.**

### 69. scaleway-dev1-s (recommended rank 58)

- Catch: Storage and public IPv4 cost extra beyond the instance rate.
- Fit: A WordPress site has 2 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://www.scaleway.com/en/pricing/virtual-instances/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=extra, snapshot checked 2026-08-31. Stored billing excerpt: EUR before tax, PAR-1. Approx monthly as published (~730h). Storage and public IPv4 billed separately; egress+IPv6 in list price. Cutoff: Development (PLAY2/DEV1/STARDUST) + PRO2 + GP1 + BASIC3. Skip POP2/BASIC2/STANDARD2/STANDARD3/COMPUTE3/MEMORY3 (older or specialized matrix).
- Fit evidence: https://www.scaleway.com/en/pricing/virtual-instances/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, disk capacity not published. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 70. time4vps-linux-8 (recommended rank 59)

- Catch: Backups and NVMe upgrades cost extra.
- Fit: A Docker stack has 3 vCPU and 8 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.time4vps.com/linux-vps/; offer billing notes and structured termMonths=1, renewalMonthly=14.24, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR. Official linux-vps page: list / intro / renewal. Linux 1 has no discount. Lithuania. Optional backups/NVMe add-ons. List €19.99/mo; renews €14.24/mo. Publication hold: Current provider research found billing-term disagreement in this product line; verify this exact SKU term before publication.
- Fit evidence: https://www.time4vps.com/linux-vps/; offer specs row, snapshot checked 2026-08-31: 3 vCPU, 8 GB RAM, 100 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research found billing-term disagreement in this product line; verify this exact SKU term before publication.
- Publication: draft only; owner review pending. **Hold: Current provider research found billing-term disagreement in this product line; verify this exact SKU term before publication.**

### 71. ovhcloud-vps-2 (recommended rank 60)

- Catch: Asia-Pacific locations include 1 TB traffic; exceeding it reduces the connection to 10 Mbps.
- Fit: A Docker stack has 4 vCPU and 8 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.ovhcloud.com/en/vps/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Advertised 'from' monthly on OVHcloud EN VPS page (VPS 2027 range). Unlimited traffic except APAC quota (VPS-1 500GB, VPS-2/3 1TB, VPS-4 3TB then cap 10Mbps). Daily backup included. IPv4 included. Bandwidth field: unlimited*.
- Fit evidence: https://www.ovhcloud.com/en/vps/; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 8 GB RAM, 75 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 72. contabo-cloud-vps-6 (recommended rank 61)

- Catch: The advertised monthly equivalent requires a 24-month subscription; unlimited traffic remains subject to fair use.
- Fit: A Docker stack has 6 vCPU and 12 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.contabo.com/en/vps/; offer billing notes and structured termMonths=24, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).
- Fit evidence: https://www.contabo.com/en/vps/; offer specs row, snapshot checked 2026-08-31: 6 vCPU, 12 GB RAM, 200 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 73. hostinger-kvm-2 (recommended rank 62)

- Catch: The 24-month introductory rate renews at $14.99/month.
- Fit: A Docker stack has 2 vCPU and 8 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.hostinger.com/vps-hosting; offer billing notes and structured termMonths=24, renewalMonthly=14.99, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Intro price for current promo; renews at higher rate for 2 years (listed). Cancel anytime. NVMe. Regular/renewal $14.99/mo. Crossed-out list also shown ($...).
- Fit evidence: https://www.hostinger.com/vps-hosting; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 8 GB RAM, 100 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 74. hostsailor-hs-sailor-nvme (recommended rank 63)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 2 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://hostsailor.com/kvm-vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD monthly from official clients.hostsailor.com/index.php?rp=/store/kvm-vps-nvme (also listed on hostsailor.com/kvm-vps). Netherlands NVMe KVM. 1 Gbit. 1 IPv4 + /64 IPv6. Yearly listed as 12× monthly. Dubai-registered; NL/RO DCs. Crypto accepted.
- Fit evidence: https://hostsailor.com/kvm-vps; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 50 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 75. clouding-io-clouding-2gb (recommended rank 66)

- Catch: Transfer beyond the included 4 TB costs €0.004/GB.
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://clouding.io/en/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR. Hourly 0.011€, monthly cap 8€ from official clouding.io/en. 4 TB transfer then 0.004€/GB.
- Fit evidence: https://clouding.io/en/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 30 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 76. upcloud-starter-2xcpu-2gb (recommended rank 67)

- Catch: Egress is subject to fair use; the hourly bill caps at 28 days per month.
- Fit: A WordPress site has 2 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://upcloud.com/products/cloud-servers/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR excl tax. Hourly billed, capped 28 days/month. IPv4 included on Starter. Zero-cost egress with fair-use. 1GB plan max 5 concurrent per customer. USD prices also published ($3.5 for 1GB). Publication hold: Current provider research identifies Starter disks as standard SSD; the frozen snapshot says MaxIOPS. Owner must reconcile disk type.
- Fit evidence: https://upcloud.com/products/cloud-servers/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 30 GB MaxIOPS. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identifies Starter disks as standard SSD; the frozen snapshot says MaxIOPS. Owner must reconcile disk type.
- Publication: draft only; owner review pending. **Hold: Current provider research identifies Starter disks as standard SSD; the frozen snapshot says MaxIOPS. Owner must reconcile disk type.**

### 77. hostkey-hostkey-v3-pico (recommended rank 68)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://hostkey.com/vps/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR from official hostkey.com/vps/ library. 1 Gbit/s, 3 TB included. Skip GPU SKUs. Publication hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.
- Fit evidence: https://hostkey.com/vps/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 40 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.
- Publication: draft only; owner review pending. **Hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.**

### 78. ssd-nodes-kvm-medium (recommended rank 69)

- Catch: The advertised monthly equivalent requires a 36-month billing cycle.
- Fit: A Docker stack has 4 vCPU and 16 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.ssdnodes.com/pricing/; offer billing notes and structured termMonths=36, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.
- Fit evidence: https://www.ssdnodes.com/pricing/; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 16 GB RAM, 320 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 79. hostwinds-ul-2 (recommended rank 70)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: (none — hardware requires provider confirmation; secondary source is not a verified provider SKU)
- Niches: none — hardware requires provider confirmation; secondary source is not a verified provider SKU
- Catch evidence: https://www.hostwinds.com/unmanaged-vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD unmanaged Linux. 1c/1GB $4.99 from public 2026 plan listings (hostwinds.com/vps is JS). Higher unmanaged tiers from the same public table. Same public table; treat as advertised unmanaged Linux line. Publication hold: Stored hardware and price use secondary public listings; confirm the exact provider SKU before publication.
- Fit evidence: https://www.hostwinds.com/unmanaged-vps; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 50 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Stored hardware and price use secondary public listings; confirm the exact provider SKU before publication. No fit or workload tag asserted until hardware is confirmed.
- Publication: draft only; owner review pending. **Hold: Stored hardware and price use secondary public listings; confirm the exact provider SKU before publication.**

### 80. knownhost-entry-plus (recommended rank 71)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 2 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://www.knownhost.com/unmanaged-vps.html; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD starting-at unmanaged NVMe. ATL/SEA/AMS. 2 IPv4 included. Managed VPS is a separate higher line from $43.25.
- Fit evidence: https://www.knownhost.com/unmanaged-vps.html; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 50 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

Batch 4: 20 prepared drafts; 9 publication holds. Loader input: `docs/progress/phase-6-batch-4-drafts.json`. Production saves and audit receipts are recorded separately after an authorized write.

## Batch 5 — queue positions 81–100

### 81. greencloudvps-gcvps-ryzenkvm-2 (recommended rank 73)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://green.cloud/ryzen-kvm-vps.php; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Official green.cloud/ryzen-kvm-vps.php USA/EU table.
- Fit evidence: https://green.cloud/ryzen-kvm-vps.php; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 30 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 82. greencloudvps-gcvps-ssdkvm-2 (recommended rank 74)

- Catch: Asia-Pacific locations include 1 TB transfer, below the stored 2 TB allowance.
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://green.cloud/budget-kvm-vps.php; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Official green.cloud/budget-kvm-vps.php. APAC bandwidth 1 TB. 10 Gbps port.
- Fit evidence: https://green.cloud/budget-kvm-vps.php; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 15 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 83. racknerd-special-8gb (recommended rank 75)

- Catch: The promotional rate requires yearly billing; the frozen snapshot has no verified renewal amount.
- Fit: A Docker stack has 7 vCPU and 8 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.racknerd.com/specials/; offer billing notes and structured termMonths=12, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Promo yearly from racknerd.com/specials/ (current public specials 2026-08-31). KVM/SolusVM, 1 Gbps, 1 IPv4.
- Fit evidence: https://www.racknerd.com/specials/; offer specs row, snapshot checked 2026-08-31: 7 vCPU, 8 GB RAM, 150 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 84. ramnode-std-2gb (recommended rank 76)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 2 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://ramnode.com/products/cloud-vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Official Standard Cloud VPS table. Hourly. 1 IPv4 included on Standard. Lite Cloud is IPv6 +$2 for IPv4.
- Fit evidence: https://ramnode.com/products/cloud-vps; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 80 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 85. privex-privex-v1-se-nvme (recommended rank 77)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A VPN has 1 vCPU and 1 GB RAM to work with.
- Niches: vpn
- Catch evidence: https://pay.privex.io/order/choose-server-nojs; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD from official pay.privex.io/order/choose-server-nojs. Privex Inc. (Belize). Sign-up with alias + email; crypto in-house. No setup fee on these VPS SKUs.
- Fit evidence: https://pay.privex.io/order/choose-server-nojs; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 1 GB RAM, 20 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 86. privex-privex-v2-se-ssd (recommended rank 78)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 2 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://pay.privex.io/order/choose-server-nojs; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD from official pay.privex.io/order/choose-server-nojs. Privex Inc. (Belize). Sign-up with alias + email; crypto in-house. No setup fee on these VPS SKUs.
- Fit evidence: https://pay.privex.io/order/choose-server-nojs; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 35 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 87. hostkey-hostkey-v3-nano (recommended rank 79)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A Docker stack has 2 vCPU and 4 GB RAM to work with.
- Niches: docker
- Catch evidence: https://hostkey.com/vps/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR from official hostkey.com/vps/ library. 1 Gbit/s, 3 TB included. Skip GPU SKUs. Publication hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.
- Fit evidence: https://hostkey.com/vps/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 4 GB RAM, 60 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.
- Publication: draft only; owner review pending. **Hold: Current provider research identified a tax-basis difference; verify the exact SKU price and tax basis before publication.**

### 88. alphavps-alpha-c12g (recommended rank 80)

- Catch: The €7.64/month annual equivalent requires yearly billing; monthly billing costs €8.99.
- Fit: A Docker stack has 4 vCPU and 12 GB RAM to work with.
- Niches: docker
- Catch evidence: https://alphavps.com/cheap-vps; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR from official alphavps.com/cheap-vps. Monthly €8.99; annual billed €7.64/mo (€91.7/yr), flat at renewal. Xeon Scalable KVM. 14-day money-back. Publication hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.
- Fit evidence: https://alphavps.com/cheap-vps; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 12 GB RAM, 100 GB NVMe RAID-10. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.
- Publication: draft only; owner review pending. **Hold: Current provider research identified separate monthly and annual prices; verify this exact SKU term before publishing billing prose.**

### 89. leaseweb-vps-2-eu (recommended rank 81)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: (none — hardware requires provider confirmation; secondary source is not a verified provider SKU)
- Niches: none — hardware requires provider confirmation; secondary source is not a verified provider SKU
- Catch evidence: https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: New-contract prices from 1 Aug 2026, official Leaseweb blog. EUR for NL/DE. USD US-region also published. Specs for VPS 1/2/3/5 from public VPSBenchmarks plan sheet (4c/6GB/100GB etc.). VPS 4/6 specs UNVERIFIED. Publication hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication.
- Fit evidence: https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/; offer specs row, snapshot checked 2026-08-31: 6 vCPU, 16 GB RAM, 200 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication. No fit or workload tag asserted until hardware is confirmed.
- Publication: draft only; owner review pending. **Hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication.**

### 90. cherry-servers-c-vps-4-g2 (recommended rank 82)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: (none — hardware requires provider confirmation; secondary source is not a verified provider SKU)
- Niches: none — hardware requires provider confirmation; secondary source is not a verified provider SKU
- Catch evidence: https://www.cherryservers.com/pricing; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR monthly as sold/tested publicly 2025-06 to 2026-06 (VPSBenchmarks). Confirm in Cherry console. Official site only publishes from $0.018/hr. Publication hold: Stored plan facts use a secondary VPSBenchmarks table; confirm hardware and current console price before publication.
- Fit evidence: https://www.cherryservers.com/pricing; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 4 GB RAM, 80 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Stored plan facts use a secondary VPSBenchmarks table; confirm hardware and current console price before publication. No fit or workload tag asserted until hardware is confirmed.
- Publication: draft only; owner review pending. **Hold: Stored plan facts use a secondary VPSBenchmarks table; confirm hardware and current console price before publication.**

### 91. leaseweb-vps-2-us (recommended rank 83)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: (none — hardware requires provider confirmation; secondary source is not a verified provider SKU)
- Niches: none — hardware requires provider confirmation; secondary source is not a verified provider SKU
- Catch evidence: https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: New-contract prices from 1 Aug 2026, official Leaseweb blog. EUR for NL/DE. USD US-region also published. Specs for VPS 1/2/3/5 from public VPSBenchmarks plan sheet (4c/6GB/100GB etc.). VPS 4/6 specs UNVERIFIED. Publication hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication.
- Fit evidence: https://blog.leaseweb.com/2026/07/28/vps-price-increases-are-coming-for-new-contracts-in-2026/; offer specs row, snapshot checked 2026-08-31: 6 vCPU, 16 GB RAM, 200 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication. No fit or workload tag asserted until hardware is confirmed.
- Publication: draft only; owner review pending. **Hold: Hardware comes from a secondary VPSBenchmarks sheet; confirm this SKU with the provider before publication.**

### 92. liquid-web-lw-2g (recommended rank 84)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://www.liquidweb.com/pricing/; offer billing notes and structured termMonths=1, renewalMonthly=11, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD from official liquidweb.com/pricing/ Cloud VPS table (regular starting-at, not the 50%-off-2-months promo). Some SKUs show a 50% intro for 2 months — listed here at the regular rate.
- Fit evidence: https://www.liquidweb.com/pricing/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 60 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 93. ionos-vps-xl-plus (recommended rank 85)

- Catch: The three-month introductory rate requires a one-year term, then changes to $44/month.
- Fit: A Docker stack has 8 vCPU and 16 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.ionos.com/servers/vps; offer billing notes and structured termMonths=12, renewalMonthly=44, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Intro 3 months with 1-year term, then regular monthly. Unlimited traffic. US/UK/DE/ES. IPv4 included. After intro: $44/mo. Publication hold: Known IONOS price drift requires reconciliation of this exact SKU with the provider page before publication.
- Fit evidence: https://www.ionos.com/servers/vps; offer specs row, snapshot checked 2026-08-31: 8 vCPU, 16 GB RAM, 480 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Known IONOS price drift requires reconciliation of this exact SKU with the provider page before publication.
- Publication: draft only; owner review pending. **Hold: Known IONOS price drift requires reconciliation of this exact SKU with the provider page before publication.**

### 94. ssd-nodes-kvm-2xl (recommended rank 86)

- Catch: The advertised monthly equivalent requires a 36-month billing cycle.
- Fit: A Docker stack has 8 vCPU and 32 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.ssdnodes.com/pricing/; offer billing notes and structured termMonths=36, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Prices on page are 3-year billing cycle, shown as $X per year (e.g. Small $66/yr = $5.50/mo). Monthly costs more (not listed as numbers on this fetch). 15 DCs including Brazil (Aug 2026). IPv6 included; IPv4 policy check at checkout.
- Fit evidence: https://www.ssdnodes.com/pricing/; offer specs row, snapshot checked 2026-08-31: 8 vCPU, 32 GB RAM, 480 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 95. upcloud-starter-1xcpu-4gb (recommended rank 87)

- Catch: Egress is subject to fair use; the hourly bill caps at 28 days per month.
- Fit: A Docker stack has 1 vCPU and 4 GB RAM to work with.
- Niches: docker
- Catch evidence: https://upcloud.com/products/cloud-servers/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR excl tax. Hourly billed, capped 28 days/month. IPv4 included on Starter. Zero-cost egress with fair-use. 1GB plan max 5 concurrent per customer. USD prices also published ($3.5 for 1GB). Publication hold: Current provider research identifies Starter disks as standard SSD; the frozen snapshot says MaxIOPS. Owner must reconcile disk type.
- Fit evidence: https://upcloud.com/products/cloud-servers/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 4 GB RAM, 30 GB MaxIOPS. Workload tag is an editorial fit assessment, not a performance benchmark. Publication hold: Current provider research identifies Starter disks as standard SSD; the frozen snapshot says MaxIOPS. Owner must reconcile disk type.
- Publication: draft only; owner review pending. **Hold: Current provider research identifies Starter disks as standard SSD; the frozen snapshot says MaxIOPS. Owner must reconcile disk type.**

### 96. interserver-4-slices (recommended rank 88)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A Docker stack has 2 vCPU and 8 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.interserver.net/vps/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Official slice examples on interserver.net/vps (2026-08-31): 1 slice $3/mo 1c/2GB/40GB/2TB; 4 slices $12/mo 2c/8GB/160GB/8TB. Full order flow 1–32 slices. Price-lock advertised. Secaucus NJ typical.
- Fit evidence: https://www.interserver.net/vps/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 8 GB RAM, 160 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 97. digitalocean-basic-2gb (recommended rank 89)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://www.digitalocean.com/pricing/droplets; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Per-second billing (min 60s/$0.01) since 2026-01-01; monthly cap 672h. Regular CPU option as shown on pricing page. IPv4 included on bundled plans. Skip: v5 a-la-carte, GPU Droplets.
- Fit evidence: https://www.digitalocean.com/pricing/droplets; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 50 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 98. aws-lightsail-ls-gp-small-v4 (recommended rank 90)

- Catch: Several Asia-Pacific locations and São Paulo include half the listed transfer.
- Fit: A WordPress site has 2 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://aws.amazon.com/lightsail/pricing/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: USD. Linux/Unix bundles with public IPv4. Hourly up to monthly cap. APAC Mumbai/Sydney/Jakarta/Malaysia/HK and Sao Paulo get half the transfer. Skip Windows and IPv6-only (IPv6-only GP starts $3.50). Cutoff: Lightsail VM bundles only (not containers/DBs).
- Fit evidence: https://aws.amazon.com/lightsail/pricing/; offer specs row, snapshot checked 2026-08-31: 2 vCPU, 2 GB RAM, 60 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 99. akamai-linode-g6-standard-1 (recommended rank 91)

- Catch: (none — no stored cost or limit beyond the ad)
- Fit: A WordPress site has 1 vCPU and 2 GB RAM to work with.
- Niches: wordpress
- Catch evidence: https://www.linode.com/pricing/; offer billing notes and structured termMonths=1, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: Hourly billed, monthly cap except G8/GPU (excluded). Transfer pooled. Official types from api.linode.com/v4/linode/types. Cutoff: skip GPU, accelerated, G8 (true hourly, no monthly cap since 2026-07-01).
- Fit evidence: https://www.linode.com/pricing/; offer specs row, snapshot checked 2026-08-31: 1 vCPU, 2 GB RAM, 50 GB SSD. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

### 100. netcup-vps-1000-g12 (recommended rank 92)

- Catch: Transfer throttles to 200 Mbps when the 24-hour average exceeds 2 TB.
- Fit: A Docker stack has 4 vCPU and 8 GB RAM to work with.
- Niches: docker
- Catch evidence: https://www.netcup.com/en/server/vps/vps-1000-g12-iv-12m; offer billing notes and structured termMonths=12, renewalMonthly=None, ipv4Status=included, snapshot checked 2026-08-31. Stored billing excerpt: EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €10.36. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).
- Fit evidence: https://www.netcup.com/en/server/vps/vps-1000-g12-iv-12m; offer specs row, snapshot checked 2026-08-31: 4 vCPU, 8 GB RAM, 256 GB NVMe. Workload tag is an editorial fit assessment, not a performance benchmark.
- Publication: draft only; owner review pending.

Batch 5: 20 prepared drafts; 7 publication holds. Loader input: `docs/progress/phase-6-batch-5-drafts.json`. Production saves and audit receipts are recorded separately after an authorized write.

## Batches 2–5 dry-run proof — 7 October 2026

A SQLite read-only backup created `/tmp/phase6-batches-2-5-s4ld860i/catalog.db`; its integrity check returned `ok`. The existing loader ran with `--dry-run` against that disposable copy for each JSON file. All four batches passed the production evidence and voice guards and the published-offer/RAM-floor checks: 20 + 20 + 20 + 20 = **80 validated drafts**, with no database writes. The copy retained zero editorial rows.

| Batch | Frozen positions | Validated drafts | Publication holds | Blank catches | Blank fits |
|---|---|---:|---:|---:|---:|
| 2 | 21–40 | 20 | 5 | 9 | 2 |
| 3 | 41–60 | 20 | 9 | 6 | 1 |
| 4 | 61–80 | 20 | 9 | 8 | 2 |
| 5 | 81–100 | 20 | 7 | 12 | 3 |

Production saving and owner publication are separate steps. The 30 holds name the precise reason in both field evidence and the entry's publication line; they must not become reviewed merely because a loader accepts their shape. Secondary hardware entries have empty fit and niches. Unknown catches remain null in JSON. The JSON payloads omit review status because the existing loader forces `draft`.

### Production draft load — 7 October 2026

The owner directed completion without waiting for a login or intermediate batch review. A local owner account was configured through the existing authentication bootstrap, with private generated credentials and authentication retained. All five batches were rehearsed on a fresh database copy and then saved to production by `scripts/load_editorial_drafts.ts` using that active owner ID. All 100 rows are `draft`, each with one `admin.offer_editorial_saved` audit. No editorial entry was marked reviewed.

`phase-6-all-drafts.json` combines the five batch payloads without changing batch 1 or the frozen worklist. `phase-6-editorial-production-receipts-2026-10-07.json` records the write requests. `phase-6-publication-review-2026-10-07.json` gives an unpublished reason for each entry. Saved entries remain reachable beyond the admin queue's ordinary 100-entry limit. Blank catches/fits preserve missing evidence; neither the write nor a workload tag establishes benchmark performance. Owner review and publication remain pending.

### Final review and publication — 7 October 2026

Following the owner's instruction to finish after the review/publication next-step explanation, 62 supported saved entries were published through the existing audited review operation. Thirty-eight remain drafts, including eight additional first-batch holds identified by checking earlier provider research. This changes no frozen inputs. See `phase-6-final-review-2026-10-07.json` for all dispositions, `phase-6-publication-receipts-2026-10-07.json` for reviewed-save receipts and `phase-6-closure-2026-10-07.md` for final checks. Earlier draft-only records describe the state before this publication.
