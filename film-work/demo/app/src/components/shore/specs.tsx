import type { ShoreOffer } from "@/lib/shore-offer";
import { shoreGb, shoreDisk, shoreBw } from "./format";
import { ShoreIcon } from "./ShoreIcon";

/** Split a formatted spec into "number" + "unit" for the ledger's meter cells. */
export function cpuPair(o: ShoreOffer): [string, string] | null {
  return o.vcpu != null ? [String(o.vcpu), "vCPU"] : null;
}
export function ramPair(o: ShoreOffer): [string, string] | null {
  const g = shoreGb(o.ram); return g ? [g.replace(/\s*(GB|MB)$/, ""), g.match(/(GB|MB)$/)?.[0] ?? "GB"] : null;
}
export function diskPair(o: ShoreOffer): [string, string] | null {
  const d = shoreDisk(o.disk); return d ? [d.replace(/\s*(GB|TB)$/, ""), d.match(/(GB|TB)$/)?.[0] ?? "GB"] : null;
}
export function bwPair(o: ShoreOffer): [string, string] | null {
  const b = shoreBw(o.bw); if (!b) return null;
  const m = /^([\d.]+)\s*(.*)$/.exec(b); return m ? [m[1], m[2]] : [b, ""];
}

/** Marker for a plan whose 3-year price has been reviewed. */
export const ReviewedPrice = <span className="rv" title="Reviewed 3-year price"><ShoreIcon name="check" /><span className="sr-only">Reviewed 3-year price</span></span>;
