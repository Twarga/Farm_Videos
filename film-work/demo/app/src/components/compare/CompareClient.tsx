"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCompare } from "../CompareProvider";
import { comparisonPath } from "@/lib/compare-url";

/** Bare `/compare` (no `?id=`/`?p=`) adopts the picks saved in localStorage. */
export function CompareSync() {
  const { ids, ready } = useCompare();
  const params = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    if (!ready || params?.has("id") || params?.has("p")) return;
    if (ids.length) router.replace(comparisonPath(ids));
  }, [ids, ready, params, router]);
  return null;
}
