import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { SiteNavigationProvider } from "@/lib/site-navigation";

export function PagesNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  useEffect(() => {
    const start = () => setPending(true);
    const finish = () => setPending(false);
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", finish);
    router.events.on("routeChangeError", finish);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", finish);
      router.events.off("routeChangeError", finish);
    };
  }, [router.events]);
  const push = useCallback((url: string, options?: { scroll?: boolean }) => {
    // Pages navigation resolves after commit; awaiting it inside a React
    // transition would make that commit wait for its own completion.
    void router.push(url, undefined, options).catch((error: unknown) => {
      if (!(error && typeof error === "object" && "cancelled" in error && error.cancelled)) window.location.assign(url);
    });
  }, [router]);
  const value = useMemo(() => ({ pathname: router.pathname, params: new URLSearchParams(router.asPath.split("?")[1]?.split("#")[0] ?? ""), pending, push }), [router.pathname, router.asPath, pending, push]);
  return <SiteNavigationProvider value={value}>{children}</SiteNavigationProvider>;
}
