/**
 * Foundation colour — the roles, per scheme. 58 in kern — 45 of them are
 * Material 3's, 13 are registered kern deviations (K2 status roles, K3
 * surfaceTonal).
 *
 * Both numbers are DERIVED: `roleCount` is the real length of the scheme,
 * and `m3RoleCount` is what `check:kern` asserts as M3's declared target. The
 * prose on the Color page reads these, so the "45 roles" claim can never be
 * a literal that drifts.
 */
import { type Json, theme, tokens } from "./tokens";

const color = (theme.color ?? {}) as Json;
const light = (color.light ?? {}) as Json;
const dark = (color.dark ?? {}) as Json;

export type ColorRole = {
  name: string;
  light: string;
  dark: string;
  /** True when this role is one of the registered kern extras, not M3's. */
  kernExtra: boolean;
  /** The role-grammar band this role belongs to, in M3's naming order. */
  group: ColorGroup;
};

/**
 * The role grammar, in M3's own naming order. Material 3 names roles by
 * family — `primary`, `onPrimary`, `primaryContainer`, `primaryFixed`, … — so
 * the bands below are not a presentation choice: they are what the names mean.
 * Grouping the matrix by them keeps each family's on/off pairs adjacent, which
 * is the whole point of the naming scheme.
 *
 * The seven M3 bands total 45 roles; the eighth band is the 13 kern extras.
 */
export type ColorGroup =
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "surface"
  | "outline"
  | "inverse"
  | "kern";

const GROUP_NAMES: Record<ColorGroup, string> = {
  primary: "Primary — the brand accent",
  secondary: "Secondary — supporting emphasis",
  tertiary: "Tertiary — balancing accent",
  error: "Error — destructive and failure",
  surface: "Surface — the page and its containers",
  outline: "Outline — boundaries and dividers",
  inverse: "Inverse, shadow and scrim",
  kern: "kern additions — not Material 3's",
};

/**
 * The 13 kern extras: 12 status roles (K2) + surfaceTonal (K3). Declared as
 * a set so the Color page can label them and so the 45/13 split is computed,
 * not asserted.
 */
export const KERN_EXTRA_ROLE_NAMES = new Set([
  "info",
  "onInfo",
  "infoContainer",
  "onInfoContainer",
  "success",
  "onSuccess",
  "successContainer",
  "onSuccessContainer",
  "warning",
  "onWarning",
  "warningContainer",
  "onWarningContainer",
  "surfaceTonal",
]);

/**
 * Role name -> band, by explicit name rather than a prefix heuristic. A prefix
 * rule would misfile `onSurface` into "on*" and `primaryFixed` into "fixed";
 * naming every role makes the grouping auditable against the theme object.
 */
const ROLE_GROUP: Record<string, ColorGroup> = {
  primary: "primary",
  onPrimary: "primary",
  primaryContainer: "primary",
  onPrimaryContainer: "primary",
  primaryFixed: "primary",
  primaryFixedDim: "primary",
  onPrimaryFixed: "primary",
  onPrimaryFixedVariant: "primary",
  secondary: "secondary",
  onSecondary: "secondary",
  secondaryContainer: "secondary",
  onSecondaryContainer: "secondary",
  secondaryFixed: "secondary",
  secondaryFixedDim: "secondary",
  onSecondaryFixed: "secondary",
  onSecondaryFixedVariant: "secondary",
  tertiary: "tertiary",
  onTertiary: "tertiary",
  tertiaryContainer: "tertiary",
  onTertiaryContainer: "tertiary",
  tertiaryFixed: "tertiary",
  tertiaryFixedDim: "tertiary",
  onTertiaryFixed: "tertiary",
  onTertiaryFixedVariant: "tertiary",
  error: "error",
  onError: "error",
  errorContainer: "error",
  onErrorContainer: "error",
  surface: "surface",
  onSurface: "surface",
  onSurfaceVariant: "surface",
  surfaceBright: "surface",
  surfaceDim: "surface",
  surfaceContainer: "surface",
  surfaceContainerLow: "surface",
  surfaceContainerLowest: "surface",
  surfaceContainerHigh: "surface",
  surfaceContainerHighest: "surface",
  outline: "outline",
  outlineVariant: "outline",
  inverseSurface: "inverse",
  inverseOnSurface: "inverse",
  inversePrimary: "inverse",
  shadow: "inverse",
  scrim: "inverse",
};

function groupOf(name: string): ColorGroup {
  if (KERN_EXTRA_ROLE_NAMES.has(name)) return "kern";
  return ROLE_GROUP[name] ?? "surface";
}

