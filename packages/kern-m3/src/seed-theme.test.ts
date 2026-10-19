import { contrastIssues, resolveThemeDetails } from "@xoroh/kern-tokens";
import { describe, expect, it } from "vitest";
import { MATERIAL_3_POLICY } from "./material-3";
import { themeFromSeed } from "./seed-theme";

const ACCENT_ROLES = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
];

describe("themeFromSeed", () => {
  it("repaints only the three accent families from one hex", () => {
    const theme = themeFromSeed("#6750a4", "seed-purple");
    expect(theme.id).toBe("seed-purple");
    expect(theme.extends).toBe("material-3");
    for (const mode of ["light", "dark"] as const) {
      const roles = Object.keys(theme.overrides.color?.[mode] ?? {}).sort();
      expect(roles).toEqual([...ACCENT_ROLES].sort());
      for (const value of Object.values(theme.overrides.color?.[mode] ?? {})) {
        expect(value).toMatch(/^#[\da-f]{6}$/i);
      }
    }
  });

  it("passes the contrast gate in both modes (M3 seed purple)", () => {
    const theme = themeFromSeed("#6750a4", "seed-purple");
    for (const mode of ["light", "dark"] as const) {
      const resolved = resolveThemeDetails(mode, "standard", theme);
      expect(contrastIssues(resolved.color, 4.5, 3, MATERIAL_3_POLICY)).toEqual(
        [],
      );
    }
  });

  it("passes the contrast gate for a saturated brand seed", () => {
    const theme = themeFromSeed("#7c3aed", "seed-violet");
    for (const mode of ["light", "dark"] as const) {
      const resolved = resolveThemeDetails(mode, "standard", theme);
      expect(contrastIssues(resolved.color, 4.5, 3, MATERIAL_3_POLICY)).toEqual(
        [],
      );
    }
  });

  it("derives distinct secondary/tertiary families by default", () => {
    const theme = themeFromSeed("#2563eb", "seed-blue");
    const light = theme.overrides.color?.light ?? {};
    expect(light.primary).not.toBe(light.secondary);
    expect(light.primary).not.toBe(light.tertiary);
    expect(light.secondary).not.toBe(light.tertiary);
  });

  it("honours explicit secondary/tertiary seeds", () => {
    const theme = themeFromSeed("#2563eb", "seed-trio", {
      secondarySeed: "#16a34a",
      tertiarySeed: "#a16207",
    });
    const light = theme.overrides.color?.light ?? {};
    expect(light.secondary).not.toBe(
      themeFromSeed("#2563eb", "seed-trio-2").overrides.color?.light?.secondary,
    );
  });

  it("fails loud on bad hex, bad seeds, and bad ids", () => {
    expect(() => themeFromSeed("blue", "seed-x")).toThrow("six-digit sRGB hex");
    expect(() =>
      themeFromSeed("#2563eb", "seed-x", { secondarySeed: "x" }),
    ).toThrow("secondarySeed");
    expect(() => themeFromSeed("#2563eb", "Bad_Id")).toThrow(
      "Invalid theme id",
    );
    expect(() => themeFromSeed("#2563eb", "material-3")).toThrow("reserved");
  });
});
