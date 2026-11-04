import { type ReactNode, useMemo, useState } from "react";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";
import { Checkbox } from "./checkbox";
import { EmptyState } from "./empty-state";
import { ListItem } from "./list-item";
import { Skeleton } from "./skeleton";
import { Text } from "./text";

/**
 * Native List — the web `List` twin (CL-007/CL-012; D925).
 *
 * Contract S (shared with `@xoroh/kern` `List`): the same 10 `variant`
 * values, the same density bands, the same row/section/selection/expansion
 * model, the same pure adapters (`filterListRows`, `paginateListRows`,
 * `sectionListRows`, `virtualWindow`) and hooks (`useListQuery`,
 * `usePagination`). Only the renderer differs (View/Pressable, no DOM).
 *
 * Platform N (this file):
 * - Rows are string-typed (`title`/`supporting`): native Text has no DOM
 *   inheritance for slotted nodes, so rich nodes stay in leading/trailing.
 * - `onHaptic` injection: the host wires platform haptics (expo-haptics);
 *   Kern never imports it (no native-module dependency in the renderer).
 * - Grouped metrics: 48dp touch targets on triggers (hitSlop), section
 *   headers as `Text` with label variant.
 */

export type NativeListDensity = "compact" | "medium" | "expanded";

export type NativeListVariant =
  | "one-line"
  | "two-line"
  | "avatar"
  | "icon"
  | "thumbnail"
  | "navigational"
  | "selectable"
  | "expandable"
  | "control"
  | "grouped";

export type NativeListRow = {
  id: string;
  title: string;
  supporting?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  disabled?: boolean;
  panel?: ReactNode;
};

export type NativeListSection = {
  id: string;
  title: string;
  rows: NativeListRow[];
};

export type NativeListSelectionMode = "single" | "multiple";

/** Haptic moments the host may wire to expo-haptics (or ignore). */
export type NativeListHapticEvent = "select" | "expand" | "press";

const densityMinHeight: Record<NativeListDensity, number> = {
  compact: 48,
  medium: 56,
  expanded: 88,
};

function rowText(row: NativeListRow): string {
  return [row.title, row.supporting].filter(Boolean).join(" ");
}

export function filterListRows(
  rows: NativeListRow[],
  query: string,
  extra?: (row: NativeListRow) => string[],
): NativeListRow[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) =>
    [rowText(row), ...(extra?.(row) ?? [])].some((text) =>
      text.toLowerCase().includes(needle),
    ),
  );
}

export function paginateListRows<T>(
  rows: T[],
  page: number,
  pageSize: number,
): { pageRows: T[]; pageCount: number; page: number } {
  const safeSize = Math.max(pageSize, 1);
  const pageCount = Math.max(Math.ceil(rows.length / safeSize), 1);
  const safePage = Math.min(Math.max(page, 1), pageCount);
  return {
    pageRows: rows.slice((safePage - 1) * safeSize, safePage * safeSize),
    pageCount,
    page: safePage,
  };
}

export function sectionListRows(
  rows: NativeListRow[],
  getSection: (row: NativeListRow) => string,
): NativeListSection[] {
  const order: string[] = [];
  const groups = new Map<string, NativeListRow[]>();
  for (const row of rows) {
    const key = getSection(row);
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)?.push(row);
  }
  return order.map((title) => ({
    id: title,
    title,
    rows: groups.get(title) ?? [],
  }));
}

export function virtualWindow(
  count: number,
  rowHeight: number,
  viewportHeight: number,
  scrollTop: number,
  overscan = 3,
): { start: number; end: number } {
  const safeRow = Math.max(rowHeight, 1);
  const start = Math.max(Math.floor(scrollTop / safeRow) - overscan, 0);
  const end = Math.min(
    Math.ceil((scrollTop + Math.max(viewportHeight, 1)) / safeRow) + overscan,
    Math.max(count, 0),
  );
  return { start, end };
}

export function useListQuery(
  rows: NativeListRow[],
  query: string,
  extra?: (row: NativeListRow) => string[],
): NativeListRow[] {
  return useMemo(
    () => filterListRows(rows, query, extra),
    [rows, query, extra],
  );
}

export function usePagination(
  count: number,
  pageSize: number,
  value?: number,
  onValueChange?: (page: number) => void,
): { page: number; pageCount: number; go: (page: number) => void } {
  const [internal, setInternal] = useState(1);
  const { page, pageCount } = paginateListRows(
    Array.from({ length: count }),
    value ?? internal,
    pageSize,
  );
  function go(next: number) {
    const clamped = Math.min(Math.max(next, 1), pageCount);
    if (value === undefined) setInternal(clamped);
    onValueChange?.(clamped);
  }
  return { page, pageCount, go };
}

export type NativeListProps = Omit<ViewProps, "children" | "style"> & {
  rows?: NativeListRow[];
  sections?: NativeListSection[];
  variant?: NativeListVariant;
  density?: NativeListDensity;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedChange?: (ids: string[]) => void;
  selectionMode?: NativeListSelectionMode;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  onRowPress?: (id: string) => void;
  /** Haptic injection: fired on select/expand/press (host wires expo-haptics). */
  onHaptic?: (event: NativeListHapticEvent) => void;
  loading?: boolean;
  loadingRows?: number;
  emptyState?: ReactNode;
};

