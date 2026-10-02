import type { ComponentDoc } from "../types";

export const toggleGroup: ComponentDoc = {
  slug: "toggle-group",
  name: "Toggle group",
  oneLiner:
    "Toggle groups hold several toggles and report either one selection or several, depending on `multiple`.",
  features:
    "Reach for a toggle group when several toggles behave as one control: a toolbar of formatting switches, a set of filters. The group owns the selection and the options are data. The one thing to understand before you start is `value`: it is a `string` for an exclusive group and a `string[]` when `multiple` is set, and the type says `string | string[]` because the prop genuinely changes shape with that flag. That means your `onValueChange` handler has to handle both unless you know which mode you are in — and you should know, because it is one boolean away.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ToggleGroup",
    variants: ["multiple: exclusive · multi"],
    elevation: "surface",
  },
  parts: ["ToggleGroup"],
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
