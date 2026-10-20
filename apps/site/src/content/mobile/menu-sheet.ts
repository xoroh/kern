import type { ComponentDoc } from "../types";

export const menuSheet: ComponentDoc = {
  slug: "menu-sheet",
  name: "Menu sheet",
  oneLiner:
    "Menu sheets host grouped actions in a bottom sheet — the same data a menu screen takes, presented over the current screen.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // No web counterpart: the web `Menu` is an anchored popup compound, not a
    // sheet of grouped actions. No export to name as a peer.
    nativePeer: "none",
    variants: [],
    // Level 0: the native modal sheets carry no elevation token (flat;
    // web rests at level 1). Whether flat-native is deliberate or missing
    // elevation is an open owner question — this claims the shipped value.
    elevation: 0,
  },
  parts: ["MenuSheet"],
  keyboard: [
    {
      key: "Android back button",
      action:
        "Dismisses the sheet — the surface's request-close path calls `onDismiss` and reports `onOpenChange(false)`.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the grouped actions in order; double-tap runs the action.",
    },
  ],
  customization: {
    supported: [
      "`groups` are data, identical to `MenuScreen`'s, so content moves between the two without being rewritten.",
      "`title` names the sheet, and `onDismiss` is the single dismissal handler.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `actions` row. Actions live in `groups`; a separate action row would be a different component (`ActionSheet` or `BottomSheet`).",
      "There is no `dismissible` prop. The shell owns that, and dismissal here is wired to both scrim press and hardware back.",
      "There is no `renderGroup` prop. The list is `MenuGroupList`'s.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled visibility. Required.",
    },
    {
      name: "title",
      type: "string",
      note: "Required. Names the sheet.",
    },
    {
      name: "groups",
      type: "MenuGroup[]",
      note: "The same shape `MenuScreen` takes — identical on purpose.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Wired to BOTH scrim press and hardware back through the shared sheet shell. This is the contract that was missing before: the earlier version declared this prop and never used it.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "The sheet is named by `title`, so what has come up is announced rather than only that something did.",
    "Scrim press and hardware back both dismiss, so there is always a way out — the guarantee the earlier version silently broke by accepting `onDismiss` and ignoring it.",
    "Group headings and action labels come from the same data the inline screen uses, so the two forms announce the same content.",
  ],
};
