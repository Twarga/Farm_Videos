import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import shellStyles from "@/components/admin/AdminConsole.module.css";
import { getAdminAffiliateProgram } from "@/db/admin-affiliates";
import { requireAdmin } from "@/lib/admin-request";
import { saveAffiliateProgram } from "../actions";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Affiliate record · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAffiliateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const { id } = await params;
  const record = getAdminAffiliateProgram(id);
  if (!record) notFound();
  const { program, provider } = record;
  return <AdminShell sidebar={<AdminSidebar active="/admin/affiliates" />} topbar={<Link className={shellStyles.preview_link} href="/admin/affiliates">All programs</Link>} sectionLabel="Affiliate program">
    <main className={shellStyles.main}>
      <header className={shellStyles.page_head}><div><span>Control room · affiliate program</span><h1>{provider} · {program.programName}</h1><p>Changes are revision checked and audited. Affiliate status never changes ranking.</p></div></header>
      <div className={styles.detailMeta}><span>Provider: {provider}</span><span>Program: {program.programSlug}</span><span>Last checked: <time dateTime={program.lastCheckedAt.toISOString()}>{program.lastCheckedAt.toISOString().slice(0, 10)}</time></span></div>
      <form action={saveAffiliateProgram} className={styles.form}>
        <input type="hidden" name="id" value={program.id} />
        <input type="hidden" name="expectedUpdatedAt" value={program.updatedAt.toISOString()} />
        <label>Availability<select name="availability" defaultValue={program.availability}><option value="none">None</option><option value="closed">Closed</option><option value="public">Public</option><option value="application">Application</option><option value="partner-only">Partner only</option></select></label>
        <label>Application status<select name="projectStatus" defaultValue={program.projectStatus}><option value="not-started">Not started</option><option value="researching">Researching</option><option value="applied">Applied</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="paused">Paused</option></select></label>
        <label>Network<input name="network" maxLength={100} defaultValue={program.network ?? ""} /></label>
        <label>Signup HTTPS URL<input type="url" name="signupUrl" defaultValue={program.signupUrl ?? ""} /></label>
        <label>Tracking HTTPS template<input type="url" name="trackingTemplate" defaultValue={program.trackingTemplate ?? ""} /></label>
        <label>Cookie duration in days<input type="number" name="cookieDays" min="0" max="9999" step="1" defaultValue={program.cookieDays ?? ""} /></label>
        <label className={styles.wide}>Commission description<textarea name="commissionDescription" maxLength={500} defaultValue={program.commissionDescription ?? ""} /></label>
        <label className={styles.wide}>Notes<textarea name="notes" maxLength={2000} defaultValue={program.notes ?? ""} /></label>
        <label>Source HTTPS URL<input type="url" name="sourceUrl" defaultValue={program.sourceUrl ?? ""} /></label>
        <label>Last checked<input type="date" name="lastCheckedAt" defaultValue={program.lastCheckedAt.toISOString().slice(0, 10)} /></label>
        <label className={styles.wide}>Source notes<textarea name="sourceNotes" maxLength={2000} defaultValue={program.sourceNotes ?? ""} /></label>
        <div className={styles.actions}><button className="btn btn--primary" type="submit">Save affiliate record</button><Link href="/admin/affiliates">Back to programs</Link></div>
      </form>
    </main>
  </AdminShell>;
}
