import type { ComponentDoc } from "../types";

export const splitButton: ComponentDoc = {
  slug: "split-button",
  name: "Split button",
  oneLiner:
    "Split buttons pair one primary action with a menu of related alternatives.",
  features:
    "Reach for a split button when there is one action people take most of the time and a few they take occasionally: the usual export plus the other formats, the default send plus the scheduled ones. The left half does the common thing immediately; the right half opens the rest. It earns its space only when the alternatives genuinely relate to the primary — a menu of unrelated actions behind a labelled button is just a button with a drawer. If the primary changes, so should its label; a split button whose main action is a guess is worse than a plain menu.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "SplitButton",
    variants: [],
    elevation: "surface",
  },
  parts: ["SplitButton"],
  customization: {
    supported: [
      "`className` is passed through and merged after the control's own classes.",
      "Actions are data — `key`, `label`, optional `icon`, `disabled`, `separated`, `onSelect`.",
      "`separated` draws a divider before an action, so the one that is unlike the others can be fenced off.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop.",
      "There is no `placement` prop for the menu. It opens under the overflow half, where an overflow belongs.",
      "There is no `primary` flag on the actions. The primary is `label` and `onClick`; the rest are the menu.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "The primary action, and the primary button's accessible name. One string serves both, so what is shown and what is announced cannot disagree.",
    },
    {
      name: "onClick",
      type: "() => void",
      note: "What the left half does. This is the common action, so it should be the one people mean most of the time.",
    },
    {
      name: "actions",
      type: "SplitButtonAction[]",
      note: "The alternatives, as data. An EMPTY LIST RENDERS NO OVERFLOW HALF — so a split button with nothing to split degrades to a plain button rather than a dead second half.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Icon inside the primary button. Hidden from assistive tech, since `label` already names the action.",
    },
    {
      name: "menuLabel",
      type: "string",
      note: "The overflow trigger's accessible name. The menu half needs its own name — it is a different control doing a different thing.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the control's own classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Disables both halves together.",
    },
  ],
  aria: [
    'The primary half is a real button named by `label`, so it announces what it does rather than "button".',
    "The overflow half is a separate control with its own name (`menuLabel`) — two things, so two names.",
    "The icon in the primary button is hidden from assistive tech, because `label` already carries the name and a duplicate would be announced twice.",
    "The menu is a menu: its entries are menu items, and the split does not change that.",
  ],
};
