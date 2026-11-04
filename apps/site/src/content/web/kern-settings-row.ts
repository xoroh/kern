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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Enter / Space",
      action:
        "Operates the row's control — Switch, segmented pills, the select trigger, or the whole navigational row — each a real control, so the press is the browser's own.",
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
      type: "ReactNode",
      required: true,
      note: "Row name. Required: the row (and its control) is named by this.",
    },
    {
      name: "supporting",
      type: "ReactNode",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Leading slot: a KernIcon-registry icon. Never raw lucide.",
    },
    {
      name: "control",
      type: '"switch" | "segmented" | "select" | "button" | "custom"',
      note: "Trailing control kind. Default `custom` (the `trailing` slot).",
    },
    {
      name: "checked",
      type: "boolean | undefined",
    },
    {
      name: "defaultChecked",
      type: "boolean | undefined",
    },
    {
      name: "onCheckedChange",
      type: "((checked: boolean) => void) | undefined",
    },
    {
      name: "segmentedOptions",
      type: "readonly SettingsSegmentOption[] | undefined",
    },
    {
      name: "segmentedValue",
      type: "string | undefined",
    },
    {
      name: "defaultSegmentedValue",
      type: "string | undefined",
    },
    {
      name: "onSegmentedChange",
      type: "((value: string) => void) | undefined",
    },
    {
      name: "selectOptions",
      type: "readonly SettingsSelectOption[] | undefined",
    },
    {
      name: "selectValue",
      type: "string | undefined",
    },
    {
      name: "defaultSelectValue",
      type: "string | undefined",
    },
    {
      name: "onSelectChange",
      type: "((value: string) => void) | undefined",
    },
    {
      name: "selectPlaceholder",
      type: "string | undefined",
    },
    {
      name: "href",
      type: "string | undefined",
    },
    {
      name: "onPress",
      type: "(() => void) | undefined",
      note: "Navigational activation (R2 lexicon: DOMAIN action, not state).",
    },
    {
      name: "badge",
      type: "ReactNode",
    },
    {
      name: "trailing",
      type: "ReactNode",
      note: "`custom` control slot (the `start/blocks` `trailing` contract).",
    },
    {
      name: "disabled",
      type: "boolean | undefined",
    },
    {
      name: "className",
      type: "string | undefined",
    },
    {
      name: "testID",
      type: "string | undefined",
    },
  ],
  aria: [
    "`label` is required because it names both the row and its control — an unnamed row is unnamed twice.",
    "Navigational rows activate on the whole row with a chevron and optional badge; every other kind keeps activation on the trailing control, and controls never nest.",
    "`supporting` carries the explanatory line beneath the label.",
  ],
};
