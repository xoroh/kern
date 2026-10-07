import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import { themes, resolveThemeDetails } from "@xoroh/kern-tokens";
import { buttonStyles } from "./button";

describe("native Button styles", () => {
  it("uses M3 S metrics with full radius", () => {
    const { container } = buttonStyles("primary", "default", false);
    expect(container.height).toBe(40);
    expect(container.borderRadius).toBe(
      Number.parseFloat(themes.kern.radius.full),
    );
  });

  it("resolves variants to roles", () => {
    // M3's five colour configurations (m3.material.io/components/buttons/overview):
    // elevated, filled, tonal, outlined, text. `tonal` is the SECONDARY container,
    // not kern's `surfaceTonal`, and `outlined`/`text` have no fill.
    expect(
      buttonStyles("primary", "default", false).container.backgroundColor,
    ).toBe(themes.kern.color.light.primary);
    expect(
      buttonStyles("tonal", "default", false).container.backgroundColor,
    ).toBe(themes.kern.color.light.secondaryContainer);
    expect(
      buttonStyles("elevated", "default", false).container.backgroundColor,
    ).toBe(themes.kern.color.light.surfaceContainerLow);
    expect(
      buttonStyles("ghost", "default", false).container.backgroundColor,
    ).toBe("transparent");
    expect(
      buttonStyles("outlined", "default", false).container.borderWidth,
    ).toBe(1);
  });

  it("dims when disabled", () => {
    expect(buttonStyles("primary", "default", true).container.opacity).toBe(
      0.5,
    );
  });

  it("sizes xs and xl onto the sm and lg bands", () => {
    expect(buttonStyles("primary", "xs", false).container.height).toBe(28);
    expect(buttonStyles("primary", "xl", false).container.height).toBe(48);
    // Untouched bands hold their metrics.
    expect(buttonStyles("primary", "default", false).container.height).toBe(
      40,
    );
    expect(buttonStyles("primary", "sm", false).container.height).toBe(32);
  });

  it("keeps the 8dp icon gap always on", () => {
    // A lone label never feels it; an icon beside a label always gets it —
    // same rule as web's flex gap, so RTL needs no insets.
    for (const size of ["xs", "default", "sm", "xl", "icon"] as const) {
      expect(buttonStyles("primary", size, false).container.gap).toBe(8);
    }
  });

  it("paints danger per variant through the color option", () => {
    const light = resolveThemeDetails("light");
    expect(
      buttonStyles("primary", "default", false, light, { color: "danger" })
        .container.backgroundColor,
    ).toBe(themes.kern.color.light.error);
    expect(
      buttonStyles("tonal", "default", false, light, { color: "danger" })
        .container.backgroundColor,
    ).toBe(themes.kern.color.light.errorContainer);
    // Positional callers keep the primary treatment — the option defaults.
    expect(
      buttonStyles("primary", "default", false).container.backgroundColor,
    ).toBe(themes.kern.color.light.primary);
  });

  it("selects the corner role through the shape option", () => {
    const light = resolveThemeDetails("light");
    expect(
      buttonStyles("primary", "default", false, light, { shape: "square" })
        .container.borderRadius,
    ).toBe(Number.parseFloat(light.shape.none));
    expect(
      buttonStyles("primary", "default", false, light, { shape: "rounded" })
        .container.borderRadius,
    ).toBe(Number.parseFloat(light.shape.large));
  });

  it("stretches with the block option", () => {
    const light = resolveThemeDetails("light");
    expect(
      buttonStyles("primary", "default", false, light, { block: true })
        .container.alignSelf,
    ).toBe("stretch");
    expect(
      buttonStyles("primary", "default", false).container.alignSelf,
    ).toBeUndefined();
  });
});
