# Provider and plan expansion research — 24 Oct 2026

Status: **research candidates, not publishable facts.** Every row in `data/research/provider-candidates-2026-10-24.csv` must go through the staged import + terms review in the admin panel before it can appear on the site (Scope §6.1, OPS-02).

## How this was gathered
- Official pricing pages fetched on 24 Oct 2026: Hetzner Cloud, DigitalOcean Droplets, OVHcloud VPS, Contabo VPS, Kamatera, Hostinger VPS.
- Vultr's pricing page blocked automated access (HTTP 403). Search engines rate-limited further queries. Those providers are listed below as **to research**, with no numbers.
- Third-party sites (costgoat, comparedge, vpsdex, whtop) were only used as hints. No number in the CSV comes from them.
- Trustpilot scores were not collected. Fill them from each provider's Trustpilot page during review; the public catalog hides providers without a reviewed Trustpilot snapshot (`filterOffers` rule).

## Catalog today (mockup fixture, 317 plans, 41 providers)
Strong coverage: DigitalOcean 31, AWS Lightsail 25, Akamai Linode 23, Scaleway 22, GreenCloudVPS 13.
Thin coverage of the most-searched brands: **Hostinger 4, Contabo 6, OVHcloud 4, IONOS 4, netcup 6**.
**Missing completely: Hetzner, Vultr, Kamatera, HostHatch, Cloudzy, Hosting.com (A2), Contabo Storage VPS.**

## Findings worth acting on
| Provider | Finding | Action |
|---|---|---|
| Hetzner | Not in catalog. Cloud lineup renamed (CPX02/CPX12/CPX22…); regular-performance from €6.49/mo excl. VAT, cost-optimized from €5.99, dedicated from €43.49. Several types showed "currently unavailable". SIN1 includes only 0.5 TB traffic. | Add provider + 3–6 plans. Record EUR, VAT basis "excluded", availability, per-location traffic. Most-requested missing brand. |
| DigitalOcean | Basic Regular 1 GiB is now **$6.00** (was $5 in older data); per-second billing since 1 Jan 2026. | Re-check all 31 DO rows; price increase likely affects the catalog. |
| Hostinger | VPS page lists KVM 2 at **$8.79** (catalog: $8.99). KVM 1 $6.49, KVM 4 $12.99, KVM 8 $25.99. | Re-check intro + renewal + 24-month term. |
| OVHcloud | New "2027" VPS range: VPS-1 4 GB $4.54, VPS-2 8 GB $8.50, VPS-3 12 GB $12.32, VPS-4 24 GB $23.37 ("from" prices). Daily backup included. | Replace old VPS rows after confirming term and renewal. |
| Contabo | Cloud VPS page shows paired prices (€5.50 / 4.40 …) next to an incl./excl. VAT toggle. Could not tell current vs struck-through. | Verify in a real browser before import. |
| Kamatera | Basic 1 vCPU/1 GB/20 GB NVMe/5 TB $4; Standard 2 vCPU/2 GB $25; Pro 2 vCPU/4 GB $39. No long-term contract. | Add as new provider. |
| IONOS | Secondary sources say intro prices for 12–18 months then much higher renewal (e.g. VPS M $4 → $8). Official page not parsed. | Verify renewal on the official terms; strong "the catch" candidate. |

## To research (no data captured)
Vultr, HostHatch, Cloudzy, Hosting.com (A2), InterServer (2 rows only), Hostwinds, Namecheap, ScalaHosting, Webdock, netcup (new G12 range), IONOS full range, Akamai pricing page (https://www.akamai.com/cloud/pricing), Contabo Storage VPS.

## Import steps (admin)
1. Fill Trustpilot score/count/URL/date for each new provider.
2. Upload the CSV in **Admin → Imports** as a staged job; resolve validation issues.
3. In **Admin → Terms**, record intro length, renewal, setup fee, IPv4, VAT basis with evidence links and screenshots in `docs/data/`.
4. Publish a new snapshot; confirm `npm run data:check` and the public parity checks pass.
