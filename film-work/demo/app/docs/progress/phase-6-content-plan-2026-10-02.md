# Phase 6 — Content: implementation plan (2 October 2026)

> **For agentic workers:** execute task by task. Each task ends in a working, shippable app and carries its own test cycle. Steps use `- [ ]` checkboxes. Tasks 6.5–6.7 are blocked behind the owner decisions in Task 6.0; do not start them before those decisions land.

**Goal:** Give every high-rank published plan a reviewed catch and workload fit written through an audited admin queue, resolve `featured`, finish the reviewed price terms backlog, and make every page's copy and every dataset number provably honest.

**Architecture:** Editorial prose already has a public authority (`offer_editorial`, gated on `review_status = 'reviewed'`) but no writer: no admin route, no audit row, no evidence column. Phase 6 adds the missing half — an evidence column pair plus a guard (mirroring `renewal_source` + `unsupportedRenewalReason`), an audited save, a `/admin/editorial` queue ordered by recommended rank, and then the content itself. The copy and dataset work replaces hard-coded prose numbers with publication-derived ones and adds a rendered-output voice test (not a source-text grep).

**Tech stack:** Next.js 16.3.3 App Router (React 19.2 server actions), Drizzle 0.45 + better-sqlite3, zod 4, Vitest 4.1.11, Playwright (6 Chromium projects).

**Spec:** `bigone.md` §Phase 6 (lines 980–986), findings D4/D5/D13/D14; `brand/BRAND.md` §9 (voice) and §1 (proof pillars); `docs/product/PRODUCT_CONTRACT.md` (integrity rules 3 and 4, security invariant "durable audit evidence").

---

## Global constraints

- **Never infer a fact.** An unreviewed term, catch, or fit stays "Not published". A catch sentence must be derivable from stored evidence, and the evidence must be named in the record.
- Displayed prices use `displayPriceUsd()` / `reviewedPrice()` / `serviceCostProjection()`. Never `usd()` or `realPrice()` for a displayed figure.
- **Owner-gated, do not touch:** the 16 renewal corrections in `docs/data/renewal-correction-queue-2026-10-01.*`, migration `0014_site_settings.sql`, production data, and snapshot publication.
- Migrations are additive and nullable, with no backfill inside the migration (`drizzle-safe-migrations`). Next migration number is **0015**.
- Admin mutations require `requireAdmin()`, bounded zod input, and an `audit_log` row with actor, before/after JSON, and request ID.
- Voice rules: `brand/BRAND.md` §9. Banned whole words in public copy: *best, #1, top, deal, exclusive, blazing, unbeatable, partner pick, live price*. Every rewrite goes through the `stop-slop` skill.
- Every fix gets a regression test first. Permanent tests assert behaviour, never source text.
- Read `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md` and `02-guides/forms.md` before writing any server action or form in this phase.

---

## Evidence base (local DB `data/bestvpsforme.db`, read-only, 2 October 2026)

| Fact | Value | Source |
|---|---:|---|
| Published offers | 322 | `offers.publication_status='published'` |
| `offer_editorial` rows | **0** | `select count(*) from offer_editorial` |
| Published offers with a public catch | **0** | mapper requires `review_status='reviewed'` (`public-catalog.ts:101-103`) |
| Legacy `offers.catch_notes` set (published) | 1 | not public — `mapPublishedRow` ignores the legacy columns |
| Published offers with `featured=1` | 1 (`netcup-500-g12`) | sitemap priority only; no public badge, no score effect |
| Current prices with `term_months > 1` | 43 | Task 1.9 backlog |
| Current prices with structured intro fields | 15 | all 15 carry a stamp + renewal |
| Target rows (term > 1 **or** intro) | **47** | 27 raw-stamped; 12 of the 16 quarantined rows are inside this set → **15 guard-accepted today, 32 open** |
| Rows quarantined by `unsupportedRenewalReason` | 16 | owner-gated queue; **do not touch** |
| `audit_log` rows | 0 | table exists since `0006_dark_miek.sql` |
| `analytics_events` | 368 (5 `affiliate_click`, 139 `catalog_search`, 224 `page_view`) | **traffic ordering is not yet viable** — 5 offer-tied clicks |
| Staged rows | approved 322 / pending 76 / blocked 59 | dataset guide's "76 review-only, 59 rejected" are DB-derivable |
| Published offer-location links | **785** | dataset guide claims 784 — stale by one |
| Active snapshot | 2026-09-30 | dataset guide claims 2026-08-31 |
| Current published prices with a verified `setup_fee` | **0 of 322** | `select sum(setup_fee is not null) …` |
| Offers with a non-null `realMonthly` | **0 of 322** | `realMonthly` needs `termsReviewed && setupFee != null && renewalMonthly != null` (`public-catalog.ts:115`) |
| Offers where `reviewedPrice()` returns a projection | **0 of 322** | measured by rendering the real catalog path |
| Offers scoring above `-1` in `valueScore` | **0 of 322** | `valueScore` needs `reviewedPrice()` (`score.ts:29,56-58`) |
| `termsReviewed` offers (guard-accepted stamps) | 43 | 59 stamped − 16 quarantined |

### Consequence 1 — the workload taxonomy is dead

`filterOffers` requires `offer.niches.includes(workload)` for every workload except `other` (`src/lib/catalog.ts:174-178`). With zero editorial rows, **eight of the nine workload tiles are dead**. Measured against a copy of the local DB: home workload tiles = `other:273` only; per-workload catalog counts = `n8n:0 coolify:0 docker:0 wordpress:0 nextcloud:0 openclaw:0 vpn:0 game:0 other:273`; `offers with any niche: 0 of 322`. So the home "What are you building?" grid renders one tile, every mad-lib combination except *anything* resolves to 0 plans, and `/catalog?workload=docker` is empty. `niches` is therefore a **required** field of the editorial queue, not an optional one.

### Consequence 2 — "recommended rank" is currently free-tiers-first (P0, found while planning)

`setup_fee` is NULL on all 322 current published prices, so `realMonthly` is null for every offer, so `reviewedPrice()` is null for every offer, so **every offer scores `-1`** in `valueScore`. The recommended branch then falls through to its tie-break (`catalog.ts:221`), which sorts ascending on `reviewedPrice() ?? usd()` and — unlike the generic fallback at `:223` — has **no `freeLast` term**. Measured on the real `createCatalogPage` path with the default query:

```
total: 314  sort: recommended
page 1 first 8: oracle-cloud-vm-standard-a1-flex-always-free $0 | oracle-cloud-vm-standard-e2-1-micro $0 |
  microsoft-azure-azure-b1s-free $0 | google-cloud-e2-micro-always-free $0 | aws-ec2-ec2-t3-micro-free $0 |
  scaleway-stardust1-s $0.43 | racknerd-special-1gb $1.83 | ramnode-lite-1gb $2
rows with catch on page 1: 0   summary catches: 0   summary from: $0
xray eligible: 0   xray chosen: (none)
```

This is the exact opposite of the documented intent at `score.ts:49-51` ("a free or unpriced plan scores -1 … so it sorts last instead of dominating"), and it means "the top 100 offers by recommended rank" today is "the 100 cheapest advertised plans, free tiers first". Two separate defects, fixed in **Task 6.A** before any queue is built:

1. **Code (no data needed):** the recommended tie-break must keep free tiers last.
2. **Data (owner-gated, D6-5):** nobody has verified a setup fee, so the 3-year real price — the brand's first proof pillar — renders nowhere on the site, and the home X-ray card has no eligible plan.

---

## Task 6.0 (gate): owner decisions on framing — **answered 2 October 2026**

Copy decisions are product decisions. All five are decided; the answers below are binding for the rest of this plan.

| ID | Question | Owner decision | Shapes |
|---|---|---|---|
| D6-1 | What "top 100" means for queue order | **Provider coverage first, then rank.** Each active provider's highest-ranked plan is written before the queue fills by rank. | 6.4, 6.5 |
| D6-2 | Who authors and who publishes | **Agent drafts, owner publishes.** Entries save as `review_status='draft'` and stay invisible until the owner flips them to `reviewed`. | 6.3, 6.4, 6.5 |
| D6-3 | Where a catch's facts may come from | **Stored evidence plus dated provider-page research**, recorded as `catch_source` with a URL and a check date. Disagreement with the 31 Aug snapshot gets written down, not smoothed over. | 6.5, 6.7 |
| D6-4 | `featured` | **Retire it from the public surface** (Option A). The DB column and its snapshot rollback stay. | 6.6 |
| D6-5 | Price-terms backlog scope | **Tooling plus verified setup fees for the 43 guard-accepted rows.** The 16 queued corrections and the 20 open renewals stay out of scope. | 6.7 |

- [x] **Step 1:** Ask the owner the five questions with the evidence table in hand.
- [x] **Step 2:** Write the answers into this section as a dated decision record.
- [x] **Step 3:** Commit: `Record Phase 6 framing decisions` (shipped inside the Phase 6 plan commit `8f0e360`).

---

## Task 6.A (blocking): keep free tiers out of the top of "recommended"

Fix this before Task 6.4 builds a queue on top of the order, and before anyone calls the current page-1 order a ranking. Code-only; no data and no owner decision needed.

