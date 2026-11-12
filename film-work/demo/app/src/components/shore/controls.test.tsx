import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Checkbox, Dropdown, RangeFilter, Segmented, ShoreButton, ShorePill, Toggle } from "./controls";

const noop = () => undefined;

describe("Shore controls", () => {
  it("keeps original button and pill classes without accidental form submission", () => {
    expect(renderToStaticMarkup(<ShoreButton primary>Apply</ShoreButton>)).toContain('type="button" class="btn btn--primary"');
    expect(renderToStaticMarkup(<ShorePill>Compare</ShorePill>)).toContain('class="pill"');
  });
  it("announces the selected segment", () => {
    const html = renderToStaticMarkup(<Segmented label="View" options={[{ value: "list", label: "List" }, { value: "cards", label: "Cards" }]} value="cards" onChange={noop}/>);
    expect(html).toContain('role="group" aria-label="View"');
    expect(html).toContain('aria-pressed="true">Cards');
  });
  it("uses labelled native checkboxes/switches with decorative SVG hidden", () => {
    const html = renderToStaticMarkup(<><Toggle label="IPv4 included" checked onChange={noop}/><Checkbox label="France" checked={false} count={12} onChange={noop}/></>);
    expect(html).toContain('role="switch"');
    expect(html).toContain('class="tgl__t" aria-hidden="true"');
    expect(html).toContain('class="ck__box" aria-hidden="true"');
    expect(html).toContain('class="ck__n num">12');
  });
  it("preserves native-select server fallback and escapes external labels", () => {
    const html = renderToStaticMarkup(<Dropdown id="sort" label="Sort" value="price" options={[{ value: "price", label: '<script>bad</script>' }]} onChange={noop}/>);
    expect(html).toContain('<select class="select" id="sort"');
    expect(html).toContain('&lt;script&gt;bad&lt;/script&gt;');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('class="select dd__btn"');
  });
  it("maps range step indices to meaningful values and connected output", () => {
    const html = renderToStaticMarkup(<RangeFilter id="ram" label="Memory" icon="ram" steps={[null, 1, 2, 4, 8]} value={4} text={value => value == null ? "Any" : value + " GB or more"} endpoint={value => value == null ? "Any" : value + " GB"} onChange={noop}/>);
    expect(html).toContain('class="fl fl--rng"');
    expect(html).toContain('for="r-ram"');
    expect(html).toContain('aria-valuetext="4 GB or more"');
    expect(html).toContain('value="3"');
  });
});
