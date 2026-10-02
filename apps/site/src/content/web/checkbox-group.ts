import type { ComponentDoc } from "../types";

export const checkboxGroup: ComponentDoc = {
  slug: "checkbox-group",
  name: "Checkbox group",
  oneLiner:
    "A checkbox group collects several independent choices into one value you can read at once.",
  features:
    "Reach for a checkbox group when a set of options is one question with several right answers — which notifications to receive, which roles to grant, which columns to show. The group owns the aggregate value, so you get one change event carrying the whole selection instead of tracking each box yourself. Each item takes its label as a required prop, because an unnamed option in a list is worse than a missing one. For a set where only one answer is allowed, use a radio group instead.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "CheckboxGroup",
    // No variant axis. The group is a data concern — the value and the
    // selection model — not a treatment.
    variants: [],
    elevation: "surface",
  },
  parts: ["CheckboxGroup", "CheckboxGroupRoot", "CheckboxGroupItem"],
  anatomy: [
    {
      name: "CheckboxGroupRoot",
      role: "The group. Owns the aggregate selection and emits one change carrying the whole value.",
    },
    {
      name: "CheckboxGroupItem",
      role: "One option. Takes `label` as a required prop and renders its own `<label>`, so each item is named by construction.",
    },
    { name: "CheckboxGroup", role: "The namespace object: Root and Item." },
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
      type: "string[]",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value: string[]) => void",
      note: "Fires on every change with the full selection, so one handler sees the whole answer rather than one box at a time.",
    },
    {
      name: "label",
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
  ],
  aria: [
    "Each item is a real checkbox with its own name, so the set reads as a list of named options rather than a row of unnamed boxes.",
    "The item renders its own `<label>`, so the name is associated without the caller wiring `id`/`htmlFor`.",
    "The group carries the aggregate selection, so a screen reader user moves through the options and hears each one's own state.",
    "Give the group a question with a `Fieldset` and `FieldsetLegend` — the group itself has no label slot.",
  ],
};
