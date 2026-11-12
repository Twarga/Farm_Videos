import fs from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import * as original from "@phosphor-icons/react/dist/ssr";
import * as sprites from "./IconSprite";
import { CATALOG_ICON_ASSET } from "@/lib/catalog-icon-asset";

it("keeps every catalog icon's original artwork and weights in the static asset", () => {
  const asset = fs.readFileSync(`public${CATALOG_ICON_ASSET}`, "utf8");
  for (const name of ["Funnel", "HandCoins", "Rows", "SquaresFour", "X", "List", "Moon", "Scales", "Sun", "ArrowUpRight", "Star"] as const) {
    for (const weight of ["thin", "light", "regular", "bold", "fill", "duotone"] as const) {
      const artwork = renderToStaticMarkup(createElement(original[name], { weight })).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
      expect(asset).toContain(`<symbol id="${name}-${weight}" viewBox="0 0 256 256">${artwork}</symbol>`);
      const icon = renderToStaticMarkup(createElement(sprites[name], { weight, "aria-hidden": true }));
      expect(icon).toContain(`href="${CATALOG_ICON_ASSET}#${name}-${weight}"`);
      expect(icon).toContain('aria-hidden="true"');
    }
  }
});
