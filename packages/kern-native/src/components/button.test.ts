import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import { themes } from "@xoroh/kern-tokens";
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
});
