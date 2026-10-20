import type { ComponentDoc } from "../types";

export const checkboxGroup: ComponentDoc = {
  slug: "checkbox-group",
  name: "Checkbox group",
  oneLiner:
    "A checkbox group collects several independent choices into one value you can read at once.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native ships `Checkbox` but no checkbox GROUP — the aggregate-value
    // model is web-only today. That is a coverage asymmetry, recorded in
    // docs/parity-contract.md rather than papered over by pointing at
    // `Checkbox`, which is not the same component.
    nativePeer: "none",
    // No variant axis. The group is a data concern — the value and the
    // selection model — not a treatment.
    variants: [],
    elevation: "surface",
  },
  parts: ["CheckboxGroup", "CheckboxGroupRoot", "CheckboxGroupItem"],
  // The contract, read off the checkboxes: a set of independent controls, so
  // each option is its own stop and Space is the key that changes them.
  keyboard: [
    {
      key: "Space",
      action:
        "Ticks or unticks the focused option. Every option is a real checkbox, and the group reports the whole selected list through `onValueChange`.",
    },
    {
      key: "Enter",
      action:
        "Does not toggle the option — a checkbox is toggled with Space, so Enter is left to the form the group sits in.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves between the options, one stop each: a checkbox group is a set of independent controls, not one roving stop.",
    },
  ],
  customization: {
    supported: [
      "`className` on the root and on each item, merged after their own classes.",
      "The root lays out as a grid with a small gap; override it to get a two-column or inline set.",
      "Each item's colours and states are the checkbox's, so a theme moves the whole group at once.",
    ],
    notSupported: [
      "There is no `orientation` or `columns` prop. Layout is the root's `className`.",
      "There is no `label` on the group itself. The question the group answers belongs in a `Fieldset` with a `FieldsetLegend`, which is how it gets read out before the options.",
      "Items cannot be independently sized or given variants; every option in a set looks like every other, which is what makes the set legible.",
    ],
  },
  api: [
    {
      name: "value",
      type: "string[]",
      note: "Controlled selection on `CheckboxGroupRoot` — the whole set at once, not one box. Omit for uncontrolled.",
    },
    {
      name: "defaultValue",
      for: ["CheckboxGroupRoot"],
      type: "string[]",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
      for: ["CheckboxGroupRoot"],
      type: "(value: string[]) => void",
      note: "Fires on every change with the full selection, so one handler sees the whole answer rather than one box at a time.",
    },
    {
      name: "label",
      for: ["CheckboxGroupItem"],
      type: "ReactNode",
      note: "Required on `CheckboxGroupItem`. Not optional here as it is on `Checkbox`: an item in a set with no name cannot be chosen deliberately.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on the root and on each item, merged after their own classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On an item, or on the root to disable the whole set.",
    },
    {
      name: "allValues",
      for: ["CheckboxGroupRoot"],
      type: "string[] | undefined",
      note: "Names of every checkbox in the group. Needed to wire a parent checkbox that toggles the set.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `CheckboxGroupState` on the group, `CheckboxRootState` on an option.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on an option when the replacement is a native `<button>`.",
    },
    {
      name: "defaultChecked",
      for: ["CheckboxGroupItem"],
      type: "boolean | undefined",
      note: "Whether the option starts ticked in the uncontrolled case. Use `checked` for controlled.",
    },
    {
      name: "form",
      for: ["CheckboxGroupItem"],
      type: "string | undefined",
      note: "Id of the form that owns the hidden input, so the option can live outside the `<form>` and still submit with it.",
    },
    {
      name: "id",
      for: ["CheckboxGroupItem"],
      type: "string | undefined",
      note: "Id of the input element. Generated when omitted.",
    },
    {
      name: "name",
      for: ["CheckboxGroupItem"],
      type: "string | undefined",
      note: "Field name submitted with the form. Shared by the group — it is what gathers the ticks server-side. What the server receives under.",
    },
    {
      name: "nativeButton",
      for: ["CheckboxGroupItem"],
      type: "boolean | undefined",
      note: "Whether the `render` replacement is a native `<button>`. Set it when it is, so semantics stay correct.",
    },
    {
      name: "required",
      for: ["CheckboxGroupItem"],
      type: "boolean | undefined",
      note: "Whether the option must be ticked before form submission.",
    },
    {
      name: "readOnly",
      for: ["CheckboxGroupItem"],
      type: "boolean | undefined",
      note: "Whether the option is fixed: it still shows its state but cannot be ticked or unticked.",
    },
    {
      name: "inputRef",
      for: ["CheckboxGroupItem"],
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the hidden input element that carries the submission value.",
    },
    {
      name: "checked",
      for: ["CheckboxGroupItem"],
      type: "boolean | undefined",
      note: "Whether the option is ticked, when controlled. Omit for uncontrolled.",
    },
    {
      name: "onCheckedChange",
      for: ["CheckboxGroupItem"],
      type: '((checked: boolean, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element | undefined; }) => void) | undefined',
      note: "Fires when the option is ticked or unticked.",
    },
    {
      name: "indeterminate",
      for: ["CheckboxGroupItem"],
      type: "boolean | undefined",
      note: "Whether the option shows the mixed state: neither ticked nor unticked. For a parent reflecting a partially ticked set.",
    },
    {
      name: "parent",
      for: ["CheckboxGroupItem"],
      type: "boolean | undefined",
      note: "Whether the option is the parent controlling the group's child checkboxes.",
    },
    {
      name: "uncheckedValue",
      for: ["CheckboxGroupItem"],
      type: "string | undefined",
      note: "Value submitted with the form when the option is unchecked. Unchecked options submit nothing by default, like native checkboxes.",
    },
  ],
  aria: [
    "Each item is a real checkbox with its own name, so the set reads as a list of named options rather than a row of unnamed boxes.",
    "The item renders its own `<label>`, so the name is associated without the caller wiring `id`/`htmlFor`.",
    "The group carries the aggregate selection, so a screen reader user moves through the options and hears each one's own state.",
    "Give the group a question with a `Fieldset` and `FieldsetLegend` — the group itself has no label slot.",
  ],
};
