import type { ReactNode } from "react";

/** Standard page header: small eyebrow line, display title, one-sentence lede. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="content-head">
      {eyebrow ? <p className="eyebrow m-0">{eyebrow}</p> : null}
      <h1 className="d-xl mt-4">{title}</h1>
      {lede ? <p className="muted mt-5 measure">{lede}</p> : null}
      {actions ? <div className="row mt-6">{actions}</div> : null}
    </header>
  );
}
