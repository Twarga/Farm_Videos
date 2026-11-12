# bestvpsforme — product strategy, research and full release scope

Research date: 23 October 2026 (UTC).
Status: recommendations for discussion, not approved implementation or a deployment promise.
Reader shortcut: [one-page roadmap](ROADMAP_START_HERE.md).
Supersedes the earlier REMAKE_AND_SCOPE_2026-10-23.md proposal where they disagree.

## 1. The decision in one minute

**Build one trusted VPS decision engine. Offer it through a website first, then alerts, then an API, CLI and MCP.**

- **V1:** the useful comparison app, remade in the living TwargaOps artistic world.
- **V1.5:** a reason to return: reviewed price history, watchlists and real alerts.
- **V2:** developers and AI agents access the same facts through an API, CLI and MCP.
- **V3:** recurring revenue from agencies and integrators, if they prove willing to pay.
- **Not now:** buying servers for users, holding cloud credentials, becoming a hosting company, or building an agent framework.

The CLI is a distribution channel, not a second database or a second product. MCP is an adapter for agents, not a reason to invent a chatbot.

## 2. What this research does and does not establish

This combines repository inspection with primary-source web research. It examined the public TwargaOps and twarga.tech pages, competitor product pages, provider affiliate terms, MCP documentation, email rules, search guidance and data licensing. Sources are linked in section 19.

**Verified:** what the inspected files say and what the fetched official pages currently state.
**Historical evidence:** release receipts and data counts from October 7–12. They are not a fresh audit of production today.
**Recommendations:** release boundaries, validation gates, pricing experiments and operating targets below.
**Not established:** demand, market size, likely conversion rates, willingness to pay, affiliate acceptance, or reliable revenue projections. No customer interviews or new application test suite were run for this report. Some searches were rate-limited and Vultr's affiliate page was blocked; those gaps are not treated as negative findings.

### Corrections to earlier advice

1. **The latest company brand is not just the old v5 tile set.** BRAND.md explicitly says the bear itself is the company mark. The deployed company experience is the cinematic character world. Bestvpsforme should develop a crab-derived mark from that world, not automatically copy the older horizon tile. [L1, L2, S01]
2. **The company does not currently have one identical font stack everywhere.** The v4 site uses Ubuntu Sans; twarga.tech uses Patrick Hand, Work Sans and JetBrains Mono. Reconcile the current family intentionally instead of calling an old font choice the universal standard. [L3]
3. **The 38 held editorial drafts are not automatically 38 launch blockers.** Phase 6 explicitly permits progress while unsupported editorial stays private. Any unsafe public price or claim is a blocker; safe omissions and documented private holds are not, by themselves. [L4]
4. **A dark screenshot does not prove a broken light default.** Stored theme or system state may explain it; test in a clean browser before claiming a defect.
5. **An animation library does not inevitably break the budget.** The recorded first-load headroom is small, but code splitting, removing other code and selective loading can change the result. Measure the remade build. Do not weaken the denominator or defer essential controls to claim a pass. [L5]
6. **Historical snapshots are a starting point, not proof of continuous price tracking.** Their payloads, dates, plan identity and comparability need an audit before plotting a chart.
7. **Double opt-in is a recommended consent-proof and anti-abuse control, not a universal legal requirement in every jurisdiction.** Requested alerts and general marketing must not silently become the same subscription. [S10]

## 3. Product definition from zero

### Who it serves first

**Primary:** practical self-hosters and independent developers choosing a VPS for n8n, Coolify, a small website, Docker services or a VPN.

Their question is not “which provider pays the best commission?” It is:

> Which server fits my needs, what will I actually pay, and what am I missing?

**Secondary, later:** freelancers and agencies making this decision repeatedly; developers building comparison into their workflows; agents acting on a human's explicit constraints.

Do not launch by serving beginner buyers, enterprise FinOps teams, GPU training teams, bargain collectors and cloud resellers equally. Their evidence, support and product needs differ.

### The core promise

**A small, explainable shortlist with dated cost evidence and visible uncertainty.**

A decision should answer:
- Does it meet my CPU, memory, disk and region constraints?
- What is due now, what is the billing commitment, and what happens at renewal?
- Which charges are included, extra, usage-dependent or unknown?
- When was the evidence captured and reviewed?
- Why did this plan appear above another?
- Is the outbound action an affiliate link or a direct link?

“Best” means best for stated constraints and the documented ordering, not a universal winner.

### Positioning

**Bestvpsforme is the honest server-selection desk for builders.**

The crab finds the right shell. The data proves why it fits. Art earns recognition; evidence earns trust.

## 4. Market research: where the opportunity actually is

