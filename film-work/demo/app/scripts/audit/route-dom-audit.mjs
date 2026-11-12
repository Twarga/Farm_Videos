// Measures DOM size, forms, HTML weight and page height per route; screenshots admin routes.
// Usage: ORIGIN=http://127.0.0.1:3261 SESSION_FILE=/tmp/bvf-full/session.txt OUT=/tmp/bvf-audit node scripts/audit/route-dom-audit.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const origin = process.env.ORIGIN ?? "http://127.0.0.1:3261";
const out = process.env.OUT ?? "/tmp/bvf-audit";
const token = process.env.SESSION_FILE ? fs.readFileSync(process.env.SESSION_FILE, "utf8").trim() : null;
const routes = (process.env.ROUTES ?? "/admin,/admin?view=offers,/admin?view=providers,/admin?view=quality,/admin?view=analytics,/admin?view=activity,/admin/editorial,/admin/terms,/admin/imports,/admin/corrections,/admin/publications,/admin/providers,/admin/affiliates,/admin/audit,/admin/health,/admin/settings,/,/catalog,/compare,/providers,/special-offers").split(",");
fs.mkdirSync(path.join(out, "shots"), { recursive: true });
const browser = await chromium.launch();
const rows = [];
for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: "dark" });
  if (token) await context.addCookies([{ name: "bvf_admin_session", value: token, url: origin, httpOnly: true, sameSite: "Lax" }]);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error.message).slice(0, 160)));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text().slice(0, 160)); });
  for (const route of routes) {
    errors.length = 0;
    const started = Date.now();
    const response = await page.goto(origin + route, { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(800);
    const metrics = await page.evaluate(() => {
      const count = (selector) => document.querySelectorAll(selector).length;
      const visible = [...document.querySelectorAll("main *")].filter((element) => { const box = element.getBoundingClientRect(); return box.width > 0 && box.height > 0; }).length;
      return { elements: count("*"), mainVisible: visible, forms: count("form"), inputs: count("input,select,textarea"), buttons: count("button"), details: count("details"), rows: count("tr"), htmlKb: Math.round(document.documentElement.outerHTML.length / 1024), pageHeight: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth - innerWidth };
    });
    if (route.startsWith("/admin")) await page.screenshot({ path: path.join(out, "shots", `${width}-${route.replace(/[^a-z0-9]+/gi, "_")}.png`) });
    rows.push({ width, route, status: response?.status() ?? 0, ms: Date.now() - started, ...metrics, errors: [...new Set(errors)].slice(0, 4) });
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(path.join(out, "route-dom-audit.json"), JSON.stringify(rows, null, 2));
for (const row of rows) console.log([row.width, row.route, row.status, `el=${row.elements}`, `forms=${row.forms}`, `inputs=${row.inputs}`, `html=${row.htmlKb}K`, `h=${row.pageHeight}`, row.errors.join(" | ")].join(" "));
