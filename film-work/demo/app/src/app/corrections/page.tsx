import type { Metadata } from "next";
import { ShoreCorrectionForm } from "@/components/shore/ShoreCorrectionForm";

export const metadata: Metadata = {
  title: "Submit a correction",
  description: "Send a sourced correction for a VPS offer or provider.",
  alternates: { canonical: "https://bestvpsforme.com/corrections" },
};

type Props = { searchParams: Promise<{ plan?: string }> };

export default async function CorrectionsPage({ searchParams }: Props) {
  const { plan } = await searchParams;
  return (
    <main id="main">
      <div className="page wrap">
        <ShoreCorrectionForm planId={plan} />
      </div>
    </main>
  );
}
