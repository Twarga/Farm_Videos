import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ADMIN_SESSION_COOKIE, getAdminSession } from "@/lib/admin-auth";
import { getAnalyticsSnapshot } from "@/db/analytics-reporting";
import { getAdminQueueCounts } from "@/db/admin-overview";
import { checkDatabaseReady } from "@/db/migrate";
import { getOpsHeartbeats } from "@/lib/ops-heartbeat";
import { getPublicShoreSource } from "@/lib/public-catalog";
import { logoutAdmin } from "./actions";

export const metadata: Metadata = {
  title: "Control room",
  description: "Private catalog operations workspace for bestvpsforme.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LEGACY_VIEWS: Record<string, string> = {
  offers: "/admin/offers", providers: "/admin/providers", quality: "/admin/quality",
  analytics: "/admin/analytics", activity: "/admin/audit",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; view?: string | string[] }> }) {
  noStore();
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? getAdminSession(token) : null;
  const { error, view } = await searchParams;
  if (!session) return <AdminLogin error={error} />;
  if (typeof view === "string" && LEGACY_VIEWS[view]) redirect(LEGACY_VIEWS[view]);
  const source = getPublicShoreSource();
  const queues = getAdminQueueCounts();
  const analytics = getAnalyticsSnapshot(30);
  const heartbeat = getOpsHeartbeats();
  const ready = (() => { try { checkDatabaseReady(); return true; } catch { return false; } })();
  return <AdminShell
    sidebar={<AdminSidebar active="/admin" counts={queues} />}
    topbar={<><Link href="/">View site</Link><form action={logoutAdmin}><button type="submit">Sign out</button></form></>}
  >
    <AdminOverview
      publication={{ status: source.meta.status, count: source.meta.count, providers: source.meta.providers, snapshotDate: source.meta.snapshotDate }}
      queues={queues}
      analytics={{ visitors: analytics.uniqueVisitors, clicks: analytics.clicks }}
      operations={{ backupAt: heartbeat.backup?.at ?? null, restoreAt: heartbeat.restoreDrill?.at ?? null, ready }}
    />
  </AdminShell>;
}
