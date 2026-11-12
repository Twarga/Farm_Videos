import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { offer } from "../../../tests/fixtures/offer";
import type { AdminActionResult } from "@/lib/admin-action-feedback";

// The module stylesheet needs the app PostCSS pipeline; tests only need stable class keys.
vi.mock("./AdminConsole.module.css", () => ({ default: new Proxy({}, { get: (_target, key) => String(key) }) }));

import { requestHomeXraySave, SettingsView } from "./AdminConsole";

const eligible = offer({ id: "xray-eligible", providerId: "hostinger", productName: "Eligible Plan", advertisedMonthly: 6.49, effectiveMonthly: 6.49, introMonthly: 6.49, introMonths: 24, commitmentMonths: 24, renewalMonthly: 11.99, setupFee: 0, realMonthly: 8.32, termsReviewed: true, catch: "Reviewed: renewal almost doubles after the intro term." });
const ineligible = offer({ id: "xray-ineligible", providerId: "netcup", productName: "Plain Plan" });
const saved = { current: "xray-eligible", reason: "Saved reason" };

function renderSettings(homeXray = { current: null as string | null, reason: null as string | null }) {
  return renderToStaticMarkup(<SettingsView homeXray={{ ...homeXray, action: async () => ({ ok: true, status: "success", message: "saved", requestId: null }) }} offers={[eligible, ineligible]} />);
}

function tag(html: string, name: string, needle: string): string {
  const match = html.match(new RegExp(`<${name}[^>]*${needle}[^>]*>`));
  expect(match, `expected a <${name}> tag containing ${needle}`).not.toBeNull();
  return match![0];
}

it("associates the X-ray plan select with a visible label", () => {
  const html = renderSettings();
  const label = html.match(/<label[^>]*for="home-xray-offer"[^>]*>[\s\S]*?<\/label>/)?.[0];
  expect(label, "expected a label bound to the X-ray plan select").toContain("<strong>X-ray plan</strong>");
  const select = tag(html, "select", 'id="home-xray-offer"');
  expect(select).toContain('name="offerId"');
  expect(select).toContain("required");
});

it("renders the X-ray form controls with saved values and an enabled retryable submit", () => {
  const html = renderSettings(saved);
  expect(tag(html, "option", 'value="xray-eligible"')).toContain("selected");
  expect(tag(html, "input", 'name="reason"')).toContain('value="Saved reason"');
  expect(tag(html, "input", 'name="reason"')).toContain('aria-label="Selection reason"');
  const submit = html.match(/<button[^>]*>Save<\/button>/)?.[0];
  expect(submit, "expected an enabled Save submit button").toBeTruthy();
  expect(submit).not.toContain("disabled");
});

it("marks ineligible plans as disabled options in the X-ray select", () => {
  const html = renderSettings();
  expect(tag(html, "option", 'value="xray-eligible"')).not.toContain("disabled");
  expect(tag(html, "option", 'value="xray-ineligible"')).toContain("disabled");
  expect(html).toContain("(ineligible)");
});

it("passes the action result through when the request completes", async () => {
  const result: AdminActionResult = { ok: true, status: "success", message: "The homepage X-ray selection and reason were saved.", requestId: "req-1", id: "xray-eligible" };
  await expect(requestHomeXraySave(async () => result, new FormData())).resolves.toBe(result);
});

it("converts an interrupted action request into retryable feedback instead of rejecting", async () => {
  const result = await requestHomeXraySave(async () => { throw new TypeError("Failed to fetch"); }, new FormData());
  expect(result).toMatchObject({ ok: false, status: "server_error", requestId: null });
  expect(result.message).toMatch(/did not complete/i);
  expect(result.message).toMatch(/still open/i);
});
