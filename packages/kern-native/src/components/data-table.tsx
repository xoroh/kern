import { type ReactNode, useMemo, useState } from "react";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Card } from "./card";
import { Checkbox } from "./checkbox";
import { Chip } from "./chip";
import { EmptyState } from "./empty-state";
import { Pagination } from "./pagination";
import { Text } from "./text";

/**
 * Native DataTable — the web `DataTable` twin (CL-007; D925).
 *
 * Contract S (shared): columns/rows/sort/filter/pagination/selection,
 * variant presets, `sortTableRows`/`filterTableRows` adapters.
 *
 * Platform N: no web table on native — the same adapters render list-cards
 * (Card per row, label:value lines, sort header row, Pagination). Status
 * cells use Chip, negative ledger amounts the error role, row actions an
 * inline button row.
 */

export type NativeCellValue = string | number | boolean | null | undefined;
export type NativeDataTableRow = Record<string, NativeCellValue>;

export type NativeDataTableVariant =
  | "admin-grid"
  | "bookings"
  | "ledger"
  | "csv-preview";

export type NativeDataTableColumnKind = "text" | "numeric" | "status";

export type NativeDataTableColumn = {
  key: string;
  title: string;
  sortable?: boolean;
  sortValue?: (row: NativeDataTableRow) => string | number | boolean | null;
  render?: (value: NativeCellValue, row: NativeDataTableRow) => ReactNode;
  kind?: NativeDataTableColumnKind;
};

export type NativeDataTableAction = {
  label: string;
  onSelect: (row: NativeDataTableRow) => void;
  destructive?: boolean;
};

export type NativeSortDirection = "asc" | "desc";

function compareValues(
  a: string | number | boolean | null,
  b: string | number | boolean | null,
): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""));
}

export function sortTableRows(
  rows: NativeDataTableRow[],
  columns: NativeDataTableColumn[],
  sortKey: string | undefined,
  direction: NativeSortDirection,
): NativeDataTableRow[] {
  if (!sortKey) return rows;
  const column = columns.find((entry) => entry.key === sortKey);
  if (!column?.sortable) return rows;
  const get =
    column.sortValue ??
    ((row) => (row[sortKey] ?? null) as string | number | boolean | null);
  const factor = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => compareValues(get(a), get(b)) * factor);
}

