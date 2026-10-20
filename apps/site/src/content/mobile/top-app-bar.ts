import type { ComponentDoc } from "../types";

export const topAppBar: ComponentDoc = {
  slug: "top-app-bar",
  name: "Top app bar",
  oneLiner:
    "Top app bars name the screen and hold the actions that belong to it, along its top edge.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Same family as the web shell composition (`@xoroh/kern/start`
    // `TopAppBar`) — the other tab of this page, not a separate page.
    nativePeer: "TopAppBar",
    variants: ["size: small · center · medium"],
    elevation: "surface",
  },
  parts: ["TopAppBar", "TopAppBarAction", "TopAppBarToggle"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The title announces the screen; each action reads as a button with its required label and double-tap runs it.",
    },
    {
      key: "Swipe over a disabled action (TalkBack / VoiceOver)",
      action:
        "A disabled action reports itself as unavailable and cannot be run — the bar never presents a dead control as a live one.",
    },
  ],
  customization: {
    supported: [
      "`size` picks one of three fixed heights — small and center are the same height with different title alignment, medium is taller for a title that should carry weight.",
      "`leading` and `trailing` are slots, so the back affordance and the overflow actions are the caller's to supply.",
      "`supporting` adds a second line under the title.",
    ],
    notSupported: [
      "There is no `variant` or `color` prop. The bar is the surface, and emphasis comes from `size`.",
      "There is no `position` prop. The bar is the screen's top edge; where the screen sits is the navigator's.",
      "The heights are not a prop. They are `TOP_APP_BAR_HEIGHTS`, so a bar is exactly one of three heights and the screen can lay out against a known number.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      note: "The screen's name. Required — a bar with no title is space taken for nothing.",
    },
    {
      name: "size",
      type: '"small" | "center" | "medium"',
      default: '"small"',
      note: "Three fixed heights: `small` and `center` are both 64, differing in title alignment; `medium` is 112 for a title that should carry weight. The heights are exported as `TOP_APP_BAR_HEIGHTS` so a screen can lay out against them.",
    },
    {
      name: "leading",
      type: "ReactNode",
      note: "The left slot — a menu or back affordance. It must be a full touch target per Material 3, never a bare glyph.",
    },
    {
      name: "trailing",
      type: "ReactNode",
      note: "The right-aligned overflow actions. `TopAppBarAction` is the touch-target-sized control made for this slot.",
    },
    {
      name: "supporting",
      type: "string",
      note: "A second line under the title.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles for the bar, rather than a web `className` — this is the native renderer's surface.",
    },
    {
      name: "label",
      type: "string",
      note: "On `TopAppBarAction`: the action's name. Required — an icon action with no label is a glyph a screen reader cannot use.",
    },
    {
      name: "onPress",
      type: "() => void",
      note: "On `TopAppBarAction`: what it does.",
    },
    {
      name: "open",
      type: "boolean",
      required: true,
      note: "On `TopAppBarToggle`: whether the rail or drawer is open. The accessible name follows it (`Open navigation` while closed).",
    },
    {
      name: "onToggle",
      type: "() => void",
      note: "On `TopAppBarToggle`: flips the shell open state. `expanded` mirrors `open` for screen readers.",
    },
  ],
  aria: [
    "The bar is the screen's header, so its title is what a screen reader announces as the screen's name.",
    "`TopAppBarAction` requires a `label`, which becomes the action's accessible name — the same trap as an icon-only button on web, and closed the same way.",
    "The leading slot is a full touch target rather than a bare glyph, so the back or menu affordance is reachable by thumb.",
    "This is the native renderer's surface: `style` is a React Native `ViewStyle`, not a web `className`.",
  ],
};
