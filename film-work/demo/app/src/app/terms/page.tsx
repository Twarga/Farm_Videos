import type { Metadata } from "next";
import Link from "next/link";
import { DocLayout } from "@/components/shore/DocLayout";

export const metadata: Metadata = {
  title: "Terms and disclosures",
  description: "Plain-language terms for using bestvpsforme and its VPS comparisons.",
  alternates: { canonical: "https://bestvpsforme.com/terms" },
};

export default function TermsPage() {
  return (
    <main id="main">
      <DocLayout
        kicker="Legal"
        title="Terms of use"
        lead="bestvpsforme is a comparison guide. The provider's checkout is the final word on price."
        note={<p className="fine">Updated 2 September 2026</p>}
        sections={[
          {
            id: "info",
            heading: "Information, not an offer",
            content: (
              <p>
                We show prices and terms as published by providers on the date shown. Prices
                change. Confirm everything at checkout before you buy.
              </p>
            ),
          },
          {
            id: "nowarranty",
            heading: "No guarantee",
            content: (
              <p>
                We work to keep the data correct and say when a fact is missing, but we
                can&apos;t guarantee every number. We are not responsible for a provider&apos;s
                service.
              </p>
            ),
          },
          {
            id: "affiliates",
            heading: "Third-party links and affiliates",
            content: (
              <p>
                Links to providers leave this site and are governed by the provider&apos;s own
                terms and privacy policy. Some links may be affiliate links that earn a
                commission. Commission, sponsorship, and conversion data never determine our
                ranking or editorial conclusions. Read the{" "}
                <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
              </p>
            ),
          },
          {
            id: "use",
            heading: "Fair use",
            content: (
              <p>
                You can link to any page and quote our data with a link back. Please don&apos;t
                copy the catalog in bulk or load the site in ways that slow it down for others.
              </p>
            ),
          },
          {
            id: "copyright",
            heading: "Copyright and trademarks",
            content: (
              <p>
                Unless stated otherwise, the bestvpsforme name, original writing, data
                presentation, and code are &copy; 2026 bestvpsforme. Provider names, logos,
                product names, and trademarks belong to their respective owners. Their display
                is for identification and comparison; it does not imply endorsement or
                partnership.
              </p>
            ),
          },
          {
            id: "changes",
            heading: "Changes",
            content: (
              <p>
                We may update these terms. The date at the top of this page will change when
                we do. If you find a factual or copyright issue, use the{" "}
                <Link href="/corrections">corrections form</Link> or email{" "}
                <a href="mailto:hello@bestvpsforme.com">hello@bestvpsforme.com</a>.
              </p>
            ),
          },
        ]}
      />
    </main>
  );
}
