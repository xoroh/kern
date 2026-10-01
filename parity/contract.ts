/**
 * Cross-renderer parity contract — tranches 1 and 2.
 *
 * This file is DATA ONLY. It imports nothing, by design:
 *
 *   ADR 002's boundary says `@xoroh/kern` and `@xoroh/kern-native` must never
 *   import each other. A shared test contract is the most natural place to break
 *   that — it wants to touch both renderers to compare them. So instead of
 *   importing a component, it DECLARES the observable contract, and each side's
 *   test suite (web: vitest, native: RNTL/jest) supplies its own renderer and its
 *   own queries. The contract is the shared thing; the components never meet.
 *
 * Primitive-agnostic by construction: every field here is observable semantics
 * (`role`, checked/selected/disabled state) or a label. Nothing references Base UI,
 * `data-*` attributes, DOM nodes, or RN internals. If a future ruling swaps the
 * web primitive, these rows are still the right assertions — which is the whole
 * test of whether a contract row was written correctly.
 *
 * Ladder: `.team/plans/K-01-ladder.md` §Phase 2b → P2b-4 tranches 1 and 2.
 */

/** How a renderer reports a boolean state for a control. */
export type StateAxis =
  /** ARIA `aria-checked` on web, `accessibilityState.checked` on native. */
  | "checked"
  /** ARIA `aria-selected`, native `accessibilityState.selected`. */
  | "selected"
  /** ARIA `aria-pressed`, native `accessibilityState.selected` on a toggle. */
  | "pressed";

export type Interaction = "toggle" | "select";

export type ParityRow = {
  /** Registry name — the same identity `packages/mcp/src/manifest.ts` uses. */
  component: string;
  /** Accessible role, identical on both sides. Not `role="switch"` on one and
   *  `role="checkbox"` on the other: that is exactly the divergence a contract
   *  exists to catch. */
  role: string;
  /** Which boolean axis carries this control's state. */
  axis: StateAxis;
  /** Whether pressing flips the state or moves a selection. */
  interaction: Interaction;
  /** Accessible name, so both sides are queried the same way. */
  name: string;
  /** What must hold after one interaction. */
  expects: {
    /** State before any interaction. */
    initial: boolean;
    /** State after exactly one interaction. */
    afterActivate: boolean;
    /** State after activating a disabled control (must not change). */
    afterDisabledActivate: boolean;
  };
  /** Native can express this many independent simultaneous selections; 1 = exclusive. */
  maxSelected: number;

  /**
   * Which assertion family this row belongs to. Absent on tranche-1 rows, which
   * are all boolean-axis controls and use `expects` + `axis` alone.
   *
   * Tranche 2 added families because a boolean axis is the wrong shape for a
   * name-bearing surface (a dialog, a list row) or a text field. Forcing those
   * into `initial`/`afterActivate` booleans would have meant inventing a fake
   * checked-state for them — the contract would then assert something neither
   * renderer does, which is worse than not asserting it. A row says which
   * family it is, and each suite asserts only that family's fields.
   */
  family?: "toggle" | "named-surface" | "text-field";
  /** For `named-surface`: substrings that must ALL appear in the accessible name. */
  nameMustContain?: readonly string[];
  /** For `text-field`: true when the field accepts multiple lines. */
  multiline?: boolean;
  /** For `text-field`: true when a disabled field must refuse text entry. */
  refusesTextWhenDisabled?: boolean;
  /** For `text-field`: set when the error is announced through the hint (native),
   *  because RN has no `accessibilityState.invalid`. Deliberate asymmetry. */
  errorViaHint?: boolean;
};

/**
 * The shared surface both renderers already ship. Tranche 1 covers controls that
 * exist on BOTH sides today, so a failure means real divergence rather than a
 * missing component.
 */
