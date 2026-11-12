"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { ShoreOffer } from "@/lib/shore-offer";
import type { ShoreCatalogMeta } from "@/lib/public-catalog";
import { shoreMoney, shorePrice, shoreGb } from "./format";
import { Dropdown, type DropdownOption } from "./controls";
import { ShellSvg } from "./ShellSvg";
import { ShoreIcon } from "./ShoreIcon";
import art from "@/shore/shell-art.json";

/* ── Static SVG strings (trusted, no user content) ── */
const STARS = [[700,70,1],[820,160,.7],[900,52,.9],[990,220,.6],[1080,110,1],[1160,36,.8],[1330,250,.7],[1400,92,.9],[760,280,.5],[1050,310,.6],[1250,340,.5],[1380,370,.6],[640,40,.6],[940,350,.5],[1200,200,.6]] as const;
const SKY_HTML = STARS.map(([x,y,s],i) => `<path class="${i%3?'':'tw'}" style="--d:${((i*.9)%4).toFixed(1)}s" d="M${x} ${y-4*s}Q${x} ${y} ${x-4*s} ${y}Q${x} ${y} ${x} ${y+4*s}Q${x} ${y} ${x+4*s} ${y}Q${x} ${y} ${x} ${y-4*s}Z"/>`).join('');
const MOON_HTML = `<circle class="moon__halo" r="70"/><circle class="moon__ring" r="78"/><circle class="moon__ring moon__ring--2" r="104"/><g class="sun"><path class="sun__rays" d="M0-58v12M0 46v12M-58 0h12M46 0h12M-41-41l8 8M33 33l8 8M-41 41l8-8M33-33l8-8"/><circle class="sun__body" r="32"/><circle class="sun__seam" r="27"/></g><path class="moon__body" d="M-8-34A34 34 0 1 0 30 16 27 27 0 1 1-8-34Z"/><path class="moon__seam" d="M-8-34A34 34 0 1 0 30 16 27 27 0 1 1-8-34Z"/>`;

const EU = new Set(["AT","BE","BG","CH","CZ","DE","DK","EE","ES","FI","FR","GB","UK","GR","HR","HU","IE","IS","IT","LT","LU","LV","NL","NO","PL","PT","RO","RS","SE","SI","SK"]);
const NA = new Set(["US","CA"]);
const AS = new Set(["AE","BH","CN","HK","ID","IL","IN","JP","KR","MY","PH","PK","QA","SA","SG","TH","TR","TW","VN"]);
const OC = new Set(["AU","NZ","PG","FJ","NC","PF","VU","SB","WS","TO","GU","MP","AS"]);
function band(loc: string): string | null {
  const m = /^[a-z]{2}\b/i.exec(String(loc).trim()); if (!m) return null;
  const c = m[0].toUpperCase();
  if (EU.has(c)) return "europe"; if (NA.has(c)) return "na"; if (AS.has(c)) return "asia"; if (OC.has(c)) return "oceania"; return null;
}
function inBand(o: ShoreOffer, b: string) { return (o.loc || []).some(l => band(l) === b); }
function shellScale(ram: number | null) { return ram == null ? 1 : Math.min(1.14, Math.max(0.9, 0.9 + 0.06 * Math.log2(Math.max(ram, 0.5) / 0.5))); }

type Needs = { ram: number | null; price: number | null; regions: string[] };

function matches(o: ShoreOffer, n: Needs): boolean {
  if (n.ram && (o.ram == null || o.ram < n.ram)) return false;
  if (n.price && (o.usd == null || o.usd > n.price)) return false;
  if (n.regions?.length && !n.regions.some(r => inBand(o, r))) return false;
  return true;
}
function reasonFor(o: ShoreOffer, n: Needs): string | null {
  if (n.ram && (o.ram == null || o.ram < n.ram)) return "Too small";
  if (n.price && (o.usd == null || o.usd > n.price)) return "Too pricey";
  if (n.regions?.length && !n.regions.some(r => inBand(o, r))) return "Other region";
  return null;
}
function onePer(list: ShoreOffer[], n: number): ShoreOffer[] {
  const seen = new Set<string>(); const out: ShoreOffer[] = [];
  for (const o of list) { if (seen.has(o.pid) || o.usd == null) continue; seen.add(o.pid); out.push(o); if (out.length === n) break; }
  return out;
}
function picksFor(offers: ShoreOffer[], needs: Needs): ShoreOffer[] {
  const fit = offers.filter(o => matches(o, needs)).filter(o => o.rank != null);
  return onePer(fit.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999)), 4);
}

const BUBBLE: Record<string, string> = {
  idle: "Too small. Too pricey. This one.",
  working: "Checking shells…",
  success: "This one.",
  error: "Nothing fits. Loosen one need?",
};

