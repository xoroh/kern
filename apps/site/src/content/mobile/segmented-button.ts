import type { ComponentDoc } from "../types";

export const segmentedButton: ComponentDoc = {
  slug: "segmented-button",
  name: "Segmented button",
  oneLiner:
    "Segmented buttons are a joined row of choices where the selection is shown by a check, not a fill.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "SegmentedButton",
    variants: ["selection: single · multiple"],
    // Material 3 places `segmented button` at resting level 0, and level 0 is
    // `shadow: none` — which is what a joined row renders.
    elevation: 0,
  },
  parts: ["SegmentedButton"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "selected", "disabled"],
  keyboard: [
    {
      key: "Enter / Space via external keyboard",
      action:
        "Activates the focused segment — selects in single mode, toggles in multiple mode.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The group reads as a radio group (single) or checkboxes (multiple); each segment announces its label and selected state; double-tap chooses.",
    },
    {
      key: "Swipe over a disabled segment (TalkBack / VoiceOver)",
      action:
        "A disabled segment reports itself as unavailable and cannot be chosen — it stays in the row, so the set still reads as the full range of options.",
    },
  ],
  customization: {
    supported: [
      "`options` are data — `value`, `label`, optional `icon`, optional `disabled`.",
      "Selection behaviour is single or multiple, matching Material 3's use of the word.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no fill-style selection. Material 3 carries the selection on a CHECK, and there is no variant that replaces it.",
      "New designs should prefer the expressive `ButtonGroup` (`connected`) — M3 no longer recommends the segmented button and points at the connected button group instead. This component stays for the classic treatment.",
      "There is no `orientation`. It is a joined horizontal row.",
      "There is no overflow or wrapping. Three or four segments is the useful maximum; more wants `Tabs` or a `Select`.",
    ],
  },
  api: [
    {
      name: "options",
      type: "SegmentedButtonOption[]",
      note: "`{ value, label, icon?, disabled? }`. The row is data, so the segments are a declaration.",
    },
    {
      name: "variants",
      type: "single | multiple",
      note: "SELECTION BEHAVIOUR, not looks — matching Material 3's use of the word. The same row is one-of-many or any-of-many without changing shape.",
    },
    {
      name: "value / onValueChange",
      type: "string | string[]",
      note: "The selection, in the shape the behaviour implies.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "The selection is a CHECK on the chosen segment, which means it does not depend on a fill colour to be legible.",
    "Each segment is a real pressable with a `label`, so the row is a set of named choices and not a row of shapes.",
    "It reads as ONE control with several options — which is the difference from a row of `Toggle`s, and worth keeping straight because they look alike.",
  ],
};
