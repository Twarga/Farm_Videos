import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import OfferPage from "@/app/offers/[id]/page";
import { CompareProvider } from "@/components/CompareProvider";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { offerPrices, offers, providers } from "@/db/schema";
import { publishedRowFixture } from "../../tests/fixtures/published-row";

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", "");
  migrateDatabase();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

async function structuredData() {
  const page = await OfferPage({ params: Promise.resolve({ id: "published-schema-plan" }) });
  const html = renderToStaticMarkup(<CompareProvider>{page}</CompareProvider>);
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  expect(scripts).toHaveLength(1);
  return JSON.parse(scripts[0][1]);
}

it("uses the published seller, price, and official URL in the actual offer page schema", async () => {
  publishedRowFixture("published-schema-plan");
  getDb().update(providers).set({ name: "Persisted Cloud", officialUrl: "https://persisted.example" }).where(eq(providers.id, "hetzner")).run();
  getDb().update(offers).set({ planName: "Stored VPS 8", officialUrl: "https://persisted.example/vps8" }).where(eq(offers.id, "published-schema-plan")).run();
  getDb().update(offerPrices).set({ effectiveMonthly: 13.75 }).where(eq(offerPrices.offerId, "published-schema-plan")).run();

  const data = await structuredData();
  expect(data[0]).toMatchObject({
    "@type": "Product", name: "Persisted Cloud Stored VPS 8", sku: "published-schema-plan",
    brand: { "@type": "Brand", name: "Persisted Cloud" },
    offers: { "@type": "Offer", price: 13.75, priceCurrency: "USD", url: "https://persisted.example/vps8", seller: { "@type": "Organization", name: "Persisted Cloud" } },
  });
  expect(data[1]).toMatchObject({ "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Catalog", item: "https://bestvpsforme.com/catalog" },
    { "@type": "ListItem", position: 2, name: "Persisted Cloud", item: "https://bestvpsforme.com/providers/hetzner" },
    { "@type": "ListItem", position: 3, name: "Stored VPS 8", item: "https://bestvpsforme.com/offers/published-schema-plan" },
  ] });
});

it("does not turn provider review scores into an unsupported product aggregate rating", async () => {
  publishedRowFixture("published-schema-plan");
  getDb().update(providers).set({ trustpilotScore: 4.7, trustpilotReviews: 1234, trustpilotUrl: "https://www.trustpilot.com/review/example.com" }).where(eq(providers.id, "hetzner")).run();
  const data = await structuredData();
  // Neither Product, Offer, Brand, seller nor breadcrumb may borrow provider reviews.
  expect(JSON.stringify(data)).not.toMatch(/"aggregateRating"\s*:/);
  expect(data[0].offers).not.toHaveProperty("availability");
});
