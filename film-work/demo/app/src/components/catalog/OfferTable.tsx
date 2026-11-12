"use client";

import Link from "next/link";
import { useRouter } from "@/lib/site-navigation";
import { type MouseEvent } from "react";
import { ArrowUpRight, Star } from "@/components/catalog/IconSprite";
import { useCompare } from "../CompareProvider";
import { ProviderLogo } from "../ProviderLogo";
import { flagSrc } from "@/lib/assets";
import { money } from "@/lib/format";
import { displayPriceUsd } from "@/lib/catalog-controls";
import { ReviewedMark } from "../ui/ReviewedMark";
import { resolvePublishedOfferProvider } from "@/lib/published-provider";
import type { Offer, SortKey } from "@/lib/types";

function rowTarget(event: MouseEvent) {
  return (event.target as HTMLElement).closest("a, button, input, label, .row-control");
}

/** Compact flag image for dense result rows; CSS supplies the frame. */
function Fl({ code }: { code: string }) {
  const source = flagSrc(code);
  if (!source) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="fl" src={source} alt={code} />;
}

function PickCheck({ offer }: { offer: Offer }) {
  const { has, toggle, ready } = useCompare();
  const selected = has(offer.id);
  return (
    <label className="row-control pick" aria-label={`Pick ${offer.productName} to compare`}>
      <input
        type="checkbox"
        className="check"
        checked={selected}
        disabled={!ready}
        onChange={(event) => toggle(offer.id, event.currentTarget)}
        onClick={(event) => event.stopPropagation()}
        aria-label={`Pick ${offer.productName} to compare`}
      />
      <span className="row-label">Compare</span>
    </label>
  );
}

function Spec({ value, unit, published }: { value: string | number; unit: string; published: boolean }) {
  if (!published) return <span className="spec-value spec-value--none" title="Not published"><span aria-hidden>—</span><span className="sr-only">Not published</span></span>;
  return <span className="spec-value">{value}<small>{unit}</small></span>;
}

/** One offer rendered once: a table row on desktop, a card under 760px. */
function OfferRow({ offer, rank }: { offer: Offer; rank: number }) {
  const router = useRouter();
  const { has } = useCompare();
  const provider = resolvePublishedOfferProvider(offer);
  const headline = displayPriceUsd(offer);
  const extra = offer.locations.length - 4;

  return (
    <tr
      className={`orow${has(offer.id) ? " is-picked" : ""}`}
      onClick={(event) => {
        if (rowTarget(event)) return;
        router.push(`/offers/${offer.id}`);
      }}
    >
      <td className="c-pick"><span className="rank n-sm">{rank}</span><PickCheck offer={offer} /></td>
      <td className="c-plan">
        <Link href={`/offers/${offer.id}`} prefetch={false} className="id" onClick={(event) => event.stopPropagation()}>
          <span className="id__morph">
            <span className="pmark"><ProviderLogo provider={provider} size={40} bare /></span>
            <span className="id__tx">
              <strong>{offer.productName}</strong>
              <span className="id__sub">{provider.name}{offer.locations.length ? <span className="flags" aria-hidden>{offer.locations.slice(0, 4).map((c) => <Fl key={c} code={c} />)}{extra > 0 ? <span>+{extra}</span> : null}</span> : null}</span>
            </span>
          </span>
        </Link>
      </td>
      <td className="c-spec c-cpu">
        <span className="row-label">CPU</span>
        <Spec value={offer.vcpu ?? ""} unit="vCPU" published={offer.vcpu != null} />
      </td>
      <td className="c-spec c-ram">
        <span className="row-label">RAM</span>
        <Spec value={offer.ramGb ?? ""} unit="GB" published={offer.ramGb != null} />
      </td>
      <td className="c-spec c-disk">
        <span className="row-label">Storage</span>
        <Spec value={offer.diskGb ?? ""} unit="GB" published={offer.diskGb != null} />
        {offer.diskGb != null && offer.diskKind && offer.diskKind !== "Not published" ? <span className="spec-sub">{offer.diskKind}</span> : null}
      </td>
      <td className="c-spec c-transfer">
        <span className="row-label">Transfer</span>
        <Spec value={offer.bandwidthTb ?? ""} unit="TB" published={offer.bandwidthTb != null} />
      </td>
      <td className="c-trust">
        <span className="row-label">Trustpilot</span>
        {provider.trustpilotScore != null ? (
          <span className="trust" title={provider.trustpilotCount != null ? `${provider.trustpilotCount.toLocaleString("en-US")} Trustpilot reviews` : undefined}>
            <Star aria-hidden weight="fill" /><b className="num">{provider.trustpilotScore.toFixed(1)}</b>
            {provider.trustpilotCount != null ? <span className="sr-only"> from {provider.trustpilotCount.toLocaleString("en-US")} reviews</span> : null}
          </span>
        ) : (
          <span className="trust trust--none" title="Not published"><span aria-hidden>—</span><span className="sr-only">Not published</span></span>
        )}
      </td>
      <td className="c-price r">
        <span className="price">
          <b>{headline != null ? money(headline, "USD") : "Not published"}{headline != null ? <small>/mo</small> : null}{offer.realMonthly != null ? <ReviewedMark /> : null}</b>
        </span>
      </td>
      <td className="c-act r row-control">
        <a
          href={`/go/${offer.id}`}
          rel={offer.affiliate ? "sponsored nofollow" : "nofollow"}
          className="btn btn--line btn--sm visit"
          onClick={(event) => event.stopPropagation()}
          aria-label={offer.affiliate ? `Visit ${offer.productName} (affiliate link)` : `Visit ${offer.productName}`}
        >
          Visit <ArrowUpRight aria-hidden weight="bold" />
        </a>
        {offer.affiliate ? <span className="affil" title="Affiliate link — we may earn a commission; the order never changes">Ad</span> : null}
      </td>
    </tr>
  );
}

