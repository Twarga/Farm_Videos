import { eq } from "drizzle-orm";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { closeDatabase, getDb, getSqlite } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { offers, providers, publicationSnapshots } from "@/db/schema";
import { publishedRowFixture } from "../../tests/fixtures/published-row";
import { generateMetadata } from "./offers/[id]/page";
import robots from "./robots";
import sitemap from "./sitemap";
import UpdatesPage from "./updates/page";
import GuideHeroImage from "./guides/[slug]/opengraph-image";
import { listPublishedGuides } from "@/lib/guides";
import { getGuideAuthor } from "@/lib/authors";
import { guideStructuredData } from "@/lib/guide-structured-data";

beforeEach(() => {
  closeDatabase();
  vi.stubEnv("DATABASE_URL", ":memory:");
  vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", "database");
  migrateDatabase();
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

it("generates the canonical identity from a published offer", async () => {
  publishedRowFixture("synthetic-vps-1");
  expect(await generateMetadata({ params: Promise.resolve({ id: "synthetic-vps-1" }) })).toMatchObject({ title: "Published provider synthetic-vps-1", alternates: { canonical: "https://bestvpsforme.com/offers/synthetic-vps-1" } });
});
it("does not expose draft offers through generated canonical metadata", async () => {
  publishedRowFixture("synthetic-draft");
  getDb().update(offers).set({ publicationStatus: "draft" }).run();
  const metadata = await generateMetadata({ params: Promise.resolve({ id: "synthetic-draft" }) });
  expect(metadata.alternates).toBeUndefined();
  expect(metadata.title).toBe("Offer");
});
it("fails metadata generation when storage is unavailable instead of inventing an offer", async () => {
  getSqlite().exec("DROP TABLE offers");
  await expect(generateMetadata({ params: Promise.resolve({ id: "synthetic-vps-1" }) })).rejects.toThrow("Public offer storage unavailable");
});
it("includes active published records and public updates in the sitemap while excluding drafts and archived providers", () => {
  publishedRowFixture("synthetic-public");
  publishedRowFixture("synthetic-draft");
  getDb().update(offers).set({ publicationStatus: "draft" }).where(eq(offers.id, "synthetic-draft")).run();
  getDb().insert(providers).values({ id: "archived-provider", slug: "archived-provider", name: "Archived", officialUrl: "https://example.com", status: "archived" }).run();
  getDb().insert(offers).values({ id: "archived-provider-plan", slug: "plan", planName: "Archived provider plan", providerId: "archived-provider", officialUrl: "https://example.com/plan", publicationStatus: "published" }).run();
  const urls = sitemap().map((entry) => entry.url);
  expect(urls).toContain("https://bestvpsforme.com/offers/synthetic-public");
  expect(urls).toContain("https://bestvpsforme.com/providers/hetzner");
  expect(urls).toContain("https://bestvpsforme.com/updates");
  expect(urls).not.toContain("https://bestvpsforme.com/offers/synthetic-draft");
  expect(urls).not.toContain("https://bestvpsforme.com/offers/archived-provider-plan");
  expect(urls).not.toContain("https://bestvpsforme.com/providers/archived-provider");
  expect(urls.some((url) => url.includes("/admin") || url.includes("/api/"))).toBe(false);
});
it("ranks every offer URL the same, because no editorial flag reaches crawlers", () => {
  publishedRowFixture("plain-plan");
  publishedRowFixture("curated-plan");
  getDb().update(offers).set({ featured: true }).where(eq(offers.id, "curated-plan")).run();
  const priorities = sitemap().filter((entry) => entry.url.includes("/offers/")).map((entry) => entry.priority);
  expect(priorities).toHaveLength(2);
  expect(new Set(priorities).size).toBe(1);
});
it("keeps private surfaces out of crawler policy and advertises the public sitemap", () => {
  expect(robots()).toMatchObject({ rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }], sitemap: "https://bestvpsforme.com/sitemap.xml", host: "https://bestvpsforme.com" });
});
it("renders the active publication date rather than a newer rolled-back snapshot", () => {
  getDb().insert(publicationSnapshots).values([
    { id: "active", snapshotVersion: 1, label: "Synthetic active", status: "published", publishedAt: new Date("2026-07-18T00:00:00Z") },
    { id: "rolled-back", snapshotVersion: 2, label: "Synthetic rejected", status: "rolled-back", publishedAt: new Date("2026-09-29T00:00:00Z") },
  ]).run();
  const html = renderToStaticMarkup(UpdatesPage());
  const header = html.slice(0, html.indexOf("</header>"));
  expect(header).toContain("18 Jul 2026");
  expect(header).not.toContain("29 Sept 2026");
  expect(html).toContain("Rolled back");
  expect(html).toContain('href="/methodology"');
  expect(html).toContain('href="/corrections"');
});
it("marks the publication date unavailable when no active snapshot exists", () => {
  const html = renderToStaticMarkup(UpdatesPage());
  expect(html).toContain("No active publication");
  expect(html).not.toContain("Active snapshot");
  expect(html).toContain("No published snapshots yet");
});
it("sends unreadable publication history to recovery rather than displaying an empty timeline", () => {
  getSqlite().exec("ALTER TABLE publication_snapshots RENAME TO unavailable_history");
  expect(() => renderToStaticMarkup(UpdatesPage())).toThrow();
});
it("serves every published guide a hero image that exists, rather than a deleted file", async () => {
  const guides = listPublishedGuides();
  expect(guides.length).toBeGreaterThan(0);
  for (const guide of guides) {
    const author = getGuideAuthor(guide.author);
    expect(author).toBeDefined();
    const [article] = guideStructuredData(guide, author!);
    expect(article.image).toEqual([`https://bestvpsforme.com/guides/${guide.slug}/opengraph-image`]);
  }
  const rendered = await GuideHeroImage({ params: Promise.resolve({ slug: guides[0].slug }) });
  expect(rendered.headers.get("content-type")).toBe("image/png");
  const png = Buffer.from(await rendered.arrayBuffer());
  expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
});
