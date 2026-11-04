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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Arrow keys",
      action:
        "Moves between destinations with the composed surface's roving tabindex; selection follows focus rather than staying behind.",
    },
    {
      key: "Enter / Space",
      action:
        "Selects the focused destination and reports its key — the navigation reports the request and the host owns which destination is current.",
    },
  ],
  customization: {
    supported: [
      "`sections` are destination data — key, label, icon, badge, disabled — shared by all four variants, and `routeManifestToSections` builds them from a route manifest.",
      "`variant` picks the surface: `drawer-modal` for the transient sheet, `rail` for the icon edge, `bar` for compact screens, `sidebar-pane` for the persistent desk layout.",
      "`header` and `footer` slot the workspace switcher and the user row; `detail` carries the drill pane on `sidebar-pane`.",
      "`floating` docks a FAB above the bar — above, never inside, per M3.",
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
      type: '"drawer-modal" | "rail" | "bar" | "sidebar-pane"',
    },
    {
      name: "sections",
      type: "readonly KernNavSection[]",
      required: true,
    },
    {
      name: "value",
      type: "string | undefined",
      note: "Controlled active destination key.",
    },
    {
      name: "defaultValue",
      type: "string | undefined",
      note: "Initial active key for the uncontrolled case.",
    },
    {
      name: "onValueChange",
      type: "((key: string) => void) | undefined",
    },
    {
      name: "header",
      type: "ReactNode",
      note: "Header slot: workspace switcher.",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Footer slot: user row, settings shortcut.",
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible name for the navigation landmark.",
    },
    {
      name: "open",
      type: "boolean | undefined",
      note: "`drawer-modal` visibility.",
    },
    {
      name: "defaultOpen",
      type: "boolean | undefined",
    },
    {
      name: "onOpenChange",
      type: "((open: boolean) => void) | undefined",
    },
    {
      name: "railMode",
      type: '"collapsed" | "expanded"',
      note: "`rail` presentation: icons-only vs sidebar.",
    },
    {
      name: "floating",
      type: "ReactNode",
      note: "`bar` FAB dock above the bar (M3).",
    },
    {
      name: "detail",
      type: "ReactNode",
      note: "`sidebar-pane` drill/detail pane (W 3-pane; N: pass nothing — the detail belongs in a `KernOverlay` sheet on 1-pane screens).",
    },
    {
      name: "title",
      type: "ReactNode",
      note: "Sidebar headline when the variant shows section headings.",
    },
    {
      name: "className",
      type: "string | undefined",
    },
    {
      name: "testID",
      type: "string | undefined",
    },
  ],
  aria: [
    "Destinations keep their surface's contract: the bar and rail announce tabs with selected state, the drawer announces a labelled dialog list.",
    "`label` names the landmark on every variant, so two navigations on a page stay distinguishable.",
    "Exactly one destination is current; the selected destination is painted and announced from the same `value`.",
    "The modal drawer selects-then-dismisses on both renderers, so choosing a destination always lands.",
  ],
};
