---
title: "bestvpsforme.com - The Product Blueprint"
description: "Definitive pre-coding product plan for a trustworthy VPS comparison and recommendation platform"
date: 2026-08-30
status: "Build authority after approval"
---

**BESTVPSFORME.COM**

# The Product Blueprint

> A definitive pre-coding plan for building the easiest, most trustworthy VPS finder for beginners - with a low-maintenance operating system behind it.

> **THE PRODUCT IN ONE SENTENCE**
>
> Turn confusing VPS offers into a small, honest shortlist that explains **what fits, what it really costs, what the catch is, and why the recommendation can be trusted.**

| PRODUCT | DECISION | OPERATING CONSTRAINT |
| --- | --- | --- |
| Public comparison + guided finder | Experience and trust before traffic monetization | One founder, side project, roughly 30 providers |
| Domain | bestvpsforme.com | Very low fixed cost and minimal maintenance |
| Document status | Build authority after approval | Strategy first; current MVP is only a learning prototype |

Research and product planning edition  /  30 August 2026

Prepared as an implementation-ready guide for the founder, designer, developer, data operator, marketing agent, and future partners.

---

# How to use this blueprint

> This is the source of truth before the rebuild. It separates decisions from ideas and defines the product, interface, data, administration, measurement, and operating rhythm as one system.

1. **Founder:** read Chapters 1-6, 14, 18, and 19 first. They define the promise, scope, economics, and sequence.
2. **Designer:** use Chapters 7-10 as the page brief. Do not invent a different interaction model without documenting the reason.
3. **Developer or coding agent:** implement the phased build in Chapter 19 and satisfy the acceptance gates in Chapter 20.
4. **Data operator:** use Chapters 11-13 and 17. A plan is not publishable merely because its price and RAM are known.
5. **Marketing and partnerships:** use Chapters 15-18. Community participation, affiliate disclosure, and provider relationships are operational rules, not copywriting details.

> **Decision language**
>
> **MUST** is required for launch. **SHOULD** is expected unless evidence argues otherwise. **LATER** is deliberately excluded from the first release. This prevents the document from becoming an unlimited wishlist.

## Table of contents

| # | CHAPTER | PURPOSE |
| --- | --- | --- |
| 01 | The decision | Product thesis, positioning, north-star experience |
| 02 | Prototype audit | What fails, what survives, rebuild boundary |
| 03 | Market and competitors | Patterns to copy, traps to avoid, strategic opening |
| 04 | Customers and jobs | Audience segments, anxieties, success moments |
| 05 | Product principles | Non-negotiable behavior and ethical policy |
| 06 | Scope and information architecture | Launch surface, later surface, routes |
| 07 | Experience architecture | End-to-end flows and responsive behavior |
| 08 | Homepage specification | The useful front door |
| 09 | Catalog, comparison, and detail | Fast scanning without spreadsheet pain |
| 10 | Finder wizard | Beginner guidance and explainable results |
| 11 | Recommendation engine | Eligibility, scoring, confidence, editorial controls |
| 12 | Data foundation | Entity model, price truth, provenance, lifecycle |
| 13 | Admin operating system | Maintenance queue, imports, verification, audit |
| 14 | AI-assisted operations | Safe automation with approval boundaries |
| 15 | Measurement and affiliate system | Events, attribution, conversions, fairness |
| 16 | Communication and partnerships | Domain email, CRM, outreach, sponsor rules |
| 17 | Technical architecture | Low-cost stack, deployment, backups, security |
| 18 | Growth and market entry | SEO, communities, content, first users |
| 19 | Roadmap and cost plan | Phases, epics, effort, monthly budget |
| 20 | Acceptance gates | Definition of ready, QA, launch checklist |
| 21 | Appendices | Field dictionary, events, backlog, source notes |

---

# The decision

> The product is not a VPS directory with filters. It is a decision assistant whose evidence happens to be stored in a catalog.

## Product thesis

People shopping for a VPS usually arrive with an outcome in mind - run n8n, host a small site, install Coolify, deploy a game server, move from shared hosting - but providers sell infrastructure vocabulary. The product wins by translating between those two worlds. It should reduce a messy market to a defensible choice in less than five minutes, while still giving technical users enough controls to inspect the evidence.

> **North-star experience**
>
> A visitor says what they want to run, where their users are, their realistic budget, and how much server management they accept. The site returns three to five choices with a plain-English reason, the real payment terms, a visible caveat, and the evidence freshness. The visitor can compare, verify, and leave without creating an account.

## Positioning statement

**For beginners and practical builders who need a VPS but do not want to become hosting experts, bestvpsforme.com is the plain-English VPS finder that compares real offers by workload fit, total cost, evidence, and operational difficulty. Unlike affiliate listicles and specification tables, it shows why a plan fits, what is unknown, and what could go wrong.**

## The durable advantage

| LAYER | WHAT USERS SEE | WHAT IS HARD TO COPY |
| --- | --- | --- |
| Language | Simple explanations, honest catches, “no VPS” answer | A consistent editorial vocabulary and workload taxonomy |
| Decision logic | A shortlist rather than an undifferentiated rank | Eligibility rules, cost normalization, confidence and workload fit |
| Evidence | Verified date, source, price history, unknown fields | Repeatable verification workflow and historical records |
| Operations | Fresh links and fewer bad surprises | Admin queue, diff approval, monitoring, audit trail |
| Trust | Affiliate labels and sponsor separation | Governance that prevents revenue from silently changing ranking |

## North-star and guardrails

| TYPE | METRIC | FIRST TARGET |
| --- | --- | --- |
| North star | Qualified recommendation sessions: visitor completes enough input to receive a valid shortlist and opens at least one explanation or comparison | Measure from launch; seek 25%+ of finder starts |
| Speed | Median time from landing to useful shortlist | Under 3 minutes; catalog scan under 60 seconds |
| Trust | Shortlist items with source, checked date, cost terms, and catch | 100% of recommended items |
| Quality | Outbound click after a comparison/explanation event | Track baseline, not a vanity target |
| Guardrail | Affiliate availability effect on organic rank | Exactly zero |
| Freshness | Tier-A offer verification within policy | 95%+ |
| Ops | Founder maintenance time | Under 2 focused hours per week after stabilization |

---

# Prototype audit

> The current MVP proved that the concept can be rendered. It did not yet prove the product, the recommendation logic, or the operating model.

## Executive diagnosis

> **Rebuild, do not polish**
>
> The current application should be treated as a disposable prototype and a source of useful vocabulary. Improving its styles would preserve the wrong structure: a flat plan record, manual featured flags, shallow wizard logic, and click totals without provenance or conversion context.

| AREA | CURRENT PATTERN | WHY IT BREAKS | DECISION |
| --- | --- | --- | --- |
| Data | One plan row mixes hardware, price, billing, location, and flags | A price changes independently from hardware; one plan can have many locations and terms | Split product, offer, location, evidence, and history |
| Ranking | Price divided by RAM plus a manual featured flag | Rewards cheap RAM, ignores workload, commitment, CPU allocation, risk, and evidence | Replace with gates + workload score + confidence |
| Wizard | Budget, job, location with hard-coded RAM mapping | Cannot explain assumptions or distinguish operational skill and scale | Use a four-step guided model with transparent rules |
| Admin | Edit a few plan fields and import partial JSON | No diff, validation, evidence, rollback, freshness queue, or bulk workflow | Build an operator-first control room |
| Analytics | Plan clicks and referrer | No position, intent, result set, link type, conversion, or revenue status | First-party event model plus affiliate conversion import |
| Editorial | Featured and note fields | Paid or personal preference can silently affect visibility | Collections with disclosed criteria and audited overrides |

## What survives

- **The one-process mindset:** a single server and SQLite are appropriate for this scale when backups and migrations are disciplined.
- **The scannable list:** users need dense comparison, but it must include cost truth, freshness, confidence, and caveats.
- **The three entry modes:** quick homepage, full catalog, and guided finder are the correct overall shape.
- **Light editorial visual direction:** calm, legible, instrument-like UI suits a trust product better than dark hosting-gamer aesthetics.
- **Affiliate as a bonus:** the business can remain useful even when a provider has no program.

## Migration policy

1. Freeze the current MVP after extracting the provider list, plan examples, brand language, and any hand-verified links.
2. Do not import existing records directly into production. Send them through the new staging validator, because the old schema cannot prove billing terms or evidence.
3. Build the new database through migrations. Create a one-time converter that produces staged records and a missing-field report.
4. Launch the new product only when every visible recommended offer passes the publication gate. Catalog coverage can grow after launch.
5. Keep an export of the old SQLite database for reference. It is not the new source of truth.

---

# Market and competitors

> The category contains directories, benchmark specialists, cloud price engines, and affiliate editorial sites. No single product owns beginner clarity plus verifiable deal truth.

## Competitive pattern matrix

