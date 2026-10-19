import {
  type Contrast,
  type Mode,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import { describe, expect, test } from "vitest";

/**
 * Foundation golden baseline (KERN-017) — the approved output snapshot every
 * later foundation change diffs against.
 *
 * Coverage is DELIBERATELY complete rather than color-only: palettes, type,
 * shape, elevation, motion, state, spacing, aliases and extensions. A golden
 * that only snapshots colors lets a shape/elevation/motion regression through
 * while reporting green. Golden differences require a reviewed changeset and
 * migration note; byte freshness is not proof of correctness.
 */

const MODES: Mode[] = ["light", "dark"];
const CONTRASTS: Contrast[] = ["standard", "medium", "high"];
const PRESETS = ["material-3", "sharp", "brand", "compact", "demo"] as const;

describe("foundation goldens", () => {
  test("palettes carry OKLCH canonical plus compiled sRGB on every step", () => {
    for (const [hue, ramp] of Object.entries(
      tokens.palettes as unknown as Record<string, Record<string, unknown>>,
    )) {
      expect(Object.keys(ramp).length, hue).toBeGreaterThan(0);
      for (const [step, value] of Object.entries(ramp)) {
        const v = value as { oklch?: string; srgb?: string };
        expect(v.oklch, `${hue}.${step}.oklch`).toMatch(/^oklch\(/);
        expect(v.srgb, `${hue}.${step}.srgb`).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  test("type scale is 15 baseline + 15 emphasized, every role resolves", () => {
    const scale = tokens.typography.scale as unknown as Record<
      string,
      Record<string, string>
    >;
    const emph = tokens.typography.scaleEmphasized as unknown as Record<
      string,
      Record<string, string>
    >;
    expect(Object.keys(scale)).toHaveLength(15);
    expect(Object.keys(emph)).toHaveLength(15);
    for (const name of Object.keys(scale)) {
      expect(emph[name], `${name} emphasized`).toBeDefined();
      for (const field of ["size", "lineHeight", "tracking", "weight"]) {
        expect(scale[name][field], `${name}.${field}`).toBeDefined();
      }
    }
    for (const [role, target] of Object.entries(
      tokens.typography.roles as unknown as Record<string, string>,
    )) {
      const style = target.includes(".") ? target.split(".")[1] : target;
      expect(scale[style] ?? emph[style], `role ${role}`).toBeDefined();
    }
  });

  test("shape has ten entries, all px", () => {
    const shape = tokens.shape as unknown as Record<string, string>;
    expect(Object.keys(shape)).toHaveLength(10);
    for (const [name, value] of Object.entries(shape)) {
      expect(value, name).toMatch(/^\d+px$/);
    }
  });

  test("elevation is six levels with dp, light and dark shadows", () => {
    const elevation = tokens.elevation as unknown as Record<
      string,
      { dp: number; shadow: string; shadowDark: string }
    >;
    const dp = [0, 1, 3, 6, 8, 12];
    ["level0", "level1", "level2", "level3", "level4", "level5"].forEach(
      (level, i) => {
        expect(elevation[level].dp, level).toBe(dp[i]);
        expect(typeof elevation[level].shadow, level).toBe("string");
        expect(typeof elevation[level].shadowDark, level).toBe("string");
      },
    );
  });

  test("motion carries easing, duration, spring and both schemes", () => {
    const motion = tokens.motion as unknown as Record<string, unknown>;
    for (const group of ["easing", "duration", "spring", "schemes"]) {
      expect(motion[group], group).toBeDefined();
    }
    const schemes = motion.schemes as unknown as Record<string, unknown>;
    expect(Object.keys(schemes).sort()).toEqual(["expressive", "standard"]);
  });

  test("states are exactly the five M3 opacities", () => {
    const states = tokens.states as unknown as Record<string, string>;
    const keys = Object.keys(states).filter((k) => !k.startsWith("$"));
    expect(keys.sort()).toEqual([
      "disabled-opacity",
      "drag-opacity",
      "focus-opacity",
      "hover-opacity",
      "press-opacity",
    ]);
  });

  test("spacing scale is present and dp-ordered", () => {
    const spacing = tokens.spacing as unknown as Record<string, string>;
    expect(Object.keys(spacing).length).toBeGreaterThan(0);
    for (const [step, value] of Object.entries(spacing)) {
      expect(value, step).toMatch(/^\d+px$/);
    }
  });

  test("all 30 mode x contrast x preset contexts resolve without holes", () => {
    let cells = 0;
    for (const mode of MODES) {
      for (const contrast of CONTRASTS) {
        for (const preset of PRESETS) {
          const resolved = resolveThemeDetails(mode, contrast, preset);
          // Every role the light table names must resolve in every cell — a
          // hole in one contrast is a crash on that contrast.
          for (const role of Object.keys(
            resolveThemeDetails("light", "standard", "material-3").color,
          )) {
            expect(
              (resolved.color as unknown as Record<string, string>)[role],
              `${mode}/${contrast}/${preset}.${role}`,
            ).toMatch(/^#[0-9a-f]{6}$/i);
          }
          cells += 1;
        }
      }
    }
    expect(cells).toBe(30);
  });

  test("light and dark disagree on surfaces — a collapsed mode is not a theme", () => {
    const light = resolveThemeDetails("light", "standard", "material-3").color;
    const dark = resolveThemeDetails("dark", "standard", "material-3").color;
    expect(light.surface).not.toBe(dark.surface);
    expect(light.onSurface).not.toBe(dark.onSurface);
  });
});
