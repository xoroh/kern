import type { ComponentDoc } from "../types";

export const contextMenu: ComponentDoc = {
  slug: "context-menu",
  name: "Context menu",
  oneLiner:
    "Context menus offer the actions for a thing where the thing is, opened by right-clicking it.",
  features:
    "Reach for a context menu when the actions on an object are what a pointer user expects to find by right-clicking it: a file in a list, a block in an editor, a row in a table. It is the same menu of actions a menu would show — the difference is where it opens and how it is summoned. Never make it the only route to an action: right-click is unavailable on touch and invisible to anyone who does not already know it is there. Whatever it offers must also be reachable from a visible control.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ContextMenu",
    // No variant axis. A context menu is one treatment.
    variants: [],
    // No elevation token on the popup, and no row in m3-elevation.ts.
    // Nothing asserted either way — see Customization.
    elevation: "surface",
  },
  parts: [
    "ContextMenu",
    "ContextMenuRoot",
    "ContextMenuTrigger",
    "ContextMenuContent",
    "ContextMenuItem",
    "ContextMenuSeparator",
  ],
  anatomy: [
    {
      name: "ContextMenuRoot",
      role: "Owns the open state. Accepts `open`/`onOpenChange` to control it.",
    },
    {
      name: "ContextMenuTrigger",
      role: "The surface that owns the actions. Right-clicking it opens the menu at the pointer.",
    },
    {
      name: "ContextMenuContent",
      role: "The list surface. Portals to the end of the document and positions at the pointer rather than against a control.",
    },
    {
      name: "ContextMenuItem",
      role: "One action. Activating it runs it and closes the menu.",
    },
    {
      name: "ContextMenuSeparator",
      role: "A divider between runs of related actions.",
    },
    {
      name: "ContextMenu",
      role: "The namespace object: all of the parts above.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The menu opens at the pointer rather than anchored to a control, which is what makes it feel attached to the thing under the cursor.",
      "Item states are the menu's — `data-highlighted` and `data-disabled` — so one stylesheet covers both.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop.",
      "There is no `placement` prop. The menu opens at the pointer; where it appears is where someone clicked.",
      "There is no `elevation` prop, and the popup ships no elevation token. Nothing in m3-elevation.ts asserts a level for this component.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state on `ContextMenuRoot`. Omit for uncontrolled.",
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
      note: "On an item: skipped rather than left as a dead entry.",
    },
  ],
  aria: [
    "The list is a menu and its entries are menuitems, announced as the menu opens at the pointer.",
    "The menu can be opened from the keyboard as well as the mouse — the context-menu key or Shift+F10 — so it is not pointer-only.",
    "Up/Down move through entries, Escape closes, and focus returns to the trigger.",
    "The trigger is not a button and takes no `aria-expanded`; the menu is announced when it appears rather than promised before it does.",
  ],
};
