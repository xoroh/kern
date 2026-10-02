import type { ComponentDoc } from "../types";

export const checkboxGroup: ComponentDoc = {
  slug: "checkbox-group",
  name: "Checkbox group",
  oneLiner:
    "Checkbox groups collect several independent choices and report them as one list of values.",
  features:
    "Reach for a checkbox group when several things can be chosen at once and the result is a set: filters, permissions, options. The group owns the selection — `value` is a `string[]` and every change reports the whole list — so the state is one thing rather than many. `disabled` on the group disables every item unless an item overrides it, which is the same inherited-disabled idea the fieldset family implements for arbitrary controls. Each item names itself from its `children` when they are a plain string, so the common case needs no labelling work.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // `CheckboxGroupItem` is NATIVE-ONLY — the web `CheckboxGroup` composes
    // from its own `Checkbox`, so there is no separate web export for the row.
    nativePeer: "CheckboxGroup",
    variants: [],
    elevation: "surface",
  },
  parts: ["CheckboxGroup", "CheckboxGroupItem"],
  customization: {
    supported: [
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled, and the value is the whole selected list.",
      "`disabled` disables every item, and an item may override it.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `orientation` prop. The group stacks its items.",
      "There is no `error`/`description`. Those belong to `Field`, which can wrap the group.",
      "There is no `max` or selection limit. Select as many as there are items.",
    ],
  },
  api: [
    {
      name: "value / defaultValue",
      type: "string[]",
      note: "The whole selected list, not one value. `onValueChange` reports the complete next list — the group owns the selection rather than each item owning its own.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Disables EVERY item unless an item overrides it. The same inherited-disabled idea `Fieldset` provides for arbitrary controls.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the group.",
    },
    {
      name: "CheckboxGroupItem",
      type: "component",
      note: "One row. `value` is REQUIRED and is the string the group reports. NATIVE-ONLY: web's `CheckboxGroup` composes its own `Checkbox`, so there is no separate web export for the row.",
    },
    {
      name: "item accessibilityLabel",
      type: "string",
      note: "On the item: overrides the name DERIVED FROM STRING `children`. The common case needs nothing — a plain string child names the row.",
    },
  ],
  aria: [
    "The group is named by `accessibilityLabel`, and each item names itself from its string `children` — so a normal group is legible without extra work.",
    "`disabled` on the group is inherited, and each item reports its own disabled state, so the announcement matches what is actually operable.",
    "The selection is a list of values, so what is announced is each item's own checked state — the group is the container, not a single value.",
  ],
};
