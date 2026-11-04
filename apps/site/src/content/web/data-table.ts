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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Enter / Space",
      action:
        "Sorts from a sortable column header and toggles the header and row checkboxes — every one is a real button or checkbox, so the press is the browser's own.",
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
      type: "DataTableColumn[]",
      required: true,
    },
    {
      name: "rows",
      type: "DataTableRow[]",
      required: true,
    },
    {
      name: "variant",
      type: '"admin-grid" | "bookings" | "ledger" | "csv-preview"',
    },
    {
      name: "caption",
      type: "string | undefined",
    },
    {
      name: "query",
      type: "string | undefined",
      note: "Global text filter (owned by the Search above the table).",
    },
    {
      name: "getRowId",
      type: "((row: DataTableRow, index: number) => string) | undefined",
      note: "Stable row identity. Defaults to `row.id` then index.",
    },
    {
      name: "sortKey",
      type: "string | undefined",
    },
    {
      name: "defaultSortKey",
      type: "string | undefined",
    },
    {
      name: "sortDirection",
      type: "SortDirection | undefined",
    },
    {
      name: "defaultSortDirection",
      type: "SortDirection | undefined",
    },
    {
      name: "onSortChange",
      type: "((key: string | undefined, direction: SortDirection) => void) | undefined",
    },
    {
      name: "page",
      type: "number | undefined",
    },
    {
      name: "defaultPage",
      type: "number | undefined",
    },
    {
      name: "pageSize",
      type: "number | undefined",
    },
    {
      name: "onPageChange",
      type: "((page: number) => void) | undefined",
    },
    {
      name: "selectedIds",
      type: "string[] | undefined",
    },
    {
      name: "defaultSelectedIds",
      type: "string[] | undefined",
    },
    {
      name: "onSelectedChange",
      type: "((ids: string[]) => void) | undefined",
    },
    {
      name: "rowActions",
      type: "DataTableAction[] | undefined",
      note: "Row actions for `actions`-kind columns (bookings/admin presets).",
    },
    {
      name: "density",
      type: '"comfortable" | "compact"',
    },
    {
      name: "stickyHeader",
      type: "boolean | undefined",
    },
    {
      name: "selectable",
      type: "boolean | undefined",
    },
    {
      name: "emptyState",
      type: "ReactNode",
    },
    {
      name: "className",
      type: "string | undefined",
    },
  ],
  aria: [
    "Sortable headers expose `aria-sort`, so the current order is announced on the header itself.",
    "The header select-all checkbox reports the indeterminate state when some page rows are selected.",
    "The web table renders a real caption element; the footer range label names the current page window.",
    "Row actions live in an overflow menu per row, so they never steal the row's own activation.",
  ],
};
