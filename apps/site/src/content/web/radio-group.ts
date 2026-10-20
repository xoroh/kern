import type { ComponentDoc } from "../types";

export const radioGroup: ComponentDoc = {
  slug: "radio-group",
  name: "Radio group",
  oneLiner:
    "Radio groups let people pick exactly one option from a set they can see all at once.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "RadioGroup",
    // No variant axis. The radio is one treatment; the choice is the value.
    variants: [],
    elevation: "surface",
  },
  parts: ["RadioGroup", "RadioGroupItem"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "hover"],
  keyboard: [
    {
      key: "Arrow keys",
      action:
        "Moves selection within the group. The newly focused radio becomes checked.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the group as one stop. Disabled radios are skipped.",
    },
    {
      key: "Space",
      action: "Checks the focused radio when using manual activation.",
    },
  ],
  customization: {
    supported: [
      "`className` on the group lays out the set; `className` on an item styles the whole option row.",
      "`controlClassName` styles just the radio circle, separately from the row — so you can change the control without disturbing the label alignment.",
      "Colours come from the system roles, and the states are exposed as `data-checked` and `data-disabled`.",
    ],
    notSupported: [
      "There is no `orientation` prop. The group is a column; a horizontal set is the root's `className`.",
      "There is no `label` on the group. The question belongs to a `Fieldset` with a `FieldsetLegend`, which is how it gets read before the options.",
      "There is no `size` or `variant` prop on an item. Every option in a set looks like every other, which is what makes the set comparable.",
    ],
  },
  api: [
    {
      name: "value",
      type: "Value",
      note: "Controlled selection on `RadioGroup`, generic over the value type — so a group of numbers stays numbers instead of degrading to strings. Omit for uncontrolled.",
    },
    {
      name: "defaultValue",
      for: ["RadioGroup"],
      type: "Value",
      note: "Initial selection when uncontrolled. Same generic type as `value`.",
    },
    {
      name: "onValueChange",
      for: ["RadioGroup"],
      type: "(value: Value, eventDetails: unknown) => void",
      note: "Fires on every change with the newly selected value, not an event. The value is typed to the group.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "On `RadioGroupItem`: the option's label text. Rendered inside the item's `<label>`, so it names the control and clicking it selects the option.",
    },
    {
      name: "className",
      type: "string",
      note: "On the group, lays out the set. On an item, styles the option row — the whole `<label>`, not the circle.",
    },
    {
      name: "controlClassName",
      for: ["RadioGroupItem"],
      type: "string",
      note: "On an item: styles the radio control on its own. Kept separate from `className` so the circle and the row can be restyled independently.",
    },
    {
      name: "form",
      for: ["RadioGroup"],
      type: "string | undefined",
      note: "Id of the form that owns the radio inputs, so the group can live outside the `<form>` and still submit with it.",
    },
    {
      name: "name",
      for: ["RadioGroup"],
      type: "string | undefined",
      note: "Field name submitted with the form. Shared by every option — it is what groups them server-side. What the server receives under.",
    },
    {
      name: "required",
      type: "boolean | undefined",
      note: "Whether choosing an option is required before form submission. Set on the group, or on an option for itself.",
    },
    {
      name: "readOnly",
      type: "boolean | undefined",
      note: "Whether the choice is fixed. Set on the group to lock every option, or on one option to lock just it.",
    },
    {
      name: "inputRef",
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the hidden input element that carries the submission value.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `RadioGroupState` on the group, `RadioRootState` on an option.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on an option when the replacement is a native `<button>`.",
    },
    {
      name: "nativeButton",
      for: ["RadioGroupItem"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Disables one option, or the whole set from the group.",
    },
  ],
  aria: [
    "Each item is a real radio with the radio role and `aria-checked`, so the set reads as one question with mutually exclusive answers.",
    "The item wraps its control in a `<label>`, so the option text is the accessible name and selecting is possible by clicking the text.",
    "Arrow keys move between options within the group and selection follows focus, which is the WAI-ARIA radio group pattern.",
    "The group carries no label of its own — wrap it in a `Fieldset` with a `FieldsetLegend` so the question is announced before the options.",
  ],
};