export function filterTableRows(
  rows: NativeDataTableRow[],
  query: string,
): NativeDataTableRow[] {
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
  NativeDataTableVariant,
  { selectable: boolean; actions: boolean }
> = {
  "admin-grid": { selectable: true, actions: true },
  bookings: { selectable: true, actions: true },
  ledger: { selectable: false, actions: false },
  "csv-preview": { selectable: false, actions: false },
};

export type NativeDataTableProps = Omit<ViewProps, "children" | "style"> & {
  columns: NativeDataTableColumn[];
  rows: NativeDataTableRow[];
  variant?: NativeDataTableVariant;
  caption?: string;
  query?: string;
  getRowId?: (row: NativeDataTableRow, index: number) => string;
  sortKey?: string;
  defaultSortKey?: string;
  sortDirection?: NativeSortDirection;
  defaultSortDirection?: NativeSortDirection;
  onSortChange?: (
    key: string | undefined,
    direction: NativeSortDirection,
  ) => void;
  page?: number;
  defaultPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedChange?: (ids: string[]) => void;
  rowActions?: NativeDataTableAction[];
  selectable?: boolean;
  emptyState?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

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
  selectable: selectableProp,
  emptyState,
  style,
  testID,
  ...props
}: NativeDataTableProps) {
  const scheme = useKernScheme();
  const preset = variantPreset[variant];
  const selectable = selectableProp ?? preset.selectable;
  const actionsOn = preset.actions && rowActions.length > 0;

  const [internalSortKey, setInternalSortKey] = useState<string | undefined>(
    defaultSortKey,
  );
  const [internalDirection, setInternalDirection] =
    useState<NativeSortDirection>(defaultSortDirection);
  const [internalPage, setInternalPage] = useState(defaultPage);
  const [internalSelected, setInternalSelected] = useState(defaultSelectedIds);

  const sortKey = sortKeyProp ?? internalSortKey;
  const direction = directionProp ?? internalDirection;
  const selected = selectedProp ?? internalSelected;

  const resolveId =
    getRowId ??
    ((row: NativeDataTableRow, index: number) =>
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
    const next: NativeSortDirection =
      sortKey === key ? (direction === "asc" ? "desc" : "asc") : "asc";
    if (sortKeyProp === undefined) setInternalSortKey(key);
    if (directionProp === undefined) setInternalDirection(next);
    onSortChange?.(key, next);
  }

  function setSelected(next: string[]) {
    if (selectedProp === undefined) setInternalSelected(next);
    onSelectedChange?.(next);
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected(
      checked
        ? [...new Set([...selected, id])]
        : selected.filter((entry) => entry !== id),
    );
  }

  function renderCell(
    column: NativeDataTableColumn,
    row: NativeDataTableRow,
  ): ReactNode {
    const value = row[column.key];
    if (column.render) return column.render(value, row);
    if (column.kind === "status" && value !== null && value !== undefined) {
      return <Chip variant="assist">{String(value)}</Chip>;
    }
    if (column.kind === "numeric" && typeof value === "number") {
      return (
        <Text
          style={{
            color: value < 0 ? scheme.color.error : scheme.color.onSurface,
            fontVariant: ["tabular-nums"],
          }}
        >
          {value.toLocaleString()}
        </Text>
      );
    }
    if (value === null || value === undefined) {
      return <Text style={{ color: scheme.color.onSurfaceVariant }}>—</Text>;
    }
    return <Text>{String(value)}</Text>;
  }

  if (sorted.length === 0) {
    return (
      <View {...props} testID={testID ?? "kern-data-table-empty"} style={style}>
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
      </View>
    );
  }

  const from = (page - 1) * safeSize + 1;
  const to = Math.min(page * safeSize, sorted.length);

  return (
    <View {...props} testID={testID ?? "kern-data-table"} style={style}>
      {caption ? (
        <Text
          variant="label"
          style={{
            color: scheme.color.onSurfaceVariant,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          {caption}
        </Text>
      ) : null}
      <View
        accessibilityRole="header"
        style={{
          flexDirection: "row",
          backgroundColor: scheme.color.surfaceTonal,
          borderRadius: Number.parseFloat(scheme.shape.small),
          overflow: "hidden",
        }}
      >
        {columns.map((column) =>
          column.sortable ? (
            <Pressable
              key={column.key}
              accessibilityRole="button"
              accessibilityLabel={`Sort by ${column.title}`}
              accessibilityState={{
                selected: sortKey === column.key,
              }}
              onPress={() => toggleSort(column.key)}
              hitSlop={4}
              style={{
                flex: 1,
                minHeight: 48,
                justifyContent: "center",
                paddingHorizontal: 12,
              }}
            >
              <Text variant="label">
                {column.title}
                {sortKey === column.key
                  ? direction === "asc"
                    ? " ▲"
                    : " ▼"
                  : ""}
              </Text>
            </Pressable>
          ) : (
            <View
              key={column.key}
              style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 12 }}
            >
              <Text variant="label">{column.title}</Text>
            </View>
          ),
        )}
      </View>
      {pageRows.map((row, index) => {
        const id = resolveId(row, (page - 1) * safeSize + index);
        const checked = selected.includes(id);
        return (
          <Card
            key={id}
            testID={`kern-data-table-row-${id}`}
            style={{ marginTop: 8 }}
          >
            <View style={{ padding: 12, gap: 6 }}>
              {selectable ? (
                <Checkbox
                  checked={checked}
                  onCheckedChange={(next) => toggleOne(id, next)}
                  accessibilityLabel={`Select row ${id}`}
                />
              ) : null}
              {columns.map((column) => (
                <View
                  key={column.key}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    variant="label"
                    style={{
                      width: 96,
                      color: scheme.color.onSurfaceVariant,
                    }}
                  >
                    {column.title}
                  </Text>
                  <View style={{ flex: 1 }}>{renderCell(column, row)}</View>
                </View>
              ))}
              {actionsOn ? (
                <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                  {rowActions.map((action) => (
                    <Pressable
                      key={action.label}
                      accessibilityRole="button"
                      accessibilityLabel={`${action.label} for row ${id}`}
                      onPress={() => action.onSelect(row)}
                      hitSlop={4}
                      style={{
                        minHeight: 48,
                        justifyContent: "center",
                        paddingHorizontal: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: action.destructive
                            ? scheme.color.error
                            : scheme.color.primary,
                        }}
                      >
                        {action.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          </Card>
        );
      })}
      {pageCount > 1 ? (
        <View style={{ marginTop: 12, gap: 8 }}>
          <Text
            variant="label"
            style={{ color: scheme.color.onSurfaceVariant }}
          >
            Showing {from}–{to} of {sorted.length}
          </Text>
          <Pagination
            count={pageCount}
            value={page}
            onValueChange={go}
            accessibilityLabel="Table pages"
          />
        </View>
      ) : null}
    </View>
  );
}
