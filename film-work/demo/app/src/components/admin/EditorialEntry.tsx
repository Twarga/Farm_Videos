"use client";

import { useActionState } from "react";
import type { OfferEditorialRecord } from "@/db/schema";
import { WORKLOADS } from "@/lib/catalog";
import type { EditorialQueueEntry } from "@/lib/editorial-queue";
import { money } from "@/lib/format";
import { resolveOfferProvider } from "@/lib/provider-resolver";
import type { EditorialFormState } from "@/app/admin/editorial/actions";
import styles from "./AdminEditorial.module.css";
import consoleStyles from "./AdminConsole.module.css";

type Props = {
  entry: EditorialQueueEntry;
  saved: OfferEditorialRecord | null;
  action: (prev: EditorialFormState | null, data: FormData) => Promise<EditorialFormState>;
};

const TRI = [["", "Not published"], ["yes", "Yes"], ["no", "No"]] as const;

/**
 * One plan in the editorial queue: its evidence on the left, the two sentences
 * on the right. Every fact the writer may use is on screen, because a sentence
 * that is not derivable from this block has no business being published.
 */
export function EditorialEntry({ entry, saved, action }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const { offer } = entry;
  const provider = resolveOfferProvider(offer);
  // React resets the form once the action resolves, so a rejected save has to
  // re-render from the echoed draft or the operator loses what they typed.
  const draft = state?.draft ?? null;
  const triValue = (value: boolean | null | undefined) => (value == null ? "" : value ? "yes" : "no");
  const evidence: [string, string][] = [
    ["Billing", offer.billing],
    ["Checked", offer.checkedAt.slice(0, 10)],
    ["Term", offer.commitmentMonths == null ? "Not published" : `${offer.commitmentMonths} months`],
    ["Renewal", offer.termsReviewed && offer.renewalMonthly != null ? `${money(offer.renewalMonthly, offer.currency)}/mo` : "Not reviewed"],
    ["IPv4", offer.ipv4Status],
    ["Locations", offer.locations.length ? offer.locations.join(", ") : "Not published"],
    ["Hardware", `${offer.vcpu ?? "?"} vCPU · ${offer.ramGb ?? "?"} GB · ${offer.diskGb ?? "?"} GB ${offer.diskKind}`],
    ["Transfer", offer.transfer],
    ["Confidence", offer.confidence],
  ];

  return (
    <section className={styles.entry} style={{ animation: "none" }} aria-labelledby={`entry-${offer.id}`}>
      <header className={styles.entry_head}>
        <div>
          <p className={styles.rank}>#{entry.rank}{entry.coverage ? " · first plan for this provider" : ""}</p>
          <h3 id={`entry-${offer.id}`}>{provider.name} {offer.productName}</h3>
          <p className={styles.meta}>
            {entry.written ? "Catch and fit written" : "Not written"} · {entry.clicks} outbound {entry.clicks === 1 ? "click" : "clicks"}
          </p>
          <p className={styles.links}>
            <a href={`/offers/${offer.id}`} target="_blank" rel="noreferrer">View plan</a>
            <a href={offer.url} target="_blank" rel="noreferrer">Provider page</a>
          </p>
        </div>
        <span className={saved?.reviewStatus === "reviewed" ? styles.badge_live : styles.badge_draft}>
          {saved?.reviewStatus === "reviewed" ? "Published" : saved ? "Draft" : "Empty"}
        </span>
      </header>

      <div className={styles.entry_body}>
        <div className={styles.evidence}>
          <p className={styles.evidence_title}>Evidence on file</p>
          <dl className={styles.evidence_list}>
            {evidence.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>

        <form action={formAction} className={styles.form}>
          <input type="hidden" name="offerId" value={offer.id} />

          <label htmlFor={`catch-${offer.id}`}>The catch</label>
          <textarea id={`catch-${offer.id}`} name="catchNotes" rows={2} maxLength={1000} defaultValue={draft?.catchNotes ?? saved?.catchNotes ?? ""} placeholder="One plain sentence naming a cost or limit the ad does not lead with." />

          <label htmlFor={`catch-source-${offer.id}`}>Catch evidence</label>
          <textarea id={`catch-source-${offer.id}`} name="catchSource" rows={2} maxLength={2000} defaultValue={draft?.catchSource ?? saved?.catchSource ?? ""} placeholder="Name the source and the check date, e.g. offer billing notes, snapshot 2026-08-31" />

          <label htmlFor={`fit-${offer.id}`}>Why it fits</label>
          <textarea id={`fit-${offer.id}`} name="fitNotes" rows={2} maxLength={1000} defaultValue={draft?.fitNotes ?? saved?.fitNotes ?? ""} placeholder="The workload and the hardware fact that supports it." />

          <label htmlFor={`fit-source-${offer.id}`}>Fit evidence</label>
          <textarea id={`fit-source-${offer.id}`} name="fitSource" rows={2} maxLength={2000} defaultValue={draft?.fitSource ?? saved?.fitSource ?? ""} placeholder="e.g. specs row, snapshot 2026-08-31" />

          <fieldset className={styles.workloads}>
            <legend>Workloads this plan can run</legend>
            {WORKLOADS.map((workload) => (
              <label key={workload.id} className={styles.check}>
                <input type="checkbox" name="niches" value={workload.id} defaultChecked={draft ? draft.niches.includes(workload.id) : saved?.niches?.includes(workload.id) ?? false} />
                <span>{workload.label}</span>
              </label>
            ))}
          </fieldset>

          <div className={styles.facts}>
            <label htmlFor={`managed-${offer.id}`}>Managed
              <select id={`managed-${offer.id}`} name="managed" defaultValue={draft?.managed ?? triValue(saved?.managed)}>
                {TRI.map(([value, label]) => <option key={label} value={value}>{label}</option>)}
              </select>
            </label>
            <label htmlFor={`backups-${offer.id}`}>Backups included
              <select id={`backups-${offer.id}`} name="backups" defaultValue={draft?.backups ?? triValue(saved?.backups)}>
                {TRI.map(([value, label]) => <option key={label} value={value}>{label}</option>)}
              </select>
            </label>
            <label htmlFor={`gpus-${offer.id}`}>GPUs
              <input id={`gpus-${offer.id}`} name="gpus" type="number" min="0" step="1" defaultValue={draft?.gpus ?? saved?.gpus ?? ""} placeholder="Not published" />
            </label>
          </div>

          <fieldset className={styles.status}>
            <legend>Status</legend>
            <label className={styles.check}><input type="radio" name="reviewStatus" value="draft" defaultChecked={draft ? draft.reviewStatus === "draft" : saved?.reviewStatus !== "reviewed"} /> <span>Save as draft (not public)</span></label>
            <label className={styles.check}><input type="radio" name="reviewStatus" value="reviewed" defaultChecked={draft ? draft.reviewStatus === "reviewed" : saved?.reviewStatus === "reviewed"} /> <span>Publish as reviewed</span></label>
          </fieldset>

          <label className={styles.check}>
            <input type="checkbox" name="confirm" value="editorial" required />
            <span>I checked every sentence against the evidence above</span>
          </label>

          {state ? (
            <p className={state.ok ? styles.ok : styles.error} role={state.ok ? "status" : "alert"}>{state.message}</p>
          ) : null}

          <button className={`${consoleStyles.primary_button} ${styles.submit}`} type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save entry"}
          </button>
        </form>
      </div>
    </section>
  );
}