export const CONTRACTS: readonly ParityRow[] = [
  {
    component: "switch",
    role: "switch",
    axis: "checked",
    interaction: "toggle",
    name: "Airplane mode",
    expects: {
      initial: false,
      afterActivate: true,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    component: "checkbox",
    role: "checkbox",
    axis: "checked",
    interaction: "toggle",
    name: "Accept terms",
    expects: {
      initial: false,
      afterActivate: true,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    component: "button",
    role: "button",
    axis: "pressed",
    interaction: "toggle",
    name: "Save",
    // A button has no persistent pressed state; the contract here is that
    // activation does not leave one behind and does not report a toggle axis.
    expects: {
      initial: false,
      afterActivate: false,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },

  // ------------------------------------------------------------- tranche 2
  // Measured on both renderers before being written down; see
  // `.team/findings/2026-10-01-p2b4-tranche2-measured-divergences.md`.
  //
  // Each of these rows deliberately asserts the SUBSET both renderers actually
  // honour today. Four further divergences were measured and are NOT encoded
  // here, because writing them would have meant either landing a red suite or
  // encoding one renderer's API into a cross-renderer contract: `list-item`
  // interactive role (web `listitem` vs native `button`), `dialog` role (web
  // `dialog`, native `none`), `dialog` `aria-modal` (absent on web, which is
  // the same one-attribute gap the P2b-2 changeset fixed for `NavigationDrawer`),
  // and native text-field `accessibilityRole` (undefined). Those need a design
  // ruling before they can be a contract row.

  {
    // A filter chip is a toggle wearing the `pressed` axis: web reports
    // `aria-pressed`, native reports `accessibilityState.selected`. That mapping
    // is already this file's documented meaning of "pressed".
    component: "chip",
    role: "button",
    axis: "pressed",
    interaction: "toggle",
    name: "Vegetarian",
    family: "toggle",
    expects: {
      initial: false,
      afterActivate: true,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    // An assist chip is NOT a toggle. Web omits `aria-pressed` entirely and
    // native reports `selected: false`; neither may ever report a pressed state
    // after activation. This is the row that catches an assist chip quietly
    // growing toggle behaviour.
    component: "chip",
    role: "button",
    axis: "pressed",
    interaction: "toggle",
    name: "Get directions",
    family: "toggle",
    expects: {
      initial: false,
      afterActivate: false,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    component: "list-item",
    role: "listitem",
    axis: "selected",
    interaction: "select",
    name: "Airplane mode, Updated 2 h ago",
    family: "named-surface",
    // Asserted as substrings, not as one exact string: web computes its
    // accessible name from the DOM (space-joined) while native builds it with an
    // explicit ", " join. The separator is an artefact of how each platform
    // derives a name, not a Kern decision, so pinning it would be pinning an
    // accident. What must hold is that BOTH lines are announced.
    nameMustContain: ["Airplane mode", "Updated 2 h ago"],
    expects: {
      initial: false,
      afterActivate: false,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    component: "dialog",
    role: "dialog",
    axis: "selected",
    interaction: "select",
    name: "Discard draft?",
    family: "named-surface",
    // The dialog must be findable BY its title on both sides — that is the
    // whole contract for a modal surface. Not asserting the role here: web
    // exposes `dialog`, native exposes `none`, and that gap is filed for a
    // ruling rather than papered over here.
    nameMustContain: ["Discard draft?"],
    expects: {
      initial: false,
      afterActivate: false,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    component: "input",
    role: "textbox",
    axis: "checked",
    interaction: "toggle",
    name: "Full name",
    family: "text-field",
    multiline: false,
    refusesTextWhenDisabled: true,
    errorViaHint: true,
    expects: {
      initial: false,
      afterActivate: false,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    component: "textarea",
    role: "textbox",
    axis: "checked",
    interaction: "toggle",
    name: "Notes",
    family: "text-field",
    multiline: true,
    refusesTextWhenDisabled: true,
    errorViaHint: true,
    expects: {
      initial: false,
      afterActivate: false,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
] as const;

/** Lookup for a test that knows its component by name.
 *
 *  Tranche 2 introduced a second `chip` row (filter vs assist), so a component
 *  name alone is no longer a unique key. `contractFor("chip")` still resolves —
 *  it returns the FIRST row for that component, which keeps every tranche-1 call
 *  site working unchanged — but a test that needs the other variant asks for it
 *  by name: `contractFor("chip", "assist")`. Looking a row up by position would
 *  be a silent-breakage generator the moment a row is inserted.
 */
export function contractFor(component: string, variant?: string): ParityRow {
  const rows = CONTRACTS.filter((c) => c.component === component);
  const row = variant ? rows.find((c) => c.name === variant) : rows[0];
  if (!row) {
    throw new Error(
      rows.length > 0 && variant
        ? `parity contract for "${component}" has no row named "${variant}". ` +
            `Known: ${rows.map((c) => JSON.stringify(c.name)).join(", ")}.`
        : `no parity contract declared for "${component}". Add a row to CONTRACTS ` +
            `(kern/parity/contract.ts) — or, if the component is new, ` +
            `decide the contract before asserting it.`,
    );
  }
  return row;
}

/**
 * The failure message both suites print, so a divergence reads identically
 * regardless of which renderer failed.
 */
export function divergenceMessage(
  row: ParityRow,
  renderer: "web" | "native",
  detail: string,
): string {
  return [
    `PARITY DIVERGENCE — ${row.component} (${renderer} renderer)`,
    `  role:        ${row.role}`,
    `  axis:        ${row.axis}`,
    `  name:        ${JSON.stringify(row.name)}`,
    `  interaction: ${row.interaction}`,
    `  ${detail}`,
    `  Contract: docs/parity-contract.md · gate: bun run check:parity`,
  ].join("\n");
}

/**
 * Assert with a parity message on BOTH runners.
 *
 * Vitest's `expect(value, message)` accepts a custom message; Jest's does not
 * ("Expect takes at most one argument"). Rather than write every assertion twice
 * in the runner's own idiom — and rather than lose the message on the native
 * side, where a bare boolean failure is far harder to act on — this throws the
 * divergence report directly. Same failure text on both renderers, which is the
 * point: a parity failure should read identically whoever hits it.
 */
export function assertParity(
  row: ParityRow,
  renderer: "web" | "native",
  actual: unknown,
  expected: unknown,
  detail: string,
): void {
  if (actual !== expected) {
    throw new Error(
      divergenceMessage(
        row,
        renderer,
        `${detail} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`,
      ),
    );
  }
}
