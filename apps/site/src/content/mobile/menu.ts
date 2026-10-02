import type { ComponentDoc } from "../types";

export const menu: ComponentDoc = {
  slug: "menu",
  name: "Menu",
  oneLiner:
    "Menus show a short list of actions attached to a trigger you supply.",
  features:
    "Reach for a menu when a trigger should offer a few actions without taking the reader anywhere: an overflow list, a set of options on an item, an edit menu. The trigger is yours — you pass the content and you pass its NAME, because `triggerLabel` is required rather than inferred. The items are data, and note the callback is `onSelect`, not `onPress`: the grouped menu family (`MenuGroupList`, `MenuScreen`, `MenuSheet`) calls the same thing `onPress`, so copying an action between the two forms needs that one rename. Keep the list short and the actions reversible; a menu with many choices or destructive ones wants a different surface.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // The web counterpart IS `Menu` on `@xoroh/kern`, though the web one is a
    // compound of Root/Trigger/Content/Item parts rather than this single
    // component with data.
    nativePeer: "Menu",
    variants: [],
    elevation: "surface",
  },
  parts: ["Menu"],
  customization: {
    supported: [
      "`trigger` is a slot, so the control that opens the menu is entirely yours.",
      "`items` are data — `label`, optional `onSelect`, optional `disabled`.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `items` render override. Rows are uniform by design.",
      "There is no `grouping`. Grouped, headed action lists are `MenuGroupList`/`MenuScreen`/`MenuSheet` — a different data shape (`MenuAction`), and note their callback is `onPress` where this one is `onSelect`.",
      "There is no `placement` or `side` prop. Positioning is the platform's.",
    ],
  },
  api: [
    {
      name: "trigger",
      type: "ReactNode",
      note: "The control that opens the menu. Yours entirely.",
    },
    {
      name: "triggerLabel",
      type: "string",
      note: "REQUIRED — the trigger's accessible name. Not inferred from `trigger`, since the trigger is an arbitrary node.",
    },
    {
      name: "items",
      type: "NativeMenuItem[]",
      note: "`{ label, onSelect?, disabled? }`. Note `onSelect` here where the grouped menu family calls the same thing `onPress` — a real inconsistency in the family, and the reason copying an action between the two forms needs a rename.",
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
    "`triggerLabel` being required is the accessibility contract: the trigger is an arbitrary node, so nothing else can name it.",
    "Each item is a real pressable with a `label`, so the list is readable and actionable without seeing it.",
    "`disabled` items stay in the list and are reported as disabled, which is how a reader learns the action exists but is unavailable.",
  ],
};
