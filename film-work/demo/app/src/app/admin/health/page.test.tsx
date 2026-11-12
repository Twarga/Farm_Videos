import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { closeDatabase } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { setSiteSetting } from "@/lib/site-settings";
import { BACKUP_HEARTBEAT_KEY, RESTORE_DRILL_HEARTBEAT_KEY, recordBackupHeartbeat, recordRestoreDrill } from "@/lib/ops-heartbeat";
import AdminHealthPage from "./page";

vi.mock("@/lib/admin-request", () => ({
  requireAdmin: async () => ({ id: "owner", email: "owner@example.com", displayName: "Owner" }),
}));
vi.mock("@/components/admin/AdminConsole.module.css", () => ({ default: new Proxy({}, { get: (_target, key) => String(key) }) }));
vi.mock("@/components/admin/AdminDataTable.module.css", () => ({ default: new Proxy({}, { get: (_target, key) => String(key) }) }));

const noNavigation = () => { throw new Error("Unexpected navigation in server render"); };
const router: AppRouterInstance = {
  back: noNavigation,
  forward: noNavigation,
  refresh: noNavigation,
  push: noNavigation,
  replace: noNavigation,
  prefetch: noNavigation,
  bfcacheId: "admin-health-test",
};

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  migrateDatabase();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

function renderPage(page: React.ReactNode) {
  return renderToStaticMarkup(
    <AppRouterContext.Provider value={router}>
      <PathnameContext.Provider value="/admin/health">
        <AppNavigationProvider>{page}</AppNavigationProvider>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>,
  );
}

it("shows the latest backup and marks an old one as a warning", async () => {
  recordBackupHeartbeat({ at: new Date().toISOString(), file: "backups/recent.sqlite.enc", size: 2048, sha256: "a".repeat(64) });
  recordRestoreDrill("/tmp/recovery.json");
  const fresh = renderPage(await AdminHealthPage());
  expect(fresh).toContain("Latest encrypted backup");
  expect(fresh).toContain("backups/recent.sqlite.enc");
  expect(fresh).toContain("2048 bytes");
  expect(fresh).not.toContain("older than 26 hours");
  expect(fresh).not.toContain("older than 30 days");

  setSiteSetting(BACKUP_HEARTBEAT_KEY, JSON.stringify({
    at: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(),
    file: "backups/old.sqlite.enc",
    size: 1,
    sha256: "b".repeat(64),
  }));
  setSiteSetting(RESTORE_DRILL_HEARTBEAT_KEY, JSON.stringify({
    at: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
    evidence: "/tmp/old-recovery.json",
  }));
  const stale = renderPage(await AdminHealthPage());
  expect(stale).toContain("older than 26 hours");
  expect(stale).toContain("older than 30 days");
  expect(stale).toContain("warning");
});
