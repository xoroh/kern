import type { ComponentDoc } from "../types";

export const contrastToggle: ComponentDoc = {
  slug: "contrast-toggle",
  name: "ContrastToggle",
  oneLiner:
    "One action that requests a contrast change, named for where the press goes rather than where it is.",
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
  // The touch contract: one action, named for where it goes, with no latched
  // state to report.
  keyboard: [
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        'Requests the contrast change. The name says where the press goes — "Use high contrast" while the level is standard — and there is no pressed state to announce, because the level lives in the host.',
    },
    {
      key: "Swipe (TalkBack / VoiceOver)",
      action:
        "Reaches the toggle as a `button` on the platform's minimum touch target, named for the destination level rather than for the current one.",
    },
  ],
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
  aria: [
    "The accessible name always names the destination contrast level, so the action reads the same before and after the press.",
    "There is no pressed or selected state to announce — the level lives in the host, and the control reports the request, not the outcome.",
    "The glyph is decorative and hidden from the accessibility tree; the name carries the meaning.",
    "When disabled, the control reports `disabled` in the accessibility state.",
  ],
};
