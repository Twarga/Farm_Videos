"use client";

import { useEffect, useState } from "react";
import type { ShoreOffer } from "@/lib/shore-offer";
import { costPlan, runsOf, KIND_LABEL } from "./cost-plan";
import { shoreMoney } from "./format";
import { ShoreIcon } from "./ShoreIcon";

function CostChart({ plan }: { plan: Extract<ReturnType<typeof costPlan>, { ok: true }> }) {
  const W = 720; const top = 34; const base = 168; const bw = 15; const gap = 5; const step = bw + gap;
  const mx = Math.max(...plan.months.map(m => m.cost ?? 0), 0.01);
  const hOf = (c: number) => Math.max(6, ((base - top) * c) / mx);
  const runs = runsOf(plan.months);

  let bars = "";
  [12, 24].forEach(m => { const x = m * step - gap / 2; bars += `<path class="cc-year" d="M${x} ${top - 10}V${base + 8}"/>`; });
  [0, 1, 2].forEach(y => { bars += `<text class="cc-yl" x="${(y * 12 + 6) * step - gap / 2}" y="${base + 30}">Year ${y + 1}</text>`; });
  plan.months.forEach((m, i) => {
    const x = i * step;
    const tip = `Month ${i + 1}: ${m.cost == null ? "not published" : `${shoreMoney(m.cost)} · ${KIND_LABEL[m.kind].toLowerCase()}`}`;
    if (m.cost == null) {
      bars += `<rect class="cc-bar cc-k-unknown" x="${x}" y="${base - 40}" width="${bw}" height="40" rx="3" style="--i:${i}" data-tip="${tip.replace(/"/g, "&quot;")}"/>`;
    } else {
      const h = hOf(m.cost);
      bars += `<rect class="cc-bar cc-k-${m.kind}" x="${x}" y="${(base - h).toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" rx="3" style="--i:${i}" data-tip="${tip.replace(/"/g, "&quot;")}"/>`;
    }
  });
  bars += `<path class="cc-base" d="M0 ${base}H${W}"/>`;
  runs.forEach(r => {
    const h = r.cost == null ? 40 : hOf(r.cost);
    bars += `<text class="cc-lab" x="${(r.a - 1) * step}" y="${(base - h - 10).toFixed(1)}">${r.cost == null ? "Not published" : `${shoreMoney(r.cost)}/mo`}</text>`;
  });

  return (
    <div className="cost__chart" data-draw>
      <svg className="cc" viewBox={`0 0 ${W} 206`} role="img" aria-labelledby="ccT" focusable="false" dangerouslySetInnerHTML={{ __html: `<title id="ccT">What you pay in each of the first 36 months. Taller bars cost more.</title>${bars}` }} />
    </div>
  );
}

