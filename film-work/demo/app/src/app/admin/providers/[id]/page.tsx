import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAdminProviderDetail } from "@/db/admin-providers";
import { requireAdmin } from "@/lib/admin-request";
import { saveProviderProfile } from "../actions";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Provider record · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProviderDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ created?: string }> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const { id } = await params;
  const created = (await searchParams)?.created;
  const detail = getAdminProviderDetail(id);
  if (!detail) redirect("/admin/providers");
  const { provider, offers, affiliatePrograms } = detail;
  const planCounts = new Map<string, number>();
  for (const offer of offers) planCounts.set(offer.publicationStatus, (planCounts.get(offer.publicationStatus) ?? 0) + 1);
  const published = planCounts.get("published") ?? 0;
  const ratingReady = provider.trustpilotScore != null && provider.trustpilotCheckedAt != null;
  return <AdminShell sidebar={<AdminSidebar active="/admin/providers" />} topbar={<Link href="/admin/providers">All providers</Link>} sectionLabel={provider.name}>
    <main className={styles.main}>
      <header className={styles.heading}>
        <div><span>Control room · provider record</span><h1>{provider.name}</h1><p>Identity, publication status, and dated rating evidence.</p></div>
      </header>
      {created ? <p role="status">Draft provider created. Add a dated Trustpilot rating, import plans, then set the status to active.</p> : null}
      <section className={styles.panel} aria-labelledby="provider-manage-title">
        <h2 id="provider-manage-title">Manage</h2>
        <ul className={styles.sideList}>
          <li>Status: <strong>{provider.status}</strong> · {published} published {published === 1 ? "plan" : "plans"}{[...planCounts].filter(([status]) => status !== "published").map(([status, count]) => `, ${count} ${status}`).join("")}</li>
          <li>Public visibility: {provider.status === "active" && published > 0 && ratingReady ? "visible" : `hidden until ${[provider.status !== "active" ? "status is active" : null, published === 0 ? "a plan is published" : null, ratingReady ? null : "a dated Trustpilot rating is recorded"].filter(Boolean).join(", ")}`}</li>
          <li><Link href="/admin/imports">Import plans</Link>{provider.status === "active" ? <> · <Link href={`/providers/${encodeURIComponent(provider.slug)}`}>Public page</Link></> : null}</li>
        </ul>
      </section>
      <div className={styles.detailGrid}>
        <section className={styles.panel} aria-labelledby="provider-edit-title">
          <h2 id="provider-edit-title">Provider record</h2>
          <form action={saveProviderProfile} className={styles.form}>
            <input type="hidden" name="id" value={provider.id} />
            <input type="hidden" name="expectedUpdatedAt" value={provider.updatedAt.toISOString()} />
            <label>Provider name<input name="name" defaultValue={provider.name} minLength={2} maxLength={100} required /></label>
            <label>Official HTTPS URL<input type="url" name="officialUrl" defaultValue={provider.officialUrl} required /></label>
            <label>Headquarters country code<input name="hqCountry" defaultValue={provider.hqCountry ?? ""} pattern="[A-Za-z]{2}" maxLength={2} /></label>
            <label>Status<select name="status" defaultValue={provider.status}>
              <option value="active">Active</option><option value="draft">Draft</option><option value="paused">Paused</option><option value="archived">Archived</option>
            </select></label>
            <label>Trustpilot score<input type="number" name="trustpilotScore" min="0" max="5" step="0.01" defaultValue={provider.trustpilotScore ?? ""} /></label>
            <label>Trustpilot review count<input type="number" name="trustpilotReviews" min="0" step="1" defaultValue={provider.trustpilotReviews ?? ""} /></label>
            <label>Trustpilot HTTPS source<input type="url" name="trustpilotUrl" defaultValue={provider.trustpilotUrl ?? ""} /></label>
            <label>Rating check date<input type="date" name="trustpilotCheckedAt" defaultValue={provider.trustpilotCheckedAt?.toISOString().slice(0, 10) ?? ""} /></label>
            <button className={styles.saveButton} type="submit">Save provider record</button>
          </form>
        </section>
        <div>
          <section className={styles.panel} aria-labelledby="provider-offers-title">
            <h2 id="provider-offers-title">Offers · {offers.length}</h2>
            {offers.length ? <ul className={styles.sideList}>{offers.map((offer) => <li key={offer.id}><Link href={`/admin/offers/${encodeURIComponent(offer.id)}`}>{offer.planName}</Link> <span className={styles.muted}>· {offer.publicationStatus}</span></li>)}</ul> : <p className={styles.muted}>No offers recorded.</p>}
          </section>
          <section className={styles.panel} aria-labelledby="provider-affiliates-title">
            <h2 id="provider-affiliates-title">Affiliate programs · {affiliatePrograms.length}</h2>
            {affiliatePrograms.length ? <ul className={styles.sideList}>{affiliatePrograms.map((program) => <li key={program.id}>{program.programName} <span className={styles.muted}>· {program.projectStatus}</span></li>)}</ul> : <p className={styles.muted}>No affiliate program recorded.</p>}
            <p><Link href="/admin/affiliates">View affiliate programs</Link></p>
          </section>
        </div>
      </div>
    </main>
  </AdminShell>;
}
