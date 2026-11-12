"use client";

import { priceStats } from "@/lib/price-stats";
import { usd, offerMoney, money as formatMoney } from "@/lib/format";
import {
  ArrowRight,
  ArrowSquareOut,
  Buildings,
  ChartLineUp,
  Check,
  CheckCircle,
  ClockCounterClockwise,
  Database,
  Export,
  FileArrowUp,
  GearSix,
  GlobeHemisphereWest,
  ListChecks,
  MagnifyingGlass,
  NotePencil,
  PencilSimple,
  Plus,
  Stack,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProviderLogo } from "@/components/ProviderLogo";
import { AdminShell } from "./AdminShell";
import { AdminSidebar } from "./AdminSidebar";
import { providers } from "@/lib/providers";
import { resolveOfferProvider, resolveProvider } from "@/lib/provider-resolver";
import { isXrayEligible } from "@/lib/home-xray";
import type { AdminActionResult, AdminActionStatus } from "@/lib/admin-action-feedback";
import type { Offer } from "@/lib/types";
import type { AnalyticsSnapshot } from "@/db/analytics-reporting";
import styles from "./AdminConsole.module.css";

const AdminMetricInventory = dynamic(() => import("./AdminMetricInventory").then((module) => module.AdminMetricInventory));

type Section =
  | "overview"
  | "offers"
  | "providers"
  | "quality"
  | "analytics"
  | "imports"
  | "settings"
  | "activity";

type Activity = { id: number; text: string; time: string };
type AdminNotice = { status: AdminActionStatus | "pending"; message: string; requestId?: string | null };

const STORE_KEY = "bvf-admin-offer-drafts-v1";
const ACTIVITY_KEY = "bvf-admin-activity-v1";
const ANALYTICS_SETTINGS_KEY = "bvf-admin-analytics-settings-v1";

const navigation: Array<{
  id: Section;
  label: string;
  icon: typeof Stack;
  group: "workspace" | "system";
}> = [
  { id: "overview", label: "Overview", icon: ListChecks, group: "workspace" },
  { id: "offers", label: "Offers", icon: Stack, group: "workspace" },
  { id: "providers", label: "Providers", icon: Buildings, group: "workspace" },
  { id: "quality", label: "Data quality", icon: WarningCircle, group: "workspace" },
  { id: "analytics", label: "Analytics", icon: ChartLineUp, group: "workspace" },
  { id: "imports", label: "Draft files", icon: FileArrowUp, group: "system" },
  { id: "settings", label: "Settings", icon: GearSix, group: "system" },
  { id: "activity", label: "Activity", icon: ClockCounterClockwise, group: "system" },
];

