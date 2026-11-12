"use client";

import { useState } from "react";
import Link from "next/link";
import type { ShoreOffer } from "@/lib/shore-offer";
import type { PublishedDealOffer } from "@/lib/public-special-offers";
import { shoreMoney, shorePrice, shoreGb, shoreDisk, shoreBw, shoreLocTxt, shoreFmtDate } from "./format";
import { ProviderMark } from "./ProviderMark";
import { TrustpilotBadge } from "./TrustpilotBadge";
import { RenewLine } from "./RenewLine";
import { CostStripCompact } from "./CostShell";
import { specVal } from "./SpecMeter";
import { ShoreIcon } from "./ShoreIcon";
import { useCompare } from "@/components/CompareProvider";

const RV = (
  <span className="rv" title="Reviewed 3-year price">
    <ShoreIcon name="check" /><span className="sr-only">Reviewed 3-year price</span>
  </span>
);

function cpuPair(o: ShoreOffer): [string, string] | null {
  return o.vcpu != null ? [String(o.vcpu), "vCPU"] : null;
}
function ramPair(o: ShoreOffer): [string, string] | null {
  const g = shoreGb(o.ram);
  return g ? [g.replace(/\s*(GB|MB)$/, ""), g.match(/(GB|MB)$/)?.[0] ?? "GB"] : null;
}
function diskPair(o: ShoreOffer): [string, string] | null {
  const d = shoreDisk(o.disk);
  return d ? [d.replace(/\s*(GB|TB)$/, ""), d.match(/(GB|TB)$/)?.[0] ?? "GB"] : null;
}
function bwPair(o: ShoreOffer): [string, string] | null {
  const b = shoreBw(o.bw);
  if (!b) return null;
  const m = /^([\d.]+)\s*(.*)$/.exec(b);
  return m ? [m[1], m[2]] : [b, ""];
}

