"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { ShoreOffer } from "@/lib/shore-offer";
import { comparisonPath } from "@/lib/compare-url";
import { COMPARE_MAX, useCompare } from "@/components/CompareProvider";
import { toUsd } from "@/lib/format";
import { costPlan } from "./cost-plan";
import { shoreBw, shoreDisk, shoreFmtDate, shoreGb, shoreMoney, shorePrice } from "./format";
import { ShellSvg } from "./ShellSvg";
import { TrustpilotRating } from "./TrustpilotBadge";
import { ShoreIcon } from "./ShoreIcon";
import { CostStripCompact } from "./CostShell";
import art from "@/shore/shell-art.json";

const IPV4_LABEL: Record<string, string> = {
  included: "Included",
  extra: "Extra cost",
  "location-dependent": "Depends on location",
};

const RV = (
  <span className="rv" title="Reviewed 3-year price">
    <ShoreIcon name="check" /><span className="sr-only">Reviewed 3-year price</span>
  </span>
);

type Row = {
  label: string;
  get: (offer: ShoreOffer, index: number) => unknown;
  render: (offer: ShoreOffer, index: number) => ReactNode;
  best?: "min" | "max";
};

type BuiltRow = Row & { values: unknown[]; lead: number; differ: boolean; r: number };
type BuiltSection = { name: string; icon: string; rows: BuiltRow[]; none: string[] };

const money = (value: number | null) => shoreMoney(value);
const usdAmount = (offer: ShoreOffer, amount: number | null) => toUsd({ amount, currency: offer.cur, rate: offer.fx });

/** Same rows, order and labels as renderCompare() in brand/shore/mockup/shore.js. */
function rowsFor(): { name: string; icon: string; rows: Row[] }[] {
  return [
    {
      name: "Price",
      icon: "tag",
      rows: [
        {
          label: "First 36 months",
          get: (offer) => JSON.stringify(costPlan(offer)),
          render: (offer) => <CostStripCompact offer={offer} />,
        },
        {
          label: "Price per month",
          best: "min",
          // A free tier has no number to rank, but it still prints its label:
          // the sentinel keeps the cell off the generic "Not published" path.
          get: (offer) => offer.free ? "free" : offer.usd,
          render: (offer) => <span className="v num">{offer.free ? shorePrice(offer) : `${money(offer.usd)}/mo`}</span>,
        },
        {
          label: "3-year average",
          best: "min",
          get: (offer) => offer.real,
          render: (offer) => <span className="v num">{money(offer.real)}/mo</span>,
        },
        {
          label: "Due today",
          best: "min",
          get: (offer) => usdAmount(offer, offer.cash),
          render: (offer) => <span className="v num">{money(usdAmount(offer, offer.cash))}</span>,
        },
        {
          label: "Renews at",
          best: "min",
          get: (offer) => (offer.tr ? usdAmount(offer, offer.ren) : null),
          render: (offer) => <span className="v num">{money(usdAmount(offer, offer.ren))}/mo</span>,
        },
        {
          label: "Setup fee",
          best: "min",
          get: (offer) => usdAmount(offer, offer.setup),
          render: (offer) => <span className="v num">{money(usdAmount(offer, offer.setup))}</span>,
        },
        {
          label: "Contract",
          get: (offer) => offer.term,
          render: (offer) => <span className="v num">{offer.term == null ? "Not published" : offer.term <= 1 ? "Monthly" : `${offer.term} months`}</span>,
        },
      ],
    },
    {
      name: "Hardware",
      icon: "cpu",
      rows: [
        {
          label: "CPU",
          best: "max",
          get: (offer) => offer.vcpu,
          render: (offer) => <span className="v num">{offer.vcpu} vCPU</span>,
        },
        {
          label: "Memory",
          best: "max",
          get: (offer) => offer.ram,
          render: (offer) => <span className="v num">{shoreGb(offer.ram)}</span>,
        },
        {
          label: "Storage",
          best: "max",
          get: (offer) => offer.disk,
          render: (offer) => <span className="v num">{shoreDisk(offer.disk)}</span>,
        },
        {
          label: "Transfer",
          best: "max",
          get: (offer) => offer.bw,
          render: (offer) => <span className="v num">{shoreBw(offer.bw)}</span>,
        },
      ],
    },
    {
      name: "Trust",
      icon: "lantern",
      rows: [
        {
          label: "Trustpilot",
          best: "max",
          get: (offer) => offer.tp,
          render: (offer) => <TrustpilotRating offer={offer} idSeed={offer.id} />,
        },
        {
          label: "IPv4 address",
          get: (offer) => (offer.ipv4 !== "unknown" ? offer.ipv4 : null),
          render: (offer) => <span className="v num">{IPV4_LABEL[offer.ipv4] ?? offer.ipv4}</span>,
        },
        {
          label: "Price checked",
          get: (offer) => offer.checked,
          render: (offer) => <span className="v num">{shoreFmtDate(offer.checked)}</span>,
        },
      ],
    },
  ];
}