function money(offer: Offer) { return offerMoney(offer.effectiveMonthly, offer); }
function daysOld(date: string) {
  const parsed = new Date(`${date.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor((Date.now() - parsed.getTime()) / 86_400_000));
}

function percentage(value: number, total: number) {
  return Math.round((value / Math.max(total, 1)) * 100);
}

function isOfferArray(value: unknown): value is Offer[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as Offer).id === "string" &&
        typeof (item as Offer).providerId === "string" &&
        typeof (item as Offer).productName === "string",
    )
  );
}

function StatusPill({ tone, children }: { tone: "good" | "warn" | "quiet"; children: React.ReactNode }) {
  return <span className={`${styles.pill} ${styles[`pill_${tone}`]}`}>{children}</span>;
}

function AdminFeedback({ notice, onDismiss }: { notice: AdminNotice; onDismiss: () => void }) {
  const isError = notice.status !== "success" && notice.status !== "pending";
  return <div className={`${styles.feedback} ${styles[`feedback_${notice.status}`]}`} role={isError ? "alert" : "status"} aria-live={isError ? "assertive" : "polite"} aria-atomic="true">
    {notice.status === "success" ? <CheckCircle size={18} weight="fill" aria-hidden /> : <WarningCircle size={18} weight="fill" aria-hidden />}
    <span><strong>{notice.status === "pending" ? "Working" : notice.status === "success" ? "Saved" : notice.status === "conflict" ? "Refresh required" : notice.status === "authorization_error" ? "Sign in required" : notice.status === "validation_error" ? "Check this action" : "Action failed"}</strong><small>{notice.message}{notice.requestId ? <> <code>Request {notice.requestId}</code></> : null}</small></span>
    {notice.status !== "pending" ? <button type="button" onClick={onDismiss} aria-label="Dismiss message"><X size={16} aria-hidden /></button> : null}
  </div>;
}

export function AdminConsole({ analytics, initialCatalog, initialOfferRevisions, catalogStatus, saveOffer, homeXray, initialView }: { analytics: AnalyticsSnapshot; initialCatalog: Offer[]; initialOfferRevisions: Record<string, string>; catalogStatus: "available" | "unavailable"; saveOffer: (offer: Offer, expectedRevision: string | null) => Promise<AdminActionResult>; homeXray: { current: string | null; reason: string | null; action: (formData: FormData) => Promise<AdminActionResult> }; initialView?: string }) {
  const [section, setSection] = useState<Section>(() => navigation.find((item) => item.id === initialView)?.id ?? "overview");
  const [catalog, setCatalog] = useState<Offer[]>(initialCatalog);
  const [offerRevisions, setOfferRevisions] = useState(initialOfferRevisions);
  const [selected, setSelected] = useState<Offer | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "affiliate" | "attention">("all");
  const [notice, setNotice] = useState<AdminNotice | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isOfferArray(parsed)) setCatalog(parsed);
      }
      const activitySaved = localStorage.getItem(ACTIVITY_KEY);
      if (activitySaved) setActivity(JSON.parse(activitySaved) as Activity[]);
    } catch {
      setNotice({ status: "validation_error", message: "A saved draft could not be read. The published catalog is still safe." });
    }
  }, []);

  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelected(null);
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  const pushActivity = useCallback((text: string) => {
    const entry = { id: Date.now(), text, time: new Date().toISOString() };
    setActivity((current) => {
      const next = [entry, ...current].slice(0, 50);
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const saveCatalog = useCallback((next: Offer[], feedback: AdminNotice) => {
    setCatalog(next);
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
    setNotice(feedback);
  }, []);

  const issues = useMemo(() => {
    const rows: Array<{ id: string; severity: "high" | "medium"; title: string; detail: string; offer?: Offer }> = [];
    catalog.forEach((offer) => {
      if (!offer.available) rows.push({ id: `${offer.id}-stock`, severity: "high", title: "Unavailable offer is still in the catalog", detail: `${resolveOfferProvider(offer).name} · ${offer.productName}`, offer });
      if (offer.renewalMonthly == null) rows.push({ id: `${offer.id}-renewal`, severity: "high", title: "Renewal price is missing", detail: `${resolveOfferProvider(offer).name} · ${offer.productName}`, offer });
      if (offer.confidence === "low") rows.push({ id: `${offer.id}-confidence`, severity: "medium", title: "Price confidence is low", detail: `${resolveOfferProvider(offer).name} · ${offer.productName}`, offer });
      if (daysOld(offer.checkedAt) > 14) rows.push({ id: `${offer.id}-stale`, severity: "medium", title: `Price check is ${daysOld(offer.checkedAt)} days old`, detail: `${resolveOfferProvider(offer).name} · ${offer.productName}`, offer });
    });
    providers.filter((provider) => provider.trustpilotScore == null).forEach((provider) => rows.push({ id: `${provider.id}-trust`, severity: "medium", title: "Trustpilot snapshot is missing", detail: provider.name }));
    return rows;
  }, [catalog]);

  const filteredOffers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return catalog.filter((offer) => {
      const provider = resolveOfferProvider(offer);
      const matchesQuery = !normalized || `${provider?.name} ${offer.productName} ${offer.sku}`.toLowerCase().includes(normalized);
      const matchesFilter =
        filter === "all" ||
        (filter === "affiliate" && offer.affiliate) ||
        (filter === "attention" && (offer.confidence === "low" || offer.renewalMonthly == null || !offer.available || daysOld(offer.checkedAt) > 14));
      return matchesQuery && matchesFilter;
    });
  }, [catalog, filter, query]);

  async function updateOffer(nextOffer: Offer): Promise<AdminActionResult> {
    const next = catalog.map((offer) => (offer.id === nextOffer.id ? nextOffer : offer));
    if (!nextOffer.id.startsWith("draft-")) {
      setNotice({ status: "pending", message: `Saving ${nextOffer.productName}…` });
      let result: AdminActionResult;
      try {
        result = await saveOffer(nextOffer, offerRevisions[nextOffer.id] ?? null);
      } catch {
        result = { ok: false, status: "server_error", message: "The save request did not complete. Your changes are still open.", requestId: null, id: nextOffer.id };
      }
      setNotice({ status: result.status, message: result.message, requestId: result.requestId });
      if (!result.ok) return result;
      if (result.revision) setOfferRevisions((current) => ({ ...current, [nextOffer.id]: result.revision! }));
      saveCatalog(next, { status: "success", message: result.message, requestId: result.requestId });
      pushActivity(`Updated ${resolveOfferProvider(nextOffer).name} ${nextOffer.productName}`);
      return result;
    }
    saveCatalog(next, { status: "success", message: `${nextOffer.productName} saved as a local draft. Publish it through the reviewed database workflow before it can go live.` });
    pushActivity(`Updated local draft ${resolveOfferProvider(nextOffer).name} ${nextOffer.productName}`);
    return { ok: true, status: "success", message: `${nextOffer.productName} saved as a local draft.`, requestId: null, id: nextOffer.id };
  }

  function resetDrafts() {
    localStorage.removeItem(STORE_KEY);
    setCatalog(initialCatalog);
    setNotice({ status: "success", message: "Local drafts cleared. Published source data restored." });
    pushActivity("Restored the source offer catalog");
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `bestvpsforme-offers-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    pushActivity(`Exported ${catalog.length} offers`);
  }

  async function importData(file: File) {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isOfferArray(parsed)) throw new Error("Invalid offer file");
      saveCatalog(parsed, { status: "success", message: `${parsed.length} offers imported into the browser draft workspace.` });
      pushActivity(`Imported ${parsed.length} offers from ${file.name}`);
    } catch {
      setNotice({ status: "validation_error", message: "Import failed. Choose a JSON export created by this admin." });
    }
  }

  function navigate(next: string) {
    const target = navigation.find((item) => item.id === next);
    if (!target) return;
    setSection(target.id);
    const url = new URL(window.location.href);
    url.searchParams.set("view", target.id);
    window.history.replaceState(window.history.state, "", url);
  }

  const affiliateCount = catalog.filter((offer) => offer.affiliate).length;

  return (
    <AdminShell
      sectionLabel={navigation.find((item) => item.id === section)?.label}
      sidebar={<AdminSidebar active={section} onNavigate={navigate} />}
      topbar={
        <>
          <a href="/" target="_blank" rel="noreferrer" className={`ui-button ui-button--quiet ${styles.preview_link}`}>View site <ArrowSquareOut size={15} aria-hidden /></a>
          <button className={`ui-button ui-button--primary ${styles.primary_button}`} onClick={() => { navigate("offers"); setSelected({ ...catalog[0], id: `draft-${Date.now()}`, productName: "New offer", sku: "new-offer" }); }}><Plus size={16} weight="bold" aria-hidden /> New offer</button>
        </>
      }
      notice={notice && <AdminFeedback notice={notice} onDismiss={() => setNotice(null)} />}
      overlays={<>
        <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void importData(file); event.target.value = ""; }} />
        {selected && <OfferDrawer initial={selected} isNew={selected.id.startsWith("draft-")} onClose={() => setSelected(null)} onSave={updateOffer} />}
      </>}
    >
        <main className={styles.main}>
          {section === "overview" && <Overview catalog={catalog} catalogStatus={catalogStatus} analytics={analytics} issues={issues} affiliateCount={affiliateCount} onOpenOffer={setSelected} onNavigate={navigate} />}
          {section === "offers" && <OffersView offers={filteredOffers} query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} onEdit={setSelected} />}
          {section === "providers" && <ProvidersView catalog={catalog} />}
          {section === "quality" && <QualityView issues={issues} onEdit={setSelected} />}
          {section === "analytics" && <AnalyticsView catalog={catalog} analytics={analytics} />}
          {section === "imports" && <ImportsView count={catalog.length} onExport={exportData} onImport={() => importRef.current?.click()} onReset={resetDrafts} />}
          {section === "settings" && <SettingsView homeXray={homeXray} offers={catalog} />}
          {section === "activity" && <ActivityView activity={activity} />}
        </main>
    </AdminShell>
  );
}

