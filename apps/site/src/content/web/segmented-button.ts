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
  customization: {
    supported: [
      "`className` on the root and on each item, merged after their own classes.",
      "The bar and its segments share one border treatment, so the set reads as a single control rather than as adjacent buttons.",
      "Selected state is exposed as `data-pressed`, so the chosen look is restylable without new props.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop. Every segment looks like every other — the difference between them is which one is chosen.",
      "There is no `multiple` prop. A segmented button is a single choice; several independent toggles are a `ToggleGroup`.",
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
      type: "Value",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
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
  ],
  aria: [
    "The bar is a group of buttons where exactly one is pressed, so the set reads as one choice rather than as unrelated toggles.",
    "Each segment carries `aria-pressed`, so its state is announced rather than implied by its position in the bar.",
    "Arrow keys move between segments and Tab leaves the whole bar as one stop, which is what makes a set of segments quicker to work through than separate buttons.",
    "The bar has no label slot — give the question to a `Fieldset` with a `FieldsetLegend`, the same as a radio group.",
  ],
};
