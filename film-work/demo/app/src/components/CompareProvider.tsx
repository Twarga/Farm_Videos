"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  type ReactNode,
} from "react";
import { trackEvent } from "@/lib/analytics-client";
import { isOfferId } from "@/lib/offer-id";
import { parseComparisonParams } from "@/lib/compare-url";
import { usePathname, useSearchParams } from "@/lib/site-navigation";

function ComparisonNavigation({ restore }: { restore: () => void }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const selection = params?.toString() ?? "";
  useEffect(() => { if (pathname === "/compare" && selection !== null) restore(); }, [pathname, selection, restore]);
  return null;
}

const KEY = "shore-pail";
export const COMPARE_MAX = 4;
function read(): string[] {
  const url = new URL(window.location.href);
  if (url.pathname === "/compare" && (url.searchParams.has("id") || url.searchParams.has("p"))) {
    return parseComparisonParams(url.searchParams);
  }
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem("bvf-compare");
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter(isOfferId))].slice(0, COMPARE_MAX)
      : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(ids.slice(0, COMPARE_MAX))); } catch { /* Selection still works when storage is unavailable. */ }
}

const CompareCtx = createContext<{
  ids: string[];
  ready: boolean;
  unavailable: boolean;
  has: (id: string) => boolean;
  toggle: (id: string, source?: HTMLElement | null) => void;
  clear: () => void;
} | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [notice, setNotice] = useState("");
  const idsRef = useRef<string[]>([]);
  const restoreRef = useRef<(() => void) | null>(null);
  // Bumped by every restore and by clear(), so a late restore response cannot resurrect cleared plans.
  const generationRef = useRef(0);
  const restoreNavigation = useCallback(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("id") && !url.searchParams.has("p")) return;
    const requested = parseComparisonParams(url.searchParams);
    if (requested.join(",") !== idsRef.current.join(",")) restoreRef.current?.();
  }, []);

  useEffect(() => {
    let active = true;
    function restore() {
      const request = ++generationRef.current;
      const saved = read();
      if (!saved.length) {
        setUnavailable(false);
        idsRef.current = [];
        setIds([]);
        setReady(true);
        return;
      }
      setReady(false);
      const query = new URLSearchParams(saved.map((id) => ["id", id]));
      fetch(`/api/public/offers?${query}`, { cache: "no-store" })
        .then((response) => (response.ok ? response.json() as Promise<{ offers?: { id: string }[] }> : Promise.reject(new Error("Public catalog unavailable"))))
        .then((payload) => {
          if (!active || request !== generationRef.current) return;
          setUnavailable(false);
          const publicIds = new Set((Array.isArray(payload.offers) ? payload.offers : []).map((offer) => offer.id));
          const validIds = saved.filter((id) => publicIds.has(id));
          idsRef.current = validIds;
          setIds(validIds);
          setReady(true);
        })
        .catch(() => {
          if (!active || request !== generationRef.current) return;
          setUnavailable(true);
          idsRef.current = saved;
          setIds(saved);
          setReady(false);
        });
    }
    restoreRef.current = restore;
    restore();
    const onPopState = () => { if (window.location.pathname === "/compare") restore(); };
    window.addEventListener("popstate", onPopState);
    return () => { active = false; restoreRef.current = null; window.removeEventListener("popstate", onPopState); };
  }, []);

  useEffect(() => {
    if (ready) write(ids);
  }, [ids, ready]);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), notice.startsWith("Added to your pail") ? 2500 : 4500);
    return () => clearTimeout(timeout);
  }, [notice]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback((id: string, source?: HTMLElement | null) => {
      if (!ready || unavailable) { if (unavailable) setNotice("Comparison data is unavailable. Your saved selections are kept."); return; }
    const current = idsRef.current;
    if (current.includes(id)) {
      const next = current.filter((x) => x !== id);
      idsRef.current = next;
      setIds(next);
      setNotice("");
      return;
    }
    if (current.length >= COMPARE_MAX) {
      setNotice(`Your comparison is full. Remove a plan before adding another.`);
      return;
    }
    const next = [...current, id];
    idsRef.current = next;
    setIds(next);
    setNotice(`Added to your pail · ${next.length} of ${COMPARE_MAX}`);
    if (source) void import("@/components/pail-fly").then(({ flyToPail }) => flyToPail(source));
    trackEvent({ name: "compare_add", offerId: id, placement: "catalog" });
  }, [ready, unavailable]);
  const clear = useCallback(() => {
    generationRef.current += 1;
    write([]);
    setUnavailable(false); setReady(true);
    idsRef.current = [];
    setIds([]);
    setNotice("");
  }, []);
  const value = useMemo(
    () => ({ ids, ready, unavailable, has, toggle, clear }),
    [ids, ready, unavailable, has, toggle, clear],
  );
  return (
    <CompareCtx.Provider value={value}>
      <Suspense fallback={null}><ComparisonNavigation restore={restoreNavigation} /></Suspense>
      {children}
      {notice ? (
        <div className="compare-notice" role="status" aria-live="polite">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">
            Dismiss
          </button>
        </div>
      ) : null}
    </CompareCtx.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareCtx);
  if (!ctx) throw new Error("CompareProvider missing");
  return ctx;
}
