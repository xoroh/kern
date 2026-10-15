import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import {
  resolveThemeDetails,
} from "@xoroh/kern-tokens";
import { themes } from "@xoroh/kern-material-3";
import { buttonStyles } from "./button";

describe("native Button styles", () => {
  it("uses M3 S metrics with full radius", () => {
    const { container } = buttonStyles("primary", "default", false);
    expect(container.height).toBe(40);
    expect(container.borderRadius).toBe(
      Number.parseFloat(themes["material-3"].radius.full),
    );
  });

  it("resolves variants to roles", () => {
    // M3's five colour configurations (m3.material.io/components/buttons/overview):
    // elevated, filled, tonal, outlined, text. `tonal` is the SECONDARY container,
    // not kern's `surfaceTonal`, and `outlined`/`text` have no fill.
    expect(
      buttonStyles("primary", "default", false).container.backgroundColor,
    ).toBe(themes["material-3"].color.light.primary);
    expect(
      buttonStyles("tonal", "default", false).container.backgroundColor,
    ).toBe(themes["material-3"].color.light.secondaryContainer);
    expect(
      buttonStyles("elevated", "default", false).container.backgroundColor,
    ).toBe(themes["material-3"].color.light.surfaceContainerLow);
    expect(
      buttonStyles("ghost", "default", false).container.backgroundColor,
    ).toBe("transparent");
    expect(
      buttonStyles("outlined", "default", false).container.borderWidth,
    ).toBe(1);
  });

  it("disables to the M3 12%/38% split, never a whole dim", () => {
    const { container, label } = buttonStyles("primary", "default", true);
    // Container carries no opacity (the wash is baked into the background
    // color) so the two washes never compound.
    expect(container.opacity).toBeUndefined();
    expect(container.backgroundColor).toMatch(/#2626261f/i);
    expect(label.opacity).toBe(0.38);
    // Transparent variants keep a transparent fill when disabled.
    expect(
      buttonStyles("ghost", "default", true).container.backgroundColor,
    ).toBe("transparent");
    expect(
      buttonStyles("outlined", "default", true).container.borderColor,
    ).toMatch(/#2626261f/i);
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
    ).toBe(themes["material-3"].color.light.error);
    expect(
      buttonStyles("tonal", "default", false, light, { color: "danger" })
        .container.backgroundColor,
    ).toBe(themes["material-3"].color.light.errorContainer);
    // Positional callers keep the primary treatment — the option defaults.
    expect(
      buttonStyles("primary", "default", false).container.backgroundColor,
    ).toBe(themes["material-3"].color.light.primary);
  });

  it("selects the corner role through the shape option", () => {
    const light = resolveThemeDetails("light");
    // M3 Expressive square is per-size radii (12px at default), not 0px.
    expect(
      buttonStyles("primary", "default", false, light, { shape: "square" })
        .container.borderRadius,
    ).toBe(12);
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

describe("M3 Expressive toggle", () => {
  it("paints selected elevated/primary/tonal/outlined per the toggle table", () => {
    const light = resolveThemeDetails("light");
    expect(
      buttonStyles("elevated", "default", false, light, {
        toggle: true,
        selected: true,
      }).container.backgroundColor,
    ).toBe(light.color.primary);
    expect(
      buttonStyles("primary", "default", false, light, {
        toggle: true,
        selected: false,
      }).container.backgroundColor,
    ).toBe(light.color.surfaceContainer);
    expect(
      buttonStyles("tonal", "default", false, light, {
        toggle: true,
        selected: true,
      }).container.backgroundColor,
    ).toBe(light.color.secondary);
    expect(
      buttonStyles("outlined", "default", false, light, {
        toggle: true,
        selected: true,
      }).container.backgroundColor,
    ).toBe(light.color.inverseSurface);
  });

  it("morphs pill to square radii on select, square to pill", () => {
    const light = resolveThemeDetails("light");
    expect(
      buttonStyles("primary", "default", false, light, {
        toggle: true,
        selected: true,
      }).container.borderRadius,
    ).toBe(12);
    expect(
      buttonStyles("primary", "default", false, light, {
        toggle: true,
        selected: true,
        shape: "square",
      }).container.borderRadius,
    ).toBe(Number.parseFloat(light.shape.full));
  });

  it("ghost has no toggle treatment", () => {
    const light = resolveThemeDetails("light");
    expect(
      buttonStyles("ghost", "default", false, light, {
        toggle: true,
        selected: true,
      }).container.backgroundColor,

  it("pill follows the button-container-shape override with a full fallback", () => {
    const light = defaultScheme;
    expect(
      buttonStyles("primary", "default", false, light).container.borderRadius,
    ).toBe(Number.parseFloat(light.shape.full));
    const scheme = {
      ...light,
      comp: { "button-container-shape": "4px" },
    };
    expect(
      buttonStyles("primary", "default", false, scheme).container
        .borderRadius,
    ).toBe(4);
    // The rounded variant keeps its large-corner treatment.
    expect(
      buttonStyles("primary", "default", false, scheme, { shape: "rounded" })
        .container.borderRadius,
    ).toBe(Number.parseFloat(light.shape.large));
  });
    ).toBe("transparent");
  });
});