| Product | Observed strength | Strategic implication |
|---|---|---|
| Server Hunter | Its own site advertises a very large multi-provider inventory and extensive technical/billing filters. [S03] | Competing on raw listing count alone is a poor starting strategy. Make the decision simpler and better explained. |
| VPSBenchmarks | Publishes performance trials, price-range rankings and screener/comparison tools. It also advertises provider subscriptions and private trials. [S04] | Specs alone are not performance proof. Do not call hardware sorting a benchmark. Independent test methodology could become a later investment. |
| LowEndBox | Publishes hosting offers, budget-focused categories and editorial content. [S05] | A new deals blog is not enough. Differentiate through normalized terms, evidence and watchability. |
| Spare Cores | Offers vendor-neutral cloud data, benchmarks, historical prices and API/telemetry-related products. [S06, S07] | API and data intelligence already have competitors. Start with the indie VPS buyer and differentiated billing evidence, not a vague “all cloud data” pitch. |
| Provider websites and APIs | First-party facts and direct checkout, but their own provider's inventory. Vultr's plans endpoint returned structured pricing/location fields. [S08] | Providers are source inputs and purchasing destinations. Cross-provider normalization is your work, not theirs. |

Competitor inventory and benchmark counts are vendor claims, not independently audited here. A feature not visible in a fetched page is not proof that a competitor lacks it.

### The wedge worth testing

“Find a sensible VPS for this workload and budget, with renewal and hidden-cost caveats explained.”

Potential defensibility comes from accumulated work:
1. Stable plan identity across provider renames and revisions.
2. Dated evidence for billing terms, renewal, setup fees, IP and transfer assumptions.
3. Change history that distinguishes a genuine price change from a new SKU or FX movement.
4. Trust in a published, money-blind selection method.
5. Repeat distribution through alerts, developer tools and integrations.

Neither a mascot, a generic AI chat box nor another affiliate directory is a durable moat by itself.

## 5. What exists today and what can be reused

The repository already contains:
- Catalog filtering/sorting and shareable query state.
- Compare, canonical offer pages, provider inventories and outbound redirects.
- Publication/import/review flows, corrections and a private admin.
- Price records, FX records, publication snapshots and snapshot offer payloads.
- Affiliate program records, conversion/revenue tables and analytics.
- A small existing public offers endpoint.

Useful anchors:
- src/lib/catalog.ts: filterOffers and sortOffers.
- src/lib/public-catalog.ts: getPublicCatalogState and published-row mapping.
- src/app/api/public/offers/route.ts: published offers JSON, optional ID selection, unavailable state.
- src/db/schema.ts: offerPrices, fxRates, publicationSnapshots, publicationSnapshotOffers, providerAffiliatePrograms, affiliateConversions and affiliateRevenue.

The existing JSON route is **not** a finished developer platform: no versioned external contract, documented filtering/pagination product, service limits or commercial access model was established by that handler inspection. Treat it as a useful seed, not a complete API launch.

Historical October 12 receipts record 330 published offers, 62 reviewed editorial entries and 38 held drafts. These are not verified current production counts. The README still calls the application pre-production. Repository references to a “production database” do not prove a public deployment.

The last recorded local release receipt reports 497 unit and 891 browser checks passing, with a strict catalog first-load receipt of 118,706 gzip bytes. That does not certify the future design or today's online service. [L5]

## 6. The remake: genuinely TwargaOps, still a comparison tool

### Design direction

Use **the living character/art world of current TwargaOps**, not a Highlighter skin with one swapped icon.

- Hermit Crab / The Shell Shopper is the bestvpsforme character already described in the shared lore.
- Patchwork rendering for web and film; Pixel rendering for terminal tools. This matches the company's current character rules. [L1]
- Explore a crab/shell silhouette for the identity mark; make small-size and mono variants. The final logo is a design decision, not an already-approved asset.
- Use the existing shell violet and crab coral as starting references, not assumed accessible UI colors. Define semantic light/dark tokens and test contrast.
- Carry stitched texture, pen/ledger details, scene lighting and purposeful drawings into the product. Keep the data surface calm.
- Define a current suite typography contract. A practical proposal is readable suite sans for UI and mono/tabular numerals for numbers; handwriting only for limited editorial moments if it survives usability review.

### Three visual layers

1. **Identity:** mark, wordmark, color relationships, typography and “by TwargaOps.”
2. **Story:** a compact living crab/shell scene on the homepage; film is optional to watch, never required.
3. **Workspace:** readable filter rail, rows, comparisons and receipts. No artwork behind prices, rough strokes through numbers, or mascot faces used as form controls.

The homepage can feel cinematic without turning catalog navigation into a long scroll film. A visitor should reach the real plans immediately.

### Motion contract

- Hero: subtle breathing, looking and shell inspection; pause offscreen and when the page is hidden.
- Filter application: concise state feedback. A small story scene may react, but filters/results must not wait for it.
- Compare selection: clear selected state and accessible count, without moving the target away.
- Empty state: the crab can investigate an empty shell; plain text explains what to change.
- Loading: show real loading, not fabricated analysis or “AI is checking prices” theater.
- Reduced motion: finished stills, no lost information, no forced looping.
- Keyboard, touch and screen readers remain full first-class paths.

