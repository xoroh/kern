import type { ComponentDoc } from "../types";

export const fabMenu: ComponentDoc = {
  slug: "fab-menu",
  name: "FAB menu",
  oneLiner:
    "FAB menus hold several related actions behind one floating button, opened on tap.",
  features:
    "Reach for a FAB menu when a screen has several closely related primary actions and showing each as its own button would scatter them: composing different kinds of content, adding different kinds of thing. The actions come as data, so the menu is a list you pass in. Separate the ones that are unlike the rest — a destructive action in the middle of creative ones is a mis-tap waiting to happen. If there is only one action, that is a plain FAB; if the actions are not related, they belong in different places on the screen rather than behind one door.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/fab-menu",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "FabMenu",
    variants: [],
    // Material 3 tabulates "fab menu (close button)" at level 3 and "fab menu
    // (list items)" at level 0 — one component, two rows. The trigger rests at
    // the higher level.
    elevation: 3,
  },
  parts: ["FabMenu"],
  customization: {
    supported: [
      "`className` styles the menu and `triggerClassName` styles the button, so the two can be adjusted without one affecting the other.",
      "`icon` and `openIcon` let the trigger change glyph while open, which is how a plus becomes a close.",
      "Actions are data — `key`, `label`, optional `icon`, `disabled`, `separated`, `onSelect`.",
    ],
    notSupported: [
      "There is no `placement` prop. The menu opens above the trigger, where a floating action button's menu belongs.",
      "There is no `variant` or `size` prop on the trigger.",
      "There is no `elevation` prop. The trigger and the list sit at different Material 3 levels and those are not tunable per menu.",
    ],
  },
  api: [
    {
      name: "actions",
      type: "FabMenuAction[]",
      note: "The entries, as data. Each carries `key`, `label`, and optionally `icon`, `disabled`, `separated` and `onSelect`.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "The glyph on the trigger. Required.",
    },
    {
      name: "openIcon",
      type: "ReactNode",
      note: "The glyph while the menu is open. Defaults to `icon`, which is how a plus becomes a close without two separate components.",
    },
    {
      name: "label",
      type: "string",
      note: "The trigger's accessible name. Defaults to the FIRST action's label — so an unnamed menu names itself after whatever it happens to contain first. Supply it deliberately.",
    },
    {
      name: "menuLabel",
      type: "string",
      note: "Overrides the trigger's accessible name, and therefore the menu's. The menu surface INHERITS its name from the trigger; it does not carry one of its own.",
    },
    {
      name: "separated",
      type: "boolean",
      note: "On an action: draws a divider before it. Use it to fence off the action that is unlike the others.",
    },
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Fires when the menu opens or closes.",
    },
    {
      name: "className",
      type: "string",
      note: "Styles the menu. `triggerClassName` styles the button separately.",
    },
    {
      name: "triggerClassName",
      type: "string",
      note: "Styles the trigger button on its own, without touching the menu.",
    },
  ],
  aria: [
    "The trigger is a button with `aria-expanded`, so whether the menu is open is announced before it is opened.",
    "The menu surface inherits its accessible name from the trigger — it does not carry its own, which is why `menuLabel` changes both.",
    "The default trigger name is the FIRST action's label. That is a fallback, not a plan; supply `label`.",
    "Each action is a real menu item, so the set reads as actions rather than as a stack of anonymous buttons.",
  ],
};
