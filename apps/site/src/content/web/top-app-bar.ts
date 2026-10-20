import type { ComponentDoc } from "../types";

export const topAppBar: ComponentDoc = {
  slug: "top-app-bar",
  name: "Top app bar",
  oneLiner:
    "The top app bar is the screen's header — leading slot, title, trailing actions — plus the app-level bar and its menus.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern/start",
    // Composition tier — web shell. The native `TopAppBar` is the same
    // family on the other tab of this page, not a separate page.
    nativePeer: "TopAppBar",
    variants: ["size: small · medium · large"],
    elevation: "surface",
  },
  parts: [
    "TopAppBar",
    "TopAppBarToggle",
    "AppTopBar",
    "TopBarMenu",
    "AppsMenu",
    "HelpMenu",
    "NotificationsMenu",
    "UserMenu",
  ],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "hover"],
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves through the bar's controls and the open menu's items in order.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused control — toggles the sidebar, opens a menu, follows a menu item.",
    },
  ],
  customization: {
    supported: [
      "`size` is Material 3's three bar heights — `small`, `medium`, `large`.",
      "`TopAppBarToggle` is the control that opens the sidebar, reading `useSidebar()` so no props need threading.",
      "`TopBarMenu` takes `TopBarMenuItem[]` (`id`, `label`, optional `href`, optional `onSelect`), so the four menus are the same component with different data.",
    ],
    notSupported: [
      "There is no arbitrary height. The three sizes are Material 3's and they are the whole axis.",
      "The `*Menu` exports are not configurable variants — they are pre-wired wrappers. To change what they show, use `TopBarMenu` with your own items.",
    ],
  },
  api: [
    {
      name: "size",
      type: '"small" | "medium" | "large"',
      default: '"small"',
      note: "Material 3's three bar sizes. They differ in HEIGHT and in where the title sits, so the shell can lay out against them.",
    },
    {
      name: "TopAppBarToggle",
      type: "component",
      note: "Opens the sidebar. It reads `useSidebar()` itself, so the bar and the sidebar stay in sync without props between them.",
    },
    {
      name: "AppTopBar",
      type: "component",
      note: "The app-level bar with the standard menus already placed.",
    },
    {
      name: "TopBarMenu",
      type: "component",
      note: "One menu, from `TopBarMenuItem[]`. The four `*Menu` exports are thin wrappers over THIS.",
    },
    {
      name: "AppsMenu / HelpMenu / NotificationsMenu / UserMenu",
      type: "component",
      note: "Pre-wired wrappers over `TopBarMenu`. COVERAGE CAVEAT: four of these have no direct test mention — `TopBarMenu`, `AppsMenu`, `HelpMenu`, `UserMenu`. Stable and thin, but not evidence of thorough testing.",
    },
  ],
  aria: [
    "The bar is the screen's header, so its title is what names the screen for a screen reader.",
    'The menus are real menus — items carry `role="menuitem"` — so they announce as the menu they are rather than as loose links.',
    "COVERAGE CAVEAT: `TopBarMenu`, `AppsMenu`, `HelpMenu` and `UserMenu` have no direct test mention. They are thin wrappers over one implementation, but the pages should not imply otherwise.",
  ],
};
