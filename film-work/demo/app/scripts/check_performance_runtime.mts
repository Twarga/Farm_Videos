import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import Database from "better-sqlite3";
import { chromium, expect } from "@playwright/test";
import type { Browser, Page } from "@playwright/test";
import lighthouse from "lighthouse";
import type { Flags } from "lighthouse";
import { assessInp, assessLoadSample, summarize, withMeasurementDeadline } from "../src/lib/phase7-measurement";
import type { InpAssessment } from "../src/lib/phase7-measurement";
import { getPublicCatalogState } from "../src/lib/public-catalog";
import { listPublishedGuides, loadGuides } from "../src/lib/guides";
import { getDb, closeDatabase } from "../src/db/client";
import { adminUsers } from "../src/db/schema";
import { ADMIN_SESSION_COOKIE, createAdminSession, hashAdminPassword } from "../src/lib/admin-auth";
import { listProviders } from "../src/db/repositories";
import { createRuntime, packageVersion, saveReport, sleep, unusedPort } from "./phase7-runtime";

const require = createRequire(path.resolve("package.json"));
const settings: Flags = {
  onlyCategories: ["performance"], onlyAudits: ["errors-in-console"], output: "json", logLevel: "error", formFactor: "mobile",
  throttlingMethod: "devtools",
  throttling: { rttMs: 150, throughputKbps: 1638.4, requestLatencyMs: 150, downloadThroughputKbps: 1638.4, uploadThroughputKbps: 750, cpuSlowdownMultiplier: 4 },
  screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false },
  maxWaitForLoad: 45_000,
};
type LoadSample = { route: string; template: string; mode: "cold" | "warm"; run: number; valid: boolean; failures: string[]; lcp: number | null; cls: number | null; tbt: number | null; artifact?: string; settings?: unknown; warnings?: unknown; error?: string };
type InpState = { value: number | null; interactionCount: number; supported: boolean; eventEntries: number; metricId: string | null; documentRoute: string };
type Journey = { name: string; route: string; authenticated?: boolean; action: (page: Page) => Promise<void> };

function contentFingerprint(databasePath: string): string {
  const database = new Database(databasePath, { readonly: true, fileMustExist: true });
  try {
    const tables = database.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all() as { name: string }[];
    const hash = createHash("sha256");
    for (const { name } of tables) {
      if (/^(?:sqlite_|admin_|analytics_)/.test(name) || name === "audit_log") continue;
      hash.update(name);
      hash.update(JSON.stringify(database.prepare(`SELECT * FROM "${name.replaceAll('"', '""')}" ORDER BY rowid`).all()));
    }
    return hash.digest("hex");
  } finally { database.close(); }
}

