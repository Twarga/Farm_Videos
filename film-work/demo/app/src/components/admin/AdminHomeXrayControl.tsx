"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { AdminActionResult } from "@/lib/admin-action-feedback";
import styles from "./AdminConsole.module.css";

type Action = (data: FormData) => Promise<AdminActionResult>;

export function AdminHomeXrayControl({ current, reason, action }: { current: string | null; reason: string | null; action: Action }) {
  // React resets the form after an action; a rejected save restores what the owner typed.
  const [result, formAction, pending] = useActionState(async (_state: (AdminActionResult & { offerId: string; reason: string }) | null, data: FormData) => ({ ...(await action(data)), offerId: String(data.get("offerId") ?? ""), reason: String(data.get("reason") ?? "") }), null);
  const keep = result && !result.ok ? result : null;
  return <section className={styles.settings_group}>
    <div><h2>Homepage price example</h2><p>The server accepts only published plans with reviewed billing evidence and a documented selection reason.</p></div>
    {result ? <p role={result.ok ? "status" : "alert"}>{result.message}</p> : null}
    <form action={formAction} className={styles.setting_row} aria-busy={pending}>
      <div><label htmlFor="home-xray-offer"><strong>X-ray plan ID</strong></label><small>{current ? `Current selection: ${current}` : "No manual selection. Automatic eligible plan is used."} Copy a plan ID from the <Link href="/admin/offers">Offers list</Link>. The server checks eligibility before saving.</small></div>
      <span>
        <input id="home-xray-offer" name="offerId" defaultValue={keep ? keep.offerId : current ?? ""} required maxLength={101} pattern="[A-Za-z0-9][A-Za-z0-9.-]*" autoComplete="off" />
        <label htmlFor="home-xray-reason"><strong>Selection reason</strong></label>
        <textarea id="home-xray-reason" name="reason" required maxLength={1000} defaultValue={keep ? keep.reason : reason ?? ""} />
        <button className={styles.secondary_button} type="submit" disabled={pending}>{pending ? "Saving…" : "Save homepage example"}</button>
      </span>
    </form>
  </section>;
}
