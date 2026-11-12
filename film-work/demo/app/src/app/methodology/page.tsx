import Link from "next/link";
import { CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr";
import { DocToc } from "@/components/shore/DocToc";
import type { Metadata } from "next";
import { getActiveSnapshotDate } from "@/lib/public-catalog";
import { snapshotLabel } from "@/lib/format";
import { VALUE_WEIGHTS } from "@/lib/score";

export const metadata: Metadata = {
  title: "How we compare",
  description: "The exact 3-year real-price formula, the published ranking weights, and the rules we never break.",
  alternates: { canonical: "https://bestvpsforme.com/methodology" },
};

export const dynamic = "force-dynamic";

const METHOD_VERSION = "v1.0";
const HORIZON = 36;

const SECTIONS = [
  { id: "real-price", heading: "The 3-year real price" },
  { id: "ranking",    heading: "How \u201crecommended\u201d ranks" },
  { id: "independence", heading: "Organic order" },
  { id: "never",      heading: "What we never do" },
];

const RULES = [
  ["Unknown stays unknown", "Facts we can't verify show as \u201cNot published\u201d, never as a guess or a zero."],
  ["Dated evidence", "Every fact carries the day we checked it."],
  ["Labeled links", "Affiliate links are marked wherever they appear."],
  ["Independence", "Providers can't pay for placement or a softer review."],
] as const;

const NEVER = [
  "Hide renewal price increases",
  "Sell placement or ranking",
  "Fill missing facts with guesses",
  "Claim prices are live",
  "Hide affiliate links",
];

export default function MethodologyPage() {
  const snapshotDate = snapshotLabel(getActiveSnapshotDate());
  const maxWeight = Math.max(...VALUE_WEIGHTS.map((w) => w.weight));

  return (
    <main id="main">
      <div className="page wrap doc">
        <div className="doc__body">
          <DocToc sections={SECTIONS} />

          <div>
            <header className="doc__head">
              <p className="kicker">Methodology {METHOD_VERSION} · {snapshotDate}</p>
              <h1 className="ptitle">How we compare</h1>
              <p className="lead">
                Every price is a dated snapshot, every ranking weight is printed here, and every
                link is labeled. If a fact isn&apos;t published, we say so.
              </p>
            </header>

            <ul className="mrules">
              {RULES.map(([title, text]) => (
                <li key={title}>
                  <CheckCircle aria-hidden weight="fill" />
                  <div><h2>{title}</h2><p>{text}</p></div>
                </li>
              ))}
            </ul>

            <div className="gprose mprose">
              <section id="s-real-price" aria-labelledby="h-real-price">
                <h2 id="h-real-price" tabIndex={-1}>The 3-year real price</h2>
                <p>
                  Advertised prices are marketing. We compute what a plan{" "}
                  <strong>actually costs over {HORIZON} months</strong>, including the parts
                  providers put in small print.
                </p>
                <div className="formula">
                  <span className="v">real_price</span> = ( setup_fee + intro_months &times; intro_price<br />
                  &nbsp;&nbsp;+ remaining_months &times; renewal_price ) &divide;{" "}
                  <span className="v">{HORIZON}</span>
                  <small>
                    EUR and GBP amounts use the ECB reference rate on the price check date. VAT
                    is shown exactly as the provider lists it; checkout totals may differ by
                    country.
                  </small>
                </div>
                <dl className="mterms">
                  <div><dt>Intro terms</dt><dd>Billed at the intro price for the intro months, counted once.</dd></div>
                  <div><dt>Renewals</dt><dd>The published renewal price. If none is published, the projection shows &ldquo;Not published&rdquo; instead of assuming it stays flat.</dd></div>
                  <div><dt>Extras</dt><dd>Paid IPv4 or mandatory backups are listed separately when known.</dd></div>
                  <div><dt>Commitments</dt><dd>Prepayments are a separate fact. &ldquo;Due today&rdquo; appears only with reviewed payment evidence; the chart spreads cost across {HORIZON} months and it does not invent payment dates.</dd></div>
                </dl>
              </section>

              <section id="s-ranking" aria-labelledby="h-ranking">
                <h2 id="h-ranking" tabIndex={-1}>How &ldquo;recommended&rdquo; ranks</h2>
                <p>
                  A weighted score, normalized within each snapshot. These are the exact weights
                  in <code>src/lib/score.ts</code>.
                </p>
                <div className="score">
                  {VALUE_WEIGHTS.map((w) => (
                    <div key={w.key}>
                      <span>{w.label}</span>
                      <span className="w">{w.weight}<small className="w__denom"> / 100</small></span>
                      <span className="bar" aria-hidden="true">
                        <i style={{ width: `${(w.weight / maxWeight) * 100}%` }} />
                      </span>
                    </div>
                  ))}
                </div>
                <p>
                  Unknowns score zero for their part. An unverified price earns no price points,
                  so an unverified bargain can&apos;t outrank a reviewed one. A $0 plan sorts
                  last on RAM per dollar.
                </p>
              </section>

              <section id="s-independence" aria-labelledby="h-independence">
                <h2 id="h-independence" tabIndex={-1}>Organic order</h2>
                <p>
                  Affiliate status never changes the order. Commission links get no boost, no
                  penalty and no featured slot, and the score has no manual override. Every other
                  sort (price, RAM, due today) is a plain comparison with no weights.
                </p>
              </section>

              <section id="s-never" aria-labelledby="h-never">
                <h2 id="h-never" tabIndex={-1}>What we never do</h2>
                <ul className="mnever">
                  {NEVER.map((item) => (
                    <li key={item}><XCircle aria-hidden weight="fill" />{item}</li>
                  ))}
                </ul>
                <p>
                  Found a mistake?{" "}
                  <Link href="/corrections">Send a sourced correction</Link>. Material fixes get
                  a new date, and <Link href="/updates">catalog updates</Link> list what changed
                  between snapshots.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
