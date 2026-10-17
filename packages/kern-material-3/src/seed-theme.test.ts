import { contrastIssues, resolveThemeDetails } from "@xoroh/kern-tokens";
import { describe, expect, it } from "vitest";
import { M3_ROLES } from "./kern-roles";
import { MATERIAL_3_POLICY } from "./material-3";
import "./material-3";
import { themeFromSeed } from "./seed-theme";

describe("themeFromSeed (HCT engine per ADR-021)", () => {
  it("generates full M3 scheme roles (45 spec roles) from one hex", () => {
    const theme = themeFromSeed("#6750a4", "seed-purple");
    expect(theme.id).toBe("seed-purple");
    expect(theme.extends).toBe("material-3");
    for (const mode of ["light", "dark"] as const) {
      const roles = Object.keys(theme.overrides.color?.[mode] ?? {}).sort();
      expect(roles).toEqual([...M3_ROLES].sort());
      expect(roles).toHaveLength(45);
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

  describe("golden tests against @material/material-color-utilities reference output", () => {
    it("matches M3 purple baseline (#6750a4) reference output light and dark", () => {
      const theme = themeFromSeed("#6750a4", "golden-purple");
      const light = theme.overrides.color?.light ?? {};
      const dark = theme.overrides.color?.dark ?? {};

      // Light goldens from SchemeTonalSpot
      expect(light.primary).toBe("#65558f");
      expect(light.onPrimary).toBe("#ffffff");
      expect(light.primaryContainer).toBe("#e9ddff");
      expect(light.onPrimaryContainer).toBe("#4d3d75");
      expect(light.secondary).toBe("#625b71");
      expect(light.secondaryContainer).toBe("#e8def8");
      expect(light.tertiary).toBe("#7e5260");
      expect(light.tertiaryContainer).toBe("#ffd9e3");
      expect(light.surface).toBe("#fdf7ff");
      expect(light.onSurface).toBe("#1d1b20");
      expect(light.error).toBe("#ba1a1a");
      expect(light.primaryFixed).toBe("#e9ddff");

      // Dark goldens from SchemeTonalSpot
      expect(dark.primary).toBe("#cfbdfe");
      expect(dark.onPrimary).toBe("#36275d");
      expect(dark.primaryContainer).toBe("#4d3d75");
      expect(dark.onPrimaryContainer).toBe("#e9ddff");
      expect(dark.secondary).toBe("#cbc2db");
      expect(dark.secondaryContainer).toBe("#4a4458");
      expect(dark.tertiary).toBe("#efb8c8");
      expect(dark.tertiaryContainer).toBe("#633b48");
      expect(dark.surface).toBe("#141218");
      expect(dark.onSurface).toBe("#e6e0e9");
      expect(dark.error).toBe("#ffb4ab");
      expect(dark.primaryFixed).toBe("#e9ddff");
    });

    it("matches teal seed (#006a6a) reference output light and dark", () => {
      const theme = themeFromSeed("#006a6a", "golden-teal");
      const light = theme.overrides.color?.light ?? {};
      const dark = theme.overrides.color?.dark ?? {};

      expect(light.primary).toBe("#006a6a");
      expect(light.primaryContainer).toBe("#9cf1f0");
      expect(light.secondary).toBe("#4a6363");
      expect(light.surface).toBe("#f4fbfa");
      expect(light.outline).toBe("#6f7979");

      expect(dark.primary).toBe("#80d5d4");
      expect(dark.primaryContainer).toBe("#004f4f");
      expect(dark.secondary).toBe("#b0cccb");
      expect(dark.surface).toBe("#0e1514");
      expect(dark.outline).toBe("#889392");
    });

    it("matches blue seed (#2563eb) reference output light and dark", () => {
      const theme = themeFromSeed("#2563eb", "golden-blue");
      const light = theme.overrides.color?.light ?? {};
      const dark = theme.overrides.color?.dark ?? {};

      expect(light.primary).toBe("#4b5c92");
      expect(light.primaryContainer).toBe("#dbe1ff");
      expect(light.secondary).toBe("#595e72");
      expect(light.surface).toBe("#faf8ff");

      expect(dark.primary).toBe("#b4c5ff");
      expect(dark.primaryContainer).toBe("#324478");
      expect(dark.secondary).toBe("#c1c5dd");
      expect(dark.surface).toBe("#121318");
    });

    it("matches violet seed (#7c3aed) reference output light and dark", () => {
      const theme = themeFromSeed("#7c3aed", "golden-violet");
      const light = theme.overrides.color?.light ?? {};
      const dark = theme.overrides.color?.dark ?? {};

      expect(light.primary).toBe("#67548e");
      expect(light.primaryContainer).toBe("#eaddff");
      expect(light.surface).toBe("#fef7ff");

      expect(dark.primary).toBe("#d2bcfd");
      expect(dark.primaryContainer).toBe("#4f3d74");
      expect(dark.surface).toBe("#151218");
    });
  });
});
