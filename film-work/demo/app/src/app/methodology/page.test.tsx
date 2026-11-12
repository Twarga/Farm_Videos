import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { closeDatabase } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import { VALUE_WEIGHTS } from "@/lib/score";
import MethodologyPage from "./page";

beforeEach(() => { closeDatabase(); vi.stubEnv("DATABASE_URL", ":memory:"); migrateDatabase(); });
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

it("publishes exactly the ranking weights used by the score and explains unknown cash timing", () => {
  const html = renderToStaticMarkup(MethodologyPage());
  expect(VALUE_WEIGHTS.reduce((total, row) => total + row.weight, 0)).toBe(100);
  for (const row of VALUE_WEIGHTS) {
    expect(html).toContain(row.label);
    expect(html.replace(/<[^>]*>/g, "")).toContain(`${row.weight} / 100`);
  }
  expect(html).toContain("it does not invent payment dates");
  expect(html).toContain("the price check date");
});
