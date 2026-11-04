import type { ComponentDoc } from "../types";

export const kernSettingsRow: ComponentDoc = {
  slug: "kern-settings-row",
  name: "Kern settings row",
  oneLiner:
    "Kern settings row is the one row contract pairing a label with a single control.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "KernSettingsRow",
    variants: ["control: switch · segmented · select · button · custom"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernSettingsRow"],
  keyboard: [
    {
      key: "Press",
      action:
        "Operates the row's control — switch, segmented pills, the select trigger opening its sheet, or the whole navigational row — each a labelled pressable.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Reads the row's label with its supporting line first, then the control with its state.",
    },
  ],
  customization: {
    supported: [
      "`control` picks the one trailing control: `switch`, `segmented`, `select`, `button`, or `custom` with a host-owned `trailing` slot.",
      "Each control kind carries its own state trio — checked, segmented value, select value — controlled or uncontrolled.",
      "`icon` takes a KernIcon-registry node; `badge` marks button rows.",
    ],
    notSupported: [
      "There is never more than one control per row. A second control is a second row.",
      "There is no `href` on non-button rows. Navigation is the button kind's job — switch, segmented, select and custom rows never navigate.",
      "There is no row-level `value`. Selection state lives on the control kind that owns it.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      required: true,
    },
    {
      name: "supporting",
      type: "string",
    },
    {
      name: "control",
      type: "SettingsControlKind",
    },
    {
      name: "checked",
      type: "boolean",
    },
    {
      name: "defaultChecked",
      type: "boolean",
    },
    {
      name: "onCheckedChange",
      type: "(checked: boolean) => void",
    },
    {
      name: "segmentedOptions",
      type: "readonly SettingsSegmentOption[]",
    },
    {
      name: "segmentedValue",
      type: "string",
    },
    {
      name: "defaultSegmentedValue",
      type: "string",
    },
    {
      name: "onSegmentedChange",
      type: "(value: string) => void",
    },
    {
      name: "selectOptions",
      type: "readonly SettingsSelectOption[]",
    },
    {
      name: "selectValue",
      type: "string",
    },
    {
      name: "defaultSelectValue",
      type: "string",
    },
    {
      name: "onSelectChange",
      type: "(value: string) => void",
    },
    {
      name: "selectPlaceholder",
      type: "string",
    },
    {
      name: "onPress",
      type: "() => void",
      note: "Navigational activation (DOMAIN action, not state).",
    },
    {
      name: "badge",
      type: "ReactNode",
    },
    {
      name: "trailing",
      type: "ReactNode",
      note: "`custom` control slot.",
    },
    {
      name: "disabled",
      type: "boolean",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "`label` is required because it names both the row and its control — an unnamed row is unnamed twice.",
    "Segmented rows announce as a radiogroup of labelled options; select rows own a trigger driving the controlled sheet.",
    "Navigational rows activate on the whole row with chevron and optional badge; every other kind keeps activation on the trailing control, and controls never nest.",
  ],
};
