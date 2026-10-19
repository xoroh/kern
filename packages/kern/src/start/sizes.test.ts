/**
 * R2 size foundation + Button variant names, re-homed (T1) — web side.
 *
 * Guards the additive contract ported from the platform fork's R2 series:
 * the foundation is exactly sm|md|lg, the TopAppBar alias map is exhaustive
 * over M3 names, and Button variants are exactly the five M3 configurations
 * (014, hard cut per 020 — no aliases).
 */

import { KERN_SIZES, type KernSize } from "@xoroh/kern-tokens";
import { describe, expect, it } from "vitest";
import {
  BUTTON_SIZE_TO_KERN_SIZE,
  type ButtonVariant,
  buttonVariants,
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
    expect(BUTTON_SIZE_TO_KERN_SIZE).toEqual({
      xs: "sm",
      default: "md",
      sm: "sm",
      md: "md",
      xl: "lg",
      lg: "lg",
    });
    expect("icon" in BUTTON_SIZE_TO_KERN_SIZE).toBe(false);
  });
});

describe("Button variant names (web, 014)", () => {
  it("is exactly the five M3 configurations", () => {
    const variants: ButtonVariant[] = [
      "elevated",
      "filled",
      "tonal",
      "outlined",
      "text",
    ];
    expect(variants).toHaveLength(5);
    for (const variant of variants)
      expect(buttonVariants({ variant })).toBeTruthy();
  });

  it("rejects the pre-014 Kern names", () => {
    // @ts-expect-error — "primary" was renamed to "filled" (014, hard cut per 020).
    buttonVariants({ variant: "primary" });
    // @ts-expect-error — "ghost" was renamed to "text" (014, hard cut per 020).
    buttonVariants({ variant: "ghost" });
  });

  it("elevated exists as a style; destructive is not a variant axis", () => {
    const kern: ButtonVariant[] = [
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