const RAM_STEPS = [1, 2, 4, 8, 16];
const PRICE_STEPS = [5, 10, 25, 50];
const REGIONS = [["europe","Europe"],["na","N. America"],["asia","Asia"],["oceania","Oceania"]] as const;
const RAM_OPTIONS: DropdownOption[] = [{ value: "", label: "Any" }, ...RAM_STEPS.map(v => ({ value: String(v), label: `${shoreGb(v)} or more` }))];
const PRICE_OPTIONS: DropdownOption[] = [{ value: "", label: "Any" }, ...PRICE_STEPS.map(v => ({ value: String(v), label: `Under $${v}/mo` }))];
const REGION_OPTIONS: DropdownOption[] = [{ value: "", label: "Anywhere" }, ...REGIONS.map(([id, label]) => ({ value: id, label }))];

function relaxOptions(offers: ShoreOffer[], needs: Needs): { label: string; next: Needs; n: number }[] {
  const options: { label: string; next: Needs }[] = [];
  if (needs.ram) {
    const i = RAM_STEPS.indexOf(needs.ram);
    const down = i > 0 ? RAM_STEPS[i - 1] : null;
    options.push({ label: down ? `Allow ${shoreGb(down)} RAM` : "Any memory", next: { ...needs, ram: down } });
  }
  if (needs.price) {
    const i = PRICE_STEPS.indexOf(needs.price);
    const up = i >= 0 && i + 1 < PRICE_STEPS.length ? PRICE_STEPS[i + 1] : null;
    options.push({ label: up ? `Budget up to $${up}` : "Any budget", next: { ...needs, price: up } });
  }
  if (needs.regions.length) options.push({ label: "Any region", next: { ...needs, regions: [] } });
  return options
    .map(option => ({ ...option, n: offers.filter(o => matches(o, option.next)).length }))
    .filter(option => option.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3);
}

type Pose = "idle" | "working" | "success" | "error";

