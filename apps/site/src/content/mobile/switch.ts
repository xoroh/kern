import type { ComponentDoc } from "../types";

export const switchCmp: ComponentDoc = {
  slug: "switch",
  name: "Switch",
  oneLiner:
    "Switches turn one thing on or off immediately, and carry their state in their own appearance.",
  features:
    "Reach for a switch when flipping it takes effect straight away and there is no save step: notifications on, dark mode, auto-play. It is a pressable with `value`/`onValueChange`, and the state is visible in the control itself, so it needs a label beside it that says WHAT is on. Note there is no `label` prop here at all — unlike `Checkbox`, which offers one and warns about omitting it. Naming the switch is entirely yours, usually with a `Label` or text beside it. If the change only applies after tapping a separate save button, that is a checkbox, not a switch.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Switch",
    variants: [],
    elevation: "surface",
  },
  parts: ["Switch"],
  customization: {
    supported: [
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled.",
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
      name: "value / defaultValue",
      type: "boolean",
      note: "Controlled or uncontrolled on/off state. `onValueChange` reports the next value.",
    },
    {
      name: "onValueChange",
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
