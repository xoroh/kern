import type { ComponentDoc } from "../types";

export const settingsRow: ComponentDoc = {
  slug: "settings-row",
  name: "Settings row",
  oneLiner:
    "Settings rows pair a label and supporting text with the control that owns them.",
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
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // M2: the row is a `summary`, not a control — it has no `onPress` by
  // design, because pressability would steal the trailing control's
  // activation. It takes no focus and answers no key; the control in the
  // trailing slot is what the screen reader reaches.
  nonInteractive: true,
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
