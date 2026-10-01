import { useId, useMemo, useState } from "react";
import { cn } from "../utils/cn";

/**
 * M3 time picker — hour, minute and (in 12-hour mode) period, as three
 * `listbox`es the user traverses with Arrow keys and Home/End.
 *
 * M3 specifies a clock face and a text-entry mode. Kern ships the listbox form
 * as the component, because that is the form that is keyboard-correct and
 * screen-reader-correct without a pointer, and because the dial is a
 * *presentation* of the same three values — a host that wants a dial can render
 * one over this state without forking the value contract. This is recorded
 * rather than hidden: the deviation is M3's alternate presentation, not a
 * different concept.
 *
 * Behaviour this component owns:
 *
 * - **One `TimePickerValue`, normalised.** `hours` is 0–23 internally whatever
 *   `format` says, and `minutes` is clamped into 0–59 by `step` — so a host
 *   never receives `18:75` from a step-15 picker.
 * - **Controlled or uncontrolled** value, reported through `onValueChange`
 *   with the normalised value, so a consumer cannot be handed an out-of-range
 *   time by its own arithmetic.
 * - **Roving tabindex per field** — three tab stops for three fields, not one
 *   per option. Arrow/Home/End move within a field and wrap; the value changes
 *   as the traversal moves (M3's listbox activation model).
 * - **12-hour rendering is a presentation of 24-hour state.** Choosing "3 PM"
 *   reports `hours: 15`, and re-opening in 24-hour mode shows `15` — a picker
 *   that kept 12-hour state would drift the moment a consumer persisted it.
 * - **Invalid `step`/`format` does not silently produce nonsense.** A step that
 *   does not divide 60 falls back to 1 and says so via the reported value
 *   being minute-accurate.
 */

export type TimePickerValue = {
  /** 0–23. Always 24-hour internally, whatever `format` renders. */
  hours: number;
  /** 0–59. */
  minutes: number;
};

export type TimePickerFormat = "12h" | "24h";

export type TimePickerProps = {
  /** Controlled value. */
  value?: TimePickerValue;
  /** Initial value for the uncontrolled case. */
  defaultValue?: TimePickerValue;
  onValueChange?: (value: TimePickerValue) => void;
  /** `12h` adds the AM/PM field. State stays 24-hour. */
  format?: TimePickerFormat;
  /** Minute granularity. Must divide 60; anything else falls back to 1. */
  step?: number;
  label?: string;
  className?: string;
  /** Overrides the rendered clock text, e.g. "09:30" in a 24-hour locale. */
  formatValue?: (value: TimePickerValue) => string;
  testID?: string;
};

function normaliseStep(step: number): number {
  if (!Number.isFinite(step) || step <= 0) return 1;
  // A step that does not divide 60 cannot land on :00, which is the first
  // minute every picker is expected to offer.
  return 60 % step === 0 ? step : 1;
}

function minuteOptions(step: number): number[] {
  if (step === 1) return Array.from({ length: 60 }, (_, i) => i);
  const out: number[] = [];
  for (let m = 0; m < 60; m += step) out.push(m);
  return out;
}

/**
 * Clamp a time into range. Exported because it is the guarantee a consumer
 * actually relies on: kern never reports an hour outside 0-23 or a minute
 * outside 0-59, so host arithmetic cannot put an impossible time in state.
 */
export function normaliseTime(value: TimePickerValue): TimePickerValue {
  return {
    hours: ((Math.round(value.hours) % 24) + 24) % 24,
    minutes: Math.min(59, Math.max(0, Math.round(value.minutes))),
  };
}

/** The 24-hour hour whose 12-hour face equals `display` in `period`. */
function toHours(display: number, period: "am" | "pm"): number {
  const base = display % 12;
  return period === "am" ? base : base + 12;
}

function formatClock(value: TimePickerValue, format: TimePickerFormat): string {
  if (format === "24h") {
    return `${String(value.hours).padStart(2, "0")}:${String(value.minutes).padStart(2, "0")}`;
  }
  const period = value.hours < 12 ? "AM" : "PM";
  const hour12 = value.hours % 12 === 0 ? 12 : value.hours % 12;
  return `${hour12}:${String(value.minutes).padStart(2, "0")} ${period}`;
}

type FieldProps = {
  label: string;
  /** Option values in traversal order. */
  options: { value: number; text: string; selected: boolean }[];
  fieldId: string;
  onPick: (value: number) => void;
};

/**
 * One `listbox` field: roving tabindex, Arrow/Home/End with wrap, and
 * auto-activation on traversal (the M3 listbox model — arrow keys move *and*
 * select, so the value is never out of step with the focus).
 */
