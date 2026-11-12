# Special offers rollout — 7 October 2026

Owner authorization: add the researched offers to production in a design-consistent special/flash offers feature without breaking the site. This does not authorize the pending editorial draft load or the queued renewal corrections.

## Published batch

`docs/research/special-offers-2026-10-07.json` contains eight new USD VPS plans and thirteen promotion highlights. Five CloudCone Halloween plans were rechecked on the [provider's current sale page](https://hello.cloudcone.com/halloween-vps-sale-2026/); all five deployment links opened the matching SKU, but totals require login. Three GreenCloud plans were advertised in stock on its [budget sale](https://greencloudvps.com/billing/store/budget-kvm-sale) and [premium sale](https://greencloudvps.com/billing/store/premium-kvm-sale): BudgetKVMNYC-3 (2 advertised), EPYCNYC-2 (5), EPYCNYC-3 (1). Stock is a dated observation, not a guarantee. GreenCloud order links redirect to the category; the category is the recorded destination and the billing notes explain this. The zero-stock BudgetKVMNYC-2 and the questionable EPYCNYC-1 link were excluded.

Five existing [RackNerd specials](https://www.racknerd.com/specials/) match the advertised specifications and annual prices. They receive highlights only; their catalog and price records stay unchanged. The broader 6 October research inventory includes regular prices, unverified and sold-out offers and is not a publication batch.

## Behavior and safeguards

- `/special-offers` and the primary navigation link use the existing typography, provider marks and hairline rows. Home shows one plan per provider, with three providers in the initial batch.
- The full billing-period amount comes first, then the monthly equivalent and checked date/source. No invented end date, discount percentage or flash countdown.
- Limited-stock highlights disappear 24 hours after checking; other highlights disappear after 72 hours. This freshness policy applies to promotion highlighting. Catalog records retain their dated sources and billing caveats; a provider's actual stock must be confirmed before ordering.
- Unpublished, inactive-provider, sold-out, expired, future-dated, duplicate and price/spec/term-mismatched highlights are hidden. Highlights belong to a specific publication snapshot, so rollback or another catalog publication hides the promotion batch until reviewed again.
- `publishImportJob` retains replacement as the default. Explicit append mode refuses existing plans and inactive providers, retains existing provider evidence and never archives the previous inventory.
- `scripts/publish_special_offers.ts` defaults to a rehearsed publication on a `/tmp` SQLite backup. `--write` requires the exact input SHA-256. It checks source/backup integrity, takes a private backup before writing, publishes atomically, verifies every existing offer/price/provider/editorial/audit row remains unchanged, and checks foreign keys.
- The CLI receipt records owner authorization and checksum with a null admin actor; it does not impersonate a logged-in author. No editorial draft, admin user, renewal, setup fee, authenticated term review or affiliate review is created.

## Operator commands

```sh
npx tsx scripts/publish_special_offers.ts --input docs/research/special-offers-2026-10-07.json
npx tsx scripts/publish_special_offers.ts --input docs/research/special-offers-2026-10-07.json --write --expected-checksum 267aecd8560dbef2da5e5193117eea7b6d7084dbac9112465853c288bb01eb4b
```

Reusing a published batch is refused. Refreshes must be re-researched and reviewed; the append importer is not a general price-update tool. The existing publication snapshot rollback restores the catalog; snapshot mismatch hides this promotion list. The private full SQLite backup is available for disaster recovery, but restoring a database while the app is running is not safe.

## Verification and final production result

Production publication succeeded with SHA-256 `267aecd8560dbef2da5e5193117eea7b6d7084dbac9112465853c288bb01eb4b`, snapshot version 6, id `341cd929-08fa-4ba3-8f54-1df8a434f4b1`. Result: **330 published plans, 13 highlights, 44 active providers**, 656 historical price records (8 added), 17 migrations, 1 site setting and 1 owner-authorized CLI audit receipt. Editorial rows and admin users remain **0**.

Private backup: `data/backups/bestvpsforme-pre-special-offers-2026-10-07T10-49-10-545Z.db`, permissions 0600, integrity `ok`. Production integrity is `ok`, foreign-key failures 0. Independent comparison against the backup confirms every original offer, price and provider row is identical. The original 322 published offers retain their publication status. All original editorial/audit rows are preserved.

Verification: 465 unit tests passed; lint, TypeScript and production build passed. The public-route browser suite includes the new page in all six screen/theme combinations and its six empty-state visual baselines. Standard, large-catalog, synthetic-admin-action, editorial and price-terms profiles passed. The final audit-profile server initially could not start because a build refresh overlapped startup; after that build completed, audit regressions passed (33 checks, 9 viewport skips), followed by settings checks (12 passed). This was a test-server timing failure, with no production writes during tests.

A separate check against the actual production database/server passed at 390, 1024 and 1440 pixels in light and dark themes: no page errors, horizontal overflow or serious/critical axe findings; all thirteen canonical plan pages returned 200. `/api/health/ready` reports database `ok`, catalog `published`. Screenshots were reviewed and saved under `docs/research/`.

The local preview on port **3115** previously ran an old build with `/tmp/bvf-real/catalog.db`. It now runs the completed standalone production build against the absolute `data/bestvpsforme.db` path. View `http://127.0.0.1:3115/special-offers`. This is a local running application; no remote host deployment or public-domain rollout was performed or claimed. The homepage shows 317 recommendation-eligible plans because its existing Trustpilot policy excludes unrated providers; all 330 remain published, and the special-offer list uses the published catalog independently of that ranking filter.

Receipts: `special-offers-production-result-2026-10-07.json`, `special-offers-production-verification-2026-10-07.json`, `special-offers-browser-verification-2026-10-07.json`.
