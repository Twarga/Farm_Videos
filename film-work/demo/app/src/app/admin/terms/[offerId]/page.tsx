import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CurrentPriceTermsReview } from "@/components/admin/CurrentPriceTermsReview";
import { PRICE_TERMS_FIELDS } from "@/components/admin/PriceTermsFields";
import styles from "@/components/admin/AdminConsole.module.css";
import { suggestPriceTerms } from "@/db/price-terms";
import { requireAdmin } from "@/lib/admin-request";
import { priceTermsSourceRate } from "@/lib/current-price-terms";
import { unsupportedRenewalReason } from "@/lib/renewal-evidence";
import { listTermsBacklog } from "@/lib/terms-queue";
import { saveCurrentTerms } from "../actions";
import correctionQueue from "../correction-queue.json";
import pageStyles from "../page.module.css";

export const metadata: Metadata = { title: "Review price terms · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;
const ownerGatedIds = new Set(correctionQueue.rows.map((row) => row.offerId));

export default async function AdminTermDetailPage({ params, searchParams }: { params: Promise<{ offerId: string }>; searchParams?: Promise<{ state?: string; reason?: string }> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const { offerId } = await params;
  const row = listTermsBacklog().find((item) => item.offer.id === offerId);
  if (!row) notFound();
  const { offer, provider, price, state } = row;
  const query = await searchParams ?? {};
  const backParams = new URLSearchParams();
  if (query.state) backParams.set("state", query.state);
  if (query.reason) backParams.set("reason", query.reason);
  const backHref = `/admin/terms${backParams.size ? `?${backParams}` : ""}`;
  const next = listTermsBacklog().find((item) => item.offer.id !== offerId && item.state === "open" && !ownerGatedIds.has(item.offer.id));
  const nextHref = next ? `/admin/terms/${encodeURIComponent(next.offer.id)}${backParams.size ? `?${backParams}` : ""}` : backHref;
  const rate = priceTermsSourceRate(price);
  const values = Object.fromEntries(PRICE_TERMS_FIELDS.map((field) => [field, price[field] == null ? null : field.endsWith("Months") ? price[field] : rate == null ? null : Number((price[field] / rate).toFixed(6))]));
  const suggestion = suggestPriceTerms(offer.billingNotes ?? price.billingLabel ?? "");
  const ownerGated = ownerGatedIds.has(offerId) || state === "quarantined";

  return <AdminShell sidebar={<AdminSidebar active="/admin/terms" />} sectionLabel="Price terms" topbar={<a className={styles.preview_link} href={backHref}>Back to queue</a>}>
    <main className={styles.main}>
      <header className={styles.page_head}><div><span>Control room · billing evidence</span><h1>{provider.name} {offer.planName}</h1><p>Review the dated provider evidence before saving price terms. Blank values remain unknown.</p></div></header>
      <div className={pageStyles.detail}>
        <section className={pageStyles.evidence} aria-label="Provider evidence">
          <h2>Provider evidence</h2>
          <p><a href={price.sourceUrl ?? offer.officialUrl} target="_blank" rel="noreferrer">Provider source</a> · <a href={`/offers/${offer.id}`} target="_blank" rel="noreferrer">Public plan</a></p>
          <dl><div><dt>Source currency</dt><dd>{price.originalCurrency ?? "Not published"}</dd></div><div><dt>Source checked</dt><dd>{price.sourceCheckedAt.toISOString().slice(0, 10)}</dd></div><div><dt>Stored FX</dt><dd>{rate == null ? "Check-date conversion missing" : `${rate} USD / source unit`}</dd></div><div><dt>State</dt><dd>{state}</dd></div></dl>
          <p>{offer.billingNotes ?? price.billingLabel ?? "No billing notes on file."}</p>
          <blockquote>{price.renewalSource ?? "No renewal evidence reviewed."}</blockquote>
          <details><summary>Parser suggestion ({suggestion.confidence} confidence)</summary><pre>{JSON.stringify(suggestion, null, 2)}</pre></details>
          <p>Suggestions are not approval. Zero needs an explicit provider statement.</p>
        </section>
        {ownerGated ? <section className={pageStyles.error} aria-label="Owner-gated review"><h2>Owner approval required</h2><p>This row is in the renewal correction worklist and remains read-only. {unsupportedRenewalReason(price.renewalMonthly, price.renewalSource)}</p></section>
          : rate == null ? <section className={pageStyles.error}><h2>Review FX first</h2><p>The stored check-date currency conversion is missing. These terms cannot be saved.</p></section>
          : <CurrentPriceTermsReview offerId={offer.id} priceId={price.id} values={values} renewalSource={price.renewalSource ?? ""} setupFeeSource={price.setupFeeSource ?? ""} setupOnly={state === "reviewed"} action={saveCurrentTerms} />}
      </div>
      <a className={pageStyles.next} href={nextHref}>Next in queue</a>
    </main>
  </AdminShell>;
}
