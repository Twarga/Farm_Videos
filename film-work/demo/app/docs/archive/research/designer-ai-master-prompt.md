# Master prompt for the bestvpsforme.com design-planning AI

Copy everything below and give it to the AI that will plan the product design.

---

## Your role

Act as a senior product designer, UX architect, information designer, and design-systems lead. Your task is to produce a complete design plan for a new web product called **bestvpsforme.com**.

Do not write frontend code. Do not produce a quick mockup, visual experiment, or generic wireframe. Do not jump directly into colors and components. First understand the product, users, data, decisions, and operating constraints. Then create an implementation-ready design strategy that another design or development agent can follow.

The previous frontend prototype was deleted. There is no existing UI that must be preserved. Treat this as a new product while preserving the product strategy described below.

## Product name

**bestvpsforme.com**

Working internal name: **VSPPS**

## Product in one sentence

Turn confusing VPS offers into a small, honest shortlist that explains what fits, what it really costs, what the catch is, and why the recommendation can be trusted.

## What the product is

bestvpsforme.com is a VPS discovery, comparison, and recommendation website.

It is not only a directory of hosting plans. It should work as a decision assistant for people who know what they want to run but do not necessarily understand infrastructure terminology.

The product will eventually contain approximately 30 VPS providers and many individual plans. Examples include Hetzner, Netcup, Contabo, DigitalOcean, Vultr, Hostinger, Scaleway, Akamai Cloud, OVHcloud, UpCloud, and similar providers.

The user should be able to:

- Browse all VPS plans.
- Filter by detailed technical, geographic, operational, and pricing requirements.
- Switch between a dense table and a more visual card view.
- Open a permanent page for each individual VPS plan.
- Compare two to four plans directly.
- Use a beginner-friendly guided finder.
- Understand the true cost instead of only seeing the advertised monthly number.
- See where a server is available.
- Understand the strongest reason to choose a plan.
- Understand the main catch or risk.
- See how recently the information was checked.
- Visit the provider through either a direct or disclosed affiliate link.

## Founder and business context

This is a side project and portfolio project for one founder. It is not expected to pay personal bills or become a large company immediately.

The design must support:

- Extremely low operating cost.
- Minimal maintenance.
- One founder managing providers, offers, evidence, content, affiliates, and partnerships.
- A small but trustworthy catalog instead of fake scale.
- Gradual growth from approximately 8 initial providers to around 30 providers.
- Affiliate revenue as a useful bonus, not as a reason to manipulate rankings.
- Future sponsorships and partnerships without corrupting editorial results.

Do not design an enterprise organization with unnecessary roles, approvals, or complexity.

## Primary product priorities

Use this priority order when tradeoffs are required:

1. User experience and decision clarity.
2. Catalog usability and comparison speed.
3. Trust, evidence, and price transparency.
4. Founder experience in the admin system.
5. Data control and low-maintenance operation.
6. Accessibility and mobile usability.
7. Affiliate conversion without harming trust.
8. Visual distinctiveness.

The interface should look excellent, but visual novelty must never make comparison slower.

## Primary audience

### Beginner builder

Wants to run n8n, Coolify, Docker, a bot, a small application, or a personal project. Fears buying the wrong server, losing data, or being unable to manage Linux.

Needs:

- Workload-first guidance.
- Safe minimum requirements.
- Clear server-management difficulty.
- Backup and recovery warnings.
- Plain-English explanations.

### Self-hoster

Runs several Docker services, Nextcloud, media tools, automation, VPNs, or personal infrastructure.

Needs:

- RAM and CPU headroom.
- Storage type and capacity.
- Transfer limits and network speed.
- Location and latency.
- Virtualization and policy details.

### Small website owner

Wants WordPress, a store, or a move away from shared hosting.

Needs:

- A clear answer about whether a VPS is appropriate.
- Managed and control-panel options.
- Support expectations.
- Email-deliverability warnings.
- Backup and restore information.

### Price hunter

Wants the best low-cost deal and may already understand VPS terminology.

Needs:

- Dense filters.
- Effective monthly cost.
- Cash due today.
- Contract period.
- Renewal price.
- Setup fees and IPv4 fees.
- Promo conditions.
- Freshness and evidence.

### Practical technical buyer

Already knows their requirements and wants a shortlist quickly.

Needs:

- Dense table mode.
- Detailed technical filters.
- Shareable URLs.
- Direct comparison.
- Sources and verification.
- Minimal explanatory interruption.

