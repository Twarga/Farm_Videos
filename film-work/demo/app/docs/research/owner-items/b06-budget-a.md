# Owner Items: b06-budget-a

Research Date: 2026-11-01
Batch: b06-budget-a (RackNerd, BuyVM, RamNode, GreenCloudVPS, HostHatch, AlphaVPS, Evolution Host, EDIS Global)

## Missing Trustpilot Data (HTTP 403 Forbidden)
All Trustpilot domain review URLs returned HTTP 403 Forbidden when requested natively (Cloudflare bot protection prevents server-side non-browser scraping). As per research contract rules, trustpilot score, review count, and URL are left blank on all offer rows rather than retaining outdated figures:
- `RackNerd`: https://www.trustpilot.com/review/racknerd.com (HTTP 403)
- `BuyVM`: https://www.trustpilot.com/review/buyvm.net (HTTP 403)
- `RamNode`: https://www.trustpilot.com/review/ramnode.com (HTTP 403)
- `GreenCloudVPS`: https://www.trustpilot.com/review/greencloudvps.com (HTTP 403)
- `HostHatch`: https://www.trustpilot.com/review/hosthatch.com (HTTP 403)
- `AlphaVPS`: https://www.trustpilot.com/review/alphavps.com (HTTP 403)
- `Evolution Host`: https://www.trustpilot.com/review/evolution-host.com (HTTP 403)
- `EDIS Global`: https://www.trustpilot.com/review/edis.at (HTTP 403)

## Provider Specific Notes & Anomalies

### 1. RackNerd
- Official URLs checked: `https://www.racknerd.com/kvm-vps` (Standard KVM) and `https://www.racknerd.com/specials/` (Annual Specials).
- Emitted 7 standard KVM plans (`kvm-512` through `kvm-12gb`) and 5 annual specials (`special-1gb` through `special-8gb`).
- `kvm-512` is yearly only ($26.99/yr, effective $2.25/mo). Other standard plans are monthly.
- Annual specials require full upfront payment ($21.99/yr up to $119.99/yr) and maintain the same rate upon continuous renewal.

### 2. BuyVM
- Official URL checked: `https://buyvm.net/kvm-dedicated-server-slices/`.
- Emitted 4 regular slice plans (`slice-512` through `slice-4096`) and 6 High Volume plans (`hv-8gb` through `hv-28gb`).
- `slice-512` is yearly only ($24/yr, effective $2.00/mo). All other plans are monthly.
- Bandwidth is unmetered across all plans; numeric bandwidth cell is left blank with clarification in `billing_notes`.
- DirectAdmin license included free of charge on all plans.

### 3. RamNode
- Official URL checked: `https://ramnode.com/products/cloud-vps`.
- Emitted 8 Standard Cloud VPS plans (`std-0.5gb` through `std-16gb`) and 2 Lite Cloud VPS plans (`lite-1gb`, `lite-2gb`).
- Standard VPS plans include 1 IPv4 and generous bandwidth with hourly billing.
- Lite Cloud VPS plans are IPv6-only by default ($2/mo and $3/mo); IPv4 is available as an add-on at +$2/mo.

### 4. GreenCloudVPS
- Official URLs checked: `https://greencloudvps.com/budget-kvm-vps.php` and `https://greencloudvps.com/ryzen-kvm-vps.php`.
- Emitted 5 Budget KVM plans (`gcvps-ssdkvm-1` through `gcvps-ssdkvm-5`) and 5 USA/EU Ryzen KVM plans (`gcvps-ryzenkvm-1` through `gcvps-ryzenkvm-5`).
- Bandwidth differs between Western locations (USA/EU) and APAC: Budget KVM has 1.5TB to 12TB in US/EU vs 750GB to 6TB in APAC. Notes document this explicitly.

### 5. HostHatch
- Official URL checked: `https://hosthatch.com/products` (extracted from official client bundle `app.js` and `js/642.js`).
- Emitted 10 NVMe Compute VM plans (`hh-nvme-2` through `hh-nvme-96`) and 8 Storage VM plans (`hh-storage-1tb` through `hh-storage-10tb`).
- Regional pricing check: HostHatch publishes uniform USD pricing across all 16 locations for NVMe plans and 4 locations (AMS, STO, LAX, CHI) for Storage plans. In APAC (Hong Kong, Tokyo, Sydney, Singapore), bandwidth allocation is 500 GB on NVMe 2 GB instead of 1 TB.
- Prices exclude VAT/tax.

### 6. AlphaVPS
- Official URL checked: `https://alphavps.com/cheap-vps`.
- Emitted 8 C-series plans (`alpha-c2g` through `alpha-c32g`).
- Pricing is in EUR. Monthly list prices are €2.99 to €22.99; annual commitment provides a 15% discount (€2.54/mo to €19.54/mo) with guaranteed renewal lock.
- All plans include 1 IPv4 and a /64 IPv6 subnet.

### 7. Evolution Host
- Official URL checked: `https://evolution-host.com/vps-hosting.php`.
- Emitted 7 plans (`evo-starter` through `evo-ultimate`).
- Prices are in EUR, advertised inclusive of VAT where applicable.
- Regional bandwidth & pricing notes: Singapore, India, and Australia locations carry a 2x price multiplier and 200 Mbps port speed cap. Dallas location transfer allowance is 10% of listed European allocation.

### 8. EDIS Global
- Official URL checked: `https://www.edisglobal.com/vps-hosting/austria-vienna`.
- Emitted 4 Vienna NDC2 plans: `edis-vie-smart`, `edis-vie-starter`, `edis-vie-basic` (new plan observed), and `edis-vie-basic-plus`.
- Pricing in EUR excl. VAT. 1 IPv4 included; additional IPv4 available at €5/mo.
