import type { CSSProperties } from "react";
import type { Provider } from "@/lib/types";
import { ProviderLogo } from "./ProviderLogo";

/**
 * Normalized provider mark per the .pmark spec: a bordered square tile that
 * holds any provider's mark at a consistent visual weight. Server component —
 * the inner logo keeps its lazy loading and fallback behavior.
 */
export function ProviderMark({
  provider,
  size = 40,
  className = "",
  eager = false,
}: {
  provider: Provider;
  /** Tile edge in px; radius scales at 24% of the size. */
  size?: 28 | 36 | 40 | 64 | 88 | (number & {});
  className?: string;
  /** Above-fold marks opt in to eager loading and high fetch priority. */
  eager?: boolean;
}) {
  return (
    <span
      className={`pmark ${className}`}
      style={{ "--size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      <ProviderLogo provider={provider} size={size} bare eager={eager} />
    </span>
  );
}
