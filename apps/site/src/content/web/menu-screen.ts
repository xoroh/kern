import type { ComponentDoc } from "../types";

export const menuScreen: ComponentDoc = {
  slug: "menu-screen",
  name: "Menu screen",
  oneLiner:
    "The menu screen is a full-height list of grouped destinations and actions — a settings-style page, not a menu.",
  features:
    "Reach for a menu screen when the content IS a set of grouped destinations or commands and it belongs in the page: a settings list, an admin index, a workspace switcher's alternatives. It is deliberately not a menu — it is not modal, it does not take the interaction lock and it carries no elevation token, the same docked-versus-dialog reasoning the `DockSheet` uses. The groups are the shared menu data (`MenuGroup`), the same shape the `MenuSheet` takes, so an action can live on the page today and in a sheet tomorrow without being rewritten. Groups without a heading render as one flat list; a heading makes the group a named group.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "MenuScreen",
    variants: [],
    // Deliberate: a destination list is page content — no elevation token, no
    // modal presentation. Nothing in M3 tabulates it.
    elevation: "surface",
  },
  parts: ["MenuScreen"],
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
  ],
  aria: [
    "The whole screen is a `list` named by `label`; each headed group is a `group` named by its heading — an ungrouped list stays one unnamed list rather than a group with an empty name.",
    "Each action is a button named by its label, carrying its own disabled state; the icon is `aria-hidden` decoration and a destructive action is named by its label, with colour only reinforcing.",
    "The screen adds no modal semantics on purpose — it is page content, reachable and escapable like everything else on the page.",
  ],
};
