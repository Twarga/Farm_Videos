import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";

vi.mock("./AdminConsole.module.css", () => ({ default: new Proxy({}, { get: (_target, key) => String(key) }) }));

import { AdminHomeXrayControl } from "./AdminHomeXrayControl";

it("lets an operator enter one offer ID without serializing the catalog", () => {
  const html = renderToStaticMarkup(<AdminHomeXrayControl current="hostinger-kvm-1" reason="Reviewed price example" action={async () => ({ ok: true, status: "success", message: "Saved", requestId: null })} />);
  expect(html).toMatch(/<input[^>]*name="offerId"[^>]*value="hostinger-kvm-1"/);
  expect(html).toContain("Selection reason");
  expect(html).not.toContain("<select");
});
