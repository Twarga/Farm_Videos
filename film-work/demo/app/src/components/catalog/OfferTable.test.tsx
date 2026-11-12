import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext, SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { offer } from "../../../tests/fixtures/offer";
import { catalogOffers, createCatalogPage } from "@/lib/catalog-page";
import { decodeCatalogRows, encodeCatalogRows } from "@/lib/catalog-transport";
import { CompareProvider } from "../CompareProvider";
import { OfferTable } from "./OfferTable";

const noNavigation = () => { throw new Error("Unexpected navigation during server render"); };
const router: AppRouterInstance = { back: noNavigation, forward: noNavigation, refresh: noNavigation, push: noNavigation, replace: noNavigation, prefetch: noNavigation, bfcacheId: "catalog-sort-test" };

it.each(["asc", "desc"] as const)("announces the active %s real-price sort on its column header", (direction) => {
  const html = renderToStaticMarkup(
    <AppRouterContext.Provider value={router}><PathnameContext.Provider value="/catalog"><SearchParamsContext.Provider value={new URLSearchParams()}>
      <AppNavigationProvider><CompareProvider><OfferTable offers={[offer()]} sort="real" direction={direction} onSort={() => {}} /></CompareProvider></AppNavigationProvider>
    </SearchParamsContext.Provider></PathnameContext.Provider></AppRouterContext.Provider>,
  );
  const headers = html.match(/<th\b[^>]*>/g) ?? [];
  expect(headers.filter((header) => header.includes("aria-sort="))).toHaveLength(1);
  expect(headers.find((header) => header.includes("c-price"))).toContain(`aria-sort="${direction === "asc" ? "ascending" : "descending"}"`);
});

it("preserves published transfer and effective cost through packed catalog data", () => {
  const provider = { id: "example", name: "Example", hq: "DE", site: "https://example.com", trustpilotScore: 4.5, trustpilotCount: 100, trustpilotUrl: "", trustpilotCheckedAt: "2026-08-31", note: "", letter: "E", markHue: 0 };
  const source = offer({ providerId: provider.id, provider, bandwidthTb: 7, transfer: "7 TB", advertisedMonthly: 9.99, effectiveMonthly: 5 });
  const page = createCatalogPage([source], {});
  // The client only ever sees rows that crossed the packed transport.
  const restored = catalogOffers(decodeCatalogRows(encodeCatalogRows(page.rows)), page.facets.providers);
  const html = renderToStaticMarkup(
    <AppRouterContext.Provider value={router}><PathnameContext.Provider value="/catalog"><SearchParamsContext.Provider value={new URLSearchParams()}>
      <AppNavigationProvider><CompareProvider><OfferTable offers={restored} /></CompareProvider></AppNavigationProvider>
    </SearchParamsContext.Provider></PathnameContext.Provider></AppRouterContext.Provider>,
  );
  expect(html.replace(/<[^>]+>/g, " ")).toMatch(/\b7\s+TB\b/);
  expect(html).toContain("$5.00");
});