| PRODUCT | STRENGTH TO LEARN FROM | WEAKNESS / OPENING | RESPONSE |
| --- | --- | --- | --- |
| VPSBenchmarks | Repeatable tests, recency window, category grades, price-weighted view | Benchmark depth can overwhelm beginners; coverage economics can shape inclusion | Link evidence to plain-language workload consequences; publish coverage policy |
| VPSLocate | Fast filters, city-level location, explicit update date, independence claim | Directory utility is strong but guidance and operational fit are thin | Match filter usefulness, add explained shortlist and “catch” |
| servers.fyi | Broad infrastructure filters and real-time price ambition | Cloud-style complexity and uncertain freshness semantics for ordinary buyers | Define exactly what “checked” means; never use vague “live” claims |
| CompareVPS | Strong specification table, feature depth, fee disclosure, normalized monthly cost | Dense table still expects users to know which specs matter | Offer progressive disclosure and workload-specific defaults |
| vpsudo | Mix of offers, providers, guides, learning content | Editorial and comparison layers can blur | Keep methodology, affiliate status, and ranking logic adjacent to decisions |
| Affiliate listicles | SEO coverage and persuasive provider narratives | Often stale, selective, opaque, and hard to compare | Use structured data, price history, citations, corrections, and independent ordering |

## Table stakes

- Price, RAM, vCPU, storage, transfer, region, provider, and billing filters.
- Readable monthly normalization without hiding the cash due today or renewal.
- Provider and use-case pages that can be indexed and shared.
- Comparison of at least two offers and outbound links that remain traceable.
- Mobile usability: the product cannot be a desktop spreadsheet shrunk to a phone.

## Where to be deliberately better

| BET | USER VALUE | PROOF IN THE UI |
| --- | --- | --- |
| Cost truth | Avoids “$2/month” offers that require a large prepayment or renew higher | Effective monthly + pay today + commitment + renewal side by side |
| Fit before value | A cheap plan that cannot run the workload is not a deal | Eligibility reason and workload baseline shown before score |
| Uncertainty | Unknown facts stop pretending to be average facts | Confidence badge, missing fields, evidence date, source type |
| Operational reality | A beginner understands backups, control panel, support, and management burden | Difficulty and recovery fields in results |
| No-VPS outcome | Trust increases when the tool says shared hosting or managed service is safer | Alternative result with explanation, never forced catalog match |
| Correction loop | Users and providers can repair errors visibly | Correction link on every offer; public changelog for material changes |

## Anti-features

> **Do not compete on fake scale**
>
> Do not claim “thousands of plans,” “real-time prices,” or “AI-tested” unless the operating system can prove those exact words. Thirty well-maintained providers with clear evidence are more valuable than a giant stale feed.

---

# Customers and jobs

> The primary customer is not “a VPS buyer.” It is a person trying to avoid an expensive or confusing infrastructure mistake.

## Priority segments

| SEGMENT | JOB | FEAR | WHAT WINS |
| --- | --- | --- | --- |
| Beginner builder | Deploy an app, automation, bot, or small service | Buying too little, losing data, not knowing Linux | Guided baseline, difficulty label, backup warning, install path |
| Self-hoster | Run several Docker services affordably | Resource contention, storage growth, provider policy | RAM headroom, disk type, port, transfer, region, recovery detail |
| Small site owner | Move from shared hosting or host WordPress | Maintenance and email deliverability | Managed alternative, panel/support fields, clear “VPS may not be best” |
| Price hunter | Find rare low-cost offers | Promo tricks, long commitments, missing IPv4 | Total cost, renewal, setup/IP fees, freshness and price history |
| Practical technical buyer | Shortlist infrastructure quickly | Marketing claims and incomplete comparison | Dense filters, evidence links, compare mode, export/share URL |

## Jobs-to-be-done statements

- When I know the software but not the server size, help me translate the workload into a safe starting point so I do not underbuy or waste money.
- When providers advertise prices differently, show me the same cost vocabulary so I can compare without doing arithmetic.
- When a deal looks unusually cheap, show me the catch and how recently it was verified so I can judge the risk.
- When I have specific constraints, let me inspect and change them without restarting a quiz.
- When I am ready to buy, let me understand why the link may earn commission and whether that affected the recommendation.
- When I am not ready for a VPS, tell me plainly and suggest the safer category.

## Beginner language contract

| AVOID AS PRIMARY LABEL | USE FIRST | DETAIL ON DEMAND |
| --- | --- | --- |
| KVM / LXC / hypervisor | Virtualization type | Explain isolation and compatibility in a tooltip |
| Unmetered 1 Gbps | Network allowance | Port speed, fair-use policy, transfer amount |
| NVMe 80 GB | Fast storage - 80 GB | Storage technology, local vs network, RAID if known |
| vCPU | CPU share | Core count, shared/dedicated, model/generation, benchmark evidence |
| SLA | Uptime promise | Percentage, exclusions, credit remedy, evidence source |
| Managed | How much server work you do | Scope, response channel, panel, exclusions |

## Research questions after launch

- Which workloads create the most finder starts and qualified clicks?
- Which result explanations are opened before purchase-oriented clicks?
- Where do visitors abandon the finder, and was the question unclear or too personal?
- Which “unknown” fields most often block a decision?
- Do users prefer a lowest-cost, easiest, or best-balanced recommendation?
- What corrections recur by provider or field?

---

# Product principles

> These rules protect the product when traffic, affiliate money, provider pressure, and AI automation arrive.

> **1. Fit is a gate, not a bonus**
>
> An offer that fails a workload minimum is ineligible, even if it is very cheap.

> **2. Price is a sentence, not a number**
>
> Always express effective monthly cost, cash due now, commitment, setup/IP charges, promo window, and renewal when applicable.

> **3. Unknown is visible**
>
> Never convert missing evidence into a neutral score. Reduce confidence and show what is missing.

> **4. Explain the shortlist**
>
> Every recommendation needs a reason, a catch, and a source/freshness trail.

> **5. Revenue cannot change truth**
>
> Affiliate status cannot affect organic eligibility or ordering. Sponsored placements are separate and labeled.

> **6. The default is simple**
>
> Show the fields most people need first; keep complete technical controls available under “More filters” and detail.

> **7. The operator is a user**
>
> If the founder cannot verify, import, correct, and publish in a calm workflow, the public catalog will decay.

> **8. AI prepares; humans publish**
>
> Automation may collect, normalize, flag, and draft. It does not silently change public price, rank, or link.

> **9. No account is required**
>
> Browsing, filtering, wizard results, comparing, and sharing must work without registration.

> **10. Be useful before monetized**
>
> A non-affiliate offer is first-class. A direct link is always preserved in the data model.

## Public trust promises

- Show “How we choose” beside ranked surfaces.
- Put commission disclosure near purchase links, not only in a footer.
- Publish the last material verification time and what was checked.
- Offer a correction path that identifies the specific plan and field.
- Keep sponsored content visually and algorithmically separate.
- Publish major methodology changes in a dated changelog.

---

# Scope and information architecture

> The launch surface is intentionally small. Depth comes from better data and explanations, not from dozens of thin pages.

## Launch routes

| ROUTE | PURPOSE | LAUNCH |
| --- | --- | --- |
| / | Useful front door: compact deals, workload entry, trust proof, path to catalog | MUST |
| /vps | Complete catalog with URL-state filters, sorting, comparison tray | MUST |
| /finder | Four-step guided recommendation with editable assumptions | MUST |
| /compare?plans=... | Side-by-side decision view for two to four offers | MUST |
| /providers | Provider index with coverage and verification status | MUST |
| /providers/[slug] | Provider facts, available offers, policies, evidence, corrections | MUST |
| /use-cases/[slug] | Workload baseline, explanation, eligible recommendations | MUST for 6-8 workloads |
| /methodology | Eligibility, score, confidence, price normalization, monetization policy | MUST |
| /affiliate-disclosure | Plain-language commercial relationship policy | MUST |
| /corrections | Submit and track a factual correction | MUST |
| /changelog | Material data and methodology updates | SHOULD |
| /about | Founder intent, scope, limitations, contact | MUST |

## Admin routes

| AREA | CORE JOB |
| --- | --- |
| /admin | See what needs attention today, not vanity charts |
| /admin/providers | Manage provider identity, contacts, policies, affiliate state |
| /admin/plans | Manage stable product definitions |
| /admin/offers | Manage changing price, billing, availability, and link records |
| /admin/verification | Review stale items, evidence, automated diffs, and approval |
| /admin/imports | Map, validate, preview, approve, and roll back batches |
| /admin/workloads | Edit workload rules and test results against fixtures |
| /admin/collections | Simulate and publish editorial collections with criteria |
| /admin/analytics | Understand intent, clicks, funnels, and data quality |
| /admin/affiliates | Track program terms, links, sub-IDs, and conversions |
| /admin/partners | Provider contacts, outreach, conversations, commitments |
| /admin/content | Edit methodology, use cases, notices, and changelog |
| /admin/system | Users, audit, jobs, backups, health, secrets references |

