"use client";

import { useFormStatus } from "react-dom";

export function AdminSubmitButton({ idle, pending, className, disabled = false }: { idle: string; pending: string; className: string; disabled?: boolean }) {
  const status = useFormStatus();
  return <button type="submit" className={className} disabled={disabled || status.pending} aria-disabled={disabled || status.pending}>{status.pending ? pending : idle}</button>;
}
