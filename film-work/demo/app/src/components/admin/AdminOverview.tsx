import styles from "./AdminConsole.module.css";

type Props = {
  publication: { status: "available" | "unavailable"; count: number | null; providers: number | null; snapshotDate: string | null };
  queues: { termsReview: number; editorialDrafts: number; corrections: number; blockingImportIssues: number };
  analytics: { visitors: number; clicks: number };
  operations: { backupAt: string | null; restoreAt: string | null; ready: boolean };
};

function Metric({ label, value, note, href }: { label: string; value: string | number; note: string; href: string }) {
  return <a className={styles.overview_metric} href={href}>
    <span>{label}</span><strong>{value}</strong><small>{note}</small>
  </a>;
}

export function AdminOverview({ publication, queues, analytics, operations }: Props) {
  const published = publication.status === "available" && publication.count != null;
  const source = publication.snapshotDate ? `Reviewed snapshot · ${publication.snapshotDate.slice(0, 10)}` : "No publication";
  return <main className={styles.main}>
    <header className={styles.page_head}><div><span>Owner workspace</span><h1>Overview</h1><p>Publication, review queues, and operating evidence.</p></div></header>
    <section aria-label="Catalog and review metrics" className={styles.overview_metrics}>
      <Metric label="Public plans" value={published ? publication.count! : "No publication"} note={source} href="/admin/offers" />
      <Metric label="Public providers" value={published ? publication.providers ?? "Not published" : "No publication"} note="Eligible public catalog" href="/admin/providers" />
      <Metric label="Price terms" value={queues.termsReview} note="Open or held reviews" href="/admin/terms" />
      <Metric label="Editorial" value={queues.editorialDrafts} note="Published plans without reviewed copy" href="/admin/editorial" />
      <Metric label="Corrections" value={queues.corrections} note="Open submissions" href="/admin/corrections" />
      <Metric label="Blocking import issues" value={queues.blockingImportIssues} note="Unresolved errors on unpublished jobs" href="/admin/quality" />
    </section>
    <div className={styles.overview_sections}>
      <section><h2>System</h2><dl>
        <div><dt>Readiness</dt><dd><a href="/admin/health">{operations.ready ? "Ready" : "Readiness needs attention"}</a></dd></div>
        <div><dt>Last encrypted backup</dt><dd>{operations.backupAt ?? "Not connected"}</dd></div>
        <div><dt>Last restore drill</dt><dd>{operations.restoreAt ?? "Not connected"}</dd></div>
      </dl></section>
      <section><h2>Last 30 days</h2><dl>
        <div><dt>Recorded visitors</dt><dd>{analytics.visitors.toLocaleString()}</dd></div>
        <div><dt>Outbound clicks</dt><dd>{analytics.clicks.toLocaleString()}</dd></div>
      </dl><a href="/admin/analytics">View analytics</a></section>
    </div>
  </main>;
}
