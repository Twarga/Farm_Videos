"use client";

import Link from "next/link";
import type { ShoreOffer } from "@/lib/shore-offer";
import { shorePrice, shoreLocTxt } from "./format";
import { ProviderMark } from "./ProviderMark";
import { TrustpilotBadge } from "./TrustpilotBadge";
import { RenewLine } from "./RenewLine";
import { specVal } from "./SpecMeter";
import { bwPair, cpuPair, diskPair, ramPair, ReviewedPrice } from "./specs";
import { ShoreIcon } from "./ShoreIcon";
import { useCompare } from "@/components/CompareProvider";

const COLS = [
  ["cpu",   "c-cpu",   "CPU",       "cpu"],
  ["ram",   "c-ram",   "Memory",    "ram"],
  ["disk",  "c-disk",  "Storage",   "disk"],
  ["bw",    "c-bw",    "Transfer",  "transfer"],
  ["tp",    "c-tp",    "Trustpilot","star"],
  ["price", "c-price", "Price",     "tag"],
] as const;

/** Sort header: a button that re-sorts the ledger through the catalogue state. */
function SortHeader({ col, sort, dir, onSort }: {
  col: typeof COLS[number]; sort: string; dir: string; onSort: (k: string) => void;
}) {
  const [k, cls, label, icon] = col;
  const on = sort === k;
  const ariaSort = on ? (dir === "asc" ? "ascending" : "descending") : undefined;
  return (
    <th scope="col" className={`${cls}${on ? " on" : ""}`} aria-sort={ariaSort}>
      <button type="button" className="sorth" data-sort={k} onClick={() => onSort(k)}>
        {icon ? <ShoreIcon name={icon} /> : null}<span>{label}</span><span className="sorth__ar" aria-hidden="true" />
      </button>
    </th>
  );
}

function LedgerRow({ offer }: { offer: ShoreOffer }) {
  const { ids, toggle, ready } = useCompare();
  const inPail = ids.includes(offer.id);
  return (
    <tr data-row={offer.id} className={inPail ? "picked" : undefined}>
      <td className="c-pick">
        <label className="pick">
          <input type="checkbox" data-pick={offer.id} checked={inPail} disabled={!ready} onChange={(event) => toggle(offer.id, event.currentTarget)} />
          <span className="pick__box" aria-hidden="true"><ShoreIcon name="check" /></span>
          <span className="pick__txt" aria-hidden="true">Compare</span>
          <span className="sr-only">Compare {offer.name} by {offer.p}</span>
        </label>
      </td>
      <td className="c-plan">
        <div className="plan">
          <ProviderMark offer={offer} />
          <div>
            <Link className="plan__name" href={`/offers/${offer.id}`}>{offer.name}</Link>
            <span className="plan__sub">
              <span className="plan__rank num">#{offer.rank}</span>
              {offer.p} · {shoreLocTxt(offer.loc)}
            </span>
          </div>
        </div>
      </td>
      <td className="spec c-cpu" data-l="CPU">
        {specVal("vcpu", cpuPair(offer), offer.vcpu)}
        {offer.cpu ? <span className="sub">{offer.cpu}</span> : null}
      </td>
      <td className="spec c-ram" data-l="Memory">{specVal("ram", ramPair(offer), offer.ram)}</td>
      <td className="spec c-disk" data-l="Storage">
        {specVal("disk", diskPair(offer), offer.disk)}
        {offer.dk ? <span className="sub">{offer.dk}</span> : null}
      </td>
      <td className="spec c-bw" data-l="Transfer">{specVal("bw", bwPair(offer), offer.bw)}</td>
      <td className="c-tp"><TrustpilotBadge offer={offer} /></td>
      <td className="c-price">
        <span className="price">
          <b className="num">{shorePrice(offer)}</b>
          {offer.free ? null : <small>/mo{offer.un}</small>}
          {offer.real != null ? ReviewedPrice : null}
        </span>
        <RenewLine offer={offer} />
      </td>
      <td className="c-act">
        <a className="go" href={offer.outboundPath} target="_blank" rel={offer.aff ? "noopener sponsored nofollow" : "noopener nofollow"} data-tip={`Visit ${offer.p}`}><span className="sr-only">Visit {offer.p} (opens in a new tab)</span><ShoreIcon name="out" /></a>
        {offer.aff ? <Link className="ad" href="/affiliate-disclosure" aria-label="Affiliate disclosure">Ad</Link> : null}
      </td>
    </tr>
  );
}

/** The catalogue's plan table. Sorting is owned by the catalogue's query state. */
export function OfferLedger({ offers, sort, dir, onSort }: {
  offers: ShoreOffer[];
  sort: string;
  dir: string;
  onSort: (k: string) => void;
}) {
  return (
    <table className={`ledger sorted-${sort} dir-${dir}`}>
      <caption className="sr-only">VPS plans. Column headers sort the list.</caption>
      <thead>
        <tr>
          <th scope="col" className="c-pick"><span className="sr-only">Compare</span><ShoreIcon name="pail" /></th>
          <th scope="col" className="c-plan">
            <button type="button" className="sorth" data-sort="value" onClick={() => onSort("value")}>
              <span>Plan</span><span className="sorth__ar" aria-hidden="true" />
            </button>
          </th>
          {COLS.map(col => <SortHeader key={col[0]} col={col} sort={sort} dir={dir} onSort={onSort} />)}
          <th scope="col" className="c-act"><span className="sr-only">Provider link</span></th>
        </tr>
      </thead>
      <tbody>
        {offers.map(offer => <LedgerRow key={offer.id} offer={offer} />)}
      </tbody>
    </table>
  );
}
