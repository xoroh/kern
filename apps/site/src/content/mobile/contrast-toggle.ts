import type { ComponentDoc } from "../types";

export const contrastToggle: ComponentDoc = {
  slug: "contrast-toggle",
  name: "ContrastToggle",
  oneLiner:
    "One action that requests a contrast change, named for where the press goes rather than where it is.",
  features:
    "Reach for a contrast toggle when the host owns the contrast level and needs one control to flip it. The accessible name always names the destination — “Use high contrast” while standard — so the action reads the same before and after the press. There is no pressed axis and none latches: the level lives in the host, not in the control, and the toggle reports the request through `onToggle`. The touch target is `48dp` with a decorative “Aa” glyph hidden from the tree.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ContrastToggle",
    variants: [],
    // A borderless round action: no container, no resting elevation.
    elevation: 0,
  },
  parts: ["ContrastToggle"],
  customization: {
    supported: [
      "`contrast` names the current level; the label is derived from it, never passed separately.",
      "`onToggle` requests the change; the host applies it and re-renders with the new level.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `pressed` or `selected` state. A latching toggle would claim the level lives here.",
      "There is no label override. The destination name is the contract.",
    ],
  },
  api: [
    {
      name: "contrast",
      type: '"standard" | "high"',
      note: "The current level. The accessible name is derived from it.",
    },
    {
      name: "onToggle",
      type: "() => void",
      note: "Requests the contrast change. The host owns the level state.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Blocks interaction and reports `disabled` in the accessibility state.",
    },
    {
      name: "style",
      type: "ViewStyle",
      note: "Layout for the `48dp` target.",
    },
  ],
};
