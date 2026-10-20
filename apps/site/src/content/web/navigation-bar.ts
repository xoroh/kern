import type { ComponentDoc } from "../types";

export const navigationBar: ComponentDoc = {
  slug: "navigation-bar",
  name: "Navigation bar",
  oneLiner:
    "The navigation bar is the compact-screen destination switcher that sits along the bottom edge.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/navigation-bar",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "NavigationBar",
    // No variant axis. The bar is one treatment; emphasis comes from which
    // destination is active.
    variants: [],
    // M3's row "navigation bar" rests at level 2, and the bar ships
    // `--sys-elevation-level2` to match.
    elevation: 2,
  },
  parts: ["NavigationBar", "NavigationBarItem"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "hover"],
  keyboard: [
    {
      key: "Arrow keys",
      action:
        "Moves selection and focus between destinations, skipping disabled ones. Selection follows focus.",
    },
    {
      key: "Home / End",
      action: "Jumps to the first or last enabled destination.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "The bar is one tab stop (roving tabindex on the active destination).",
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
      for: ["NavigationBar"],
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
      for: ["NavigationBar"],
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
      for: ["NavigationBar"],
      type: "ReactNode",
      note: "Rendered above the bar. In M3 this is the FAB dock.",
    },
    {
      name: "disabled",
      for: ["NavigationBarItem"],
      type: "boolean",
      note: "On a destination: announced as unavailable, skipped by keyboard traversal, and inert to activation.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the bar's own classes.",
    },
    {
      name: "testID",
      for: ["NavigationBar"],
      type: "string | undefined",
      note: "Test selector, rendered as `data-testid` on the bar. Opt-in only — no default.",
    },
    {
      name: "selected",
      for: ["NavigationBarItem"],
      type: "boolean | undefined",
      note: "Whether this destination is the current one. Drives the active indicator.",
    },
    {
      name: "icon",
      for: ["NavigationBarItem"],
      type: "ReactNode",
      note: "The destination glyph. Required.",
    },
    {
      name: "badge",
      for: ["NavigationBarItem"],
      type: "ReactNode",
      note: "Count or dot badge on the icon.",
    },
    {
      name: "onSelect",
      for: ["NavigationBarItem"],
      type: "(() => void) | undefined",
      note: "Fires when the destination is chosen.",
    },
  ],
  aria: [
    "The bar is a `navigation` landmark with the accessible name `label` gives it, so it is reachable from a screen reader's landmark list.",
    'The active destination carries `aria-current="page"` — the web half of a contract the native renderer honours differently, with the tab role plus a selected state. That asymmetry is recorded in the parity contract.',
    "Keyboard traversal is a roving tabindex: Left/Right and Up/Down move between destinations, Home/End jump to the ends, and focus moves the selection with it.",
    "Traversal skips disabled destinations rather than parking on them, so a disabled item is not a dead end in the tab order.",
  ],
};
