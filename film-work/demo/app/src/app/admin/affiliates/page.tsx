import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import shellStyles from "@/components/admin/AdminConsole.module.css";
import { listAdminAffiliateProgramsPage, type AffiliateListQuery } from "@/db/admin-affiliates";
import { affiliateProjectStatusValues } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-request";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Affiliates · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Search = { q?: string | string[]; status?: string | string[]; sort?: string | string[]; page?: string | string[] };
const first = (value: string | string[] | undefined) => typeof value === "string" ? value : value?.[0] ?? "";
const statuses = new Set<string>(affiliateProjectStatusValues);

function pageHref(query: AffiliateListQuery, page: number) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.sort === "checked") params.set("sort", "checked");
  params.set("page", String(page));
  return `/admin/affiliates?${params}`;
}

export default async function AdminAffiliatesPage({ searchParams }: { searchParams: Promise<Search> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const search = await searchParams;
  const rawPage = Number(first(search.page));
  const rawStatus = first(search.status);
  const query: AffiliateListQuery = {
    q: first(search.q).trim().slice(0, 100),
    status: statuses.has(rawStatus) ? rawStatus as AffiliateListQuery["status"] : "all",
    sort: first(search.sort) === "checked" ? "checked" : "provider",
    page: Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1,
  };
  const { rows, total, page, pages, pageSize } = listAdminAffiliateProgramsPage(query);
  const firstRow = total ? (page - 1) * pageSize + 1 : 0;
  const lastRow = Math.min(total, page * pageSize);
  return <AdminShell sidebar={<AdminSidebar active="/admin/affiliates" />} topbar={<Link className={shellStyles.preview_link} href="/admin/analytics">Affiliate reporting</Link>}>
    <main className={shellStyles.main}>
      <header className={shellStyles.page_head}>
        <div><span>Control room · partner records</span><h1>Affiliate programs</h1><p>Affiliate status never changes ranking. Public links require dated source evidence.</p></div>
      </header>
      <form className={styles.toolbar} method="get" action="/admin/affiliates" role="search">
        <label>Search provider or program<input name="q" type="search" maxLength={100} defaultValue={query.q} /></label>
        <label>Application status<select name="status" defaultValue={query.status}><option value="all">All statuses</option>{affiliateProjectStatusValues.map(status => <option key={status} value={status}>{status}</option>)}</select></label>
        <label>Sort<select name="sort" defaultValue={query.sort}><option value="provider">Provider A–Z</option><option value="checked">Recently checked</option></select></label>
        <button type="submit" className="btn btn--primary">Apply</button>
      </form>
      <p className={styles.count} role="status">{total ? `${firstRow}–${lastRow} of ${total}` : "No programs match these filters"}</p>
      {rows.length ? <div className={styles.scroll}><table className={styles.table}>
        <caption className="sr-only">Affiliate program records</caption>
        <thead><tr><th scope="col">Provider and program</th><th scope="col">Network</th><th scope="col">Availability</th><th scope="col">Application</th><th scope="col">Link template</th><th scope="col">Last checked</th></tr></thead>
        <tbody>{rows.map(({ program, provider }) => <tr key={program.id}>
          <td><Link className={styles.recordLink} href={`/admin/affiliates/${encodeURIComponent(program.id)}`}>{provider}<small>{program.programName}</small></Link></td>
          <td>{program.network || "Not published"}</td>
          <td>{program.availability}</td><td>{program.projectStatus}</td>
          <td>{program.trackingTemplate ? "Present" : "Not published"}</td>
          <td><time dateTime={program.lastCheckedAt.toISOString()}>{program.lastCheckedAt.toISOString().slice(0, 10)}</time></td>
        </tr>)}</tbody>
      </table></div> : <div className={styles.empty}><h2>No programs found</h2><p>Adjust the search or status filter.</p></div>}
      {pages > 1 ? <nav className={styles.pagination} aria-label="Affiliate pages">
        {page > 1 ? <Link href={pageHref(query, page - 1)}>Previous</Link> : <span>Previous</span>}
        <span>Page {page} of {pages}</span>
        {page < pages ? <Link href={pageHref(query, page + 1)}>Next</Link> : <span>Next</span>}
      </nav> : null}
    </main>
  </AdminShell>;
}
