# bestvpsforme: full product and delivery scope

**Document:** Scope.md  
**Written:** 23 October 2026  
**Status:** detailed scope proposal, ready for review and implementation planning  
**Product owner:** TwargaOps; owner approval required at the gates below  
**Coverage:** V1 website remake, V1.5 retention, V2 API/CLI/MCP, V3 professional services

> **Read this first:** launch the remade comparison website. Add reliable watches and history next. Then expose the same reviewed facts through an API, terminal tool and AI-agent tools. Build paid professional services when customers demonstrate repeated demand.

This document specifies the product, services, boundaries, behavior, data, architecture, tests, operating requirements and release gates. It does not claim that proposed features exist, that the current deployment passes these gates, or that the owner has approved every technical default.

## Reading paths

- **Five-minute product overview:** sections 1–7 and 30.
- **V1 design and launch:** sections 8–12 and 27–28.
- **V1.5 email and history:** sections 13–15.
- **V2 technical specification:** sections 16–23.
- **Business and scale:** sections 24–26 and 29.
- **Implementation handoff:** sections 30–34.

The short version remains available in [ROADMAP_START_HERE.md](docs/strategy/ROADMAP_START_HERE.md). The research, competitors and source citations live in [the product research report](docs/strategy/PRODUCT_STRATEGY_AND_RESEARCH_2026-10-23.md).

## Contents