Company BRAND.md says avatars belong in the story canvas, not generic buttons/navigation chrome. Reuse that discipline rather than scattering a crab across every cell. [L1]

### The stack decision

**Keep Next.js, React and the existing domain/backend by default.** React can support SVG, canvas, CSS motion and lazy-loaded story rendering. Svelte components cannot simply be imported unchanged, but the underlying framework-neutral renderer/assets can be adapted.

First prototype ONE home scene and ONE catalog screen on the current stack. Change the stack only if a measured integration, maintenance or rendering constraint justifies migration. Aesthetic dissatisfaction is not evidence that the framework is incapable.

Do not copy the company story site's documented roughly 600 MB full-walk memory cost into a shopping/comparison app. Give the product its own phone CPU/memory and motion budgets. [L2]

Before implementation, explicitly update PRODUCT.md, DESIGN.md and the design invariants of PRODUCT_CONTRACT.md. The current contract binds the old Highlighter choices and public no-search policy; silently breaking it would create contradictory tests and documentation. Preserve its integrity/security/publication rules.

## 7. V1 — the version to launch

**Outcome: a visitor can choose a suitable VPS, understand the evidence, and leave confidently.**

### Must ship

**Brand and UI**
- New approved crab-derived identity with favicon, social card and light/dark variants.
- Shared company visual language, compact living homepage scene and reduced-motion alternative.
- Consistent catalog, offer, compare, provider, guide and system-state components.
- Touch/keyboard operation, readable mobile layout and accessible text/controls.

**Buying decision**
- Browse/filter plans by practical constraints already supported by reliable data.
- Compare a small shortlist; share the comparison/filter URL.
- Canonical offer receipt: advertised amount, billing period, upfront amount, renewal, relevant fees, evidence dates, original currency and explicit unknowns.
- Reviewed normalized/36-month totals only when the complete supporting terms are approved. Do not generalize a reviewed stamp to every field.
- Clear disclosure beside affiliate actions; direct links remain available for non-partners.
- Methodology, corrections, privacy and publication/update record.

**Email, tightly bounded**
- One optional “Watch this plan” subscription, with confirmation, purpose and easy unsubscribe.
- Only promise an actual price-change alert if a reviewed-publication trigger, matching-plan comparison, queue/retries/deduplication and suppression controls are operating and tested.
- If this would delay launch, ship a clearly labelled “Notify me when price alerts launch” signup instead. That is a waitlist, not a working alert product; do not relabel it as one.
- No account required to browse or compare. An inbox confirmation/magic link can manage a watch without building passwords and profiles.

**Operating safety**
- Approve and refresh the public launch subset; keep unsupported rows/claims held.
- Complete current-build release, performance and accessibility checks, including a real screen-reader journey.
- Verify HTTPS, health checks, backups AND restore, monitoring, admin auth, rollback and real outbound destinations on the target deployment.

### Not in V1

CLI, MCP, paid subscriptions, autonomous provisioning, user reviews, a new benchmark lab, a general AI assistant, a provider marketplace and a mandatory account system.

### Launch gate

A small approved catalog that works is acceptable. An enormous uncertain catalog is not a better MVP. Every published price must have its required basis and every public claim must stay within its evidence. Private unresolved editorial is allowed to remain private; it must not leak into recommendations.

Release is gated by safety and demonstrated core journeys, not completing every future feature in this report.

## 8. V1.5 — retention and decision depth

**Outcome: visitors return because something useful changed.**

Priority order:
1. **Reliable price watches:** threshold, digest frequency, currency/region/billing basis and quiet controls. Deliver reviewed changes only.
2. **Honest price history:** minimum meaningful observations, gaps labelled, SKU identity preserved. Explain advertised vs normalized vs converted prices. Do not draw a smooth year-long line from two observations.
3. **Saved shortlists/filter watches:** start with shareable URLs and inbox links; add accounts only when the workflow needs them.
4. **Workload guidance:** a few transparent paths for Docker, n8n, WordPress, Coolify or VPN using evidence-backed assumptions. Existing workload tags are a foundation, not proof of tested capacity.

Helpful secondary additions: explain tax/IPv4/transfer assumptions, show why a result fails a constraint, expand providers where users actually request coverage, and a human-friendly changed-since-last-visit view.

A workload picker would explicitly revisit the paused Finder decision. Do not quietly resurrect the old feature under another name. A web text-search/command palette remains out of scope unless the owner intentionally changes the current no-search decision.

### Demand check before more scope

Interview 10–15 people who recently chose a VPS; observe five real selection tasks. Ask what changed their choice, what was unclear, whether an alert would matter, and what they use now. These are proposed research tasks, not interviews already conducted.

Advance based on repeated successful tasks and returning use, not a large email list alone. No mandatory subscriber quota should hold an otherwise safe V1 hostage.

## 9. V2 — API, CLI and MCP

