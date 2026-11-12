import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { AppNavigationProvider } from "@/components/navigation/AppNavigation";
import { CompareProvider } from "@/components/CompareProvider";
import { SiteFrame } from "@/components/shell/SiteFrame";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { BrandSymbols } from "@/components/brand/symbols";
import { ShoreSprite } from "@/components/ui/ShoreSprite";
import { themeBootstrapScript } from "@/lib/theme-bootstrap";
import { headerCrabArt } from "@/lib/shell-art.server";
import "./globals.css";
import { getPublicCatalogMeta } from "@/lib/public-catalog";

// ── Highlighter fonts (admin + legacy surfaces) ──────────────────────
// ── Shore fonts (public routes) ──────────────────────────────────────
// Ubuntu Sans variable (100–800 weight range) — matches mockup @font-face
const ubuntuSans = localFont({
  src: "./fonts/ubuntu-sans.woff2",
  variable: "--font-ubuntu-sans",
  weight: "100 800",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

// Ubuntu Sans Mono — two files: 400 and 500/700
const ubuntuSansMono = localFont({
  src: [
    { path: "./fonts/ubuntu-sans-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ubuntu-sans-mono-500.woff2", weight: "500 700", style: "normal" },
  ],
  variable: "--font-ubuntu-sans-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bestvpsforme.com"),
  title: {
    default: "bestvpsforme",
    template: "%s · bestvpsforme",
  },
  description:
    "Compare VPS prices, hardware, locations and billing terms. Reviewed costs and missing evidence are labeled.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://bestvpsforme.com/",
    siteName: "bestvpsforme",
    title: "Compare VPS plans · bestvpsforme",
    description:
      "Compare VPS prices, hardware, locations and billing terms. Reviewed costs and missing evidence are labeled.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare VPS plans · bestvpsforme",
    description:
      "Compare VPS prices, hardware, locations and billing terms. Reviewed costs and missing evidence are labeled.",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  // Admin documents render bare: the public brand symbols, header art and footer would only add payload.
  const publicChrome = !(requestHeaders.get("x-pathname") ?? "").startsWith("/admin");
  return <html lang="en" data-theme="night" className={ubuntuSans.variable + " " + ubuntuSansMono.variable} suppressHydrationWarning>
    <head><script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} /></head>
    <body><ShoreSprite /><AppNavigationProvider><CompareProvider><SiteFrame brand={publicChrome ? <BrandSymbols /> : null} crabArt={publicChrome ? headerCrabArt : null} footer={publicChrome ? <SiteFooter year={new Date().getFullYear()} meta={getPublicCatalogMeta()} /> : null}>{children}</SiteFrame></CompareProvider></AppNavigationProvider><div className="sr-only" aria-live="polite" id="live" /></body>
  </html>;
}
