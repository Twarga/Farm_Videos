import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CaretRight,
  CheckCircle,
  Info,
  LinkSimple,
  PencilSimple,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { reviewedPrice } from "@/lib/real-price";
import { displayPriceUsd } from "@/lib/catalog";
import { checkedLabel, confidenceCopy, currencyNote, money, offerMoney, term, toUsd, usd, vatLabel } from "@/lib/format";
import { countryName } from "@/lib/labels";
import { resolveOfferProvider } from "@/lib/provider-resolver";
import type { Offer } from "@/lib/types";
import { ProviderLogo } from "../ProviderLogo";
import { DisclosureBar } from "../DisclosureBar";
import { Legend } from "../ui/Legend";
import { CostChart } from "./CostChart";
import { ComparePick } from "./ComparePick";


function hostOf(url: string): string | null {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; }
}

function trustLine(offer: Offer) {
  const provider = resolveOfferProvider(offer);
  if (provider.trustpilotScore == null) return "Trustpilot not published";
  const count = provider.trustpilotCount != null ? `${provider.trustpilotCount.toLocaleString("en-US")} reviews` : "reviews not published";
  const checked = provider.trustpilotCheckedAt ? ` · checked ${checkedLabel(provider.trustpilotCheckedAt)}` : "";
  return `${provider.trustpilotScore.toFixed(1)} Trustpilot · ${count}${checked}`;
}

function offerTags(offer: Offer) {
  const tags: { tone: "catch" | "ok"; label: string }[] = [];
  if (offer.billedUpfrontMonths != null && offer.billedUpfrontMonths > 1) tags.push({ tone: "catch", label: `${offer.billedUpfrontMonths}-month prepay` });
  else if (offer.commitmentMonths != null && offer.commitmentMonths > 1) tags.push({ tone: "catch", label: `${offer.commitmentMonths}-month term` });
  const renewal = toUsd({ amount: offer.renewalMonthly, currency: offer.currency, rate: offer.exchangeRate ?? null });
  const effective = usd(offer);
  if (renewal != null && effective != null && renewal > effective * 1.005) {
    tags.push({ tone: "catch", label: `Renews +${Math.round(((renewal - effective) / effective) * 100)}%` });
  }
  if (offer.setupFee != null && offer.setupFee > 0) tags.push({ tone: "catch", label: `Setup fee ${offerMoney(offer.setupFee, offer)}` });
  if (offer.ipv4Status === "included") tags.push({ tone: "ok", label: "IPv4 included" });
  else if (offer.ipv4Status === "extra") tags.push({ tone: "catch", label: "IPv4 costs extra" });
  return tags;
}

