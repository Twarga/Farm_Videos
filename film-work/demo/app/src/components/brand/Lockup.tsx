import { LOCKUP_ID } from "./ids";

export function Lockup({ className = "", title = "bestvpsforme" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 945.80 154.00" role="img" aria-label={title} className={className}>
      <use href={`#${LOCKUP_ID}`} />
    </svg>
  );
}
