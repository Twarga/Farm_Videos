import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneRenderer, parseVisual } from "./scenes";
import type { Visual } from "./scenes";
import { C, FONT, WipeIn } from "./theme";
import beatsJson from "./data/beats.json";
import visualsJson from "./data/visuals2.json";

const FPS = 30;

type Beat = {
  i: number; scene: number; type: string;
  start: number; end: number; dur: number;
  text: string; last: boolean;
};

const beats = beatsJson as Beat[];

type Group = {
  index: number;
  type: string;
  start: number;      // seconds
  end: number;
  beats: Beat[];      // sentence beats inside this group
};

const rec = (v: unknown) => (v !== null && typeof v === "object" ? (v as Record<string, unknown>) : {});
const rawVisualType = (v: unknown): string => {
  const t = rec(v).type;
  return typeof t === "string" ? t : "context";
};

const buildGroups = (): Group[] => {
  const byScene = new Map<number, Beat[]>();
  for (const b of beats) {
    if (!byScene.has(b.scene)) byScene.set(b.scene, []);
    byScene.get(b.scene)!.push(b);
  }
  const visuals = visualsJson as unknown[];
  const rawGroups: { index: number; type: string; beats: Beat[] }[] = [];
  for (let gi = 0; gi < visuals.length; gi++) {
    rawGroups.push({ index: gi, type: rawVisualType(visuals[gi]), beats: byScene.get(gi) ?? [] });
  }
  // timing: a group starts at its first beat start minus a small lead,
  // or, when it has no beats (chapter card), at the tail of the previous group.
  const groups: Group[] = [];
  let prevEnd = 0.4;
  for (const g of rawGroups) {
    let start: number;
    let end: number;
    if (g.beats.length) {
      start = Math.max(prevEnd, g.beats[0].start - 0.55);
      end = g.beats[g.beats.length - 1].end;
    } else {
      start = prevEnd;
      end = prevEnd + 1.9; // chapter card hold
    }
    groups.push({ ...g, start, end });
    prevEnd = end;
  }
  // second pass: trim each group to the next group's start
  for (let i = 0; i < groups.length - 1; i++) {
    if (groups[i + 1].start < groups[i].end) groups[i].end = groups[i + 1].start;
  }
  return groups;
};

const groups = buildGroups();
const visuals = (visualsJson as unknown[]).map(parseVisual);

const totalSeconds = beats.length ? beats[beats.length - 1].end + 0.9 : 600;
export const TOTAL_FRAMES = Math.max(1, Math.ceil(totalSeconds * FPS));

// ---------- subtitles ----------
const NUM_RE = /(\d[\d.,٪%]*\d*|\d+[٪%]|[٠-٩]+|درهم|مليار|مليون|ملايين|فالمية|ألف|ألفين|سائح|مغربي)/g;

const highlight = (text: string) => {
  const parts = text.split(NUM_RE);
  return parts.map((p, i) =>
    NUM_RE.test(p) ? (
      <span key={i} style={{ background: C.yellow, color: C.ink, borderRadius: 8, padding: "0 8px" }}>{p}</span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
};

const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const beat = beats.find((b) => t >= b.start - 0.1 && t < b.end + 0.05);
  if (!beat) return null;
  const local = frame - Math.round((beat.start - 0.1) * FPS);
  const fadeIn = Math.min(1, local / 5);
  return (
    <div style={{ position: "absolute", bottom: 118, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 80, pointerEvents: "none" }}>
      <div
        style={{
          direction: "rtl",
          maxWidth: 1500,
          background: "rgba(9,53,50,0.88)",
          color: C.white,
          borderRadius: 18,
          padding: "12px 30px",
          fontSize: 40,
          fontWeight: 800,
          lineHeight: 1.45,
          textAlign: "center",
          fontFamily: FONT,
          opacity: fadeIn,
          transform: `translateY(${(1 - fadeIn) * 12}px)`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        {highlight(beat.text)}
      </div>
    </div>
  );
};

// ---------- per-group sequence ----------
const GroupSeq: React.FC<{ g: Group; scene: Visual }> = ({ g, scene }) => {
  const cues = g.beats.map((b) => Math.round((b.start - g.start) * FPS));
  return (
    <>
      <SceneRenderer scene={scene} cues={cues} />
      <WipeIn durF={10} />
    </>
  );
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      {groups.map((g, gi) => (
        <Sequence
          key={gi}
          from={Math.round(g.start * FPS)}
          durationInFrames={Math.max(1, Math.round((g.end - g.start) * FPS))}
        >
          <GroupSeq g={g} scene={visuals[gi]} />
        </Sequence>
      ))}
      <Subtitles />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          height: 7,
          width: `${Math.min(100, (frame / durationInFrames) * 100)}%`,
          background: C.yellow,
          zIndex: 999,
        }}
      />
    </AbsoluteFill>
  );
};

export const HookStill: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <SceneRenderer scene={visuals[0]} cues={[0, 20, 60, 100]} />
  </AbsoluteFill>
);
