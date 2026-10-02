/**
 * M3 RESTING-ELEVATION INVENTORY — the declared target for `check:kern`.
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
 * module is that target, in the same shape as `kern-roles.ts`: the spec's own rows,
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
export const KERN_RESTING_ELEVATION = Object.freeze({
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
export const KERN_ELEVATION_COMPONENTS = Object.freeze({
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
  /**
   * M3 tabulates cards TWICE: "card (elevated)" at level 1 and "cards (filled,
   * outlined)" at level 0. Kern's Card implements both through its variant axis —
   * the `elevated` variant carries `--md-sys-elevation-level1` and the filled and
   * outlined variants carry none — so one component legitimately covers two rows,
   * exactly as Button does.
   *
   * Declaring only [1] was wrong in the direction that reads as stricter but is
   * not: the gate resolves a component's level by scanning its source closure, so
   * it measured 1 and passed, while a consumer rendering a plain filled card was
   * shipping level 0 that no row permitted. Stating [0, 1] makes the claim match
   * what the component actually does.
   */
  card: Object.freeze({
    rows: ["card (elevated)", "cards (filled, outlined)"],
    variants: [0, 1],
  }),
  /**
   * M3 tabulates buttons TWICE: "button (elevated)" at level 1 and
   * "buttons (filled, tonal, outlined)" at level 0. Kern's Button implements both
   * through its `variant` axis, so one component legitimately covers two rows —
   * which is why `variants` accepts [0, 1].
   *
   * Button shipped level 1 ungated until this row: `check:docs` flagged it, and
   * the fix is asserted rather than assumed — mutating Button's token to level 4
   * now fails `check:kern` with
   * "button: ships elevation level4, M3 assigns level0/1".
   *
   * Note for the next sweep: a row is only worth adding when the component
   * actually emits `--md-sys-elevation-level<N>` in its import closure. Adding
   * `chip`, `banner`, `slider`, `tabs`, `segmented-button` or `carousel` rows
   * would measure `null` and assert nothing while making the summary read
   * "resting elevation 18/18". Those components carry no elevation token today,
   * so the honest fix is the token, not the row.
   */
  button: Object.freeze({
    rows: ["button (elevated)", "buttons (filled, tonal, outlined)"],
    variants: [0, 1],
  }),
  "navigation-menu": Object.freeze({ rows: ["menu"], variants: [2] }),
  /**
   * LEVEL-0 ROWS — added 2026-10-01 (elevation-debt sweep, design-system-lead).
   *
   * M3's component-elevation table assigns resting level **0** to Carousel,
   * Chips, List, Segmented button, Slider and Tabs. Level 0 is `shadow: none`,
   * so **carrying no elevation token is the conformant state** — these components
   * are correct as they ship, and writing `elevation-level0` into them would add
   * a token that renders nothing while making this gate look busier.
   *
   * These rows are gated on the ABSENCE of a token, which `auditElevation`
   * supports: a component whose measured level is `null` and whose spec permits
   * only `[0]` is conformant. That inverts the usual case — here the assertion is
   * "nothing here may drift", so a future edit that ADDS an unearned shadow fails.
   *
   * `chip` additionally permits `[1]` because M3 states "Chip elevation defaults
   * to 0 but can be elevated if they need more visual separation" — kern ships
   * no elevated chip variant today, so the level-0 half is what is asserted.
   */
  chip: Object.freeze({ rows: ["chips"], variants: [0] }),
  slider: Object.freeze({ rows: ["slider"], variants: [0] }),
  tabs: Object.freeze({ rows: ["tabs"], variants: [0] }),
  "segmented-button": Object.freeze({
    rows: ["segmented button"],
    variants: [0],
  }),
  carousel: Object.freeze({ rows: ["carousel"], variants: [0] }),
  /**
   * Keyed `list-item`, not `list`: `packages/kern/src/components/list.tsx` does
   * not exist, so the old `list` key resolved to no file, measured `null`, and —
   * because level 0 treats absence as conformant — passed without ever looking at
   * the component. A row that measures nothing is indistinguishable from a
   * correct one in the summary. M3's row is still named "list"; the key is kern's
   * component name, as every other row here is.
   */
  "list-item": Object.freeze({ rows: ["list"], variants: [0] }),
  /**
   * The ONE real fix from the sweep: `banner` was the only one of the six the
   * brief named that M3 places above zero — the table lists "Banner" at 1dp.
   * kern shipped it with a border and no elevation, so it was genuinely
   * off-spec. Token added; this row asserts it.
   */
  banner: Object.freeze({ rows: ["banner"], variants: [1] }),
  // M3's level-2 table also names "Navigation bar", "Rich tooltip" and
  // "Toolbar". kern ships all three, so they were silently UNGATED before this
  // row — a mutation that deleted their elevation token still passed
  // `check:kern` (proved by mutation test). Adding them makes the spec claim
  // executable rather than aspirational.
  "navigation-bar": Object.freeze({ rows: ["navigation bar"], variants: [2] }),
  tooltip: Object.freeze({ rows: ["rich tooltip"], variants: [2] }),
  toolbar: Object.freeze({ rows: ["toolbar"], variants: [2] }),
  "fab-menu": Object.freeze({
    rows: ["fab menu (close button)", "fab menu (list items)"],
    variants: [0, 3],
  }),
  sheet: Object.freeze({
    rows: ["bottom sheet (modal)", "side sheet (modal)", "side sheet (docked)"],
    variants: [0, 1],
  }),
  /**
   * DRAWER — DECIDED by design authority (design-system-lead, 2026-10-03): **conform
   * to M3's level 1.** The code was changed, not the registry.
   *
   * The history, because it is the useful part. `drawer` had been registered as
   * unassigned under id K6, on the claim that M3's table does not name it.
   *
   *  1. THAT CLAIM IS FALSE. M3 tabulates `navigation drawer (modal)` at level 1
   *     — in KERN_RESTING_ELEVATION above, in this same file. The registry
   *     contradicted the spec table sitting next to it.
   *  2. K6 is the Tones-engine id, not an elevation deviation, so an elevation
   *     decision was filed under a tone id and the two spaces could not be told
   *     apart. That is how the wrong one survived review.
   *
   * So the real question was never "no spec row". It was "kern ships 2, M3 says
   * 1" — and the registry was carrying `variants: [1, 2]` to keep the gate green
   * while the deviation stayed visible. That was the right interim state and the
   * wrong place to stop.
   *
   * WHY 1, on evidence rather than deference to the table:
   *
   *  - **kern's own siblings already agree.** All four sheet-family modal
   *    surfaces (Sheet, SnapSheet, EntitySheet, the picker sheet) ship
   *    `--md-sys-elevation-level1`.
   *  - **The drawer is the same kind of surface.** Bottom-anchored
   *    (`items-end justify-center`), top-rounded only
   *    (`rounded-t-extra-large`), `max-h-[80vh]`, with a backdrop. It is a modal
   *    bottom sheet wearing a different name.
   *  - **M3 puts comparable surfaces at 1**: `bottom sheet (modal)` and
   *    `side sheet (modal)` are both level 1, as is `navigation drawer (modal)`.
   *  - **No reason for 2 was ever established.** The earlier note said exactly
   *    that, and declined to guess.
   *
   * A fourth sibling at a higher elevation than the other three is an
   * inconsistency, not a decision. Registering it as a deviation would have
   * spent a K-id on an accident and made future audits quieter. Level 2 was
   * reserved for `menu`, `navigation bar`, `toolbar`, `rich tooltip` and
   * `app bar (scrolled)` — none of which is a modal bottom sheet.
   */
  drawer: Object.freeze({
    rows: ["navigation drawer (modal)"],
    variants: [1],
  }),
} as const);