## Deliberately later

- User accounts and saved shortlists
- Price alerts and newsletters
- Public user reviews and ratings
- Automated benchmark laboratory
- Provider self-service portal
- Multi-language and multi-currency localization beyond display conversion
- Public API
- Native mobile application
- Complex sponsorship marketplace

> **Scope test**
>
> A feature belongs in launch only if it directly improves recommendation correctness, comparison clarity, trust, or founder maintenance. “Could help SEO” is not enough by itself.

---

# Experience architecture

> Three entry modes meet different confidence levels, but all converge on the same result model and evidence.

## The three paths

| PATH | FOR WHOM | INPUT | SUCCESS |
| --- | --- | --- | --- |
| Quick deals | Visitor wants a fast sense of the market | Optional workload chip and region | Understands 5-8 notable offers and opens one detail |
| Catalog | Visitor knows constraints or wants control | Filters, sort, compare, search | Narrows to a stable shareable set |
| Finder | Visitor knows outcome, not specifications | Workload, scale, location, budget, management comfort | Receives 3-5 explained choices or a non-VPS answer |

## Shared result anatomy

1. **Identity:** provider, plan name, location availability, and a clear status.
2. **Fit sentence:** “Good starting point for one n8n instance and a small database.”
3. **Cost truth:** effective month, pay today, commitment, renewal, and known extras.
4. **Core capacity:** CPU allocation, RAM, storage, transfer/port, with unknowns explicit.
5. **Evidence:** checked date, source type, confidence, and expandable source link.
6. **Catch:** one decision-relevant limitation, never generic marketing copy.
7. **Actions:** compare, details, visit provider. The commercial link label appears on the visit action.

## Interaction rules

- Every filter change updates the URL and browser history deliberately; shared links reproduce the result.
- Fast filters update immediately. Expensive text search may debounce by roughly 150-250 ms.
- A user can change finder assumptions from the result page without restarting.
- Back navigation restores scroll, filters, comparison selection, and expanded row when possible.
- Focus moves intentionally after dialogs, drawers, and finder steps; no keyboard traps.
- Reduced-motion users receive no spring, parallax, or animated reordering.
- Loading states preserve table geometry to avoid layout shift.

## Mobile policy

Do not render a ten-column table and ask users to swipe blindly. The mobile result is a compact comparison row: provider and fit first; cost and RAM visible; CPU/storage/location as a tight secondary line; evidence and catch below; details expand in place. Filters open as a full-height sheet with applied values retained. The comparison tray becomes a bottom bar with count and a single action.

---

# Homepage specification

> The homepage should answer “Can this site help me?” in ten seconds and deliver useful market data before asking for commitment.

## Page sequence

| ORDER | SECTION | PURPOSE | KEY ELEMENTS |
| --- | --- | --- | --- |
| 01 | Utility header | Identity and direct navigation | Wordmark; Browse VPS; Finder; Methodology; no oversized nav |
| 02 | Decision hero | State promise and start action | One strong sentence; workload selector; budget optional; “Find mine” |
| 03 | Compact market board | Immediate product proof | 5-8 rows; Best balanced / lowest honest cost / easiest; region switch |
| 04 | Trust strip | Explain why results deserve attention | Checked dates; price truth; affiliate independence; correction path |
| 05 | Use-case entrances | Help visitors name the job | 6-8 workload chips with baseline RAM and difficulty |
| 06 | How it decides | Make method understandable | Fit gate -> cost truth -> evidence -> shortlist |
| 07 | Provider coverage | Demonstrate breadth without logo wall | Coverage count, locations, freshness; searchable provider link |
| 08 | Learning block | Answer beginner hesitation | VPS vs shared/dedicated/cloud; two or three guides |
| 09 | Footer | Trust and contact | Disclosure, methodology, corrections, contact, data date |

## Hero copy brief

> **Recommended direction**
>
> **Find the VPS that fits what you are actually building.**  \n> Compare real payment terms, server capacity, location, and the catches providers leave in the small print.  \n>   \n> **Primary:** Find my VPS    **Secondary:** Browse every offer

## Homepage market board

- Default to “Best balanced” for a common beginner workload, not a global best plan.
- Provide obvious context: workload, region, maximum effective monthly cost, and last refresh.
- Never show more than the fields needed to make the next click. Expand reveals the complete offer.
- A “Why this appears” link explains collection criteria. If an item is manually pinned, record and disclose the reason.
- Sponsored units, if ever used, sit outside the organic table with a “Sponsored” label and cannot mimic an organic row.

## Visual direction

**Editorial instrument.** Warm off-white canvas, near-black ink, restrained rose-red actions, green for verified facts, blue for informational states, amber for uncertainty. Use one sans family plus a mono face for prices and data. Favor rules, alignment, whitespace, and sharp information hierarchy over card piles, glass, gradients, or animated decoration.

| TOKEN | DIRECTION | USAGE |
| --- | --- | --- |
| Canvas | #F6F2EA warm paper | Page background and quiet groups |
| Surface | #FFFEFB | Tables, drawers, forms |
| Ink | #18211F | Primary text and dark table headers |
| Action | #D64B57 | Primary actions and active filters only |
| Verified | #226B52 | Fresh evidence and successful checks |
| Unknown | #A4681D | Caveats, missing or stale evidence |
| Radius | 6-10 px | Functional softness, not pill-shaped everything |
| Motion | 120-220 ms | State change, drawer, row expansion; no spectacle |

---

# Catalog, comparison, and detail

> The catalog should feel fast and capable, not like a database administration screen.

## Default catalog layout

- Desktop: compact sticky control bar, result count and active chips, then a true semantic table. Keep 6-7 default columns.
- Wide desktop: optional left filter rail only after there are enough filters to justify it. Do not sacrifice result width prematurely.
- Mobile: results as dense accessible rows; a filter sheet and sticky compare bar.
- Filters are grouped as Quick, Performance, Cost terms, Location, Network, Operations, and Evidence.
- The first load uses a meaningful default: available, verified-enough, normalized monthly ascending within a balanced relevance sort.

## Filter dictionary

| GROUP | DEFAULT VISIBLE | MORE FILTERS |
| --- | --- | --- |
| Intent | Workload, search | Management comfort, architecture |
| Cost | Maximum effective monthly, billing flexibility | Pay-today cap, commitment, renewal known, setup/IP fee |
| Capacity | Minimum RAM, vCPU, storage | Shared/dedicated CPU, CPU vendor/model, disk type |
| Location | Region/country | City, provider location count |
| Network | Transfer minimum | Port speed, unmetered/fair-use, IPv4 included, IPv6 |
| Operations | Managed/unmanaged | Backups, panel, snapshots, support channel |
| Trust | Freshness | Evidence type, confidence floor, tested-only |
| Provider | Provider selector | Affiliate/non-affiliate must never be a quality filter |

## Sort options

| SORT | MEANING | RULE |
| --- | --- | --- |
| Recommended | Workload fit, cost, operations, evidence | Requires workload or explicit default context |
| Lowest honest monthly | Effective monthly price | Ties broken by pay-today then confidence |
| Lowest cash today | Initial payable amount | Do not imply it is cheapest long-term |
| Most RAM / storage / transfer | Raw capacity | Unknown always below known values |
| Recently verified | Evidence freshness | Not the same as newest plan |
| Beginner-friendly | Management, docs, backup, support fit | Separate from raw hardware value |

## Comparison specification

- Compare two to four offers. A fifth selection requires replacing one.
- Pin the left label column and keep difference highlighting accessible without color alone.
- Start with decision summary: best for, total first-year, pay today, main catch, confidence.
- Then group cost, hardware, network, locations, operations, support, and evidence.
- Hide identical rows by default with a visible toggle.
- Each commercial action repeats its commission label and direct destination domain.

## Offer detail drawer/page

Use a drawer for quick catalog inspection and a canonical page when deep linking, SEO, or correction context matters. Both render from the same content component. The top should say: fit, total cost, catch, checked date. Provider marketing prose is lower priority than the decision record.

---

# Finder wizard

> The wizard translates a goal into constraints. It should feel like a knowledgeable friend asking only questions that change the answer.

## Four-step model

| STEP | QUESTION | WHY IT CHANGES THE RESULT | INTERACTION |
| --- | --- | --- | --- |
| 1. Workload | What are you running? | Selects minimum and preferred resource rules | Searchable cards: n8n, Coolify, Docker stack, WordPress, Nextcloud, OpenClaw, VPN, game server, other |
| 2. Scale | How much will it do? | Adds headroom for users, services, database, files, concurrency | Three plain-language levels plus optional advanced edit |
| 3. Location | Where are your users or you? | Latency, availability, legal/policy preference | Recommended nearby region; country/city optional; “not important” |
| 4. Budget + comfort | Budget, commitment, and server skill? | Separates unmanaged bargain from safer managed choice | Monthly cap, pay-today cap, commitment, beginner/comfortable/expert |

