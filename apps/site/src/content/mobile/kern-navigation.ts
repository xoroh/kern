import type { ComponentDoc } from "../types";

export const kernNavigation: ComponentDoc = {
  slug: "kern-navigation",
  name: "Kern navigation",
  oneLiner:
    "Kern navigation unifies drawer, rail, bar and sidebar pane on one destination contract.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "KernNavigation",
    variants: [
      "variant: drawer-modal · rail · bar · sidebar-pane",
      "railMode: collapsed · expanded",
    ],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernNavigation"],
  keyboard: [
    {
      key: "Press",
      action:
        "Selects the destination — each destination is its own stop and reports its key to `onValueChange`. The navigation reports the request; the host owns which destination is current.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves between the destinations; each reads with its label and selected state, and double-tap selects it.",
    },
  ],
  customization: {
    supported: [
      "`sections` are destination data — key, label, icon, badge, disabled — shared by all four variants.",
      "`variant` defaults to `bar` on native; the drawer, rail and sidebar-pane render the same contract in their own surfaces.",
      "`header` and `footer` slot the switcher and user row on rail and sidebar-pane; `floating` docks a FAB above the bar.",
      "`detail` stays unset on native — detail goes in a sheet, since a phone has no drill pane.",
    ],
    notSupported: [
      "There is no destination tree. One flat set per surface; section headings belong to persistent surfaces, and the modal drawer deliberately flattens.",
      "There is no resize or collapse gesture. `railMode` is the host's responsive decision — the navigation does not decide its own width.",
      "There is no routing inside. `value`/`onValueChange` report the key; the host navigates.",
    ],
  },
  api: [
    {
      name: "variant",
      type: "KernNavigationVariant",
    },
    {
      name: "sections",
      type: "readonly KernNavSection[]",
      required: true,
    },
    {
      name: "value",
      type: "string",
    },
    {
      name: "defaultValue",
      type: "string",
    },
    {
      name: "onValueChange",
      type: "(key: string) => void",
    },
    {
      name: "header",
      type: "ReactNode",
      note: "Header slot: switcher (rail + sidebar-pane).",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Footer slot: user row (rail + sidebar-pane + drawer).",
    },
    {
      name: "accessibilityLabel",
      type: "string",
    },
    {
      name: "open",
      type: "boolean",
      note: "`drawer-modal` visibility.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
    },
    {
      name: "title",
      type: "string",
      note: "Drawer headline (drawer-modal only; the drawer has no header slot).",
    },
    {
      name: "subtitle",
      type: "string",
    },
    {
      name: "railMode",
      type: "NavigationRailMode",
    },
    {
      name: "floating",
      type: "ReactNode",
      note: "`bar` FAB dock under the bar (M3).",
    },
    {
      name: "detail",
      type: "ReactNode",
      note: "`sidebar-pane` detail column (W-first; N prefers a sheet).",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "Destinations announce with tab roles and selected state — the same substitution the bar and rail make, so every variant reads one way.",
    "The label defaults to Primary and names the landmark; the drawer takes title and subtitle strings instead.",
    "Native falls back to the first enabled destination, so something is always current — never nothing.",
    "The modal drawer selects-then-dismisses, so choosing a destination always lands.",
  ],
};
