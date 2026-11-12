import type { ShoreOffer } from "@/lib/shore-offer";
import { shoreFmtDate } from "./format";

const TP_STAR = '<path d="M10 2.2l2.3 5 5.4.6-4 3.7 1.1 5.4L10 14.2l-4.8 2.7 1.1-5.4-4-3.7 5.4-.6z"/>';

function kfmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

export function TrustpilotBadge({ offer, full = false }: { offer: Pick<ShoreOffer, "tp" | "tpc" | "tpDate">; full?: boolean }) {
  if (offer.tp == null) {
    return <span className="tp tp--none">{full ? "No Trustpilot rating yet" : "No rating"}</span>;
  }
  const tone = offer.tp >= 4 ? "g" : offer.tp >= 3 ? "y" : offer.tp >= 2 ? "o" : "r";
  const n = offer.tpc ?? 0;
  const tip = `Trustpilot ${offer.tp.toFixed(1)} of 5 · ${n.toLocaleString("en-US")} reviews · checked ${shoreFmtDate(offer.tpDate)}`;
  return (
    <span className={`tp tp--${tone}`} data-tip={tip}>
      <span className="tp__sq" aria-hidden="true">
        <svg viewBox="0 0 20 20" focusable="false" dangerouslySetInnerHTML={{ __html: TP_STAR }} />
      </span>
      <b className="num" aria-hidden="true">{offer.tp.toFixed(1)}</b>
      <small aria-hidden="true">{full ? `Trustpilot · ${n.toLocaleString("en-US")} reviews` : `(${kfmt(n)})`}</small>
      <span className="sr-only">Trustpilot {offer.tp.toFixed(1)} out of 5, {n} reviews</span>
    </span>
  );
}

export function TrustpilotRating({ offer, idSeed }: { offer: Pick<ShoreOffer, "tp" | "tpc" | "tpDate">; idSeed?: string }) {
  if (offer.tp == null) {
    return <span className="rating rating--none">No Trustpilot rating yet</span>;
  }
  const w = (Math.max(0, Math.min(5, offer.tp)) / 5) * 100;
  const STAR_D = "M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.5l-5.1 2.7 1-5.6-4.1-4 5.7-.8z";
  const id = `stc-${(idSeed ?? "").replace(/[^A-Za-z0-9_-]/g, "-")}-${offer.tp.toFixed(0)}-${offer.tpc ?? 0}`;
  const row = (cls: string) =>
    [0, 1, 2, 3, 4].map(i => `<path class="${cls}" transform="translate(${i * 20} 0)" d="${STAR_D}"/>`).join("");
  const svgHtml = `<clipPath id="${id}"><rect width="${w.toFixed(1)}" height="19"/></clipPath>${row("st-off")}<g clip-path="url(#${id})">${row("st-on")}</g>`;
  return (
    <span className="rating">
      <svg className="stars" viewBox="0 0 100 19" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: svgHtml }} />
      <b className="num">{offer.tp.toFixed(1)}</b>
      <span>Trustpilot · {(offer.tpc ?? 0).toLocaleString("en-US")} reviews</span>
      <span className="sr-only">{offer.tp.toFixed(1)} out of 5</span>
    </span>
  );
}
