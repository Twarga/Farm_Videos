"use client";

import { useEffect, useState } from "react";

export function GuideToc({ headings }: { headings: { id: string; title: string }[] }) {
  const [current, setCurrent] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings.map(({ id }) => document.getElementById(id)).filter((element): element is HTMLElement => element != null);
    const offset = (Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64) + 48;
    const update = () => {
      const reached = elements.filter((element) => element.getBoundingClientRect().top <= offset);
      setCurrent((reached.at(-1) ?? elements[0])?.id ?? "");
    };
    const observer = new IntersectionObserver(update, { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 });
    elements.forEach((element) => observer.observe(element));
    update();
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="gtoc" aria-label="On this page">
      <p className="eyebrow m-0">On this page</p>
      {headings.length ? <ol>{headings.map((heading) => (
        <li key={heading.id}><a href={`#${heading.id}`} aria-current={current === heading.id ? "true" : undefined} onClick={() => setCurrent(heading.id)}>{heading.title}</a></li>
      ))}</ol> : <p className="cap muted mt-3">This guide has no sections yet.</p>}
    </nav>
  );
}
