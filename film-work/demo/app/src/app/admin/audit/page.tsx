import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "../providers/page.module.css";
import { listAuditPage } from "@/db/admin-audit";
import { requireAdmin } from "@/lib/admin-request";

export const metadata: Metadata = { title: "Audit log · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAuditPage({ searchParams }: { searchParams: Promise<{ actor?: string; action?: string; entity?: string; from?: string; to?: string; page?: string }> }) {
  noStore();
  try {
    await requireAdmin();
  } catch {
    redirect("/admin?error=expired");
  }
  const params = await searchParams;
  const data = listAuditPage({ actor: params.actor, action: params.action, entity: params.entity, from: params.from, to: params.to, page: Number(params.page) });
  const pageHref = (page: number) => { const query = new URLSearchParams(); for (const key of ["actor", "action", "entity", "from", "to"] as const) if (params[key]) query.set(key, params[key]!); query.set("page", String(page)); return `/admin/audit?${query}`; };
  const pretty = (raw: string | null) => { if (!raw) return "Not recorded"; try { return JSON.stringify(JSON.parse(raw), null, 2); } catch { return raw; } };
  return <AdminShell sidebar={<AdminSidebar active="/admin/audit" />} topbar={<span>Append-only record</span>}>
    <main className={styles.main}>
      <header className={styles.heading}>
        <div>
          <span>Control room · accountability</span>
          <h1>Audit log</h1>
          <p>Append-only record of administrative changes and public correction submissions.</p>
        </div>
      </header>
      <form className={styles.toolbar} action="/admin/audit" method="get" role="search">
        <label>Actor<input name="actor" defaultValue={params.actor ?? ""} maxLength={100} /></label>
        <label>Action<input name="action" defaultValue={params.action ?? ""} maxLength={100} /></label>
        <label>Entity<input name="entity" defaultValue={params.entity ?? ""} maxLength={100} /></label>
        <label>From<input name="from" type="date" defaultValue={params.from ?? ""} /></label>
        <label>To<input name="to" type="date" defaultValue={params.to ?? ""} /></label>
        <button type="submit">Filter</button>
      </form>
      <p className={styles.count}>{data.total ? `${(data.page - 1) * 50 + 1}–${Math.min(data.page * 50, data.total)} of ${data.total}` : "No events match"}</p>
      {data.rows.length ? <div className={styles.tableScroll}><table className={styles.table}><caption className="sr-only">Administrative audit entries</caption><thead><tr><th scope="col">Time (UTC)</th><th scope="col">Actor</th><th scope="col">Action</th><th scope="col">Target</th><th scope="col">Changes</th></tr></thead><tbody>
        {data.rows.map((row) => <tr key={row.id}><td><time dateTime={row.at}>{row.at}</time></td><td>{row.actor}</td><th scope="row">{row.action}</th><td>{row.target || "—"}</td><td><details><summary>View before and after</summary><strong>Before</strong><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{pretty(row.before)}</pre><strong>After</strong><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{pretty(row.after)}</pre></details></td></tr>)}
      </tbody></table></div> : <p className={styles.empty}>No audit entries match the filters.</p>}
      {data.pages > 1 ? <nav className={styles.pagination} aria-label="Audit pages"><span>Page {data.page} of {data.pages}</span>{data.page > 1 ? <a href={pageHref(data.page - 1)}>Previous</a> : null}{data.page < data.pages ? <a href={pageHref(data.page + 1)}>Next</a> : null}</nav> : null}
    </main>
  </AdminShell>;
}