**Outcome: the same trusted evidence is available inside developer and agent workflows.**

### Shared architecture

Reviewed sources → staging and review → versioned published snapshot → one query/cost/selection service → website, JSON API, CLI and MCP adapters.

No separate agent ranking. No stale private draft feed. No “AI-adjusted” price. No LLM arithmetic as the source of truth.

### Build order

1. **Versioned read-only API** with documented schema, filters, pagination, limits and error/freshness semantics.
2. **Thin CLI** if terminal-first developers are the first real testers; it can also serve agents through structured output.
3. **Thin MCP adapter** if users' actual agent clients prefer native tools. Pilot with those clients, not every hypothetical integration.

CLI and MCP can be parallel beta adapters after the API contract is stable. Neither needs to delay V1. If customer evidence strongly favors MCP first, swap adapter order without duplicating the engine.

### Minimum API contract

Return plan identity and provider SKU, native currency, billing basis, region/location applicability, specs, source URLs, observed/reviewed/published times, snapshot ID, confidence/review scope, unknowns, caveats, comparison explanation and commercial-link metadata.

Expose these separately:
- Market price change versus FX conversion change.
- Advertised monthly equivalent versus actual due-today amount.
- Unavailable data versus no matching results.
- Source claims versus independently measured benchmarks.

Provide deterministic sorting, documented tie-breaks and explainable exclusions. Include JSON schema/OpenAPI, version policy, rate limits, bounded result sizes, request IDs, caching/ETag strategy and a changelog. The current no-store unversioned endpoint needs deliberate evolution, not cosmetic renaming.

### CLI beta scope

Proposed command name: bvp, subject to registry/name availability.

- Find by RAM, budget, region, CPU architecture and billing constraints.
- Show one plan's receipt and evidence.
- Compare supplied plan IDs.
- Print machine-readable JSON and plain terminal output.
- Optional “open in browser” only after explicit user action; never open a referral during a list/query.
- Correct exit codes, timeouts, shell completion, non-TTY output and clear unavailable-data errors.
- Pixel crab in an interactive greeting/help only; no animation, ANSI noise or banners in JSON/pipes.

A small TypeScript client can reuse schemas; Go is a valid distribution choice if single-binary demand is demonstrated. Do not pick a language before establishing the distribution need.

### MCP beta scope

Read-only proposed tools:
- find_offers: deterministic filtering with bounded results.
- get_offer: one dated receipt and sources.
- compare_offers: structured differences with unknowns preserved.
- explain_cost: scenario calculation from reviewed terms with explicit assumptions.
- get_price_history: only after valid comparable history exists.

An agent request such as “Compare EU servers under my budget for this workload; show renewal and IP assumptions” should produce cited options, not a purchase.

No cloud credentials, checkout, payment, create_server, SSH or installation tool in this release.

### Compatibility and security

- Pin a supported MCP specification/SDK combination and test named client versions. The fetched latest documentation points to the 2026-07-28 revision and describes message-oriented/stateless behavior; older revisions used initialization/session behavior. Do not splice different revisions' handshake/transport requirements together. [S14, S15]
- Offer the minimum supported transport set for actual pilot clients. Stdio and remote HTTP have different deployment and auth risks.
- For protected remote access, implement the current MCP authorization requirements rather than assuming a bespoke API-key header works in every client. Use scoped credentials; validate intended audience; do not pass client tokens through to providers. [S16, S17]
- Public read-only access still needs bounded inputs, quotas, caching, abuse controls and cost monitoring. Read-only does not mean risk-free.
- Treat imported provider text as untrusted DATA. Structured tool output must not execute instructions, fetch arbitrary user-provided URLs or expose credentials/private admin data. Sanitize display HTML and allowlist outbound domains.
- Tool annotations and descriptions do not enforce read-only behavior; authorization and server code must enforce it.

### Agent discovery

Publish a useful API quickstart, schemas, examples, limitations and canonical human pages. Register a verified MCP package/server only when it exists. Maintain discoverable docs and accurate structured metadata.

A llms.txt file is optional documentation convenience, not a search-ranking requirement or guaranteed distribution channel. Google's AI-feature guidance emphasizes ordinary search fundamentals and accurate accessible content; do not sell yourself a magic “AI SEO” project. [S12]

### Demand gate

Proposed gate before maintaining multiple adapters: ten real repeated developer/agent workflows, two external integration pilots, and measured data-service operating cost. These are management hypotheses, not industry benchmarks.

## 10. V3 — professional and partner intelligence

**Outcome: recurring customers pay for repeated value, not for basic truth.**

Possible first paid audience: agencies, freelancers and small platforms that repeatedly compare infrastructure or prepare client proposals.

Candidate paid features:
- More saved scenarios, monitored requirements and advanced digest controls.
- Exportable comparison reports with evidence, dates and assumptions.
- Team workspaces, internal notes and shared shortlist decisions.
- Higher-volume API quotas, history export, webhooks and integrations.
- Licensed data products for permitted reuse, with an explicit freshness/service agreement.

