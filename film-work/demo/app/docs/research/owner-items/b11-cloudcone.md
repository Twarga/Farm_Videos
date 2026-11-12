# Owner items: Batch b11-cloudcone (2026-11-01)

## Provider Identity
- **Provider**: CloudCone
- **Official site**: `https://cloudcone.com/`
- **HQ Country**: US (CloudCone, LLC, Los Angeles, California, United States)
- **Primary Datacenters**: Los Angeles, CA, USA (DC1, DC4)

## BLOCKED providers & plans
- None. CloudCone official pricing pages (`cloudcone.com/vps/`, `cloudcone.com/cloud-servers/`, and `hello.cloudcone.com/halloween-vps-sale-2026/`) and order forms (`app.cloudcone.com`) were fully accessible.

## Trustpilot snapshot findings
- **CloudCone**: `https://www.trustpilot.com/review/cloudcone.com` returned HTTP 403 Forbidden on automated fetch. Per contract rule 4, `trustpilot_score`, `trustpilot_reviews`, and `trustpilot_url` are left blank on all rows pending browser-based snapshot verification.

## Out-of-stock locations & legacy plans
- **SSD VPS 1 (St. Louis DC1)**: On `app.cloudcone.com/vps/516/create?token=ssd-vps-1`, location option "St. Louis, MO - DC1, $26/yr" is disabled and marked "(Out of Stock)". The primary Los Angeles, CA - DC4 location is in stock at $28/yr and was emitted.
- **Legacy promo plans**: Older promotional links such as `https://app.cloudcone.com/vps/9/create?token=preblackfriday-vps-5` explicitly show "This plan is out of stock." and were not emitted.

## Regular Plans vs Promotional Status
- **Standard Regular KVM VPS (6 plans emitted)**: `ssd-vps-1` through `ssd-vps-6` from `https://cloudcone.com/vps/`. Standard catalog VPS plans, prepaid annually ($28, $46, $69, $92, $174, $322/yr; equivalent to $2.33–$26.83/mo). Same-rate renewal; in stock in Los Angeles DC4.
- **Scalable Cloud Compute SC2 (6 plans emitted)**: `sc2-starter` through `sc2-premium` from `https://cloudcone.com/cloud-servers/`. Standard catalog KVM cloud VMs with hourly and monthly billing ($0.00699/hr–$0.08480/hr; $5.20–$63.09/mo). Includes managed firewall and cloud metrics.
- **Halloween Sale Plans (5 plans emitted, existing in DB)**: `frankenstein-26-ssd-vps-1` through `frankenstein-26-ssd-vps-5` from `https://hello.cloudcone.com/halloween-vps-sale-2026/` remain active, deployable, and in-stock today (2026-11-01). Slugs match the current DB offers. Tagged `promo`. Provider states "Lifetime Recurring Offer" renewing at initial rates ($20.25, $37.00, $49.00, $69.00, $119.99/yr), with no published sale end date. Note: promotional plans cannot be upgraded or resource-swapped.
- **Unstaged Secondary Promo Campaign**: `https://hello.cloudcone.com/cc-turns-9-sale-yearly-vps/` (CC Turns 9 sale, plans `bday26-vps-1`..`6`, $18.28–$449.99/yr) is also currently live, but was not in the DB and not emitted to keep catalog focused.
