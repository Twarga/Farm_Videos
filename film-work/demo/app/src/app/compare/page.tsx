import { CURRENCY_NOTICE } from "@/lib/currency-notice";
import type { Metadata } from "next";
import { CompareSync } from "@/components/compare/CompareClient";
import { ShoreCompare } from "@/components/shore/ShoreCompare";
import { parseComparisonParams } from "@/lib/compare-url";
import { getPublicShoreSource, getPublishedCatalogOffer } from "@/lib/public-catalog";
import type { ShoreOffer } from "@/lib/shore-offer";

export const metadata: Metadata = { title: "Compare VPS plans", description: "Compare up to four VPS plans by price, hardware, locations and billing terms. Missing evidence stays marked." };

type Props = { searchParams: Promise<{ p?: string; id?: string | string[] }> };

export default async function ComparePage({ searchParams }: Props) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.id != null) for (const id of Array.isArray(params.id) ? params.id : [params.id]) query.append("id", id);
  if (params.p != null) query.set("p", params.p);
  const byId = new Map(getPublicShoreSource().offers.map((offer) => [offer.id, offer]));
  const offers = parseComparisonParams(query)
    .filter((id) => getPublishedCatalogOffer(id) != null)
    .map((id) => byId.get(id))
    .filter((offer): offer is ShoreOffer => offer != null);

  return (
    <main id="main">
      <div className="page wrap">
        <CompareSync />
        <ShoreCompare offers={offers} />
        {offers.some((offer) => offer.cur !== "USD") ? <p className="fxnote"><span>{CURRENCY_NOTICE}</span></p> : null}
      </div>
    </main>
  );
}
