import type { ComponentDoc } from "../types";

export const fabMenu: ComponentDoc = {
  slug: "fab-menu",
  name: "Fab menu",
  oneLiner:
    "Fab menus are a floating button that opens a short list of actions, with the icon swapping while open.",
  features:
    "Reach for a fab menu when there are a few related primary actions and one floating button should carry them: create, add, share. The trigger opens the list and the icon can change while it is open — `openIcon` swaps in for `icon`, so a plus becomes a close rather than leaving the same glyph to mean two things. The open state is the controllable pattern (`open`, `defaultOpen`, `onOpenChange`), matching the other overlays in the family. Note there are two names: `label` names the trigger and defaults to the FIRST action's label, while `menuLabel` overrides the trigger's name and therefore the menu's.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "FabMenu",
    variants: [],
    elevation: 3,
  },
  parts: ["FabMenu"],
  customization: {
    supported: [
      "`actions` are data, and `label` names the trigger — defaulting to the first action's label.",
      "`openIcon` swaps in for `icon` while the menu is open.",
      "`open`/`defaultOpen`/`onOpenChange` make it controlled or uncontrolled.",
    ],
    notSupported: [
      "There is no nested or grouped actions. The list is flat and short.",
      "There is no `placement`. It opens where a fab opens.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "The trigger's accessible name. DEFAULTS TO THE FIRST ACTION'S LABEL — reasonable, but worth knowing, since the trigger will be named after whatever happens to be first.",
    },
    {
      name: "icon / openIcon",
      type: "ReactNode",
      note: '`openIcon` shows while the menu is open and defaults to `icon`. Swapping means one glyph never has to mean both "open" and "close".',
    },
    {
      name: "actions",
      type: "NativeFabMenuAction[]",
      note: "The menu's items.",
    },
    {
      name: "open / defaultOpen / onOpenChange",
      type: "boolean / (open: boolean) => void",
      note: "The controllable pattern — matching `Popover`, `Drawer` and `Tooltip`, not `Dialog`'s `visible`.",
    },
    {
      name: "menuLabel",
      type: "string",
      note: "Overrides the trigger's accessible name AND therefore the menu's. Two names, one relationship: changing this renames both.",
    },
    {
      name: "testID",
      type: "string",
      note: "The test hook.",
    },
  ],
  aria: [
    "`label` names the trigger and defaults to the first action's label — so the announced name depends on your action order unless you set it.",
    "`menuLabel` renames the trigger and, with it, the menu. Worth being deliberate about: one prop, two names changed.",
    '`openIcon` swapping is an accessibility matter as much as a visual one — the same glyph meaning both "open" and "close" is a control that contradicts itself.',
  ],
};
