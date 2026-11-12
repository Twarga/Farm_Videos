import { CURRENCY_NOTICE } from "@/lib/currency-notice";
import { getPublishedCatalogOfferState, getPublishedCatalogOffers } from "@/lib/public-catalog";
import { resolveOfferProvider } from "@/lib/provider-resolver";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { offerRedirect } from "@/lib/public-redirects";
import { JsonLd } from "@/lib/json-ld";
import { ShoreOfferPage } from "@/components/shore/ShoreOfferPage";
import { buildShoreOffers } from "@/lib/shore-offer";
import { reviewedPrice } from "@/lib/real-price";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const state = getPublishedCatalogOfferState(id);
  if (state.status === "unavailable") throw new Error("Public offer storage unavailable");
  const offer = state.offer;
  if (!offer && offerRedirect(id)) permanentRedirect(`/offers/${offerRedirect(id)}`);
  if (!offer) return { title: "Offer" };
  return { title: `${resolveOfferProvider(offer).name} ${offer.productName}`, alternates: { canonical: `https://bestvpsforme.com/offers/${offer.id}` } };
}

export default async function OfferRoute({ params }: Props) {
  const { id } = await params;
  const state = getPublishedCatalogOfferState(id);
  if (state.status === "unavailable") throw new Error("Public offer storage unavailable");
  const offer = state.offer;
  if (!offer && offerRedirect(id)) permanentRedirect(`/offers/${offerRedirect(id)}`);
  if (!offer) notFound();
  const provider = resolveOfferProvider(offer);
  const published = getPublishedCatalogOffers();
  const shoreOffers = buildShoreOffers(published);
  const shoreOffer = shoreOffers.find((item) => item.id === offer.id);
  if (!shoreOffer) notFound();
  const siblings = shoreOffers.filter((item) => item.providerId === offer.providerId && item.id !== offer.id);
  const realTotals = new Map(published.map((candidate) => [candidate.id, reviewedPrice(candidate)?.total ?? null]));
  const sourceTotal = realTotals.get(offer.id) ?? null;
  const alternatives = sourceTotal != null && offer.ramGb != null
    ? shoreOffers.filter((candidate) => candidate.providerId !== offer.providerId && candidate.ram === offer.ramGb && (realTotals.get(candidate.id) ?? null) != null && realTotals.get(candidate.id)! < sourceTotal)
      .sort((a, b) => realTotals.get(a.id)! - realTotals.get(b.id)!).slice(0, 3)
    : [];
  const pageUrl = `https://bestvpsforme.com/offers/${offer.id}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${provider.name} ${offer.productName}`,
      description: offer.whyFit,
      category: "Virtual private server",
      sku: offer.id,
      brand: { "@type": "Brand", name: provider.name },
      url: pageUrl,
      offers: {
        "@type": "Offer",
        price: offer.effectiveMonthly,
        priceCurrency: offer.currency,
        url: offer.url,
        seller: { "@type": "Organization", name: provider.name },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Catalog", item: "https://bestvpsforme.com/catalog" },
        { "@type": "ListItem", position: 2, name: provider.name, item: `https://bestvpsforme.com/providers/${provider.id}` },
        { "@type": "ListItem", position: 3, name: offer.productName, item: pageUrl },
      ],
    },
  ];
  return <main id="main"><JsonLd data={jsonLd} /><ShoreOfferPage offer={shoreOffer} siblings={siblings} alternatives={alternatives} />{shoreOffer.cur !== "USD" ? <div className="wrap"><p className="fxnote"><span>{CURRENCY_NOTICE}</span></p></div> : null}</main>;
}
