import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GuideArticleBody } from "./GuideArticleBody";
import { closeDatabase, getDb } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { publicationSnapshots } from "@/db/schema";
import { publishedRowFixture } from "../../../tests/fixtures/published-row";

beforeEach(() => {
  closeDatabase(); vi.stubEnv("DATABASE_URL", ":memory:"); vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", ""); migrateDatabase();
  publishedRowFixture("mentioned-plan");
});
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

it("dates live mentioned-plan prices with their active publication", () => {
  getDb().insert(publicationSnapshots).values({ id: "guide-snapshot", snapshotVersion: 1, label: "Fixture publication", status: "published", publishedAt: new Date("2026-09-17T12:00:00Z") }).run();
  const html = renderToStaticMarkup(<GuideArticleBody guideSlug="test-guide" body={":::plans mentioned-plan\n:::"} />);
  expect(html).toMatch(/<time[^>]*dateTime="2026-09-17[^\"]*"[^>]*>17 Sept 2026<\/time>/i);
});

it("does not imply a known snapshot date when it is missing", () => {
  const html = renderToStaticMarkup(<GuideArticleBody guideSlug="test-guide" body={":::plans mentioned-plan\n:::"} />);
  expect(html).toContain("Snapshot date unavailable");
});