## Main user jobs

- Translate a software workload into safe server requirements.
- Compare providers that advertise prices differently.
- Find plans in a specific country or city.
- Avoid long contracts, hidden setup fees, or expensive renewals.
- Find a plan with enough RAM, CPU, disk, and transfer.
- Understand whether CPU resources are shared or dedicated.
- Determine how hard the server will be to manage.
- Compare a cheap option, a balanced option, and an easy-to-manage option.
- Verify that a deal is still current.
- Understand why a link is an affiliate link.

## Product principles

### Fit is a gate

A cheap plan that cannot safely run the selected workload must not be recommended.

### Price is more than one number

Whenever possible, show:

- Advertised price.
- Effective monthly price.
- Cash due today.
- Billing interval.
- Minimum commitment.
- Setup fee.
- IPv4 fee.
- Promo duration.
- Renewal price.
- Currency and tax status.

### Unknown information stays visible

Missing data must never silently become an average or neutral value. Show that the value is unknown and reduce confidence when necessary.

### Every recommendation needs an explanation

Each recommendation must include:

- Why it fits.
- The main catch.
- Evidence confidence.
- Last checked date.
- Important assumptions.

### Revenue does not control rankings

Affiliate availability must not affect organic eligibility or ordering. Sponsored placements must be visually separate and explicitly labeled.

### The product may recommend no VPS

If shared hosting, a managed platform, or another service is safer for the user, the finder may say so.

## Competitive inspiration

Study products such as:

- servers.fyi
- VPSBenchmarks
- VPSLocate
- CompareVPS
- vpsudo
- Hosting provider pricing pages
- Modern developer tools and infrastructure consoles

Learn from their filter depth, data density, technical vocabulary, comparison behavior, and provider identity.

Do not copy their visual design. Improve on the following common weaknesses:

- Overwhelming beginners with raw specifications.
- Showing only an advertised monthly price.
- Hiding contract length and cash due today.
- Treating missing information as trustworthy.
- Mixing editorial ranking with affiliate relationships.
- Shrinking a desktop spreadsheet onto mobile.
- Using endless generic cards without a clear scanning structure.

## Required public product areas

### Global navigation

The primary navigation should make the main modes obvious:

- Browse VPS plans.
- Guided finder.
- Compare.
- Learn.

Admin is an owner tool and does not need to compete visually with the primary public actions.

### Homepage

The homepage must be useful immediately. It is not a long marketing landing page.

It should help a visitor begin a decision through one or more of these entry modes:

- A fast workload-based search.
- Direct access to the full catalog.
- A small set of currently notable offers.
- Workload shortcuts.
- A short explanation of why this comparison is more trustworthy.

Avoid:

- Long promotional paragraphs.
- Generic feature-card sections.
- Huge empty hero areas.
- Decorative server photography that does not help the decision.
- Repeating the same value proposition several times.

### VPS catalog

The catalog is the most important product surface.

It must support both:

- Dense table mode for technical scanning.
- Card mode for easier visual browsing.

The desktop design should provide persistent or easily accessible filtering. A left-side filter panel is a strong option, but evaluate the best structure instead of blindly copying competitors.

Required filter families:

#### Provider

- One or multiple providers.
- Real provider logos.
- Provider offer counts.

#### Location

- Region.
- Country.
- City or data center when available.
- Multiple selections.
- Clear difference between company headquarters and actual server location.

#### Price and payment

- Minimum and maximum effective monthly price.
- Currency.
- Monthly billing only.
- Hourly billing.
- Maximum cash due today.
- Contract duration.
- Setup fee.
- IPv4 included or separately charged.
- Renewal behavior.
- Promotion status.

#### CPU

- Minimum vCPU count.
- Shared or dedicated allocation.
- CPU vendor.
- CPU model or generation when known.
- Architecture.
- Virtualization type.

#### Memory

- Minimum and maximum RAM.
- ECC status when known.

#### Storage

- Minimum storage capacity.
- NVMe, SSD, or HDD.
- Local or network storage.
- Additional storage availability.

#### Network

- Included transfer.
- Unmetered status.
- Port speed.
- IPv4.
- IPv6.
- DDoS protection.

#### Operations

- Backups included or optional.
- Snapshots.
- Managed or self-managed.
- Control panel.
- Support channel.
- SLA or uptime promise.
- Root access.
- Custom ISO support.

#### Workload and trust

