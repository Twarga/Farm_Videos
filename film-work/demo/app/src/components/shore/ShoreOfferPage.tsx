"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { ShoreOffer } from "@/lib/shore-offer";
import { shoreMoney, shorePrice, shoreGb, shoreDisk, shoreBw, shoreLocTxt, shoreFmtDate } from "./format";
import { ProviderMark } from "./ProviderMark";
import { TrustpilotBadge, TrustpilotRating } from "./TrustpilotBadge";
import { ShellSvg } from "./ShellSvg";
import { ShoreIcon } from "./ShoreIcon";
import { CostShell, TrueMonthlyCost } from "./CostShell";
import { useCompare } from "@/components/CompareProvider";
import art from "@/shore/shell-art.json";

const RV = (
  <span className="rv" title="Reviewed 3-year price">
    <ShoreIcon name="check" /><span className="sr-only">Reviewed 3-year price</span>
  </span>
);

/* ── Receipt evidence threads ── */
type EvidenceLine = { t: string; d: string; link: string | null };

function buildReceiptLines(o: ShoreOffer): { label: string; val: string | null; unit?: string; unk?: string; strong?: boolean; ev: EvidenceLine }[] {
  let host = "the provider site";
  try { host = new URL(o.url).host.replace(/^www\./, ""); } catch { /* keep default */ }
  const checked = shoreFmtDate(o.checked);
  const rate = o.cur === "USD" ? 1 : (o.fx ?? null);
  const conv = (v: number | null) => v != null && rate != null ? v * rate : null;
  const ev = (t: string, d: string, link: string | null = null): EvidenceLine => ({ t, d, link });

  const L: ReturnType<typeof buildReceiptLines> = [];
  L.push({ label: "Advertised", val: o.free ? "Free tier" : shoreMoney(conv(o.adv ?? o.eff)), unit: o.free ? undefined : "/mo", ev: ev("Advertised monthly price", o.free ? `The provider lists this plan at no monthly charge; limits apply. Checked ${checked}.` : `From the provider's pricing page (${host}). Checked ${checked}.`, o.url) });
  if (o.tr && o.introM) L.push({ label: `First ${o.introM} months`, val: shoreMoney(conv(o.intro ?? o.eff)), unit: "/mo", ev: ev("Intro period", `Intro price and length from the provider's billing terms, reviewed by bestvpsforme. Snapshot ${checked}.`, o.url) });
  L.push({
    label: "Renews at", val: o.tr ? shoreMoney(conv(o.ren)) : null, unit: "/mo",
    unk: o.tr ? "Not published" : "Not reviewed yet",
    ev: o.tr
      ? ev("Renewal price", o.ren != null ? `From the billing terms, reviewed by bestvpsforme. Snapshot ${checked}.` : "The provider does not publish a renewal price. Confirm it at checkout.", o.url)
      : ev("Renewal price", "We have not reviewed this plan's billing terms yet, so we don't show a renewal price."),
  });
  L.push({ label: "Due today", val: shoreMoney(conv(o.cash)), ev: ev("Due today", o.cash != null ? `The first charge at checkout. Checked ${checked}.` : "Not published. Some plans bill several months up front; confirm at checkout.", o.cash != null ? o.url : null) });
  L.push({ label: "Setup fee", val: shoreMoney(conv(o.setup)), ev: ev("Setup fee", o.setup != null ? `From the provider's pricing page. Checked ${checked}.` : "Not published. Confirm at checkout.", o.setup != null ? o.url : null) });
  L.push({ label: "Commitment", val: o.term == null ? null : o.term <= 1 ? "Monthly" : `${o.term} months`, ev: ev("Commitment", o.term != null ? `Billing term from the provider. Checked ${checked}.` : "Not published.", o.term != null ? o.url : null) });
  L.push({ label: "VAT basis", val: o.vat === "incl" ? "Price includes VAT" : o.vat === "excl" ? "Price excludes VAT" : null, unk: o.vat === null ? "Not published" : undefined, ev: ev("VAT basis", o.vat === null ? "The VAT basis is not published. Confirm the tax total at checkout." : `The provider states that this price ${o.vat === "incl" ? "includes" : "excludes"} VAT. Checked ${checked}.`, o.vat === null ? null : o.url) });
  if (o.cur !== "USD") {
    const nativePrice = /^[A-Z]{3}$/.test(o.cur) ? new Intl.NumberFormat("en-GB", { style: "currency", currency: o.cur }).format(o.eff) : `${o.eff} ${o.cur}`;
    const rateSource = o.fxSource?.includes("ecb.europa.eu") ? "ECB" : o.fxSource ?? "recorded";
    L.push({ label: `Converted from ${o.cur} (${nativePrice}/mo)`, val: o.fx ? `× ${o.fx}` : null, ev: ev("Exchange rate", o.fx ? `Dollar figures use the ${rateSource} rate ${o.fx} on ${shoreFmtDate(o.fxDate)}. The provider charges in ${o.cur}.` : `No dated exchange rate, so we don't convert this price.`, o.fxSource) });
  }

  // 3-year total — only when real is non-null (reviewed price exists)
  const total3yr = o.real != null ? o.real * 36 : null;
  L.push({
    label: "3-year total", strong: true,
    val: total3yr != null ? shoreMoney(total3yr) : null,
    unk: "Not computable",
    ev: ev("3-year total", total3yr != null
      ? "Setup fee plus 36 months of reviewed prices. Same math as the cost shell below."
      : `Not computable: billing terms are ${o.tr ? "reviewed but some inputs are missing" : "not reviewed yet"}.`),
  });
  return L;
}

