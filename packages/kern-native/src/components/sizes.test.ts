/**
 * R2 size foundation + variant map, re-homed (T1) — native side.
 *
 * Mirrors `packages/kern/src/start/sizes.test.ts`. The Button codemod map
 * covers exactly the automatically-migratable sizes (`icon` is shape, not
 * scale — intentionally absent), and the M3 aliases resolve to existing
 * styles only (`filled`→primary, `text`→ghost; `elevated` exists natively).
 */
import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import { KERN_SIZES, type KernSize } from "@xoroh/kern-tokens";
import {
  NATIVE_BUTTON_SIZE_TO_KERN_SIZE,
  NATIVE_BUTTON_VARIANT_ALIASES,
  type NativeButtonM3Variant,
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
      default: "md",
      sm: "sm",
    });
    expect("icon" in NATIVE_BUTTON_SIZE_TO_KERN_SIZE).toBe(false);
  });
});

describe("Button variant map (native)", () => {
  it("M3 aliases resolve to existing Kern styles", () => {
    expect(NATIVE_BUTTON_VARIANT_ALIASES).toEqual({
      filled: "primary",
      text: "ghost",
    });
    const m3: NativeButtonM3Variant[] = ["filled", "text"];
    for (const m of m3)
      expect(["primary", "ghost"]).toContain(NATIVE_BUTTON_VARIANT_ALIASES[m]);
  });

  it("elevated exists as a style; destructive is not a variant axis", () => {
    const kern: NativeButtonVariant[] = [
      "elevated",
      "primary",
      "tonal",
      "outlined",
      "ghost",
    ];
    expect(kern).toContain("elevated");
    expect(kern).not.toContain("destructive");
  });
});
