import Link from "next/link";
import { HandCoins } from "@phosphor-icons/react/dist/ssr";

/**
 * Under-nav commission disclosure for commercial surfaces (offer, provider,
 * compare). The catalog renders its own inline `.disc` line above the table,
 * so this bar must not also render there — it lives in SiteFrame, which gates
 * the paths. Never dismissible.
 */
export function DisclosureBar() {
  return (
    <div className="disclosure" role="note" aria-label="Commission disclosure">
      <div className="container--wide disclosure__in">
        <HandCoins aria-hidden weight="bold" />
        <span>
          Some links on this page are <strong>affiliate links</strong> — we may earn a commission.
          It never changes the order or the numbers. <Link href="/methodology#independence">How we check</Link>
        </span>
      </div>
    </div>
  );
}