- Workload fit.
- Beginner suitability.
- Evidence confidence.
- Last checked date.
- In-stock status.

Catalog results must make these values easy to scan:

- Provider logo and provider name.
- Plan name.
- Primary or selected server location.
- CPU.
- RAM.
- Storage.
- Transfer.
- Effective monthly price.
- Cash due today.
- Billing commitment.
- Evidence freshness.
- Compare control.
- Link to the permanent plan page.

Do not force every parameter into the default row. Decide which data belongs in the primary scan and which belongs in expandable detail or the plan page.

### Individual VPS plan page

Every plan needs a permanent, shareable URL.

The page should answer these questions quickly:

- What is the plan?
- Who provides it?
- Where is it available?
- What resources are included?
- What will I actually pay today?
- What is the effective monthly cost?
- Does the price renew differently?
- What workloads fit?
- What is the main reason to choose it?
- What is the main catch?
- How difficult is it to manage?
- When was the information checked?
- Which source supports the data?
- Is the outbound link an affiliate link?
- What are the closest alternatives?

Suggested information groups:

- Identity and current availability.
- Core resources.
- Pricing and checkout terms.
- Locations.
- Compute details.
- Storage details.
- Network details.
- Operating and support details.
- Workload fit.
- Evidence and history.
- Alternatives.

The page must not become a wall of bordered specification rows. Create meaningful groups and clear hierarchy.

### Comparison workspace

Allow two to four plans.

The comparison should begin with decision-changing differences, not an alphabetical list of specifications.

Recommended priority:

1. Main reason to choose each plan.
2. Main catch.
3. Effective monthly cost.
4. Cash due today.
5. Commitment and renewal.
6. CPU, RAM, storage, and transfer.
7. Locations.
8. Operational difficulty.
9. Evidence and freshness.
10. Remaining technical details.

Required behaviors:

- Add and remove plans.
- Hide identical values.
- Emphasize meaningful differences.
- Preserve provider identity.
- Work on mobile without unreadably shrinking the table.
- Share the comparison through a URL.

### Guided finder

The finder is for users who do not know which filters to choose.

Recommended input categories:

- Workload.
- Current scale.
- Expected growth.
- User location.
- Budget.
- Payment commitment.
- Linux and server-management comfort.
- Importance of backups.
- Storage needs.
- Availability requirements.

The result should normally return three to five roles such as:

- Best balanced.
- Lowest honest cost.
- Easiest to manage.
- Best performance headroom.

The result must show the assumptions used and allow users to edit them without restarting.

### Learning content

Learning content should support decisions without turning the core catalog into a blog.

Potential topics:

- What is a VPS?
- VPS versus dedicated server versus shared hosting.
- Shared versus dedicated CPU.
- RAM sizing.
- NVMe versus SSD.
- Transfer versus port speed.
- VPS sizing for n8n, Coolify, Docker, WordPress, Nextcloud, and similar tools.
- Backups and snapshots.
- Server locations and latency.
- VPS security responsibilities.

## Required admin product

The admin experience is a top priority because one founder must keep the website trustworthy with little maintenance.

The admin is not a generic CRUD dashboard. It should behave like an operating system for the catalog.

### Admin overview

Answer immediately:

- What needs attention today?
- Which offers are stale?
- Which imports contain changes?
- Which offers have missing evidence?
- Which links are broken?
- Which affiliate destinations are missing?
- Which providers or workloads have poor coverage?

### Providers

Manage:

- Provider identity and logo.
- Website and support links.
- Countries and data centers.
- Affiliate program.
- Partnership status.
- Internal notes.
- Verification tier.

### Products and offers

Separate the stable server product from changing commercial offers.

The interface must support:

- Fast editing.
- Bulk editing.
- Duplicate detection.
- Missing-field warnings.
- Draft, active, stale, unavailable, and archived states.
- Price and terms history.
- Preview before publishing.

### Verification queue

Support a clear evidence workflow:

- Offers needing review.
- Expiring evidence.
- Conflicting sources.
- Broken checkout links.
- Changed renewal terms.
- Source capture.
- Approval and rejection.
- Audit trail.

### Imports

Automation should stage changes rather than publish them silently.

The admin should show:

- Provider source.
- Fetch status.
- Normalized fields.
- Current value versus incoming value.
- Added, changed, and removed plans.
- Confidence and validation warnings.
- Accept, edit, ignore, and reject decisions.
- Final approval before publication.

### Workload rules

Manage:

