"use client";

import type { ReactNode } from "react";
import { useState, useRef } from "react";
import Link from "next/link";
import { ShoreIcon } from "./ShoreIcon";

const WHAT_OPTIONS = [
  "Monthly price",
  "Renewal price",
  "Setup fee",
  "Contract length",
  "Hardware",
  "Locations",
  "IPv4 address",
  "Something else",
];

type FormState = "idle" | "pending" | "success" | "error";

/**
 * Shore corrections form — matches mockup renderCorrections() exactly.
 * POSTs to /api/corrections with the existing bounded fields.
 * Preserves rate-limit / Turnstile / honeypot handling on the server.
 * plan=id prefill supported via planId prop.
 */
export function ShoreCorrectionForm({
  planId,
  planLabel,
}: {
  planId?: string;
  planLabel?: string;
}) {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successPlan, setSuccessPlan] = useState<string>("");
  const [successWhat, setSuccessWhat] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Client-side validation matching mockup
    const errs: Record<string, string> = {};
    const entityId = (data.get("entityId") as string | null)?.trim() ?? "";
    const field = (data.get("field") as string | null)?.trim() ?? "";
    const claimedValue = (data.get("claimedValue") as string | null)?.trim() ?? "";
    const sourceUrl = (data.get("sourceUrl") as string | null)?.trim() ?? "";
    const email = (data.get("email") as string | null)?.trim() ?? "";

    if (!entityId) errs.entityId = "Pick a plan from the list.";
    if (!claimedValue) errs.claimedValue = "Tell us the correct value.";
    let okUrl = false;
    try { okUrl = /^https?:$/.test(new URL(sourceUrl).protocol); } catch { okUrl = false; }
    if (!okUrl) errs.sourceUrl = "Paste a full link that starts with https://";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Check the email address, or leave it empty.";

    setErrors(errs);
    if (Object.keys(errs).length) {
      const firstKey = Object.keys(errs)[0];
      (form.elements.namedItem(firstKey) as HTMLElement | null)?.focus();
      return;
    }

    setState("pending");
    try {
      const res = await fetch("/api/corrections", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entityId, field, claimedValue, sourceUrl, email: email || undefined }),
      });
      if (res.ok) {
        setSuccessPlan(entityId);
        setSuccessWhat(field);
        setState("success");
      } else {
        const body = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setErrors({ _form: "Too many corrections submitted. Please wait a few minutes and try again." });
        } else {
          setErrors({ _form: body?.error ?? "Please check the fields and try again." });
        }
        setState("idle");
      }
    } catch {
      setErrors({ _form: "The correction could not be sent. Check your connection and try again." });
      setState("idle");
    }
  }

  if (state === "success") {
    return (
      <div className="state" role="status">
        <div className="state__art night" aria-hidden="true">
          {/* crab success pose placeholder — patchwork renders server-side */}
        </div>
        <div>
          <h1 className="ptitle">Thanks. The crab is on it.</h1>
          <p>
            We&apos;ll check <b>{successWhat.toLowerCase()}</b> for <b>{successPlan}</b> against your source.
          </p>
          <div className="row">
            <Link className="btn btn--primary" href="/catalog">Browse plans</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="corr" id="corrBox">
      <div>
        <header className="doc__head">
          <p className="kicker">Corrections</p>
          <h1 className="ptitle">Spotted a wrong price?</h1>
          <p className="lead">
            Send us the source. A person checks it against the provider&apos;s page and updates the snapshot.
            No account needed.
          </p>
        </header>

        {errors._form ? (
          <p className="err" role="alert">{errors._form}</p>
        ) : null}

        <form className="form" id="corr" ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={state === "pending"}>
          {/* Honeypot — hidden from real users */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />

          <div className="field">
            <label htmlFor="c-plan">Plan</label>
            <input
              className={`input${errors.entityId ? " is-err" : ""}`}
              id="c-plan"
              name="entityId"
              defaultValue={planLabel ?? planId ?? ""}
              placeholder="Provider · Plan name or offer ID"
              autoComplete="off"
              aria-describedby="e-plan"
              aria-invalid={errors.entityId ? "true" : undefined}
            />
            <p className="err" id="e-plan">{errors.entityId ?? ""}</p>
          </div>

          <div className="field">
            <label htmlFor="c-what">What is wrong</label>
            <select className="select" id="c-what" name="field">
              {WHAT_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="c-val">The correct value</label>
            <input
              className={`input${errors.claimedValue ? " is-err" : ""}`}
              id="c-val"
              name="claimedValue"
              placeholder="For example: renews at $12.99/mo"
              aria-describedby="e-val"
              aria-invalid={errors.claimedValue ? "true" : undefined}
            />
            <p className="err" id="e-val">{errors.claimedValue ?? ""}</p>
          </div>

          <div className="field">
            <label htmlFor="c-src">Source link</label>
            <input
              className={`input${errors.sourceUrl ? " is-err" : ""}`}
              id="c-src"
              name="sourceUrl"
              type="url"
              inputMode="url"
              placeholder="https://provider.com/pricing"
              aria-describedby="h-src e-src"
              aria-invalid={errors.sourceUrl ? "true" : undefined}
            />
            <p className="hint" id="h-src">The provider&apos;s own pricing page works best.</p>
            <p className="err" id="e-src">{errors.sourceUrl ?? ""}</p>
          </div>

          <div className="field">
            <label htmlFor="c-mail">
              Email <span className="opt">optional</span>
            </label>
            <input
              className={`input${errors.email ? " is-err" : ""}`}
              id="c-mail"
              name="email"
              type="email"
              autoComplete="email"
              aria-describedby="h-mail e-mail"
              aria-invalid={errors.email ? "true" : undefined}
            />
            <p className="hint" id="h-mail">Only to reply, then deleted 90 days after we resolve it. Never shared.</p>
            <p className="err" id="e-mail">{errors.email ?? ""}</p>
          </div>

          <div className="row">
            <button className="btn btn--primary" type="submit" disabled={state === "pending"}>
              {state === "pending" ? "Sending…" : <>Send the correction<ShoreIcon name="arrow" cls="ico--arrow" /></>}
            </button>
          </div>
        </form>
      </div>
      <div className="corr__art" aria-hidden="true" />
    </div>
  );
}
