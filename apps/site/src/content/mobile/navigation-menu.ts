import type { ComponentDoc } from "../types";

export const navigationMenu: ComponentDoc = {
  slug: "navigation-menu",
  name: "Navigation menu",
  oneLiner:
    "Navigation menus are a plain list of navigation links, one of which is marked active.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "NavigationMenu",
    variants: [],
    elevation: 2,
  },
  parts: ["NavigationMenu"],
  // The touch contract: a plain list of named destinations, with the current
  // one marked.
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves between the destinations; double-tap follows the focused one. Each item is a `link` pressable named by its label, and the current destination announces as selected.",
    },
  ],
  customization: {
    supported: [
      "`items` are data — `label`, optional `active`, optional `onPress`.",
      "`style` is a React Native `ViewStyle`. The type omits `children`, so the list is data-driven.",
    ],
    notSupported: [
      "There is no `children` slot. The list is declared as data.",
      "There is no `value`/`onValueChange` selection model. That belongs to `NavigationBar` and `NavigationDrawer`; here the item carries `active` itself.",
      "There is no `onDismiss` and no trigger. This is a plain list, not an overlay — the anchored menu is `Menu`, and the sheet form is `MenuSheet`.",
    ],
  },
  api: [
    {
      name: "items",
      type: "NativeNavigationMenuItem[]",
      note: "`{ label, active?, onPress? }`. Note the shape: `active` is a flag ON the item, where `NavigationBar`/`NavigationDrawer` select by a `value` key and report `onValueChange`. Two selection models in one family, deliberately — a plain list marks its current link; the bar and drawer are controls whose selection the host owns.",
    },
    {
      name: "active",
      type: "boolean",
      note: "Marks the current item. Per item rather than a shared `value`, because there is no control driving a single selection here.",
    },
    {
      name: "onPress",
      type: "() => void",
      note: "Per item. Note it is `onPress` here, matching the grouped menu family, where `Menu`/`Menubar`/`ContextMenu` use `onSelect`.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles. `children` is omitted from the type — the list is data-driven.",
    },
  ],
  aria: [
    "Each item is a real pressable with a `label`, so the list is a list of named destinations rather than undifferentiated text.",
    "`active` marks the current one, which is what lets a reader know where they are without inferring it from position.",
    "PLATFORM SUBSTITUTION: this renderer does not draw a shadow for the resting level the system assigns. The LEVEL is the same as web's; only its expression differs on React Native, where shadows are platform-inconsistent.",
  ],
};
