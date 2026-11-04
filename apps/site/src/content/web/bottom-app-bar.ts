import type { ComponentDoc } from "../types";

export const bottomAppBar: ComponentDoc = {
  slug: "bottom-app-bar",
  name: "Bottom app bar",
  oneLiner:
    "Bottom app bar docks actions leading with a trailing FAB on compact screens.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern",
    // Exact native counterpart, checked in the native inventory.
    nativePeer: "BottomAppBar",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["BottomAppBar"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Operates the docked actions and FAB — each a real button, so the press is the browser's own. The bar itself adds no stops.",
    },
  ],
  customization: {
    supported: [
      "`actions` and `fab` are slots — the bar docks host controls, never builds its own.",
      "`children` carries anything between the clusters; `label` names the landmark.",
      "The bar is fixed-height chrome: actions plus FAB, nothing else fits.",
    ],
    notSupported: [
      "There is no navigation model. Three or more destinations is a navigation bar; actions plus a FAB alone is this component.",
      "There is no FAB behaviour inside. The docked FAB arrives host-owned — plain or menu, the bar only positions it.",
    ],
  },
  api: [
    {
      name: "actions",
      type: "ReactNode",
      note: "Leading cluster: navigation + action icon buttons.",
    },
    {
      name: "fab",
      type: "ReactNode",
      note: "Trailing dock: a FAB (plain) or FAB menu.",
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible name for the toolbar landmark.",
    },
    {
      name: "className",
      type: "string | undefined",
    },
    {
      name: "testID",
      type: "string | undefined",
    },
    {
      name: "children",
      type: "ReactNode",
    },
  ],
  aria: [
    "The bar is a toolbar landmark named by `label`, so it announces as the screen's action dock.",
    "`actions` cluster navigation and action icon buttons leading; `fab` docks the plain FAB or FAB menu trailing.",
  ],
};
