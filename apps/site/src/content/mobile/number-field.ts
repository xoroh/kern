import type { ComponentDoc } from "../types";

export const numberField: ComponentDoc = {
  slug: "number-field",
  name: "Number field",
  oneLiner:
    "Number fields hold a number with steppers that clamp at their bound rather than wrapping.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "NumberField",
    variants: [],
    elevation: "surface",
  },
  parts: ["NumberField"],
  // The contract, read off the component: a numeric text input between two
  // named stepper pressables, both of which refuse at a bound.
  keyboard: [
    {
      key: "0–9",
      action:
        "Types into the field. The value is reported as it is typed, and it is clamped to `min` and `max` when it commits on blur.",
    },
    {
      key: "Enter / Space via external keyboard",
      action:
        'Activates the focused stepper — the two steppers are pressables named "Decrease" and "Increase".',
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves between the field and the two steppers; double-tap presses a stepper, which steps the value by `step` — and does nothing at a bound, where the stepper reads disabled.",
    },
  ],
  customization: {
    supported: [
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled; `null` is the empty value.",
      "`min`, `max` and `step` set the bounds and the increment.",
      "`locale` + `format` (`Intl.NumberFormat` options) localise display and parsing — one spec, both directions.",
      "`onValueCommitted` fires when a value commits (blur after typing, stepper release), later than `onValueChange`.",
      "`readOnly` freezes the field like `disabled` without announcing it as disabled.",
    ],
    notSupported: [
      "There is no wrapping at the bounds. A press at `min` or `max` does nothing.",
      "There is no `precision` or rounding prop. `step` is the increment size, not a grid the value snaps to.",
      "There is no `suffix`/`prefix` prop. Units go in the label, or in a currency `format`.",
    ],
  },
  api: [
    {
      name: "value / defaultValue",
      type: "number | null",
      note: "The current number; `null` is empty. `onValueChange` reports the value, including `null` when the field is cleared.",
    },
    {
      name: "onValueCommitted",
      type: "(value: number | null) => void",
      note: "Fires when a value commits: blur after typing, stepper or scrub release after stepping.",
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
      name: "locale",
      type: "string",
      note: "BCP 47 locale for display formatting and parsing. Defaults to the runtime locale.",
    },
    {
      name: "format",
      type: "Intl.NumberFormatOptions",
      note: "Options for `Intl.NumberFormat` when rendering and parsing the value. The locale comes from `locale`.",
    },
    {
      name: "readOnly",
      type: "boolean",
      note: "Terminal like `disabled`: steppers and typing stop changing the value — but it is not announced as disabled.",
    },
    {
      name: "incrementLabel / decrementLabel",
      type: "string",
      note: "The two steppers' accessible names. They are two controls and need two names.",
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
    "`locale`/`format` keeping display and parsing in step means what is read aloud matches what is on screen.",
  ],
};
