# Terms evidence refresh, 12 October 2026

This review uses a consistent read-only SQLite backup and first-party sources. It makes no production mutation, price approval, snapshot publication or held-editorial publication.

## Actual public coverage

The public mapper reports 330 offers, 43 guard-accepted reviewed-term records, 31 usable renewals and four complete projections. Those four are `liquid-web-lw-{1,2,4,6}g`.

The admin terms queue reports 71 rows: 28 open, 16 quarantined and 27 reviewed records still lacking a setup fee. The original frozen 47-target worklist and its dispositions remain historical evidence. The 16 quarantined records do not become eligible just because a stored numeric renewal exists.

The earlier audit's proposal to complete 47 plans by adding a setup fee was wrong. The correct setup-only cohort is 27 rows today. The 38 editorial drafts retain their evidence holds.

## First-party checks

| Provider | Source checked | Observed evidence | Disposition |
| --- | --- | --- | --- |
| Hostinger | [KVM VPS pricing](https://www.hostinger.com/vps-hosting) | Provider Markdown lists KVM 1/2/4/8 intro and renewal prices, terms of 1/12/24 months and upfront billing. No explicit VPS provisioning fee was found in this source. | Setup remains unknown. Do not infer zero from free backups, software or onboarding. |
| DreamHost | [Self-managed VPS](https://www.dreamhost.com/hosting/vps/) and [managed VPS](https://www.dreamhost.com/hosting/managed-vps/) | The self-managed page confirms the stored Stack 4/8/16/32 intro/renewal amounts: 8.99/15.99, 13.99/21.99, 22.99/34.99 and 45.99/59.99 USD. Managed VPS is a different product. No explicit provisioning fee was found in either retrieved source. | Keep the products distinct. Existing Stack setup fees remain unknown. |
| IONOS | [US VPS+ pricing](https://www.ionos.com/servers/vps) | Explicit “Unlimited traffic and no setup fees.” M+/L+/XL+/XXL+ list 5/14, 8/25, 14/47 and 20/68 USD for promo/regular prices, with a three-month promo and one-year term. Stored intro amounts are 4/6/11/18. | Preserve the documented price-drift hold. Do not combine today's zero fee with old prices to claim a newly verified complete projection. |
| ScalaHosting | [Managed cloud pricing](https://www.scalahosting.com/managed-cloud-hosting.html), reached from its VPS URL | The provider's machine-readable table distinguishes 36-month, 12-month and monthly prices and explicit renewal prices. Free SPanel or website migration does not establish a server provisioning fee. | Setup remains unknown; verify the exact term before changing a plan. |
| FastComet | [Cloud VPS pricing](https://www.fastcomet.com/vps-pricing) | The table has explicit renewal prices for Cloud 2/3/4. “Free Site Setup” and “Free Website Setup” describe website services, not a VPS provisioning fee. | Setup remains unknown. Cloud 5–8 stay in the protected correction worklist. |
| Time4VPS | [Linux VPS](https://www.time4vps.com/linux-vps/) and [alternate VPS page](https://www.time4vps.com/vps-hosting) | Both first-party fetches returned HTTP 403. A domain-restricted search found other official pages, but no usable plan-specific setup evidence. | Needs an accessible provider checkout or written provider confirmation. Search snippets cannot approve a fee. |
| Liquid Web | [Current pricing](https://www.liquidweb.com/pricing/) | The retrieved source distinguishes a $5 1-GB plan and introductory promotions on other current tiers. It does not supply a new explicit provisioning-fee value. | Retain the four previously reviewed zero-fee records and their original evidence. This fetch is not a replacement approval. |

## Closure decision

The code continues to withhold unsupported prices and prose. The Phase 6 closure explicitly permits moving to Phase 7 while these named evidence holds remain enforced (`docs/progress/phase-6-closure-2026-10-07.md`). They are not permission to fabricate zero fees or backdate a verification.

Further data publication needs plan-specific provisioning evidence, correct SKU/term/region matching and the existing authenticated review operation. No new rows meet that complete standard in this refresh, so this review approves no data writes.
