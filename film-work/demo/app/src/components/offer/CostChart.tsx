import { reviewedPrice } from "@/lib/real-price";
import { money, toUsd } from "@/lib/format";
import type { Offer } from "@/lib/types";

const W = 1200;
const H = 360;
const PAD_X = 60;
const PAD_TOP = 30;
const PAD_BOTTOM = 60;
const HORIZON = 36;

/** Month -> x pixel; cumulative total -> y pixel (inverted axis). */
function chartFrame(maxTotal: number) {
  const span = Math.max(maxTotal, 1);
  const xFor = (month: number) => PAD_X + ((W - 2 * PAD_X) / HORIZON) * month;
  const yFor = (total: number) => H - PAD_BOTTOM - (total / span) * (H - PAD_TOP - PAD_BOTTOM);
  return { xFor, yFor };
}

/** Month-end service allocation, not a cash-payment schedule. */
function stepPath(series: number[], xFor: (m: number) => number, yFor: (t: number) => number): string {
  const parts = [`M${xFor(0)} ${yFor(0)}`];
  for (let m = 0; m < series.length; m += 1) {
    const x = xFor(m + 1);
    const y = yFor(series[m]!);
    if (m === 0) {
      parts.push(`L${x} ${yFor(0)}`, `L${x} ${y}`);
    } else {
      parts.push(`L${x} ${yFor(series[m - 1]!)}`, `L${x} ${y}`);
    }
  }
  parts.push(`L${xFor(HORIZON)} ${yFor(series[series.length - 1]!)}`);
  return parts.join(" ");
}

/** Pure-SVG cumulative cost chart. Server-rendered with a text alternative. */
export function CostChart({ offer }: { offer: Offer }) {
  const series = reviewedPrice(offer, HORIZON)?.series ?? [];
  if (!series.length) {
    return (
      <div className="chart chart--empty">
        <p className="muted chart__empty-note">
          A complete reviewed price is not available for this plan. Its 36-month projection is not published.
        </p>
      </div>
    );
  }

  const adMonthly = toUsd({ amount: offer.advertisedMonthly, currency: offer.currency, rate: offer.exchangeRate ?? null });
  const adSeries = adMonthly != null && adMonthly > 0
    ? Array.from({ length: HORIZON }, (_, m) => Math.round(adMonthly * (m + 1) * 100) / 100)
    : null;

  const realTotal = series[series.length - 1]!;
  const adTotal = adSeries?.at(-1) ?? null;
  const { xFor, yFor } = chartFrame(Math.max(realTotal, adTotal ?? 0));
  const introMonths = offer.introMonths ?? offer.billedUpfrontMonths ?? 0;
  const renewal = toUsd({ amount: offer.renewalMonthly, currency: offer.currency, rate: offer.exchangeRate ?? null });
  const renewsHigher = renewal != null && renewal > (toUsd({ amount: offer.effectiveMonthly, currency: offer.currency, rate: offer.exchangeRate ?? null }) ?? 0) + 0.001;
  const renewMonth = introMonths > 0 && introMonths < HORIZON ? introMonths : null;
  const due = offer.termsReviewed ? toUsd({ amount: offer.cashDueNow, currency: offer.currency, rate: offer.exchangeRate ?? null }) : null;
  const paymentNote = `Cash payment timing is not projected.${due != null ? ` Due today: ${money(due, "USD")} from reviewed billing terms.` : " Due today is not published."}`;

  const gridValues = [...new Set([0, Math.round(realTotal / 3), Math.round((realTotal / 3) * 2), Math.round(realTotal)])];
  const altText = [
    `Projected cumulative service cost over ${HORIZON} months, including setup: ${money(realTotal, "USD")}.`,
    renewMonth != null && renewal != null ? ` The monthly rate becomes ${money(renewal, "USD")} from month ${renewMonth + 1}.` : "",
    ` ${paymentNote}`,
    adTotal != null && adMonthly != null ? `The ad implies ${money(adMonthly, "USD")} a month, ${money(adTotal, "USD")} over three years.` : "",
  ].join("");

  return (
    <div className="chart" role="img" aria-label={altText} tabIndex={0}>
      <svg viewBox={`0 0 ${W} ${H}`}>
        <g stroke="var(--border)">
          {gridValues.map((value) => (
            <line key={value} x1={PAD_X} x2={W - PAD_X} y1={yFor(value)} y2={yFor(value)} />
          ))}
        </g>
        <g className="chart-label">
          {gridValues.map((value) => (
            <text key={value} x={PAD_X - 12} y={yFor(value) + 4} textAnchor="end">{value === 0 ? "$0" : money(value, "USD")}</text>
          ))}
          <text x={PAD_X} y={H - 26}>Month 0</text>
          <text x={xFor(12)} y={H - 26} textAnchor="middle">12</text>
          <text x={xFor(24)} y={H - 26} textAnchor="middle">24</text>
          <text x={xFor(HORIZON)} y={H - 26} textAnchor="end">36</text>
        </g>
        {renewMonth != null && renewsHigher ? (
          <rect x={xFor(renewMonth)} y={PAD_TOP} width={xFor(HORIZON) - xFor(renewMonth)} height={H - PAD_TOP - PAD_BOTTOM} fill="var(--volt-400)" opacity=".18" />
        ) : null}
        {adSeries ? (
          <path d={stepPath(adSeries, xFor, yFor)} stroke="var(--ink-400)" strokeWidth="2.5" strokeDasharray="7 7" fill="none" />
        ) : null}
        <path d={stepPath(series, xFor, yFor)} stroke="var(--fg)" strokeWidth="3.5" fill="none" strokeLinejoin="round" />
        {renewMonth != null && renewsHigher ? (
          <circle cx={xFor(renewMonth)} cy={yFor(series[renewMonth - 1]!)} r="7" fill="var(--surface)" stroke="var(--fg)" strokeWidth="2.5" />
        ) : null}
        <circle cx={xFor(HORIZON)} cy={yFor(realTotal)} r="7" fill="var(--fg)" />
        <g fontFamily="var(--font-sans)" fontSize="14" fontWeight="620" fill="var(--fg)">
          {renewMonth != null && renewsHigher && renewal != null ? (
            <text x={xFor(renewMonth) + 12} y={yFor(series[renewMonth - 1]!) + 22}>Month {renewMonth + 1}: renews at {money(renewal, "USD")}</text>
          ) : null}
          <text x={xFor(HORIZON) - 10} y={yFor(realTotal) - 14} textAnchor="end">{money(realTotal, "USD")} total</text>
          {adTotal != null ? (
            <text
              x={xFor(HORIZON) - 10}
              y={Math.abs(yFor(adTotal) - yFor(realTotal)) < 34 ? Math.max(yFor(adTotal), yFor(realTotal)) + 40 : yFor(adTotal) + 22}
              textAnchor="end" fill="var(--fg-subtle)" fontWeight="520"
            >{money(adTotal, "USD")} at the ad price</text>
          ) : null}
        </g>
      </svg>
      <p className="chart__note">The chart allocates service cost month by month. {paymentNote}</p>
    </div>
  );
}
