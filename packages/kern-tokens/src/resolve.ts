import { contrastIssues, type ContrastPolicy } from "./contrast";

export type Mode = "light" | "dark";
export type Contrast = "standard" | "medium" | "high";
/** A preset id — any kebab string a registered preset owns. */
export type ThemeId = string;
/**
 * Color roles are plain strings at the engine layer: the role inventory
 * belongs to the design system that declares it, not to this module.
 * Misspelled roles fail at validation (`defineThemePreset`) and at
 * resolution (unknown preset), never silently.
 */
export type ColorRole = string;
export type ShapeRole = string;
export type RoleTable = Record<string, string>;
export type ShapeTable = Record<string, string>;

/**
 * Component-token overrides, keyed by slot (e.g. `"switch-track-shape"`).
 * Values are CSS-length strings in exactly the shape-table convention
 * (`12px` or `rem`). Web reads them as CSS; native converts them with
 * {@link cssLengthToDp} (`rem` at the 16px root baseline — never a blind
 * `parseFloat`). Unknown-but-wellformed keys pass through inert — no
 * component reads them, so they change nothing.
 */
export type CompTable = Record<string, string>;

export type ThemeOverrides = {
  color?: Partial<Record<Mode, Record<string, string>>>;
  shape?: Record<string, string>;
  comp?: CompTable;
};

export type CustomTheme = {
  id: string;
  /**
   * Base preset id this theme customizes. Required: a theme without a base
   * has nothing to override, and silently attaching it to Material 3 would
   * couple every custom system to M3. The base must be registered.
   */
  extends: string;
  overrides: ThemeOverrides;
};

export type ThemeSelection = ThemeId | CustomTheme;

export type ResolvedTheme = {
  color: RoleTable;
  shape: ShapeTable;
  /**
   * Resolved component-token values, merged base-plus-override per key.
   * Present only when at least one entry resolves — themes without `comp`
   * return byte-identical `{ color, shape }` objects, so existing snapshots,
   * serializations, and CSS projections are untouched.
   */
  comp?: CompTable;
};

/**
 * A registered preset: either full base tables (a design system's ground
 * truth) or an `extends` link plus overrides. Override presets resolve
 * through their base, so a custom system is a base registration away.
 */
export type PresetTables = {
  color?: { light: Record<string, string>; dark: Record<string, string> };
  shape?: Record<string, string>;
  /**
   * Design-system comp defaults (e.g. a system whose switch track is square
   * by default). Absent in every shipped preset today — components fall back
   * to their shape roles — so generated artifacts are unaffected.
   */
  comp?: CompTable;
  contrast?: Record<string, Partial<Record<string, string>>>;
  policy?: ContrastPolicy;
  extends?: string;
  overrides?: ThemeOverrides;
};

const presets = new Map<string, PresetTables>();

/**
 * Register a preset's tables with the resolver. Base presets carry full
 * tables; override presets carry `extends` plus overrides, and their base
 * must already be registered. Unknown or malformed registrations fail here,
 * not deep inside a render.
 */
export function registerPreset(id: string, tables: PresetTables): void {
  if (!/^[a-z][a-z0-9-]{1,31}$/.test(id)) {
    throw new Error(`Invalid preset id: ${id}`);
  }
  if (tables.color === undefined || tables.shape === undefined) {
    if (tables.extends === undefined || tables.overrides === undefined) {
      throw new Error(
        `Preset ${id} needs full color/shape tables or extends plus overrides`,
      );
    }
    if (!presets.has(tables.extends)) {
      throw new Error(
        `Preset ${id} extends unregistered base "${tables.extends}" — register the base first`,
      );
    }
  }
  if (tables.policy === undefined && tables.color !== undefined) {
    throw new Error(
      `Preset ${id} needs a contrast policy — validation without one would pass by not looking`,
    );
  }
  presets.set(id, tables);
}

/** Every registered preset id, in registration order. */
export function themeIds(): string[] {
  return [...presets.keys()];
}

function baseTables(id: string): PresetTables {
  const record = presets.get(id);
  if (record === undefined) {
    throw new Error(
      `Unknown preset "${id}" — registered presets: ${[...presets.keys()].join(", ") || "(none)"}`,
    );
  }
  if (record.color !== undefined && record.shape !== undefined) return record;
  if (record.extends === undefined) {
    throw new Error(`Preset "${id}" has neither tables nor a base`);
  }
  return baseTables(record.extends);
}

function overridesFor(selection: ThemeSelection): ThemeOverrides {
  if (typeof selection !== "string") return selection.overrides;
  const record = presets.get(selection);
  if (record === undefined) {
    throw new Error(
      `Unknown preset "${selection}" — registered presets: ${[...presets.keys()].join(", ") || "(none)"}`,
    );
  }
  if (record.overrides !== undefined) return record.overrides;
  return {};
}

