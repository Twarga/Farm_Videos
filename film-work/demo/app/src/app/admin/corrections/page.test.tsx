import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { closeDatabase } from "@/db/client";
import { getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { corrections } from "@/db/schema";
import { publishedRowFixture } from "../../../../tests/fixtures/published-row";
import { POST } from "@/app/api/corrections/route";
import AdminCorrectionsPage from "./page";
import AdminCorrectionDetailPage from "./[id]/page";

vi.mock("@/lib/admin-request", () => ({
  requireAdmin: async () => ({ id: "owner", email: "owner@example.com", displayName: "Owner" }),
}));

const noNavigation = () => { throw new Error("Unexpected navigation in server render"); };
const router: AppRouterInstance = {
  back: noNavigation,
  forward: noNavigation,
  refresh: noNavigation,
  push: noNavigation,
  replace: noNavigation,
  prefetch: noNavigation,
  bfcacheId: "admin-corrections-test",
};

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  migrateDatabase();
  publishedRowFixture();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

function renderPage(page: React.ReactNode) {
  return renderToStaticMarkup(
    <AppRouterContext.Provider value={router}>
      <PathnameContext.Provider value="/admin/corrections">
        <AppNavigationProvider>{page}</AppNavigationProvider>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>,
  );
}

it("lists a correction submitted through the public API", async () => {
  const response = await POST(new Request("https://bestvpsforme.com/api/corrections", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": "203.0.113.9" },
    body: JSON.stringify({ entityId: "hetzner-cx22", field: "Renewal price", claimedValue: "Renews at $12.99/mo", sourceUrl: "https://example.com/terms" }),
  }));
  expect(response.status).toBe(201);
  const html = renderPage(await AdminCorrectionsPage({ searchParams: Promise.resolve({}) }));
  expect(html).toContain("hetzner-cx22");
  expect(html).toContain("Renewal price");
  expect(html).toContain("Renews at $12.99/mo");
  expect(html).not.toContain("<form");
  const row = getDb().select().from(corrections).get()!;
  const detail = renderPage(await AdminCorrectionDetailPage({ params: Promise.resolve({ id: row.id }) }));
  expect(detail).toContain("Open cited source");
  expect(detail).toContain("Accept correction");
  expect(detail).toContain("Reject correction");
  expect((detail.match(/<form\b/g) ?? [])).toHaveLength(1);
});

it("paginates the correction queue at 50 records", async () => {
  getDb().insert(corrections).values(Array.from({ length: 51 }, (_, index) => ({ id: crypto.randomUUID(), entityId: `test-${index}`, field: "Price", claimedValue: "$1", sourceUrl: "https://example.com/pricing" }))).run();
  const first = renderPage(await AdminCorrectionsPage({ searchParams: Promise.resolve({ page: "1" }) }));
  const second = renderPage(await AdminCorrectionsPage({ searchParams: Promise.resolve({ page: "2" }) }));
  expect(first).toContain("Next");
  expect(first).toContain("Page 1 of 2");
  expect(second).toContain("Page 2 of 2");
  expect((first.match(/Review correction/g) ?? [])).toHaveLength(50);
  expect((second.match(/Review correction/g) ?? [])).toHaveLength(1);
});
