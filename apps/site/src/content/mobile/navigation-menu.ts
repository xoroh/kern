import type { ComponentDoc } from "../types";

export const navigationMenu: ComponentDoc = {
  slug: "navigation-menu",
  name: "Navigation menu",
  oneLiner:
    "Navigation menus are a plain list of navigation links, one of which is marked active.",
  features:
    "Reach for a navigation menu when the destinations are a simple list of links and the current one should be obvious: a section switcher, a filter list, a set of tabs rendered as text. It is the quietest member of the navigation family — no scrim, no overlay, no selection model to wire. Note that its items are shaped differently from the rest of the family: a `NavigationMenuItem` carries `active` as a flag on the item, where `NavigationBar` and `NavigationDrawer` select by a `value` key and report `onValueChange`. That is deliberate — a plain list marks its current link, while the bar and drawer are controls with a selection the host owns.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "NavigationMenu",
    variants: [],
    elevation: 2,
  },
  parts: ["NavigationMenu"],
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