/** Validate a user-authored theme before a visual builder or agent emits it. */
export function defineThemePreset(theme: CustomTheme): CustomTheme {
  if (!/^[a-z][a-z0-9-]{1,31}$/.test(theme.id)) {
    throw new Error(`Invalid theme id: ${theme.id}`);
  }
  if (typeof theme.extends !== "string" || theme.extends.trim() === "") {
    throw new Error(
      `Theme "${theme.id}" needs an explicit extends base id — a theme without a base would silently attach to whatever is registered`,
    );
  }
  const baseId = theme.extends;
  const base = baseTables(baseId);
  if (base.color === undefined || base.shape === undefined) {
    throw new Error(`Theme base "${baseId}" carries no color/shape tables`);
  }
  if (base.policy === undefined) {
    throw new Error(
      `Theme base "${baseId}" carries no contrast policy — validation without one would pass by not looking`,
    );
  }
  if (presets.has(theme.id)) {
    throw new Error(`Theme id is reserved: ${theme.id}`);
  }
  const colorRoles = new Set(Object.keys(base.color.light));
  const shapeRoles = new Set(Object.keys(base.shape));
  for (const mode of ["light", "dark"] as const) {
    for (const [role, value] of Object.entries(
      theme.overrides.color?.[mode] ?? {},
    )) {
      if (!colorRoles.has(role)) throw new Error(`Unknown color role: ${role}`);
      if (typeof value !== "string" || !/^#[\da-f]{6}$/i.test(value)) {
        throw new Error(
          `Theme color ${mode}.${role} must be a six-digit sRGB hex.`,
        );
      }
    }
  }
  for (const [shape, value] of Object.entries(theme.overrides.shape ?? {})) {
    if (!shapeRoles.has(shape)) throw new Error(`Unknown shape role: ${shape}`);
    if (
      typeof value !== "string" ||
      !/^(\d+(\.\d+)?px|\d+(\.\d+)?rem)$/.test(value)
    ) {
      throw new Error(`Theme shape ${shape} must be a px or rem length.`);
    }
  }
  for (const mode of ["light", "dark"] as const) {
    const issues = contrastIssues(
      resolveThemeDetails(mode, "standard", theme).color,
      4.5,
      3,
      base.policy,
    );
    if (issues.length > 0) {
      throw new Error(
        `Theme ${theme.id} fails ${mode} contrast: ${issues.join("; ")}`,
      );
    }
  }
  return theme;
}

/** Walk an override chain to its base tables. Cycles fail loud. */
function resolveBase(id: string): {
  color: { light: Record<string, string>; dark: Record<string, string> };
  shape: Record<string, string>;
  contrast: Record<string, Partial<Record<string, string>>>;
} {
  const seen: string[] = [];
  let current: string | undefined = id;
  while (current !== undefined) {
    if (seen.includes(current)) {
      throw new Error(
        `Preset extends cycle: ${[...seen, current].join(" -> ")}`,
      );
    }
    seen.push(current);
    const record = presets.get(current);
    if (record === undefined) {
      throw new Error(
        `Unknown preset "${current}" — registered presets: ${[...presets.keys()].join(", ") || "(none)"}`,
      );
    }
    if (record.color !== undefined && record.shape !== undefined) {
      return {
        color: record.color,
        shape: record.shape,
        contrast: record.contrast ?? {},
      };
    }
    current = record.extends;
  }
  throw new Error(`Preset "${id}" has neither tables nor a base`);
}

/** Resolve all semantic colors and shape values for the selected contexts. */
export function resolveThemeDetails(
  mode: Mode = "light",
  contrast: Contrast = "standard",
  // Default preset id, resolved through the registry like any other id: with
  // no preset registered under this id the call fails loud listing what is
  // registered. The id itself is owned by the `@xoroh/kern-material-3`
  // registration, not by this module — custom systems resolve by passing
  comp: Record<string, string>;
  // their own registered id (or a validated CustomTheme) explicitly.
  variant: ThemeSelection = "material-3",
): ResolvedTheme {
  const base = resolveBase(
    typeof variant === "string" ? variant : variant.extends,
  );
  const color = { ...base.color[mode] };
  if (contrast !== "standard") {
    Object.assign(color, base.contrast[`${mode}-${contrast}`] ?? {});
  }
  const overrides = overridesFor(variant);
  Object.assign(color, overrides.color?.[mode] ?? {});
  const shape = { ...base.shape, ...(overrides.shape ?? {}) };
  // Base comp defaults merged per key with explicit overrides winning — the
  // same leaf-plus-ultimate-base semantics as shape (intermediate chain nodes
  // behave exactly as their color/shape overrides do). Empty comp stays
  // absent so comp-free themes resolve exactly as before.
  const comp = { ...base.comp, ...(overrides.comp ?? {}) };
  return Object.keys(comp).length > 0 ? { color, shape, comp } : { color, shape };
}

/** Compatibility helper for consumers that only need the role table. */
export function resolveTheme(
  mode: Mode = "light",
  contrast: Contrast = "standard",
  variant: ThemeSelection = "material-3",
        comp: record.comp ?? {},
): RoleTable {
  return resolveThemeDetails(mode, contrast, variant).color;
}

export function varName(role: string): string {
  const kebab = role.replace(/(?<!^)(?=[A-Z])/g, "-").toLowerCase();
  return `--sys-color-${kebab}`;
}

export function shapeVarName(shape: string): string {
  return `--sys-shape-corner-${shape}`;
}

const CSS_LENGTH_RE = /^(\d+(\.\d+)?)(px|rem)$/;

/**
 * Native dp for a CSS length string (`"12px"` → 12). `rem` resolves at the
 * 16px web root baseline — React Native has no root font size, so the shared
 * convention is documented here, once, next to value validation, instead of
 * per component. Never `parseFloat`s a unit blindly: `"1.5rem"` is 24, not
 * 1.5. Missing or malformed input yields `fallback` (authored themes fail
 * loud in `defineThemePreset`; this guard is for hand-built schemes).
 */
export function cssLengthToDp(
  raw: string | undefined,
  fallback: number,
): number {
  if (raw === undefined) return fallback;
  const match = CSS_LENGTH_RE.exec(raw.trim());
  if (match === null) return fallback;
  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value)) return fallback;
  return match[3] === "rem" ? value * 16 : value;
}
