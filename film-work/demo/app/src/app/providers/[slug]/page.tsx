import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getPublicProviderPage } from "@/lib/public-providers";
import { getPublicShoreSource } from "@/lib/public-catalog";
import { providerRedirect } from "@/lib/public-redirects";
import { reviewedPrice } from "@/lib/real-price";
import { isFreeTier } from "@/lib/catalog";
import { JsonLd } from "@/lib/json-ld";
import { CURRENCY_NOTICE } from "@/lib/currency-notice";
import { shoreFmtDate, shoreMoney } from "@/components/shore/format";
import { ShellSvg } from "@/components/shore/ShellSvg";
import { shoreLogoSrc } from "@/lib/assets";
import { TrustpilotBadge, TrustpilotRating } from "@/components/shore/TrustpilotBadge";
import { ShoreProviderPlans } from "@/components/shore/ShoreProviderPlans";
import { ShoreIcon } from "@/components/shore/ShoreIcon";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPublicProviderPage(slug);
  if (!page && providerRedirect(slug)) permanentRedirect(`/providers/${providerRedirect(slug)}`);
  return page
    ? { title: `${page.provider.name} VPS plans`, alternates: { canonical: `https://bestvpsforme.com/providers/${page.provider.id}` } }
    : { title: "Provider" };
}

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params;
  const page = getPublicProviderPage(slug);
  if (!page && providerRedirect(slug)) permanentRedirect(`/providers/${providerRedirect(slug)}`);
  if (!page) notFound();
  const { provider, offers, affiliatePrograms } = page;

  // Build ShoreOffers for this provider using the full publication cohort for correct ranks
  const { offers: allShoreOffers } = getPublicShoreSource();
  const providerShoreOffers = allShoreOffers
    .filter((o) => o.pid === (provider.slug ?? provider.id))
    .sort((a, b) => (a.real ?? 1e9) - (b.real ?? 1e9) || (a.rank ?? 999) - (b.rank ?? 999));

  const published = offers.filter((o) => o.available);
  const locs = [...new Set(published.flatMap((o) => o.locations))];
  const reviewed = published.filter((o) => o.termsReviewed).length;
  // adFrom: advertised price from ShoreOffers (display price, not real), free tiers excluded
  const adFrom = providerShoreOffers.reduce<number | null>((min, o) => !o.free && o.usd != null && (min == null || o.usd < min) ? o.usd : min, null);
  // Real price range — only from reviewed offers, never a free tier
  const reals = published.filter((o) => !isFreeTier(o)).map((o) => reviewedPrice(o)?.monthly ?? null).filter((v): v is number => v != null);
  const realMin = reals.length ? Math.min(...reals) : null;
  const realMax = reals.length ? Math.max(...reals) : null;
  const catches = [...new Set(providerShoreOffers.map((o) => o.catch).filter((c): c is string => c != null))].slice(0, 4);
  const hasAffiliate = affiliatePrograms.length > 0 || published.some((o) => o.affiliate);
  // Know section — exact copy from original page, preserving test-expected strings
  const flatRenewals = published.filter((o) => o.renewalMonthly != null && o.renewalMonthly <= o.effectiveMonthly * 1.02).length;
  const setupFees = published.filter((o) => (o.setupFee ?? 0) > 0).length;
  const renewalStepUps = published.filter((o) => o.renewalMonthly != null && o.renewalMonthly > o.effectiveMonthly * 1.2);
  const renewalStepUpPriced = renewalStepUps.some((o) => reviewedPrice(o) != null);
  const know: { title: string; variant: string; items: string[] }[] = [
    { title: "Strong at", variant: "good", items: [
      flatRenewals ? `${flatRenewals === published.length ? "Every" : flatRenewals} published plan${flatRenewals === 1 ? "" : "s"} renew${flatRenewals === 1 ? "s" : ""} flat — no price step after the intro term.` : null,
      provider.trustpilotScore != null && provider.trustpilotScore >= 4 ? `Trustpilot ${provider.trustpilotScore.toFixed(1)} across ${provider.trustpilotCount?.toLocaleString("en-US") ?? "many"} reviews on the check date.` : null,
      published.some((o) => o.backups === true) ? "Backups available on at least one published plan." : null,
    ].filter((item): item is string => Boolean(item)) },
    { title: "Watch for", variant: "bad", items: [
      catches.length ? `${catches.length} published plan${catches.length === 1 ? " has" : "s have"} a catch — listed on each plan.` : null,
      setupFees ? `${setupFees} plan${setupFees === 1 ? "" : "s"} charge${setupFees === 1 ? "s" : ""} a setup fee as well.` : null,
      published.some((o) => o.ipv4Status === "extra") ? "IPv4 costs extra on some plans — check the catch line." : null,
      renewalStepUps.length ? (renewalStepUpPriced ? "Some plans step up at renewal — the 3-year price includes it." : "Some plans step up at renewal — the increase applies from the renewal date.") : null,
    ].filter((item): item is string => Boolean(item)) },
    { title: "Good to know", variant: "", items: [
      locs.length ? `${locs.length} server ${locs.length === 1 ? "country" : "countries"} across the published catalog.` : "Server locations aren't published.",
      hasAffiliate ? "Some outbound links are affiliate links — labeled on each plan. Rank never uses commission." : "No affiliate links on this provider's plans.",
    ].filter((item): item is string => Boolean(item)) },
  ].filter((card) => card.items.length);

  const shellOffer = { logoSrc: shoreLogoSrc(provider.slug ?? provider.id, provider.logoPath ?? null) };
  const tpOffer = {
    tp: provider.trustpilotScore ?? null,
    tpc: provider.trustpilotCount ?? null,
    tpDate: provider.trustpilotCheckedAt ?? null,
  };

  const pageUrl = `https://bestvpsforme.com/providers/${provider.id}`;
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Organization", "@id": pageUrl, name: provider.name, url: provider.site },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Providers", item: "https://bestvpsforme.com/providers" },
      { "@type": "ListItem", position: 2, name: provider.name, item: pageUrl },
    ] },
  ];

  return (
    <main id="main">
      <div className="page wrap">
        <JsonLd data={jsonLd} />
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/providers">Providers</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{provider.name}</span>
        </nav>

        <header className="phead">
          <span className="phead__shell" aria-hidden="true">
            <ShellSvg offer={shellOffer} />
          </span>
          <div>
            <h1 className="ptitle">{provider.name}</h1>
            <p className="phead__meta">
              <span>HQ {provider.hq ?? "not published"}</span>
              <TrustpilotBadge offer={tpOffer} full />
            </p>
          </div>
          {provider.site ? (
            <a className="btn btn--primary" href={provider.site} target="_blank" rel="noreferrer noopener">
              Visit {provider.name}<ShoreIcon name="out" />
            </a>
          ) : null}
        </header>

        <div className="pstats">
          <div><b className="num">{published.length}</b><span>plans in the catalog</span></div>
          {realMin != null ? (
              <div>
                <b className="num">
                  {shoreMoney(realMin)}{realMax != null && Math.abs(realMax - realMin) > 0.01 ? `–${shoreMoney(realMax)}` : ""}
                </b>
                <span>3-yr real range /mo</span>
              </div>
          ) : null}
          <div><b className="num">{reviewed}/{published.length}</b><span>billing terms reviewed</span></div>
          {locs.length ? (
            <div>
              <b className="num">{locs.length}</b>
              <span>Server {locs.length === 1 ? "country" : "countries"}</span>
            </div>
          ) : null}
          {provider.trustpilotScore != null ? (
            <div>
              <b className="num">{provider.trustpilotScore.toFixed(1)}</b>
              <span>{provider.trustpilotCount != null ? `Trustpilot · ${provider.trustpilotCount.toLocaleString("en-US")}` : "Trustpilot"}</span>
            </div>
          ) : null}
        </div>

        {know.length ? (
          <section className="know" aria-label="What to know">
            {know.map((card) => (
                <div key={card.title} className={card.variant}>
                  <h3>{card.title}</h3>
                {card.items.map((item) => <p key={item}>{item}</p>)}
                </div>
              ))}
            </section>
          ) : null}

        <section className="psec" aria-labelledby="pl-h">
          <div className="sec__head">
            <h2 id="pl-h">All {published.length} plan{published.length === 1 ? "" : "s"}</h2>
            <Link className="pill" href={`/catalog?providers=${provider.id}`}>
              Compare with other providers<ShoreIcon name="arrow" cls="ico--arrow" />
            </Link>
          </div>
          <ShoreProviderPlans offers={providerShoreOffers} />
          {providerShoreOffers.some((offer) => offer.cur !== "USD") ? <p className="fxnote"><span>{CURRENCY_NOTICE}</span></p> : null}
        </section>
      </div>
    </main>
  );
}