function Receipt({ offer }: { offer: Offer }) {
  const provider = resolveOfferProvider(offer);
  const projection = reviewedPrice(offer);
  const real = projection?.monthly ?? null;
  const headline = displayPriceUsd(offer);
  const total = projection?.total ?? null;
  const advertised = toUsd({ amount: offer.advertisedMonthly, currency: offer.currency, rate: offer.exchangeRate ?? null });
  const due = toUsd({ amount: offer.cashDueNow, currency: offer.currency, rate: offer.exchangeRate ?? null });
  const renewal = toUsd({ amount: offer.renewalMonthly, currency: offer.currency, rate: offer.exchangeRate ?? null });
  const upfrontMonths = offer.billedUpfrontMonths;
  const introductoryMonths = offer.introMonths ?? offer.billedUpfrontMonths;
  return (
    <aside className="card receipt" aria-label="Price breakdown">
      <div className="receipt__top">
        <span className="tag tag--volt">{real != null ? "3-year real price" : "Effective monthly price"}</span>
        <span className="cap muted">USD</span>
      </div>
      <div className="receipt__big">
        <span className="n-2xl">{headline != null ? money(headline, "USD") : "—"}</span>
        {headline != null ? <span>/mo</span> : null}
      </div>
      <ul className="xray__lines">
        <li><span>Advertised</span>{advertised != null && headline != null && Math.abs(advertised - headline) > 0.01 ? <span className="num strike">{money(advertised, "USD")}/mo</span> : advertised != null ? <span className="num">{money(advertised, "USD")}/mo</span> : <span className="subtle">Not published</span>}</li>
        <li><span>Due today {upfrontMonths != null && upfrontMonths > 1 ? <span className="muted">· {term(upfrontMonths)} upfront</span> : null}</span>{due != null ? <span className="num">{money(due, "USD")}</span> : <span className="subtle">Not published</span>}</li>
        <li><span>{introductoryMonths != null && introductoryMonths > 0 ? `Renews from month ${introductoryMonths + 1}` : "Renews at"}</span>{renewal != null ? <span className="num">{money(renewal, "USD")}/mo</span> : <span className="subtle">Not published</span>}</li>
        <li><span>Setup fee</span>{offer.setupFee != null ? <span className="num">{offerMoney(offer.setupFee, offer)}</span> : <span className="subtle">Not published</span>}</li>
        <li className="total"><span>3-year total</span>{total != null ? <span className="n-md">{money(total, "USD")}</span> : <span className="subtle">Not published</span>}</li>
      </ul>
      <div className="receipt__cta">
        <div className="receipt__actions">
          <a className="btn btn--volt btn--lg" href={`/go/${offer.id}`} rel={offer.affiliate ? "sponsored nofollow" : "nofollow"}>
            Visit {provider.name} <ArrowUpRight aria-hidden weight="bold" />
          </a>
          <ComparePick offerId={offer.id} name={offer.productName} />
          {offer.affiliate ? <span className="cap muted">Affiliate link</span> : null}
        </div>
      </div>
      <p className="receipt__fine">
        <LinkSimple aria-hidden />
        <span>{offer.affiliate ? (
          <><b>Affiliate link.</b> We may earn a commission if you buy. It never changes the order, and the price you pay is the same.</>
        ) : (
          <><b>Direct link.</b> No commission on this plan — the Visit button goes straight to the provider.</>
        )}</span>
      </p>
      <p className="receipt__fine"><span>{vatLabel(offer.vatBasis)}.</span></p>
      {currencyNote(offer) ? <p className="receipt__fine"><span>{currencyNote(offer)}.</span></p> : null}
    </aside>
  );
}

function SpecGrid({ offer }: { offer: Offer }) {
  const cells: { label: string; value: string | null; note?: string }[] = [
    { label: "CPU", value: offer.vcpu != null ? `${offer.vcpu} vCPU` : null, note: offer.cpuKind !== "Not published" ? offer.cpuKind : undefined },
    { label: "Memory", value: offer.ramGb != null ? `${offer.ramGb} GB` : null, note: offer.ramGb != null ? undefined : "Confirm at checkout" },
    { label: "Disk", value: offer.diskGb != null ? `${offer.diskGb} GB` : null, note: offer.diskKind !== "Not published" ? offer.diskKind : undefined },
    { label: "Transfer", value: offer.transfer !== "Not published" ? offer.transfer : null, note: offer.transfer !== "Not published" ? "per month" : undefined },
    {
      label: "IPv4",
      value: { included: "Included", extra: "Extra cost", "location-dependent": "Varies", unknown: null }[offer.ipv4Status],
      note: { included: "1 address", extra: "Billed separately", "location-dependent": "Depends on location", unknown: "Confirm at checkout" }[offer.ipv4Status],
    },
    { label: "Backups", value: offer.backups == null ? null : offer.backups ? "Available" : "Not included", note: offer.backups == null ? "Confirm at checkout" : undefined },
    { label: "Management", value: offer.managed == null ? null : offer.managed ? "Managed" : "Unmanaged", note: offer.managed == null ? "Confirm at checkout" : undefined },
    { label: "Locations", value: offer.locations.length ? `${new Set(offer.locations).size}` : null, note: offer.locations.length ? [...new Set(offer.locations)].slice(0, 8).join(", ") + (new Set(offer.locations).size > 8 ? ` +${new Set(offer.locations).size - 8}` : "") : undefined },
  ];
  return (
    <dl className="specs">
      {cells.map((cell) => (
        <div className="spec" key={cell.label}>
          <dt>{cell.label}</dt>
          {cell.value != null
            ? <dd>{cell.value}{cell.note ? <small>{cell.note}</small> : null}</dd>
            : <dd className="unk"><span aria-hidden>—</span><span className="sr-only">Not published</span>{cell.note ? <small>{cell.note}</small> : null}</dd>}
        </div>
      ))}
    </dl>
  );
}