/**
 * Kern components that carry an elevation token but that M3's table does NOT
 * name. Their level is a **kern decision**, not a spec claim — M3 only says
 * "most components have a default elevation" without tabulating these.
 *
 * They are NOT asserted against M3 (there is nothing to assert against); they are
 * inventoried so a new spec row has somewhere to land and so a silent change to
 * one is visible in the diff of this file.
 *
 * ## CORRECTION — these were filed under K6, which is the WRONG ID
 *
 * Every entry used to read `K6`. K6 is the **Tones engine** deviation in
 * `.team/programs/K-01-deviations.md` — a COLOUR decision about spectrum ramps
 * and dynamic colour. It has nothing to do with elevation. Filing nine elevation
 * decisions under a colour id put two id spaces in one field, which is how a
 * wrong id survives review: nothing cross-checks the space, and the id reads as
 * authoritative because it is shaped like one.
 *
 * The label was also simply wrong. M3 does not tabulate these components at all,
 * so there is NO spec claim to deviate FROM; calling it a deviation asserted a
 * conflict that does not exist. qa caught the collision and escalated rather than
 * fudging it, which was the right call.
 *
 * The honest label is what it is: a kern decision where M3 is silent. If M3 ever
 * tabulates one of these, it moves to KERN_ELEVATION_COMPONENTS and any real
 * departure gets a real id.
 *
 * (Only the KEYS are consumed today — to build ELEVATED_COMPONENTS. Nothing
 * reads the values, which is why this could sit wrong for so long: no gate
 * consumed the lie.)
 */
export const KERN_UNASSIGNED_ELEVATION = Object.freeze({
  snackbar: "kern-decision: M3 does not tabulate this component",
  select: "kern-decision: M3 does not tabulate this component",
  "country-select": "kern-decision: M3 does not tabulate this component",
  combobox: "kern-decision: M3 does not tabulate this component",
  autocomplete: "kern-decision: M3 does not tabulate this component",
  popover: "kern-decision: M3 does not tabulate this component",
  command: "kern-decision: M3 does not tabulate this component",
  "preview-card": "kern-decision: M3 does not tabulate this component",
  sonner: "kern-decision: M3 does not tabulate this component",
} as const);

/** Every component kern ships a resting elevation for. */
export const ELEVATED_COMPONENTS = Object.freeze([
  ...Object.keys(KERN_ELEVATION_COMPONENTS),
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
    KERN_ELEVATION_COMPONENTS as Record<
      string,
      { readonly rows: readonly string[]; readonly variants: readonly number[] }
    >
  )[component];

  if (spec) {
    if (measured === null) {
      // A component that ships NO elevation token is at resting level 0 —
      // level0 is `shadow: none`. So absence is conformant whenever 0 is one of
      // the levels the row permits.
      //
      // The test is therefore `!includes(0)`, NOT `some(level !== 0)`. Those
      // differ exactly on a row with variants [0, 1] — Card, which genuinely
      // ships either (its `elevated` variant at 1, a plain filled card at 0).
      // `some(...)` rejected a filled Card as "ships no elevation token", which
      // is wrong: that card IS conformant. Found by mutation-proving this fix:
      // removing Card's token must PASS, and it did not.
      if (!spec.variants.includes(0)) {
        problems.push(
          `${component}: M3 assigns resting level${spec.variants.join("/")} ` +
            `(${spec.rows.join(", ")}) but kern ships no elevation token`,
        );
      }
    } else if (!spec.variants.includes(measured)) {
      problems.push(
        `${component}: ships elevation level${measured}, M3 assigns ` +
          `level${spec.variants.join("/")} (${spec.rows.join(", ")})`,
      );
    }
  }

  return problems;
}
