"use client";

import { useCompare } from "../CompareProvider";

/** Receipt's "Pick for compare" line-button with a real checkbox. */
export function ComparePick({ offerId, name }: { offerId: string; name: string }) {
  const { has, toggle, ready } = useCompare();
  const selected = has(offerId);
  return (
    <label className="btn btn--line btn--lg compare-pick">
      <input
        type="checkbox"
        className="check"
        checked={selected}
        disabled={!ready}
        onChange={(event) => toggle(offerId, event.currentTarget)}
        aria-label={`${selected ? "Remove" : "Pick"} ${name} for compare`}
      />
      {selected ? "Picked for compare" : "Pick for compare"}
    </label>
  );
}
