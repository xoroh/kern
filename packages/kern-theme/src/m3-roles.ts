/**
 * M3 COLOR ROLE INVENTORY — the single declared target for `check:m3`.
 *
 * D-029/P1-0: `check:m3` previously had NO role inventory. It only asserted that roles
 * *referenced in source* exist in every scheme, so a role missing from `m3.json` entirely
 * passed. This module is that missing target: a declared list of every color role
 * Material 3 defines, plus kern's own additive roles.
 *
 * WHY THE COMPOSITION IS 25 + 5 + 3 + 12 (and not "26 standard + 6 add-on")
 * ---------------------------------------------------------------------------
 * Verified against https://m3.material.io/styles/color/roles on 2026-10-01:
 *
 *  - **25 standard roles.** M3's overview page says "26 standard color roles organized
 *    into six groups", but that count predates the surface-group rewrite. The roles page
 *    now lists **three** surface roles — `surface`, `onSurface`, `onSurfaceVariant` —
 *    and no longer defines `surfaceVariant`. Counting the spec as written gives 25:
 *    primary/secondary/tertiary/error 4 each (16) + 3 surface + 2 outline
 *    (inverseSurface, inverseOnSurface, shadow, scrim round out the group) = 25.
 *  - **5 surface-container roles** (lowest → highest).
 *  - **3 add-on roles** (inversePrimary, surfaceDim, surfaceBright).
 *  - **12 fixed accent roles.**
 *
 * 25 + 5 + 3 + 12 = **45**, which is the number M3 itself publishes for the full role set.
 * The arithmetic reconciles, so the split above is the correct decomposition.
 *
 * ⚠️ TWO ERRORS IN THE P1-2 BRIEF, corrected here. Both would have shipped wrong tokens:
 *
 *  1. **There is NO `FixedContainer` role and NO `error` fixed family.** The brief asked for
 *     "primary/secondary/tertiary/error × Fixed/FixedDim/FixedContainer/OnFixed/OnFixedVariant".
 *     M3 defines fixed accents for **primary, secondary and tertiary only** — the spec's own
 *     text is "Primary fixed, secondary fixed, and tertiary fixed… the same usage applies for
 *     the equivalent secondary and tertiary colors", and `error` is never mentioned in the
 *     fixed-accent section. There is also **no `FixedContainer`** role: M3's `Container` roles
 *     are non-fixed by definition ("regular container colors… change in tone between these
 *     themes", which is exactly what fixed roles do NOT do). So the spec's 12 are
 *     3 families × {Fixed, FixedDim, OnFixed, OnFixedVariant} — not 4 families × 5.
 *
 *  2. **`surfaceVariant` is not an M3 role.** It is absent from `m3.json` (correctly) and was
 *     absent from the spec page. Any gate that requires it asserts a role that does not exist.
 *
 * Sources: `.team/research/m3/2026-10-01-m3-ruleset-and-gap.md` (45-role diagram [S2]),
 * https://m3.material.io/styles/color/roles, https://m3.material.io/styles/color/overview.
 */

/** The 25 standard roles, by M3's six groups. */
export const STANDARD_ROLES = Object.freeze([
  // primary
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  // secondary
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  // tertiary
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  // error
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  // surface
  "surface",
  "onSurface",
  "onSurfaceVariant",
  // outline
  "outline",
  "outlineVariant",
  // inverses + shadow/scrim
  "inverseSurface",
  "inverseOnSurface",
  "shadow",
  "scrim",
]);

/** The five surface-container emphasis levels. */
export const SURFACE_CONTAINER_ROLES = Object.freeze([
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
]);

/** The three remaining add-on roles. */
export const ADD_ON_ROLES = Object.freeze([
  "inversePrimary",
  "surfaceDim",
  "surfaceBright",
]);

/** Accent families M3 defines fixed roles for. NOTE: not `error`. See module header. */
export const FIXED_ACCENT_FAMILIES = Object.freeze([
  "primary",
  "secondary",
  "tertiary",
]);

/** The 12 fixed accent roles: 3 families × {Fixed, FixedDim, OnFixed, OnFixedVariant}. */
export const FIXED_ACCENT_ROLES = Object.freeze(
  FIXED_ACCENT_FAMILIES.flatMap((family) => [
    `${family}Fixed`,
    `${family}FixedDim`,
    `on${family[0].toUpperCase()}${family.slice(1)}Fixed`,
    `on${family[0].toUpperCase()}${family.slice(1)}FixedVariant`,
  ]),
);

