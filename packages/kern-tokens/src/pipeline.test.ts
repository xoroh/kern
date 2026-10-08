import { describe, expect, it } from "vitest";
import {
  aliasStage,
  assertSingleRoleTable,
  buildThemeMatrix,
  componentStage,
  mapStage,
  projectToCssVars,
  scopedDeltas,
  seedStage,
} from "./pipeline";
import { defineMotionAlgorithm, MOTION_ALGORITHMS } from "./presets";
import {
  defineThemePreset,
  resolveThemeDetails,
  shapeVarName,
  themeIds,
  varName,
} from "./resolve";
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

  it("pipeline stages change no rendered value (structure only, D6)", () => {
    // The pipeline names existing data flow; it must never recompute a
    // value. Exhaust the mode x contrast x preset cross product: every
    // aliasStage output must equal the resolver, and every matrix cell must
    // equal the resolver for its own coordinates.
    const modes = ["light", "dark"] as const;
    const contrasts = ["standard", "medium", "high"] as const;
    for (const mode of modes) {
      for (const contrast of contrasts) {
        for (const preset of themeIds()) {
          expect(aliasStage(mode, contrast, preset)).toEqual(
            resolveThemeDetails(mode, contrast, preset),
          );
        }
      }
    }
    const matrix = buildThemeMatrix();
    for (const cell of matrix.cells) {
      const resolved = resolveThemeDetails(
        cell.mode,
        cell.contrast,
        cell.preset as Parameters<typeof resolveThemeDetails>[2],
      );
      expect(cell.color).toEqual(resolved.color);
      expect(cell.shape).toEqual(resolved.shape);
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
    expect(matrix.presets).toEqual([
      "kern",
      "sharp",
      "brand",
      "compact",
      "demo",
    ]);
    expect(matrix.cells).toHaveLength(2 * 3 * 5);
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

describe("scoped sub-theme deltas", () => {
  it("covers every non-kern preset with matrix-exact values", () => {
    const matrix = buildThemeMatrix();
    const scoped = scopedDeltas(matrix);
    expect(scoped.map((entry) => entry.id).sort()).toEqual(
      matrix.presets.filter((preset) => preset !== "kern").sort(),
    );
    for (const entry of scoped) {
      for (const mode of ["light", "dark"] as const) {
        const cell = matrix.cells.find(
          (candidate) =>
            candidate.preset === entry.id &&
            candidate.mode === mode &&
            candidate.contrast === "standard",
        );
        const vars = entry[mode];
        const expected: Record<string, string> = {};
        for (const role of cell?.changedRoles ?? []) {
          expected[varName(role)] = cell?.color[role] as string;
        }
        for (const shape of cell?.changedShape ?? []) {
          expected[shapeVarName(shape)] = cell?.shape[shape] as string;
        }
        expect(vars).toEqual(expected);
      }
    }
  });

  it("flows every switchable value through the varName spelling", () => {
    const matrix = buildThemeMatrix();
    for (const entry of scopedDeltas(matrix)) {
      for (const variable of [
        ...Object.keys(entry.light),
        ...Object.keys(entry.dark),
      ]) {
        expect(variable).toMatch(
          /^--md-sys-(color-[a-z0-9-]+|shape-corner-[a-z-]+)$/,
        );
      }
    }
    // Spot: brand repaints primary, demo repaints secondary, sharp is shape-only.
    const byId = new Map(
      scopedDeltas(matrix).map((entry) => [entry.id, entry]),
    );
    expect(byId.get("brand")?.light["--md-sys-color-primary"]).toBe(
      matrix.cells.find(
        (cell) =>
          cell.preset === "brand" &&
          cell.mode === "light" &&
          cell.contrast === "standard",
      )?.color.primary,
    );
    expect(byId.get("demo")?.dark["--md-sys-color-secondary"]).toBe(
      matrix.cells.find(
        (cell) =>
          cell.preset === "demo" &&
          cell.mode === "dark" &&
          cell.contrast === "standard",
      )?.color.secondary,
    );
    expect(
      Object.keys(byId.get("sharp")?.light ?? {}).some((key) =>
        key.startsWith("--md-sys-color-"),
      ),
    ).toBe(false);
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