## Result set roles

| ROLE | PROMISE | SELECTION LOGIC |
| --- | --- | --- |
| Best balanced | Safest default trade-off | Highest fit with confidence and operational guardrails |
| Lowest honest cost | Cheapest eligible option after normalized terms | Minimum effective cost; must pass confidence floor |
| Easiest to operate | Least risky for the selected comfort level | Management, backup, support, docs, panel |
| Performance choice | Extra headroom where workload benefits | Preferred CPU/RAM/storage/network, not merely most expensive |

## Every result must explain

- The exact workload assumptions used.
- Why the plan is eligible.
- Why it occupies this result role.
- The single most important caveat.
- What is unknown or stale.
- The cost now and later.
- How to change an assumption that would alter the result.

## No-VPS outcomes

> **Trust-building answer**
>
> If the user wants hands-off WordPress, reliable email, and no Linux administration at a tiny scale, recommend the **category** “managed WordPress/shared hosting” and explain why. If the workload requires GPU, enterprise compliance, or very high availability outside the catalog, say the finder cannot safely recommend from current coverage.

## Wizard acceptance cases

| CASE | EXPECTED |
| --- | --- |
| n8n, small, EU, $8, beginner | Reject sub-minimum RAM; prefer 4 GB or safe 2 GB only when workload rule allows; flag backup and management |
| Coolify with database, medium | Apply overhead and storage headroom; prioritize 4+ GB, disk quality, backup and port |
| WordPress, no server skills | Offer managed category before unmanaged VPS |
| Any workload with annual promo | Show cash due and renewal; do not rank by advertised monthly alone |
| Location unavailable | Explain nearest alternative and allow user to relax constraint |
| All eligible offers low-confidence | State insufficient evidence; do not manufacture a “best” result |

---

# Recommendation engine

> The engine is a transparent rules system, not an unknowable AI ranker. AI can help maintain inputs, never replace the decision policy.

## Pipeline

1. **Normalize:** convert units and billing terms while preserving original values and currency.
2. **Validate:** reject impossible or contradictory records; mark missing decision fields.
3. **Eligibility:** apply availability, budget, location, architecture, policy, and workload hard minimums.
4. **Score fit:** compute workload, cost, evidence, recovery/operations, and performance components.
5. **Apply confidence:** uncertainty caps or discounts a score; it never becomes an average fact.
6. **Diversify shortlist:** avoid returning four nearly identical offers from one provider unless genuinely dominant and disclosed.
7. **Explain:** produce deterministic reason codes mapped to human text.
8. **Audit:** store rule version, inputs, candidates, exclusions, component scores, and final positions.

## Recommended component weights

| COMPONENT | WEIGHT | EXAMPLES |
| --- | --- | --- |
| Workload fit | 30% | Minimum pass, preferred headroom, workload-sensitive resource quality |
| Cost truth/value | 20% | Effective price, first-year total, upfront burden, commitment flexibility |
| Performance evidence | 15% | Allocation, CPU/disk/network evidence, relevant benchmark recency |
| Reliability and recovery | 15% | Backups/snapshots, status history, restoration path, policy clarity |
| Operability | 10% | Management, docs, panel, support, reinstall/console |
| Evidence confidence | 10% | Source authority, completeness, freshness, conflicting evidence |

Weights are a starting policy, not a universal scientific truth. Maintain a versioned weight set per workload family when evidence justifies it. The UI should show component labels and reasons, not a false-precision “92.43/100.”

## Hard eligibility examples

| RULE | FAIL RESULT |
| --- | --- |
| Offer unavailable, discontinued, or link fails verification | Exclude |
| Effective monthly or cash due cannot be derived | Exclude from ranked result; catalog may show “price incomplete” |
| RAM below workload minimum | Exclude |
| Architecture incompatible with workload | Exclude |
| Location is strict and not offered | Exclude |
| Pay today exceeds user cap | Exclude |
| Provider policy conflicts with intended workload | Exclude |
| Evidence older than maximum ranked freshness | Exclude or cap based on tier policy |

## Cost normalization

> **Core formulas**
>
> **effective_monthly_initial** = (recurring charge + mandatory setup + mandatory IP + mandatory service charges) / initial service months.  \n> **cash_due_now** = all mandatory charges at checkout before tax if tax is location-dependent.  \n> **first_year_total** = actual charges covering the first 12 months, including setup and renewal if the promo expires inside year one.  \n> **renewal_effective_monthly** is stored separately. Never average an unknown renewal into zero.

## Confidence model

| DIMENSION | HIGH | MEDIUM | LOW / UNKNOWN |
| --- | --- | --- | --- |
| Source | Provider checkout/API/official plan page | Official announcement or support answer | Third-party list, screenshot without context |
| Freshness | Within tier policy | Approaching expiry | Expired or no date |
| Completeness | All decision fields verified | One non-critical field missing | Cost or core capacity incomplete |
| Agreement | Sources agree | Minor ambiguity documented | Conflicting values unresolved |

## Editorial control

- Organic ordering is generated from versioned rules.
- Collections have written eligibility and selection criteria.
- A manual override requires reason, author, expiry, before/after, and public disclosure if material.
- Affiliate and sponsor fields are not available to the organic scoring function.
- Run a regression fixture suite before publishing a rule version.
- Provide an admin simulator that shows component deltas and exclusion reasons.

---

# Data foundation

> The database must represent how offers actually change. Good UI cannot repair a model that stores an advertised price as a single float.

## Entity map

| ENTITY | MEANING | RELATIONSHIPS |
| --- | --- | --- |
| Provider | Company identity and stable policies | Has contacts, products, affiliate programs, communications |
| Product / plan | Stable named server configuration family | Belongs to provider; has offers and features |
| Offer | Purchasable price and billing terms at a point in time | Belongs to product; available in many locations |
| Location | Region/country/city/datacenter | Many-to-many with offer; stores availability |
| Evidence record | A claim plus source and capture context | Supports provider/product/offer/feature field |
| Verification run | A checking activity and outcome | Creates evidence and staged changes |
| History | Price/availability/field changes over time | Append-only from approved publications |
| Workload rule | Versioned requirements and preferences | Evaluates products/offers |
| Outbound link | Direct or tracked destination | Versioned, status-checked, classified |
| Click/conversion | Commercial and behavior measurement | References exact link, offer, context, position |

## Offer cost fields - required

| FIELD | EXAMPLE | RULE |
| --- | --- | --- |
| currency + charge amount | EUR 12.00 | Use integer minor units, never binary float |
| charge interval | 12 months | Do not flatten to “annual” string |
| service months covered | 12 | May differ from charge interval in promotions |
| commitment months | 12 | Zero/monthly is distinct from unknown |
| setup fee / IPv4 / mandatory extras | EUR 0 / EUR 1.00 month | Separate fields with cadence |
| cash due now | EUR 13.00 | Derived and optionally checkout-verified |
| effective monthly initial | EUR 3.00 | Derived with calculation version |
| intro ends / promo expires | date or after term | Explicit unknown supported |
| renewal charge and interval | EUR 60 / 12 months | Separate evidence and checked date |
| tax treatment | exclusive / inclusive / location-dependent | Never promise final total when tax unknown |

## Hardware and service fields

| GROUP | FIELDS |
| --- | --- |
| CPU | vCPU count; shared/dedicated/burstable; architecture; vendor/model/generation if known; benchmark evidence link |
| Memory | RAM MiB; ECC if evidenced; swap not counted as RAM |
| Storage | size GiB; type; local/network; included volume count; snapshot/backup availability and cost |
| Network | transfer GiB/TiB; period; ingress/egress policy; port Mbps/Gbps; unmetered and fair-use evidence; IPv4/IPv6 |
| Virtualization | KVM/LXC/other; nested virtualization if relevant; custom ISO; kernel constraints |
| Operations | managed scope; control panel; console; reinstall; snapshots; automatic backups; support channels/hours |
| Commercial | refund/trial; SLA wording; cancellation; payment methods; prohibited workloads; transferability |

## Publication state machine

| STATE | MEANING | PUBLIC |
| --- | --- | --- |
| Draft | Incomplete manual work | No |
| Staged | Imported or AI-proposed and validated | No |
| Review needed | Conflict, suspicious delta, or missing critical evidence | No |
| Approved | Human accepted the complete change set | Not until publish action |
| Published | Current public record | Yes |
| Stale | Freshness policy expired | Catalog maybe; ranked surfaces depend on policy |
| Unavailable | Cannot purchase currently | History/detail only |
| Archived | Discontinued or merged | Historical route and redirects |

## Freshness tiers