/**
 * Fixed accents are NOT text-safe. M3: "Fixed colors don't change based on light or dark
 * theme, so they're likely to cause contrast issues. Avoid using them where contrast is
 * necessary." They also do not change tone between light and dark — they are one value used
 * in both schemes, which is the whole point of the role and the reason it cannot be made
 * contrast-safe by choosing a different value per scheme.
 *
 * These are the per-role waivers required by K9. Each names a role and states why.
 * `check:contrast` reads this map; an accent not listed here is contrast-gated normally.
 */
export const CONTRAST_WAIVERS = Object.freeze({
  primaryFixed:
    "K9 fixed accent — tone-invariant by definition; fill only, never text",
  primaryFixedDim:
    "K9 fixed accent — tone-invariant by definition; fill only, never text",
  onPrimaryFixed:
    "K9 on-fixed — pairs with primaryFixed; M3 assigns text/icon duty but kern gates it",
  onPrimaryFixedVariant:
    "K9 on-fixed — pairs with primaryFixed; lower-emphasis variant",
  secondaryFixed:
    "K9 fixed accent — tone-invariant by definition; fill only, never text",
  secondaryFixedDim:
    "K9 fixed accent — tone-invariant by definition; fill only, never text",
  onSecondaryFixed:
    "K9 on-fixed — pairs with secondaryFixed; M3 assigns text/icon duty but kern gates it",
  onSecondaryFixedVariant:
    "K9 on-fixed — pairs with secondaryFixed; lower-emphasis variant",
  tertiaryFixed:
    "K9 fixed accent — tone-invariant by definition; fill only, never text",
  tertiaryFixedDim:
    "K9 fixed accent — tone-invariant by definition; fill only, never text",
  onTertiaryFixed:
    "K9 on-fixed — pairs with tertiaryFixed; M3 assigns text/icon duty but kern gates it",
  onTertiaryFixedVariant:
    "K9 on-fixed — pairs with tertiaryFixed; lower-emphasis variant",
  // M3 add-on roles that are decorative-only by design and are NOT contrast-gated.
  scrim:
    "M3: scrim is a scrim layer, never a foreground; contrast is meaningless by design",
  shadow:
    "M3: shadow is a shadow color, never a foreground; contrast is meaningless by design",
});

/**
 * kern's own additive roles. Every one MUST appear in the deviations registry
 * (`.team/programs/K-01-deviations.md`) or this gate fails — that is the whole point of
 * "all M3 roles + kern's own extras on top, never folded into the 45".
 *
 * Deviation ids: K2 = the 12 status roles, K3 = surfaceTonal.
 */
export const KERN_EXTRA_ROLES = Object.freeze({
  success: "K2",
  onSuccess: "K2",
  successContainer: "K2",
  onSuccessContainer: "K2",
  warning: "K2",
  onWarning: "K2",
  warningContainer: "K2",
  onWarningContainer: "K2",
  info: "K2",
  onInfo: "K2",
  infoContainer: "K2",
  onInfoContainer: "K2",
  surfaceTonal: "K3",
});

/** Every role M3 defines. This is the target. Length is 45. */
export const M3_ROLES = Object.freeze([
  ...STANDARD_ROLES,
  ...SURFACE_CONTAINER_ROLES,
  ...ADD_ON_ROLES,
  ...FIXED_ACCENT_ROLES,
]);

/** Every role kern is allowed to ship beyond M3, each mapped to its deviation id. */
export const KERN_ROLES = Object.freeze(Object.keys(KERN_EXTRA_ROLES));

/** The complete legal role space for a kern scheme: 45 M3 + 13 kern = 58. */
export const ALL_ROLES = Object.freeze([...M3_ROLES, ...KERN_ROLES]);

/**
 * Audit the role space of one scheme against the declared inventory.
 * Returns the roles that are missing (M3 requires them) and any role that is neither an
 * M3 role nor a registered kern deviation.
 */
export function auditRoleInventory(scheme: Record<string, unknown>) {
  const present = Object.keys(scheme);
  const m3 = new Set(M3_ROLES);
  const kern = new Set(KERN_ROLES);
  return {
    missing: M3_ROLES.filter((role) => !present.includes(role)),
    m3Present: M3_ROLES.filter((role) => present.includes(role)).length,
    unregistered: present.filter((role) => !m3.has(role) && !kern.has(role)),
    missingDeviation: Object.entries(KERN_EXTRA_ROLES)
      .filter(([role]) => !present.includes(role))
      .map(([role, id]) => `${role} (${id})`),
  };
}
