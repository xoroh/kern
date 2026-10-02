import type { ComponentDoc } from "../types";

export const menubar: ComponentDoc = {
  slug: "menubar",
  name: "Menubar",
  oneLiner:
    "A menubar is a horizontal row of menus, the way an application exposes its commands.",
  features:
    "Reach for a menubar when a full application surface needs its command set always reachable and grouped by task: File, Edit, View, Insert. It is the desktop application pattern and it belongs to app shells, not to web pages — a marketing site with a menubar is wearing someone else's clothes. Each menu in the bar is a normal menu, so the entries follow the same rules: actions, grouped, destructive ones last. The bar is for breadth; if you have two menus, you probably have two buttons.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Menubar",
    // No variant axis. The bar is one treatment.
    variants: [],
    // No elevation token on the bar or its popups, and no row in
    // m3-elevation.ts. Nothing asserted either way — see Customization.
    elevation: "surface",
  },
  parts: [
    "Menubar",
    "MenubarRoot",
    "MenubarMenu",
    "MenubarTrigger",
    "MenubarContent",
    "MenubarItem",
  ],
  anatomy: [
    {
      name: "MenubarRoot",
      role: "The bar. Owns which of its menus is open, so opening one closes the others.",
    },
    {
      name: "MenubarMenu",
      role: "One menu's grouping inside the bar.",
    },
    {
      name: "MenubarTrigger",
      role: "The bar entry that opens its menu. Carries the expanded state.",
    },
    {
      name: "MenubarContent",
      role: "The list surface for one menu, positioned against its trigger.",
    },
    { name: "MenubarItem", role: "One action inside a menu." },
    { name: "Menubar", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The bar and its menus share the menu's item states (`data-highlighted`, `data-disabled`), so one stylesheet covers both.",
      "Colours come from the system roles, so a theme moves the whole bar at once.",
    ],
    notSupported: [
      "There is no `orientation` prop. The bar is horizontal — that is what makes it a menubar rather than a menu stack.",
      "There is no `variant` or `size` prop.",
      "There is no `elevation` prop, and the popups ship no elevation token. Nothing in m3-elevation.ts asserts a level for this component.",
    ],
  },
  api: [
    {
      name: "value",
      type: "string",
      note: "Controlled open menu on `MenubarRoot`. Omit for uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      note: "Fires when the open menu changes. Because the bar owns the whole set, one handler sees every open and close.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On a trigger or an item.",
    },
  ],
  aria: [
    "The bar is a menubar and each entry a menuitem with `aria-expanded`, so the two-level structure is announced rather than looked at.",
    "Left/Right move between the bar's menus and Up/Down move within an open one — the WAI-ARIA menubar pattern.",
    "Opening a menu closes any other open menu, so the bar never shows two panels at once.",
    "Escape closes the open menu and keeps focus in the bar, so someone can move to the next menu without re-entering the bar.",
  ],
};
