import type { Metadata } from "next";
import { getPublicShoreCatalog } from "@/lib/public-catalog";
import { shoreFmtDate } from "@/components/shore/format";
import { ProvidersSearch } from "@/components/shore/ProvidersSearch";
import { buildProviderCards } from "@/lib/provider-cards";

export const metadata: Metadata = {
  title: "VPS providers",
  description: "Providers with a published Trustpilot score — plan counts, real-price ranges and Trustpilot snapshots.",
  alternates: { canonical: "https://bestvpsforme.com/providers" },
};

export const dynamic = "force-dynamic";

export default function ProvidersPage() {
  const { offers, meta } = getPublicShoreCatalog();
  const cards = buildProviderCards(offers);
  const snapshotDate = meta.snapshotDate ? shoreFmtDate(meta.snapshotDate.slice(0, 10)) : "not published";
  const totalPlans = meta.count ?? offers.length;

  return (
    <main id="main">
      <ProvidersSearch
        cards={cards}
        snapshotDate={snapshotDate}
        totalPlans={totalPlans}
      />
    </main>
  );
}
