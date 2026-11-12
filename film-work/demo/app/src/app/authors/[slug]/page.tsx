import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideAuthor } from "@/lib/authors";
import { listPublishedGuides } from "@/lib/guides";
import { DocLayout } from "@/components/shore/DocLayout";
import { checkedLabel } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = getGuideAuthor((await params).slug);
  return author
    ? { title: author.name, description: author.description, alternates: { canonical: `https://bestvpsforme.com/authors/${author.slug}` } }
    : { title: "Author" };
}

export default async function AuthorPage({ params }: Props) {
  const author = getGuideAuthor((await params).slug);
  if (!author) notFound();
  const articles = listPublishedGuides().filter((guide) => guide.author === author.slug);

  return (
    <main id="main">
      <DocLayout
        kicker={author.role}
        title={author.name}
        lead={author.description}
        sections={[
          {
            id: "expertise",
            heading: "Areas covered",
            content: (
              <ul>
                {author.expertise.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ),
          },
          {
            id: "standards",
            heading: "Editorial standards",
            content: (
              <>
                <p>
                  We identify the source or method for each material claim. Provider prices,
                  locations, and availability use the dated publication shown on the page.
                </p>
                <p>
                  We keep unknown facts visible, review time-sensitive guides when the catalog
                  changes, and publish sourced corrections through the{" "}
                  <Link href="/corrections">corrections desk</Link>.
                </p>
                <p>
                  Affiliate status and commission never influence editorial conclusions or catalog
                  ranking. Read the full <Link href="/about">editorial policy</Link>.
                </p>
              </>
            ),
          },
          {
            id: "guides",
            heading: "Published guides",
            content: articles.length ? (
              <ul>
                {articles.map((article) => (
                  <li key={article.slug}>
                    <Link href={`/guides/${article.slug}`}>{article.title}</Link>
                    <p className="fine">Updated {checkedLabel(article.updatedAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No published guides yet.</p>
            ),
          },
        ]}
      />
    </main>
  );
}
