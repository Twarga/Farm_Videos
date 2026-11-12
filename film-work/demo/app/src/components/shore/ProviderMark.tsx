import type { ShoreOffer } from "@/lib/shore-offer";

const FELT = ["#3b3270", "#2e4a5c", "#5a3a2c", "#2f4a35", "#4a2f4a", "#38405e"];

function feltOf(s: string): string {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = ((h * 31 + s.charCodeAt(i)) >>> 0);
  return FELT[h % FELT.length];
}

function initials(name: string): string {
  return name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

/** `logoSrc` is resolved on the server (see `toShoreOffer`) so the logo map stays out of client bundles. */
export function ProviderMark({ offer, large = false }: { offer: Pick<ShoreOffer, "pid" | "p" | "logoSrc">; large?: boolean }) {
  const cls = `pm${large ? " pm--lg" : ""}`;
  if (offer.logoSrc) {
    return (
      <span className={`pm pm--logo${large ? " pm--lg" : ""}`} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- provider logos are static brand marks, matching the mockup markup */}
        <img src={offer.logoSrc} alt="" width={40} height={40} loading="lazy" decoding="async" />
      </span>
    );
  }
  return (
    <span className={cls} style={{ "--pmc": feltOf(offer.pid) } as React.CSSProperties} aria-hidden="true">
      {initials(offer.p)}
    </span>
  );
}
