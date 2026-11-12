"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { ShoreOffer } from "@/lib/shore-offer";
import type { ShoreCatalogPage } from "@/lib/shore-catalog-page";
import type { CatalogQuery } from "@/lib/types";
import { clearedCatalogQuery, serializeCatalogQuery } from "@/lib/catalog-url";
import { shoreFmtDate } from "./format";
import { ShoreIcon } from "./ShoreIcon";
import { Dropdown } from "@/components/shore/controls";
import { CatalogFilterRail } from "./CatalogFilterRail";
import { OfferLedger } from "./OfferLedger";
import { OfferCard } from "./OfferCard";
import { Pager } from "./Pager";
import { trackEvent } from "@/lib/analytics-client";
import { catalogQueryHash } from "@/lib/catalog-query-hash";

const SORTS = [
  { value: "value",  label: "Value score" },
  { value: "price",  label: "Price" },
  { value: "ram",    label: "Memory" },
  { value: "cpu",    label: "CPU" },
  { value: "disk",   label: "Storage" },
  { value: "bw",     label: "Transfer" },
  { value: "tp",     label: "Trustpilot" },
] as const;

type SortKey = typeof SORTS[number]["value"];

function dirTxt(sort: string, dir: string): string {
  // Canonical keys: recommended ranks best-first on "desc" (score order),
  // while the mockup's rank-based "value" asc is the same view.
  if (sort === "recommended") return dir === "desc" ? "Best first" : "Best last";
  if (sort === "real") return dir === "asc" ? "Lowest first" : "Highest first";
  if (sort === "trustpilot") return dir === "desc" ? "Best rated first" : "Lowest rated first";
  return dir === "desc" ? "Most first" : "Least first";
}

function defDir(sort: string): "asc" | "desc" {
  return sort === "real" ? "asc" : "desc";
}

const SORT_ALIAS: Record<string, string> = { value: "recommended", price: "real", bw: "bandwidth", tp: "trustpilot" };

function patchesFor(q: CatalogQuery): { label: string; drop: string }[] {
  const p: { label: string; drop: string }[] = [];
  if (q.q.trim()) p.push({ label: `"${q.q.trim()}"`, drop: "q" });
  if (q.ram.length) p.push({ label: `${q.ram[0]} GB+ RAM`, drop: "ram" });
  if (q.maxPrice != null) p.push({ label: `Up to $${q.maxPrice}`, drop: "price" });
  if (q.cpus.length) p.push({ label: `${q.cpus[0]}+ vCPU`, drop: "cpu" });
  if (q.diskMin != null) p.push({ label: `${q.diskMin} GB+ storage`, drop: "disk" });
  q.regions.forEach(r => p.push({ label: r, drop: `regions:${r}` }));
  q.locations.forEach(c => p.push({ label: c, drop: `loc:${c}` }));
  q.providers.forEach(v => p.push({ label: v, drop: `prov:${v}` }));
  q.honesty.forEach(f => p.push({ label: f, drop: `flags:${f}` }));
  if (q.trustMin != null) p.push({ label: `Trustpilot ${q.trustMin.toFixed(1)}+`, drop: "tp" });
  return p;
}

function activeCount(q: CatalogQuery): number {
  return (q.q.trim() ? 1 : 0) + (q.ram.length ? 1 : 0) + (q.maxPrice != null ? 1 : 0) +
    q.regions.length + (q.cpus.length ? 1 : 0) + (q.diskMin != null ? 1 : 0) +
    q.honesty.length + q.providers.length + q.locations.length + (q.trustMin != null ? 1 : 0);
}

/* Walk state: loading / nodata / ok */
type CatState = "ok" | "loading" | "nodata";

