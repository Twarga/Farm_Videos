import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAnalyticsSnapshot } from "@/db/analytics-reporting";
import { requireAdmin } from "@/lib/admin-request";
import styles from "@/components/admin/AdminConsole.module.css";

export const metadata: Metadata = { title: "Analytics · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const data = getAnalyticsSnapshot(30);
  return <AdminShell sidebar={<AdminSidebar active="/admin/analytics" />} topbar={<span>Last 30 days</span>}>
    <main className={styles.main}>
      <header className={styles.page_head}><div><span>Control room · first-party events</span><h1>Analytics</h1><p>Recorded visitor actions from the last 30 days. Unmeasured outcomes are left unreported.</p></div></header>
      <section className={styles.overview_metrics} aria-label="Recorded funnel">
        <article className={styles.overview_metric}><span>Visitors</span><strong>{data.uniqueVisitors.toLocaleString()}</strong><small>Distinct recorded visitor IDs · 30 days</small></article>
        <article className={styles.overview_metric}><span>Page views</span><strong>{data.pageViews.toLocaleString()}</strong><small>Recorded page_view events · 30 days</small></article>
        <article className={styles.overview_metric}><span>Outbound clicks</span><strong>{data.clicks.toLocaleString()}</strong><small>Recorded affiliate_click events · 30 days</small></article>
        <article className={styles.overview_metric}><span>Guide actions</span><strong>{data.guideClicks.toLocaleString()}</strong><small>Recorded guide link events · 30 days</small></article>
      </section>
      <section className={styles.overview_sections}>
        <section><h2>Top outbound offers</h2>{data.byOffer.length ? <ol>{data.byOffer.slice(0, 10).map((row) => <li key={row.id}><a href={`/admin/offers/${encodeURIComponent(row.id)}`}>{row.id}</a> · {row.clicks} clicks · {row.sessions} sessions</li>)}</ol> : <p>No events yet. Outbound offers will appear after a recorded click.</p>}</section>
        <section><h2>Measurement notes</h2><p>Counts come from first-party events in the application database. Missing external reports are not estimated.</p><a href="/admin/audit">View audit log</a></section>
      </section>
    </main>
  </AdminShell>;
}
