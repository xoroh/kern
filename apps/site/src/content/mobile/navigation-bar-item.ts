import type { ComponentDoc } from "../types";

export const navigationBarItem: ComponentDoc = {
  slug: "navigation-bar-item",
  name: "Navigation bar item",
  oneLiner:
    "Navigation bar items are one destination row for vertical containers — a drawer, a rail or a sidebar list.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "NavigationBarItem",
    variants: [],
    // No row in kern's elevation table: this is a list row, and nothing in the
    // system assigns it a resting level. Nothing is asserted either way.
    elevation: "surface",
  },
  parts: ["NavigationBarItem"],
  // The touch contract: one row of a vertical list, and a real pressable.
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves between the rows in the container; double-tap presses the focused row. The row is a `button` pressable named by its label, and the selected one announces as selected.",
    },
  ],
  customization: {
    supported: [
      "`label` is required, and `icon`/`badge` are slots.",
      "`selected` draws the Material 3 active indicator — the `secondaryContainer` pill behind the icon.",
      "`style` is a React Native `ViewStyle`, and the row is `Pressable`-based so `PressableProps` are available.",
    ],
    notSupported: [
      "There is no `orientation` prop. It is a vertical list row by construction; the horizontal container is `NavigationBar`.",
      "There is no `destinations` prop. It is one row — the list is the caller's.",
      "There is no `elevation` prop. A list row carries no resting level in kern's table, so nothing is asserted here.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "REQUIRED. The destination's name — what makes the row readable and announced.",
    },
    {
      name: "selected",
      type: "boolean",
      note: "Draws the Material 3 active indicator, a `secondaryContainer` pill behind the icon.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "The destination's glyph — from `@xoroh/kern-icons` or any React Native view.",
    },
    {
      name: "badge",
      type: "ReactNode",
      note: "A slot for a count or status marker beside the icon.",
    },
    {
      name: "onPress",
      type: "PressableProps['onPress']",
      note: "The row's own handler. Unlike `NavigationBar`, which reports a `value`/`onValueChange` pair for a selection model, this is a single row and simply fires.",
    },
    {
      name: "style",
      type: "PressableProps['style']",
      note: "React Native styles, and because the row is `Pressable`-based the usual `PressableProps` are available too.",
    },
  ],
  aria: [
    "`label` is required and is the row's name; the row is a real pressable.",
    "The active indicator is a shape and a tone, so selection does not depend on colour alone.",
    "It carries no resting elevation, so there is no separation claimed between it and its neighbours — the container provides that.",
  ],
};
