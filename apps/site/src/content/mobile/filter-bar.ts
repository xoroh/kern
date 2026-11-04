import type { ComponentDoc } from "../types";

export const filterBar: ComponentDoc = {
  slug: "filter-bar",
  name: "Filter bar",
  oneLiner:
    "Filter bar turns facet definitions into chips with saved views and a host-owned overflow trigger.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "FilterBar",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["FilterBar"],
  keyboard: [
    {
      key: "Press",
      action:
        "Toggles a facet chip and activates saved views and the clear control — all pressables, so activation is the platform's own.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the facets and views; each announces with its label and on/off state, and double-tap toggles it.",
    },
  ],
  customization: {
    supported: [
      "`filters` are `FilterDef` data — key, label, options, multi or single — so the whole bar is one declaration.",
      "`savedViews` pins named filter sets like a bookings Today view beside the facets.",
      "`onOpenFilters` opens the host-owned full filter modal or sheet; the bar never builds its own overlay.",
      "`label` names the toolbar for assistive technology.",
    ],
    notSupported: [
      "There is no built-in filter modal or sheet. Overflow UI is host-owned behind `onOpenFilters` — the bar reports the request.",
      "There is no URL sync inside. The `toFilterQuery`/`fromFilterQuery` adapters serialise the model; wiring them to the address bar is the host's.",
      "Facets stay single- or multi-select per definition and never mix within one facet.",
    ],
  },
  api: [
    {
      name: "filters",
      type: "NativeFilterDef[]",
      required: true,
    },
    {
      name: "savedViews",
      type: "NativeSavedView[]",
    },
    {
      name: "activeViewId",
      type: "string",
    },
    {
      name: "onSavedViewSelect",
      type: "(view: NativeSavedView | undefined) => void",
    },
    {
      name: "onFiltersChange",
      type: "(active: NativeActiveFilters) => void",
    },
    {
      name: "onOpenFilters",
      type: "() => void",
      note: "Opens the host-owned full filter sheet.",
    },
    {
      name: "openFiltersLabel",
      type: "string",
    },
    {
      name: "accessibilityLabel",
      type: "string",
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
    "The bar is a toolbar with an accessible name; facet chips group per definition with the definition's label.",
    "Saved views render as their own named group, so a saved view reads as a view rather than another filter.",
    "Every toggle reports the merged active model through `onFiltersChange`, so the announcement and the state never disagree.",
  ],
};
