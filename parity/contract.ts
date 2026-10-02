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

  // ---------------------------------------------------------------------
  // P2b-1 provenance. The ladder asks for one row per BEHAVIOUR, carrying the
  // component, the behaviour, each side's contract, the spec source, and where
  // the proof lives. Without the last five a row says WHAT to assert but not
  // WHY, by what authority, or who checks it — which is how a manifest rots
  // into an assertion nobody can trace.
  //
  // These are documentation fields: the suites assert `role`/`axis`/`expects`,
  // never these. They are required in the type and enforced by `check:parity`,
  // because an optional provenance field is one that quietly stops being filled
  // in.
  // ---------------------------------------------------------------------

  /**
   * Stable machine key. `behaviour` is the row's real IDENTITY (one component
   * can have two behaviours), but it is prose — a copy-edit would silently
   * rewrite identity, and anything keyed on it would follow the prose into
   * whatever typo landed. This slug does not move when the wording does.
   */
  id: string;
  /**
   * The behaviour this row exists to pin, in one sentence. Several components
   * carry more than one row (`chip` twice, `list-item` twice) precisely because
   * one component can have two behaviours, so this is the row's real identity —
   * `component` alone is not.
   */
  behaviour: string;
  /** The obligation as the web renderer meets it, in observable terms. */
  webContract: string;
  /** The same obligation as the native renderer meets it. */
  nativeContract: string;
  /** The Material 3 source the obligation is derived from. */
  spec: string;
  /** The suites that actually exercise this row on each side. */
  testedBy: string;
  /** Accessible role, identical on both sides. Not `role="switch"` on one and
   *  `role="checkbox"` on the other: that is exactly the divergence a contract
   *  exists to catch. */
  role: string;
  /** Which boolean axis carries this control's state. REQUIRED when
   *  `interactive` is true or absent; FORBIDDEN when it is false. */
  axis?: StateAxis;
  /** Whether pressing flips the state or moves a selection. Same rule as `axis`. */
  interaction?: Interaction;
  /** Accessible name, so both sides are queried the same way. */
  name: string;
  /** What must hold. Required on EVERY row, static included: a caption has no
   *  state to flip, but "this text is announced" is an obligation, and this is
   *  the only field that can state it. Optionality here would have forced six
   *  existing suites to narrow a value that is always present in practice. */
  expects: {
    /** State before any interaction. */
    initial: boolean;
    /** State after exactly one interaction. */
    afterActivate: boolean;
    /** State after activating a disabled control (must not change). */
    afterDisabledActivate: boolean;
  };
  /** Native can express this many independent simultaneous selections; 1 = exclusive.
   *  Same rule as `axis`. */
  maxSelected?: number;

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
    | "hint-surface"
    /** Static content: a caption, summary or description. No state axis and no
     *  interaction, so the control fields are omitted rather than invented. */
    | "static-content";
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

  /**
   * For `named-surface`: the dismissal paths BOTH renderers must provide.
   *
   * This is the contract's whole reason for existing on a sheet. A modal surface
   * that renders but cannot be dismissed is a trap — for a pointer user, and
   * worse for a screen-reader user who may have no way to leave it at all. M3
   * specifies the BEHAVIOUR (a scrim, and a close affordance); it does not
   * specify that both renderers share an implementation, and they do not: web
   * dismisses through a portal scrim and `Escape`, native through a `Pressable`
   * scrim and the Android hardware back button.
   *
   * So the obligation is split rather than flattened. `dismissalRequired` is what
   * both must do. `dismissalOnlyWeb` / `dismissalOnlyNative` record paths a
   * platform has and the other cannot — the same shape as `errorViaHint`, where
   * the delivery differs and the obligation does not. Asserting "native has
   * Escape" would be asserting a platform detail as a Kern contract.
   */
  dismissalRequired?: readonly ("scrim" | "close-control")[];
  dismissalOnlyWeb?: readonly "escape"[];
  dismissalOnlyNative?: readonly "hardware-back"[];
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
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "switch-toggle",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour: "Reports an on/off state and flips it on activation.",
    webContract:
      "A `role=switch` exposing a checked axis; activation flips it; a disabled switch does not change.",
    nativeContract:
      "A `role=switch` whose `accessibilityState.checked` flips on press; disabled blocks the change.",
    spec: "M3 Switch — toggles a single setting on/off.",
    testedBy: "web-parity-switch.test.tsx / native-parity-buttons.rntest.tsx",
    role: "switch",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "checkbox-toggle",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour: "Reports a checked state and flips it on activation.",
    webContract:
      "A `role=checkbox` with a checked axis; activation flips it; disabled does not change.",
    nativeContract:
      "A `role=checkbox` whose `accessibilityState.checked` flips on press; disabled blocks the change.",
    spec: "M3 Checkbox — selects one or more options from a set.",
    testedBy: "web-parity-buttons.test.tsx / native-parity-buttons.rntest.tsx",
    role: "checkbox",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "button-activation",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour:
      "Activation performs an action and leaves no persistent pressed state behind.",
    webContract:
      "A `role=button` that is not a toggle: it reports no pressed axis and does not stay pressed.",
    nativeContract:
      "A `role=button` whose `accessibilityState.selected` is not a toggle and does not latch.",
    spec: "M3 Button — triggers an action; the filled/tonal/outlined variants differ in emphasis, not in state.",
    testedBy:
      "web-parity-buttons.test.tsx / native-parity-controls.rntest.tsx",
    role: "button",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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

  // ---------------------------------------------- overlay surfaces (tranche 5)
  //
  // P2b-3 tranche 5: Drawer, Popover, ScrollArea. Written BEFORE the native
  // implementation, so the declaration is the specification the native side was
  // built against rather than a description of what it happened to do.
  //
  // The row pins the obligation BOTH renderers share — the surface is a labelled
  // dialog that is not presented while closed, and a dismiss control that
  // reports the closed state. It deliberately does NOT pin the trigger, because
  // M3's popover trigger is click-or-hover and touch has neither; the trigger is
  // kern's own per-renderer decision and is asserted in the native suite.
  {
    component: "drawer",
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "drawer-modal-dismiss",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour:
      "A labelled dialog that is not presented while closed and dismisses on request.",
    webContract:
      "A `role=dialog` surface carrying the label, absent while closed, with a dismiss control reporting the closed state.",
    nativeContract:
      "A `role=dialog` modal surface carrying the label, unmounted while closed, dismissing via scrim press and Android back.",
    spec: "M3 Navigation drawer — a modal surface beside the content.",
    testedBy:
      "web-parity-surfaces.test.tsx / native-parity-surfaces.rntest.tsx",
    role: "dialog",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
    axis: "selected",
    interaction: "toggle",
    name: "Menu",
    // M3's modal drawer variant: modal, so dismissal is the meaningful
    // transition. Not "presented while closed" — that is asserted per-renderer,
    // because web unmounts and native hides.
    expects: {
      initial: false,
      afterActivate: true,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    component: "popover",
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "popover-anchored-dismiss",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour:
      "A transient labelled surface anchored to a trigger and dismissible.",
    webContract:
      "A `role=dialog` surface carrying the label, absent while closed; the trigger is click-or-hover on web.",
    nativeContract:
      "A `role=dialog` overlay carrying the label, dismissed on outside press; the trigger is press-only, since touch has no hover.",
    spec: "M3 Menu / anchored surface — transient content tied to an anchor.",
    testedBy:
      "web-parity-surfaces.test.tsx / native-parity-surfaces.rntest.tsx",
    role: "dialog",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
    axis: "selected",
    interaction: "toggle",
    name: "Details",
    // A popover is NOT modal: content behind it stays interactive. The row
    // carries the role only; `accessibilityViewIsModal` is asserted natively,
    // where RN has the prop that expresses it.
    expects: {
      initial: false,
      afterActivate: true,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    component: "scroll-area",
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "scroll-area-labelled",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour: "A named, scrollable region with a labelled scrollbar.",
    webContract:
      "A `role=group` region carrying the label, with the scroll affordance inside it.",
    nativeContract:
      "A `role=group` region carrying the label, wrapping the RN scroll view.",
    spec: "NO M3 COMPONENT — a platform scroll container (RN ScrollView / CSS overflow). Kern extension per T4-V2; the M3-adjacent Scrollbar does not exist as an M3 component, so no M3 source is claimed.",
    testedBy:
      "web-parity-surfaces.test.tsx / native-parity-surfaces.rntest.tsx",
    role: "group",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
    axis: "selected",
    interaction: "toggle",
    name: "Rows",
    // Scrollability is presentational state, not a toggle: neither renderer
    // toggles it, so `afterActivate` is false on both sides by construction.
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
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "chip-filter-toggle",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour: "A filter chip toggles selection and reports it.",
    webContract:
      "A `role=button` toggle exposing a selected axis; activation flips selection.",
    nativeContract:
      "A `role=button` toggle whose `accessibilityState.selected` flips on press.",
    spec: "M3 Filter chip — represents an option toggled on or off.",
    testedBy:
      "web-parity-controls.test.tsx / native-parity-controls.rntest.tsx",
    role: "button",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "chip-assist-activation",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour: "An assist chip performs an action and is not a toggle.",
    webContract:
      "A `role=button` that is not a toggle and reports no selected axis.",
    nativeContract:
      "A `role=button` whose `accessibilityState.selected` does not latch.",
    spec: "M3 Assist chip — triggers an action, such as opening a chip.",
    testedBy:
      "web-parity-controls.test.tsx / native-parity-controls.rntest.tsx",
    role: "button",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "list-item-static",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour: "A static list row carries a name and no interactive role.",
    webContract:
      "A `role=listitem` whose accessible name contains the row text; it is not focusable.",
    nativeContract:
      "A `role=listitem` whose accessible name is derived from its text; it is not pressable.",
    spec: "M3 List — a continuous set of text or images.",
    testedBy:
      "web-parity-controls.test.tsx / native-parity-controls.rntest.tsx",
    role: "listitem",
    name: "Airplane mode, Updated 2 h ago",
    family: "named-surface",
    // STATIC row. A row that only displays carries no interactive role: web
    // states `role="listitem"`, native reports `"none"` inside a labelled list
    // — a documented mapping, since the DOM's list structure already supplies
    // the list context RN has to be told about.
    //
    // It carried `axis: "selected"` and `interaction: "select"` before, which
    // contradicted `interactive: false` on this very row: a state axis and a
    // select interaction describe a CONTROL, and this row says it is not one.
    // Removed rather than left as decoration — the actionable variant of
    // `list-item` is the row that owns them, and it still does. `expects` stays,
    // because a static row can still have an obligation.
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
  },
  {
    // ACTIONABLE row — the same component in its interactive variant. A row
    // that acts or navigates IS a control: web renders `<button>`/`role="link"`,
    // native sets `accessibilityRole="button"`/`"link"`. Keyed by `name` so
    // `contractFor("list-item")` still resolves the static row above.
    component: "list-item",
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "list-item-selectable",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour: "An interactive list row exposes selection and reports it.",
    webContract:
      "A `role=listitem` with a selected axis, activatable, and not activatable when disabled.",
    nativeContract:
      "A `role=listitem` whose `accessibilityState.selected` flips on press; disabled blocks it.",
    spec: "M3 List — one item is selected at a time.",
    testedBy:
      "web-parity-controls.test.tsx / native-parity-controls.rntest.tsx",
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
    component: "time-picker",
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "time-picker-normalised-value",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour:
      "Reports one normalised 24-hour value and gives each field its own single selected option.",
    webContract:
      "Three listboxes — hour, minute, and period in 12-hour mode — each with one selected option, reporting a value whose hours are always 0-23 whatever is rendered.",
    nativeContract:
      "Three fields, each a list of options with its own single selected option and its own roving axis, reporting the same normalised 24-hour value; the field container has no listbox role natively and is announced as a list.",
    spec: "M3 Time picker — hour, minute and period, with 12-hour rendering as an alternate presentation of 24-hour state.",
    // The web side has NO time-picker test on disk, so naming one would be the
    // false `testedBy` this gate exists to catch. Recorded as a gap.
    testedBy:
      "web-parity-navigation.test.tsx / native-parity-navigation.rntest.tsx",
    role: "list",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
    axis: "selected",
    interaction: "select",
    name: "Hour 09",
    expects: {
      initial: true,
      afterActivate: false,
      afterDisabledActivate: true,
    },
    maxSelected: 1,
  },
  {
    // P2b-1 provenance: what this row is about, and where it came from.
    id: "carousel-active-index",
    component: "carousel",
    behaviour:
      "Reports which item is active and keeps the track on exactly one selected item.",
    webContract:
      "A named region announcing itself as a carousel, with one selected item in the item track and a roledescription on the region and on each item.",
    nativeContract:
      "A named group whose item track carries exactly one selected item, driven by the shared roving model; no roledescription exists natively, so the region is a group and the active item carries selection.",
    spec: "M3 Carousel — a set of items with one active; the entire component, layouts included, was verified in research T4-M1.",
    // The web side has NO carousel test on disk, so naming one would be exactly
    // the false `testedBy` this gate was built to catch. Recorded as a gap.
    testedBy:
      "web-parity-navigation.test.tsx / native-parity-navigation.rntest.tsx",
    role: "group",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
    axis: "selected",
    interaction: "select",
    name: "Slide one",
    expects: {
      initial: true,
      afterActivate: false,
      afterDisabledActivate: true,
    },
    maxSelected: 1,
  },
  {
    component: "dialog",
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "dialog-modal",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour: "A modal dialog exposes its modality and dismisses on request.",
    webContract:
      "A `role=dialog` that reports modality, is named, and dismisses via Escape or the close control.",
    nativeContract:
      "A `role=dialog` modal surface that reports `accessibilityViewIsModal`, is named, and dismisses on back press.",
    spec: "M3 Dialog — an alert-level interruption requiring a response.",
    testedBy:
      "web-parity-controls.test.tsx / native-parity-controls.rntest.tsx",
    role: "dialog",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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
    component: "sheet-surface",
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "sheet-surface-modal",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour:
      "The native sheet meets the same dialog contract as the web dialog.",
    webContract:
      "Not applicable: web has no `sheet-surface`; the counterpart is `dialog`, which this row pins.",
    nativeContract:
      "A `role=dialog` modal surface that is named and dismisses on scrim press, Android back, and a close control.",
    spec: "M3 Bottom sheet — a modal surface anchored to the bottom of the screen.",
    testedBy:
      "web-parity-sheets.test.tsx / native-parity-sheets.rntest.tsx",
    role: "dialog",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
    axis: "selected",
    interaction: "select",
    name: "Filters",
    family: "named-surface",
    // Same modality obligation as `dialog`: a sheet is a modal surface, and a
    // modal that only traps focus is still a trap to a screen reader.
    modal: true,
    nameMustContain: ["Filters"],
    // The sheet contract proper. See the `dismissalRequired` doc comment: a sheet
    // that renders without a way out is the defect this row exists to prevent,
    // and `SheetSurface`'s own header records the four sheets that shipped with
    // an `onDismiss` prop they never used.
    dismissalRequired: ["scrim", "close-control"],
    // Platform extras, recorded so neither renderer is asked to assert a
    // mechanism it does not have.
    dismissalOnlyWeb: ["escape"],
    dismissalOnlyNative: ["hardware-back"],
    expects: {
      initial: false,
      afterActivate: false,
      afterDisabledActivate: false,
    },
    maxSelected: 1,
  },
  {
    component: "input",
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "text-field-single-line",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour:
      "A single-line text field reports its multiline-ness and refuses text when disabled.",
    webContract:
      "A `role=textbox` that is single-line and not editable when disabled.",
    nativeContract:
      "A `role=textbox` whose `editable` is false when disabled, announced through `accessibilityState.disabled`.",
    spec: "M3 Text field — enter and edit text, single line.",
    testedBy:
      "web-parity-controls.test.tsx / native-parity-controls.rntest.tsx",
    role: "textbox",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "text-field-multi-line",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour:
      "A multi-line text field accepts multiple lines and refuses text when disabled.",
    webContract:
      "A `role=textbox` that is multi-line and not editable when disabled.",
    nativeContract:
      "A `role=textbox` whose `editable` is false when disabled, with `multiline` true.",
    spec: "M3 Text field (family) — the filled/outlined variants are the verified surface. The multiline variant is NOT verified against the current spec, so no M3 multiline source is claimed (D-3).",
    testedBy:
      "web-parity-controls.test.tsx / native-parity-controls.rntest.tsx",
    role: "textbox",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "number-field-stepper",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour:
      "A numeric field steps within a range and refuses stepping when disabled.",
    webContract:
      "A `role=textbox` whose increment and decrement controls move the value by one step, and do nothing when disabled.",
    nativeContract:
      "A `role=textbox` with increment/decrement controls that move the value by one step; disabled blocks them.",
    spec: "M3 Text field (FAMILY ONLY) — M3 defines no number-field component and its text-field overview enumerates only filled/outlined. The stepper affordance is a kern extension and is routed to the ext: band per K10, not to an M3 source.",
    testedBy:
      "web-parity-inputs.test.tsx / native-parity-inputs.rntest.tsx",
    role: "textbox",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "otp-segments",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour:
      "A one-time-code field is a named group of segments that advances as it is filled.",
    webContract:
      "A `role=group` of segments; entering a full segment advances focus and announces the code as one field.",
    nativeContract:
      "A `role=group` of segments; entering a full segment advances the active segment.",
    spec: "NO M3 COMPONENT — M3 defines no OTP/PIN component. Kern extension per T4-V2's non-M3 band; routed to ext: rather than claiming an M3 source.",
    testedBy:
      "web-parity-inputs.test.tsx / native-parity-inputs.rntest.tsx",
    role: "group",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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
    // Stable machine key. `behaviour` is prose, so a copy-edit
    // would silently rewrite identity if it were the key.
    id: "tooltip-supplementary",
    // P2b-1 provenance: what this row is about, and where it came from.
    behaviour:
      "Supplementary text is present as text; the mechanism linking it to the trigger is free.",
    webContract:
      "The popup renders with no accessible role, and the trigger is not programmatically linked to it — recorded as web-side debt and asserted neither way",
    nativeContract:
      "The surface is announced as supplementary text on the trigger.",
    spec: "M3 Tooltip — short supplementary text on hover or long-press.",
    testedBy: "web-parity-buttons.test.tsx / native-parity-tooltip.rntest.tsx",
    role: "button",

    // Explicit interactivity marker; see the note on ParityRow.
    interactive: true,
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
  {
    // The one row the static-row support exists for. A caption is CONTENT, not
    // a control: there is no state to flip and nothing to press, so it carries
    // `expects` (the obligation) and deliberately NO axis / interaction /
    // maxSelected. Inventing those would assert a state neither renderer has.
    component: "table-caption",
    id: "table-caption",
    interactive: false,
    family: "static-content",
    behaviour: "The table carries a caption summarising what it contains.",
    webContract: "A real caption element, announced as the table's summary.",
    nativeContract:
      "No caption element exists on this platform; the text is rendered AND appended to the table's accessible name, so it reaches a screen reader.",
    spec: "M3 - Data tables",
    testedBy:
      "web-parity-table-caption.test.tsx / native-parity-table-caption.rntest.tsx",
    role: "caption",
    name: "Team roster",
    expects: {
      initial: true,
      afterActivate: true,
      afterDisabledActivate: true,
    },
  },
  {
    // The target-size obligation is PER-PLATFORM by ruling (e9ab24b). There is
    // no single shared number: 48dp is Material / iOS HIG, while the web is
    // governed by WCAG 2.2 Target Size (Minimum), 24x24 CSS px. The suites
    // assert each side against its own standard AND assert that the two differ,
    // so raising the web minimum to 48 fails rather than passing quietly.
    component: "icon-button-target",
    id: "icon-button-target",
    interactive: true,
    behaviour: "An icon-only action still meets its platform's minimum target size.",
    webContract:
      "The hit area is at least 24x24 CSS px, the WCAG 2.2 Target Size (Minimum) threshold. It is NOT held to 48dp, which is a mobile convention.",
    nativeContract:
      "The hit area is at least 48x48 dp, the Material / iOS HIG threshold for a touch target.",
    spec: "M3 - Icon buttons",
    testedBy:
      "web-parity-icon-target.test.tsx / native-parity-icon-target.rntest.tsx",
    role: "button",
    axis: "pressed",
    interaction: "toggle",
    name: "Notifications",
    expects: {
      initial: false,
      afterActivate: true,
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
