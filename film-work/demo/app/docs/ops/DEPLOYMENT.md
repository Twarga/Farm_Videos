# Small production deployment

## VPS baseline (LCH-14)

Use one current Debian/Ubuntu VPS with 2 vCPU, 4 GB RAM, 40+ GB SSD, automatic security updates, and a provider firewall. Allow inbound TCP 22 only from your admin IP, plus 80/443. Keep SQLite on the attached persistent volume. Do not provision until the domain, backup bucket, and owner credentials are ready.

## Reproducible deploy (LCH-15)

```sh
cp .env.example .env.production
# Fill secrets on the server; never commit this file.
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml up -d
```

The image runs Next standalone as an unprivileged user. The database is mounted at `/app/data` and survives container replacement.

For a local standalone preview, run `npm run build`, then `node .next/standalone/server.js` with the preview's database and host/port environment. The build's `postbuild` step supplies static bundles, fonts, provider artwork, guide content and social-preview branding. Use a disposable `/tmp` database for verification and restart the server after rebuilding.

## TLS proxy (LCH-16)

Caddy terminates HTTPS, renews certificates, compresses text, and forwards only to the private app container. Point DNS to the VPS before starting Caddy.

## Environment and DNS (LCH-17)

Cloudflare DNS should proxy `bestvpsforme.com` and `www` only after origin HTTPS works. Keep `AUTH_SECRET`, database path, email credentials, Turnstile secret, and R2 credentials in the server secret store. Never expose them as `NEXT_PUBLIC_*` variables.

## Migration gate (LCH-18)

Back up the SQLite file before any schema change. The standalone runtime does not contain `scripts/migrate_db.ts`, `drizzle/` or the administration toolchain; `npm run db:migrate` in the app container fails. Build a separate administration image from the existing `builder` target. Keep development tools out of the public runtime.

Set `RELEASE_COMMIT` to the verified release revision and `DATA_VOLUME` to the existing SQLite volume. Inspect the volume first; a typo must not create an empty replacement on upgrade. New installations must initialize the reviewed database and volume ownership for UID 1001 before this step.

```sh
: "${RELEASE_COMMIT:?Set the verified release revision}"
: "${DATA_VOLUME:?Set the existing SQLite volume name}"
docker volume inspect "$DATA_VOLUME" --format '{{.Name}}' &&
docker build --target builder -t "bestvpsforme-admin:$RELEASE_COMMIT" . &&
docker run --rm --user 1001:1001 --env-file .env.production -e HOME=/tmp \
  --mount "type=volume,source=$DATA_VOLUME,target=/app/data" \
  "bestvpsforme-admin:$RELEASE_COMMIT" npm run db:migrate &&
docker run --rm --user 1001:1001 --env-file .env.production -e HOME=/tmp \
  --mount "type=volume,source=$DATA_VOLUME,target=/app/data" \
  "bestvpsforme-admin:$RELEASE_COMMIT" npm run check:db-ready
```

Migrations 0017 and 0018 add the `corrections` table and its approved-staged-row link, so a database still on 0016 cannot serve the corrections queue or accept a public correction. Run the migration before the app container starts; `/api/health/ready` fails while `__drizzle_migrations` is behind the committed journal, so an un-migrated server never reports ready. If a future migration fails, keep traffic closed and restore the backup to a separate path before replacing live storage.
