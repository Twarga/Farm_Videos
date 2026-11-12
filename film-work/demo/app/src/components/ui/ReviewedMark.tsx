import { Check } from "@phosphor-icons/react/dist/ssr";

/**
 * Volt check shown beside a price whose 3-year terms were reviewed.
 * Unreviewed prices show nothing — the page legend explains the marks.
 */
export function ReviewedMark() {
  return (
    <span className="rmark" role="img" aria-label="Reviewed 3-year price" title="Reviewed 3-year price">
      <Check aria-hidden size={11} weight="bold" />
    </span>
  );
}
