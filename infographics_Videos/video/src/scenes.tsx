import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ArrowDownUp, ArrowLeftRight, Banknote, BarChart3, Bell, Briefcase, Building2, Calendar,
  CheckCircle2, CircleDollarSign, Clock, Coins, Globe2, GraduationCap, HandCoins,
  HeartHandshake, Home, Hotel, Landmark, MapPin, MessageCircle, Plane, Play, Send,
  ShieldCheck, Ship, ThumbsUp, TrendingDown, TrendingUp, Users, Wallet, XCircle,
} from "lucide-react";
import { C, Card, CountUp, Float, Pill, SceneShell, cueOf, useKenBurns, useLoop, useRevealF } from "./theme";
import { geoCentroid, geoMercator, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";

// ============================================================
// Spec shapes (visuals2.json) + boundary parser.
// parseVisual validates each field once; scenes below get typed props.
// ============================================================

type SideSpec = {
  label?: string; title?: string; body?: string; text?: string; subtitle?: string;
  icon?: string; value?: number; unit?: string; note?: string; items?: FlowItem[];
};
type FlowItem = { text: string; icon?: string; mark?: "x" | "check" };
type BarSpec = { label: string; value: number; display?: string; unit?: string; color?: string; flag?: string; decimals?: number };
type MapLabelSpec = { id: string; country: string; value: string; dx?: number; dy?: number; flag?: string };
type TimelineItemSpec = { date: string; text: string; value?: string };
type CaseCardSpec = { img: string; tag: string; title: string; text: string; icon?: string; value?: string };
type StatChipSpec = { label: string; value: string; unit?: string };
type JobsRowSpec = { label: string; value: string; icon?: string };
type BigSpec = { value: number; unit?: string; label?: string };

export type Visual =
  | { type: "hook"; date?: string; left?: SideSpec; right?: SideSpec; question?: string }
  | { type: "cta"; title?: string; subtitle?: string }
  | { type: "context"; section?: string; title?: string; left?: SideSpec; right?: SideSpec; center?: string; source?: string }
  | { type: "chapter"; number?: string; title?: string; subtitle?: string; section?: string; of?: number }
  | { type: "stat"; section?: string; title?: string; value?: number; unit?: string; decimals?: number; note?: string; stats?: StatChipSpec[]; callout?: string; source?: string }
  | { type: "map"; section?: string; title?: string; subtitle?: string; labels?: MapLabelSpec[]; note?: string; source?: string }
  | { type: "compare"; section?: string; title?: string; left?: SideSpec; right?: SideSpec; bars?: BarSpec[]; max?: number; note2?: string; source?: string }
  | { type: "chart"; section?: string; title?: string; subtitle?: string; unit?: string; bars?: BarSpec[]; max?: number; note?: string; source?: string }
  | { type: "jobs"; section?: string; title?: string; big?: BigSpec; rows?: JobsRowSpec[]; note?: string; source?: string }
  | { type: "timeline"; section?: string; title?: string; subtitle?: string; items?: TimelineItemSpec[]; note?: string; source?: string }
  | { type: "flow"; section?: string; title?: string; left?: SideSpec; right?: SideSpec; note?: string; source?: string }
  | { type: "diagram"; section?: string; title?: string; left?: SideSpec; right?: SideSpec; overlap?: string; note?: string; source?: string }
  | { type: "cases"; section?: string; title?: string; cards?: CaseCardSpec[]; note?: string; source?: string }
  | { type: "verdict"; section?: string; title?: string; left?: SideSpec; right?: SideSpec; bottom?: string; source?: string }
  | { type: "quote"; section?: string; text?: string; sub?: string }
  | { type: "outro"; question?: string; choices?: string[]; next?: string };

// ---- small runtime converters (checked reads, no casts) ----
const str = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);
const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined;
const rec = (v: unknown): Record<string, unknown> | undefined =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined;

const sideSpec = (v: unknown): SideSpec | undefined => {
  const r = rec(v);
  if (!r) return undefined;
  return {
    label: str(r.label), title: str(r.title), body: str(r.body), text: str(r.text),
    subtitle: str(r.subtitle), icon: str(r.icon), value: num(r.value), unit: str(r.unit),
    note: str(r.note),
    items: Array.isArray(r.items) ? r.items.map(flowItem).filter((x): x is FlowItem => !!x) : undefined,
  };
};
const flowItem = (v: unknown): FlowItem | undefined => {
  const r = rec(v);
  if (!r || typeof r.text !== "string") return undefined;
  const mark = r.mark === "x" || r.mark === "check" ? r.mark : undefined;
  return { text: r.text, icon: str(r.icon), mark };
};
const barSpec = (v: unknown): BarSpec | undefined => {
  const r = rec(v);
  const value = r && num(r.value);
  if (!r || typeof r.label !== "string" || value === undefined) return undefined;
  return { label: r.label, value, display: str(r.display), unit: str(r.unit), color: str(r.color), flag: str(r.flag), decimals: num(r.decimals) };
};
const mapLabel = (v: unknown): MapLabelSpec | undefined => {
  const r = rec(v);
  const id = r && (str(r.id) ?? (typeof r.id === "number" ? String(r.id) : undefined));
  if (!r || !id || typeof r.country !== "string" || typeof r.value !== "string") return undefined;
  return { id, country: r.country, value: r.value, dx: num(r.dx), dy: num(r.dy), flag: str(r.flag) };
};
const timelineItem = (v: unknown): TimelineItemSpec | undefined => {
  const r = rec(v);
  if (!r || typeof r.date !== "string" || typeof r.text !== "string") return undefined;
  return { date: r.date, text: r.text, value: str(r.value) };
};
const caseCard = (v: unknown): CaseCardSpec | undefined => {
  const r = rec(v);
  if (!r || typeof r.img !== "string" || typeof r.title !== "string") return undefined;
  return { img: r.img, tag: str(r.tag) ?? "", title: r.title, text: str(r.text) ?? "", icon: str(r.icon), value: str(r.value) };
};
const statChip = (v: unknown): StatChipSpec | undefined => {
  const r = rec(v);
  if (!r || typeof r.label !== "string" || typeof r.value !== "string") return undefined;
  return { label: r.label, value: r.value, unit: str(r.unit) };
};
const jobsRow = (v: unknown): JobsRowSpec | undefined => {
  const r = rec(v);
  if (!r || typeof r.label !== "string" || typeof r.value !== "string") return undefined;
  return { label: r.label, value: r.value, icon: str(r.icon) };
};
const listOf = <T,>(v: unknown, conv: (x: unknown) => T | undefined): T[] | undefined =>
  Array.isArray(v) ? v.map(conv).filter((x): x is T => x !== undefined) : undefined;

