"use client";

import Link from "next/link";
import { usePathname } from "@/lib/site-navigation";
import { useCompare, COMPARE_MAX } from "../CompareProvider";

export function CompareTray() {
  const path = usePathname();
  const { ids, clear, ready } = useCompare();
  // The compare page is itself the tray's destination — no tray over it.
  if (path.startsWith("/admin") || path === "/compare" || !ready || !ids.length) return null;
  return (
    <div className="tray">
      <span className="tray__label"><span className="num">{ids.length}</span> of {COMPARE_MAX} picked</span>
      <button type="button" onClick={() => clear()} className="btn btn--ghost btn--sm">Clear</button>
      <Link href="/compare" className="btn btn--volt btn--sm">Compare</Link>
    </div>
  );
}
