import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GuideArticleBody } from "@/components/guides/GuideArticleBody";
import { GuideTrackedLink } from "@/components/guides/GuideTrackedLink";
import { DocToc } from "@/components/shore/DocToc";
import { guideTopicLabels, listPublishedGuides } from "@/lib/guides";
import { getGuideAuthor } from "@/lib/authors";
import { guideStructuredData } from "@/lib/guide-structured-data";
import { parseGuideMarkdown } from "@/lib/guide-markdown";
import { JsonLd } from "@/lib/json-ld";
import { checkedLabel } from "@/lib/format";
import { ShoreIcon } from "@/components/shore/ShoreIcon";

type Props = { params: Promise<{ slug: string }> };

function getGuide(slug: string) {
  return listPublishedGuides().find((guide) => guide.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return { title: "Guide" };
  const author = getGuideAuthor(guide.author);
  return {
    title: guide.title,
    description: guide.description,
    authors: author ? [{ name: author.name, url: `https://bestvpsforme.com/authors/${author.slug}` }] : undefined,
    alternates: { canonical: `https://bestvpsforme.com/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: author ? [`https://bestvpsforme.com/authors/${author.slug}`] : undefined,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const allGuides = listPublishedGuides().filter((item) => item.slug !== guide.slug);
  const author = getGuideAuthor(guide.author);
  if (!author) notFound();
  const jsonLd = guideStructuredData(guide, author);
  const blocks = parseGuideMarkdown(guide.body);
  const headings = blocks
    .filter((block): block is Extract<typeof blocks[number], { type: "heading" }> => block.type === "heading" && block.level === 2)
    .map(({ id, title }) => ({ id, heading: title }));
  const related = allGuides
    .filter((item) => item.topics.some((topic) => guide.topics.includes(topic)))
    .slice(0, 3);

  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="main">
        <div className="page wrap doc">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/guides">Guides</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{guide.title}</span>
          </nav>

          <div className="doc__body">
            {/* Shore wireToc client island — scroll-spy */}
            <DocToc sections={headings} bare />

            <div>
              <header className="doc__head">
                <p className="kicker">
                  {guide.topics.map((topic) => guideTopicLabels[topic]).join(" · ")}
                </p>
                <h1 className="ptitle">{guide.title}</h1>
                <p className="lead">{guide.description}</p>
                <p className="byline">
                  <span>
                    By <Link href={`/authors/${author.slug}`}>{author.name}</Link>
                  </span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={guide.updatedAt}>Updated {checkedLabel(guide.updatedAt)}</time>
                </p>
              </header>

              <article className="prose garticle">
                <GuideArticleBody body={guide.body} guideSlug={guide.slug} />
              </article>

              <footer className="gend">
                <div className="gend__cta">
                  <div>
                    <h2>Compare current plans</h2>
                    <p>Dated prices, hardware and locations in one table.</p>
                  </div>
                  <GuideTrackedLink
                    href="/catalog"
                    guideSlug={guide.slug}
                    placement="article-catalog-cta"
                    targetType="catalog"
                    className="btn btn--primary"
                  >
                    Browse the catalog
                  </GuideTrackedLink>
                </div>
                <p className="gend__note">
                  Published{" "}
                  <time dateTime={guide.publishedAt}>{checkedLabel(guide.publishedAt)}</time>
                  {guide.dataSnapshotAt ? <>, using the catalog snapshot of {guide.dataSnapshotAt}</> : null}.
                  Prices change, so check the plan page before buying. Some links may earn us a
                  commission; it never changes rankings. Spot an error?{" "}
                  <Link href="/corrections">Send a correction</Link>.
                </p>
                {related.length ? (
                  <section className="gend__related" aria-labelledby="related-heading">
                    <h2 id="related-heading">More guides</h2>
                    <ul className="ggrid ggrid--3">
                      {related.map((item) => (
                        <li key={item.slug} className="gc">
                          <GuideTrackedLink
                            href={`/guides/${item.slug}`}
                            guideSlug={guide.slug}
                            placement="article-related-guide"
                            targetType="guide"
                          >
                            <span className="gc__b">
                              <span className="kicker">
                                {item.topics.map((t) => guideTopicLabels[t]).join(" · ")}
                              </span>
                              <span className="gc__t">{item.title}</span>
                              <span className="gc__s">{item.description}</span>
                            </span>
                          </GuideTrackedLink>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </footer>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