- Minimum requirements.
- Recommended requirements.
- Growth headroom.
- Beginner warnings.
- Storage and backup assumptions.
- Explanation text.
- Version history.

### Analytics

Show useful product signals rather than vanity metrics:

- Finder starts and completions.
- Catalog filter usage.
- Detail-page opens.
- Comparison creation.
- Outbound clicks.
- Click position and result context.
- Provider and workload demand.
- Direct versus affiliate clicks.
- Imported conversions when available.

### Affiliate management

Manage:

- Provider program status.
- Affiliate destination URLs.
- Covered plans.
- Link validation.
- Disclosure status.
- Clicks and imported conversions.
- Commission status.

Affiliate information is operational metadata. It must remain separate from recommendation scoring.

### Partnerships

Support a lightweight founder workflow for:

- Provider contacts.
- Outreach history.
- Sponsorship discussions.
- Free testing credits.
- Content or data partnerships.
- Follow-up reminders.
- Notes and commitments.

Do not turn this into a complicated enterprise CRM.

## Data and state requirements that affect design

Important entities include:

- Provider.
- Server product or plan.
- Commercial offer.
- Location.
- Price record.
- Evidence record.
- Workload profile.
- Recommendation rule.
- Affiliate destination.
- Import job.
- Staged change.
- Analytics event.
- Partner contact.

Important states include:

- Draft.
- Active.
- Needs verification.
- Stale.
- Conflicting evidence.
- Temporarily unavailable.
- Archived.
- Import running.
- Import failed.
- Changes waiting for approval.
- No catalog result.
- No safe recommendation.
- Unknown field.
- Broken outbound link.

The design plan must explain how these states appear without relying only on color.

## Brand and visual direction

Do not create a generic hosting-company website.

Avoid:

- WordPress-template aesthetics.
- Large promotional hero sections followed by repetitive feature cards.
- Excessive paragraphs.
- Endless square white cards.
- Generic SaaS gradients.
- Neon gaming-host aesthetics.
- Cyberpunk server imagery.
- Random glass effects.
- Decorative terminal windows that contain fake data.
- Using icons as decoration without informational value.
- Hiding provider logos.
- Making the entire product look like a spreadsheet.

Desired qualities:

- Modern technical product.
- Purpose-built infrastructure comparison tool.
- Dense where scanning benefits from density.
- Calm where beginners need explanation.
- Clear provider identity.
- Strong information hierarchy.
- Excellent numerical typography.
- Fast perceived performance.
- Responsive and accessible.
- Distinctive without being visually exhausting.

Use real provider logos. Use a consistent icon family for functions and specifications. Do not invent fake provider marks.

The catalog, finder, comparison, plan pages, learning content, and admin must feel like one product, but they do not need identical density.

Suggested density model:

- Homepage: medium density.
- Catalog: high density.
- Plan page: medium-high density.
- Comparison: high density.
- Finder: low-medium density.
- Learning content: medium-low density.
- Admin: very high density with strong grouping.

## Responsive requirements

The plan must cover desktop, tablet, and mobile deliberately.

Do not describe mobile as simply stacking every desktop column.

Explain:

- How catalog filters open on mobile.
- Whether the table becomes horizontal, transforms into rows, or offers a mobile-specific view.
- How comparison works with two to four plans on a narrow screen.
- How large technical groups collapse.
- How critical actions remain reachable.
- How sticky controls avoid covering content.
- How keyboard and screen-reader users navigate data.

## Accessibility requirements

Plan for:

- WCAG AA contrast.
- Visible keyboard focus.
- Semantic tables where tables are used.
- Labels that do not depend on placeholders.
- Status communication beyond color.
- Touch targets suitable for mobile.
- Reduced-motion support.
- Logical reading order.
- Meaningful logo alt text.
- Filters and comparison controls that work with keyboards and assistive technology.

## Low-cost implementation constraints

The design should be feasible with a simple modern web stack and one founder.

Avoid concepts that require:

- A large design or engineering team.
- Expensive third-party tools.
- Constant manual illustration production.
- Complex 3D graphics.
- Heavy animation libraries merely for decoration.
- A unique custom interaction for every page.

Prefer reusable patterns, reusable data components, and a small coherent design system.

## What you must deliver

Produce a complete design-planning document with the following sections.

### 1. Product understanding

Restate the product, primary decision, user groups, and strategic advantage in your own words. Identify any contradictions or unclear assumptions.

### 2. Design thesis