export function List({
  rows = [],
  sections,
  variant = "two-line",
  density = "medium",
  accessibilityLabel,
  style,
  testID,
  selectedIds: selectedProp,
  defaultSelectedIds = [],
  onSelectedChange,
  selectionMode = "multiple",
  expandedIds: expandedProp,
  defaultExpandedIds = [],
  onExpandedChange,
  onRowPress,
  onHaptic,
  loading = false,
  loadingRows = 3,
  emptyState,
  ...props
}: NativeListProps) {
  const { scheme } = useKernTheme();
  const [internalSelected, setInternalSelected] = useState(defaultSelectedIds);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpandedIds);
  const selected = selectedProp ?? internalSelected;
  const expanded = expandedProp ?? internalExpanded;

  function toggleSelected(id: string) {
    const next =
      selectionMode === "single"
        ? selected.includes(id)
          ? []
          : [id]
        : selected.includes(id)
          ? selected.filter((entry) => entry !== id)
          : [...selected, id];
    if (selectedProp === undefined) setInternalSelected(next);
    onSelectedChange?.(next);
    onHaptic?.("select");
  }

  function toggleExpanded(id: string) {
    const next = expanded.includes(id)
      ? expanded.filter((entry) => entry !== id)
      : [...expanded, id];
    if (expandedProp === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
    onHaptic?.("expand");
  }

  function pressRow(row: NativeListRow) {
    if (row.disabled) return;
    onRowPress?.(row.id);
    onHaptic?.("press");
  }

  if (loading) {
    return (
      <View
        {...props}
        testID={testID ?? "kern-list"}
        accessibilityLabel={accessibilityLabel ?? "Loading list"}
        accessibilityRole="progressbar"
        style={style}
      >
        {Array.from({ length: Math.max(loadingRows, 1) }, (_, index) => (
          <Skeleton
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders with no identity — never reordered.
            key={index}
            style={{ height: densityMinHeight[density], marginVertical: 4 }}
          />
        ))}
      </View>
    );
  }

  const flatRows = sections ? sections.flatMap((s) => s.rows) : rows;
  if (flatRows.length === 0) {
    return (
      <View {...props} testID={testID ?? "kern-list"} style={style}>
        {emptyState ?? <EmptyState title="No items" />}
      </View>
    );
  }

  function renderOne(row: NativeListRow): ReactNode {
    const isSelected = selected.includes(row.id);
    const isExpanded = expanded.includes(row.id);
    const minHeight = densityMinHeight[density];

    if (variant === "selectable") {
      // Labelled checkbox row: one control, whole row tappable through the
      // checkbox's 48dp target. Mirrors the web twin's label-row semantics.
      return (
        <View
          key={row.id}
          testID={`kern-list-row-${row.id}`}
          style={{
            minHeight,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 8,
            gap: 12,
            backgroundColor: isSelected
              ? scheme.color.secondaryContainer
              : "transparent",
            borderRadius: isSelected
              ? Number.parseFloat(scheme.shape.large)
              : 0,
          }}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => {
              if (!row.disabled) toggleSelected(row.id);
            }}
            disabled={row.disabled}
            accessibilityLabel={`Select ${row.title}`}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: isSelected
                  ? scheme.color.onSecondaryContainer
                  : scheme.color.onSurface,
              }}
            >
              {row.title}
            </Text>
            {row.supporting ? (
              <Text style={{ color: scheme.color.onSurfaceVariant }}>
                {row.supporting}
              </Text>
            ) : null}
          </View>
          {row.trailing}
        </View>
      );
    }

    if (variant === "expandable") {
      return (
        <View key={row.id} testID={`kern-list-row-${row.id}`}>
          <ListItem
            title={row.title}
            supporting={row.supporting}
            leading={row.leading}
            trailing={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${isExpanded ? "Collapse" : "Expand"} ${row.title}`}
                accessibilityState={{ expanded: isExpanded }}
                disabled={row.disabled}
                hitSlop={8}
                onPress={() => toggleExpanded(row.id)}
                style={{
                  minHeight: 48,
                  minWidth: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: scheme.color.onSurfaceVariant }}>
                  {isExpanded ? "▾" : "▸"}
                </Text>
              </Pressable>
            }
            contentStyle={{ minHeight }}
          />
          {isExpanded && row.panel ? (
            <View
              testID={`kern-list-panel-${row.id}`}
              style={{ paddingHorizontal: 16, paddingVertical: 12 }}
            >
              {typeof row.panel === "string" ? (
                <Text style={{ color: scheme.color.onSurfaceVariant }}>
                  {row.panel}
                </Text>
              ) : (
                row.panel
              )}
            </View>
          ) : null}
        </View>
      );
    }

    if (variant === "control") {
      return (
        <ListItem
          key={row.id}
          title={row.title}
          supporting={row.supporting}
          leading={row.leading}
          trailing={row.trailing}
          testID={`kern-list-row-${row.id}`}
          contentStyle={{ minHeight }}
        />
      );
    }

    return (
      <ListItem
        key={row.id}
        title={row.title}
        supporting={variant === "one-line" ? undefined : row.supporting}
        leading={row.leading}
        trailing={
          row.trailing ??
          (variant === "navigational" ? (
            <Text style={{ color: scheme.color.onSurfaceVariant }}>›</Text>
          ) : undefined)
        }
        selected={isSelected}
        disabled={row.disabled}
        onPress={onRowPress ? () => pressRow(row) : undefined}
        testID={`kern-list-row-${row.id}`}
        contentStyle={{ minHeight }}
      />
    );
  }

  if (sections) {
    return (
      <View {...props} testID={testID ?? "kern-list"} style={style}>
        {sections.map((section) => (
          <View key={section.id}>
            <Text
              variant="label"
              style={{
                color: scheme.color.onSurfaceVariant,
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 4,
                textTransform: "uppercase",
              }}
            >
              {section.title}
            </Text>
            {section.rows.map((row) => renderOne(row))}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View
      {...props}
      testID={testID ?? "kern-list"}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          borderTopWidth: 0,
          borderBottomColor: scheme.color.outlineVariant,
        },
        style,
      ]}
    >
      {rows.map((row) => renderOne(row))}
    </View>
  );
}
