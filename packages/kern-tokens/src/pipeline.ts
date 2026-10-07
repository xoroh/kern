/**
 * P5C theming pipeline — seed -> map -> alias -> component, explicit.
 *
 * The pipeline always existed (tokens.json ramps -> themes/kern.json role
 * tables + contrast overlays -> resolveThemeDetails/varName/overridesFor ->
 * variants.ts/web-theme.tsx + generated CSS), but it was reconstructible only
 * by reading four files. This module names the four stages as functions so
 * "what does this preset change?" is answerable without running the app:
 * {@link buildThemeMatrix} flattens every mode x contrast x preset context
 * into one reviewable object, checked in as `themes/matrix.json` and gated
 * by `check:theme-matrix`.
 *
 * STRUCTURE ONLY. Every stage delegates to the existing data and functions;
 * nothing here recomputes a value. A rendered-value diff caused by this
 * module is a defect (D6).
 *
 * Style-engine split prep (visual-no-op first): the engine boundary is drawn
 * here as types plus the two pure projections. `packages/kern/src/web-theme.ts`
 * (`applyKernTheme`, CSS vars + `.dark` class) is the web engine;
 * `packages/kern-native/src/theme.tsx` (`KernThemeProvider`, scheme objects)
 * is the native engine. Neither moves in P5C — the boundary is declared so
 * the split can land without changing what either one resolves.
 */
import {
  type Contrast,
  type Mode,
  type ResolvedTheme,
  type RoleTable,
  resolveThemeDetails,
  type ShapeTable,
  shapeVarName,
  type ThemeSelection,
  themeIds,
  varName,
} from "./resolve";
import { tokens } from "./tokens";

// --- Stage 1: seed ----------------------------------------------------------
// Canonical color source: OKLCH on familiar steps, each entry carrying the
// compiled sRGB hex native consumes. Roles never hold raw values directly;
// they bind steps (see themes/kern.json).
export type SeedPalettes = typeof tokens.palettes;

/** Stage 1 — the reference ramps everything else binds to. */
export function seedStage(): SeedPalettes {
  return tokens.palettes;
}

// --- Stage 2: map -----------------------------------------------------------
// Ramp steps -> semantic roles, per mode. The kern base tables are the ONLY
// role tables in the system: presets carry overrides, never tables.
export type MappedScheme = { color: RoleTable; shape: ShapeTable };

/** Stage 2 — the kern base role tables for one mode, before overlays. */
export function mapStage(mode: Mode = "light"): MappedScheme {
  const base = resolveThemeDetails(mode, "standard", "kern");
  return { color: { ...base.color }, shape: { ...base.shape } };
}

// --- Stage 3: alias ---------------------------------------------------------
/**
 * Stage 3 — layer contrast overlays, then preset overrides, over the base.
 * Resolution order: base(mode) -> contrast -> preset. Output always covers
 * every role; unknown selections fail loud in the resolver, never half-themed.
 */
export function aliasStage(
  mode: Mode = "light",
  contrast: Contrast = "standard",
  preset: ThemeSelection = "kern",
): ResolvedTheme {
  return resolveThemeDetails(mode, contrast, preset);
}

// --- Stage 4: component -----------------------------------------------------
/**
 * Stage 4 — project one resolved scheme onto a platform surface.
 * Web reads CSS custom properties; native reads the scheme object itself.
 * Both projections are pure derivations of the same input, which is why the
 * two renderers cannot drift.
 */
export type ComponentProjection = {
  /** CSS custom properties for web (`--md-sys-color-*`, `--md-sys-shape-corner-*`). */
  cssVars: Record<string, string>;
  /** The scheme object native components read. */
  scheme: ResolvedTheme;
};

/** CSS custom properties for a resolved scheme (web projection). */
export function projectToCssVars(
  resolved: ResolvedTheme,
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [role, value] of Object.entries(resolved.color)) {
    vars[varName(role)] = value;
  }
  for (const [shape, value] of Object.entries(resolved.shape)) {
    vars[shapeVarName(shape)] = value;
  }
  return vars;
}

/** Stage 4 — both engine projections of one resolved scheme. */
export function componentStage(resolved: ResolvedTheme): ComponentProjection {
  return { cssVars: projectToCssVars(resolved), scheme: resolved };
}

// --- Engine boundary (split prep; types only, no moves) ---------------------
/** The two projections the engines consume. Web takes vars, native takes the object. */
export type EngineProjection =
  | { kind: "css-vars"; vars: Record<string, string> }
  | { kind: "scheme-object"; scheme: ResolvedTheme };

