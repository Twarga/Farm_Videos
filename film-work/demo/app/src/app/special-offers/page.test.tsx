import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { CompareProvider } from "@/components/CompareProvider";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { offerPrices, publicationSnapshots } from "@/db/schema";
import { publishedRowFixture } from "../../../tests/fixtures/published-row";
import { setSiteSetting } from "@/lib/site-settings";
import { SPECIAL_OFFERS_KEY } from "@/lib/special-offers";
import SpecialOffersPage from "./page";

const noNavigation = () => { throw new Error("Unexpected navigation in server render"); };
const router: AppRouterInstance = { back: noNavigation, forward: noNavigation, refresh: noNavigation, push: noNavigation, replace: noNavigation, prefetch: noNavigation, bfcacheId: "special-offers-test" };

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", "");
  migrateDatabase();
  publishedRowFixture("live-promo");
  publishedRowFixture("expired-promo");
  getDb().update(offerPrices).set({ termMonths: 1 }).run();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

function publishPromotions(entries: unknown[]) {
  const snapshotId = "special-offers-snapshot";
  getDb().insert(publicationSnapshots).values({ id: snapshotId, snapshotVersion: 1, label: "Test", status: "published", publishedAt: new Date() }).run();
  setSiteSetting(SPECIAL_OFFERS_KEY, JSON.stringify({ snapshotId, entries }));
}

function promotion(offerId: string, overrides: Record<string, unknown> = {}) {
  return {
    offerId, label: "Special price", amount: 7, periodMonths: 1,
    checkedAt: new Date().toISOString(),
    sourceUrl: "https://example.com/plan", availability: "advertised",
    vcpu: 2, ramGb: 4, diskGb: 80,
    ...overrides,
  };
}

function renderPage() {
  return renderToStaticMarkup(
    <AppRouterContext.Provider value={router}>
      <PathnameContext.Provider value="/special-offers">
        <AppNavigationProvider>
          <CompareProvider>{SpecialOffersPage()}</CompareProvider>
        </AppNavigationProvider>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>,
  );
}

it("renders live reviewed promotions only, never an expired one", () => {
  publishPromotions([
    promotion("live-promo"),
    promotion("expired-promo", { expiresAt: new Date(Date.now() - 60_000).toISOString() }),
  ]);
  const html = renderPage();
  expect(html).toContain("live-promo");
  expect(html).not.toContain("expired-promo");
  expect(html).toContain('id="dealN">1<');
});

it("renders no deals when every promotion is past its freshness window", () => {
  publishPromotions([
    promotion("live-promo", { checkedAt: new Date(Date.now() - 96 * 3600_000).toISOString() }),
    promotion("expired-promo", { checkedAt: new Date(Date.now() - 96 * 3600_000).toISOString() }),
  ]);
  const html = renderPage();
  expect(html).not.toContain('data-row="live-promo"');
  expect(html).not.toContain('data-row="expired-promo"');
  expect(html).toContain("No deals today");
});

it("shows an annual promotion's full charge, monthly equivalent, evidence and unknown renewal", () => {
  getDb().update(offerPrices).set({ termMonths: 12, effectiveMonthly: 21.99 / 12 }).run();
  publishPromotions([promotion("live-promo", {
    amount: 21.99,
    periodMonths: 12,
    sourceUrl: "https://example.com/annual-plan",
    availability: "limited-stock",
  })]);
  const html = renderPage();
  expect(html).toContain("$21.99");
  expect(html).toContain("12 months");
  expect(html).toContain("Monthly equivalent");
  expect(html).toContain("$1.83/mo");
  expect(html).toContain("Later price not published");
  expect(html).toContain('href="https://example.com/annual-plan"');
  expect(html).toContain("Limited stock");
  expect(html).not.toContain("First 12 months");
});

it("keeps a true introductory term and its evidenced renewal distinct from the promotion charge", () => {
  getDb().update(offerPrices).set({
    introMonths: 3,
    introMonthly: 7,
    renewalMonthly: 10,
    renewalSource: "https://example.com/plan renews at $10 monthly",
    termsReviewedAt: new Date(),
    termsReviewedBy: "test reviewer",
  }).run();
  publishPromotions([promotion("live-promo")]);
  const html = renderPage();
  expect(html).toContain("First 3 months");
  expect(html).toContain("Then");
  expect(html).toContain("$10.00");
  expect(html).toContain("$7.00 for 1 month");
});
