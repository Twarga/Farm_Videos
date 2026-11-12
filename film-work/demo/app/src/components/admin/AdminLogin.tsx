import { loginAdmin } from "@/app/admin/actions";
import type { CSSProperties } from "react";
import art from "@/shore/shell-art.json";
import { localPasswordOnly } from "@/lib/admin-local";
import styles from "./AdminLogin.module.css";

export function AdminLogin({ error }: { error?: string }) {
  return (
    <main className={styles.page}>
      <form action={loginAdmin} className={styles.panel}>
        <div className={styles.brand}>
          <span className={styles.crab} aria-hidden="true">
            <svg className="pet s-patchwork k-bvp" viewBox="33 72 76 50" data-state="idle" style={{ "--accent": "var(--violet)" } as CSSProperties} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: art.logo }} />
          </span>
          <span className={styles.brand_text}><strong>bestvps<span>forme</span></strong><small>Control room</small></span>
        </div>
        <p className={styles.eyebrow}>Private workspace · owner access</p>
        <h1 className={styles.title}>Control room</h1>
        <p className={styles.description}>Sign in to manage offers, imports, and analytics. This area is only for the catalog owner.</p>
        {error === "invalid" ? <p role="alert" className={styles.error}>Email, password, or authenticator code is incorrect.</p> : null}
        {error === "locked" ? <p role="alert" className={styles.error}>Too many attempts. Try again in 15 minutes.</p> : null}
        {error === "expired" ? <p role="alert" className={styles.error}>Your session expired. Sign in again to continue.</p> : null}
        <label className={styles.field} htmlFor="admin-email">Email<input id="admin-email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required /></label>
        <label className={styles.field} htmlFor="admin-password">Password<input id="admin-password" name="password" type="password" autoComplete="current-password" required /></label>
        {localPasswordOnly() ? <p className={styles.private_note}>Local try-out: no authenticator code needed.</p> : <>
        <label className={styles.field} htmlFor="admin-totp">Authenticator code<input id="admin-totp" name="totpCode" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" aria-describedby="admin-totp-help" required /></label>
        <p id="admin-totp-help" className={styles.private_note}>Use the six-digit code from your authenticator app.</p>
        </>}
        <button type="submit" className={`ui-button ui-button--primary control-touch ${styles.submit}`}>Sign in</button>
        <p className={styles.private_note}>Private workspace · no public account is created.</p>
      </form>
    </main>
  );
}
