"use client";

import type { CatalogPageData } from "@/lib/catalog-page";

import { Funnel, HandCoins, Rows, SquaresFour, X } from "@/components/catalog/IconSprite";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { activeFilterCount, HONESTY, REGION_BANDS } from "@/lib/catalog-controls";
import { WORKLOADS } from "@/lib/catalog-workloads";
import { PER_PAGE_OPTIONS, serializeCatalogQuery } from "@/lib/catalog-url";
import { catalogHref, catalogOffers } from "@/lib/catalog-presentation";
import { useCatalogQuery } from "@/lib/catalog/use-catalog-query";
import { trackEvent } from "@/lib/analytics-client";
import { decodeCatalogRows, type EncodedCatalogRows } from "@/lib/catalog-transport";
import { catalogQueryHash } from "@/lib/catalog-query-hash";
import { money } from "@/lib/format";
import type { SortKey } from "@/lib/types";
import { FilterRail } from "./FilterRail";
import { OfferTable } from "./catalog/OfferTable";


const SORTS: { value: string; label: string; sort: SortKey; dir: "asc" | "desc" }[] = [
  { value: "real:asc", label: "Real price: low to high", sort: "real", dir: "asc" },
  { value: "recommended:desc", label: "Value score", sort: "recommended", dir: "desc" },
  { value: "ramdollar:desc", label: "Most RAM per $", sort: "ramdollar", dir: "desc" },
  { value: "trustpilot:desc", label: "Trustpilot", sort: "trustpilot", dir: "desc" },
  { value: "cash:asc", label: "Due today", sort: "cash", dir: "asc" },
];

/** Sentence summary of the active filter set — e.g. "4 GB+ RAM in Europe, under $20". */
function filterSentence(query: ReturnType<typeof useCatalogQuery>["query"]): string {
  const parts: string[] = [];
  if (query.ram.length) parts.push(`${Math.min(...query.ram)} GB+ RAM`);
  if (query.cpus.length) parts.push(`${Math.min(...query.cpus)}+ vCPU`);
  if (query.diskMin != null) parts.push(`${query.diskMin} GB+ disk`);
  if (query.workload) parts.push(`for ${WORKLOADS.find((w) => w.id === query.workload)?.label ?? query.workload}`);
  if (query.regions.length) parts.push(`in ${query.regions.map((r) => REGION_BANDS.find((b) => b.id === r)?.label ?? r).join(" or ")}`);
  if (query.locations.length) parts.push(`in ${query.locations.slice(0, 3).join(", ")}${query.locations.length > 3 ? ` +${query.locations.length - 3}` : ""}`);
  if (query.providers.length) parts.push(`from ${query.providers.length} provider${query.providers.length === 1 ? "" : "s"}`);
  if (query.maxPrice != null) parts.push(`under $${query.maxPrice}/mo`);
  if (query.trustMin != null) parts.push(`Trustpilot ${query.trustMin}.0+`);
  for (const flag of query.honesty) parts.push(HONESTY.find((h) => h.id === flag)?.label.toLowerCase() ?? flag);
  if (query.q.trim()) parts.push(`matching “${query.q.trim()}”`);
  return parts.join(", ");
}

/** Page numbers around the current page, with gaps: 1 … 4 5 6 … 14. */
function pageWindow(page: number, pages: number): (number | null)[] {
  const keep = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
  const sorted = [...keep].sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? [null, n] : [n]));
}

