import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext, SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import ComparePage from "./page";
import { CompareProvider } from "@/components/CompareProvider";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { locations, offerLocations, offerPrices, offers, providers } from "@/db/schema";
import { publishedRowFixture } from "../../../tests/fixtures/published-row";

const noNavigation = () => { throw new Error("Unexpected navigation during server render"); };
const router: AppRouterInstance = { back: noNavigation, forward: noNavigation, refresh: noNavigation, push: noNavigation, replace: noNavigation, prefetch: noNavigation, bfcacheId: "comparison-test" };
const checkedAt = new Date("2026-08-31T00:00:00Z");

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", "");
  migrateDatabase();
  const db = getDb();
  for (const [id, price] of [["cheaper", 5], ["dearer", 9]] as const) {
    publishedRowFixture(id);
    db.update(offerPrices).set({ effectiveMonthly: price, termMonths: 1, renewalMonthly: price, setupFee: 0, termsReviewedAt: checkedAt, termsReviewedBy: "fixture", renewalSource: "https://example.com/billing" }).where(eq(offerPrices.offerId, id)).run();
  }
  db.update(providers).set({ trustpilotScore: 4.5 }).run();
  db.update(offers).set({ vcpus: 4, ramGb: 4, diskType: "SSD", bandwidthTb: null }).where(eq(offers.id, "cheaper")).run();
  db.update(offers).set({ vcpus: 2, ramGb: 8, diskType: "NVMe", bandwidthTb: 4 }).where(eq(offers.id, "dearer")).run();
  db.insert(locations).values({ id: "de", isoCountry: "DE", countryName: "Germany" }).run();
  db.insert(offerLocations).values({ offerId: "cheaper", locationId: "de" }).run();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

async function html(p = "dearer,cheaper") {
  return renderToStaticMarkup(
    <AppRouterContext.Provider value={router}><PathnameContext.Provider value="/compare"><SearchParamsContext.Provider value={new URLSearchParams({ p })}>
      <AppNavigationProvider><CompareProvider>{await ComparePage({ searchParams: Promise.resolve({ p }) })}</CompareProvider></AppNavigationProvider>
    </SearchParamsContext.Provider></PathnameContext.Provider></AppRouterContext.Provider>,
  );
}

/** Returns the markup of one table row by its row header label. */
function row(result: string, label: string): string {
  const match = new RegExp(`<tr[^>]*><th scope="row">${label}</th>.*?</tr>`).exec(result);
  if (!match) throw new Error(`Row not found: ${label}`);
  return match[0];
}

it("renders the mockup sewing table with its sections and rows", async () => {
  const result = await html();
  expect(result).toMatch(/<table[^>]*class="cmp"[^>]*aria-label="VPS plan comparison"/);
  expect(result).toContain('class="cmp-wrap"');
  expect(result).toContain('class="sew"');
  expect(result).toContain('class="cmp-corner__crab"');
  for (const section of ["Price", "Hardware", "Trust"]) expect(result).toContain(`>${section}</span></th></tr>`);
  for (const label of ["First 36 months", "Price per month", "3-year average", "Renews at", "Setup fee", "Contract", "CPU", "Memory", "Storage", "Transfer", "Trustpilot", "Price checked"]) {
    expect(result).toContain(`<th scope="row">${label}</th>`);
  }
});

it("has no legacy comparison grid or winner panel", async () => {
  const result = await html();
  for (const legacy of ["grid-c", "chead", "ctools", "vtl", "is-same", "cell-award"]) expect(result).not.toContain(legacy);
});

it("labels only one clear winner and never labels a tie", async () => {
  const result = await html();
  const price = row(result, "Price per month");
  expect(price).toMatch(/Lowest/);
  // Trustpilot is 4.5 for both columns, a tie, so neither column carries a chip.
  const trust = row(result, "Trustpilot");
  expect(trust).not.toContain("Highest");
  expect(trust).not.toContain("Lowest");
});

it("counts exactly the rows that differ and tints only those", async () => {
  const result = await html();
  const diffRows = (result.match(/<tr[^>]*class="diff"/g) ?? []).length;
  const sameRows = (result.match(/<tr[^>]*class="same"/g) ?? []).length;
  expect(diffRows).toBeGreaterThan(0);
  expect(result).toContain(`<b class="num">${diffRows}</b> rows differ`);
  for (const label of ["Setup fee", "Contract", "Storage", "Trustpilot", "Price checked"]) expect(row(result, label)).toContain('class="same"');
  for (const label of ["First 36 months", "Price per month", "3-year average", "Renews at", "CPU", "Memory", "Transfer"]) expect(row(result, label)).toContain('class="diff"');
  expect(sameRows).toBeGreaterThan(0);
});

it("keeps unpublished rows in one line per section instead of fake values", async () => {
  const result = await html();
  expect(result).toContain("No selected plan publishes: Due today.");
  expect(result).toContain("No selected plan publishes: IPv4 address.");
  expect(result).toContain("Not published");
});

it("links Remove back to the comparison without that plan", async () => {
  const result = await html();
  expect(result).toMatch(/href="\/compare\?id=cheaper"[^>]*>Remove<span class="sr-only">/);
  expect(result).toMatch(/href="\/compare\?id=dearer"[^>]*>Remove<span class="sr-only">/);
});

it("shows the empty pail state with the catalog call to action", async () => {
  const result = await html("");
  expect(result).toContain("Your pail is empty.");
  expect(result).toContain("Open the catalog");
  expect(result).not.toContain('class="cmp-wrap"');
});
