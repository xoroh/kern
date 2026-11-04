import type { ComponentDoc } from "../types";

export const list: ComponentDoc = {
  slug: "list",
  name: "List",
  oneLiner:
    "List renders rows as a list with ten layout presets over one row model.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Canonical M3 spec page for this family.
    specUrl: "https://m3.material.io/components/lists/overview",
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
    nativePeer: "List",
    variants: [
      "variant: one-line · two-line · avatar · icon · thumbnail · navigational · selectable · expandable · control · grouped",
      "density: compact · medium · expanded",
    ],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["List"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the row's own control — selectable rows use real checkboxes, expandable rows a disclosure button, navigational rows links — so the press is the browser's own.",
    },
  ],
  customization: {
    supported: [
      "`rows` are data — `id`, `headline`, optional supporting, leading and trailing nodes — so a queue, a booking list and a ticket list are one declaration each.",
      "`sections` switches to grouped rendering with headers and dividers; grouped data wins over `rows`.",
      "`renderRow` is the escape hatch for full control of one row's rendering.",
      "`emptyState` replaces the default empty block; `label` names the landmark.",
    ],
    notSupported: [
      "There is no `page` or `pageSize` prop. Pagination is the `paginateListRows`/`usePagination` adapters — the list stays presentational and the host slices.",
      "There is no built-in windowing. Long lists slice with the `virtualWindow` math, which is a pure helper on purpose.",
      "There is no `href` handling beyond the row's own `href`. Navigational rows navigate; action rows report through `onRowPress`.",
    ],
  },
  api: [
    {
      name: "rows",
      type: "ListRow[] | undefined",
      note: "Flat rows. Ignored when `sections` is passed (grouped data wins).",
    },
    {
      name: "sections",
      type: "ListSection[] | undefined",
      note: "Sectioned rows for the `grouped` variant.",
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
      note: "Accessible name for the list landmark.",
    },
    {
      name: "selectedIds",
      type: "string[] | undefined",
      note: "Selection state (selectable variant; also honored elsewhere).",
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
      name: "selectionMode",
      type: '"single" | "multiple"',
    },
    {
      name: "expandedIds",
      type: "string[] | undefined",
      note: "Expansion state (expandable variant).",
    },
    {
      name: "defaultExpandedIds",
      type: "string[] | undefined",
    },
    {
      name: "onExpandedChange",
      type: "((ids: string[]) => void) | undefined",
    },
    {
      name: "onRowPress",
      type: "((id: string) => void) | undefined",
      note: "Row activation (navigational rows navigate via `href` instead).",
    },
    {
      name: "loading",
      type: "boolean | undefined",
      note: "Loading state: skeleton rows + a polite status.",
    },
    {
      name: "loadingRows",
      type: "number | undefined",
    },
    {
      name: "emptyState",
      type: "ReactNode",
      note: "Empty state node. Defaults to an `EmptyState`.",
    },
    {
      name: "renderRow",
      type: "((row: ListRow, index: number) => ReactNode) | undefined",
      note: "Escape hatch: full control over one row's rendering.",
    },
    {
      name: "className",
      type: "string | undefined",
    },
  ],
  aria: [
    "Rows render as list items in an unordered list, so the structure is announced rather than looked at.",
    "Selectable rows pair each item with a named checkbox; exactly the single/multi-select pattern the M3 lists page describes.",
    "Expandable panels are sibling rows, never nested ones, so the list ownership stays valid.",
    "Loading renders skeleton rows plus a polite status region; `label` names the list landmark.",
  ],
};
