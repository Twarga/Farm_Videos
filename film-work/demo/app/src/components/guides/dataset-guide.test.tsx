import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { providers, publicationSnapshots } from "@/db/schema";
import { publishedRowFixture } from "../../../tests/fixtures/published-row";
import { listPublishedGuides } from "@/lib/guides";
import { GuideArticleBody } from "./GuideArticleBody";

beforeEach(() => { closeDatabase(); vi.stubEnv("DATABASE_URL", ":memory:"); migrateDatabase(); });
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

it("renders current dataset counts and dates rather than the original publication's prose numbers", () => {
  publishedRowFixture("a"); publishedRowFixture("b");
  getDb().update(providers).set({ trustpilotScore: 4.5 }).run();
  getDb().insert(publicationSnapshots).values({ id: "now", snapshotVersion: 1, label: "New", publishedAt: new Date("2026-09-30") }).run();
  const guide = listPublishedGuides().find((guide) => guide.slug === "vps-market-snapshot-457-rows")!;
  const html = renderToStaticMarkup(<GuideArticleBody body={guide.body} guideSlug={guide.slug} />);
  expect(html).toMatch(/Public offers<\/th><td[^>]*>2<\/td>/);
  expect(html).toMatch(/Comparison offers<\/th><td[^>]*>2<\/td>/);
  expect(html).toMatch(/Active providers<\/th><td[^>]*>1<\/td>/);
  expect(html).toMatch(/<time dateTime="2026-09-30">2026-09-30<\/time>/);
  expect(html).not.toContain("322");
  expect(html).not.toContain("784");
});
