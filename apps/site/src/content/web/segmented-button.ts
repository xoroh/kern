import type { ComponentDoc } from "../types";

export const segmentedButton: ComponentDoc = {
  slug: "segmented-button",
  name: "Segmented button",
  oneLiner:
    "Segmented buttons show a small set of options side by side, with the chosen one visibly selected.",
  features:
    "Reach for a segmented button when there are two to four options and seeing all of them at once is the point: a view mode, a time range, a unit. The set is the control — the options sit in one bar so they can be compared directly, which is exactly what makes it better than a select for a short list. Keep the labels short and parallel; a segment whose label wraps has outgrown the control. If only one option can be chosen and there are more than four, that is a radio group or a select.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/segmented-buttons",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "SegmentedButton",
    // No variant axis. Which segment is chosen is state, not treatment.
    variants: [],
    // Material 3's "segmented button" row rests at level 0, and level 0 is
    // `shadow: none`. kern ships no elevation token here, which is the
    // conformant state — the gate asserts the absence, so adding an unearned
    // shadow later fails.
    elevation: 0,
  },
  parts: ["SegmentedButton", "SegmentedButtonRoot", "SegmentedButtonItem"],
  anatomy: [
    {
      name: "SegmentedButtonRoot",
      role: "The bar. Owns the selection and lays the segments out as one control.",
    },
    {
      name: "SegmentedButtonItem",
      role: "One option. Selected and unselected read against each other within the bar.",
    },
    {
      name: "SegmentedButton",
      role: "The namespace object: Root and Item.",
    },
  ],
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves through the segments in order — each segment is its own stop.",
    },
    {
      key: "Enter / Space",
      action: "Chooses the focused segment.",
    },
  ],
  usage: {
    do: [
      "Use for a single choice among two to five peer options that all fit on screen.",
      "Keep labels to one word — the segments share one border and read as one control.",
      "Restyle the chosen look through `data-pressed` when the theme needs it — no new props required.",
    ],
    dont: [
      "Don't use it for multiple selection — that is a `ToggleGroup`. One choice is the whole pattern.",
      "Don't reach for it for new designs by default — M3 points at the connected `ButtonGroup` instead; this stays for the classic treatment.",
    ],
  },
  tokens: [
    {
      element: "Bar",
      state: "resting",
      token: "comp.segmented-button.bar",
      value: "surface, 1px outline border, full pill, level 0",
    },
    {
      element: "Selected segment",
      state: "selected",
      token: "sys.color.secondary-container",
      value: "secondary-container fill with on-secondary-container ink",
    },
  ],
  faq: [
    {
      q: "Segmented button or connected button group?",
      a: "New designs should prefer the connected `ButtonGroup` — M3 no longer recommends the segmented button. This component stays for the classic single-choice treatment.",
    },
    {
      q: "How does this differ from the native segmented button?",
      a: "Single-choice-only here vs single-or-multiple natively (the plural-props axis is the mode there). The selected treatment — secondary fill plus ink swap — matches; native additionally marks the check.",
    },
  ],
  customization: {
    supported: [
      "`className` on the root and on each item, merged after their own classes.",
      "The bar and its segments share one border treatment, so the set reads as a single control rather than as adjacent buttons.",
      "Selected state is exposed as `data-pressed`, so the chosen look is restylable without new props.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop. Every segment looks like every other — the difference between them is which one is chosen.",
      "There is no `multiple` prop. A segmented button is a single choice; several independent toggles are a `ToggleGroup`.",
      "New designs should prefer the expressive `ButtonGroup` (`connected`) — M3 no longer recommends the segmented button and points at the connected button group instead. This component stays for the classic treatment.",
      "There is no `orientation` prop. The bar is horizontal.",
      "There is no `elevation` prop. The control carries no elevation token, and Material 3 places it at resting level 0 — see the metadata strip.",
    ],
  },
  api: [
    {
      name: "value",
      type: "Value",
      note: "Controlled selection on `SegmentedButtonRoot`, generic over the value type. Omit for uncontrolled.",
    },
    {
      name: "defaultValue",
      for: ["SegmentedButtonRoot"],
      type: "Value",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
      for: ["SegmentedButtonRoot"],
      type: "(value: Value) => void",
      note: "Fires when the chosen segment changes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On a segment, or on the whole bar.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on the root and on each item, merged after their own classes.",
    },
    {
      name: "orientation",
      for: ["SegmentedButtonRoot"],
      type: "Orientation | undefined",
      note: "Whether segments lay out horizontally or vertically.",
    },
    {
      name: "loopFocus",
      for: ["SegmentedButtonRoot"],
      type: "boolean | undefined",
      note: "Whether arrow keys wrap from the last segment back to the first. Disabled stops at the ends.",
    },
    {
      name: "multiple",
      for: ["SegmentedButtonRoot"],
      type: "boolean | undefined",
      note: "When true several segments can stay pressed at once. False (default) makes it an exclusive choice: pressing one releases the others.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on a segment when the replacement is a native `<button>`.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `ToggleGroupState` on the group, `ToggleState` (pressed, disabled) on a segment.",
    },
    {
      name: "pressed",
      for: ["SegmentedButtonItem"],
      type: "boolean | undefined",
      note: "Whether the segment is pressed, when controlled. Omit for uncontrolled.",
    },
    {
      name: "defaultPressed",
      for: ["SegmentedButtonItem"],
      type: "boolean | undefined",
      note: "Whether the segment starts pressed in the uncontrolled case. Use `pressed` for controlled.",
    },
    {
      name: "onPressedChange",
      for: ["SegmentedButtonItem"],
      type: '((pressed: boolean, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element | undefined; }) => void) | undefined',
      note: "Fires when the segment is pressed or released.",
    },
    {
      name: "nativeButton",
      for: ["SegmentedButtonItem"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "check",
      for: ["SegmentedButtonItem"],
      type: "boolean | undefined",
      note: "Whether a pressed segment shows the M3 selection check. Unset resolves from content: labeled segments show it, icon-only segments do not.",
    },
    {
      name: "size",
      for: ["SegmentedButtonItem"],
      type: '"sm" | "lg" | "md" | "xs" | "xl" | undefined',
      note: "M3 density size. `sm` is the current rendering, kept default.",
    },
  ],
  aria: [
    "The bar is a group of buttons where exactly one is pressed, so the set reads as one choice rather than as unrelated toggles.",
    "Each segment carries `aria-pressed`, so its state is announced rather than implied by its position in the bar.",
    "Arrow keys move between segments and Tab leaves the whole bar as one stop, which is what makes a set of segments quicker to work through than separate buttons.",
    "The bar has no label slot — give the question to a `Fieldset` with a `FieldsetLegend`, the same as a radio group.",
  ],
};
