/**
 * Primitives (P domain) module catalogue.
 *
 * Each entry names one kernel module of `@xoroh/axis` (see the
 * installed package's public entry, the barrel this mirrors) and
 * carries the three sections its page renders, in fixed order:
 *
 *   anatomy — the pieces the consumer wires, and what each is for
 *   api     — the exported signatures, with the one decision each encodes
 *   example — one compilable snippet (`examples.ts`, checked by check-snippets)
 *
 * The API rows restate real signatures from `@xoroh/axis`.
 * `scripts/check-primitives-docs.mjs` pins the shape and the barrel coverage,
 * so a module page cannot quietly fall back to "later work".
 *
 * Gated modules (`collection`, `mergeRefs`) have no rows here: they are
 * not installable from any package, so documenting them as usable
 * would be false. They return with their transfer, tests and docs
 * together, when their adoption gates pass.
 */
import { PRIMITIVE_EXAMPLES } from "./examples";

export type PrimitiveAnatomyPart = {
  /** The piece: a parameter, return slot, or model member. */
  part: string;
  /** What it is for, in one line. */
  role: string;
};

export type PrimitiveApiRow = {
  /** The exported signature, types included. */
  signature: string;
  /** The one decision or guarantee it encodes. */
  description: string;
};

export type PrimitiveModule = {
  slug: string;
  title: string;
  blurb: string;
  exports: string[];
  anatomy: PrimitiveAnatomyPart[];
  api: PrimitiveApiRow[];
  example: string;
};

