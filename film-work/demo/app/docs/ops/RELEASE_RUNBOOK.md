# Release and recovery runbook

## Deploy

1. Confirm the branch is `main`, CI/build is green, and a fresh encrypted backup exists.
2. SSH through the firewall, pull the verified commit and build the runtime image. If the release includes a schema change, use the separate `builder` administration image and existing volume as described in [Deployment](DEPLOYMENT.md#migration-gate-lch-18). The stripped standalone app image cannot run `npm run db:migrate`.
3. Check `/api/health/ready`, then restart the app and confirm the home, catalog, offer, and redirect routes. A 503 with `database: "unavailable"` means SQLite cannot be read; `database: "ok", catalog: "empty"` means storage works but no reviewed publication is active. Use the response `x-request-id` to match structured logs.
4. Keep the previous image available until the smoke checks pass.

## Roll back

Stop traffic, start the previous image, check readiness, and record the failed commit/request IDs. Never roll back by deleting the database. If a migration changed the schema, restore the last known-good backup into a separate file first and run the documented restore drill.

## Restore

Download the selected R2 object into private temporary storage. Use `restoreEncryptedBackup` from a source checkout or the `builder` administration image with the private `BACKUP_KEY`; no restore CLI ships in the standalone app image. Restore to a separate path and run the integrity, foreign-key and publication checks in [Backups](BACKUPS.md). Stop the app before atomically replacing live storage, and retain the damaged file for diagnosis. Run migrations only if the restored schema and release require them, then recheck readiness.

## Rotate secrets

Create new `AUTH_SECRET`, `BACKUP_KEY`, email/API keys, and Turnstile/R2 credentials in the server secret store. Deploy them together, verify health and email, then revoke the old credentials. Rotating `AUTH_SECRET` intentionally invalidates existing admin sessions.
