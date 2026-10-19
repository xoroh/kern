/**
 * A4-1 comp-override proof — real computed styles in a real browser.
 *
 * jsdom unit tests assert the wiring (the `var(--comp-x, var(--sys-y))`
 * class is present); they cannot resolve CSS variables or Tailwind output.
 * This spec proves, against the production site build, that:
 *  1. each wired slot's fallback resolves to the pre-A4-1 rendered value, and
 *  2. setting the `--comp-*` variable on an ancestor changes the property.
 *
 * If Tailwind failed to compile the arbitrary-value syntax, every computed
 * value below would be empty/0px and this spec would fail loudly.
 *
 * Assertion discipline (AUD-006): exact `toBe` on the computed radius —
 * no substring matching (`"999px"` would also match `"9999px"`) — and
 * condition polling instead of fixed sleeps (components transition
 * `border-radius` over 200 ms, so the override read polls until settled).
 */
import { expect, test } from "@playwright/test";

const CASES = [
  {
    page: "/components/m3/button",
    selector: ".kern-button",
    variable: "--comp-button-container-shape",
    // corner-full = 9999px per the shape scale.
    fallback: "9999px",
    override: "4px",
  },
  {
    page: "/components/m3/card",
    selector: ".kern-card",
    variable: "--comp-card-container-shape",
    fallback: "12px",
    override: "4px",
  },
  {
    page: "/components/m3/chip",
    selector: ".kern-chip",
    variable: "--comp-chip-container-shape",
    fallback: "8px",
    override: "4px",
  },
  {
    page: "/components/m3/switch",
    selector: ".kern-switch",
    variable: "--comp-switch-track-shape",
    fallback: "9999px",
    override: "4px",
  },
  {
    page: "/components/m3/input",
    selector: '[data-slot="input"]',
    variable: "--comp-text-field-container-shape",
    fallback: "4px",
    override: "12px",
  },
] as const;

test.describe("component-token overrides (A4-1)", () => {
  for (const c of CASES) {
    test(`${c.variable} falls back and overrides on ${c.page}`, async ({
      page,
    }) => {
      await page.goto(c.page, { waitUntil: "networkidle" });
      const target = page.locator(c.selector).first();
      await expect(target).toBeVisible();

      await expect
        .poll(
          () => target.evaluate((el) => getComputedStyle(el).borderRadius),
          `${c.variable} fallback did not resolve to ${c.fallback}`,
        )
        .toBe(c.fallback);

      await page.evaluate(
        ([variable, value]) =>
          document.documentElement.style.setProperty(variable, value),
        [c.variable, c.override] as [string, string],
      );
      await expect
        .poll(
          () => target.evaluate((el) => getComputedStyle(el).borderRadius),
          `${c.variable} override to ${c.override} did not apply`,
        )
        .toBe(c.override);
    });
  }
});
