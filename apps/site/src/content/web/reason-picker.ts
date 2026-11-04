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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Enter / Space",
      action:
        "Picks the focused reason — the rows are the picker option buttons, so the press is the browser's own.",
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
      name: "className",
      type: "string | undefined",
    },
    {
      name: "defaultValue",
      type: "string | string[] | undefined",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Footer-actions slot: Cancel/Apply.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: "Accessible name for the surface + default trigger label.",
    },
    {
      name: "onSelect",
      type: "((value: string) => void) | undefined",
      note: "Single-select pick (also closes the surface: select-then-dismiss).",
    },
    {
      name: "value",
      type: "string | string[] | undefined",
    },
    {
      name: "onOpenChange",
      type: "((open: boolean) => void) | undefined",
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
      name: "multiple",
      type: "boolean | undefined",
    },
    {
      name: "placeholder",
      type: "string | undefined",
    },
    {
      name: "variant",
      type: '"dialog" | "bottom-sheet" | "inline-popover"',
    },
    {
      name: "testID",
      type: "string | undefined",
    },
    {
      name: "options",
      type: "readonly PickerOption[] | undefined",
      note: "Option modes (`option-list` / `assignee` / `status` / `plan` fallback).",
    },
    {
      name: "onMultiSelect",
      type: "((values: string[]) => void) | undefined",
      note: "Multi-select report (`multiple`). The surface stays open.",
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
      name: "reasons",
      type: "ReasonDataAdapter",
      required: true,
      note: "Injected reasons (QUEUE-145 system). Required: no local copy exists.",
    },
  ],
  aria: [
    "Reasons render through the picker option contract: a listbox of options with selected state, named by label alone.",
    "Rows derive from the injected adapter on every render, so the announced set is always the current context's set.",
    "`label` names the picker for assistive technology.",
  ],
};
