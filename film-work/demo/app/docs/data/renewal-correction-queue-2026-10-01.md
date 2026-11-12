# Unsupported renewal correction queue — 1 October 2026

**Owner approval pending. No production terms were approved, changed, or published.**

This queue contains the exact 16 suspect current published price rows from the read-only audit backup: six Contabo, six netcup and four FastComet plans. The JSON companion preserves every stored price field, original source text, review evidence, source billing notes and exact proposed changes. Stored money amounts below are USD; source currency and conversion metadata remain in the JSON.

The preserved machine-readable worklist now lives at [`src/app/admin/terms/correction-queue.json`](../../src/app/admin/terms/correction-queue.json). The move changes packaging only; none of its proposed corrections has been applied.

Proposed correction for each named price row: set `renewal_monthly`, `terms_reviewed_at` and `terms_reviewed_by` to null. Preserve all other fields, including `renewal_source` as historical untrusted evidence. A future reviewed renewal requires new explicit evidence and a human review. These proposals remove assumptions; they do not approve replacement prices.

The public mapping now quarantines these evidence patterns. Applying database corrections and publishing a replacement snapshot remain separate owner-approved operations. The historical `data/price-terms-review-2026-08-31.json` identifies an agent reviewer and contains unsupported assumptions; it is retained as provenance and cannot pass the new standalone publication validator.

## Exact proposed rows

| Offer | Current renewal (USD/mo) | Price row | Proposed renewal |
| --- | ---: | --- | --- |
| contabo-cloud-vps-12 | 28.99 | `price_be85bd2a9dbba724808e` | Unknown |
| contabo-cloud-vps-16 | 42.91 | `price_7524041cd3c90ec0b5ce` | Unknown |
| contabo-cloud-vps-18 | 56.82 | `price_e98f78bc40b9b2e7b071` | Unknown |
| contabo-cloud-vps-4 | 6.38 | `price_18988bd5aa5cfd3029b4` | Unknown |
| contabo-cloud-vps-6 | 8.70 | `price_53bfdbef93c07b69613a` | Unknown |
| contabo-cloud-vps-8 | 16.23 | `price_ee94c0afae38d5a44864` | Unknown |
| fastcomet-cloud-5 | 241.95 | `price_c3a847f30e6b84a369e8` | Unknown |
| fastcomet-cloud-6 | 417.95 | `price_90e9793736d536302f17` | Unknown |
| fastcomet-cloud-7 | 559.95 | `price_5db1ed2eacd26687bcf2` | Unknown |
| fastcomet-cloud-8 | 719.95 | `price_53b1a145c34f4e209f1e` | Unknown |
| netcup-500-g12 | 6.85 | `price_729d36b02dd260e50574` | Unknown |
| netcup-rs-1000-g12 | 14.83 | `price_770e1dc2007480fabc6f` | Unknown |
| netcup-vps-1000-g12 | 12.01 | `price_0b33067e0091c2e9517a` | Unknown |
| netcup-vps-2000-g12 | 22.31 | `price_57f8028ae78dab516597` | Unknown |
| netcup-vps-4000-g12 | 37.58 | `price_040f0aab82099349fb6b` | Unknown |
| netcup-vps-8000-g12 | 55.59 | `price_3e8c55b70ff255c869fd` | Unknown |

## Evidence preserved for owner review

### Contabo Cloud VPS 12 — `contabo-cloud-vps-12`

- [ ] Owner approval pending for `price_be85bd2a9dbba724808e`.
- Stored effective / renewal / due today / setup (USD): `28.99` / `28.99` / `None` / `None`.
- Term / intro / upfront months: `24` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).

### Contabo Cloud VPS 16 — `contabo-cloud-vps-16`

- [ ] Owner approval pending for `price_7524041cd3c90ec0b5ce`.
- Stored effective / renewal / due today / setup (USD): `42.91` / `42.91` / `None` / `None`.
- Term / intro / upfront months: `24` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).

### Contabo Cloud VPS 18 — `contabo-cloud-vps-18`

- [ ] Owner approval pending for `price_e98f78bc40b9b2e7b071`.
- Stored effective / renewal / due today / setup (USD): `56.82` / `56.82` / `None` / `None`.
- Term / intro / upfront months: `24` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).

