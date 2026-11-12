"use client";

import { SidebarSimple, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { applyPreferredTheme } from "@/lib/theme";
import styles from "./AdminConsole.module.css";

const SECTION_LABELS: Record<string, string> = {
  "/admin": "Overview",
  "/admin/offers": "Offers",
  "/admin/quality": "Data quality",
  "/admin/analytics": "Analytics",
  "/admin/providers": "Providers",
  "/admin/editorial": "Editorial",
  "/admin/terms": "Price terms",
  "/admin/corrections": "Corrections",
  "/admin/publications": "Publications",
  "/admin/affiliates": "Affiliates",
  "/admin/imports": "Import & publish",
  "/admin/health": "Health",
  "/admin/audit": "Audit log",
  "/admin/settings": "Settings",
};

export function AdminShell({ sidebar, topbar, children, notice, overlays, sectionLabel }: {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
  notice?: React.ReactNode;
  overlays?: React.ReactNode;
  sectionLabel?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const path = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { applyPreferredTheme(); }, []);
  useEffect(() => { setSidebarOpen(false); }, [path]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!sidebarOpen) { if (dialog.open) dialog.close(); return; }
    dialog.showModal();
    const overflow = document.body.style.overflow;
    const menuButton = menuRef.current;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      if (dialog.open) dialog.close();
      menuButton?.focus();
    };
  }, [sidebarOpen]);

  const section = sectionLabel ?? (path && SECTION_LABELS[path]) ?? "Control room";

  return (
    <div className={styles.shell} data-admin>
      <a className="admin-skip" href="#admin-content">Skip to content</a>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <button ref={menuRef} type="button" className={styles.mobile_menu} onClick={() => setSidebarOpen(true)} aria-label="Open navigation" aria-expanded={sidebarOpen} aria-controls="admin-navigation"><SidebarSimple size={20} aria-hidden /></button>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/admin">Control room</Link>
            <span aria-hidden="true">/</span>
            <strong aria-current="page">{section}</strong>
          </nav>
          <div className={styles.top_actions}>{topbar}</div>
        </header>
        {notice}
        <div id="admin-content" tabIndex={-1}>{children}</div>
      </div>
      <dialog ref={dialogRef} id="admin-navigation" className={styles.sidebar_dialog} aria-label="Admin navigation" onClose={() => setSidebarOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setSidebarOpen(false); }}>
        <button type="button" className={styles.mobile_nav_close} aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={20} aria-hidden /></button>
        <div onClick={(event) => { if ((event.target as HTMLElement).closest("a,button")) setSidebarOpen(false); }}>{sidebar}</div>
      </dialog>
      {overlays}
    </div>
  );
}