/** Deal card — matches mockup cardHtml(o, deal=true) */
function DealCard({ offer }: { offer: PublishedDealOffer }) {
  const { ids, toggle, ready } = useCompare();
  const inPail = ids.includes(offer.id);
  const rate = offer.cur === "USD" ? 1 : (offer.fx ?? null);
  const conv = (v: number | null) => v != null && rate != null ? v * rate : null;
  const { promotion } = offer;
  const isAnnualOrLonger = promotion.periodMonths > 1;
  const hasReviewedIntro = Boolean(offer.tr && offer.introM && offer.ren != null);

  return (
    <li className={`pc${inPail ? " picked" : ""}`} data-row={offer.id}>
      <div className="pc__top">
        <ProviderMark offer={offer} />
        <div className="pc__who">
          <Link className="pc__p" href={`/providers/${offer.pid}`}>{offer.p}</Link>
          <span className="pc__loc">{shoreLocTxt(offer.loc)}</span>
        </div>
        <span className="pc__rank num" data-tip="Value rank">#{offer.rank}</span>
      </div>
      <Link className="pc__name" href={`/offers/${offer.id}`}>{offer.name}</Link>
      <div className="pc__price">
        <p className="price price--lg">
          <b className="num">{shorePrice(offer)}</b>
          {offer.free ? null : <small>/mo</small>}
          {offer.real != null ? RV : null}
        </p>
        <RenewLine offer={offer} />
      </div>
      <div className="pc__deal">
        {hasReviewedIntro ? <>
          <p>
            <span>First {offer.introM} months</span>
            <b className="num">{shoreMoney(conv(offer.intro ?? offer.eff))}/mo</b>
          </p>
          <p>
            <span>Then</span>
            <b className="num">{shoreMoney(conv(offer.ren))}/mo</b>
          </p>
          <CostStripCompact offer={offer} />
        </> : null}
        {isAnnualOrLonger ? <>
          <p><span>Advertised charge</span><b className="num">{shoreMoney(promotion.amount)} for {promotion.periodMonths} months</b></p>
          <p><span>Monthly equivalent</span><b className="num">{shoreMoney(promotion.amount / promotion.periodMonths)}/mo</b></p>
        </> : (
          <p><span>Advertised charge</span><b className="num">{shoreMoney(promotion.amount)} for 1 month</b></p>
        )}
        {!hasReviewedIntro && offer.ren == null ? <p><span>Later price not published</span></p> : null}
        <p>
          <span>{promotion.label} · {promotion.availability === "limited-stock" ? "Limited stock" : "Advertised"} · checked {shoreFmtDate(promotion.checkedAt)}{promotion.expiresAt ? ` · expires ${shoreFmtDate(promotion.expiresAt)}` : ""}</span>
          <a href={promotion.sourceUrl} target="_blank" rel="noopener noreferrer">Provider source</a>
        </p>
      </div>
      <div className="pc__specs">
        <div className="pc__s pc__s--vcpu"><span className="pc__l"><ShoreIcon name="cpu" />CPU</span>{specVal("vcpu", cpuPair(offer), offer.vcpu)}</div>
        <div className="pc__s pc__s--ram"><span className="pc__l"><ShoreIcon name="ram" />Memory</span>{specVal("ram", ramPair(offer), offer.ram)}</div>
        <div className="pc__s pc__s--disk"><span className="pc__l"><ShoreIcon name="disk" />Storage</span>{specVal("disk", diskPair(offer), offer.disk)}</div>
        <div className="pc__s pc__s--bw"><span className="pc__l"><ShoreIcon name="transfer" />Transfer</span>{specVal("bw", bwPair(offer), offer.bw)}</div>
      </div>
      <div className="pc__tp"><TrustpilotBadge offer={offer} /></div>
      <div className="pc__foot">
        <label className="pick">
          <input type="checkbox" data-pick={offer.id} checked={inPail} disabled={!ready} onChange={(event) => toggle(offer.id, event.currentTarget)} />
          <span className="pick__box" aria-hidden="true"><ShoreIcon name="check" /></span>
          <span className="pick__txt" aria-hidden="true">Compare</span>
          <span className="sr-only">Compare {offer.name} by {offer.p}</span>
        </label>
        {offer.aff ? <Link className="ad" href="/affiliate-disclosure" aria-label="Affiliate disclosure">Ad</Link> : null}
        <a className="btn btn--sm" href={offer.outboundPath} target="_blank" rel={offer.aff ? "noopener sponsored nofollow" : "noopener nofollow"}>
          Visit<ShoreIcon name="out" /><span className="sr-only"> {offer.p} (opens in a new tab)</span>
        </a>
      </div>
    </li>
  );
}

/** Plain card (no deal strip) — for the no-surprise section */
function PlainCard({ offer }: { offer: ShoreOffer }) {
  const { ids, toggle, ready } = useCompare();
  const inPail = ids.includes(offer.id);
  return (
    <li className={`pc${inPail ? " picked" : ""}`} data-row={offer.id}>
      <div className="pc__top">
        <ProviderMark offer={offer} />
        <div className="pc__who">
          <Link className="pc__p" href={`/providers/${offer.pid}`}>{offer.p}</Link>
          <span className="pc__loc">{shoreLocTxt(offer.loc)}</span>
        </div>
        <span className="pc__rank num" data-tip="Value rank">#{offer.rank}</span>
      </div>
      <Link className="pc__name" href={`/offers/${offer.id}`}>{offer.name}</Link>
      <div className="pc__price">
        <p className="price price--lg">
          <b className="num">{shorePrice(offer)}</b>
          {offer.free ? null : <small>/mo</small>}
          {offer.real != null ? RV : null}
        </p>
        <RenewLine offer={offer} />
      </div>
      <div className="pc__specs">
        <div className="pc__s pc__s--vcpu"><span className="pc__l"><ShoreIcon name="cpu" />CPU</span>{specVal("vcpu", cpuPair(offer), offer.vcpu)}</div>
        <div className="pc__s pc__s--ram"><span className="pc__l"><ShoreIcon name="ram" />Memory</span>{specVal("ram", ramPair(offer), offer.ram)}</div>
        <div className="pc__s pc__s--disk"><span className="pc__l"><ShoreIcon name="disk" />Storage</span>{specVal("disk", diskPair(offer), offer.disk)}</div>
        <div className="pc__s pc__s--bw"><span className="pc__l"><ShoreIcon name="transfer" />Transfer</span>{specVal("bw", bwPair(offer), offer.bw)}</div>
      </div>
      <div className="pc__tp"><TrustpilotBadge offer={offer} /></div>
      <div className="pc__foot">
        <label className="pick">
          <input type="checkbox" data-pick={offer.id} checked={inPail} disabled={!ready} onChange={(event) => toggle(offer.id, event.currentTarget)} />
          <span className="pick__box" aria-hidden="true"><ShoreIcon name="check" /></span>
          <span className="pick__txt" aria-hidden="true">Compare</span>
          <span className="sr-only">Compare {offer.name} by {offer.p}</span>
        </label>
        {offer.aff ? <Link className="ad" href="/affiliate-disclosure" aria-label="Affiliate disclosure">Ad</Link> : null}
        <a className="btn btn--sm" href={offer.outboundPath} target="_blank" rel={offer.aff ? "noopener sponsored nofollow" : "noopener nofollow"}>
          Visit<ShoreIcon name="out" /><span className="sr-only"> {offer.p} (opens in a new tab)</span>
        </a>
      </div>
    </li>
  );
}