| TIER | EXAMPLES | TARGET | ON EXPIRY |
| --- | --- | --- | --- |
| A | Homepage, finder results, popular clicked offers | Check weekly or after alert | Remove from ranked surfaces until checked |
| B | Published catalog offers with moderate interest | Check monthly | Show stale warning; exclude after grace period |
| C | Long-tail/archive/reference | Quarterly or event-driven | Retain as reference with date |

## Evidence rules

- Store source URL, source type, captured timestamp, checked timestamp, locale/currency context, and operator/agent.
- Store a short factual excerpt or structured snapshot only where lawful and necessary; preserve a content hash for change detection.
- One evidence record supports one or several named fields, never an undefined “whole plan verified.”
- Checkout evidence outranks a blog post for payable terms. Official docs outrank third-party directories for specifications.
- When sources conflict, keep both and open a review task. Do not overwrite the inconvenient value.

---

# Admin operating system

> The admin is the product factory. Its home screen should answer “What must I fix today?” in under ten seconds.

## Admin dashboard

| ZONE | CONTENT | ACTION |
| --- | --- | --- |
| Attention queue | Stale Tier A, failed links, suspicious price deltas, incomplete ranked offers | Review now |
| Verification coverage | Ranked and catalog percentage by freshness/confidence | Open filtered list |
| Publication inbox | Staged imports, AI proposals, corrections, content drafts | Diff and approve |
| Commercial health | Qualified clicks, conversion imports, pending/reversed commission, broken tracked links | Reconcile |
| User signals | Top workloads, zero-result searches, abandoned finder questions, correction themes | Investigate |
| System health | Last backup, last restore test, cron/jobs, disk, error count, email delivery | Diagnose |

## Import studio

1. **Choose source:** CSV, JSON, clipboard, provider feed, or verification run.
2. **Map fields:** save a reusable mapping profile per provider/source.
3. **Normalize:** units, currencies, dates, intervals, locations, and provider naming.
4. **Validate:** show errors, warnings, duplicates, missing critical fields, and implausible deltas.
5. **Preview diff:** old value, proposed value, evidence, affected public pages and ranking impact.
6. **Approve:** per row, selected group, or complete safe batch. High-risk fields always require explicit review.
7. **Publish:** atomic transaction, audit record, history append, cache invalidation, and changelog candidate.
8. **Rollback:** revert the publication as a new audited version, never delete history.

## Plan and offer editor

- Two-column desktop form: editable record and persistent evidence/context rail.
- Inline cost calculator shows derived values before save.
- Location availability is a searchable multi-select with bulk operations.
- Critical unknowns appear as tasks, not silent empty inputs.
- Autosave drafts only; publication requires explicit action.
- Show all public surfaces affected by the change.
- Keyboard shortcuts: save draft, next stale item, approve, reject, open source.

## Ranking simulator

Select a workload fixture and optional user constraints. Show all candidates, gate failures, component scores, confidence adjustment, diversity step, and final reasons. Allow a proposed rule version to run beside the live version. A rule cannot publish while regression fixtures fail or an affiliate field is referenced by scoring code/configuration.

## Affiliate and conversion console

| OBJECT | ADMIN NEED |
| --- | --- |
| Program | Network, status, account, terms URL, cookie window, eligible products/regions, payout model, renewal eligibility |
| Link | Direct URL, tracked URL, sub-ID template, destination check, last click, classification, disclosure text |
| Conversion | Network ID, sub-ID/click match, order date, amount/currency, commission, pending/approved/reversed, import batch |
| Reconciliation | Clicks without conversion, duplicate conversions, currency normalization, reversals, missing programs |

## Operator experience standards

- Saved views for Tier A, missing renewal, link failed, high clicks, and no affiliate.
- Bulk editing is previewed and reversible.
- Every list supports column selection, filters, sort, export, and shareable admin URLs.
- Empty states say why no records exist and the next action.
- Audit is human-readable: who, what, why, before, after, source, and affected pages.
- The admin never depends on public page scraping for basic self-knowledge.

---

# AI-assisted operations

> Use AI to reduce repetitive research and writing. Do not give it invisible publishing authority.

## Safe agent loop

1. Scheduler selects due providers/offers based on freshness tier and user interest.
2. Agent opens approved sources and captures proposed structured facts with field-level citations.
3. Deterministic validators normalize and reject malformed or impossible values.
4. System creates a staged diff and classifies risk: low, medium, or high.
5. Founder reviews high-impact changes such as price, availability, billing, rank eligibility, and affiliate destinations.
6. Approved transaction publishes, appends history, invalidates relevant pages, and records the rule/agent version.
7. Monitoring checks broken links, abnormal click shifts, job errors, and stale Tier-A coverage.

## AI tasks worth automating

| TASK | OUTPUT | HUMAN CONTROL |
| --- | --- | --- |
| Source monitor | Changed-page alert and field candidates | Approve source allowlist and every public change |
| Normalization | Units, intervals, currencies, location aliases | Deterministic validator owns final conversion |
| Caveat drafting | Plain-English “catch” from structured facts | Editor approves tone and factual scope |
| Workload tagging | Suggested compatible workloads and reason codes | Rules engine decides eligibility |
| Community research | Themes, repeated pain, vocabulary, source links | No copying private/personal data; founder selects insights |
| Correction triage | Record match, claimed field, source summary | Founder resolves conflict |
| Partner outreach | Personalized draft based on coverage gap | Founder sends and records promises |
| Weekly brief | What changed, what is stale, what users seek | Information only |

## Actions AI must not take alone

- Publish or delete an offer
- Change organic weights or workload minimums
- Replace direct links with tracked links
- Accept provider claims without evidence
- Send partnership or sponsorship commitments
- Erase or rewrite audit/history
- Respond publicly in communities as if it were an independent user
- Create fake reviews, testimonials, or benchmark results

## Risk-based approval

| RISK | EXAMPLES | POLICY |
| --- | --- | --- |
| Low | Formatting, alias, spelling, non-public source metadata | May batch approve after validation |
| Medium | Non-critical specification, descriptive caveat, location addition | Human review before public publish |
| High | Price, commitment, renewal, availability, ranked eligibility, affiliate URL | Explicit per-change review and source open |
| Prohibited | Hidden sponsored rank, fabricated evidence, impersonation | System blocks and audits attempt |

---

# Measurement and affiliate system

> Measure whether the product helps decisions. Do not optimize only for raw outbound clicks, which can reward confusion and aggressive placement.

## Event taxonomy

| EVENT | WHEN | KEY PROPERTIES |
| --- | --- | --- |
| page_view | Meaningful route view | route type, provider/use-case slug, referrer class |
| catalog_filter | Filter applied/removed | field, normalized value, result count, workload context |
| catalog_sort | Sort changed | sort key, result count |
| finder_start | First answer or explicit start | entry route, initial workload |
| finder_step | Step completed/edited | step, answer class, elapsed, back/forward |
| shortlist_view | Valid finder results rendered | rule version, result count, zero-result reason |
| explanation_open | Why/catch/evidence expanded | offer, explanation type, position |
| compare_add / view | Offer added or comparison opened | offer IDs, count, context |
| outbound_click | Provider destination action | link ID, offer, position, link type, affiliate, sponsored, result-set ID |
| correction_submit | Valid correction sent | entity/field, source present, no personal text in analytics |

## Privacy policy for events

- Do not store full IP addresses in product analytics. Use server/security logs with short retention separately when required.
- Use a random first-party session identifier; avoid cross-site tracking.
- Do not send budget, workload notes, or correction text to third-party analytics.
- Retain raw product events for roughly 90 days initially, then daily aggregates; document final policy.
- Honor applicable consent and privacy requirements before adding marketing analytics or newsletters.
- Cloudflare Web Analytics can cover aggregate visits and Web Vitals; first-party events cover product decisions.

## Funnel and quality metrics

| QUESTION | METRIC |
| --- | --- |
| Does the site create useful decisions? | Qualified recommendation sessions / finder starts |
| Is catalog interaction productive? | Sessions reaching <=10 results plus detail/compare action |
| Are explanations useful? | Explanation open before compare/outbound; correction rate by field |
| Are results commercially useful? | Qualified outbound click rate, not all-click rate |
| Is revenue healthy? | Approved commission per qualified click; reversal rate; provider concentration |
| Is data trustworthy? | Freshness coverage, critical completeness, failed links, correction resolution time |
| Is the project sustainable? | Weekly operator minutes, staged-change backlog age, cost per month |

## Affiliate governance

1. Keep both direct and tracked URLs. A failed or unavailable affiliate relationship never removes the provider.
2. Show a clear commission disclosure close to commercial links. FTC guidance favors clear, conspicuous disclosure near the recommendation/link.
3. Generate sub-IDs that identify placement and campaign without personal data.
4. Import network conversions as pending, approved, or reversed; preserve the original currency and network record.
5. Never infer a conversion from a click. Use matched network data where available; report unmatched separately.
6. Create a quarterly concentration report: traffic, clicks, conversions, and revenue by provider. High revenue concentration is a product risk.
7. If a provider sponsors a placement, use a separate sponsored component. It does not enter organic score or masquerade as a deal.

