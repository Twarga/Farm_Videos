"use client";

import { useActionState } from "react";
import type { CurrentTermsFormState } from "@/app/admin/terms/actions";
import { PriceTermsFields, type PriceTermsValues } from "./PriceTermsFields";
import styles from "./AdminEditorial.module.css";
import consoleStyles from "./AdminConsole.module.css";

type Props = { offerId: string; priceId: string; values: PriceTermsValues; renewalSource: string; setupFeeSource: string; setupOnly: boolean; action: (previous: CurrentTermsFormState | null, data: FormData) => Promise<CurrentTermsFormState> };

export function CurrentPriceTermsReview({ offerId, priceId, values, renewalSource, setupFeeSource, setupOnly, action }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const draft = state?.draft;
  return <form action={formAction} className={styles.form} aria-label={`Price terms for ${offerId}`}>
    <input type="hidden" name="offerId" value={offerId} />
    <input type="hidden" name="priceId" value={state?.ok ? state.revision : draft?.priceId ?? priceId} />
    <input type="hidden" name="scope" value={setupOnly ? "setup" : "terms"} />
    <input type="hidden" name="advance" value="next" />
    <fieldset disabled={pending} className={styles.term_fields}>
      <legend>{setupOnly ? "Verify the setup fee; existing renewal terms stay unchanged" : "Review billing terms"}</legend>
      <PriceTermsFields id={`current-${offerId}`} values={draft ?? values} setupOnly={setupOnly} />
      {!setupOnly && <>
        <label htmlFor={`renewal-source-${offerId}`}>Renewal evidence and check date</label>
        <textarea id={`renewal-source-${offerId}`} name="renewalSource" required rows={3} maxLength={4000} defaultValue={draft?.renewalSource ?? renewalSource} />
      </>}
      <label htmlFor={`setup-source-${offerId}`}>Setup-fee evidence</label>
      <textarea id={`setup-source-${offerId}`} name="setupFeeSource" rows={3} required={setupOnly} maxLength={4000} defaultValue={draft?.setupFeeSource ?? setupFeeSource} placeholder="Provider URL, YYYY-MM-DD check date and a quote explicitly stating the fee. Silence does not mean zero." />
      <label className={styles.check}><input type="checkbox" name="confirm" value="terms" required /> I verified these terms against the provider source, including any zero fee.</label>
    </fieldset>
    {state && <p className={state.ok ? styles.ok : styles.error} role={state.ok ? "status" : "alert"}>{state.message}</p>}
    <button type="submit" className={`${consoleStyles.primary_button} ${styles.submit}`} disabled={pending}>{pending ? "Saving…" : setupOnly ? "Save verified setup fee" : "Approve price terms"}</button>
  </form>;
}