Define the overall product personality and explain why it fits VPS comparison. Describe the balance between beginner clarity and technical density.

### 3. Experience principles

Write specific rules that designers can use to evaluate decisions. Avoid generic principles such as “keep it simple.”

### 4. Information architecture

Define the public and admin page hierarchy, navigation model, permanent URLs, and relationships between catalog, finder, comparison, plan pages, and educational content.

### 5. User journeys

Plan the full journeys for:

- Beginner using the finder.
- Technical user using the catalog.
- Price hunter comparing deals.
- Visitor opening a shareable plan page.
- User leaving through an affiliate link.
- Founder verifying changed pricing.
- Founder importing provider data.
- Founder managing affiliate and partnership information.

Include entry point, decisions, failure states, recovery, and successful outcome.

### 6. Page-by-page design specification

For every required page, define:

- Page purpose.
- Primary user question.
- Content priority.
- Main interaction areas.
- Required components.
- Data shown by default.
- Progressive disclosure.
- Empty, loading, stale, error, and unavailable states.
- Desktop behavior.
- Mobile behavior.
- Primary and secondary actions.

Do not generate visual wireframes in this initial response. Describe structure and behavior precisely enough that wireframes can be created later.

### 7. Catalog system

Provide an especially detailed plan for:

- Filter architecture.
- Filter grouping.
- Applied-filter behavior.
- Result counts.
- Sorting.
- Table columns.
- Card content.
- View switching.
- Comparison selection.
- Permanent plan navigation.
- Shareable filtered URLs.
- Mobile behavior.
- Performance for hundreds or thousands of offers.

### 8. Plan-detail system

Define how the plan page communicates identity, price truth, resources, locations, operational difficulty, workload fit, evidence, history, affiliate disclosure, and alternatives.

### 9. Comparison system

Define row ordering, difference emphasis, identical-value hiding, mobile behavior, and decision summaries.

### 10. Finder system

Define questions, answer patterns, progress behavior, recommendation roles, assumption editing, no-match outcomes, and explainability.

### 11. Admin operating system

Create a detailed plan for overview, providers, products, offers, verification, imports, workload rules, analytics, affiliates, partnerships, content, and system health.

Focus on reducing weekly founder maintenance.

### 12. Content and terminology system

Define plain-English labels, technical detail labels, tooltips, warnings, price vocabulary, evidence language, affiliate disclosure language, and correction language.

### 13. Design-system plan

Recommend:

- Typography roles.
- Numerical typography.
- Color roles.
- Status colors.
- Spacing scale.
- Shape rules.
- Icon rules.
- Provider-logo treatment.
- Table behavior.
- Card behavior.
- Form and filter behavior.
- Motion principles.
- Responsive breakpoints.

Do not merely list fashionable colors or fonts. Explain how each rule supports the product.

### 14. Component inventory

List the reusable components required across public and admin areas. Group them by navigation, discovery, data display, comparison, trust, forms, feedback, admin operations, and content.

### 15. State matrix

Create a matrix of normal, loading, empty, error, stale, unavailable, unknown, selected, compared, sponsored, affiliate, and verified states for the major components.

### 16. Accessibility plan

Provide specific accessibility behavior for filters, tables, cards, comparison, wizard steps, dialogs or drawers, notifications, charts, and admin workflows.

### 17. Design validation plan

Explain how the future design should be tested with beginners and technical users. Define concrete tasks and success criteria.

Do not create a visual test or mockup now. Plan how later validation should work.

### 18. Delivery sequence

Recommend the order for designing the system. Begin with the highest-risk product interactions rather than the homepage decoration.

Include design milestones, review gates, and what must be approved before moving to implementation.

### 19. Final design acceptance checklist

Create a checklist that determines whether the product design is complete enough to hand to a development agent.

## Required quality level

Your answer must be specific to bestvpsforme.com. Do not return a generic SaaS design brief.

Every recommendation must connect to at least one of these goals:

- Faster VPS decisions.
- Better beginner understanding.
- Better technical comparison.
- More honest price communication.
- Stronger evidence and trust.
- Lower founder maintenance.
- Cleaner affiliate governance.

If you recommend an unusual interaction, explain why it is better than a standard pattern for this product.

Do not begin by asking broad questions that are already answered here. Identify only the genuinely unresolved decisions that would materially change the design.

End your response with:

1. The five most important design decisions.
2. The five biggest design risks.
3. The first design artifact that should be created after the plan is approved.

---

## End of master prompt
