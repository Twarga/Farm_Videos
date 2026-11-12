# Deployment readiness — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Local deployment artifacts pass. Production deployment remains blocked by owner infrastructure access.**

## Local evidence

| Check | Result |
|---|---|
| Deployment artifact contract | `npm run launch:deployment-check` passed |
| Container build engine | Podman available; Docker daemon not installed |
| Base image | `node:24-bookworm-slim` pulled successfully from Docker Hub |
| Image build | `podman build --pull=never -t bestvpsforme:r7-06 .` passed |
| Image runtime user | `appuser` |
| Persistent data path | `/app/data` |
| Liveness smoke | `GET /api/health/live` returned HTTP 200 and `{"ok":true,"check":"live"}` |
| Empty runtime database | `GET /api/health/ready` returned HTTP 503 with `database: "ok", catalog: "unavailable"` |
| Build context | `.dockerignore` excludes env files, runtime databases, credentials, build output, dependencies, Git, and local artifacts |
| Native dependency build | Build-only `python3`, `make`, and `g++` install allows `better-sqlite3` to compile; runner remains based on the slim Node image |
| TLS proxy | Caddy serves both `bestvpsforme.com` and `www.bestvpsforme.com`, compresses responses, removes the Server header, and proxies to the private app port |

The initial container build failed because the slim dependency stage lacked native build tools. `Dockerfile` now installs those tools only in the dependency stage. The successful rebuild used the exact command above.

## External blockers

R7-06 cannot claim production deployment from this worktree. The owner must supply and operate:

1. Selected Debian/Ubuntu VPS with 2 vCPU, 4 GB RAM, 40+ GB SSD, automatic security updates, and a provider firewall.
2. Admin source IP for SSH restriction and the host’s persistent storage.
3. Production DNS access for `bestvpsforme.com` and `www`, plus Cloudflare proxy/TLS settings.
4. Production secret values and secret-store access for `AUTH_SECRET`, admin credentials/MFA, database path, email, Turnstile if enabled, and R2.
5. A real encrypted off-host backup bucket and its credentials.
6. Email routing and authenticated outbound email credentials.
7. Monitoring destination credentials and authority to receive a test alert.

## Required server sequence

Run on the selected host from a clean checkout, after secrets are placed outside Git:

```sh
cp .env.example .env.production
# Fill secrets on the server; never commit this file.
podman compose -f docker-compose.production.yml build
podman compose -f docker-compose.production.yml up -d
podman compose -f docker-compose.production.yml run --rm app npm run db:migrate
curl -fsS https://bestvpsforme.com/api/health/live
curl -fsS https://bestvpsforme.com/api/health/ready
```

If the host uses Docker, replace `podman` with `docker`. Complete R7-07 and R7-08 before opening traffic. Do not mark the production deployment complete from local container evidence.
