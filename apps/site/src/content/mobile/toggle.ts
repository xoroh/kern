import type { ComponentDoc } from "../types";

export const toggle: ComponentDoc = {
  slug: "toggle",
  name: "Toggle",
  oneLiner:
    "Toggles are pressable buttons that hold a pressed state, and they call it `pressed`.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Toggle",
    variants: [],
    elevation: "surface",
  },
  parts: ["Toggle"],
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The toggle reads as a button that reports whether it is selected; double-tap flips it and the new state is announced.",
    },
  ],
  customization: {
    supported: [
      "`children` is the button's content and is required.",
      "`pressed`/`defaultPressed`/`onPressedChange` make it controlled or uncontrolled.",
      "`style` is the `Pressable` style.",
    ],
    notSupported: [
      "There is no `value`/`onValueChange`. The state is called `pressed`/`onPressedChange` here — a deliberate rename, not an oversight.",
      "There is no `variant` or `size`. One look.",
      "There is no `label` separate from `children`. The content IS the label.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      note: "REQUIRED. The button's content, and its name — there is no separate `label`.",
    },
    {
      name: "pressed / defaultPressed",
      type: "boolean",
      note: "Controlled or uncontrolled pressed state. NOTE THE NAME: `Switch`, `Checkbox` and `Select` call the same idea `value`/`defaultValue`; here it is `pressed`.",
    },
    {
      name: "onPressedChange",
      type: "(pressed: boolean) => void",
      note: "Reports the next pressed state. Where the other controls say `onValueChange`.",
    },
    {
      name: "onPress",
      type: "PressableProps['onPress']",
      note: "The gesture itself, from `PressableProps`.",
    },
    {
      name: "style",
      type: "PressableProps['style']",
      note: "React Native pressable styles.",
    },
  ],
  aria: [
    "`children` is required and names the button, so a toggle is never anonymous.",
    "Its state is reported as pressed — which matches what it is: a button that stays down, announced as a pressed button rather than as a set value.",
    "Naming is `pressed` rather than `value` throughout, so the announcement and the API tell the same story.",
  ],
};
