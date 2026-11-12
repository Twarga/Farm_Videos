import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Offer } from "@/lib/types";

/** The canonical outbound CTA: /go/ redirect, honest rel, labeled affiliate. */
export function GetDealButton({
  offer,
  className = "",
  label,
  tone = "volt",
}: {
  offer: Offer;
  className?: string;
  label?: string;
  tone?: "volt" | "line";
}) {
  return (
    <span className="deal">
      <a href={`/go/${offer.id}`} rel={offer.affiliate ? "sponsored nofollow" : "nofollow"} className={`btn btn--sm btn--${tone} ${className}`.trim()} aria-label={offer.affiliate ? `${label ?? "Visit"} ${offer.productName} (affiliate link)` : `${label ?? "Visit"} ${offer.productName}`}>
        {label ?? "Visit"} <ArrowUpRight aria-hidden weight="bold" />
      </a>
      {offer.affiliate ? <span className="cap subtle" title="We may earn a commission; the order never changes">Affiliate link</span> : null}
    </span>
  );
}