type FilterKey = "all" | "cheap" | "short";
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All deals" },
  { key: "cheap", label: "Intro under $5" },
  { key: "short", label: "Intro of 12 months or less" },
];

function filterDeals(deals: PublishedDealOffer[], f: FilterKey): PublishedDealOffer[] {
  if (f === "cheap") {
    return deals.filter((o) => {
      if (!o.tr || !o.introM) return false;
      const rate = o.cur === "USD" ? 1 : (o.fx ?? null);
      const intro = o.intro ?? o.eff;
      return rate != null && intro * rate < 5;
    });
  }
  if (f === "short") return deals.filter((o) => o.tr && o.introM != null && o.introM <= 12);
  return deals;
}

export function SpecialOffersClient({
  deals,
  flat,
}: {
  deals: PublishedDealOffer[];
  flat: ShoreOffer[];
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const visible = filterDeals(deals, filter);

  return (
    <div className="page wrap">
      <header className="doc__head">
        <p className="kicker">Special offers</p>
        <h1 className="ptitle">Dated deals, with the billing up front.</h1>
        <p className="lead">
          See the advertised charge, billing period and source. Later prices appear when reviewed.
          Reviewed 3-year costs lead the list where available.
        </p>
      </header>

      <div className="offers-bar">
        <div className="seg" role="group" aria-label="Filter deals">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              data-f={f.key}
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="cat-meta">
          <span className="num" id="dealN">{visible.length}</span> deals
        </p>
      </div>

      {visible.length ? (
        <ul className="cards" id="deals">
          {visible.slice(0, 24).map((o) => <DealCard key={o.id} offer={o} />)}
        </ul>
      ) : (
        <ul className="cards" id="deals">
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
              <span className="fish__sign">No deals today</span>
            </div>
            <div>
              <h2>No deal matches.</h2>
              <p>Try another filter, or look at the no-surprise plans below.</p>
            </div>
          </li>
        </ul>
      )}

      {flat.length > 0 && (
        <section className="psec" aria-labelledby="flat-h">
          <div className="sec__head">
            <div>
              <h2 id="flat-h">No-surprise plans</h2>
              <p className="sec__sub">
                Monthly billing, and the price stays the same when it renews. One per provider.
              </p>
            </div>
            <Link className="pill" href="/catalog?flags=contract,flat">
              See all<ShoreIcon name="arrow" cls="ico--arrow" />
            </Link>
          </div>
          <ul className="cards">
            {flat.map((o) => <PlainCard key={o.id} offer={o} />)}
          </ul>
        </section>
      )}
    </div>
  );
}
