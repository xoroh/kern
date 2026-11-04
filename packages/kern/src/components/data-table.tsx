import { type ReactNode, useMemo, useState } from "react";
import { cn } from "../utils/cn";
import { Checkbox } from "./checkbox";
import { Chip } from "./chip";
import { EmptyState } from "./empty-state";
import { Menu } from "./menu";
import { Pagination } from "./pagination";
import { Table, type TableDensity } from "./table";

/**
 * KernDataTable — the ONE table (CL-007; D925).
 *
 * M3: tables map to Lists + Dividers in the M3 references
 * (m3.material.io/components/lists/overview for row anatomy); density and
 * sticky headers follow the ops-queue needs from inventory (CMP-0041
 * BookingsTable, CMP-0903 BackofficeDataTable, CMP-2456 ledger,
 * CMP-1416 CSV preview). Builds on the U5 `Table` primitives (density +
 * sticky header) — never a second table.
 *
 * Port sources (OSI only): shadcn dashboard/table block composition,
 * re-skinned to M3 tokens (MIT, https://github.com/shadcn-ui/ui/blob/main/LICENSE.md);
 * Paper DataTable behavior (MIT,
 * https://github.com/callstack/react-native-paper/blob/main/LICENSE.md).
 */

export type CellValue = string | number | boolean | null | undefined;
export type DataTableRow = Record<string, CellValue>;

/**
 * Table variants = presets over one grid (unifies the inventory copies):
 * - `admin-grid`: roomy ops grid, sticky header, selection + row actions.
 * - `bookings`: dispatch queue — status-chip cells + row actions.
 * - `ledger`: compact financial rows, right-aligned numerics, negative
 *   amounts in the error role (replaces the raw green/red hex drift).
 * - `csv-preview`: compact read-only preview, no selection or actions.
 */
export type DataTableVariant =
  | "admin-grid"
  | "bookings"
  | "ledger"
  | "csv-preview";

export type DataTableColumnKind = "text" | "numeric" | "status" | "actions";

export type DataTableColumn = {
  key: string;
  title: ReactNode;
  sortable?: boolean;
  /** Comparable value for sorting. Defaults to the raw cell value. */
  sortValue?: (row: DataTableRow) => string | number | boolean | null;
  /** Custom cell rendering. Defaults to text. */
  render?: (value: CellValue, row: DataTableRow) => ReactNode;
  kind?: DataTableColumnKind;
};

export type DataTableAction = {
  label: string;
  onSelect: (row: DataTableRow) => void;
  destructive?: boolean;
};

export type SortDirection = "asc" | "desc";

function compareValues(
  a: string | number | boolean | null,
  b: string | number | boolean | null,
): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""));
}

/** Pure sort: shared with the native twin (same contract, list-cards UI). */
export function sortTableRows(
  rows: DataTableRow[],
  columns: DataTableColumn[],
  sortKey: string | undefined,
  direction: SortDirection,
): DataTableRow[] {
  if (!sortKey) return rows;
  const column = columns.find((entry) => entry.key === sortKey);
  if (!column?.sortable) return rows;
  const get =
    column.sortValue ??
    ((row) => (row[sortKey] ?? null) as string | number | boolean | null);
  const factor = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => compareValues(get(a), get(b)) * factor);
}

/** Pure global text filter across every column value. */
export function filterTableRows(
  rows: DataTableRow[],
  query: string,
): DataTableRow[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        String(value).toLowerCase().includes(needle),
    ),
  );
}

const variantPreset: Record<
  DataTableVariant,
  {
    density: TableDensity;
    stickyHeader: boolean;
    selectable: boolean;
    actions: boolean;
  }
> = {
  "admin-grid": {
    density: "comfortable",
    stickyHeader: true,
    selectable: true,
    actions: true,
  },
  bookings: {
    density: "comfortable",
    stickyHeader: true,
    selectable: true,
    actions: true,
  },
  ledger: {
    density: "compact",
    stickyHeader: false,
    selectable: false,
    actions: false,
  },
  "csv-preview": {
    density: "compact",
    stickyHeader: false,
    selectable: false,
    actions: false,
  },
};

export type DataTableProps = {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  variant?: DataTableVariant;
  caption?: string;
  /** Global text filter (owned by the Search above the table). */
  query?: string;
  /** Stable row identity. Defaults to `row.id` then index. */
  getRowId?: (row: DataTableRow, index: number) => string;
  sortKey?: string;
  defaultSortKey?: string;
  sortDirection?: SortDirection;
  defaultSortDirection?: SortDirection;
  onSortChange?: (key: string | undefined, direction: SortDirection) => void;
  page?: number;
  defaultPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedChange?: (ids: string[]) => void;
  /** Row actions for `actions`-kind columns (bookings/admin presets). */
  rowActions?: DataTableAction[];
  density?: TableDensity;
  stickyHeader?: boolean;
  selectable?: boolean;
  emptyState?: ReactNode;
  className?: string;
};

