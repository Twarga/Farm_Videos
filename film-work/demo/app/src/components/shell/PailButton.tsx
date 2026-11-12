"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCompare, COMPARE_MAX } from "@/components/CompareProvider";
import { comparisonPath } from "@/lib/compare-url";

export function PailButton() {
  const { ids } = useCompare();
  const pailRef = useRef<HTMLSpanElement>(null);
  const previous = useRef(ids.length);
  useEffect(() => {
    if (ids.length > previous.current && pailRef.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pailRef.current.classList.remove("bob"); void pailRef.current.getBoundingClientRect(); pailRef.current.classList.add("bob");
    }
    previous.current = ids.length;
  }, [ids.length]);
  const n = ids.length;
  return <Link className="pill pill--pail" href={n ? comparisonPath(ids) : "/compare"} id="pailBtn" data-n={n} aria-label={`Compare, ${n} of ${COMPARE_MAX} plans selected`}>
    <span className="pail" aria-hidden="true" ref={pailRef}><svg viewBox="0 0 34 30" className="pail__svg"><g className="pail__shells" id="pailShells">{Array.from({ length: Math.min(n, 4) }, (_, i) => <circle key={i} cx={10 + i * 4.7} cy={11 - (i % 2) * 1.6} r={3} />)}</g><path className="pail__body" d="M5 12h24l-2.6 14.4a2.4 2.4 0 0 1-2.4 2H10a2.4 2.4 0 0 1-2.4-2z"/><path className="pail__seam" d="M6.4 18.5h21.2"/><path className="pail__handle" d="M7.5 12C7.5 6.5 11.6 3 17 3s9.5 3.5 9.5 9"/></svg></span><span className="pill__label">Compare</span><span key={n} className={`pill__count num${n ? " pop" : ""}`} id="pailCount">{n}</span>
  </Link>;
}
