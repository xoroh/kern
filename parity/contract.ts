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
  family?:
    | "toggle"
    | "named-surface"
    | "text-field"
    | "stepper"
    | "otp-field"
    | "hint-surface";
  /** For `named-surface`: substrings that must ALL appear in the accessible name. */
  nameMustContain?: readonly string[];
  /** For `text-field`: true when the field accepts multiple lines. */
  multiline?: boolean;
  /** For `text-field`: true when a disabled field must refuse text entry. */
  refusesTextWhenDisabled?: boolean;
  /** For `text-field`: set when the error is announced through the hint (native),
   *  because RN has no `accessibilityState.invalid`. Deliberate asymmetry. */
  errorViaHint?: boolean;
  /** For `text-field`: true when an error message must REACH assistive tech as
   *  text, not merely set a state bit. Web delivers it as a `role="alert"`
   *  message via `aria-describedby`; native folds it into the hint. Both must
   *  carry the text — the delivery differs, the obligation does not. */
  errorMessageCarriesText?: boolean;

  /**
   * For `named-surface`: the surface is MODAL, so it must expose its modality
   * to assistive tech (`aria-modal` web, `accessibilityViewIsModal` native).
   * A modal that only traps focus is still a trap to a screen reader.
   */
  modal?: boolean;

  /**
   * For `named-surface`: the row is ACTIONABLE, so it is a control, not a
   * display row. Stated as a field rather than left to the row's `role` because
   * the STATIC row is the one carrying that `role` — an actionable row changes
   * what the role means, and the two must not be conflated.
   */
  interactive?: boolean;
  /** The role an actionable row must expose. `button` for an action,
   * `link` for navigation. Maps to native `accessibilityRole`. */
  interactiveRole?: string;

  /**
   * For `stepper`: the value the field shows before any interaction. A
   * stepper's whole contract is arithmetic, so the row states the arithmetic
   * rather than a boolean axis.
   */
  start?: number;
  /** For `stepper`: the increment one press of each button applies. */
  step?: number;
  /** For `stepper`: inclusive lower bound. A press at the bound must be inert. */
  min?: number;
  /** For `stepper`: inclusive upper bound. A press at the bound must be inert. */
  max?: number;
  /**
   * For `stepper`: the value after one press of the stepper named
   * `stepperLabels[0]`. Stated explicitly because the observable is the value,
   * not a state — the contract that matters is "it moved by exactly `step`".
   */
  afterDecrement?: number;
  /** For `stepper`: the value after one press of the other stepper. */
  afterIncrement?: number;
  /** For `stepper`: the accessible names of the two steppers, in order. */
  stepperLabels?: readonly [string, string];

  /** For `otp-field`: how many character positions the field has. */
  positions?: number;
  /**
   * For `otp-field`: the assembled value once every position has been filled by
   * typing one character into each, in order.
   */
  completedValue?: string;

  /**
   * For `hint-surface`: the supplementary text, which must REACH assistive
   * technology as text and not merely appear as pixels.
   *
   * A tooltip's whole purpose is to carry what the trigger's own name cannot, so
   * a renderer that only paints the text delivers nothing to a screen-reader
   * user. This is M3's NC-3 negative ("a tooltip must not hide crucial
   * information") stated as an assertion rather than a note.
   *
   * The delivery differs and the obligation does not: web links the surface to
   * the trigger by description, native folds the text into `accessibilityHint`.
   */
  hintCarriesText?: string;
  /**
   * For `hint-surface`: the surface must be INERT — it takes no touch and
   * exposes no interactive role.
   *
   * M3's plain tooltip holds a label and nothing else. A surface that could be
   * pressed or focused would let a supplementary hint trap the user, which is
   * the same NC-3 family from the other side.
   */
  surfaceInert?: boolean;
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
  // honour today. One divergence was measured and is still NOT encoded here
  // because the fix is on the native side: the `dialog` ROLE (web exposes
  // `dialog`, native `none` — ruled to `kern-lead`). The other three have since
  // been ruled and encoded: `list-item` interactive role (`interactive` /
  // `interactiveRole`), `dialog` `aria-modal` (`modal`), and `errorMessage`
  // (`errorMessageCarriesText`).

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
    // STATIC row. A row that only displays carries no interactive role: web
    // states `role="listitem"`, native reports `"none"` inside a labelled list
    // — a documented mapping, since the DOM's list structure already supplies
    // the list context RN has to be told about.
    interactive: false,
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
    // ACTIONABLE row — the same component in its interactive variant. A row
    // that acts or navigates IS a control: web renders `<button>`/`role="link"`,
    // native sets `accessibilityRole="button"`/`"link"`. Keyed by `name` so
    // `contractFor("list-item")` still resolves the static row above.
    component: "list-item",
    role: "listitem",
    axis: "selected",
    interaction: "select",
    name: "Airplane mode, Updated 2 h ago",
    family: "named-surface",
    interactive: true,
    interactiveRole: "button",
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
    // whole contract for a modal surface — and it must say it is MODAL. Base
    // UI's `Dialog.Popup` traps focus but emits no `aria-modal`; web sets it
    // explicitly, native has `accessibilityViewIsModal` on `Modal`.
    modal: true,
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
    errorMessageCarriesText: true,
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

  // ------------------------------------------------------------- tranche 3
  // The M3 input family (P2b-3 tranche 1). Every field below was MEASURED on
  // both renderers before being written; see
  // `docs/parity-contract.md` §"Native versions of the input family (P2b-3)".
  //
  // A stepper and an OTP field have no boolean state to assert, so forcing them
  // into `expects.initial`/`afterActivate` would have meant asserting a state
  // neither renderer has. They get their own families: the stepper's contract
  // is arithmetic, the OTP field's is the assembled code.

  {
    // Measured on web (Base UI `NumberField`): at `value=5, step=2`, one
    // press of Decrease yields **3** — an arithmetic step, NOT a value snapped
    // to the nearest multiple of 2. That measurement is why `step` is an
    // increment size and not a grid; an early native draft snapped and turned
    // an increment into +3, and the shared test caught it.
    component: "number-field",
    role: "textbox",
    axis: "checked",
    interaction: "select",
    name: "Count",
    family: "stepper",
    start: 5,
    step: 2,
    min: 0,
    max: 10,
    afterDecrement: 3,
    afterIncrement: 7,
    stepperLabels: ["Decrease", "Increase"],
    expects: {
      initial: false,
      afterActivate: false,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    component: "input-otp",
    role: "group",
    axis: "checked",
    interaction: "select",
    name: "One-time code",
    family: "otp-field",
    positions: 4,
    completedValue: "1234",
    expects: {
      initial: false,
      afterActivate: false,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },

  // ------------------------------------------------------------- tranche 4
  // The M3 Tooltip, native side built after `review-m3` ruled it a GAP rather
  // than a registerable asymmetry
  // (`.team/reports/reviews/m3/2026-10-01-tooltip-ruling.md`). M3 has a tooltip
  // concept and specifies it for the touch platform, so the component is owed
  // on both sides; only the TRIGGER diverges.
  {
    // Measured on web before this row was written, not read off the source.
    // Three findings constrained what could honestly be asserted:
    //
    //   1. Base UI's `Tooltip.Popup` renders with **no `role`** at all — not
    //      `role="tooltip"`, not `role="none"`. So the row cannot assert a
    //      role for the surface: there is nothing to assert on web.
    //   2. The trigger carries **no `aria-describedby`**, before or after the
    //      surface opens, so "the text is linked to the trigger" is NOT a
    //      property of the shipped web component. Asserting it would land a red
    //      suite on day one; asserting its absence would bless a gap as a
    //      contract. Neither is asserted — recorded here as the web-side debt.
    //   3. The popup is `tabindex="-1"`, i.e. focusable-but-not-tabbable, which
    //      is the inert reading `surfaceInert` pins.
    //
    // So the row asserts the ONE obligation both renderers actually honour —
    // the supplementary text is present as text — and leaves the linking
    // mechanism free, which is the whole point of a contract row: it must
    // survive a change of delivery mechanism.
    component: "tooltip",
    role: "button",
    axis: "selected",
    interaction: "select",
    name: "Save",
    family: "hint-surface",
    hintCarriesText: "Saves your draft",
    surfaceInert: true,
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
        ? `parity contract for "${component}" has no row named ${JSON.stringify(variant)}. ` +
            `Known: ${rows.map((c) => JSON.stringify(c.name)).join(", ")}.`
        : `no parity contract declared for "${component}". Add a row to CONTRACTS ` +
            `(kern/parity/contract.ts) — or, if the component is new, ` +
            `decide the contract before asserting it.`,
    );
  }
  return row;
}

/**
 * The ACTIONABLE row for a component that has both a static and an interactive
 * variant.
 *
 *  `contractFor` keys variants by accessible NAME, which cannot separate these
 *  two: the actionable row announces the same words as the static one — same
 *  component, same content, different semantics. So the discriminator is the
 *  `interactive` flag. Returning the static row for an interactive query would
 *  silently assert the wrong thing (and vice versa), which is why this is a
 *  separate function that throws rather than a defaulted parameter.
 */
export function contractForInteractive(component: string): ParityRow {
  const row = CONTRACTS.find(
    (c) => c.component === component && c.interactive === true,
  );
  if (!row) {
    throw new Error(
      `no INTERACTIVE parity contract declared for "${component}". Add a row to ` +
        `CONTRACTS with \`interactive: true\` (kern/parity/contract.ts).`,
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
