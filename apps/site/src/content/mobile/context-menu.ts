import type { ComponentDoc } from "../types";

export const contextMenu: ComponentDoc = {
  slug: "context-menu",
  name: "Context menu",
  oneLiner:
    "Context menus attach a list of actions to arbitrary content, opened the platform's own way.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // The web counterpart IS `ContextMenu` on `@xoroh/kern`, though the web one
    // is a compound of Root/Trigger/Content/Item/Separator parts.
    nativePeer: "ContextMenu",
    variants: [],
    elevation: "surface",
  },
  parts: ["ContextMenu"],
  keyboard: [
    {
      key: "Long press",
      action:
        "Opens the menu over the thing that was pressed — the platform's own gesture, not a tap.",
    },
    {
      key: "Android back button",
      action: "Dismisses the open menu through the modal's request-close path.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the items in order; double-tap runs the item and closes the menu.",
    },
  ],
  customization: {
    supported: [
      "`children` is the surface the menu attaches to — whatever the actions belong to.",
      "`items` are data — `label`, optional `onSelect`, optional `disabled`.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `items` render override. Rows are uniform by design.",
      "There is no `grouping`; that is the `MenuGroupList`/`MenuScreen`/`MenuSheet` shape, and its callback is `onPress` rather than `onSelect`.",
      "There is no `longPressOnly` or gesture prop. The open gesture is the platform's.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      note: "The surface the menu attaches to. Unlike `Menu`, which names its control `trigger`, this names it `children` — the thing being acted on rather than a button that opens the list.",
    },
    {
      name: "triggerLabel",
      type: "string",
      note: "REQUIRED — the accessible name of `children`. An arbitrary node cannot name itself, so nothing else could.",
    },
    {
      name: "items",
      type: "NativeMenuItem[]",
      note: "`{ label, onSelect?, disabled? }`, shared with `Menu` and `Menubar`. Note `onSelect` versus the grouped family's `onPress`.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when the menu goes away.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
    {
      name: "testID",
      type: "string",
      note: "The test hook.",
    },
  ],
  aria: [
    "`triggerLabel` is required and it is the accessibility contract: it names the content the actions belong to, which is otherwise an anonymous node.",
    "The menu is attached to content rather than to a button, so the actions announce in the context of the thing being acted on.",
    "Items are real pressables with labels and reported `disabled` state, as in `Menu` and `Menubar`.",
  ],
};
