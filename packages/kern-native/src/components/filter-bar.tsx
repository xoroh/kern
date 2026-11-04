import { useState } from "react";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Button } from "./button";
import { Chip } from "./chip";

/**
 * Native FilterBar — the web `FilterBar` twin (CL-012; D925).
 *
 * Contract S (shared): `FilterDef[]` in, chips + saved views + host-sheet
 * trigger out, `toFilterQuery`/`fromFilterQuery`/`applyFilterDefs`
 * adapters identical. Platform N: the full filter surface is a host-owned
 * bottom `Sheet` (opened via `onOpenFilters`); sheet snap/physics come
 * from the system Sheet, never re-implemented here.
 */

export type NativeFilterOption = {
  value: string;
  label: string;
};

export type NativeFilterDef = {
  key: string;
  label: string;
  options: NativeFilterOption[];
  multi?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (next: string[]) => void;
};

export type NativeSavedView = {
  id: string;
  label: string;
  filters: Record<string, string[]>;
};

export type NativeActiveFilters = Record<string, string[]>;

export function toFilterQuery(active: NativeActiveFilters): string {
  const parts: string[] = [];
  for (const [key, values] of Object.entries(active)) {
    if (values.length > 0)
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(values.join(","))}`,
      );
  }
  return parts.length > 0 ? `?${parts.join("&")}` : "";
}

export function fromFilterQuery(search: string): NativeActiveFilters {
  const active: NativeActiveFilters = {};
  const query = search.replace(/^\?/, "");
  if (!query) return active;
  for (const pair of query.split("&")) {
    const separator = pair.indexOf("=");
    if (separator < 0) continue;
    const key = decodeURIComponent(pair.slice(0, separator));
    const values = decodeURIComponent(pair.slice(separator + 1))
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (values.length > 0) active[key] = values;
  }
  return active;
}

export function applyFilterDefs<T>(
  rows: T[],
  defs: NativeFilterDef[],
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

export type NativeFilterBarProps = Omit<ViewProps, "children" | "style"> & {
  filters: NativeFilterDef[];
  savedViews?: NativeSavedView[];
  activeViewId?: string;
  onSavedViewSelect?: (view: NativeSavedView | undefined) => void;
  onFiltersChange?: (active: NativeActiveFilters) => void;
  /** Opens the host-owned full filter sheet. */
  onOpenFilters?: () => void;
  openFiltersLabel?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function mergeActive(filters: NativeFilterDef[]): NativeActiveFilters {
  const active: NativeActiveFilters = {};
  for (const def of filters) {
    const values = def.value ?? def.defaultValue ?? [];
    if (values.length > 0) active[def.key] = values;
  }
  return active;
}

export function FilterBar({
  filters,
  savedViews = [],
  activeViewId,
  onSavedViewSelect,
  onFiltersChange,
  onOpenFilters,
  openFiltersLabel = "All filters",
  accessibilityLabel = "Filters",
  style,
  testID,
  ...props
}: NativeFilterBarProps) {
  const [internal, setInternal] = useState<Record<string, string[]>>({});
  const [activeView, setActiveView] = useState<string | undefined>(
    activeViewId,
  );

  function valuesOf(def: NativeFilterDef): string[] {
    return def.value ?? internal[def.key] ?? def.defaultValue ?? [];
  }

  function commit(def: NativeFilterDef, next: string[]) {
    if (def.value === undefined) {
      setInternal((prev) => ({ ...prev, [def.key]: next }));
    }
    def.onValueChange?.(next);
    const merged = mergeActive(
      filters.map((entry) =>
        entry.key === def.key ? { ...entry, value: next } : entry,
      ),
    );
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

  function toggle(def: NativeFilterDef, option: string) {
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

  function selectView(view: NativeSavedView | undefined) {
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
    <View
      {...props}
      testID={testID ?? "kern-filter-bar"}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="toolbar"
      style={[{ flexDirection: "row", flexWrap: "wrap", gap: 8 }, style]}
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
      {filters.map((def) => (
        <View
          key={def.key}
          accessibilityLabel={def.label}
          style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
        >
          {def.options.map((option) => (
            <Chip
              key={option.value}
              variant="filter"
              value={valuesOf(def).includes(option.value)}
              onValueChange={() => toggle(def, option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </View>
      ))}
      {onOpenFilters ? (
        <Button variant="outlined" onPress={onOpenFilters}>
          {`${openFiltersLabel}${activeCount > 0 ? ` (${activeCount})` : ""}`}
        </Button>
      ) : null}
      {activeCount > 0 ? (
        <Button variant="text" onPress={clearAll}>
          Clear all
        </Button>
      ) : null}
    </View>
  );
}
