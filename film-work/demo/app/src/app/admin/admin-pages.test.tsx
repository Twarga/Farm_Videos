import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { adminUsers, auditLog, corrections, providerAffiliatePrograms, providers } from "@/db/schema";
import { createPublicationSnapshot } from "@/db/publication-snapshots";
import AdminAffiliatesPage from "./affiliates/page";
import AdminAnalyticsPage from "./analytics/page";
import AdminAuditPage from "./audit/page";
import AdminCorrectionsPage from "./corrections/page";
import AdminHealthPage from "./health/page";
import AdminProvidersPage from "./providers/page";
import AdminPublicationsPage from "./publications/page";
import AdminSettingsPage from "./settings/page";

const auth = vi.hoisted(() => ({ ok: true }));
const redirects = vi.hoisted(() => ({ urls: [] as string[] }));
vi.mock("@/lib/admin-request", () => ({
  requireAdmin: async () => {
    if (!auth.ok) throw new Error("Admin authentication required");
    return { id: "owner", email: "owner@example.com", displayName: "Owner" };
  },
}));
vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    redirect: (url: string) => {
      redirects.urls.push(url);
      throw new Error(`REDIRECT:${url}`);
    },
  };
});

const noNavigation = () => { throw new Error("Unexpected navigation in server render"); };
const router: AppRouterInstance = {
  back: noNavigation,
  forward: noNavigation,
  refresh: noNavigation,
  push: noNavigation,
  replace: noNavigation,
  prefetch: noNavigation,
  bfcacheId: "admin-pages-test",
};

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", "");
  migrateDatabase();
  auth.ok = true;
  redirects.urls.length = 0;
  getDb().insert(adminUsers).values({ id: "owner", email: "owner@example.com", passwordHash: "unused" }).run();
  getDb().insert(providers).values({
    id: "provider-one",
    slug: "provider-one",
    name: "Provider One",
    officialUrl: "https://example.com",
    status: "active",
    trustpilotScore: 4.2,
  }).run();
  getDb().insert(auditLog).values({
    id: "audit-1",
    actorAdminUserId: "owner",
    action: "admin.test_event",
    entityType: "offer",
    entityId: "provider-one",
  }).run();
  getDb().insert(providerAffiliatePrograms).values({
    id: "affiliate-1",
    providerId: "provider-one",
    programSlug: "partner",
    programName: "Partner Program",
    lastCheckedAt: new Date("2026-09-01T00:00:00Z"),
  }).run();
  getDb().insert(corrections).values({
    id: "correction-1",
    entityId: "provider-one",
    field: "Monthly price",
    claimedValue: "price-check",
    sourceUrl: "https://example.com/pricing",
  }).run();
  createPublicationSnapshot(null, "Baseline");
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

function render(page: React.ReactNode, path: string) {
  return renderToStaticMarkup(
    <AppRouterContext.Provider value={router}>
      <PathnameContext.Provider value={path}>
        <AppNavigationProvider>{page}</AppNavigationProvider>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>,
  );
}

async function expectRedirect(load: () => Promise<unknown>) {
  auth.ok = false;
  redirects.urls.length = 0;
  await expect(load()).rejects.toThrow("REDIRECT:/admin?error=expired");
  expect(redirects.urls).toEqual(["/admin?error=expired"]);
  auth.ok = true;
}

it("renders the audit log with the acting operator", async () => {
  const html = render(await AdminAuditPage({ searchParams: Promise.resolve({}) }), "/admin/audit");
  expect(html).toContain("Audit log");
  expect(html).toContain("admin.test_event");
  expect(html).toContain("owner@example.com");
  expect(html).toContain('name="actor"');
  await expectRedirect(() => AdminAuditPage({ searchParams: Promise.resolve({}) }));
});

it("renders the health checks", async () => {
  const html = render(await AdminHealthPage(), "/admin/health");
  expect(html).toContain("Required schema");
  expect(html).toContain("Latest encrypted backup");
  await expectRedirect(() => AdminHealthPage());
});

it("renders publication history with a restore form", async () => {
  createPublicationSnapshot(null, "Second release");
  createPublicationSnapshot(null, "Third release");
  const html = render(await AdminPublicationsPage(), "/admin/publications");
  expect(html).toContain("Baseline");
  expect(html).toContain("Roll back to an earlier snapshot");
  expect(html).toContain("Snapshot 1");
  expect(html).toContain('name="confirmation"');
  expect((html.match(/<form/g) ?? [])).toHaveLength(1);
  await expectRedirect(() => AdminPublicationsPage());
});

it("renders provider identities with a link to the single-record editor", async () => {
  const html = render(await AdminProvidersPage({ searchParams: Promise.resolve({}) }), "/admin/providers");
  expect(html).toContain("Provider One");
  expect(html).toContain('href="/admin/providers/provider-one"');
  expect(html).not.toContain("Save provider record");
  await expectRedirect(() => AdminProvidersPage({ searchParams: Promise.resolve({}) }));
});

it("renders affiliate records", async () => {
  const html = render(await AdminAffiliatesPage({ searchParams: Promise.resolve({}) }), "/admin/affiliates");
  expect(html).toContain("Partner Program");
  expect(html).toContain('href="/admin/affiliates/affiliate-1"');
  expect(html).not.toContain("Save affiliate record");
  await expectRedirect(() => AdminAffiliatesPage({ searchParams: Promise.resolve({}) }));
});

it("renders an empty analytics period without fabricated conversion metrics", async () => {
  const html = render(await AdminAnalyticsPage(), "/admin/analytics");
  expect(html).toContain("No events yet");
  expect(html).not.toContain("Commission");
  await expectRedirect(() => AdminAnalyticsPage());
});

it("renders the owner settings", async () => {
  const html = render(await AdminSettingsPage(), "/admin/settings");
  expect(html).toContain("Catalog search");
  expect(html).toContain("Save catalog search");
  await expectRedirect(() => AdminSettingsPage());
});

it("renders the correction queue", async () => {
  const html = render(await AdminCorrectionsPage({ searchParams: Promise.resolve({}) }), "/admin/corrections");
  expect(html).toContain("price-check");
  expect(html).toContain("Review correction");
  await expectRedirect(() => AdminCorrectionsPage({ searchParams: Promise.resolve({}) }));
});
