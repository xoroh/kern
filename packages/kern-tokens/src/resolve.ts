import { contrastIssues } from "./contrast";
import brand from "./themes/brand.json";
import kern from "./themes/kern.json";
import sharp from "./themes/sharp.json";

export type Mode = "light" | "dark";
export type Contrast = "standard" | "medium" | "high";
/** Canonical preset id. `"m3"` remains accepted as a legacy alias. */
export type ThemeId = "kern" | "sharp" | "brand";
/** Every color role the resolver can produce. Misspelled roles fail to compile. */
export type ColorRole = keyof typeof kern.color.light;
export type ShapeRole = keyof typeof kern.radius;
export type RoleTable = Record<ColorRole, string>;
export type ShapeTable = Record<ShapeRole, string>;

export type ThemeOverrides = {
  color?: Partial<Record<Mode, Record<string, string>>>;
  shape?: Record<string, string>;
};

export type CustomTheme = {
  id: string;
  extends?: "kern";
  overrides: ThemeOverrides;
};

export type ThemeSelection = ThemeId | CustomTheme;

export type ResolvedTheme = {
  color: RoleTable;
  shape: ShapeTable;
};

const presets = { sharp, brand } as const;
const baseColors = kern.color as Record<Mode, RoleTable>;
const baseShape = kern.radius as ShapeTable;
const contrastOverlays = kern.contrast as Record<string, Partial<RoleTable>>;
const presetNames: ThemeId[] = ["kern", "sharp", "brand"];
/** Pre-rename ids still resolving, so published consumers are not broken by the rename. */
const LEGACY_ALIASES: Record<string, ThemeId> = { m3: "kern" };
function canonical(id: string): ThemeId {
  return LEGACY_ALIASES[id] ?? (id as ThemeId);
}
const colorRoles = new Set(Object.keys(baseColors.light));
const shapeRoles = new Set(Object.keys(baseShape));

function overridesFor(selection: ThemeSelection): ThemeOverrides {
  if (typeof selection !== "string") return selection.overrides;
  const id = canonical(selection);
  if (id === "kern") return {};
  return presets[id].overrides as ThemeOverrides;
}

/** Validate a user-authored theme before a visual builder or agent emits it. */
export function defineThemePreset(theme: CustomTheme): CustomTheme {
  if (!/^[a-z][a-z0-9-]{1,31}$/.test(theme.id)) {
    throw new Error(`Invalid theme id: ${theme.id}`);
  }
  const base = theme.extends === undefined ? "kern" : canonical(theme.extends);
  if (base !== "kern") {
    throw new Error(
      `Unknown theme base: ${theme.extends}. Only "kern" exists.`,
    );
  }
  if (presetNames.includes(canonical(theme.id))) {
    throw new Error(`Theme id is reserved: ${theme.id}`);
  }
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
    );
    if (issues.length > 0) {
      throw new Error(
        `Theme ${theme.id} fails ${mode} contrast: ${issues.join("; ")}`,
      );
    }
  }
  return theme;
}

/** Resolve all semantic colors and shape values for the selected contexts. */
export function resolveThemeDetails(
  mode: Mode = "light",
  contrast: Contrast = "standard",
  variant: ThemeSelection = "kern",
): ResolvedTheme {
  const color = { ...baseColors[mode] };
  if (contrast !== "standard") {
    Object.assign(color, contrastOverlays[`${mode}-${contrast}`] ?? {});
  }
  const overrides = overridesFor(variant);
  Object.assign(color, overrides.color?.[mode] ?? {});
  const shape = { ...baseShape, ...(overrides.shape ?? {}) };
  return { color, shape };
}

/** Compatibility helper for consumers that only need the role table. */
export function resolveTheme(
  mode: Mode = "light",
  contrast: Contrast = "standard",
  variant: ThemeSelection = "kern",
): RoleTable {
  return resolveThemeDetails(mode, contrast, variant).color;
}

export function varName(role: string): string {
  const kebab = role.replace(/(?<!^)(?=[A-Z])/g, "-").toLowerCase();
  return `--md-sys-color-${kebab}`;
}

export function shapeVarName(shape: string): string {
  return `--md-sys-shape-corner-${shape}`;
}

export function themeIds(): ThemeId[] {
  return [...presetNames];
}