/**
 * Style-engine contract, declared ahead of the split. The web engine
 * (`applyKernTheme` in `@xoroh/kern`) projects to `css-vars` and additionally
 * owns the `.dark` class toggle and `data-kern-*` attributes — DOM concerns
 * that never enter `@xoroh/kern-tokens`. The native engine
 * (`KernThemeProvider` in `@xoroh/kern-native`) projects to `scheme-object`.
 * Both engines resolve through {@link aliasStage} with the identical
 * (mode, contrast, preset) triple.
 */
export interface StyleEngine {
  readonly id: "web" | "native";
  project(resolved: ResolvedTheme): EngineProjection;
}

// --- Flattened context matrix -----------------------------------------------
/** One flattened pipeline output: every stage input plus the resolved result. */
export type MatrixCell = {
  mode: Mode;
  contrast: Contrast;
  preset: string;
  color: Record<string, string>;
  shape: Record<string, string>;
  /** Color roles this cell changes against the kern base in the same mode+contrast. */
  changedRoles: string[];
  /** Shape roles this cell changes against the kern base in the same mode+contrast. */
  changedShape: string[];
};

/** The checked-in artifact shape (`themes/matrix.json`). */
export type ThemeMatrix = {
  $comment: string;
  version: 1;
  generatedBy: string;
  modes: Mode[];
  contrasts: Contrast[];
  presets: string[];
  cells: MatrixCell[];
};

const MODES: Mode[] = ["light", "dark"];
const CONTRASTS: Contrast[] = ["standard", "medium", "high"];

/**
 * Flatten every mode x contrast x preset context through the pipeline.
 * Preset order follows `themeIds()` (kern, sharp, brand, compact). Legacy
 * alias `"m3"` is NOT a dimension: it canonicalizes to kern, so it would
 * duplicate the kern cells rather than add contexts.
 */
export function buildThemeMatrix(): ThemeMatrix {
  const presets = themeIds() as string[];
  const cells: MatrixCell[] = [];
  for (const mode of MODES) {
    for (const contrast of CONTRASTS) {
      const base = resolveThemeDetails(mode, contrast, "kern");
      for (const preset of presets) {
        const resolved = resolveThemeDetails(
          mode,
          contrast,
          preset as ThemeSelection,
        );
        const changedRoles = (
          Object.keys(resolved.color) as (keyof RoleTable)[]
        )
          .filter((role) => resolved.color[role] !== base.color[role])
          .map(String)
          .sort();
        const changedShape = (
          Object.keys(resolved.shape) as (keyof ShapeTable)[]
        )
          .filter((shape) => resolved.shape[shape] !== base.shape[shape])
          .map(String)
          .sort();
        cells.push({
          mode,
          contrast,
          preset,
          color: { ...resolved.color },
          shape: { ...resolved.shape },
          changedRoles,
          changedShape,
        });
      }
    }
  }
  return {
    $comment:
      "Generated by packages/kern-tokens/scripts/gen-theme-matrix.mjs from the live resolver. Do not hand-edit: check:theme-matrix fails on drift.",
    version: 1,
    generatedBy: "packages/kern-tokens/scripts/gen-theme-matrix.mjs",
    modes: [...MODES],
    contrasts: [...CONTRASTS],
    presets: [...presets],
    cells,
  };
}

/**
 * The "no second role table" law, executable: every matrix cell must carry
 * exactly the kern role set — presets override values, never invent or drop
 * roles. A preset that adds a role here fails instead of shipping a shadow
 * scheme the gates never audit.
 */
export function assertSingleRoleTable(matrix: ThemeMatrix): void {
  const kernCell = matrix.cells.find(
    (cell) =>
      cell.mode === "light" &&
      cell.contrast === "standard" &&
      cell.preset === "kern",
  );
  if (!kernCell)
    throw new Error("Theme matrix has no light/standard/kern cell.");
  const colorRoles = Object.keys(kernCell.color).sort();
  const shapeRoles = Object.keys(kernCell.shape).sort();
  for (const cell of matrix.cells) {
    const color = Object.keys(cell.color).sort();
    const shape = Object.keys(cell.shape).sort();
    if (
      color.length !== colorRoles.length ||
      color.some((role, i) => role !== colorRoles[i])
    ) {
      throw new Error(
        `Preset "${cell.preset}" carries its own color role table ` +
          `(${cell.mode}/${cell.contrast}) — presets extend kern via overrides, never a second role table.`,
      );
    }
    if (
      shape.length !== shapeRoles.length ||
      shape.some((shapeRole, i) => shapeRole !== shapeRoles[i])
    ) {
      throw new Error(
        `Preset "${cell.preset}" carries its own shape table ` +
          `(${cell.mode}/${cell.contrast}) — presets extend kern via overrides, never a second role table.`,
      );
    }
  }
}
