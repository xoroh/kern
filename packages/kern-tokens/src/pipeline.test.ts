import { describe, expect, it } from "vitest";
import {
  aliasStage,
  assertSingleRoleTable,
  buildThemeMatrix,
  componentStage,
  mapStage,
  projectToCssVars,
  seedStage,
} from "./pipeline";
import { defineMotionAlgorithm, MOTION_ALGORITHMS } from "./presets";
import { defineThemePreset, resolveThemeDetails, themeIds } from "./resolve";
import { themes, tokens } from "./tokens";

describe("pipeline stages", () => {
  it("seed exposes the canonical ramps with compiled sRGB", () => {
    const seed = seedStage();
    expect(seed.neutral["500"].srgb).toBe(tokens.palettes.neutral["500"].srgb);
    expect(seed.neutral["500"].oklch).toMatch(/^oklch\(/);
  });

  it("map returns the kern base tables for one mode", () => {
    const mapped = mapStage("light");
    expect(mapped.color.primary).toBe(themes.kern.color.light.primary);
    expect(mapped.shape.medium).toBe(themes.kern.radius.medium);
  });

  it("alias resolves identically to resolveThemeDetails", () => {
    for (const preset of themeIds()) {
      expect(aliasStage("dark", "high", preset)).toEqual(
        resolveThemeDetails("dark", "high", preset),
      );
    }
  });

  it("component projects both engines from one input", () => {
    const resolved = resolveThemeDetails("light", "standard", "kern");
    const projected = componentStage(resolved);
    expect(projected.scheme).toBe(resolved);
    expect(projected.cssVars["--md-sys-color-primary"]).toBe(
      resolved.color.primary,
    );
    expect(projected.cssVars["--md-sys-shape-corner-medium"]).toBe(
      resolved.shape.medium,
    );
    expect(projectToCssVars(resolved)).toEqual(projected.cssVars);
  });
});

describe("theme matrix", () => {
  it("covers the full mode x contrast x preset cross product", () => {
    const matrix = buildThemeMatrix();
    expect(matrix.presets).toEqual(["kern", "sharp", "brand", "compact"]);
    expect(matrix.cells).toHaveLength(2 * 3 * 4);
    const keys = new Set(
      matrix.cells.map(
        (cell) => `${cell.mode}/${cell.contrast}/${cell.preset}`,
      ),
    );
    expect(keys.size).toBe(matrix.cells.length);
  });

  it("is deterministic", () => {
    expect(buildThemeMatrix()).toEqual(buildThemeMatrix());
  });

  it("compact changes shape only, never color", () => {
    const matrix = buildThemeMatrix();
    const kern = matrix.cells.find(
      (cell) =>
        cell.preset === "kern" &&
        cell.mode === "light" &&
        cell.contrast === "standard",
    );
    const compact = matrix.cells.find(
      (cell) =>
        cell.preset === "compact" &&
        cell.mode === "light" &&
        cell.contrast === "standard",
    );
    expect(compact?.changedRoles).toEqual([]);
    expect(compact?.color).toEqual(kern?.color);
    expect(compact?.changedShape.length).toBeGreaterThan(0);
    expect(compact?.shape.medium).toBe("9px");
    expect(compact?.shape.full).toBe("9999px");
  });

  it("compact passes the fail-loud preset validation", () => {
    expect(() =>
      defineThemePreset({
        id: "compact-copy",
        extends: "kern",
        overrides: {
          color: { light: {}, dark: {} },
          shape: { medium: "9px" },
        },
      }),
    ).not.toThrow();
  });

  it("enforces a single role table", () => {
    expect(() => assertSingleRoleTable(buildThemeMatrix())).not.toThrow();
    const tampered = buildThemeMatrix();
    tampered.cells[0].color.secondPrimary = "#123456";
    expect(() => assertSingleRoleTable(tampered)).toThrow(
      "never a second role table",
    );
  });
});

describe("motion algorithms", () => {
  it("every built-in selects an existing motion scheme", () => {
    for (const algorithm of Object.values(MOTION_ALGORITHMS)) {
      expect(() => defineMotionAlgorithm(algorithm)).not.toThrow();
    }
    expect(MOTION_ALGORITHMS.reduced.motionScheme).toBe("standard");
    expect(MOTION_ALGORITHMS.reduced.suppressSpatial).toBe(true);
  });

  it("rejects unknown schemes", () => {
    expect(() =>
      defineMotionAlgorithm({
        id: "nope",
        description: "unknown",
        motionScheme: "nonexistent",
        suppressSpatial: false,
      }),
    ).toThrow('unknown scheme "nonexistent"');
    expect(() =>
      defineMotionAlgorithm({
        id: "Bad id!",
        description: "bad id",
        motionScheme: "standard",
        suppressSpatial: false,
      }),
    ).toThrow("Invalid motion algorithm id");
  });
});
