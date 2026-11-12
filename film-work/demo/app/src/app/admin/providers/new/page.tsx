import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/admin-request";
import { createProvider } from "../actions";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Add provider · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminNewProviderPage({ searchParams }: { searchParams: Promise<{ error?: string; slug?: string }> }) {
  noStore();
  try { await requireAdmin(); } catch { redirect("/admin?error=expired"); }
  const { error, slug } = await searchParams;
  return <AdminShell sidebar={<AdminSidebar active="/admin/providers" />} topbar={<Link href="/admin/providers">All providers</Link>} sectionLabel="Add provider">
    <main className={styles.main}>
      <header className={styles.heading}>
        <div><span>Control room · provider record</span><h1>Add provider</h1><p>Creates a draft. It stays off the public site until plans are imported, a dated Trustpilot rating is recorded and the status is set to active.</p></div>
      </header>
      <section className={styles.panel} aria-labelledby="provider-new-title">
        <h2 id="provider-new-title">Identity</h2>
        {error === "invalid" ? <p role="alert">Check the name and the HTTPS URL.</p> : null}
        {error === "exists" ? <p role="alert">A provider with the slug <code>{slug}</code> already exists. <Link href={`/admin/providers/${encodeURIComponent(slug ?? "")}`}>Open it</Link>.</p> : null}
        <form action={createProvider} className={styles.form}>
          <label>Provider name<input name="name" minLength={2} maxLength={100} required autoComplete="off" /></label>
          <label>Official HTTPS URL<input type="url" name="officialUrl" placeholder="https://" required /></label>
          <label>Headquarters country code<input name="hqCountry" pattern="[A-Za-z]{2}" maxLength={2} /></label>
          <button className={styles.saveButton} type="submit">Create draft provider</button>
        </form>
      </section>
    </main>
  </AdminShell>;
}
