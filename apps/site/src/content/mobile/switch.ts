import type { ComponentDoc } from "../types";

export const switchCmp: ComponentDoc = {
  slug: "switch",
  name: "Switch",
  oneLiner:
    "Switches turn one thing on or off immediately, and carry their state in their own appearance.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Switch",
    variants: [],
    elevation: "surface",
  },
  parts: ["Switch"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["checked", "resting"],
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
