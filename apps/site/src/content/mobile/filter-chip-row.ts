import type { ComponentDoc } from "../types";

export const filterChipRow: ComponentDoc = {
  slug: "filter-chip-row",
  name: "Filter chip row",
  oneLiner:
    "Filter chip rows collect multiple filter choices and report the whole set.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only composition of chips. Web composes filters from its own
    // `Chip`; there is no single web export to name.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["FilterChipRow"],
  // The contract, read off the component: the row is a horizontal scroll of
  // chips, and every chip is a real pressable.
  keyboard: [
    {
      key: "Enter / Space via external keyboard",
      action:
        "Activates the focused chip, which toggles it. The selection is a SET, so a second press removes the filter again rather than being ignored.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves along the row; double-tap a chip to apply the filter and double-tap it again to remove it. Every chip is a pressable with its own label, so the active set is readable chip by chip.",
    },
  ],
  customization: {
    supported: [
      "`options` are data — `value` and `label`.",
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled, and the value is the whole selected set.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no single-select mode. It is `string[]` — many-of-many by construction.",
      "There is no `max` or selection limit.",
      "There is no per-chip icon or avatar. Each chip is its label.",
    ],
  },
  api: [
    {
      name: "options",
      type: "{ value: string; label: string }[]",
      note: "The filters, as data.",
    },
    {
      name: "value / defaultValue",
      type: "string[]",
      note: "The whole selected SET — many-of-many by construction. This is the difference from `SegmentedButton`'s single mode and `Select`'s one value.",
    },
    {
      name: "onValueChange",
      type: "(value: string[]) => void",
      note: "Reports the complete next set rather than a single change.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "Each chip is a real pressable with a `label`, so the active set is readable chip by chip rather than as one summary.",
    "The selection is a set, so each chip reports its own on/off state — which is what makes the active filters legible without opening anything.",
    "Keeping every choice visible is the reason to use chips rather than a dropdown: a filter you cannot see is a filter you forget you set.",
  ],
};
