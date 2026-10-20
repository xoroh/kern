import type { ComponentDoc } from "../types";

export const toggleGroup: ComponentDoc = {
  slug: "toggle-group",
  name: "Toggle group",
  oneLiner:
    "Toggle groups hold several toggles and report either one selection or several, depending on `multiple`.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ToggleGroup",
    variants: ["multiple: exclusive · multi"],
    elevation: "surface",
  },
  parts: ["ToggleGroup"],
  // The contract, read off the component: the group is a radiogroup and
  // each option is a radio-role pressable that reports its selected state.
  keyboard: [
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Activates a toggle. Each option is a real pressable, and whether the group is exclusive or multi decides what the selection becomes.",
    },
    {
      key: "Swipe (TalkBack / VoiceOver)",
      action:
        "Moves between the toggles in order, and the selected one announces as selected — the state is not carried by colour.",
    },
  ],
  customization: {
    supported: [
      "`options` are data, so the group is a declaration.",
      "`multiple` switches the group between one selection and several — and changes the shape of `value` with it.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `orientation`. The group lays its toggles out in the platform's own way.",
      "There is no `disabled` at group level here — disable the options instead.",
      "There is no `renderOption`. Toggles look alike by design.",
    ],
  },
  api: [
    {
      name: "options",
      type: "NativeToggleGroupOption[]",
      note: "The toggles, as data.",
    },
    {
      name: "multiple",
      type: "boolean",
      note: "Switches between exclusive and multi-select — and CHANGES THE SHAPE of `value`. One boolean deciding whether your handler receives a string or a list.",
    },
    {
      name: "value / defaultValue",
      type: "string | string[]",
      note: "`string` for an exclusive group, `string[]` when `multiple` is set. The union is real and not just loose typing: the prop genuinely changes shape with `multiple`.",
    },
    {
      name: "onValueChange",
      type: "(value: string | string[]) => void",
      note: "Reports the next selection in the same shape as `value`. Handle both unless you know your mode — and it is one boolean away.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "Each toggle names itself from its option data, so the group reads as a set of named switches.",
    "Exclusive and multi are different announcements: one selection reads as a single choice, several as a set.",
    "The `value` shape change is worth being deliberate about, because an exclusive group and a multi group answer different questions even though they look alike.",
  ],
};
