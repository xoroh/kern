import { type ReactNode, useState } from "react";
import { cn } from "../utils/cn";
import { Button } from "./button";
import { Chip } from "./chip";

/**
 * FilterBar — the filter half of CL-012 (D925).
 *
 * M3: https://m3.material.io/components/chips/overview — filter chips are
 * the M3 selection control for faceted filtering (elevated on scroll,
 * checkmark when selected). The bar unifies the inventory copies
 * (CMP-2458/2459 booking FilterButton/Modal/SearchFilterBar, CMP-0562 desk
 * FilterBar, CMP-0946 SupportTicketFilters, CMP-2032 TripFilterBar,
 * CMP-1723/2622 StatusFilters): one `FilterDef[]` contract in, chips +
 * saved views + a host-owned modal/sheet trigger out.
 *
 * The modal/sheet itself is host-owned on purpose: web shows a dialog,
 * native a bottom sheet, and both are already solved (`Dialog` / `Sheet`).
 * FilterBar owns the chips, the active-filter model and the query adapter —
 * never a second overlay.
 */

export type FilterOption = {
  value: string;
  label: ReactNode;
};

export type FilterDef = {
  /** Stable key: the query-adapter field name. */
  key: string;
  label: string;
  options: FilterOption[];
  /** Multi-select (default) vs single-select facet. */
  multi?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (next: string[]) => void;
};

export type SavedView = {
  id: string;
  label: string;
  filters: Record<string, string[]>;
};

export type ActiveFilters = Record<string, string[]>;

