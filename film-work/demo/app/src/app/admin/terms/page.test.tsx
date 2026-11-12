import { renderToStaticMarkup } from "react-dom/server";
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { offerPrices } from "@/db/schema";
import { publishedRowFixture } from "../../../../tests/fixtures/published-row";
import AdminTermsPage from "./page";
import AdminTermDetailPage from "./[offerId]/page";

vi.mock("@/lib/admin-request", () => ({ requireAdmin: async () => ({ id: "owner" }) }));
const noNavigation = () => { throw new Error("Unexpected navigation"); };
const router: AppRouterInstance = { back: noNavigation, forward: noNavigation, refresh: noNavigation, push: noNavigation, replace: noNavigation, prefetch: noNavigation, bfcacheId: "terms-test" };
function render(page: React.ReactNode, pathname: string) {
  return renderToStaticMarkup(<AppRouterContext.Provider value={router}><PathnameContext.Provider value={pathname}>{page}</PathnameContext.Provider></AppRouterContext.Provider>);
}
beforeEach(() => { closeDatabase(); vi.stubEnv("DATABASE_URL", ":memory:"); migrateDatabase(); });
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });
function seed(id: string) {
  publishedRowFixture(id);
  getDb().update(offerPrices).set({ termMonths: 24 }).where(eq(offerPrices.offerId, id)).run();
}

it("paginates the terms queue to 50 linked rows without rendering edit forms", async () => {
  for (let i = 0; i < 51; i++) seed(`terms-${String(i).padStart(2, "0")}`);
  const first = render(await AdminTermsPage({ searchParams: Promise.resolve({}) }), "/admin/terms");
  const second = render(await AdminTermsPage({ searchParams: Promise.resolve({ page: "2" }) }), "/admin/terms");
  expect((first.match(/data-term-row=/g) ?? [])).toHaveLength(50);
  expect(first).not.toContain("<form");
  expect(first).toContain("1–50 of 51");
  expect((second.match(/data-term-row=/g) ?? [])).toHaveLength(1);
  expect(second).toContain("51–51 of 51");
});

it("puts one approval form and its evidence on the selected offer detail", async () => {
  seed("terms-one");
  const html = render(await AdminTermDetailPage({ params: Promise.resolve({ offerId: "terms-one" }), searchParams: Promise.resolve({}) }), "/admin/terms/terms-one");
  expect((html.match(/<form/g) ?? [])).toHaveLength(1);
  expect(html).toContain("Price terms for terms-one");
  expect(html).toContain("Provider source");
  expect(html).toContain("Approve price terms");
});

