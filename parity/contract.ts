/**
 * Cross-renderer parity contract — tranche 1.
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
 * Ladder: `.team/plans/K-01-ladder.md` §Phase 2b → P2b-4 tranche 1.
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
] as const;

/** Lookup for a test that knows its component by name. */
export function contractFor(component: string): ParityRow {
  const row = CONTRACTS.find((c) => c.component === component);
  if (!row) {
    throw new Error(
      `no parity contract declared for "${component}". Add a row to CONTRACTS ` +
        `(packages/kern/src/parity/contract.ts) — or, if the component is new, ` +
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