async function main() {
  const phase = process.env.PERFORMANCE_PHASE ?? "final";
  assert.ok(phase === "baseline" || phase === "final", "PERFORMANCE_PHASE must be baseline or final");
  const runs = Number(process.env.PERF_RUNS ?? 3);
  assert.ok(Number.isInteger(runs) && runs >= 3, "PERF_RUNS must be an integer >=3");
  const reportPath = path.resolve(process.env.PERF_REPORT_PATH ?? `docs/qa/phase-7/performance-${phase}.json`);
  const artifactDirectory = path.resolve(process.env.PERF_ARTIFACT_DIR ?? `${reportPath}.artifacts`);
  fs.mkdirSync(artifactDirectory, { recursive: true });
  const runtime = await createRuntime().catch((error: unknown) => {
    saveReport(reportPath, { schemaVersion: 1, phase, generatedAt: new Date().toISOString(), passed: false, failedAt: "runtime-initialization", failures: [error instanceof Error ? error.message : "Runtime initialization failed"] });
    throw error;
  });
  let browser: Browser | null = null;
  const samples: LoadSample[] = [];
  const interactions: Array<{ journey: string; route: string; run: number; valid: boolean; error?: string; evidence?: InpState; assessment?: InpAssessment }> = [];
  const failures: string[] = [];
  const report: Record<string, unknown> = {
    schemaVersion: 1, phase, generatedAt: new Date().toISOString(), identity: runtime.identity,
    versions: { node: process.version, next: runtime.identity.next, playwright: packageVersion(require.resolve("@playwright/test/package.json")), lighthouse: packageVersion(require.resolve("lighthouse/package.json")), webVitals: packageVersion(path.join(path.dirname(require.resolve("web-vitals")), "../package.json")) },
    requestedRunsPerRouteAndCacheMode: runs, settings,
    budgets: { lcpMsExclusive: 2000, clsExclusive: 0.05, labInpMsExclusive: 200, initialCatalogJsBytesExclusive: 120_000 },
    scope: "Local Lighthouse load and scripted lab INP only; the separate catalog-js-budget report is required for the JavaScript launch gate",
    javascriptBudget: { status: "separate-check-required", tool: "scripts/check_phase7_js_budget.ts" },
    fieldInp: { status: "unavailable", reason: "Local scripted sessions are lab evidence, not field p75" }, samples, interactions, failures,
  };
  try {
    const state = getPublicCatalogState();
    assert.equal(state.status, "available", "Copied publication must be available");
    assert.ok(state.offers.length >= 2, "A filled comparison needs two published offers");
    const offer = state.offers[0];
    const providerSlug = listProviders().find((provider) => provider.id === offer.providerId)?.slug;
    assert.ok(providerSlug, "Selected published offer needs a canonical provider");
    const guides = runtime.buildDirectory === process.cwd() ? listPublishedGuides() : loadGuides(path.join(runtime.buildDirectory, "content/guides")).filter((guide) => guide.reviewStatus === "published" && guide.publishedAt <= new Date().toISOString().slice(0, 10));
    assert.ok(guides.length, "A published guide is required");
    const comparison = `/compare?p=${state.offers.slice(0, 2).map((item) => encodeURIComponent(item.id)).join(",")}`;
    const routes = [
      { template: "home", route: "/" }, { template: "catalog", route: "/catalog" }, { template: "special-offers", route: "/special-offers" },
      { template: "compare-filled", route: comparison }, { template: "provider", route: `/providers/${encodeURIComponent(providerSlug)}` },
      { template: "guide", route: `/guides/${encodeURIComponent(guides[0].slug)}` }, { template: "offer", route: `/offers/${encodeURIComponent(offer.id)}` },
    ];
    report.routes = routes;
    report.publicOfferCount = state.offers.length;
    closeDatabase();
    for (const { route, template } of routes) {
      for (let run = 1; run <= runs; run++) {
        const origin = await runtime.start(); // A new production process for every cold/warm pair.
        const port = await unusedPort();
        browser = await chromium.launch({ headless: true, args: [`--remote-debugging-port=${port}`, "--remote-debugging-address=127.0.0.1"] });
        report.versions = { ...(report.versions as object), chromium: browser.version(), chromiumExecutable: chromium.executablePath() };
        try {
          for (const mode of ["cold", "warm"] as const) {
            try {
              console.log(`Measuring ${phase}: ${template} ${mode} ${run}/${runs}`);
              const result = await withMeasurementDeadline(() => lighthouse(`${origin}${route}`, { ...settings, port, disableStorageReset: mode === "warm" }), 75_000);
              assert.ok(result, "Lighthouse produced no result");
              const lhr = result.lhr;
              const lcp = lhr.audits["largest-contentful-paint"]?.numericValue ?? null;
              const cls = lhr.audits["cumulative-layout-shift"]?.numericValue ?? null;
              const warnings = lhr.runWarnings.map(String);
              const consoleFailure = lhr.audits["errors-in-console"]?.score === 0 ? "Browser console/runtime error" : undefined;
              const assessment = assessLoadSample({ lcp, cls, warnings, runtimeError: lhr.runtimeError?.code ?? consoleFailure });
              const artifact = path.join(artifactDirectory, `${template}-${mode}-${run}.json`);
              saveReport(artifact, lhr);
              samples.push({ route, template, mode, run, ...assessment, lcp, cls, tbt: lhr.audits["total-blocking-time"]?.numericValue ?? null, artifact, settings: lhr.configSettings, warnings });
            } catch (error) {
              samples.push({ route, template, mode, run, valid: false, failures: ["Lighthouse runtime failed"], lcp: null, cls: null, tbt: null, error: error instanceof Error ? error.stack ?? error.message : "Unknown Lighthouse error" });
              // A timed-out CDP run cannot safely share a browser with its warm pair.
              if (error instanceof Error && error.message.startsWith("Measurement timed out")) {
                if (mode === "cold") samples.push({ route, template, mode: "warm", run, valid: false, failures: ["Warm sample not attempted after cold measurement timed out"], lcp: null, cls: null, tbt: null });
                break;
              }
            }
          }
        } finally { await browser.close(); browser = null; await runtime.stop(); }
      }
    }
    const summaries = routes.flatMap(({ route }) => (["cold", "warm"] as const).map((mode) => {
      const rows = samples.filter((sample) => sample.route === route && sample.mode === mode);
      const valid = rows.filter((sample) => sample.valid);
      if (valid.length < runs) failures.push(`${route} ${mode}: ${valid.length}/${runs} valid Lighthouse samples`);
      for (const sample of rows) for (const failure of sample.failures) failures.push(`${route} ${mode} run ${sample.run}: ${failure}`);
      return { route, mode, validSamples: valid.length, invalidSamples: rows.length - valid.length, lcp: valid.length ? summarize(valid.map((sample) => sample.lcp!)) : null, cls: valid.length ? summarize(valid.map((sample) => sample.cls!)) : null, passed: valid.length >= runs && rows.every((sample) => !sample.failures.length) };
    }));
    report.loadSummaries = summaries;
    // Auth is added only after public load measurements, on this private /tmp copy.
    const contentBefore = contentFingerprint(runtime.databasePath);
    const adminId = `admin-phase7-performance-${randomUUID()}`;
    getDb().insert(adminUsers).values({ id: adminId, email: `${adminId}@example.invalid`, passwordHash: await hashAdminPassword(randomUUID()), isActive: true }).run();
    const adminSession = createAdminSession(adminId, "Disposable performance validation");
    closeDatabase();
    const journeys: Journey[] = [
      { name: "filters-auto-apply-clear", route: "/catalog", action: async (page) => {
        await page.getByRole("button", { name: /^Open filters/ }).click();
        const dialog = page.getByRole("dialog", { name: "Catalog filters", exact: true });
        await expect(dialog).toBeVisible();
        await dialog.getByRole("button", { name: "4 GB", exact: true }).click();
        await expect(page).toHaveURL(/ram=4/);
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
        await page.getByRole("button", { name: "Clear all", exact: true }).click();
        await expect(page).toHaveURL(/\/catalog$/);
      } },
      { name: "sort-keyboard", route: "/catalog", action: async (page) => {
        const sort = page.getByRole("combobox", { name: "Sort results" });
        await sort.focus(); await sort.press("End"); await sort.press("Enter");
        await expect(page).toHaveURL(/sort=/);
      } },
      { name: "pagination", route: "/catalog", action: async (page) => {
        await page.getByRole("navigation", { name: "Catalog pagination" }).getByRole("link", { name: "Next →", exact: true }).click();
        await expect(page).toHaveURL(/page=2/);
        await expect(page.locator(".orow").first()).toBeVisible();
      } },
      { name: "compare-picks", route: "/catalog", action: async (page) => {
        const picks = page.getByRole("checkbox", { name: /^Pick .+ to compare$/ });
        await picks.nth(0).click(); await picks.nth(1).click();
        await expect(page.locator(".orow.is-picked")).toHaveCount(2);
        await picks.nth(0).click();
        await expect(page.locator(".orow.is-picked")).toHaveCount(1);
      } },
      { name: "compare-removal", route: comparison, action: async (page) => {
        await expect(page.getByRole("link", { name: /^Remove / })).toHaveCount(2);
        await page.getByRole("link", { name: /^Remove / }).first().click();
        await expect(page.getByRole("link", { name: /^Remove / })).toHaveCount(1);
      } },
      { name: "theme", route: "/", action: async (page) => {
        await page.getByRole("button", { name: "Switch to dark", exact: true }).click();
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
        await page.getByRole("button", { name: "Switch to light", exact: true }).click();
        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      } },
      { name: "admin-client-validation", route: "/admin", action: async (page) => {
        // Invalid native input deliberately prevents any authentication submission.
        await page.getByLabel("Email", { exact: true }).pressSequentially("not-an-email", { delay: 30 });
        await page.getByRole("button", { name: "Sign in", exact: true }).click();
        assert.equal(await page.getByLabel("Email", { exact: true }).evaluate((input) => {
          if (!(input instanceof HTMLInputElement)) throw new Error("Email input unavailable");
          return input.validity.typeMismatch;
        }), true);
        await expect(page).toHaveURL(/\/admin$/);
      } },
      { name: "admin-authenticated-offer-validation", route: "/admin?view=offers", authenticated: true, action: async (page) => {
        let writes = 0;
        const observeWrite = (request: import("@playwright/test").Request) => {
          if (request.method() === "POST" && new URL(request.url()).pathname.startsWith("/admin")) writes++;
        };
        page.on("request", observeWrite);
        try {
          await expect(page).not.toHaveURL(/error=expired/);
          await page.getByRole("button", { name: /^Edit / }).first().click();
          const editor = page.getByRole("dialog");
          await expect(editor).toBeVisible();
          const productName = editor.getByLabel("Product name", { exact: true });
          await productName.fill("");
          await editor.getByRole("button", { name: "Save changes", exact: true }).click();
          await expect(productName).toBeFocused();
          assert.equal(await productName.evaluate((input) => {
            if (!(input instanceof HTMLInputElement)) throw new Error("Product input unavailable");
            return input.validity.valueMissing;
          }), true);
          assert.equal(writes, 0, "Invalid editor input must not submit an admin mutation");
          await expect(editor).toBeVisible();
        } finally { page.off("request", observeWrite); }
      } },
    ];
    const origin = await runtime.start();
    browser = await chromium.launch({ headless: true });
    const vitals = fs.readFileSync(path.join(path.dirname(require.resolve("web-vitals")), "web-vitals.iife.js"), "utf8");
    for (const journey of journeys) for (let run = 1; run <= runs; run++) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1, colorScheme: "light" });
      if (journey.authenticated) await context.addCookies([{ name: ADMIN_SESSION_COOKIE, value: adminSession.token, url: origin, httpOnly: true, sameSite: "Lax" }]);
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", () => errors.push("Browser runtime error"));
      page.on("requestfailed", (request) => { if (request.failure()?.errorText !== "net::ERR_ABORTED") errors.push(`Request failed: ${new URL(request.url()).pathname}`); });
      await page.addInitScript({ content: `${vitals}\n(() => {
        window.__phase7Inp = {value:null, interactionCount:0, supported:PerformanceObserver.supportedEntryTypes.includes('event') && 'interactionCount' in performance, eventEntries:0, metricId:null, documentRoute:location.pathname};
        new PerformanceObserver(list => {window.__phase7Inp.eventEntries += list.getEntries().length;}).observe({type:'event', buffered:true, durationThreshold:16});
        webVitals.onINP(metric => {window.__phase7Inp.value=metric.value;window.__phase7Inp.metricId=metric.id;}, {reportAllChanges:true,durationThreshold:16});
      })();` });
      try {
        const cdp = await context.newCDPSession(page);
        await cdp.send("Network.enable");
        await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1638.4 * 1000 / 8, uploadThroughput: 750 * 1000 / 8, connectionType: "cellular4g" });
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        console.log(`Measuring ${phase}: lab INP ${journey.name} ${run}/${runs}`);
        await page.goto(`${origin}${journey.route}`, { waitUntil: "load", timeout: 45_000 });
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        if (!journey.route.startsWith("/admin")) {
          // Next streams/prefetches routes; readiness is hydration of a real control,
          // not a promise that all background network activity has stopped.
          await page.waitForFunction(() => {
            const toggle = document.querySelector('button[aria-label^="Switch to "]');
            return toggle && Object.keys(toggle).some((key) => key.startsWith("__reactFiber$"));
          });
        }
        await journey.action(page);
        await sleep(1000); // onINP reports during idle after Event Timing delivery.
        const evidence = await page.evaluate(() => {
          // This shape is installed by this page's addInitScript above.
          const global = window as unknown as Window & { __phase7Inp: InpState };
          const interactionCount = "interactionCount" in performance && typeof performance.interactionCount === "number" ? performance.interactionCount : 0;
          return { ...global.__phase7Inp, interactionCount };
        });
        const assessment = assessInp(evidence);
        const valid = !errors.length && assessment.status !== "unavailable";
        if (!valid || !assessment.passed) failures.push(`${journey.name} run ${run}: ${errors.join("; ") || assessment.status + " lab INP budget failure"}`);
        interactions.push({ journey: journey.name, route: journey.route, run, valid, evidence, assessment });
      } catch (error) {
        interactions.push({ journey: journey.name, route: journey.route, run, valid: false, error: error instanceof Error ? error.message : "Unknown journey error" });
        failures.push(`${journey.name} run ${run}: invalid journey`);
      } finally { await context.close(); }
    }
    report.interactionSummaries = journeys.map(({ name, route }) => {
      const rows = interactions.filter((sample) => sample.journey === name);
      const numeric = rows.flatMap((sample) => sample.valid && sample.assessment?.status === "measured" ? [sample.assessment.value] : []);
      return { journey: name, route, validSamples: rows.filter((sample) => sample.valid).length, measured: numeric.length ? summarize(numeric) : null, belowThresholdSamples: rows.filter((sample) => sample.assessment?.status === "below-observer-threshold").length, passed: rows.length >= runs && rows.every((sample) => sample.valid && sample.assessment?.passed) };
    });
    assert.equal(contentFingerprint(runtime.databasePath), contentBefore, "Performance journeys must not mutate catalog, editorial, import or publication content");
    report.contentUnchanged = true;
  } catch (error) {
    failures.push(error instanceof Error ? error.message : "Performance collection failed");
  } finally {
    try { await browser?.close(); } catch { failures.push("Chromium cleanup failed"); }
    try { closeDatabase(); } catch { failures.push("Measurement database cleanup failed"); }
    try { await runtime.dispose(); } catch { failures.push("Production process-group cleanup failed"); }
    report.passed = failures.length === 0;
    saveReport(reportPath, report); // Evidence survives even when a strict budget fails.
  }
  assert.equal(failures.length, 0, `Performance measurement failed; saved ${reportPath}: ${failures.join("; ")}`);
  console.log(`Performance lab evidence saved: ${reportPath}`);
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Performance measurement failed"); process.exitCode = 1; });
