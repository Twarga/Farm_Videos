import type { ReactNode } from "react";

export type DocSection = {
  id: string;
  heading: string;
  content: ReactNode;
};

/**
 * Shore docShell layout — matches mockup docShell() exactly.
 * Classes: page wrap doc / doc__head / doc__body / toc / prose
 */
export function DocLayout({
  kicker,
  title,
  lead,
  note,
  sections,
  crumbs,
  after,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  note?: ReactNode;
  sections: DocSection[];
  crumbs?: ReactNode;
  after?: ReactNode;
}) {
  return (
    <div className="page wrap doc">
      {crumbs}
      <header className="doc__head">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1 className="ptitle">{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
        {note}
      </header>
      <div className="doc__body">
        <nav className="toc" aria-label="On this page">
          <p>On this page</p>
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#s-${s.id}`}>{s.heading}</a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="prose">
          {sections.map((s) => (
            <section key={s.id} id={`s-${s.id}`} aria-labelledby={`h-${s.id}`}>
              <h2 id={`h-${s.id}`} tabIndex={-1}>{s.heading}</h2>
              {s.content}
            </section>
          ))}
        </article>
      </div>
      {after}
    </div>
  );
}
