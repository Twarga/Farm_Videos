import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { and, desc, eq, isNull } from "drizzle-orm";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "@/components/admin/AdminConsole.module.css";
import { PriceTermsReview } from "@/components/admin/PriceTermsReview";
import { getStagedRows } from "@/db/staging";
import { suggestPriceTerms } from "@/db/price-terms";
import { normalizedImportRowSchema } from "@/db/row-normalization";
import { getDb } from "@/db/client";
import { previewImportJob } from "@/db/import-preview";
import { importJobs, publicationSnapshots, verificationIssues } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-request";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { reviewPriceTerms, publishReviewedImport, resolveImportIssue, rollbackImportSnapshot, startCsvReview } from "./actions";
import pageStyles from "./AdminImports.module.css";

export const metadata: Metadata = { title: "Imports · Control room" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

const TERMS_PAGE_SIZE = 10;
type SearchParams = { job?: string; status?: string; action?: string; requestId?: string; terms?: string };
type ImportFeedbackStatus = "success" | "validation_error" | "authorization_error" | "conflict" | "server_error";

function importFeedback(status: string | undefined, action: string | undefined, requestId: string | undefined): { status: ImportFeedbackStatus; title: string; message: string } | null {
  if (!status || !["success", "validation_error", "authorization_error", "conflict", "server_error"].includes(status)) return null;
  const normalized = status as ImportFeedbackStatus;
  const success = action === "review" ? "Review started. Inspect the preview before publishing."
    : action === "publish" ? "Reviewed rows were published and public caches were refreshed."
      : action === "resolve" ? "The issue resolution was saved."
        : action === "rollback" ? "The selected snapshot was restored."
          : "The action completed.";
  const message = normalized === "success" ? success
    : action === "confirm-publish" ? "Type publish to confirm the reviewed impact and source checksum."
      : action === "blocking-issues" ? "Resolve every blocking issue before publishing."
        : action === "confirm-rollback" ? "Confirm the exact snapshot before rolling back."
          : action === "already-published" ? "This import was already published. Refresh before choosing another action."
            : action === "issue-stale" ? "This issue was already resolved or removed. Refresh the review."
              : action === "snapshot-stale" ? "This snapshot was already rolled back or no longer exists. Refresh the list."
                : normalized === "authorization_error" ? "Your admin session expired. Sign in again before continuing."
                  : normalized === "conflict" ? "The underlying record changed. Refresh before retrying."
                    : normalized === "server_error" ? `The server could not complete this action.${requestId ? " Use the request ID when checking logs." : ""}`
                      : "Check the submitted values and try again.";
  const title = normalized === "success" ? "Action complete"
    : normalized === "conflict" ? "Refresh required"
      : normalized === "authorization_error" ? "Sign in required"
        : normalized === "server_error" ? "Action failed"
          : "Check this action";
  return { status: normalized, title, message };
}

export default async function AdminImportsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const params = await searchParams;
  const jobId = params.job;
  const db = getDb();
  const job = jobId ? db.select().from(importJobs).where(eq(importJobs.id, jobId)).get() : null;
  const preview = job ? previewImportJob(job.id) : null;
  const issues = job ? db.select().from(verificationIssues).where(and(eq(verificationIssues.importJobId, job.id), isNull(verificationIssues.resolvedAt))).limit(20).all() : [];
  const termRows = job ? getStagedRows(job.id).flatMap((row) => {
    const parsed = normalizedImportRowSchema.safeParse(row.normalizedPayload ? JSON.parse(row.normalizedPayload) : null);
    return parsed.success ? [{ row, normalized: parsed.data }] : [];
  }) : [];
  // Price-term review is one form per row: page it so a full import never renders hundreds of forms.
  const reviewable = termRows.filter(({ row }) => row.status !== "blocked" && row.status !== "rejected");
  const termPages = Math.max(1, Math.ceil(reviewable.length / TERMS_PAGE_SIZE));
  const requestedTermPage = Number.parseInt(params.terms ?? "1", 10);
  const termPage = Math.min(Math.max(Number.isSafeInteger(requestedTermPage) ? requestedTermPage : 1, 1), termPages);
  const visibleTermRows = reviewable.slice((termPage - 1) * TERMS_PAGE_SIZE, termPage * TERMS_PAGE_SIZE);
  const termsHref = (target: number) => `/admin/imports?job=${encodeURIComponent(job?.id ?? "")}&terms=${target}`;
  const snapshots = db.select().from(publicationSnapshots).orderBy(desc(publicationSnapshots.snapshotVersion)).limit(10).all();
  const feedback = importFeedback(params.status, params.action, params.requestId);

  return (
    <AdminShell
      sidebar={<AdminSidebar active="/admin/imports" />}
      topbar={<div className={styles.top_actions}><a href="/" target="_blank" rel="noreferrer" className={`ui-button ui-button--quiet ${styles.preview_link}`}>View site <ArrowSquareOut size={15} aria-hidden /></a></div>}
    >
      <main className={styles.main}>
        <div className={styles.page_head}>
          <div>
            <span>Control room · data workflow</span>
            <h1>Import review</h1>
            <p>Stage the immutable CSV, inspect its impact, resolve evidence issues, then publish or roll back.</p>
          </div>
          <form action={startCsvReview} className={pageStyles.start}><AdminSubmitButton idle="Start CSV review" pending="Starting review…" className="ui-button ui-button--primary control-touch" /></form>
        </div>
        {feedback ? <div className={`${pageStyles.feedback} ${pageStyles[`feedback_${feedback.status}`]}`} role={feedback.status === "success" ? "status" : "alert"} aria-live={feedback.status === "success" ? "polite" : "assertive"}><strong>{feedback.title}</strong><span>{feedback.message}</span>{params.requestId ? <code>Request {params.requestId}</code> : null}</div> : null}
        {preview ? <>
          <section className={pageStyles.panel}>
            <h2>Preview · {job?.status}</h2>
            <div className={pageStyles.metric_grid}>{[["Created", preview.created], ["Updated", preview.updated], ["Unchanged", preview.unchanged], ["Hidden", preview.hidden], ["Rejected", preview.rejected]].map(([label, value]) => <div className={pageStyles.metric} key={String(label)}><strong>{value}</strong><span>{label}</span></div>)}</div>
            <p className={pageStyles.source}>Source checksum · <code>{job?.sourceChecksum}</code></p>
            {job?.status !== "published" ? <form action={publishReviewedImport} className={pageStyles.publish}>
              <input type="hidden" name="jobId" value={job?.id} />
              {issues.some((issue) => issue.severity === "error") ? <p className={pageStyles.blocked}>Resolve {issues.filter((issue) => issue.severity === "error").length} blocking issue(s) before publishing.</p> : <>
                <label className={pageStyles.confirm}>Type <code>publish</code> to confirm<input type="text" name="confirm" autoComplete="off" pattern="publish" required /></label>
                <AdminSubmitButton idle="Approve and publish public rows" pending="Publishing…" className="ui-button ui-button--primary control-touch" />
              </>}
            </form> : <p className={pageStyles.published}>Published at {job?.publishedAt?.toISOString()}</p>}
          </section>
          <section className={pageStyles.panel}>
            <h2>Price terms · individual review</h2>
            <p>Approving public rows does not approve price terms. Verify each suggestion and its evidence separately.</p>
            {visibleTermRows.map(({ row, normalized }) => <PriceTermsReview key={row.id} rowId={row.id} jobId={job!.id} plan={`${normalized.providerName} ${normalized.planName}`} currency={normalized.currency} suggestion={suggestPriceTerms(normalized.billingNotes ?? "")} reviewed={normalized.reviewedPriceTerms ?? null} disabled={job?.status === "published" || row.status === "blocked" || row.status === "rejected"} action={reviewPriceTerms} />)}
            {termPages > 1 ? <nav aria-label="Price term pages" className={pageStyles.source}>
              {termPage > 1 ? <a href={termsHref(termPage - 1)} rel="prev">Previous</a> : null} Page {termPage} of {termPages} · {reviewable.length} reviewable rows {termPage < termPages ? <a href={termsHref(termPage + 1)} rel="next">Next</a> : null}
            </nav> : null}
          </section>
          <section className={pageStyles.panel}>
            <h2>Unresolved issues ({issues.length})</h2>
            {issues.length === 0 ? <p className={pageStyles.empty}>No unresolved issues.</p> : issues.map((issue) => <form action={resolveImportIssue} key={issue.id} className={pageStyles.issue_row}>
              <input type="hidden" name="issueId" value={issue.id} /><input type="hidden" name="jobId" value={job?.id} />
              <span className={pageStyles.issue_label}><strong>{issue.code}</strong><small>{issue.message}</small></span>
              <label htmlFor={`resolution-note-${issue.id}`}><span className="sr-only">Resolution note for {issue.code}</span><input id={`resolution-note-${issue.id}`} name="note" placeholder="Resolution note" required /></label>
              <AdminSubmitButton idle="Resolve" pending="Resolving…" className="ui-button ui-button--secondary control-touch" />
            </form>)}
          </section>
        </> : null}
        <section className={pageStyles.panel}>
          <h2>Snapshots</h2>
          {snapshots.length === 0 ? <p className={pageStyles.empty}>No publication snapshots yet.</p> : <>
            <ul className={pageStyles.snapshots}>{snapshots.map((snapshot) => <li key={snapshot.id} className={pageStyles.snapshot_row}><span>#{snapshot.snapshotVersion} · {snapshot.label} · {snapshot.status}</span></li>)}</ul>
            <form action={rollbackImportSnapshot} className={pageStyles.rollback_form}>
              <label htmlFor="rollback-snapshot"><span className="sr-only">Snapshot to roll back to</span>
                <select id="rollback-snapshot" name="snapshotId" required defaultValue="">
                  <option value="" disabled>Choose a snapshot</option>
                  {snapshots.filter((snapshot) => snapshot.status !== "rolled-back").map((snapshot) => <option key={snapshot.id} value={snapshot.id}>Snapshot {snapshot.snapshotVersion}: {snapshot.label}</option>)}
                </select>
              </label>
              <label className={pageStyles.rollback_confirm}>Type <code>rollback</code><input type="text" name="confirm" autoComplete="off" pattern="rollback" required /></label>
              <AdminSubmitButton idle="Rollback" pending="Rolling back…" className="ui-button ui-button--secondary control-touch" />
            </form>
          </>}
        </section>
      </main>
    </AdminShell>
  );
}