### Contabo Cloud VPS 4 — `contabo-cloud-vps-4`

- [ ] Owner approval pending for `price_18988bd5aa5cfd3029b4`.
- Stored effective / renewal / due today / setup (USD): `6.38` / `6.38` / `None` / `None`.
- Term / intro / upfront months: `24` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).

### Contabo Cloud VPS 6 — `contabo-cloud-vps-6`

- [ ] Owner approval pending for `price_53bfdbef93c07b69613a`.
- Stored effective / renewal / due today / setup (USD): `8.7` / `8.7` / `None` / `None`.
- Term / intro / upfront months: `24` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).

### Contabo Cloud VPS 8 — `contabo-cloud-vps-8`

- [ ] Owner approval pending for `price_ee94c0afae38d5a44864`.
- Stored effective / renewal / due today / setup (USD): `16.23` / `16.23` / `None` / `None`.
- Term / intro / upfront months: `24` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR including VAT; advertised as effective monthly for 24-month subscription.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR including VAT; advertised as effective monthly for 24-month subscription. Excl-VAT list also shown (4.40/6.00/11.20/20.00/29.60/39.20). Unlimited traffic fair-use. IPv4 included. Cutoff: Core Cloud VPS only (Performance VPS is a separate line, not fully tabulated in fetch).

### FastComet Cloud 5 — `fastcomet-cloud-5`

- [ ] Owner approval pending for `price_c3a847f30e6b84a369e8`.
- Stored effective / renewal / due today / setup (USD): `241.95` / `241.95` / `None` / `None`.
- Term / intro / upfront months: `1` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: A listed price or contract term was used to infer renewal.

Exact stored renewal evidence:

> Note: 'Price as listed on additional-plan table (no separate intro).' Flat rate.

Exact offer billing notes:

> USD. Official vps-pricing: intro then regular. Cloud 1 mentioned as from $46.16/mo on same page footnote. Fully managed + cPanel. Price as listed on additional-plan table (no separate intro).

### FastComet Cloud 6 — `fastcomet-cloud-6`

- [ ] Owner approval pending for `price_90e9793736d536302f17`.
- Stored effective / renewal / due today / setup (USD): `417.95` / `417.95` / `None` / `None`.
- Term / intro / upfront months: `1` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: A listed price or contract term was used to infer renewal.

Exact stored renewal evidence:

> Note: 'Price as listed on additional-plan table (no separate intro).' Flat rate.

Exact offer billing notes:

> USD. Official vps-pricing: intro then regular. Cloud 1 mentioned as from $46.16/mo on same page footnote. Fully managed + cPanel. Price as listed on additional-plan table (no separate intro).

### FastComet Cloud 7 — `fastcomet-cloud-7`

- [ ] Owner approval pending for `price_5db1ed2eacd26687bcf2`.
- Stored effective / renewal / due today / setup (USD): `559.95` / `559.95` / `None` / `None`.
- Term / intro / upfront months: `1` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: A listed price or contract term was used to infer renewal.

Exact stored renewal evidence:

> Note: 'Price as listed on additional-plan table (no separate intro).' Flat rate.

Exact offer billing notes:

> USD. Official vps-pricing: intro then regular. Cloud 1 mentioned as from $46.16/mo on same page footnote. Fully managed + cPanel. Price as listed on additional-plan table (no separate intro).

### FastComet Cloud 8 — `fastcomet-cloud-8`

- [ ] Owner approval pending for `price_53b1a145c34f4e209f1e`.
- Stored effective / renewal / due today / setup (USD): `719.95` / `719.95` / `None` / `None`.
- Term / intro / upfront months: `1` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: A listed price or contract term was used to infer renewal.

Exact stored renewal evidence:

> Note: 'Price as listed on additional-plan table (no separate intro).' Flat rate.

Exact offer billing notes:

> USD. Official vps-pricing: intro then regular. Cloud 1 mentioned as from $46.16/mo on same page footnote. Fully managed + cPanel. Price as listed on additional-plan table (no separate intro).

### netcup VPS 500 G12 — `netcup-500-g12`

- [ ] Owner approval pending for `price_729d36b02dd260e50574`.
- Stored effective / renewal / due today / setup (USD): `6.85` / `6.85` / `None` / `None`.
- Term / intro / upfront months: `12` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR incl. 19% VAT. 12-month ... from official product page €5.91.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €5.91. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).

