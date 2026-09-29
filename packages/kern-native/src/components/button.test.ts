import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import { themes } from "@xoroh/kern-theme";
import { buttonStyles } from "./button";

describe("native Button styles", () => {
  it("uses M3 S metrics with full radius", () => {
    const { container } = buttonStyles("primary", "default", false);
    expect(container.height).toBe(40);
    expect(container.borderRadius).toBe(
      Number.parseFloat(themes.m3.radius.full),
    );
  });

  it("resolves variants to roles", () => {
    expect(
      buttonStyles("primary", "default", false).container.backgroundColor,
    ).toBe(themes.m3.color.light.primary);
    expect(
      buttonStyles("tonal", "default", false).container.backgroundColor,
    ).toBe(themes.m3.color.light.surfaceTonal);
    expect(
      buttonStyles("ghost", "default", false).container.backgroundColor,
    ).toBe("transparent");
  });

  it("dims when disabled", () => {
    expect(buttonStyles("primary", "default", true).container.opacity).toBe(
      0.5,
    );
  });
});
