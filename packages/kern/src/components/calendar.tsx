import {
  buildCalendarGrid,
  type CalendarKey,
  isCalendarDateDisabled,
  parseCalendarDate,
  resolveCalendarFocus,
  resolveCalendarMonthNames,
  resolveCalendarSelection,
  resolveLocaleFirstDay,
  shiftCalendarMonth,
  toCalendarDate,
  toCalendarMonth,
  useControllableState,
} from "@xoroh/axis";
import type { ComponentPropsWithRef } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type CalendarProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "onChange" | "value" | "defaultValue"
> & {
  /** Selected date at midnight local time. */
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  /** Earliest selectable date. */
  min?: Date;
  /** Latest selectable date. */
  max?: Date;
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toISO(date: Date): string {
  return toCalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
}

function fromISO(iso: string): Date {
  const parts = parseCalendarDate(iso);
  if (parts === null) return new Date();
  return new Date(parts.year, parts.monthIndex, parts.day);
}

const CALENDAR_KEYS: ReadonlySet<string> = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

/** Month calendar for single-date picking. Keyboard: arrows move the day. */
export function Calendar({
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  className,
  "aria-label": ariaLabel = "Calendar",
  ...props
}: CalendarProps) {
  const [value, setValue] = useControllableState<Date | undefined>(
    valueProp ? startOfDay(valueProp) : undefined,
    defaultValue ? startOfDay(defaultValue) : undefined,
    (next) => {
      if (next !== undefined) onValueChange?.(next);
    },
  );
  const [cursor, setCursor] = useState(() =>
    startOfDay(valueProp ?? defaultValue ?? new Date()),
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const focusCursorRef = useRef(false);

  // Effect intentionally keyed on cursor: after keyboard moves the cursor,
  // the newly tabbable day needs DOM focus. The cursor value itself is only
  // used as a change signal.
  // biome-ignore lint/correctness/useExhaustiveDependencies: cursor is a change signal, not a read value.
  useEffect(() => {
    if (!focusCursorRef.current) return;
    focusCursorRef.current = false;
    const active = gridRef.current?.querySelector<HTMLElement>(
      '[data-slot="calendar-day"][tabindex="0"]',
    );
    active?.focus();
  }, [cursor]);

  const firstDay = resolveLocaleFirstDay();
  const monthNames = useMemo(() => resolveCalendarMonthNames(), []);
  const selectedISO = value ? toISO(value) : null;
  const minISO = min ? toISO(min) : undefined;
  const maxISO = max ? toISO(max) : undefined;
  const monthKey = toCalendarMonth(cursor.getFullYear(), cursor.getMonth());

  const grid = useMemo(
    () =>
      buildCalendarGrid(monthKey, {
        firstDayOfWeek: firstDay,
        selected: selectedISO,
        minDate: minISO,
        maxDate: maxISO,
      }),
    [monthKey, firstDay, selectedISO, minISO, maxISO],
  );

  const [viewYear, viewMonth1Based] = monthKey.split("-").map(Number) as [
    number,
    number,
  ];
  const viewMonth = viewMonth1Based - 1;

  function pick(iso: string) {
    const resolved = resolveCalendarSelection(iso, {
      mode: "single",
      minDate: minISO,
      maxDate: maxISO,
    });
    if (resolved === null || resolved.value === null) return;
    const date = fromISO(resolved.value);
    setValue(date);
    setCursor(date);
  }

  function stepMonth(delta: -1 | 1) {
    const next = shiftCalendarMonth(viewYear, viewMonth, delta);
    setCursor(new Date(next.year, next.monthIndex, 1));
  }

  function onGridKeyDown(event: React.KeyboardEvent) {
    // Full grid traversal from the Axis model: arrows move within the
    // week and across rows, Home/End jump to row edges, PageUp/PageDown
    // move the same day across months (month-crossing, DST-safe, dir-aware).
    // The old Kern handler only knew the four arrows.
    if (!CALENDAR_KEYS.has(event.key)) return;
    event.preventDefault();
    const nextISO = resolveCalendarFocus(
      toISO(cursor),
      event.key as CalendarKey,
      {
        firstDayOfWeek: firstDay,
      },
    );
    if (nextISO === null) return;
    if (isCalendarDateDisabled(nextISO, { minDate: minISO, maxDate: maxISO }))
      return;
    focusCursorRef.current = true;
    setCursor(fromISO(nextISO));
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: labelled group owns the month grid; no native grouping element applies.
    <div
      data-slot="calendar"
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "kern-calendar w-72 rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) bg-(--sys-color-surface) p-3",
        className,
      )}
      {...props}
    >
      <div className="kern-calendar-header mb-2 flex items-center justify-between">
        <button
          data-slot="calendar-prev"
          type="button"
          aria-label="Previous month"
          onClick={() => stepMonth(-1)}
          className={
            "kern-calendar-nav flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-(--sys-color-on-surface) outline-none hover:bg-(--sys-color-surface-tonal) " +
            FOCUS_RING_CLASS
          }
        >
          ‹
        </button>
        <p
          data-slot="calendar-month"
          aria-live="polite"
          className="kern-calendar-month text-sm font-medium text-(--sys-color-on-surface)"
        >
          {monthNames[viewMonth]} {viewYear}
        </p>
        <button
          data-slot="calendar-next"
          type="button"
          aria-label="Next month"
          onClick={() => stepMonth(1)}
          className={
            "kern-calendar-nav flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-(--sys-color-on-surface) outline-none hover:bg-(--sys-color-surface-tonal) " +
            FOCUS_RING_CLASS
          }
        >
          ›
        </button>
      </div>
      {/* biome-ignore lint/a11y/useSemanticElements: ARIA grid pattern with roving-tabindex days. */}
      <div
        role="grid"
        ref={gridRef}
        aria-label={`${monthNames[viewMonth]} ${viewYear}`}
        onKeyDown={onGridKeyDown}
        className="kern-calendar-grid grid grid-cols-7 gap-0.5"
      >
        {grid.weekdayNames.map((day) => (
          // biome-ignore lint/a11y/useSemanticElements: grid column headers require the columnheader role.
          // biome-ignore lint/a11y/useFocusableInteractive: presentational header cell; days carry keyboard handling.
          <span
            key={day}
            role="columnheader"
            aria-hidden="true"
            className="flex h-8 items-center justify-center text-[11px] font-medium text-(--sys-color-on-surface-variant)"
          >
            {day}
          </span>
        ))}
        {grid.weeks.flatMap((week, weekIndex) =>
          week.map((cell, dayIndex) => {
            if (cell === null) {
              // Blank filler: the grid never reorders (static month layout),
              // so a positional key is stable by construction.
              return (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: grid position is the identity; blanks carry no data to key on.
                  key={`blank-${weekIndex}-${dayIndex}`}
                  aria-hidden="true"
                />
              );
            }
            const date = fromISO(cell.iso);
            const cursorISO = toISO(cursor);
            return (
              // biome-ignore lint/a11y/useSemanticElements: grid days are focusable gridcells per the ARIA grid pattern.
              <button
                key={cell.iso}
                data-slot="calendar-day"
                type="button"
                role="gridcell"
                aria-label={date.toDateString()}
                aria-selected={cell.selected}
                data-selected={cell.selected ? "" : undefined}
                disabled={cell.disabled}
                tabIndex={cell.iso === cursorISO ? 0 : -1}
                onClick={() => pick(cell.iso)}
                onFocus={() => setCursor(date)}
                className={
                  "kern-calendar-day relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm text-(--sys-color-on-surface) outline-none hover:bg-(--sys-color-surface-tonal) " +
                  // M3 date-picker targets are 48x48dp: the 40dp day box
                  // keeps a 4dp inset out to the minimum.
                  "after:absolute after:-inset-1 after:content-[''] " +
                  FOCUS_RING_CLASS +
                  " disabled:pointer-events-none disabled:opacity-30 data-selected:bg-(--sys-color-primary) data-selected:text-(--sys-color-on-primary)"
                }
              >
                {cell.day}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
