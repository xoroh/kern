/**
 * Foundations data — GENERATED from the token package, never typed.
 *
 * Source of truth:
 *   packages/kern-tokens/src/tokens.json      — base, elevation, motion,
 *                                               shape, spacing, spectrum,
 *                                               states, typography
 *   packages/kern-tokens/src/themes/kern.json — the 58 colour roles per scheme
 *
 * NOTE (flagged in .team/reports/site-se-foundations.md): the rebuild dispatch
 * named `packages/kern-theme/src/tokens.json` as the source. That package does
 * not exist — `packages/kern-tokens` is the real one, measured from the tree.
 *
 * The ROLE-COUNT-CORRECTION row binds here: kern ships 58 roles (45 M3 +
 * 13 kern deviations). Every number on the Foundations pages comes from these
 * accessors so the prose cannot assert something the package does not contain.
 *
 * MEASURED FIXES (post-reboot re-read, node script against the JSON sources):
 *   - `typography` is structured as `scale.*` + `scaleEmphasized.*` + `roles.*`
 *     + `family`/`fontFaces` — enumerating its top-level keys produced 6 empty
 *     "styles". TYPE_STYLES now walks the two real scales (15 + 15 = 30).
 *   - `$comment` keys are PROSE, not tokens; `group()` drops them so a comment
 *     can never render as a value row (Elevation/States/Motion showed one).
 */

import kernTheme from "@xoroh/kern-tokens/themes/kern.json";
import tokensJson from "@xoroh/kern-tokens/tokens.json";

type Json = Record<string, unknown>;

const tokens = tokensJson as Json;
const theme = kernTheme as Json;

/** Flatten a nested token object into dotted keys with scalar leaves. */
function flatten(
  node: unknown,
  prefix = "",
  out: Record<string, unknown> = {},
) {
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node as Json)) {
      // `$comment` is documentation riding along with the tokens, not a token.
      if (k === "$comment") continue;
      if (v && typeof v === "object") flatten(v, `${prefix}${k}.`, out);
      else out[`${prefix}${k}`] = v;
    }
  }
  return out;
}

export type Leaf = { key: string; value: unknown };

function group(name: string): Leaf[] {
  const flat = flatten(tokens[name] ?? {});
  return Object.entries(flat).map(([key, value]) => ({ key, value }));
}

/** The direct children of a token group, as `{ key, node }` pairs. */
function subgroups(name: string): { key: string; node: Json }[] {
  const node = (tokens[name] ?? {}) as Json;
  return Object.entries(node)
    .filter(([k, v]) => k !== "$comment" && v && typeof v === "object")
    .map(([key, v]) => ({ key, node: v as Json }));
}

// ------------------------------------------------------------------ colour
/**
 * The colour roles, per scheme. 58 in kern — 45 of them are Material 3's,
 * 13 are registered kern deviations (K2 status roles, K3 surfaceTonal).
 *
 * Both numbers are DERIVED: `roleCount` is the real length of the scheme,
 * and `m3RoleCount` is what `check:kern` asserts as M3's declared target. The
 * prose on the Color page reads these, so the "45 roles" claim can never be
 * a literal that drifts.
 */
const color = (theme.color ?? {}) as Json;
const light = (color.light ?? {}) as Json;
const dark = (color.dark ?? {}) as Json;

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

// ------------------------------------------------------------------ others
export const MOTION: Leaf[] = group("motion");
export const SHAPE: Leaf[] = group("shape");
export const SPACING: Leaf[] = group("spacing");
export const STATES: Leaf[] = group("states");

/**
 * Elevation is one group per LEVEL with two axes (`dp`, `shadow`). The
 * flattened form is kept for lookup; the structured form is what the page
 * renders, so a level reads as a level and never as two loose leaves.
 */
export type ElevationLevel = { level: string; dp: unknown; shadow: unknown };

export const ELEVATION: Leaf[] = group("elevation");

export const ELEVATION_LEVELS: ElevationLevel[] = subgroups("elevation")
  .sort((a, b) => a.key.localeCompare(b.key))
  .map(({ key, node }) => ({
    level: key,
    dp: node.dp,
    shadow: node.shadow,
  }));

// ------------------------------------------------------------------ motion
/** The M3 easing curves kern ships (`motion.easing.*`). */
export const MOTION_EASING: Leaf[] = group("motion").filter((l) =>
  l.key.startsWith("easing."),
);

/** The duration ladder (`motion.duration.*`), short1 → extra-long4. */
export const MOTION_DURATION: Leaf[] = group("motion").filter((l) =>
  l.key.startsWith("duration."),
);

/** One spring's physics parameters, exactly as the token package declares. */
export type Spring = {
  name: string;
  stiffness: number;
  damping: number;
};

export const MOTION_SPRING: Spring[] = subgroups("motion")
  .filter(({ key }) => key === "spring")
  .flatMap(({ node }) =>
    Object.entries(node).map(([name, params]) => {
      const p = (params ?? {}) as Json;
      return {
        name,
        stiffness: Number(p.stiffness ?? 0),
        damping: Number(p.damping ?? 0),
      };
    }),
  );

// ------------------------------------------------------------- typography
/**
 * The type styles, keyed by role. The Foundation Type page renders each one
 * with its OWN tokens — the specimen IS the token, so a wrong token is
 * visible rather than merely wrong.
 *
 * The token package keeps two scales: `typography.scale` (the base 15) and
 * `typography.scaleEmphasized` (the emphasized 15). 30 styles total, which is
 * what the page claims and what is counted below.
 */
export type TypeStyle = {
  /** `display-large` or `emphasized.display-large`. */
  role: string;
  emphasized: boolean;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
};

const typo = (tokens.typography ?? {}) as Json;
const family = String(typo.webFamily ?? typo.family ?? "");

function stylesFrom(scaleNode: unknown, emphasized: boolean): TypeStyle[] {
  const scale = (scaleNode ?? {}) as Json;
  return Object.keys(scale)
    .sort()
    .map((name) => {
      const r = (scale[name] ?? {}) as Json;
      return {
        role: emphasized ? `emphasized.${name}` : name,
        emphasized,
        fontFamily: family,
        fontSize: String(r.size ?? ""),
        fontWeight: String(r.weight ?? ""),
        lineHeight: String(r.lineHeight ?? ""),
        letterSpacing: String(r.tracking ?? ""),
      };
    });
}

export const TYPE_STYLES: TypeStyle[] = [
  ...stylesFrom(typo.scale, false),
  ...stylesFrom(typo.scaleEmphasized, true),
];

export const TYPE_STYLE_COUNT = TYPE_STYLES.length;