export function ShoreCatalogClient({ initialData, bearArt }: { initialData: ShoreCatalogPage; bearArt?: string }) {
  const [data, setData] = useState<ShoreCatalogPage>(initialData);
  const [catState, setCatState] = useState<CatState>(
    initialData.status === "unavailable" ? "nodata" : "ok"
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const openSheetBtnRef = useRef<HTMLButtonElement>(null);

  /* Derive sort/dir from query — map canonical → mockup keys for display */
  const q = data.query;
  const sortDisplay: SortKey = (
    { recommended: "value", real: "price", bandwidth: "bw", trustpilot: "tp" } as Record<string, SortKey>
  )[q.sort] ?? (q.sort as SortKey);
  const dir = q.sortDirection;

  const abortRef = useRef<AbortController | null>(null);

  const fetch_ = useCallback(async (newQ: CatalogQuery) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setCatState("loading");
    const qs = serializeCatalogQuery(newQ);
    const url = `/api/public/offers?format=shore${qs ? "&" + qs : ""}`;
    try {
      const res = await fetch(url, { signal: ac.signal, cache: "no-store" });
      if (!res.ok) throw new Error("unavailable");
      const json = await res.json() as ShoreCatalogPage & { ok: boolean };
      if (!json.ok) throw new Error("unavailable");
      setData(json);
      setCatState(json.status === "unavailable" ? "nodata" : "ok");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setCatState("nodata");
    }
  }, []);

  function setQuery(newQ: CatalogQuery) {
    const qs = serializeCatalogQuery(newQ);
    // Filter state is a URL that mirrors the table; history.replaceState keeps it
    // shareable and reloadable without a router round-trip (or a React render).
    if (typeof window !== "undefined") window.history.replaceState(null, "", `/catalog${qs ? "?" + qs : ""}`);
    void fetch_(newQ);
  }

  /* Mockup sort keys → canonical query keys */
  function canonicalSort(k: string): CatalogQuery["sort"] {
    return (SORT_ALIAS[k] ?? k) as CatalogQuery["sort"];
  }

  function handleSort(k: string) {
    const canonical = canonicalSort(k);
    const newDir = q.sort === canonical ? (dir === "asc" ? "desc" : "asc") : defDir(canonical);
    setQuery({ ...q, sort: canonical, sortDirection: newDir, page: 1 });
  }

  function handleSortDropdown(v: string) {
    setQuery({ ...q, sort: canonicalSort(v), sortDirection: defDir(canonicalSort(v)), page: 1 });
  }

  function dropPatch(drop: string) {
    const [g, v] = drop.split(":");
    let next = { ...q, page: 1 };
    if (g === "q") next = { ...next, q: "" };
    else if (g === "ram") next = { ...next, ram: [] };
    else if (g === "price") next = { ...next, maxPrice: null };
    else if (g === "cpu") next = { ...next, cpus: [] };
    else if (g === "disk") next = { ...next, diskMin: null };
    else if (g === "tp") next = { ...next, trustMin: null };
    else if (g === "regions") next = { ...next, regions: next.regions.filter(r => r !== v) };
    else if (g === "loc") next = { ...next, locations: next.locations.filter(l => l !== v) };
    else if (g === "prov") next = { ...next, providers: next.providers.filter(p => p !== v) };
    else if (g === "flags") next = { ...next, honesty: next.honesty.filter(f => f !== v) as CatalogQuery["honesty"] };
    setQuery(next);
  }

  /** Every filter lives in the query; clearing keeps sort, view and page size. */
  function clearFilters() { setQuery(clearedCatalogQuery(q)); }

  const patches = patchesFor(q);
  const filterCount = activeCount(q);
  const rows: ShoreOffer[] = data.rows;
  const total = data.total;
  const page = data.page;
  const pages = data.pages;
  const per = q.perPage;
  const offset = (page - 1) * per;

  useEffect(() => {
    if (!data.catalogSearchEnabled || catState !== "ok" || !q.q.trim()) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void catalogQueryHash(serializeCatalogQuery(q)).then((queryHash) => {
        if (!cancelled) trackEvent({ name: "catalog_search", placement: "catalog", data: { result_count: total, query_hash: queryHash } });
      }).catch(() => { /* Failed telemetry must not affect filtering. */ });
    }, 350);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [data.catalogSearchEnabled, catState, q.q, total, q]);

  /* Announce result count to screen readers */
  const liveRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.getElementById("live");
    if (el) { liveRef.current = el; el.textContent = ""; requestAnimationFrame(() => { el.textContent = `${total} plans.`; }); }
  }, [total]);

  /* Scrim click closes sheet. Stable identity keeps the sheet's focus trap
     from re-running (and re-focusing its first control) on every fetch render. */
  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    openSheetBtnRef.current?.focus();
  }, []);

  return (
    <div className="page wrap">
      <div className="cat-head">
        <div>
          <h1 className="ptitle">VPS plans</h1>
          <p className="cat-meta">
            <span className="num" id="catCount">{total}</span> results · Snapshot {data.meta.snapshotDate ? shoreFmtDate(data.meta.snapshotDate) : "Snapshot date unavailable"}
          </p>
        </div>
        <div className="cat-tools">
          <button
            className="btn btn--filters"
            type="button"
            id="openSheet"
            ref={openSheetBtnRef}
            aria-controls="rail"
            aria-expanded={sheetOpen}
            aria-label="Filters"
            aria-describedby={filterCount ? "fCount" : undefined}
            onClick={() => setSheetOpen(true)}
          >
            <ShoreIcon name="shell" />Filters{filterCount ? <span className="num" id="fCount"> ({filterCount})</span> : null}
          </button>

          <div className="sortl">
            <span>Sort by</span>
            <Dropdown
              id="sort"
              label="Sort by"
              value={sortDisplay}
              options={SORTS.map(s => ({ value: s.value, label: s.label }))}
              onChange={handleSortDropdown}
              small
            />
          </div>

          <button
            className={`pill dirbtn${dir === "asc" ? " asc" : ""}`}
            type="button"
            id="dirBtn"
            onClick={() => setQuery({ ...q, sortDirection: dir === "asc" ? "desc" : "asc", page: 1 })}
          >
            <ShoreIcon name="sort" />
            <span id="dirTxt">{dirTxt(q.sort, dir)}</span>
          </button>

          <div className="seg seg--view" role="group" aria-label="View">
            <button type="button" aria-label="List" aria-pressed={q.view === "list"} onClick={() => { localStorage.setItem("shore-view", "list"); setQuery({ ...q, view: "list" }); }}>
              <ShoreIcon name="list" /><span>List</span>
            </button>
            <button type="button" aria-label="Cards" aria-pressed={q.view === "cards"} onClick={() => { localStorage.setItem("shore-view", "cards"); setQuery({ ...q, view: "cards" }); }}>
              <ShoreIcon name="grid" /><span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      <div className="cat">
        <CatalogFilterRail
          query={q}
          setQuery={setQuery}
          facets={data.facets}
          meta={data.meta}
          catalogSearchEnabled={data.catalogSearchEnabled}
          total={data.total}
          sheetOpen={sheetOpen}
          onClose={closeSheet}
        />

        <section aria-label="Results">
          {/* Active filter patches */}
          <div className="patches" id="patches">
            {patches.map(p => (
              <span key={p.drop} className="patch">
                {p.label}
                <button type="button" data-drop={p.drop} aria-label={`Remove filter: ${p.label}`} onClick={() => dropPatch(p.drop)}>
                  <ShoreIcon name="close" />
                </button>
              </span>
            ))}
            {patches.length > 1 && (
              <button type="button" className="linkish" onClick={clearFilters}>Clear all</button>
            )}
          </div>

          <p className="disclose">
            <ShoreIcon name="tag" />
            <span>Links marked <b>Ad</b> may earn us a commission. They never change the order.</span>
          </p>

          <div id="results" aria-busy={catState === "loading"}>
            {catState === "loading" && (
              <>
                <div className="loading-row" role="status">
                  <div className="walk night" aria-hidden="true">
                    <span className="walk__sea" />
                    {bearArt ? <span className="walk__bear"><svg className="pet s-patchwork k-twargaops" viewBox="34 40 90 84" data-state="working" style={{ "--accent": "var(--amber)" } as CSSProperties} dangerouslySetInnerHTML={{ __html: bearArt }} /></span> : null}
                  </div>
                  <div><h2 className="h3" style={{ margin: 0 }}>Walking the shoreline…</h2><p className="fine">Loading plans for your filters.</p></div>
                </div>
                <table className="rows skel" aria-hidden="true">
                  <tbody>{Array.from({ length: 6 }, (_, i) => (
                    <tr key={i}><td><span /></td><td><span /><span className="w2" style={{ marginTop: 8 }} /></td><td><span className="w3" /></td><td><span className="w3" /></td><td><span className="w3" /></td><td><span className="w3" /></td><td><span className="w2" /></td></tr>
                  ))}</tbody>
                </table>
              </>
            )}

            {catState === "nodata" && (
              <div className="state" role="status">
                <div className="state__art night">
                  {/* sleep pose crab — static art, no kit needed */}
                </div>
                <div>
                  <h2>The tide is out.</h2>
                  <p>Plan data is unavailable right now. We don&apos;t show old prices in its place.</p>
                  <div className="row">
                    <button className="btn btn--primary" type="button" onClick={() => void fetch_(q)}>Try again</button>
                  </div>
                </div>
              </div>
            )}

            {catState === "ok" && rows.length === 0 && (
              <div className="state">
                <div className="state__art fish night" aria-hidden="true">
                  <span className="fish__sign">Nothing fits</span>
                </div>
                <div>
                  <h2>Nothing fits these needs.</h2>
                  <p>No plan in this snapshot matches every filter. Try loosening one.</p>
                  <div className="relax">
                    <button type="button" className="chip" onClick={clearFilters}>Clear all filters</button>
                  </div>
                </div>
              </div>
            )}

            {catState === "ok" && rows.length > 0 && (
              <>
                {q.view === "cards"
                  ? <ul className="cards">{rows.map(o => <OfferCard key={o.id} offer={o} />)}</ul>
                  : <OfferLedger offers={rows} sort={sortDisplay} dir={dir} onSort={handleSort} />
                }
                <Pager
                  offset={offset}
                  shown={rows.length}
                  total={total}
                  page={page}
                  pages={pages}
                  per={per}
                  onPage={p => setQuery({ ...q, page: p })}
                  onPer={n => { localStorage.setItem("shore-per", String(n)); setQuery({ ...q, perPage: n as 24 | 48 | 96, page: 1 }); }}
                />
              </>
            )}
          </div>
        </section>
      </div>

      {/* Mobile scrim */}
      {sheetOpen && <div className="scrim" id="scrim" onClick={closeSheet} />}
    </div>
  );
}