function PageHead({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className={styles.page_head}><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Overview({ catalog, catalogStatus, analytics, issues, affiliateCount, onOpenOffer, onNavigate }: { catalog: Offer[]; catalogStatus: "available" | "unavailable"; analytics: AnalyticsSnapshot; issues: Array<{ id: string; severity: "high" | "medium"; title: string; detail: string; offer?: Offer }>; affiliateCount: number; onOpenOffer: (offer: Offer) => void; onNavigate: (section: Section) => void }) {
  const router = useRouter();
  const available = catalog.filter((offer) => offer.available);
  const stats = priceStats(available);
  const avgPrice = stats.average;
  const medianPrice = stats.median;
  const verified = catalog.filter((offer) => daysOld(offer.checkedAt) <= 14 && offer.confidence !== "low").length;
  return <>
    <PageHead eyebrow="Operations overview" title="Overview" description="Published catalog health, commercial coverage, and measured traffic." action={<div className="flex max-w-full flex-wrap items-center gap-3"><StatusPill tone={catalogStatus === "available" ? "good" : "warn"}>{catalogStatus === "available" ? "Published database" : "No published snapshot"}</StatusPill><button className={`ui-button ui-button--secondary ${styles.secondary_button}`} onClick={() => onNavigate("analytics")}>All analytics <ArrowRight size={15} aria-hidden /></button></div>} />
    <section className={styles.overview_summary} aria-label="Admin summary">
      <OverviewMetric label="Live offers" value={available.length} note={`${catalog.length} total`} />
      <OverviewMetric label="Providers" value={new Set(catalog.map((offer) => offer.providerId)).size} note="published inventory" />
      <OverviewMetric label="Affiliate coverage" value={`${percentage(affiliateCount, catalog.length)}%`} note={`${catalog.length - affiliateCount} direct`} />
      <OverviewMetric label="Data ready" value={`${percentage(verified, catalog.length)}%`} note={`${verified} trusted`} />
      <OverviewMetric label="Median monthly" value={`${formatMoney(medianPrice, "USD")}`} note={`mean ${formatMoney(avgPrice, "USD")}`} />
      <OverviewMetric label="Needs attention" value={issues.length} note="quality checks" tone={issues.length ? "warn" : undefined} />
    </section>
    <div className={styles.overview_workbench}>
      <section className={styles.performance_panel}>
        <div className={styles.section_head}><div><span>Growth and revenue</span><h2>Measured funnel</h2></div><StatusPill tone={analytics.pageViews || analytics.clicks ? "good" : "quiet"}>{analytics.pageViews || analytics.clicks ? "First-party data" : "No events yet"}</StatusPill></div>
        <p className={styles.panel_intro}>Database-backed totals from the last {analytics.days} days. Conversion and commission stay at zero until a confirmed affiliate report is imported.</p>
        <div className={styles.planned_metrics}>
          <FunnelMetric label="Visitors" value={analytics.uniqueVisitors} source="anonymous visitors" />
          <FunnelMetric label="Page views" value={analytics.pageViews} source="page_view" />
          <FunnelMetric label="Outbound clicks" value={analytics.clicks} source="affiliate_click" />
          <FunnelMetric label="Outbound rate" value={`${(analytics.outboundRate * 100).toFixed(1)}%`} source="click sessions ÷ visitors" />
          <FunnelMetric label="Conversions" value={analytics.confirmedConversions} source="confirmed reports" />
          <FunnelMetric label="Commission" value={`€${analytics.commission.toFixed(2)}`} source="confirmed reports" />
        </div>
        <button className={styles.text_action} onClick={() => onNavigate("analytics")}>Open analytics and coverage gaps <ArrowRight size={15} aria-hidden /></button>
      </section>
      <section className={styles.focus_panel}>
        <div className={styles.section_head}><div><span>Priority queue</span><h2>{issues.length ? `${issues.length} checks before the next publish` : "Catalog is ready"}</h2></div><button onClick={() => onNavigate("quality")}>See all</button></div>
        <div className={styles.issue_list}>{issues.slice(0, 6).map((issue) => <button key={issue.id} className={styles.issue_row} onClick={() => issue.offer ? onOpenOffer(issue.offer) : onNavigate("providers")}><span className={issue.severity === "high" ? styles.issue_high : styles.issue_medium}><WarningCircle size={17} weight="fill" aria-hidden /></span><span><strong>{issue.title}</strong><small>{issue.detail}</small></span><ArrowRight size={16} aria-hidden /></button>)}{!issues.length && <div className={styles.empty_state}><CheckCircle size={24} weight="fill" aria-hidden /><strong>No blocking issues</strong><span>Every required field passes the current checks.</span></div>}</div>
      </section>
    </div>
    <section className={styles.home_analytics}>
      <div className={styles.section_head}><div><span>Catalog intelligence</span><h2>Price, commercial, and quality position</h2></div><button onClick={() => onNavigate("analytics")}>Full analysis</button></div>
      <div className={styles.home_intelligence}>
        <PriceHistogram catalog={catalog} />
        <section className={styles.compact_signals}>
          <Signal label="Data readiness" value={`${percentage(verified, catalog.length)}%`} note={`${verified} fresh, reliable records`} progress={percentage(verified, catalog.length)} />
          <Signal label="Affiliate coverage" value={`${percentage(affiliateCount, catalog.length)}%`} note={`${affiliateCount} monetized offers`} progress={percentage(affiliateCount, catalog.length)} />
          
        </section>
        <section className={styles.quick_actions_light}><span>Quick actions</span><button onClick={() => onNavigate("offers")}><Stack size={17} aria-hidden />Review inventory<ArrowRight size={14} aria-hidden /></button><button onClick={() => router.push("/admin/imports")}><FileArrowUp size={17} aria-hidden />Reviewed CSV import<ArrowRight size={14} aria-hidden /></button><button onClick={() => onNavigate("providers")}><Buildings size={17} aria-hidden />Affiliate gaps<ArrowRight size={14} aria-hidden /></button></section>
      </div>
    </section>
  </>;
}

function OverviewMetric({ label, value, note, tone }: { label: string; value: string | number; note: string; tone?: "warn" }) {
  return <div className={tone ? styles.overview_metric_warn : undefined}><span>{label}</span><strong className="num">{value}</strong><small>{note}</small></div>;
}

function FunnelMetric({ label, value, source }: { label: string; value: string | number; source: string }) {
  return <div><span>{label}</span><strong className="num">{value}</strong><small>{source}</small></div>;
}

function Signal({ label, value, note, progress }: { label: string; value: string; note: string; progress: number }) {
  return <div><span><b>{label}</b><strong className="num">{value}</strong></span><i><b style={{ width: `${progress}%` }} /></i><small>{note}</small></div>;
}

function OffersView({ offers, query, setQuery, filter, setFilter, onEdit }: { offers: Offer[]; query: string; setQuery: (value: string) => void; filter: "all" | "affiliate" | "attention"; setFilter: (value: "all" | "affiliate" | "attention") => void; onEdit: (offer: Offer) => void }) {
  return <>
    <PageHead eyebrow="Inventory" title="Offers" description="Search, review, and edit the plans that appear in the public catalog." />
    <div className={styles.table_tools}><label className={styles.search_field}><MagnifyingGlass size={17} /><input aria-label="Search offers" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search provider, plan, or SKU" /></label><div className={styles.segmented}>{(["all", "affiliate", "attention"] as const).map((value) => <button key={value} onClick={() => setFilter(value)} className={`ui-button ui-button--quiet ${filter === value ? styles.segmented_active : ""}`}>{value === "all" ? "All" : value[0].toUpperCase() + value.slice(1)}</button>)}</div></div>
    <div className={styles.table_frame}><table className={styles.data_table}><thead><tr><th>Offer</th><th>Resources</th><th>Effective price</th><th>Last checked</th><th>Commercial</th><th aria-label="Actions" /></tr></thead><tbody>{offers.map((offer) => { const provider = resolveOfferProvider(offer); return <tr key={offer.id}><td><div className={styles.offer_name}><ProviderLogo provider={provider} size={34} /><span><strong>{offer.productName}</strong><small>{provider.name} · {offer.sku}</small></span></div></td><td><strong className="num">{offer.vcpu} CPU · {offer.ramGb} GB</strong><small>{offer.diskGb} GB {offer.diskKind}</small></td><td><strong className="num">{money(offer)} / mo</strong><small>{offer.currency} · {offer.commitmentMonths} month term</small></td><td><strong>{Number.isFinite(daysOld(offer.checkedAt)) ? `${daysOld(offer.checkedAt)} days ago` : "Date missing"}</strong><small>{offer.checkedAt ? offer.checkedAt.slice(0, 10) : "Not published"}</small></td><td><div className={styles.pill_row}>{offer.affiliate ? <StatusPill tone="quiet">Affiliate</StatusPill> : <StatusPill tone="warn">Direct</StatusPill>}</div></td><td><button className={styles.icon_button} onClick={() => onEdit(offer)} aria-label={`Edit ${offer.productName}`}><PencilSimple size={17} /></button></td></tr>; })}</tbody></table>{!offers.length && <div className={styles.empty_state}><MagnifyingGlass size={24} /><strong>No matching offers</strong><span>Try a broader search or another status filter.</span></div>}</div>
  </>;
}

function ProvidersView({ catalog }: { catalog: Offer[] }) {
  return <>
    <PageHead eyebrow="Relationships" title="Providers" description="See coverage, affiliate readiness, and trust data without opening every record." />
    <div className={styles.provider_list}>{providers.map((provider) => { const related = catalog.filter((offer) => offer.providerId === provider.id); const affiliates = related.filter((offer) => offer.affiliate).length; return <article key={provider.id} className={styles.provider_row}><div className={styles.provider_identity}><ProviderLogo provider={provider} size={42} /><span><strong>{provider.name}</strong><small>{provider.hq} · {related.length} catalog {related.length === 1 ? "offer" : "offers"}</small></span></div><div><span>Trust snapshot</span><strong>{provider.trustpilotScore == null ? "Missing" : `${provider.trustpilotScore.toFixed(1)} / 5`}</strong></div><div><span>Affiliate coverage</span><strong>{related.length ? `${affiliates} of ${related.length}` : "No offers"}</strong></div><div className={styles.provider_note}><span>Operator note</span><p>{provider.note}</p></div><a href={provider.site} target="_blank" rel="noreferrer" className={styles.icon_button} aria-label={`Open ${provider.name}`}><ArrowSquareOut size={17} /></a></article>; })}</div>
  </>;
}

function QualityView({ issues, onEdit }: { issues: Array<{ id: string; severity: "high" | "medium"; title: string; detail: string; offer?: Offer }>; onEdit: (offer: Offer) => void }) {
  const blocking = issues.filter((issue) => issue.severity === "high").length;
  return <>
    <PageHead eyebrow="Validation" title="Data quality" description="A small, actionable queue—no charts hiding what needs to be fixed." action={<div className={styles.quality_summary}><strong>{blocking}</strong><span>blocking</span><strong>{issues.length - blocking}</strong><span>review</span></div>} />
    <div className={styles.quality_list}>{issues.map((issue) => <article key={issue.id} className={styles.quality_row}><span className={issue.severity === "high" ? styles.issue_high : styles.issue_medium}><WarningCircle size={18} weight="fill" /></span><div><strong>{issue.title}</strong><p>{issue.detail}</p></div><StatusPill tone={issue.severity === "high" ? "warn" : "quiet"}>{issue.severity === "high" ? "Blocking" : "Review"}</StatusPill>{issue.offer ? <button className={styles.secondary_button} onClick={() => issue.offer && onEdit(issue.offer)}>Fix record</button> : <span />}</article>)}{!issues.length && <div className={styles.empty_state}><CheckCircle size={28} weight="fill" /><strong>Everything passes</strong><span>No missing, stale, or low-confidence records were found.</span></div>}</div>
  </>;
}

function PriceHistogram({ catalog }: { catalog: Offer[] }) {
  const buckets = [
    { label: "<5", count: catalog.filter((offer) => usd(offer) != null && usd(offer)! < 5).length },
    { label: "5–10", count: catalog.filter((offer) => usd(offer) != null && usd(offer)! >= 5 && usd(offer)! < 10).length },
    { label: "10–15", count: catalog.filter((offer) => usd(offer) != null && usd(offer)! >= 10 && usd(offer)! < 15).length },
    { label: "15–20", count: catalog.filter((offer) => usd(offer) != null && usd(offer)! >= 15 && usd(offer)! < 20).length },
    { label: "20+", count: catalog.filter((offer) => usd(offer) != null && usd(offer)! >= 20).length },
  ];
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1);
  return <section className={styles.price_histogram}><div className={styles.histogram_axis}><span>offers</span><i /><i /><i /></div><div className={styles.histogram_bars}>{buckets.map((bucket) => <div key={bucket.label}><span><b style={{ height: `${Math.max(8, percentage(bucket.count, max))}%` }}><em>{bucket.count}</em></b></span><small>${bucket.label}</small></div>)}</div></section>;
}

function AnalyticsView({ catalog, analytics }: { catalog: Offer[]; analytics: AnalyticsSnapshot }) {
  const available = catalog.filter((offer) => offer.available);
  const affiliate = catalog.filter((offer) => offer.affiliate);
  const direct = catalog.filter((offer) => !offer.affiliate);
  const fresh = catalog.filter((offer) => daysOld(offer.checkedAt) <= 14);
  const highConfidence = catalog.filter((offer) => offer.confidence === "high");
  const completeRenewal = catalog.filter((offer) => offer.renewalMonthly != null);
  const stats = priceStats(available);
  const avgPrice = stats.average;
  const medianPrice = stats.median;
  const lowestPrice = stats.min;
  const highestPrice = stats.max;
  const providerRows = providers.map((provider) => {
    const related = catalog.filter((offer) => offer.providerId === provider.id);
    return { provider, count: related.length, affiliate: related.filter((offer) => offer.affiliate).length, avg: priceStats(related).average };
  }).filter((row) => row.count).sort((a, b) => b.count - a.count || (a.avg == null ? b.avg == null ? 0 : 1 : b.avg == null ? -1 : a.avg - b.avg));
  const pricingSpread = stats.max == null || stats.min == null ? null : stats.max - stats.min;

  return <>
    <PageHead eyebrow="Measurement system" title="Analytics" description="What is known now, what must be measured next, and every parameter needed to operate the product." />
    <div className={styles.analytics_lead}>
      <section className={styles.analytics_known}><div className={styles.section_head}><div><span>Available now</span><h2>Catalog intelligence</h2></div><StatusPill tone={catalog.length ? "good" : "quiet"}>{catalog.length ? "Live data" : "Not collected yet"}</StatusPill></div><p>Calculated directly from the current offer and provider records.</p><div><span><small>Lowest monthly</small><strong className="num">{catalog.length ? `${formatMoney(lowestPrice, "USD")}` : "Not collected yet"}</strong></span><span><small>Median monthly</small><strong className="num">{catalog.length ? `${formatMoney(medianPrice, "USD")}` : "Not collected yet"}</strong></span><span><small>Highest monthly</small><strong className="num">{catalog.length ? `${formatMoney(highestPrice, "USD")}` : "Not collected yet"}</strong></span><span><small>Commercial coverage</small><strong className="num">{catalog.length ? `${percentage(affiliate.length, catalog.length)}%` : "Not collected yet"}</strong></span></div></section>
      <section className={styles.analytics_next}><div className={styles.section_head}><div><span>Coverage gaps</span><h2>Business measurement</h2></div><StatusPill tone="warn">Partial</StatusPill></div><p>First-party page, search, compare, and outbound events are active. External search and affiliate reports still need an operating cadence.</p><ol><li><b>01</b><span><strong>Expand behavior</strong><small>Offer-detail views, filter dimensions, and zero-result searches</small></span></li><li><b>02</b><span><strong>Reconcile revenue</strong><small>Import confirmed conversions, commissions, reversals, and payouts</small></span></li><li><b>03</b><span><strong>Add acquisition</strong><small>Search Console performance and campaign source summaries</small></span></li></ol></section>
    </div>
    <section className={styles.analytics_kpis} aria-label="Catalog analytics">
      <article><span>Available inventory</span><strong className="num">{available.length}</strong><small>{percentage(available.length, catalog.length)}% of all records</small></article>
      <article><span>Median monthly</span><strong className="num">{catalog.length ? `${formatMoney(medianPrice, "USD")}` : "Not collected yet"}</strong><small>{catalog.length ? `mean ${formatMoney(avgPrice, "USD")}` : "No catalog records"}</small></article>
      <article><span>Affiliate coverage</span><strong className="num">{percentage(affiliate.length, catalog.length)}%</strong><small>{affiliate.length} monetized · {direct.length} direct</small></article>
      <article><span>Freshness</span><strong className="num">{percentage(fresh.length, catalog.length)}%</strong><small>{fresh.length} checked in 14 days</small></article>
      <article><span>Price spread</span><strong className="num">{formatMoney(pricingSpread, "USD")}</strong><small>lowest to highest monthly</small></article>
      
    </section>

    <LiveClickSnapshot catalog={catalog} analytics={analytics} />

    <div className={styles.analytics_grid}>
      <PriceHistogram catalog={catalog} />
      <section className={styles.health_panel}><div className={styles.analytics_panel_head}><div><h2>Data health</h2><p>Readiness for trustworthy public comparison</p></div><strong className="num">{percentage(fresh.length + highConfidence.length + completeRenewal.length, catalog.length * 3)}%</strong></div><div className={styles.health_rows}><HealthRow label="Checked within 14 days" value={fresh.length} total={catalog.length} /><HealthRow label="High-confidence source" value={highConfidence.length} total={catalog.length} /><HealthRow label="Renewal price present" value={completeRenewal.length} total={catalog.length} /><HealthRow label="Currently available" value={available.length} total={catalog.length} /></div></section>
    </div>
    <CountryCoverageTable catalog={catalog} />
    <VisitorGeographyTable analytics={analytics} />
    <ClickPerformanceTable catalog={catalog} analytics={analytics} />

    <section className={styles.analytics_table_section}><div className={styles.section_head}><div><span>Provider economics</span><h2>Coverage and price by provider</h2></div><small>{providerRows.length} providers with catalog inventory</small></div><div className={styles.table_frame}><table className={styles.data_table}><thead><tr><th>Provider</th><th>Offers</th><th>Affiliate</th><th>Coverage</th><th>Average monthly</th><th>Trust snapshot</th></tr></thead><tbody>{providerRows.map((row) => <tr key={row.provider.id}><td><div className={styles.offer_name}><ProviderLogo provider={row.provider} size={30} /><span><strong>{row.provider.name}</strong><small>{row.provider.hq}</small></span></div></td><td><strong className="num">{row.count}</strong></td><td><strong className="num">{row.affiliate}</strong></td><td><strong className="num">{percentage(row.affiliate, row.count)}%</strong></td><td><strong className="num">{formatMoney(row.avg, "USD")}</strong></td><td><strong>{row.provider.trustpilotScore?.toFixed(1) ?? "Missing"}</strong></td></tr>)}</tbody></table></div></section>

    <section className={styles.opportunity_panel}><div><span>Commercial opportunity</span><h2>{direct.length} direct-link offers have no affiliate attribution.</h2><p>This is not automatically a problem. Prioritize providers with strong catalog fit, reliable programs, and enough user intent to justify partnership work.</p></div><div>{direct.slice(0, 8).map((offer) => <span key={offer.id}><ProviderLogo provider={resolveOfferProvider(offer)} size={26} /><b>{resolveOfferProvider(offer).name}</b><small>{offer.productName}</small></span>)}</div></section>

    <section className={styles.connection_panel}><div className={styles.connection_icon}><ChartLineUp size={22} /></div><div><StatusPill tone={analytics.pageViews || analytics.clicks ? "good" : "quiet"}>{analytics.pageViews || analytics.clicks ? "First-party events" : "Not collected yet"}</StatusPill><h2>Traffic and commercial outcomes</h2><p>{analytics.pageViews || analytics.clicks ? `The last ${analytics.days} days include ${analytics.pageViews} page views and ${analytics.clicks} outbound clicks. Conversion data is shown only when a confirmed affiliate report has been imported.` : "No first-party events or affiliate conversion reports have been collected for this period yet."}</p></div><button className={styles.secondary_button} disabled aria-disabled="true">Read-only report</button></section>
    <section className={styles.metric_strip} aria-label="Measured funnel analytics"><div><span>Guide actions</span><strong className="num">{analytics.guideClicks}</strong><small>tracked internal links</small></div><div><span>Outbound clicks</span><strong className="num">{analytics.clicks}</strong><small>{analytics.uniqueClickSessions} unique sessions</small></div><div><span>Outbound rate</span><strong className="num">{(analytics.outboundRate * 100).toFixed(1)}%</strong><small>{analytics.uniqueVisitors} unique visitors</small></div><div><span>Confirmed conversions</span><strong className="num">{analytics.confirmedConversions}</strong><small>{analytics.confirmedConversions ? `${(analytics.conversionRate * 100).toFixed(1)}% of clicks` : "Not collected yet"}</small></div><div><span>Approved commission</span><strong className="num">{analytics.confirmedConversions ? `€${analytics.commission.toFixed(2)}` : "Not collected yet"}</strong><small>{analytics.confirmedConversions ? `EPC €${analytics.epc.toFixed(2)}` : "Affiliate report required"}</small></div></section>
    <AdminMetricInventory />
    <div className={styles.analytics_steps}><span>Measurement implementation</span><ol><li><strong>01</strong><p><b>Capture</b> Offer ID, provider, placement, referrer class, country group, device class, and timestamp.</p></li><li><strong>02</strong><p><b>Protect</b> Respect Do Not Track, avoid raw IP storage, redact query strings, and expire events automatically.</p></li><li><strong>03</strong><p><b>Reconcile</b> Import provider conversion IDs, commission amount, status, and payout date.</p></li><li><strong>04</strong><p><b>Decide</b> Compare intent and commercial outcomes while keeping commission outside editorial rank.</p></li></ol></div>
  </>;
}

function LiveClickSnapshot({ catalog, analytics }: { catalog: Offer[]; analytics: AnalyticsSnapshot }) {
  const offerById = new Map(catalog.map((offer) => [offer.id, offer]));
  const providerById = new Map(providers.map((provider) => [provider.id, provider]));
  return <section className={styles.analytics_table_section} aria-label="Live click analytics">
    <div className={styles.section_head}><div><span>Last {analytics.days} days</span><h2>What visitors actually click</h2></div><StatusPill tone={analytics.clicks ? "good" : "quiet"}>{analytics.clicks ? "Live events" : "No clicks yet"}</StatusPill></div>
    <div className={styles.analytics_kpis}>
      <article><span>Unique visitors</span><strong className="num">{analytics.uniqueVisitors}</strong><small>privacy-safe visitor IDs</small></article>
      <article><span>Outbound clicks</span><strong className="num">{analytics.clicks}</strong><small>{analytics.uniqueClickSessions} unique sessions</small></article>
      <article><span>Click-through rate</span><strong className="num">{(analytics.ctr * 100).toFixed(1)}%</strong><small>{analytics.pageViews} page views</small></article>
      <article><span>Confirmed conversions</span><strong className="num">{analytics.confirmedConversions}</strong><small>{(analytics.conversionRate * 100).toFixed(1)}% of clicks</small></article>
      <article><span>Commission</span><strong className="num">€{analytics.commission.toFixed(2)}</strong><small>EPC €{analytics.epc.toFixed(2)}</small></article>
      <article><span>Top placement</span><strong>{analytics.byPlacement[0]?.id ?? "—"}</strong><small>{analytics.byPlacement[0]?.clicks ?? 0} clicks</small></article>
      <article><span>Countries</span><strong className="num">{analytics.byCountry.length}</strong><small>country-level only</small></article>
    </div>
    <div className={styles.click_table_scroll}><table className={styles.click_table}><thead><tr><th>Rank</th><th>VPS offer</th><th>Clicks</th><th>Unique sessions</th><th>Last click</th></tr></thead><tbody>{analytics.byOffer.length ? analytics.byOffer.slice(0, 12).map((row, index) => { const offer = offerById.get(row.id); const provider = offer ? resolveOfferProvider(offer) : providerById.get(""); return <tr key={row.id}><td className="num">{index + 1}</td><td><strong>{offer?.productName ?? row.id}</strong><small>{provider?.name ?? "Unknown provider"}</small></td><td className="num">{row.clicks}</td><td className="num">{row.sessions}</td><td>{row.lastClick ? new Date(row.lastClick).toLocaleDateString() : "—"}</td></tr>; }) : <tr><td colSpan={5}>No outbound clicks recorded yet.</td></tr>}</tbody></table></div>
    <div className={styles.compact_table_scroll}><table className={styles.compact_analytics_table}><thead><tr><th>Country</th><th>Visitors</th><th>Sessions</th><th>Clicks</th></tr></thead><tbody>{analytics.byCountry.length ? analytics.byCountry.map((row) => <tr key={row.code}><td><span className={styles.country_name}><b aria-hidden>{flagEmoji(row.code)}</b><strong>{countryNames[row.code] ?? row.code}</strong></span></td><td className="num">{row.visitors}</td><td className="num">{row.sessions}</td><td className="num">{row.clicks}</td></tr>) : <tr><td colSpan={4}>Not collected yet — country data appears after privacy-safe events.</td></tr>}</tbody></table></div>
    <div className={styles.compact_table_scroll}><table className={styles.compact_analytics_table}><thead><tr><th>Provider</th><th>Clicks</th><th>Sessions</th></tr></thead><tbody>{analytics.byProvider.length ? analytics.byProvider.map((row) => <tr key={row.id}><td><strong>{resolveProvider(row.id).name}</strong></td><td className="num">{row.clicks}</td><td className="num">{row.sessions}</td></tr>) : <tr><td colSpan={3}>Not collected yet — provider clicks appear after outbound events.</td></tr>}</tbody></table></div>
    <div className={styles.compact_table_scroll}><table className={styles.compact_analytics_table}><thead><tr><th>Placement</th><th>Clicks</th><th>Share</th></tr></thead><tbody>{analytics.byPlacement.length ? analytics.byPlacement.map((row) => <tr key={row.id}><td><strong>{row.id}</strong></td><td className="num">{row.clicks}</td><td className="num">{analytics.clicks ? `${((row.clicks / analytics.clicks) * 100).toFixed(1)}%` : "0.0%"}</td></tr>) : <tr><td colSpan={3}>Not collected yet — placement data appears after outbound events.</td></tr>}</tbody></table></div>
  </section>;
}

function HealthRow({ label, value, total }: { label: string; value: number; total: number }) {
  const score = percentage(value, total);
  return <div><span><b>{label}</b><em>{value} / {total}</em></span><i><b style={{ width: `${score}%` }} /></i><strong className="num">{score}%</strong></div>;
}

const countryNames: Record<string, string> = {
  AU: "Australia", BG: "Bulgaria", BR: "Brazil", CA: "Canada", CH: "Switzerland",
  DE: "Germany", DK: "Denmark", ES: "Spain", FI: "Finland", FR: "France",
  GB: "United Kingdom", UK: "United Kingdom", HK: "Hong Kong", IE: "Ireland",
  IL: "Israel", IN: "India", IS: "Iceland", JP: "Japan", LT: "Lithuania",
  LU: "Luxembourg", LV: "Latvia", NL: "Netherlands", NO: "Norway", PL: "Poland",
  SE: "Sweden", SG: "Singapore", US: "United States",
};

function flagEmoji(code: string) {
  const normalized = code === "UK" ? "GB" : code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return "🌐";
  return String.fromCodePoint(...[...normalized].map((letter) => 127397 + letter.charCodeAt(0)));
}

function CountryCoverageTable({ catalog }: { catalog: Offer[] }) {
  const codes = Array.from(new Set(catalog.flatMap((offer) => offer.locations).map((code) => code === "UK" ? "GB" : code))).sort();
  const rows = codes.map((code) => {
    const related = catalog.filter((offer) => offer.locations.some((location) => (location === "UK" ? "GB" : location) === code));
    const cheapest = related.filter((offer) => usd(offer) != null).sort((a, b) => usd(a)! - usd(b)!)[0];
    return {
      code,
      name: countryNames[code] ?? code,
      offers: related.length,
      providers: new Set(related.map((offer) => offer.providerId)).size,
      affiliate: related.filter((offer) => offer.affiliate).length,
      average: priceStats(related).average,
      cheapest,
    };
  }).sort((a, b) => b.offers - a.offers || a.name.localeCompare(b.name));
  return <section className={styles.country_section}><div className={styles.section_head}><div><span>Location coverage</span><h2>Country inventory</h2></div><small>{rows.length} countries · scroll to see all</small></div><div className={styles.compact_table_scroll}><table className={styles.compact_analytics_table}><thead><tr><th>Country</th><th>Offers</th><th>Providers</th><th>Affiliate</th><th>Coverage</th><th>Average / mo</th><th>Cheapest plan</th></tr></thead><tbody>{rows.map((row) => <tr key={row.code}><td><span className={styles.country_name}><b aria-hidden>{flagEmoji(row.code)}</b><span><strong>{row.name}</strong><small>{row.code}</small></span></span></td><td className="num">{row.offers}</td><td className="num">{row.providers}</td><td className="num">{row.affiliate}</td><td className="num">{percentage(row.affiliate, row.offers)}%</td><td className="num">{formatMoney(row.average, "USD")}</td><td><span className={styles.cheapest_offer}><strong>{row.cheapest?.productName ?? "—"}</strong><small>{row.cheapest ? `${resolveOfferProvider(row.cheapest).name} · ${money(row.cheapest)}` : "No offer"}</small></span></td></tr>)}</tbody></table></div></section>;
}

function ClickPerformanceTable({ catalog, analytics }: { catalog: Offer[]; analytics: AnalyticsSnapshot }) {
  const offerById = new Map(catalog.map((offer) => [offer.id, offer]));
  return <section className={styles.click_section}><div className={styles.section_head}><div><span>VPS performance</span><h2>Most-clicked plans</h2></div><StatusPill tone={analytics.byOffer.length ? "good" : "quiet"}>{analytics.byOffer.length ? "Measured" : "Not collected yet"}</StatusPill></div><p className={styles.panel_intro}>Sorted from recorded outbound clicks. A plan only appears here after a real visitor event; no estimates or empty catalog rows are shown.</p><div className={styles.click_table_scroll}><table className={styles.click_table}><thead><tr><th>Rank</th><th>VPS offer</th><th>Clicks</th><th>Unique sessions</th><th>Share</th><th>Last click</th></tr></thead><tbody>{analytics.byOffer.length ? analytics.byOffer.map((row, index) => { const offer = offerById.get(row.id); const provider = offer ? resolveOfferProvider(offer) : resolveProvider(row.id); return <tr key={row.id}><td className="num">{index + 1}</td><td><div className={styles.offer_name}><ProviderLogo provider={provider} size={28} /><span><strong>{offer?.productName ?? row.id}</strong><small>{provider.name}{offer ? ` · ${money(offer)}` : " · offer no longer in catalog"}</small></span></div></td><td className="num">{row.clicks}</td><td className="num">{row.sessions}</td><td className="num">{analytics.clicks ? `${((row.clicks / analytics.clicks) * 100).toFixed(1)}%` : "0.0%"}</td><td>{row.lastClick ? new Date(row.lastClick).toLocaleDateString() : "—"}</td></tr>; }) : <tr><td colSpan={6}>Not collected yet — real outbound clicks will populate this table.</td></tr>}</tbody></table></div><div className={styles.click_parameters}><span>Event coverage</span><code>offer_id</code><code>provider_id</code><code>placement</code><code>visitor_id</code><code>occurred_at</code></div></section>;
}

function VisitorGeographyTable({ analytics }: { analytics: AnalyticsSnapshot }) {
  return <section className={styles.visitor_country_section}><div className={styles.section_head}><div><span>Audience geography</span><h2>Visitor countries</h2></div><StatusPill tone={analytics.byCountry.length ? "good" : "quiet"}>{analytics.byCountry.length ? "Measured" : "Not collected yet"}</StatusPill></div><p className={styles.panel_intro}>Country-level totals use privacy-safe event data. Precise location and raw IP addresses are never required.</p><div className={styles.visitor_table_scroll}><table className={styles.visitor_table}><thead><tr><th>Visitor country</th><th>Visitors</th><th>Sessions</th><th>Clicks</th><th>Share of clicks</th></tr></thead><tbody>{analytics.byCountry.length ? analytics.byCountry.map((row) => <tr key={row.code}><td><span className={styles.country_name}><b aria-hidden>{flagEmoji(row.code)}</b><span><strong>{countryNames[row.code] ?? row.code}</strong><small>{row.code}</small></span></span></td><td className="num">{row.visitors}</td><td className="num">{row.sessions}</td><td className="num">{row.clicks}</td><td className="num">{analytics.clicks ? `${((row.clicks / analytics.clicks) * 100).toFixed(1)}%` : "0.0%"}</td></tr>) : <tr className={styles.visitor_empty_row}><td colSpan={5}>Not collected yet — country totals appear after privacy-safe events.</td></tr>}</tbody></table></div><div className={styles.click_parameters}><span>Privacy boundary</span><code>country_group</code><code>visitor_id</code><code>event_name</code><code>occurred_at</code></div></section>;
}

function ImportsView({ count, onExport, onImport, onReset }: { count: number; onExport: () => void; onImport: () => void; onReset: () => void }) {
  const router = useRouter();
  return <>
    <PageHead eyebrow="Browser portability" title="Draft files" description="Move temporary review drafts between browsers without changing the published catalog." />
    <div className={styles.action_grid}><button onClick={() => router.push("/admin/imports")}><Database size={22} /><span><strong>Reviewed CSV publication</strong><small>Stage, validate, approve, publish, or roll back database snapshots.</small></span><ArrowRight size={17} /></button><button onClick={onExport}><Export size={22} /><span><strong>Export draft JSON</strong><small>Download all {count} records in this browser workspace.</small></span><ArrowRight size={17} /></button><button onClick={onImport}><FileArrowUp size={22} /><span><strong>Import draft JSON</strong><small>Replace this browser workspace with a validated admin export.</small></span><ArrowRight size={17} /></button><button onClick={onReset}><ClockCounterClockwise size={22} /><span><strong>Discard browser drafts</strong><small>Return this view to the current published database snapshot.</small></span><ArrowRight size={17} /></button></div>
    <div className={styles.note_panel}><Database size={18} /><p><strong>Draft JSON is browser-only.</strong> It cannot publish data. Use the reviewed CSV publication workflow for durable database changes visible to visitors.</p></div>
  </>;
}

/** An interrupted action request rejects instead of returning feedback — convert it so the form can retry. */
export async function requestHomeXraySave(action: (formData: FormData) => Promise<AdminActionResult>, data: FormData): Promise<AdminActionResult> {
  try {
    return await action(data);
  } catch {
    return { ok: false, status: "server_error", message: "The save request did not complete. Your selection and reason are still open.", requestId: null };
  }
}

export function SettingsView({ homeXray, offers }: { homeXray: { current: string | null; reason: string | null; action: (formData: FormData) => Promise<AdminActionResult> }; offers: Offer[] }) {
  const [checks, setChecks] = useState({ stale: true, missingRenewal: true, lowConfidence: true, affiliate: false });
  const [analytics, setAnalytics] = useState({ respectDnt: true, redactQueries: true, countryOnly: true, attributionDays: 30, retentionDays: 180 });
  const [xrayPending, setXrayPending] = useState(false);
  const [xrayFeedback, setXrayFeedback] = useState<AdminActionResult | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ANALYTICS_SETTINGS_KEY);
      if (saved) setAnalytics(JSON.parse(saved) as typeof analytics);
    } catch { /* Keep privacy-first defaults. */ }
  }, []);

  function updateAnalytics(next: typeof analytics) {
    setAnalytics(next);
    localStorage.setItem(ANALYTICS_SETTINGS_KEY, JSON.stringify(next));
  }

  async function submitXray(data: FormData) {
    setXrayPending(true);
    setXrayFeedback(null);
    try {
      setXrayFeedback(await requestHomeXraySave(homeXray.action, data));
    } finally {
      setXrayPending(false);
    }
  }

  return <>
    <PageHead eyebrow="Rules and measurement" title="Settings" description="Review browser-saved policy preferences alongside the enforced server controls." />
    <section className={styles.settings_group}><div><h2>Quality policy notes</h2><p>These browser-only preferences are planning references; the server validates each publication against its enforced rules.</p></div>{[{ key: "stale" as const, title: "Stale price checks", note: "Planning target: warn after 14 days without verification." }, { key: "missingRenewal" as const, title: "Missing renewal price", note: "Planning target: block publishing when renewal is unknown." }, { key: "lowConfidence" as const, title: "Low-confidence data", note: "Planning target: send uncertain records to review." }, { key: "affiliate" as const, title: "Missing affiliate link", note: "Planning target: treat commercial gaps as editorial warnings." }].map((item) => <label key={item.key} className={styles.setting_row}><span><strong>{item.title}</strong><small>{item.note}</small></span><input type="checkbox" checked={checks[item.key]} onChange={(event) => setChecks((current) => ({ ...current, [item.key]: event.target.checked }))} /></label>)}</section>
    <section className={styles.settings_group}><div><h2>Homepage X-ray</h2><p>The plan featured in the homepage price X-ray. Saved to the database and visible to every visitor; the server only accepts published plans with a reviewed catch and a real price at least 20% above the advertised price.</p></div>{xrayFeedback ? <div className={`${styles.form_feedback} ${styles[`feedback_${xrayFeedback.status}`]}`} role={xrayFeedback.status === "success" ? "status" : "alert"}><WarningCircle size={18} weight="fill" aria-hidden /><span><strong>{xrayFeedback.status === "success" ? "Saved" : xrayFeedback.status === "validation_error" ? "Check the form" : xrayFeedback.status === "authorization_error" ? "Sign in required" : "Save failed"}</strong><small>{xrayFeedback.message}{xrayFeedback.requestId ? <> <code>Request {xrayFeedback.requestId}</code></> : null}</small></span></div> : null}<form className={styles.setting_row} onSubmit={(event) => { event.preventDefault(); void submitXray(new FormData(event.currentTarget)); }}><span><label htmlFor="home-xray-offer"><strong>X-ray plan</strong></label><small>{homeXray.current ? `Current pick: ${homeXray.current}` : "No pick saved — the largest eligible gap is used."}</small></span><span className="row" style={{ display: "flex", gap: 8, flexDirection: "column", alignItems: "stretch" }}><select id="home-xray-offer" name="offerId" defaultValue={homeXray.current ?? ""} required>{offers.map((offer) => <option key={offer.id} value={offer.id} disabled={!isXrayEligible(offer)}>{resolveOfferProvider(offer).name} · {offer.productName}{isXrayEligible(offer) ? "" : " (ineligible)"}</option>)}</select><input name="reason" required maxLength={1000} placeholder="Why this plan? e.g. reviewed renewal jumps 70% after month 12" defaultValue={homeXray.reason ?? ""} aria-label="Selection reason" /><button type="submit" className={styles.secondary_button} disabled={xrayPending}>{xrayPending ? "Saving…" : "Save"}</button></span></form></section>
    <section className={styles.danger_zone}><div><strong>Authenticated owner route</strong><p>Sessions, CSRF tokens, and every database mutation are verified on the server.</p></div><StatusPill tone="good">Protected</StatusPill></section>
    <section className={styles.settings_group_section}><div className={styles.settings_intro}><GlobeHemisphereWest size={19} /><div><h2>Analytics policy notes</h2><p>These browser-saved preferences document intended policy; runtime ingestion follows the enforced analytics contract and privacy rules.</p></div></div><div className={styles.settings_controls}><label className={styles.setting_row}><span><strong>Respect Do Not Track</strong><small>Do not create analytics events when the browser requests privacy.</small></span><input type="checkbox" checked={analytics.respectDnt} onChange={(event) => updateAnalytics({ ...analytics, respectDnt: event.target.checked })} /></label><label className={styles.setting_row}><span><strong>Redact URL query strings</strong><small>Store route patterns and placements without potentially sensitive parameters.</small></span><input type="checkbox" checked={analytics.redactQueries} onChange={(event) => updateAnalytics({ ...analytics, redactQueries: event.target.checked })} /></label><label className={styles.setting_row}><span><strong>Country-level geography only</strong><small>Avoid precise location storage; aggregate reporting by country group.</small></span><input type="checkbox" checked={analytics.countryOnly} onChange={(event) => updateAnalytics({ ...analytics, countryOnly: event.target.checked })} /></label><label className={styles.setting_select}><span><strong>Attribution window</strong><small>Maximum time between outbound click and reported conversion.</small></span><select value={analytics.attributionDays} onChange={(event) => updateAnalytics({ ...analytics, attributionDays: Number(event.target.value) })}><option value="7">7 days</option><option value="30">30 days</option><option value="60">60 days</option><option value="90">90 days</option></select></label><label className={styles.setting_select}><span><strong>Event retention</strong><small>Automatically delete raw event-level data after this period.</small></span><select value={analytics.retentionDays} onChange={(event) => updateAnalytics({ ...analytics, retentionDays: Number(event.target.value) })}><option value="30">30 days</option><option value="90">90 days</option><option value="180">180 days</option><option value="365">1 year</option></select></label></div></section>
    <section className={styles.measurement_schema}><span>Event and report fields</span><div>{["offer_id", "provider_id", "placement", "page_route", "referrer_class", "country_group", "device_class", "occurred_at", "conversion_id", "commission_amount"].map((field) => <code key={field}>{field}</code>)}</div><p>First-party events exclude email, account identity, full IP addresses, and raw search queries. Conversion fields arrive through reviewed affiliate reports.</p></section>
  </>;
}

