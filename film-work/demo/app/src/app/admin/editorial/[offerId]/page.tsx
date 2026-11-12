import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { EditorialEntry } from "@/components/admin/EditorialEntry";
import shellStyles from "@/components/admin/AdminConsole.module.css";
import { getAnalyticsSnapshot } from "@/db/analytics-reporting";
import { getOfferEditorial } from "@/db/editorial";
import { requireAdmin } from "@/lib/admin-request";
import { buildEditorialReport } from "@/lib/editorial-queue";
import { getPublicCatalogState } from "@/lib/public-catalog";
import { saveEditorialEntry } from "../actions";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Editorial review · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminEditorialDetailPage({ params }: { params: Promise<{ offerId: string }> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const { offerId } = await params;
  const catalog = getPublicCatalogState();
  if (catalog.status === "unavailable") notFound();
  const clicks = new Map(getAnalyticsSnapshot(30).byOffer.map(row => [row.id, row.clicks]));
  const report = buildEditorialReport(catalog.offers, clicks, Number.MAX_SAFE_INTEGER);
  const index = report.entries.findIndex(entry => entry.offer.id === offerId);
  if (index < 0) notFound();
  const entry = report.entries[index];
  const next = report.entries[index + 1];
  return <AdminShell sidebar={<AdminSidebar active="/admin/editorial" />} topbar={<Link className={shellStyles.preview_link} href="/admin/editorial">Editorial queue</Link>} sectionLabel="Editorial review">
    <main className={shellStyles.main}>
      <header className={shellStyles.page_head}><div><span>Control room · editorial review</span><h1>Review plan copy</h1><p>Save a draft or publish reviewed copy after checking each sentence against its source.</p></div></header>
      <EditorialEntry entry={entry} saved={getOfferEditorial(offerId)} action={saveEditorialEntry} />
      <nav className={styles.detailNav} aria-label="Editorial review navigation"><Link href="/admin/editorial">Back to queue</Link>{next ? <Link href={`/admin/editorial/${encodeURIComponent(next.offer.id)}`}>Next in queue</Link> : null}</nav>
    </main>
  </AdminShell>;
}
