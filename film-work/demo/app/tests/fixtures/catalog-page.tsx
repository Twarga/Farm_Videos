import { IncomingMessage, ServerResponse } from "node:http";
import { Socket } from "node:net";
import CatalogPage, { getServerSideProps } from "@/pages/catalog";
import type { CatalogSearchParams } from "@/lib/catalog-page";

/** Exercise the real server data entry with a real HTTP response object. */
export default async function renderCatalogPage({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  const request = new IncomingMessage(new Socket());
  const response = new ServerResponse(request);
  const result = await getServerSideProps({ query: await searchParams, res: response });
  return <CatalogPage {...result.props} />;
}