/** Parse one visuals2.json entry into a typed Visual (falls back to context). */
export const parseVisual = (raw: unknown): Visual => {
  const r = rec(raw) ?? {};
  const base = {
    section: str(r.section), title: str(r.title), subtitle: str(r.subtitle),
    left: sideSpec(r.left), right: sideSpec(r.right), source: str(r.source), note: str(r.note),
  };
  switch (str(r.type)) {
    case "hook":
      return { type: "hook", date: str(r.date), left: base.left, right: base.right, question: str(r.question) };
    case "cta":
      return { type: "cta", title: base.title, subtitle: base.subtitle };
    case "chapter":
      return { type: "chapter", number: str(r.number), title: base.title, subtitle: base.subtitle, section: base.section, of: num(r.of) };
    case "stat":
      return {
        type: "stat", section: base.section, title: base.title, source: base.source,
        value: num(r.value), unit: str(r.unit), decimals: num(r.decimals), note: base.note,
        stats: listOf(r.stats, statChip), callout: str(r.callout),
      };
    case "map":
      return { type: "map", section: base.section, title: base.title, subtitle: base.subtitle, labels: listOf(r.labels, mapLabel), note: base.note, source: base.source };
    case "compare":
      return { type: "compare", section: base.section, title: base.title, left: base.left, right: base.right, bars: listOf(r.bars, barSpec), max: num(r.max), note2: str(r.note2), source: base.source };
    case "chart":
      return { type: "chart", section: base.section, title: base.title, subtitle: base.subtitle, unit: str(r.unit), bars: listOf(r.bars, barSpec), max: num(r.max), note: base.note, source: base.source };
    case "jobs":
      return { type: "jobs", section: base.section, title: base.title, big: (() => { const b = rec(r.big); return b ? { value: num(b.value) ?? 0, unit: str(b.unit), label: str(b.label) } : undefined; })(), rows: listOf(r.rows, jobsRow), note: base.note, source: base.source };
    case "timeline":
      return { type: "timeline", section: base.section, title: base.title, subtitle: base.subtitle, items: listOf(r.items, timelineItem), note: base.note, source: base.source };
    case "flow":
      return { type: "flow", section: base.section, title: base.title, left: base.left, right: base.right, note: base.note, source: base.source };
    case "diagram":
      return { type: "diagram", section: base.section, title: base.title, left: base.left, right: base.right, overlap: str(r.overlap), note: base.note, source: base.source };
    case "photo": case "cases":
      return { type: "cases", section: base.section, title: base.title, cards: listOf(r.cards, caseCard), note: base.note, source: base.source };
    case "verdict":
      return { type: "verdict", section: base.section, title: base.title, left: base.left, right: base.right, bottom: str(r.bottom), source: base.source };
    case "quote":
      return { type: "quote", section: base.section, text: str(r.text), sub: str(r.sub) };
    case "outro":
      return { type: "outro", question: str(r.question), choices: Array.isArray(r.choices) ? r.choices.filter((c): c is string => typeof c === "string") : undefined, next: str(r.next) };
    default:
      return { type: "context", ...base, center: str(r.center) };
  }
};

export type SceneProps<S extends Visual = Visual> = { scene: S; cues: number[] };

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  wallet: Wallet, plane: Plane, hotel: Hotel, users: Users, briefcase: Briefcase,
  shield: ShieldCheck, chart: BarChart3, map: MapPin, globe: Globe2, like: ThumbsUp,
  comment: MessageCircle, subscribe: Bell, calendar: Calendar, swap: ArrowLeftRight,
  trend: TrendingUp, trendDown: TrendingDown, money: Banknote, coins: Coins, send: Send,
  ship: Ship, bank: Landmark, dollar: CircleDollarSign, family: Users,
  graduation: GraduationCap, home: HeartHandshake, house: Home, building: Building2,
  clock: Clock, check: CheckCircle2, x: XCircle, hand: HandCoins, flow: ArrowDownUp,
  play: Play,
};

const Icon: React.FC<{ name?: string; size?: number; color?: string; strokeWidth?: number }> = ({
  name = "dollar", size = 64, color = C.ink, strokeWidth = 2.4,
}) => {
  const Cmp = iconMap[name] ?? CircleDollarSign;
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />;
};

const Flag: React.FC<{ code: string; w?: number }> = ({ code, w = 54 }) => (
  <Img
    src={staticFile(`assets/flag_${code}.png`)}
    style={{ width: w, borderRadius: 4, display: "block", boxShadow: "0 2px 6px rgba(9,53,50,0.25)" }}
  />
);

const Title: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.25, ...style }}>{children}</div>
);

const Sub: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 32, fontWeight: 700, opacity: 0.7, lineHeight: 1.5, ...style }}>{children}</div>
);

const BigNum: React.FC<{ value: number; unit?: string; decimals?: number; delayF?: number; size?: number; color?: string }> =
  ({ value, unit, decimals = 0, delayF = 0, size = 150, color = C.ink }) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, direction: "ltr", justifyContent: "center" }}>
      <span style={{ fontSize: size, fontWeight: 900, lineHeight: 1, color, fontVariantNumeric: "tabular-nums" }}>
        <CountUp value={value} decimals={decimals} delay={delayF} duration={32} />
      </span>
      {unit && <span style={{ fontSize: size * 0.32, fontWeight: 800, color, opacity: 0.85 }}>{unit}</span>}
    </div>
  );