## Dashboard order

Start with product health (finder completion, zero results, freshness, corrections), then decision behavior (compare and qualified clicks), then money (approved commission, reversals, provider concentration). This order prevents the founder from treating click maximization as the product goal.

---

# Communication and partnerships

> Professional communication can be simple: domain addresses, a contact history, clear requests, and promises that are never trapped in one inbox.

## Domain email setup

| ADDRESS | PURPOSE | ROUTE |
| --- | --- | --- |
| hello@bestvpsforme.com | General and user questions | Founder inbox |
| corrections@bestvpsforme.com | Data corrections and evidence | Founder + admin intake identifier |
| partners@bestvpsforme.com | Provider and affiliate relationships | Founder inbox + CRM record |
| security@bestvpsforme.com | Responsible security reports | Priority folder |
| privacy@bestvpsforme.com | Privacy requests | Priority folder |
| noreply@bestvpsforme.com | Transactional messages only | Outbound service; replies point to hello@ |

Use Cloudflare Email Routing for inbound forwarding. Current official documentation describes unlimited inbound routing on the free plan. Use an authenticated outbound provider such as Resend for transactional mail; its current free plan includes 3,000 emails per month with a 100/day limit. Configure SPF, DKIM, and DMARC, and send human partnership mail from a proper mailbox or SMTP service that supports normal replies and sent history.

## Lightweight partner CRM

| FIELD GROUP | DETAIL |
| --- | --- |
| Identity | Provider, contact name/role, email, channel, timezone, source |
| Relationship | Uncontacted, researching, contacted, replied, verifying, affiliate, sponsor discussion, inactive |
| Needs | Missing plan facts, API/feed request, correction, affiliate application, sponsorship |
| Conversation | Date, direction, subject, summary, commitments, attachment/source links |
| Follow-up | Owner, due date, next action, reminder |
| Commercial | Program/network, terms link, application status, tracking IDs, prohibited promotion methods |
| Governance | Claims received, evidence status, public effect, conflict note |

## Provider outreach sequence

1. **Accuracy first:** ask for a canonical public price/specification source and the best way to report changes.
2. **Coverage second:** share the current provider page and invite factual corrections with evidence.
3. **Feed/API third:** request a structured source only after proving the site maintains data responsibly.
4. **Affiliate fourth:** apply when there is relevant traffic or a clear content fit. Do not make coverage conditional.
5. **Sponsorship last:** offer only visibly separate inventory with written labels, dates, deliverables, and no ranking influence.

## Email templates - structure

| MESSAGE | STRUCTURE |
| --- | --- |
| Accuracy request | One-sentence identity; exact provider page; 2-4 disputed/missing facts; public sources requested; correction policy link; no sales pitch |
| Affiliate application | Audience/workloads; current coverage; traffic honestly stated; promotion methods; disclosure policy; request for terms/feed/contact |
| Sponsorship reply | Inventory and dates; exact label; reporting; creative constraints; no organic rank promise; price and cancellation; written approval |
| Correction resolution | Claim received; evidence checked; action; public date/change link; thanks; escalation path |

## Community identity policy

> **Never astroturf**
>
> Participate as the founder of bestvpsforme.com. Lead with useful answers and disclose the project when relevant. Several hosting communities restrict direct ads, referral links, or self-promotion. Read each community rule before posting and prefer research questions, transparent build logs, and methodology discussions over link drops.

---

# Technical architecture

> Use one boring, recoverable production unit. The side project does not need distributed systems; it needs data integrity, backups, speed, and an easy upgrade path.

## Recommended launch stack

| LAYER | CHOICE | WHY |
| --- | --- | --- |
| Application | Next.js App Router + TypeScript, single Node process | Existing familiarity, strong SSR/static routes, one codebase for public and admin |
| UI | Server Components by default; small client islands; custom tokens; accessible primitives | Fast initial load and distinctive interface without a heavy dashboard kit |
| Database | SQLite in WAL mode + Drizzle ORM/migrations | Right-sized for one writer/operator, typed schema, easy local copy and backup |
| Validation | Zod at all import/form boundaries | Same schemas for admin, ingestion, and jobs |
| Jobs | Systemd timers or cron + SQLite job records | No Redis or queue service at this scale |
| Proxy/TLS | Caddy in front of the app | Automatic TLS, compression, request limits, simple configuration |
| Deployment | Docker Compose or one reproducible systemd deployment | One command, persistent volume, explicit rollback image |
| DNS/edge | Cloudflare DNS/proxy, optional cache rules, Turnstile | Existing domain, bot protection, low cost |
| Backups | Encrypted restic snapshots to Cloudflare R2 plus local rolling copy | Off-server restore path; R2 current free tier is ample for a small database |
| Analytics | Cloudflare Web Analytics + first-party SQLite events | Privacy-first aggregate traffic plus product-specific behavior |
| Email | Cloudflare Email Routing inbound; Resend transactional outbound | Professional domain addresses at near-zero early cost |

## Why not serverless-first

Cloud/serverless stacks can have low entry prices, but they introduce adapter constraints, distributed cache behavior, multiple dashboards, and database choices that do not improve this one-founder product. A single persistent Next.js instance is officially supported; Next.js recommends a reverse proxy for self-hosting. Reconsider serverless only when traffic, global latency, or operator evidence makes the migration worthwhile.

## Request architecture

| ROUTE TYPE | RENDERING / CACHE |
| --- | --- |
| Home, methodology, use cases, provider pages | Static or incrementally regenerated; invalidate by entity tag after approved publish |
| Catalog | Server-render initial URL state; client interactions over compact endpoint or server actions; cache normalized public dataset briefly |
| Finder | Client answers; deterministic recommendation endpoint with rule version; no personal account required |
| Compare | URL-identified offers, server-rendered for shareability; validate maximum count |
| Admin | Dynamic, no-store, authenticated, CSRF-protected, never edge-cached |
| Outbound redirect | Server endpoint validates link ID, writes minimal event, 302 to allow destination changes |

## Security baseline

- Single-admin authentication with strong password hashing, TOTP or WebAuthn, secure httpOnly same-site sessions, and recovery codes.
- Rate-limit login, correction, contact, and redirect abuse; protect public forms with Cloudflare Turnstile where justified.
- CSRF protection on mutations; strict validation; parameterized database access; output escaping.
- Content Security Policy, HSTS, frame restrictions, referrer policy, and safe outbound redirect allowlist.
- Secrets live outside repository and database exports. Rotate provider/API credentials and record last rotation.
- Admin access can be further restricted with Cloudflare Access or VPN after launch.
- Dependency update window monthly; urgent security updates sooner. Record deployment and schema versions.
- Public SECURITY.md and security@ address; never promise a bounty unless funded.

## Backup and recovery

1. Use SQLite-safe backup method or stop-the-world snapshot; do not blindly copy a live database without WAL awareness.
2. Nightly encrypted off-server backup; retain daily 14, weekly 8, monthly 6 as a starting policy.
3. Back up database, uploaded evidence metadata/files, configuration templates, and deployment manifest - not secrets in plaintext.
4. Verify backup completion automatically and show status in admin.
5. Perform a restore test into an isolated temporary environment every month. “Backup succeeded” is not proof of recovery.
6. Target initial RPO 24 hours and RTO 4 hours. Tighten only when traffic/revenue warrants cost.

## Performance and accessibility budgets

| BUDGET | TARGET |
| --- | --- |
| Core Web Vitals at p75 | LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 on real users |
| Initial client JavaScript | Aim <=120 KB gzip on public catalog; wizard code loaded only when needed |
| Catalog interaction | Visible filter response <=100 ms after local data ready; no full-page reload |
| Accessibility | WCAG 2.2 AA; keyboard complete; focus visible; screen-reader table labels; non-color cues |
| Images/logos | Fixed dimensions, lazy loaded below fold, no huge provider logo wall |
| Fonts | Self-host one variable sans and mono subset or use system fallback; prevent invisible text |

## Observability

- Structured application errors with request ID; never log secrets or full form bodies.
- Health endpoint checks process and database read/write readiness.
- Uptime monitor from outside the server.
- Disk, memory, backup age, job failures, 5xx rate, and outbound-link failures in admin.
- Weekly founder digest only when there is action to take; avoid alert noise.

---

# Growth and market entry

> The first users should come from useful answers and research artifacts, not from mass posting links into communities.

## Initial positioning messages

