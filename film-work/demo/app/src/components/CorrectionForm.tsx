"use client";

import { useState } from "react";

export function CorrectionForm() {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setStatus("Sending…");
    try {
      const response = await fetch("/api/corrections", { method: "POST", body: JSON.stringify(Object.fromEntries(data)), headers: { "content-type": "application/json" } });
      setStatus(response.ok ? "Thanks — the correction is queued for evidence review." : "Please check the fields and try again.");
      if (response.ok) form.reset();
    } catch {
      setStatus("The correction could not be sent. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="correction-form" aria-busy={pending}>
      <label>Offer or provider ID<input name="entityId" required placeholder="hetzner-cx22" /></label>
      <label>Field to correct<input name="field" required maxLength={80} placeholder="Effective monthly price" /></label>
      <label>What should change?<textarea name="message" required minLength={20} maxLength={2000} rows={5} /></label>
      <label>Source URL (HTTPS)<input name="sourceUrl" type="url" required placeholder="https://provider.example/plan" /></label>
      <label>Your email (optional)<input name="email" type="email" maxLength={200} /></label>
      <button type="submit" className="btn btn--volt" disabled={pending}>{pending ? "Sending…" : "Send correction"}</button>
      {status ? <p role="status">{status}</p> : null}
    </form>
  );
}
