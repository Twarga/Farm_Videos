# Owner checklist — V1 data refresh (2026-11-01)

Per-batch detail (URLs, excerpts, anomalies): `docs/research/owner-items/b01…b11-*.md`. Evidence: `docs/research/evidence/`. Raw research: `data/research/batches/`. Published dataset: `data/vps-offers-2026-11-01.csv` (staged and published to `data/bestvpsforme.db`, snapshot 8, 457 offers; 330 offers / 41 providers are publicly eligible).

## 1. EUR/GBP rows: done 1 Nov

The 172 held rows (20 providers) are published. The ECB publishes no rate on Sundays, so they use the ECB reference of Friday 2026-10-30 (USD 1.1172 per EUR; GBP derived 1.3399). Each price row stores the rate and the rate date. The site now shows euro and pound plans in their own currency (for example "€6.14/mo · ≈ $6.86") with a small notice that dollar figures are converted at the ECB rate and may differ at checkout. Rule change: `getUsdRate` falls back to the latest ECB rate up to 4 days before the check date, never a later one.

## 2. Trustpilot

Entered from your screenshots (checked 2026-11-01): Vultr 1.5/587, VirMach 1.2/914 (page is "Virtual Machine Solutions LLC"; I assumed virmach.com for the link, please confirm), CloudCone 1.9/127, Servarica 3.4/27, HostHatch 2.7/93, Yourserver 3.3/3, VDSina 2.8/26, UltaHost 3.6/1,895, Cockbox 3.2/1, Kamatera 4.3/393. Still without a rating (listed as "Trustpilot not published"): Fasthosts, Strato, OrangeWebsite. Vultr and Kamatera were set to `active` on 1 Nov (`scripts/set_provider_status.ts`, audited).

## 3. Provider status needs an admin login (I have no admin password/TOTP)

- Vultr: 44 plans published, provider is `draft` → set `active` once Trustpilot is entered. Pricing page loaded normally this time (no 403).
- Kamatera: 3 fixed presets published, provider `draft`.
- Hetzner: every Cloud plan shows "This product is currently unavailable" on the official page (2026-11-01). Out-of-stock plans are not importable (no stock model), so the provider stays `archived` with 0 plans. Rows kept in `data/research/batches/b01-hetzner-ovh.csv`.
- `aws-lightsail-aws` duplicate provider (draft): delete or merge — needs your confirmation.

## 4. Providers not published

| Provider | Reason |
|---|---|
| Hosteons | 403 on hosteons.com and my.hosteons.com |
| Bluehost VPS, HostGator VPS | 403 Cloudflare challenge on site and checkout |
| A2 Hosting | rebranded to hosting.com; VPS cards unpriced, cart pre-launch |
| PQ Hosting | shut down 2026-05-30 (rebranded THE.Hosting) |
| Letbox | only 4 fixed plans, all out of stock; 5 series are configurable |
| InterServer, HOSTKEY | 403; old 2026-08-31 rows still published (stale) |
| Atlantic.net | 403 on all endpoints; old rows retained (stale) |
| Servarica | 31 of 47 plans out of stock, not imported (16 imported) |

## 5. Terms approval (human sign-off required)

Replace-mode import creates new price rows with no reviewed terms: published "reviewed" count went from 59 to 0. A draft carrying 28 unchanged-price terms forward is at `data/price-terms-review-2026-11-01.draft.json` (31 others need fresh review: price changed or not re-checked). It is **not approved**; `scripts/apply_price_terms_publish.ts` rejects agent approval. New intro-price plans (Hostinger, IONOS, UltaHost, Strato, Fasthosts, InMotion, Hostwinds…) also need per-plan renewal review.

## 6. Plans that vanished from official pages (dropped from the published set)

alibaba-cloud aliyun-ssd-starter, fastcomet cloud-1, liquid-web lw-1g, GreenCloud sale rows (budgetkvmnyc-3-sale, epycnyc-2-sale, epycnyc-3-sale), netcup G12 range (replaced by G12.5, held per section 1), OVHcloud VPS-5/6 (retired June 2026), Cherry Servers "virtual-from".

## 7. Needs a human regardless

- Sign-off on Privacy, Terms and Affiliate disclosure copy.
- One screen-reader journey (NVDA or VoiceOver) recorded in `docs/qa/`.
- Linode marketing page returned 403; prices verified from the official REST API `api.linode.com/v4/linode/types` instead. Accept or re-check manually.

## 8. Removed on 1 Nov at your request (sites that block automated checks)

VirMach, InterServer, HOSTKEY and Atlantic.net are no longer published (their providers are archived). Never added: Hosteons, Bluehost, HostGator. Akamai Linode stays: its marketing page blocks automated reads, but its prices come from Linode's official public API.
