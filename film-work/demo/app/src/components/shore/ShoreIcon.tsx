export function ShoreIcon({ name, cls = "" }: { name: string; cls?: string }) {
  return (
    <svg className={`ico${cls ? " " + cls : ""}`} aria-hidden="true" focusable="false">
      <use href={`#i-${name}`} />
    </svg>
  );
}