export function CatalogClient({ title = "Catalog", initialQuery, rows, packedRows, facets, total, page, pages, snapshotDate = "Snapshot date unavailable", unavailableReason = null }: CatalogPageData & { title?: string; packedRows?: EncodedCatalogRows; snapshotDate?: string; unavailableReason?: "empty-publication" | "database-error" | null }) {
  const Heading = title === "Catalog" ? "h1" : "h2";
  const { query, setQuery, pending, pathname } = useCatalogQuery(initialQuery);
  const [drawer, setDrawer] = useState(false);
  const [outboundNotice, setOutboundNotice] = useState<string | null>(null);

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    if (parameters.get("outbound") === "unavailable") setOutboundNotice(parameters.get("request") ?? "");
  }, []);
  useEffect(() => {
    if (pending) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void catalogQueryHash(serializeCatalogQuery(initialQuery)).then((queryHash) => {
        if (!cancelled) trackEvent({ name: "catalog_search", placement: "catalog", data: { result_count: total, query_hash: queryHash } });
      }).catch(() => { /* Failed telemetry must not affect filtering. */ });
    }, 350);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [initialQuery, total, pending]);


  const results = useMemo(
    () => catalogOffers(packedRows ? decodeCatalogRows(packedRows) : rows, facets.providers),
    [rows, packedRows, facets.providers],
  );
  const filters = activeFilterCount(query);
  const sentence = filterSentence(query);
  const sortValue = SORTS.find((s) => s.sort === query.sort && s.dir === query.sortDirection)?.value ?? `${query.sort}:${query.sortDirection}`;

  const chips = [
    query.q.trim() ? { id: "q", label: `“${query.q.trim()}”`, remove: () => setQuery({ ...query, q: "" }) } : null,
    query.maxPrice != null ? { id: "price", label: `≤ $${query.maxPrice}/mo`, remove: () => setQuery({ ...query, maxPrice: null }) } : null,
    query.ram.length ? { id: "ram", label: `RAM ≥ ${Math.min(...query.ram)} GB`, remove: () => setQuery({ ...query, ram: [] }) } : null,
    query.cpus.length ? { id: "cpu", label: `vCPU ≥ ${Math.min(...query.cpus)}`, remove: () => setQuery({ ...query, cpus: [] }) } : null,
    query.diskMin != null ? { id: "disk", label: `Disk ≥ ${query.diskMin} GB`, remove: () => setQuery({ ...query, diskMin: null }) } : null,
    query.workload ? { id: "workload", label: WORKLOADS.find((w) => w.id === query.workload)?.label ?? "Workload", remove: () => setQuery({ ...query, workload: "" }) } : null,
    query.regions.length ? { id: "regions", label: query.regions.map((r) => REGION_BANDS.find((b) => b.id === r)?.label ?? r).join(" + "), remove: () => setQuery({ ...query, regions: [] }) } : null,
    query.locations.length ? { id: "locations", label: `${query.locations.length} location${query.locations.length === 1 ? "" : "s"}`, remove: () => setQuery({ ...query, locations: [] }) } : null,
    query.providers.length ? { id: "providers", label: `${query.providers.length} provider${query.providers.length === 1 ? "" : "s"}`, remove: () => setQuery({ ...query, providers: [] }) } : null,
    query.trustMin != null ? { id: "trust", label: `Trustpilot ${query.trustMin}.0+`, remove: () => setQuery({ ...query, trustMin: null }) } : null,
    query.honesty.length ? { id: "honesty", label: query.honesty.map((f) => HONESTY.find((h) => h.id === f)?.label ?? f).join(" + "), remove: () => setQuery({ ...query, honesty: [] }) } : null,
  ].filter((chip): chip is { id: string; label: string; remove: () => void } => chip != null);

  function toggleColumnSort(key: SortKey) {
    setQuery({ ...query, sort: key, sortDirection: query.sort === key && query.sortDirection === "asc" ? "desc" : "asc" });
  }

  function clearFilters() {
    setQuery({ ...query, q: "", ram: [], cpus: [], diskMin: null, providers: [], locations: [], regions: [], honesty: [], maxPrice: null, trustMin: null, workload: "" });
  }


  if (unavailableReason) {
    return (
      <section className="cat-empty container--prose" role="alert">
        <h1 className="d-md" id="catalog-page-title">No active snapshot.</h1>
        <p>{unavailableReason === "database-error"
          ? "The reviewed catalog database could not be read. Demo offers are never substituted for production data."
          : "No reviewed publication is active. Demo offers are never substituted for production data."}</p>
        {/* A recovery retry must request a fresh document after a storage failure. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/catalog" className="btn btn--ink">Try again</a>
      </section>
    );
  }

  return (
    <div className="cat catalog-legacy">
      <FilterRail query={query} setQuery={setQuery} count={total} facets={facets} drawer={drawer} setDrawer={setDrawer} />

      <div className="main">
        <div className="top">
          <div>
            <Heading className="cat-h1" id="catalog-page-title">
              {title === "Catalog" ? "VPS plans" : title}
            </Heading>
            <p>{title === "Catalog" ? `${total} result${total === 1 ? "" : "s"}` : `${total} shown${sentence ? ` · ${sentence}` : ""}`} · {snapshotDate === "Snapshot date unavailable" ? snapshotDate : `Snapshot ${snapshotDate}`}</p>
          </div>
          <div className="tools">
            <label className="sr-only" htmlFor="catalog-sort">Sort results</label>
            <select
              id="catalog-sort"
              className="select"
              value={sortValue}
              onChange={(event) => {
                const picked = SORTS.find((s) => s.value === event.target.value);
                if (picked) setQuery({ ...query, sort: picked.sort, sortDirection: picked.dir });
              }}
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              {!SORTS.some((s) => s.value === sortValue) ? <option value={sortValue}>{query.sort}</option> : null}
            </select>
            <div className="seg" role="group" aria-label="Result view">
              <button type="button" aria-pressed={query.view === "list"} onClick={() => setQuery({ ...query, view: "list" })}><Rows aria-hidden /> Table</button>
              <button type="button" aria-pressed={query.view === "cards"} onClick={() => setQuery({ ...query, view: "cards" })}><SquaresFour aria-hidden /> Cards</button>
            </div>
          </div>
        </div>

        <div className="mfilters" role="group" aria-label="Quick filters">
          <button type="button" className="chip" onClick={() => setDrawer(true)} aria-label={`Open filters${filters ? `, ${filters} active` : ""}`}>
            <Funnel aria-hidden /> Filters{filters ? ` · ${filters}` : ""}
          </button>
          <button type="button" className="chip" aria-pressed={query.maxPrice === 10} onClick={() => setQuery({ ...query, maxPrice: query.maxPrice === 10 ? null : 10 })}>Under $10</button>
          <button type="button" className="chip" aria-pressed={query.honesty.includes("flat")} onClick={() => setQuery({ ...query, honesty: query.honesty.includes("flat") ? query.honesty.filter((f) => f !== "flat") : [...query.honesty, "flat"] })}>Flat renewal</button>
          <button type="button" className="chip" aria-pressed={query.regions.includes("europe")} onClick={() => setQuery({ ...query, regions: query.regions.includes("europe") ? query.regions.filter((r) => r !== "europe") : [...query.regions, "europe"] })}>Europe</button>
          <button type="button" className="chip" aria-pressed={query.trustMin === 4} onClick={() => setQuery({ ...query, trustMin: query.trustMin === 4 ? null : 4 })}>Trustpilot 4.0+</button>
        </div>


        {chips.length ? (
          <div className="chips" aria-label="Active filters">
            {chips.map((chip) => (
              <button key={chip.id} type="button" className="chip chip--active" onClick={chip.remove} aria-label={`Remove filter ${chip.label}`}>
                {chip.label}<X aria-hidden weight="bold" />
              </button>
            ))}
            <button type="button" className="clear" onClick={clearFilters}>Clear all</button>
          </div>
        ) : null}

        <p className="disc" role="note" aria-label="Commission disclosure">
          <HandCoins aria-hidden weight="bold" />
          <span>Links marked <strong>Ad</strong> may earn us a commission. They never change the order. <Link href="/methodology#independence">How we check</Link></span>
        </p>

        {outboundNotice !== null ? (
          <div className="cat-outbound" role="alert">
            <span><strong>Provider link unavailable.</strong> No redirect was attempted — pick another published plan.</span>
            {outboundNotice ? <code>Request {outboundNotice}</code> : null}
            <button type="button" onClick={() => setOutboundNotice(null)}>Dismiss</button>
          </div>
        ) : null}

        <span role="status" className="sr-only">{pending ? "Updating results…" : ""}</span>
        <div className={`catalog-results${query.view === "cards" ? " is-cards" : ""}`} aria-busy={pending} data-pending={pending || undefined}>
          <OfferTable
            key={`${serializeCatalogQuery(initialQuery)}:${page}`}
            offers={results}
            sort={initialQuery.sort}
            direction={initialQuery.sortDirection}
            onSort={toggleColumnSort}
            onClearFilters={clearFilters}
            offset={(page - 1) * initialQuery.perPage}
          />
          {total > PER_PAGE_OPTIONS[0] ? (
            <nav className="pager" aria-label="Catalog pagination">
              <div className="pager__size" role="group" aria-label="Plans per page">
                <span>Show</span>
                <div className="seg seg--sm">
                  {PER_PAGE_OPTIONS.map((size) => (
                    <button key={size} type="button" aria-pressed={initialQuery.perPage === size} onClick={() => setQuery({ ...query, perPage: size })}>{size}</button>
                  ))}
                </div>
              </div>
              <span className="pager__range">{(page - 1) * initialQuery.perPage + 1}–{Math.min(page * initialQuery.perPage, total)} of {total}</span>
              {pages > 1 ? (
                <div className="pager__pages">
                  {page > 1 ? <Link href={catalogHref(pathname, initialQuery, page - 1)} prefetch={false} className="btn btn--line btn--sm">← Previous</Link> : null}
                  {pageWindow(page, pages).map((item, i) => item === null
                    ? <span key={`gap-${i}`} className="pager__gap" aria-hidden>…</span>
                    : <Link key={item} href={catalogHref(pathname, initialQuery, item)} prefetch={false} className={`pager__num${item === page ? " is-on" : ""}`} aria-current={item === page ? "page" : undefined} aria-label={`Page ${item}`}>{item}</Link>)}
                  {page < pages ? <Link href={catalogHref(pathname, initialQuery, page + 1)} prefetch={false} className="btn btn--line btn--sm">Next →</Link> : null}
                </div>
              ) : null}
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
