import { Fragment, type ReactNode, useMemo, useState } from "react";
import { cn } from "../utils/cn";
import { Checkbox } from "./checkbox";
import { EmptyState } from "./empty-state";
import { ListItem } from "./list-item";
import { Skeleton } from "./skeleton";

/**
 * KernList — the ONE list (CL-007/CL-012 adopter; D925).
 *
 * M3: https://m3.material.io/components/lists/overview — one/two/three-line
 * rows, leading/trailing slots, single/multi-select (one selection control
 * per item), dividers between rows. Item heights 56/72/88dp map to the
 * `density` prop (compact/medium/expanded).
 *
 * Port sources (OSI only): material-web list anatomy (Apache-2.0,
 * https://github.com/material-components/material-web/blob/main/LICENSE);
 * Paper List + Divider (MIT,
 * https://github.com/callstack/react-native-paper/blob/main/LICENSE.md).
 *
 * The list is presentational: rows in, `<ul>` out. Filtering, pagination and
 * virtualization are pure adapters + hooks in this file so the native twin
 * shares the contract without sharing DOM.
 */

/** Row density: M3 item heights 56/72/88dp by tallest element. */
export type ListDensity = "compact" | "medium" | "expanded";

/**
 * The 10 list layouts. One component, ten ways (Faroeq's "1 list used 10
 * ways") — each variant is a row-rendering preset over the same `ListRow`
 * data, unifying the per-app list copies from inventory (dispatch queues,
 * booking lists, contact rows, activity rows, ticket rows):
 *
 * - `one-line` / `two-line`: display rows, headline (+ supporting).
 * - `avatar` / `icon` / `thumbnail`: leading-media rows (photo disc, tonal
 *   icon container, 56dp media).
 * - `navigational`: link rows with a trailing chevron.
 * - `selectable`: checkbox leading + multi/single selection state.
 * - `expandable`: disclosure row with a collapsible panel.
 * - `control`: static row with a trailing interactive control (switch, …).
 * - `grouped`: sectioned rows with headers + dividers.
 */
export type ListVariant =
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

export type ListRow = {
  /** Stable id: selection, expansion and keys. */
  id: string;
  headline: ReactNode;
  supporting?: ReactNode;
  /** Leading media node (avatar, icon, thumbnail, …). */
  leading?: ReactNode;
  /** Trailing node (metadata, control, action). */
  trailing?: ReactNode;
  /** Navigation target — renders a link row. */
  href?: string;
  disabled?: boolean;
  /** Panel content for the `expandable` variant. */
  panel?: ReactNode;
};

export type ListSection = {
  id: string;
  /** Section header label. */
  title: ReactNode;
  rows: ListRow[];
};

export type ListSelectionMode = "single" | "multiple";

const densityRowClass: Record<ListDensity, string | undefined> = {
  // ListItem defaults to min-h-14 (56dp); compact tightens, expanded opens
  // to the 88dp three-line band. tailwind-merge resolves the min-h conflict.
  compact: "min-h-12",
  medium: undefined,
  expanded: "min-h-22",
};

const leadingMediaClass: Partial<Record<ListVariant, string>> = {
  avatar: "size-10 overflow-hidden rounded-full",
  icon: "flex size-10 items-center justify-center rounded-full bg-(--sys-color-surface-container-highest) text-(--sys-color-on-surface-variant)",
  thumbnail:
    "h-14 w-14 overflow-hidden rounded-(--sys-shape-corner-extra-small)",
};

function ChevronIcon({ expanded = false }: { expanded?: boolean }) {
  return (
    <svg
      data-slot="list-chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "size-5 shrink-0 text-(--sys-color-on-surface-variant)",
        expanded && "rotate-90",
      )}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function rowText(row: ListRow): string {
  return [row.headline, row.supporting]
    .filter((part) => typeof part === "string")
    .join(" ");
}

/**
 * Case-insensitive substring filter over headline + supporting text.
 * Non-string nodes are skipped (never stringified) — a row whose text lives
 * in a custom node stays visible rather than matching "[object Object]".
 */
export function filterListRows(
  rows: ListRow[],
  query: string,
  extra?: (row: ListRow) => string[],
): ListRow[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) =>
    [rowText(row), ...(extra?.(row) ?? [])].some((text) =>
      text.toLowerCase().includes(needle),
    ),
  );
}

