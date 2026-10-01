/**
 * M3 RESTING-ELEVATION INVENTORY — the declared target for `check:m3`.
 *
 * Why this module exists
 * ----------------------
 * P2 audit (`design-system-lead`, 2026-10-01) measured every web component's
 * resting elevation and could only report three rows as OPEN, because the
 * reference column was assembled from secondary sources (Vuetify, designref.ai,
 * community skill files) after the conclusion "m3.material.io publishes no
 * per-component numeric table". **That conclusion was wrong.** The overview page
 * (`/styles/elevation`) does carry no table, but `/styles/elevation/tokens`
 * publishes a "Component elevation" table mapping resting level → component.
 * Verified first-hand against that page on 2026-10-01.
 *
 * So the elevation audit had no target and every mismatch was unresolvable. This
 * module is that target, in the same shape as `m3-roles.ts`: the spec's own rows,
 * plus kern's own assignments for the components M3 does not name, each mapped
 * to a deviation id so a deliberate choice cannot be mistaken for conformance.
 *
 * WHAT THE SPEC DOES AND DOES NOT SETTLE
 * --------------------------------------
 * M3 publishes exactly two rules about component elevation
 * (`/styles/elevation`, "Component elevation"):
 *   - "Most components have a default elevation."
 *   - "Avoid changing the default elevation of Material 3 components."
 * and one about interaction:
 *   - hover/focus "usually raises elevation by one level" (FAB 3 → 4).
 *
 * It does NOT say what a component's default is for the ~30 components it does
 * not tabulate (popover, select, combobox, snackbar, …). Those rows below are
 * kern decisions, not spec claims, and are marked as such. The dp axis IS the
 * spec (`tokens.json` K4); the per-level shadow is kern's platform rendering.
 *
 * Sources: https://m3.material.io/styles/elevation/tokens (component elevation
 * table), https://m3.material.io/styles/elevation (the two rules above).
 */

/** M3's six elevation levels, 0-5. Level 4 and 5 are interaction-only. */
export const ELEVATION_LEVELS = Object.freeze([0, 1, 2, 3, 4, 5]);

/**
 * M3's "Component elevation" table, transcribed from
 * https://m3.material.io/styles/elevation/tokens on 2026-10-01.
 *
 * Keyed by resting level; the value is the component list exactly as the page
 * words it, because the qualifiers are load-bearing — `FAB` (level 3) and
 * `FAB (in navigation rail)` (level 0) are different components at different
 * heights, and collapsing them would assert a level the spec does not.
 */
export const M3_RESTING_ELEVATION = Object.freeze({
  3: Object.freeze([
    "date pickers",
    "dialogs (modal)",
    "extended fab",
    "fab",
    "fab menu (close button)",
    "search",
    "time pickers",
  ]),
  2: Object.freeze([
    "app bar (scrolled)",
    "menu",
    "navigation bar",
    "rich tooltip",
    "toolbar",
  ]),
  1: Object.freeze([
    "banner",
    "bottom sheet (modal)",
    "button (elevated)",
    "card (elevated)",
    "chips (elevated)",
    "navigation drawer (modal)",
    "side sheet (modal)",
  ]),
  0: Object.freeze([
    "app bar (not scrolled)",
    "buttons (filled, tonal, outlined)",
    "button groups",
    "cards (filled, outlined)",
    "carousel",
    "chips",
    "dialog (full-screen)",
    "extended fab (in navigation rail)",
    "fab (in navigation rail)",
    "fab menu (list items)",
    "icon buttons",
    "list",
    "navigation rail",
    "segmented button",
    "side sheet (docked)",
    "slider",
    "split button",
    "tabs",
  ]),
} as const);

