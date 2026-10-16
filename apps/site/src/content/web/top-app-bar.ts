import type { ComponentDoc } from "../types";

export const topAppBar: ComponentDoc = {
  slug: "top-app-bar",
  name: "Top app bar",
  oneLiner:
    "The top app bar is the screen's header — leading slot, title, trailing actions — plus the app-level bar and its menus.",
  features:
    "Reach for the top app bar when a screen needs a name and a place for its actions. It is Material 3's bar in three sizes, and the composition family around it is what makes it useful in a real shell: `AppTopBar` is the app-level variant with the menus already wired, and the four `*Menu` exports are thin wrappers over one `TopBarMenu` — apps, help, notifications, user. Grouping them here rather than giving each a page is deliberate: they share one implementation and differ only in which items they show. The sizes are Material 3's and they change the bar's HEIGHT, so the shell can lay out against a known number.",
  meta: {
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
  anatomy: [
    {
      name: "TopAppBar",
      role: "The bar. Three sizes, leading slot, title, trailing actions — the screen's header.",
    },
    {
      name: "TopAppBarToggle",
      role: "The sidebar control. Reads `useSidebar()` itself, so the bar and the sidebar stay in sync with no props.",
    },
    {
      name: "AppTopBar",
      role: "The app-level bar with the standard menus already placed — the shell's header, not a blank bar.",
    },
    {
      name: "TopBarMenu",
      role: "One menu from `TopBarMenuItem[]`. The four `*Menu` exports are thin wrappers over this.",
    },
  ],
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
  usage: {
    do: [
      "Name the screen in the title and keep the trailing slot to screen-level actions.",
      "Use `AppTopBar` for the shell header — the standard menus are already placed and wired.",
      "Reach for `TopBarMenu` directly when the menu is custom; wrap it only when the same items repeat.",
    ],
    dont: [
      "Don't invent a fourth size — the three Material 3 heights are the whole axis and the shell lays out against them.",
      "Don't rewire the `*Menu` wrappers per screen — if the items differ, that is a `TopBarMenu` with its own data.",
    ],
  },
  tokens: [
    {
      element: "Bar",
      state: "resting",
      token: "sys.color.surface",
      value: "surface, 1px outline-variant base rule",
    },
    {
      element: "Hover wash",
      state: "hover",
      token: "sys.color.surface-tonal",
      value: "surface-tonal over controls and menu items",
    },
    {
      element: "Menu",
      state: "resting",
      token: "sys.color.surface-container",
      value: "surface-container, medium corners, level2",
    },
  ],
  faq: [
    {
      q: "`TopAppBar` or `AppTopBar`?",
      a: "`AppTopBar` is the shell header with the standard menus placed — reach for it first. `TopAppBar` is the bare bar for screens that need their own composition.",
    },
    {
      q: "Which size?",
      a: "Small is the default screen header; medium carries a two-line title for top-level screens. The sizes change the bar's height, so the shell can lay out against a known number.",
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
