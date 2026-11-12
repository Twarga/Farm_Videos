"use client";

import { useEffect, useRef } from "react";
import type { CatalogQuery } from "@/lib/types";
import { clearedCatalogQuery } from "@/lib/catalog-url";
import type { CatalogFacets } from "@/lib/catalog-page";
import type { ShoreCatalogMeta } from "@/lib/public-catalog";
import { ShoreIcon } from "./ShoreIcon";
import { RangeFilter, Checkbox, Toggle } from "@/components/shore/controls";

/* ── Step definitions matching mockup exactly ── */
const RAM_STEPS  = [null, 1, 2, 4, 8, 16, 32, 64] as const;
const CPU_STEPS  = [null, 1, 2, 4, 6, 8, 16] as const;
const DISK_STEPS = [null, 20, 40, 80, 100, 200, 400] as const;
const PRICE_STEPS = [3, 5, 7, 10, 15, 20, 25, 30, 50, 100, null] as const;
const TP_STEPS = [[null, "Any"], [3.5, "3.5+"], [4, "4.0+"], [4.5, "4.5+"]] as const;
const REGIONS = [["europe","Europe"],["na","N. America"],["asia","Asia"],["oceania","Oceania"]] as const;
const FLAGS = [["contract","No long contracts"],["flat","Flat renewal price"],["ipv4","IPv4 included"]] as const;

function ramTxt(v: number | null) { return v == null ? "Any" : v < 1 ? `${Math.round(v*1024)} MB or more` : `${v} GB or more`; }
function cpuTxt(v: number | null) { return v == null ? "Any" : `${v} vCPU or more`; }
function diskTxt(v: number | null) { return v == null ? "Any" : v >= 1000 ? `${+(v/1000).toFixed(1)} TB or more` : `${v} GB or more`; }
function priceTxt(v: number | null) { return v == null ? "Any budget" : `Up to $${v}/mo`; }
function ramEnd(v: number | null) { return v == null ? "Any" : v < 1 ? `${Math.round(v*1024)} MB` : `${v} GB`; }
function priceEnd(v: number | null) { return v == null ? "Any" : `$${v}`; }

function activeMore(q: CatalogQuery) {
  return (q.cpus.length ? 1 : 0) + (q.diskMin != null ? 1 : 0) + (q.trustMin != null ? 1 : 0) +
    q.honesty.length + q.providers.length + q.locations.length;
}

