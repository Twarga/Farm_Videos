# Low-cost operations schedule

The app does not need a hosted job platform. Run these commands from the repository on a small cron job, GitHub Actions schedule, or a private machine. They are read-only until an editor reviews and updates a record.

## Offer rechecks (daily)

```sh
npx tsx scripts/recheck_offers.ts --strict > data/offer-recheck.json
```

The command exits `2` when a published offer has no current source, no current price, or a price check older than 14 days. Keep the JSON as a short-lived artifact and review the queue in the admin Data quality view before changing public data.

## Review rule

Never silently change a price because a scheduled check failed. Open the provider page, capture the checked date and source URL, then publish a new price snapshot through the authenticated admin flow.

## Commercial snapshots (weekly)

```sh
npx tsx scripts/recheck_commercial.ts > data/commercial-recheck.json
```

Review old Trustpilot snapshots and affiliate-program records. Refresh the source date and notes only after checking the provider or Trustpilot page. Commercial availability never changes the organic recommendation score.

## Destination links (daily)

```sh
npx tsx scripts/check_destination_links.ts
```

This is a safe, no-network check. It rejects non-HTTPS or missing official and public-affiliate URLs before they reach the redirect route. A passing syntax check is not a substitute for reviewing redirects and provider availability when a link is changed.

## Correction email retention (daily)

```sh
15 3 * * * cd /srv/bestvpsforme && npm run ops:purge-corrections
```

Resolved corrections keep the sender's email for 90 days so a reply is possible; after that the command nulls the address. The claim, cited source and resolution note stay. Run it from the administration image or host checkout that carries `scripts/purge_correction_emails.ts`; a non-zero exit means the purge did not run and should be treated as an incident. A public-web deployment must not skip this job because the address is the only personal data the corrections queue stores.
