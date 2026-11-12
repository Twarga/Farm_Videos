import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./theme";

export const Thumbnail: React.FC<{ variant?: number }> = ({ variant = 1 }) => {
  const dark = variant === 2;
  const paper = variant === 3;
  const bg = dark
    ? `linear-gradient(135deg, ${C.tealDark} 0%, ${C.ink} 100%)`
    : paper
      ? "#EAE4D5"
      : `radial-gradient(circle at 15% 10%, ${C.bgLight} 0%, ${C.bg} 55%, ${C.bg2} 100%)`;
  const ink = dark ? C.white : C.ink;
  const card1 = dark ? C.teal : C.teal;
  const card2 = paper ? C.yellow : C.yellow;
  const accent = paper ? C.teal : C.yellow;

  return (
    <AbsoluteFill style={{ background: bg, fontFamily: FONT, direction: "rtl", overflow: "hidden" }}>
      {!dark && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(9,53,50,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(9,53,50,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      )}
      <div style={{ position: "absolute", top: 26, right: 40, display: "flex", alignItems: "center", gap: 10, color: ink, fontSize: 22, fontWeight: 800, opacity: 0.85 }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: accent }} />
        2025 · الاقتصاد المغربي
      </div>
      <div style={{ position: "absolute", top: 22, left: 36, display: "flex", alignItems: "center", gap: 8, color: ink, fontSize: 20, fontWeight: 800, opacity: 0.75 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: accent, color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>▶</span>
        إنفوجرافيك عربي
      </div>

      <div style={{ position: "absolute", top: 78, left: 40, right: 40, textAlign: "center", color: ink, fontSize: 66, fontWeight: 900, lineHeight: 1.15 }}>
        شكون كيعاون الاقتصاد؟
      </div>
      <div style={{ position: "absolute", top: 154, left: 40, right: 40, textAlign: "center", color: dark ? C.yellow : C.teal, fontSize: 40, fontWeight: 900 }}>
        المغاربة فالخارج ولا السياح؟
      </div>

      <div style={{ position: "absolute", top: 240, left: 44, right: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <div style={{ flex: 1, background: card1, borderRadius: 26, padding: "26px 24px", color: C.white, textAlign: "center", boxShadow: "0 16px 40px rgba(9,53,50,0.18)" }}>
          <div style={{ fontSize: 26, fontWeight: 800, opacity: 0.95 }}>تحويلات المغاربة برا</div>
          <div style={{ fontSize: 96, fontWeight: 900, color: C.yellow, lineHeight: 1.05 }}>122</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>مليار درهم</div>
        </div>
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: accent, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 900, flexShrink: 0 }}>
          ولا
        </div>
        <div style={{ flex: 1, background: card2, borderRadius: 26, padding: "26px 24px", color: C.ink, textAlign: "center", boxShadow: "0 16px 40px rgba(9,53,50,0.18)" }}>
          <div style={{ fontSize: 26, fontWeight: 800, opacity: 0.85 }}>مداخيل السياحة</div>
          <div style={{ fontSize: 96, fontWeight: 900, color: C.ink, lineHeight: 1.05 }}>138.6</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>مليار درهم</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ background: accent, color: C.ink, borderRadius: 999, padding: "14px 32px", fontSize: 28, fontWeight: 900 }}>
          الحساب الحقيقي بالخشيبات
        </div>
      </div>
    </AbsoluteFill>
  );
};
