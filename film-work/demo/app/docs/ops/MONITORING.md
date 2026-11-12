# Monitoring and uptime

Use a free external HTTPS monitor (for example UptimeRobot or Cloudflare Health Checks) against:

- `https://bestvpsforme.com/api/health/live` every 5 minutes (expected 200 and `{ "ok": true }`).
- `https://bestvpsforme.com/api/health/ready` every 5 minutes (expected 200 and `database: "ok"`).

Alert after two consecutive failures, notify the private owner channel, and include the request ID from the failed response. Do not monitor `/admin` with a password or expose credentials to a third-party monitor.

The app itself remains dependency-free; the external monitor is configured in its dashboard after DNS is live.