1. [Document authority and terminology](#authority)
2. [Product purpose](#purpose)
3. [Audiences and jobs](#audiences)
4. [Services customers receive](#services)
5. [Release boundaries](#releases)
6. [Integrity and safety rules](#integrity)
7. [Existing foundation and reuse](#foundation)
8. [V1 brand and artistic system](#brand)
9. [Reusable frontend system](#frontend)
10. [V1 public journeys and screens](#v1-public)
11. [V1 owner operations](#v1-admin)
12. [V1 acceptance and exclusions](#v1-acceptance)
13. [V1.5 subscription service](#subscriptions)
14. [Price-event and history correctness](#history)
15. [V1.5 acceptance and workload guidance](#v15-acceptance)
16. [V2 architecture](#v2-architecture)
17. [External data contract](#data-contract)
18. [REST API contract](#api)
19. [Filtering, ranking and cost explanation](#query-engine)
20. [CLI contract](#cli)
21. [MCP contract](#mcp)
22. [Authentication, quotas and abuse controls](#access)
23. [V2 documentation and acceptance](#v2-acceptance)
24. [Monetization and commercial boundaries](#money)
25. [V3 professional product](#v3)
26. [Growth and measurement](#growth)
27. [Security, privacy and accessibility](#security)
28. [Performance, deployment and reliability](#operations)
29. [Scaling and data economics](#scale)
30. [Delivery workstreams and gates](#delivery)
31. [Test matrix and requirement traceability](#testing)
32. [Risks and decision register](#risks)
33. [Future opportunity backlog](#future)
34. [Completion checklists and references](#completion)

---

<a id="authority"></a>
## 1. Document authority and terminology

### 1.1 What the owner has requested

The owner requested:
- A remake that belongs to the current TwargaOps artistic and character-led world.
- A new bestvpsforme identity and its Hermit Crab mascot.
- Motion and a living experience without losing the comparison tool's purpose.
- Preservation of useful existing layout where it still serves users.
- Investigation of email alerts, CLI, AI-agent access and monetization.
- A full scope covering launch and later releases.

These requests establish direction. They do not approve an exact logo drawing, palette, font stack, API path, quota, subscription price or migration.

### 1.2 Authority during implementation

Use this order:
1. Current explicit owner decisions and non-negotiable integrity/security requirements.
2. [PRODUCT_CONTRACT.md](docs/product/PRODUCT_CONTRACT.md) for current implemented behavior.
3. This scope for proposed future behavior and release boundaries.
4. [DESIGN.md](DESIGN.md), [PRODUCT.md](PRODUCT.md) and implementation-specific contracts, updated before conflicting implementation.
5. Research and historical plans as context, not proof of present behavior.

The existing contract still specifies Highlighter, a light default, no public search interface and a paused Finder. The artistic remake conflicts with parts of its design section. **Update those product decisions explicitly before implementation.** Do not weaken evidence, publication, security or accessibility requirements to make a redesign pass.

Creating this file does not update those binding files automatically.

### 1.3 Release terminology

| Term | Meaning |
|---|---|
| Product V1 | First remade website release described here. |
| Product V1.5 | Retention and monitoring release after V1. |
| Product V2 | Developer/agent access release. |
| Product V3 | Validated professional and commercial service release. |
| API v1 | First external API contract, introduced during product V2. |
| CLI version | Package/binary release number; independent of product stage. |
| MCP revision | Protocol compatibility target; independent of product/API versions. |
| Snapshot | An approved, versioned publication of offer facts. |
| Observed | A source supplied or displayed a fact at a recorded time. |
| Reviewed | An authorized reviewer approved a defined fact or claim. |
| Published | The system exposed an approved record through the active publication. |
| Historical receipt | Evidence from a past build or dataset, not a fresh pass. |

All defaults marked **proposed** are implementation starting points. Confirm them against tests, measured costs and client support before public commitments.

<a id="purpose"></a>
## 2. Product purpose

### 2.1 The core task

Help a developer or practical self-hoster choose a suitable VPS by understanding:
- Hardware and region constraints.
- Advertised price and billing commitment.
- Due-today amount when known.
- Renewal and extra charges when known.
- Evidence dates and missing information.
- Why a plan appears in a shortlist.

The user can browse and compare without creating an account.

### 2.2 Product outcome

A successful journey ends with a user who can explain their shortlist and knows what to verify at checkout. The provider sells the hosting service; bestvpsforme supplies comparison and evidence.

### 2.3 Product positioning

Bestvpsforme serves builders choosing a server. It does not initially serve as:
- A cloud reseller or hosting company.
- A checkout or payment intermediary for VPS purchases.
- A remote server management platform.
- A universal enterprise FinOps suite.
- An autonomous purchasing agent.
- A paid ranking directory.

### 2.4 Meaning of “best”

A result is suitable for stated constraints under the published method. Avoid claims that one provider is best for every user, that all servers with the same vCPU count perform equally, or that a dated quote guarantees checkout price.

<a id="audiences"></a>
## 3. Audiences and jobs

### 3.1 Primary audience: builders and self-hosters

Typical jobs:
- Find an affordable VPS with sufficient memory in a chosen region.
- Compare three plausible plans without opening dozens of tabs.
- Understand annual prepayment versus a monthly advertised equivalent.
- Notice IPv4, transfer, setup, renewal or tax uncertainty before buying.
- Choose a starting point for Docker, n8n, Coolify, WordPress or a VPN.

Assumptions about workload size must accompany guidance. A workload label does not prove performance, capacity or suitability for every installation.

### 3.2 Secondary audience: repeat decision-makers

Freelancers and agencies need:
- Repeatable comparison scenarios.
- Saved shortlists and dated reports.
- Price monitoring and evidence they can share with clients.

Address these in V1.5 and V3 according to demand.

### 3.3 Developer audience

Developers want:
- Structured facts rather than HTML scraping.
- Stable IDs and predictable filtering.
- Scripts that work without opening a browser.
- Clear quotas, versions, sources and failure states.

Address these through the V2 API and CLI.

### 3.4 AI-agent users

A human supplies requirements to their own assistant. The assistant uses bestvpsforme tools to retrieve evidence and compare options.

Bestvpsforme does not require the user to adopt a new general-purpose AI assistant or send prompts through a bestvpsforme-owned model.

### 3.5 Initial validation tasks

Before expanding beyond launch:
- Interview 10–15 recent VPS buyers.
- Observe five people completing a real selection task.
- Ask repeat buyers how often they perform this task and what they pay for today.
- Invite developers to attempt a concrete integration rather than rate a feature list.

These are proposed research tasks, not research already completed.

<a id="services"></a>
## 4. Services customers receive

### 4.1 Public comparison service

**Customer receives:** browsable plans, constraints, comparisons, cost evidence and clear outbound choices.

**Delivery:** website in V1; additional interfaces in V2.

**Payment:** free browsing and comparison. Eligible affiliate actions may earn disclosed commission.

### 4.2 Optional watch service

**Customer receives:** a requested notice when reviewed comparable facts change, under the chosen threshold/frequency.

**Delivery:** email initially.

**Payment:** basic watches proposed free; premium monitoring requires demand validation.

### 4.3 Developer data service

**Customer receives:** documented machine-readable published facts and deterministic comparisons.

**Delivery:** versioned REST API in V2.

**Payment:** a limited free/pilot allocation; paid volume or support later if economics justify it.

### 4.4 Terminal service

**Customer receives:** the same facts through a CLI with human output and JSON.

**Delivery:** a thin client using the shared API.

**Payment:** no separate charge for the interface itself in the initial scope. API entitlements can apply to usage.

### 4.5 Agent-tool service

**Customer receives:** supported MCP tools for finding offers, reading evidence, comparing plans and explaining costs.

**Delivery:** a read-only MCP server/adapter.

**Payment:** the same underlying service entitlements, not a second inconsistent pricing/ranking system.

### 4.6 Professional service

**Customer receives:** repeated monitoring, reports, teams and higher-volume access where validated.

**Delivery:** V3 paid pilots, then a supported product if customers retain it.

<a id="releases"></a>
## 5. Release boundaries

| Capability | V1 | V1.5 | V2 | V3 |
|---|---|---|---|---|
| Artistic company-aligned remake | Required | Refine | Shared identity | Shared identity |
| Catalog, offer receipts, compare | Required | Improve | Shared engine | Shared engine |
| Evidence and corrections | Required | Required | Required | Required |
| Confirmed plan-watch signup | Working alert OR labelled waitlist | Working service | May reuse | Advanced controls |
| Reviewed price history | Not required | Required if data supports it | Expose supported history | Export and professional views |
| Saved requirements/shortlists | Shareable URLs | Lightweight saved flows | Machine-readable queries | Team scenarios |
| Workload guidance | Existing supported copy only | Explicitly approved guidance | Reuse reviewed semantics | Optional deeper scenarios |
| External versioned API | No | Internal preparation | Required | Paid expansion |
| CLI | No | No | Demand-led beta | Supported expansion |
| MCP | No | No | Demand-led beta | Supported expansion |
| Recurring billing | No | No requirement | No requirement for free beta | After paid pilots |
| Autonomous provisioning | Excluded | Excluded | Excluded | Separate future decision |

V2 adapter order follows real demand. API parity and one working external adapter constitute the first developer beta; declare CLI and MCP individually beta/GA rather than pretending an untested adapter is supported.

A public release named “V2 with API, CLI and MCP” requires all three advertised interfaces to pass their respective acceptance gates.

<a id="integrity"></a>
## 6. Integrity and safety rules

### 6.1 Facts and ranking

**INV-01:** Organic ranking excludes commission, revenue, partner approval, sponsorship, EPC and conversion rate.

**INV-02:** Public surfaces use approved published facts. Raw imports, private drafts and held claims do not leak into a website, API, CLI, MCP output, email or report.

**INV-03:** Preserve unknown information as unknown. Do not create a zero price, unlimited transfer, included IP or no-contract claim from a missing value.

**INV-04:** Distinguish an internal score component of zero from a factual hardware/price value of zero. Explain the documented scoring treatment without inventing a missing fact.

**INV-05:** Prices, reviews and stock observations have dates and defined scopes. Do not call them live without a separately proven live service.

**INV-06:** Stable plan URLs and IDs survive interface changes. Explicitly redirect aliases; record revisions and successors.

**INV-07:** Compare like-for-like terms or explain the differences. Native price movement, FX movement and promotion changes are distinct.

**INV-08:** Reviewed status names the approved field/claim. Reviewing terms does not certify provider uptime, performance or all future prices.

### 6.2 Commerce and consent

**INV-09:** Label affiliate actions beside the action. Keep a usable direct-link path for non-partner offers.

**INV-10:** Do not charge for a ranking position or evidence approval.

**INV-11:** Do not require email/account signup to inspect prices, evidence or comparisons.

**INV-12:** Requested watches and optional general marketing have separate purposes and consent controls.

**INV-13:** Do not sell subscriber identities or share private user requirements with providers by default.

### 6.3 Agent and operating boundaries

**INV-14:** Initial developer tools are read-only. They do not buy, create, modify or delete cloud resources.

**INV-15:** Imported text is untrusted data, not executable instructions for a model or server.

**INV-16:** A failed data service must not silently substitute fixtures, old private drafts or fabricated recommendations.

**INV-17:** Release requires tested backup/restore, rollback, monitoring and target-server smoke checks.

**INV-18:** An unsupported field remains unknown across all adapters. An adapter cannot reconstruct a withheld price through another helper.

<a id="foundation"></a>
## 7. Existing foundation and reuse

### 7.1 Inspected implementation anchors

| Existing path | Reuse purpose |
|---|---|
| `src/lib/catalog.ts` | Existing filtering, sorting and eligible-cohort semantics. |
| `src/lib/catalog-url.ts` | Existing web query compatibility. |
| `src/lib/catalog-controls.ts` | Current catalog defaults and control vocabulary. |
| `src/lib/public-catalog.ts` | Public publication boundary and unavailable states. |
| `src/lib/real-price.ts` | Reviewed price projection and separation of service cost from cash timing. |
| `src/lib/score.ts` | Current money-blind weighted score and cohort normalization. |
| `src/lib/current-price-terms.ts` | Current terms handling to inspect before domain extraction. |
| `src/lib/price-terms-approval.ts` | Terms approval rules to preserve. |
| `src/lib/public-rate-limit.ts` | Existing public abuse-control behavior to evaluate for reuse. |
| `src/app/api/public/offers/route.ts` | Existing unversioned public JSON route. |
| `src/app/go/[id]/route.ts` | Reviewed outbound action flow to audit against each partner's terms. |
| `src/db/schema.ts` | Current offers, prices, FX, publication, affiliate and analytics records. |

These are existing anchors, not instructions to rewrite each file.

### 7.2 Technology default

Keep Next.js, React, TypeScript, Drizzle and SQLite unless measurements expose a constraint that a smaller change cannot solve.

The current catalog uses a Pages Router surface while other routes use the App Router. Preserve its behavior and measured tradeoffs until a deliberate routing change passes the full journeys and size gate.

Read installed Next.js guidance before changing routing, metadata, caching, fonts or request APIs, as required by the repository's AGENTS.md.

### 7.3 Shared company assets

Use the existing company character lore and Patchwork/Pixel renderings. Adapt framework-neutral art/rendering code where practical. Do not copy a Svelte component into React and claim the integration works without adapting its lifecycle and state.

### 7.4 Historical evidence is not current certification

The October 12 handoff records 497 unit tests and 891 browser checks passing and a strict catalog first-load receipt of 118,706 gzip bytes. Those numbers establish prior work, not a pass for the remake.

The current publication and external deployment require fresh inspection. Do not promote historical offer counts to a current marketing claim.

<a id="brand"></a>
## 8. V1 brand and artistic system

### 8.1 Identity direction

**BR-01:** Develop a bestvpsforme identity from the Hermit Crab / Shell Shopper character world.

**BR-02:** Carry current TwargaOps visual relationships: stitched/handmade art, deliberate scene lighting, recognizable silhouettes and calm product proof.

**BR-03:** Do not retain Highlighter as the primary identity with a small footer/logo change.

**BR-04:** Do not impose the older v5 horizon tile automatically. The current company brand explicitly uses the bear as its mark. Approve bestvpsforme's own crab/shell mark in that current family.

### 8.2 Logo deliverables

- Primary wordmark and horizontal lockup.
- Standalone crab/shell mark.
- Light, dark and one-color variants.
- Small favicon simplification; inspect 16, 24, 32 and 48 px output.
- App/share-safe versions for common square icon contexts.
- Clear space, minimum size, prohibited treatments and backgrounds.
- SVG source and required raster exports.
- Social-card and video-title usage.
- Terminal Pixel identity, distinct from the web Patchwork rendering.

Do not use the detailed animated full character as a tiny favicon without a simplification test.

### 8.3 Color and type decisions

Starting references include the existing violet shell and coral crab. They are references, not automatically accessible text/button tokens.

Define approved semantic colors for:
- Main canvas and raised surfaces.
- Primary, supporting and disabled text.
- Borders and focus.
- Selected state and primary action.
- Warning, error, success and informational messages.
- Light/dark art integration.

The current company site and personal site use different font stacks. Approve a readable family contract instead of selecting an older font from a guide and claiming universal consistency.

Use tabular/mono numerals where comparison benefits. Keep handwriting out of dense numeric receipts and long body copy unless real readability testing supports it.

### 8.4 Art placement

Use art in:
- Homepage introduction.
- A controlled product-story area.
- Optional film presentation.
- Empty/error state illustrations where helpful.
- Social and campaign assets.

Keep textured backgrounds, character silhouettes and hand strokes away from prices, evidence links, form labels and dense comparison cells.

### 8.5 Motion contract

| Context | Intended motion | Required limit |
|---|---|---|
| Homepage scene | Crab examines shells; gentle living scene. | Pause offscreen/hidden; no blocking catalog access. |
| First-view drawing | A scene/diagram draws once. | Content remains available before completion. |
| Filter/result update | Concise state feedback. | No fabricated analysis sequence or delayed prices. |
| Compare selection | Count and selected-state feedback. | Preserve focus and target position. |
| Empty result | Small scene supports explanation. | Plain text and reset control work without animation. |
| Error | Calm supporting character state. | Do not imply the user caused a backend failure. |
| Reduced motion | Completed still state. | Same information and actions. |
| CLI help | Optional Pixel character in an interactive terminal. | No ANSI/animation in JSON or pipes. |

Avatar placement follows company guidance: story canvas, not generic buttons, navigation icons or input chrome.

### 8.6 Design review evidence

Before full-screen implementation, review:
- One homepage with its real primary action.
- One desktop catalog and its narrow-screen form.
- One offer receipt with known and unknown terms.
- One reduced-motion capture.
- One keyboard/focus walkthrough.

The owner approves art direction at this slice. Avoid remaking twenty routes before showing a real comparison screen.

<a id="frontend"></a>
## 9. Reusable frontend system

### 9.1 Layered architecture

Foundations/tokens → primitives → components → page compositions → product examples.

Separate functional behavior from art treatment. A FilterPanel keeps its semantics and keyboard contract while the surrounding page adopts the company visual language.

### 9.2 Core component inventory

Required patterns:
- SiteHeader, mobile navigation and SiteFooter.
- Button, Link, Field, Select, Checkbox and disclosure.
- Theme control and visible focus treatment.
- FilterPanel, active-filter summary and clear/reset action.
- OfferRow, OfferCard and normalized provider identity.
- PriceDisplay, ReviewScopeLabel and CostReceipt.
- Comparison selection, tray and comparison sections.
- SourceReference, SnapshotLabel and UnknownValue.
- Loading, empty, no-publication, unavailable and error states.
- SubscribePanel, consent explanation and confirmation state where included.
- StoryScene boundary with a static fallback and reduced-motion behavior.

Names are purposes, not arbitrary visual shapes. Existing equivalent components should evolve rather than acquire parallel replacements without a migration plan.

### 9.3 Component contract template

Document each reusable pattern with:
1. Purpose and use/non-use examples.
2. Required and optional content.
3. Public props and meaningful variants.
4. Loading, empty, selected, disabled and error states as applicable.
5. Keyboard/focus behavior.
6. Screen-reader name and update announcements.
7. Touch targets and narrow layout.
8. Theme and contrast expectations.
9. Reduced-motion behavior.
10. Real content example and difficult edge case.

### 9.4 Token governance

Separate primitive values from semantic roles. Component-specific tokens require a recurring need. Do not add a new global token to fix one screen's spacing exception.

Cover typography, spacing, radius, borders, layers, focus, motion, breakpoints and semantic state. Keep CSS scoped and low-specificity. Select one documented strategy for new work and migrate existing styles without a competing anonymous utility system.

### 9.5 Content stress cases

Validate long provider/SKU names, large prices, unavailable logos, currencies with different display precision, no review count, unknown region, unknown renewal, no matches and backend failure.

Preserve native semantics where possible. A decorative illustrated control must not replace a reliable native field without a documented interaction contract.

<a id="v1-public"></a>
## 10. V1 public journeys and screens

### 10.1 Home

**WEB-01:** Explain the comparison purpose and reach the catalog in the initial useful viewport.

Required:
- New identity and compact living scene.
- Plain description of what the tool compares.
- Direct browse action; supported constraint shortcuts if useful.
- A small evidence-backed shortlist or honest empty/unavailable state.
- Clear company relationship.
- Optional film, with play/pause, captions where applicable and no required autoplay download.

Avoid a long scroll narrative that the user must finish before reaching plans. Do not reuse fictional terminal output as if a real CLI already exists.

### 10.2 Catalog

**WEB-02:** Preserve filters, sorting, shareable state, compare selection and canonical offer navigation.

Required behavior:
- Dense readable table/list on larger layouts; optional cards.
- Labelled narrow-screen filter controls and accessible drawer dismissal/focus restoration.
- Known price basis and review meaning.
- Core CPU/RAM/storage/transfer facts with unknowns preserved.
- Provider identity, location context and outbound disclosure.
- URL persistence across reload/back/forward.
- Pagination with correct range/count and disabled boundaries.
- Distinguishable loading, no matches and unavailable service.

Do not silently reintroduce global text search. The current web no-search decision remains until the owner explicitly changes it.

### 10.3 Offer detail

**WEB-03:** Put the cost receipt and hardware close enough to compare without a decorative empty hero.

Receipt fields:
- Provider, product, SKU and stable ID.
- Advertised period amount and monthly equivalent where supported.
- Original currency.
- Billing period and commitment.
- Due-today amount when reviewed.
- Introductory period and renewal when reviewed.
- Setup, IPv4, backup, tax and usage caveats when known.
- Reviewed 36-month service-cost estimate only when approved terms support it.
- Separate cash-payment timing from allocated service cost.
- Evidence, dates and review scope.
- Correction path.
- Affiliate/direct outbound action.

Do not invent a complete total from incomplete charges. Display the narrower supported value and explain omissions.

### 10.4 Compare

**WEB-04:** Compare up to the current supported maximum of four plans, unless a separate product decision changes that limit.

Handle empty, one-item, partial/missing and full comparisons. Keep selected column identity visible and accessible. Do not declare a sole winner for a tie or hide uncertainty under a score.

Horizontal scrolling inside a labelled comparison container can be intentional; page-level overflow remains a defect.

### 10.5 Providers

**WEB-05:** Provider pages show the same published identity/inventory and dated third-party rating context.

No provider can purchase a better organic position. Do not display a provider score as your own independent server benchmark.

### 10.6 Guides and methodology

**WEB-06:** Preserve useful guides, author attribution and readable content structure. Explain ranking, unknown values, normalization, corrections and affiliate independence.

Do not expand guide volume just to fill route counts. Publish supported material that answers a distinct task.

### 10.7 Special offers

**WEB-07:** Show reviewed promotions with dates and eligibility/term caveats. Apply existing expiration/publication rules. Do not add unsupported countdowns, invented stock or urgency.

### 10.8 Updates, corrections and legal pages

**WEB-08:** Publication updates describe reviewed changes without suggesting a continuous live market feed.

**WEB-09:** Correction intake retains bounded fields, source evidence, rate limits and current abuse controls.

**WEB-10:** Privacy/terms describe actual behavior at release. Alert waitlists, functional watches, newsletters and API logs require accurate descriptions, not generic placeholders.

### 10.9 Existing routes and compatibility

Preserve established canonical routes, outbound paths, guide/provider identities and `/for-me` compatibility behavior. Keep catalog query URLs valid.

A migration must define redirect behavior before removing a route. Do not silently convert former deep links into the homepage.

<a id="v1-admin"></a>
## 11. V1 owner operations

### 11.1 Preserve the working administration model

**OPS-01:** Keep authenticated owner access, MFA/current authentication controls, CSRF protection and audit evidence.

**OPS-02:** Imports stay staged. Review changes before explicit publication.

**OPS-03:** Publish and rollback remain deliberate recorded transactions.

**OPS-04:** Keep commercial partner records separate from editorial approval and score inputs.

The owner/admin surface may adopt shared foundations, but public remake scope must not trigger a simultaneous administrative rewrite without a concrete need.

### 11.2 Required operating views

- Import/review status and blocking validation issues.
- Terms/evidence holds and their age.
- Editorial reviewed/draft states.
- Publication history and rollback evidence.
- Correction queue.
- Provider affiliate status and checked dates.
- Operational health/error visibility.

A working watch service additionally needs suppression/send-state visibility. A waitlist does not need to masquerade as a full alert dashboard.

### 11.3 Public subset selection

Current historical documentation allows progress with held editorial remaining private. Inspect public price safety independently.

Do not block launch merely because a private draft lacks supported copy. Do block or withhold public claims that use unsupported pricing, terms, fits or review stamps.

<a id="v1-acceptance"></a>
## 12. V1 acceptance and exclusions

### 12.1 V1 must pass

- Owner-approved crab-world identity and representative screens.
- Main browse/filter/compare/receipt/outbound journeys.
- Mobile layout and desktop keyboard operation.
- Light/dark parity under the approved theme decision.
- Reduced-motion and static scene fallback.
- Consistent publication across visible counts, lists, details, sitemap and destinations.
- No unsupported “live,” complete-cost or independent-performance claims.
- Security, dependency, data, lint, type, unit and browser gates.
- Measured frontend budgets and a real screen-reader journey.
- Target-server HTTPS, external health checks, backup/restore, monitoring and rollback evidence.

### 12.2 Email release choice

Choose exactly one advertised V1 capability:
- **Working plan watch:** section 13's minimum correctness and consent requirements pass.
- **Alerts-launch waitlist:** confirmation/purpose/unsubscribe work, and the UI states alerts are not yet available.
- **No email collection:** omit signup until the service is ready.

Working alerts must not become an unbounded dependency that delays a safe comparison launch.

### 12.3 V1 exclusions

No CLI, MCP, paid consumer account, cloud credentials, VPS checkout, autonomous deployment, general AI assistant, user-review forum, benchmark laboratory or enterprise SSO.

<a id="subscriptions"></a>
## 13. V1.5 subscription service

### 13.1 User journey

**SUB-01:** A user selects a plan or supported saved query and requests a specific watch.

**SUB-02:** The system explains the purpose, cadence and limits before accepting an email.

**SUB-03:** The user confirms inbox ownership before the watch becomes active.

**SUB-04:** The user can change/stop a watch without a password account.

**SUB-05:** Every relevant message offers visible unsubscribe; implement applicable one-click unsubscribe support for subscribed/marketing email.

### 13.2 Proposed subscription data

These are conceptual records, not approved database migrations:

| Record | Purpose | Minimum contents |
|---|---|---|
| Subscriber | Inbox identity and status. | ID, email, status, created/confirmed timestamps. |
| Subscription | Specific requested watch. | Subscriber reference, plan/query, region, price basis, threshold, frequency, state. |
| Consent receipt | Explain requested use. | Purpose/version, consent timestamp, confirmation timestamp and method. |
| Action token | Confirm/manage/unsubscribe capability. | Hashed token, purpose, expiry where applicable, consumed/revoked state. |
| Suppression | Prevent unwanted sending. | Minimal inbox fingerprint/address as legally appropriate, reason and timestamps. |
| Notification event | Publication-derived change. | Event ID, snapshot pair, plan identity, changed fields and comparable basis. |
| Delivery | Reliable send lifecycle. | Event/subscription reference, idempotency key, provider ID, attempts, next retry and final state. |

Email handling needs jurisdiction-specific privacy review. Encryption, access controls, deletion and processor agreements apply even if subscriptions are free.

### 13.3 State machine

Subscription states:
- `pending_confirmation`
- `active`
- `paused`
- `unsubscribed`
- `suppressed`

An unconfirmed signup cannot trigger ordinary alerts. Repeated unconfirmed attempts must not spam the address. A later import or resend must not reactivate a suppressed or unsubscribed inbox without valid renewed permission.

Recommended default: confirmation tokens expire in 24 hours; resend attempts have a bounded cooldown and a per-address/global cap. Tune exact values after abuse testing. Do not reveal whether an address already subscribes.

Management links grant only the specific subscription capabilities required. Do not use one email token as an admin login or an unrestricted API key.

### 13.4 Purpose separation

Separate:
- A requested plan watch.
- A saved-query watch.
- An alerts-launch waitlist.
- A general deals newsletter.
- Marketing for other TwargaOps products.

One confirmation is not blanket permission for all five. General unsubscribe and per-watch preferences must have explicit semantics and remain easy to use.

### 13.5 Delivery reliability

A scheduler/worker reads reviewed-publication events and active subscriptions. Use durable job state and a unique key such as subscription + event + message type.

Required:
- Retry transient failures with bounded backoff.
- Stop permanent-failure retries and suppress appropriate recipients.
- Process bounce/complaint webhooks idempotently with signature validation.
- Recheck suppression before dispatch, not only during job creation.
- Record provider delivery identifiers without leaking token-bearing message URLs into logs.
- Handle a crash between provider acceptance and local acknowledgement through deduplication/reconciliation. Do not promise mathematically exact-once email delivery.
- Expose a global pause/kill switch for incorrect alert batches.
- Budget for a day's peak notification batch, not just monthly average volume.

### 13.6 Email content contract

Each price message states:
- Watched plan and applicable location/billing basis.
- Previous and newly reviewed comparable value.
- Source/review dates and the nature of the change.
- Remaining caveats or changed terms.
- Canonical comparison/evidence link.
- Affiliate disclosure if a commercial action is included.
- Why the recipient received it and how to stop it.

Do not use an asserted saving or urgency unless evidence supports the exact claim.

<a id="history"></a>
## 14. Price-event and history correctness

### 14.1 Identity before difference

**HIST-01:** Compare the same provider/SKU lineage, currency, region, billing period, tax basis and eligibility.

A same-name plan with changed CPU/RAM/term may need a new revision or successor relationship. It must not automatically appear as the previous plan getting cheaper.

### 14.2 Event classification

At minimum distinguish:
- Native advertised-price change.
- Reviewed normalized-cost change.
- Renewal/fee/commitment change.
- FX-only display change.
- New or expired promotion.
- Plan revision or successor.
- Availability observation change.
- Evidence withdrawn or corrected.

Only supported event types can trigger their corresponding subscriber promise.

### 14.3 Publication trigger

Emit candidate events after a reviewed snapshot commits. Failed imports, unreviewed staging rows and rolled-back candidate transactions do not send alerts.

For publication rollback, distinguish a correction to false facts from a newly observed market change. Avoid a misleading “price dropped again” email caused only by restoring the previous snapshot.

### 14.4 History display

**HIST-02:** Store/render observation dates and gaps.

**HIST-03:** Identify the chart's price basis and currency.

**HIST-04:** Show a single observation as a point, not a continuous historical line.

**HIST-05:** Avoid interpolating missing months as if the system observed them.

**HIST-06:** Distinguish historical published facts from current availability and buying advice.

Existing publication payloads may seed history after a comparability audit. Their presence alone does not prove a continuous or complete market record.

### 14.5 Threshold semantics

Proposed basic watch:
- Trigger when a supported reviewed value moves below the user's chosen threshold.
- Debounce repeated equivalent observations.
- Respect frequency/digest settings.
- Do not convert unknown into a zero that triggers a price alert.
- Explain native versus converted thresholds; conversions require a dated approved rate.

Define what happens when a plan is replaced, removed, unpublished or becomes non-comparable. Pause the watch with an explanation rather than substitute another product without consent.

<a id="v15-acceptance"></a>
## 15. V1.5 acceptance and workload guidance

### 15.1 Watch/history acceptance

Test at least:
- Real comparable native price decrease.
- FX-only movement.
- New intro offer with changed commitment.
- Changed SKU specifications under a similar name.
- Duplicate publication/retry.
- Rollback and withdrawn evidence.
- Unsubscribe while a send is queued.
- Pending confirmation, bounce, complaint and suppression.
- Provider timeout and worker restart.
- One-point history and a long observation gap.

### 15.2 Saved decisions

Use shareable URLs and confirmed inbox links first. Add passwords/profiles only when actual features require them.

Private saved requirements must not appear in public search pages, cache keys exposed to other users or analytics exports.

### 15.3 Workload guidance

**FIT-01:** An approved workload guide names its assumptions and source.

**FIT-02:** Distinguish minimum published hardware from an independently tested workload result.

**FIT-03:** Display failure reasons and unknown requirements, not only positive matches.

**FIT-04:** Reusing existing workload tags does not authorize new capacity guarantees.

The current Finder is paused. Reintroducing a guided selection flow requires an explicit product-contract change and a bounded initial workload set.

<a id="v2-architecture"></a>
## 16. V2 architecture

### 16.1 One engine and thin adapters

```text
Permitted provider sources
          |
          v
Capture -> stage -> validate -> review -> publish snapshot
                                              |
                                              v
                                   Shared domain service
                                  /       |         \
                              Website   REST API    Owner operations
                                           |
                                    +------+------+
                                    |             |
                                   CLI       MCP adapter
```

The MCP adapter may call the shared service in-process or the API according to deployment needs. It must not duplicate ranking, publication or price logic.

### 16.2 Domain operations

Proposed shared operation contracts:
- `findOffers(query, publicationContext)`
- `getOffer(id, publicationContext)`
- `compareOffers(ids, publicationContext)`
- `explainCost(id, scenario, publicationContext)`
- `getPriceHistory(id, query, publicationContext)` when supported history exists
- `getCapabilities()` for supported schema/filter/tool features

These names describe future boundaries, not exported functions already in the repository.

### 16.3 Extraction strategy

1. Characterize current behavior with tests.
2. Reuse existing published-state, filter, score and reviewed-price functions.
3. Add a public DTO mapper that allowlists fields.
4. Add external strict input validation without breaking legacy web URL behavior.
5. Put REST handlers around the shared operations.
6. Add clients/adapters without copying business calculations.
7. Verify website/API/CLI/MCP parity against the same snapshot.

### 16.4 Publication context

An operation captures its publication identity once. A multi-plan comparison cannot read one plan from snapshot A and another from snapshot B.

Context includes:
- Snapshot ID/version and publication time.
- Ranking-policy version and eligible-cohort identifier.
- External schema version.
- FX source/date where used.
- Data freshness/withdrawal policy version where relevant.

A new publication can change the next operation's context. It must not produce internally mixed results within a single operation.

### 16.5 Initial deployment

Prefer one application/data service and a small background worker when needed. Keep SQLite while measured workload fits its operating model.

Do not add Kubernetes, a message broker, microservices, a warehouse or a second database merely because there is an API. Introduce each only for a measured concurrency, reliability, isolation or integration need.

### 16.6 Service boundaries

- Browsing APIs do not require cloud-provider credentials.
- Developer credentials never authorize admin publication.
- The email worker does not determine rankings.
- The MCP adapter does not browse arbitrary provider pages on a user's command.
- Commercial eligibility does not alter the organic query engine.

<a id="data-contract"></a>
## 17. External data contract

### 17.1 Version and representation policy

**DATA-01:** API v1 has a published machine-readable schema and additive-change policy.

**DATA-02:** External DTOs contain allowlisted public fields, not serialized database rows.

**DATA-03:** Dates use explicit UTC ISO 8601 timestamps. A date-only historical source must not acquire an invented observation time.

**DATA-04:** Use stable opaque IDs. Retain existing canonical IDs unless an approved migration provides aliases.

**DATA-05:** Represent money as decimal strings plus an explicit currency, or null with an explanation. Formatting a known number into a string does not authorize changing its reviewed calculation.

**DATA-06:** Publish units and conversion conventions for hardware. Existing `ramGb`/`diskGb` labels do not justify silently claiming binary GiB when the evidence only establishes provider-labelled GB.

### 17.2 Unknown-state contract

For important facts distinguish:
- `known`: supported value exists.
- `unknown`: insufficient published evidence.
- `not_applicable`: affirmative evidence establishes inapplicability.
- `not_computable`: a derived result lacks required approved inputs.

Do not expose a private hold reason or internal reviewer note as an unknown reason. Public reasons must be safe explanations such as `renewal_not_reviewed`.

A real supported zero value remains zero; it does not become null because zero is inconvenient. Ranking treatment of free plans remains a separately documented policy.

### 17.3 Offer fields

| Group | Required external meaning |
|---|---|
| Identity | ID, provider ID/name, product/SKU, canonical URL and revision context. |
| Hardware | vCPU, CPU type/architecture if known, RAM/storage values with explicit units, disk type and transfer limits. |
| Location | Region/location applicability and unknowns; do not claim latency. |
| Price | Native advertised price, period/commitment, known due-now/renewal/fees, tax basis and supported display conversion. |
| Derived costs | Horizon, service cost versus cash timing, eligibility and omissions. |
| Evidence | Public source URLs, observed/reviewed/published dates and review scope. |
| Ranking | Policy/cohort version and documented explanation, not a fabricated recommendation sentence. |
| Commercial | Affiliate/direct distinction and allowed human action link. |
| Status | Publication/availability observation context and dated caveats. |

### 17.4 Illustrative known/unknown money fragment

This JSON is fictional schema illustration, not provider data or a working response:

```json
{
  "schema_version": "1.0",
  "pricing": {
    "native_currency": "USD",
    "advertised_monthly": {
      "state": "known",
      "amount": "6.00",
      "currency": "USD"
    },
    "renewal_monthly": {
      "state": "unknown",
      "amount": null,
      "currency": "USD",
      "reason": "renewal_not_reviewed"
    },
    "reviewed_36_month_service_cost": {
      "state": "not_computable",
      "total": null,
      "effective_monthly": null,
      "currency": "USD",
      "reason": "required_terms_not_reviewed"
    }
  }
}
```

### 17.5 Cost precision

Preserve the existing reviewed-price rules during adapter work. Document current rounding and compare results against fixture receipts before introducing any decimal arithmetic migration.

A later precision improvement requires its own tests/migration assessment. It must not quietly change published prices or ranking while the work is described as “adding an API.”

### 17.6 Public evidence safety

Only expose source URLs suitable for public disclosure. Strip/reject embedded credentials, private checkout tokens and unsupported URL schemes. A provider source may be publicly linkable without permitting wholesale republication of its content.

### 17.7 Capability discovery

Proposed metadata includes:
- API/schema version.
- Active publication identity.
- Supported filters/sorts/currencies/horizons.
- History capability and limits.
- Public license/terms URL.
- Adapter/version support links.

Do not advertise unimplemented capabilities through metadata or documentation.

<a id="api"></a>
## 18. REST API contract

### 18.1 Proposed route inventory

These are proposed new routes, not existing endpoints:

| Method/path | Purpose | Initial status |
|---|---|---|
| `GET /api/v1/meta` | Version, capabilities and publication metadata. | Required V2. |
| `GET /api/v1/offers` | Strictly validated filtered/paginated public list. | Required V2. |
| `GET /api/v1/offers/{offer_id}` | One public offer receipt. | Required V2. |
| `POST /api/v1/compare` | Compare 2–4 explicit public IDs under one publication. | Required V2. |
| `POST /api/v1/cost/explain` | Explain supported reviewed cost scenario. | Required V2. |
| `GET /api/v1/offers/{offer_id}/history` | Comparable dated observations. | Conditional on accepted history service. |

The existing `/api/public/offers` remains supported until an approved deprecation plan applies. Do not break existing clients by replacing it without notice.

`POST` does not imply a write to business data here; compare/cost requests are bounded read-only calculations. They must not have provisioning, subscription or purchase side effects.

### 18.2 List request semantics

Proposed external query names:
- `ram_min` with documented unit.
- `vcpu_min`.
- `storage_min` with documented unit.
- `region` and/or `country`, according to supported normalization.
- `provider_id`.
- `price_max`.
- `price_basis`.
- `display_currency`.
- `sort`, `direction`, `limit`, `cursor`.

Only implement fields backed by the shared engine and reviewed data. Reject unsupported parameters rather than pretending to apply them.

The API can use a documented explicit naming convention while retaining current web query names. A shared normalization layer must map equivalent supported constraints without changing their meaning.

### 18.3 Input bounds: proposed initial defaults

- Default page size: 24.
- Maximum external page size: 96, matching the current supported catalog page-size ceiling.
- Maximum comparison size: 4.
- Numeric inputs: finite, non-negative and within documented practical upper bounds.
- Request body size: 16 KiB for small compare/cost operations.
- Cursor length: bounded, proposed at 2 KiB.
- Request/query field count: bounded; reject excessive duplicated fields.
- No user-supplied raw SQL, expressions, arbitrary source URLs or JavaScript.

Exact resource limits need implementation review and load tests before public commitments.

### 18.4 List success envelope

Illustrative structure; the empty result is intentional:

```json
{
  "schema_version": "1.0",
  "publication": {
    "snapshot_id": "example-snapshot",
    "snapshot_version": 1,
    "published_at": "2026-10-23T12:00:00Z"
  },
  "query": {
    "region": "europe",
    "price_basis": "reviewed_36_month_monthly",
    "display_currency": "USD",
    "limit": 24
  },
  "data": [],
  "page": {
    "returned": 0,
    "has_more": false,
    "next_cursor": null
  },
  "warnings": []
}
```

A successful empty list returns 200. Do not use an empty list to hide a database failure.

### 18.5 Snapshot-bound pagination

Proposed first implementation:
1. Capture the active snapshot and normalized query on the first page.
2. Use an opaque integrity-protected cursor containing snapshot/query/order/page-position context.
3. Every following page must use that same snapshot and ordering.
4. Do not silently switch to the latest publication midway through pagination.
5. If the active publication changes and retained snapshot querying is not supported, return `409 publication_changed` and tell the caller to restart.
6. If later historical pagination is implemented, serve only snapshots still eligible for that public use. Withdrawn/revoked evidence is not eligible merely because it remains in storage.

Cursor ordering needs a documented stable last-resort tie-breaker. Adding a new ID tie-breaker to existing web behavior requires deliberate parity review rather than an adapter-specific silent change.

### 18.6 HTTP and domain errors

| HTTP | Machine code example | Meaning |
|---|---|---|
| 400 | `invalid_argument` | Malformed or unsupported input. |
| 401 | `invalid_credentials` | A supplied credential is invalid or expired. |
| 403 | `insufficient_scope` | Valid identity lacks the operation entitlement. |
| 404 | `offer_not_found` | No public accessible offer for the requested ID. |
| 409 | `publication_changed` | Restart snapshot-bound operation/page sequence. |
| 413 | `request_too_large` | Body exceeds allowed bounds. |
| 422 | `unsupported_scenario` | Validly shaped request uses unsupported currency/horizon/scenario. |
| 429 | `rate_limited` | Quota/burst exceeded; include retry guidance. |
| 503 | `publication_unavailable` | Public data service is unavailable or has no active publication. |
| 504 | `upstream_timeout` | Only where an actual required upstream timed out. |

A known offer with non-computable reviewed cost can return a successful cost-explanation response with `state: not_computable`; it is not the same as a transport failure or unsupported horizon.

Example error:

```json
{
  "error": {
    "code": "invalid_argument",
    "message": "limit must be between 1 and 96",
    "fields": [
      {
        "name": "limit",
        "reason": "out_of_range"
      }
    ]
  }
}
```

Use an `X-Request-Id` response header. Do not include stack traces, database details, credentials or private hold descriptions in public errors.

### 18.7 Caching and withdrawal

Initial proposed policy:
- Cache normalized published data internally by snapshot.
- Revalidate the current-publication pointer on the defined invalidation boundary.
- Use explicit invalidation after publication, withdrawal and rollback.
- Use ETags for stable GET representations with a clear representation key.
- Start browser-facing GET behavior with revalidation, not an undocumented stale-price grace period.
- Default authenticated responses to private caching semantics.
- Keep credential/usage-specific headers and private data out of shared public caches.
- Compare/cost POST responses default to `no-store` unless a later reviewed cache strategy proves safe.

The representation key must include all outcome-affecting inputs: schema, publication, normalized query, ordering/cohort, relevant FX identity and DTO version. Keep per-request IDs outside a stable cached body. Do not cache a 503 as a valid empty catalog.

### 18.8 API change policy

- Add optional fields without reinterpreting existing fields.
- Treat renamed fields, changed units, changed null meaning, enum narrowing and changed price basis as breaking.
- Publish supported versions and migration notes.
- Proposed deprecation notice: at least 90 days once the service claims general external support, unless emergency security/legal withdrawal requires immediate action.
- Preview/beta terms must state their actual stability commitment.

<a id="query-engine"></a>
## 19. Filtering, ranking and cost explanation

### 19.1 Filter correctness

**QUERY-01:** A minimum requirement excludes records whose relevant value is unknown, unless an explicit supported “include unknown” mode exists.

**QUERY-02:** A maximum price filter names its basis. Do not silently substitute advertised monthly cost for unavailable reviewed 36-month cost.

**QUERY-03:** Location constraints use known applicability. A provider having one EU datacenter does not establish that every plan is available there.

**QUERY-04:** Unsupported/malformed external filters produce a validation error. Legacy web URL normalization can remain tolerant for compatibility; document the distinction.

**QUERY-05:** Public eligibility follows the equivalent web surface's policy. List eligibility and canonical detail visibility may differ today; do not bypass either policy accidentally during API extraction.

### 19.2 Ranking parity

Reuse current score semantics. The inspected implementation normalizes recommended scores against an eligible cohort rather than the current filtered page.

Required parity test: narrowing a filter does not change the relative recommended order of surviving plans merely because an adapter recomputed normalization over that small filtered subset.

Document policy version, cohort identity, score components and tie behavior. A score is a method output, not an independent uptime/performance measurement.

Do not introduce personalized or AI-specific weights in V2 without a separate product decision and explanation contract.

### 19.3 Currency policy

Start with supported native facts and the existing reviewed USD conversion path. Broader display currencies require an approved dated FX source and parity tests.

Do not advertise every ISO currency simply because an input string accepts it. Metadata must list the implemented subset. Unknown/unavailable conversion returns an explicit state/error, not an assumed 1:1 rate.

### 19.4 Cost scenarios

Initial mandatory scenario: explain the existing approved 36-month service-cost estimate and its inputs.

Additional horizons, usage estimates, tax calculations and custom resource bundles are optional extensions after domain verification. The existing helper accepting a horizon argument is not proof that every new public horizon/scenario has been validated.

Separate:
- Service cost allocated across the horizon.
- Cash due today or at future billing dates.
- Optional/usage-dependent charges.
- Known tax basis.
- Native totals versus converted display totals.

Use the public `reviewedPrice` approval boundary or its verified successor. Do not bypass that guard by calling a lower-level formula with held/unreviewed inputs.

### 19.5 Explanation response

The response must explain:
- Whether computation is supported and approved.
- Which reviewed inputs it used.
- Which horizon and currency apply.
- What it excluded or could not establish.
- Source/review/snapshot identity.

The AI assistant can summarize these fields. It must not be the authoritative calculator or fill unknown renewal/fee values with guesses.

<a id="cli"></a>
## 20. CLI contract

### 20.1 Purpose and naming

Proposed executable/package name: `bvp`, subject to registry and naming review.

CLI scope is comparison and evidence access. It is not a provider API client, SSH tool or provisioning engine.

### 20.2 Proposed command surface

The following commands are a design proposal, not commands already installed:

```text
bvp offers list [supported filters]
bvp offers show <offer-id>
bvp compare <offer-id> <offer-id> [up to four total]
bvp cost explain <offer-id>
bvp history <offer-id>
bvp capabilities
bvp auth login
bvp auth logout
bvp config show
bvp version
```

History is advertised only if the history API is supported. Authentication commands must reflect the actual issued credential flow, not imply an OAuth/device flow that does not exist.

Global options proposed:
- `--json`
- `--no-color`
- `--timeout`
- `--snapshot` only where supported by the API contract
- `--version`
- `--help`

A custom API base URL is an advanced/testing option. Credentials must not silently follow a changed host. Require HTTPS outside explicit localhost development, and bind stored credentials to an expected origin.

### 20.3 Human output

Show compact identity, applicable price basis, main specs, location, evidence date and key caveats. Keep an evidence/receipt command discoverable.

Unknown values display as an explicit label, not zero. Support narrow terminals without truncating away the caveat that changes the buying decision.

### 20.4 Machine output

**CLI-01:** `--json` writes valid documented JSON only to stdout.

**CLI-02:** Diagnostics/progress go to stderr.

**CLI-03:** No Pixel mascot, ANSI control codes, spinner, update banner or referral popup in machine output.

**CLI-04:** Preserve money strings, null/unknown states, publication identity and structured errors.

**CLI-05:** Non-interactive commands do not prompt for email/login unexpectedly; they return an actionable error or run within permitted anonymous access.

### 20.5 Exit codes: proposed

| Code | Meaning |
|---|---|
| 0 | Successful command, including a valid empty list. |
| 1 | Unexpected client/server failure. |
| 2 | Invalid arguments or unsupported local invocation. |
| 3 | Requested public offer/resource not found. |
| 4 | Authentication or entitlement failure. |
| 5 | Rate limit; retry guidance available. |
| 6 | Network timeout/service unavailable. |
| 7 | Publication changed; caller should restart the operation. |
| 130 | User interrupt where platform conventions permit. |

Specify JSON error/exit behavior together so scripts do not parse human text.

### 20.6 Browser handoff

Listing, showing or comparing must not open a browser or trigger referral traffic.

An explicit browser-opening action may be added after channel/partner review. The user chooses it. API requests and agent tool calls do not count as human affiliate clicks.

### 20.7 Local credential handling

- Prefer environment/OS credential mechanisms appropriate to the implementation.
- Do not require raw secrets in command-line arguments that enter shell history/process listings.
- Redact tokens from config display, debug logs and errors.
- Keep local credential files user-readable only where files are used.
- Logout removes/revokes the intended credential without deleting unrelated application data.

### 20.8 Packaging

Default: a small TypeScript client reusing generated/validated schemas. Choose a Go binary if demonstrated distribution needs justify it; do not rewrite domain logic in Go to ship a binary.

Declare supported runtime/OS combinations. Test installation, upgrade, uninstall, no-TTY behavior, proxy/TLS failures and package integrity. Use trusted publishing/signing mechanisms available to the chosen registry.

Do not promise a single static binary while distributing a Node-only package.

<a id="mcp"></a>
## 21. MCP contract

### 21.1 Service behavior

MCP exposes selected read-only operations to compatible AI clients. It does not require a proprietary bestvpsforme LLM.

The server validates inputs, calls the same service/API, and returns structured evidence. A model can explain the result but cannot alter approved facts in storage.

### 21.2 Proposed tool inventory

| Tool | Inputs | Output | Side effects |
|---|---|---|---|
| `find_offers` | Supported structured constraints, bounded page size/cursor. | Matching public offers, query interpretation and publication context. | No domain mutation. |
| `get_offer` | One public ID. | Receipt, review scope, sources and unknowns. | No domain mutation. |
| `compare_offers` | 2–4 IDs. | Structured differences under one snapshot. | No domain mutation. |
| `explain_cost` | ID and supported scenario. | Approved calculation or non-computable explanation. | No domain mutation. |
| `get_price_history` | ID and supported range/basis. | Comparable observations and gaps. | No domain mutation; conditional feature. |

Ordinary security/usage logs and quota counters are operational effects; document them. “Read-only” means no changes to offers, subscriptions, purchases or cloud resources.

### 21.3 Tool input/output contracts

- Publish strict schemas and bounded values.
- Reject extra unsupported fields where the schema promises strict validation.
- Reuse API semantic definitions; do not create a second field vocabulary without a documented mapper.
- Include snapshot/source dates and uncertainty in machine-readable output.
- Bound results by rows and serialized size.
- Prefer summaries plus IDs/canonical evidence links over dumping the entire catalog into model context.
- If a result is too large, return pagination/selection guidance. Do not truncate out caveats or mark incomplete output complete.

Tool descriptions must say that price evidence is dated, links can be affiliate/direct, and no purchase occurs.

### 21.4 Protocol errors versus service errors

Use the selected SDK/specification's proper mechanism for protocol/schema errors. Return domain failures in the supported tool-result form with stable service codes.

Test unavailable publication, unsupported scenario, not-found offer, rate limit and expired credentials. Do not turn a failed tool call into a cheerful fabricated shortlist.

### 21.5 Transport and revision

The earlier research retrieved MCP documentation pointing to the 2026-07-28 revision and highlighted differences from older initialization/session behavior.

Before implementation:
1. Select a specific supported specification revision and SDK release.
2. Re-read that revision's transport/auth/security requirements.
3. Select actual pilot clients and record tested versions.
4. Implement only the supported transport set.
5. Document compatibility limitations and any explicit legacy adapter.

Do not mix headers, handshake, session or auth requirements from different revisions.

### 21.6 Local versus remote

**Local stdio adapter:** launched by the user's client; can call the hosted API. Keep diagnostics on stderr and protocol output clean.

**Remote HTTP endpoint:** hosted service with TLS, bounded requests, abuse controls and protocol-compliant authorization where protected.

A static API key may suit the direct REST/CLI credential model. Do not assume that placing that key in an arbitrary header satisfies every protected MCP client's authorization requirements. Use the supported revision/client flow.

### 21.7 Security

**MCP-01:** Server code and credentials enforce read-only access; tool annotations alone do not.

**MCP-02:** Provider text cannot instruct the server/model to read files, reveal keys, call arbitrary URLs or approve a held price.

**MCP-03:** No arbitrary fetch, shell, SQL, checkout, SSH or `create_server` tool.

**MCP-04:** Validate token audience, issuer/scopes and supported resource semantics for protected remote access.

**MCP-05:** Do not pass a user's MCP access token through to cloud providers.

**MCP-06:** Preserve user consent boundaries for any future write capability; such capability requires a separate scope/security review.

### 21.8 Example user journey

A human asks their assistant for EU options under a budget with specified memory. The assistant calls `find_offers`, then `compare_offers` and optionally `explain_cost`.

The result identifies options, review dates, billing differences and unknowns. The user decides whether to follow a canonical page/provider action. No tool buys a server or pretends checkout terms are guaranteed.

### 21.9 Agent discovery

Publish real setup examples, supported clients, schemas, limitations and version policy. Register a verified package/server only after it exists.

An optional `llms.txt` file is documentation convenience. It is not a substitute for an API contract, product demand or search accessibility.

<a id="access"></a>
## 22. Authentication, quotas and abuse controls

### 22.1 Separate identities

Do not reuse the administrative owner session as a developer credential.

Proposed service roles:
- Public anonymous browser/basic API consumer where permitted.
- Developer credential with read entitlements.
- Professional workspace/member in V3.
- Owner/reviewer/admin with separate protected controls.

Offer read, history read and usage visibility can be separate entitlements. Nothing in V2 grants import, review, publish, billing-admin or provider-provisioning access.

### 22.2 Credential lifecycle

For issued REST keys:
- Generate high-entropy secrets and show them only at creation.
- Store a verifier/hash rather than retrievable raw keys where appropriate.
- Use a non-secret key ID/prefix for support and audit.
- Allow revoke/rotate and bounded overlap if needed.
- Scope credentials to intended service/workspace and purpose.
- Avoid keys in URLs/query strings.
- Do not downgrade a supplied invalid key into anonymous access silently.

MCP protected access follows its selected protocol-compatible authorization lifecycle. A later developer portal is not a prerequisite for a controlled manually issued beta.

### 22.3 Proposed pilot limits

These are engineering starting points, not advertised paid plans:
- Anonymous: small per-network burst/minute limits, evaluated against privacy and shared-network fairness.
- Identified beta: a documented per-key request budget, daily cap and concurrent-request cap.
- More expensive compare/history requests can carry explicit weights.
- Shared abuse limits apply across REST, CLI and MCP usage.
- Each advertised plan must disclose what counts toward quota, including failed validation, retries and MCP multi-tool workflows.

Choose actual numbers after representative load/cost tests. Do not sell “unlimited” access before measuring abuse and review costs.

### 22.4 Enforcement behavior

- Return 429 with actionable retry information.
- Bound retries and honor server guidance.
- Prevent multiple adapters from evading the same account budget.
- Keep limits consistent across workers/instances; in-memory counters alone are not a multi-instance solution.
- Decide fail-open/fail-closed behavior for the quota store based on abuse risk and availability; document it.
- Do not let a request-triggered expensive full-catalog recomputation exhaust the service.

### 22.5 Privacy of usage data

Log the minimum required for reliability, abuse and billing reconciliation. Avoid raw tokens, full user prompts, unnecessary persistent IPs and private saved requirements.

If short-lived IP processing is needed for rate limiting, document purpose, retention and access. Do not claim zero IP handling if the infrastructure performs it.

<a id="v2-acceptance"></a>
## 23. V2 documentation and acceptance

### 23.1 Developer documentation

Required before external beta:
- What the service provides and does not provide.
- Quickstart for real supported operations.
- API schema and examples.
- Price/unknown/date/unit definitions.
- Filtering, ranking cohort and currency rules.
- Authentication, revocation, quotas and errors.
- Snapshot consistency/pagination behavior.
- CLI installation, machine output and exit codes.
- MCP setup for named tested clients/revisions.
- License, attribution and commercial-use restrictions.
- Support/contact, incident and deprecation policy.

Examples must use labelled fixtures or current reviewed data. Do not publish fake executable commands as current features.

### 23.2 Parity matrix

For the same supported query and publication:
- Website and API list the same eligible plans in the same documented order.
- CLI and MCP preserve the API's IDs, monetary values and unknowns.
- Compare operations use one snapshot.
- Cost explanation matches the approved web receipt, not a client-side approximation.
- Failure states remain failures rather than empty successes.
- Affiliate status never changes organic order.

### 23.3 Beta exit criteria

- A stable documented API contract.
- One actual external adapter completes repeated real tasks.
- Known protocol/runtime compatibility matrix.
- Security and licensing checks for the actual channels.
- Rate/cost monitoring and revocation work.
- No open critical data leakage or price-integrity defect.

Suggested demand evidence: ten repeated external workflows and two integration pilots. These are proposed management gates, not proven market thresholds.

### 23.4 General availability

An interface reaches GA only when its supported environments, operations, version policy, support expectations and monitoring are explicit. GA for the API does not imply GA for every MCP client or CLI platform.

<a id="money"></a>
## 24. Monetization and commercial boundaries

### 24.1 V1: affiliate model

Earn commissions from eligible human purchasing decisions with clear disclosure. Maintain non-partner inventory and money-blind ranking.

Track partner application, approval, permitted channels, commission basis, attribution window, payout currency, minimums, reversals and checked date separately from evidence.

A published provider listing is not a promise that a partner program is open or that bestvpsforme is approved.

### 24.2 Research constraints to recheck before launch

Earlier research on 23 October 2026 found:
- Hetzner's official Cloud FAQ states its old referral-credit program is discontinued.
- DigitalOcean advertises a percentage through its affiliate program, while the agreement and applicable program policies determine actual payout and channel conditions.
- DigitalOcean's agreement restricts automated lead generation, masked referring URLs, self-referral and other practices.
- Vultr affiliate terms were not fully verified because access was blocked.

These statements are dated research, not legal advice or guaranteed current commercial terms. Recheck and obtain written channel approval where needed.

Do not assume that every existing redirect is partner-approved. Review its concrete behavior rather than declaring all redirects permitted or all redirects forbidden.

### 24.3 V2: developer economics

The API provides facts even when no human clicks a referral. It may be useful and generate infrastructure cost without affiliate income.

Separate:
- Human referral clicks.
- API/MCP requests.
- Agent-visible link presentation.
- Actual approved conversions.
- Paid API/service revenue.

Do not fire referral URLs to generate attribution while serving a tool result. An explicit permitted human browser handoff is a separate event.

### 24.4 V3: paid repeat value

Candidate paid capabilities:
- Higher API quotas/history exports.
- Advanced saved requirements and monitoring.
- Agency reports and team collaboration.
- Webhooks and supported integrations.
- Properly licensed bulk data products.

Keep public comparison, methodology, corrections and basic evidence usable. Do not sell factual accuracy, reviewed status or organic placement.

### 24.5 Pricing process

Before building recurring billing:
1. Identify a repeated paid task.
2. Interview likely customers.
3. Offer a narrowly defined paid pilot.
4. Measure operating/support cost and retention.
5. Set a plan and entitlement model from evidence.

The earlier research's possible price ranges are interview hypotheses, not approved prices. Do not create checkout pages from those examples without validation.

### 24.6 Licensing

Maintain separate decisions for:
- Application/client source code.
- Schemas and SDKs.
- Normalized factual data.
- Compiled dataset exports.
- Source/evidence archives.
- Art, logos and provider trademarks.

Public access does not establish redistribution rights. The researched Spare Cores documentation distinguishes code/raw-data/compiled-database licenses and restricts free competitive production use of the compiled database. Obtain the exact needed permission rather than relying on a small-company revenue exception.

No paid dataset ships without a source-rights and attribution review.

### 24.7 Unit economics

Track approved and actually paid revenue, not just pending affiliate dashboards.

Costs include hosting, sending, source collection, human review, support, API abuse, observability, taxes and payment/refund costs where applicable.

An illustrative formula:

```text
Gross affiliate revenue = qualified visits
                        x human outbound rate
                        x approved commissionable conversion rate
                        x average approved commission
```

No conversion rate in this scope is a measured forecast. Paid acquisition requires evidence that incremental acquisition cost is below contribution with a safety margin.

<a id="v3"></a>
## 25. V3 professional product

### 25.1 Scope entry gate

Do not build team billing, broad permissions and enterprise features speculatively. Proposed entry gate: at least three willing paid-pilot customers with a repeated defined task and understood support economics.

### 25.2 Initial professional workspace

Candidate minimum:
- Workspace and membership.
- Saved comparison scenarios.
- Shared shortlist with notes.
- Dated exportable report.
- API credentials and usage visibility.
- Explicit entitlement limits.

Proposed initial roles: owner and member. Add more roles only for a demonstrated permission need. Workspace authorization applies to every read and write; opaque IDs do not replace authorization.

### 25.3 Reports

A report records snapshot, source dates, assumptions, ranking/price basis and caveats. A downloaded PDF/CSV does not remain current indefinitely; show its generation date and canonical live evidence links.

Avoid exporting private client notes into public comparison/share URLs.

### 25.4 Billing

Use a supported external billing processor after jurisdiction/tax/business setup review. Do not store raw payment-card data.

Test trial/pilot conversion if offered, payment success/failure, cancellation, entitlement expiry, retries, refunds and duplicate webhooks. Decide retention and access after cancellation explicitly.

### 25.5 Webhooks

Provide only after consumers need them:
- Event ID and version.
- Signature and timestamp validation.
- Replay window and rotation guidance.
- At-least-once delivery with deduplication.
- Retry/backoff and failure visibility.
- No private notes or subscriber identities in public market-change events.

### 25.6 Professional acceptance

A customer can complete the paid repeated task without manual database intervention. Authorization tests prevent cross-workspace leaks. Billing and usage agree with advertised entitlements. Support commitments reflect actual staffing.

<a id="growth"></a>
## 26. Growth and measurement

### 26.1 Acquisition sequence

1. Existing TwargaOps and twarga.tech audience.
2. Real comparison walkthroughs and film/art that link into the working tool.
3. Helpful participation in relevant developer/self-hosting communities under their rules.
4. Distinct search content with original evidence and useful comparison.
5. Requested alerts and shareable decisions.
6. Developer integrations and actual CLI/MCP use.
7. Paid acquisition only after measured economics.

### 26.2 Content boundary

Do not generate thousands of thin “best VPS for X in Y” pages from filters. Each indexed page needs a distinct useful purpose and supported content.

Structured data must match visible facts and actual eligibility rules. Third-party provider ratings do not become your own server test scores.

### 26.3 Product scorecard

Core signals:
- Task completion from catalog to evidence/compare to outbound action.
- Failure/abandonment points.
- Returning users and useful confirmed-watch activity.
- Corrections and freshness/review backlog.
- Approved conversions and paid revenue.
- Actual data/notification/support cost.

An outbound click is a proxy, not proof that the user made a good purchase. Complement telemetry with voluntary feedback.

### 26.4 Developer scorecard

- Successful supported requests/workflows.
- Repeat external consumers, not just created keys.
- Latency/error/rate-limit distributions.
- Expensive query patterns and cost per active integration.
- Adapter/version usage and upgrade friction.
- Paid-pilot retention and support effort where applicable.

Do not add EPC, partner status or revenue to organic ranking because they appear in the commercial analytics view.

<a id="security"></a>
## 27. Security, privacy and accessibility

### 27.1 Security baseline

- Keep owner authentication/MFA, CSRF and authorization for mutations.
- Validate all external API/tool/subscription inputs at boundaries.
- Use parameterized database access and safe output handling.
- Prevent open redirects, unsafe source URLs and SSRF.
- Keep CSP/HSTS/MIME/referrer/frame protections under the actual deployment.
- Do not widen CSP to arbitrary external scripts to get an animation library working.
- Keep secrets out of source, logs, fixtures, build artifacts and public errors.
- Validate webhook signatures and reject replay where required.
- Bound computation, payloads, retries and concurrency.

### 27.2 Privacy baseline

Maintain a map of collected data, purpose, legal basis where required, processor, access, retention and deletion behavior.

Required workflows:
- Purpose-specific opt-in/withdrawal.
- Unsubscribe/suppression handling.
- Account/subscription deletion as applicable.
- Data access/export where applicable.
- Retention expiry and backup handling.
- Incident response and processor contact.

UK ICO and US FTC sources in the research address their jurisdictions. Determine obligations for the operator and served recipients rather than treating one page as global legal advice.

### 27.3 Accessibility baseline

Target WCAG 2.2 AA behavior and verify the real journeys.

- Semantic landmarks and heading hierarchy.
- Labelled controls and meaningful link/action names.
- Visible focus and complete keyboard operation.
- Dialog/drawer Escape, focus containment where appropriate and focus restoration.
- Sufficient contrast for text, controls and meaningful graphics.
- Usable touch targets; preserve the project's primary 44 px touch-target rule.
- Reflow and text/browser zoom.
- Non-color status cues and explicit unknowns.
- Reduced-motion equivalents and no mandatory motion to access information.
- Appropriate result/status announcements without noisy repeated table rereading.

Automated scans do not certify screen-reader usability or full conformance. Record a supported NVDA/VoiceOver or equivalent human journey with findings.

### 27.4 Terminal accessibility

- No color-only meaning.
- `NO_COLOR`/plain-output behavior.
- Stable text and machine output.
- Reasonable help structure and no forced animation.
- No secret echo during credential entry.

<a id="operations"></a>
## 28. Performance, deployment and reliability

### 28.1 Frontend budgets

Retain the existing strict catalog first-load external JavaScript budget of **less than 120,000 gzip-9 bytes**, including framework/shared scripts under the established measurement method.

The historical receipt reports inline scripts/RSC separately. Keep that accounting transparent; report those payloads and full journey cost rather than implying the gate measures all network bytes.

The current Pages/App Router split can fetch an additional runtime on cross-router journeys. Measure that cost after the remake.

Lazy-load nonessential story code/assets. Essential filters, comparison and prices must not wait for a first interaction just to manufacture a smaller initial receipt.

### 28.2 Motion/resource budgets

Measure on representative phones and laptops:
- Largest content paint/layout shift and interaction latency.
- Scene JS/asset transfer and decode cost.
- Main-thread work, memory and GPU/resource pressure.
- Offscreen/hidden-page idle behavior.
- Reduced-motion/static rendering.
- Slow network and low-end CPU behavior.

Set numeric scene budgets after the prototype. Do not inherit the company's documented roughly 600 MB full-story walk as an acceptable comparison-app default.

### 28.3 API targets

Proposed beta engineering targets, not contractual SLAs:
- Typical cached reads: p95 below 500 ms at the declared pilot load.
- Bounded comparison/cost operations: p95 below 1 s at that load.
- A finite server timeout, proposed 10 s, with no unbounded client retry loop.
- Meaningful monitoring for errors, saturation and publication age.

Record hardware, dataset, concurrency, cache state and sample size with every performance claim. Revise targets deliberately when measurements show a different sensible operating envelope.

### 28.4 Deployment

Use the existing deployment/runbook/checklist as the starting contract.

Required release record:
- Commit/source identity and artifact/build identity.
- Schema/migration version.
- Runtime configuration inventory without raw secrets.
- Active publication identity.
- Backup reference and restore proof.
- Smoke results and monitoring status.
- Previous known-good artifact and rollback steps.

Do not modify live VPS, DNS, secrets or production configuration under the scope-writing task. Implementation/deployment requires its own authorized execution.

### 28.5 Database migrations

- Rehearse on a disposable copy with representative data.
- Back up and verify integrity/foreign keys.
- Separate deploy compatibility from destructive schema changes.
- Define forward/rollback behavior for app and schema together.
- Keep old application versions compatible during the planned switch where required.

SQLite file copying must use a consistency-safe backup method appropriate to WAL/write state. Do not assume copying one live file produces a valid restore.

### 28.6 Incident and kill switches

Ability to:
- Pause imports/publication.
- Pause alert delivery.
- Revoke credentials.
- Disable an expensive/broken external adapter.
- Mark affected evidence unavailable or withdraw affected offers.
- Roll back application and approved publication deliberately.

Do not silently serve unsafe stale facts just to maintain a success status. Status and error messages should explain the outage without exposing internal details.

<a id="scale"></a>
## 29. Scaling and data economics

### 29.1 Data pipeline ownership

Every source connector needs:
- Owner and source terms/access record.
- Field/unit/region mapping.
- SKU identity handling.
- Rate/cadence constraints.
- Validation and change thresholds.
- Error/hold behavior.
- Review responsibility and measured effort.

Prefer permitted APIs/feeds. Public reachability is not permission to bypass access controls, CAPTCHAs or redistribution terms.

### 29.2 Freshness operations

Record source observation, reviewer action and publication separately. A new publication does not mean every source was rechecked that day.

Propose field/source-specific cadences: promotions more often, frequently used plans at least weekly where feasible, stable low-use facts on a documented slower cycle. Approve a realistic policy before making a freshness promise.

### 29.3 Capacity planning

Measure:
- Offer/provider count and payload size.
- Active readers and expensive operations.
- Publication/write duration.
- SQLite lock/busy behavior and backup duration.
- Worker queue age and send peaks.
- Reviewer minutes per update/provider.
- Corrections/holds and support demand.

A reviewer or research operator can be more valuable than a second frontend framework migration.

### 29.4 Architecture expansion triggers

Consider PostgreSQL when measured multi-writer/concurrency, operational or hosting requirements justify migration.

Consider a dedicated queue when durable database-backed scheduling no longer meets reliability/throughput needs.

Consider a separate API process when isolation, autoscaling or deployment independence has demonstrated benefit.

Consider object storage/CDN for permitted public exports/artifacts when local hosting becomes limiting.

Each change needs an explicit migration/cost/security decision. Request count alone is not enough context to pick an architecture.

### 29.5 Defensibility

Invest in stable plan identity, reviewed billing evidence, honest history, correction quality and reliable interfaces. Brand improves recognition, but copying a mascot-free table is easier than copying a maintained trustworthy evidence operation.

<a id="delivery"></a>
## 30. Delivery workstreams and gates

### 30.1 Workstreams

| Workstream | Accountable role | Main deliverable |
|---|---|---|
| Product/scope | Owner | Release boundary, decisions and acceptance sign-off. |
| Brand/art | Design lead/owner | Identity, representative templates and motion approval. |
| Frontend | Implementing engineer | Shared components and verified journeys. |
| Data/editorial | Reviewer/operator | Safe publication and maintained evidence. |
| Backend/developer | Implementing engineer | Shared service, API and adapters. |
| Operations/security | Operator/reviewer | Deployment, backup/restore, incidents and security evidence. |
| Commercial/privacy | Owner with qualified advice as needed | Program permissions, licensing, privacy and paid-pilot terms. |

One person may hold several roles. Do not mistake a role label for available staffing.

### 30.2 Gate G0: scope and source of truth

- Owner accepts the V1 boundary.
- Record design-contract changes required.
- Separate historical claims from current audit tasks.
- List remaining visual/commercial/technical decisions.

Exit: no conflicting instructions about the identity or launch-critical features.

### 30.3 Gate G1: representative design slice

- Approve logo direction, home scene and catalog/receipt examples.
- Validate readable mobile/desktop and reduced motion.
- Prototype motion on the existing stack.
- Measure scene and comparison performance together.

Exit: evidence that the approved art direction works for the actual task.

### 30.4 Gate G2: V1 implementation and release candidate

- Update explicit design decisions/contracts before code changes.
- Implement tokens/components and migrate public screens.
- Keep supported routes/data/admin behavior.
- Select and truthfully implement the V1 email option.
- Run complete current-build verification.

Exit: V1 functional/security/accessibility/performance gates pass on one identified candidate.

### 30.5 Gate G3: deploy V1

- Target-server checklist complete.
- Backup restore and rollback proof retained.
- Public HTTPS smoke and monitoring test complete.
- Owner records release identity.

Exit: the real deployed service performs the advertised V1 tasks safely.

### 30.6 Gate G4: V1.5 retention

- Observe real user needs.
- Audit historical comparability.
- Ship reviewed event detection, reliable sending and saved/watch behavior.
- Test rollback/suppression/SKU edge cases.

Exit: requested alerts and history work without false claims or unwanted sending.

### 30.7 Gate G5: shared V2 API

- Characterize and reuse current query/cost policies.
- Approve external DTO, version/error contract and licenses.
- Implement strict bounded API with snapshot consistency.
- Verify web/API parity and abuse controls.

Exit: documented read-only external service usable by an integration pilot.

### 30.8 Gate G6: external adapter beta/GA

- Deliver the first demand-led CLI or MCP adapter.
- Complete real external tasks and compatibility tests.
- Add the other adapter if demand supports maintenance.
- Declare each supported version/status independently.

Exit: advertised V2 interfaces satisfy their acceptance criteria. No implied support for untested clients.

### 30.9 Gate G7: V3 paid pilot

- Identify repeated task and paying pilot customers.
- Confirm rights, support cost and margin.
- Implement only necessary professional/billing features.

Exit: customers can receive and pay for the defined repeated value under clear terms.

### 30.10 Scheduling

No calendar date or duration is committed in this scope. Estimate after the representative design slice and current-data audit. Do not hold V1 until G4–G7 finish.

<a id="testing"></a>
## 31. Test matrix and requirement traceability

### 31.1 Test layers

- Domain unit tests for filters, scoring, money, dates, unknowns and eligibility.
- DTO/schema contract tests.
- Database/import/publication tests on disposable data.
- API request/error/cache/pagination/auth/quota tests.
- CLI process tests against a controlled service.
- MCP protocol/client contract tests.
- Browser functional, responsive, keyboard, theme and visual checks.
- Manual screen-reader and artistic-motion review.
- Security/dependency and privacy/consent tests.
- Exact-build performance and operating recovery drills.

### 31.2 Required cross-cutting fixtures

- Complete reviewed terms.
- Unknown renewal/setup/tax/IP.
- Real zero price with eligibility caveats.
- Intro versus renewal and upfront billing.
- Non-USD fact with valid/missing/expired conversion context.
- Identical displayed plan names with different IDs/revisions.
- Missing provider image/third-party score.
- Held editorial and unapproved terms.
- Source disappearance and publication outage.
- Mid-pagination publication switch.
- Rollback/withdrawn evidence.
- Long labels and large numbers.
- Invalid/revoked keys and malicious provider text.

### 31.3 Traceability matrix

| Requirement | Minimum evidence |
|---|---|
| INV-01 / INV-09 / INV-10 | Change affiliate status/commission in fixture; organic order unchanged; disclosure reflects action. |
| INV-02 / INV-18 | Held data never reaches web/API/CLI/MCP/email; lower-level math cannot bypass approval. |
| INV-03 / INV-04 | Null/unknown preservation and explicit internal-score versus public-fact tests. |
| INV-05 / INV-07 / HIST-01 | Dates and like-for-like price events; FX/SKU cases do not send false drops. |
| INV-14 / MCP-01 | No cloud/purchase mutation capability; authorization tests enforce restrictions. |
| BR-01–BR-04 | Owner-approved identity/screen evidence linked to the release. |
| WEB-01–WEB-10 | Real primary browser journeys, routes, themes and error states. |
| SUB-01–SUB-05 | Confirmation/manage/unsubscribe journeys with queued-send suppression. |
| HIST-02–HIST-06 | History gaps, one-point display, rollback and stale/current distinction. |
| FIT-01–FIT-04 | Evidence-backed guidance and unsupported-workload failure cases. |
| DATA-01–DATA-06 | Schema and field/unit/null/precision contract tests. |
| QUERY-01–QUERY-05 | Strict external filtering and parity with equivalent web semantics. |
| CLI-01–CLI-05 | Clean stdout JSON, stderr diagnostics, exit codes and non-TTY tests. |
| MCP-02–MCP-06 | Injection, arbitrary URL, audience/scope and token-handling tests. |
| OPS-01–OPS-04 / INV-17 | Auth/publication/recovery controls and target-server evidence. |

### 31.4 Completion evidence

Every gate records:
- Source/build/snapshot identities.
- Commands and environment used.
- Pass/fail/intentional skip counts.
- Screenshots or relevant artifact references.
- Manual review findings.
- Open issues and explicit sign-off.

A test passing only after retry is not a zero-flake result. A screenshot is not proof of keyboard semantics. A locally passing build is not proof of deployment.

### 31.5 Existing verification commands

Use the project's documented commands, including `npm run release:check`, and its safe disposable-data/runtime-build setup. Confirm current scripts before execution.

New CLI/MCP/email/API tests must join the relevant release gate. Do not remove inconvenient assertions or regenerate visual baselines without inspecting intended differences.

Writing this scope requires document verification only; it does not authorize running migrations or a production release.

<a id="risks"></a>
## 32. Risks and decision register

### 32.1 Risk register

| Risk | Consequence | Mitigation |
|---|---|---|
| Endless artistic remake | Launch never reaches users. | Approve one representative slice, freeze V1 and migrate shared components. |
| Attractive but distracting motion | Comparison becomes slow or hard to use. | Immediate data/actions, resource budgets, offscreen pause and reduced motion. |
| Stale/unsafe prices | Users lose money and trust. | Required public evidence, freshness policy, holds and correction/withdrawal process. |
| Duplicate business logic | Website/API/agents disagree. | One shared service and parity fixtures. |
| Unlicensed source reuse | Commercial/legal interruption. | Rights inventory and exact-use permission before export/paid products. |
| Affiliate assumptions | Revenue forecast fails. | Verify approval/channel terms, track paid revenue, include non-partners. |
| False alerts/unwanted mail | Complaints and reputation damage. | Confirmation, event classification, suppression, idempotency and kill switch. |
| MCP version drift | Client integrations fail. | Pin spec/SDK and publish tested client versions. |
| API abuse | Cost/outage. | Bounded inputs, shared quotas, monitoring and adapter isolation when needed. |
| Subscription overbuild | Cost without willingness to pay. | Paid pilots before team/billing platform expansion. |
| Solo-operator overload | Data and support quality decline. | Narrow coverage/promises and measure review effort. |

### 32.2 Decisions already directed

- Adopt the living current TwargaOps art/character direction.
- Keep the comparison product's useful purpose and evidence standards.
- Investigate and define later CLI/agent service scope.
- Prefer accessible, easy-to-scan product/documentation behavior.

### 32.3 Decisions requiring confirmation before affected implementation

| Decision | Recommended starting position | Blocking point |
|---|---|---|
| Final mark/lockup | Crab/shell-derived family identity. | G1 art approval. |
| Font/color contract | Current suite-aligned, readable semantic system. | G1/G2 foundations. |
| Theme behavior | Preserve current light default/dark parity until explicitly changed. | G2 theme tests. |
| V1 email option | Working narrow watch only if ready; otherwise explicit waitlist or omit. | G2 public promise. |
| Guided Finder/search change | Keep paused/no-search rules until deliberate approval. | Any new guided/search UI. |
| API path/schema defaults | `/api/v1` proposal and strict public DTO. | G5 external contract. |
| External quota numbers | Set from pilot load and cost. | Before public limits/pricing promises. |
| First adapter | Whichever actual pilot users need. | G6. |
| MCP spec/SDK/clients | Pin a current compatible set. | MCP implementation/beta. |
| CLI packaging/name | TypeScript client default; verify name/runtime needs. | CLI distribution. |
| Commercial rights/channels | Written permission where needed. | Public commercial use/export. |
| Paid plan prices | Derive from paid pilots and costs. | G7 billing launch. |

No decision here requires the owner to pick routine security/accessibility best practices. The implementing engineer chooses safe defaults and records material tradeoffs.

#### V1 handoff defaults (implementation plan §3)

Applied under the owner’s instruction to use defaults and continue; not a claim of legal or launch sign-off.

| ID | Applied default |
|---|---|
| D-1 | Keep provider-name search; hide catalog search behind `site_settings.catalogSearch=false`. Preserve `q` URL compatibility. |
| D-2 | No email collection or signup UI in V1. |
| D-3 | Show `displayPriceUsd` in lists and use the same basis for budget controls; preserve supported renewal context. |
| D-4 | Keep existing Privacy and Terms text in the Shore layout until owner/legal approval of replacement copy. |
| D-5 | Add verified candidates through staged import and terms review; omit unverified rows. Expansion does not block launch. |

The approved mockup supersedes older Highlighter visual direction. Product/design contracts must be reconciled in Phase 1 before public UI changes. The existing Pages Router catalog (`src/pages/catalog.tsx`) remains the integration starting point; the handoff’s `src/app/catalog` reference is not an existing route.


<a id="future"></a>
## 33. Future opportunity backlog

This is an option list, not approved launch work.

| Opportunity | Earliest consideration | Evidence needed |
|---|---|---|
| Renewal reminder | V1.5 | User-supplied/confirmed personal renewal date. |
| Filter/region stock watch | V1.5–V2 | Reliable permitted stock observations. |
| Advanced total-cost scenarios | V2+ | Reviewed usage/tax/network rules. |
| Browser extension | V2+ | Repeated task not solved by web/CLI and acceptable permission burden. |
| Embeddable comparison widget | V2+ | Real integrators, rights, updates and attribution. |
| Telegram/Discord notifications | V2+ | Actual channel demand and consent/abuse controls. |
| Provider evidence portal | V2+ | Reviewer time savings; no provider self-approval. |
| Offline signed dataset release | V2+ | Rights, withdrawal/update caveats and actual offline use. |
| Independent benchmark cohorts | V3 | Trial budget, repeatable methodology and variability reporting. |
| Migration planning | V3 | Real footprint/usage assumptions and scope boundaries. |
| Read-only infrastructure import | V3+ | Strong demand, minimal credentials and separate security review. |
| GPU/dedicated servers | Separate expansion | Different evidence/buyer/workload needs. |
| Language/geographic expansion | After core workflow works | Qualified translation and local pricing/tax understanding. |
| Yeast/ecosystem deployment recipes | Later integration | Tool support actually exists; local VM support does not imply cloud provisioning. |
| Public forum/user reviews | Separate funded product | Moderation, fraud and dispute handling capacity. |
| Autonomous purchase/provisioning | Outside this scope | Separate authorization, liability, security and business model review. |

<a id="completion"></a>
## 34. Completion checklists and references

### 34.1 V1 checklist

- [ ] Approve representative company-aligned identity and screens.
- [ ] Update conflicting design decisions/contracts explicitly.
- [ ] Complete shared tokens/components and public screen migration.
- [ ] Preserve catalog/compare/receipt/provider/outbound behavior.
- [ ] Refresh and validate the launch publication.
- [ ] Keep unsupported claims private/unknown.
- [ ] Select and implement the truthful email option.
- [ ] Pass current-build functional/security/accessibility/performance gates.
- [ ] Complete human screen-reader and visual/motion review.
- [ ] Complete real target-server launch, restore and rollback checks.
- [ ] Record owner release sign-off.

### 34.2 V1.5 checklist

- [ ] Validate repeated watch/history demand.
- [ ] Audit observation/SKU comparability.
- [ ] Implement durable reviewed-event generation.
- [ ] Implement confirmation, management, unsubscribe and suppression.
- [ ] Test retry/crash/rollback/false-drop cases.
- [ ] Render honest history with gaps and basis labels.
- [ ] Introduce only explicitly approved workload guidance.
- [ ] Publish accurate privacy/sending/availability promises.

### 34.3 V2 checklist

- [ ] Characterize current shared query/ranking/cost behavior.
- [ ] Approve external DTO, schema and version policy.
- [ ] Implement bounded versioned API and snapshot semantics.
- [ ] Verify website/API parity.
- [ ] Implement separate developer access/revoke/quota controls.
- [ ] Verify source/data/commercial channel rights.
- [ ] Ship the first real-user adapter beta.
- [ ] Pass CLI JSON/process/platform tests where CLI is advertised.
- [ ] Pass pinned MCP/client/auth/security tests where MCP is advertised.
- [ ] Publish working examples, limits, support and deprecation policy.
- [ ] Record pilot use/cost and declare per-interface beta/GA status.

### 34.4 V3 checklist

- [ ] Secure paying pilots for a repeated defined task.
- [ ] Confirm margin, rights and support capacity.
- [ ] Implement only necessary workspace/report/monitoring features.
- [ ] Pass tenant isolation and billing/entitlement tests.
- [ ] Verify webhooks, cancellation, export and retention behavior.
- [ ] Publish supported plans and real service commitments.

### 34.5 Local references

- [Product contract](docs/product/PRODUCT_CONTRACT.md).
- [Product brief](PRODUCT.md).
- [Current design decisions](DESIGN.md).
- [Research and source list](docs/strategy/PRODUCT_STRATEGY_AND_RESEARCH_2026-10-23.md).
- [Short roadmap](docs/strategy/ROADMAP_START_HERE.md).
- [Phase 6 closure and private editorial holds](docs/progress/phase-6-closure-2026-10-07.md).
- [October 12 repair/verification handoff](docs/progress/pre-phase-7-repairs-2026-10-12.md).
- [Phase 7 status](docs/progress/phase-7-status.md).
- [Launch checklist](docs/ops/LAUNCH_CHECKLIST.md).
- [Deployment](docs/ops/DEPLOYMENT.md).
- [Release runbook](docs/ops/RELEASE_RUNBOOK.md).
- [Backups](docs/ops/BACKUPS.md).
- [Editorial independence](docs/product/EDITORIAL_INDEPENDENCE.md).
- [Existing growth scorecard](docs/growth/GROWTH_KPIS.md).
- [Partnership operations](docs/growth/PARTNERSHIP_OPERATIONS.md).
- [Current company art/character rules](../../design_system/plans-and-designs/BRAND.md).
- [Shared character lore](../../design_system/brand/characters/v2/lore.js).
- [Current company story implementation](../../design_system/twargaops-site-v4/README.md).

### 34.6 External references

The research report records retrieval context and limitations. Revalidate version-sensitive specifications, prices and commercial terms before implementation.

- [MCP specification](https://modelcontextprotocol.io/specification/latest).
- [MCP authorization](https://modelcontextprotocol.io/specification/latest/basic/authorization).
- [MCP security practices](https://modelcontextprotocol.io/specification/latest/basic/security_best_practices).
- [DigitalOcean affiliate agreement](https://www.digitalocean.com/legal/affiliate-program-agreement).
- [Hetzner Cloud FAQ](https://docs.hetzner.com/cloud/general/faq/).
- [Spare Cores API and licensing documentation](https://docs.sparecores.com/api).
- [Gmail sender guidelines](https://support.google.com/a/answer/81126?hl=en).
- [ICO electronic-mail guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/).
- [FTC endorsement guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking).
- [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies).

**Completion rule:** implement and verify the current release's defined outcome. Do not make launching the useful V1 website depend on completing the entire future platform.
