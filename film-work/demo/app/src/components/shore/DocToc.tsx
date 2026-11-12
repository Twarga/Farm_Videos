"use client";

import { useEffect, useRef, useState } from "react";

export type TocEntry = { id: string; heading: string };

/**
 * Shore wireToc client island — scroll-spy highlights the active section.
 * Matches mockup wireToc() IntersectionObserver behaviour exactly.
 * Rendered inside the .toc nav; replaces the static <ol> with a live one.
 */
/** `bare`: entry ids are the heading ids themselves (guide markdown), not s-/h- prefixed sections. */
export function DocToc({ sections, bare = false }: { sections: TocEntry[]; bare?: boolean }) {
  const sectionId = (id: string) => (bare ? id : `s-${id}`);
  const headingId = (id: string) => (bare ? id : `h-${id}`);
  const [active, setActive] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  // A TOC click owns the highlight until its scroll settles; the scroll-spy would otherwise
  // pick whichever section the jump passes or the one above a short target.
  const lockRef = useRef<{ id: string; until: number } | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !(lockRef.current && entry.time < lockRef.current.until)) {
            setActive(bare ? entry.target.id : entry.target.id.replace(/^s-/, ""));
          }
        }
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    for (const s of sections) {
      const el = document.getElementById(sectionId(s.id));
      if (el) observerRef.current.observe(el);
    }
    return () => observerRef.current?.disconnect();
  }, [sections, bare]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const heading = document.getElementById(headingId(id));
    if (!heading) return;
    setActive(id);
    lockRef.current = { id, until: e.timeStamp + 1200 };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    heading.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    heading.focus({ preventScroll: true });
  }

  return (
    <nav className="toc" aria-label="On this page">
      <p>On this page</p>
      <ol>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${sectionId(s.id)}`}
              className={active === s.id ? "on" : undefined}
              aria-current={active === s.id ? "true" : undefined}
              onClick={(e) => handleClick(e, s.id)}
            >
              {s.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
