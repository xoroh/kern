import type { ComponentDoc } from "../types";

export const segmentedButton: ComponentDoc = {
  slug: "segmented-button",
  name: "Segmented button",
  oneLiner:
    "Segmented buttons show a small set of options side by side, with the chosen one visibly selected.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
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
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "selected"],
  // The group is a COMPOSITE: the toggle group roves focus between the
  // segments, so the bar is ONE tab stop and the arrow keys move inside it.
  // The ARIA section below already says so — this table is the same fact in
  // the form a keyboard user can act on.
  keyboard: [
    {
      key: "ArrowRight / ArrowLeft",
      action:
        "Moves between the segments with roving focus — up and down instead on a vertical bar. The bar is one tab stop, so the arrows are how you work through the choices.",
    },
    {
      key: "Home / End",
      action: "Jumps to the first or the last segment.",
    },
    {
      key: "Enter / Space",
      action: "Chooses the focused segment.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Leaves the whole bar as one stop — in to the chosen segment, out to the next control on the page.",
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
