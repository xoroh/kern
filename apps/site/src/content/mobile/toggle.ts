import type { ComponentDoc } from "../types";

export const toggle: ComponentDoc = {
  slug: "toggle",
  name: "Toggle",
  oneLiner:
    "Toggles are pressable buttons that hold a pressed state, and they call it `pressed`.",
  features:
    "Reach for a toggle when a button should stay down: bold in a toolbar, a filter that stays on, a bookmark. It is a pressable with `children` required, and its state is named `pressed`/`onPressedChange` — which is worth knowing before you start, because `Switch`, `Checkbox` and `Select` all say `value`/`onValueChange` for the same idea. The naming matches the mental model: a toggle is a button that stays pressed, not a value that is set. Use `ToggleGroup` when several toggles behave as one.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Toggle",
    variants: [],
    elevation: "surface",
  },
  parts: ["Toggle"],
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
