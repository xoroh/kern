import type { ComponentDoc } from "../types";

export const themeToggle: ComponentDoc = {
  slug: "theme-toggle",
  name: "ThemeToggle",
  oneLiner:
    "One action that requests a theme change, named for where the press goes rather than where it is.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ThemeToggle",
    variants: [],
    // A borderless round action: no container, no resting elevation.
    elevation: 0,
  },
  parts: ["ThemeToggle"],
  // The contract, read off the component: one pressable, named for the
  // destination, with the glyph hidden from the tree.
  keyboard: [
    {
      key: "Enter / Space via external keyboard",
      action:
        "Activates the toggle when focused — the pressable owns the activation, and the button is named for where the press GOES.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves to the toggle; double-tap requests the change. The glyph is decorative and hidden from the tree, so the name is the whole announcement, and a disabled toggle reports itself as disabled.",
    },
  ],
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