const MODULES: Omit<PrimitiveModule, "example">[] = [
  {
    slug: "use-controllable-state",
    title: "useControllableState",
    blurb: "One state hook for controlled/uncontrolled components",
    exports: ["useControllableState", "StateAction"],
    anatomy: [
      {
        part: "value",
        role: "The controlled prop. Defined means the caller owns the state.",
      },
      {
        part: "defaultValue",
        role: "The uncontrolled seed. Read once; ignored while value is defined.",
      },
      {
        part: "onChange",
        role: "Fires only on a real change (Object.is), never on mount.",
      },
      {
        part: "[state, setState]",
        role: "Resolved current value and an updater taking a value or a function of the previous.",
      },
    ],
    api: [
      {
        signature:
          "useControllableState<T>(value: T | undefined, defaultValue: T | undefined, onChange?: (next: T) => void): [T | undefined, (next: StateAction<T>) => void]",
        description:
          "Controlled when value is defined, uncontrolled otherwise. Warns if a component flips mode mid-lifetime.",
      },
      {
        signature: "type StateAction<T> = T | ((previous: T | undefined) => T)",
        description:
          "The updater form, so callers can write setState((prev) => ...) without a second hook.",
      },
    ],
  },
  {
    slug: "dismiss-policy",
    title: "Dismiss policy",
    blurb: "One dismissal rule for escape / outside-press / pointer-down",
    exports: [
      "createDismissPolicy",
      "dismissTriggersFor",
      "DismissPolicy",
      "DismissPolicyOptions",
      "DismissTriggers",
    ],
    anatomy: [
      {
        part: "dismissible",
        role: "Whether the surface may be dismissed by anything other than its own close affordance.",
      },
      {
        part: "hasDismissHandler",
        role: "Whether the host can close at all. A surface that cannot close must say so, not silently swallow.",
      },
      {
        part: "shouldDismiss(source, enabled, triggers)",
        role: 'The single answer to "may this signal close the surface right now".',
      },
      {
        part: "showClose",
        role: "Whether a visible close affordance is required — derived, not passed.",
      },
    ],
    api: [
      {
        signature:
          "createDismissPolicy(options: DismissPolicyOptions): DismissPolicy",
        description:
          "Options are { dismissible?: boolean; hasDismissHandler: boolean }. The policy derives canDismiss and showClose from them.",
      },
      {
        signature:
          "dismissTriggersFor(surface: { modal: boolean; hasVisibleClose: boolean }): DismissTriggers",
        description:
          "The trigger set a surface implies: modal surfaces get scrim and escape, everything with a close affordance gets closeButton.",
      },
      {
        signature:
          "policy.shouldDismiss(source: DismissSource, enabled: boolean, triggers: DismissTriggers): boolean",
        description:
          "True only when the policy allows dismissal AND that trigger is in the surface's set AND the signal is live.",
      },
    ],
  },
  {
    slug: "dismiss-wiring",
    title: "Dismiss wiring",
    blurb:
      "Wiring helpers that connect dismiss sources to the dismissal policy",
    exports: [
      "dismissBranchesFor",
      "shouldDismissOn",
      "DismissBranches",
      "DismissSource",
      "DismissWiringOptions",
    ],
    anatomy: [
      {
        part: "DismissSource",
        role: 'The five signals: "outside-pointer" | "focus-out" | "escape" | "system-back" | "close".',
      },
      {
        part: "branches",
        role: "A Record<DismissSource, boolean> — which signals this surface listens to at all.",
      },
      {
        part: "modal / dismissible / hasVisibleClose",
        role: "The three facts that determine the branch map. One place decides, every listener reads it.",
      },
    ],
    api: [
      {
        signature:
          "dismissBranchesFor(options: DismissWiringOptions): DismissBranches",
        description:
          "Resolves the branch map once at setup, so keydown and pointerdown handlers cannot disagree about what closes the surface.",
      },
      {
        signature:
          "shouldDismissOn(source: DismissSource, enabled: boolean, branches: DismissBranches): boolean",
        description:
          "The per-event lookup a handler calls. Matches dismissPolicy's answer when both are wired from the same facts.",
      },
    ],
  },
  {
    slug: "focus-trap",
    title: "Focus trap",
    blurb: "Focus-trap model: tab cycling bounds and autofocus resolution",
    exports: [
      "nextTrapIndex",
      "resolveAutofocus",
      "AutofocusEvent",
      "FocusTrapModel",
      "TrapMove",
    ],
    anatomy: [
      {
        part: "stops",
        role: "The ordered focusable items. The model counts them; the renderer owns the nodes.",
      },
      {
        part: "move(next | previous | first | last)",
        role: "Returns the index to focus. Looping is an option, not an assumption.",
      },
      {
        part: "autofocus(autoFocusIndex?)",
        role: "Which stop to focus on open: the named stop, else the first, else nothing.",
      },
    ],
    api: [
      {
        signature:
          "createFocusTrapModel(options: { count: number; loop?: boolean; initialIndex?: number }): FocusTrapModel",
        description:
          "Index arithmetic over an abstract stop list. The model never touches the DOM.",
      },
      {
        signature:
          "nextTrapIndex(current: number, count: number, move: TrapMove, loop: boolean): number",
        description:
          "The pure step function behind move(). Returns -1 for an empty trap rather than inventing a target.",
      },
      {
        signature:
          "resolveAutofocus(count: number, autoFocusIndex?: number): AutofocusEvent",
        description:
          'Returns { type: "focus-stop"; index } or { type: "none" }. An out-of-range index falls back to the first stop.',
      },
    ],
  },

  {
    slug: "overlay-modality",
    title: "Overlay modality",
    blurb:
      "Tracks which overlay layer owns the keyboard and screen-reader focus",
    exports: [
      "createOverlayModality",
      "useOverlayModality",
      "useOverlayRegistration",
      "OverlayId",
      "OverlayModalityState",
    ],
    anatomy: [
      {
        part: "stack",
        role: "Registration order of open overlays. Only the top entry is modal.",
      },
      {
        part: "register(id)",
        role: "Pushes an overlay and returns its unregister. One registry per app root.",
      },
      {
        part: "isTop(id) / isInertOutside(id)",
        role: "The two questions a renderer asks before drawing or tabbing.",
      },
    ],
    api: [
      {
        signature:
          "createOverlayModality(): { register(id: OverlayId): () => void; subscribe(listener: () => void): () => void; getState(): OverlayModalityState }",
        description:
          "The shared registry. Hosts mount one and pass it down; overlays never create their own.",
      },
      {
        signature:
          "useOverlayRegistration(registry, id: OverlayId, active?: boolean): void",
        description:
          "Registers while active. Pass active: false for a mounted-but-closed sheet — present in the tree, not making the page inert.",
      },
      {
        signature: "useOverlayModality(registry): OverlayModalityState",
        description:
          "Subscribes to the stack. Re-renders on push/pop, so the top overlay always knows it is top.",
      },
    ],
  },
  {
    slug: "portal",
    title: "Portal",
    blurb: "Portal registry and target resolution",
    exports: [
      "createPortalRegistry",
      "resolvePortalTarget",
      "PortalEntry",
      "PortalRegistry",
    ],
    anatomy: [
      {
        part: "mount / unmount",
        role: "Claims a slot in the overlay host. Mount order, not z-index, decides stacking.",
      },
      {
        part: "order()",
        role: "Bottom-first ids — the render order the host paints.",
      },
      {
        part: "resolvePortalTarget",
        role: "Which host node to render into: the owner's choice, else the default root.",
      },
    ],
    api: [
      {
        signature: "createPortalRegistry(): PortalRegistry",
        description:
          "subscribe / mount / unmount / order / isMounted. Sequence numbers make order stable across unmounts.",
      },
      {
        signature:
          "resolvePortalTarget(options: { ownerProvided?: string; defaultTarget?: string }): string",
        description:
          "Owner override first, then the default target id. Never returns undefined — a portal always has somewhere to go.",
      },
    ],
  },
  {
    slug: "positioning",
    title: "Positioning",
    blurb: "Floating-position math: origin, rect, viewport clamping",
    exports: ["resolveFloatingRect", "Placement", "PositioningOptions", "Rect"],
    anatomy: [
      {
        part: "anchor",
        role: "The trigger rect, in the same coordinate space as the floating surface.",
      },
      {
        part: "placement / offset",
        role: 'Which side of the anchor ("top" | "bottom" | "left" | "right") and the gap in pixels.',
      },
      {
        part: "viewport / viewportPadding",
        role: "Optional clamping bounds and the inset to keep from the edges.",
      },
    ],
    api: [
      {
        signature:
          "resolveFloatingOrigin(anchor: Rect, size: { width: number; height: number }, options?: PositioningOptions): { x: number; y: number }",
        description:
          "Where the surface starts before clamping. Pure arithmetic — no scroll, no layout read.",
      },
      {
        signature:
          "clampRectToViewport(origin: { x: number; y: number }, size: { width: number; height: number }, viewport: { width: number; height: number }, padding?: number): { x: number; y: number }",
        description:
          "Shifts the origin back inside the viewport. A surface larger than the viewport pins to the padded edge rather than oscillating.",
      },
      {
        signature:
          "resolveFloatingRect(anchor: Rect, size: { width: number; height: number }, options?: PositioningOptions & { viewport?: { width: number; height: number }; viewportPadding?: number }): { x: number; y: number }",
        description:
          "Both steps in one call. Without a viewport it returns the unclamped origin — clamping against an unmeasured zero rect would lie.",
      },
    ],
  },
  {
    slug: "presence",
    title: "Presence",
    blurb: "Mount/unmount presence states",
    exports: [
      "createPresenceModel",
      "nextPresenceState",
      "usePresence",
      "PresenceModel",
      "PresenceState",
    ],
    anatomy: [
      {
        part: 'state: "mounted" | "exiting" | "unmounted"',
        role: "The three phases. Closing moves to exiting, not straight to unmounted.",
      },
      {
        part: "present",
        role: "Whether the node should be in the tree at all — false only once exiting has finished.",
      },
      {
        part: "finishExit()",
        role: "The renderer calls this on animationend/transitionend. The model never guesses a duration.",
      },
    ],
    api: [
      {
        signature:
          "usePresence(open: boolean): { present: boolean; state: PresenceState; finishExit: () => void }",
        description:
          "The React binding. Opening mounts immediately; closing suspends unmount until finishExit().",
      },
      {
        signature: "createPresenceModel(initialOpen: boolean): PresenceModel",
        description:
          "The non-React model: subscribe / getState / setOpen / finishExit / isPresent.",
      },
      {
        signature:
          "nextPresenceState(current: PresenceState, open: boolean): PresenceState",
        description:
          "The pure transition. Re-entering while exiting returns to mounted — a cancelled close is not a close.",
      },
    ],
  },
  {
    slug: "press",
    title: "Press",
    blurb: "Press phases and activation keys",
    exports: ["usePress", "PressModel", "PressPhase"],
    anatomy: [
      {
        part: 'phase: "idle" | "pressed"',
        role: "Two phases only. Hover, focus and disabled are the renderer's concerns, not the model's.",
      },
      {
        part: "begin / end / cancel",
        role: "Pointer and key lifecycle. cancel() aborts without firing onPress.",
      },
      {
        part: "isPressActivationKey",
        role: 'Enter and " " only — the two keys that activate a button on every platform.',
      },
    ],
    api: [
      {
        signature:
          "usePress(options?: { disabled?: boolean; onPress?: () => void }): { pressed: boolean; begin: () => void; end: () => void; cancel: () => void }",
        description:
          "Web binds begin/end/cancel to pointer and key handlers; native binds onPressIn/onPressOut. One activation rule.",
      },
      {
        signature:
          "createPressModel(options?: { disabled?: boolean; onPress?: () => void }): PressModel",
        description:
          "The non-React model: getPhase / isPressed / begin / end / cancel / isDisabled.",
      },
      {
        signature: "isPressActivationKey(key: string): boolean",
        description:
          'True for "Enter" and " ". Everything else is navigation, not activation.',
      },
    ],
  },
  {
    slug: "roving",
    title: "Roving focus",
    blurb: "Roving-tabindex keyboard focus for toolbars, tabs, menus",
    exports: [
      "useRovingModel",
      "RovingItem",
      "RovingModel",
      "RovingOptions",
      "RovingOrientation",
    ],
    anatomy: [
      {
        part: "activeIndex",
        role: "The one tabbable item. Every other item is tabIndex={-1}.",
      },
      {
        part: "orientation / loop",
        role: 'Which arrow keys move: "horizontal" | "vertical" | "both", and whether the ends wrap.',
      },
      {
        part: "describe(index)",
        role: "isActive / isTabbable / disabled for one item — what a renderer needs to set the tabIndex it draws.",
      },
    ],
    api: [
      {
        signature: "useRovingModel(options: RovingOptions): RovingModel",
        description:
          "count is required; orientation and loop are optional. Control it with activeIndex + onActiveIndexChange, or seed with defaultActiveIndex.",
      },
      {
        signature: "createRovingModel(options: RovingOptions): RovingModel",
        description:
          "The non-React model: activeIndex / setActive / next / previous / first / last / describe.",
      },
      {
        signature:
          "type RovingOptions = { count: number; orientation?: RovingOrientation; loop?: boolean; activeIndex?: number; defaultActiveIndex?: number; onActiveIndexChange?: (index: number) => void; isDisabled?: (index: number) => boolean }",
        description:
          "isDisabled lets the step function skip items without the model knowing why they are disabled.",
      },
    ],
  },
  {
    slug: "selection",
    title: "Selection",
    blurb: "Selection helpers shared by both renderers",
    exports: [
      "isSelected",
      "normalizeSelection",
      "toggleSelection",
      "useSelection",
      "Selection",
      "SelectionKey",
      "SelectionMode",
    ],
    anatomy: [
      {
        part: "Selection<K>",
        role: "Always an array, even in single mode. One shape removes the isMultiple branch in every consumer.",
      },
      {
        part: "mode",
        role: 'Three semantics: "single" (radio, no deselect) | "single-toggle" (disclosure, re-activating collapses) | "multiple".',
      },
      {
        part: "toggle(key)",
        role: "The activation handler. Its behavior is the mode — callers never branch on it themselves.",
      },
    ],
    api: [
      {
        signature:
          "useSelection<K extends SelectionKey>({ value?, defaultValue?, onChange?, mode }: { value?: K | readonly K[]; defaultValue?: K | readonly K[]; onChange?: (next: Selection<K>) => void; mode: SelectionMode }): [Selection<K>, (key: K) => void]",
        description:
          "Controlled/uncontrolled selection in one hook, normalized to an array on every read.",
      },
      {
        signature:
          "toggleSelection<K extends SelectionKey>(selected: Selection<K>, key: K, mode: SelectionMode): Selection<K>",
        description:
          "The pure activation rule. single replaces, single-toggle replaces-or-clears, multiple adds or removes.",
      },
      {
        signature:
          "normalizeSelection<K extends SelectionKey>(value: K | readonly K[] | undefined, mode: SelectionMode): Selection<K>",
        description:
          "Forces the array shape and truncates to one entry outside multiple mode.",
      },
      {
        signature:
          "isSelected<K extends SelectionKey>(selected: Selection<K>, key: K): boolean",
        description:
          "Membership. Separate from toggle so renderers can read without owning the write.",
      },
    ],
  },
  {
    slug: "slot",
    title: "Slot",
    blurb: "Slot prop merging and handler composition",
    exports: ["composeEventHandlers", "mergeSlotProps", "SlotProps"],
    anatomy: [
      {
        part: "part props",
        role: "What the component itself needs: its own handler, its own class.",
      },
      {
        part: "consumer props",
        role: "What the caller passed through as-child. Both survive the substitution.",
      },
      {
        part: "chaining rule",
        role: "Event handlers run part first, consumer second. classNames concatenate. Everything else, consumer wins.",
      },
    ],
    api: [
      {
        signature:
          "mergeSlotProps<T extends SlotProps>(partProps: T, ...consumerSets: SlotProps[]): T",
        description:
          "One merge with one set of rules — the whole reason a Trigger can render as any element without losing either side's props.",
      },
      {
        signature:
          "composeEventHandlers<E>(partHandler?: (event: E) => void, consumerHandler?: (event: E) => void): ((event: E) => void) | undefined",
        description:
          "The handler rule on its own. Returns whichever exists when only one does; chains both when both do.",
      },
    ],
  },
  {
    slug: "time",
    title: "Time",
    blurb: "Time-value formatting and normalization",
    exports: [
      "formatTimeValue",
      "minutesForStep",
      "normalizeTimeValue",
      "toTwentyFourHour",
      "TimePickerFormat",
      "TimePickerValue",
    ],
    anatomy: [
      {
        part: "TimePickerValue",
        role: "{ hours: number; minutes: number } in 24-hour form, always. 12-hour is a display concern.",
      },
      {
        part: "step",
        role: "The minute grid. A picker with step: 15 only ever holds 0, 15, 30 or 45.",
      },
      {
        part: "TimePickerFormat",
        role: 'Display only: "12h" splits into hours + AM/PM, "24h" passes the value through.',
      },
    ],
    api: [
      {
        signature:
          "normalizeTimeValue(value: Partial<TimePickerValue> | undefined, step = 1): TimePickerValue",
        description:
          "Clamps hours to 0-23, snaps minutes to the nearest step. Undefined becomes 00:00 rather than NaN.",
      },
      {
        signature: "minutesForStep(step: number): readonly number[]",
        description:
          "The minute marks for a step. Anything that does not divide 60 falls back to a one-minute grid.",
      },
      {
        signature:
          'formatTimeValue(value: TimePickerValue, format: TimePickerFormat): { hours: number } | { hours: number; period: "AM" | "PM" }',
        description:
          "12-hour form maps 0 to 12 and adds the period; 24-hour returns the normalized value unchanged.",
      },
      {
        signature:
          'toTwentyFourHour(twelveHour: number, period: "AM" | "PM"): number',
        description:
          "The inverse of the 12-hour split, for storing what a 12-hour dial produced.",
      },
    ],
  },
  {
    slug: "a11y",
    title: "A11y helpers",
    blurb: "Id scopes, direction resolution, visually-hidden styles",
    exports: ["createIdScope", "resolveDir", "A11yDir", "IdScope"],
    anatomy: [
      {
        part: "IdScope",
        role: "One prefix per component instance, so ids are stable and never collide between two open dialogs.",
      },
      {
        part: "A11yDir",
        role: 'Resolved text direction: "ltr" | "rtl" | "auto". "auto" is not a direction — resolve it before layout.',
      },
      {
        part: "VISUALLY_HIDDEN_STYLE",
        role: "The screen-reader-only style both renderers share, so hidden text stays in the a11y tree on both.",
      },
    ],
    api: [
      {
        signature: "createIdScope(prefix: string): IdScope",
        description:
          'Returns { prefix, nextId() }. nextId() is call-order stable: "dialog-1", "dialog-2", ...',
      },
      {
        signature:
          "resolveDir(options?: { dir?: A11yDir; defaultDir?: A11yDir }): A11yDir",
        description:
          'Explicit dir wins, then defaultDir, then "ltr". Never returns "auto".',
      },
      {
        signature:
          'VISUALLY_HIDDEN_STYLE: Readonly<{ position: "absolute"; width: 1; height: 1; padding: 0; margin: -1; overflow: "hidden"; clip: "rect(0, 0, 0, 0)"; whiteSpace: "nowrap"; borderWidth: 0 }>',
        description:
          "Web applies it as style. Native maps it onto its hidden-text host. One definition, one behavior.",
      },
    ],
  },
];

export const PRIMITIVE_MODULES: PrimitiveModule[] = MODULES.map((m) => ({
  ...m,
  example: PRIMITIVE_EXAMPLES[m.slug] ?? "",
}));

export function primitiveModule(slug: string): PrimitiveModule | undefined {
  return PRIMITIVE_MODULES.find((m) => m.slug === slug);
}
