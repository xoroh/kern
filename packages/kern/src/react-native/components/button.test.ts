import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../../test-doubles/react-native"),
);

import { buttonStyles } from "./button";

describe("native Button styles", () => {
  it("uses M3 S metrics with full radius", () => {
    const { container } = buttonStyles("primary", "default", false);
    expect(container.height).toBe(40);
    expect(container.borderRadius).toBe(999);
  });

  it("resolves variants to roles", () => {
    expect(
      buttonStyles("primary", "default", false).container.backgroundColor,
    ).toBe("#000000");
    expect(
      buttonStyles("tonal", "default", false).container.backgroundColor,
    ).toBe("#e5e5e5");
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
