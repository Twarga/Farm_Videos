import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "@/components/admin/AdminConsole.module.css";
import { CORRECTION_STATUSES, isCorrectionStatus, listAdminCorrections } from "@/db/admin-corrections";
import { requireAdmin } from "@/lib/admin-request";
import pageStyles from "./page.module.css";

export const metadata: Metadata = { title: "Corrections · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Search = { status?: string; page?: string };

export default async function AdminCorrectionsPage({ searchParams }: { searchParams: Promise<Search> }) {
  noStore();
  try {
    await requireAdmin();
  } catch {
    redirect("/admin?error=expired");
  }
  const params = await searchParams;
  const status = isCorrectionStatus(params.status) ? params.status : "open";
  const { rows, counts, page, pages } = listAdminCorrections(status, Number(params.page));

  return <AdminShell sidebar={<AdminSidebar active="/admin/corrections" />} topbar={<a className={styles.preview_link} href="/admin/imports">Import review</a>}>
    <main className={styles.main}>
      <header className={styles.page_head}>
        <div>
          <span>Control room · public feedback</span>
          <h1>Price corrections</h1>
          <p>Check each claim against the cited source. Verified price changes must enter the staged import and review flow before publication.</p>
        </div>
      </header>
      <nav className={pageStyles.tabs} aria-label="Correction status">
        {CORRECTION_STATUSES.map((value) => <a key={value} href={`/admin/corrections?status=${value}`} aria-current={status === value ? "page" : undefined}>
          {value} <strong>{counts[value]}</strong>
        </a>)}
      </nav>
      <p className={pageStyles.count}>{counts[status] ? `${(page - 1) * 50 + 1}–${Math.min(page * 50, counts[status])} of ${counts[status]}` : `No ${status} corrections`}</p>
      {rows.length ? <div className={pageStyles.tableScroll}><table className={pageStyles.table}><caption className="sr-only">{status} corrections</caption><thead><tr><th scope="col">Plan and field</th><th scope="col">Claim</th><th scope="col">Source</th><th scope="col">Received</th><th scope="col">Review</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}>
        <th scope="row">{row.entityId} · {row.field}</th><td>{row.claimedValue}</td><td>{new URL(row.sourceUrl).hostname}</td><td><time dateTime={row.createdAt.toISOString()}>{row.createdAt.toISOString().slice(0, 10)}</time></td><td><a href={`/admin/corrections/${encodeURIComponent(row.id)}`}>Review correction</a></td>
      </tr>)}</tbody></table></div> : <p className={pageStyles.empty}>No {status} corrections.</p>}
      {pages > 1 ? <nav className={pageStyles.pagination} aria-label="Correction pages">{page > 1 ? <a href={`/admin/corrections?status=${status}&page=${page - 1}`}>Previous</a> : <span>Previous</span>}<span>Page {page} of {pages}</span>{page < pages ? <a href={`/admin/corrections?status=${status}&page=${page + 1}`}>Next</a> : <span>Next</span>}</nav> : null}
    </main>
  </AdminShell>;
}
