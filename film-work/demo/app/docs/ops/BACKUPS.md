# Encrypted backups and retention

Set `BACKUP_KEY` in the server secret store (24+ characters). Never commit it or print it in job logs.

From a source checkout with installed dependencies:

```sh
BACKUP_KEY="$BACKUP_KEY" DATABASE_URL="$DATABASE_URL" BACKUP_DIR="$BACKUP_DIR" npm run db:backup
```

Use absolute `DATABASE_URL` and `BACKUP_DIR` paths when targeting deployment storage. The template uses `/app/data/backups` for local encrypted artifacts on the persistent volume. The script opens the source read-only, uses SQLite’s online backup API and encrypts the snapshot with AES-256-GCM into a mode-0600 file.

The standalone app image has no backup/migration scripts or `tsx` CLI. On a container deployment, use the [source-bearing builder administration image](DEPLOYMENT.md#migration-gate-lch-18), with the existing data volume and private environment:

```sh
: "${RELEASE_COMMIT:?Set the verified release revision}"
: "${DATA_VOLUME:?Set the existing SQLite volume name}"
docker volume inspect "$DATA_VOLUME" --format '{{.Name}}' &&
docker run --rm --user 1001:1001 --env-file .env.production -e HOME=/tmp \
  --mount "type=volume,source=$DATA_VOLUME,target=/app/data" \
  "bestvpsforme-admin:$RELEASE_COMMIT" npm run db:backup
```

The app does not upload backups. Use an operator-configured S3-compatible `rclone`/`aws s3` client to upload the encrypted artifact to private R2 over TLS. R2 template variables are operator inputs, not an automatic application integration. Retain the local file until the uploaded object is verified.

After a successful run the script writes a heartbeat to the application database (`site_settings`, key `ops.backupHeartbeat`) with the UTC time, relative file path, byte size and SHA-256 of the encrypted artifact. `/admin/health` shows it and warns once it is older than 26 hours; a failed heartbeat write fails the command so the missing evidence is not silent.

Initial retention: 14 daily backups, 8 weekly backups, and 6 monthly backups. Delete only after a newer copy exists and the bucket listing confirms it.

## Restore drill

Run `npx tsx scripts/check_backup_restore.ts` from the source checkout to verify a synthetic encrypted round trip, exact schema/all-row preservation, SQLite integrity and foreign keys, mode 0600, and wrong-key rejection without a partial plaintext file. The drill discovers source tables; no historical table count is pinned.

For a real backup drill, download the encrypted object into private temporary storage and use the exported `restoreEncryptedBackup(backupPath, separateTargetPath, secret)` primitive from `src/lib/backup.ts` in the administration workspace. Never restore over the live database as a test. Verify `PRAGMA integrity_check`, `PRAGMA foreign_key_check`, active publication identity and published-offer count, then start the isolated app against that restore and verify `/api/health/ready`.

The 12 October [local security/backup receipt](../qa/phase-7/security-backup-results.json) preserves all 23 tables and 330 published offers. The [restored standalone smoke](../qa/phase-7/standalone-results.json) verifies healthy public routes against a decrypted copy. These do not establish an off-host R2 upload, download or owner alert.
