import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import HomePage from "@/app/page";
import CatalogPage from "../../tests/fixtures/catalog-page";
import MethodologyPage from "@/app/methodology/page";
import UpdatesPage from "@/app/updates/page";
import { CompareProvider } from "./CompareProvider";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { publicationSnapshots, providers } from "@/db/schema";
import { publishedRowFixture } from "../../tests/fixtures/published-row";

const unexpectedNavigation = () => { throw new Error("Unexpected navigation during snapshot render"); };
const router: AppRouterInstance = { back: unexpectedNavigation, forward: unexpectedNavigation, refresh: unexpectedNavigation, push: unexpectedNavigation, replace: unexpectedNavigation, prefetch: unexpectedNavigation, bfcacheId: "snapshot-fixture" };

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", "");
  migrateDatabase();
  publishedRowFixture("snapshot-fixture-plan");
  getDb().update(providers).set({ trustpilotScore: 4.5 }).where(eq(providers.id, "hetzner")).run();
  // Synthetic records only: no publication service or source dataset is invoked.
  getDb().insert(publicationSnapshots).values([
    { id: "synthetic-active", snapshotVersion: 1, label: "Synthetic test fixture", status: "published", publishedAt: new Date("2026-09-17T12:00:00Z") },
    { id: "synthetic-rolled-back", snapshotVersion: 2, label: "Synthetic rolled-back fixture", status: "rolled-back", publishedAt: new Date("2026-09-29T12:00:00Z") },
  ]).run();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

it("shows the active snapshot date on the real home page", () => {
  const html = renderToStaticMarkup(<HomePage />);
  expect(html).toContain("17 Sept 2026");
  expect(html).not.toContain("29 Sept 2026");
});

it("shows the active snapshot date in the real catalog toolbar", async () => {
  const page = await CatalogPage({ searchParams: Promise.resolve({}) });
  const html = renderToStaticMarkup(<AppRouterContext.Provider value={router}><PathnameContext.Provider value="/catalog"><AppNavigationProvider><CompareProvider>{page}</CompareProvider></AppNavigationProvider></PathnameContext.Provider></AppRouterContext.Provider>);
  expect(html).toContain("Snapshot 17 Sept 2026");
  expect(html).not.toContain("Snapshot date unavailable");
});


it("shows the active snapshot date in the actual methodology and update pages", () => {
  expect(renderToStaticMarkup(<MethodologyPage />)).toContain("17 Sept 2026");
  expect(renderToStaticMarkup(<UpdatesPage />)).toMatch(/<time[^>]*>17 Sept 2026<\/time>/);
});

it("keeps the snapshot date explicitly unknown when no active record exists", async () => {
  getDb().update(publicationSnapshots).set({ status: "superseded" }).where(eq(publicationSnapshots.id, "synthetic-active")).run();
  expect(renderToStaticMarkup(<HomePage />)).toContain("Snapshot date unavailable");
  expect(renderToStaticMarkup(<MethodologyPage />)).toContain("Snapshot date unavailable");
  const updates = renderToStaticMarkup(<UpdatesPage />);
  const header = updates.slice(0, updates.indexOf("</header>"));
  expect(header).toContain("No active publication");
  expect(header).not.toContain("<time");
  const page = await CatalogPage({ searchParams: Promise.resolve({}) });
  const catalog = renderToStaticMarkup(<AppRouterContext.Provider value={router}><PathnameContext.Provider value="/catalog"><AppNavigationProvider><CompareProvider>{page}</CompareProvider></AppNavigationProvider></PathnameContext.Provider></AppRouterContext.Provider>);
  expect(catalog).toContain("Snapshot date unavailable");
});
