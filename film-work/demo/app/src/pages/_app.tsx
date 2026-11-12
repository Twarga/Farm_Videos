import Head from "next/head";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { CompareProvider } from "@/components/CompareProvider";
import { SiteFrame } from "@/components/shell/SiteFrame";
import { PagesNavigationProvider } from "@/components/navigation/PagesNavigation";
import "../app/globals.css";

const ubuntuSans = localFont({ src: "../app/fonts/ubuntu-sans.woff2", variable: "--font-ubuntu-sans", weight: "100 800", display: "swap", fallback: ["system-ui", "sans-serif"] });
const ubuntuSansMono = localFont({ src: [{ path: "../app/fonts/ubuntu-sans-mono-400.woff2", weight: "400", style: "normal" }, { path: "../app/fonts/ubuntu-sans-mono-500.woff2", weight: "500 700", style: "normal" }], variable: "--font-ubuntu-sans-mono", display: "swap", fallback: ["ui-monospace", "monospace"] });

export default function CatalogApp({ Component, pageProps }: AppProps) {
  // The Pages route supplies the server-rendered crab so the art stays out of this bundle.
  const crabArt = (pageProps as { headerCrabArt?: string }).headerCrabArt ?? "";
  return <><Head><style>{`:root{--font-ubuntu-sans:${ubuntuSans.style.fontFamily};--font-ubuntu-sans-mono:${ubuntuSansMono.style.fontFamily}}`}</style></Head><PagesNavigationProvider><CompareProvider><SiteFrame brand={null} crabArt={crabArt} footer={null}><Component {...pageProps} /></SiteFrame></CompareProvider></PagesNavigationProvider></>; }
