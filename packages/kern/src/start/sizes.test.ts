/**
 * R2 size foundation + variant map, re-homed (T1) — web side.
 *
 * Guards the additive contract ported from the platform fork's R2 series:
 * the foundation is exactly sm|md|lg, the TopAppBar alias map is exhaustive
 * over M3 names, and the Button M3 aliases resolve to existing styles only
 * (`filled`→primary, `text`→ghost; `elevated` exists, `destructive` absent).
 */

import { KERN_SIZES, type KernSize } from "@xoroh/kern-tokens";
import { describe, expect, it } from "vitest";
import {
  BUTTON_SIZE_TO_KERN_SIZE,
  BUTTON_VARIANT_ALIASES,
  type ButtonM3Variant,
  type ButtonVariant,
} from "../components/button";
import {
  TOP_APP_BAR_SIZE_TO_KERN_SIZE,
  type TopAppBarSize,
} from "./top-app-bar";

describe("KernSize foundation (web)", () => {
  it("is exactly sm|md|lg", () => {
    expect([...KERN_SIZES]).toEqual(["sm", "md", "lg"]);
    const exhaustive: Record<KernSize, true> = { sm: true, md: true, lg: true };
    expect(Object.keys(exhaustive).sort()).toEqual(["lg", "md", "sm"]);
  });

  it("TopAppBar M3 names alias onto the foundation exhaustively", () => {
    expect(TOP_APP_BAR_SIZE_TO_KERN_SIZE).toEqual({
      small: "sm",
      medium: "md",
      large: "lg",
    });
    const sizes: TopAppBarSize[] = ["small", "medium", "large"];
    for (const s of sizes)
      expect(TOP_APP_BAR_SIZE_TO_KERN_SIZE[s]).toMatch(/^(sm|md|lg)$/);
  });

  it("Button sizes map onto the foundation; icon is shape, not scale", () => {
    expect(BUTTON_SIZE_TO_KERN_SIZE).toEqual({ default: "md", sm: "sm" });
    expect("icon" in BUTTON_SIZE_TO_KERN_SIZE).toBe(false);
  });
});

describe("Button variant map (web)", () => {
  it("M3 aliases resolve to existing Kern styles", () => {
    expect(BUTTON_VARIANT_ALIASES).toEqual({
      filled: "primary",
      text: "ghost",
    });
    const m3: ButtonM3Variant[] = ["filled", "text"];
    for (const m of m3)
      expect(["primary", "ghost"]).toContain(BUTTON_VARIANT_ALIASES[m]);
  });

  it("elevated exists as a style; destructive is not a variant axis", () => {
    const kern: ButtonVariant[] = [
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