const Chip: React.FC<{ children: React.ReactNode; tone?: "white" | "yellow" | "teal" | "red" | "green"; style?: React.CSSProperties }> =
  ({ children, tone = "white", style }) => (
    <div
      style={{
        background: tone === "yellow" ? C.yellow : tone === "teal" ? C.teal : tone === "red" ? C.red : tone === "green" ? C.green : C.white,
        color: tone === "white" || tone === "yellow" ? C.ink : C.white,
        border: tone === "white" ? `2px solid ${C.line}` : "none",
        borderRadius: 16,
        padding: "12px 22px",
        fontSize: 27,
        fontWeight: 800,
        boxShadow: "0 8px 20px rgba(9,53,50,0.10)",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );

// ================= 1. HOOK =================
export const HookScene: React.FC<SceneProps<Extract<Visual, { type: "hook" }>>> = ({ scene, cues }) => {
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 30), c2 = cueOf(cues, 2, 60), c3 = cueOf(cues, 3, 90);
  const barP = useRevealF(c2, 40);
  const loop = useLoop(110);
  const pulse = 1 + 0.06 * Math.sin(loop * Math.PI * 2);
  const lv = scene.left?.value ?? 0;
  const rv = scene.right?.value ?? 0;
  return (
    <SceneShell section="الحلقة">
      <Float delayF={c0} style={{ position: "absolute", top: 110, right: 78 }}>
        <Pill style={{ fontSize: 36, padding: "12px 32px" }}>{scene.date ?? "2025"}</Pill>
      </Float>
      <div style={{ position: "absolute", top: 195, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 34, padding: "0 78px" }}>
        <Float delayF={c1}>
          <Card tone="teal" style={{ width: 545, padding: "40px 40px 34px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="wallet" size={42} color={C.yellow} />
              </div>
              <div style={{ fontSize: 33, fontWeight: 800 }}>{scene.left?.label}</div>
            </div>
            <BigNum value={lv} unit={scene.left?.unit} delayF={c1 + 8} color={C.yellow} size={118} />
            <div style={{ marginTop: 16, fontSize: 27, fontWeight: 700, color: C.yellow }}>{scene.left?.note}</div>
          </Card>
        </Float>
        <div style={{ alignSelf: "center" }}>
          <Float delayF={c2} amp={0}>
            <div style={{ width: 108, height: 108, borderRadius: "50%", background: C.yellow, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900, boxShadow: "0 12px 30px rgba(9,53,50,0.25)", transform: `scale(${pulse})` }}>
              ولا
            </div>
          </Float>
        </div>
        <Float delayF={c2 + 6}>
          <Card tone="yellow" style={{ width: 545, padding: "40px 40px 34px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(9,53,50,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="plane" size={42} />
              </div>
              <div style={{ fontSize: 33, fontWeight: 800 }}>{scene.right?.label}</div>
            </div>
            <BigNum value={rv} unit={scene.right?.unit} decimals={1} delayF={c2 + 14} size={118} />
            <div style={{ marginTop: 16, fontSize: 27, fontWeight: 700, color: C.teal }}>{scene.right?.note}</div>
          </Card>
        </Float>
      </div>
      <Float delayF={c3} amp={0} style={{ position: "absolute", bottom: 210, left: 200, right: 200 }}>
        <div style={{ display: "flex", height: 18, borderRadius: 9, overflow: "hidden", direction: "ltr" }}>
          <div style={{ width: `${(lv / Math.max(1, lv + rv)) * 100 * barP}%`, background: C.teal }} />
          <div style={{ flex: 1, background: C.yellowDark }} />
        </div>
      </Float>
      <Float delayF={c3 + 10} amp={0} style={{ position: "absolute", bottom: 100, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 54, fontWeight: 900 }}>{scene.question}</div>
      </Float>
    </SceneShell>
  );
};

// ================= 2. CTA =================
export const CTAScene: React.FC<SceneProps<Extract<Visual, { type: "cta" }>>> = ({ scene, cues }) => {
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 40);
  const loop = useLoop(80);
  return (
    <SceneShell section="قبل ما نكملو">
      <div style={{ position: "absolute", inset: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 50 }}>
          {[
            { icon: "like", label: "لايك", d: 0 },
            { icon: "subscribe", label: "اشترك", d: 8 },
            { icon: "comment", label: "كومنت", d: 16 },
          ].map((x) => (
            <Float key={x.label} delayF={c0 + x.d} periodF={90 + x.d * 4}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 118, height: 118, borderRadius: 32, background: C.yellow,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 16px 34px rgba(9,53,50,0.18)",
                  transform: `rotate(${Math.sin(loop * Math.PI * 2 + x.d) * 4}deg)`,
                }}>
                  <Icon name={x.icon} size={60} />
                </div>
                <div style={{ fontSize: 34, fontWeight: 900 }}>{x.label}</div>
              </div>
            </Float>
          ))}
        </div>
        <Float delayF={c1} amp={0} style={{ marginTop: 52 }}>
          <div style={{ fontSize: 46, fontWeight: 900, textAlign: "center" }}>{scene.title}</div>
        </Float>
        <Float delayF={c1 + 12} amp={0} style={{ marginTop: 18 }}>
          <Sub style={{ textAlign: "center", maxWidth: 1150 }}>{scene.subtitle}</Sub>
        </Float>
      </div>
    </SceneShell>
  );
};

// ================= 3. CONTEXT =================
export const ContextScene: React.FC<SceneProps<Extract<Visual, { type: "context" }>>> = ({ scene, cues }) => {
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 45), c2 = cueOf(cues, 2, 90);
  return (
    <SceneShell section={scene.section ?? "السياق"} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 108, right: 78, left: 78, textAlign: "center" }}>
        <Title>{scene.title}</Title>
      </Float>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40, padding: "0 90px" }}>
        <Float delayF={c0 + 10}>
          <Card style={{ width: 640, padding: "38px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <div style={{ width: 66, height: 66, borderRadius: 18, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={scene.left?.icon ?? "send"} size={38} color={C.yellow} />
              </div>
              <div style={{ fontSize: 38, fontWeight: 900 }}>{scene.left?.title}</div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.65, opacity: 0.85 }}>{scene.left?.body}</div>
          </Card>
        </Float>
        <Float delayF={c1}>
          <Card style={{ width: 640, padding: "38px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <div style={{ width: 66, height: 66, borderRadius: 18, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={scene.right?.icon ?? "plane"} size={38} />
              </div>
              <div style={{ fontSize: 38, fontWeight: 900 }}>{scene.right?.title}</div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.65, opacity: 0.85 }}>{scene.right?.body}</div>
          </Card>
        </Float>
      </div>
      <Float delayF={c2} style={{ position: "absolute", bottom: 110, left: 0, right: 0, textAlign: "center" }}>
        <Pill style={{ fontSize: 34, padding: "16px 40px" }}>{scene.center}</Pill>
      </Float>
    </SceneShell>
  );
};

// ================= 4. CHAPTER =================
export const ChapterScene: React.FC<SceneProps<Extract<Visual, { type: "chapter" }>>> = ({ scene }) => {
  const loop = useLoop(100);
  const enter = useRevealF(0, 16);
  const of = scene.of ?? 1;
  return (
    <SceneShell dark section={scene.section ?? "الفصل"}>
      <div style={{
        position: "absolute", width: 700, height: 700, borderRadius: "50%",
        border: `3px solid ${C.yellow}`, opacity: 0.12, left: -220, top: -160,
        transform: `scale(${1 + 0.04 * Math.sin(loop * Math.PI * 2)})`,
      }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 60 }}>
        <div style={{
          fontSize: 210, fontWeight: 900, color: "transparent",
          WebkitTextStroke: `4px ${C.yellow}`,
          opacity: enter,
          transform: `translateX(${(1 - enter) * -80}px)`,
          fontVariantNumeric: "tabular-nums",
        }}>
          {scene.number}
        </div>
        <div style={{ width: 6, height: 260, background: C.yellow, opacity: enter, borderRadius: 3 }} />
        <div style={{ maxWidth: 800, opacity: enter, transform: `translateX(${(1 - enter) * 80}px)` }}>
          <div style={{ fontSize: 88, fontWeight: 900, color: C.white, lineHeight: 1.2 }}>{scene.title}</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: C.yellow, marginTop: 18 }}>{scene.subtitle}</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        {[1, 2, 3].map((k) => (
          <div key={k} style={{
            width: k === of ? 46 : 16, height: 16, borderRadius: 8,
            background: k === of ? C.yellow : "rgba(255,255,255,0.3)",
          }} />
        ))}
      </div>
    </SceneShell>
  );
};

