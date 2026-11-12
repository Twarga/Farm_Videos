import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "@/components/admin/AdminConsole.module.css";
import { requireAdmin } from "@/lib/admin-request";
import { getAdminSettingsData } from "@/db/admin-settings";
import { AdminHomeXrayControl } from "@/components/admin/AdminHomeXrayControl";
import { setHomeXrayOffer } from "@/app/admin/actions";
import { saveAdminSettings } from "./actions";

export const metadata: Metadata = { title: "Settings · Control room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
  noStore();
  try {
    await requireAdmin();
  } catch {
    redirect("/admin?error=expired");
  }
  const { catalogSearch, homeXray, homeXrayReason } = getAdminSettingsData();
  return <AdminShell sidebar={<AdminSidebar active="/admin/settings" />} topbar={<span className={styles.preview_link}>Owner-controlled settings</span>}>
    <main className={styles.main}>
      <header className={styles.page_head}>
        <div>
          <span>Control room · site policy</span>
          <h1>Settings</h1>
          <p>Changes are written to the database and audit log. Public search stays disabled until explicitly enabled here.</p>
        </div>
      </header>
      <section className={styles.settings_group}>
        <div>
          <h2>Catalog search</h2>
          <p>Controls whether the public catalog displays text search. Existing URLs remain compatible when hidden.</p>
        </div>
        <form action={saveAdminSettings} className={styles.setting_row}>
          <label htmlFor="catalog-search">
            <strong>Text search in catalog filters</strong>
            <small>Current state: {catalogSearch ? "enabled" : "disabled"}</small>
          </label>
          <select id="catalog-search" name="catalogSearch" defaultValue={catalogSearch ? "true" : "false"}>
            <option value="false">Disabled</option>
            <option value="true">Enabled</option>
          </select>
          <button className={styles.secondary_button} type="submit">Save catalog search</button>
        </form>
      </section>
      <AdminHomeXrayControl current={homeXray} reason={homeXrayReason} action={setHomeXrayOffer} />
    </main>
  </AdminShell>;
}
