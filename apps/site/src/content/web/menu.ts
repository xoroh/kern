import type { ComponentDoc } from "../types";

export const menu: ComponentDoc = {
  slug: "menu",
  name: "Menu",
  oneLiner:
    "Menus list the actions available on something, opened from the control that owns them.",
  features:
    "Reach for a menu when a set of actions belongs to one thing and showing them all would crowd it: a row's overflow, a file's options, an editor's insert menu. The menu is about doing — every entry acts and closes. If an entry goes somewhere instead, that is a navigation menu; if it picks a value, that is a select. Group related entries and label the groups, because a flat list of twelve verbs is a memory test. Destructive entries belong at the bottom, away from the ones people mean to press.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Menu",
    // No variant axis. A menu is one treatment; the state is open or closed.
    variants: [],
    // kern's `M3_ELEVATION_COMPONENTS` maps M3's "menu" row (level 2) to
    // `navigation-menu`, so the plain `Menu` popup has no asserted row — and
    // it ships no elevation token either. See Customization.
    elevation: "surface",
  },
  parts: [
    "Menu",
    "MenuRoot",
    "MenuTrigger",
    "MenuContent",
    "MenuItem",
    "MenuSeparator",
    "MenuGroupLabel",
  ],
  anatomy: [
    { name: "MenuRoot", role: "Owns the open state for one menu." },
    {
      name: "MenuTrigger",
      role: "The control the menu belongs to. Carries the expanded state.",
    },
    {
      name: "MenuContent",
      role: "The list surface. Portals to the end of the document and positions itself against its trigger.",
    },
    {
      name: "MenuItem",
      role: "One action. Activating it runs it and closes the menu.",
    },
    {
      name: "MenuSeparator",
      role: "A divider between runs of related actions.",
    },
    {
      name: "MenuGroupLabel",
      role: "Names a run of related actions, so the list reads as sections rather than a flat column.",
    },
    { name: "Menu", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "Item states are exposed as `data-highlighted` and `data-disabled`, so hover and unavailable actions are restylable without new props.",
      "The surface and outline come from the system roles, so a theme moves every menu at once.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. One treatment; the state is open or closed.",
      "There is no `placement` or `side` prop. The list is positioned against its trigger and the offset is fixed.",
      "There is no `elevation` prop, and the popup currently ships no elevation token at all. M3 places a menu at resting level 2; kern's assertion row for that level is attached to `navigation-menu`, so nothing here is asserted and the popup renders flat. That is a gap against the spec rather than a conformant state, and it is reported to the token owners rather than claimed here.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state on `MenuRoot`. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and outside clicks.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On an item, or on the trigger. A disabled item is skipped rather than left as a dead entry.",
    },
  ],
  aria: [
    "The trigger carries `aria-expanded`, so whether the menu is open is announced before it is opened.",
    "The list is a menu and its entries are menuitems, so the structure is announced rather than inferred from a column of text.",
    "Up/Down move through entries and Enter or Space activates; Escape closes and returns focus to the trigger.",
    "The menu is not modal — the page behind it stays operable, which is why a menu is the wrong place for a decision that must be made before continuing.",
  ],
};
