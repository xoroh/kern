import { describe, expect, test } from "vitest";
import { contrastRatio } from "./contrast";
import { type CustomTheme, resolveThemeDetails } from "./resolve";
import { themeFromSeed } from "./seed-theme";
import { XOROH_PRESET } from "./xoroh-preset";

/**
 * Custom/seed/host integration (KERN-023) — overrides, contrast, seeds and
 * the Xoroh compatibility artifact behave across contexts.
 *
 * Precedence is load-bearing and documented: base(mode) → contrast overlay →
 * preset overrides. A theme that changes precedence incidentally changes every
 * high-contrast screen, so the order is asserted, not assumed.
 */
describe("custom theme integration", () => {
  test("preset overrides win over contrast overlays, in every contrast", () => {
    const custom: CustomTheme = {
      id: "probe",
      extends: "material-3",
      overrides: {
        color: {
          light: { primary: "#123456" },
          dark: { primary: "#654321" },
        },
      },
    };
    for (const contrast of ["standard", "medium", "high"] as const) {
      const light = resolveThemeDetails("light", contrast, custom).color;
      const dark = resolveThemeDetails("dark", contrast, custom).color;
      expect(light.primary, `light/${contrast}`).toBe("#123456");
      expect(dark.primary, `dark/${contrast}`).toBe("#654321");
    }
  });

  test("seeds resolve on both modes with readable on-colors", () => {
    const theme = themeFromSeed("#6750a4", "probe-seed");
    for (const mode of ["light", "dark"] as const) {
      const { color } = resolveThemeDetails(mode, "standard", theme);
      expect(
        contrastRatio(color.onPrimary, color.primary),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(color.onSecondaryContainer, color.secondaryContainer),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("the Xoroh preset converts on all six contexts without holes", () => {
    const baseRoles = Object.keys(
      resolveThemeDetails("light", "standard", "material-3").color,
    );
    for (const mode of ["light", "dark"] as const) {
      for (const contrast of ["standard", "medium", "high"] as const) {
        const { color } = resolveThemeDetails(mode, contrast, XOROH_PRESET);
        for (const role of baseRoles) {
          expect(
            (color as unknown as Record<string, string>)[role],
            `${mode}/${contrast}.${role}`,
          ).toMatch(/^#[0-9a-f]{6}$/i);
        }
      }
    }
  });

  test("scoped subtree deltas are standard-contrast only — stated, not extended silently", () => {
    // pipeline.scopedDeltas projects [data-kern-theme] blocks from the matrix
    // for standard contrast. Nested preset+contrast propagation is NOT covered
    // by that projection today; this pins the boundary so extending it is a
    // deliberate change with its own tests, not an accidental one.
    const { color: standard } = resolveThemeDetails(
      "light",
      "standard",
      XOROH_PRESET,
    );
    const { color: high } = resolveThemeDetails("light", "high", XOROH_PRESET);
    // The preset's secondary override applies identically in both contrasts…
    expect(standard.secondary).toBe(high.secondary);
    // …while the contrast overlay still moves the roles it owns.
    expect(standard.outline).not.toBe(high.outline);
  });
});