**Files:**
- Modify: `src/lib/catalog.ts:216-222`
- Modify: `src/lib/catalog-behavior.test.ts` (next to the existing recommended-order cases)

**Interfaces:** no signature change. `sortOffers(list, "recommended", direction, cohort)` keeps its shape.

- [x] **Step 1: Write the failing test**

```ts
it("keeps free tiers last when no plan has a reviewed price", () => {
  const free = offer({ id: "free", effectiveMonthly: 0 });
  const cheap = offer({ id: "cheap", effectiveMonthly: 2 });
  const dear = offer({ id: "dear", effectiveMonthly: 9 });
  const cohort = [free, cheap, dear];
  expect(sortOffers(cohort, "recommended", "desc", cohort).map((o) => o.id)).toEqual(["cheap", "dear", "free"]);
});
```

- [x] **Step 2:** Ran `npx vitest run src/lib/catalog-behavior.test.ts`. FAILED as predicted: received `["free", "cheap", "dear"]`.
- [x] **Step 3: Implement.** In the `sort === "recommended"` branch of `src/lib/catalog.ts`, apply the same free-last rule the generic fallback uses at `:223`, before the price tie-break:

```ts
if (sort === "recommended" && context) {
  const scoreDelta = valueScore(b, context) - valueScore(a, context);
  if (Math.abs(scoreDelta) > 1e-9) return scoreDelta;
  // Every offer scores -1 until a reviewed price exists; without this a $0
  // free tier would lead the default catalog order.
  const freeLast = Number(a.effectiveMonthly === 0) - Number(b.effectiveMonthly === 0);
  if (freeLast) return freeLast;
  return compareKnown(reviewedPrice(a)?.monthly ?? usd(a), reviewedPrice(b)?.monthly ?? usd(b), 1);
}
```

- [x] **Step 4:** PASS. Real-path proof against a `/tmp` copy of the DB: page 1 now opens `scaleway-stardust1-s $0.43 | racknerd-special-1gb $1.83 | ramnode-lite-1gb $2 …`, and the $0 tiers sit at the tail of the last page (`google-cloud-e2-micro-always-free $0 | aws-ec2-ec2-t3-micro-free $0`).
- [x] **Step 5:** 354 unit tests pass, tsc and ESLint clean. No visual baseline churn is expected: no e2e fixture carries a $0 price (`scripts/prepare_e2e_db.ts:36-62`), so the free-last branch never fires there. Confirmed in the end-of-phase e2e run.
- [x] **Step 6:** Recorded as finding **D15** in `bigone.md`. Commit: `Keep free tiers last in the recommended order`.

---

## Task 6.1: Voice lexicon and rendered-copy guard (`brand/BRAND.md` §9)

Do this right after Task 6.A: it defines the rule that every sentence written in Tasks 6.5 and 6.8 must satisfy, and it is self-contained.

**Files:**
- Create: `src/lib/voice.ts`, `src/lib/voice.test.ts`
- Create: `src/app/public-copy-voice.test.tsx`
- Modify: `src/app/compare/page.tsx:193,215,259,302`
- Modify: `src/app/providers/[slug]/page.tsx:65`
- Modify: `content/guides/vps-vs-shared-hosting.mdx:37`

**Interfaces:**
- Produces: `BANNED_TERMS: { term: string; pattern: RegExp; instead: string }[]`
- Produces: `extractCopy(html: string): string` — visible text plus `aria-label`, `alt`, `title`, `placeholder` values, markup stripped
- Produces: `voiceViolations(copy: string): { term: string; excerpt: string }[]`

Scope: **public routes only.** `/admin` and `/system` are operator surfaces and are exempt; state that in the test file.

- [x] **Step 1: Write the failing unit test** (`src/lib/voice.test.ts`)

```ts
import { describe, expect, it } from "vitest";
import { extractCopy, voiceViolations } from "./voice";

describe("voiceViolations", () => {
  it("flags banned superlatives in visible copy", () => {
    expect(voiceViolations("The best value in each row").map((v) => v.term)).toEqual(["best"]);
  });
  it("never flags the brand name", () => {
    expect(voiceViolations("bestvpsforme compares 314 plans")).toEqual([]);
  });
  it("never flags hyphenated or compound identifiers", () => {
    expect(voiceViolations("margin-top and a laptop")).toEqual([]);
  });
  it("flags accessible names, not just body text", () => {
    const copy = extractCopy('<button aria-label="Get deal">Visit</button>');
    expect(voiceViolations(copy).map((v) => v.term)).toEqual(["deal"]);
  });
  it("ignores class names and other markup", () => {
    expect(voiceViolations(extractCopy('<td class="best">$5.00</td>'))).toEqual([]);
  });
});
```

- [x] **Step 2:** Ran it. FAIL (module not found).
- [x] **Step 3: Implement** `src/lib/voice.ts`

```ts
/** brand/BRAND.md §9. Whole words only; the brand name is not the word "best". */
export const BANNED_TERMS = [
  { term: "best", pattern: /\bbest\b/gi, instead: "cheapest … in the {date} snapshot" },
  { term: "#1", pattern: /#1\b/g, instead: "a rank with the formula next to it" },
  { term: "top", pattern: /\btop\b/gi, instead: "first by {metric}" },
  { term: "deal", pattern: /\bdeals?\b/gi, instead: "Visit {provider}" },
  { term: "exclusive", pattern: /\bexclusive(?:ly)?\b/gi, instead: "nothing — we have no exclusives" },
  { term: "blazing", pattern: /\bblazing\b/gi, instead: "the measured number" },
  { term: "unbeatable", pattern: /\bunbeatable\b/gi, instead: "the measured number" },
  { term: "partner pick", pattern: /\bpartner picks?\b/gi, instead: "nothing — we have no partners in the ranking" },
  { term: "live price", pattern: /\blive prices?\b/gi, instead: "checked {date}" },
] as const;

const BRAND = /bestvpsforme/gi;

export function extractCopy(html: string): string {
  const names = [...html.matchAll(/(?:aria-label|alt|title|placeholder)="([^"]*)"/g)].map((m) => m[1]);
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return [text, ...names].join(" ").replace(/&[a-z]+;|&#\d+;/gi, " ");
}

export function voiceViolations(copy: string): { term: string; excerpt: string }[] {
  const clean = copy.replace(BRAND, " ");
  return BANNED_TERMS.flatMap(({ term, pattern }) =>
    [...clean.matchAll(new RegExp(pattern.source, pattern.flags))].map((match) => ({
      term,
      excerpt: clean.slice(Math.max(0, match.index - 40), match.index + 40).trim(),
    })),
  );
}
```

- [x] **Step 4:** PASS (11 tests). The lexicon shipped as `editorialVoiceReason()` alongside `voiceViolations()`, so the admin save path in Task 6.3 rejects banned words with the replacement wording.
- [x] **Step 5: Write the failing route test** (`src/app/public-copy-voice.test.tsx`). Follow the render harness already used by `src/app/compare/page.test.tsx:36-43` and `src/lib/public-home.test.tsx:10-13`: `:memory:` DB, `migrateDatabase()`, `publishedRowFixture()`, `renderToStaticMarkup`.

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { closeDatabase } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { extractCopy, voiceViolations } from "@/lib/voice";
import HomePage from "@/app/page";
import MethodologyPage from "@/app/methodology/page";
import AboutPage from "@/app/about/page";
import TermsPage from "@/app/terms/page";
import PrivacyPage from "@/app/privacy/page";
import NotFound from "@/app/not-found";

