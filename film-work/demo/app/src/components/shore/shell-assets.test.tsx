import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { shoreLogoSrc, verifiedLogoSrc } from "@/lib/assets";
import { ShellSvg } from "./ShellSvg";
it("uses approved Shore marks and rejects injected or external image paths", () => {
  expect(shoreLogoSrc("hostinger", "/logos/hostinger.svg")).toBe("/shore/logos/hostinger.svg");
  expect(shoreLogoSrc("custom", "/logos/custom/provider.png")).toBe("/logos/custom/provider.png");
  expect(shoreLogoSrc("custom", "/logos/../secret.svg")).toBeNull();
  expect(verifiedLogoSrc("__proto__")).toBeNull();
  // ShellSvg paints only a server-resolved `logoSrc`; a raw provider path never reaches the markup.
  const html = renderToStaticMarkup(<ShellSvg offer={{ logoSrc: shoreLogoSrc("custom", '/logos/x.svg" onload="alert(1)') }}/>);
  expect(html).not.toContain("onload"); expect(html).not.toContain("<image");
});
it("never lets a stored CSV path shadow the reviewed mark", () => {
  expect(shoreLogoSrc("buyvm", "/logos/buyvm.png")).toBe("/shore/logos/marks/buyvm.png");
  expect(shoreLogoSrc("webdock", "/logos/webdock.svg")).toBe("/shore/logos/webdock.png");
  expect(shoreLogoSrc("leaseweb", "/logos/leaseweb.png")).toBe("/shore/logos/marks/leaseweb.png");
  expect(shoreLogoSrc("cherry-servers", "/logos/cherryservers.svg")).toBe("/shore/logos/cherryservers-mark.svg");
});