function DrawThread({ btnRef, cardRef }: { btnRef: React.RefObject<HTMLButtonElement | null>; cardRef: React.RefObject<HTMLDivElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const btn = btnRef.current; const card = cardRef.current; const svg = svgRef.current;
    if (!btn || !card || !svg) return;
    const c = card.getBoundingClientRect();
    const k = btn.querySelector(".knot")?.getBoundingClientRect();
    const evid = card.querySelector("#evid")?.getBoundingClientRect();
    if (!k || !evid) return;
    const x1 = k.left + k.width / 2 - c.left; const y1 = k.top + k.height / 2 - c.top;
    const x2 = evid.right - c.left - 22; const y2 = evid.top - c.top;
    const mx = Math.max(x1, x2) + 16;
    svg.setAttribute("viewBox", `0 0 ${c.width.toFixed(0)} ${c.height.toFixed(0)}`);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    svg.innerHTML = `<path class="${reduced ? "" : "draw"}" d="M${x1.toFixed(1)} ${y1.toFixed(1)}C${mx.toFixed(1)} ${(y1+14).toFixed(1)} ${mx.toFixed(1)} ${(y2-34).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="3.2"/>`;
  });
  return <svg className="threads" id="threads" ref={svgRef} aria-hidden="true" focusable="false" />;
}

