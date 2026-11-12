"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics-client";

type TargetType = "catalog" | "provider" | "offer" | "guide" | "methodology";

type Props = LinkProps & {
  children: ReactNode;
  guideSlug: string;
  placement: string;
  targetType: TargetType;
  className?: string;
};

export function GuideTrackedLink({ children, guideSlug, placement, targetType, href, ...props }: Props) {
  const targetPath = typeof href === "string" ? href : href.pathname ?? "";
  return <Link href={href} {...props} onClick={() => trackEvent({ name: "guide_internal_click", placement, data: { guideSlug, targetType, targetPath } })}>{children}</Link>;
}
