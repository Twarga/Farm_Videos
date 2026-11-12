import Head from "next/head";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getShoreCatalogPage } from "@/lib/shore-catalog-page";
import { bindCatalogMeta } from "@/lib/catalog-request-meta";
import { ShoreCatalogClient } from "@/components/shore/ShoreCatalogClient";
import { headerCrabArt, walkBearArt } from "@/lib/shell-art.server";

const description = "Compare VPS prices, hardware, locations and billing terms. Reviewed costs and missing evidence are labeled.";

export async function getServerSideProps({ query, res }: Pick<GetServerSidePropsContext, "query" | "res">) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v != null) for (const item of Array.isArray(v) ? v : [v]) params.append(k, item);
  }
  const page = getShoreCatalogPage(params);
  bindCatalogMeta(res, page.meta);
  return { props: { initialData: page, headerCrabArt, walkBearArt } };
}

export default function CatalogPage({ initialData, walkBearArt }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <>
    <Head>
      <title>VPS plans · bestvpsforme</title>
      <meta name="description" content={description} />
      <link rel="canonical" href="https://bestvpsforme.com/catalog" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://bestvpsforme.com/catalog" />
      <meta property="og:site_name" content="bestvpsforme" />
      <meta property="og:title" content="VPS plans · bestvpsforme" />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="VPS plans · bestvpsforme" />
      <meta name="twitter:description" content={description} />
    </Head>
    <main id="main" tabIndex={-1}>
      <ShoreCatalogClient initialData={initialData} bearArt={walkBearArt} />
    </main>
  </>;
}
