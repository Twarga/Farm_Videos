import Link from "next/link";
import type { CSSProperties } from "react";
import art from "@/shore/shell-art.json";

export default function NotFound() {
  return (
    <main id="main">
      <div className="page wrap">
        <div className="state state--404">
          {/* Shore fishArt — keeper fishing, static trusted SVG */}
          <div className="state__art fish night" aria-hidden="true">
            <svg className="fish__rod" viewBox="0 0 240 180" focusable="false">
              <path className="fish__pole" d="M96 128 L188 34" />
              <path className="fish__line" d="M188 34 Q206 78 204 118" />
              <g className="fish__bob">
                <path className="fish__ring" d="M190 124q14 -6 28 0" />
                <circle cx="204" cy="118" r="5.5" />
                <path d="M198.5 118h11" />
              </g>
            </svg>
            <svg className="pet s-patchwork k-twargaops" viewBox="34 40 90 84" data-state="idle" style={{ "--accent": "var(--amber)" } as CSSProperties} focusable="false" dangerouslySetInnerHTML={{ __html: art.bear }} />
            <span className="fish__sign">No servers here</span>
          </div>
          <div>
            <h1 className="ptitle">Nothing biting here.</h1>
            <p>
              Error 404. The Keeper cast a line, but this page doesn&apos;t exist,
              or the plan left the catalog.
            </p>
            <div className="row">
              <Link className="btn btn--primary" href="/catalog">Browse VPS plans</Link>
              <Link className="btn" href="/">Home</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
