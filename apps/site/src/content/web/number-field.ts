import type { ComponentDoc } from "../types";

export const numberField: ComponentDoc = {
  slug: "number-field",
  name: "Number field",
  oneLiner:
    "Number fields take a number from someone, with steppers to nudge it up and down.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "NumberField",
    // No variant axis. Tone comes from the field state rather than a variant.
    variants: [],
    elevation: "surface",
  },
  parts: ["NumberField", "NumberFieldRoot", "NumberFieldInput"],
  // The keyboard contract, read off the field and the two steppers: the keys
  // and the buttons move the value by the same amount.
  keyboard: [
    {
      key: "ArrowUp / ArrowDown",
      action:
        "Steps the value by `step` — up raises it and down lowers it. The keys and the steppers move it by the same amount.",
    },
    {
      key: "Home / End",
      action: "Jumps to `min` or `max` — the bound, where the field has one.",
    },
    {
      key: "Enter / Space",
      action:
        'Activates the focused stepper. The two steppers are real buttons named "Decrease" and "Increase", and at a bound the press does nothing because the button is disabled there.',
    },
  ],
  customization: {
    supported: [
      "`className` on the root lays out the field; `className` on the input styles the text box alone, leaving the steppers as they are.",
      "The group's border and shape are the input's, so a number field sits level beside a text field in a form.",
      "Stepper hover uses `--sys-color-surface-tonal`, and both steppers carry `aria-label`s of their own.",
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
      for: ["NumberFieldRoot"],
      type: "number | null",
      note: "Initial value when uncontrolled.",
    },
    {
      name: "onValueChange",
      for: ["NumberFieldRoot"],
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
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `NumberFieldRootState` on the root, `NumberFieldInputState` on the input.",
    },
    {
      name: "form",
      for: ["NumberFieldRoot"],
      type: "string | undefined",
      note: "Id of the form that owns the hidden input, so the field can live outside the `<form>` and still submit with it.",
    },
    {
      name: "id",
      for: ["NumberFieldRoot"],
      type: "string | undefined",
      note: "Id of the input element. Generated when omitted.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state.",
    },
    {
      name: "name",
      for: ["NumberFieldRoot"],
      type: "string | undefined",
      note: "Field name submitted with the form. What the server receives under.",
    },
    {
      name: "required",
      for: ["NumberFieldRoot"],
      type: "boolean | undefined",
      note: "Whether a value is required before form submission.",
    },
    {
      name: "readOnly",
      for: ["NumberFieldRoot"],
      type: "boolean | undefined",
      note: "Whether the value is fixed: steppers and typing stop changing it.",
    },
    {
      name: "inputRef",
      for: ["NumberFieldRoot"],
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the hidden input element that carries the submission value.",
    },
    {
      name: "locale",
      for: ["NumberFieldRoot"],
      type: "LocalesArgument",
      note: "Locale for formatting and parsing the value. Defaults to the runtime locale.",
    },
    {
      name: "format",
      for: ["NumberFieldRoot"],
      type: "NumberFormatOptions | undefined",
      note: "Options for `Intl.NumberFormat` when rendering the value. The locale comes from `locale`.",
    },
    {
      name: "allowOutOfRange",
      for: ["NumberFieldRoot"],
      type: "boolean | undefined",
      note: "Whether typed text may leave the min/max range unclamped so native range validation fires. Arrows, buttons, wheel and scrub still clamp.",
    },
    {
      name: "smallStep",
      for: ["NumberFieldRoot"],
      type: "number | undefined",
      note: "Step jumped while Alt is held. Snaps to its multiples when `snapOnStep` is on.",
    },
    {
      name: "largeStep",
      for: ["NumberFieldRoot"],
      type: "number | undefined",
      note: "Step jumped while Shift is held. Snaps to its multiples when `snapOnStep` is on.",
    },
    {
      name: "allowWheelScrub",
      for: ["NumberFieldRoot"],
      type: "boolean | undefined",
      note: "Whether the mouse wheel scrubs the value while the field is focused and hovered.",
    },
    {
      name: "snapOnStep",
      for: ["NumberFieldRoot"],
      type: "boolean | undefined",
      note: "Whether stepping snaps to the nearest step multiple.",
    },
    {
      name: "onValueCommitted",
      for: ["NumberFieldRoot"],
      type: "((value: number | null, eventDetails: NumberFieldRootCommitEventDetails) => void) | undefined",
      note: "Fires when the value commits — blur after typing, pointer release after scrub or stepper press — with the reason. Later than `onValueChange`, which fires together with it on keyboard and wheel input.",
    },
    {
      name: "aria-roledescription",
      for: ["NumberFieldInput"],
      type: "string | undefined",
      note: "Spoken role description for assistive tech. A description, not a name — the label still names the control.",
    },
  ],
  aria: [
    "The input is a real numeric input, so it takes numeric keyboard entry on touch devices.",
    "The steppers are buttons with their own accessible names (`Decrease`, `Increase`), so they are usable and distinguishable without seeing the glyphs.",
    "The whole group is one control with one value, so the steppers and the input are not announced as three unrelated things.",
  ],
};