function Receipt({ offer, lines }: { offer: ShoreOffer; lines: ReturnType<typeof buildReceiptLines> }) {
  const { ids, toggle, ready, unavailable } = useCompare();
  const inPail = ids.includes(offer.id);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);

  const big = offer.free
    ? <>
        <p className="bp__label"><span>Price per month</span><span>Free tier</span></p>
        <p className="bp"><b className="num">Free tier</b></p>
        <p className="bp__sub">Free tier: limits apply, check the provider&apos;s terms.</p>
      </>
    : offer.real != null
    ? <>
        <p className="bp__label"><span>3-year real price</span><span className="rvchip"><ShoreIcon name="check" />Reviewed</span></p>
        <p className="bp"><b className="num">{shoreMoney(offer.real)}</b><small>/mo</small></p>
        <p className="bp__sub">Average over 36 months, setup and renewals included.</p>
      </>
    : <>
        <p className="bp__label"><span>Price per month</span><span>{offer.cur}</span></p>
        <p className="bp"><b className="num">{offer.pt}</b><small>/mo{offer.un}</small></p>
        <p className="bp__sub">{offer.tr ? "Advertised price. A 3-year average needs every fee reviewed." : "Advertised price. Billing terms are not reviewed yet."}</p>
      </>;

  const activeEv = activeIdx != null ? lines[activeIdx]?.ev : null;

  return (
    <aside className="receipt" aria-label="Price receipt">
      <div className="receipt__crab" aria-hidden="true">
        <svg className="pet s-patchwork k-bvp" viewBox="26 50 118 74" data-state={offer.real != null ? "success" : "idle"} style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.crab }} />
      </div>
      <div className="receipt__card" id="rcard" ref={cardRef}>
        {activeIdx != null && <DrawThread key={activeIdx} btnRef={activeBtnRef} cardRef={cardRef} />}
        {big}
        <TrueMonthlyCost offer={offer} />
        <ul className="rlines">
          {lines.map((l, i) => (
            <li key={i}>
              <button
                type="button"
                className={`rline${l.strong ? " rline--total" : ""}${activeIdx === i ? " on" : ""}`}
                data-i={i}
                aria-describedby="evid"
                ref={activeIdx === i ? (el => { activeBtnRef.current = el; }) : undefined}
                onPointerEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                onClick={() => setActiveIdx(i)}
              >
                <span>{l.label}</span>
                {l.val
                  ? <span className="num">{l.val}{l.unit ? <small>{l.unit}</small> : null}</span>
                  : <span className="unk">{l.unk ?? "Not published"}</span>
                }
                <span className="knot" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <div className="evidence" id="evid">
          <h3><ShoreIcon name="lantern" /><span id="evT">{activeEv?.t ?? "Where these numbers come from"}</span></h3>
          <p id="evD">{activeEv?.d ?? "Point at a line, or tab to it, to see its source and date."}</p>
          <p id="evL">
            {activeEv?.link
              ? <a href={activeEv.link} target="_blank" rel="noopener">Open the source<ShoreIcon name="out" /></a>
              : null}
          </p>
        </div>
        <div className="receipt__actions">
          <a
            className="btn btn--primary btn--block"
            href={offer.outboundPath}
            target="_blank"
            rel={offer.aff ? "sponsored nofollow noopener" : "nofollow noopener"}
          >
            Visit {offer.p}<ShoreIcon name="out" />
          </a>
          <button
            className="btn btn--block"
            type="button"
            id="pickOffer"
            aria-pressed={inPail}
            disabled={!ready || unavailable}
            onClick={(event) => toggle(offer.id, event.currentTarget)}
          >
            <ShoreIcon name="pail" />
            <span>{inPail ? "In your compare pail" : "Pick for compare"}</span>
          </button>
        </div>
        <p className="linkline">
          <ShoreIcon name="tag" />
          <span>{offer.aff
            ? <><b>Ad.</b> We may earn a commission. It never changes the order.</>
            : <><b>Direct link.</b> No commission on this plan. The button goes straight to the provider.</>
          }</span>
        </p>
        <p className="fine"><Link href={`/corrections?plan=${offer.id}`}>Report a wrong price</Link></p>
      </div>
    </aside>
  );
}

function HwCells({ offer }: { offer: ShoreOffer }) {
  const ipv4Label = { included: "Included", extra: "Extra cost", "location-dependent": "Depends on location", unknown: null }[offer.ipv4] ?? null;
  const cell = (icon: string, label: string, val: string | null, sub: string | null) => (
    <div key={label}>
      <p className="hw__l"><ShoreIcon name={icon} />{label}</p>
      <p className="hw__v">{val ?? "—"}</p>
      <p className="hw__s">{sub ?? ""}</p>
    </div>
  );
  return (
    <div className="hw">
      {cell("cpu", "CPU", offer.vcpu != null ? `${offer.vcpu} vCPU` : null, offer.cpu ?? (offer.vcpu == null ? "Not published" : ""))}
      {cell("ram", "Memory", shoreGb(offer.ram), offer.ram == null ? "Not published" : "")}
      {cell("disk", "Storage", shoreDisk(offer.disk), offer.dk ?? (offer.disk == null ? "Not published" : ""))}
      {cell("transfer", "Transfer", shoreBw(offer.bw), shoreBw(offer.bw) ? "per month" : "Not published")}
      {cell("pin", "IPv4", ipv4Label, ipv4Label ? "" : "Confirm at checkout")}
      {cell("shell", "Backups", offer.backups == null ? null : offer.backups ? "Included" : "Not included", offer.backups == null ? "Confirm at checkout" : "")}
      {cell("lantern", "Management", offer.managed == null ? null : offer.managed ? "Managed" : "Self-managed", offer.managed == null ? "Confirm at checkout" : "")}
      {cell("pin", "Locations", offer.loc.length ? String(new Set(offer.loc.map(l => { const m = /^[a-z]{2}\b/i.exec(l); return m?.[0].toUpperCase() ?? l; })).size) : null, shoreLocTxt(offer.loc))}
    </div>
  );
}

export function ShoreOfferPage({ offer, siblings, alternatives = [] }: { offer: ShoreOffer; siblings: ShoreOffer[]; alternatives?: ShoreOffer[] }) {
  const lines = buildReceiptLines(offer);
  return (
    <div className="page wrap">
      {/* Breadcrumb */}
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/catalog">Plans</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/providers/${offer.pid}`}>{offer.p}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{offer.name}</span>
      </nav>

      <div className="offer">
        <div>
          {/* Provider identity */}
          <div className="idline">
            <ProviderMark offer={offer} large />
            <div>
              <p className="idline__name">
                <Link href={`/providers/${offer.pid}`}>{offer.p}</Link>
                <span> · HQ {offer.hq ?? "not published"}</span>
              </p>
              <p className="idline__meta">
                <TrustpilotRating offer={offer} />
                {offer.tp != null && offer.tpDate && <span className="idline__date">· checked {shoreFmtDate(offer.tpDate)}</span>}
              </p>
            </div>
          </div>

          <h1>{offer.name}</h1>

          {/* Tags */}
          <div className="tags">
            <span className="tagchip"><ShoreIcon name="lantern" />Price checked {shoreFmtDate(offer.checked)}</span>
            {offer.tr
              ? <span className="tagchip tagchip--fit"><ShoreIcon name="check" />Billing terms reviewed</span>
              : <span className="tagchip tagchip--warn">Billing terms not reviewed yet</span>
            }
            {/* SKU + stable ID line per plan */}
            <span className="tagchip tagchip--id">
              <ShoreIcon name="tag" />
              {offer.sku !== offer.id ? `SKU ${offer.sku} · ` : ""}ID {offer.id}
            </span>
          </div>

          <h2 className="h3">Hardware and extras</h2>
          <HwCells offer={offer} />

          {(offer.fit || offer.catch) && (
            <div className="notes">
              {offer.fit && <div className="note note--fit"><h3><ShoreIcon name="check" />Good for</h3><p>{offer.fit}</p></div>}
              {offer.catch && <div className="note note--catch"><h3><ShoreIcon name="hook" />The catch</h3><p>{offer.catch}</p></div>}
            </div>
          )}
        </div>

        <Receipt offer={offer} lines={lines} />
      </div>

      {/* 36-month cost shell */}
      <section className="cshell-sec" aria-labelledby="csh">
        <div className="sec__head">
          <h2 id="csh">Your first 36 months</h2>
          <p>What you pay each month, and when the price jumps.</p>
        </div>
        <CostShell offer={offer} />
      </section>

      {/* Siblings */}
      {siblings.length > 0 && (
        <section className="sibs" aria-labelledby="sib-h">
          <div className="sec__head"><h2 id="sib-h">More from {offer.p}</h2></div>
          <ol className="board">
            {siblings.map(x => (
              <li key={x.id}>
                <span className="board__rank num">#{x.rank}</span>
                <ProviderMark offer={x} />
                <Link className="board__name" href={`/offers/${x.id}`}>
                  {x.name}
                  <span>{shoreLocTxt(x.loc)}</span>
                </Link>
                <span className="board__spec num">
                  {[x.vcpu != null ? `${x.vcpu} vCPU` : null, shoreGb(x.ram), shoreDisk(x.disk)].filter(Boolean).join(" · ")}
                </span>
                <span className="board__price">
                  <b className="num">{shorePrice(x)}</b>
                  {x.free ? null : <small>/mo</small>}
                  {x.real != null ? RV : null}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
      {alternatives.length > 0 && (
        <section className="sibs" aria-labelledby="alt-h">
          <div className="sec__head"><h2 id="alt-h">Lower 3-year cost, same RAM</h2><p>Reviewed plans from other providers.</p></div>
          <ol className="board">
            {alternatives.map((candidate) => (
              <li key={candidate.id}>
                <span className="board__rank num">#{candidate.rank ?? "—"}</span>
                <ProviderMark offer={candidate} />
                <Link className="board__name" href={'/offers/' + candidate.id}>
                  {candidate.name}
                  <span>{candidate.p} · {shoreLocTxt(candidate.loc)}</span>
                </Link>
                <span className="board__spec num">{[candidate.vcpu != null ? candidate.vcpu + " vCPU" : null, shoreGb(candidate.ram), shoreDisk(candidate.disk)].filter(Boolean).join(" · ")}</span>
                <span className="board__price"><b className="num">{shoreMoney(candidate.realTotal36) ?? "—"}</b><small>over 36 months</small></span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
