import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { providers } from "@/db/schema";
import AdminProvidersPage from "./page";
import AdminProviderDetailPage from "./[id]/page";

vi.mock("@/lib/admin-request", () => ({ requireAdmin: async () => ({ id: "owner" }) }));
const redirects = vi.hoisted(() => ({ path: "" }));
vi.mock("next/navigation", async (importOriginal) => ({
  ...await importOriginal<typeof import("next/navigation")>(),
  redirect: (path: string) => { redirects.path = path; throw new Error(`redirect:${path}`); },
}));

const unexpected = () => { throw new Error("Unexpected navigation"); };
const router: AppRouterInstance = { back: unexpected, forward: unexpected, refresh: unexpected, push: unexpected, replace: unexpected, prefetch: unexpected, bfcacheId: "provider-page-test" };
function render(node: React.ReactNode, path: string) {
  return renderToStaticMarkup(<AppRouterContext.Provider value={router}><PathnameContext.Provider value={path}><AppNavigationProvider>{node}</AppNavigationProvider></PathnameContext.Provider></AppRouterContext.Provider>);
}

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  migrateDatabase();
  getDb().insert(providers).values([
    { id: "zeta", slug: "zeta", name: "Zeta", officialUrl: "https://example.com" },
    { id: "alpha", slug: "alpha", name: "Alpha", officialUrl: "https://example.com" },
  ]).run();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

it("renders a compact A to Z list with detail links and no edit forms", async () => {
  const html = render(await AdminProvidersPage({ searchParams: Promise.resolve({}) }), "/admin/providers");
  expect(html.indexOf("Alpha")).toBeLessThan(html.indexOf("Zeta"));
  expect(html).toContain('href="/admin/providers/alpha"');
  expect(html).not.toContain("<form action=");
  expect(html).toContain("2 providers");
});

it("renders exactly one revision-checked provider edit form on the detail route", async () => {
  const html = render(await AdminProviderDetailPage({ params: Promise.resolve({ id: "alpha" }) }), "/admin/providers/alpha");
  expect(html.match(/<form\b/g)).toHaveLength(1);
  expect(html).toContain('name="expectedUpdatedAt"');
  expect(html).toContain("Save provider record");
  expect(html).toContain("Trustpilot HTTPS source");
  expect(html).toContain('href="/admin/affiliates"');
});

it("does not render another provider for an unknown id", async () => {
  await expect(AdminProviderDetailPage({ params: Promise.resolve({ id: "missing" }) })).rejects.toThrow("redirect:/admin/providers");
});

