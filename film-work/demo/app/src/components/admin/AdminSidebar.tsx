"use client";

import {
  ArrowsClockwise,
  Buildings,
  ChartLineUp,
  ClockCounterClockwise,
  FileArrowUp,
  GearSix,
  Handshake,
  Heartbeat,
  ListChecks,
  Megaphone,
  NotePencil,
  Stack,
  Tag,
  WarningCircle,
} from "@phosphor-icons/react";
import { AdminThemeToggle } from "./AdminThemeToggle";
import styles from "./AdminConsole.module.css";

type Item = {
  id: string;
  label: string;
  icon: typeof ListChecks;
  href?: string;
};

const CATALOG: Item[] = [
  { id: "offers", label: "Offers", icon: Stack, href: "/admin/offers" },
  { id: "providers", label: "Providers", icon: Buildings, href: "/admin/providers" },
  { id: "affiliates", label: "Affiliates", icon: Handshake, href: "/admin/affiliates" },
];

const REVIEW: Item[] = [
  { id: "terms", label: "Price terms", icon: Tag, href: "/admin/terms" },
  { id: "editorial", label: "Editorial", icon: NotePencil, href: "/admin/editorial" },
  { id: "corrections", label: "Corrections", icon: ArrowsClockwise, href: "/admin/corrections" },
  { id: "quality", label: "Data quality", icon: WarningCircle, href: "/admin/quality" },
];

const PUBLISH: Item[] = [
  { id: "imports", label: "Import", icon: FileArrowUp, href: "/admin/imports" },
  { id: "publications", label: "Publications", icon: Megaphone, href: "/admin/publications" },
];

const SYSTEM: Item[] = [
  { id: "analytics", label: "Analytics", icon: ChartLineUp, href: "/admin/analytics" },
  { id: "health", label: "Health", icon: Heartbeat, href: "/admin/health" },
  { id: "audit", label: "Audit log", icon: ClockCounterClockwise, href: "/admin/audit" },
  { id: "settings", label: "Settings", icon: GearSix, href: "/admin/settings" },
];

/**
 * Shared admin navigation. `active` is either a route or a console view id.
 * On the console, `onNavigate` swaps views in place; everywhere else the
 * entries are plain links so a new admin route is one entry.
 */
export function AdminSidebar({ active, counts }: { active: string; onNavigate?: (view: string) => void; counts?: { termsReview: number; editorialDrafts: number; corrections: number; blockingImportIssues: number } }) {
  const badges: Record<string, number | undefined> = {
    terms: counts?.termsReview, editorial: counts?.editorialDrafts,
    corrections: counts?.corrections, quality: counts?.blockingImportIssues,
  };
  const group = (title: string, items: Item[]) => (
    <div className={styles.nav_group} key={title}>
      <p>{title}</p>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id || item.href === active;
        const className = `${styles.nav_item} ${isActive ? styles.nav_item_active : ""}`;
        const content = <><Icon size={18} weight={isActive ? "fill" : "regular"} aria-hidden /><span>{item.label}</span>{badges[item.id] != null ? <strong aria-label={`${badges[item.id]} open`}>{badges[item.id]}</strong> : null}</>;
        return <a key={item.id} className={className} href={item.href} aria-current={isActive ? "page" : undefined}>{content}</a>;
      })}
    </div>
  );

  return <>
    <a className={styles.brand_row} href="/admin" aria-label="Control room overview">
      <span className={styles.brand_text}><strong>bestvps<span>forme</span></strong><small>Control room</small></span>
    </a>
    <nav className={styles.nav} aria-label="Admin navigation">
      <a className={styles.nav_item} href="/admin" aria-current={active === "/admin" || active === "overview" ? "page" : undefined}><ListChecks size={18} aria-hidden /><span>Overview</span></a>
      {group("Catalog", CATALOG)}
      {group("Review queues", REVIEW)}
      {group("Publish", PUBLISH)}
      {group("System", SYSTEM)}
    </nav>
    <div className={styles.sidebar_footer}>
      <span className={styles.owner}><span className={styles.live_dot} /><span><strong>Private workspace</strong><small>Owner access</small></span></span>
      <AdminThemeToggle />
    </div>
  </>;
}
