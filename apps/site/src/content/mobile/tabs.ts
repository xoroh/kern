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
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        'The bar reads as a tab list; each tab announces its label and selected state (`role="tab"`, `selected`); double-tap switches and the new panel content follows.',
    },
  ],
  usage: {
    do: [
      "Declare tabs as data — `value`, `label`, optional `content` — so the set is one declaration.",
      "Keep labels to one or two words; a tab is a signpost, not a sentence.",
      "Drive `value`/`onValueChange` when the tab must follow app state (deep links, wizards); leave uncontrolled otherwise.",
    ],
    dont: [
      "Don't use tabs for a binary choice — that is a segmented button or switch.",
      "Don't change the tab count after mount — the set is the navigation, not content.",
    ],
  },
  tokens: [
    {
      element: "Active tab label",
      state: "selected",
      token: "theme.color.primary",
      value: "primary label on the selected tab",
    },
    {
      element: "Inactive tab label",
      state: "resting",
      token: "theme.color.onSurfaceVariant",
      value: "onSurfaceVariant label, minHeight 48 per tab",
    },
    {
      element: "Active indicator",
      state: "selected",
      token: "theme.color.primary",
      value: "3px primary underline under the selected tab",
    },
    {
      element: "Bar divider",
      state: "resting",
      token: "theme.color.outlineVariant",
      value: "1px outlineVariant rule under the bar",
    },
  ],
  faq: [
    {
      q: "Tabs or segmented button?",
      a: "Tabs switch views or panels (content follows the tab); a segmented button switches a value within one view. Navigation means tabs.",
    },
    {
      q: "How does this differ from the web tabs?",
      a: "The contract is the same (data-declared set, controlled or uncontrolled). Both mark selection with the primary treatment plus the screen-reader `selected` state.",
    },
  ],
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