beforeEach(() => { closeDatabase(); vi.stubEnv("DATABASE_URL", ":memory:"); vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", ""); migrateDatabase(); });
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

// /admin and /system are operator surfaces and are deliberately out of scope.
const routes: [string, () => Promise<React.ReactElement> | React.ReactElement][] = [
  ["/", () => HomePage()],
  ["/methodology", () => MethodologyPage()],
  ["/about", () => AboutPage()],
  ["/terms", () => TermsPage()],
  ["/privacy", () => PrivacyPage()],
  ["404", () => NotFound()],
];

for (const [name, render] of routes) {
  it(`keeps ${name} free of banned marketing words`, async () => {
    const html = renderToStaticMarkup(await render());
    expect(voiceViolations(extractCopy(html))).toEqual([]);
  });
}
```

- [x] **Step 6:** Extended to all 16 routes plus every published guide and the single author page (18 tests, shared `CompareProvider`/router harness). Confirmed red on `/compare`, `/compare?p=` and the guide corpus before the rewrites below.
- [x] **Step 7: Rewrite the flagged copy.** Ran the `stop-slop` skill over each replacement: no adverbs, no "not X but Y", no em dashes.

| File:line | Now | Write |
|---|---|---|
| `src/app/compare/page.tsx:193` | `Best 4 GB value` | `Cheapest 4 GB real price` |
| `src/app/compare/page.tsx:215` | `The best value in each row is highlighted; unknowns stay unknown.` | `Each row marks the strongest published value. Unknowns stay unknown.` |
| `src/app/compare/page.tsx:259` | `The best value in each row is highlighted. Unknowns stay unknown — rank never uses commission.` | `Each row marks the strongest published value. Unknowns stay unknown, and rank never uses commission.` |
| `src/app/compare/page.tsx:302` | award text `Best` | `Leads` |
| `src/app/providers/[slug]/page.tsx:65` | `…a setup fee on top.` | `…a setup fee as well.` |
| `content/guides/vps-vs-shared-hosting.mdx:37` | `Best first question` | `First question to ask` |

- [x] **Step 8:** 383 unit tests, tsc and ESLint clean. The `.best` CSS class (`src/styles/compare.css:40-43`) and the `best` winner variable stayed unchanged; `compare/page.test.tsx:86-87` still passes untouched, and a new case pins `Leads` as the award word.
- [x] **Step 9:** Commit: `Hold public copy to the brand voice rules`.

---

## Task 6.2: Editorial evidence columns and guard (D14 prerequisite)

A reviewed catch with no named evidence is an inferred fact. Mirror the price-side pattern: `renewal_source` + `unsupportedRenewalReason` → `catch_source` / `fit_source` + `unsupportedEditorialReason`.

**Files:**
- Modify: `src/db/schema.ts:167-198` (`offerEditorial`: add `catchSource`, `fitSource`, `reviewedBy`)
- Create: `drizzle/0015_editorial_evidence.sql` via `npx drizzle-kit generate`
- Create: `src/lib/editorial-evidence.ts`, `src/lib/editorial-evidence.test.ts`
- Modify: `src/lib/public-catalog.ts:101-103`
- Modify: `src/lib/public-catalog.test.ts`

**Interfaces:**
- Consumes: `unsupportedRenewalReason` as the shape precedent (`src/lib/renewal-evidence.ts:2`)
- Produces: `unsupportedEditorialReason(text: string | null, source: string | null): string | null`
- Produces: `offer_editorial.catch_source TEXT NULL`, `fit_source TEXT NULL`, `reviewed_by TEXT NULL`

- [x] **Step 1: Write the failing test** (`src/lib/editorial-evidence.test.ts`)

```ts
import { expect, it } from "vitest";
import { unsupportedEditorialReason } from "./editorial-evidence";

it("allows an empty catch", () => {
  expect(unsupportedEditorialReason(null, null)).toBeNull();
});
it("rejects a catch with no evidence", () => {
  expect(unsupportedEditorialReason("Backups cost extra.", " ")).toBe("The editorial note has no reviewed evidence.");
});
it("rejects evidence that admits an assumption", () => {
  expect(unsupportedEditorialReason("Backups cost extra.", "Assumed from the plan tier, no page states it")).toBe("The note was assumed rather than taken from the source.");
});
it("rejects evidence with no citation and no date", () => {
  expect(unsupportedEditorialReason("Backups cost extra.", "Checked the website")).toBe("The evidence must name a source and a check date.");
});
it("accepts a dated URL citation", () => {
  expect(unsupportedEditorialReason("Backups cost extra.", "https://example.com/vps 2026-08-31")).toBeNull();
});
it("accepts dated stored evidence", () => {
  expect(unsupportedEditorialReason("Mostly Germany.", "offer billing notes, snapshot 2026-08-31")).toBeNull();
});
```

- [x] **Step 2:** Ran it. FAIL (module not found).
- [x] **Step 3: Implement** `src/lib/editorial-evidence.ts`. Two gaps the tests caught: hedging in the **note** is an inference even when the evidence is cited, so `ASSUMED` is applied to the text first; and a cited note still needs a check date.

```ts
/** A reviewed catch must name where it came from and when, the same way a renewal does. */
const ASSUMED = /\b(?:assum(?:e|ed|ing)|infer(?:red|ring)?|probabl[ey]|likely|seems? to|appears? to|we think|should be|typically|usually)\b/i;
const CITATION = /https?:\/\/\S+|\bbilling notes\b|\bsource text\b|\bprice evidence\b|\bspec(?:ification)?s? row\b|\blocation records?\b/i;
const DATE = /\b\d{4}-\d{2}-\d{2}\b/;

export function unsupportedEditorialReason(text: string | null, source: string | null): string | null {
  if (!text?.trim()) return null;
  if (!source?.trim()) return "The editorial note has no reviewed evidence.";
  if (ASSUMED.test(source)) return "The note was assumed rather than taken from the source.";
  if (!CITATION.test(source) || !DATE.test(source)) return "The evidence must name a source and a check date.";
  return null;
}
```

- [x] **Step 4:** PASS (6 tests).
- [x] **Step 5: Add the columns.** In `src/db/schema.ts`, inside `offerEditorial`, next to `catchNotes`:

```ts
catchSource: text("catch_source"),
fitSource: text("fit_source"),
reviewedBy: text("reviewed_by"),
```

Generate the migration with `npx drizzle-kit generate` (it must emit three `ALTER TABLE offer_editorial ADD COLUMN` statements and nothing else) and confirm the file is `drizzle/0015_editorial_evidence.sql`. No backfill, no data change.

- [x] **Step 6: Write the failing mapper test.** Add to `src/lib/public-catalog.test.ts`, following the existing reviewed/unreviewed cases at `:67-75`:

```ts
it("hides a reviewed catch whose evidence is missing", () => {
  publishedRowFixture("evidence-gap");
  getDb().insert(offerEditorial).values({ offerId: "evidence-gap", catchNotes: "Backups cost extra", catchSource: null, reviewStatus: "reviewed", reviewedAt: new Date("2026-08-31") }).run();
  const offer = mapPublishedRow(getPublishedOfferById("evidence-gap")!)!;
  expect(offer.catch).toBeNull();
  expect(offer.editorialReviewed).toBe(false);
});
it("publishes a reviewed catch with dated evidence", () => {
  publishedRowFixture("evidence-ok");
  getDb().insert(offerEditorial).values({ offerId: "evidence-ok", catchNotes: "Backups cost extra", catchSource: "https://example.com/vps 2026-08-31", reviewStatus: "reviewed", reviewedAt: new Date("2026-08-31") }).run();
  expect(mapPublishedRow(getPublishedOfferById("evidence-ok")!)!.catch).toBe("Backups cost extra");
});
```

- [x] **Step 7:** Ran it. FAIL: the catch and the fit published with no evidence. The `editorialReviewed` flag stays `true` for a reviewed row — it means a human reviewed the plan, which is what turns the catalog placeholder into "No catch found in the source" (`OfferTable.tsx:116-119`) — while the prose stays withheld. Recorded in the test comments.
- [x] **Step 8: Gate the mapper.** Replace `src/lib/public-catalog.ts:101-103` with:

```ts
const editorialRow = row.editorial?.reviewStatus === "reviewed" ? row.editorial : null;
const reviewedCatch = editorialRow && unsupportedEditorialReason(editorialRow.catchNotes, editorialRow.catchSource) == null ? editorialRow.catchNotes?.trim() || null : null;
const reviewedFit = editorialRow && unsupportedEditorialReason(editorialRow.fitNotes, editorialRow.fitSource) == null ? editorialRow.fitNotes?.trim() || null : null;
const editorial = reviewedCatch || reviewedFit || editorialRow?.niches?.length ? editorialRow : null;
```

Keep `editorialReviewed: editorial != null` (`:119`) and the `niches`/`managed`/`backups`/`gpus` mapping (`:153,160-162`) pointing at `editorial`. Import the guard at the top of the file next to `unsupportedRenewalReason`.

- [x] **Step 9:** 394 unit tests, tsc and ESLint clean. Migration `0015_editorial_evidence.sql` is three additive nullable `ADD COLUMN` statements, renamed from the generated name with `drizzle/meta/_journal.json` updated (`drizzle-kit check` clean). Five existing fixtures asserted a reviewed catch with no evidence and now carry one: `compare/page.test.tsx:30`, `home-xray-action.test.ts:29`, `public-home.test.ts:43`, `public-copy-voice.test.tsx:51`, `prepare_e2e_db.ts:50,56`.
- [x] **Step 10:** Commit: `Require dated evidence before a catch goes public`.

---

## Task 6.3: Audited editorial save

`saveOfferEditorial` (`src/db/editorial.ts:15-42`) has no actor, no audit row, and no caller. Contract invariant: "Admin mutations require authentication, authorization, CSRF protection, bounded inputs, and durable audit evidence."

**Files:**
- Create: `src/lib/editorial-review.ts`, `src/lib/editorial-review.test.ts`
- Modify: `src/db/editorial.ts` (extend `offerEditorialInputSchema`; keep `saveOfferEditorial` as the unaudited primitive used inside the transaction)

**Interfaces:**
- Consumes: `unsupportedEditorialReason` (6.2), `voiceViolations` (6.1), `AdminActionResult` (`src/lib/admin-action-feedback.ts:8`)
- Produces: `saveEditorialReview(input: unknown, userId: string, requestId: string): AdminActionResult`
- Produces: audit action name `admin.offer_editorial_saved`, entity type `offer_editorial`

Pattern source: `src/lib/home-xray-setting.ts:19-43` (transactional before/after + `auditLog` insert + typed failure messages that keep the operator's text).

- [x] **Step 1: Write the failing test** (`src/lib/editorial-review.test.ts`)

```ts
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { auditLog, offerEditorial } from "@/db/schema";
import { publishedRowFixture } from "../../tests/fixtures/published-row";
import { saveEditorialReview } from "./editorial-review";

const valid = { offerId: "hetzner-cx22", catchNotes: "Backups cost extra.", catchSource: "offer billing notes, snapshot 2026-08-31", fitNotes: "Enough RAM for a small Docker stack.", fitSource: "specs row, snapshot 2026-08-31", niches: ["docker"], reviewStatus: "reviewed" };

beforeEach(() => { closeDatabase(); vi.stubEnv("DATABASE_URL", ":memory:"); migrateDatabase(); publishedRowFixture(); });
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

it("writes the editorial row and an audit row with actor and before/after", () => {
  const result = saveEditorialReview(valid, "admin-1", "req-1");
  expect(result.ok).toBe(true);
  const audit = getDb().select().from(auditLog).all();
  expect(audit).toHaveLength(1);
  expect(audit[0]).toMatchObject({ actorAdminUserId: "admin-1", action: "admin.offer_editorial_saved", entityType: "offer_editorial", entityId: "hetzner-cx22", requestId: "req-1" });
  expect(JSON.parse(audit[0].beforeJson!)).toBeNull();
  expect(JSON.parse(audit[0].afterJson!).catchNotes).toBe("Backups cost extra.");
});

it("refuses a reviewed catch with no evidence and writes nothing", () => {
  const result = saveEditorialReview({ ...valid, catchSource: "" }, "admin-1", "req-2");
  expect(result).toMatchObject({ ok: false, status: "validation_error" });
  expect(result.message).toContain("evidence");
  expect(getDb().select().from(offerEditorial).all()).toHaveLength(0);
  expect(getDb().select().from(auditLog).all()).toHaveLength(0);
});

it("refuses banned marketing words in the catch", () => {
  const result = saveEditorialReview({ ...valid, catchNotes: "The best value here." }, "admin-1", "req-3");
  expect(result).toMatchObject({ ok: false, status: "validation_error" });
  expect(result.message).toContain("best");
});

it("records the previous text when an entry is edited", () => {
  saveEditorialReview(valid, "admin-1", "req-4");
  saveEditorialReview({ ...valid, catchNotes: "Backups and snapshots cost extra." }, "admin-2", "req-5");
  const audit = getDb().select().from(auditLog).where(eq(auditLog.requestId, "req-5")).all();
  expect(JSON.parse(audit[0].beforeJson!).catchNotes).toBe("Backups cost extra.");
});

it("rejects an offer that does not exist", () => {
  expect(saveEditorialReview({ ...valid, offerId: "nope" }, "admin-1", "req-6")).toMatchObject({ ok: false, status: "validation_error" });
});
```

- [x] **Step 2:** Ran it. FAIL (module not found).
- [x] **Step 3: Extend the input schema** in `src/db/editorial.ts`, keeping the existing bounds. `saveOfferEditorial` was deleted rather than kept as a second, unaudited write path: its only caller was `scripts/check_data_layer_separation.ts`, now migrated to `saveEditorialReview`. `getOfferEditorial` stays. `WORKLOAD_IDS` was added to `src/lib/catalog.ts:92-93` as the runtime tuple the writer and the reader share.

```ts
export const offerEditorialInputSchema = z.object({
  offerId: z.string().min(1),
  summary: z.string().trim().min(1).max(320).nullable().optional(),
  fitNotes: z.string().trim().min(1).max(1000).nullable().optional(),
  fitSource: z.string().trim().max(2000).nullable().optional(),
  catchNotes: z.string().trim().min(1).max(1000).nullable().optional(),
  catchSource: z.string().trim().max(2000).nullable().optional(),
  niches: z.array(z.enum(WORKLOAD_IDS)).max(9).default([]),
  managed: z.boolean().nullable().optional(),
  backups: z.boolean().nullable().optional(),
  gpus: z.number().int().nonnegative().nullable().optional(),
  reviewStatus: z.enum(["draft", "reviewed"]).default("draft"),
  reviewedAt: z.coerce.date().nullable().optional(),
  reviewedBy: z.string().trim().max(120).nullable().optional(),
});
```

`WORKLOAD_IDS` does not exist yet — `src/lib/types.ts:25-34` only declares the `WorkloadId` union. Add it next to `WORKLOADS` in `src/lib/catalog.ts:90` and import it here:

```ts
export const WORKLOAD_IDS = WORKLOADS.map((workload) => workload.id) as [WorkloadId, ...WorkloadId[]];
```

Carry the new fields through the `insert`/`onConflictDoUpdate` value objects at `:23-41`.

- [x] **Step 4: Implement** `src/lib/editorial-review.ts`. Two corrections the tests forced: `audit_log.actor_admin_user_id` has a real FK to `admin_users(id)`, so the test seeds both actors (the insert failed with `FOREIGN KEY constraint failed` otherwise); and the row values moved to `editorialRowValues()` in `src/db/editorial.ts` so the review fields, the reviewer default and the draft reset live next to the schema.

```ts
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { offerEditorialInputSchema } from "@/db/editorial";
import { auditLog, offerEditorial, offers } from "@/db/schema";
import type { AdminActionResult } from "./admin-action-feedback";
import { unsupportedEditorialReason } from "./editorial-evidence";
import { logServerError } from "./secure-log";
import { voiceViolations } from "./voice";

/** Save reviewed editorial prose and its audit record in one transaction. */
export function saveEditorialReview(input: unknown, userId: string, requestId: string): AdminActionResult {
  const parsed = offerEditorialInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, status: "validation_error", message: parsed.error.issues[0]?.message ?? "Check the editorial fields.", requestId };
  const value = parsed.data;
  const evidence = unsupportedEditorialReason(value.catchNotes ?? null, value.catchSource ?? null)
    ?? unsupportedEditorialReason(value.fitNotes ?? null, value.fitSource ?? null);
  if (evidence) return { ok: false, status: "validation_error", message: evidence, requestId, id: value.offerId };
  const banned = voiceViolations([value.catchNotes, value.fitNotes, value.summary].filter(Boolean).join(" "));
  if (banned.length) return { ok: false, status: "validation_error", message: `Brand voice: remove "${banned[0].term}".`, requestId, id: value.offerId };
  try {
    const db = getDb();
    if (!db.select().from(offers).where(eq(offers.id, value.offerId)).get()) {
      return { ok: false, status: "validation_error", message: "That plan is not in the catalog.", requestId, id: value.offerId };
    }
    db.transaction((tx) => {
      const before = tx.select().from(offerEditorial).where(eq(offerEditorial.offerId, value.offerId)).get() ?? null;
      const now = new Date();
      const row = {
        offerId: value.offerId,
        summary: value.summary ?? null,
        fitNotes: value.fitNotes ?? null,
        fitSource: value.fitSource ?? null,
        catchNotes: value.catchNotes ?? null,
        catchSource: value.catchSource ?? null,
        niches: value.niches,
        managed: value.managed ?? null,
        backups: value.backups ?? null,
        gpus: value.gpus ?? null,
        reviewStatus: value.reviewStatus,
        reviewedAt: value.reviewStatus === "reviewed" ? value.reviewedAt ?? now : null,
        reviewedBy: value.reviewStatus === "reviewed" ? userId : null,
        updatedAt: now,
      };
      const after = tx.insert(offerEditorial).values(row).onConflictDoUpdate({ target: offerEditorial.offerId, set: row }).returning().get();
      tx.insert(auditLog).values({ id: randomUUID(), actorAdminUserId: userId, action: "admin.offer_editorial_saved", entityType: "offer_editorial", entityId: value.offerId, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(after), requestId }).run();
    });
    return { ok: true, status: "success", message: value.reviewStatus === "reviewed" ? "Published to the public catalog." : "Saved as a draft. It is not public yet.", requestId, id: value.offerId };
  } catch (error) {
    logServerError("admin_editorial_save_failed", requestId, error);
    return { ok: false, status: "server_error", message: "The entry was not saved. Your text is still open.", requestId, id: value.offerId };
  }
}
```

- [x] **Step 5:** PASS (9 tests), and the separation check passes with its new audit assertion. 403 unit tests, tsc, ESLint clean over `src tests scripts`.
- [x] **Step 6:** Commit: `Audit every editorial save with actor and evidence`.

---

## Task 6.4: `/admin/editorial` queue

**Files:**
- Create: `src/lib/editorial-queue.ts`, `src/lib/editorial-queue.test.ts`
- Create: `src/app/admin/editorial/page.tsx`, `src/app/admin/editorial/actions.ts`, `src/app/admin/editorial/AdminEditorial.module.css`
- Create: `src/components/admin/EditorialEntry.tsx`
- Create: `tests/e2e/admin-editorial.spec.ts`
- Modify: `src/app/admin/imports/page.tsx:81-85` and the new page's sidebar (add the `Editorial` nav item to both)
- Modify: `scripts/run_browser_checks.ts:20-44` (add the new spec to the `actions` profile)

**Interfaces:**
- Consumes: `sortOffers` (`src/lib/catalog.ts:189`), `getPublicCatalogState` (`src/lib/public-catalog.ts:167`), `getAnalyticsSnapshot` (`src/db/analytics-reporting.ts:19`), `saveEditorialReview` (6.3)
- Produces: `buildEditorialQueue(offers: Offer[], clicks: Map<string, number>, limit?: number): EditorialQueueEntry[]` where `EditorialQueueEntry = { offer: Offer; rank: number; clicks: number; written: boolean }`
- Produces: server action `saveEditorialEntry(_prev: AdminActionResult | null, formData: FormData): Promise<AdminActionResult>`

Order (**D6-1: provider coverage first, then rank**): rank every offer with `sortOffers(offers, "recommended", "desc", offers)`; mark each provider's highest-ranked offer as its `coverage` pick; then order the queue by (unwritten before written) → (coverage pick before non-pick) → rank. `clicks` rides along for the operator's judgement and never reorders — five offer-tied clicks would be noise.

- [x] **Step 1: Write the failing test** (`src/lib/editorial-queue.test.ts`). The queue shipped as `buildEditorialReport()` returning `{ entries, total, written, providers }` so the progress line counts the whole cohort instead of the 100-row page, with `buildEditorialQueue()` kept as the thin entries accessor.

```ts
import { expect, it } from "vitest";
import { buildEditorialQueue } from "./editorial-queue";
import { offer } from "../../tests/fixtures/offer";

const reviewed = (id: string, monthly: number) => offer({ id, realMonthly: monthly, effectiveMonthly: monthly, renewalMonthly: monthly, setupFee: 0, termsReviewed: true, ramGb: 4, confidence: "high" });

it("puts unwritten plans ahead of written ones", () => {
  const written = { ...reviewed("written", 4), catch: "Backups cost extra", whyFit: "Fits a small stack", editorialReviewed: true };
  const queue = buildEditorialQueue([written, reviewed("unwritten", 9)], new Map());
  expect(queue.map((e) => e.offer.id)).toEqual(["unwritten", "written"]);
});

it("gives every provider one plan before writing a provider's second", () => {
  const a1 = { ...reviewed("a1", 4), providerId: "a" };
  const a2 = { ...reviewed("a2", 5), providerId: "a" };
  const b1 = { ...reviewed("b1", 9), providerId: "b" };
  const queue = buildEditorialQueue([a1, a2, b1], new Map());
  expect(queue.map((e) => e.offer.id)).toEqual(["a1", "b1", "a2"]);
});

it("keeps recommended order inside each coverage group", () => {
  const queue = buildEditorialQueue([reviewed("dearer", 9), reviewed("cheaper", 4)], new Map());
  expect(queue.map((e) => e.offer.id)).toEqual(["cheaper", "dearer"]);
});

it("reports the published rank, not the queue position", () => {
  const written = { ...reviewed("cheaper", 4), catch: "Backups cost extra", whyFit: "Fits a small stack", editorialReviewed: true };
  const queue = buildEditorialQueue([written, reviewed("dearer", 9)], new Map());
  expect(queue.find((e) => e.offer.id === "cheaper")!.rank).toBe(1);
});

it("honours the limit", () => {
  expect(buildEditorialQueue([reviewed("a", 4), reviewed("b", 5), reviewed("c", 6)], new Map(), 2)).toHaveLength(2);
});

it("carries click counts for display", () => {
  expect(buildEditorialQueue([reviewed("a", 4)], new Map([["a", 7]]))[0].clicks).toBe(7);
});
```

- [x] **Step 2:** Ran it. FAIL (module not found), then one real failure after implementation: the test imported `buildEditorialReport` without adding it to the import list.
- [x] **Step 3: Implement** `src/lib/editorial-queue.ts`

```ts
import { sortOffers } from "./catalog";
import type { Offer } from "./types";

export type EditorialQueueEntry = { offer: Offer; rank: number; clicks: number; written: boolean; coverage: boolean };

/**
 * Editorial worklist (owner decision D6-1): unwritten plans first, then one
 * plan per provider before any provider's second, then published recommended
 * rank. Clicks ride along for the operator's judgement but never reorder the
 * queue — with five recorded outbound clicks, traffic order would be noise.
 */
export function buildEditorialQueue(offers: Offer[], clicks: Map<string, number>, limit = 100): EditorialQueueEntry[] {
  const ranked = sortOffers(offers, "recommended", "desc", offers);
  const covered = new Set<string>();
  const entries = ranked.map((offer, index) => {
    const coverage = !covered.has(offer.providerId);
    covered.add(offer.providerId);
    return { offer, rank: index + 1, clicks: clicks.get(offer.id) ?? 0, written: Boolean(offer.catch && offer.whyFit), coverage };
  });
  return entries
    .sort((a, b) => Number(a.written) - Number(b.written) || Number(b.coverage) - Number(a.coverage) || a.rank - b.rank)
    .slice(0, limit);
}
```

- [x] **Step 4:** PASS (8 tests): unwritten-first, one plan per provider before a second, rank inside each group, the published rank preserved, coverage flagged per provider, cohort-wide progress, limit, and clicks carried without reordering.
- [x] **Step 5: Build the route.** `src/app/admin/editorial/page.tsx` copies the `/admin/imports` page shape exactly (`imports/page.tsx:54-97`): `noStore()`, `try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }`, `AdminShell` with the same sidebar (plus an `Editorial` item, marked active here and inactive on `/admin/imports`), page head, feedback banner. Body: `buildEditorialQueue(getPublicCatalogState().offers, new Map(getAnalyticsSnapshot(30).byOffer.map((row) => [row.offerId, row.clicks])))`, then one `EditorialEntry` per queue row, plus a progress line — `{written} of {total} plans have a reviewed catch`.
- [x] **Step 6: Build the entry component.** `src/components/admin/EditorialEntry.tsx` is a client component (`"use client"`) using `useActionState` so a rejected save keeps the operator's prose — read `node_modules/next/dist/docs/01-app/02-guides/forms.md` first. It renders, per offer:
  - header: rank, plan name, provider, click count, and a `Catch written` / `Not written` state;
  - **read-only evidence block** (this is what the prose must be derived from): `offer.billing`, `offer.checkedAt`, `offer.url`, `ipv4Status`, `locations`, `commitmentMonths`, `renewalMonthly`, `termsReviewed`, `confidence`, `vcpu`/`ramGb`/`diskGb`/`bandwidthTb`;
  - `catchNotes` textarea (max 1000) + `catchSource` textarea (required when the catch is non-empty);
  - `fitNotes` textarea + `fitSource` textarea;
  - a `niches` checkbox group built from `WORKLOADS` (`src/lib/catalog.ts:79-90`) — **required**, because `filterOffers` gates every workload on it;
  - `managed` / `backups` tri-state selects (`Not published` / `Yes` / `No`) and a `gpus` number input, all defaulting to `Not published`;
  - a `reviewStatus` radio pair (`Save as draft` / `Publish as reviewed`), a required confirmation checkbox "I verified every sentence against the evidence above", and `AdminSubmitButton`;
  - the `AdminActionResult` message in a `role="alert"` region when the save failed, `role="status"` when it succeeded.
- [x] **Step 7: Build the action.** `src/app/admin/editorial/actions.ts`:

```ts
"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import type { AdminActionResult } from "@/lib/admin-action-feedback";
import { requireAdmin } from "@/lib/admin-request";
import { saveEditorialReview } from "@/lib/editorial-review";
import { PUBLIC_CATALOG_TAG } from "@/lib/public-catalog";
import { logServerError } from "@/lib/secure-log";

