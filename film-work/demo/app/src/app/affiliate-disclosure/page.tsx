import type { Metadata } from "next";
import Link from "next/link";
import { DocLayout } from "@/components/shore/DocLayout";

export const metadata: Metadata = {
  title: "Affiliate disclosure",
  description: "How provider links and commissions work on bestvpsforme.",
  alternates: { canonical: "https://bestvpsforme.com/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <main id="main">
      <DocLayout
        kicker="Legal"
        title="Affiliate disclosure"
        lead="Some links earn us a commission. They never change the order."
        sections={[
          {
            id: "what",
            heading: "What \u201cAd\u201d means",
            content: (
              <p>
                A link marked <span className="ad">Ad</span> is an affiliate link. If you buy
                through it, the provider may pay us a commission. You pay the same price.
                Commission, sponsorship, and conversion data never determine our ranking or
                editorial conclusions.
              </p>
            ),
          },
          {
            id: "order",
            heading: "It never changes the order",
            content: (
              <p>
                The value score uses price, memory per dollar, Trustpilot and evidence.
                Commission is not part of it. See{" "}
                <Link href="/methodology">how we compare</Link>. Links to providers leave
                this site and are governed by the provider&apos;s own terms and privacy policy.
              </p>
            ),
          },
          {
            id: "direct",
            heading: "Direct links",
            content: (
              <p>
                Plans without a commission are listed, ranked and linked the same way. Their
                button says <b>Direct link</b> on the plan page.
              </p>
            ),
          },
          {
            id: "questions",
            heading: "Corrections and contact",
            content: (
              <p>
                If you find a factual or copyright issue, use the{" "}
                <Link href="/corrections">corrections form</Link> or email{" "}
                <a href="mailto:hello@bestvpsforme.com">hello@bestvpsforme.com</a> with the
                source and the specific material to review.
              </p>
            ),
          },
        ]}
      />
    </main>
  );
}
