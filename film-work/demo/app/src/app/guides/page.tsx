import Link from "next/link";
import type { Metadata } from "next";
import { guideTopicLabels, guideTopicValues, listPublishedGuides, type GuideTopic } from "@/lib/guides";
import { checkedLabel } from "@/lib/format";
import type { CSSProperties } from "react";
import { ShoreIcon } from "@/components/shore/ShoreIcon";
import art from "@/shore/shell-art.json";

const POSES = ["working", "quirk", "success", "idle", "working", "error"] as const;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ topic?: string }> }): Promise<Metadata> {
  const topic = (await searchParams).topic;
  return {
    title: "VPS guides",
    description: "Clear VPS guides for beginners, workload choices, provider comparisons, and first-party research.",
    alternates: { canonical: "https://bestvpsforme.com/guides" },
    robots: topic ? { index: false, follow: true } : undefined,
  };
}

export default async function GuidesPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const requestedTopic = (await searchParams).topic;
  const topic = guideTopicValues.includes(requestedTopic as GuideTopic) ? requestedTopic as GuideTopic : null;
  const published = listPublishedGuides();
  const visible = topic ? published.filter((guide) => guide.topics.includes(topic)) : published;

  return (
    <main id="main">
      <div className="page wrap">
        <header className="doc__head">
          <p className="kicker">Guides</p>
          <h1 className="ptitle">Pick a server without the guesswork.</h1>
          <p className="lead">
            Short guides that end in real plans from the catalog. Nothing here is sponsored.
          </p>
        </header>

        <nav aria-label="Guide topics" className="pfilters">
          <Link href="/guides" className={`chip${topic === null ? " is-on" : ""}`} aria-current={topic === null ? "true" : undefined}>All</Link>
          {guideTopicValues.map((value) => (
            <Link
              key={value}
              href={topic === value ? "/guides" : `/guides?topic=${value}`}
              className={`chip${topic === value ? " is-on" : ""}`}
              aria-current={topic === value ? "true" : undefined}
            >
              {guideTopicLabels[value]}
            </Link>
          ))}
        </nav>

        {!visible.length ? (
          <div className="state" role="status">
            <div className="state__art fish night" aria-hidden="true">
              <svg className="fish__rod" viewBox="0 0 240 180" focusable="false">
                <path className="fish__pole" d="M96 128 L188 34" />
                <path className="fish__line" d="M188 34 Q206 78 204 118" />
                <g className="fish__bob">
                  <path className="fish__ring" d="M190 124q14 -6 28 0" />
                  <circle cx="204" cy="118" r="5.5" />
                  <path d="M198.5 118h11" />
                </g>
              </svg>
              <span className="fish__sign">No guides yet</span>
            </div>
            <div>
              <h2>No guides in this topic yet.</h2>
              <p>Choose another topic or browse the catalog while this section grows from reviewed questions.</p>
              <div className="row">
                <Link href="/catalog" className="btn btn--primary">
                  Browse the catalog<ShoreIcon name="arrow" cls="ico--arrow" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <ul className="ggrid">
            {visible.map((guide, index) => (
              <li key={guide.slug} className="gc">
                <Link href={`/guides/${guide.slug}`}>
                  <span className="tile__art night" aria-hidden="true">
                    <svg className="pet s-patchwork k-bvp" viewBox="26 50 118 74" data-state={POSES[index % POSES.length]} style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.crab }} />
                  </span>
                  <span className="gc__b">
                    <span className="kicker">{guideTopicLabels[guide.topics[0]]}</span>
                    <span className="gc__t">{guide.title}</span>
                    <span className="gc__s">{guide.description}</span>
                    <time className="gc__m" dateTime={guide.updatedAt}>
                        Updated {checkedLabel(guide.updatedAt)}
                      </time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
