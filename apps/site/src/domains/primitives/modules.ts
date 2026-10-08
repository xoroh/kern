/**
 * Primitives (P domain) module catalogue — the stub-page index.
 *
 * Each entry names one kernel module of `@xoroh/kern-primitives` (see
 * `packages/kern-primitives/src/index.ts`, the barrel this mirrors) with the
 * one-liner its README gives it where one exists, else a restatement of its
 * exported symbols. Full per-module docs (anatomy + API + example) are later
 * work (01 G2); these stubs link the modules and state that plainly.
 */
export type PrimitiveModule = {
  slug: string;
  title: string;
  blurb: string;
  exports: string[];
};

export const PRIMITIVE_MODULES: PrimitiveModule[] = [
  {
    slug: "use-controllable-state",
    title: "useControllableState",
    blurb: "One state hook for controlled/uncontrolled components",
    exports: ["useControllableState"],
  },
  {
    slug: "collection",
    title: "Collection",
    blurb: "Collection tree and item registration for composite widgets",
    exports: ["createCollectionModel", "useCollection"],
  },
  {
    slug: "roving",
    title: "Roving focus",
    blurb: "Roving-tabindex keyboard focus for toolbars, tabs, menus",
    exports: ["createRovingModel", "useRovingModel"],
  },
  {
    slug: "overlay-modality",
    title: "Overlay modality",
    blurb: "Tracks which overlay layer owns the keyboard and screen-reader focus",
    exports: [
      "createOverlayModality",
      "useOverlayModality",
      "useOverlayRegistration",
    ],
  },
  {
    slug: "dismiss-policy",
    title: "Dismiss policy",
    blurb: "One dismissal rule for escape / outside-press / pointer-down",
    exports: ["createDismissPolicy", "dismissTriggersFor"],
  },
  {
    slug: "dismiss-wiring",
    title: "Dismiss wiring",
    blurb: "Wiring helpers that connect dismiss sources to the dismissal policy",
    exports: ["dismissBranchesFor", "shouldDismissOn"],
  },
  {
    slug: "focus-trap",
    title: "Focus trap",
    blurb: "Focus-trap model: tab cycling bounds and autofocus resolution",
    exports: ["createFocusTrapModel", "nextTrapIndex", "resolveAutofocus"],
  },
  {
    slug: "merge-refs",
    title: "Merge refs",
    blurb: "Compose callback and object refs without losing either",
    exports: ["assignRef", "mergeRefs", "useMergeRefs"],
  },
  {
    slug: "portal",
    title: "Portal",
    blurb: "Portal registry and target resolution",
    exports: ["createPortalRegistry", "resolvePortalTarget"],
  },
  {
    slug: "positioning",
    title: "Positioning",
    blurb: "Floating-position math: origin, rect, viewport clamping",
    exports: ["clampRectToViewport", "resolveFloatingOrigin", "resolveFloatingRect"],
  },
  {
    slug: "presence",
    title: "Presence",
    blurb: "Mount/unmount presence states",
    exports: ["createPresenceModel", "nextPresenceState", "usePresence"],
  },
  {
    slug: "press",
    title: "Press",
    blurb: "Press phases and activation keys",
    exports: ["createPressModel", "isPressActivationKey", "usePress"],
  },
  {
    slug: "selection",
    title: "Selection",
    blurb: "Selection helpers shared by both renderers",
    exports: ["isSelected", "normalizeSelection", "toggleSelection", "useSelection"],
  },
  {
    slug: "slot",
    title: "Slot",
    blurb: "Slot prop merging and handler composition",
    exports: ["composeEventHandlers", "mergeSlotProps"],
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
    ],
  },
  {
    slug: "a11y",
    title: "A11y helpers",
    blurb: "Id scopes, direction resolution, visually-hidden styles",
    exports: ["createIdScope", "resolveDir", "VISUALLY_HIDDEN_STYLE"],
  },
];

export function primitiveModule(slug: string): PrimitiveModule | undefined {
  return PRIMITIVE_MODULES.find((m) => m.slug === slug);
}
