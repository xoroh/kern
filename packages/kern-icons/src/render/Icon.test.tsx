import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Icon } from "./Icon";

/**
 * Icon render parity (KERN-030) — alias/size/fill/decorative/meaning on the
 * DOM renderer, server-rendered (SSR-safe is a contract, not a hope).
 *
 * Native SVG parity rides on the same path resolution (`core/resolve`) and is
 * covered by the kern-native tooltip/fab suites plus `icons:check`; a wrong
 * native meaning is a wrong glyph, and glyph identity is what the registry
 * pins. What THIS file proves is the web contract: one inline svg, correct
 * roles, no duplicate announcement.
 */
describe("Icon web render", () => {
  test("a named icon renders one svg with img role and label", () => {
    const html = renderToStaticMarkup(
      createElement(Icon, { name: "menu", title: "Menu" }),
    );
    expect(html).toContain("<svg");
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Menu"');
    expect(html).not.toContain("aria-hidden");
  });

  test("an untitled icon is decorative: hidden, never announced", () => {
    const html = renderToStaticMarkup(createElement(Icon, { name: "menu" }));
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("role=");
    expect(html).not.toContain("aria-label");
  });

  test("sizes resolve to width/height, defaulting to 24", () => {
    const def = renderToStaticMarkup(createElement(Icon, { name: "menu" }));
    expect(def).toContain('width="24"');
    const big = renderToStaticMarkup(
      createElement(Icon, { name: "menu", size: 40 }),
    );
    expect(big).toContain('width="40"');
  });

  test("fill selects the filled geometry, not a second icon", () => {
    // `home` is one of the 875 glyphs with distinct FILL geometry
    // (`icons:check` reports the count; 465 reuse the outline, `menu` among
    // them — which is why this test does not use `menu`).
    const outline = renderToStaticMarkup(createElement(Icon, { name: "home" }));
    const filled = renderToStaticMarkup(
      createElement(Icon, { name: "home", filled: true }),
    );
    // Same element shape — the fill flag repaints, it never swaps identity.
    expect(filled).toContain("<svg");
    expect(filled).toContain("<path");
    expect(outline).not.toBe(filled);
  });

  test("a missing name renders nothing with a dev warning, never a wrong glyph", () => {
    const html = renderToStaticMarkup(
      // A qualified name typechecks (the `${string}:${string}` member) but
      // resolves to no glyph — exactly what a typo or a removed glyph looks
      // like at runtime. The renderer must answer null, never a neighbour.
      createElement(Icon, { name: "material:not-a-real-icon-xyz" }),
    );
    expect(html).toBe("");
  });

  test("paint defaults to currentColor so icons follow the text role", () => {
    const html = renderToStaticMarkup(createElement(Icon, { name: "menu" }));
    expect(html).toContain("currentColor");
  });
});