function Evidence({ offer }: { offer: Offer }) {
  const provider = resolveOfferProvider(offer);
  const domain = hostOf(offer.url) || hostOf(provider.site) || "the provider page";
  const renewalNote = offer.renewalMonthly != null ? "Renewal stated in the provider's own terms." : "Renewal price not published — we did not infer it.";
  return (
    <div className="evidence">
      <div className="ev">
        <span className="stamp"><CheckCircle aria-hidden />Checked {checkedLabel(offer.checkedAt)}</span>
        <p>Price, term and renewal read from <a href={offer.url} target="_blank" rel="noreferrer">{domain}</a>. {renewalNote}</p>
      </div>
      <div className="ev">
        <span className="stamp"><ShieldCheck aria-hidden />Confidence: {offer.confidence}</span>
        <p>{confidenceCopy(offer.confidence)}.{offer.termsReviewed ? " Billing terms were read in full." : " Billing terms not fully reviewed yet."}</p>
      </div>
      <div className="ev">
        <span className="stamp"><PencilSimple aria-hidden />Spot an error?</span>
        <p>Send the field and a source. We fix and date every correction. <Link href={`/corrections?offer=${encodeURIComponent(offer.id)}`}>Report a correction</Link></p>
      </div>
    </div>
  );
}

function AltRow({ offer, saveVs }: { offer: Offer; saveVs: number }) {
  const provider = resolveOfferProvider(offer);
  const real = reviewedPrice(offer)?.monthly ?? null;
  const flat = real != null && offer.renewalMonthly != null && Math.abs(toUsd({ amount: offer.renewalMonthly, currency: offer.currency, rate: offer.exchangeRate ?? null })! - real) < Math.max(0.02, real * 0.02);
  return (
    <tr>
      <td className="c-plan">
        <Link className="id" href={`/offers/${offer.id}`}>
            <span className="row" style={{ "--gap": "12px" } as React.CSSProperties}>
              <span className="pmark pmark--sm"><ProviderLogo provider={provider} size={28} bare /></span>
              <span><strong>{offer.productName}</strong><span className="id__sub block">{provider.name}</span></span>
            </span>
        </Link>
      </td>
      <td className="c-price r"><span className="price"><b>{real != null ? money(real, "USD") : "Not published"}{real != null ? <small>/mo</small> : null}</b><span>{flat ? "same every month" : offer.commitmentMonths != null && offer.commitmentMonths > 1 ? `${offer.commitmentMonths}-month term` : offer.commitmentMonths === 1 ? "monthly term" : "Term not published"}</span></span></td>
      <td className="c-spec"><span className="spec3"><span>{offer.vcpu ?? "—"}<small>vCPU</small></span><span>{offer.ramGb ?? "—"}<small>GB</small></span><span>{offer.diskGb ?? "—"}<small>GB {offer.diskKind !== "Not published" ? offer.diskKind : ""}</small></span></span></td>
      <td className="c-trust">{provider.trustpilotScore != null ? <span className="trust"><b className="num">{provider.trustpilotScore.toFixed(1)}</b><span>{provider.trustpilotCount != null ? `${provider.trustpilotCount.toLocaleString("en-US")} reviews` : "reviews"}</span></span> : <span className="unk">Not published</span>}</td>
      <td>{saveVs > 0.005 ? <span className="save">−{money(saveVs, "USD")} over 3 yrs</span> : <span className="unk">—</span>}</td>
      <td className="c-act r"><Link className="btn btn--line btn--sm visit" href={`/offers/${offer.id}`}>View <ArrowRight aria-hidden /></Link></td>
    </tr>
  );
}

