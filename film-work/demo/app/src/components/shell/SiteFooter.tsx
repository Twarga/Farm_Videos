import Link from "next/link";
import type { CSSProperties } from "react";
import art from "@/shore/shell-art.json";
import type { ShoreCatalogMeta } from "@/lib/public-catalog";
import { snapshotLabel } from "@/lib/format";

export function SiteFooter({ year, meta }: { year: number; meta?: ShoreCatalogMeta }) {
  return <footer className="foot" id="foot">
    <svg className="foot__shore" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path className="fill" d="M0 22C120 12 240 30 360 20S600 10 720 22 960 32 1080 20 1320 12 1440 22V40H0Z"/><path className="seam" d="M0 22C120 12 240 30 360 20S600 10 720 22 960 32 1080 20 1320 12 1440 22"/></svg>
    <div className="foot__in">
      <div className="foot__crew" aria-hidden="true"><span className="foot__bear" id="footBear"><svg className="pet s-patchwork k-twargaops" viewBox="34 40 90 84" data-state="idle" style={{ "--accent": "var(--amber)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.bear }}/></span><span className="foot__crab" id="footCrab"><svg className="pet s-patchwork k-bvp" viewBox="26 50 118 74" data-state="idle" style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.crab }}/></span></div>
      <div className="foot__brand"><p className="wordmark wordmark--sm">bestvps<span>forme</span></p><p className="foot__line">Compare VPS prices, hardware and billing terms. Missing evidence stays marked.</p><p className="foot__company">bestvpsforme is a <strong>TwargaOps</strong> product. The Keeper keeps the light on; the crab reads the fine print.</p></div>
      <nav className="foot__cols" aria-label="Footer"><div><h2>Product</h2><Link href="/catalog">Plans</Link><Link href="/special-offers">Special offers</Link><Link href="/compare">Compare</Link><Link href="/providers">Providers</Link><Link href="/updates">Updates</Link></div><div><h2>Research</h2><Link href="/methodology">How we compare</Link><Link href="/guides">Guides</Link><Link href="/corrections">Corrections</Link></div><div><h2>Legal</h2><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/affiliate-disclosure">Affiliate disclosure</Link></div></nav>
    </div>
    <p className="foot__fine">Some links earn us a commission. They never change the order. · {meta?.status === "available" ? <span>{meta.count} plans, {meta.providers} providers · {meta.source === "explicit-fixture" ? "Explicit development fixture" : "Publication snapshot"} {snapshotLabel(meta.snapshotDate ? new Date(meta.snapshotDate) : null)}</span> : <span>Publication details unavailable</span>} · © {year} bestvpsforme · Provider names and logos belong to their owners.</p>
  </footer>;
}
