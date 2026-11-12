"use client";

import { useState } from "react";
import styles from "./AdminConsole.module.css";

const metricCatalog = {
  Traffic: [
    ["Sessions", "Visits during a 30-minute activity window", "distinct session_id", "First-party events", "planned"],
    ["Unique visitors", "Approximate audience reach without accounts", "distinct anonymous_id", "First-party events", "planned"],
    ["Page views", "Total consumption across public routes", "count page_view", "First-party events", "planned"],
    ["Landing-page mix", "Which entry pages create useful sessions", "sessions by landing_route", "First-party events", "planned"],
    ["Referrer mix", "Search, community, direct, partner, and social acquisition", "sessions by referrer_class", "First-party events", "planned"],
    ["Country group", "Where demand comes from at a privacy-safe level", "sessions by country_group", "Edge event enrichment", "planned"],
    ["Device class", "Desktop, mobile, and tablet demand", "sessions by device_class", "First-party events", "planned"],
  ],
  "Product usage": [
    ["Catalog searches", "Demand expressed through free-text search", "count catalog_search", "Search events", "planned"],
    ["Zero-result rate", "Searches that fail to return an offer", "zero_result_searches ÷ searches", "Search events", "planned"],
    ["Filter usage", "Which technical parameters matter most", "filter_change by filter_key", "Catalog events", "planned"],
    ["Compare additions", "Offers users seriously consider", "count compare_add", "Compare events", "planned"],
    ["Compare completion", "Comparison sessions reaching the final table", "compare_open ÷ compare_add sessions", "Compare events", "planned"],
    ["Offer detail views", "Depth of interest in individual plans", "count offer_view", "Offer events", "planned"],
    ["Shortlist interaction", "Usage of featured homepage recommendations", "shortlist_click ÷ shortlist_view", "Homepage events", "planned"],
  ],
  Commercial: [
    ["Outbound clicks", "Visits sent to VPS providers", "count outbound_click", "Redirect events", "planned"],
    ["Outbound CTR", "How often offer interest becomes provider traffic", "outbound_clicks ÷ offer_views", "First-party events", "planned"],
    ["Conversions", "Confirmed purchases or qualified signups", "approved conversion_id", "Affiliate reports", "external"],
    ["Conversion rate", "Provider traffic that becomes a conversion", "conversions ÷ outbound_clicks", "Events + affiliate reports", "external"],
    ["Gross commission", "Commission before reversals", "sum commission_amount", "Affiliate reports", "external"],
    ["Approved revenue", "Commission that survived validation", "sum approved commission", "Affiliate reports", "external"],
    ["Earnings per click", "Commercial value of sent traffic", "approved revenue ÷ outbound_clicks", "Events + affiliate reports", "external"],
    ["Reversal rate", "Cancelled or rejected affiliate outcomes", "reversed conversions ÷ conversions", "Affiliate reports", "external"],
    ["Provider ROI", "Value of maintaining each partnership", "revenue - estimated maintenance cost", "Reports + operator time", "external"],
    ["Payout pipeline", "Approved, pending, and paid commission", "amount by payout_status", "Affiliate reports", "external"],
  ],
  Catalog: [
    ["Live offers", "Available public inventory", "available = true", "Offer catalog", "live"],
    ["Provider coverage", "Providers represented by active offers", "distinct provider_id", "Offer catalog", "live"],
    ["Affiliate coverage", "Catalog share using monetized links", "affiliate offers ÷ all offers", "Offer catalog", "live"],
    ["Price distribution", "Inventory position across price bands", "offers by effective_monthly bucket", "Offer catalog", "live"],
    ["Median effective price", "Typical normalized monthly cost", "median effective_monthly", "Offer catalog", "live"],
    ["Renewal uplift", "Difference between entry and renewal cost", "renewal_monthly - advertised_monthly", "Offer catalog", "live"],
    ["Resource value", "RAM, CPU, disk, and transfer per currency unit", "resource ÷ effective_monthly", "Offer catalog", "live"],
    ["Regional coverage", "Inventory accessible by geography", "offers by region/location", "Offer catalog", "live"],
  ],
  Quality: [
    ["Freshness", "Records verified within the allowed window", "fresh offers ÷ all offers", "Verification dates", "live"],
    ["High-confidence share", "Records backed by strong sources", "high confidence ÷ all offers", "Offer catalog", "live"],
    ["Field completeness", "Required comparison fields that are present", "populated required fields ÷ expected", "Validation jobs", "live"],
    ["Renewal completeness", "Offers with known renewal prices", "renewal present ÷ all offers", "Offer catalog", "live"],
    ["Broken outbound links", "Provider links returning errors", "failed URL checks", "Scheduled link checker", "planned"],
    ["Price-change alerts", "Material movement since the prior snapshot", "current vs previous effective price", "Snapshot history", "planned"],
    ["Import success rate", "Reliability of data ingestion", "successful rows ÷ submitted rows", "Import jobs", "planned"],
    ["Time to publish", "Operational speed from detection to live fix", "published_at - issue_created_at", "Audit history", "planned"],
  ],
  "SEO & content": [
    ["Search impressions", "How often pages appear in search results", "impressions", "Search Console", "external"],
    ["Organic clicks", "Visits earned from search", "clicks", "Search Console", "external"],
    ["Organic CTR", "Snippet effectiveness", "clicks ÷ impressions", "Search Console", "external"],
    ["Average position", "Typical ranking by query and page", "weighted average position", "Search Console", "external"],
    ["Indexed pages", "Public pages accepted into the search index", "valid indexed URLs", "Search Console", "external"],
    ["Content-assisted clicks", "Provider clicks preceded by research content", "outbound sessions with content touch", "Events", "planned"],
    ["Query-to-offer gap", "Demand with weak or missing inventory", "high-impression query with low matching offers", "Search + catalog", "external"],
  ],
} as const;

export function AdminMetricInventory() {
  const groups = Object.keys(metricCatalog) as Array<keyof typeof metricCatalog>;
  const [group, setGroup] = useState<(typeof groups)[number]>("Traffic");
  return <section className={styles.metric_inventory}><div className={styles.section_head}><div><span>Complete measurement catalog</span><h2>Every metric the product should eventually know</h2></div><small>{Object.values(metricCatalog).reduce((sum, rows) => sum + rows.length, 0)} defined metrics</small></div><div className={styles.metric_tabs}>{groups.map((item) => <button key={item} className={group === item ? styles.metric_tab_active : ""} onClick={() => setGroup(item)}>{item}<span>{metricCatalog[item].length}</span></button>)}</div><div className={styles.metric_table_wrap}><table className={styles.metric_table}><thead><tr><th>Metric</th><th>Why it matters</th><th>Definition</th><th>Source</th><th>Status</th></tr></thead><tbody>{metricCatalog[group].map(([name, meaning, formula, source, status]) => <tr key={name}><td><strong>{name}</strong></td><td>{meaning}</td><td><code>{formula}</code></td><td>{source}</td><td><span className={`${styles.pill} ${styles[status === "live" ? "pill_good" : status === "planned" ? "pill_quiet" : "pill_warn"]}`}>{status === "external" ? "External" : status === "planned" ? "Planned" : "Live"}</span></td></tr>)}</tbody></table></div></section>;
}
