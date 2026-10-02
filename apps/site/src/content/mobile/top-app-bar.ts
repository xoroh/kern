import type { ComponentDoc } from "../types";

export const topAppBar: ComponentDoc = {
  slug: "top-app-bar",
  name: "Top app bar",
  oneLiner:
    "Top app bars name the screen and hold the actions that belong to it, along its top edge.",
  features:
    "Reach for a top app bar on a native screen that has a title and one or two screen-level actions. It is the screen's header: where you are, and the things you can do from here. The size axis is the point — a small bar for most screens, a medium one when the title should carry weight. Keep the leading slot to one thing, usually back or menu, and the trailing slot to the actions that genuinely belong to the screen rather than to the app. If the screen has no actions and no need to say where you are, the bar is taking space for nothing.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Single-renderer by design: this is the compact-screen app bar. The web
    // counterpart of the pattern is `@xoroh/kern/start`'s `TopAppBar`
    // composition, not a component in `@xoroh/kern`, so there is no export to
    // name here.
    nativePeer: "none",
    variants: ["size: small · center · medium"],
    elevation: "surface",
  },
  parts: ["TopAppBar", "TopAppBarAction"],
  anatomy: [
    {
      name: "TopAppBar",
      role: "The bar. Holds the title and the two slots, and fixes the screen's header height per size.",
    },
    {
      name: "TopAppBarAction",
      role: "A 48dp icon action for the leading or trailing slot. Its `label` is required — it is the action's name, not optional decoration.",
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
      note: "The left slot — a menu or back affordance. It must be a 48dp touch target, never a bare glyph.",
    },
    {
      name: "trailing",
      type: "ReactNode",
      note: "The right-aligned overflow actions. `TopAppBarAction` is the 48dp control made for this slot.",
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
  ],
  aria: [
    "The bar is the screen's header, so its title is what a screen reader announces as the screen's name.",
    "`TopAppBarAction` requires a `label`, which becomes the action's accessible name — the same trap as an icon-only button on web, and closed the same way.",
    "The leading slot is a 48dp touch target rather than a bare glyph, so the back or menu affordance is reachable by thumb.",
    "This is the native renderer's surface: `style` is a React Native `ViewStyle`, not a web `className`.",
  ],
};
