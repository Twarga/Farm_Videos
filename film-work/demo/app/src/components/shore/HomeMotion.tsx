"use client";

import { useEffect } from "react";

/** Home scroll moments from the mockup: proof counters roll up and step tiles act out their pose once, then rest. */
export function HomeMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const roll = (el: HTMLElement, to: number, ms: number) => {
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / ms);
        el.textContent = String(Math.round(to * (1 - (1 - k) ** 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target as HTMLElement;
      if (el.dataset.count) { el.textContent = "0"; roll(el, Number(el.dataset.count), 900); }
      const pet = el.dataset.pose ? el.querySelector<SVGElement>(".pet") : null;
      if (pet && el.dataset.pose) { pet.dataset.state = el.dataset.pose; timers.push(setTimeout(() => { pet.dataset.state = "idle"; }, 3200)); }
    }), { threshold: 0.5 });
    document.querySelectorAll("main [data-count], main [data-pose]").forEach(el => observer.observe(el));
    return () => { observer.disconnect(); timers.forEach(clearTimeout); };
  }, []);
  return null;
}
