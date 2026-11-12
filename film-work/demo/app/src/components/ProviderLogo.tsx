"use client";

import { useState } from "react";
import { logoPathFor } from "@/lib/assets";
import type { Provider } from "@/lib/types";

export function ProviderLogo({
  provider,
  size = 28,
  eager = false,
  bare = false,
}: {
  provider: Provider;
  size?: number;
  eager?: boolean;
  /** Skip inline frame styles — CSS owns the box in dense repeated rows. */
  bare?: boolean;
}) {
  // CSV imports can contain an empty string for logoPath. Treat it as missing
  // so the reviewed self-hosted mark is still used.
  const source = logoPathFor(provider.id, provider.logoPath);
  const [brokenSource, setBrokenSource] = useState<string | null>(null);
  const broken = source === null || source === brokenSource;
  const inset = Math.max(2, Math.round(size * 0.1));
  const radius = size >= 48 ? 7 : 4;
  const frameStyle = bare ? undefined : { width: size, height: size, borderRadius: radius };

  if (broken) {
    return (
      <span
        aria-hidden="true"
        data-provider-logo={provider.id}
        data-logo-kind="fallback"
        className="provider-logo provider-logo--fallback"
        style={bare ? undefined : { ...frameStyle, fontSize: Math.round(size * 0.42) }}
      >
        {provider.letter}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      data-provider-logo={provider.id}
      data-logo-kind="asset"
      className="provider-logo provider-logo--asset"
      style={bare ? undefined : { ...frameStyle, padding: inset }}
    >
      {/* Native img keeps tiny local brand assets direct while preserving intrinsic space and lazy loading. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={source}
        alt=""
        width={size}
        height={size}
        loading={eager ? "eager" : "lazy"}
        {...(eager ? { fetchPriority: "high" } : {})}
        decoding="async"
        className="provider-logo__image"
        onError={() => setBrokenSource(source)}
      />
    </span>
  );
}
