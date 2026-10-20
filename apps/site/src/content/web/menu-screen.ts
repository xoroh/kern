import type { ComponentDoc } from "../types";

export const menuScreen: ComponentDoc = {
  slug: "menu-screen",
  name: "Menu screen",
  oneLiner:
    "The menu screen is a full-height list of grouped destinations and actions — a settings-style page, not a menu.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "MenuScreen",
    variants: [],
    // Deliberate: a destination list is page content — no elevation token, no
    // modal presentation. Nothing in M3 tabulates it.
    elevation: "surface",
  },
  parts: ["MenuScreen"],
  // The contract, read off the rows: a menu screen is page content, so it
  // takes no interaction lock and traps nothing.
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves through the action rows one at a time. The screen is page content rather than a dialog, so focus is never trapped and the rest of the page stays reachable.",
    },
    {
      key: "Enter / Space",
      action:
        "Runs the focused action. Each action is a real button, and a disabled one is out of the tab order entirely.",
    },
  ],
  customization: {
    supported: [
      "`groups` is the shared menu data: `{ heading?, actions }` per group, actions carrying label, supporting line, icon, disabled and destructive flags.",
      "`label` names the list for assistive technology; `className` is merged after the screen's own classes.",
    ],
    notSupported: [
      "No modal presentation, no scrim, no focus trap. If the list must interrupt, host it in a `MenuSheet`.",
      "There is no selection or current-item state. A destination list that marks where you ARE is a navigation component's job — the flag here would be yours to render inside an action's icon slot.",
      "No virtualisation or pagination — a menu screen is scanned whole; a long paginated list is a table or a list component.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      required: true,
      note: "The list's accessible name. The screen is a list of lists; this names the whole thing.",
    },
    {
      name: "groups",
      type: "readonly MenuGroup[]",
      required: true,
      note: "The menu data shared with `MenuSheet`: `{ heading?, actions }` per group. An ungrouped list is one group without a heading.",
    },
    {
      name: "className",
      type: "string",
      note: "Passed through and merged after the screen's own classes.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-menu-screen"',
      note: "Test hook for the screen.",
    },
    {
      name: "ref",
      type: "Ref<HTMLDivElement> | undefined",
      note: "Ref to the rendered screen element.",
    },
  ],
  aria: [
    "The whole screen is a `list` named by `label`; each headed group is a `group` named by its heading — an ungrouped list stays one unnamed list rather than a group with an empty name.",
    "Each action is a button named by its label, carrying its own disabled state; the icon is `aria-hidden` decoration and a destructive action is named by its label, with colour only reinforcing.",
    "The screen adds no modal semantics on purpose — it is page content, reachable and escapable like everything else on the page.",
  ],
};
