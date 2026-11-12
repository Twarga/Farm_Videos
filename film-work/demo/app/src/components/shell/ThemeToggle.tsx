"use client";

import { useLayoutEffect, useState } from "react";
import { switchThemeWithLantern, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("night");
  // The <head> bootstrap already applied the stored or system theme; mirror it.
  useLayoutEffect(() => { setTheme(document.documentElement.dataset.theme === "day" ? "day" : "night"); }, []);
  function toggle() { const next: Theme = theme === "night" ? "day" : "night"; setTheme(next); switchThemeWithLantern(next); }
  return <button className="pill pill--icon" id="themeBtn" type="button" aria-label={theme === "night" ? "Switch to day theme" : "Switch to night theme"} onClick={toggle}><svg className="ico ico--moon" aria-hidden="true"><use href="#i-moon" /></svg><svg className="ico ico--sun" aria-hidden="true"><use href="#i-sun" /></svg></button>;
}