// ================= 5. STAT =================
export const StatScene: React.FC<SceneProps<Extract<Visual, { type: "stat" }>>> = ({ scene, cues }) => {
  const stats = scene.stats ?? [];
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 40), c2 = cueOf(cues, 2, 80), c3 = cueOf(cues, 3, 120);
  const loop = useLoop(130);
  return (
    <SceneShell section={scene.section} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 120, right: 78, left: 78, textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 900, opacity: 0.9 }}>{scene.title}</div>
      </Float>
      <Float delayF={c1} amp={8} style={{ position: "absolute", top: 220, left: 0, right: 0 }}>
        <div style={{
          width: 470, height: 330, margin: "0 auto", borderRadius: "50% 50% 40px 40px / 60% 60% 40px 40px",
          background: `linear-gradient(160deg, ${C.white}, ${C.bgLight})`,
          border: `3px solid ${C.line}`, boxShadow: "0 24px 60px rgba(9,53,50,0.14)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          transform: `rotate(${Math.sin(loop * Math.PI * 2) * 1.2}deg)`,
        }}>
          <BigNum value={scene.value ?? 0} unit={scene.unit} decimals={scene.decimals ?? 0} delayF={c1 + 8} size={140} color={C.teal} />
          <div style={{ fontSize: 30, fontWeight: 800, color: C.ink, opacity: 0.75, marginTop: 8 }}>{scene.note}</div>
        </div>
      </Float>
      <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22, padding: "0 90px" }}>
        {stats.slice(0, 4).map((st, i) => (
          <Float key={i} delayF={c2 + i * 12} periodF={100 + i * 15}>
            <Chip style={{ flexDirection: "column", padding: "16px 26px", minWidth: 190 }}>
              <span style={{ fontSize: 40, fontWeight: 900, color: C.teal, fontVariantNumeric: "tabular-nums", direction: "ltr" }}>
                {st.value}<span style={{ fontSize: 22, fontWeight: 800 }}> {st.unit}</span>
              </span>
              <span style={{ fontSize: 24, opacity: 0.8 }}>{st.label}</span>
            </Chip>
          </Float>
        ))}
      </div>
      {scene.callout && (
        <Float delayF={c3} amp={0} style={{ position: "absolute", bottom: 46, left: 0, right: 0, textAlign: "center" }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: C.teal }}>{scene.callout}</span>
        </Float>
      )}
    </SceneShell>
  );
};

// ================= 6. MAP =================
const topo = world as unknown as Topology; // world-atlas JSON ships a TopoJSON topology
const countries = (feature(topo, topo.objects.countries as never) as unknown as {
  features: (GeoPermissibleObjects & { id?: string | number })[];
}).features;

const EU_IDS = ["250", "724", "380", "56", "528", "276", "826", "620", "208", "756", "40", "616", "442", "372"];
const MA_ID = "504";

const findCountry = (id: string) =>
  countries.find((c) => String(c.id).padStart(3, "0") === id.padStart(3, "0"));

const MapRoute: React.FC<{ from: [number, number]; to: [number, number]; startF: number; loop: number }> = ({ from, to, startF, loop }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [startF, startF + 26], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const mx = (from[0] + to[0]) / 2 + 60;
  const my = (from[1] + to[1]) / 2 - 120;
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  return (
    <g>
      <path
        d={`M ${from[0]} ${from[1]} Q ${mx} ${my} ${to[0]} ${to[1]}`}
        fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="10 8"
        strokeDashoffset={len * 2 * (1 - p) - loop * 36 * p}
        pathLength={len * 2}
        opacity={0.85}
      />
      {p > 0.98 && <circle cx={to[0]} cy={to[1]} r={8 + 3 * Math.sin(loop * Math.PI * 2)} fill={C.red} opacity={0.9} />}
    </g>
  );
};

const MapLabelChip: React.FC<{ l: MapLabelSpec; x: number; y: number; startF: number }> = ({ l, x, y, startF }) => {
  const pop = useRevealF(startF, 12);
  const bob = Math.sin(useLoop(80, startF * 2) * Math.PI * 2) * 5;
  return (
    <div style={{ position: "absolute", left: x + (l.dx ?? 0) - 95, top: y + (l.dy ?? 0) - 42 + bob, opacity: pop, transform: `scale(${0.5 + 0.5 * pop})` }}>
      <Chip tone="white" style={{ padding: "10px 16px", gap: 12 }}>
        <Flag code={l.flag ?? "fr"} w={46} />
        <span style={{ fontSize: 25 }}>{l.country}</span>
        <span style={{ fontSize: 27, color: C.teal, fontVariantNumeric: "tabular-nums", direction: "ltr" }}>{l.value}</span>
      </Chip>
    </div>
  );
};

