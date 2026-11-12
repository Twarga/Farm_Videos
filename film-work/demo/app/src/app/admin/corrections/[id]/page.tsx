import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "@/components/admin/AdminConsole.module.css";
import { getDb } from "@/db/client";
import { getAdminCorrectionDetail } from "@/db/admin-corrections";
import { offers, stagedImportRows } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-request";
import { acceptCorrection, rejectCorrection } from "../actions";
import pageStyles from "../page.module.css";

export const metadata: Metadata = { title: "Review correction · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCorrectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const { id } = await params;
  const row = getAdminCorrectionDetail(id);
  if (!row) notFound();
  const db = getDb();
  const offer = row.offerId ? db.select({ providerId: offers.providerId, slug: offers.slug }).from(offers).where(eq(offers.id, row.offerId)).get() : null;
  const approvedRows = offer && row.status === "open" ? db.select({ id: stagedImportRows.id, importJobId: stagedImportRows.importJobId, rowNumber: stagedImportRows.rowNumber })
    .from(stagedImportRows)
    .where(and(eq(stagedImportRows.status, "approved"), eq(stagedImportRows.providerSlug, offer.providerId), eq(stagedImportRows.offerSlug, offer.slug)))
    .limit(100).all() : [];

  return <AdminShell sidebar={<AdminSidebar active="/admin/corrections" />} sectionLabel="Price corrections" topbar={<Link className={styles.preview_link} href="/admin/corrections">Back to queue</Link>}>
    <main className={styles.main}>
      <header className={styles.page_head}><div><span>Control room · public feedback</span><h1>{row.entityId} · {row.field}</h1><p>Compare the claim with the cited source before recording a decision.</p></div></header>
      <section className={pageStyles.detail} aria-label="Correction evidence">
        <h2>Evidence</h2>
        <dl><div><dt>Status</dt><dd>{row.status}</dd></div><div><dt>Claim</dt><dd>{row.claimedValue}</dd></div><div><dt>Received</dt><dd><time dateTime={row.createdAt.toISOString()}>{row.createdAt.toISOString().slice(0, 10)}</time></dd></div><div><dt>Submitter</dt><dd>{row.email ?? "Not provided"}</dd></div></dl>
        <p><a href={row.sourceUrl} target="_blank" rel="noreferrer">Open cited source</a>{row.offerId ? <> · <a href={`/offers/${encodeURIComponent(row.offerId)}`} target="_blank" rel="noreferrer">Public plan</a></> : null}</p>
        {row.status === "open" ? <form action={rejectCorrection} className={pageStyles.reject}>
          <input type="hidden" name="id" value={row.id} />
          <label htmlFor="correction-note">Resolution note</label>
          <textarea id="correction-note" name="note" minLength={10} maxLength={1000} required placeholder="Describe the evidence and the decision." />
          <label htmlFor="staged-row">Approved staged row for acceptance</label>
          <select id="staged-row" name="stagedRowId" defaultValue="">
            <option value="">Select a matching approved row</option>
            {approvedRows.map((staged) => <option key={staged.id} value={staged.id}>{staged.importJobId} · row {staged.rowNumber}</option>)}
          </select>
          <p>Acceptance requires an approved staged import row for this plan. Rejecting only requires a note.</p>
          <div className={pageStyles.actions}><button type="submit" formAction={acceptCorrection} disabled={approvedRows.length === 0}>Accept correction</button><button type="submit" formAction={rejectCorrection}>Reject correction</button></div>
        </form> : <section aria-label="Resolution"><h2>Resolution</h2><p>{row.resolutionNote ?? "No resolution note recorded."}</p>{row.stagedRowId ? <p>Approved staged row: {row.stagedRowId}</p> : null}</section>}
      </section>
    </main>
  </AdminShell>;
}
