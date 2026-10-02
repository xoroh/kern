import type { ComponentDoc } from "../types";

export const numberField: ComponentDoc = {
  slug: "number-field",
  name: "Number field",
  oneLiner:
    "Number fields take a number from someone, with steppers to nudge it up and down.",
  features:
    "Reach for a number field when the answer is a quantity and small steps matter: a count, a percentage, a timeout. The steppers make the increment explicit, which is the point — someone can reach the value without knowing what to type. Keep the step meaningful for the thing being set; a stepper that moves by one on a value measured in thousands is decoration. If the number is really a choice between known values, that is a select; if it is a range with a feel to it, that is a slider.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "NumberField",
    // No variant axis. Tone comes from the field state rather than a variant.
    variants: [],
    elevation: "surface",
  },
  parts: ["NumberField", "NumberFieldRoot", "NumberFieldInput"],
  anatomy: [
    {
      name: "NumberFieldRoot",
      role: "The field. Owns the value and the step, and lays out its parts.",
    },
    {
      name: "NumberFieldInput",
      role: "Renders the whole stepper group — decrement, the input itself, and increment — not just the text box. `className` lands on the input only.",
    },
    { name: "NumberField", role: "The namespace object: Root and Input." },
  ],
  customization: {
    supported: [
      "`className` on the root lays out the field; `className` on the input styles the text box alone, leaving the steppers as they are.",
      "The group's border and shape are the input's, so a number field sits level beside a text field in a form.",
      "Stepper hover uses `--md-sys-color-surface-tonal`, and both steppers carry `aria-label`s of their own.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. The field is one height, matching the input.",
      "There is no `stepperPosition` prop. The steppers flank the input; moving them is the root's `className`.",
      "There is no `format` prop. Display formatting is the input's `value` handling, not a component feature.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number | null",
      note: "Controlled value on `NumberFieldRoot`. Nullable — an empty field is `null` rather than `0`, so an unfilled field is distinguishable from a zero.",
    },
    {
      name: "defaultValue",
      type: "number | null",
      note: "Initial value when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value: number | null, eventDetails: object) => void",
      note: "Fires on every change, from typing or from a stepper press.",
    },
    {
      name: "step",
      type: "number",
      note: "What one stepper press changes. Set it to the meaningful increment for the thing being chosen, not to a default that suits nothing.",
    },
    {
      name: "min",
      type: "number",
      note: "Lower bound. The decrement button refuses to go past it.",
    },
    {
      name: "max",
      type: "number",
      note: "Upper bound. The increment button refuses to go past it.",
    },
    {
      name: "className",
      type: "string",
      note: "On the root, lays out the field. On `NumberFieldInput`, styles the text box only — the steppers are not covered by it.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Disables the field and both steppers together.",
    },
  ],
  aria: [
    "The input is a real numeric input, so it takes numeric keyboard entry on touch devices.",
    "The steppers are buttons with their own accessible names (`Decrease`, `Increase`), so they are usable and distinguishable without seeing the glyphs.",
    "The whole group is one control with one value, so the steppers and the input are not announced as three unrelated things.",
  ],
};
