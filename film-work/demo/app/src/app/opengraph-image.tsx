import { ImageResponse } from "next/og";
import { getPublicCatalogState, getActiveSnapshotDate } from "@/lib/public-catalog";
import { filterOffers } from "@/lib/catalog";
import { parseCatalogQuery } from "@/lib/catalog-url";
import { snapshotLabel } from "@/lib/format";
import { OG_COLORS as c, ogFonts, ogLockup, ogCrab, ogLockupRatio } from "@/lib/og";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Compare VPS plans · bestvpsforme";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const catalog = getPublicCatalogState();
  const plans = catalog.status === "available" ? filterOffers(parseCatalogQuery(new URLSearchParams()), catalog.offers).length : null;
  const date = getActiveSnapshotDate();
  const publicationLabel = date ? `Snapshot ${snapshotLabel(date)}` : "Snapshot date unavailable";
  return new ImageResponse(
    <div style={{ width: 1200, height: 630, display: "flex", position: "relative", background: c.paper, padding: "64px 72px", fontFamily: "Ubuntu Sans", color: c.ink950 }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <img src={ogLockup} height={54} width={Math.round(54 * ogLockupRatio)} alt="" />
        <div style={{ display: "flex", flexDirection: "column", marginTop: 48, fontSize: 82, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.05 }}>
          <span>Compare VPS plans.</span>
          <span style={{ color: "#5c47a8", marginTop: 8 }}>Read the fine print.</span>
        </div>
        <div style={{ marginTop: 30, fontSize: 27, fontWeight: 500, lineHeight: 1.4, color: c.ink600, maxWidth: 720 }}>
          {plans != null ? `${plans} published plans. Prices, hardware and billing terms—with missing evidence marked.` : "Published catalog unavailable. Missing evidence stays marked."}
        </div>
      </div>
      <img src={ogCrab} width={230} height={230} alt="" style={{ position: "absolute", right: 56, bottom: 102 }} />
      <div style={{ position: "absolute", left: 72, bottom: 48, display: "flex", gap: 24, fontFamily: "Ubuntu Sans Mono", fontSize: 20, color: c.ink600 }}>
        <span>{publicationLabel}</span><span>bestvpsforme.com</span>
      </div>
    </div>,
    { ...size, fonts: ogFonts },
  );
}
