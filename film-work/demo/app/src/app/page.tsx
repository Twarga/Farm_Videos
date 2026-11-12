import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getPublicShoreSource } from "@/lib/public-catalog";
import { getPublishedHomeData } from "@/lib/public-home";
import { filterOffers, emptyQuery, sortOffers } from "@/lib/catalog";
import { ShoreHero } from "@/components/shore/ShoreHero";
import { ShoreIcon } from "@/components/shore/ShoreIcon";
import { ShellSvg } from "@/components/shore/ShellSvg";
import { HomeMotion } from "@/components/shore/HomeMotion";
import { ProviderMark } from "@/components/shore/ProviderMark";
import { shoreMoney, shorePrice, shoreLocTxt, shoreSpecLine, shoreFmtDate } from "@/components/shore/format";
import art from "@/shore/shell-art.json";

// The contact crab's phone, ring and speech bubble, copied from the mockup's callCrab().
const CALL_ART = "<g class=\"call\"><g class=\"call-ring\"><path d=\"M34.2 76.4a6 6 0 0 1 1.6-6.2\"/><path d=\"M30.8 78a10 10 0 0 1 2.8-10.8\"/></g><path class=\"pw-shadow\" d=\"M53 104C49 102.4 46.4 98.4 45.4 93.2L49.4 92.4C50.2 96 52 98.8 55.2 100.2Z\"/><path class=\"pw-fab f-crab\" d=\"M53 104C49 102.4 46.4 98.4 45.4 93.2L49.4 92.4C50.2 96 52 98.8 55.2 100.2Z\"/><path class=\"pw-seam\" d=\"M53 104C49 102.4 46.4 98.4 45.4 93.2L49.4 92.4C50.2 96 52 98.8 55.2 100.2Z\"/><g class=\"call-phone\"><g transform=\"rotate(16 41.5 79)\"><path class=\"pw-shadow\" d=\"M40 71h3a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-3a2.5 2.5 0 0 1-2.5-2.5v-11a2.5 2.5 0 0 1 2.5-2.5Z\"/><path class=\"pw-fab f-phone\" d=\"M40 71h3a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-3a2.5 2.5 0 0 1-2.5-2.5v-11a2.5 2.5 0 0 1 2.5-2.5Z\"/><path class=\"pw-seam\" d=\"M40 71h3a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-3a2.5 2.5 0 0 1-2.5-2.5v-11a2.5 2.5 0 0 1 2.5-2.5Z\"/><rect class=\"call-screen\" x=\"38.8\" y=\"73.4\" width=\"5.4\" height=\"8.6\" rx=\"1\"/></g></g><path class=\"pw-shadow\" d=\"M38.6 89a4.8 3.8 0 1 0 9.6 0a4.8 3.8 0 1 0-9.6 0Z\"/><path class=\"pw-fab f-crab\" d=\"M38.6 89a4.8 3.8 0 1 0 9.6 0a4.8 3.8 0 1 0-9.6 0Z\"/><path class=\"pw-seam\" d=\"M38.6 89a4.8 3.8 0 1 0 9.6 0a4.8 3.8 0 1 0-9.6 0Z\"/><g class=\"call-bubble\"><path class=\"pw-shadow\" d=\"M7 46h25a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-5l-3 5-4-5h-13a5 5 0 0 1-5-5v-6a5 5 0 0 1 5-5Z\"/><path class=\"pw-fab f-bubble\" d=\"M7 46h25a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-5l-3 5-4-5h-13a5 5 0 0 1-5-5v-6a5 5 0 0 1 5-5Z\"/><path class=\"pw-seam\" d=\"M7 46h25a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-5l-3 5-4-5h-13a5 5 0 0 1-5-5v-6a5 5 0 0 1 5-5Z\"/><circle class=\"call-talk\" cx=\"13.5\" cy=\"54\" r=\"1.6\"/><circle class=\"call-talk\" cx=\"19.5\" cy=\"54\" r=\"1.6\"/><circle class=\"call-talk\" cx=\"25.5\" cy=\"54\" r=\"1.6\"/></g></g>";

export const metadata: Metadata = {
  title: "The right server, at an honest price.",
  description: "Compare VPS plans on intro price, renewal, setup fee and contract. Reviewed three-year costs and missing evidence are clearly labeled.",
};

export const dynamic = "force-dynamic";

const RV = (
  <span className="rv" title="Reviewed 3-year price">
    <ShoreIcon name="check" /><span className="sr-only">Reviewed 3-year price</span>
  </span>
);

