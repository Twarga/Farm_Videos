"use client";

import Link from "next/link";
import { usePathname } from "@/lib/site-navigation";
import { ThemeToggle } from "./ThemeToggle";
import { PailButton } from "./PailButton";
import { MobileMenu } from "./MobileMenu";
import { useEffect, useRef, useState, CSSProperties } from "react";

const NAV_LINKS = [
  { href: "/catalog",        label: "VPS plans" },
  { href: "/special-offers", label: "Special offers" },
  { href: "/providers",      label: "Providers" },
  { href: "/guides",         label: "Guides" },
  { href: "/methodology",    label: "How we compare" },
];

/** `crabArt` is server-rendered markup: the static SVG belongs in the document, not the client bundle. */
export function SiteHeader({ crabArt }: { crabArt: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const top = useRef<HTMLElement>(null);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (open) nav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && open) { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  useEffect(() => {
    let frame = 0;
    const tide = () => { frame = 0; const max = document.documentElement.scrollHeight - innerHeight; document.documentElement.style.setProperty("--tide", max > 40 ? Math.min(1, Math.max(0, scrollY / max)).toFixed(4) : "0"); top.current?.classList.toggle("tidal", max > 40); };
    const queue = () => { if (!frame) frame = requestAnimationFrame(tide); };
    const resize = new ResizeObserver(queue);
    resize.observe(document.body);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    tide();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); };
  }, [path]);
  return <>
    <a className="skip" href="#main" onClick={event => { const main = document.getElementById("main") ?? document.querySelector("main"); if (main) { event.preventDefault(); main.tabIndex = -1; main.focus(); } }}>Skip to content</a>
    <header className={open ? "top open" : "top"} id="top" ref={top}>
      <div className="top__in">
        <Link className="brand" href="/" aria-label="bestvpsforme home"><span className="brand__crab" id="brandCrab" aria-hidden="true"><svg className="pet s-patchwork k-bvp" viewBox="33 72 76 50" data-state="idle" style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: crabArt }} /></span><span className="wordmark">bestvps<span>forme</span></span></Link>
        <nav className="nav" id="nav" aria-label="Main" ref={nav}>{NAV_LINKS.map(link => <Link key={link.href} href={link.href} aria-current={path === link.href || path.startsWith(link.href + "/") ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav>
        <div className="top__actions"><ThemeToggle /><PailButton /><MobileMenu open={open} onToggle={() => setOpen(value => !value)} buttonRef={trigger} /></div>
      </div>
      <span className="tide-wave" aria-hidden="true" /><span className="tide-line" aria-hidden="true"><i /></span>
    </header>
  </>;
}