const HEADERS: { label: string; sortKey?: SortKey; className: string }[] = [
  { label: "Compare", className: "c-pick" },
  { label: "Plan", sortKey: "provider", className: "c-plan" },
  { label: "CPU", sortKey: "cpu", className: "c-spec c-cpu" },
  { label: "RAM", sortKey: "ram", className: "c-spec c-ram" },
  { label: "Storage", sortKey: "disk", className: "c-spec c-disk" },
  { label: "Transfer", sortKey: "bandwidth", className: "c-spec c-transfer" },
  { label: "Trustpilot", sortKey: "trustpilot", className: "c-trust" },
  { label: "Price /mo", sortKey: "real", className: "c-price r" },
  { label: "", className: "c-act" },
];

export function OfferTable({ offers, sort = "recommended", direction = "desc", onSort, onClearFilters, offset = 0 }: { offers: Offer[]; sort?: SortKey; direction?: "asc" | "desc"; onSort?: (key: SortKey) => void; onClearFilters?: () => void; offset?: number }) {
  if (!offers.length) {
    return (
      <div className="cat-empty" role="status">
        <h2>No plans match these filters</h2>
        <p>Clear a filter or reset them all to see published plans.</p>
        {onClearFilters ? <button type="button" className="btn btn--ink" onClick={onClearFilters}>Clear all filters</button> : <Link href="/catalog" className="btn btn--ink">Clear all filters</Link>}
      </div>
    );
  }

  return (
    <div className="tablewrap offer-table">
      <table className="dtable" aria-label="VPS plans">
        <thead>
          <tr>
            {HEADERS.map((header) => {
              const active = header.sortKey != null && sort === header.sortKey;
              return (
                <th key={header.label || "act"} scope="col" aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : undefined} className={`${header.className}${active ? " is-sorted" : ""}`}>
                  {header.sortKey && onSort ? <span className="column-label">{header.label}</span> : null}
                  {header.sortKey && onSort ? (
                    <button type="button" onClick={() => onSort(header.sortKey!)} aria-label={`Sort by ${header.label} ${active && direction === "asc" ? "descending" : "ascending"}`}>
                      {header.label}<span className="arrow" aria-hidden>{active ? (direction === "asc" ? "↑" : "↓") : ""}</span>
                    </button>
                  ) : header.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {offers.map((offer, index) => <OfferRow key={offer.id} offer={offer} rank={offset + index + 1} />)}
        </tbody>
      </table>
    </div>
  );
}
