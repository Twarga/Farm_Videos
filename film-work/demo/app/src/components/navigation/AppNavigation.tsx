"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import { SiteNavigationProvider } from "@/lib/site-navigation";

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const params = useSearchParams();
  const router = useRouter();
  const value = useMemo(() => ({ pathname, params: params ?? new URLSearchParams(), push: router.push }), [pathname, params, router]);
  return <SiteNavigationProvider value={value}>{children}</SiteNavigationProvider>;
}
