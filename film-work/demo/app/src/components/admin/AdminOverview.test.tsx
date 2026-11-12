import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
vi.mock("./AdminConsole.module.css", () => ({ default: new Proxy({}, { get: (_target, key) => String(key) }) }));
import { AdminOverview } from "./AdminOverview";

it("shows unavailable publication and operation evidence without invented zeros", () => {
  const html = renderToStaticMarkup(<AdminOverview
    publication={{ status: "unavailable", count: null, providers: null, snapshotDate: null }}
    queues={{ termsReview: 0, editorialDrafts: 0, corrections: 0, blockingImportIssues: 0 }}
    analytics={{ visitors: 0, clicks: 0 }}
    operations={{ backupAt: null, restoreAt: null, ready: false }}
  />);
  expect(html).toContain("No publication");
  expect(html).toContain("Not connected");
  expect(html).toContain("Readiness needs attention");
  expect(html).not.toContain("Data ready 0%");
});