| ANGLE | MESSAGE | LANDING DESTINATION |
| --- | --- | --- |
| Cost truth | The monthly VPS price is not always what you pay monthly | Price-methodology explainer + catalog cost filters |
| Workload fit | How much VPS do I need for n8n/Coolify/etc.? | Use-case page + prefilled finder |
| Beginner safety | When a VPS is the wrong hosting choice | Hosting choice guide + finder no-VPS logic |
| Deal verification | What changed in low-cost VPS offers this month | Dated changelog/market report |
| Location | Nearest practical VPS options for a region | Prefiltered catalog + latency caveat |

## Community research map

| COMMUNITY | LEARN | PARTICIPATION RULE |
| --- | --- | --- |
| LowEndTalk | Deal vocabulary, provider reputation, unusual offers, failure stories | Read marketplace and rules; obvious affiliate disclosure; contribute before promotion |
| Reddit r/selfhosted | Workloads, deployment pain, backups, resource reality | No VPS ad behavior; answer the self-hosting problem; disclose project when relevant |
| Reddit r/VPS | Buyer questions, provider comparisons, abuse/policy issues | Check current rules; avoid repetitive link replies |
| Reddit r/webhosting / r/Hosting | When users need shared/managed/VPS; support pain | Advertising and affiliate restrictions are common; research and answer without referral links |
| n8n / Coolify / app communities | Official minimums, real installation issues, scaling language | Use official docs for requirements; community anecdotes become hypotheses, not facts |
| WebHostingTalk and provider forums | Long-term provider history, incidents, support expectations | Respect vendor/forum rules; separate facts from unverified reports |

## First-100-user research plan

1. **5-10 observed sessions:** watch beginners choose a VPS using the prototype; do not coach until they finish.
2. **10 problem interviews:** ask about the last hosting decision, confusing terms, and surprises - not whether they “like the idea.”
3. **20 direct invitations:** recruit from personal builder circles and relevant project communities where allowed.
4. **One useful public artifact weekly:** workload sizing note, cost normalization example, or changed-offer report.
5. **Correction invitation:** ask providers and experienced users to challenge factual fields and methodology.
6. **Measure decision evidence:** finder completion, explanation opens, comparisons, correction themes, and interviews; raw traffic is secondary.

## SEO content architecture

| TYPE | TEMPLATE | QUALITY GATE |
| --- | --- | --- |
| Use case | Requirements, safe baseline, scale factors, pitfalls, recommended offers, alternatives | Official requirements + version/date + rule mapping |
| Provider | Identity, locations, product families, billing behavior, support/ops, evidence, offers | No copied marketing; correction path and update date |
| Comparison | Provider A vs B by buyer context, not global winner | Structured evidence; disclose gaps; no templated doorway pages |
| Learning | VPS vs shared/dedicated/cloud; RAM/CPU/storage/network; backups | Beginner language and examples; reviewed after major changes |
| Market report | What prices/availability changed and why it matters | Reproducible dataset window and archive |

## 30-day launch rhythm

| WEEK | PUBLIC WORK | RESEARCH WORK |
| --- | --- | --- |
| 1 | Private alpha; methodology and 6 use cases | 5 observed sessions; repair wizard language |
| 2 | Publish catalog and finder; one cost-truth article | Provider correction outreach; review zero-result cases |
| 3 | Share a transparent build/method post where allowed | 5 interviews; compare click paths; fix evidence gaps |
| 4 | First “what changed” report | Analyze qualified sessions, top catches, operator time; decide next workload |

## Marketing prohibitions

- No bulk AI posts or fake community personas.
- No “best VPS” page whose winner is chosen by payout.
- No scraped user reviews presented as ratings.
- No traffic purchase before conversion and data quality are understood.
- No provider comparison pages with only names swapped.
- No newsletter until there is a repeatable useful update and consent system.

---

# Roadmap and cost plan

> Build in vertical slices. The first release needs a complete path from verified data to useful recommendation to measured click, not every imagined feature.

## Phase 0 - Decisions and fixtures (3-5 days)

- Approve this blueprint and record any deviations.
- Select 6-8 launch workloads and write minimum/preferred fixtures.
- Select 8-12 launch providers from the planned 30 based on coverage, demand, data accessibility, and diversity.
- Collect 20-40 representative offers including promotions, monthly terms, IPv4 fees, multiple locations, unknown renewals, and unavailable plans.
- Create golden recommendation cases and cost calculations before UI implementation.

## Phase 1 - Data and operator core (1.5-2.5 weeks)

- New schema, migrations, seed fixtures, validation, normalization, history, evidence, publication states.
- Admin authentication and audit foundation.
- Provider/product/offer/location editors.
- Import studio v1: CSV/JSON mapping, errors, diff, approve, rollback.
- Verification queue and freshness policy.
- Definition of done: an operator can create, verify, publish, change, and roll back an offer without touching code.

## Phase 2 - Public catalog and offer truth (1.5-2 weeks)

- Public query model, catalog, URL filters, responsive results, detail drawer/page, provider pages.
- Cost truth component and evidence component used everywhere.
- Direct/affiliate link model and outbound redirect event.
- Methodology, disclosure, corrections, about.
- Performance and accessibility baseline.
- Definition of done: a user can find, inspect, share, compare basic facts, and understand payment terms on mobile and desktop.

## Phase 3 - Finder and recommendation (1.5-2.5 weeks)

- Workload rule editor and versioning.
- Eligibility/scoring/confidence engine with audit trace.
- Four-step finder and explained result roles.
- Comparison view and editable assumptions.
- Regression fixtures and ranking simulator.
- Definition of done: every recommended result has reason, catch, cost truth, evidence, and deterministic replay.

## Phase 4 - Homepage, analytics, and operations (1-2 weeks)

- Homepage market board and use-case entrances.
- First-party events, funnels, admin product-health dashboard.
- Affiliate conversion import v1.
- Email routing, transactional mail, correction intake.
- Backups, restore test, uptime, job/error digest.
- Private alpha and launch QA.

## Phase 5 - Coverage and automation (ongoing)

- Grow from 8-12 to roughly 30 providers based on user demand and data maintainability.
- Agent-assisted source monitoring and staged diffs.
- Price and availability history.
- Monthly changed-offer report.
- Partner CRM and feed/API relationships.
- Only add alerts/accounts after proving repeated user need.

## Prioritized epics

| P | EPIC | DEPENDENCY | LAUNCH EXIT |
| --- | --- | --- | --- |
| P0 | Cost truth + schema | None | Promotion, renewal, pay-today fixtures pass |
| P0 | Evidence + publication | Schema | Every ranked field traceable |
| P0 | Operator CRUD/import/diff | Schema/evidence | No code edit needed for ordinary update |
| P0 | Catalog/detail | Public query | Mobile and desktop usable |
| P0 | Rules engine/finder | Workload fixtures | Golden cases deterministic |
| P0 | Disclosure/corrections | Public shell | Commission and error handling live |
| P1 | Compare | Catalog | 2-4 offer decision view |
| P1 | Analytics/conversions | Redirect/event model | Qualified funnel and revenue states |
| P1 | Backups/health | Deployment | Successful isolated restore |
| P2 | AI monitoring | Stable admin workflow | Only staged proposals; measurable time saved |

## Running-cost envelope

| ITEM | LAUNCH ESTIMATE | CONTROL |
| --- | --- | --- |
| One small production VPS | Approximately EUR/USD 4-8 per month depending on provider/location | 2 vCPU / 2-4 GB is ample initially; choose reliable storage and backup path |
| Domain | Already purchased; annual renewal | Track renewal date and registrar lock/2FA |
| Cloudflare DNS, Web Analytics, Turnstile, inbound routing | $0 at expected early use under current free plans | Review current limits before implementation |
| R2 backup storage | $0 likely under current 10 GB free tier | Retention and restore egress/operations reviewed annually |
| Transactional email | $0 likely under Resend current 3,000/month and 100/day free limit | Use only product mail; no premature broadcast list |
| Monitoring | $0 free external monitor or self-hosted check | One reliable alert path; avoid dashboard sprawl |
| AI research | Variable and optional | Daily/weekly budget cap; only tasks with time-saving evidence |
| Target fixed software + hosting | **Under $10/month initially**, excluding domain renewal and variable AI | Monthly cost review in admin/ops checklist |

## Stop conditions

> **Protect the side hustle**
>
> Pause new features if weekly maintenance exceeds four hours for three weeks, ranked freshness falls below 90%, data correction backlog exceeds two weeks, or hosting/AI spend grows without qualified-session growth. Fix the operating system before adding coverage.

---

# Acceptance gates

> Launch only when the product is correct enough to deserve trust and simple enough to maintain. Visual polish is necessary but not sufficient.

## Product gate

- A beginner can reach a shortlist from home in four questions or fewer.
- The catalog works without an account and persists its state in the URL.
- Every ranked offer shows effective monthly, cash due, commitment, core specs, location, checked date, confidence, reason, and catch.
- The system can return “no safe match” or a non-VPS category.
- Affiliate availability has no effect on organic results.
- At least 8 providers and 20-40 high-quality offers are enough for launch; do not wait for 30 if quality is lower.