export function CatalogFilterRail({
  query, setQuery, facets, meta, catalogSearchEnabled, total, sheetOpen, onClose,
}: {
  query: CatalogQuery;
  setQuery: (q: CatalogQuery) => void;
  facets: CatalogFacets;
  meta: ShoreCatalogMeta;
  catalogSearchEnabled: boolean;
  total: number;
  sheetOpen: boolean;
  onClose: () => void;
}) {
  const railRef = useRef<HTMLElement>(null);
  const firstFocusRef = useRef<HTMLElement>(null);

  /* Focus trap when sheet is open on mobile */
  useEffect(() => {
    if (!sheetOpen) return;
    const rail = railRef.current;
    if (!rail) return;
    const focusable = rail.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first?.focus(); } }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [sheetOpen, onClose]);

  const ram = query.ram[0] ?? null;
  const cpu = query.cpus[0] ?? null;
  const more = activeMore(query);

  /* Provider checklist items */
  const provItems = facets.providers.map(p => ({
    value: p.id,
    label: p.name,
    count: facets.providerCounts[p.id] ?? 0,
  }));

  /* Country checklist items */
  const locItems = [...new Set(facets.locations)].sort().map(c => ({
    value: c,
    label: c,
    count: facets.locations.filter(l => l === c).length,
  }));

  return (
    <aside
      className={`rail${sheetOpen ? " open" : ""}`}
      id="rail"
aria-label="Filters"
        role={sheetOpen ? "dialog" : undefined}
        aria-modal={sheetOpen ? true : undefined}
        ref={railRef}
    >
      <div className="rail__head">
        <h2>Filters</h2>
        <button className="icon-btn" type="button" id="closeSheet" aria-label="Close filters" onClick={onClose}>
          <ShoreIcon name="close" />
        </button>
      </div>

      <div className="rail__body">
        {/* Search — hidden unless catalogSearchEnabled */}
        {catalogSearchEnabled && (
          <label className="search search--rail">
            <ShoreIcon name="search" />
            <span className="sr-only">Search plans or providers</span>
            <input
              type="search"
              id="fq"
              placeholder="Search plans or providers"
              value={query.q}
              autoComplete="off"
              onChange={e => setQuery({ ...query, q: e.target.value, page: 1 })}
            />
          </label>
        )}

        {/* RAM */}
        <RangeFilter
          id="ram" label="Memory" icon="ram"
          steps={RAM_STEPS as unknown as readonly (number|null)[]}
          value={ram}
          text={ramTxt}
          endpoint={ramEnd}
          onChange={v => setQuery({ ...query, ram: v != null ? [v] : [], page: 1 })}
        />

        {/* Price */}
        <RangeFilter
          id="price" label="Budget per month" icon="tag"
          steps={PRICE_STEPS as unknown as readonly (number|null)[]}
          value={query.maxPrice}
          text={priceTxt}
          endpoint={priceEnd}
          onChange={v => setQuery({ ...query, maxPrice: v, page: 1 })}
        />

        {/* Regions */}
        <fieldset className="fl">
          <legend><ShoreIcon name="pin" />Region</legend>
          <div className="chips">
            {REGIONS.map(([id, label]) => (
              <button
                key={id} type="button" className="chip"
                aria-pressed={query.regions.includes(id)}
                onClick={() => setQuery({
                  ...query,
                  regions: query.regions.includes(id)
                    ? query.regions.filter(r => r !== id)
                    : [...query.regions, id],
                  page: 1,
                })}
              >{label}</button>
            ))}
          </div>
        </fieldset>

        {/* More filters */}
        <details className="more" id="more" open={more > 0 || undefined}>
          <summary>
            <span>More filters</span>
            <span className="fl__n num" id="moreN">{more || ""}</span>
          </summary>

          {/* CPU */}
          <RangeFilter
            id="cpu" label="CPU" icon="cpu"
            steps={CPU_STEPS as unknown as readonly (number|null)[]}
            value={cpu}
            text={cpuTxt}
            endpoint={v => v == null ? "Any" : `${v}`}
            onChange={v => setQuery({ ...query, cpus: v != null ? [v] : [], page: 1 })}
          />

          {/* Disk */}
          <RangeFilter
            id="disk" label="Storage" icon="disk"
            steps={DISK_STEPS as unknown as readonly (number|null)[]}
            value={query.diskMin}
            text={diskTxt}
            endpoint={v => v == null ? "Any" : `${v} GB`}
            onChange={v => setQuery({ ...query, diskMin: v, page: 1 })}
          />

          {/* Trustpilot */}
          <div className="fl">
            <div className="fl__h">
              <span className="fl__lab" id="tpL"><ShoreIcon name="star" />Trustpilot rating</span>
            </div>
            <div className="seg seg--sm seg--fill" role="group" aria-labelledby="tpL">
              {TP_STEPS.map(([v, label]) => (
                <button
                  key={String(v)}
                  type="button"
                  aria-pressed={(query.trustMin ?? null) === v}
                  onClick={() => setQuery({ ...query, trustMin: v as number | null, page: 1 })}
                >{label}</button>
              ))}
            </div>
          </div>

          {/* Honest terms */}
          <fieldset className="fl">
            <legend><ShoreIcon name="check" />Honest terms</legend>
            <div className="tg">
              {FLAGS.map(([id, label]) => (
                <Toggle
                  key={id}
                  label={label}
                  checked={query.honesty.includes(id as "contract" | "flat" | "ipv4")}
                  onChange={checked => setQuery({
                    ...query,
                    honesty: checked
                      ? [...query.honesty, id as "contract" | "flat" | "ipv4"]
                      : query.honesty.filter(f => f !== id),
                    page: 1,
                  })}
                />
              ))}
            </div>
          </fieldset>

          {/* Providers */}
          {provItems.length > 0 && (
            <details className="fl fl--list" id="fl-prov" open={query.providers.length > 0 || undefined}>
              <summary>
                <span>Providers</span>
                <span className="fl__n num" data-n="fl-prov">{query.providers.length || ""}</span>
              </summary>
              <ul className="cl">
                {provItems.map(item => (
                  <li key={item.value}>
                    <Checkbox
                      label={item.label}
                      value={item.value}
                      checked={query.providers.includes(item.value)}
                      count={item.count}
                      onChange={checked => setQuery({
                        ...query,
                        providers: checked
                          ? [...new Set([...query.providers, item.value])]
                          : query.providers.filter(p => p !== item.value),
                        page: 1,
                      })}
                    />
                  </li>
                ))}
              </ul>
            </details>
          )}

          {/* Countries */}
          {locItems.length > 0 && (
            <details className="fl fl--list" id="fl-loc" open={query.locations.length > 0 || undefined}>
              <summary>
                <span>Countries</span>
                <span className="fl__n num" data-n="fl-loc">{query.locations.length || ""}</span>
              </summary>
              <ul className="cl">
                {locItems.map(item => (
                  <li key={item.value}>
                    <Checkbox
                      label={item.label}
                      value={item.value}
                      checked={query.locations.includes(item.value)}
                      onChange={checked => setQuery({
                        ...query,
                        locations: checked
                          ? [...new Set([...query.locations, item.value])]
                          : query.locations.filter(l => l !== item.value),
                        page: 1,
                      })}
                    />
                  </li>
                ))}
              </ul>
            </details>
          )}
        </details>

        <button
          type="button"
          className="linkish rail__clear"
          onClick={() => setQuery(clearedCatalogQuery(query))}
        >Reset all filters</button>
      </div>

      <div className="rail__foot">
        <button className="btn btn--primary" type="button" id="applySheet" onClick={onClose}>
          Show <span className="num" id="sheetCount">{total}</span> {total === 1 ? "plan" : "plans"}
        </button>
      </div>
    </aside>
  );
}
