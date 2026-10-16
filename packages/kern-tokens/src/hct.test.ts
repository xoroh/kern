import { describe, expect, it } from "vitest";
import { HCT_TONES, hctKeyColor, hctSchemeRoles, hctTonalRamp } from "./hct";

const HEX = /^#[0-9a-f]{6}$/i;
const SEED = "#6750a4";

describe("hct tonal engine (ADR-016 spike)", () => {
  it("resolves an HCT key color with hue, chroma, and tone", () => {
    const key = hctKeyColor(SEED);
    expect(key.hue).toBeGreaterThan(0);
    expect(key.chroma).toBeGreaterThan(0);
    expect(key.tone).toBeGreaterThan(0);
    expect(key.tone).toBeLessThan(100);
  });

  it("paints a 0–100 ramp with valid hex at every M3 tone", () => {
    const ramp = hctTonalRamp(SEED);
    expect(Object.keys(ramp).map(Number)).toEqual([...HCT_TONES]);
    for (const tone of HCT_TONES) {
      expect(ramp[tone]).toMatch(HEX);
    }
    expect(ramp[0]).toBe("#000000");
    expect(ramp[100]).toBe("#ffffff");
  });

  it("rejects non-hex seeds", () => {
    expect(() => hctTonalRamp("purple")).toThrow();
    expect(() => hctSchemeRoles("#fff", "light")).toThrow();
  });

  it("maps a full M3 scheme: accents, error, surface, fixed all move", () => {
    const light = hctSchemeRoles(SEED, "light");
    const dark = hctSchemeRoles(SEED, "dark");
    for (const role of [
      "primary",
      "secondary",
      "tertiary",
      "error",
      "surface",
      "surfaceContainer",
      "outline",
      "inverseSurface",
      "primaryFixed",
      "tertiaryFixed",
    ] as const) {
      expect(light[role]).toMatch(HEX);
      expect(dark[role]).toMatch(HEX);
    }
    // Three-accent signature: tertiary is its own family, not primary.
    expect(light.tertiary).not.toBe(light.primary);
    expect(light.tertiaryContainer).not.toBe(light.primaryContainer);
    // Not a 12-role repaint: surface and error resolve from the scheme.
    expect(light.surface).not.toBe("#ffffff");
    // Modes differ where M3 says they must.
    expect(light.primary).not.toBe(dark.primary);
    expect(light.surface).not.toBe(dark.surface);
  });

  it("surfaces the kern deltas observably (surfaceTint, surfaceVariant)", () => {
    const light = hctSchemeRoles(SEED, "light");
    expect(light.surfaceTint).toMatch(HEX);
    expect(light.surfaceVariant).toMatch(HEX);
  });
});
