import { ImageResponse } from "next/og";
import { guideTopicLabels, listPublishedGuides } from "@/lib/guides";
import { getGuideAuthor } from "@/lib/authors";
import { checkedLabel } from "@/lib/format";
import { OG_COLORS as c, ogFonts, ogLockup, ogLockupRatio } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "bestvpsforme guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The guide hero: generated from the published article, so it cannot point at a missing file. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = listPublishedGuides().find((item) => item.slug === slug);
  if (!guide) {
    return new ImageResponse(
      <div style={{ width: 1200, height: 630, display: "flex", background: c.paper }} />,
      { ...size, fonts: ogFonts },
    );
  }
  const author = getGuideAuthor(guide.author);
  // Long titles need a smaller face to stay on four lines at 1200px.
  const titleSize = guide.title.length > 86 ? 54 : guide.title.length > 60 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: c.paper,
          padding: "64px 72px",
          fontFamily: "Ubuntu Sans",
          color: c.ink950,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Ubuntu Sans Mono", fontSize: 20, fontWeight: 600, color: c.ink500 }}>
          <span style={{ background: c.volt, color: c.ink950, padding: "4px 12px", borderRadius: 6 }}>GUIDE</span>
          <span>{guide.topics.map((topic) => guideTopicLabels[topic]).join(" · ")}</span>
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: titleSize, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, maxWidth: 980 }}>
          {guide.title}
        </div>
        <div style={{ display: "flex", marginTop: 26, fontSize: 26, fontWeight: 500, lineHeight: 1.35, color: c.ink600, maxWidth: 900 }}>
          {guide.description}
        </div>
        <div style={{ display: "flex", flex: 1 }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <img src={ogLockup} height={34} alt="" style={{ height: 34, width: Math.round(34 * ogLockupRatio) }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, fontFamily: "Ubuntu Sans Mono", fontSize: 20, fontWeight: 600, color: c.ink500 }}>
            {author ? <span style={{ color: c.ink950 }}>{author.name}</span> : null}
            <span>Updated {checkedLabel(guide.updatedAt)}</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts },
  );
}