Keep the public comparison, evidence, corrections and ranking policy free. Do not sell a badge, “reviewed” status or a ranking position.

### Pricing research, not a price list

Test willingness to pay with at least three potential recurring customers before building billing. A solo pricing hypothesis might test roughly USD 9–19/month for repeated monitoring/report work; a small developer API tier might test USD 29–99/month. These are interview anchors, not validated market prices or commitments.

Also test the null hypothesis: most VPS shoppers buy once and will never want a subscription. If so, prioritize affiliate revenue and B2B repeat workflows instead of forcing consumer Pro.

Offer a paid pilot before a large platform build. Quote enterprise redistribution only after licensing/support costs are understood. Do not advertise an SLA on a solo-operated experimental service without a support plan.

## 11. Larger opportunities — a menu, not a backlog to implement now

| Opportunity | Earliest sensible stage | Evidence required / main risk |
|---|---|---|
| Renewal reminders | V1.5 | Explicit user request; known personal renewal date, not inferred from a catalog snapshot. |
| Region/IPv4/transfer-aware total-cost calculator | V1.5–V2 | Correct provider rules and user usage assumptions. |
| Availability/restock watches | V1.5–V2 | Reliable permitted stock data; do not claim “live” from a dated page. |
| Open-source embeddable comparison widget | V2 | Partner demand, license, attribution and update mechanism. |
| Browser extension | V2+ | Demonstrated repetitive task the website/CLI cannot solve; browser permissions and maintenance. |
| Provider-submitted evidence portal | V2+ | Saves reviewer time; providers cannot self-approve publication. |
| Signed/traceable dataset releases | V2+ | Audit trail and redistribution rights, useful offline consumer demand. |
| Telegram/Discord notifications | V2+ | Users request the channel; spam, identity and consent controls. |
| Independent benchmark cohorts | V3 | Budget for multiple repeatable trials, controlled methodology and variability reporting. |
| Migration planning report | V3 | Explicit storage/network/architecture assumptions; no guaranteed savings without measurement. |
| Read-only footprint import | V3 | Security review, minimum scoped access and proof of useful recommendations. |
| Team procurement support | V3 | Real agency/SMB workflows, support capacity and conflict policy. |
| GPU or dedicated-server vertical | Separate validated expansion | Different supply, benchmarks and buyer needs; not a checkbox extension. |
| Geography/language expansion | After workflow works | Qualified translation and local tax/currency/terms understanding. |
| Dataset research reports | V3 | Real historical observations and a paying research audience. |
| Deployment recipes with Yeast/other tools | Later integration | The target tool genuinely supports that environment; never imply a local VM tool already provisions remote providers. |

Avoid a forum/user-review network until moderation and fraud handling are funded. Avoid an AI chat wrapper that simply repeats the current table. Avoid building your own cloud control plane: it changes liability, security and support more than it improves comparison.

## 12. Monetization: what can make money without damaging trust

### A. Affiliate revenue — V1

Earn approved commissions when an informed human chooses a clearly labelled partner link. Keep non-paying providers in the catalog and eligible for the same organic order.

Important current findings:
- DigitalOcean's public affiliate page advertises 10% and CJ participation. The agreement sets actual commission/window through applicable program terms and defaults to the initial transaction unless policies override. Do not invent a lifetime recurring payout. [S18, S19]
- DigitalOcean's agreement restricts masked referring URLs, self-referrals, cookie stuffing, incentives and automated lead generation. List relevant domains and obtain written permission for new distribution channels as needed. A normal redirect is not automatically forbidden or automatically approved: review the exact implementation and agreement. [S19]
- Hetzner's official Cloud FAQ says its former referral-credit program is discontinued. Do not count hoped-for Hetzner referral income. Hetzner can still deserve a strong organic position. [S20]
- Vultr's affiliate page was blocked in this research. Program availability, current commission and AI/CLI permissions remain unverified here. Do not build revenue forecasts from an indexed “up to” payout.

Track the full chain: human outbound action → attributed conversion if reported → approved commission → actually paid revenue. Distinguish pending, declined and paid values.

### B. Developer/pro subscriptions — V2/V3

Paid higher limits, automation, reports, team workflows and support. Basic accuracy is not a premium upsell.

An agent-only workflow may never create a human browser click. API fees can be a better business model than trying to attach referral tracking to every machine request. Separate developer revenue from affiliate economics.

### C. Licensed data — V3

Only sell data you are entitled to redistribute. Publicly reachable APIs and public webpages are not blanket commercial reuse licenses.

Spare Cores' docs distinguish MPL-2.0 source, CC-BY-SA-4.0 raw records and BSL 1.1 compiled SQLite snapshots. The stated free production carve-out excludes competing cloud data, benchmark or price-comparison services. Bestvpsforme must not assume the small-company revenue threshold makes its competitive use free. Obtain the applicable license/permission for the exact artifact and use. [S07]

