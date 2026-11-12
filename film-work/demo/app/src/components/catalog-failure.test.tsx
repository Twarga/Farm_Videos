import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { CompareProvider } from "@/components/CompareProvider";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import CatalogPage from "../../tests/fixtures/catalog-page";
import { closeDatabase, getDb, getSqlite } from "@/db/client";
import { providers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { migrateDatabase } from "@/db/migrate";
import { IncomingMessage, ServerResponse } from "node:http";
import { Socket } from "node:net";
import { getServerSideProps } from "@/pages/catalog";
import { publishedRowFixture } from "../../tests/fixtures/published-row";

// Server rendering should not navigate. Real Next contexts avoid replacing hooks
// or the component with mocks; unexpected navigation fails immediately.
const unexpectedNavigation = () => { throw new Error("Unexpected navigation while rendering unavailable catalog"); };
const router: AppRouterInstance = { back: unexpectedNavigation, forward: unexpectedNavigation, refresh: unexpectedNavigation, push: unexpectedNavigation, replace: unexpectedNavigation, prefetch: unexpectedNavigation, bfcacheId: "catalog-failure-fixture" };

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", "");
  migrateDatabase();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

async function renderCatalog() {
  const page = await CatalogPage({ searchParams: Promise.resolve({}) });
  return renderToStaticMarkup(<AppRouterContext.Provider value={router}><PathnameContext.Provider value="/catalog"><AppNavigationProvider><CompareProvider>{page}</CompareProvider></AppNavigationProvider></PathnameContext.Provider></AppRouterContext.Provider>);
}

it("shows a retryable empty-publication state without demo plans or zero-result filter advice", async () => {
  const html = await renderCatalog();
  // Shore catalog uses role="status" for the unavailable state
  expect(html).toContain('role="status"');
  expect(html).toContain("The tide is out.");
  expect(html).toContain("don&#x27;t show old prices");
  expect(html).toContain("Try again");
  expect(html).not.toMatch(/href="\/(?:offers|go)\//);
});

it("shows a retryable storage-error state when the real SQLite connection is unavailable", async () => {
  getSqlite().close();
  const html = await renderCatalog();
  // Shore catalog uses role="status" for the unavailable state
  expect(html).toContain('role="status"');
  expect(html).toContain("The tide is out.");
  expect(html).toContain("Try again");
  expect(html).not.toMatch(/href="\/(?:offers|go)\//);
});

it("serves the active publication privately, so no shared cache can reuse one visitor's catalog", async () => {
  publishedRowFixture("synthetic-vps-1");
  getDb().update(providers).set({ trustpilotScore: 4.5 }).where(eq(providers.id, "hetzner")).run();
  const response = new ServerResponse(new IncomingMessage(new Socket()));
  const result = await getServerSideProps({ query: {}, res: response });
  expect(response.getHeader("Cache-Control")).toBe("private, no-store, max-age=0");
  expect(result.props.initialData.rows.map((offer) => offer.id)).toEqual(["synthetic-vps-1"]);
  expect(result.props.initialData.status).toBe("available");
  expect(await renderCatalog()).toContain('href="/offers/synthetic-vps-1"');
});