function SortIcon({ direction }: { direction?: SortDirection }) {
  return (
    <svg
      data-slot="data-table-sort-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      {direction === "desc" ? (
        <path d="m6 9 6 6 6-6" />
      ) : (
        <path d="m18 15-6-6-6 6" />
      )}
    </svg>
  );
}

function RowActionsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

/** Overflow menu for one row. Closed it renders only the trigger. */
function RowActionsCell({
  row,
  rowId,
  actions,
}: {
  row: DataTableRow;
  rowId: string;
  actions: DataTableAction[];
}) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`Actions for row ${rowId}`}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-(--sys-color-on-surface-variant) outline-none hover:bg-(--sys-color-surface-tonal) focus-visible:ring-2 focus-visible:ring-(--sys-color-secondary)"
      >
        <RowActionsIcon />
      </Menu.Trigger>
      <Menu.Content>
        {actions.map((action) => (
          <Menu.Item
            key={action.label}
            onClick={() => action.onSelect(row)}
            className={
              action.destructive ? "text-(--sys-color-error)" : undefined
            }
          >
            {action.label}
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
}

/** The one table: sort/filter/pagination/selection over `Table`. */
export function DataTable({
  columns,
  rows,
  variant = "admin-grid",
  caption,
  query = "",
  getRowId,
  sortKey: sortKeyProp,
  defaultSortKey,
  sortDirection: directionProp,
  defaultSortDirection = "asc",
  onSortChange,
  page: pageProp,
  defaultPage = 1,
  pageSize = 10,
  onPageChange,
  selectedIds: selectedProp,
  defaultSelectedIds = [],
  onSelectedChange,
  rowActions = [],
  density: densityProp,
  stickyHeader: stickyProp,
  selectable: selectableProp,
  emptyState,
  className,
}: DataTableProps) {
  const preset = variantPreset[variant];
  const density = densityProp ?? preset.density;
  const stickyHeader = stickyProp ?? preset.stickyHeader;
  const selectable = selectableProp ?? preset.selectable;
  const actionsOn = preset.actions && rowActions.length > 0;

  const [internalSortKey, setInternalSortKey] = useState<string | undefined>(
    defaultSortKey,
  );
  const [internalDirection, setInternalDirection] =
    useState<SortDirection>(defaultSortDirection);
  const [internalPage, setInternalPage] = useState(defaultPage);
  const [internalSelected, setInternalSelected] = useState(defaultSelectedIds);

  const sortKey = sortKeyProp ?? internalSortKey;
  const direction = directionProp ?? internalDirection;
  const selected = selectedProp ?? internalSelected;

  const resolveId =
    getRowId ??
    ((row: DataTableRow, index: number) =>
      typeof row.id === "string" || typeof row.id === "number"
        ? String(row.id)
        : `row-${index}`);

  const filtered = useMemo(() => filterTableRows(rows, query), [rows, query]);
  const sorted = useMemo(
    () => sortTableRows(filtered, columns, sortKey, direction),
    [filtered, columns, sortKey, direction],
  );

  const safeSize = Math.max(pageSize, 1);
  const pageCount = Math.max(Math.ceil(sorted.length / safeSize), 1);
  const page = Math.min(Math.max(pageProp ?? internalPage, 1), pageCount);
  const pageRows = sorted.slice((page - 1) * safeSize, page * safeSize);

  function go(next: number) {
    const clamped = Math.min(Math.max(next, 1), pageCount);
    if (pageProp === undefined) setInternalPage(clamped);
    onPageChange?.(clamped);
  }

  function toggleSort(key: string) {
    const nextDirection: SortDirection =
      sortKey === key ? (direction === "asc" ? "desc" : "asc") : "asc";
    if (sortKeyProp === undefined) setInternalSortKey(key);
    if (directionProp === undefined) setInternalDirection(nextDirection);
    onSortChange?.(key, nextDirection);
  }

  function setSelected(next: string[]) {
    if (selectedProp === undefined) setInternalSelected(next);
    onSelectedChange?.(next);
  }

  const visibleIds = pageRows.map((row, index) =>
    resolveId(row, (page - 1) * safeSize + index),
  );
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const someVisibleSelected = visibleIds.some((id) => selected.includes(id));

  function toggleAll(checked: boolean) {
    if (checked) {
      setSelected([...new Set([...selected, ...visibleIds])]);
    } else {
      setSelected(selected.filter((id) => !visibleIds.includes(id)));
    }
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected(
      checked
        ? [...new Set([...selected, id])]
        : selected.filter((entry) => entry !== id),
    );
  }

  function renderCell(column: DataTableColumn, row: DataTableRow): ReactNode {
    const value = row[column.key];
    if (column.kind === "actions") {
      // Preset-gated (ledger/csv-preview never show row actions): an
      // actions column without actions renders an empty cell, never a
      // dead trigger.
      if (!actionsOn) return null;
      return (
        <RowActionsCell
          row={row}
          rowId={resolveId(row, 0)}
          actions={rowActions}
        />
      );
    }
    if (column.render) return column.render(value, row);
    if (column.kind === "status" && value !== null && value !== undefined) {
      return <Chip variant="assist">{String(value)}</Chip>;
    }
    if (column.kind === "numeric" && typeof value === "number") {
      return (
        <span
          className={cn(
            "tabular-nums",
            value < 0 && "text-(--sys-color-error)",
          )}
        >
          {value.toLocaleString()}
        </span>
      );
    }
    return value === null || value === undefined ? (
      <span
        aria-hidden="true"
        className="text-(--sys-color-on-surface-variant)"
      >
        —
      </span>
    ) : (
      String(value)
    );
  }

  if (sorted.length === 0) {
    return (
      <div data-slot="data-table-empty">
        {emptyState ?? (
          <EmptyState
            title={query ? "No matching rows" : "No rows"}
            description={
              query
                ? "Try a different search, or clear it to see everything."
                : undefined
            }
          />
        )}
      </div>
    );
  }

  const from = (page - 1) * safeSize + 1;
  const to = Math.min(page * safeSize, sorted.length);

  return (
    <div data-slot="data-table" data-variant={variant} className={className}>
      <Table.Root density={density} stickyHeader={stickyHeader}>
        {caption ? <Table.Caption>{caption}</Table.Caption> : null}
        <Table.Head>
          <Table.Row>
            {selectable ? (
              <Table.Header aria-label="Select rows">
                <Checkbox
                  checked={allVisibleSelected}
                  indeterminate={!allVisibleSelected && someVisibleSelected}
                  onCheckedChange={(checked) => toggleAll(checked === true)}
                  aria-label="Select all rows on this page"
                />
              </Table.Header>
            ) : null}
            {columns.map((column) => (
              <Table.Header
                key={column.key}
                aria-sort={
                  column.sortable
                    ? sortKey === column.key
                      ? direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                    : undefined
                }
                className={cn(
                  column.kind === "numeric" && "text-right",
                  column.kind === "actions" && "text-right",
                )}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    aria-label={`Sort by ${typeof column.title === "string" ? column.title : column.key}`}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-(--sys-shape-corner-extra-small) outline-none hover:text-(--sys-color-on-surface) focus-visible:ring-2 focus-visible:ring-(--sys-color-secondary)"
                  >
                    {column.title}
                    <SortIcon
                      direction={sortKey === column.key ? direction : undefined}
                    />
                  </button>
                ) : (
                  column.title
                )}
              </Table.Header>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {pageRows.map((row, index) => {
            const id = resolveId(row, (page - 1) * safeSize + index);
            const checked = selected.includes(id);
            return (
              <Table.Row
                key={id}
                data-selected={selectable && checked ? "" : undefined}
                className={cn(
                  selectable &&
                    checked &&
                    "bg-(--sys-color-secondary-container)/40",
                )}
              >
                {selectable ? (
                  <Table.Cell>
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(next) => toggleOne(id, next === true)}
                      aria-label={`Select row ${id}`}
                    />
                  </Table.Cell>
                ) : null}
                {columns.map((column) => (
                  <Table.Cell
                    key={column.key}
                    className={cn(column.kind === "numeric" && "text-right")}
                  >
                    {renderCell(column, row)}
                  </Table.Cell>
                ))}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
      {pageCount > 1 ? (
        <div
          data-slot="data-table-footer"
          className="kern-data-table-footer flex flex-wrap items-center justify-between gap-2 pt-3"
        >
          <p className="text-xs text-(--sys-color-on-surface-variant)">
            Showing {from}–{to} of {sorted.length}
          </p>
          <Pagination
            count={pageCount}
            value={page}
            onValueChange={go}
            aria-label="Table pages"
          />
        </div>
      ) : null}
    </div>
  );
}
