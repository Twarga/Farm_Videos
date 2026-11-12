"use client";

import { usePathname } from "@/lib/site-navigation";
import { useEffect, type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { trackEvent } from "@/lib/analytics-client";


/** Client chrome wrapper: admin routes render bare, public routes get the full shell. */
export function SiteFrame({ children, footer, brand, crabArt }: { children: ReactNode; footer: ReactNode; brand: ReactNode; crabArt: string | null }) {
  const path = usePathname();
  const publicSite = !path.startsWith("/admin");
  useEffect(() => {
    if (!publicSite) return;
    let undo: (() => void) | null = null;
    let alive = true;
    // Pointer hints load on the first pointer move, so they never count against first-load JavaScript.
    const load = (event: PointerEvent) => void import("@/components/shore/tips").then(({ installTips }) => { if (alive) undo = installTips(event); });
    document.addEventListener("pointermove", load, { once: true, passive: true });
    return () => { alive = false; document.removeEventListener("pointermove", load); undo?.(); };
  }, [publicSite]);
  useEffect(() => {
    if (!publicSite) return;
    // The document came from /admin without public chrome: a soft navigation needs a full load.
    if (!crabArt) return location.reload();
    trackEvent({ name: "page_view", placement: "site", data: { page_type: path === "/" ? "home" : "public" } });
    const root = document.documentElement;
    const visibility = () => root.classList.toggle("tab-hidden", document.hidden);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle("asleep", !entry.isIntersecting);
      if (entry.isIntersecting && entry.target.matches("[data-draw]") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        entry.target.classList.add("cs-draw");
        entry.target.removeAttribute("data-draw");
      }
    }), { threshold: .15 });
    document.querySelectorAll(".pet, .hero__shore, [data-draw]").forEach(element => observer.observe(element));
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, [path, crabArt, publicSite]);
  if (!publicSite || !crabArt) return <>{children}</>;
  return <>{brand}<SiteHeader crabArt={crabArt} />{children}{footer}</>;
}
