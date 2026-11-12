import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { CompareProvider } from "@/components/CompareProvider";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { offerPrices } from "@/db/schema";
import { publishedRowFixture } from "../../../../tests/fixtures/published-row";
import ProviderPage from "./page";

const noNavigation = () => { throw new Error("Unexpected navigation in server render"); };
const router: AppRouterInstance = { back: noNavigation, forward: noNavigation, refresh: noNavigation, push: noNavigation, replace: noNavigation, prefetch: noNavigation, bfcacheId: "provider-price-test" };
beforeEach(() => {
  closeDatabase(); vi.stubEnv("DATABASE_URL", ":memory:"); vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", ""); migrateDatabase();
  publishedRowFixture();
  getDb().update(offerPrices).set({ termMonths: 1 }).run();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

it("does not publish a provider real-price range from unreviewed monthly terms", async () => {
  const html = renderToStaticMarkup(<AppRouterContext.Provider value={router}><PathnameContext.Provider value="/providers/hetzner"><AppNavigationProvider><CompareProvider>{await ProviderPage({ params: Promise.resolve({ slug: "hetzner" }) })}</CompareProvider></AppNavigationProvider></PathnameContext.Provider></AppRouterContext.Provider>);
  const stats = html.match(/<div class="pstats"[\s\S]*?<\/div><\/div>/)?.[0];
  expect(stats).toBeDefined();
  expect(stats?.includes("$7.00")).toBe(false);
});

const renderPage = async () => renderToStaticMarkup(<AppRouterContext.Provider value={router}><PathnameContext.Provider value="/providers/hetzner"><AppNavigationProvider><CompareProvider>{await ProviderPage({ params: Promise.resolve({ slug: "hetzner" }) })}</CompareProvider></AppNavigationProvider></PathnameContext.Provider></AppRouterContext.Provider>);

it("cites the 3-year price for a renewal step-up only when one is computable", async () => {
  getDb().update(offerPrices).set({ effectiveMonthly: 7, termMonths: 12, introMonths: 3, introMonthly: 7, renewalMonthly: 12, setupFee: 0, renewalSource: "Renews at $12/mo after the intro term.", termsReviewedAt: new Date("2026-08-31"), termsReviewedBy: "operator" }).run();
  const html = await renderPage();
  expect(html).toContain("the 3-year price includes it");
});

it("keeps the renewal step-up warning honest when no 3-year price exists", async () => {
  // Reviewed renewal step-up but no setup fact: the projection is withheld,
  // so the copy must not point at a 3-year price that cannot exist.
  getDb().update(offerPrices).set({ effectiveMonthly: 7, termMonths: 12, introMonths: 3, introMonthly: 7, renewalMonthly: 12, setupFee: null, renewalSource: "Renews at $12/mo after the intro term.", termsReviewedAt: new Date("2026-08-31"), termsReviewedBy: "operator" }).run();
  const html = await renderPage();
  expect(html).not.toContain("3-year price includes it");
  expect(html).toContain("the increase applies from the renewal date");
});
