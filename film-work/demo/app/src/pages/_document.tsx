import Document, { Html, Head, Main, NextScript, type DocumentContext } from "next/document";
import { BrandSymbols } from "@/components/brand/symbols";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { themeBootstrapScript } from "@/lib/theme-bootstrap";
import { ShoreSprite } from "@/components/ui/ShoreSprite";
import { getPublicCatalogMeta, ShoreCatalogMeta } from "@/lib/public-catalog";
import { requestCatalogMeta } from "@/lib/catalog-request-meta";

/** Static artwork and footer links need no browser hydration. */
export default class CatalogDocument extends Document<{ nonce?: string; footerMeta: ShoreCatalogMeta }> {
  static async getInitialProps(context: DocumentContext) {
    const nonce = context.req?.headers["x-nonce"];
    const rendered = await Document.getInitialProps(context);
    return { ...rendered, footerMeta: requestCatalogMeta(context.res) ?? getPublicCatalogMeta(), nonce: typeof nonce === "string" ? nonce : undefined };
  }
  render() {
    return <Html lang="en" data-theme="night">
      <Head nonce={this.props.nonce}><script nonce={this.props.nonce} dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} /></Head>
      <body><ShoreSprite /><BrandSymbols /><Main /><SiteFooter year={new Date().getFullYear()} meta={this.props.footerMeta} /><NextScript nonce={this.props.nonce} /></body>
    </Html>;
  }
}
