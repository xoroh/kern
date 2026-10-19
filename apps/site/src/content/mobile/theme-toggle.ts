import type { ComponentDoc } from "../types";

export const themeToggle: ComponentDoc = {
  slug: "theme-toggle",
  name: "ThemeToggle",
  oneLiner:
    "One action that requests a theme change, named for where the press goes rather than where it is.",
  features:
    "Reach for a theme toggle when the host owns the color mode and needs one control to flip it. The accessible name always names the destination — “Switch to light” while dark, “Switch to dark” while light — so the action reads the same before and after the press. There is no pressed axis and none latches: the mode lives in the host, not in the control, and the toggle reports the request through `onToggle`. The touch target is `48dp` with a decorative glyph hidden from the tree.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ThemeToggle",
    variants: [],
    // A borderless round action: no container, no resting elevation.
    elevation: 0,
  },
  parts: ["ThemeToggle"],
  customization: {
    supported: [
      "`mode` names the current mode; the label is derived from it, never passed separately.",
      "`onToggle` requests the change; the host applies it and re-renders with the new `mode`.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `pressed` or `selected` state. A latching toggle would claim the mode lives here.",
      "There is no label override. The destination name is the contract.",
    ],
  },
  deviations: [
    {
      id: "K11",
      spec: 'M3\'s component elevation table names no toggle row. It tabulates "menu" and "rich tooltip" at level 2 and "dialogs (modal)" at level 3, but no row describes a toggle resting elevation.',
      kern: "The toggle rests at elevation level 0 — no shadow token; level 0 is shadow: none.",
      why: "A borderless round action has no container to lift — a shadow would invent elevation M3 never assigned. The level-0 claim is registered in the elevation inventory so it is asserted rather than assumed.",
    },
  ],
  api: [
    {
      name: "mode",
      type: '"light" | "dark"',
      note: "The current mode. The accessible name is derived from it.",
    },
    {
      name: "onToggle",
      type: "() => void",
      note: "Requests the theme change. The host owns the mode state.",
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
  aria: [
    "The accessible name always names the destination mode, so the action reads the same before and after the press.",
    "There is no pressed or selected state to announce — the mode lives in the host, and the control reports the request, not the outcome.",
    "The glyph is decorative and hidden from the accessibility tree; the name carries the meaning.",
    "When disabled, the control reports `disabled` in the accessibility state.",
  ],
};
