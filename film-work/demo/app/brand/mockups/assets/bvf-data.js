/*
  Mockup data. Specs, providers, Trustpilot figures, and billing notes come
  from data/vps-offers-2026-08-31.csv (checked 31 Aug 2026).
  "real" = 3-year real price: total cost over the first 36 months ÷ 36,
  including required terms, intro periods, and renewals stated in the
  provider's own billing notes. EUR converted at an ILLUSTRATIVE 1.09 rate;
  the product must use a dated published rate (bigone.md B1 D12).
  Affiliate flags are illustrative only.
*/
window.BVF = {
  snapshot: "31 Aug 2026",
  counts: { plans: 314, providers: 41 },
  offers: [
    { id: "alphavps-c4g", provider: "AlphaVPS", logo: "alphavps.png", plan: "C4G", cpu: 2, ram: 4, disk: 40, diskType: "NVMe RAID-10", transfer: "5 TB", flags: ["bg", "de", "gb", "us"], trust: 4.7, reviews: 128, ad: 4.35, real: 4.35, today: 4.35, renew: 4.35, term: 1, catch: "Small review base: 128 Trustpilot reviews.", fit: "Cheapest real price for 4 GB in this snapshot. Flat renewal.", affiliate: false },
    { id: "ovhcloud-vps-1", provider: "OVHcloud", logo: "ovh.svg", plan: "VPS-1", cpu: 2, ram: 4, disk: 40, diskType: "NVMe", transfer: "Unlimited*", flags: ["fr", "de", "gb", "ca", "us", "sg", "au"], more: 5, trust: 3.9, reviews: 6501, ad: 4.54, real: 4.54, today: 4.54, renew: 4.54, term: 1, catch: "APAC regions cap traffic at 500 GB, then 10 Mbps.", fit: "Most locations at this price.", affiliate: true },
    { id: "racknerd-special-4gb", provider: "RackNerd", logo: "racknerd.png", plan: "Specials 4 GB KVM", cpu: 3, ram: 4, disk: 60, diskType: "SSD", transfer: "7 TB", flags: ["us"], trust: 4.3, reviews: 374, ad: 5.0, real: 5.0, today: 60.0, renew: 5.0, term: 12, catch: "Billed yearly: $60.00 today. Promo stock changes often.", fit: "Most vCPU per dollar.", affiliate: true },
    { id: "netcup-500-g12", provider: "netcup", logo: "netcup.svg", plan: "VPS 500 G12", cpu: 2, ram: 4, disk: 128, diskType: "NVMe", transfer: "Flat*", flags: ["de", "at", "nl", "us"], trust: 4.1, reviews: 2373, ad: 6.44, real: 6.44, today: 6.44, renew: 6.44, term: 12, catch: "12-month minimum. Throttled to 200 Mbps above 2 TB/day average.", fit: "128 GB NVMe, the most disk at this price.", affiliate: false },
    { id: "hostinger-kvm-1", provider: "Hostinger", logo: "hostinger.svg", plan: "KVM 1", cpu: 1, ram: 4, disk: 50, diskType: "NVMe", transfer: "4 TB", flags: ["us", "gb", "fr", "lt", "nl", "in", "br", "sg"], more: 3, trust: 4.7, reviews: 66058, ad: 6.49, real: 8.32, today: 155.76, renew: 11.99, term: 24, catch: "Pay 24 months upfront ($155.76). Renews at $11.99/mo.", fit: "Biggest review base. Beginner-friendly panel.", affiliate: true },
    { id: "time4vps-linux-4", provider: "Time4VPS", logo: "time4vps.png", plan: "Linux 4", cpu: 2, ram: 4, disk: 50, diskType: "SSD", transfer: "8 TB", flags: ["lt"], trust: 4.8, reviews: 1216, ad: 4.77, real: 9.42, today: 4.77, renew: 9.55, term: 1, catch: "Intro price. Renews at €8.76/mo, double the first bill.", fit: "Highest Trustpilot score in the 4 GB tier.", affiliate: false },
    { id: "ionos-vps-m-plus", provider: "IONOS", logo: "ionos.svg", plan: "VPS M+", cpu: 2, ram: 4, disk: 120, diskType: "NVMe", transfer: "Unlimited", flags: ["us", "gb", "de", "es"], trust: 4.7, reviews: 41348, ad: 4.0, real: 10.42, today: 4.0, renew: 11.0, term: 12, catch: "$4 lasts 3 months. Then $11/mo on a 1-year contract.", fit: "Unlimited traffic, 120 GB NVMe.", affiliate: true },
    { id: "upcloud-starter-1x4", provider: "UpCloud", logo: "upcloud.svg", plan: "Starter 1 × 4 GB", cpu: 1, ram: 4, disk: 30, diskType: "MaxIOPS", transfer: "Fair use", flags: ["fi", "de", "nl", "gb", "us", "sg", "au"], trust: 3.9, reviews: 144, ad: 10.9, real: 10.9, today: 10.9, renew: 10.9, term: 1, catch: null, fit: "Hourly billing, capped at 28 days a month.", affiliate: false },
    { id: "scaleway-dev1-m", provider: "Scaleway", logo: "scaleway.svg", plan: "DEV1-M", cpu: 3, ram: 4, disk: null, diskType: "billed extra", transfer: "Included", flags: ["fr", "nl"], more: 1, trust: 1.6, reviews: 299, ad: 16.07, real: 16.07, today: 16.07, renew: 16.07, term: 1, catch: "Storage and public IPv4 cost extra. Trustpilot 1.6.", fit: "European provider, per-hour billing.", affiliate: false },
    { id: "digitalocean-basic-4", provider: "DigitalOcean", logo: "digitalocean.svg", plan: "Basic 4 GiB", cpu: 2, ram: 4, disk: 80, diskType: "SSD", transfer: "4 TB", flags: ["us", "ca", "gb", "nl", "de", "sg", "in", "au"], more: 2, trust: 4.6, reviews: 2284, ad: 24.0, real: 24.0, today: 24.0, renew: 24.0, term: 1, catch: null, fit: "Per-second billing. Best docs for beginners.", affiliate: true },
    { id: "linode-4gb", provider: "Akamai Linode", logo: "akamai.svg", plan: "Linode 4GB", cpu: 2, ram: 4, disk: 80, diskType: "SSD", transfer: "4 TB", flags: ["us", "ca", "gb", "de", "fr", "in", "jp", "sg", "au", "br"], more: 8, trust: 2.1, reviews: 204, ad: 24.0, real: 24.0, today: 24.0, renew: 24.0, term: 1, catch: "Trustpilot 2.1. Extra IPv4 now billed hourly.", fit: "Pooled transfer across servers.", affiliate: false }
  ],
  /* All 36 published 4 GB plans with a Trustpilot snapshot (effective monthly, as stored). */
  tier4: [3.99, 4, 4.38, 4.54, 5, 5.91, 6.49, 8.71, 8.99, 9, 10, 12, 14.74, 15, 15.99, 16, 17, 18.99, 20, 20, 20, 20.1, 24, 24, 24, 24.46, 24.59, 24.99, 27.99, 28.79, 29.95, 33, 42, 42, 43, 53.87],
  /* Counts = published plans with a Trustpilot snapshot and RAM ≥ floor (DB query, 28 Sep 2026). "from" = lowest stored effective price above $0, not yet currency-corrected. */
  workloads: [
    { id: "wordpress", label: "WordPress site", ram: "2 GB+", from: 2.15, count: 272 },
    { id: "n8n", label: "n8n automations", ram: "2 GB+", from: 2.15, count: 272 },
    { id: "coolify", label: "Coolify / PaaS", ram: "4 GB+", from: 3.99, count: 234 },
    { id: "docker", label: "Docker stack", ram: "4 GB+", from: 3.99, count: 234 },
    { id: "game", label: "Game server", ram: "8 GB+", from: 5.5, count: 180 },
    { id: "vpn", label: "Private VPN", ram: "1 GB+", from: 0.43, count: 298 }
  ]
};
