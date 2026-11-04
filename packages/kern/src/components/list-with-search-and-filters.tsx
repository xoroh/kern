import { type ReactNode, useMemo, useState } from "react";
import { cn } from "../utils/cn";
import { EmptySearch } from "./empty-search";
import { EmptyState } from "./empty-state";
import {
  type ActiveFilters,
  applyFilterDefs,
  FilterBar,
  type FilterDef,
  type SavedView,
} from "./filter-bar";
import {
  filterListRows,
  List,
  type ListDensity,
  type ListRow,
  type ListVariant,
} from "./list";
import { Search } from "./search";

/**
 * ListWithSearchAndFilters — the generic discovery block (D925).
 *
 * Composes ONLY `Search` + `FilterBar` + `List` + `EmptySearch` /
 * `EmptyState` (+ skeletons while loading): the booking 4-compositions,
 * desk FilterBar and ticket filter bars from inventory collapse into one
 * wired block. The block owns the query + active-filter state and the
 * row adapters; the host owns the rows and the facet adapter.
 *
 * M3: lists + search (https://m3.material.io/components/search) + chips
 * (filter) + progress (loading) + empty-states pattern.
 *
 * Port sources (OSI only): shadcn dashboard/table block composition,
 * re-skinned (MIT, https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).
 */

export type ListWithSearchAndFiltersProps = {
  rows: ListRow[];
  /** Facet definitions (uncontrolled inside the bar by default). */
  filterDefs?: FilterDef[];
  savedViews?: SavedView[];
  /**
   * Facet data adapter: how one row exposes one facet key. Defaults to the
   * row's own fields (`row[key]`), which covers flat row models.
   */
  filterable?: (
    row: ListRow,
    key: string,
  ) => string | string[] | null | undefined;
  /** Extra query match terms per row (codes, phone numbers, …). */
  searchable?: (row: ListRow) => string[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  variant?: ListVariant;
  density?: ListDensity;
  label?: string;
  loading?: boolean;
  loadingRows?: number;
  onRowPress?: (id: string) => void;
  onFiltersChange?: (active: ActiveFilters) => void;
  onOpenFilters?: () => void;
  /** Idle empty state (no query, no filters). Defaults to `EmptyState`. */
  emptyState?: ReactNode;
  className?: string;
};

function defaultFilterable(
  row: ListRow,
  key: string,
): string | string[] | null | undefined {
  const value = (row as unknown as Record<string, unknown>)[key];
  if (typeof value === "string") return value;
  if (Array.isArray(value))
    return value.filter((entry): entry is string => typeof entry === "string");
  return undefined;
}

/**
 * Search + filters + list, wired: type to filter, chip to facet, clear to
 * recover. Query/filters active with zero matches -> `EmptySearch`;
 * idle with zero rows -> `emptyState`.
 */
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
  label,
  loading = false,
  loadingRows = 3,
  onRowPress,
  onFiltersChange,
  onOpenFilters,
  emptyState,
  className,
}: ListWithSearchAndFiltersProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  // The block owns the active model; FilterBar stays a controlled renderer
  // (per-def `value` + `onFiltersChange`), so "Clear search" below also
  // clears the chips — uncontrolled bar state would go stale behind it.
  const [active, setActive] = useState<ActiveFilters>(() =>
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

  // Controlled defs: values read from the block model, host def handlers
  // forwarded untouched. Bar-level changes (toggle/view/clear) arrive via
  // onFiltersChange and land here once — no intermediate states.
  const controlledDefs = filterDefs.map((def) => ({
    ...def,
    value: active[def.key] ?? [],
  }));

  return (
    <section
      data-slot="list-with-search-and-filters"
      aria-label={label}
      className={cn(
        "kern-list-with-search-and-filters flex flex-col gap-3",
        className,
      )}
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
        label={label}
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
    </section>
  );
}
