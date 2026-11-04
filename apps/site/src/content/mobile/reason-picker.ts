import type { ComponentDoc } from "../types";

export const reasonPicker: ComponentDoc = {
  slug: "reason-picker",
  name: "Reason picker",
  oneLiner:
    "Reason picker is the generic reason selector over an injected data adapter.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ReasonPicker",
    variants: ["variant: dialog · bottom-sheet · inline-popover"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ReasonPicker"],
  keyboard: [
    {
      key: "Press",
      action:
        "Opens from the labelled trigger and picks the focused reason — the rows are the picker's option pressables.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the reasons; each announces its label with checked state, and double-tap picks it.",
    },
  ],
  customization: {
    supported: [
      "`reasons` is the required `ReasonDataAdapter` — reason rows plus context — so one picker serves cancellation, decline and every other reason context.",
      "`multiple` with `onMultiSelect` collects several reasons; single-select closes on pick.",
      "Every other prop is the picker contract: modes of date, plan and country stay available around the fixed option-list core.",
    ],
    notSupported: [
      "There is no local reasons copy. The picker owns no reasons in any context — only the injected rows render, which is asserted in test.",
      "There is no `mode` prop. Reason picking is option-list semantics; the mode is fixed, not hidden.",
    ],
  },
  api: [
    {
      name: "reasons",
      type: "ReasonDataAdapter",
      required: true,
      note: "Reason rows plus context. Required: the picker owns no local reasons copy — only the injected rows render.",
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
    "Reasons render through the picker option contract with checked state, named by label alone.",
    "Rows derive from the injected adapter on every render, so the announced set is always the current context's set.",
    "`label` names the picker for assistive technology.",
  ],
};
