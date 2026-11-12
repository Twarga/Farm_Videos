# Owner operating checklist

Keep the project small: one owner, one main branch, and a few repeatable checks.

## Daily (10 minutes)

- Run `npx tsx scripts/recheck_offers.ts --strict` and review every queued offer.
- Run `npx tsx scripts/check_destination_links.ts` and fix any invalid URL before publishing.
- Check the admin Data quality queue; do not publish records with missing renewal or source evidence.
- Look at click and outbound-error counts. A sudden drop is a question to investigate, not a reason to change ranking.

## Weekly (30 minutes)

- Run `npx tsx scripts/recheck_commercial.ts` and refresh old affiliate/Trustpilot snapshots.
- Run the complete quality gate: `npm run lint && npm run build`.
- Review corrections, provider messages, and the activity/audit log.
- Confirm the latest database backup can be opened (restore test, not just file existence).

## Monthly (45 minutes)

- Review the CSV source date and publication snapshot; archive offers that no longer exist.
- Review affiliate disclosures and the methodology page for accuracy.
- Rotate access credentials if a collaborator or service changed.
- Test `/robots.txt`, `/sitemap.xml`, one offer page, one correction submission, and one redirect.
