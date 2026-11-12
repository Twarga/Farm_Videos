import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAdminOfferDetail } from "@/db/admin-offers";
import { requireAdmin } from "@/lib/admin-request";
import { saveOfferFacts } from "../actions";
import styles from "../../providers/page.module.css";

export const metadata: Metadata = { title: "Offer record · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOfferDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ status?: string }> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const { id } = await params;
  const detail = getAdminOfferDetail(id);
  if (!detail) notFound();
  const { offer, provider, priceHistory, editorial, audit } = detail;
  const { status } = await searchParams;
  return <AdminShell sidebar={<AdminSidebar active="/admin/offers" />} sectionLabel={offer.planName} topbar={<Link href="/admin/offers">All offers</Link>}>
    <main className={styles.main}>
      <header className={styles.heading}><span>Control room · offer record</span><h1>{provider.name} · {offer.planName}</h1><p>{offer.publicationStatus} · {offer.id}</p></header>
      {status ? <p role={status === "saved" ? "status" : "alert"}>{status === "saved" ? "Offer facts saved and audited." : status === "stale" ? "This record changed. Review it before saving again." : status === "publication" ? "Published facts require a reviewed import and publication." : "Check the form values and try again."}</p> : null}
      <div className={styles.detailGrid}>
        <section className={styles.panel} aria-labelledby="offer-facts-title">
          <h2 id="offer-facts-title">Facts</h2>
          {["draft", "staged", "blocked"].includes(offer.publicationStatus) ? <form action={saveOfferFacts} className={styles.form}>
            <input type="hidden" name="id" value={offer.id} /><input type="hidden" name="expectedUpdatedAt" value={offer.updatedAt.toISOString()} />
            <label>Plan name<input name="planName" defaultValue={offer.planName} minLength={1} maxLength={160} required /></label>
            <label>Official HTTPS URL<input name="officialUrl" type="url" defaultValue={offer.officialUrl} required /></label>
            <label>vCPU<input name="vcpus" type="number" min="0" step="1" defaultValue={offer.vcpus ?? ""} /></label>
            <label>RAM GB<input name="ramGb" type="number" min="0" step="0.01" defaultValue={offer.ramGb ?? ""} /></label>
            <label>Disk GB<input name="diskGb" type="number" min="0" step="0.01" defaultValue={offer.diskGb ?? ""} /></label>
            <button className={styles.saveButton} type="submit">Save offer facts</button>
          </form> : <p>This record is public or historical. Change its facts through a staged, reviewed import and publication.</p>}
        </section>
        <div>
          <section className={styles.panel}><h2>Publication and review</h2>
            <p>Status: {offer.publicationStatus}</p>
            {offer.publicationStatus === "published" ? <p><Link href={`/offers/${encodeURIComponent(id)}`}>Public offer page</Link> · <a href={`/go/${encodeURIComponent(id)}`}>Outbound destination</a></p> : null}
            <p><Link href={`/admin/terms/${encodeURIComponent(id)}`}>Price terms</Link> · <Link href={`/admin/editorial/${encodeURIComponent(id)}`}>Editorial</Link></p>
            <p>Editorial state: {editorial?.reviewStatus ?? "Not reviewed"}</p>
          </section>
          <section className={styles.panel}><h2>Price evidence</h2>
            {priceHistory.length ? <ul className={styles.sideList}>{priceHistory.map((price) => <li key={price.id}><time dateTime={price.sourceCheckedAt.toISOString()}>{price.sourceCheckedAt.toISOString().slice(0, 10)}</time> · {price.effectiveMonthly == null ? "Price not published" : `USD ${price.effectiveMonthly.toFixed(2)}/mo`} · {price.sourceUrl ? <a href={price.sourceUrl} target="_blank" rel="noreferrer">Source</a> : "Source not published"}</li>)}</ul> : <p>No price evidence recorded.</p>}
          </section>
          <section className={styles.panel}><h2>Recent audit</h2>
            {audit.length ? <ul className={styles.sideList}>{audit.map((entry) => <li key={entry.id}>{entry.action} · <time dateTime={entry.createdAt.toISOString()}>{entry.createdAt.toISOString().slice(0, 10)}</time></li>)}</ul> : <p>No offer audit entries.</p>}
          </section>
        </div>
      </div>
    </main>
  </AdminShell>;
}
