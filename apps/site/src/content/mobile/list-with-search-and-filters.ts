import type { ComponentDoc } from "../types";

export const listWithSearchAndFilters: ComponentDoc = {
  slug: "list-with-search-and-filters",
  name: "List with search and filters",
  oneLiner:
    "List with search and filters is the block that owns query and filter state over rows.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ListWithSearchAndFilters",
    variants: [
      "variant: one-line · two-line · avatar · icon · thumbnail · navigational · selectable · expandable · control · grouped",
      "density: compact · medium · expanded",
    ],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ListWithSearchAndFilters"],
  keyboard: [
    {
      key: "Press",
      action:
        "Uses the search field, the facet chips and the rows — each keeps its own control's press behaviour, composed rather than replaced.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the search, the facets and the rows as one labelled unit.",
    },
  ],
  customization: {
    supported: [
      "The block owns the query and the filter model; the host owns rows and the facet adapters.",
      "`filterable` defaults to reading the row's own fields, and `searchable` adds extra match terms per row — flat row models need no adapter.",
      "`variant` and `density` pass straight to the underlying list presets.",
      "The filter bar stays uncontrolled inside by default; the query trio takes over when the host needs it.",
    ],
    notSupported: [
      "There is no server search. Rows are in memory; remote data pages through the host before it reaches the block.",
      "There is no second table, list or CSV builder inside — extension point, not a fork.",
      "The full filter modal stays host-owned behind `onOpenFilters`, exactly as with the standalone bar.",
    ],
  },
  api: [
    {
      name: "rows",
      type: "NativeListRow[]",
      required: true,
    },
    {
      name: "filterDefs",
      type: "NativeFilterDef[]",
    },
    {
      name: "savedViews",
      type: "NativeSavedView[]",
    },
    {
      name: "filterable",
      type: "( row: NativeListRow, key: string, ) => string | string[] | null | undefined",
    },
    {
      name: "searchable",
      type: "(row: NativeListRow) => string[]",
    },
    {
      name: "query",
      type: "string",
    },
    {
      name: "defaultQuery",
      type: "string",
    },
    {
      name: "onQueryChange",
      type: "(query: string) => void",
    },
    {
      name: "searchLabel",
      type: "string",
    },
    {
      name: "searchPlaceholder",
      type: "string",
    },
    {
      name: "variant",
      type: "NativeListVariant",
    },
    {
      name: "density",
      type: "NativeListDensity",
    },
    {
      name: "accessibilityLabel",
      type: "string",
    },
    {
      name: "loading",
      type: "boolean",
    },
    {
      name: "loadingRows",
      type: "number",
    },
    {
      name: "onRowPress",
      type: "(id: string) => void",
    },
    {
      name: "onFiltersChange",
      type: "(active: NativeActiveFilters) => void",
    },
    {
      name: "onOpenFilters",
      type: "() => void",
    },
    {
      name: "emptyState",
      type: "ReactNode",
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
    "The block carries the host's accessibility label, so the search, the bar and the rows announce as one unit.",
    "The idle empty state and the query-aware empty state are different blocks — no query with no filters is not the same state as a query with no hits.",
    "Loading renders the list's skeleton treatment through the same progress announcement.",
  ],
};
