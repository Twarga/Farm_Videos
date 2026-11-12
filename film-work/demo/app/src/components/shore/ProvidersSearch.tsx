"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ShoreOffer } from "@/lib/shore-offer";
import type { ShoreProviderCard } from "@/lib/provider-cards";
import { ShellSvg } from "./ShellSvg";
import { TrustpilotBadge } from "./TrustpilotBadge";
import { shoreMoney, shoreFmtDate } from "./format";
import { ShoreIcon } from "./ShoreIcon";

type SortKey = "value" | "price" | "tp" | "plans" | "name";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "value", label: "Highest value score" },
  { value: "price", label: "Lowest price" },
];

function sortCards(cards: ShoreProviderCard[], sort: SortKey): ShoreProviderCard[] {
  return [...cards].sort((a, b) => {
    if (sort === "price") return (a.from ?? 1e9) - (b.from ?? 1e9);
    if (sort === "tp") return (b.tp ?? -1) - (a.tp ?? -1);
    if (sort === "plans") return b.plans - a.plans || a.p.localeCompare(b.p);
    if (sort === "name") return a.p.localeCompare(b.p);
    // "value" — original source order (already sorted by best plan rank)
    return 0;
  });
}

function ProvCard({ card }: { card: ShoreProviderCard }) {
  const shellOffer = { logoSrc: card.logoSrc };
  const tpOffer = { tp: card.tp, tpc: card.tpc, tpDate: card.tpDate };
  return (
    <li className="pv">
      <a className="pv__a" href={`/providers/${card.pid}`}>
        <span className="pv__shell"><ShellSvg offer={shellOffer} /></span>
        <span className="pv__name">{card.p}</span>
        <span className="pv__hq">
          HQ {card.hq ?? "not published"} ·{" "}
          {card.locs.length
            ? `${card.locs.length} ${card.locs.length === 1 ? "country" : "countries"}`
            : "locations not published"}
        </span>
      </a>
      <TrustpilotBadge offer={tpOffer} />
      <dl className="pv__facts">
        <div><dt>Plans</dt><dd className="num">{card.plans}</dd></div>
        <div><dt>From</dt><dd className="num">{card.from != null ? shoreMoney(card.from) : "—"}</dd></div>
        <div><dt>Reviewed</dt><dd className="num">{card.reviewed}/{card.plans}</dd></div>
      </dl>
    </li>
  );
}

export function ProvidersSearch({
  cards,
  initialSort = "value",
  snapshotDate,
  totalPlans,
}: {
  cards: ShoreProviderCard[];
  initialSort?: SortKey;
  snapshotDate: string;
  totalPlans: number;
}) {
  const [term, setTerm] = useState("");
  const [sort, setSort] = useState<SortKey>(initialSort);

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    const base = t ? cards.filter((c) => c.p.toLowerCase().includes(t)) : cards;
    return sortCards(base, sort);
  }, [cards, term, sort]);

  return (
    <div className="page wrap">
      <div className="cat-head">
        <div>
          <h1 className="ptitle">Providers</h1>
          <p className="cat-meta">
            <span className="num" id="pvCount">{filtered.length}</span>{" "}
            hosting providers · {totalPlans} plans · Snapshot {snapshotDate}
          </p>
        </div>
        <div className="cat-tools">
          <label className="search">
            <ShoreIcon name="search" />
            <span className="sr-only">Search providers</span>
            <input
              type="search"
              id="pvq"
              placeholder="Search providers"
              value={term}
              autoComplete="off"
              onChange={(e) => setTerm(e.target.value)}
            />
          </label>
          <label className="sortl" htmlFor="pvs">
            <span>Sort by</span>
            <select
              className="select select--sm"
id="pvs"
                aria-label="Sort providers by"
                value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filtered.length ? (
        <ul className="pgrid" id="pgrid">
          {filtered.map((card) => <ProvCard key={card.pid} card={card} />)}
        </ul>
      ) : (
        <ul className="pgrid" id="pgrid">
          <li className="none">
            <div className="state__art fish night" aria-hidden="true">
              <svg className="fish__rod" viewBox="0 0 240 180" focusable="false">
                <path className="fish__pole" d="M96 128 L188 34" />
                <path className="fish__line" d="M188 34 Q206 78 204 118" />
                <g className="fish__bob">
                  <path className="fish__ring" d="M190 124q14 -6 28 0" />
                  <circle cx="204" cy="118" r="5.5" />
                  <path d="M198.5 118h11" />
                </g>
              </svg>
              <span className="fish__sign">Nobody by that name</span>
            </div>
            <div>
              <h2>No provider matches &ldquo;{term}&rdquo;.</h2>
              <p>Try a shorter name, or browse every plan.</p>
              <div className="row">
                <Link className="btn btn--primary" href="/catalog">Browse VPS plans</Link>
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