Share-alike obligations, provider terms, trademark rights and derivative datasets deserve specific review. Start with your own normalized research and approved first-party sources. Decide separately whether client code, schemas, factual data and evidence archives have different licenses.

### D. Sponsorship — optional, not the foundation

A clearly separated newsletter sponsorship or labelled placement can be compatible with independence. It must never buy organic order, evidence approval or a review outcome. Track contracts and conflicts. Do not start here before users trust the product.

Never sell personal email addresses or sell a provider the identity of people who compared it.

## 13. Revenue math without fake promises

Illustrative assumptions ONLY:
- 20% of qualified visits produce an outbound human click.
- 2% of outbound clicks become approved commissionable customers.
- Average approved commission: USD 15.

Revenue = qualified visits × outbound rate × approved conversion rate × approved commission.

| Monthly qualified visits | Outbound clicks | Approved customers | Illustrative gross commission |
|---|---:|---:|---:|
| 1,000 | 200 | 4 | USD 60 |
| 10,000 | 2,000 | 40 | USD 600 |
| 50,000 | 10,000 | 200 | USD 3,000 |

These are arithmetic scenarios, not estimates of market conversion. Some customers choose non-partners; attribution can fail; refunds/reversals, payout minimums and delays matter. If measured rates are lower, revenue falls proportionally.

A comparison site can have attractive traffic and still produce little cash. “Scale” must mean growing contribution after data-review labor, email, infrastructure, API abuse, support, tax and refunds—not vanity pageviews.

Do not buy ads until measured approved revenue per incremental visitor can exceed acquisition cost with a safety margin. Retention and business subscriptions can help diversify a volatile referral business.

## 14. Email is a useful product, not a list to harvest

### Useful signup copy

“Tell me when the reviewed price of this plan drops. Confirm by email. Unsubscribe whenever you want.”

For a not-yet-built service:
“Email me when price alerts launch.”

Do not conflate either with consent for a weekly deals newsletter or all TwargaOps products.

### Minimal implementation scope

- Email, subscribed plan/query, chosen region/currency/billing basis, threshold/frequency, consent-purpose version and timestamps.
- Confirmation token stored safely; expiry, resend throttling and signup abuse controls.
- Separate subscription state from suppression state; honor withdrawal without silently resubscribing through an import.
- Unsubscribe links that require no login; signed single-use/limited-purpose tokens as appropriate.
- Webhooks for bounce/complaint handling and an auditable suppression list.
- No unnecessary open tracking or user fingerprinting. Explain actual collection in privacy text.
- Privacy deletion/export process, provider data-processing agreement and relevant transfer safeguards.
- Separate consent for optional marketing. Applicable laws depend on the operator and recipients; ICO/FTC sources here are jurisdiction-specific guidance, not a universal legal opinion. [S10, S11]

### Trigger correctness

Compare the same plan, billing term, native currency, location/tax basis and evidence status. Treat a new intro promotion, FX conversion or SKU revision as a distinct event, not automatically a real price drop. Trigger from reviewed publication, not from a scraper's first observation. Deduplicate and send an explanation/source date.

### Sending cost and deliverability

The retrieved Resend page lists a transactional free allowance of 3,000/month with a 100/day cap and a USD 20/month 50,000-email plan; it separately prices marketing email by contacts. Confirm your alert/newsletter classification and current terms before choosing a plan. A free daily cap can fail on a large batch even while monthly volume is low. [S21]

Authenticate the sending domain. Gmail guidance requires at least SPF or DKIM for all senders and stronger SPF/DKIM/DMARC requirements for bulk senders, plus one-click unsubscribe for relevant bulk marketing/subscribed mail. Implement good authentication and visible unsubscribe from the start rather than waiting for a threshold. [S09]

Email sends are cheap compared with reviewing wrong price alerts and losing trust. Deliverability, consent and accuracy—not raw subscriber count—are the real work.

## 15. Data operations are the main scaling system

### Source pipeline

1. Use permitted provider APIs/feeds when available; document access and reuse rights.
2. Capture source, date, region, currency, SKU and applicable terms.
3. Normalize into staging with explicit unknowns.
4. Detect changes, missing fields and identity mismatches.
5. Review meaningful changes; keep approval and evidence separate from commercial records.
6. Publish a versioned snapshot with rollback.
7. Notify subscriptions and update website/API caches from that publication.

Vultr's fetched plans JSON includes monthly/hourly prices and location-related fields. It is an example input, not proof that every charge or checkout condition is complete. Even an API-observed zero-priced plan can have eligibility constraints. [S08]

### Freshness policy

Define per-source/field freshness instead of pretending one global timestamp verifies everything. Proposed operating tiers: promotions checked more frequently, high-traffic plan pricing at least weekly, quieter stable records at a documented slower cadence. Tune this to source limits and actual review capacity before promising an SLA.

