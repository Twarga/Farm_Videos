import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAdminQualityReport } from "@/db/admin-quality";
import { requireAdmin } from "@/lib/admin-request";
import shellStyles from "@/components/admin/AdminConsole.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Data quality · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminQualityPage({ searchParams }: { searchParams: Promise<{ rule?: string; page?: string }> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const params = await searchParams;
  const requestedPage = Number(params.page);
  const report = getAdminQualityReport({ rule: params.rule, page: Number.isSafeInteger(requestedPage) ? requestedPage : 1 });
  const pageHref = (page: number) => `/admin/quality${report.rule ? `?rule=${encodeURIComponent(report.rule)}&page=${page}` : `?page=${page}`}`;
  return <AdminShell sidebar={<AdminSidebar active="/admin/quality" />} topbar={<a href="/admin/imports">Review imports</a>}>
    <main className={shellStyles.main}>
      <header className={shellStyles.page_head}><div><span>Control room · evidence</span><h1>Data quality</h1><p>Unresolved import errors block publication. Published facts needing attention stay in Review.</p></div></header>
      <p className={styles.summary}><strong>{report.blocking} blocking</strong> import errors · {report.groups.filter((group) => group.severity === "review").reduce((sum, group) => sum + group.count, 0)} review items</p>
      <nav className={styles.groups} aria-label="Quality issue groups">
        <a href="/admin/quality" aria-current={!report.rule ? "page" : undefined}>All issues <strong>{report.groups.reduce((sum, group) => sum + group.count, 0)}</strong></a>
        {report.groups.map((group) => <a key={group.key} href={`/admin/quality?rule=${encodeURIComponent(group.key)}`} aria-current={report.rule === group.key ? "page" : undefined} data-severity={group.severity}>
          <span>{group.title}</span><strong>{group.count}</strong><small>{group.severity === "blocking" ? "Blocking" : "Review"}</small>
        </a>)}
      </nav>
      <p className={styles.count}>{report.total ? `${(report.page - 1) * 50 + 1}–${Math.min(report.page * 50, report.total)} of ${report.total}` : "No issues"}</p>
      {report.rows.length ? <div className={styles.scroll}><table className={styles.table}><caption className="sr-only">Quality issues</caption><thead><tr><th scope="col">Severity</th><th scope="col">Issue</th><th scope="col">Evidence</th><th scope="col">Open</th></tr></thead><tbody>
        {report.rows.map((issue) => <tr key={issue.id}><td>{issue.severity}</td><th scope="row">{issue.title}</th><td>{issue.detail}</td><td><a href={issue.href}>Review record</a></td></tr>)}
      </tbody></table></div> : <p>No issues match this group.</p>}
      {report.pages > 1 ? <nav className={styles.pages} aria-label="Quality pages">
        {report.page > 1 ? <a href={pageHref(report.page - 1)}>Previous</a> : <span>Previous</span>}
        <span>Page {report.page} of {report.pages}</span>
        {report.page < report.pages ? <a href={pageHref(report.page + 1)}>Next</a> : <span>Next</span>}
      </nav> : null}
    </main>
  </AdminShell>;
}
