"use client";

import { createContext, useContext, type ReactNode } from "react";

type Navigation = {
  pathname: string;
  params: Pick<URLSearchParams, "get">;
  pending?: boolean;
  push: (url: string, options?: { scroll?: boolean }) => void;
};
const NavigationContext = createContext<Navigation | null>(null);

export function SiteNavigationProvider({ value, children }: { value: Navigation; children: ReactNode }) {
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
function useNavigation() {
  const navigation = useContext(NavigationContext);
  if (!navigation) throw new Error("SiteNavigationProvider missing");
  return navigation;
}
export function usePathname() { return useNavigation().pathname; }
export function useSearchParams() { return useNavigation().params; }
export function useRouter() { return useNavigation(); }
