import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import shellStyles from "@/components/admin/AdminConsole.module.css";
import { getAnalyticsSnapshot } from "@/db/analytics-reporting";
import { getDb } from "@/db/client";
import { offerEditorial } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-request";
import { buildEditorialReport } from "@/lib/editorial-queue";
import { getPublicCatalogState } from "@/lib/public-catalog";
import { resolveOfferProvider } from "@/lib/provider-resolver";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Editorial · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 50;
type Search = { page?: string | string[]; q?: string | string[]; state?: string | string[] };
const first = (value: string | string[] | undefined) => typeof value === "string" ? value : value?.[0] ?? "";

function pageHref(q: string, state: string, page: number) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (state !== "all") params.set("state", state);
  params.set("page", String(page));
  return `/admin/editorial?${params}`;
}

export default async function AdminEditorialPage({ searchParams }: { searchParams: Promise<Search> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const search = await searchParams;
  const q = first(search.q).trim().slice(0, 100);
  const rawState = first(search.state);
  const state = ["all", "empty", "draft", "reviewed"].includes(rawState) ? rawState : "all";
  const rawPage = Number(first(search.page));
  const requestedPage = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const catalog = getPublicCatalogState();
  const clicks = new Map(getAnalyticsSnapshot(30).byOffer.map(row => [row.id, row.clicks]));
  const saved = new Map(getDb().select().from(offerEditorial).all().map(row => [row.offerId, row]));
  const report = buildEditorialReport(catalog.offers, clicks, Number.MAX_SAFE_INTEGER, new Set(saved.keys()));
  const rows = report.entries.filter(entry => {
    const record = saved.get(entry.offer.id);
    const rowState = record?.reviewStatus ?? "empty";
    const provider = resolveOfferProvider(entry.offer);
    return (state === "all" || state === rowState) && (!q || `${provider.name} ${entry.offer.productName}`.toLowerCase().includes(q.toLowerCase()));
  });
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pages);
  const shown = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const firstRow = rows.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  return <AdminShell sidebar={<AdminSidebar active="/admin/editorial" />} topbar={<Link className={shellStyles.preview_link} href="/">View site</Link>}>
    <main className={shellStyles.main}>
      <header className={shellStyles.page_head}><div><span>Control room · editorial</span><h1>Editorial queue</h1><p>Unwritten plans come first, one per provider, then by recommended rank. Every published sentence needs dated evidence.</p></div></header>
      <div className={styles.progress}>
        <div><strong>{report.written}</strong><span>of {report.total} published plans have a catch and fit</span></div>
        <div><strong>{report.providers}</strong><span>providers in this publication</span></div>
        <div><strong>{report.entries.length}</strong><span>plans in the review queue</span></div>
      </div>
      {catalog.status === "unavailable" ? <p role="status" className={styles.empty}>No publication is available, so there is nothing to review yet.</p> : <>
        <form className={styles.toolbar} method="get" action="/admin/editorial" role="search">
          <label>Search plan or provider<input type="search" name="q" maxLength={100} defaultValue={q} /></label>
          <label>State<select name="state" defaultValue={state}><option value="all">All states</option><option value="empty">Empty</option><option value="draft">Draft</option><option value="reviewed">Reviewed</option></select></label>
          <button className="btn btn--primary" type="submit">Apply</button>
        </form>
        <p className={styles.count} role="status">{rows.length ? `${firstRow}–${Math.min(page * PAGE_SIZE, rows.length)} of ${rows.length}` : "No entries match these filters"}</p>
        {shown.length ? <div className={styles.scroll}><table className={styles.table}>
          <caption className="sr-only">Editorial review queue</caption>
          <thead><tr><th scope="col">Plan and provider</th><th scope="col">State</th><th scope="col">Outbound clicks, 30 days</th><th scope="col">Priority rank</th></tr></thead>
          <tbody>{shown.map(entry => {
            const record = saved.get(entry.offer.id);
            const provider = resolveOfferProvider(entry.offer);
            return <tr key={entry.offer.id}>
              <td><Link href={`/admin/editorial/${encodeURIComponent(entry.offer.id)}`}>{entry.offer.productName}<small>{provider.name}{entry.coverage ? " · first plan for provider" : ""}</small></Link></td>
              <td>{record?.reviewStatus === "reviewed" ? "Reviewed" : record ? "Draft" : "Empty"}</td>
              <td>{entry.clicks}</td><td>#{entry.rank}</td>
            </tr>;
          })}</tbody>
        </table></div> : <div className={styles.empty}>No editorial entries found. Adjust the search or state filter.</div>}
        {pages > 1 ? <nav className={styles.pagination} aria-label="Editorial pages">
          {page > 1 ? <Link href={pageHref(q, state, page - 1)}>Previous</Link> : <span>Previous</span>}
          <span>Page {page} of {pages}</span>
          {page < pages ? <Link href={pageHref(q, state, page + 1)}>Next</Link> : <span>Next</span>}
        </nav> : null}
      </>}
    </main>
  </AdminShell>;
}
