import Link from "next/link";
import type { Metadata } from "next";
import { DocLayout } from "@/components/shore/DocLayout";

export const metadata: Metadata = {
  title: "About bestvpsforme",
  description: "How bestvpsforme researches VPS plans, handles corrections, and keeps affiliate incentives out of ranking.",
  alternates: { canonical: "https://bestvpsforme.com/about" },
};

export default function AboutPage() {
  return (
    <main id="main">
      <DocLayout
        kicker="About"
        title="bestvpsforme"
        lead="A comparison guide for VPS plans. Every number has a source and a date."
        sections={[
          {
            id: "how",
            heading: "How we check plans",
            content: (
              <p>
                We record the source, check date, billing term, price, hardware, locations,
                provider review score, and any missing or uncertain detail. We do not invent
                values when a provider leaves a field out.
              </p>
            ),
          },
          {
            id: "corrections",
            heading: "Corrections",
            content: (
              <p>
                See a wrong number or location? Send the source through{" "}
                <Link href="/corrections">the corrections form</Link>. We keep a visible date
                when we update a material fact.
              </p>
            ),
          },
          {
            id: "links",
            heading: "How links work",
            content: (
              <p>
                Some provider links may pay us a commission. That payment does not decide which
                plans we recommend or where they appear. Read the{" "}
                <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
              </p>
            ),
          },
          {
            id: "privacy",
            heading: "Privacy",
            content: (
              <p>
                We measure which pages and links help visitors, without building advertising
                profiles. Read the <Link href="/privacy">privacy notice</Link>.
              </p>
            ),
          },
        ]}
        after={
          <p className="fine" style={{ marginTop: "2rem" }}>
            Read the <Link href="/guides">beginner guides</Link> or browse the{" "}
            <Link href="/catalog">published VPS plans</Link>.
          </p>
        }
      />
    </main>
  );
}
