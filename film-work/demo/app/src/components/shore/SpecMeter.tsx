const METER: Record<string, number[]> = {
  vcpu: [1, 2, 4, 8, 16],
  ram:  [1, 2, 4, 8, 16],
  disk: [25, 50, 100, 200, 400],
  bw:   [1, 2, 4, 8, 16],
};

function lvl(k: string, v: number | null): number {
  if (v == null) return 0;
  return Math.max(1, (METER[k] ?? []).filter(t => v >= t).length);
}

export function SpecMeter({ k, v }: { k: string; v: number | null }) {
  const level = lvl(k, v);
  return (
    <span className="mtr" aria-hidden="true">
      {[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= level ? "on" : undefined} />)}
    </span>
  );
}

export function specVal(k: string, pair: [string, string] | null, raw: number | null): React.ReactNode {
  if (!pair) return <span className="unk">Not published</span>;
  return (
    <>
      <span className="spec__v"><b>{pair[0]}</b><small>{pair[1]}</small></span>
      <SpecMeter k={k} v={raw} />
    </>
  );
}
