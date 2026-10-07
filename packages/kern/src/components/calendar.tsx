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

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

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
  const [internal, setInternal] = useState(() =>
    startOfDay(defaultValue ?? valueProp ?? new Date()),
  );
  const [cursor, setCursor] = useState(() =>
    startOfDay(valueProp ?? defaultValue ?? new Date()),
  );
  const value = valueProp ? startOfDay(valueProp) : internal;
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
  const viewYear = cursor.getFullYear();
  const viewMonth = cursor.getMonth();
  const minDay = min ? startOfDay(min) : undefined;
  const maxDay = max ? startOfDay(max) : undefined;

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1).getDay();
    const days = new Date(viewYear, viewMonth + 1, 0).getDate();
    const out: { key: string; date: Date | null }[] = [];
    for (let day = 1 - first; day <= days; day++)
      out.push({
        key: `day-${viewYear}-${viewMonth}-${day}`,
        date: day < 1 ? null : new Date(viewYear, viewMonth, day),
      });
    return out;
  }, [viewYear, viewMonth]);

  function pick(date: Date) {
    if (valueProp === undefined) setInternal(date);
    setCursor(date);
    onValueChange?.(date);
  }

  function onGridKeyDown(event: React.KeyboardEvent) {
    const delta = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    }[event.key] as number | undefined;
    if (delta === undefined) return;
    event.preventDefault();
    const next = new Date(cursor);
    next.setDate(next.getDate() + delta);
    if (minDay && next < minDay) return;
    if (maxDay && next > maxDay) return;
    focusCursorRef.current = true;
    setCursor(next);
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: labelled group owns the month grid; no native grouping element applies.
    <div
      data-slot="calendar"
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "kern-calendar w-72 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) p-3",
        className,
      )}
      {...props}
    >
      <div className="kern-calendar-header mb-2 flex items-center justify-between">
        <button
          data-slot="calendar-prev"
          type="button"
          aria-label="Previous month"
          onClick={() => setCursor(new Date(viewYear, viewMonth - 1, 1))}
          className={"kern-calendar-nav flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-(--md-sys-color-on-surface) outline-none hover:bg-(--md-sys-color-surface-tonal) " + FOCUS_RING_CLASS}
        >
          ‹
        </button>
        <p
          data-slot="calendar-month"
          aria-live="polite"
          className="kern-calendar-month text-sm font-medium text-(--md-sys-color-on-surface)"
        >
          {MONTHS[viewMonth]} {viewYear}
        </p>
        <button
          data-slot="calendar-next"
          type="button"
          aria-label="Next month"
          onClick={() => setCursor(new Date(viewYear, viewMonth + 1, 1))}
          className={"kern-calendar-nav flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-(--md-sys-color-on-surface) outline-none hover:bg-(--md-sys-color-surface-tonal) " + FOCUS_RING_CLASS}
        >
          ›
        </button>
      </div>
      {/* biome-ignore lint/a11y/useSemanticElements: ARIA grid pattern with roving-tabindex days. */}
      <div
        role="grid"
        ref={gridRef}
        aria-label={`${MONTHS[viewMonth]} ${viewYear}`}
        onKeyDown={onGridKeyDown}
        className="kern-calendar-grid grid grid-cols-7 gap-0.5"
      >
        {WEEKDAYS.map((day) => (
          // biome-ignore lint/a11y/useSemanticElements: grid column headers require the columnheader role.
          // biome-ignore lint/a11y/useFocusableInteractive: presentational header cell; days carry keyboard handling.
          <span
            key={day}
            role="columnheader"
            aria-hidden="true"
            className="flex h-8 items-center justify-center text-[11px] font-medium text-(--md-sys-color-on-surface-variant)"
          >
            {day}
          </span>
        ))}
        {cells.map(({ key, date }) =>
          date === null ? (
            <span key={key} aria-hidden="true" />
          ) : (
            (() => {
              const disabled =
                (minDay !== undefined && date < minDay) ||
                (maxDay !== undefined && date > maxDay);
              const selected = sameDay(date, value);
              return (
                // biome-ignore lint/a11y/useSemanticElements: grid days are focusable gridcells per the ARIA grid pattern.
                <button
                  key={date.getTime()}
                  data-slot="calendar-day"
                  type="button"
                  role="gridcell"
                  aria-label={date.toDateString()}
                  aria-selected={selected}
                  data-selected={selected ? "" : undefined}
                  disabled={disabled}
                  tabIndex={sameDay(date, cursor) ? 0 : -1}
                  onClick={() => pick(date)}
                  onFocus={() => setCursor(date)}
                  className={"kern-calendar-day flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm text-(--md-sys-color-on-surface) outline-none hover:bg-(--md-sys-color-surface-tonal) " + FOCUS_RING_CLASS + " disabled:pointer-events-none disabled:opacity-30 data-selected:bg-(--md-sys-color-primary) data-selected:text-(--md-sys-color-on-primary)"}
                >
                  {date.getDate()}
                </button>
              );
            })()
          ),
        )}
      </div>
    </div>
  );
}
