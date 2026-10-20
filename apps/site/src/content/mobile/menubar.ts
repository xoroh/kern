import type { ComponentDoc } from "../types";

export const menubar: ComponentDoc = {
  slug: "menubar",
  name: "Menubar",
  oneLiner:
    "Menubars hold several named menus in one bar, each opening its own list of actions.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // The web counterpart IS `Menubar` on `@xoroh/kern`, though the web one is
    // a compound of Root/Menu/Trigger/Content/Item parts.
    nativePeer: "Menubar",
    variants: [],
    elevation: "surface",
  },
  parts: ["Menubar"],
  // The contract, read off the component: the bar is a menubar of
  // menuitem pressables, and the open menu is a modal — so the hardware
  // back button is the way out of it.
  keyboard: [
    {
      key: "Hardware back (Android)",
      action:
        "Closes the open menu. The modal's request-close is wired to the same dismiss path as picking an item.",
    },
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Opens a menu in the bar. Each entry is a `menuitem` pressable named by its menu, and the items in the open menu are pressables too.",
    },
  ],
  customization: {
    supported: [
      "`menus` are data — a `label` and an `items` list per menu.",
      "`style` is a React Native `ViewStyle`. The type omits `children`, so the bar is entirely data-driven.",
    ],
    notSupported: [
      "There is no `children` slot. The bar is declared as data, which is what keeps the menus uniform.",
      "There is no `orientation` prop. It is a horizontal bar; a vertical list of named groups is `MenuGroupList`.",
      "There is no `onSelect` here — that belongs to the individual `NativeMenuItem`s, and it is `onSelect` rather than the grouped family's `onPress`.",
    ],
  },
  api: [
    {
      name: "menus",
      type: "NativeMenubarMenu[]",
      note: "`{ label, items }`. Each `label` names a menu in the bar, and `items` reuses `NativeMenuItem` — the same shape a single `Menu` takes.",
    },
    {
      name: "items",
      type: "NativeMenuItem[]",
      note: "`{ label, onSelect?, disabled? }`, shared with `Menu`. Note `onSelect` here where the grouped menu family uses `onPress`.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when an open menu goes away.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles. `children` is omitted from the type — the bar is data-driven.",
    },
    {
      name: "testID",
      type: "string",
      note: "Inherited from `ViewProps` rather than declared here.",
    },
  ],
  aria: [
    "Each menu's `label` is what makes the bar readable as named destinations rather than as one row of unlabelled buttons.",
    "Items are real pressables with labels and reported `disabled` state.",
    "The bar is a single row of menus, so it announces as a group; the individual menus announce by their labels.",
  ],
};