/** One clear winner per row gets "Lowest"/"Highest"; a tie or one known value gets no label. */
function build(offers: ShoreOffer[]): { sections: BuiltSection[]; nDiff: number } {
  let nDiff = 0;
  const sections = rowsFor().map((section) => {
    const none: string[] = [];
    const rows: BuiltRow[] = [];
    for (const row of section.rows) {
      const values = offers.map((offer, index) => row.get(offer, index));
      if (values.every((value) => value == null)) {
        none.push(row.label);
        continue;
      }
      const differ = offers.length > 1 && new Set(values.map((value) => JSON.stringify(value ?? null))).size > 1;
      if (differ) nDiff += 1;
      let lead = -1;
      const known = values.map((value, index) => [value, index] as const).filter(([value]) => value != null);
      if (row.best && known.length > 1) {
        const numbers = known.map(([value]) => Number(value));
        const target = row.best === "min" ? Math.min(...numbers) : Math.max(...numbers);
        const winners = known.filter(([value]) => Number(value) === target);
        if (winners.length === 1) lead = winners[0]![1];
      }
      rows.push({ ...row, values, lead, differ, r: nDiff });
    }
    return { name: section.name, icon: section.icon, rows, none };
  });
  return { sections, nDiff };
}

function reducedMotion(): boolean {
  const query = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  return Boolean(query?.matches) || document.documentElement.classList.contains("rm");
}