/** Paginate a row array: 1-based page, clamped. */
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

/** Group rows into sections by a key selector (the `grouped` adapter). */
export function sectionListRows(
  rows: ListRow[],
  getSection: (row: ListRow) => string,
): ListSection[] {
  const order: string[] = [];
  const groups = new Map<string, ListRow[]>();
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

/**
 * Windowing math for virtualized long lists: which row indexes intersect
 * `[scrollTop, scrollTop + viewportHeight)`. Pure so both renderers + tests
 * share it; the caller slices rows and renders spacers.
 */
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

/** Memoized query filter for list rows. */
export function useListQuery(
  rows: ListRow[],
  query: string,
  extra?: (row: ListRow) => string[],
): ListRow[] {
  return useMemo(
    () => filterListRows(rows, query, extra),
    [rows, query, extra],
  );
}

/** Controlled/uncontrolled 1-based pagination over a row count. */
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

export type ListProps = {
  /** Flat rows. Ignored when `sections` is passed (grouped data wins). */
  rows?: ListRow[];
  /** Sectioned rows for the `grouped` variant. */
  sections?: ListSection[];
  variant?: ListVariant;
  density?: ListDensity;
  /** Accessible name for the list landmark. */
  label?: string;
  /** Selection state (selectable variant; also honored elsewhere). */
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedChange?: (ids: string[]) => void;
  selectionMode?: ListSelectionMode;
  /** Expansion state (expandable variant). */
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Row activation (navigational rows navigate via `href` instead). */
  onRowPress?: (id: string) => void;
  /** Loading state: skeleton rows + a polite status. */
  loading?: boolean;
  loadingRows?: number;
  /** Empty state node. Defaults to an `EmptyState`. */
  emptyState?: ReactNode;
  /** Escape hatch: full control over one row's rendering. */
  renderRow?: (row: ListRow, index: number) => ReactNode;
  className?: string;
};

/** The one list: 10 layout variants over one row model. */
export function List({
  rows = [],
  sections,
  variant = "two-line",
  density = "medium",
  label,
  selectedIds: selectedProp,
  defaultSelectedIds = [],
  onSelectedChange,
  selectionMode = "multiple",
  expandedIds: expandedProp,
  defaultExpandedIds = [],
  onExpandedChange,
  onRowPress,
  loading = false,
  loadingRows = 3,
  emptyState,
  renderRow,
  className,
}: ListProps) {
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
  }

  function toggleExpanded(id: string) {
    const next = expanded.includes(id)
      ? expanded.filter((entry) => entry !== id)
      : [...expanded, id];
    if (expandedProp === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  }

  if (loading) {
    return (
      <div data-slot="list-loading">
        <span role="status" className="sr-only">
          Loading list
        </span>
        <ul aria-busy="true" aria-label={label} className={className}>
          {Array.from({ length: Math.max(loadingRows, 1) }, (_, index) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders with no identity — never reordered.
              key={index}
              aria-hidden="true"
              className="px-4 py-2"
            >
              <Skeleton className="h-10 w-full" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const flatRows = sections ? sections.flatMap((s) => s.rows) : rows;
  if (flatRows.length === 0) {
    return (
      <div data-slot="list-empty">
        {emptyState ?? <EmptyState title="No items" />}
      </div>
    );
  }

  function renderOne(row: ListRow, index: number): ReactNode {
    if (renderRow) return renderRow(row, index);
    const rowClass = densityRowClass[density];
    const isSelected = selected.includes(row.id);
    const isExpanded = expanded.includes(row.id);
    const mediaClass = leadingMediaClass[variant];

    // Selectable rows are named checkbox rows, NOT ListItem-leading
    // checkboxes: ListItem marks its leading slot aria-hidden (decorative
    // by contract), which would hide a control from assistive tech. One
    // control per item (M3): the checkbox carries the name, the text stays
    // static beside it.
    if (variant === "selectable") {
      const name =
        typeof row.headline === "string"
          ? `Select ${row.headline}`
          : `Select row ${row.id}`;
      return (
        <li
          key={row.id}
          data-slot="list-item"
          data-selected={isSelected || undefined}
          className={cn(
            "kern-list-item flex min-h-14 w-full items-center gap-3 px-4 py-2 text-left text-(--sys-color-on-surface)",
            "data-selected:bg-(--sys-color-secondary-container) data-selected:text-(--sys-color-on-secondary-container) data-selected:rounded-(--sys-shape-corner-large)",
            rowClass,
          )}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => {
              if (!row.disabled) toggleSelected(row.id);
            }}
            disabled={row.disabled}
            aria-label={name}
          />
          <span className="kern-list-item-text flex min-w-0 flex-1 flex-col">
            <span className="kern-list-item-headline truncate text-sm">
              {row.headline}
            </span>
            {row.supporting ? (
              <span className="kern-list-item-supporting truncate text-xs text-(--sys-color-on-surface-variant)">
                {row.supporting}
              </span>
            ) : null}
          </span>
          {row.trailing ? (
            <span
              data-slot="list-item-trailing"
              className="kern-list-item-trailing flex shrink-0 items-center gap-2 text-xs text-(--sys-color-on-surface-variant)"
            >
              {row.trailing}
            </span>
          ) : null}
        </li>
      );
    }

    const leading = row.leading ? (
      mediaClass ? (
        <span className={mediaClass}>{row.leading}</span>
      ) : (
        row.leading
      )
    ) : undefined;

    if (variant === "expandable") {
      // Static row + trailing disclosure button: ListItem forwards extra
      // props only on static rows, and a trigger nested inside a row-button
      // would be invalid HTML — so the chevron is its own control. The
      // panel is a SIBLING li, never a nested one (axe: aria-required-parent).
      return (
        <Fragment key={row.id}>
          <ListItem
            headline={row.headline}
            supporting={row.supporting}
            leading={leading ?? row.leading}
            trailing={
              <button
                type="button"
                data-slot="list-expandable-trigger"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${typeof row.headline === "string" ? row.headline : row.id}`}
                onClick={() => toggleExpanded(row.id)}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full text-(--sys-color-on-surface-variant) outline-none hover:bg-(--sys-color-surface-tonal) focus-visible:ring-2 focus-visible:ring-(--sys-color-secondary)"
              >
                <ChevronIcon expanded={isExpanded} />
              </button>
            }
            className={rowClass}
          />
          {isExpanded && row.panel ? (
            <li
              data-slot="list-expandable-panel"
              className="kern-list-panel px-4 py-3 text-sm text-(--sys-color-on-surface-variant)"
            >
              {row.panel}
            </li>
          ) : null}
        </Fragment>
      );
    }

    if (variant === "control") {
      return (
        <ListItem
          key={row.id}
          headline={row.headline}
          supporting={row.supporting}
          leading={leading ?? row.leading}
          trailing={row.trailing}
          className={rowClass}
        />
      );
    }

    const pressable = onRowPress ? () => onRowPress(row.id) : undefined;

    return (
      <ListItem
        key={row.id}
        headline={row.headline}
        supporting={variant === "one-line" ? undefined : row.supporting}
        leading={leading ?? row.leading}
        trailing={
          row.trailing ??
          (variant === "navigational" ? <ChevronIcon /> : undefined)
        }
        href={row.href}
        onPress={pressable}
        disabled={row.disabled}
        selected={isSelected}
        className={rowClass}
      />
    );
  }

  if (sections) {
    return (
      <div data-slot="list" data-variant={variant} className={className}>
        {sections.map((section) => (
          <section
            key={section.id}
            aria-label={
              typeof section.title === "string" ? section.title : section.id
            }
          >
            <h3
              data-slot="list-section-header"
              className="kern-list-section-header px-4 pt-4 pb-1 text-xs font-medium tracking-wide text-(--sys-color-on-surface-variant) uppercase"
            >
              {section.title}
            </h3>
            <ul
              aria-label={label}
              className="kern-list divide-y divide-(--sys-color-outline-variant)"
            >
              {section.rows.map((row, index) => renderOne(row, index))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  return (
    <ul
      data-slot="list"
      data-variant={variant}
      aria-label={label}
      className={cn(
        "kern-list divide-y divide-(--sys-color-outline-variant)",
        className,
      )}
    >
      {rows.map((row, index) => renderOne(row, index))}
    </ul>
  );
}
