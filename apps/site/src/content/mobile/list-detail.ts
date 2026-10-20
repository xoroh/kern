import type { ComponentDoc } from "../types";

export const listDetail: ComponentDoc = {
  slug: "list-detail",
  name: "List detail",
  oneLiner:
    "List detail is the phone-width master–detail pattern: the list until an item is selected, then the detail with a way back.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ListDetail",
    variants: [],
    elevation: "surface",
  },
  parts: ["ListDetail"],
  // The contract, read off the component: the one control it owns is the
  // back affordance, and it is a real named button — not a gesture.
  keyboard: [
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Activates the back affordance. It is a `button` pressable named by `backLabel`, and it calls `onBack` — which brings the list back.",
    },
    {
      key: "Swipe (TalkBack / VoiceOver)",
      action:
        "Moves through the content of whichever pane is showing. Only one pane is in the tree at a time, so the order never crosses a hidden pane.",
    },
  ],
  customization: {
    supported: [
      "`list` and `detail` are plain slots — the panes' content is entirely yours.",
      "`showingDetail` is the host's selection state: true once an item is selected AND the detail should be shown.",
      "`onBack` renders the back affordance and `backLabel` names it. `style` is a React Native `ViewStyle` for the shell.",
    ],
    notSupported: [
      "There is no selection model inside. The component does not know what an item is — selection and `showingDetail` are the host's state.",
      "No side-by-side presentation at wide widths. That is the web `ListDetail`'s job; the native one collapses to one pane, always.",
      "The back affordance renders ONLY when `onBack` is passed. There is no default back behaviour — navigation is the host's, not the layout's.",
    ],
  },
  api: [
    {
      name: "list",
      type: "ReactNode",
      required: true,
      note: "The list pane. Shown whenever the detail is not.",
    },
    {
      name: "detail",
      type: "ReactNode",
      note: "The detail pane. Shown only when `showingDetail` is true AND this is present — otherwise the list stays.",
    },
    {
      name: "showingDetail",
      type: "boolean",
      default: "false",
      note: "The host's selection state. The component owns the swap, not the selection.",
    },
    {
      name: "onBack",
      type: "() => void",
      note: "Renders the back affordance when present. Without it there is no back control — by design, since navigation is the host's.",
    },
    {
      name: "backLabel",
      type: "string",
      default: '"Back"',
      note: "The back affordance's text and accessibility label.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles for the shell.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-list-detail"',
      note: "Test hook for the shell.",
    },
  ],
  aria: [
    "The back affordance is a `button` role pressable labelled by `backLabel` — dismissal of the detail is a real, named control.",
    "Only one pane is in the tree at a time, so screen-reader and keyboard order never crosses a hidden pane.",
    "Selection is the host's to announce: when the detail replaces the list, moving focus to the detail's heading is the host's follow-through, and it is what makes the swap perceivable.",
  ],
};
