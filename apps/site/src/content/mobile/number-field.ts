import type { ComponentDoc } from "../types";

export const numberField: ComponentDoc = {
  slug: "number-field",
  name: "Number field",
  oneLiner:
    "Number fields hold a number with steppers that clamp at their bound rather than wrapping.",
  features:
    "Reach for a number field when the answer is a number within limits and the bounds matter: a quantity, a duration, a count. `min` and `max` are enforced by clamping, and the behaviour worth knowing is that a press at the bound does nothing — it does not wrap and does not fire a change. That is deliberate: a bound press that reports an edit makes every host persisting on change write a value nobody chose. `format` is one function used in both directions — for display AND for parsing typed input — so what is shown and what is read stay the same number.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "NumberField",
    variants: [],
    elevation: "surface",
  },
  parts: ["NumberField"],
  customization: {
    supported: [
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled.",
      "`min`, `max` and `step` set the bounds and the increment.",
      "`format` formats the value for display AND for parsing typed input — one function, both directions.",
    ],
    notSupported: [
      "There is no wrapping at the bounds. A press at `min` or `max` does nothing.",
      "There is no `precision` or rounding prop. `step` is the increment size, not a grid the value snaps to.",
      "There is no `suffix`/`prefix` prop. Units go in the label or the format.",
    ],
  },
  api: [
    {
      name: "value / defaultValue",
      type: "number",
      note: "The current number. `onValueChange` reports the value.",
    },
    {
      name: "min / max",
      type: "number",
      note: "The bounds. Values are CLAMPED to them, and a stepper press at a bound is a no-op — it does not wrap and does not fire a change.",
    },
    {
      name: "step",
      type: "number",
      note: "The increment size. It is NOT a grid the value snaps to: `step` says how far a press moves the value, not where the value must sit.",
    },
    {
      name: "format",
      type: "(value: number) => string",
      note: "Formats for display AND for parsing typed input — one function in both directions, so what is shown and what is read are the same number.",
    },
    {
      name: "incrementLabel / decrementLabel",
      type: "string",
      note: "The two steppers' accessible names. They are two controls and need two names.",
    },
    {
      name: "clampToRange(next, min, max)",
      type: "(next, min, max) => number",
      note: "Exported pure helper — the clamp, with no snapping. Documented here rather than given a page, since it is not a component and not a registry row.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the field.",
    },
  ],
  aria: [
    "`incrementLabel` and `decrementLabel` name the two steppers — without them they are unnamed buttons either side of a number.",
    "Clamping rather than wrapping is an accessibility guarantee too: the value never moves somewhere the person did not ask for, and the steppers report disabled at their bound.",
    "`format` keeping display and parsing in step means what is read aloud matches what is on screen.",
  ],
};
