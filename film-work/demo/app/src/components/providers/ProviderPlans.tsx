"use client";

import { useState } from "react";
import { OfferTable } from "@/components/catalog/OfferTable";
import { sortOffers } from "@/lib/catalog";
import type { Offer, SortKey } from "@/lib/types";

/** Provider-page plan table — small enough to sort client-side, no rail. */
export function ProviderPlans({ offers }: { offers: Offer[] }) {
  const [sort, setSort] = useState<SortKey>("real");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const sorted = sortOffers(offers, sort, direction);
  return (
    <OfferTable
      offers={sorted}
      sort={sort}
      direction={direction}
      onSort={(key) => {
        if (key === sort) setDirection(direction === "asc" ? "desc" : "asc");
        else { setSort(key); setDirection(key === "trustpilot" ? "desc" : "asc"); }
      }}
    />
  );
}