export function ShoreCompare({ offers }: { offers: ShoreOffer[] }) {
  const [onlyDiff, setOnlyDiff] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const sewRef = useRef<SVGSVGElement>(null);
  const litTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { sections, nDiff } = useMemo(() => build(offers), [offers]);
  const { clear } = useCompare();
  const router = useRouter();
  const clearPail = useCallback(() => {
    clear();
    router.replace("/compare");
  }, [clear, router]);

  const sew = useCallback((animate: boolean) => {
    const wrap = wrapRef.current;
    const svg = sewRef.current;
    const table = tableRef.current;
    if (!wrap || !svg || !table) return;
    if (litTimer.current) { clearTimeout(litTimer.current); litTimer.current = null; }
    const shells = [...wrap.querySelectorAll<HTMLElement>(".colhead__shell")];
    if (shells.length < 2) {
      svg.innerHTML = "";
      table.classList.add("lit");
      return;
    }
    const bounds = wrap.getBoundingClientRect();
    const points = shells.map((shell) => {
      const rect = shell.getBoundingClientRect();
      return [rect.left + rect.width * 0.55 - bounds.left + wrap.scrollLeft, rect.bottom - 6 - bounds.top] as const;
    });
    let d = `M${(points[0]![0] - 30).toFixed(1)} ${points[0]![1].toFixed(1)}L${points[0]![0].toFixed(1)} ${points[0]![1].toFixed(1)}`;
    for (let i = 1; i < points.length; i += 1) {
      const a = points[i - 1]!;
      const b = points[i]!;
      d += `Q${((a[0] + b[0]) / 2).toFixed(1)} ${(Math.max(a[1], b[1]) + 30).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    }
    const last = points[points.length - 1]!;
    d += "l26 -4";
    svg.setAttribute("width", String(table.offsetWidth));
    svg.setAttribute("height", String(table.offsetHeight));
    const knots = points.map(([x, y], i) => `<circle class="sew__knot" style="--i:${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`).join("");
    const needle = `<g class="sew__needle" transform="translate(${(last[0] + 26).toFixed(1)} ${(last[1] - 4).toFixed(1)}) rotate(-12)"><path d="M0 0h18"/><ellipse cx="15" cy="0" rx="2.2" ry="1"/></g>`;
    svg.innerHTML = `<path class="sew__shadow" d="${d}"/><path class="sew__thread" d="${d}"/>${knots}${needle}`;
    if (!animate || reducedMotion()) {
      svg.classList.remove("sewing");
      table.classList.add("lit");
      return;
    }
    svg.classList.remove("sewing");
    void svg.getBoundingClientRect();
    svg.classList.add("sewing");
    table.classList.remove("lit");
    litTimer.current = setTimeout(() => table.classList.add("lit"), 750);
  }, []);

  useEffect(() => {
    sew(true);
    const wrap = wrapRef.current;
    const table = tableRef.current;
    if (!wrap || !table) return;
    const onResize = () => sew(false);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onResize);
    observer?.observe(wrap);
    observer?.observe(table);
    window.addEventListener("resize", onResize);
    let alive = true;
    const fonts = document.fonts;
    if (fonts?.ready) fonts.ready.then(() => { if (alive) sew(false); }).catch(() => undefined);
    return () => {
      alive = false;
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      if (litTimer.current) clearTimeout(litTimer.current);
      litTimer.current = null;
    };
  }, [sew, offers]);

  if (!offers.length) {
    return (
      <>
        <div className="cmp-head">
          <h1 className="ptitle">Compare plans</h1>
          <p className="lead">Pick up to 4 plans. We line up prices, renewals and hardware side by side.</p>
        </div>
        <div className="state state--pail">
          <div className="state__art night" aria-hidden="true">
            <svg className="pet s-patchwork k-bvp" viewBox="26 50 118 74" data-state="idle" style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.crab }} />
            <svg className="bigpail" viewBox="0 0 34 30" aria-hidden="true" focusable="false">
              <path className="pail__body" d="M5 12h24l-2.6 14.4a2.4 2.4 0 0 1-2.4 2H10a2.4 2.4 0 0 1-2.4-2z" />
              <path className="pail__seam" d="M6.4 18.5h21.2" />
              <path className="pail__handle" d="M7.5 12C7.5 6.5 11.6 3 17 3s9.5 3.5 9.5 9" />
            </svg>
          </div>
          <div>
            <h2>Your pail is empty.</h2>
            <p>Tick <b>Compare</b> on any plan in the catalog. The crab carries it here.</p>
            <div className="row"><Link className="btn btn--primary" href="/catalog">Open the catalog<ShoreIcon name="arrow" cls="ico--arrow" /></Link></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="cmp-head">
        <h1 className="ptitle">Compare plans</h1>
        <p className="lead">{offers.length} of 4 plans in your pail.</p>
        <div className="cmp-actions">
          {offers.length < COMPARE_MAX ? <Link className="btn" href="/catalog">Add a plan</Link> : null}
          <button type="button" className="linkish" onClick={clearPail} aria-describedby="cmpClearHint">Clear</button>
          <span className="sr-only" id="cmpClearHint">Remove every plan from the comparison.</span>
        </div>
      </div>
      {offers.length > 1 ? (
        <div className="cmp-tools">
          <span className="cmp-tools__n"><i className="cmp-tools__sw" aria-hidden="true" /><b className="num">{nDiff}</b> rows differ</span>
          <label className="cmp-tools__t">
            <input type="checkbox" id="onlyDiff" checked={onlyDiff} onChange={(event) => setOnlyDiff(event.target.checked)} />
            Only show what differs
          </label>
        </div>
      ) : null}
      <div className={onlyDiff ? "cmp-wrap only-diff" : "cmp-wrap"} id="cmpWrap" ref={wrapRef}>
        <svg className="sew" id="sew" aria-hidden="true" focusable="false" ref={sewRef} />
        <table className="cmp" aria-label="VPS plan comparison" ref={tableRef}>
          <thead>
            <tr>
              <th scope="col" className="cmp-corner">
                <span className="cmp-corner__crab" aria-hidden="true">
                  <svg className="pet s-patchwork k-bvp" viewBox="26 50 118 74" data-state="idle" style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.crab }} />
                </span>
                <span className="sr-only">Plan</span>
              </th>
              {offers.map((offer) => (
                <th scope="col" key={offer.id}>
                  <div className="colhead">
                    <Link className="colhead__shell" href={`/offers/${offer.id}`} tabIndex={-1} aria-hidden="true"><ShellSvg offer={offer} /></Link>
                    <Link className="colhead__name" href={`/offers/${offer.id}`}>{offer.name}</Link>
                    <span className="colhead__sub">{offer.p}</span>
                    <span className="colhead__price"><b className="num">{shorePrice(offer)}</b>{offer.free ? null : <small>/mo</small>}{offer.real != null ? RV : null}</span>
                    <Link className="linkish" href={comparisonPath(offers.filter((entry) => entry.id !== offer.id).map((entry) => entry.id))}>Remove<span className="sr-only"> {offer.name}</span></Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <CompareSection key={section.name} section={section} offers={offers} />
            ))}
          </tbody>
        </table>
      </div>
      <p className="fine cmp-note">Bars show what you pay each month for 36 months: amber is the intro price, violet the regular price. “Lowest” and “Highest” mark one clear best value; ties get no label.</p>
    </>
  );
}

function CompareSection({ section, offers }: { section: BuiltSection; offers: ShoreOffer[] }) {
  return (
    <>
      <tr className="cmp-sec">
        <th scope="rowgroup" colSpan={offers.length + 1}><span><ShoreIcon name={section.icon} />{section.name}</span></th>
      </tr>
      {section.rows.map((row) => (
        <tr key={row.label} className={row.differ ? "diff" : "same"} style={{ "--r": row.r } as CSSProperties}>
          <th scope="row">{row.label}</th>
          {offers.map((offer, index) => (
            <td key={offer.id}>
              {row.values[index] == null ? <span className="unk">Not published</span> : row.render(offer, index)}
              {index === row.lead ? <span className="best">{row.best === "min" ? "Lowest" : "Highest"}</span> : null}
            </td>
          ))}
        </tr>
      ))}
      {section.none.length ? (
        <tr className="cmp-none">
          <th scope="row">Not published</th>
          <td colSpan={offers.length}>No selected plan publishes: {section.none.join(", ")}.</td>
        </tr>
      ) : null}
    </>
  );
}
