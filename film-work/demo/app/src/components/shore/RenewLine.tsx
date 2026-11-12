import type { ShoreOffer } from "@/lib/shore-offer";
import { shoreMoney } from "./format";
import { ShoreIcon } from "./ShoreIcon";

export function RenewLine({ offer }: { offer: Pick<ShoreOffer, "usd" | "tr" | "ren" | "cur" | "fx"> }) {
  if (offer.usd == null) return null;
  if (!offer.tr) return <span className="rn rn--unk">Terms not reviewed</span>;
  const rate = offer.cur === "USD" ? 1 : (offer.fx ?? null);
  const r = offer.ren != null && rate != null ? offer.ren * rate : null;
  if (r == null) return <span className="rn rn--unk">Renewal not published</span>;
  if (r > offer.usd * 1.02) return <span className="rn rn--up"><ShoreIcon name="arrow" cls="ico--up" />Renews {shoreMoney(r)}</span>;
  if (r < offer.usd * 0.98) return <span className="rn rn--flat">Renews lower, {shoreMoney(r)}</span>;
  return <span className="rn rn--flat"><ShoreIcon name="check" />Flat price</span>;
}
