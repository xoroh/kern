import type { ComponentDoc } from "../types";

export const menubar: ComponentDoc = {
  slug: "menubar",
  name: "Menubar",
  oneLiner:
    "Menubars hold several named menus in one bar, each opening its own list of actions.",
  features:
    "Reach for a menubar when there are several groups of actions and each group has a name people already know: File, Edit, View. It is the horizontal container of menus, and it reuses the same `NativeMenuItem` shape that a single `Menu` does, so an action can move from one menu into another without changing its data. Each menu in the bar carries its own `label`, which is what makes the bar legible as a row of named destinations rather than a row of buttons.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // The web counterpart IS `Menubar` on `@xoroh/kern`, though the web one is
    // a compound of Root/Menu/Trigger/Content/Item parts.
    nativePeer: "Menubar",
    variants: [],
    elevation: "surface",
  },
  parts: ["Menubar"],
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