function CostStrip({ plan }: { plan: Extract<ReturnType<typeof costPlan>, { ok: true }> }) {
  const runs = runsOf(plan.months);
  return (
    <div className="strip">
      <div className="strip__bar" aria-hidden="true">
        {runs.map((r, i) => <span key={i} className={`strip__seg strip__seg--${r.kind}`} style={{ flex: r.b - r.a + 1 }} />)}
      </div>
      <div className="strip__legend">
        {runs.map((r, i) => (
          <span key={i}>
            <i className={`sw sw--${r.kind}`} />
            {r.b - r.a + 1} mo at {r.cost != null ? <b className="num">{shoreMoney(r.cost)}</b> : "a price not published"}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CostShell({ offer }: { offer: ShoreOffer }) {
  const plan = costPlan(offer);
  if (!plan.ok) {
    return (
      <div className="cost cost--none">
        <div className="cost__side">
          <p className="cost__big">No 36-month view yet</p>
          <p className="cost__sub">{plan.reason} Until then you see the advertised price, and the receipt marks every missing fact.</p>
        </div>
      </div>
    );
  }
  const runs = runsOf(plan.months);
  const head = plan.total != null
    ? <>
        <p className="cost__big"><b className="num">{shoreMoney(plan.total)}</b> over 36 months</p>
        <p className="cost__sub">{shoreMoney(plan.total / 36)}/mo on average, setup included.</p>
      </>
    : <>
        <p className="cost__big">36-month total: not computable</p>
        <p className="cost__sub">The {plan.missing.join(" and ")} {plan.missing.length > 1 ? "are" : "is"} not published, so we don&apos;t add it up.</p>
      </>;
  return (
    <div className="cost">
      <CostChart plan={plan} />
      <div className="cost__side">
        {head}
        <ul className="runs">
          {runs.map((r, i) => (
            <li key={i}>
              <span className={`sw sw--${r.kind}`} />
              <span>Month{r.b > r.a ? `s ${r.a}–${r.b}` : ` ${r.a}`} · {KIND_LABEL[r.kind]}</span>
              <b className="num">{r.cost != null ? `${shoreMoney(r.cost)}/mo` : "Not published"}</b>
            </li>
          ))}
          <li>
            <span className="sw sw--knot" />
            <span>Setup fee, paid once</span>
            <b className="num">{plan.setup != null ? shoreMoney(plan.setup) : "Not published"}</b>
          </li>
        </ul>
        <details>
          <summary>Show every month as a table</summary>
          <table className="mtable">
            <thead><tr><th scope="col">Months</th><th scope="col">Type</th><th scope="col">Per month</th></tr></thead>
            <tbody>
              {runs.map((r, i) => (
                <tr key={i}>
                  <td className="num">{r.a}{r.b > r.a ? `–${r.b}` : ""}</td>
                  <td>{KIND_LABEL[r.kind]}</td>
                  <td className="num">{r.cost != null ? shoreMoney(r.cost) : "Not published"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </div>
  );
}

/** Compact strip for compare table and deal cards */
export function CostStripCompact({ offer }: { offer: ShoreOffer }) {
  const plan = costPlan(offer);
  if (!plan.ok) return <span className="unk">{plan.reason}</span>;
  return <CostStrip plan={plan} />;
}

/** True monthly cost disclosure accordion */
export function TrueMonthlyCost({ offer }: { offer: ShoreOffer }) {
  const [open, setOpen] = useState(false);
  const [unpick, setUnpick] = useState(false);
  useEffect(() => {
    if (!unpick) return;
    const timer = window.setTimeout(() => setUnpick(false), 620);
    return () => window.clearTimeout(timer);
  }, [unpick]);
  if (offer.usd == null) return null;
  const plan = costPlan(offer);
  const L: { l: string; v: string | null; unk?: string }[] = [];
  let sum = offer.usd; let floor = false; let ok = true;
  L.push({ l: "Advertised price", v: offer.free ? "Free tier" : `${shoreMoney(offer.usd)}/mo` });
  if (!plan.ok) {
    ok = false;
    L.push({ l: "Renewal and fees", v: null, unk: "Not reviewed yet" });
  } else {
    const known = plan.months.filter(m => m.cost != null);
    const avg = known.reduce((s, m) => s + (m.cost ?? 0), 0) / Math.max(1, known.length);
    if (known.length < 36) { floor = true; L.push({ l: "Renewal price", v: null, unk: "Not published" }); }
    const up = avg - offer.usd;
    if (Math.abs(up) >= 0.005) {
      L.push({ l: up > 0 ? "Renewal, spread over 3 years" : "Intro discount, over 3 years", v: `${up > 0 ? "+" : "−"}${shoreMoney(Math.abs(up))}/mo` });
      sum += up;
    } else {
      L.push({ l: "Renewal", v: "Same price" });
    }
    if (plan.setup != null) {
      if (plan.setup > 0) { L.push({ l: "Setup fee, spread over 3 years", v: `+${shoreMoney(plan.setup / 36)}/mo` }); sum += plan.setup / 36; }
      else L.push({ l: "Setup fee", v: "None" });
    } else { floor = true; L.push({ l: "Setup fee", v: null, unk: "Not published" }); }
  }
  if (offer.ipv4 === "extra") { floor = true; L.push({ l: "IPv4 address", v: null, unk: "Extra, price not published" }); }
  else if (offer.ipv4 === "included") L.push({ l: "IPv4 address", v: "Included" });
  else { floor = true; L.push({ l: "IPv4 address", v: null, unk: "Confirm at checkout" }); }
  if (offer.vat === null) { floor = true; L.push({ l: "Tax (VAT)", v: null, unk: "Not published" }); }
  const head = ok
    ? offer.free && sum === 0
      ? <b className="num">Free tier</b>
      : <><b className="num">{floor ? "At least " : ""}{shoreMoney(sum)}</b><small>/mo</small></>
    : <b>Can&apos;t add up yet</b>;
  return (
    <div className={`tc${open ? " open" : ""}${unpick ? " unpick" : ""}`} id="tc">
      <button className="tc__tag" type="button" id="tcBtn" aria-expanded={open} aria-controls="tcBody"
        onClick={() => { if (!open && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) setUnpick(true); setOpen(v => !v); }}>
        <span className="tc__stitch" aria-hidden="true" />
        <ShoreIcon name="tag" />
        <span className="tc__label">See the true monthly cost</span>
        <span className="tc__chev" aria-hidden="true" />
      </button>
      <div className="tc__body" id="tcBody" role="region" aria-label="True monthly cost">
        <div className="tc__in">
          <ul className="tc__lines">
            {L.map((x, i) => (
              <li key={i}>
                <span>{x.l}</span>
                {x.v ? <b className="num">{x.v}</b> : <span className="unk">{x.unk}</span>}
              </li>
            ))}
          </ul>
          <p className="tc__sum">
            <span>True monthly cost</span>
            <span>{head}</span>
          </p>
          <p className="fine">{floor ? "Some costs are not published, so this is the lowest it can be." : "Every cost is published and included."}</p>
        </div>
      </div>
    </div>
  );
}