/** `FilterDef[]` -> URL query string (`?status=live,done&plan=pro`). */
export function toFilterQuery(active: ActiveFilters): string {
  const params = new URLSearchParams();
  for (const [key, values] of Object.entries(active)) {
    if (values.length > 0) params.set(key, values.join(","));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** URL query string -> `FilterDef[]` values. Unknown keys pass through. */
export function fromFilterQuery(search: string): ActiveFilters {
  const params = new URLSearchParams(search.replace(/^\?/, ""));
  const active: ActiveFilters = {};
  params.forEach((raw, key) => {
    const values = raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (values.length > 0) active[key] = values;
  });
  return active;
}

/**
 * Facet a generic row array by the active filters. `getValue` is the data
 * adapter: how one row exposes one facet as one (or many) comparable
 * strings. A row matches when, for every ACTIVE facet, at least one of its
 * values is selected.
 */
export function applyFilterDefs<T>(
  rows: T[],
  defs: FilterDef[],
  getValue: (row: T, key: string) => string | string[] | null | undefined,
): T[] {
  const active = new Map<string, string[]>();
  for (const def of defs) {
    const values = def.value ?? def.defaultValue ?? [];
    if (values.length > 0) active.set(def.key, values);
  }
  if (active.size === 0) return rows;
  return rows.filter((row) =>
    [...active.entries()].every(([key, selected]) => {
      const exposed = getValue(row, key);
      const values = Array.isArray(exposed)
        ? exposed
        : exposed === null || exposed === undefined
          ? []
          : [exposed];
      return values.some((value) => selected.includes(value));
    }),
  );
}

export type FilterBarProps = {
  filters: FilterDef[];
  /** Saved views (bookings "Today", tickets "Mine", …). */
  savedViews?: SavedView[];
  activeViewId?: string;
  onSavedViewSelect?: (view: SavedView | undefined) => void;
  /** Fired with the merged active model on every toggle/clear. */
  onFiltersChange?: (active: ActiveFilters) => void;
  /** Opens the host-owned full filter modal (W) / sheet (N). */
  onOpenFilters?: () => void;
  openFiltersLabel?: string;
  /** Accessible name for the filter toolbar. */
  label?: string;
  className?: string;
};

function mergeActive(filters: FilterDef[]): ActiveFilters {
  const active: ActiveFilters = {};
  for (const def of filters) {
    const values = def.value ?? def.defaultValue ?? [];
    if (values.length > 0) active[def.key] = values;
  }
  return active;
}

/** Filter chips + saved views + host-sheet trigger. */
export function FilterBar({
  filters,
  savedViews = [],
  activeViewId,
  onSavedViewSelect,
  onFiltersChange,
  onOpenFilters,
  openFiltersLabel = "All filters",
  label = "Filters",
  className,
}: FilterBarProps) {
  const [internal, setInternal] = useState<Record<string, string[]>>({});
  const [activeView, setActiveView] = useState<string | undefined>(
    activeViewId,
  );

  function valuesOf(def: FilterDef): string[] {
    return def.value ?? internal[def.key] ?? def.defaultValue ?? [];
  }

  function commit(def: FilterDef, next: string[]) {
    if (def.value === undefined) {
      setInternal((prev) => ({ ...prev, [def.key]: next }));
    }
    def.onValueChange?.(next);
    const merged = mergeActive(
      filters.map((entry) =>
        entry.key === def.key ? { ...entry, value: next } : entry,
      ),
    );
    // Merge uncontrolled siblings: defs without `value` read from state.
    for (const entry of filters) {
      if (entry.key !== def.key && entry.value === undefined) {
        const current = internal[entry.key] ?? entry.defaultValue ?? [];
        if (current.length > 0) merged[entry.key] = current;
      }
    }
    onFiltersChange?.(merged);
    if (activeView !== undefined) {
      setActiveView(undefined);
      onSavedViewSelect?.(undefined);
    }
  }

  function toggle(def: FilterDef, option: string) {
    const current = valuesOf(def);
    if (def.multi === false) {
      commit(def, current.includes(option) ? [] : [option]);
    } else {
      commit(
        def,
        current.includes(option)
          ? current.filter((value) => value !== option)
          : [...current, option],
      );
    }
  }

  function clearAll() {
    for (const def of filters) {
      if (def.value === undefined) {
        setInternal((prev) => ({ ...prev, [def.key]: [] }));
      }
      def.onValueChange?.([]);
    }
    onFiltersChange?.({});
    setActiveView(undefined);
    onSavedViewSelect?.(undefined);
  }

  function selectView(view: SavedView | undefined) {
    setActiveView(view?.id);
    if (view) {
      for (const def of filters) {
        const next = view.filters[def.key] ?? [];
        if (def.value === undefined) {
          setInternal((prev) => ({ ...prev, [def.key]: next }));
        }
        def.onValueChange?.(next);
      }
      onFiltersChange?.(view.filters);
      onSavedViewSelect?.(view);
    } else {
      clearAll();
    }
  }

  const activeCount = filters.reduce(
    (total, def) => total + valuesOf(def).length,
    0,
  );

  return (
    <div
      data-slot="filter-bar"
      role="toolbar"
      aria-label={label}
      className={cn(
        "kern-filter-bar flex flex-wrap items-center gap-2",
        className,
      )}
    >
      {savedViews.length > 0 ? (
        // biome-ignore lint/a11y/useSemanticElements: labelled chip group; no native grouping element applies.
        <div
          data-slot="filter-bar-views"
          role="group"
          aria-label="Saved views"
          className="flex flex-wrap items-center gap-2"
        >
          {savedViews.map((view) => (
            <Chip
              key={view.id}
              variant="filter"
              value={activeView === view.id}
              onValueChange={(next) => selectView(next ? view : undefined)}
            >
              {view.label}
            </Chip>
          ))}
        </div>
      ) : null}
      {filters.map((def) => (
        // biome-ignore lint/a11y/useSemanticElements: labelled facet chip group; no native grouping element applies.
        <div
          key={def.key}
          data-slot="filter-bar-facet"
          role="group"
          aria-label={def.label}
          className="flex flex-wrap items-center gap-2"
        >
          {def.options.map((option) => {
            const selected = valuesOf(def).includes(option.value);
            return (
              <Chip
                key={option.value}
                variant="filter"
                value={selected}
                onValueChange={() => toggle(def, option.value)}
              >
                {option.label}
              </Chip>
            );
          })}
        </div>
      ))}
      {onOpenFilters ? (
        <Button variant="outlined" size="sm" onClick={onOpenFilters}>
          {openFiltersLabel}
          {activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      ) : null}
      {activeCount > 0 ? (
        <Button variant="text" size="sm" onClick={clearAll}>
          Clear all
        </Button>
      ) : null}
    </div>
  );
}
