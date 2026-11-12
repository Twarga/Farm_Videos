import Link from "next/link";
import { ArrowUpRight, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { parseGuideMarkdown, type GuideBlock } from "@/lib/guide-markdown";
import { getActiveSnapshotDate, getPublishedCatalogOffer } from "@/lib/public-catalog";
import { resolveOfferProvider } from "@/lib/provider-resolver";
import { money, snapshotLabel } from "@/lib/format";
import { reviewedPrice } from "@/lib/real-price";
import { GuideTrackedLink } from "./GuideTrackedLink";
import { getDatasetStats } from "@/lib/dataset-stats";

function targetType(href: string): "catalog" | "provider" | "offer" | "guide" | "methodology" {
  if (href.startsWith("/catalog")) return "catalog";
  if (href.startsWith("/providers/")) return "provider";
  if (href.startsWith("/offers/")) return "offer";
  if (href.startsWith("/guides/")) return "guide";
  return "methodology";
}

function inlineText(text: string, prefix: string, guideSlug: string) {
  return text.split(/(\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (link) {
      const label = link[1]!;
      const href = link[2]!;
      if (href.startsWith("/")) return <GuideTrackedLink key={`${prefix}-link-${index}`} href={href} guideSlug={guideSlug} placement={`${prefix}-internal-link`} targetType={targetType(href)}>{label}</GuideTrackedLink>;
      if (href.startsWith("https://")) return <a key={`${prefix}-link-${index}`} href={href} target="_blank" rel="noreferrer">{label}</a>;
    }
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={`${prefix}-strong-${index}`}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={`${prefix}-code-${index}`}>{part.slice(1, -1)}</code>;
    return <span key={`${prefix}-text-${index}`}>{part}</span>;
  });
}

export function GuideArticleBody({ body, guideSlug }: { body: string; guideSlug: string }) {
  const blocks = parseGuideMarkdown(body);
  return <div className="gprose">{blocks.map((block, index) => <GuideBlockView block={block} guideSlug={guideSlug} key={`${block.type}-${index}`} />)}</div>;
}

/** `:::plans id, id` — real published plans rendered as a mini compare table. */
function PlansMentioned({ ids }: { ids: string[] }) {
  const offers = ids.map((id) => getPublishedCatalogOffer(id)).filter((offer): offer is NonNullable<typeof offer> => Boolean(offer));
  if (!offers.length) return null;
  const snapshot = getActiveSnapshotDate();
  return (
    <div className="mention">
      <h3>Plans mentioned <span>{offers.length} plan{offers.length === 1 ? "" : "s"} · {snapshot ? <>Snapshot <time dateTime={snapshot.toISOString()}>{snapshotLabel(snapshot)}</time></> : "Snapshot date unavailable"}</span></h3>
      <div className="tablewrap">
        <table className="dtable">
          <thead><tr><th className="c-plan" scope="col">Plan</th><th className="c-price r" scope="col">3-yr real</th><th className="c-spec" scope="col">Specs</th><th className="c-act r" scope="col"><span className="sr-only">Action</span></th></tr></thead>
          <tbody>
            {offers.map((offer) => {
              const provider = resolveOfferProvider(offer);
              const real = reviewedPrice(offer)?.monthly ?? null;
              return (
                <tr key={offer.id}>
                  <td><Link className="id" href={`/offers/${offer.id}`}><span><strong>{offer.productName}</strong><span className="id__sub block">{provider.name}</span></span></Link></td>
                  <td className="r"><span className="price"><b>{real != null ? money(real, "USD") : "Not published"}{real != null ? <small>/mo</small> : null}</b></span></td>
                  <td><span className="cap muted">{offer.vcpu ?? "—"} vCPU · {offer.ramGb ?? "—"} GB RAM · {offer.diskGb ?? "—"} GB</span></td>
                  <td className="r"><Link className="btn btn--line btn--sm" href={`/offers/${offer.id}`}>View <ArrowUpRight aria-hidden /></Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DatasetStats() {
  const stats = getDatasetStats();
  const rows = [
    ["Public offers", stats.publishedOffers],
    ["Active providers", stats.activeProviders],
    ["Offer-location links", stats.locationLinks],
    ["Comparison offers", stats.comparisonOffers],
    ["Comparison providers", stats.comparisonProviders],
    ["Research rows awaiting review", stats.reviewOnlyRows],
    ["Research rows rejected or blocked", stats.rejectedRows],
  ] as const;
  return <section aria-label="Current publication counts">
    <p>Active snapshot: {stats.snapshotDate ? <time dateTime={stats.snapshotDate}>{stats.snapshotDate}</time> : "Not published"}.</p>
    <div className="guide-table-wrap"><table>
      <thead><tr><th scope="col">Measure</th><th scope="col">Count</th></tr></thead>
      <tbody>{rows.map(([label, count]) => <tr key={label}><th scope="row">{label}</th><td className="num">{count ?? "Not published"}</td></tr>)}</tbody>
    </table></div>
    <p>The homepage and default catalog use the comparison set: published plans from active providers with a Trustpilot score on file. The research review totals belong to the original CSV, identified by its checksum; later imports do not change those totals.</p>
  </section>;
}

function GuideBlockView({ block, guideSlug }: { block: GuideBlock; guideSlug: string }) {
  if (block.type === "heading") {
    return block.level === 2
      ? <h2 id={block.id}>{block.title}</h2>
      : <h3 id={block.id}>{block.title}</h3>;
  }
  if (block.type === "paragraph") return <p>{inlineText(block.text, `paragraph-${block.text.slice(0, 12)}`, guideSlug)}</p>;
  if (block.type === "callout") return <div className="callout" role="note"><WarningCircle aria-hidden weight="fill" /><p>{inlineText(block.text, "callout", guideSlug)}</p></div>;
  if (block.type === "formula") return <div className="formula">{block.text.split("\n").map((line, index) => <span key={index}>{line}{index < block.text.split("\n").length - 1 ? <br /> : null}</span>)}{block.note ? <small>{block.note}</small> : null}</div>;
  if (block.type === "plans") return <PlansMentioned ids={block.ids} />;
  if (block.type === "stats") return <DatasetStats />;
  if (block.type === "list") {
    const List = block.ordered ? "ol" : "ul";
    return <List>{block.items.map((item, index) => <li key={`${item}-${index}`}>{inlineText(item, `list-${index}`, guideSlug)}</li>)}</List>;
  }
  return <div className="guide-table-wrap"><table><thead><tr>{block.headers.map((header) => <th key={header}>{inlineText(header, `header-${header}`, guideSlug)}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={`row-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`cell-${rowIndex}-${cellIndex}`}>{inlineText(cell, `cell-${rowIndex}-${cellIndex}`, guideSlug)}</td>)}</tr>)}</tbody></table></div>;
}
