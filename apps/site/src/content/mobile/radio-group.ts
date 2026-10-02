import type { ComponentDoc } from "../types";

export const radioGroup: ComponentDoc = {
  slug: "radio-group",
  name: "Radio group",
  oneLiner:
    "Radio groups pick exactly one value from a set, and report that one value.",
  features:
    "Reach for a radio group when the answer is one of a known few and the alternatives should be visible at once: a plan, a delivery method, a size. The group owns the selection and `value` is a single `string`, which is the whole difference from a checkbox group — one choice versus many, and the type says so. `disabled` on the group disables every item. Each item's `children` is required here, unlike the checkbox group's optional one, because a radio with no label is a radio nobody can tell apart from its neighbours.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // `RadioGroupItem` is NATIVE-ONLY — web's `RadioGroup` composes its own
    // radio, so there is no separate web export for the row.
    nativePeer: "RadioGroup",
    variants: [],
    elevation: "surface",
  },
  parts: ["RadioGroup", "RadioGroupItem"],
  customization: {
    supported: [
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled, and the value is ONE string.",
      "`disabled` disables every item in the group.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `orientation` prop. The group stacks its items.",
      "There is no `error`/`description`; wrap it in `Field` for those.",
      "There is no `allowDeselect`. A radio group picks one; clearing a choice is a checkbox's job.",
    ],
  },
  api: [
    {
      name: "value / defaultValue",
      type: "string",
      note: "ONE selected value, not a list. `onValueChange` reports the next single value. This is the type-level difference from `CheckboxGroup`, whose value is `string[]`.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Disables every item in the group.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the group.",
    },
    {
      name: "RadioGroupItem",
      type: "component",
      note: "One option. `value` is REQUIRED and is what the group reports. `children` is REQUIRED here — unlike `CheckboxGroupItem`, where it is optional — because unlabelled radios are indistinguishable from one another. NATIVE-ONLY: web's `RadioGroup` composes its own radio, so there is no separate web export for the row.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "The group is named by `accessibilityLabel`, and every item MUST have `children` — a radio with no label cannot be told apart from its neighbours by anyone.",
    "Exactly one value is selected at a time, which is what makes the choice readable as a single answer rather than a set of independent toggles.",
    "`disabled` on the group is inherited and each item reports its own state, so what is announced matches what is operable.",
  ],
};
