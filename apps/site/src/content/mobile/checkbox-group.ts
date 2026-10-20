import type { ComponentDoc } from "../types";

export const checkboxGroup: ComponentDoc = {
  slug: "checkbox-group",
  name: "Checkbox group",
  oneLiner:
    "Checkbox groups collect several independent choices and report them as one list of values.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // `CheckboxGroupItem` is NATIVE-ONLY — the web `CheckboxGroup` composes
    // from its own `Checkbox`, so there is no separate web export for the row.
    nativePeer: "CheckboxGroup",
    variants: [],
    elevation: "surface",
  },
  parts: ["CheckboxGroup", "CheckboxGroupItem"],
  // The touch contract: the group is additive, so the press toggles.
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the options, each announcing its own checked and disabled state; double-tap ticks an option, and double-tapping a ticked option unticks it — the group is additive, not exclusive.",
    },
  ],
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