export const MapScene: React.FC<SceneProps<Extract<Visual, { type: "map" }>>> = ({ scene, cues }) => {
  const { width, height } = useVideoConfig();
  const labels = scene.labels ?? [];
  const c0 = cueOf(cues, 0);
  const loop = useLoop(60);

  const projection = geoMercator()
    .center([8, 42])
    .scale(width * 0.72)
    .translate([width * 0.5, height * 0.47]);
  const path = geoPath(projection);

  const pinFrames = labels.map((_, i) => cueOf(cues, i + 1, c0 + 30 + i * 25));
  const ma = findCountry(MA_ID);
  const maXY: [number, number] = ma ? (projection(geoCentroid(ma)) ?? [width / 2, height * 0.8]) : [width / 2, height * 0.8];

  return (
    <SceneShell section={scene.section} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 108, right: 78, left: 78, textAlign: "center", zIndex: 5 }}>
        <Title style={{ fontSize: 52 }}>{scene.title}</Title>
        {scene.subtitle && <Sub style={{ marginTop: 6 }}>{scene.subtitle}</Sub>}
      </Float>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * Math.sin(loop * Math.PI * 2)})`, transformOrigin: "50% 55%" }}>
        {countries.map((ct) => {
          const id = String(ct.id).padStart(3, "0");
          const isMA = id === MA_ID;
          const isEU = EU_IDS.includes(id);
          const labelHit = labels.some((l) => l.id.padStart(3, "0") === id);
          const fill = isMA ? C.green : labelHit ? C.yellowDark : isEU ? "#9FBFBD" : "#C6D8D6";
          return <path key={id} d={path(ct) ?? ""} fill={fill} stroke={C.white} strokeWidth={isMA || labelHit ? 1.5 : 0.7} opacity={isMA ? 0.95 : labelHit ? 0.95 : 0.55} />;
        })}
        {labels.map((l, i) => {
          const ct = findCountry(l.id);
          if (!ct) return null;
          const xy = projection(geoCentroid(ct));
          if (!xy) return null;
          return <MapRoute key={i} from={maXY} to={xy} startF={pinFrames[i]} loop={loop} />;
        })}
        <circle cx={maXY[0]} cy={maXY[1]} r={10 + 4 * Math.sin(loop * Math.PI * 2)} fill={C.green} stroke={C.white} strokeWidth={3} />
      </svg>
      {labels.map((l, i) => {
        const ct = findCountry(l.id);
        if (!ct) return null;
        const xy = projection(geoCentroid(ct));
        if (!xy) return null;
        return <MapLabelChip key={i} l={l} x={xy[0]} y={xy[1]} startF={pinFrames[i]} />;
      })}
      {scene.note && (
        <Float delayF={pinFrames[pinFrames.length - 1] ?? c0 + 30} amp={0} style={{ position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center" }}>
          <Pill style={{ fontSize: 28 }}>{scene.note}</Pill>
        </Float>
      )}
    </SceneShell>
  );
};

// ================= 7. COMPARE =================
export const CompareScene: React.FC<SceneProps<Extract<Visual, { type: "compare" }>>> = ({ scene, cues }) => {
  const bars = scene.bars ?? [];
  const max = scene.max ?? Math.max(...bars.map((b) => b.value), 1);
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 50), c2 = cueOf(cues, 2, 90);
  const loop = useLoop(95);
  const vsPulse = 1 + 0.05 * Math.sin(loop * Math.PI * 2);
  return (
    <SceneShell section={scene.section} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 112, right: 78, left: 78, textAlign: "center" }}>
        <Title style={{ fontSize: 54 }}>{scene.title}</Title>
      </Float>
      {bars.length ? (
        <div style={{ position: "absolute", top: 240, left: 160, right: 160, display: "flex", flexDirection: "column", gap: 34 }}>
          {bars.map((b, i) => (
            <CompareBar key={i} b={b} max={max} start={c0 + 10 + i * 22} />
          ))}
        </div>
      ) : (
        <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, padding: "0 90px" }}>
          <Float delayF={c0 + 8}>
            <Card style={{ width: 560, padding: "36px", textAlign: "center" }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: C.teal, marginBottom: 12 }}>{scene.left?.title}</div>
              <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.6, opacity: 0.85 }}>{scene.left?.body}</div>
              {scene.left?.value != null && <BigNum value={scene.left.value} unit={scene.left.unit} delayF={c1} size={96} />}
            </Card>
          </Float>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: C.ink, color: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, transform: `scale(${vsPulse})` }}>VS</div>
          <Float delayF={c1}>
            <Card tone="yellow" style={{ width: 560, padding: "36px", textAlign: "center" }}>
              <div style={{ fontSize: 34, fontWeight: 900, marginBottom: 12 }}>{scene.right?.title}</div>
              <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.6, opacity: 0.9 }}>{scene.right?.body}</div>
              {scene.right?.value != null && <BigNum value={scene.right.value} unit={scene.right.unit} delayF={c1 + 10} size={96} />}
            </Card>
          </Float>
        </div>
      )}
      {scene.note2 && (
        <Float delayF={c2} amp={0} style={{ position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center" }}>
          <Pill style={{ fontSize: 30 }}>{scene.note2}</Pill>
        </Float>
      )}
    </SceneShell>
  );
};

const CompareBar: React.FC<{ b: BarSpec; max: number; start: number }> = ({ b, max, start }) => {
  const p = useRevealF(start, 30);
  const barColor = b.color === "green" ? C.green : b.color === "red" ? C.red : b.color === "yellow" ? C.yellow : `linear-gradient(90deg, ${C.teal}, ${C.tealDark})`;
  const numColor = b.color === "green" ? C.green : b.color === "red" ? C.red : C.teal;
  return (
    <div style={{ opacity: p, transform: `translateX(${Math.sin(useLoop(80, start) * Math.PI * 2) * 4}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontSize: 32, fontWeight: 800 }}>{b.label}</span>
        <span style={{ fontSize: 42, fontWeight: 900, color: numColor, fontVariantNumeric: "tabular-nums", direction: "ltr" }}>
          {b.display ?? b.value}{b.unit ? ` ${b.unit}` : ""}
        </span>
      </div>
      <div style={{ height: 42, borderRadius: 21, background: "rgba(9,53,50,0.08)", overflow: "hidden", direction: "ltr" }}>
        <div style={{ height: "100%", borderRadius: 21, width: `${(b.value / max) * 100 * p}%`, background: barColor }} />
      </div>
    </div>
  );
};

// ================= 8. CHART =================
export const ChartScene: React.FC<SceneProps<Extract<Visual, { type: "chart" }>>> = ({ scene, cues }) => {
  const bars = scene.bars ?? [];
  const max = scene.max ?? Math.max(...bars.map((b) => b.value), 1);
  const c0 = cueOf(cues, 0);
  return (
    <SceneShell section={scene.section} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 112, right: 78, left: 78, textAlign: "center" }}>
        <Title style={{ fontSize: 52 }}>{scene.title}</Title>
        {scene.subtitle && <Sub style={{ marginTop: 6 }}>{scene.subtitle}</Sub>}
      </Float>
      <div style={{ position: "absolute", top: 250, left: 140, right: 140, display: "flex", flexDirection: "column", gap: 26 }}>
        {bars.map((b, i) => (
          <BarRow key={i} b={b} i={i} start={cueOf(cues, i, c0 + 15 + i * 20)} max={max} unit={scene.unit} />
        ))}
      </div>
      {scene.note && (
        <Float delayF={cueOf(cues, bars.length, c0 + 30 + bars.length * 20)} amp={0} style={{ position: "absolute", bottom: 70, left: 0, right: 0, textAlign: "center" }}>
          <Chip tone="yellow" style={{ fontSize: 28 }}>{scene.note}</Chip>
        </Float>
      )}
    </SceneShell>
  );
};

