import { flagSrc } from "@/lib/assets";

export function Flag({ code, size = 12 }: { code: string; size?: number }) {
  const w = Math.round(size * (4 / 3));
  const source = flagSrc(code);
  return (
    <span className="flag" title={code}>
      {source ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={source} alt="" width={w} height={size} loading="lazy" decoding="async" className="flag-image" />
      ) : code.trim() && code.trim() !== "—" ? (
        <span aria-hidden="true" className="flag-fallback num" style={{ minWidth: w, height: size }}>{code.trim().slice(0, 2).toUpperCase()}</span>
      ) : null}
      <span className="num flag-code">{code}</span>
    </span>
  );
}

export function FlagOnly({ code, size = 12 }: { code: string; size?: number }) {
  const w = Math.round(size * (4 / 3));
  const source = flagSrc(code);
  if (!source) {
    return code.trim() && code.trim() !== "—" ? <span aria-label={code} title={code} className="flag-fallback num" style={{ minWidth: w, height: size }}>{code.trim().slice(0, 2).toUpperCase()}</span> : null;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      alt={code}
      title={code}
      width={w}
      height={size}
      loading="lazy"
      decoding="async"
      className="flag-image"
    />
  );
}