Track separately source observed time, reviewer action, publication time and any confirmed stock observation. Mark expired/unconfirmed information clearly; remove stale promotions under documented rules. Record gaps instead of silently carrying a “reviewed today” label forward.

### Identity and comparability

Maintain stable IDs, aliases and explicit successor links. A provider keeping a name while changing RAM/CPU/billing is not necessarily the same comparable offer. Separate shared vCPU from dedicated CPU; architecture, contention and disk labels do not prove performance.

### What to measure operationally

- Freshness distribution for core fields and high-traffic offers.
- Count/severity/age of review holds.
- Corrections received, confirmed and time to resolve.
- Connector errors and publication/alert failures.
- Reviewer minutes per meaningful update and backlog per provider.
- Percentage of public records with every required launch field/source.

The next hire/contractor may be a careful research operator before another frontend developer.

## 16. Acquisition and growth

### Start narrow

Pick one real initial audience and a handful of high-intent questions: a low-budget Docker server, an EU self-hosting VPS, or whether a plan fits an n8n workload under stated assumptions. Answer with honest comparisons and useful evidence, not automatically generated superlatives.

### Channels in sequence

1. Current TwargaOps/twarga.tech audience, demos and the crab film that leads into the actual tool.
2. Helpful posts and real comparison walkthroughs in relevant self-hosting/developer communities, following each community's promotion rules.
3. Search pages with distinct purpose, original cost explanations, real observations and useful internal links.
4. Requested alerts that bring people back when evidence changes.
5. Shareable comparisons and integrations; then CLI/MCP pilots in workflows already asking for them.
6. Newsletter partnerships or paid acquisition only after attribution and unit economics work.

Don't publish thousands of near-identical “best VPS for X in Y” pages just because filters can generate URLs. Google identifies scaled low-value content and thin affiliate content as spam risks. Useful original research and decision tools are the alternative. [S13]

Structured data must match visible evidence and the applicable eligibility rules; a VPS comparison page is not automatically eligible for every merchant enhancement. Never fabricate AggregateRating from third-party scores or guarantee rich results. [S22]

### Growth loop

Useful comparison → share or opt-in watch → reviewed market change → honest alert → return visit/updated shortlist → labelled outbound action → revenue that funds better evidence.

A second loop can emerge later: API integration → repeated successful developer use → integration examples/partners → more data demand → paid quotas/support.

## 17. Scorecard and expansion gates

**Primary success signal:** completed, trustworthy selection journeys. Start with observable proxy events: filtered catalog → opened evidence or compared → outbound action. An outbound click is not proof of a good purchase; complement telemetry with voluntary post-task feedback.

Read weekly:
- Core-task completion and where users fail.
- Returning users and confirmed useful-alert usage.
- Human outbound clicks, confirmed/approved conversions and paid commission.
- Freshness, corrections and operational effort.
- API/MCP successful workflows, latency, cost, error rates and repeat integrators once those channels exist.

Do not judge consented alert value only by open rate; tracking can be unreliable and privacy-invasive. Avoid using EPC or conversion in organic ranking.

Suggested stage gates (proposals):
- **V1 launch:** safe published subset, approved design and all critical user/operating journeys pass.
- **V1.5 expansion:** repeated watch/history demand and a sustainable review/notification cadence.
- **V2 beta:** ten repeated external developer/agent workflows, two pilot integrations, defined license/abuse cost.
- **V3 paid pilot:** three willing recurring customers for a clearly specified repeated task; actual margin and support plan.

Failure to meet a gate means narrow or stop that expansion, not keep inventing features.

## 18. Execution order without an endless rebuild

### Now: decision and proof

1. Use this scope to freeze V1. Keep future channels out of its critical path.
2. Audit current public data and launch risks separately from historical documents.
3. Produce one crab-world homepage concept and one dense catalog/offer concept. Validate on phone and desktop before remaking every page.
4. Update the explicit design contract; prototype the real motion on the existing stack.

### Then: deliver V1

Implement approved shared tokens/components, port key screens, decide working alert versus honestly labelled waitlist, verify public facts and real user journeys, and complete the target-server checklist. Deploy a versioned release with rollback evidence.

### After real use

Interview users, refresh the scorecard and choose the single highest-value V1.5 improvement. Pilot an API/CLI/MCP channel only when evidence supports it. Avoid maintaining several empty products in parallel.

### Stop list

- No complete rewrite merely to get animation.
- No inherited v5-tile mandate that contradicts the current character-led brand.
- No promise of “live,” universal “best,” complete renewal costs or guaranteed savings without proof.
- No affiliate-favored ranks or channel-based alternate scores.
- No auto-checkout/provider keys in early agent tooling.
- No paid dataset built from unlicensed competing data.
- No empty forums, generalized AI assistant or ten notification channels at launch.

## 19. Sources and evidence

Public pages were retrieved on 2026-10-23 UTC. Documentation and commercial terms can change; verify again before implementation or signing. Official statements below establish advertised behavior/terms, not competitor market share or guaranteed payouts.

