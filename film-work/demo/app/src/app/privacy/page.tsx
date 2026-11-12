import type { Metadata } from "next";
import { DocLayout } from "@/components/shore/DocLayout";

export const metadata: Metadata = {
  title: "Privacy and cookies",
  description: "How bestvpsforme measures usage while protecting visitors.",
  alternates: { canonical: "https://bestvpsforme.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main">
      <DocLayout
        kicker="Legal"
        title="Privacy"
        lead="Short version: no accounts, no ad trackers, and your compare list stays in your browser."
        sections={[
          {
            id: "collect",
            heading: "What we collect",
            content: (
              <ul>
                <li>
                  <b>Nothing to sign up for.</b> You can use every page without an account.
                </li>
                <li>
                  <b>Your browser keeps your choices.</b> The compare list, theme and view
                  settings are stored in your browser&apos;s local storage. Your needs from the
                  finder last only for the browser session.
                </li>
                <li>
                  <b>Server logs.</b> Like every website, our server records requests (IP
                  address, browser, page) to keep the site running and safe. Logs are deleted
                  after a short period.
                </li>
                <li>
                  <b>Analytics events.</b> We record page views, outbound clicks, and comparison
                  events using a one-way hash of a rotating session token. We do not store raw
                  IP addresses or full user-agent strings. If your browser sends Do Not Track,
                  analytics events are not created.
                </li>
                <li>
                  <b>Messages you send.</b> If you email us or send a correction, we keep the
                  message and your email address to reply. A correction&apos;s email address is
                  deleted 90 days after we resolve it.
                </li>
              </ul>
            ),
          },
          {
            id: "links",
            heading: "Provider links",
            content: (
              <p>
                When you click through to a provider, their site has its own privacy policy.
                Affiliate links may let the provider know that you came from us.
              </p>
            ),
          },
          {
            id: "retention",
            heading: "Retention",
            content: (
              <p>
                Raw analytics event rows are kept for up to 13 months, then aggregated or
                deleted. A correction keeps its claim, cited source and resolution note; the
                email address attached to it is deleted 90 days after the correction is
                resolved. Confirmed financial records are retained only as long as accounting
                and tax rules require.
              </p>
            ),
          },
          {
            id: "rights",
            heading: "Your choices",
            content: (
              <p>
                Clear your browser storage to remove your compare list and settings. To see or
                delete a message you sent us, write to{" "}
                <a href="mailto:privacy@bestvpsforme.com">privacy@bestvpsforme.com</a>.
              </p>
            ),
          },
        ]}
      />
    </main>
  );
}
