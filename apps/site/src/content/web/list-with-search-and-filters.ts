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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Enter / Space",
      action:
        "Uses the search field, the facet chips and the rows — each keeps its own control's keyboard, composed rather than replaced.",
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
      type: "ListRow[]",
      required: true,
    },
    {
      name: "filterDefs",
      type: "FilterDef[] | undefined",
      note: "Facet definitions (uncontrolled inside the bar by default).",
    },
    {
      name: "savedViews",
      type: "SavedView[] | undefined",
    },
    {
      name: "filterable",
      type: "((row: ListRow, key: string) => string | string[] | null | undefined) | undefined",
      note: "Facet data adapter: how one row exposes one facet key. Defaults to the row's own fields (`row[key]`), which covers flat row models.",
    },
    {
      name: "searchable",
      type: "((row: ListRow) => string[]) | undefined",
      note: "Extra query match terms per row (codes, phone numbers, …).",
    },
    {
      name: "query",
      type: "string | undefined",
    },
    {
      name: "defaultQuery",
      type: "string | undefined",
    },
    {
      name: "onQueryChange",
      type: "((query: string) => void) | undefined",
    },
    {
      name: "searchLabel",
      type: "string | undefined",
    },
    {
      name: "searchPlaceholder",
      type: "string | undefined",
    },
    {
      name: "variant",
      type: '"one-line" | "two-line" | "avatar" | "icon" | "thumbnail" | "navigational" | "selectable" | "expandable" | "control" | "grouped"',
    },
    {
      name: "density",
      type: '"compact" | "medium" | "expanded"',
    },
    {
      name: "label",
      type: "string | undefined",
    },
    {
      name: "loading",
      type: "boolean | undefined",
    },
    {
      name: "loadingRows",
      type: "number | undefined",
    },
    {
      name: "onRowPress",
      type: "((id: string) => void) | undefined",
    },
    {
      name: "onFiltersChange",
      type: "((active: ActiveFilters) => void) | undefined",
    },
    {
      name: "onOpenFilters",
      type: "(() => void) | undefined",
    },
    {
      name: "emptyState",
      type: "ReactNode",
      note: "Idle empty state (no query, no filters). Defaults to `EmptyState`.",
    },
    {
      name: "className",
      type: "string | undefined",
    },
  ],
  aria: [
    "The block is a labelled section, so the search, the bar and the rows announce as one unit.",
    "The idle empty state and the query-aware empty state are different blocks — no query with no filters is not the same state as a query with no hits.",
    "Loading renders the list's skeleton treatment through the same polite status.",
  ],
};
