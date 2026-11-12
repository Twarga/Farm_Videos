import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { closeDatabase } from "@/db/client";
import { migrateDatabase } from "@/db/migrate";
import HomePage from "@/app/page";

beforeEach(() => { closeDatabase(); vi.stubEnv("DATABASE_URL", ":memory:"); vi.stubEnv("BESTVPSFORME_PUBLIC_DATA_MODE", ""); migrateDatabase(); });
afterEach(() => { closeDatabase(); vi.unstubAllEnvs(); });

it("does not substitute static provider counts or marks when the publication is empty", () => {
  const html = renderToStaticMarkup(<HomePage />).replace(/<!--.*?-->/g, "");
  expect(html).toContain("0 plans · 0 providers");
  expect(html).not.toContain("Hetzner");
});
