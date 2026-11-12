import { ShoreIcon } from "./ShoreIcon";

const PER = [24, 48, 96] as const;

function pageNums(cur: number, n: number): (number | "…")[] {
  const keep = new Set([1, n, cur - 1, cur, cur + 1].filter(x => x >= 1 && x <= n));
  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((x, i) => { if (i && x - sorted[i - 1] > 1) out.push("…"); out.push(x); });
  return out;
}

export function Pager({
  offset, shown, total, page, pages, per,
  onPage, onPer,
}: {
  offset: number; shown: number; total: number; page: number; pages: number; per: number;
  onPage: (p: number) => void; onPer: (n: number) => void;
}) {
  return (
    <nav className="pager" aria-label="Pages">
      <div className="pager__per">
        <span id="perL">Per page</span>
        <div className="seg seg--sm" role="group" aria-labelledby="perL">
          {PER.map(n => (
            <button key={n} type="button" data-per={n} aria-pressed={per === n} onClick={() => onPer(n)}>{n}</button>
          ))}
        </div>
      </div>
      <span className="pager__range num">{offset + 1}–{offset + shown} of {total}</span>
      {pages > 1 ? (
        <div className="pager__btns">
          <button className="pgb" type="button" onClick={() => onPage(page - 1)} disabled={page === 1}>
            <span className="sr-only">Previous page</span>
            <ShoreIcon name="arrow" cls="ico--back" />
          </button>
          {pageNums(page, pages).map((x, i) =>
            x === "…"
              ? <span key={`gap-${i}`} className="pg-gap" aria-hidden="true">…</span>
              : <button key={x} className="pgb num" type="button" onClick={() => onPage(x)} aria-current={x === page ? "page" : undefined}>
                  <span className="sr-only">Page </span>{x}
                </button>
          )}
          <button className="pgb" type="button" onClick={() => onPage(page + 1)} disabled={page === pages}>
            <span className="sr-only">Next page</span>
            <ShoreIcon name="arrow" />
          </button>
        </div>
      ) : null}
    </nav>
  );
}
