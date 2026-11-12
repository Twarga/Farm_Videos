import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ProviderMark } from "./ProviderMark";
import { resolveOfferProvider } from "@/lib/provider-resolver";
import { money } from "@/lib/format";
import type { PublishedSpecialOffer } from "@/lib/special-offers";

export function SpecialOffersList({ entries }: { entries: PublishedSpecialOffer[] }) {
  return <ul className="special-list">{entries.map((entry) => {
    const provider = resolveOfferProvider(entry.offer);
    const period = entry.periodMonths === 12 ? "year" : entry.periodMonths === 1 ? "month" : `${entry.periodMonths} months`;
    return <li key={entry.offerId} className="special-row">
      <ProviderMark provider={provider} size={40} />
      <div className="special-row__plan"><span className="special-row__label">{entry.label} · {provider.name}</span><Link href={`/offers/${entry.offerId}`}>{entry.offer.productName}</Link><span>{entry.vcpu} vCPU · {entry.ramGb} GB RAM · {entry.diskGb} GB {entry.offer.diskKind} · {entry.offer.city}</span></div>
      <div className="special-row__price"><strong>{money(entry.amount, "USD")}<small> / {period}</small></strong><span>{money(entry.amount / entry.periodMonths, "USD")}/mo equivalent</span></div>
      <div className="special-row__action"><Link className="btn btn--line" href={`/offers/${entry.offerId}`}>View plan <ArrowRight aria-hidden /></Link><span>Checked <time dateTime={entry.checkedAt}>{new Date(entry.checkedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}</time> · <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">Source<span className="sr-only"> for {entry.offer.productName} (opens in a new tab)</span></a></span></div>
    </li>;
  })}</ul>;
}
