import type { ComponentDoc } from "../types";

export const kernPicker: ComponentDoc = {
  slug: "kern-picker",
  name: "Kern picker",
  oneLiner:
    "Kern picker unifies sheets, dialogs and selects behind modes with per-mode panels.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "KernPicker",
    variants: [
      "mode: date · time · date-time · country · option-list · assignee · status · plan",
      "variant: dialog · bottom-sheet · inline-popover",
    ],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernPicker"],
  keyboard: [
    {
      key: "Press",
      action:
        "Opens from the labelled trigger and picks the focused option — single-select closes on pick, multi-select stays open and reports the array.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the options; each announces its label with checked state, and double-tap picks it.",
    },
  ],
  customization: {
    supported: [
      "`mode` picks what is being chosen; `variant` picks where it renders — centred dialog, bottom sheet, or the inline non-modal list.",
      "`trigger`, `panel` and `footer` slot the opener, the per-mode body and the footer actions.",
      "`catalog` feeds `plan` mode through the service-catalog adapter and is preferred over raw `options` there.",
      "`countries` are consumer-supplied — Kern ships no country dataset.",
    ],
    notSupported: [
      "There is no shipped country list. `country` mode takes `countries` options with dial-code supporting lines.",
      "There is no calendar range or docked-modal form. The calendar stays single-date; range lands via the WP6 addendum.",
      "`select`, `combobox` and `autocomplete` stay the entry primitives — the picker composes them per mode rather than replacing closed-list, filter-as-you-type or free-text usage.",
    ],
  },
  api: [
    {
      name: "mode",
      type: "KernPickerMode",
    },
    {
      name: "variant",
      type: "KernPickerVariant",
    },
    {
      name: "open",
      type: "boolean",
    },
    {
      name: "defaultOpen",
      type: "boolean",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: "Accessible name + default trigger label.",
    },
    {
      name: "placeholder",
      type: "string",
    },
    {
      name: "options",
      type: "readonly PickerOption[]",
    },
    {
      name: "value",
      type: "string | string[]",
    },
    {
      name: "defaultValue",
      type: "string | string[]",
    },
    {
      name: "onSelect",
      type: "(value: string) => void",
    },
    {
      name: "onMultiSelect",
      type: "(values: string[]) => void",
    },
    {
      name: "multiple",
      type: "boolean",
    },
    {
      name: "dateValue",
      type: "Date",
    },
    {
      name: "defaultDateValue",
      type: "Date",
    },
    {
      name: "onDateChange",
      type: "(date: Date) => void",
    },
    {
      name: "minDate",
      type: "Date",
    },
    {
      name: "maxDate",
      type: "Date",
    },
    {
      name: "timeValue",
      type: "TimePickerValue",
    },
    {
      name: "defaultTimeValue",
      type: "TimePickerValue",
    },
    {
      name: "onTimeChange",
      type: "(value: TimePickerValue) => void",
    },
    {
      name: "timeFormat",
      type: "TimePickerFormat",
    },
    {
      name: "timeStep",
      type: "number",
    },
    {
      name: "countries",
      type: "readonly NativeCountryOption[]",
    },
    {
      name: "countryCode",
      type: "string",
    },
    {
      name: "defaultCountryCode",
      type: "string",
    },
    {
      name: "onCountryChange",
      type: "(country: NativeCountryOption | null) => void",
    },
    {
      name: "catalog",
      type: "readonly ServiceCatalogEntry[]",
    },
    {
      name: "reasons",
      type: "ReasonDataAdapter",
    },
    {
      name: "trigger",
      type: "ReactNode",
      note: "Trigger content. Default: a `48dp` row showing selection/placeholder.",
    },
    {
      name: "triggerLabel",
      type: "string",
    },
    {
      name: "panel",
      type: "ReactNode",
      note: "Panel override.",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Footer-actions slot (dialog/sheet variants).",
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
    "The option set announces as a checkbox group or radiogroup with the picker's label, and each option reports its checked state.",
    "Each option is named by its label alone — supporting detail stays visible but out of the accessible name.",
    "`label` names the picker and doubles as the trigger text through `placeholder`.",
  ],
};
