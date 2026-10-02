import type { ComponentDoc } from "../types";

export const navigationMenu: ComponentDoc = {
  slug: "navigation-menu",
  name: "Navigation menu",
  oneLiner:
    "Navigation menus open a panel of links from a trigger in a site's main navigation.",
  features:
    "Reach for a navigation menu when a section of the site has several related destinations and showing them all in the bar would crowd it: a Docs menu over its guides, reference and changelog. The trigger opens a panel and stays put while the panel is explored, so someone can look before they leap. It is the wrong tool for choosing a value — that is a select — and the wrong tool for acting — that is a menu. If the panel is mostly text, consider just showing the links.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native ships `NavigationMenu` too, so the counterpart is direct.
    nativePeer: "NavigationMenu",
    // No variant axis. The menu is one treatment; the state is open or closed.
    variants: [],
    // M3's row "menu" rests at level 2, and the popup ships
    // `--md-sys-elevation-level2` to match.
    elevation: 2,
  },
  parts: [
    "NavigationMenu",
    "NavigationMenuRoot",
    "NavigationMenuList",
    "NavigationMenuItem",
    "NavigationMenuTrigger",
    "NavigationMenuContent",
    "NavigationMenuLink",
  ],
  anatomy: [
    {
      name: "NavigationMenuRoot",
      role: "Owns which item is open. The whole menu hangs off it.",
    },
    {
      name: "NavigationMenuList",
      role: "The row of triggers.",
    },
    {
      name: "NavigationMenuItem",
      role: "One entry: a trigger, and the panel it opens.",
    },
    {
      name: "NavigationMenuTrigger",
      role: "Opens the panel for its item. Carries the expanded state.",
    },
    {
      name: "NavigationMenuContent",
      role: "The panel. Portals to the end of the document and positions itself against its trigger.",
    },
    {
      name: "NavigationMenuLink",
      role: "A destination inside a panel. A link, not a button — it goes somewhere.",
    },
    {
      name: "NavigationMenu",
      role: "The namespace object: all of the parts above.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The panel's surface, outline and lift come from the system roles and `--md-sys-elevation-level2`, so a theme moves the menu with everything else.",
      "Panel width is a minimum rather than a fixed width, so it grows with its content.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. One treatment; the state is open or closed.",
      "There is no `placement` or `side` prop. The panel is positioned for you against its trigger.",
      "There is no `elevation` prop. The panel's resting level matches M3's menu row.",
    ],
  },
  api: [
    {
      name: "value",
      type: "string",
      note: "Controlled open item on `NavigationMenuRoot`. Omit for uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      note: "Fires when the open item changes, including when it closes.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On a trigger: the item cannot be opened and is announced as unavailable.",
    },
    {
      name: "href",
      type: "string",
      note: "On `NavigationMenuLink`. It is a link, so it navigates rather than acting.",
    },
  ],
  aria: [
    "The list is a menubar and the triggers are menuitems with `aria-expanded`, so the structure is announced rather than inferred from layout.",
    "The panel is a menu, and its links are links — so a destination is announced as something you go to, not something you press.",
    "Up/Down and Left/Right move between entries, Escape closes the open panel and returns focus to its trigger.",
    "The trigger keeps focus while its panel is open, so exploring the panel never loses your place in the bar.",
  ],
};
