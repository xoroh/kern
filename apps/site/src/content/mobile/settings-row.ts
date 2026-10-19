import type { ComponentDoc } from "../types";

export const settingsRow: ComponentDoc = {
  slug: "settings-row",
  name: "Settings row",
  oneLiner:
    "Settings rows pair a label and supporting text with the control that owns them.",
  features:
    "Reach for a settings row when a setting needs a label, an explanation, and its control in one scannable line: a toggle with its name, a stepper with its unit, a chevron with its destination. The row itself is not pressable — activation belongs to the trailing control, so the row carries no accessibility role beyond its label. What the web blocks catalog composes from parts, native ships as one row.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // The web blocks catalog ships the same row (`SettingsRow` in the
    // search-bar block family). Documented there.
    nativePeer: "SettingsRow",
    variants: [],
    elevation: "surface",
  },
  parts: ["SettingsRow"],
  usage: {
    do: [
      "Name the setting in `label` and explain it in `supporting` — one line each, truncated, never wrapped into paragraphs.",
      "Own exactly one control in `trailing` — the row names, the control acts.",
      "Keep rows uniform: same `56dp` height and `16dp` insets down the whole screen.",
    ],
    dont: [
      "Don't make the row itself pressable — the press belongs to the trailing control, and a pressable row with a pressable child is two targets wearing one label.",
      "Don't stack two controls in `trailing` — split the row instead.",
    ],
  },
  tokens: [
    {
      element: "Row",
      state: "resting",
      token: "theme.color.surface",
      value: "surface, minHeight 56, 16dp horizontal insets",
    },
  ],
  faq: [
    {
      q: "Settings row or list item?",
      a: "A setting owned by a trailing control means settings row; navigation to another screen means list item. Control in the row, destination out of it.",
    },
  ],
  customization: {
    supported: [
      "`label` is required and becomes the accessible name; `supporting` is the second line.",
      "`trailing` is the control slot — toggle, stepper, chevron, whatever the setting owns.",
      "`accessibilityLabel` renames the row where the label alone would read wrongly.",
      "`style` is a React Native `ViewStyle` merged after the row treatment.",
    ],
    notSupported: [
      "There is no `onPress`. The row is a `summary`, not a control — pressability would steal the trailing control's activation.",
      "There is no leading icon slot. The label carries the row; decoration belongs to the screen, not the setting.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      required: true,
      note: "The setting's name — and the row's accessible name.",
    },
    {
      name: "supporting",
      type: "string",
      note: "One explaining line under the label, truncated to two lines.",
    },
    {
      name: "trailing",
      type: "ReactNode",
      note: "The control the row owns. The row names, the control acts.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Falls back to the label.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "Merged after the row treatment.",
    },
    {
      name: "testID",
      type: "string",
      note: "Test hook for the row.",
    },
  ],
  aria: [
    "Exposed as a `summary` named by the label — grouping semantics, not control semantics.",
    "The trailing control keeps its own role and name; the row never speaks for it.",
  ],
};
