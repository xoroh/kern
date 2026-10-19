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
  usage: {
    do: [
      "Use `checked`/`defaultChecked`/`onCheckedChange` — Base UI names, same as web — so the state vocabulary never forks by renderer.",
      "Reach for `indeterminate` for the neither-on-nor-off third state (a partially-selected group), not for loading.",
      "Give a labelless box an `accessibilityLabel` — the label falls back to it when there is no visible text.",
    ],
    dont: [
      "Don't use a checkbox for a binary on/off setting that takes effect immediately — that is a switch.",
      "Don't restyle the box past the M3 `18px`/`2px` treatment — the mark's meaning is in its shape.",
    ],
  },
  tokens: [
    {
      element: "Marked box",
      state: "checked",
      token: "theme.color.primary",
      value: "primary fill, 18px box, 2px corners",
    },
    {
      element: "Mark",
      state: "checked",
      token: "theme.color.onPrimary",
      value: "onPrimary glyph (surface when disabled)",
    },
    {
      element: "Unmarked box",
      state: "resting",
      token: "theme.color.onSurfaceVariant",
      value: "2px onSurfaceVariant border on surface",
    },
    {
      element: "Disabled box",
      state: "disabled",
      token: "withAlpha(onSurface, 0.38)",
      value: "38% onSurface fill or border — the dim is the state",
    },
  ],
  faq: [
    {
      q: "Checkbox or switch?",
      a: "A checkbox selects within a form (takes effect on submit); a switch applies its setting immediately. Immediate effect means switch.",
    },
    {
      q: "How does this differ from the web checkbox?",
      a: "The state vocabulary is identical (`checked`, `indeterminate`). The box is drawn by kern styles rather than the Base UI primitive, and the state is announced through `accessibilityState` instead of ARIA.",
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
