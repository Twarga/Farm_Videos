import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { JsonLd, jsonLdString } from "./json-ld";
import OfferPage from "@/app/offers/[id]/page";
import { CompareProvider } from "@/components/CompareProvider";

// The page reads a publication database; replace that boundary with a controlled
// offer while exercising its real schema, serializer, and detail components.
vi.mock("@/lib/public-catalog", async () => {
  const { offer } = await import("../../tests/fixtures/offer");
  return {
    getPublishedCatalogOfferState: () => ({ status: "published", offer: offer({ productName: "</script><x> VPS" }) }),
    getPublishedCatalogSiblings: () => [],
      getPublishedCatalogOffers: () => [offer({ productName: "</script><x> VPS" })],
  };
});

it("escapes every opening angle bracket while preserving the JSON value", () => {
  const data = { name: "</script><x>", description: "Quotes \" & café < details" };
  const serialized = jsonLdString(data);
  expect(serialized).not.toContain("<");
  expect(JSON.parse(serialized)).toEqual(data);
});

it("renders one JSON-LD script that cannot be closed by its data", () => {
  const data = { "@context": "https://schema.org", name: "</script><script>alert(1)</script>" };
  const html = renderToStaticMarkup(<JsonLd data={data} />);
  expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
  expect(html.match(/<script/g)).toHaveLength(1);
  expect(html.match(/<\/script>/g)).toHaveLength(1);
  const payload = html.slice(html.indexOf(">") + 1, html.lastIndexOf("</script>"));
  expect(JSON.parse(payload)).toEqual(data);
});

it("renders offer structured data safely without asserting unverified availability", async () => {
  const page = await OfferPage({ params: Promise.resolve({ id: "test-offer" }) });
  const html = renderToStaticMarkup(<CompareProvider>{page}</CompareProvider>);
  const script = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  expect(script).not.toBeNull();
  expect(script![1]).not.toContain("<");
  const data = JSON.parse(script![1]);
  expect(data[0]["@type"]).toBe("Product");
  expect(data[0].name).toBe("Test Provider </script><x> VPS");
  expect(data[0].offers).toMatchObject({ "@type": "Offer", price: 7, priceCurrency: "USD" });
  expect(data[0].offers).not.toHaveProperty("availability");
  expect(data[1]["@type"]).toBe("BreadcrumbList");
});
