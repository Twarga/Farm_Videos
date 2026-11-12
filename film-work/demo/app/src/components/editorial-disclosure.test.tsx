import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import OfferPage from "@/app/offers/[id]/page";
import { CompareProvider } from "./CompareProvider";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { providerAffiliatePrograms } from "@/db/schema";
import { publishedRowFixture } from "../../tests/fixtures/published-row";

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", "");
  migrateDatabase();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

const visibleText = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

it("keeps one commission line on a paid plan and labels the outbound link", async () => {
  publishedRowFixture("paid-disclosure-plan");
  getDb().insert(providerAffiliatePrograms).values({ id: "paid-program", providerId: "hetzner", programSlug: "test", programName: "Test program", projectStatus: "approved", trackingTemplate: "https://affiliate.example/?offer={offerId}", lastCheckedAt: new Date("2026-08-31T00:00:00Z") }).run();
  const page = await OfferPage({ params: Promise.resolve({ id: "paid-disclosure-plan" }) });
  const html = renderToStaticMarkup(<CompareProvider>{page}</CompareProvider>);
  const cta = html.match(/<a[^>]*href="\/go\/paid-disclosure-plan"[^>]*>[\s\S]*?<\/a>/);
  const lines = html.match(/<p class="linkline">[\s\S]*?<\/p>/g) ?? [];
  expect(cta).not.toBeNull();
  expect(lines).toHaveLength(1);
  expect(visibleText(lines[0] ?? "")).toMatch(/Ad\. We may earn a commission\. It never changes the order\./);
  expect(html).not.toContain('aria-label="Commission disclosure"');
  expect(cta![0]).toContain('rel="sponsored nofollow noopener"');
  expect(visibleText(cta![0])).toBe("Visit Published provider");
});
