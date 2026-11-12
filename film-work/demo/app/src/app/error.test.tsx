import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import ErrorPage from "./error";

it("shows a public failure reference and recovery actions without exposing private error details", () => {
  const error = Object.assign(new Error("private database password and query"), { digest: "public-reference-123" });
  const html = renderToStaticMarkup(<ErrorPage error={error} retry={() => {}} />);
  expect(html).toContain("public-reference-123");
  expect(html).toContain("Try again");
  expect(html).toContain('href="/catalog"');
  expect(html).not.toContain("private database");
});
