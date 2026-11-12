import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProviderMark } from "@/components/shore/ProviderMark";
import { shoreLogoSrc } from "@/lib/assets";
import { listAdminProviderPage } from "@/db/admin-providers";
import { requireAdmin } from "@/lib/admin-request";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Providers · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Query = { page?: string | string[]; q?: string | string[]; status?: string | string[] };
const single = (value: string | string[] | undefined) => typeof value === "string" ? value : "";

function pageUrl(input: { page: number; q: string; status: string | null }) {
  const params = new URLSearchParams();
  if (input.q) params.set("q", input.q);
  if (input.status) params.set("status", input.status);
  if (input.page > 1) params.set("page", String(input.page));
  const suffix = params.toString();
  return `/admin/providers${suffix ? `?${suffix}` : ""}`;
}

export default async function AdminProvidersPage({ searchParams }: { searchParams: Promise<Query> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const search = await searchParams;
  const q = single(search.q).trim().slice(0, 100);
  const status = single(search.status);
  const page = Number(single(search.page));
  const result = listAdminProviderPage({ q, status, page });
  const start = result.total ? (result.page - 1) * 50 + 1 : 0;
  const end = Math.min(result.page * 50, result.total);

  return <AdminShell sidebar={<AdminSidebar active="/admin/providers" />} topbar={<Link href="/">View site</Link>}>
    <main className={styles.main}>
      <header className={styles.heading}>
        <div><span>Control room · catalog</span><h1>Providers</h1><p>Provider identities and dated rating evidence from the database.</p></div>
        <Link className={styles.saveButton} href="/admin/providers/new">Add provider</Link>
      </header>
      <form method="get" action="/admin/providers" className={styles.toolbar}>
        <label>Find a provider<input type="search" name="q" defaultValue={q} maxLength={100} placeholder="Name or slug" /></label>
        <label>Status<select name="status" defaultValue={result.status ?? ""}>
          <option value="">All statuses</option>
          <option value="active">Active</option><option value="draft">Draft</option><option value="paused">Paused</option><option value="archived">Archived</option>
        </select></label>
        <button type="submit">Apply</button>
      </form>
      <p className={styles.count}>{result.total} {result.total === 1 ? "provider" : "providers"} · {start}–{end} shown</p>
      {result.rows.length ? <div className={styles.tableScroll}>
        <table className={styles.table}>
          <caption className="sr-only">Provider records sorted A to Z</caption>
          <thead><tr><th scope="col">Provider</th><th scope="col">Slug</th><th scope="col">Status</th><th scope="col">HQ</th><th scope="col">Published plans</th><th scope="col">Trustpilot evidence</th><th scope="col">Affiliate programs</th></tr></thead>
          <tbody>{result.rows.map((record) => <tr key={record.id}>
            <td><Link className={styles.providerLink} href={`/admin/providers/${encodeURIComponent(record.id)}`}><ProviderMark offer={{ pid: record.id, p: record.name, logoSrc: shoreLogoSrc(record.id, record.logoPath) }} /><span>{record.name}</span></Link></td>
            <td className={styles.mono}>{record.slug}</td>
            <td><span className={styles.pill} data-status={record.status}>{record.status}</span></td>
            <td>{record.hqCountry ?? "Not published"}</td>
            <td>{record.publishedPlans}</td>
            <td>{record.trustpilotScore == null || record.trustpilotCheckedAt == null ? "Not published" : <>{record.trustpilotScore.toFixed(1)} · {record.trustpilotReviews?.toLocaleString() ?? "count unknown"}<small>Checked {record.trustpilotCheckedAt.toISOString().slice(0, 10)}</small></>}</td>
            <td>{record.affiliatePrograms || "None"}</td>
          </tr>)}</tbody>
        </table>
      </div> : <p className={styles.empty}>No providers match these filters.</p>}
      <nav className={styles.pagination} aria-label="Provider pages"><span>{start}–{end} of {result.total}</span>
        {result.page > 1 ? <Link href={pageUrl({ page: result.page - 1, q, status: result.status })}>Previous</Link> : null}
        {result.page < result.pages ? <Link href={pageUrl({ page: result.page + 1, q, status: result.status })}>Next</Link> : null}
      </nav>
    </main>
  </AdminShell>;
}
