import type { CSSProperties, ReactNode } from "react";

/** Compact legend: marker chips + labels. Marker style is set per item. */
export function Legend({
  items,
}: {
  items: { label: ReactNode; swatch?: CSSProperties; dashed?: boolean }[];
}) {
  return (
    <div className="legend">
      {items.map((item, i) => (
        <span key={i}>
          <i style={item.swatch} className={item.dashed ? "legend__dash" : undefined} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