export default function HomePage() {
  const source = getPublicShoreSource();
  const meta = source.meta;
  const shoreOffers = source.offers;

  // Board: full-cohort ranked, one per provider, up to 5
  const picks: typeof shoreOffers = [];
  const seen = new Set<string>();
  for (const o of shoreOffers.filter(o => o.rank != null).sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))) {
    if (seen.has(o.pid) || o.usd == null) continue;
    seen.add(o.pid);
    picks.push(o);
    if (picks.length === 5) break;
  }

  // Count table: precomputed server-side from domainOffers — never sent to browser
  const stepNeeds = { ram: 4, price: 10, regions: ["europe"] };
  const stepFit = source.domainOffers.filter(o => {
    if (o.ramGb != null && o.ramGb < 4) return false;
    const usdPrice = o.effectiveMonthly * (o.exchangeRate ?? 1);
    if (usdPrice > 10) return false;
    const locs = o.locations ?? [];
    const EU = new Set(["AT","BE","BG","CH","CZ","DE","DK","EE","ES","FI","FR","GB","UK","GR","HR","HU","IE","IS","IT","LT","LU","LV","NL","NO","PL","PT","RO","RS","SE","SI","SK"]);
    return locs.some(l => { const m = /^[a-z]{2}\b/i.exec(String(l).trim()); return m ? EU.has(m[0].toUpperCase()) : false; });
  }).length;

  // How-it-works example offer: prefer one with reviewed terms + intro period
  const ex = shoreOffers.find(o => o.tr && o.introM) ?? shoreOffers[0];

  const homeData = getPublishedHomeData(source.domainOffers);

  return (
    <main id="main" tabIndex={-1}>
      <div className="page page--home">
      {/* ── Hero ── */}
      <ShoreHero
        meta={meta}
        shoreOffers={shoreOffers}
        stepFit={stepFit}
        stepNeeds={stepNeeds}
      />

      {/* ── Proof strip ── */}
      <section className="proof" aria-label={`${meta.count ?? 0} plans · ${meta.providers ?? 0} providers and catalog facts`}>
        <div className="proof__in wrap">
          <div className="stat">
            <ShoreIcon name="shell" />
            <b className="num" data-count={meta.count ?? 0}>{meta.count ?? 0}</b>
            <span>VPS plans compared</span>
          </div>
          <div className="stat">
            <ShoreIcon name="pin" />
            <b className="num" data-count={meta.providers ?? 0}>{meta.providers ?? 0}</b>
            <span>hosting providers</span>
          </div>
          <div className="stat">
            <ShoreIcon name="lantern" />
            <b className="num">{meta.snapshotDate ? shoreFmtDate(meta.snapshotDate) : "Snapshot date unavailable"}</b>
            <span>latest price check</span>
          </div>
          <div className="stat">
            <ShoreIcon name="tag" />
            <b className="num">0</b>
            <span>paid rankings. Commission never changes the order.</span>
          </div>
        </div>
      </section>

      {/* ── Ranked board ── */}
      <section className="sec wrap" aria-labelledby="board-h">
        <div className="sec__head">
          <div>
            <h2 id="board-h">Ranked by value score</h2>
            <p className="sec__sub">The highest-ranked plan from each provider. Price, RAM per dollar, Trustpilot and evidence decide the order. Commission doesn&apos;t.</p>
          </div>
          <Link className="pill" href="/catalog">
            All {meta.count} plans<ShoreIcon name="arrow" cls="ico--arrow" />
          </Link>
        </div>
        {picks.length ? (
          <ol className="board">
            {picks.map((o, i) => (
              <li key={o.id} className={i === 0 ? "top" : undefined}>
                <span className="board__rank num">{i + 1}</span>
                <ProviderMark offer={o} />
                <Link className="board__name" href={`/offers/${o.id}`}>
                  {o.name}
                  <span>{o.p} · {shoreLocTxt(o.loc)}</span>
                </Link>
                <span className="board__spec num">{shoreSpecLine(o)}</span>
                <span className="board__price">
                  <b className="num">{shorePrice(o)}</b>
                  {o.free ? null : <small>/mo</small>}
                  {o.real != null ? RV : null}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="fine">No VPS plans have been published yet.</p>
        )}
      </section>

      {/* ── How it works ── */}
      <section className="how wrap" aria-labelledby="how-h">
        <div className="how__head">
          <h2 id="how-h">How the crab reads the fine print</h2>
          <p>Three steps, the same for every plan in the catalog.</p>
        </div>
        <ol className="how__steps">
          <li className="step">
            <span className="step__knot num" aria-hidden="true">1</span>
            <div className="step__body">
              <h3>Tell it what your project needs</h3>
              <p>Memory, budget and region. Plans that don&apos;t fit step aside, and you see why.</p>
              <Link
                className="tile night"
                data-pose="working"
                href={`/catalog?ram=4&price=10&regions=europe`}
                aria-label={`See the ${stepFit} plans with 4 GB RAM or more, under $10 a month, in Europe`}
              >
                <span className="tile__art" aria-hidden="true">
                  <svg className="pet s-patchwork k-bvp" viewBox="26 50 118 74" data-state="idle" style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.crab }} />
                </span>
                <span className="tile__ui">
                  <span className="patch patch--static">4 GB+ RAM</span>
                  <span className="patch patch--static">Under $10</span>
                  <span className="patch patch--static">Europe</span>
                  <span className="tile__note"><b className="num">{stepFit}</b> plans fit these needs today <ShoreIcon name="arrow" cls="ico--arrow" /></span>
                </span>
              </Link>
            </div>
          </li>
          <li className="step">
            <span className="step__knot num" aria-hidden="true">2</span>
            <div className="step__body">
              <h3>It reads the fine print</h3>
              <p>Intro price, renewal, setup fee and contract, each with a date. Missing facts say &ldquo;Not published&rdquo;.</p>
              {ex && (
                <Link className="tile night" data-pose="quirk" href={`/offers/${ex.id}`} aria-label={`Open the price receipt for ${ex.name} by ${ex.p}`}>
                  <span className="tile__art" aria-hidden="true">
                    <svg className="pet s-patchwork k-bvp" viewBox="26 50 118 74" data-state="idle" style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.crab }} />
                  </span>
                  <span className="tile__ui">
                    <span className="mini-r">
                      {ex.tr && ex.introM
                        ? <span className="mini-r__line"><span>First {ex.introM} months</span><b className="num">{shoreMoney((ex.intro ?? ex.eff) * (ex.cur === "USD" ? 1 : (ex.fx ?? 1)))}/mo</b><i aria-hidden="true" /></span>
                        : <span className="mini-r__line"><span>Monthly price</span><b className="num">{shoreMoney(ex.usd)}/mo</b><i aria-hidden="true" /></span>
                      }
                      <span className="mini-r__line">
                        <span>Renews at</span>
                        {ex.tr && ex.ren != null
                          ? <b className="num">{shoreMoney(ex.ren * (ex.cur === "USD" ? 1 : (ex.fx ?? 1)))}/mo</b>
                          : <span className="unk">{ex.tr ? "Not published" : "Not reviewed yet"}</span>
                        }
                        <i aria-hidden="true" />
                      </span>
                      <span className="mini-r__line">
                        <span>Setup fee</span>
                        {ex.setup != null
                          ? <b className="num">{shoreMoney(ex.setup * (ex.cur === "USD" ? 1 : (ex.fx ?? 1)))}</b>
                          : <span className="unk">Not published</span>
                        }
                        <i aria-hidden="true" />
                      </span>
                    </span>
                    <span className="tile__note">{ex.p} {ex.name} · checked {shoreFmtDate(ex.checked)} <ShoreIcon name="arrow" cls="ico--arrow" /></span>
                  </span>
                </Link>
              )}
            </div>
          </li>
          <li className="step">
            <span className="step__knot num" aria-hidden="true">3</span>
            <div className="step__body">
              <h3>You pick, and buy direct</h3>
              <p>The button goes straight to the provider. Paid links are labelled and never change the order.</p>
              {ex && (
                <Link className="tile night" data-pose="success" href={`/offers/${ex.id}`} aria-label={`See ${ex.name} by ${ex.p}`}>
                  <span className="tile__art" aria-hidden="true">
                    <svg className="pet s-patchwork k-bvp" viewBox="26 50 118 74" data-state="idle" style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.crab }} />
                  </span>
                  <span className="tile__ui">
                    <span className="mini-shell"><ShellSvg offer={ex} /></span>
                    <span className="ribbon"><ShoreIcon name="check" />This one.</span>
                    <span className="tile__note">
                      {ex.aff ? "Ad: we may earn a commission. It never changes the order." : "Direct link. No commission on this plan."} <ShoreIcon name="arrow" cls="ico--arrow" />
                    </span>
                  </span>
                </Link>
              )}
            </div>
          </li>
        </ol>
      </section>

      {/* ── Contact ── */}
      <section className="contact night" aria-labelledby="contact-h">
        <div className="contact__crab" aria-hidden="true">
          <svg className="pet s-patchwork k-bvp call-crab" viewBox="0 40 116 84" data-state="idle" style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.crab + CALL_ART }} />
        </div>
        <div className="contact__text">
          <h2 id="contact-h">Ring the crab.</h2>
          <p>A price that changed, a plan we missed, or a project you want a second opinion on? Send it over. A person reads every message.</p>
          <p className="contact__links">
            <a className="btn btn--primary" href="mailto:hello@bestvpsforme.com">hello@bestvpsforme.com</a>
            <Link className="btn" href="/corrections">Send a price correction</Link>
            <a className="btn" href="https://x.com/Twarga_Dev" target="_blank" rel="noopener">@Twarga_Dev on X</a>
          </p>
        </div>
      </section>
      </div>
      <HomeMotion />
    </main>
  );
}