export async function saveEditorialEntry(_prev: AdminActionResult | null, formData: FormData): Promise<AdminActionResult> {
  const requestId = randomUUID();
  let user: Awaited<ReturnType<typeof requireAdmin>>;
  try {
    user = await requireAdmin();
  } catch (error) {
    if (error instanceof Error && error.message === "Admin authentication required") return { ok: false, status: "authorization_error", message: "Your admin session expired. Sign in again; your text is still here.", requestId };
    logServerError("admin_editorial_authorization_failed", requestId, error);
    return { ok: false, status: "server_error", message: "The entry was not saved. Your text is still open.", requestId };
  }
  if (formData.get("confirm") !== "editorial") return { ok: false, status: "validation_error", message: "Confirm that you verified the text against the evidence.", requestId };
  const text = (name: string) => { const value = String(formData.get(name) ?? "").trim(); return value || null; };
  const triState = (name: string) => { const value = String(formData.get(name) ?? ""); return value === "" ? null : value === "yes"; };
  const result = saveEditorialReview({
    offerId: String(formData.get("offerId") ?? ""),
    catchNotes: text("catchNotes"), catchSource: text("catchSource"),
    fitNotes: text("fitNotes"), fitSource: text("fitSource"),
    niches: formData.getAll("niches").map(String),
    managed: triState("managed"), backups: triState("backups"),
    gpus: text("gpus") == null ? null : Number(text("gpus")),
    reviewStatus: formData.get("reviewStatus") === "reviewed" ? "reviewed" : "draft",
  }, user.id, requestId);
  if (result.ok) { revalidateTag(PUBLIC_CATALOG_TAG, "max"); revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/admin/editorial"); }
  return result;
}
```

- [x] **Step 8: Write the failing e2e** (`tests/e2e/admin-editorial.spec.ts`), in the `actions` fixture profile so it gets writable published plans. Copy the authenticated-session helper from `tests/e2e/admin-settings.spec.ts:10-16` (cookie `bvf_admin_session` from `tests/e2e/admin-session.json`; there is no TOTP step).

```ts
test("saves a reviewed catch and keeps the text when evidence is missing", async ({ page }) => {
  await authenticate(page);
  await page.goto("/admin/editorial");
  const entry = page.getByRole("group").first();
  await entry.getByLabel("The catch").fill("Backups cost extra.");
  await entry.getByLabel("I verified every sentence against the evidence above").check();
  await entry.getByRole("button", { name: "Save entry" }).click();
  await expect(page.getByRole("alert")).toContainText("evidence");
  await expect(entry.getByLabel("The catch")).toHaveValue("Backups cost extra.");

  await entry.getByLabel("Catch evidence").fill("offer billing notes, snapshot 2026-08-31");
  await entry.getByRole("radio", { name: "Publish as reviewed" }).check();
  await entry.getByRole("button", { name: "Save entry" }).click();
  await expect(page.getByRole("status")).toContainText("Published to the public catalog");
});
```

Add an axe scan of `/admin/editorial` in the same spec, matching the serious/critical gate used by `admin-settings.spec.ts`.

- [x] **Step 9:** Registered in the `actions` profile (`scripts/run_browser_checks.ts:39`). Regenerated the disposable database after migration 0015. The browser run found action-form text loss, invalid definition-list markup, color-only links, and a 4.41:1 reviewed badge. Fixed each; scoped tests to per-project rows and cleared fields so repeat runs do not depend on an untouched database.
- [x] **Step 10:** Recorded verification before commit: 411 unit tests, tsc and ESLint clean; all 18 editorial browser checks passed across six projects against a previously edited disposable database.
- [x] **Step 11:** Commit: `e9b13b5 Add the admin editorial queue`. The commit also contained the intentionally failing sitemap test for Task 6.6; its full-suite run reported 411 passing and 1 failing, not a green full suite.

---

## Task 6.5: Editorial content sprint

The actual writing. 322 published offers, 0 reviewed entries today.

**Files:**
- Data only, written through `/admin/editorial` as **drafts** (D6-2). Nothing becomes public until the owner flips an entry to `reviewed`.
- Create: `docs/progress/phase-6-editorial-batches-2026-10-02.md` (batch log: offer id, rank, catch, fit, niches, the evidence string for each, and the audit request ID)

**Rules for every sentence (non-negotiable):**
1. The catch is one plain sentence naming a cost or limit the ad does not lead with. Facts come from stored evidence (`offer.billing`, price `source_text`/`source_url`, `ipv4Status`, locations, `commitmentMonths`, reviewed renewal) **or** from the provider's current page recorded with its URL and check date (D6-3). Where a fetched page disagrees with the 31 Aug snapshot, write the disagreement into `catch_source` — never silently prefer one.
2. `catchSource` names the field and the check date, e.g. `offer billing notes, snapshot 2026-08-31`. `unsupportedEditorialReason` rejects anything vaguer.
3. The fit sentence states the workload and the hardware fact that supports it. No adjectives without a number.
4. Voice per `brand/BRAND.md` §9 — `saveEditorialReview` rejects banned words at save time; run `stop-slop` over each batch before entering it.
5. Nothing is inferred. If the stored evidence does not support a catch, leave it empty: an empty slot is already handled ("No catch found" requires `editorialReviewed`).
6. `niches` is required and gates the workload taxonomy — see the consequence note above.

- [x] **Step 1:** Frozen provider-first top-100 worklist and stored evidence exported before prose in `docs/progress/phase-6-editorial-batches-2026-10-02.md`.
- [x] **Step 2:** First 20 drafts and per-field evidence recorded and voice-reviewed. Alibaba has no asserted fit because the old starter identity is unresolved; two 0.5 GB plans remain untagged below workload floors.
- [ ] **Step 3 — owner-gated production:** All 20 drafts were entered through the authenticated admin on a disposable backup, with 21 successful audit request IDs recorded. None is public and no production draft was saved. Production migration and draft writes require approval; the batch log is ready for owner review.
- [ ] **Step 4:** After the owner flips batch 1 to `reviewed`, verify on the public surface: `/catalog` shows the catch column populated for those rows, `/offers/[id]` shows "The catch" and "Why it fits", and `/catalog?workload=docker` returns a non-empty result for any offer tagged `docker`.
- [ ] **Step 5:** Repeat Steps 2–4 for ranks 21–40, 41–60, 61–80, 81–100. Commit the batch log after each batch: `Write editorial batch N (ranks X–Y)`.
- [x] **Step 6:** `src/lib/public-home.test.ts` renders the Docker tile with one reviewed tagged plan at its $8 reviewed display price, then verifies that changing the entry to draft removes that workload link.
- [x] **Step 7:** Integrated unit and complete browser-coordinator gates passed. Real editorial remains draft/copy-only; public publication acceptance is still blocked. Only home and guide-index visual baselines changed, for their inspected price-basis and dataset-description updates.

---

### Scope calls made while building this

- The sidebar markup was duplicated between `/admin` and `/admin/imports`; a third copy was not acceptable, so it moved to `src/components/admin/AdminSidebar.tsx`. `AdminConsole` keeps its client-state navigation and gains two link items.
- `src/lib/admin-request.ts` now exports `AdminActor`, so consumers stop writing `Awaited<ReturnType<typeof requireAdmin>>`.
- The entry form carries `summary` as a hidden-less optional field the writer may leave empty; `saveEditorialReview` accepts it but nothing renders it yet.

---

## Task 6.6: Retire `featured` from the public surface (D6-4 — decided)

Today: `offers.featured` is set on exactly one published offer, is mapped onto the public `Offer` (`public-catalog.ts:159`), is **not** used by `valueScore` or any public badge, and changes exactly one public behaviour — sitemap priority 0.8 vs 0.5 (`src/app/sitemap.ts:23-27`). `bigone.md:1015` already records the owner's decision to drop it from scoring; the `+8` bonus is long gone. `/methodology:68` already tells the public there is "no featured slot", so the flag has no published meaning to keep.

**Files:** `src/lib/types.ts:94-95`, `src/lib/public-catalog.ts:159`, `src/app/sitemap.ts:23-27`, `src/lib/catalog-page.ts:92`, `src/components/admin/AdminConsole.tsx:119,193,264,306,328,371,391-395,456`, `src/lib/public-catalog.test.ts:21-22,34-37`, `tests/fixtures/offer.ts:12`, `src/db/publication-snapshots.ts:88-90`.

- [x] **Step 1:** Behavioral regressions: public mapper omits `featured` even when the persisted flag is true; sitemap assigns equal priorities to flagged and unflagged offers (`metadata-surfaces.test.tsx`).
- [x] **Step 2:** Both tests failed before the retirement (2 failing, 27 passing).
- [x] **Step 3:** Removed `featured` from public DTO/mapping/reconstruction/static fixtures, sitemap branch and admin filter, badges, toggle, overview/analytics metrics and metric inventory. DB column and snapshot rollback unchanged.
- [x] **Step 4:** 34 targeted retirement tests passed. Integrated full suite: 417 passing; tsc and ESLint over `src tests scripts` clean. Disposable production build passed. Browser smoke confirmed the admin's All/Affiliate/Attention controls and absence of Featured.
- [x] **Step 5:** Updated the `bigone.md` retirement decision. Included in verified integration commit `cb19e8d`.
Option B (keep it with a mandatory `featured_reason`) was considered and **rejected** by the owner on 2 October 2026: a flag the methodology page denies should not be reintroduced with ceremony.

---

## Task 6.7: Reviewed price terms backlog (D6-5 — tooling plus verified setup fees)

Spec line: "Reviewed price terms for every plan with a term > 1 month or an intro price, starting with the 43 long-term plans." Measured target: **47 current prices** (43 with `term_months > 1`, 15 with structured intro fields, overlap 11). Of those, **15 are guard-accepted today**, 12 sit in the owner-gated correction queue, and **20 have no usable reviewed renewal**.

Blocker to state plainly: `approvePriceTerms` is reachable **only inside an import review session** (`/admin/imports?job=…`, `imports/page.tsx:113-114`), and it writes to `staged_import_rows.normalized_payload` — it cannot correct a *currently published* price. Reviewing the backlog needs a standalone queue.

**Files:**
- Create: `src/lib/terms-queue.ts` (classification regressions live in `current-price-terms.test.ts`)
- Create: `src/app/admin/terms/page.tsx`, `src/app/admin/terms/actions.ts`
- Create: `src/lib/current-price-terms.ts`, `src/lib/current-price-terms.test.ts` (audited write to the **current** `offer_prices` row, closing a new validity window the way `addOfferPrice` does at `admin-catalog.ts:41-47`)
- Modify: `src/components/admin/PriceTermsReview.tsx`; extract shared `PriceTermsFields` for staged and current review, with a separate current-price action contract.
- Create: `tests/e2e/admin-terms.spec.ts`
- Create: `docs/data/terms-backlog-2026-10-02.md` (the 47-row worklist with each row's stored evidence and what is missing)
- Create: `src/lib/setup-fee-evidence.ts`, migration `0016_setup_fee_evidence.sql` and its generated metadata; add nullable `offer_prices.setup_fee_source` and preserve it during snapshot rollback.
- Modify: current `offer_prices` rows through the audited admin path — **only** the 43 guard-accepted rows' `setup_fee`, and only where a source proves the value (D6-5)

**Interfaces:**
- Consumes: `unsupportedRenewalReason` (`src/lib/renewal-evidence.ts:2`), `suggestPriceTerms` (`src/db/price-terms.ts:1`), `reviewedPriceTermsSchema` (`src/db/row-normalization.ts:7`)
- Produces: `listTermsBacklog(): TermsBacklogRow[]` — published offers whose current price has `term_months > 1` or any intro field, with `state: "reviewed" | "quarantined" | "open"`
- Produces: `approveCurrentPriceTerms(input: unknown, userId: string, requestId: string): AdminActionResult`, writing `audit_log` action `admin.price_terms_reviewed`

- [x] **Step 1:** Queue classification coverage includes long terms, partial intros, ordinary monthly exclusion, reviewed monthly setup-fee candidates and quarantine in `src/lib/current-price-terms.test.ts`.
- [x] **Step 2:** Reviewer-driven regressions exposed missing FX fallback, unsupported fee citations and renewal-source mutation before the fixes. A separate `$5,000` versus `$5` amount regression failed before rejecting ambiguous comma-formatted quotes.
- [x] **Step 3:** `listTermsBacklog()` lists active-provider current publications, ordered open → quarantined → reviewed.
- [x] **Step 4:** Transactional write regressions cover current-price validity, before/after audit, stale IDs, non-public plans, quarantine and rollback on audit failure.
- [x] **Step 5:** Implemented the writer. Foreign currencies require a positive stored rate dated exactly to the stored price check; known fees require their own dated explicit quote. Setup-only saves preserve renewal fields and their review stamps.
- [x] **Step 6:** `/admin/terms` reuses shared fields, shows evidence and unapplied parser suggestions, and renders all 16 corrections read-only. Missing check-date FX also prevents editing. Action drafts survive errors.
- [x] **Step 7:** `docs/data/terms-backlog-2026-10-02.md` records every target, all 43 coverage rows, provider research, unknown facts and the owner boundary.
- [ ] **Step 8 — owner-gated production:** Research found four explicit IONOS zero-fee candidates and 27 eligible unknown fees. The 43 coverage rows include 12 open-renewal overlaps, leaving 31 eligible setup-only reviews. Two disposable admin smokes yielded 0 → 4 reviewed projections; all 20 open and 16 quarantined rows stayed unchanged. No production save occurred. X-ray eligibility remains zero until the owner publishes reviewed editorial; this acceptance condition is not met.
- [x] **Step 9:** All 18 terms browser checks passed across six projects, including error-state axe, public real-price rendering, separate setup evidence, preserved renewal/reviewer and read-only quarantine. The full coordinator and backend gates passed; counts below.
- [x] **Step 10:** Commit `cb19e8d` — `Review price terms outside the import session`. Tooling, evidence and copy-only proof committed; production acceptance remains blocked at Step 8.

---

## Task 6.8: Dataset guide and proof-number reconciliation

The dataset guide previously hard-coded 322 public offers and 784 location links. The fresh read-only-copy smoke measured 322 public offers, 43 active providers and 785 location links; the comparison subset is 314 offers from 41 providers. These now render from current database state rather than fixed prose. Source and active-publication dates are separate.

**Files:**
- Create: `src/lib/dataset-stats.ts`, `src/lib/dataset-stats.test.ts`
- Modify: `src/lib/guide-markdown.ts:29-44` (add a `:::stats` directive next to `:::callout`/`:::formula`/`:::plans`)
- Modify: `src/components/guides/GuideArticleBody.tsx:38-58,75-78` (render it)
- Modify: `content/guides/vps-market-snapshot-457-rows.mdx:20,24-28,36`
- Delete: `scripts/check_dataset_report.ts` (a source-text grep; replaced by a behavioural test)
- Create: `src/components/guides/dataset-guide.test.tsx`
- Modify: `src/lib/public-home.ts:40,43,75-76` (see Step 6)

**Interfaces:**
- Produces: `getDatasetStats(): { snapshotDate: string | null; publishedOffers: number; activeProviders: number; locationLinks: number; reviewOnlyRows: number; rejectedRows: number; sourceRows: 457; sourceProviders: 63 }`

The 457 source rows and 63 provider identities come from the immutable CSV and stay literal — `src/db/provider-normalization.test.ts` and `tests/research-csv-cli.test.ts` already pin them. Everything else is computed: approved/pending/blocked are `staged_import_rows.status` counts (322/76/59 today).

- [x] **Step 1:** Added active-publication, empty-publication and source-checksum-scoped review-count regressions in `src/lib/dataset-stats.test.ts`.

```ts
it("counts the active publication, not a hard-coded snapshot", () => {
  publishedRowFixture("a"); publishedRowFixture("b");
  const stats = getDatasetStats();
  expect(stats.publishedOffers).toBe(2);
  expect(stats.activeProviders).toBe(1);
  expect(stats.sourceRows).toBe(457);
});
it("reports zero rather than a stale number on an empty publication", () => {
  expect(getDatasetStats().publishedOffers).toBe(0);
});
```

- [x] **Step 2:** Stats tests failed on missing module before implementation. Stats now count active-provider published inventory and locations; the source CSV checksum scopes review totals so unrelated imports cannot inflate them. Missing source job means unknown review totals, not zero.
- [x] **Step 3:** Added the seeded guide-render regression.
- [x] **Step 4:** Guide regression failed on the old 322/784 prose and table.
- [x] **Step 5:** Added `:::stats`, reused the guide table pattern with scoped row headers, and removed stale prose. Deleted `check_dataset_report.ts` and removed its CI/maintenance commands. Source date stays 2026-08-31; active publication date renders separately.
- [x] **Step 6:** Home market/workload floors and fallback pick now use `displayPriceUsd()`. Regression failed at $4 before the fix and now returns $8 with a reviewed intro/renewal projection. This is the chosen catalog-consistent basis.
- [x] **Step 7:** 417 unit tests, tsc and ESLint clean. Disposable production build and browser smoke rendered current counts (14 synthetic offers, 2 providers, 2 location links), snapshot date and unknown research-job counts. Table screenshot checked; existing guide-article baseline uses another guide.
- [x] **Step 8:** Included in verified integration commit `cb19e8d`, with home/guide-index baseline refreshes named in the commit message.

---

## Phase 6 acceptance

Map back to `bigone.md:982-986`:

| Spec line | Tasks | Done when |
|---|---|---|
| Catch + whyFit for the top 100, through the admin, with an audit log | 6.A, 6.2, 6.3, 6.4, 6.5 | 100 queue entries carry a catch, a fit, `niches`, dated evidence, and an `audit_log` row each, ordered by a rank that is not free-tiers-first |
| `featured` removed or set with a stated reason | 6.6 | Option A: `featured` absent from `Offer` and the sitemap branch. Option B: no `featured` row without a reason, enforced by a test |
| Dataset guide refreshed with the proof numbers used on home | 6.8 | Guide numbers render from `getDatasetStats()`; `check_dataset_report.ts` deleted |
| Every page's copy passes §9 and a slop-free review | 6.1 | Current public surfaces pass the §9 copy review; `voice.test.ts` and editorial browser tests cover forbidden editorial claims. Owner-requested UI rewrites are reviewed visually; obsolete public copy-string pins are removed, not re-pinned |
| Reviewed price terms for every plan with term > 1 month or an intro | 6.7 | All 47 rows are `reviewed` or carry a written reason why not; the 16 owner-gated rows stay untouched and are listed as blocked |

**Verification gate (run before claiming Phase 6 done):**

```
npx vitest run                      # ≥ 353 passing, plus the ~30 added here
npx tsc --noEmit
npx eslint src tests
E2E_FIXTURE=1 DATABASE_URL=/tmp/bestvpsforme-e2e/catalog.db E2E_DATABASE_URL=/tmp/bestvpsforme-e2e/catalog.db npm run build
E2E_REUSE_BUILD=1 npm run test:e2e  # 448+ standard, plus large / actions / audit
```

Visual baselines in `tests/e2e/__screenshots__/` (120 PNGs across six projects): regenerate only after confirming the diff is intentional, and name the surfaces in the commit message.

### Integrated verification — 3 October 2026

- `npx vitest run`: **439 tests, 74 files passed**.
- `npx tsc --noEmit` and `npx eslint src tests scripts`: passed.
- Production build passed against the disposable `/tmp/bestvpsforme-phase6-final/catalog.db`; no production migration or snapshot publication.
- Complete `E2E_REUSE_BUILD=1 npm run test:e2e`: **598 passed, 152 profile/viewport skips, zero failures**. Breakdown: standard 462, large catalog 44, synthetic admin actions 12, editorial 18, price terms 18, reviewed-price audit 32, settings 12. Skipped special-profile cases run in their own profile; remaining skips are existing viewport restrictions.
- Installed Playwright's missing Chromium runtime after the first browser-launch failure. The next run exposed only 12 intended visual mismatches. Inspected and refreshed **home.png** and **guides.png** across six projects; no other visual baselines changed. The final full coordinator passed without snapshot updates.
- Final authenticated fresh-backup smoke through `/admin/terms`: four separate setup-evidence saves, four audits, reviewed projections **0 → 4**. Deep comparison preserved all 20 open and 16 quarantined prices and every immutable IONOS price/renewal fact. Offer receipt displayed **$10.42/mo**, **$375** three-year total and verified **$0** setup.
- Browser screenshots checked the terms form, repaired editorial heading, dynamic dataset table and revealed home market section. The fresh-copy guide rendered 322 published offers, 43 active providers, 785 location links, and comparison subset 314/41. Temporary probe deleted; owned smoke services and tab closed.

**Remaining owner gates:** approve production migration/writes; review the first 20 editorial drafts before further batches or publication; approve any renewal correction separately. Four IONOS zero-fee candidates are ready, 27 eligible fees remain unknown, and 20 open renewals are untouched. Unidentified Alibaba hardware/fit remains unasserted. No real-offer reviewed editorial or X-ray candidate was published. **Phase 6 is not fully accepted.**

### Owner-requested interface clarity redesign: 4 October 2026

- Reworked the public shell, home, catalog, offer, comparison, provider, guide, supporting and admin surfaces for readable, task-first navigation. Kept Mona Sans, Geist Mono, semantic light/dark colours and the lowercase wordmark. Removed public search, command palettes, promotional display treatments, reveal gates and plan morphs; retained explicit catalog facets and essential admin record filters. `DESIGN.md`, the product contract, brand rules and the master-plan override record this direction.
- Browser reproduction and regression checks covered collapsed mobile plan names, comparison headers covering price rows, correction forms failing to reset after a successful response, and admin links opening the wrong view or losing it on reload. The final sweep corrected filter-sheet stacking, a 19 px footer disclosure target and 4.33:1 admin supporting-text contrast. Footer clearance now keeps disclosure links clickable above comparison and purchase bars, separately or together.
- Replaced stale copy pins with consumer-visible invariants: unknown hardware and upfront costs do not become invented numbers; clearing a comparison preserves the explicit empty URL and stays empty after reload. Removed obsolete public copy-string and animation/wiring tests rather than re-pinning the redesigned wording.
- `npm run build` now copies public assets and browser bundles into the standalone tree through `postbuild`. Standalone browser smoke verified fonts, logos and flags. Home and methodology read the runtime publication rather than retaining fixture-build snapshot facts.
- Corrected inherited Open Graph/Twitter copy and the root share image: published inventory is not presented as universally reviewed pricing, and the date label says “Snapshot”, not “Checked”. The image now renders dynamically from the runtime publication. HTTP smoke showed 314 plans / 30 September in the preview and 5 plans / 31 August in the independent audit fixture; an unavailable database produced explicit unavailable catalog/date labels, not an invented zero. Visually reviewed the new audit-image baseline before saving it.
- Final unit verification: **414 tests in 73 files passed**. `npx tsc --noEmit` and `npx eslint src tests scripts` passed. The production build passed against `/tmp/bestvpsforme-clarity-e2e/catalog.db`.
- Final full `E2E_REUSE_BUILD=1 npm run test:e2e`: **585 passed, 171 profile/viewport skips, zero failures**. Breakdown: standard 448, large catalog 44, synthetic admin actions 12, editorial 18, price terms 18, reviewed-price audit 33 and settings 12. Dedicated profiles exercise special-fixture cases skipped by the standard run; other skips cover viewport-specific controls and duplicate server-image checks.
- Reviewed desktop/mobile screenshots in both themes and refreshed intentional visual differences. The final coordinator matched **120 page baselines and the new runtime share-image baseline without snapshot updates**. Live smoke exercised provider expansion/filtering, menus and focus return, comparison state, correction submission, admin navigation and footer disclosure navigation above fixed bars. Final browser smoke confirmed the corrected social metadata and rendered the preview’s live share image.
- Preview remains at `http://127.0.0.1:3115` against a disposable database. No production migration, production-data writes, renewal correction or production snapshot publication occurred. The Phase 6 owner gates above remain open.

### Owner-requested readable VPS table: 5 October 2026

- Restored the old table structure in `src/components/catalog/OfferTable.tsx`: separate CPU, RAM, storage and transfer columns, with 19 px numeric hardware values. CPU, RAM, storage and transfer headers retain column sorting; mobile and optional card views keep the same rows and group the hardware values together.
- Removed the advertised-price strike-through and explanatory billing text from each catalog/provider price cell. Each row now displays one monthly price through `displayPriceUsd()`. Pricing calculations, reviewed-price gating, ranking and billing evidence on the canonical plan page are unchanged.
- Scoped the shared table styling to its own `offer-table` root in `src/styles/catalog.css`, so provider inventories receive the same readable columns without depending on the catalog page wrapper. Hidden card/mobile headers retain noninteractive column labels but do not leave invisible sort buttons in the keyboard order.
- A failing-before browser regression exercised missing CPU-column sorting; the restored implementation passed in all four desktop/tablet projects. The two mobile projects intentionally skip hidden desktop column buttons; live mobile smoke exercised the existing visible sort selector. Updated the packed-data transfer/price regression and unknown-fact browser invariants; removed the obsolete catalog-warning copy pin rather than re-pinning it.
- Live standalone smoke reviewed catalog, card and provider layouts in light/dark themes, exercised CPU sorting and keyboard plan navigation, and selected a plan for mobile comparison. The 390 px mobile catalog/provider pages and 1024/1440 px desktop/tablet pages stayed within the viewport; the desktop catalog table matched its 1072 px frame. Provider plan names no longer collapsed into individual letters.
- `npx vitest run`: **413 tests in 73 files passed**. `npx tsc --noEmit`, `npx eslint src tests scripts` and the fixture-backed production build passed. Reviewed and refreshed intentional catalog/provider screenshot differences; all **12 targeted visual checks passed**.
- Final complete `E2E_REUSE_BUILD=1 npm run test:e2e`: **589 passed, 173 profile/viewport skips, zero failures**. Breakdown: standard 452, large catalog 44, synthetic admin actions 12, editorial 18, price terms 18, reviewed-price audit 33 and settings 12. All 120 page baselines and the runtime share-image baseline matched without snapshot updates.
- Preview: `http://127.0.0.1:3115`. Uses the existing disposable preview database; no production data, renewal corrections, migration or snapshot publication changed. Phase 6 editorial owner gates remain open.


### G1 partial approval — 6 October 2026

- Owner approved a checked backup, disposable migration rehearsal, then production migrations 0014–0016. Both databases reached 17 migrations with `integrity_check = ok`, no foreign-key violations and all pre-existing data unchanged. Production has 322 published offers; editorial, audits, admin users and site settings each remain zero.
- Backup: `data/backups/bestvpsforme-pre-phase6-20261006-173437.db` (UTC). The rehearsal copy is `/tmp/bestvpsforme-phase6-g1-k4mzfcey/catalog.db`.
- Option B loader and unchanged batch-1 JSON are prepared. Default mode validates read-only; writes require an existing active admin actor and force `reviewStatus = draft`. Whole-batch validation and transactional audit rollback prevent partial batches; owner-reviewed entries cannot be demoted.
- All 20 authored entries validate on the migrated copy. No-actor and nonexistent-actor write attempts fail without changing its bytes. Synthetic CLI tests exercise successful draft saves only on disposable databases.
- Production drafts remain unapproved. The owner will log in to create the admin user, then provide its id for a separately authorized write. Tasks 6.5.3–6.5.5 and production setup-fee reviews remain pending; Phase 6 is not complete.
- Verification: 452 unit tests in 75 files passed (11 loader CLI tests), typecheck and lint passed, disposable production build passed, full browser coordinator passed 673 checks with 173 profile/viewport skips and zero failures. No screenshot baselines changed. Final production read-only check still reports 17 migrations and zero editorial/audit/admin/settings rows; integrity is `ok`.

## Out of scope

- Applying the 16 queued renewal corrections, or any production migration/publication (owner-gated, separate approval flow).
- Dropping the `offers.featured` column (destructive migration).
- Phase 7 (cache components, nonce CSP, Lighthouse budgets) and Phase 8 (Remotion video).
- The `.coverage_map` / `.dashboard_scoreboard` admin contrast sweep — tracked as a follow-up, not blocking.

### Production delivery — 7 October 2026

The owner authorized completion of the remaining preparation and production draft saves without waiting for a login or intermediate batch reviews. The implementation now delivers 100 audited drafts, an accessible review queue, individual terms dispositions, and four verified Liquid Web setup-fee saves. Historical approval gates above describe the status on their dates; migrations and the draft load are now complete. Editorial publication remains the owner's decision. The current home design supersedes the old X-ray presentation task.

See [phase-6-delivery-2026-10-07.md](phase-6-delivery-2026-10-07.md) for final verification and production receipts. Full editorial acceptance remains open: unsupported catches/fits are explicitly omitted and no editorial entry has been published as reviewed. The 20 open renewals and 16 correction rows remain unchanged.

### Final closure — 7 October 2026

The owner requested completion after the next-step explanation described review and publication. Delegated evidence review published 62 supported entries using the existing audited operation; 38 remain drafts for specific documented discrepancies. Public workload filters now return supported reviewed plans. The frozen 100-entry cohort has a final disposition for each entry; omitted sentences and holds are accepted delivery exceptions, not invented coverage. See [phase-6-closure-2026-10-07.md](phase-6-closure-2026-10-07.md) and the individual final review manifest. Phase 6 closes with the documented evidence backlog, and Phase 7 can begin.
