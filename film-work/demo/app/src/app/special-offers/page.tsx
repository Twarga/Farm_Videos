import { CURRENCY_NOTICE } from "@/lib/currency-notice";
import type { Metadata } from "next";
import { getPublicShoreSource } from "@/lib/public-catalog";
import { getPublishedDealOffers } from "@/lib/public-special-offers";
import { SpecialOffersClient } from "@/components/shore/SpecialOffersClient";
import type { ShoreOffer } from "@/lib/shore-offer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "VPS special offers",
  description: "Dated VPS promotions with the advertised billing period, hardware and provider source.",
  alternates: { canonical: "https://bestvpsforme.com/special-offers" },
};

export default function SpecialOffersPage() {
  const { offers: shoreOffers } = getPublicShoreSource();

  // Deals are the reviewed promotions that are still inside their expiry and
  // freshness window — never a list derived from intro fields alone.
  const deals = getPublishedDealOffers();

  // No-surprise flat plans: monthly billing, flat renewal — one per provider
  const seen = new Set<string>();
  const flat: ShoreOffer[] = [];
  for (const o of shoreOffers) {
    if (seen.has(o.pid)) continue;
    if (!o.tr || o.ren == null || o.usd == null) continue;
    const rate = o.cur === "USD" ? 1 : (o.fx ?? null);
    if (rate == null) continue;
    const isFlat = o.ren * rate <= o.usd * 1.02;
    const isMonthly = o.term == null || o.term <= 1;
    if (isFlat && isMonthly) {
      seen.add(o.pid);
      flat.push(o);
      if (flat.length >= 6) break;
    }
  }

  return (
    <main id="main">
      <SpecialOffersClient deals={deals} flat={flat} />
      <div className="wrap">{[...deals, ...flat].some((offer) => offer.cur !== "USD") ? <p className="fxnote"><span>{CURRENCY_NOTICE}</span></p> : null}</div>
    </main>
  );
}
