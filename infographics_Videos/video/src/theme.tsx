import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Cairo";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["arabic", "latin"],
});

export const FONT = fontFamily;

export const C = {
  bg: "#D7E6E6",
  bg2: "#BCD1D1",
  bgLight: "#EAF4F2",
  ink: "#093532",
  ink2: "#0E423B",
  teal: "#0D7673",
  tealDark: "#075452",
  yellow: "#FDCA3B",
  yellowDark: "#E0A800",
  green: "#1C9639",
  red: "#B71F22",
  white: "#FFFFFF",
  muted: "#5D7A77",
  line: "rgba(9,53,50,0.12)",
};

export const useReveal = (delay = 0, duration = 18) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
};

export const useSpring = (delay = 0, config = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.7, stiffness: 120, ...config },
  });
};

export const fmt = (value: number, decimals = 0) => {
  const s = value.toFixed(decimals);
  return decimals > 0 ? s : s.replace(/\.0$/, "");
};

export const CountUp: React.FC<{
  value: number;
  decimals?: number;
  delay?: number;
  duration?: number;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ value, decimals = 0, delay = 0, duration = 35, suffix = "", style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + duration], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <span style={style}>{fmt(v, decimals)}{suffix}</span>;
};

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  tone?: "white" | "yellow" | "teal" | "green" | "red";
}> = ({ children, style, tone = "white" }) => {
  const bg =
    tone === "yellow" ? C.yellow : tone === "teal" ? C.teal : tone === "green" ? C.green : tone === "red" ? C.red : C.white;
  return (
    <div
      style={{
        background: bg,
        borderRadius: 26,
        border: tone === "white" ? `2px solid ${C.line}` : "none",
        boxShadow: "0 18px 40px rgba(9,53,50,0.10)",
        color: tone === "white" || tone === "yellow" ? C.ink : C.white,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: C.yellow,
      color: C.ink,
      fontWeight: 900,
      padding: "10px 22px",
      borderRadius: 999,
      fontSize: 30,
      ...style,
    }}
  >
    {children}
  </span>
);

export const SceneShell: React.FC<{
  children: React.ReactNode;
  section?: string;
  source?: string;
  dark?: boolean;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ children, section, source, dark = false, accent = C.yellow, style }) => {
  const drift = Math.sin((useCurrentFrame() / 240) * Math.PI * 2);
  return (
    <AbsoluteFill
      style={{
        background: dark
          ? `linear-gradient(135deg, ${C.tealDark} 0%, ${C.ink} 100%)`
          : `radial-gradient(circle at 15% 10%, ${C.bgLight} 0%, ${C.bg} 55%, ${C.bg2} 100%)`,
        fontFamily: FONT,
        color: dark ? C.white : C.ink,
        direction: "rtl",
        overflow: "hidden",
        ...style,
      }}
    >
      {!dark && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(9,53,50,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(9,53,50,0.045) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              opacity: 0.9,
              transform: `translate(${drift * 14}px, ${drift * 10}px)`,
            }}
          />
          <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", border: `2px solid ${accent}`, opacity: 0.18, top: -180, left: -140, transform: `translate(${drift * 20}px, ${-drift * 14}px) scale(${1 + drift * 0.04})` }} />
          <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", border: `2px solid ${C.teal}`, opacity: 0.12, bottom: -120, right: -80, transform: `translate(${-drift * 16}px, ${drift * 18}px)` }} />
        </>
      )}
      {dark && (
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}26 0%, transparent 65%)`,
            top: -300,
            left: -200,
            transform: `translate(${drift * 30}px, ${-drift * 22}px)`,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 52,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 26,
          fontWeight: 700,
          opacity: 0.85,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: accent, display: "inline-block" }} />
        {section ?? "إنفوجرافيك عربي"}
      </div>
      <div
        style={{
          position: "absolute",
          top: 34,
          left: 52,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 24,
          fontWeight: 700,
          opacity: 0.7,
        }}
      >
        <span style={{ width: 34, height: 34, borderRadius: 9, background: accent, display: "inline-flex", alignItems: "center", justifyContent: "center", color: C.ink, fontSize: 20, fontWeight: 900 }}>▶</span>
        إنفوجرافيك عربي
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.03 * (0.5 + 0.5 * drift)})`, transformOrigin: "50% 50%" }}>
        {children}
      </div>
      {source && (
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 52,
            fontSize: 20,
            opacity: 0.55,
            maxWidth: 900,
          }}
        >
          {source}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---- continuous motion + beat helpers (remake) ----

/** Local frame of the enclosing Sequence. */
export const useLocalFrame = () => useCurrentFrame();

/** 0→1 reveal at a frame offset (in frames, not seconds). */
export const useRevealF = (delayF = 0, durationF = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delayF, delayF + durationF], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
};

/** 1→0 fade-out near the end of the sequence. */
export const useExitF = (tailF = 10) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - tailF, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Endless gentle bobbing: returns a phase 0..1 cycling every `periodF` frames. */
export const useLoop = (periodF = 90, offset = 0) => {
  const frame = useCurrentFrame();
  return ((frame + offset) % periodF) / periodF;
};

/** Slow zoom 1 -> 1+zoom over the whole sequence (Ken Burns). */
export const useKenBurns = (zoom = 0.1, panX = 0) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { scale: 1 + zoom * p, x: panX * p };
};

/** Cue lookup: frame offset of beat n inside this scene (clamped). */
export const cueOf = (cues: number[], n: number, fallback = 0) =>
  cues.length ? cues[Math.min(n, cues.length - 1)] : fallback;

/** Wipe bar that sweeps across during the first `durF` frames of a scene. */
export const WipeIn: React.FC<{ durF?: number }> = ({ durF = 10 }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const p = interpolate(frame, [0, durF], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  if (frame > durF + 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: `${(1 - p) * 100}%`,
        width: 160,
        background: `linear-gradient(to left, ${C.yellow}, rgba(253,202,59,0))`,
        zIndex: 60,
        pointerEvents: "none",
      }}
    />
  );
};

/** Wrap an element: reveal + light float. */
export const Float: React.FC<{
  delayF?: number;
  amp?: number;
  periodF?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delayF = 0, amp = 9, periodF = 100, children, style }) => {
  const r = useRevealF(delayF, 14);
  const loop = useLoop(periodF, delayF * 3);
  const bob = Math.sin(loop * Math.PI * 2) * amp * r;
  return (
    <div
      style={{
        opacity: r,
        transform: `translateY(${(1 - r) * 34 + bob}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
