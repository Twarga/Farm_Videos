import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ProviderLogo } from "./ProviderLogo";
import { fallbackProvider } from "@/lib/provider-resolver";

it("uses a known provider's reviewed local mark even when its record has a stale logo", () => {
  const provider = { ...fallbackProvider("netcup", "netcup"), logoPath: "/stale.svg", site: "https://netcup.example" };
  const html = renderToStaticMarkup(<ProviderLogo provider={provider} size={46} />);
  expect(html).toContain('src="/logos/netcup.svg"');
  expect(html).not.toContain("/stale.svg");
  expect(html).not.toContain("duckduckgo.com");
  expect(html).toContain('aria-hidden="true"');
  expect(html).toMatch(/<img[^>]*alt=""[^>]*width="46" height="46"/);
  expect(html).toContain("width:46px;height:46px");
});

it("keeps an unknown provider's initial and intrinsic frame when no source is available", () => {
  const html = renderToStaticMarkup(<ProviderLogo provider={fallbackProvider("unrecognized-host", "Unrecognized Host")} size={40} />);
  expect(html).toContain('data-logo-kind="fallback"');
  expect(html).toContain('aria-hidden="true"');
  expect(html).toContain("width:40px;height:40px");
  expect(html).toMatch(/>U<\/span>$/);
  expect(html).not.toContain("<img");
});

it("uses the designed fallback mark for an unrecognized provider with an empty logo field", () => {
  // External favicon services are not loaded: unknown providers keep the
  // letter fallback rather than calling a third-party icon host.
  const provider = { ...fallbackProvider("unrecognized-host", "Unrecognized Host"), logoPath: "", site: "https://cloud.example/plans" };
  const html = renderToStaticMarkup(<ProviderLogo provider={provider} />);
  expect(html).toContain('data-logo-kind="fallback"');
  expect(html).not.toContain("duckduckgo.com");
  expect(html).not.toContain("<img");
});

it.each([
  { eager: false, loading: "lazy", priority: null },
  { eager: true, loading: "eager", priority: "high" },
])("assigns $loading loading and $priority priority to real logo assets", ({ eager, loading, priority }) => {
  const provider = { ...fallbackProvider("custom-host", "Custom Host"), logoPath: "/logos/custom.svg" };
  const html = renderToStaticMarkup(<ProviderLogo provider={provider} size={64} eager={eager} />);
  expect(html).toContain('src="/logos/custom.svg"');
  expect(html).toContain(`loading="${loading}"`);
  if (priority) expect(html).toContain(`fetchPriority="${priority}"`);
  else expect(html).not.toContain("fetchPriority"); // auto is the browser default; omitting it keeps repeated rows lean
  expect(html).toContain('decoding="async"');
  expect(html).toMatch(/<img[^>]*alt=""[^>]*width="64" height="64"/);
});
