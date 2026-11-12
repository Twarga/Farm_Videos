import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { listAdminOfferPage } from "@/db/admin-offers";
import { offerPublicationStatusValues } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-request";
import styles from "../providers/page.module.css";

export const metadata: Metadata = { title: "Offers · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;
type Search = { q?: string; provider?: string; status?: string; terms?: string; stale?: string; sort?: string; page?: string };

export default async function AdminOffersPage({ searchParams }: { searchParams: Promise<Search> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const params = await searchParams;
  const data = listAdminOfferPage({ q: params.q, provider: params.provider, status: params.status, terms: params.terms, stale: params.stale === "true", sort: params.sort, page: Number(params.page) });
  const pageHref = (page: number) => { const query = new URLSearchParams(); for (const key of ["q", "provider", "status", "terms", "stale", "sort"] as const) if (params[key]) query.set(key, params[key]!); query.set("page", String(page)); return `/admin/offers?${query}`; };
  return <AdminShell sidebar={<AdminSidebar active="/admin/offers" />} topbar={<Link href="/">View site</Link>}>
    <main className={styles.main}>
      <header className={styles.heading}><span>Control room · catalog</span><h1>Offers</h1><p>Published and draft plan records. Price evidence is reviewed separately.</p></header>
      <form className={styles.toolbar} method="get" action="/admin/offers" role="search">
        <label>Plan or provider<input name="q" type="search" defaultValue={data.search} maxLength={100} /></label>
        <label>Provider ID<input name="provider" defaultValue={data.provider} maxLength={120} /></label>
        <label>Status<select name="status" defaultValue={data.status ?? ""}><option value="">All statuses</option>{offerPublicationStatusValues.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        <label>Terms<select name="terms" defaultValue={data.terms}><option value="">Any review state</option><option value="reviewed">Reviewed</option><option value="open">Open</option></select></label>
        <label>Sort<select name="sort" defaultValue={data.sort}><option value="provider">Provider A–Z</option><option value="price">Price low first</option><option value="checked">Recently checked</option></select></label>
        <label><input type="checkbox" name="stale" value="true" defaultChecked={data.stale} /> Older than 45 days</label>
        <button type="submit">Apply</button>
      </form>
      <p className={styles.count}>{data.total ? `${(data.page - 1) * 50 + 1}–${Math.min(data.page * 50, data.total)} of ${data.total}` : "No plans match"}</p>
      {data.rows.length ? <div className={styles.tableScroll}><table className={styles.table}><caption className="sr-only">Offer records</caption><thead><tr><th scope="col">Plan</th><th scope="col">Specs</th><th scope="col">Price</th><th scope="col">Terms</th><th scope="col">Checked</th><th scope="col">Status</th><th scope="col">Link</th></tr></thead><tbody>
        {data.rows.map((row) => <tr key={row.id}><th scope="row"><Link className={styles.providerLink} href={`/admin/offers/${encodeURIComponent(row.id)}`}>{row.providerName} · {row.planName}</Link><small>{row.id}</small></th><td>{row.vcpus ?? "?"} vCPU · {row.ramGb ?? "?"} GB · {row.diskGb ?? "?"} GB</td><td>{row.originalAmount != null ? `${row.currency ?? "USD"} ${row.originalAmount.toFixed(2)}` : "Not published"}<small>{row.price != null ? `USD ${row.price.toFixed(2)}/mo` : "No effective price"}</small></td><td>{row.termsReviewedAt ? "Reviewed" : "Open"}</td><td>{row.sourceCheckedAt?.toISOString().slice(0, 10) ?? "Not checked"}</td><td>{row.publicationStatus}</td><td>{row.affiliate ? "Ad" : "Direct"}</td></tr>)}
      </tbody></table></div> : <p className={styles.empty}>Adjust the filters to find a plan.</p>}
      {data.pages > 1 ? <nav className={styles.pagination} aria-label="Offer pages"><span>Page {data.page} of {data.pages}</span>{data.page > 1 ? <Link href={pageHref(data.page - 1)}>Previous</Link> : null}{data.page < data.pages ? <Link href={pageHref(data.page + 1)}>Next</Link> : null}</nav> : null}
    </main>
  </AdminShell>;
}
