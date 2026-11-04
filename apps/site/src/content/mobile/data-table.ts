import type { ComponentDoc } from "../types";

export const dataTable: ComponentDoc = {
  slug: "data-table",
  name: "Data table",
  oneLiner:
    "Data table is the sortable, pageable grid over columns and rows with four density presets.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "DataTable",
    variants: ["variant: admin-grid · bookings · ledger · csv-preview"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["DataTable"],
  keyboard: [
    {
      key: "Press",
      action:
        "Sorts from a sortable column header, toggles row selection and opens row actions — every control is a labelled pressable with its state.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the sort header, the row cards and the page controls; sort direction and selection announce in place.",
    },
  ],
  customization: {
    supported: [
      "`variant` presets density, sticky header, selection and row actions in one choice — `admin-grid`, `bookings`, `ledger`, `csv-preview` — and `density`, `stickyHeader` and `selectable` override the preset per table.",
      "Cell kinds are `text`, `numeric`, `status` and `actions`, with a custom `render` per column.",
      "`query` is the global text filter owned by the search above the table, never by the table.",
      "`emptyState` defaults to a query-aware empty block.",
    ],
    notSupported: [
      "There is no data fetching. The host owns columns, rows, sort, page and selection; the table is a controlled grid.",
      "The `ledger` and `csv-preview` presets drop selection and row actions by design — a financial grid and a preview must not start workflows.",
      "Status-kind cells render neutral assist chips until the tone-registry merge lands — tracked component-side work, not a prop to switch.",
    ],
  },
  api: [
    {
      name: "columns",
      type: "NativeDataTableColumn[]",
      required: true,
    },
    {
      name: "rows",
      type: "NativeDataTableRow[]",
      required: true,
    },
    {
      name: "variant",
      type: "NativeDataTableVariant",
    },
    {
      name: "caption",
      type: "string",
    },
    {
      name: "query",
      type: "string",
    },
    {
      name: "getRowId",
      type: "(row: NativeDataTableRow, index: number) => string",
    },
    {
      name: "sortKey",
      type: "string",
    },
    {
      name: "defaultSortKey",
      type: "string",
    },
    {
      name: "sortDirection",
      type: "NativeSortDirection",
    },
    {
      name: "defaultSortDirection",
      type: "NativeSortDirection",
    },
    {
      name: "onSortChange",
      type: "( key: string | undefined, direction: NativeSortDirection, ) => void",
    },
    {
      name: "page",
      type: "number",
    },
    {
      name: "defaultPage",
      type: "number",
    },
    {
      name: "pageSize",
      type: "number",
    },
    {
      name: "onPageChange",
      type: "(page: number) => void",
    },
    {
      name: "selectedIds",
      type: "string[]",
    },
    {
      name: "defaultSelectedIds",
      type: "string[]",
    },
    {
      name: "onSelectedChange",
      type: "(ids: string[]) => void",
    },
    {
      name: "rowActions",
      type: "NativeDataTableAction[]",
    },
    {
      name: "selectable",
      type: "boolean",
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
    "Native renders list-cards under the shared contract — one card per row with label-and-value lines — so there is no web table to map.",
    "The sort header row reports direction on each sortable column; row selection and row actions announce per row.",
    "The page controls announce as table pages with the current window labelled.",
    "`caption` names the table for assistive technology on both renderers.",
  ],
};
