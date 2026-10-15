/**
 * Preset model tests incl. the test-only second-preset fixture (P2).
 *
 * The `pixel` fixture is deliberately NOT Material 3: 4 shape corners
 * (vs 10), its own `brand` semantic role, `button: [primary, quiet]`
 * variants (no tonal/elevated), and an explicit `data-grid: unsupported`
 * capability. It proves the shared schema validates, represents and
 * generates a non-M3 preset without touching M3 definitions — and nothing
 * more. It is not a public design system and ships no components.
 */
import { describe, expect, it } from "vitest";
import { MATERIAL_3_PRESET } from "./material-3";
import { definePreset, isPresetIdShape, type PresetManifest } from "./preset";

/** Test-only second preset. Not exported from the package barrel. */
const PIXEL_FIXTURE: PresetManifest = {
  id: "pixel",
  label: "Pixel (test fixture)",
  color: {
    light: { canvas: "#ffffff", ink: "#101418", brand: "#0b5fff" },
    dark: { canvas: "#101418", ink: "#f2f5f8", brand: "#7aa5ff" },
  },
  shape: { none: "0px", sm: "4px", lg: "16px", full: "999px" },
  extraRoles: ["brand"],
  variants: { button: ["primary", "quiet"] },
  capabilities: { "web-renderer": "supported", "data-grid": "unsupported" },
};

describe("material-3 preset", () => {
  it("validates with the full M3 role set", () => {
    expect(MATERIAL_3_PRESET.id).toBe("material-3");
    expect(Object.keys(MATERIAL_3_PRESET.color.light)).toHaveLength(58);
    expect(Object.keys(MATERIAL_3_PRESET.shape)).toHaveLength(10);
  });
});

describe("second-preset fixture independence", () => {
  it("validates without inheriting M3 assumptions", () => {
    const p = definePreset({ ...PIXEL_FIXTURE });
    expect(p.id).toBe("pixel");
    expect(Object.keys(p.shape)).toEqual(["none", "sm", "lg", "full"]);
    expect(p.color.light.brand).toBe("#0b5fff");
  });

  it("differs meaningfully from material-3", () => {
    expect(Object.keys(PIXEL_FIXTURE.shape)).not.toEqual(
      Object.keys(MATERIAL_3_PRESET.shape),
    );
    expect(PIXEL_FIXTURE.variants?.button).not.toContain("tonal");
    expect(
      Object.keys(PIXEL_FIXTURE.color.light),
    ).not.toContain("primaryContainer");
  });

  it("serializes with its preset identity intact (registry-representable)", () => {
    const round = JSON.parse(JSON.stringify(PIXEL_FIXTURE)) as PresetManifest;
    expect(definePreset(round).id).toBe("pixel");
    expect(round.variants?.button).toEqual(["primary", "quiet"]);
  });

  it("represents unsupported capabilities explicitly", () => {
    expect(PIXEL_FIXTURE.capabilities?.["data-grid"]).toBe("unsupported");
  });
});

describe("preset validation rejects malformed manifests", () => {
  it("rejects bad ids", () => {
    expect(() =>
      definePreset({ ...PIXEL_FIXTURE, id: "Pixel!" }),
    ).toThrowError(/id is/);
    expect(isPresetIdShape("material-3")).toBe(true);
    expect(isPresetIdShape("m3")).toBe(true);
    expect(isPresetIdShape("M3")).toBe(false);
  });

  it("rejects role asymmetry between modes", () => {
    expect(() =>
      definePreset({
        ...PIXEL_FIXTURE,
        color: { light: { a: "#ffffff" }, dark: {} },
      }),
    ).toThrowError(/missing required color\.dark roles|missing in/);
  });

  it("rejects non-hex role values", () => {
    expect(() =>
      definePreset({
        ...PIXEL_FIXTURE,
        color: {
          light: { canvas: "white" },
          dark: { canvas: "#101418" },
        },
      }),
    ).toThrowError(/must be a six-digit hex/);
  });

  it("rejects empty shape tables and bad lengths", () => {
    expect(() => definePreset({ ...PIXEL_FIXTURE, shape: {} })).toThrowError(
      /missing required shape/,
    );
    expect(() =>
      definePreset({ ...PIXEL_FIXTURE, shape: { sm: "round" } }),
    ).toThrowError(/must be a px or rem length/);
  });

  it("rejects unknown capability states", () => {
    expect(() =>
      definePreset({
        ...PIXEL_FIXTURE,
        capabilities: { "data-grid": "maybe" as never },
      }),
    ).toThrowError(/capability data-grid is/);
  });
});