export function ShoreHero({
  meta, shoreOffers, stepFit, stepNeeds,
}: {
  meta: ShoreCatalogMeta;
  shoreOffers: ShoreOffer[];
  stepFit: number;
  stepNeeds: { ram: number; price: number; regions: string[] };
}) {
  const [ram, setRam] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [region, setRegion] = useState<string>("");
  const [bubble, setBubble] = useState({ key: 0, text: BUBBLE.idle });
  const [pose, setPose] = useState<Pose>("idle");
  const [vm, setVm] = useState<"happy" | "shiver" | null>(null);
  const [displayed, setDisplayed] = useState<ShoreOffer[]>(() => picksFor(shoreOffers, { ram: null, price: null, regions: [] }));
  const [leaving, setLeaving] = useState<string[]>([]);
  const [out, setOut] = useState<Record<string, string>>({});
  const [enter, setEnter] = useState<string[]>([]);
  const [win, setWin] = useState<string | null>(null);
  const [washing, setWashing] = useState(false);
  const tokenRef = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const washTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const needs = useMemo<Needs>(() => ({ ram, price, regions: region ? [region] : [] }), [ram, price, region]);
  const fitCount = useMemo(() => shoreOffers.filter(o => matches(o, needs)).length, [shoreOffers, needs]);
  const relax = useMemo(() => (fitCount ? [] : relaxOptions(shoreOffers, needs)), [shoreOffers, needs, fitCount]);

  const clearTimers = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
  const later = useCallback((ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); }, []);
  const speak = useCallback((text: string) => setBubble(previous => ({ key: previous.key + 1, text })), []);
  useEffect(() => clearTimers, [clearTimers]);

  const run = useCallback((next: Needs) => {
    const my = ++tokenRef.current;
    clearTimers();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const newPicks = picksFor(shoreOffers, next);
    const reasons: Record<string, string> = {};
    displayed.forEach(offer => { const why = reasonFor(offer, next); if (why) reasons[offer.id] = why; });
    setOut(reasons); setLeaving([]); setEnter([]); setWin(null); setVm(null); setPose("working"); speak(BUBBLE.working);

    const commit = () => {
      const kept = new Set(displayed.filter(offer => newPicks.some(pick => pick.id === offer.id)).map(offer => offer.id));
      setDisplayed(newPicks);
      setOut({});
      setLeaving([]);
      setEnter(reduced ? [] : newPicks.filter(offer => !kept.has(offer.id)).map(offer => offer.id));
      setPose("success"); setVm("happy"); speak(BUBBLE.success);
      later(reduced ? 0 : 260 + newPicks.length * 90, () => { if (tokenRef.current === my) setWin(newPicks[0]?.id ?? null); });
      later(2600, () => {
        if (tokenRef.current !== my) return;
        setPose("idle"); setVm(null); setWin(null); setEnter([]); speak(BUBBLE.idle);
      });
    };

    if (!newPicks.length) {
      if (reduced) { setPose("error"); setVm("shiver"); speak(BUBBLE.error); return; }
      later(950, () => {
        if (tokenRef.current !== my) return;
        setPose("error"); setVm("shiver"); speak(BUBBLE.error);
      });
      return;
    }

    if (reduced) { commit(); return; }

    later(950, () => {
      if (tokenRef.current !== my) return;
      setLeaving(displayed.filter(offer => !newPicks.some(pick => pick.id === offer.id)).map(offer => offer.id));
      later(300, () => { if (tokenRef.current === my) commit(); });
    });
  }, [clearTimers, displayed, later, shoreOffers, speak]);

  // First paint: shells walk in one by one, as in the mockup's place(picks, animate).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ids = displayed.map(offer => offer.id);
    setEnter(ids);
    const t = setTimeout(() => setEnter(current => (current === ids ? [] : current)), 460 + ids.length * 90);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lantern: on fine pointers the light follows the cursor and lifts nearby shells.
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0; let px = 0; let py = 0;
    const onMove = (event: PointerEvent) => {
      const r = scene.getBoundingClientRect();
      px = event.clientX - r.left; py = event.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        scene.style.setProperty("--mx", `${px}px`);
        scene.style.setProperty("--my", `${py}px`);
        scene.querySelectorAll<HTMLElement>(".pshell").forEach(shell => {
          const b = shell.getBoundingClientRect();
          shell.classList.toggle("lit", !shell.classList.contains("out") && Math.hypot(b.left + b.width / 2 - r.left - px, b.top + b.height / 2 - r.top - py) < 110);
        });
      });
    };
    const onLeave = () => { scene.style.setProperty("--mx", "-600px"); scene.querySelectorAll(".pshell.lit").forEach(shell => shell.classList.remove("lit")); };
    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerleave", onLeave);
    return () => { cancelAnimationFrame(raf); scene.removeEventListener("pointermove", onMove); scene.removeEventListener("pointerleave", onLeave); };
  }, []);

  // Wash animation
  useEffect(() => {
    function scheduleWash() {
      washTimerRef.current = setTimeout(() => {
        setWashing(false);
        requestAnimationFrame(() => {
          setWashing(true);
          scheduleWash();
        });
      }, 11000);
    }
    const t = setTimeout(() => { setWashing(true); scheduleWash(); }, 1700);
    return () => { clearTimeout(t); if (washTimerRef.current) clearTimeout(washTimerRef.current); };
  }, []);

  const fitHref = `/catalog${ram || price || region ? `?${[ram?`ram=${ram}`:"",price?`price=${price}`:"",region?`regions=${region}`:""].filter(Boolean).join("&")}` : ""}`;

  return (
    <section className="hero night" aria-labelledby="home-title">
      <svg className="hero__sky" viewBox="0 0 1440 400" preserveAspectRatio="xMaxYMin slice" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: SKY_HTML }} />
      <div className="moon" aria-hidden="true">
        <svg viewBox="-110 -110 220 220" focusable="false" dangerouslySetInnerHTML={{ __html: MOON_HTML }} />
      </div>

      <div className="hero__copy">
        <h1 id="home-title">The right server,<br />at an honest price.</h1>
        <p className="hero__lead">We compare VPS plans on intro price, renewal, setup fee and contract. Tell the crab what your project needs.</p>
        <form
          className="finder"
          id="finder"
          noValidate
          onSubmit={e => { e.preventDefault(); }}
        >
          <div className="finder__grid">
            <div className="field">
              <label htmlFor="f-ram">Memory</label>
              <Dropdown id="f-ram" name="ram" label="Memory" value={ram == null ? "" : String(ram)} options={RAM_OPTIONS} onChange={value => {
                const next = value ? Number(value) : null;
                setRam(next);
                run({ ...needs, ram: next });
              }} />
            </div>
            <div className="field">
              <label htmlFor="f-price">Budget</label>
              <Dropdown id="f-price" name="price" label="Budget" value={price == null ? "" : String(price)} options={PRICE_OPTIONS} onChange={value => {
                const next = value ? Number(value) : null;
                setPrice(next);
                run({ ...needs, price: next });
              }} />
            </div>
            <div className="field">
              <label htmlFor="f-region">Region</label>
              <Dropdown id="f-region" name="region" label="Region" value={region} options={REGION_OPTIONS} onChange={value => {
                setRegion(value);
                run({ ...needs, regions: value ? [value] : [] });
              }} />
            </div>
          </div>
          <div className="finder__out">
            <p className="finder__count">
              <b key={fitCount} className="num pop" id="fitCount">{fitCount}</b>
              <span id="fitWord">{fitCount === 1 ? "plan fits" : "plans fit"}</span>
            </p>
            <Link className="btn btn--primary" id="fitGo" href={fitHref}>
              <span id="fitGoTxt">{fitCount ? `Show the ${fitCount} plan${fitCount === 1 ? "" : "s"}` : "Open the catalog"}</span>
              <ShoreIcon name="arrow" cls="ico--arrow" />
            </Link>
          </div>
          <div className="finder__relax" id="finderRelax">
            {relax.map(option => (
              <button key={option.label} type="button" className="chip" onClick={() => {
                setRam(option.next.ram); setPrice(option.next.price); setRegion(option.next.regions[0] ?? "");
                run(option.next);
              }}>
                {option.label} → <b>{option.n}</b>
              </button>
            ))}
          </div>
        </form>
      </div>

      <div className={`hero__shore${washing ? " washing" : ""}`} id="scene" ref={sceneRef}>
        <div className="hero__sea"><span className="hero__glint"><i /><i /><i /></span></div>
        <div className="hero__swash" />
        <div className="hero__beach">
          <i className="pebble" style={{ left: "12%", top: "70%" }} />
          <i className="pebble" style={{ left: "41%", top: "84%" }} />
          <i className="pebble pebble--s" style={{ left: "63%", top: "62%" }} />
          <i className="pebble" style={{ left: "86%", top: "80%" }} />
        </div>
        <div className="hero__scrim" />
        <div className="hero__lantern" />
        <div className="crabbox">
          <p className="bubble pop" id="bubble" key={bubble.key}>{bubble.text}</p>
          <div className="crabbox__crab" id="heroCrab">
            <svg className="pet s-patchwork k-bvp" viewBox="26 50 118 74" data-state={pose} style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.crab }} />
          </div>
          <div className={`crabbox__vm${vm ? ` ${vm}` : ""}`} id="vm" style={{ "--vm": ram != null && ram >= 16 ? 1.45 : ram != null && ram >= 4 ? 1.22 : 1 } as CSSProperties}>
            <svg className="vm" viewBox="0 0 48 44" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: `<ellipse class="vm-shadow" cx="24" cy="41.5" rx="15" ry="2"/><g class="vm-in"><path class="vm-foot" d="M16 36v4M32 36v4"/><rect class="vm-body" x="7" y="6" width="34" height="30" rx="8"/><rect class="vm-seam" x="9.2" y="8.2" width="29.6" height="25.6" rx="6.4"/><circle class="vm-eye" cx="18" cy="20" r="3"/><circle class="vm-eye" cx="30" cy="20" r="3"/><path class="vm-mouth" d="M21 27q3 2.4 6 0"/></g>` }} />
          </div>
        </div>
        <ol className="shells" aria-label="One plan per provider, selected for your needs">
          {[0, 1, 2, 3].map(i => {
            const o = displayed[i];
            if (!o) return <li key={i} className={`slot slot-${i}`} aria-hidden="true" />;
            const className = ["pshell", out[o.id] ? "out" : "", leaving.includes(o.id) ? "leave" : "", enter.includes(o.id) ? "enter" : "", win === o.id ? "win" : ""].filter(Boolean).join(" ");
            return (
              <li key={i} className={`slot slot-${i}`} aria-hidden={false}>
                <Link
                  className={className}
                  href={`/offers/${o.id}`}
                  data-id={o.id}
                  style={{ "--s": shellScale(o.ram).toFixed(2), "--k": Math.max(0, enter.indexOf(o.id)) } as CSSProperties}
                >
                  {out[o.id] ? <span className="why">{out[o.id]}</span> : null}
                  <span className="ribbon" aria-hidden="true"><ShoreIcon name="check" />This one.</span>
                  <span className="ptag" aria-hidden="true">
                    <span className="ptag__p"><b>{shorePrice(o)}</b>{o.free ? null : <small>/mo</small>}</span>
                    <span className="ptag__r">{o.ram != null ? `${shoreGb(o.ram)} RAM` : "RAM not published"}</span>
                  </span>
                  <span className="pshell__thread" aria-hidden="true" />
                  <ShellSvg offer={o} />
                  <span className="pshell__name" aria-hidden="true">{o.p}</span>
                  <span className="sr-only">{o.name} by {o.p}: {shoreGb(o.ram) ?? "memory not published"} RAM, {o.free ? "a free tier, limits apply" : `${shoreMoney(o.usd)} a month`}.</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
