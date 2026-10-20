import type { ComponentDoc } from "../types";

export const menuGroupList: ComponentDoc = {
  slug: "menu-group-list",
  name: "Menu group list",
  oneLiner:
    "Menu group lists render groups of actions under their headings — the shared list the menu screens and sheets are both built from.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // No web counterpart: the web `Menu` is a compound of Root/Trigger/
    // Content/Item parts, not a single grouped-list export.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["MenuGroupList"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the focused action when one is reached with an external keyboard or switch control.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the actions of each group in order; double-tap runs the action.",
    },
  ],
  customization: {
    supported: [
      "`groups` are data — an optional `heading` and an `actions` list — so the list is a declaration rather than markup.",
      "An action carries `label`, optional `supporting` line, optional `icon`, and `disabled`/`destructive` flags.",
      "`testID` supplies the test hook.",
    ],
    notSupported: [
      "There is no `renderAction` prop. Rows are uniform by design; the two presentations exist to change the HOST, not the row.",
      "The group heading's colour is not this component's to set — `menuGroupStyles` lays out and spaces, and the caller applies the colour.",
      "There is no `onSelect` prop here. Actions carry their own `onPress`; the list does not intercept them.",
    ],
  },
  api: [
    {
      name: "groups",
      type: "MenuGroup[]",
      note: "`{ heading?: string, actions: MenuAction[] }`. Omit `heading` for an ungrouped list — that is valid, not an error.",
    },
    {
      name: "actions",
      type: "MenuAction[]",
      note: "`{ key, label, supporting?, icon?, disabled?, destructive?, onPress? }`. `key` is a stable identity for tests and analytics and is NOT shown.",
    },
    {
      name: "destructive",
      type: "boolean",
      note: "On an action: marks an irreversible one. Note this is a data flag here, not a variant string — and it is deliberately NOT how web names it.",
    },
    {
      name: "menuGroupStyles",
      type: "(scheme) => Styles",
      note: "Public styling helper. Its `scheme` parameter is prefixed `_` because it is retained only for signature compatibility: the styles are scheme-independent BY DESIGN. The heading colour is applied by the caller.",
    },
    {
      name: "testID",
      type: "string",
      note: "The test hook.",
    },
  ],
  aria: [
    "Each action is a real pressable with a `label`, and an optional `supporting` line, so the row is readable without its icon.",
    "A group `heading` is what makes a list of actions intelligible as groups rather than as one long row of text.",
    "The `key` is never announced — it is identity for tests and analytics, and the comment says so plainly so nobody labels a row with it.",
  ],
};