/**
 * Kern components that M3's table DOES name, mapped to the spec row they
 * implement. This is the assertion set: a component listed here is measured
 * against the level M3 gives that row, and a mismatch is a violation.
 *
 * `variants` holds every level the row legitimately permits, because a single
 * kern component can implement more than one spec row:
 *   - `dialog` covers "dialogs (modal)" (3) and "dialog (full-screen)" (0);
 *   - `fab-menu` covers "fab menu (close button)" (3) and
 *     "fab menu (list items)" (0);
 *   - `sheet` covers "bottom sheet (modal)" / "side sheet (modal)" (1) and
 *     "side sheet (docked)" (0).
 * A component sits in the set only if the level it ships is one of these.
 */
export const M3_ELEVATION_COMPONENTS = Object.freeze({
  fab: Object.freeze({ rows: ["fab"], variants: [3] }),
  "extended-fab": Object.freeze({ rows: ["extended fab"], variants: [3] }),
  dialog: Object.freeze({
    rows: ["dialogs (modal)", "dialog (full-screen)"],
    variants: [0, 3],
  }),
  "alert-dialog": Object.freeze({
    rows: ["dialogs (modal)"],
    variants: [3],
  }),
  card: Object.freeze({ rows: ["card (elevated)"], variants: [1] }),
  "navigation-menu": Object.freeze({ rows: ["menu"], variants: [2] }),
  "fab-menu": Object.freeze({
    rows: ["fab menu (close button)", "fab menu (list items)"],
    variants: [0, 3],
  }),
  sheet: Object.freeze({
    rows: ["bottom sheet (modal)", "side sheet (modal)", "side sheet (docked)"],
    variants: [0, 1],
  }),
} as const);

/**
 * Kern components that carry an elevation token but that M3's table does NOT
 * name. Their level is a **kern decision**, not a spec claim — M3 only says
 * "most components have a default elevation" without tabulating these.
 *
 * Each maps to a deviation id so the choice is recorded rather than incidental.
 * They are NOT asserted against M3 (there is nothing to assert against); they
 * are inventoried so a new spec row has somewhere to land and so a silent
 * change to one is visible in the diff of this file.
 */
export const KERN_UNASSIGNED_ELEVATION = Object.freeze({
  snackbar: "K6",
  select: "K6",
  "country-select": "K6",
  combobox: "K6",
  autocomplete: "K6",
  popover: "K6",
  drawer: "K6",
  command: "K6",
  "preview-card": "K6",
  sonner: "K6",
} as const);

/** Every component kern ships a resting elevation for. */
export const ELEVATED_COMPONENTS = Object.freeze([
  ...Object.keys(M3_ELEVATION_COMPONENTS),
  ...Object.keys(KERN_UNASSIGNED_ELEVATION),
]);

/**
 * Audit one measured component's resting elevation against the spec inventory.
 *
 * `measured` is the level resolved from source (own file plus local import
 * closure), or `null` for a surface/outline component that carries no token.
 *
 * Returns the violation list for that component — empty means conformant, and
 * for a component M3 does not name, empty means "kern decision, unasserted".
 */
export function auditElevation(
  component: string,
  measured: number | null,
): Array<string> {
  const problems: Array<string> = [];

  if (measured !== null && !ELEVATION_LEVELS.includes(measured as 0)) {
    problems.push(
      `${component}: elevation level${measured} is not an M3 level (0-5)`,
    );
    return problems;
  }

  const spec = (
    M3_ELEVATION_COMPONENTS as Record<
      string,
      { readonly rows: readonly string[]; readonly variants: readonly number[] }
    >
  )[component];

  if (spec) {
    if (measured === null) {
      problems.push(
        `${component}: M3 assigns resting level${spec.variants.join("/")} ` +
          `(${spec.rows.join(", ")}) but kern ships no elevation token`,
      );
    } else if (!spec.variants.includes(measured)) {
      problems.push(
        `${component}: ships elevation level${measured}, M3 assigns ` +
          `level${spec.variants.join("/")} (${spec.rows.join(", ")})`,
      );
    }
  }

  return problems;
}