### Public / primary sources

- **S01** TwargaOps deployed company site: https://twargaops.com/ — current story and public product status.
- **S02** twarga.tech: https://twarga.tech/ — public positioning and company/product relationship.
- **S03** Server Hunter: https://www.serverhunter.com/ — inventory and filter product surface.
- **S04** VPSBenchmarks: https://www.vpsbenchmarks.com/ and https://www.vpsbenchmarks.com/compare — benchmarks, comparison and advertised commercial offerings.
- **S05** LowEndBox: https://lowendbox.com/ — budget offers/editorial positioning.
- **S06** Spare Cores: https://sparecores.com/ — cloud intelligence and product positioning.
- **S07** Spare Cores API/licensing: https://docs.sparecores.com/api — distinct code/raw-data/SQLite licenses and competitive-use caveat.
- **S08** Vultr plans JSON: https://api.vultr.com/v2/plans — successful unauthenticated read during research; inspect field semantics and terms before use. Hetzner API overview: https://docs.hetzner.cloud/ — separate first-party integration documentation.
- **S09** Gmail sender guidelines: https://support.google.com/a/answer/81126?hl=en — authentication and unsubscribe requirements.
- **S10** ICO electronic-mail marketing: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/ — UK consent/soft-opt-in context and unsubscribe.
- **S11** FTC endorsement guidance: https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking — US material-connection disclosure guidance.
- **S12** Google AI features/site guidance: https://developers.google.com/search/docs/appearance/ai-features — useful accessible content and search fundamentals.
- **S13** Google spam policies: https://developers.google.com/search/docs/essentials/spam-policies — scaled content abuse and thin affiliation.
- **S14** MCP specification entry: https://modelcontextprotocol.io/specification/latest — current authoritative documentation entry, version-sensitive.
- **S15** MCP 2026-07-28 transports: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports — standard transport bindings and earlier-revision differences.
- **S16** MCP authorization: https://modelcontextprotocol.io/specification/latest/basic/authorization — protected HTTP transport authorization requirements.
- **S17** MCP security practices: https://modelcontextprotocol.io/specification/latest/basic/security_best_practices — trust, token and server security risks.
- **S18** DigitalOcean affiliate page: https://www.digitalocean.com/affiliates — advertised 10% and CJ enrollment.
- **S19** DigitalOcean agreement: https://www.digitalocean.com/legal/affiliate-program-agreement — section 3.1 commission basis and section 10.2 referral restrictions; applicable program policies can override details.
- **S20** Hetzner Cloud FAQ: https://docs.hetzner.com/cloud/general/faq/ — discontinued referral-credit program.
- **S21** Resend official pricing: https://resend.com/pricing.md and verified domains https://resend.com/docs/dashboard/domains/introduction — transactional versus marketing limits/pricing and domain ownership.
- **S22** Google product structured data: https://developers.google.com/search/docs/appearance/structured-data/product — actual feature eligibility and markup requirements, not a promise of rich results.

### Local primary evidence

- **L1** design_system/plans-and-designs/BRAND.md:206–241; design_system/brand/characters/v2/lore.js; styles/patchwork.js — current art/character rules, crab identity, web/terminal renderings and company bear mark.
- **L2** design_system/twargaops-site-v4/README.md — current story architecture, performance tradeoffs, deployment contract and interaction behavior.
- **L3** design_system/twargaops-site-v4/src/styles/app.css and twarga.tech/public/styles.css — inspected actual fonts/tokens; older notebook/design docs are not the entire current family.
- **L4** bestvpsforme/bestvpsforme/docs/progress/phase-6-closure-2026-10-07.md — documented publication/held editorial and explicit permission to proceed with holds enforced.
- **L5** bestvpsforme/bestvpsforme/docs/progress/pre-phase-7-repairs-2026-10-12.md and phase-7-status.md — historical verification, catalog router/JS tradeoff and acceptance still pending.
- **L6** bestvpsforme/bestvpsforme/docs/product/PRODUCT_CONTRACT.md, PRODUCT.md and DESIGN.md — current purpose, integrity, route, no-account, paused Finder, no-search and design rules.
- **L7** bestvpsforme/bestvpsforme/src/app/api/public/offers/route.ts, src/lib/catalog.ts, src/lib/public-catalog.ts and src/db/schema.ts — actual reusable data/query/publication foundation.
- **L8** bestvpsforme/bestvpsforme/docs/growth/{GROWTH_KPIS,PARTNERSHIP_PIPELINE,PARTNERSHIP_OPERATIONS,POST_LAUNCH_REVIEW}.md — existing business operations and measurement.

## Bottom line

**Make V1 unmistakably part of TwargaOps. Make V1.5 worth returning to. Make V2 usable by developers and their agents. Earn V3 by solving a repeated paid problem.**

The long-term asset is a trusted, maintained decision dataset and the distribution around it—not the number of interfaces you launch at once.
