import type { ComponentDoc } from "../types";

export const tabs: ComponentDoc = {
  slug: "tabs",
  name: "Tabs",
  oneLiner:
    "Tabs switch between peer views of the same thing, and carry their content with them.",
  features:
    "Reach for a tabs when the alternatives are peers — different views of one record, different facets of one list — and any of them could reasonably be first. Each tab is data with a `value`, a `label` and optional `content`, and the group reports the selected `value`. The content riding on the tab is the useful part: it means the tab and what it shows are declared together, so they cannot drift apart. If the steps have an order and someone must do them in sequence, that is a stepper, not tabs.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Tabs",
    variants: [],
    // Material 3 places `tabs` at resting level 0, and level 0 is
    // `shadow: none` — which is what a tab row renders.
    elevation: 0,
  },
  parts: ["Tabs"],
  customization: {
    supported: [
      "`tabs` are data — `value`, `label`, optional `content` — so the set is a declaration.",
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `orientation`. The row of tabs is horizontal.",
      "There is no `variant` or `size` prop here. A secondary row is `SecondaryTabs`.",
      "There is no `onClose` or removable tabs.",
    ],
  },
  api: [
    {
      name: "tabs",
      type: "NativeTab[]",
      note: "`{ value, label, content? }`. `content` rides ON the tab, so the tab and what it shows are declared together and cannot drift apart.",
    },
    {
      name: "value / defaultValue",
      type: "string",
      note: "The selected tab's `value`. `onValueChange` reports the next one.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      note: "Reports the selected `value` rather than an event.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "Each tab is a real pressable with a `label`, so the row reads as a set of named alternatives.",
    "The selected tab reports its state, so which one is showing is announced rather than only visible.",
    "Tabs are PEERS. Steps that must be done in order are a stepper — using tabs for a sequence hides the order from anyone who cannot see the row.",
  ],
};
