import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { offer } from "../../tests/fixtures/offer";
import { GetDealButton } from "./GetDealButton";
it("labels paid links and marks them sponsored", () => {
  const html = renderToStaticMarkup(<GetDealButton offer={offer({ affiliate: true })} />);
  expect(html).toContain('rel="sponsored nofollow"');
  expect(html).toContain("Affiliate link");
});
it("does not claim commission on an unpaid link", () => {
  const html = renderToStaticMarkup(<GetDealButton offer={offer()} />);
  expect(html).toContain('rel="nofollow"');
  expect(html).not.toContain("Affiliate link");
});