const BarRow: React.FC<{ b: BarSpec; i: number; start: number; max: number; unit?: string }> = ({ b, i, start, max, unit }) => {
  const p = useRevealF(start, 26);
  const wobble = Math.sin(useLoop(70, i * 20) * Math.PI * 2) * 4;
  return (
    <div style={{ opacity: Math.min(1, p * 1.6), transform: `translateX(${wobble}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 300, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
          <span style={{ fontSize: 32, fontWeight: 800 }}>{b.label}</span>
          {b.flag && <Flag code={b.flag} w={50} />}
        </div>
        <div style={{ flex: 1, height: 52, borderRadius: 14, background: "rgba(9,53,50,0.07)", overflow: "hidden", direction: "ltr" }}>
          <div style={{
            height: "100%", width: `${(b.value / max) * 100 * p}%`,
            background: i === 0 ? `linear-gradient(90deg, ${C.yellow}, ${C.yellowDark})` : `linear-gradient(90deg, ${C.teal}, ${C.tealDark})`,
            borderRadius: 14, paddingLeft: 16,
          }} />
        </div>
        <span style={{ fontSize: 40, fontWeight: 900, color: i === 0 ? C.yellowDark : C.teal, fontVariantNumeric: "tabular-nums", direction: "ltr", width: 160, textAlign: "left" }}>
          <CountUp value={b.value} decimals={b.decimals ?? 0} delay={start} duration={26} />
          <span style={{ fontSize: 22, fontWeight: 800 }}> {unit ?? b.unit ?? ""}</span>
        </span>
      </div>
    </div>
  );
};

// ================= 9. JOBS =================
export const JobsScene: React.FC<SceneProps<Extract<Visual, { type: "jobs" }>>> = ({ scene, cues }) => {
  const rows = scene.rows ?? [];
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 45), c2 = cueOf(cues, 2, 85);
  const loop = useLoop(140);
  return (
    <SceneShell section={scene.section} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 112, right: 78, left: 78, textAlign: "center" }}>
        <Title style={{ fontSize: 52 }}>{scene.title}</Title>
      </Float>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 70 }}>
        <Float delayF={c0 + 8}>
          <div style={{ position: "relative", width: 420, height: 420 }}>
            {[0, 1, 2].map((r) => (
              <div key={r} style={{
                position: "absolute", inset: -r * 26, borderRadius: "50%",
                border: `2px solid ${C.teal}`, opacity: 0.25 * (1 - r * 0.28) * Math.abs(Math.sin(loop * Math.PI * 2 + r)),
              }} />
            ))}
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%", background: C.teal,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: "0 26px 60px rgba(13,118,115,0.4)",
            }}>
              <div style={{ fontSize: 110, fontWeight: 900, color: C.yellow, lineHeight: 1, fontVariantNumeric: "tabular-nums", direction: "ltr" }}>
                <CountUp value={scene.big?.value ?? 0} delay={c0 + 12} duration={40} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.white, marginTop: 8 }}>{scene.big?.unit}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>{scene.big?.label}</div>
            </div>
          </div>
        </Float>
        <div style={{ width: 560, display: "flex", flexDirection: "column", gap: 22 }}>
          {rows.map((r, i) => (
            <Float key={i} delayF={c1 + i * 18}>
              <Chip tone={i === rows.length - 1 ? "yellow" : "white"} style={{ width: "100%", justifyContent: "space-between", padding: "18px 26px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Icon name={r.icon ?? "briefcase"} size={36} color={i === rows.length - 1 ? C.ink : C.teal} />
                  <span style={{ fontSize: 28 }}>{r.label}</span>
                </span>
                <span style={{ fontSize: 34, fontWeight: 900, color: i === rows.length - 1 ? C.ink : C.teal, direction: "ltr", fontVariantNumeric: "tabular-nums" }}>{r.value}</span>
              </Chip>
            </Float>
          ))}
        </div>
      </div>
      {scene.note && (
        <Float delayF={c2} amp={0} style={{ position: "absolute", bottom: 70, left: 0, right: 0, textAlign: "center" }}>
          <Sub style={{ maxWidth: 1250, margin: "0 auto" }}>{scene.note}</Sub>
        </Float>
      )}
    </SceneShell>
  );
};

// ================= 10. TIMELINE =================
export const TimelineScene: React.FC<SceneProps<Extract<Visual, { type: "timeline" }>>> = ({ scene, cues }) => {
  const items = scene.items ?? [];
  const c0 = cueOf(cues, 0);
  const lineP = useRevealF(c0 + 5, Math.max(30, items.length * 18));
  return (
    <SceneShell section={scene.section} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 112, right: 78, left: 78, textAlign: "center" }}>
        <Title style={{ fontSize: 52 }}>{scene.title}</Title>
        {scene.subtitle && <Sub style={{ marginTop: 6 }}>{scene.subtitle}</Sub>}
      </Float>
      <div style={{ position: "absolute", top: 480, left: 110, right: 110, height: 8, borderRadius: 4, background: "rgba(9,53,50,0.10)", direction: "rtl" }}>
        <div style={{ height: "100%", width: `${lineP * 100}%`, borderRadius: 4, background: `linear-gradient(90deg, ${C.yellow}, ${C.teal})` }} />
      </div>
      <div style={{ position: "absolute", top: 0, left: 110, right: 110, bottom: 0, display: "flex", justifyContent: "space-between" }}>
        {items.map((it, i) => (
          <TimelineItem key={i} it={it} last={i === items.length - 1} start={cueOf(cues, i, c0 + 10 + i * 20)} up={i % 2 === 0} />
        ))}
      </div>
      {scene.note && (
        <Float delayF={cueOf(cues, items.length, c0 + 40)} amp={0} style={{ position: "absolute", bottom: 44, left: 0, right: 0, textAlign: "center" }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: C.teal }}>{scene.note}</span>
        </Float>
      )}
    </SceneShell>
  );
};

const TimelineItem: React.FC<{ it: TimelineItemSpec; last: boolean; start: number; up: boolean }> = ({ it, last, start, up }) => {
  const p = useRevealF(start, 14);
  const loop = useLoop(120, start);
  const bob = Math.sin(loop * Math.PI * 2) * 4 * p;
  return (
    <div style={{ position: "relative", width: 200, top: 0, height: "100%", opacity: p }}>
      <div style={{ position: "absolute", top: 472, left: "50%", transform: "translateX(-50%)", width: 26, height: 26, borderRadius: "50%", background: last ? C.yellow : C.teal, border: `4px solid ${C.white}`, boxShadow: "0 4px 12px rgba(9,53,50,0.3)" }} />
      <div style={{ position: "absolute", top: up ? 300 + bob : 530 + bob, left: "50%", transform: "translateX(-50%)", width: 230, textAlign: "center" }}>
        <Card tone={last ? "yellow" : "white"} style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: last ? C.ink : C.teal, direction: "ltr" }}>{it.date}</div>
          <div style={{ fontSize: 25, fontWeight: 700, marginTop: 8, lineHeight: 1.4 }}>{it.text}</div>
          {it.value && <div style={{ fontSize: 30, fontWeight: 900, marginTop: 6, color: C.green, direction: "ltr" }}>{it.value}</div>}
        </Card>
      </div>
      <div style={{ position: "absolute", top: up ? 440 : 504, left: "50%", transform: "translateX(-50%)", width: 3, height: up ? 40 : 28, background: C.teal, opacity: 0.5 }} />
    </div>
  );
};

// ================= 11. FLOW (money split) =================
export const FlowScene: React.FC<SceneProps<Extract<Visual, { type: "flow" }>>> = ({ scene, cues }) => {
  const cols = [scene.left, scene.right].filter((c): c is SideSpec => !!c);
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 60);
  return (
    <SceneShell section={scene.section} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 112, right: 78, left: 78, textAlign: "center" }}>
        <Title style={{ fontSize: 52 }}>{scene.title}</Title>
      </Float>
      <div style={{ position: "absolute", top: 215, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 44, padding: "0 80px" }}>
        {cols.map((col, ci) => (
          <Card key={ci} tone={ci === 1 ? "teal" : "white"} style={{ width: 660, padding: "32px 34px" }}>
            <Float delayF={c0 + 8 + ci * 14} amp={0}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <Pill style={{ fontSize: 30, padding: "8px 24px" }}>{col.title}</Pill>
                <span style={{ fontSize: 26, fontWeight: 800, opacity: 0.7 }}>{col.subtitle}</span>
              </div>
            </Float>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(col.items ?? []).map((it, i) => (
                <FlowRow key={i} it={it} start={c1 + ci * 10 + i * 16} dark={ci === 1} />
              ))}
            </div>
          </Card>
        ))}
      </div>
      {scene.note && (
        <Float delayF={cueOf(cues, 4, c1 + 60)} amp={0} style={{ position: "absolute", bottom: 64, left: 0, right: 0, textAlign: "center" }}>
          <Chip tone="yellow" style={{ fontSize: 29 }}>{scene.note}</Chip>
        </Float>
      )}
    </SceneShell>
  );
};

const FlowRow: React.FC<{ it: FlowItem; start: number; dark?: boolean }> = ({ it, start, dark }) => {
  const p = useRevealF(start, 16);
  const loop = useLoop(120, start);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16, opacity: p,
      transform: `translateX(${(1 - p) * 40 + Math.sin(loop * Math.PI * 2) * 3}px)`,
      background: dark ? "rgba(255,255,255,0.10)" : "rgba(9,53,50,0.05)",
      borderRadius: 16, padding: "14px 18px",
    }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: dark ? "rgba(255,255,255,0.15)" : C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={it.icon ?? "money"} size={30} color={dark ? C.yellow : C.teal} />
      </div>
      <span style={{ fontSize: 27, fontWeight: 700, flex: 1, lineHeight: 1.35 }}>{it.text}</span>
      {it.mark === "x" && <Icon name="x" size={30} color={dark ? "#FFB4B4" : C.red} />}
      {it.mark === "check" && <Icon name="check" size={30} color={dark ? C.yellow : C.green} />}
    </div>
  );
};

// ================= 12. DIAGRAM (venn overlap) =================
export const DiagramScene: React.FC<SceneProps<Extract<Visual, { type: "diagram" }>>> = ({ scene, cues }) => {
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 60), c2 = cueOf(cues, 2, 100);
  const loop = useLoop(160);
  return (
    <SceneShell section={scene.section} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 112, right: 78, left: 78, textAlign: "center" }}>
        <Title style={{ fontSize: 52 }}>{scene.title}</Title>
      </Float>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, height: 560, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1150, height: "100%" }}>
          <Float delayF={c0 + 10} amp={0} style={{ position: "absolute", right: 60, top: 30 }}>
            <div style={{
              width: 560, height: 430, borderRadius: "50%",
              background: "rgba(13,118,115,0.22)", border: `4px solid ${C.teal}`,
              display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 60,
              transform: `scale(${1 + 0.02 * Math.sin(loop * Math.PI * 2)})`,
            }}>
              <div style={{ textAlign: "center", width: 240 }}>
                <Icon name="wallet" size={52} color={C.teal} />
                <div style={{ fontSize: 34, fontWeight: 900, color: C.teal, marginTop: 8 }}>{scene.left?.title}</div>
                <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.8, marginTop: 6 }}>{scene.left?.text}</div>
              </div>
            </div>
          </Float>
          <Float delayF={c1} amp={0} style={{ position: "absolute", left: 60, top: 30 }}>
            <div style={{
              width: 560, height: 430, borderRadius: "50%",
              background: "rgba(253,202,59,0.28)", border: `4px solid ${C.yellowDark}`,
              display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: 60,
              transform: `scale(${1 + 0.02 * Math.sin(loop * Math.PI * 2 + 2)})`,
            }}>
              <div style={{ textAlign: "center", width: 240 }}>
                <Icon name="plane" size={52} color={C.yellowDark} />
                <div style={{ fontSize: 34, fontWeight: 900, color: C.yellowDark, marginTop: 8 }}>{scene.right?.title}</div>
                <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.8, marginTop: 6 }}>{scene.right?.text}</div>
              </div>
            </div>
          </Float>
          <Float delayF={c2} amp={6} style={{ position: "absolute", left: "50%", top: "42%", transform: "translateX(-50%)" }}>
            <Card tone="yellow" style={{ padding: "22px 30px", textAlign: "center", boxShadow: "0 20px 50px rgba(9,53,50,0.25)" }}>
              <div style={{ fontSize: 30, fontWeight: 900 }}>{scene.overlap}</div>
            </Card>
          </Float>
        </div>
      </div>
      {scene.note && (
        <Float delayF={c2 + 15} amp={0} style={{ position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center" }}>
          <Sub style={{ maxWidth: 1250, margin: "0 auto" }}>{scene.note}</Sub>
        </Float>
      )}
    </SceneShell>
  );
};

// ================= 13. CASES (photo cards) =================
export const CasesScene: React.FC<SceneProps<Extract<Visual, { type: "cases" }>>> = ({ scene, cues }) => {
  const cards = scene.cards ?? [];
  const c0 = cueOf(cues, 0);
  return (
    <SceneShell section={scene.section} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 108, right: 78, left: 78, textAlign: "center" }}>
        <Title style={{ fontSize: 50 }}>{scene.title}</Title>
      </Float>
      <div style={{ position: "absolute", top: 205, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40, padding: "0 70px" }}>
        {cards.map((cd, i) => (
          <PhotoCard key={i} cd={cd} start={cueOf(cues, i, c0 + 10 + i * 30)} wide={cards.length <= 2 ? 700 : 540} />
        ))}
      </div>
      {scene.note && (
        <Float delayF={cueOf(cues, cards.length, c0 + 60)} amp={0} style={{ position: "absolute", bottom: 44, left: 0, right: 0, textAlign: "center" }}>
          <Pill style={{ fontSize: 28 }}>{scene.note}</Pill>
        </Float>
      )}
    </SceneShell>
  );
};

const PhotoCard: React.FC<{ cd: CaseCardSpec; start: number; wide?: number }> = ({ cd, start, wide = 540 }) => {
  const p = useRevealF(start, 18);
  const kb = useKenBurns(0.14, -30);
  return (
    <Card style={{ width: wide, padding: 0, overflow: "hidden", opacity: p, transform: `translateY(${(1 - p) * 50}px)` }}>
      <div style={{ height: 320, overflow: "hidden", position: "relative" }}>
        <Img
          src={staticFile(`assets/${cd.img}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb.scale}) translateX(${kb.x}px)` }}
        />
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <Chip tone="yellow" style={{ fontSize: 24, padding: "8px 18px" }}>
            <Icon name="map" size={26} /> {cd.tag}
          </Chip>
        </div>
      </div>
      <div style={{ padding: "24px 28px 28px" }}>
        <div style={{ fontSize: 32, fontWeight: 900, display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name={cd.icon ?? "family"} size={34} color={C.teal} /> {cd.title}
        </div>
        <div style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.55, opacity: 0.85, marginTop: 10 }}>{cd.text}</div>
        {cd.value && <div style={{ fontSize: 30, fontWeight: 900, color: C.teal, marginTop: 10, direction: "ltr", textAlign: "right" }}>{cd.value}</div>}
      </div>
    </Card>
  );
};

// ================= 14. VERDICT =================
export const VerdictScene: React.FC<SceneProps<Extract<Visual, { type: "verdict" }>>> = ({ scene, cues }) => {
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 60), c2 = cueOf(cues, 2, 110);
  const loop = useLoop(120);
  return (
    <SceneShell section={scene.section} source={scene.source}>
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 110, right: 78, left: 78, textAlign: "center" }}>
        <Title style={{ fontSize: 54 }}>{scene.title}</Title>
      </Float>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "stretch", gap: 40, padding: "0 80px" }}>
        <Float delayF={c0 + 10}>
          <Card tone="teal" style={{ width: 640, padding: "36px 38px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <Icon name="shield" size={44} color={C.yellow} />
              <div style={{ fontSize: 40, fontWeight: 900 }}>{scene.left?.title}</div>
            </div>
            <div style={{ fontSize: 29, fontWeight: 700, lineHeight: 1.6, opacity: 0.92 }}>{scene.left?.body}</div>
          </Card>
        </Float>
        <Float delayF={c1}>
          <Card tone="yellow" style={{ width: 640, padding: "36px 38px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <Icon name="briefcase" size={44} color={C.ink} />
              <div style={{ fontSize: 40, fontWeight: 900 }}>{scene.right?.title}</div>
            </div>
            <div style={{ fontSize: 29, fontWeight: 700, lineHeight: 1.6, opacity: 0.9 }}>{scene.right?.body}</div>
          </Card>
        </Float>
      </div>
      {scene.bottom && (
        <Float delayF={c2} amp={5} style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center" }}>
          <div style={{
            display: "inline-block", fontSize: 42, fontWeight: 900, color: C.ink,
            background: `linear-gradient(transparent 55%, ${C.yellow} 55%)`,
            padding: "0 12px",
            transform: `scale(${1 + 0.015 * Math.sin(loop * Math.PI * 2)})`,
          }}>
            {scene.bottom}
          </div>
        </Float>
      )}
    </SceneShell>
  );
};

// ================= 15. QUOTE =================
export const QuoteScene: React.FC<SceneProps<Extract<Visual, { type: "quote" }>>> = ({ scene, cues }) => {
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 50);
  const loop = useLoop(150);
  return (
    <SceneShell dark section={scene.section ?? "الخلاصة"}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 140px" }}>
        <div style={{ textAlign: "center", maxWidth: 1400 }}>
          <Float delayF={c0} amp={0}>
            <div style={{ fontSize: 170, fontWeight: 900, color: C.yellow, lineHeight: 0.5, opacity: 0.85, transform: `scale(${1 + 0.05 * Math.sin(loop * Math.PI * 2)})` }}>”</div>
          </Float>
          <Float delayF={c0 + 8} amp={0}>
            <div style={{ fontSize: 52, fontWeight: 900, color: C.white, lineHeight: 1.55, marginTop: 30, transform: `translateY(${Math.sin(loop * Math.PI * 2 + 1) * 6}px)` }}>{scene.text}</div>
          </Float>
          {scene.sub && (
            <Float delayF={c1} amp={0}>
              <div style={{ fontSize: 32, fontWeight: 700, color: C.yellow, marginTop: 34 }}>{scene.sub}</div>
            </Float>
          )}
        </div>
      </div>
    </SceneShell>
  );
};

// ================= 16. OUTRO =================
export const OutroScene: React.FC<SceneProps<Extract<Visual, { type: "outro" }>>> = ({ scene, cues }) => {
  const choices = scene.choices ?? [];
  const c0 = cueOf(cues, 0), c1 = cueOf(cues, 1, 50), c2 = cueOf(cues, 2, 95);
  const loop = useLoop(90);
  return (
    <SceneShell section="الختام">
      <Float delayF={c0} amp={0} style={{ position: "absolute", top: 120, right: 78, left: 78, textAlign: "center" }}>
        <Title style={{ fontSize: 52 }}>{scene.question}</Title>
      </Float>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36, padding: "0 100px" }}>
        {choices.map((ch, i) => (
          <Float key={i} delayF={c1 + i * 14}>
            <Card tone={i === 0 ? "teal" : "yellow"} style={{ width: 640, padding: "30px 34px", textAlign: "center", transform: `translateY(${Math.sin(loop * Math.PI * 2 + i * 1.9) * 7}px)` }}>
              <div style={{ fontSize: 30, fontWeight: 900, opacity: 0.7 }}>{i === 0 ? "الخيار أ" : "الخيار ب"}</div>
              <div style={{ fontSize: 36, fontWeight: 900, marginTop: 10, lineHeight: 1.4 }}>{ch}</div>
            </Card>
          </Float>
        ))}
      </div>
      <Float delayF={c2} amp={6} style={{ position: "absolute", bottom: 180, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26 }}>
        {["like", "comment", "subscribe"].map((ic, i) => (
          <div key={ic} style={{
            width: 92, height: 92, borderRadius: 26, background: C.white,
            border: `2px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `rotate(${Math.sin(loop * Math.PI * 2 + i * 2) * 5}deg)`,
            boxShadow: "0 12px 28px rgba(9,53,50,0.12)",
          }}>
            <Icon name={ic} size={48} color={C.teal} />
          </div>
        ))}
      </Float>
      <Float delayF={c2 + 14} amp={0} style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: C.teal }}>{scene.next ?? "نتلاقاو فحلقة جاية"}</div>
      </Float>
    </SceneShell>
  );
};

