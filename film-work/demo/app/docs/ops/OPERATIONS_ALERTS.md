# Operations alerts

Scheduled checks should fail loudly in the job log and may also notify one private webhook. Set `OPS_ALERT_WEBHOOK_URL` in the deployment environment only; never commit it or put it in a browser bundle.

```sh
OPS_ALERT_WEBHOOK_URL="https://your-private-webhook.example" npx tsx scripts/recheck_offers.ts --strict
```

The shared alert helper limits details to ten lines and uses a five-second timeout. Use the same contract for failed imports, backups, destination checks, and meaningful click-drop checks. A missing webhook is intentionally allowed for local development.

Minimum owner routine:

- Treat a non-zero scheduled command as an incident to review.
- Include the run date, check name, count, and first affected IDs.
- Do not put visitor identifiers, provider credentials, or commission exports in alerts.
