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

// ------------------------------------------------------------------ colour
/**
 * The colour roles, per scheme. 58 in kern — 45 of them are Material 3's,
 * 13 are registered kern deviations (K2 status roles, K3 surfaceTonal).
 *
 * Both numbers are DERIVED: `roleCount` is the real length of the scheme,
 * and `m3RoleCount` is what `check:m3` asserts as M3's declared target. The
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
};

export const COLOR_ROLES: ColorRole[] = Object.keys(light)
  .sort()
  .map((name) => ({
    name,
    light: String(light[name] ?? ""),
    dark: String(dark[name] ?? ""),
    kernExtra: KERN_EXTRA_ROLE_NAMES.has(name),
  }));

export const ROLE_COUNT = COLOR_ROLES.length;
export const M3_ROLE_COUNT =
  ROLE_COUNT - COLOR_ROLES.filter((r) => r.kernExtra).length;
export const KERN_EXTRA_COUNT = COLOR_ROLES.length - M3_ROLE_COUNT;

// ------------------------------------------------------------------ others
export const ELEVATION: Leaf[] = group("elevation");
export const MOTION: Leaf[] = group("motion");
export const SHAPE: Leaf[] = group("shape");
export const SPACING: Leaf[] = group("spacing");
export const STATES: Leaf[] = group("states");
export const TYPOGRAPHY: Leaf[] = group("typography");

/**
 * The type styles, keyed by role. The Foundation Type page renders each one
 * with its OWN tokens — the specimen IS the token, so a wrong token is
 * visible rather than merely wrong.
 */
export type TypeStyle = {
  role: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
};

const typo = (tokens.typography ?? {}) as Json;

export const TYPE_STYLES: TypeStyle[] = Object.keys(typo)
  .filter((k) => k !== "$comment")
  .sort()
  .map((role) => {
    const r = (typo[role] ?? {}) as Json;
    return {
      role,
      fontFamily: String(r.fontFamily ?? ""),
      fontSize: String(r.fontSize ?? ""),
      fontWeight: String(r.fontWeight ?? ""),
      lineHeight: String(r.lineHeight ?? ""),
      letterSpacing: String(r.letterSpacing ?? ""),
    };
  });

export const TYPE_STYLE_COUNT = TYPE_STYLES.length;
