"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useLayoutEffect, useState } from "react";
import { applyPreferredTheme, persistTheme, type Theme } from "@/lib/theme";

/** Theme switch shared by every admin page. Mirrors the public toggle. */
export function AdminThemeToggle() {
  const [theme, setTheme] = useState<Theme>("day");

  useLayoutEffect(() => {
    setTheme(applyPreferredTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === "night" ? "day" : "night";
    setTheme(next);
    persistTheme(next);
  }

  const label = theme === "night" ? "Switch to day theme" : "Switch to night theme";

  return (
    <button type="button" className="admin-theme-toggle" onClick={toggle} aria-label={label} title={label}>
      <span className="admin-theme-toggle__icon" data-theme-icon={theme}>
        {theme === "night" ? <Sun size={17} weight="bold" aria-hidden /> : <Moon size={17} weight="bold" aria-hidden />}
      </span>
    </button>
  );
}
