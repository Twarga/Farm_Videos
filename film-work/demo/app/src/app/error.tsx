"use client";

import Link from "next/link";
import { ArrowRight, ArrowClockwise } from "@phosphor-icons/react";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main id="main" className="container--wide">
      <title>Page unavailable · bestvpsforme</title>
      <div className="syserr" role="alert">
        <div className="rack" aria-hidden><i /><i /><i className="miss" /><i /><i /><i /></div>
        <p className="eyebrow">Error</p>
        <h1>Something went wrong</h1>
        <p>We couldn&apos;t load this page. Try again or open the catalog. No demo data was substituted.</p>
        {error.digest ? <code>Reference {error.digest}</code> : null}
        <div className="syserr__links">
          <button type="button" className="btn btn--ink" onClick={() => retry()}><ArrowClockwise aria-hidden /> Try again</button>
          <Link href="/catalog" className="btn btn--line">Open catalog <ArrowRight aria-hidden /></Link>
        </div>
      </div>
    </main>
  );
}
