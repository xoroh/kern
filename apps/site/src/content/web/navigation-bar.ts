import type { ComponentDoc } from "../types";

export const navigationBar: ComponentDoc = {
  slug: "navigation-bar",
  name: "Navigation bar",
  oneLiner:
    "The navigation bar is the compact-screen destination switcher that sits along the bottom edge.",
  features:
    "Reach for a navigation bar when a small-screen app has three to five top-level places and people move between them constantly. It stays put while content scrolls, so the way out of a screen is always under a thumb. M3 caps it at five destinations — past that, the targets stop being tappable and the bar becomes a drawer. It shares one destination list with the navigation rail and the navigation drawer, so you declare your places once and every surface renders them. This component owns its own selection and keyboard behaviour rather than delegating to a primitive.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/navigation-bar",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "NavigationBar",
    // No variant axis. The bar is one treatment; emphasis comes from which
    // destination is active.
    variants: [],
    // M3's row "navigation bar" rests at level 2, and the bar ships
    // `--md-sys-elevation-level2` to match.
    elevation: 2,
  },
  parts: ["NavigationBar", "NavigationBarItem"],
  anatomy: [
    {
      name: "NavigationBar",
      role: "The bar. Owns selection, keyboard traversal and the navigation landmark.",
    },
    {
      name: "NavigationBarItem",
      role: "One destination: icon, label and optional badge. Declared as data rather than as markup.",
    },
  ],
  customization: {
    supported: [
      "`className` on the bar, merged after its own classes.",
      "The active indicator is a `secondaryContainer` pill bound to `data-active`, so the look follows state rather than React's render.",
      "`floating` is a slot rendered above the bar — in M3 that is where a FAB dock sits, so the bar and the primary action stack without either owning the other.",
    ],
    notSupported: [
      "There is no `variant` or `position` prop. The bar is bottom-anchored and full width; where it sits on the page is the shell's job.",
      "There is no `max` prop on destinations. The cap of five is enforced by the component, because a six-item bar is not a bar — M3 moves that to a drawer.",
      "The height is not a prop. It is fixed at M3's bar height so the bar never reflows when a label wraps or changes.",
    ],
  },
  api: [
    {
      name: "destinations",
      type: "NavigationDestination[]",
      note: "The places, as data: `key`, `label`, optional `icon`, optional `badge`, optional `disabled`. The same shape feeds the rail and the drawer, so a host declares its destinations once.",
    },
    {
      name: "value",
      type: "string",
      note: "Controlled active destination key. Omit for uncontrolled.",
    },
    {
      name: "defaultValue",
      type: "string",
      note: "Initial active key when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(key: string) => void",
      note: "Fires when the active destination changes, with the key rather than an event.",
    },
    {
      name: "label",
      type: "string",
      note: 'The accessible name of the navigation landmark — not a visible caption. This is the `label` of `role="navigation"`, so a page with two navigation regions must name them differently.',
    },
    {
      name: "floating",
      type: "ReactNode",
      note: "Rendered above the bar. In M3 this is the FAB dock.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On a destination: announced as unavailable, skipped by keyboard traversal, and inert to activation.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the bar's own classes.",
    },
  ],
  aria: [
    "The bar is a `navigation` landmark with the accessible name `label` gives it, so it is reachable from a screen reader's landmark list.",
    'The active destination carries `aria-current="page"` — the web half of a contract the native renderer honours differently, with the tab role plus a selected state. That asymmetry is recorded in the parity contract.',
    "Keyboard traversal is a roving tabindex: Left/Right and Up/Down move between destinations, Home/End jump to the ends, and focus moves the selection with it.",
    "Traversal skips disabled destinations rather than parking on them, so a disabled item is not a dead end in the tab order.",
  ],
};