## Admin gate

- Founder can update a price, billing term, location, link, and availability through admin.
- CSV/JSON import has mapping, validation, preview diff, and rollback.
- Stale ranked offers and failed links create visible tasks.
- Every public change has author, time, reason/source, before, and after.
- Ranking simulator reproduces finder results.
- Backup age and last restore test are visible.

## Data gate

- Money stored in integer minor units with currency.
- Original and normalized price terms both retained.
- Unknown renewal is distinct from zero or same-as-intro.
- Products, offers, and locations are separate.
- Evidence is field-addressable.
- Price and availability changes append history.
- Critical fixtures cover promo, setup fee, paid IPv4, tax ambiguity, monthly, annual, unavailable, and conflicting source.

## Experience gate

| AREA | CHECK |
| --- | --- |
| Responsive | 360px, 768px, 1280px and wide desktop; no inaccessible table overflow |
| Keyboard | Complete browse/filter/finder/compare/admin form path without pointer |
| Screen reader | Landmarks, headings, table headers, labels, errors, dialog focus, dynamic result announcement |
| Motion | Reduced-motion support; no essential information only in animation |
| Performance | Core Web Vitals targets on representative mobile network/device; public bundle budget reviewed |
| Content | Terms are plain English first, technical detail available; no placeholder or invented claim |
| Failure | Empty results, source offline, redirect unavailable, email failure, and stale record have useful states |

## Security and recovery gate

- Admin requires MFA and rate-limited authentication.
- Mutation endpoints pass authorization, CSRF, and validation tests.
- Outbound redirect rejects unknown/unapproved destinations.
- No secrets in source, database exports, analytics, or error logs.
- Automated backup succeeds and an isolated restore is demonstrated.
- Dependency and schema rollback steps are written and tested.

## Launch-day checklist

1. Freeze data imports; run complete Tier-A verification and broken-link check.
2. Run recommendation fixture suite and inspect result explanations.
3. Run production backup and restore smoke test.
4. Verify DNS, TLS, SPF, DKIM, DMARC, inbound aliases, and correction email.
5. Verify disclosure beside every tracked link and sponsor separation.
6. Check sitemap, robots, canonical URLs, structured metadata, and 404/redirects.
7. Test the main flows on real low-end Android/iPhone-sized devices and desktop keyboard.
8. Enable uptime/error alerts and confirm the founder receives one test alert.
9. Publish methodology/changelog date and capture a deployment record.
10. Invite a small alpha cohort before announcing broadly.

## Two-week post-launch review

| REVIEW | DECISION |
| --- | --- |
| Finder abandonment | Remove/rewrite the worst question before adding a new one |
| Zero results | Change coverage or wording only if doing so preserves hard requirements |
| Corrections | Repair recurring schema/source problem, not only individual rows |
| Clicks | Inspect intent and explanation behavior; do not move buttons solely to inflate clicks |
| Operator time | Automate the most repeated verified task |
| Revenue | Record it, but do not change organic policy from two weeks of noise |

---

# Appendices

> Implementation dictionaries, decision records, and source notes for the team that builds and operates the product.

## A. Minimum provider fields

| GROUP | FIELDS |
| --- | --- |
| Identity | id, slug, legal/display name, website, country, founded date if evidenced, status |
| Support | channels, hours, languages, response claims source, public docs/status URLs |
| Operations | control panel, console, reinstall, snapshots, backup products, managed scope |
| Policy | acceptable-use URL, prohibited workloads summary, refund/cancel, SLA source |
| Trust | last checked, evidence coverage, correction state, incident/community notes with source type |
| Commercial | affiliate program relation stored separately; sponsorship relation stored separately |

## B. Minimum public offer contract

| REQUIRED FOR RANKED | ALLOWED UNKNOWN BUT VISIBLE |
| --- | --- |
| Provider/product/offer identity; available state; CPU count/allocation; RAM; storage size/type; location match; effective initial cost; cash due; commitment; destination; checked date; evidence; workload gate outcome | CPU model/generation; ECC; exact SLA remedy; renewal only when genuinely not published; benchmark data; managed response time. Unknown reduces confidence and may block specific result roles. |

## C. Reason-code vocabulary

| CODE | USER TEXT EXAMPLE |
| --- | --- |
| FIT_MIN_PASS | Meets the safe starting requirements for this workload |
| FIT_HEADROOM | Adds useful memory headroom for a database and a second service |
| COST_LOWEST_ELIGIBLE | Lowest verified effective price among the plans that fit |
| COST_HIGH_UPFRONT | Low monthly equivalent, but you pay a full year today |
| CPU_SHARED | CPU is shared, so busy-neighbor performance can vary |
| RENEWAL_UNKNOWN | The provider does not clearly publish the renewal price |
| BACKUP_MISSING | No included automatic backup was verified |
| EVIDENCE_STALE | This offer needs a fresh verification before it can rank normally |
| LOCATION_NEAR | Available near your selected audience |
| OPS_BEGINNER | Provides the simplest verified recovery/support path in this shortlist |

## D. Decision log - approved defaults

| DECISION | DEFAULT | REVISIT TRIGGER |
| --- | --- | --- |
| Database | SQLite + WAL + ORM migrations | Sustained write contention, multiple app instances, or operational evidence |
| Deployment | One self-hosted Next.js instance behind Caddy | Reliability/latency need cannot be solved with CDN/cache |
| Accounts | None for public users | Repeated validated demand for alerts/saved comparisons |
| Reviews | No public star ratings | Moderation and verification capacity exists |
| Ranking | Deterministic rules and confidence | Never replace with opaque AI; adjust versioned rules from evidence |
| Coverage | Quality-first 8-12 launch, grow toward 30 | Demand and maintenance capacity |
| Monetization | Affiliate links with direct-link parity and disclosure | Legal/network terms or trust evidence |

## E. Backlog after proof

| IDEA | PROOF REQUIRED |
| --- | --- |
| Saved shortlist | Repeat visitors manually recreating comparisons |
| Price alerts | Frequent price history views and explicit interview demand |
| Newsletter | Reliable recurring market update plus consent/deliverability capacity |
| Provider portal | Enough providers request corrections/feeds to reduce operator time |
| Benchmarks | Workload decisions materially blocked by comparable evidence and testing capacity funded |
| API | Named consumers and acceptable abuse/cost model |
| Localization | Sustained audience in a language/region and ability to maintain terminology/data |
| Sponsored inventory | Relevant partner demand and user-safe separate placement |

## F. Research and source notes

Sources were checked during the research phase in August 2026. Product pricing, program terms, community rules, and software documentation change; re-check them at implementation and before public claims.

| SOURCE | URL |
| --- | --- |
| VPSBenchmarks screener and testing categories | https://www.vpsbenchmarks.com/screener |
| VPSBenchmarks coverage and methodology context | https://www.vpsbenchmarks.com/ |
| VPSLocate finder | https://vpslocate.com/finder/ |
| servers.fyi comparison | https://www.servers.fyi/ |
| CompareVPS filter and disclosure patterns | https://www.comparevps.com/ |
| vpsudo directory/editorial pattern | https://vpsudo.com/ |
| VPS Observatory methodology | https://vpsobservatory.com/methodology |
| VPSMetrics methodology | https://vpsmetrics.com/how-we-test |
| Next.js self-hosting guide | https://nextjs.org/docs/app/guides/self-hosting |
| Cloudflare Web Analytics | https://developers.cloudflare.com/web-analytics/about/ |
| Cloudflare Email Service pricing | https://developers.cloudflare.com/email-service/platform/pricing/ |
| Cloudflare Email Routing addresses | https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/ |
| Cloudflare Turnstile plans | https://developers.cloudflare.com/turnstile/plans/ |
| Cloudflare R2 pricing | https://developers.cloudflare.com/r2/pricing/ |
| Resend pricing | https://resend.com/pricing |
| Core Web Vitals thresholds | https://web.dev/articles/defining-core-web-vitals-thresholds |
| FTC endorsement/affiliate disclosure guidance | https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking |
| Coolify installation requirements | https://coolify.io/docs/get-started/installation |
| WordPress hosting requirements | https://wordpress.org/about/requirements/ |
| Google Cloud VPS explanation | https://cloud.google.com/learn/what-is-a-virtual-private-server |

## G. Final instruction to the build team

> **Build the trust system first**
>
> Do not begin with a fashionable homepage redesign. Begin with cost truth, evidence, workload fixtures, and the operator workflow. Once those are real, the interface can reveal them beautifully. The “wow” should come from how quickly a confusing purchase becomes understandable - and from how little maintenance is required to keep that promise honest.

> **Recommended next action:** approve or annotate the decisions in Chapters 1, 5, 6, 11, 17, and 19. Then create the Phase 0 fixtures and only afterward authorize implementation.