function ActivityView({ activity }: { activity: Activity[] }) {
  return <>
    <PageHead eyebrow="Local history" title="Activity" description="A lightweight record of changes made in this browser." />
    <div className={styles.activity_list}>{activity.map((entry) => <div key={entry.id}><span className={styles.activity_dot} /><p><strong>{entry.text}</strong><time dateTime={entry.time}>{new Date(entry.time).toLocaleString()}</time></p></div>)}{!activity.length && <div className={styles.empty_state}><ClockCounterClockwise size={26} /><strong>No local activity yet</strong><span>Edits, imports, exports, and restores will appear here.</span></div>}</div>
  </>;
}

function OfferDrawer({ initial, isNew, onClose, onSave }: { initial: Offer; isNew: boolean; onClose: () => void; onSave: (offer: Offer) => Promise<AdminActionResult> }) {
  const [draft, setDraft] = useState(initial);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<AdminActionResult | null>(null);
  const drawerRef = useRef<HTMLFormElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, []);
  const number = (key: keyof Offer, value: string) => setDraft((current) => ({ ...current, [key]: value === "" ? null : Number(value) }));
  async function submit() {
    setPending(true);
    setFeedback(null);
    const result = await onSave(draft);
    if (result.ok) { onClose(); return; }
    setPending(false);
    setFeedback(result);
  }
  return <div className={styles.drawer_layer} role="dialog" aria-modal="true" aria-label={isNew ? "New offer" : `Edit ${initial.productName}`}><button type="button" className={styles.drawer_scrim} onClick={pending ? undefined : onClose} aria-label="Close editor" /><form ref={drawerRef} className={styles.drawer} aria-busy={pending} onSubmit={(event) => { event.preventDefault(); void submit(); }}><header><div><span>{isNew ? "New catalog record" : `${resolveOfferProvider(draft).name} · ${draft.sku}`}</span><h2>{isNew ? "Add offer" : "Edit offer"}</h2></div><button ref={closeRef} type="button" className={styles.icon_button} onClick={onClose} aria-label="Close" disabled={pending}><X size={18} aria-hidden /></button></header><div className={styles.drawer_body}>{feedback ? <div className={`${styles.form_feedback} ${styles[`feedback_${feedback.status}`]}`} role="alert"><WarningCircle size={18} weight="fill" aria-hidden /><span><strong>{feedback.status === "conflict" ? "This form is stale" : feedback.status === "authorization_error" ? "Authorization failed" : feedback.status === "validation_error" ? "Check the form" : "Server error"}</strong><small>{feedback.message}{feedback.requestId ? <> <code>Request {feedback.requestId}</code></> : null}</small></span></div> : null}<label>Provider<select value={draft.providerId} onChange={(event) => setDraft((current) => ({ ...current, providerId: event.target.value }))}>{providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}</select></label><div className={styles.field_pair}><label>Product name<input value={draft.productName} onChange={(event) => setDraft((current) => ({ ...current, productName: event.target.value }))} required /></label><label>SKU<input value={draft.sku} onChange={(event) => setDraft((current) => ({ ...current, sku: event.target.value }))} required /></label></div><div className={styles.field_triplet}><label>vCPU<input type="number" min="1" value={draft.vcpu ?? ""} onChange={(event) => number("vcpu", event.target.value)} /></label><label>RAM (GB)<input type="number" min="0" value={draft.ramGb ?? ""} onChange={(event) => number("ramGb", event.target.value)} /></label><label>Disk (GB)<input type="number" min="0" value={draft.diskGb ?? ""} onChange={(event) => number("diskGb", event.target.value)} /></label></div><div className={styles.field_pair}><label>Effective monthly<input type="number" min="0" step="0.01" value={draft.effectiveMonthly} onChange={(event) => number("effectiveMonthly", event.target.value)} /></label><label>Renewal monthly<input type="number" min="0" step="0.01" value={draft.renewalMonthly ?? ""} onChange={(event) => setDraft((current) => ({ ...current, renewalMonthly: event.target.value === "" ? null : Number(event.target.value) }))} /></label></div><label>Provider URL<input type="url" value={draft.url} onChange={(event) => setDraft((current) => ({ ...current, url: event.target.value }))} required /></label><label>Why it fits<textarea rows={3} value={draft.whyFit ?? ""} onChange={(event) => setDraft((current) => ({ ...current, whyFit: event.target.value }))} /></label><label>The catch<textarea rows={3} value={draft.catch ?? ""} onChange={(event) => setDraft((current) => ({ ...current, catch: event.target.value }))} /></label><div className={styles.toggle_grid}><label><input type="checkbox" checked={draft.available} onChange={(event) => setDraft((current) => ({ ...current, available: event.target.checked }))} /><span><strong>Available</strong><small>Visible in live inventory</small></span></label><label><input type="checkbox" checked={draft.affiliate} onChange={(event) => setDraft((current) => ({ ...current, affiliate: event.target.checked }))} /><span><strong>Affiliate</strong><small>Outbound link can earn commission</small></span></label></div></div><footer><span>{pending ? "Saving securely…" : isNew ? "Local draft until reviewed publication" : "Audited database save"}</span><div><button type="button" className={styles.secondary_button} onClick={onClose} disabled={pending}>Cancel</button><button type="submit" className={styles.primary_button} disabled={pending}>{pending ? <ClockCounterClockwise size={16} aria-hidden /> : <Check size={16} weight="bold" aria-hidden />} {pending ? "Saving…" : "Save changes"}</button></div></footer></form></div>;
}

