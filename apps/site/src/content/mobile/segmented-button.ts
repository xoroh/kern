import type { ComponentDoc } from "../types";

export const segmentedButton: ComponentDoc = {
  slug: "segmented-button",
  name: "Segmented button",
  oneLiner:
    "Segmented buttons are a joined row of choices where the selection is shown by a check, not a fill.",
  features:
    "Reach for a segmented button when the choices are few, mutually visible and worth showing together: a view mode, a range, a filter of two or three. Material 3's rule is the one to understand — the selection is carried by a CHECK on the selected segment, not by a separate fill. The row reads as one control rather than as several buttons, which is what distinguishes it from a row of toggles. `variants` here means SELECTION BEHAVIOUR — single versus multiple — matching Material 3, so the same row can be a one-of-many or a any-of-many without changing shape.",
  meta: {
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
  customization: {
    supported: [
      "`options` are data — `value`, `label`, optional `icon`, optional `disabled`.",
      "Selection behaviour is single or multiple, matching Material 3's use of the word.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no fill-style selection. Material 3 carries the selection on a CHECK, and there is no variant that replaces it.",
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
