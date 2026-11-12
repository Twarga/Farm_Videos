import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import styles from "@/components/admin/AdminConsole.module.css";
import { listPublicationRows } from "@/db/admin-publications";
import { requireAdmin } from "@/lib/admin-request";
import { rollbackSnapshot } from "./actions";

export const metadata: Metadata = { title: "Publications · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPublicationsPage() {
  noStore();
  try {
    await requireAdmin();
  } catch {
    redirect("/admin?error=expired");
  }
  const rows = listPublicationRows();
  const restorable = rows.filter((row) => row.status !== "published");
  return <AdminShell
    sidebar={<AdminSidebar active="/admin/publications" />}
    topbar={<a className={styles.preview_link} href="/admin/imports">Review staged imports</a>}
  >
    <main className={styles.main}>
      <header className={styles.page_head}>
        <div>
          <span>Control room · release history</span>
          <h1>Publications</h1>
          <p>
            Snapshot history and immutable offer counts. Restoring an earlier snapshot replaces the current published
            catalog; type rollback to confirm and the action is recorded in the audit log.
          </p>
        </div>
      </header>
      <AdminDataTable
        columns={[
          { key: "snapshot", label: "Version" },
          { key: "status", label: "Status" },
          { key: "published", label: "Published (UTC)" },
          { key: "offers", label: "Offers" },
          { key: "diff", label: "Change vs previous" },
          { key: "label", label: "Snapshot note" },
          { key: "importJob", label: "Import job" },
        ]}
        rows={rows.map((row) => ({ id: row.id, snapshot: row.snapshot, status: row.status, published: row.published, offers: row.offers, label: row.label, importJob: row.importJob,
          diff: row.added == null ? "First snapshot" : `+${row.added} / −${row.removed} / ~${row.changed}` }))}
      />
      <section className={styles.rollback_panel}>
        <div className={styles.section_head}>
          <div>
            <span>Restore</span>
            <h2>Roll back to an earlier snapshot</h2>
          </div>
        </div>
        {restorable.length ? <form action={rollbackSnapshot} className={styles.rollback_row}>
          <label htmlFor="rollback-snapshot"><strong>Choose a snapshot</strong><small>Restoring replaces the current published catalog and records an audit entry.</small></label>
          <select id="rollback-snapshot" name="snapshotId" required>{restorable.map((row) => <option key={row.id} value={row.id}>Snapshot {row.snapshot} · {row.published.slice(0, 10)} · {row.offers} offers</option>)}</select>
          <label htmlFor="rollback-confirmation">Type rollback to confirm</label>
          <input id="rollback-confirmation" name="confirmation" autoComplete="off" placeholder="rollback" required pattern="rollback" />
          <button className={styles.destructive_button} type="submit">Restore snapshot</button>
        </form> : <p>No earlier snapshot is available to restore.</p>}
      </section>
    </main>
  </AdminShell>;
}
