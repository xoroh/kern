import type { ComponentDoc } from "../types";

export const checkbox: ComponentDoc = {
  slug: "checkbox",
  name: "Checkbox",
  oneLiner:
    "Checkboxes are a three-state choice — on, off, or indeterminate — for one thing.",
  features:
    "Reach for a checkbox when one thing can be chosen or not, independently of anything else. It is a controlled or uncontrolled pressable with a `label`, and the third state is the part people forget exists: `indeterminate` is neither on nor off, and it is what a parent shows when only some of its children are checked. Note that `label` is OPTIONAL — omit it and you have a bare control with no accessible name, which is the same trap as an icon-only button. Set it, or name the control some other way.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Checkbox",
    variants: [],
    elevation: "surface",
  },
  parts: ["Checkbox"],
  customization: {
    supported: [
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled.",
      "`indeterminate` is the third state — neither on nor off.",
      "`label` and `labelStyle` set the text and its style separately.",
    ],
    notSupported: [
      "There is no `error` or `required` prop. A checkbox in error state is expressed with a `FieldMessage` beside it.",
      "There is no `size` prop. One size.",
      "There is no `variant`. A switch-shaped control is `Switch`; a labelled row that toggles is `Toggle`.",
    ],
  },
  api: [
    {
      name: "value / defaultValue",
      type: "boolean",
      note: "Controlled or uncontrolled checked state. `onValueChange` reports the next value.",
    },
    {
      name: "indeterminate",
      type: "boolean",
      note: "The third state — neither checked nor unchecked. It is what a parent shows when only some of its children are checked.",
    },
    {
      name: "label",
      type: "string",
      note: "OPTIONAL — and omitting it leaves a bare control with NO accessible name. The same trap as an icon-only button. Set it, or name the control another way.",
    },
    {
      name: "onValueChange",
      type: "(next: boolean) => void",
      note: "Reports the next state rather than an event. `onPress` is also available from `PressableProps` if you want the gesture itself.",
    },
    {
      name: "labelStyle",
      type: "StyleProp<TextStyle>",
      note: "Styles the label text separately from the control.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles for the control.",
    },
  ],
  aria: [
    "`label` is optional, which makes an unnamed control easy to ship. A checkbox with no name announces as an unchecked box with no context.",
    "`indeterminate` is a real state and should be announced as such rather than as either checked or unchecked.",
    "It is pressable, so the whole control is the target — which is what makes it usable without hitting a small square.",
  ],
};
