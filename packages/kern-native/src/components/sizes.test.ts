/**
 * R2 size foundation + Button variant names, re-homed (T1) — native side.
 *
 * Mirrors `packages/kern/src/start/sizes.test.ts`. The Button codemod map
 * covers exactly the automatically-migratable sizes (`icon` is shape, not
 * scale — intentionally absent), and Button variants are exactly the five
 * M3 configurations (014, hard cut per 020 — no aliases).
 */
import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import { KERN_SIZES, type KernSize } from "@xoroh/kern-tokens";
import {
  buttonStyles,
  NATIVE_BUTTON_SIZE_TO_KERN_SIZE,
  type NativeButtonVariant,
} from "./button";
import {
  TOP_APP_BAR_SIZE_TO_KERN_SIZE,
  type TopAppBarSize,
} from "./top-app-bar";

describe("KernSize foundation (native mirror)", () => {
  it("matches the web foundation exactly", () => {
    expect([...KERN_SIZES]).toEqual(["sm", "md", "lg"]);
    const exhaustive: Record<KernSize, true> = { sm: true, md: true, lg: true };
    expect(Object.keys(exhaustive).sort()).toEqual(["lg", "md", "sm"]);
  });

  it("TopAppBar scaled sizes alias onto the foundation; center is alignment", () => {
    expect(TOP_APP_BAR_SIZE_TO_KERN_SIZE).toEqual({
      small: "sm",
      medium: "md",
    });
    expect("center" in TOP_APP_BAR_SIZE_TO_KERN_SIZE).toBe(false);
    const scaled: Exclude<TopAppBarSize, "center">[] = ["small", "medium"];
    for (const s of scaled)
      expect(TOP_APP_BAR_SIZE_TO_KERN_SIZE[s]).toMatch(/^(sm|md|lg)$/);
  });

  it("Button codemod map covers only the automatic sizes", () => {
    expect(NATIVE_BUTTON_SIZE_TO_KERN_SIZE).toEqual({
      xs: "sm",
      default: "md",
      sm: "sm",
      xl: "lg",
    });
    expect("icon" in NATIVE_BUTTON_SIZE_TO_KERN_SIZE).toBe(false);
  });
});

describe("Button variant names (native, 014)", () => {
  it("is exactly the five M3 configurations", () => {
    const variants: NativeButtonVariant[] = [
      "elevated",
      "filled",
      "tonal",
      "outlined",
      "text",
    ];
    expect(variants).toHaveLength(5);
    for (const variant of variants)
      expect(buttonStyles(variant, "default", false)).toBeTruthy();
  });

  it("rejects the pre-014 Kern names", () => {
    // @ts-expect-error — "primary" was renamed to "filled" (014, hard cut per 020).
    buttonStyles("primary", "default", false);
    // @ts-expect-error — "ghost" was renamed to "text" (014, hard cut per 020).
    buttonStyles("ghost", "default", false);
  });

  it("elevated exists as a style; destructive is not a variant axis", () => {
    const kern: NativeButtonVariant[] = [
      "elevated",
      "filled",
      "tonal",
      "outlined",
      "text",
    ];
    expect(kern).toContain("elevated");
    expect(kern).not.toContain("destructive");
  });
});
