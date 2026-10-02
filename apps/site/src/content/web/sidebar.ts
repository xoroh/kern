import type { ComponentDoc } from "../types";

export const sidebar: ComponentDoc = {
  slug: "sidebar",
  name: "Sidebar",
  oneLiner:
    "Sidebars are the app's persistent navigation region, composed from a provider, sections and items.",
  features:
    "Reach for a sidebar when the app has enough destinations that they should always be reachable — a tool, a console, a docs site. It is a composition rather than one component: `SidebarProvider` owns the open state and exposes it through `useSidebar`, then `Sidebar` lays out `Header`, `Content` and `Footer` regions with `SidebarItem`s in them. That separation is deliberate — the state is one place, the chrome is several, and a shell can swap any region without forking. `NavigationRail` and `SectionDrawer` are the two narrower forms of the same destination list, so the places are declared once and the container is chosen per breakpoint.",
  meta: {
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
    "NavigationRailButton",
    "SectionDrawer",
  ],
  customization: {
    supported: [
      "`SidebarProvider` takes the open state, so the shell controls the sidebar rather than the sidebar controlling itself.",
      "`useSidebar()` reads that state anywhere inside, which is how the top bar's toggle reaches it.",
      "The three regions are separate exports, so a shell omits or replaces any of them.",
    ],
    notSupported: [
      "There is no `variant` prop on `Sidebar`. The narrower forms are different components — `NavigationRail` and `SectionDrawer`.",
      "Widths are fixed exported constants (`SIDEBAR_WIDTHS`, `NAVIGATION_RAIL_WIDTH`, `SECTION_DRAWER_WIDTH`), not per-instance props.",
    ],
  },
  api: [
    {
      name: "SidebarProvider",
      type: "component",
      note: "Owns the open state and publishes it. A CONTEXT PROVIDER and one of the seven exports with no direct test mention — stable, but the pages should not imply more coverage than there is.",
    },
    {
      name: "useSidebar()",
      type: "() => SidebarState",
      note: "Reads the open state anywhere inside the provider. This is what lets a top-bar toggle reach the sidebar without threading props.",
    },
    {
      name: "SidebarHeader / Content / Footer",
      type: "component",
      note: "The three regions. `SidebarFooter` has no direct test mention; `Header` and `Content` do.",
    },
    {
      name: "SidebarItem",
      type: "component",
      note: "One destination row.",
    },
    {
      name: "NavigationRail / NavigationRailButton",
      type: "component",
      note: "The narrow form — an icon rail. Width is the exported `NAVIGATION_RAIL_WIDTH`.",
    },
    {
      name: "SectionDrawer",
      type: "component",
      note: "The modal form. Width follows the exported `SECTION_DRAWER_WIDTH`.",
    },
  ],
  aria: [
    "It is a navigation region, so it should be one landmark rather than a pile of links.",
    "The provider's state is what a toggle announces — an open sidebar and a closed one are different experiences and the control says which.",
    "COVERAGE CAVEAT: `SidebarProvider` and `SidebarFooter` have no direct test mention. They are stable and low-churn — one context provider, one region slot — but do not read these pages as evidence of thorough testing.",
  ],
};