export function OfferPage({ offer, siblings, alternatives }: { offer: Offer; siblings: Offer[]; alternatives: Offer[] }) {
  const provider = resolveOfferProvider(offer);
  const projection = reviewedPrice(offer);
  const real = projection?.monthly ?? null;
  const realTotal = projection?.total ?? null;
  const monthly = displayPriceUsd(offer);
  const tags = offerTags(offer);
  const hq = countryName(provider.hq);

  return (
    <>
      {offer.affiliate ? <DisclosureBar /> : null}
      <main id="main" className="container--wide offer-main">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/catalog">Plans</Link>
          <CaretRight aria-hidden />
          <Link href={`/providers/${provider.id}`}>{provider.name}</Link>
          <CaretRight aria-hidden />
          <span aria-current="page">{offer.productName}</span>
        </nav>

        <section className="ohero">
          <div>
              <div className="oid">
                <span className="pmark pmark--xl"><ProviderLogo provider={provider} size={64} bare eager /></span>
                <div>
                  <p className="oid__p">{provider.name}{hq ? <span> · HQ {hq}</span> : null}</p>
                  <p className="cap muted mt-2">{trustLine(offer)}</p>
                </div>
              </div>
            <h1 className="d-2xl">{offer.productName}</h1>
            <div className="otags">
              <span className="stamp"><CheckCircle aria-hidden />Price checked {checkedLabel(offer.checkedAt)}</span>
              {tags.map((tag) => (
                <span key={tag.label} className={`tag tag--${tag.tone}`}><span className={`dot dot--${tag.tone}`} />{tag.label}</span>
              ))}
            </div>
            <h2 className="h-sm mt-6 mb-4">Hardware and extras</h2>
            <SpecGrid offer={offer} />
            {offer.whyFit || offer.catch ? (
              <div className="verdict">
                {offer.whyFit ? (
                  <div className="good"><h2><CheckCircle aria-hidden />Good for</h2><p>{offer.whyFit}</p></div>
                ) : null}
                {offer.catch ? (
                  <div className="bad"><h2><WarningCircle aria-hidden />The catch</h2><p>{offer.catch}</p></div>
                ) : null}
              </div>
            ) : null}
          </div>
          <Receipt offer={offer} />
        </section>

        <div className="mbar">
          <div>
            <b>{monthly != null ? money(monthly, "USD") : "Not published"}<span>/mo</span></b>
            <small>{real != null ? "3-year real price" : "Effective monthly price"} · {offer.affiliate ? "affiliate link" : "direct link"}</small>
          </div>
          <a className="btn btn--volt" href={`/go/${offer.id}`} rel={offer.affiliate ? "sponsored nofollow" : "nofollow"}>Visit {provider.name} <ArrowUpRight aria-hidden weight="bold" /></a>
        </div>

        {projection ? (
          <section className="blk" data-reveal>
            <div className="blk__head">
              <div><h2 className="h-sm">Projected service cost</h2></div>
              <Legend items={[{ label: "Reviewed service cost" }, { label: "What the ad implies", dashed: true }]} />
            </div>
            <CostChart offer={offer} />
          </section>
        ) : null}


        <section className="blk" data-reveal>
          <div className="blk__head"><h2 className="h-sm">Sources and checks</h2></div>
          <Evidence offer={offer} />
        </section>

        {alternatives.length || siblings.length ? (
          <section className="blk alts" data-reveal>
            {alternatives.length ? (
              <>
                <div className="blk__head">
                  <div><p className="eyebrow">Alternatives</p><h2 className="d-md mt-4">Same {offer.ramGb} GB, lower 3-year price.</h2></div>
                  <Link className="btn btn--line" href={`/catalog?ram=${offer.ramGb}`}>See all {offer.ramGb} GB plans <ArrowRight aria-hidden /></Link>
                </div>
                <div className="alts__scroll" role="region" aria-label="Lower-priced alternatives" tabIndex={0}>
                <table className="dtable">
                  <thead><tr><th className="c-plan">Plan</th><th className="c-price r">3-yr real price</th><th className="c-spec">CPU · RAM · Disk</th><th className="c-trust">Trustpilot</th><th>You save</th><th className="c-act r"><span className="sr-only">Action</span></th></tr></thead>
                  <tbody>{alternatives.map((alt) => {
                    const altTotal = reviewedPrice(alt)?.total ?? null;
                    return <AltRow key={alt.id} offer={alt} saveVs={realTotal != null && altTotal != null ? realTotal - altTotal : 0} />;
                  })}</tbody>
                </table>
                </div>
              </>
            ) : null}
            {siblings.length ? (
              <>
                <h3 className={`h-md${alternatives.length ? " mt-12" : ""}`}>Other {provider.name} plans</h3>
                <div className="alts__siblings">
                  {siblings.map((sibling) => (
                    <Link key={sibling.id} className="chip" href={`/offers/${sibling.id}`}>
                      {sibling.productName}{sibling.ramGb != null ? ` · ${sibling.ramGb} GB` : ""}
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </section>
        ) : null}
      </main>
    </>
  );
}
