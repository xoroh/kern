import type { ComponentDoc } from "../types";

export const combobox: ComponentDoc = {
  slug: "combobox",
  name: "Combobox",
  oneLiner:
    "Comboboxes pick one value from a set, either from the list or by typing to narrow it.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // The same component as web `Combobox` — type-to-filter single choice
    // with the popup list. Documented there.
    nativePeer: "Combobox",
    variants: [],
    // kern's own decision, shared with web. M3's component elevation table
    // names no combobox; the popup floats above the page. See Deviations.
    elevation: 2,
  },
  parts: ["Combobox"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "selected"],
  // The contract, read off the component: the trigger is a button that
  // reports its expanded state, the popup is a modal with a real filter
  // field in it, and the options are pressables carrying their selected
  // state.
  keyboard: [
    {
      key: "Type in the filter field",
      action:
        "Narrows the list as you type. The field is a real text input inside the popup, and it reports how many options are available.",
    },
    {
      key: "Hardware back (Android)",
      action:
        "Closes the popup and discards the query. The modal's request-close is wired to the same dismiss path as the scrim.",
    },
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Chooses an option. Each one is a pressable carrying the `option` role and its selected state, and choosing it closes the popup.",
    },
  ],
  customization: {
    supported: [
      "`options` are data — `{ value, label }[]` — so the set is one declaration.",
      "`open`/`defaultOpen`/`onOpenChange` make the popup controlled or uncontrolled.",
      "`filter` replaces the default case-insensitive substring match; `emptyMessage` covers the no-match case.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no multipart API. Web's `Root`/`Input`/`Item` composition has no native counterpart — one flat component carries the whole contract.",
      "There is no anchor-relative placement in v1. The popup centres on all screens.",
    ],
  },
  api: [
    {
      name: "options",
      type: "NativeComboboxOption[]",
      required: true,
      note: "The set: `{ value, label }[]`. The trigger shows the chosen label; the popup shows the list.",
    },
    {
      name: "value",
      type: "string",
      note: "Controlled selection. Omit it and the component holds its own from `defaultValue`.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      note: "Fires with the committed value. `onSelect` fires alongside with the full option.",
    },
    {
      name: "open",
      type: "boolean",
      note: "Controlled popup visibility, passed through to the Popover. Omit for uncontrolled with `defaultOpen`.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "State report — fires on every open and dismiss path.",
    },
    {
      name: "filter",
      type: "(option, query) => boolean",
      note: "Default is a case-insensitive substring match over the label. Replace it for server-side or fuzzy matching.",
    },
    {
      name: "placeholder",
      type: "string",
      note: "Shown in the trigger before anything is chosen.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Dims the trigger and blocks opening.",
    },
    {
      name: "testID",
      type: "string",
      note: "Test hook for the trigger.",
    },
  ],
  aria: [
    'The option list carries `accessibilityRole="list"` and each option the ARIA `role="option"` with its selected state — listbox semantics through the roles React Native has.',
    "The trigger reports `expanded`, so the open popup announces as a consequence of the control, not as a surprise.",
    "Committing announces through the trigger's label, which becomes the chosen option's label.",
  ],
};