### netcup RS 1000 G12 — `netcup-rs-1000-g12`

- [ ] Owner approval pending for `price_770e1dc2007480fabc6f`.
- Stored effective / renewal / due today / setup (USD): `14.83` / `14.83` / `None` / `None`.
- Term / intro / upfront months: `12` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: A listed price or contract term was used to infer renewal.

Exact stored renewal evidence:

> Note: 'EUR incl. 19% VAT. RS 1000 G12 12-month from official product page €12.79. 12-month term; 1-month term costs more (+€2.59).'

Exact offer billing notes:

> EUR incl. 19% VAT. RS 1000 G12 12-month from official product page €12.79. Other G12 VPS/RS sizes: specs from netcup public G12 lineup; monthly prices left empty where the public matrix did not show a firm number (UNVERIFIED). 12-month term; 1-month term costs more (page showed +€2.59 vs 12-month).

### netcup VPS 1000 G12 — `netcup-vps-1000-g12`

- [ ] Owner approval pending for `price_0b33067e0091c2e9517a`.
- Stored effective / renewal / due today / setup (USD): `12.01` / `12.01` / `None` / `None`.
- Term / intro / upfront months: `12` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR incl. 19% VAT. 12-month ... €10.36.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €10.36. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).

### netcup VPS 2000 G12 — `netcup-vps-2000-g12`

- [ ] Owner approval pending for `price_57f8028ae78dab516597`.
- Stored effective / renewal / due today / setup (USD): `22.31` / `22.31` / `None` / `None`.
- Term / intro / upfront months: `12` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR incl. 19% VAT. 12-month ... €19.24.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €19.24. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).

### netcup VPS 4000 G12 — `netcup-vps-4000-g12`

- [ ] Owner approval pending for `price_040f0aab82099349fb6b`.
- Stored effective / renewal / due today / setup (USD): `37.58` / `37.58` / `None` / `None`.
- Term / intro / upfront months: `12` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR incl. 19% VAT. 12-month ... €32.41.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €32.41. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).

### netcup VPS 8000 G12 — `netcup-vps-8000-g12`

- [ ] Owner approval pending for `price_3e8c55b70ff255c869fd`.
- Stored effective / renewal / due today / setup (USD): `55.59` / `55.59` / `None` / `None`.
- Term / intro / upfront months: `12` / `None` / `None`.
- Historical reviewer: `devin-agent-review (delegated by owner; evidence-only approvals)`; stored review timestamp: `1790796032894`.
- Reason: The evidence explicitly says renewal was not stated.

Exact stored renewal evidence:

> Note: 'EUR incl. 19% VAT. 12-month ... €47.94.' No renewal change stated; flat rate.

Exact offer billing notes:

> EUR incl. 19% VAT. 12-month, no-preference Europe, IPv4+IPv6 from official product page €47.94. Traffic flatrate (throttle to 200 Mbps if 24h average exceeds 2 TB).

## Rehearsal only

A separate SQLite backup at `/tmp/bestvpsforme-audit-20261001/renewal-correction-rehearsal.db` rehearsed the exact null-only changes. Assertions confirmed: 16 current rows changed; only the three proposed fields changed; every other price record stayed equal; publication snapshots stayed equal. The source audit copy and real database were not changed. No snapshot was created.

## Future approval artifacts

The batch script validates the whole artifact before opening the target database or fetching FX. It requires `reviewedBy` and an `approval` object with `actorType: "human"`, matching `approvedBy`, an ISO `approvedAt`, and a nonempty `reference` identifying actual human approval of those exact terms. These fields record provenance; they do not authenticate a person. An agent-prepared file or a delegated research task is insufficient. No such approval is supplied by this queue.

Each `terms` entry must contain evidence in `renewalSource`, valid nonnegative money amounts and positive whole month counts where supplied. Intro amount and duration must be reviewed together. Unsupported renewal language is rejected even if approval metadata exists. Cash-only reviews may leave renewal null. The script applies only named published offers; omitted or skipped offers are not cleared. Authenticated admin review/publication uses the same evidence guard without inferring an actor role from the reviewer ID.
