import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { CompareProvider } from "../CompareProvider";
import { offer } from "../../../tests/fixtures/offer";
import { publishedRowFixture } from "../../../tests/fixtures/published-row";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { offerPrices, offers, providers } from "@/db/schema";
import OfferRoute from "@/app/offers/[id]/page";
import { OfferPage } from "./OfferPage";
import { CostChart } from "./CostChart";
import type { ReactNode } from "react";

const navigate = () => { throw new Error("Unexpected navigation during render"); };
const router: AppRouterInstance = { back: navigate, forward: navigate, refresh: navigate, push: navigate, replace: navigate, prefetch: navigate, bfcacheId: "offer-regression" };
function render(children: ReactNode) {
  return renderToStaticMarkup(<AppRouterContext.Provider value={router}><PathnameContext.Provider value="/offers/test-offer"><AppNavigationProvider><CompareProvider>{children}</CompareProvider></AppNavigationProvider></PathnameContext.Provider></AppRouterContext.Provider>);
}
const partial = offer({ effectiveMonthly: 3, commitmentMonths: 1, termsReviewed: false, realMonthly: null, setupFee: null, renewalMonthly: null });
const reviewed = offer({ termsReviewed: true, realMonthly: 10.42, effectiveMonthly: 4, introMonthly: 4, introMonths: 3, commitmentMonths: 12, renewalMonthly: 11, setupFee: 0 });

it("keeps an unreviewed monthly offer out of the receipt projection", () => {
  const html = render(<OfferPage offer={partial} siblings={[]} alternatives={[]} />);
  const receipt = html.match(/<aside[^>]*class="[^"]*receipt[\s\S]*?<\/aside>/)![0];
  expect(receipt).toContain("Effective monthly price");
  expect(receipt).not.toContain("$108");
  expect(receipt).not.toContain("3-year real price");
});

it("does not draw a chart when canonical reviewed pricing is unavailable", () => {
  const html = renderToStaticMarkup(<CostChart offer={partial} />);
  expect(html).not.toContain("<svg");
  expect(html).toMatch(/reviewed/i);
});

it("labels the actual introduction end without calling a commitment prepay", () => {
  const html = render(<OfferPage offer={reviewed} siblings={[]} alternatives={[]} />);
  const receipt = html.match(/<aside[^>]*class="[^"]*receipt[\s\S]*?<\/aside>/)![0];
  expect(receipt).toContain("Renews from month 4");
  expect(receipt).not.toContain("month 13");
  expect(html).not.toContain("12-month prepay");
  expect(html).toContain("12-month term");
});

it("requires an upfront billing fact before displaying the prepay label", () => {
  const html = render(<OfferPage offer={{ ...reviewed, billedUpfrontMonths: 3 }} siblings={[]} alternatives={[]} />);
  expect(html).toContain("3-month prepay");
  expect(html).not.toContain("12-month prepay");
});

it("does not label a monthly allocation as day-one cash or a rising series as flat", () => {
  const input = { ...reviewed, effectiveMonthly: 6.49, introMonthly: 6.49, introMonths: 24, commitmentMonths: 24, realMonthly: 8.32, renewalMonthly: 11.99, cashDueNow: null, billedUpfrontMonths: null };
  const html = renderToStaticMarkup(<CostChart offer={input} />);
  expect(html).toContain("service cost");
  expect(html).toContain("$299.64");
  expect(html).not.toMatch(/Day 1|day one|flat until|\$6\.49 due/);
  expect(html).toMatch(/payment timing.*not projected/i);
});

it("preserves a separately reviewed cash payment without turning it into service cost", () => {
  const html = renderToStaticMarkup(<CostChart offer={{ ...reviewed, cashDueNow: 48 }} />);
  expect(html).toContain("Due today: $48");
  expect(html).toContain("$375");
});

it("does not advise assuming a value for unknown management", () => {
  const html = render(<OfferPage offer={partial} siblings={[]} alternatives={[]} />);
  expect(html).not.toContain("Assume unmanaged");
});

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  migrateDatabase();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

it("only offers savings against reviewed alternatives from the publication", async () => {
  for (const id of ["source", "unreviewed-cheap", "reviewed-cheap"]) publishedRowFixture(id);
  getDb().insert(providers).values({ id: "alternative", slug: "alternative", name: "Alternative", officialUrl: "https://example.com", status: "active", trustpilotScore: 4.3, trustpilotReviews: 800, trustpilotUrl: "https://www.trustpilot.com/review/alternative.example.com", trustpilotCheckedAt: new Date("2026-08-31T00:00:00Z") }).run();
  for (const id of ["unreviewed-cheap", "reviewed-cheap"]) getDb().update(offers).set({ providerId: "alternative" }).where(eq(offers.id, id)).run();
  getDb().update(offerPrices).set({ effectiveMonthly: 1, termMonths: 1 }).run();
  for (const [id, price] of [["source", 10], ["reviewed-cheap", 5]] as const) {
    getDb().update(offerPrices).set({ effectiveMonthly: price, renewalMonthly: price, setupFee: 0, termsReviewedAt: new Date("2026-08-31"), termsReviewedBy: "fixture reviewer", renewalSource: "Explicit provider renewal and zero setup fee." }).where(eq(offerPrices.offerId, id)).run();
  }
  const html = render(await OfferRoute({ params: Promise.resolve({ id: "source" }) }));
  expect(html).toContain('/offers/reviewed-cheap');
  expect(html).not.toContain('/offers/unreviewed-cheap');
  expect(html).toContain("$180");
});