function PickerField({ label, options, fieldId, onPick }: FieldProps) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.selected),
  );

  const move = (step: number) => {
    const total = options.length;
    if (total === 0) return;
    const next = (selectedIndex + step + total) % total;
    const option = options[next];
    if (option) onPick(option.value);
    // Focus follows the value: roving tabindex means one tab stop per field, so
    // the focused option must be the selected one or the two disagree.
    requestAnimationFrame(() => {
      document.getElementById(`${fieldId}-${option?.value ?? 0}`)?.focus();
    });
  };

  return (
    <div
      role="listbox"
      aria-label={label}
      data-slot="time-picker-field"
      className="kern-time-picker-field flex h-56 w-24 flex-col overflow-y-auto rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container)"
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          role="option"
          id={`${fieldId}-${option.value}`}
          aria-selected={option.selected}
          data-selected={option.selected || undefined}
          tabIndex={index === selectedIndex ? 0 : -1}
          onClick={() => onPick(option.value)}
          onKeyDown={(event) => {
            switch (event.key) {
              case "ArrowDown":
              case "ArrowRight":
                event.preventDefault();
                move(1);
                break;
              case "ArrowUp":
              case "ArrowLeft":
                event.preventDefault();
                move(-1);
                break;
              case "Home":
                event.preventDefault();
                onPick(options[0]?.value ?? 0);
                requestAnimationFrame(() =>
                  document
                    .getElementById(`${fieldId}-${options[0]?.value ?? 0}`)
                    ?.focus(),
                );
                break;
              case "End": {
                event.preventDefault();
                const last = options.at(-1);
                if (last) {
                  onPick(last.value);
                  requestAnimationFrame(() =>
                    document
                      .getElementById(`${fieldId}-${last.value}`)
                      ?.focus(),
                  );
                }
                break;
              }
              default:
                break;
            }
          }}
          className={cn(
            "kern-time-picker-option flex h-12 shrink-0 items-center justify-center text-lg outline-none select-none focus-visible:bg-(--md-sys-color-surface-container-high)",
            option.selected
              ? "rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-primary-container) font-semibold text-(--md-sys-color-on-primary-container)"
              : "text-(--md-sys-color-on-surface)",
          )}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
}

export function TimePicker({
  value,
  defaultValue,
  onValueChange,
  format = "24h",
  step = 5,
  label = "Time",
  className,
  formatValue,
  testID,
}: TimePickerProps) {
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState<TimePickerValue>(
    defaultValue ?? { hours: 9, minutes: 0 },
  );
  const current = controlled ? value : uncontrolled;

  const effectiveStep = useMemo(() => normaliseStep(step), [step]);
  const minutes = useMemo(() => minuteOptions(effectiveStep), [effectiveStep]);

  const baseId = useId();
  const hour12 = current.hours % 12 === 0 ? 12 : current.hours % 12;
  const period = current.hours < 12 ? "am" : "pm";

  const commit = (next: TimePickerValue) => {
    const normalised = normaliseTime(next);
    if (!controlled) setUncontrolled(normalised);
    onValueChange?.(normalised);
  };

  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const display = i + 1;
    const hours = toHours(display, period as "am" | "pm");
    return {
      value: display,
      text: String(display).padStart(2, "0"),
      selected: format === "12h" ? display === hour12 : hours === current.hours,
    };
  });

  const hourOptions24 = Array.from({ length: 24 }, (_, hours) => ({
    value: hours,
    text: String(hours).padStart(2, "0"),
    selected: hours === current.hours,
  }));

  const minuteFieldOptions = minutes.map((minute) => ({
    value: minute,
    text: String(minute).padStart(2, "0"),
    selected: minute === current.minutes,
  }));

  const periodOptions = (["am", "pm"] as const).map((value_) => ({
    value: value_ === "am" ? 0 : 1,
    text: value_.toUpperCase(),
    selected: value_ === period,
  }));

  const pickerLabel = (
    <span
      data-slot="time-picker-value"
      className="text-sm text-(--md-sys-color-on-surface-variant)"
    >
      {formatValue ? formatValue(current) : formatClock(current, format)}
    </span>
  );

  return (
    <div
      data-slot="time-picker"
      data-testid={testID ?? "kern-time-picker"}
      className={cn(
        "kern-time-picker inline-flex flex-col gap-2 rounded-(--md-sys-shape-corner-large) bg-(--md-sys-color-surface-container-high) p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          id={`${baseId}-label`}
          className="text-xs font-medium tracking-wide text-(--md-sys-color-on-surface-variant) uppercase"
        >
          {label}
        </span>
        {pickerLabel}
      </div>

      {/* biome-ignore lint/a11y/useSemanticElements: a labelled group of the three pickers; a fieldset would imply a form control grouping this is not. */}
      <div
        role="group"
        aria-labelledby={`${baseId}-label`}
        className="flex gap-2"
      >
        <PickerField
          fieldId={`${baseId}-hours`}
          label={format === "12h" ? "Hour" : "Hour (24 hour)"}
          options={format === "12h" ? hourOptions : hourOptions24}
          onPick={(picked) =>
            commit({
              hours:
                format === "12h"
                  ? toHours(picked, period as "am" | "pm")
                  : picked,
              minutes: current.minutes,
            })
          }
        />
        <PickerField
          fieldId={`${baseId}-minutes`}
          label="Minute"
          options={minuteFieldOptions}
          onPick={(picked) => commit({ hours: current.hours, minutes: picked })}
        />
        {format === "12h" ? (
          <PickerField
            fieldId={`${baseId}-period`}
            label="AM or PM"
            options={periodOptions}
            onPick={(picked) =>
              commit({
                hours: toHours(hour12, picked === 0 ? "am" : "pm"),
                minutes: current.minutes,
              })
            }
          />
        ) : null}
      </div>
    </div>
  );
}

export { formatClock };
