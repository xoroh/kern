import type { ComponentDoc } from "../types";

export const splitButton: ComponentDoc = {
  slug: "split-button",
  name: "Split button",
  oneLiner:
    "Split buttons pair one primary action with a menu of related alternatives.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/split-button",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "SplitButton",
    variants: [],
    elevation: "surface",
  },
  parts: ["SplitButton"],
  // The contract, read off the two halves and the menu they open: two tab
  // stops with two names, and a menu that behaves like every other menu.
  keyboard: [
    {
      key: "Tab",
      action:
        "Reaches the two halves as two stops — the primary button and the overflow trigger — because they are two controls with two names, and one control with two hit regions could be announced as neither.",
    },
    {
      key: "Enter / Space",
      action:
        "On the primary half, runs the action and leaves the menu closed; on the overflow half, opens the menu. Keeping those apart is the whole reason the component is two halves.",
    },
    {
      key: "Arrow keys",
      action:
        "Move between the overflow items once the menu is open, with wrapping.",
    },
    {
      key: "Escape",
      action:
        "Closes the open menu without choosing, and focus returns to the overflow trigger.",
    },
  ],
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
    {
      name: "testID",
      type: "string | undefined",
      note: "Test selector, rendered as `data-testid` on the control. Opt-in only — no default.",
    },
  ],
  aria: [
    'The primary half is a real button named by `label`, so it announces what it does rather than "button".',
    "The overflow half is a separate control with its own name (`menuLabel`) — two things, so two names.",
    "The icon in the primary button is hidden from assistive tech, because `label` already carries the name and a duplicate would be announced twice.",
    "The menu is a menu: its entries are menu items, and the split does not change that.",
  ],
};
