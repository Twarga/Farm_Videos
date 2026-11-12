import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import AffiliateDisclosurePage, { metadata } from "./page";
import { SiteFooter } from "@/components/shell/SiteFooter";

it("resolves the footer disclosure destination with preserved commission independence", () => {
  const footer = renderToStaticMarkup(<SiteFooter year={2026}/>);
  const page = renderToStaticMarkup(<AffiliateDisclosurePage/>);
  expect(footer).toContain('href="/affiliate-disclosure"');
  expect(page).toContain('Affiliate disclosure</h1>');
  expect(page).toContain('never determine our ranking or editorial conclusions');
  expect(page).not.toContain('no extra cost');
  expect(page).not.toContain('draft');
  expect(metadata.alternates?.canonical).toBe('https://bestvpsforme.com/affiliate-disclosure');
});
