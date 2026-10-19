import type { ComponentDoc } from "../types";

export const switchCmp: ComponentDoc = {
  slug: "switch",
  name: "Switch",
  oneLiner:
    "Switches turn one thing on or off immediately, and carry their state in their own appearance.",
  features:
    "Reach for a switch when flipping it takes effect straight away and there is no save step: notifications on, dark mode, auto-play. It is a pressable with `checked`/`onCheckedChange`, and the state is visible in the control itself, so it needs a label beside it that says WHAT is on. Note there is no `label` prop here at all — unlike `Checkbox`, which offers one and warns about omitting it. Naming the switch is entirely yours, usually with a `Label` or text beside it. If the change only applies after tapping a separate save button, that is a checkbox, not a switch.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Switch",
    variants: [],
    elevation: "surface",
  },
  parts: ["Switch"],
  keyboard: [
    {
      key: "Enter / Space via external keyboard",
      action:
        "Toggles when focused — the pressable owns activation, matching the web peer.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Announces as a switch with its on/off and disabled states; double-tap toggles.",
    },
  ],
  usage: {
    do: [
      "Use for settings that take effect the moment they flip — the switch IS the commit.",
      "Keep one switch per row with its label beside it, so the announcement names what flips.",
      "Drive `checked` from state when the setting can change from elsewhere (server push, reset-all).",
    ],
    dont: [
      "Don't use a switch for form options that submit together — those are checkboxes.",
      "Don't hide the state in color alone — the thumb's side and the track fill carry it together.",
    ],
  },
  tokens: [
    {
      element: "Track on",
      state: "checked",
      token: "theme.color.primary",
      value: "primary track, 52×32",
    },
    {
      element: "Track off",
      state: "resting",
      token: "theme.color.outline",
      value: "2px outline border on surface",
    },
    {
      element: "Thumb on",
      state: "checked",
      token: "theme.color.onPrimary",
      value: "onPrimary 24px thumb, trailing side",
    },
    {
      element: "Thumb off",
      state: "resting",
      token: "theme.color.outline",
      value: "outline 16px thumb, leading side",
    },
    {
      element: "Track shape",
      state: "resting",
      token: "theme.shape.full",
      value: "full pill, pressed dims to 0.82",
    },
  ],
  faq: [
    {
      q: "Switch or checkbox?",
      a: "Immediate effect means switch; submit-together options mean checkbox. If flipping it does nothing until save, it is not a switch.",
    },
    {
      q: "How does this differ from the web switch?",
      a: "Same `checked` vocabulary, same 52×32 geometry. The track and thumb are kern-drawn styles (with `switch-track-shape` theming the container) rather than Base UI parts, and state is `accessibilityState`, not ARIA.",
    },
  ],
  customization: {
    supported: [
      "`checked`/`defaultChecked`/`onCheckedChange` make it controlled or uncontrolled — Base UI names, same as web.",
      "`style` is the `Pressable` style, so the usual pressable styling applies.",
      "`accessibilityState` is re-declared so you can extend what the control reports.",
    ],
    notSupported: [
      "There is no `label` prop at all — unlike `Checkbox`, which offers one. Naming the switch is entirely yours.",
      "There is no `size` or `variant`.",
      "There is no `pending` or `loading` state. An async toggle is a `LoadingButton` plus state you own.",
    ],
  },
  api: [
    {
      name: "checked / defaultChecked",
      type: "boolean",
      note: "Controlled or uncontrolled on/off state. `onCheckedChange` reports the next value.",
    },
    {
      name: "onCheckedChange",
      type: "(next: boolean) => void",
      note: "Reports the next state rather than an event. `onPress` is still available from `PressableProps` if you want the gesture.",
    },
    {
      name: "label",
      type: "—",
      note: "Does NOT exist. Unlike `Checkbox`, which has an optional `label` it warns about. A switch carries its state in its own appearance, so it needs visible text beside it saying WHAT is on — and that text is yours to provide.",
    },
    {
      name: "accessibilityState",
      type: "PressableProps['accessibilityState']",
      note: "Re-declared so you can extend what the control reports on top of its checked state.",
    },
    {
      name: "style",
      type: "PressableProps['style']",
      note: "React Native pressable styles.",
    },
  ],
  aria: [
    "There is no `label` prop, so the accessible name must come from `accessibilityLabel` or surrounding text. This is the same trap as `Checkbox`'s optional label, except here there is no prop to forget — you must do it.",
    "The state is visible in the control itself, which is why the label only needs to say WHAT is on rather than that it is a switch.",
    "It applies immediately. A switch that needs a save button is the wrong control — the announcement and the behaviour should agree.",
  ],
};
