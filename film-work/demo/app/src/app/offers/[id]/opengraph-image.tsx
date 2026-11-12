import { ImageResponse } from "next/og";
import { getPublishedCatalogOffer } from "@/lib/public-catalog";
import { resolveOfferProvider } from "@/lib/provider-resolver";
import { offerMoney } from "@/lib/format";
import { OG_COLORS as c, ogFonts, ogLockup, providerMarkDataUri, ogLockupRatio } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "bestvpsforme offer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = getPublishedCatalogOffer(id);
  if (!offer) {
    return new ImageResponse(
      <div style={{ width: 1200, height: 630, display: "flex", background: c.paper }} />,
      { ...size, fonts: ogFonts },
    );
  }
  const provider = resolveOfferProvider(offer);
  const mark = providerMarkDataUri(provider.id);

  const specs = [
    offer.vcpu != null ? `${offer.vcpu} vCPU` : null,
    offer.ramGb != null ? `${offer.ramGb} GB` : null,
    offer.diskGb != null ? `${offer.diskGb} GB ${offer.diskKind}`.trim() : null,
  ].filter(Boolean).join(" · ");

  const headline = offer.termsReviewed && offer.realMonthly != null ? offer.realMonthly : offer.effectiveMonthly;

  const rows: Array<{ label: string; value: string; strike?: boolean }> = [];
  if (offer.advertisedMonthly != null && offer.advertisedMonthly !== headline) {
    rows.push({ label: "Advertised", value: offerMoney(offer.advertisedMonthly, offer), strike: true });
  }
  if (offer.cashDueNow != null) rows.push({ label: "Due today", value: offerMoney(offer.cashDueNow, offer) });
  if (offer.renewalMonthly != null) rows.push({ label: "Renews at", value: offerMoney(offer.renewalMonthly, offer) });
  const tag = offer.termsReviewed && offer.realMonthly != null ? "3-year real price" : "Advertised price";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          position: "relative",
          background: c.ink50,
          padding: "56px 64px",
          fontFamily: "Ubuntu Sans",
          color: c.ink950,
          alignItems: "center",
          gap: 48,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <div style={{ width: 96, height: 96, borderRadius: 24, padding: 16, background: c.paper, border: `2px solid ${c.ink950}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {mark ? (
                <img src={mark} width={64} height={64} alt="" style={{ objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: 34, fontWeight: 700 }}>{provider.name.slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 30, fontWeight: 700 }}>{provider.name}</span>
              {specs ? <span style={{ marginTop: 8, fontSize: 22, fontWeight: 500, fontFamily: "Ubuntu Sans Mono", color: c.ink600 }}>{specs}</span> : null}
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 84, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>
            {offer.productName}
          </div>
          {offer.catch ? (
            <div style={{ marginTop: 30, display: "flex", gap: 14, alignItems: "baseline", fontSize: 26, fontWeight: 600, lineHeight: 1.35, maxWidth: 560 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: c.verm500, display: "flex", flexShrink: 0, alignSelf: "center" }} />
              {offer.catch}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 470,
            padding: 40,
            background: c.paper,
            borderRadius: 24,
            border: `3px solid ${c.ink950}`,
            boxShadow: `8px 8px 0 0 ${c.ink950}`,
          }}
        >
          <div style={{ display: "flex", padding: "8px 14px", borderRadius: 8, background: c.volt, fontSize: 18, fontWeight: 700, alignSelf: "flex-start" }}>
            {tag}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 120, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.9, alignItems: "baseline" }}>
            {offerMoney(headline, offer)}
            <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: 0, color: c.ink500 }}>/mo</span>
          </div>
          {rows.length ? (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 28, borderTop: `2px dashed ${c.ink300}` }}>
              {rows.map((r) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: `2px dashed ${c.ink300}`, fontSize: 22, fontWeight: 500 }}>
                  <span>{r.label}</span>
                  <span style={{ fontFamily: "Ubuntu Sans Mono", fontWeight: 600, textDecoration: r.strike ? "line-through" : "none", textDecorationColor: c.verm500, color: r.strike ? c.ink500 : c.ink950 }}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <img src={ogLockup} height={34} alt="" style={{ position: "absolute", left: 64, bottom: 44, height: 34, width: Math.round(34 * ogLockupRatio) }} />
      </div>
    ),
    { ...size, fonts: ogFonts },
  );
}
