import { type ReactNode, useMemo, useState } from "react";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { EmptySearch } from "./empty-search";
import { EmptyState } from "./empty-state";
import {
  applyFilterDefs,
  FilterBar,
  type NativeActiveFilters,
  type NativeFilterDef,
  type NativeSavedView,
} from "./filter-bar";
import {
  filterListRows,
  List,
  type NativeListDensity,
  type NativeListRow,
  type NativeListVariant,
} from "./list";
import { Search } from "./search";

/**
 * Native ListWithSearchAndFilters — the web block twin (D925).
 *
 * Composes ONLY `Search` + `FilterBar` + `List` + `EmptySearch` /
 * `EmptyState`. Same wiring: query + active filters -> visible rows;
 * filtering with zero matches -> `EmptySearch`; idle with zero rows ->
 * `emptyState`. The full filter surface is host-owned (sheet via
 * `onOpenFilters`); grouped metrics come from the twins.
 */

export type NativeListWithSearchAndFiltersProps = Omit<
  ViewProps,
  "children" | "style"
> & {
  rows: NativeListRow[];
  filterDefs?: NativeFilterDef[];
  savedViews?: NativeSavedView[];
  filterable?: (
    row: NativeListRow,
    key: string,
  ) => string | string[] | null | undefined;
  searchable?: (row: NativeListRow) => string[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  variant?: NativeListVariant;
  density?: NativeListDensity;
  accessibilityLabel?: string;
  loading?: boolean;
  loadingRows?: number;
  onRowPress?: (id: string) => void;
  onFiltersChange?: (active: NativeActiveFilters) => void;
  onOpenFilters?: () => void;
  emptyState?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function defaultFilterable(
  row: NativeListRow,
  key: string,
): string | string[] | null | undefined {
  const value = (row as unknown as Record<string, unknown>)[key];
  if (typeof value === "string") return value;
  if (Array.isArray(value))
    return value.filter((entry): entry is string => typeof entry === "string");
  return undefined;
}

export function ListWithSearchAndFilters({
  rows,
  filterDefs = [],
  savedViews = [],
  filterable = defaultFilterable,
  searchable,
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  searchLabel = "Search list",
  searchPlaceholder = "Search",
  variant = "two-line",
  density = "medium",
  accessibilityLabel,
  loading = false,
  loadingRows = 3,
  onRowPress,
  onFiltersChange,
  onOpenFilters,
  emptyState,
  style,
  testID,
  ...props
}: NativeListWithSearchAndFiltersProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const [active, setActive] = useState<NativeActiveFilters>(() =>
    Object.fromEntries(
      filterDefs.flatMap((def) => {
        const seed = def.value ?? def.defaultValue ?? [];
        return seed.length > 0 ? [[def.key, seed]] : [];
      }),
    ),
  );
  const query = queryProp ?? internalQuery;

  function setQuery(next: string) {
    if (queryProp === undefined) setInternalQuery(next);
    onQueryChange?.(next);
  }

  function clearAll() {
    setQuery("");
    setActive({});
  }

  const visible = useMemo(() => {
    const byQuery = filterListRows(rows, query, searchable);
    if (Object.keys(active).length === 0 || filterDefs.length === 0) {
      return byQuery;
    }
    const defs = filterDefs.map((def) => ({
      ...def,
      value: active[def.key] ?? [],
    }));
    return applyFilterDefs(byQuery, defs, (row, key) => filterable(row, key));
  }, [rows, query, searchable, active, filterDefs, filterable]);

  const filtering = query.trim() !== "" || Object.keys(active).length > 0;

  const controlledDefs = filterDefs.map((def) => ({
    ...def,
    value: active[def.key] ?? [],
  }));

  return (
    <View
      {...props}
      testID={testID ?? "kern-list-with-search-and-filters"}
      accessibilityLabel={accessibilityLabel}
      style={[{ flexDirection: "column", gap: 12 }, style]}
    >
      <Search
        label={searchLabel}
        placeholder={searchPlaceholder}
        value={query}
        onValueChange={setQuery}
      />
      {filterDefs.length > 0 || savedViews.length > 0 ? (
        <FilterBar
          filters={controlledDefs}
          savedViews={savedViews}
          onFiltersChange={(next) => {
            setActive(next);
            onFiltersChange?.(next);
          }}
          onOpenFilters={onOpenFilters}
        />
      ) : null}
      <List
        rows={visible}
        variant={variant}
        density={density}
        accessibilityLabel={accessibilityLabel}
        loading={loading}
        loadingRows={loadingRows}
        onRowPress={onRowPress}
        emptyState={
          filtering ? (
            <EmptySearch query={query} onClear={clearAll} />
          ) : (
            (emptyState ?? <EmptyState title="No items" />)
          )
        }
      />
    </View>
  );
}