// ================= renderer =================
export const SceneRenderer: React.FC<{ scene: Visual; cues?: number[] }> = ({ scene, cues = [] }) => {
  switch (scene.type) {
    case "hook": return <HookScene scene={scene} cues={cues} />;
    case "cta": return <CTAScene scene={scene} cues={cues} />;
    case "chapter": return <ChapterScene scene={scene} cues={cues} />;
    case "stat": return <StatScene scene={scene} cues={cues} />;
    case "map": return <MapScene scene={scene} cues={cues} />;
    case "compare": return <CompareScene scene={scene} cues={cues} />;
    case "chart": return <ChartScene scene={scene} cues={cues} />;
    case "jobs": return <JobsScene scene={scene} cues={cues} />;
    case "timeline": return <TimelineScene scene={scene} cues={cues} />;
    case "flow": return <FlowScene scene={scene} cues={cues} />;
    case "diagram": return <DiagramScene scene={scene} cues={cues} />;
    case "cases": return <CasesScene scene={scene} cues={cues} />;
    case "verdict": return <VerdictScene scene={scene} cues={cues} />;
    case "quote": return <QuoteScene scene={scene} cues={cues} />;
    case "outro": return <OutroScene scene={scene} cues={cues} />;
    default: return <ContextScene scene={scene} cues={cues} />;
  }
};
