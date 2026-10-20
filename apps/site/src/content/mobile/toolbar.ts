import type { ComponentDoc } from "../types";

export const toolbar: ComponentDoc = {
  slug: "toolbar",
  name: "Toolbar",
  oneLiner:
    "Toolbars hold a row of actions — labelled, optional, and individually disableable.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Toolbar",
    variants: [],
    // Expressive floating defaults to level3 (6dp); docked is flat.
    elevation: 3,
  },
  parts: ["Toolbar"],
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The bar reads as a toolbar named by its label, and each action as a button with its own label; double-tap runs the action. A disabled action is announced as unavailable and cannot be run.",
    },
  ],
  customization: {
    supported: [
      "`actions` are data — `label`, optional `onPress`, optional `disabled`.",
      "`accessibilityLabel` names the toolbar as a whole.",
      "`style` is a React Native `ViewStyle`, and `ViewProps` pass through.",
    ],
    notSupported: [
      "There is no `renderAction` and no icon slot. Actions are named text, which is what keeps them all named.",
      "There is no `orientation`. It is a row.",
      "There is no grouping or overflow. A toolbar that needs to collapse is a `Menubar`.",
    ],
  },
  api: [
    {
      name: "actions",
      type: "NativeToolbarAction[]",
      note: "`{ label, onPress?, disabled? }`. `label` is REQUIRED — so every action is named by construction and the icon-only-button trap is not reachable here.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the toolbar as a whole, so the row reads as one thing rather than as loose buttons.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On an action: stops it and reports it, so an unavailable action is announced as unavailable.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles. `ViewProps` pass through.",
    },
  ],
  aria: [
    "Every action is named — `label` is required — which closes the icon-only-button trap at the type level rather than in review.",
    "`accessibilityLabel` names the row, so it announces as a toolbar rather than as a run of buttons.",
    "`disabled` actions stay visible and announce as disabled, so the action is discoverable even when it is unavailable.",
  ],
};
