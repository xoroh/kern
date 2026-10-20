import type { ComponentDoc } from "../types";

export const checkbox: ComponentDoc = {
  slug: "checkbox",
  name: "Checkbox",
  oneLiner:
    "Checkboxes are a three-state choice — on, off, or indeterminate — for one thing.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Checkbox",
    variants: [],
    elevation: "surface",
  },
  parts: ["Checkbox"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["checked", "resting", "disabled"],
  keyboard: [
    {
      key: "Enter / Space via external keyboard",
      action:
        "Toggles when focused — the pressable owns activation, the same as the web peer's Space contract.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Announces as a checkbox with its checked (or mixed, for `indeterminate`) and disabled states; double-tap toggles.",
    },
  ],
  customization: {
    supported: [
      "`checked`/`defaultChecked`/`onCheckedChange` make it controlled or uncontrolled — Base UI names, same as web.",
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
      name: "checked / defaultChecked",
      type: "boolean",
      note: "Controlled or uncontrolled checked state. `onCheckedChange` reports the next value.",
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
      name: "onCheckedChange",
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
