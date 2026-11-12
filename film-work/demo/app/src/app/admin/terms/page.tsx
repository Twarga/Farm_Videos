import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "@/components/admin/AdminConsole.module.css";
import { requireAdmin } from "@/lib/admin-request";
import { listTermsBacklog, type TermsBacklogRow } from "@/lib/terms-queue";
import correctionQueue from "./correction-queue.json";
import pageStyles from "./page.module.css";

export const metadata: Metadata = { title: "Price terms · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

type QueueState = "all" | "open" | "quarantined" | "reviewed" | "owner-gated";
type QueueReason = "all" | "long-term" | "intro" | "setup" | "unsupported-renewal";
const PAGE_SIZE = 50;
const ownerGatedIds = new Set(correctionQueue.rows.map((row) => row.offerId));

function termsReason(row: TermsBacklogRow): QueueReason {
  if (row.state === "quarantined") return "unsupported-renewal";
  if (row.state === "reviewed" && row.price.setupFee == null) return "setup";
  if (row.price.introMonthly != null || row.price.introMonths != null) return "intro";
  return "long-term";
}

function queueUrl(state: QueueState, reason: QueueReason, page: number) {
  const params = new URLSearchParams();
  if (state !== "all") params.set("state", state);
  if (reason !== "all") params.set("reason", reason);
  if (page > 1) params.set("page", String(page));
  return `/admin/terms${params.size ? `?${params}` : ""}`;
}

export default async function AdminTermsPage({ searchParams }: { searchParams: Promise<{ state?: string; reason?: string; page?: string }> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const params = await searchParams;
  const state: QueueState = (["all", "open", "quarantined", "reviewed", "owner-gated"] as string[]).includes(params.state ?? "") ? params.state as QueueState : "all";
  const reason: QueueReason = (["all", "long-term", "intro", "setup", "unsupported-renewal"] as string[]).includes(params.reason ?? "") ? params.reason as QueueReason : "all";
  const allRows = listTermsBacklog();
  const filtered = allRows.filter((row) => (state === "all" || state === "owner-gated" && ownerGatedIds.has(row.offer.id) || row.state === state) && (reason === "all" || termsReason(row) === reason));
  filtered.sort((a, b) => a.price.sourceCheckedAt.getTime() - b.price.sourceCheckedAt.getTime() || a.provider.name.localeCompare(b.provider.name) || a.offer.planName.localeCompare(b.offer.planName));
  const requested = Number(params.page);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Number.isSafeInteger(requested) && requested > 0 ? Math.min(requested, pages) : 1;
  const start = (page - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);
  const counts = { open: allRows.filter((row) => row.state === "open").length, quarantined: allRows.filter((row) => row.state === "quarantined").length, reviewed: allRows.filter((row) => row.state === "reviewed").length };
  const filteredQuery = queueUrl(state, reason, 1).split("?")[1] ?? "";

  return <AdminShell sidebar={<AdminSidebar active="/admin/terms" />} topbar={<a className={styles.preview_link} href="/catalog" target="_blank" rel="noreferrer">View catalog</a>}>
    <main className={styles.main}>
      <header className={styles.page_head}><div><span>Control room · billing evidence</span><h1>Price terms queue</h1><p>Review one plan at a time. Missing values remain unknown until supported by provider evidence.</p></div></header>
      <div className={pageStyles.summary} aria-label="Queue counts"><span><strong>{counts.open}</strong> open</span><span><strong>{counts.quarantined}</strong> quarantined</span><span><strong>{counts.reviewed}</strong> reviewed</span><span><strong>{ownerGatedIds.size}</strong> owner-gated proposals</span></div>
      <nav className={pageStyles.filters} aria-label="Price terms state">{(["all", "open", "quarantined", "reviewed", "owner-gated"] as const).map((item) => <a key={item} href={queueUrl(item, reason, 1)} aria-current={state === item ? "page" : undefined}>{item === "owner-gated" ? "Owner-gated" : item[0].toUpperCase() + item.slice(1)}</a>)}</nav>
      <nav className={pageStyles.filters} aria-label="Price terms reason">{(["all", "long-term", "intro", "setup", "unsupported-renewal"] as const).map((item) => <a key={item} href={queueUrl(state, item, 1)} aria-current={reason === item ? "page" : undefined}>{item === "all" ? "Every reason" : item === "long-term" ? "Long term" : item === "unsupported-renewal" ? "Unsupported renewal" : item === "setup" ? "Missing setup fee" : "Intro price"}</a>)}</nav>
      <p className={pageStyles.count}>{filtered.length ? `${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}` : "0 plans"} · oldest check first</p>
      {filtered.length ? <div className={pageStyles.tableScroll}><table className={pageStyles.table}><caption>Published plans requiring billing review</caption><thead><tr><th scope="col">Plan</th><th scope="col">Reason</th><th scope="col">Checked</th><th scope="col">State</th><th scope="col">Review</th></tr></thead><tbody>
        {rows.map((row) => <tr key={row.offer.id} data-term-row={row.offer.id}><th scope="row">{row.provider.name} · {row.offer.planName}</th><td>{termsReason(row).replaceAll("-", " ")}{ownerGatedIds.has(row.offer.id) ? " · owner-gated" : ""}</td><td><time dateTime={row.price.sourceCheckedAt.toISOString()}>{row.price.sourceCheckedAt.toISOString().slice(0, 10)}</time></td><td>{row.state}</td><td><a href={`/admin/terms/${encodeURIComponent(row.offer.id)}${filteredQuery ? `?${filteredQuery}` : ""}`}>Review terms<span className="sr-only"> for {row.provider.name} {row.offer.planName}</span></a></td></tr>)}
      </tbody></table></div> : <p className={pageStyles.empty}>No plans match these filters.</p>}
      {pages > 1 && <nav className={pageStyles.pagination} aria-label="Price terms pages"><a aria-disabled={page === 1} href={queueUrl(state, reason, Math.max(1, page - 1))}>Previous</a><span>Page {page} of {pages}</span><a aria-disabled={page === pages} href={queueUrl(state, reason, Math.min(pages, page + 1))}>Next</a></nav>}
      {state === "owner-gated" && <p className={pageStyles.note}>The owner-gated list contains read-only proposals. This queue does not approve or apply them.</p>}
    </main>
  </AdminShell>;
}
