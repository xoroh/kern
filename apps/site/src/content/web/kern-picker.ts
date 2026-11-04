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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Enter / Space",
      action:
        "Picks the focused option — options are real buttons, so the press is the browser's own. Single-select closes on pick; multi-select stays open and reports the array.",
    },
  ],
  customization: {
    supported: [
      "`mode` picks what is being chosen; `variant` picks where it renders — dialog, bottom sheet, or the anchored inline popover.",
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
      type: '"date" | "time" | "date-time" | "country" | "option-list" | "assignee" | "status" | "plan"',
    },
    {
      name: "variant",
      type: '"dialog" | "bottom-sheet" | "inline-popover"',
    },
    {
      name: "open",
      type: "boolean | undefined",
    },
    {
      name: "defaultOpen",
      type: "boolean | undefined",
    },
    {
      name: "onOpenChange",
      type: "((open: boolean) => void) | undefined",
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: "Accessible name for the surface + default trigger label.",
    },
    {
      name: "placeholder",
      type: "string | undefined",
    },
    {
      name: "options",
      type: "readonly PickerOption[] | undefined",
      note: "Option modes (`option-list` / `assignee` / `status` / `plan` fallback).",
    },
    {
      name: "value",
      type: "string | string[] | undefined",
    },
    {
      name: "defaultValue",
      type: "string | string[] | undefined",
    },
    {
      name: "onSelect",
      type: "((value: string) => void) | undefined",
      note: "Single-select pick (also closes the surface: select-then-dismiss).",
    },
    {
      name: "onMultiSelect",
      type: "((values: string[]) => void) | undefined",
      note: "Multi-select report (`multiple`). The surface stays open.",
    },
    {
      name: "multiple",
      type: "boolean | undefined",
    },
    {
      name: "dateValue",
      type: "Date | undefined",
    },
    {
      name: "defaultDateValue",
      type: "Date | undefined",
    },
    {
      name: "onDateChange",
      type: "((date: Date) => void) | undefined",
    },
    {
      name: "minDate",
      type: "Date | undefined",
    },
    {
      name: "maxDate",
      type: "Date | undefined",
    },
    {
      name: "timeValue",
      type: "TimePickerValue | undefined",
    },
    {
      name: "defaultTimeValue",
      type: "TimePickerValue | undefined",
    },
    {
      name: "onTimeChange",
      type: "((value: TimePickerValue) => void) | undefined",
    },
    {
      name: "timeFormat",
      type: "TimePickerFormat | undefined",
    },
    {
      name: "timeStep",
      type: "number | undefined",
    },
    {
      name: "countries",
      type: "readonly CountryOption[] | undefined",
    },
    {
      name: "countryCode",
      type: "string | undefined",
    },
    {
      name: "defaultCountryCode",
      type: "string | undefined",
    },
    {
      name: "onCountryChange",
      type: "((country: CountryOption | null) => void) | undefined",
    },
    {
      name: "catalog",
      type: "readonly ServiceCatalogEntry[] | undefined",
      note: "`plan` mode primary input (preferred over `options`).",
    },
    {
      name: "reasons",
      type: "ReasonDataAdapter | undefined",
      note: "Reason mode input (used by `ReasonPicker`).",
    },
    {
      name: "trigger",
      type: "ReactElement<unknown, string | JSXElementConstructor<any>> | undefined",
      note: "Trigger slot: the element rendered AS the trigger (Base UI `render` model — typically a `<button>`). Default: a button showing the current selection or the placeholder.",
    },
    {
      name: "panel",
      type: "ReactNode",
      note: "Panel override. Default: the per-mode panel below.",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Footer-actions slot: Cancel/Apply.",
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
    "The option list is a listbox and each option reports selected state; multi-select marks the listbox multiselectable.",
    "Each option is named by its label alone — the supporting line stays visible text but hidden from the accessible name, so option queries stay exact.",
    "`label` names the picker and doubles as the trigger text through `placeholder`.",
  ],
};
