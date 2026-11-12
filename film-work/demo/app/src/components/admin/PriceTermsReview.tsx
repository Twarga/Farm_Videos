import type { PriceTermSuggestion } from "@/db/price-terms";
import type { ReviewedPriceTerms } from "@/db/row-normalization";
import { PRICE_TERMS_FIELDS, PriceTermsFields } from "./PriceTermsFields";

type Props = { rowId: string; jobId: string; plan: string; currency: string; suggestion: PriceTermSuggestion; reviewed: ReviewedPriceTerms | null; disabled?: boolean; action: (data: FormData) => Promise<void> };

export function PriceTermsReview({ rowId, jobId, plan, currency, suggestion, reviewed, disabled, action }: Props) {
  return <details><summary>{plan} · {reviewed ? "Terms reviewed" : "Terms not reviewed"}</summary>
    <p>Source currency: {currency}. Suggestions require verification; blank values stay unknown.</p>
    <p>Staged row ID: <code>{rowId}</code></p>
    <blockquote>{suggestion.evidence || "No billing evidence published"}</blockquote>
    <p>Parser suggestion ({suggestion.confidence} confidence): <code>{JSON.stringify(suggestion, (key, value) => key === "evidence" ? undefined : value)}</code></p>
    <form action={action}>
      <input type="hidden" name="rowId" value={rowId} /><input type="hidden" name="jobId" value={jobId} />
      <PriceTermsFields id={rowId} disabled={disabled} values={Object.fromEntries(PRICE_TERMS_FIELDS.map((field) => [field, reviewed?.[field] ?? (field in suggestion ? suggestion[field as keyof PriceTermSuggestion] : "")]))} />
      <label>Review evidence / source URL<textarea name="renewalSource" required defaultValue={reviewed?.renewalSource ?? ""} disabled={disabled} /></label>
      <label><input name="confirm" value="terms" type="checkbox" required disabled={disabled} /> I verified these terms against the source, including any zero fee.</label>
      <button className="ui-button ui-button--secondary" type="submit" disabled={disabled}>Approve these terms</button>
    </form>
  </details>;
}
