import {
  type ColorRole,
  type Mode,
  type RoleTable,
  resolveThemeDetails,
  type ThemeOverrides,
  type ThemeSelection,
  themeIds,
  varName,
} from "./resolve";

export type SchemeDeltas = Partial<RoleTable>;

export type ThemeVariant = {
  id: string;
  label?: string;
  description?: string;
  overrides: ThemeOverrides;
};

const variants = new Map<string, ThemeVariant>();

function validate(v: ThemeVariant): ThemeVariant {
  if (!/^[a-z][a-z0-9-]{1,31}$/.test(v.id)) {
    throw new Error(`Invalid variant id: ${v.id}`);
  }
  return v;
}

/** Validate a runtime variant before registering it. */
export function defineVariant(variant: ThemeVariant): ThemeVariant {
  return validate(variant);
}

/** Register (or replace) a runtime variant, e.g. per tenant. */
export function registerVariant(variant: ThemeVariant): void {
  variants.set(validate(variant).id, variant);
}

export function getVariant(id: string): ThemeVariant {
  const variant = variants.get(id);
  if (!variant) throw new Error(`Unknown variant: ${id}`);
  return variant;
}

export function listVariants(): ThemeVariant[] {
  return [...variants.values()];
}

type LayerSelection = ThemeSelection | string;

function selectionFor(variant: LayerSelection): ThemeSelection {
  if (typeof variant !== "string") return variant;
  if (variants.has(variant)) return getVariant(variant);
  if ((themeIds() as string[]).includes(variant))
    return variant as ThemeSelection;
  throw new Error(`Unknown variant: ${variant}`);
}

/**
 * Resolve in layers and report what the variant changed:
 * base scheme → contrast overlay → variant overrides.
 */
export function resolveThemeLayers(
  mode: Mode = "light",
  contrast: "standard" | "medium" | "high" = "standard",
  variant: LayerSelection = "m3",
): { scheme: RoleTable; deltas: SchemeDeltas } {
  const before = resolveThemeDetails(mode, contrast, "m3");
  const resolved = resolveThemeDetails(mode, contrast, selectionFor(variant));
  const deltas: SchemeDeltas = {};
  for (const role of Object.keys(resolved.color) as ColorRole[]) {
    if (resolved.color[role] !== before.color[role]) {
      deltas[role] = resolved.color[role];
    }
  }
  return { scheme: resolved.color, deltas };
}

/** Fail loud on incomplete schemes (tenant tables, migrations). */
export function assertCompleteScheme(
  scheme: Partial<RoleTable>,
): asserts scheme is RoleTable {
  const probe = resolveThemeDetails("light", "standard", "m3").color;
  const missing = (Object.keys(probe) as ColorRole[]).filter(
    (role) => typeof scheme[role] !== "string",
  );
  if (missing.length > 0) {
    throw new Error(`Scheme is missing roles: ${missing.join(", ")}`);
  }
}

/** CSS custom properties for a resolved scheme. */
export function schemeToCssVars(scheme: RoleTable): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [role, value] of Object.entries(scheme)) {
    vars[varName(role)] = value;
  }
  return vars;
}
