import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import styles from "@/components/admin/AdminConsole.module.css";
import { collectAdminHealth } from "@/db/admin-health";
import { requireAdmin } from "@/lib/admin-request";

export const metadata: Metadata = { title: "Health · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminHealthPage() {
  noStore();
  try {
    await requireAdmin();
  } catch {
    redirect("/admin?error=expired");
  }
  const { quickCheck, requiredTables, catalog, backup, restoreDrill } = collectAdminHealth();
  const rows = [
    { id: "database", check: "SQLite quick check", status: quickCheck === "ok" ? "ok" : "failed", detail: quickCheck },
    { id: "schema", check: "Required schema", status: "ok", detail: `${requiredTables} required tables` },
    { id: "catalog", check: "Public publication", status: catalog.status, detail: `${catalog.offers.length} offers · ${catalog.reason}` },
    { id: "backup", check: "Latest encrypted backup", ...backup },
    { id: "restore-drill", check: "Last restore drill", ...restoreDrill },
    { id: "external", check: "Outbound destination health", status: "Not available", detail: "No automated destination check has been recorded." },
  ];
  return <AdminShell
    sidebar={<AdminSidebar active="/admin/health" />}
    topbar={<a className={styles.preview_link} href="/api/health/ready" target="_blank" rel="noreferrer">Readiness endpoint</a>}
  >
    <main className={styles.main}>
      <header className={styles.page_head}>
        <div>
          <span>Control room · system status</span>
          <h1>Health</h1>
          <p>Live database checks are current for this request. Missing monitoring evidence is labeled rather than inferred.</p>
        </div>
      </header>
      <AdminDataTable
        columns={[
          { key: "check", label: "Check" },
          { key: "status", label: "Status" },
          { key: "detail", label: "Evidence" },
        ]}
        rows={rows}
      />
    </main>
  </AdminShell>;
}
