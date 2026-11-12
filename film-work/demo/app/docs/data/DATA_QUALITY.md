# VPS research data quality

## Dataset and intended use

- File: `data/vps-offers-2026-08-31.csv`
- Snapshot date: 31 August 2026
- Grain: one researched VPS or compute plan per `provider + plan_slug`
- Rows: 457
- Columns: 24
- Providers: 63
- Currencies represented: 307 USD, 143 EUR, 7 GBP
- Intended use: source research for a staged production import, not direct publication

## Checks performed

- Required schema and identity fields
- Candidate-key uniqueness using `provider + plan_slug`
- Exact duplicate rows
- Numeric parsing and non-negative values
- Required effective monthly price
- URL and ISO date formats
- Missingness by technical and commercial field
- Presence of affiliate-management fields

Run the repeatable check with:

```bash
npm run data:check
```

## Findings

### High — one row cannot be published

`Cherry Servers / Virtual Server (from)` at CSV row 289 has no `effective_monthly_usd`.

Impact: the catalog cannot sort, filter, normalize, or explain the plan’s price reliably.

Remediation: obtain a real effective price or import the row into staging with `publish_status = blocked` until it is complete.

### Medium — incomplete technical specifications

| Field | Missing | Rate | Interpretation |
| --- | ---: | ---: | --- |
| RAM | 10 | 2.2% | Mostly from-price, PaaS, dedicated, or incomplete plans |
| vCPU | 10 | 2.2% | Same mixed product types as RAM |
| Disk | 46 | 10.1% | Some compute providers price storage separately |
| Bandwidth | 146 | 31.9% | Often unmetered, text-only, variable, or location-dependent |
| Trustpilot score/reviews | 8 | 1.8% | Some providers have no reliable public snapshot |

Impact: incomplete rows can make comparison and workload recommendations misleading.

Remediation:

- Preserve `unknown` instead of inventing zero.
- Add `product_type` and field-level `not_applicable` support.
- Require RAM, CPU, disk, and effective price for ordinary VPS publication.
- Allow separate validation rules for dedicated, PaaS, free-tier, and from-price records.

### Medium — affiliate information is not represented in the CSV

The CSV has no `affiliate_status`, `affiliate_url`, `affiliate_network`, `commission`, or `affiliate_checked_date` fields.

Impact: the application cannot distinguish direct, affiliate, closed-program, partner-only, applied, approved, or rejected providers using this file alone.

Remediation: do not copy affiliate fields into every plan row. Import `data/affiliate-signup-difficulty-2026-08-31.md` into a separate provider-level affiliate table with program status, signup difficulty, application status, network, URL, commercial terms, and last verification date.

### Low — research vocabulary needs normalization

`ipv4`, `cpu_type`, and `locations` contain useful detailed text but many variants.

Impact: direct filters would create duplicate or confusing choices.

Remediation: retain original text and add normalized fields:

- IPv4: included, extra, shared, IPv6-only, unknown
- CPU allocation: shared, dedicated, burstable, unknown
- Architecture: x86, ARM, mixed, unknown
- Locations: normalized country and city records plus original source text

## Positive evidence

- No duplicate `provider + plan_slug` keys
- No exact duplicate rows
- No malformed official or Trustpilot URLs
- All checked dates are valid ISO dates from the documented snapshot
- No negative numeric values

## Publish gate

A row may be published only when:

1. Provider and plan identity are present and unique.
2. Official source URL and verification date are valid.
3. Effective monthly price and currency are known.
4. The product type is known.
5. Ordinary VPS rows include RAM, vCPU, disk, and location.
6. Controlled fields normalize successfully or are explicitly marked unknown.
7. An operator reviews warnings and approves the row.

Rows that fail stay in staging and appear in the admin data-quality queue.

## Automated checks to keep

- Schema compatibility
- Unique provider/slug key
- Required-field completeness by product type
- Numeric validity and non-negative ranges
- Currency and date acceptance
- URL validity and scheduled link health
- Provider foreign-key coverage
- Price freshness and price-change warnings
- Affiliate-status freshness at provider level

## Assumptions

- `effective_monthly_usd` is the normalized comparison price for this research snapshot.
- Missing technical values are unknown or not applicable, not zero.
- Research rows can be broader than the final public VPS catalog.
- Affiliate commission must never affect editorial rank.
