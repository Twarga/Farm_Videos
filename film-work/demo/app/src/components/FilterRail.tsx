"use client";

import type { CatalogFacets } from "@/lib/catalog-page";

import { X } from "@/components/catalog/IconSprite";
import { useEffect, useMemo, useRef, useState } from "react";
import { activeFilterCount, CPU_STEPS, DISK_STEPS, HONESTY, RAM_STEPS, REGION_BANDS } from "@/lib/catalog-controls";
import { WORKLOADS } from "@/lib/catalog-workloads";
import { catalogProviders } from "@/lib/catalog-presentation";
import type { CatalogQuery } from "@/lib/types";
import { FlagOnly } from "./Flag";
import { ProviderLogo } from "./ProviderLogo";

const PRICE_BANDS = [5, 10, 25, 50, 100];
const TRUST_MIN = 4;


export function FilterRail({
  query,
  setQuery,
  count,
  drawer,
  setDrawer,
  facets,
}: {
  query: CatalogQuery;
  setQuery: (next: CatalogQuery) => void;
  count: number;
  drawer: boolean;
  setDrawer: (open: boolean) => void;
  facets: CatalogFacets;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [showAllProviders, setShowAllProviders] = useState(false);
  const active = activeFilterCount(query);
  const providers = catalogProviders(facets.providers);
  const visibleProviders = useMemo(() => (
    showAllProviders
      ? providers
      : providers.filter((provider, index) => index < 5 || query.providers.includes(provider.id))
  ), [providers, query.providers, showAllProviders]);

  useEffect(() => {
    if (!drawer) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setDrawer(false); return; }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = oldOverflow;
      returnFocusRef.current?.focus();
    };
  }, [drawer, setDrawer]);

  function toggle<K extends keyof CatalogQuery>(key: K, value: CatalogQuery[K]) {
    setQuery({ ...query, [key]: value });
  }

  function toggleIn<T>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
  }

  function reset() {
    setQuery({ ...query, q: "", ram: [], cpus: [], diskMin: null, providers: [], locations: [], regions: [], honesty: [], maxPrice: null, trustMin: null, workload: "" });
  }

  const body = (
    <>
      <div className="rail__head">
        <h2>Filters</h2>
        <button type="button" onClick={reset} disabled={active === 0}>Reset {active || ""}</button>
      </div>

      <div className="fgroup">
        <h3>Monthly price <span>{query.maxPrice != null ? `≤ $${query.maxPrice}/mo` : "USD/mo"}</span></h3>
        <div className="bands bands--2">
          {[...PRICE_BANDS.map((band) => `<$${band}`), "Any"].map((label, i) => {
            const value = i < PRICE_BANDS.length ? PRICE_BANDS[i] : null;
            return (
              <button key={label} type="button" aria-pressed={query.maxPrice === value} onClick={() => toggle("maxPrice", value)}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fgroup">
        <h3>Memory <span>{query.ram.length ? `≥ ${Math.min(...query.ram)} GB` : "any"}</span></h3>
        <div className="bands">
          {RAM_STEPS.map((step) => (
            <button key={step} type="button" aria-pressed={query.ram.includes(step)} onClick={() => toggle("ram", toggleIn(query.ram, step))}>
              {step} GB
            </button>
          ))}
        </div>
      </div>

      <div className="fgroup">
        <h3>vCPU <span>{query.cpus.length ? `≥ ${Math.min(...query.cpus)}` : "any"}</span></h3>
        <div className="bands">
          {CPU_STEPS.map((step) => (
            <button key={step} type="button" aria-pressed={query.cpus.includes(step)} onClick={() => toggle("cpus", toggleIn(query.cpus, step))}>
              {step}+
            </button>
          ))}
        </div>
      </div>

      <div className="fgroup">
        <h3>Disk <span>{query.diskMin != null ? `≥ ${query.diskMin} GB` : "any"}</span></h3>
        <div className="bands">
          {DISK_STEPS.map((step) => (
            <button key={step} type="button" aria-pressed={query.diskMin === step} onClick={() => toggle("diskMin", query.diskMin === step ? null : step)}>
              ≥{step} GB
            </button>
          ))}
        </div>
      </div>

      <div className="fgroup">
        <h3>Billing and reputation</h3>
        {HONESTY.map((flag) => {
          const on = query.honesty.includes(flag.id);
          return (
            <div className="toggle" key={flag.id}>
              <span id={`honesty-${flag.id}`}>{flag.label}</span>
              <button
                type="button"
                className="switch"
                role="switch"
                aria-checked={on}
                aria-labelledby={`honesty-${flag.id}`}
                onClick={() => toggle("honesty", toggleIn(query.honesty, flag.id))}
              />
            </div>
          );
        })}
        <div className="toggle">
          <span id="honesty-trust">Trustpilot {TRUST_MIN}.0+</span>
          <button
            type="button"
            className="switch"
            role="switch"
            aria-checked={query.trustMin === TRUST_MIN}
            aria-labelledby="honesty-trust"
            onClick={() => toggle("trustMin", query.trustMin === TRUST_MIN ? null : TRUST_MIN)}
          />
        </div>
      </div>

      <div className="fgroup">
        <h3>Where it runs <span>{query.regions.length || query.locations.length ? `${query.regions.length + query.locations.length} picked` : "any"}</span></h3>
        <div className="bands bands--2">
          {REGION_BANDS.map((band) => (
            <button key={band.id} type="button" aria-pressed={query.regions.includes(band.id)} onClick={() => toggle("regions", toggleIn(query.regions, band.id))}>
              {band.label}
            </button>
          ))}
        </div>
        <div className="locgrid">
          {facets.locations.map((code) => (
            <label className="opt" key={code}>
              <input type="checkbox" className="check" checked={query.locations.includes(code)} onChange={() => toggle("locations", toggleIn(query.locations, code))} />
              <span className="flags"><FlagOnly code={code} size={13} /></span>
              {code}
            </label>
          ))}
        </div>
      </div>

      <div className="fgroup">
        <h3>Provider <span>{facets.providers.length}</span></h3>
        <button type="button" className="provider-all" aria-pressed={query.providers.length === 0} onClick={() => toggle("providers", [])}>
          All providers
        </button>
        <div className="locgrid">
          {visibleProviders.map((provider) => (
            <label className="opt" key={provider.id}>
              <input type="checkbox" className="check" checked={query.providers.includes(provider.id)} onChange={() => toggle("providers", toggleIn(query.providers, provider.id))} />
              <span className="pmark"><ProviderLogo provider={provider} size={22} bare /></span>
              {provider.name}
              <small>{facets.providerCounts[provider.id] ?? 0}</small>
            </label>
          ))}
        </div>
        {providers.length > 5 ? (
          <button type="button" className="provider-expand" onClick={() => setShowAllProviders((current) => !current)}>
            {showAllProviders ? "Show less" : "Show all"}
          </button>
        ) : null}
      </div>

      <div className="fgroup">
        <h3>Workload <span>{query.workload ? "1 picked" : "any"}</span></h3>
        <div className="locgrid">
          {WORKLOADS.map((workload) => (
            <label className="opt" key={workload.id}>
              <input type="radio" name="rail-workload" className="check" checked={query.workload === workload.id} onChange={() => toggle("workload", query.workload === workload.id ? "" : workload.id)} />
              {workload.label}
              <small>≥{workload.minRam} GB</small>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {!drawer ? <aside className="rail" aria-label="Catalog filters">{body}</aside> : null}
      {drawer ? (
        <div className="sheet" role="dialog" aria-modal="true" aria-label="Catalog filters">
          <button type="button" className="sheet__backdrop" aria-label="Dismiss filters" tabIndex={-1} onClick={() => setDrawer(false)} />
          <div className="sheet__panel" ref={drawerRef}>
            <div className="sheet__handle" aria-hidden />
            <div className="sheet__head">
              <span className="h-sm">{count} plans · {active || "no"} filter{active === 1 ? "" : "s"}</span>
              <button ref={closeRef} type="button" className="btn btn--ghost btn--icon" aria-label="Close filters" onClick={() => setDrawer(false)}>
                <X aria-hidden />
              </button>
            </div>
            <div className="sheet__body">{body}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
