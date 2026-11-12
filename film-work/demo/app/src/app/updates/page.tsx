import Link from "next/link";
import type { Metadata } from "next";
import { getActiveSnapshotDate, listPublicationHistory } from "@/lib/public-catalog";
import { shoreFmtDate } from "@/components/shore/format";
import { ShoreIcon } from "@/components/shore/ShoreIcon";

export const metadata: Metadata = {
  title: "Catalog updates",
  description: "Every published snapshot of the bestvpsforme catalog — what changed and when.",
  alternates: { canonical: "https://bestvpsforme.com/updates" },
};

export const dynamic = "force-dynamic";

export default function UpdatesPage() {
  const active = getActiveSnapshotDate();
  const history = listPublicationHistory();
  const activeDate = active ? shoreFmtDate(active.toISOString().slice(0, 10)) : null;

  return (
    <main id="main">
      <div className="page wrap">
        <header className="doc__head">
          <p className="kicker">Updates</p>
          <h1 className="ptitle">What changed, and when.</h1>
          {activeDate ? (
            <p className="lead">
              Active snapshot{" "}
              <time dateTime={active!.toISOString().slice(0, 10)}>{activeDate}</time>.
              Each snapshot is a full re-read of the catalog.
            </p>
          ) : (
            <p className="lead">No active publication. A reviewed catalog publication will appear here.</p>
          )}
        </header>

        <ol className="tl">
          {history.length ? (
            history.map((snap) => (
              <li key={snap.version}>
                <time dateTime={snap.publishedAt.toISOString().slice(0, 10)}>
                  {shoreFmtDate(snap.publishedAt.toISOString().slice(0, 10))}
                </time>
                <h2>
                  {snap.status === "published"
                    ? "Active catalog snapshot"
                    : snap.status === "rolled-back"
                    ? "Rolled back"
                    : "Replaced snapshot"}
                </h2>
                <p>
                  {snap.offerCount} plan{snap.offerCount === 1 ? "" : "s"}
                  {snap.added != null ? ` · +${snap.added} added` : ""}
                  {snap.removed != null ? ` · \u2212${snap.removed} removed` : ""}
                  {snap.changed != null ? ` · ${snap.changed} changed` : ""}
                </p>
                {snap.status === "published" ? (
                  <p className="row">
                    <Link className="pill" href="/catalog">
                      Open the catalog<ShoreIcon name="arrow" cls="ico--arrow" />
                    </Link>
                  </p>
                ) : null}
              </li>
            ))
          ) : (
            <li>
              <h2>No published snapshots yet</h2>
              <p>A reviewed catalog publication will appear here.</p>
            </li>
          )}
        </ol>

        <p className="utl__foot">
          Ranking rules are in the <Link href="/methodology">methodology</Link>.
          Spot an error? <Link href="/corrections">Send a correction</Link>.
        </p>
      </div>
    </main>
  );
}
