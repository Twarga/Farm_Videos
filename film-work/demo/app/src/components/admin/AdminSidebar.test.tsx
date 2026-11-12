import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";

vi.mock("./AdminConsole.module.css", () => ({ default: new Proxy({}, { get: (_target, key) => String(key) }) }));

import { AdminSidebar } from "./AdminSidebar";

it("links each admin job to its own route without a competing console view", () => {
  const html = renderToStaticMarkup(<AdminSidebar active="/admin" />);
  for (const route of ["offers", "providers", "affiliates", "terms", "editorial", "corrections", "quality", "imports", "publications", "analytics", "health", "audit", "settings"]) {
    expect(html).toContain(`href="/admin/${route}"`);
  }
  expect(html).not.toContain("?view=");
  expect(html).not.toContain(">Activity<");
  expect(html).not.toContain('class="pet');
});
