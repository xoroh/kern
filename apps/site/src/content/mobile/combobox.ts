import type { ComponentDoc } from "../types";

export const combobox: ComponentDoc = {
  slug: "combobox",
  name: "Combobox",
  oneLiner:
    "Comboboxes pick one value from a set, either from the list or by typing to narrow it.",
  features:
    "Reach for a combobox when the answer is one of many known values and typing is quicker than scrolling. The trigger is a read-only field display; the popup holds the filter field and the option list, so one editable field is on screen at a time. Typing narrows the full list, committing reports and closes, and dismissing drops the transient query. It is the wrong tool when the answer is free text (an input) or the set is short enough to read (a radio group or select).",
  meta: {
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
  deviations: [
    {
      id: "K6",
      spec: "M3's component elevation table names no combobox. It tabulates menus at level 2 — neither row describes a type-to-filter popup.",
      kern: "The combobox popup rests at elevation level 2.",
      why: "The open list floats above the page and needs the same lift the other anchored overlays have. The native popup renders `3dp`, which is M3 level 2 — the same resting height as the web popup.",
    },
  ],
  usage: {
    do: [
      "Declare options as `{ value, label }[]` — the trigger shows the chosen label, the popup shows the list.",
      "Keep the default substring filter unless matching is server-side or fuzzy; the default is the honest local behaviour.",
      "Drive `value`/`onValueChange` when the choice feeds state elsewhere; let it hold its own otherwise.",
    ],
    dont: [
      "Don't use it for free text — a query with no option to commit is an input.",
      "Don't duplicate the popup's filter field outside it — one editable field on screen at a time.",
    ],
  },
  tokens: [
    {
      element: "Field trigger",
      state: "resting",
      token: "theme.color.surface",
      value: "surface, outline border, minHeight 56",
    },
    {
      element: "Popup",
      state: "resting",
      token: "theme.color.surfaceContainer",
      value: "surfaceContainer, medium corners, level 2 (3dp)",
    },
    {
      element: "Selected option",
      state: "selected",
      token: "theme.color.surfaceTonal",
      value: "surfaceTonal wash behind the chosen row",
    },
  ],
  faq: [
    {
      q: "Combobox, select, or autocomplete?",
      a: "Type-to-narrow plus browse means combobox. A fixed set with no typing means select. The web autocomplete is a different surface; natively the combobox covers both jobs.",
    },
    {
      q: "How does this differ from the web combobox?",
      a: "Same contract (filter narrows, commit reports value plus option, dismiss drops the query). Web is multipart over Base UI with the input as the trigger; native is one flat component with the filter field inside the popup — the `Select`/`SegmentedButton` data convention.",
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
