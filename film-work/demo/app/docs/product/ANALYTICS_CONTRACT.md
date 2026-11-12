# Analytics contract

This is the small, privacy-first event vocabulary for bestvpsforme. Analytics helps answer which VPS pages people use and which commercial links are useful; it never changes editorial ranking.

## Events

| Event | When | Required fields |
|---|---|---|
| `page_view` | A public page is viewed | `path`, `page_type` |
| `catalog_search` | A search/filter state is applied | `path`, `query_hash`, `result_count` |
| `compare_add` | A plan enters the comparison bench | `offer_id`, `placement` |
| `affiliate_click` | A user leaves through `/go/[id]` | `offer_id`, `provider_id`, `placement`, `destination_kind` |

## Legacy Finder compatibility

`finder_start` and `finder_complete` are retired event names. Current ingestion rejects them, and current dashboard reports whitelist only the active event vocabulary above. The `analytics_events.event_name` column remains unconstrained text so historical Finder rows require no destructive migration and remain queryable for an explicit historical analysis. Do not delete, rename, or reinterpret those rows as current product activity.

## Privacy and retention

- Never store raw IP addresses, full user-agent strings, names, email addresses, or URL query values that may contain personal data.
- A visitor session is an opaque, rotating random identifier; it is not an account and is not used for cross-site tracking.
- Store a coarse country code and device class only when available from the request edge.
- Keep event rows for 13 months, then aggregate or delete them. Keep confirmed financial records for the period required by tax/accounting rules.
- Respect a consent/analytics opt-out signal. Essential redirect handling may continue without analytics.

## Metric definitions

- **Outbound rate** = unique sessions with `affiliate_click` ÷ unique sessions with a public page view.
- **Click-through rate** = `affiliate_click` events ÷ public page views.
- Retired Finder events are excluded from every current visitor, country, funnel, and rate denominator.
- If event storage is unavailable, ingestion returns HTTP 202 with `{ "ok": true, "recorded": false }` and an `x-request-id`; public navigation and outbound redirects continue without claiming the event was stored.
- Commission and revenue are imported provider facts; they are never inputs to organic catalog ordering.

## Redirect performance target

`/go/[id]` performs only local SQLite reads and one best-effort local event write. The target is p95 server handler time below 100 ms in production; no analytics or provider network request is allowed on the redirect critical path. A slow analytics write is swallowed so the user still receives the 302.
