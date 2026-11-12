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

export function OfferCard({ offer }: { offer: ShoreOffer }) {
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
          {offer.free ? null : <small>/mo{offer.un}</small>}
          {offer.real != null ? ReviewedPrice : null}
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
          Visit<ShoreIcon name="out" />
<span className="sr-only"> {offer.p} (opens in a new tab)</span>
          </a>
      </div>
    </li>
  );
}
