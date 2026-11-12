export const PRICE_TERMS_FIELDS = ["termMonths", "introMonths", "introMonthly", "billedUpfrontMonths", "renewalMonthly", "cashDueToday", "setupFee"] as const;
export type PriceTermsValues = Partial<Record<typeof PRICE_TERMS_FIELDS[number], number | string | null>>;
const labels: Record<typeof PRICE_TERMS_FIELDS[number], string> = { termMonths: "Minimum term (months)", introMonths: "Intro duration (months)", introMonthly: "Intro price / month", billedUpfrontMonths: "Months billed upfront", renewalMonthly: "Renewal / month", cashDueToday: "Due today", setupFee: "Setup fee (enter 0 only if verified)" };

export function PriceTermsFields({ id, values, disabled, setupOnly = false }: { id: string; values: PriceTermsValues; disabled?: boolean; setupOnly?: boolean }) {
  return <div className="price-terms-fields">{(setupOnly ? ["setupFee" as const] : PRICE_TERMS_FIELDS).map((field) => <label key={field} htmlFor={`${id}-${field}`}>{labels[field]}<input id={`${id}-${field}`} name={field} type="number" min={field.endsWith("Months") ? "1" : "0"} step={field.endsWith("Months") ? "1" : "any"} defaultValue={values[field] ?? ""} disabled={disabled} /></label>)}</div>;
}