/**
 * Exported for `check-tokens`: the `?? "surface"` fallback above is a silent
 * misfile for any future role nobody registered. The gate asserts every
 * non-kern theme role has an explicit entry here, so a new role renders
 * ungrouped-noise (a gate failure) rather than a wrong band (a quiet lie).
 */
export const ROLE_GROUP_ENTRIES: Readonly<Record<string, ColorGroup>> =
  ROLE_GROUP;

export type ColorGroupBand = {
  group: ColorGroup;
  label: string;
  /** True for the kern band — rendered as a visibly separate band. */
  isKern: boolean;
  roles: ColorRole[];
};

export const COLOR_ROLES: ColorRole[] = Object.keys(light)
  .sort()
  .map((name) => ({
    name,
    light: String(light[name] ?? ""),
    dark: String(dark[name] ?? ""),
    kernExtra: KERN_EXTRA_ROLE_NAMES.has(name),
    group: groupOf(name),
  }));

/** Role lookup for the pairing-law specimens. */
export const ROLE_BY_NAME: Map<string, ColorRole> = new Map(
  COLOR_ROLES.map((r) => [r.name, r]),
);

export const ROLE_COUNT = COLOR_ROLES.length;
export const M3_ROLE_COUNT =
  ROLE_COUNT - COLOR_ROLES.filter((r) => r.kernExtra).length;
export const KERN_EXTRA_COUNT = COLOR_ROLES.length - M3_ROLE_COUNT;

/**
 * The matrix bucketed into the role-grammar bands. Rendered in this order, the
 * kern band sits last and visually apart, so the 45/13 split is a structural
 * fact of the page rather than a sentence in the fine print.
 */
export const COLOR_GROUPS: ColorGroupBand[] = (
  [
    "primary",
    "secondary",
    "tertiary",
    "error",
    "surface",
    "outline",
    "inverse",
    "kern",
  ] as ColorGroup[]
)
  .map((group) => ({
    group,
    label: GROUP_NAMES[group],
    isKern: group === "kern",
    roles: COLOR_ROLES.filter((r) => r.group === group),
  }))
  .filter((band) => band.roles.length > 0);

/** Role count per band — the split, measured from the bands themselves. */
export const COLOR_GROUP_COUNTS: {
  label: string;
  count: number;
  isKern: boolean;
}[] = COLOR_GROUPS.map((b) => ({
  label: b.label,
  count: b.roles.length,
  isKern: b.isKern,
}));

/**
 * Where roles come from — the construction layer beneath the matrix.
 *
 * Roles are decisions; ramps are the material they are decided from. Three
 * layers, each generated from `tokens.json`, each rendered on the Color page
 * so the construction story is visible rather than asserted:
 *
 * - BASE anchors (5): the named starting colors with both encodings.
 * - PALETTES (6 ramps): curated role-source ramps.
 * - SPECTRUM (11 hues x 11 steps): the full tonal field.
 *
 * A ramp step carries both encodings (`oklch` canonical, `srgb` compiled);
 * the page renders the srgb and prints both. Steps are ordered light to dark
 * by numeric step, not by source order — source order is an authoring
 * accident, numeric order is the scale.
 */
export type RampStep = { step: string; oklch: string; srgb: string };
export type Ramp = { name: string; steps: RampStep[] };

function rampOf(node: unknown): RampStep[] {
  const steps = (node ?? {}) as Json;
  return Object.keys(steps)
    .filter((k) => !k.startsWith("$"))
    .sort((a, b) => Number(a) - Number(b))
    .map((step) => {
      const pair = (steps[step] ?? {}) as Json;
      return {
        step,
        oklch: String(pair.oklch ?? ""),
        srgb: String(pair.srgb ?? ""),
      };
    });
}

const palettes = ((tokens as Json).palettes ?? {}) as Json;
export const PALETTES: Ramp[] = Object.keys(palettes)
  .filter((k) => !k.startsWith("$"))
  .sort()
  .map((name) => ({ name, steps: rampOf(palettes[name]) }));

const spectrum = ((tokens as Json).spectrum ?? {}) as Json;
export const SPECTRUM: Ramp[] = Object.keys(spectrum)
  .filter((k) => !k.startsWith("$"))
  .sort()
  .map((name) => ({ name, steps: rampOf(spectrum[name]) }));

const base = ((tokens as Json).base ?? {}) as Json;
export const BASE_ANCHORS: { name: string; oklch: string; srgb: string }[] =
  Object.keys(base)
    .filter((k) => !k.startsWith("$"))
    .sort()
    .map((name) => {
      const pair = (base[name] ?? {}) as Json;
      return {
        name,
        oklch: String(pair.oklch ?? ""),
        srgb: String(pair.srgb ?? ""),
      };
    });
