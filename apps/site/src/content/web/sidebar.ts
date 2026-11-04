import type { ComponentDoc } from "../types";

export const sidebar: ComponentDoc = {
  slug: "sidebar",
  name: "Sidebar",
  oneLiner:
    "Sidebars are the app's persistent navigation region, composed from a provider, sections and items.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern/start",
    // Composition tier: no native counterpart is expected — these are web
    // shell compositions. `none` with the reason, not a near-neighbour.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: [
    "SidebarProvider",
    "Sidebar",
    "SidebarHeader",
    "SidebarContent",
    "SidebarFooter",
    "SidebarItem",
    "NavigationRail",
    "SectionDrawer",
  ],
  // The sidebar is a NAVIGATION LANDMARK: it takes no focus of its own, and
  // its destinations are the tab stops. A closed sidebar renders no
  // destinations at all, so while it is closed it is not in the tab order.
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves through the sidebar's destinations in order. A closed sidebar renders no destinations, so it takes no focus at all.",
    },
    {
      key: "Enter / Space",
      action:
        "Follows the focused destination. A destination with an href is a link; without one it is a button, and the press runs it.",
    },
  ],
  customization: {
    supported: [
      "`SidebarProvider` takes the open state, so the shell controls the sidebar rather than the sidebar controlling itself.",
      "`useSidebar()` reads that state anywhere inside, which is how the top bar's toggle reaches it.",
      "The three regions are separate exports, so a shell omits or replaces any of them.",
    ],
    notSupported: [
      "There is no `variant` prop on `Sidebar`. The narrower forms are different components — `NavigationRail` and `SectionDrawer`.",
      "Widths are fixed exported constants (`SIDEBAR_WIDTHS`, `KERN_NAVIGATION_RAIL_WIDTH`, `SECTION_DRAWER_WIDTH`), not per-instance props.",
    ],
  },
  api: [
    {
      name: "destinations",
      type: "readonly NavigationDestination[]",
      note: "The rail's destinations — key, label, icon, badge. Data, not children.",
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
      type: "(key: string) => void",
      note: "Fires on destination select, controlled or not.",
    },
    {
      name: "mode",
      type: '"collapsed" | "expanded"',
      note: "Collapsed icon rail or expanded list — see `KERN_NAVIGATION_RAIL_WIDTH` / `KERN_NAVIGATION_RAIL_EXPANDED_WIDTH`. Collapsing is visual only — the accessible name never changes.",
    },
    {
      name: "header",
      type: "ReactNode",
      note: "Rendered above the destination list — a menu toggle, a switcher.",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Rendered below the list — a user row, a settings shortcut.",
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible name for the navigation landmark. Defaults to “Primary”.",
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
    "It is a navigation region, so it should be one landmark rather than a pile of links.",
    "The provider's state is what a toggle announces — an open sidebar and a closed one are different experiences and the control says which.",
    "COVERAGE CAVEAT: `SidebarProvider` and `SidebarFooter` have no direct test mention. They are stable and low-churn — one context provider, one region slot — but do not read these pages as evidence of thorough testing.",
  ],
};
