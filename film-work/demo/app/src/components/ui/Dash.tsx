/** Em-dash for unpublished values. Screen readers get the full label once. */
export function Dash({ label = "Not published" }: { label?: string }) {
  return (
    <span className="dash" role="img" aria-label={label} title={label}>
      &mdash;
    </span>
  );
}
