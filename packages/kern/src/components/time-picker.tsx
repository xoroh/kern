// The MODELS zone of Axis: universal behaviour, pure TypeScript/React, with
// no react-native anywhere in its closure. The web package must not reach for
// the root entry — that entry is the NATIVE zone, and importing it makes
// every web consumer install react-native (whose source is Flow, which no
// JS runtime can parse). The models subpath is a published, gated entry:
// Axis's own boundary gate proves its closure is renderer-free.
import { formatTimeParts } from "@xoroh/axis/models";
import { useId, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";

/**
 * M3 time picker — one normalised 24-hour value in two presentations:
 * `listbox` (default) and `dial`.
 *
 * `listbox` is hour, minute and (in 12-hour mode) period as three `listbox`es
 * the user traverses with Arrow keys and Home/End — the form that is
 * keyboard-correct and screen-reader-correct without a pointer. `dial` is M3's
 * clock face: an SVG ring of numbers with a pointer hand, click/drag to
 * select, and the same Arrow/Home/End traversal over `radio`s. A host picks
 * the presentation; the value contract does not move with it.
 *
 * Behaviour this component owns, in BOTH presentations:
 *
 * - **One `TimePickerValue`, normalised.** `hours` is 0–23 internally whatever
 *   `format` says, and `minutes` is clamped into 0–59 by `step` — so a host
 *   never receives `18:75` from a step-15 picker.
 * - **Controlled or uncontrolled** value, reported through `onValueChange`
 *   with the normalised value, so a consumer cannot be handed an out-of-range
 *   time by its own arithmetic.
 * - **12-hour rendering is a presentation of 24-hour state.** Choosing "3 PM"
 *   reports `hours: 15`, and re-opening in 24-hour mode shows `15` — a picker
 *   that kept 12-hour state would drift the moment a consumer persisted it.
 * - **Invalid `step`/`format` does not silently produce nonsense.** A step that
 *   does not divide 60 falls back to 1 and says so via the reported value
 *   being minute-accurate.
 *
 * Dial behaviour:
 *
 * - **The SVG is decoration; the numbers are radios.** The face, rings and
 *   hand are one `aria-hidden` SVG. Every number is a real `radio` in a
 *   `radiogroup`, absolutely positioned by angle, with roving tabindex and
 *   Arrow/Home/End that move *and* select (the M3 listbox activation model).
 * - **Clicking an hour advances to minutes; arrowing never does.** A pointer
 *   pick (click, or drag release) confirms the hour and shows the minute face.
 *   Keyboard traversal stays in its ring, or arrowing through the hours would
 *   yank the face away mid-traversal.
 * - **A drag that starts on a number is that number's click.** The face's
 *   pointer handler ignores presses originating on a radio, so one press
 *   never reports two values (the pointer position's snap AND the radio).
 */

export type TimePickerValue = {
  /** 0–23. Always 24-hour internally, whatever `format` renders. */
  hours: number;
  /** 0–59. */
  minutes: number;
};

export type TimePickerFormat = "12h" | "24h";

/**
 * Which face the picker shows. `listbox` is the default because it is the
 * keyboard/screen-reader-correct face; `dial` is M3's clock face over the
 * same state. The reported values are identical either way.
 */
export type TimePickerPresentation = "listbox" | "dial";

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
  /**
   * Which face the picker shows. `listbox` (default) is three listboxes;
   * `dial` is the M3 clock face. Same state, same value contract.
   */
  presentation?: TimePickerPresentation;
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
  // Display strings come from the Axis time model; the local padStart/period
  // assembly is gone. Output is identical for the default locale.
  const parts = formatTimeParts(value, format);
  return parts.period === null
    ? `${parts.hours}:${parts.minutes}`
    : `${parts.hours}:${parts.minutes} ${parts.period}`;
}

// ---------------------------------------------------------------------------
// Dial geometry. One face, shared with native (256dp there): the numbers sit
// on a circle of radius 96 in a 256 box, top = 12/00/00, clockwise. A 24-hour
// hour face adds an inner ring (radius 60) for 12,1–11 while the outer ring
// carries 00,13–23 — a single ring of 24 would put 40px targets 25px apart.
// ---------------------------------------------------------------------------

const DIAL_SIZE = 256;
const DIAL_CENTER = DIAL_SIZE / 2;
const DIAL_FACE_RADIUS = 120;
const DIAL_RING_RADIUS = 96;
const DIAL_INNER_RADIUS = 60;
/** Where the outer ring ends and the inner ring begins, for drag snapping. */
const DIAL_RING_BOUNDARY = (DIAL_RING_RADIUS + DIAL_INNER_RADIUS) / 2;
const DIAL_DOT = 40;
const DIAL_INNER_DOT = 32;
const DIAL_MINOR_DOT = 16;

type DialPickVia = "pointer" | "keyboard";

type DialOption = {
  /** The committed value: a 24-hour hour, or a minute on the step grid. */
  value: number;
  text: string;
  selected: boolean;
  /** Clockwise from the top, in radians. */
  angle: number;
  radius: number;
  /** Hit-area edge. Minor minute dots are small; labelled numbers are not. */
  dot: number;
  labeled: boolean;
};

/** ViewBox point for an angle (clockwise from top) and radius. */
function dialPoint(angle: number, radius: number): { x: number; y: number } {
  return {
    x: DIAL_CENTER + radius * Math.sin(angle),
    y: DIAL_CENTER - radius * Math.cos(angle),
  };
}

function dialHourOptions(
  format: TimePickerFormat,
  period: "am" | "pm",
  hours: number,
): DialOption[] {
  if (format === "12h") {
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return Array.from({ length: 12 }, (_, index) => {
      const display = index === 0 ? 12 : index;
      return {
        value: toHours(display, period),
        text: formatTimeParts(
          { hours: toHours(display, period), minutes: 0 },
          "12h",
        ).hours,
        selected: display === hour12,
        angle: (index / 12) * Math.PI * 2,
        radius: DIAL_RING_RADIUS,
        dot: DIAL_DOT,
        labeled: true,
      };
    });
  }
  const outer = Array.from({ length: 12 }, (_, index) => {
    const hour = index === 0 ? 0 : index + 12;
    return {
      value: hour,
      text: formatTimeParts({ hours: hour, minutes: 0 }, "24h").hours,
      selected: hour === hours,
      angle: (index / 12) * Math.PI * 2,
      radius: DIAL_RING_RADIUS,
      dot: DIAL_DOT,
      labeled: true,
    };
  });
  const inner = Array.from({ length: 12 }, (_, index) => {
    const hour = index === 0 ? 12 : index;
    return {
      value: hour,
      text: formatTimeParts({ hours: hour, minutes: 0 }, "24h").hours,
      selected: hour === hours,
      angle: (index / 12) * Math.PI * 2,
      radius: DIAL_INNER_RADIUS,
      dot: DIAL_INNER_DOT,
      labeled: true,
    };
  });
  return [...outer, ...inner];
}

function dialMinuteOptions(
  minutes: number[],
  currentMinutes: number,
): DialOption[] {
  return minutes.map((minute) => {
    // Twelve or fewer options all get labels. Past that (step 1, 2, 3, 4) only
    // the five-minute marks do; the rest are dots, exactly like M3's minute
    // face. Positions are always clock-correct (minute/60), never index-based,
    // so a step-15 face still puts 45 at nine o'clock.
    const labeled = minute % 5 === 0 || minutes.length <= 12;
    return {
      value: minute,
      // Minutes render two digits in both modes (the model pads minutes to 2
      // regardless of 12h/24h), so the format is fixed here, not threaded.
      text: formatTimeParts({ hours: 0, minutes: minute }, "24h").minutes,
      selected: minute === currentMinutes,
      angle: (minute / 60) * Math.PI * 2,
      radius: DIAL_RING_RADIUS,
      dot: labeled ? DIAL_DOT : DIAL_MINOR_DOT,
      labeled,
    };
  });
}

/** Where the pointer hand points for the current hour. */
function dialHourHand(
  format: TimePickerFormat,
  hours: number,
): { angle: number; radius: number } {
  if (format === "12h") {
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return {
      angle: ((hour12 % 12) / 12) * Math.PI * 2,
      radius: DIAL_RING_RADIUS,
    };
  }
  const outer = hours === 0 || hours >= 13;
  const index = outer
    ? hours === 0
      ? 0
      : hours - 12
    : hours === 12
      ? 0
      : hours;
  return {
    angle: (index / 12) * Math.PI * 2,
    radius: outer ? DIAL_RING_RADIUS : DIAL_INNER_RADIUS,
  };
}

/**
 * One dial face: decorative SVG (face, rings, hand) plus one `radio` per
 * number, positioned by angle, with roving tabindex and Arrow/Home/End that
 * move and select with wrap — the listbox activation model, mirrored.
 */
function DialRing({
  ringId,
  label,
  options,
  handAngle,
  handRadius,
  showInnerRing,
  pickAt,
  onPick,
  onConfirm,
}: {
  ringId: string;
  label: string;
  options: DialOption[];
  handAngle: number;
  handRadius: number;
  showInnerRing: boolean;
  /**
   * Map a press/drag to a value. `fraction` is clockwise from the top in
   * turns; `distance` is viewBox units from the centre (for the 24-hour
   * two-ring face).
   */
  pickAt: (fraction: number, distance: number) => number;
  onPick: (value: number, via: DialPickVia) => void;
  /** Pointer confirmation (click, drag release) — keyboard never confirms. */
  onConfirm?: () => void;
}) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.selected),
  );
  const faceRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const focusOption = (index: number) => {
    const option = options[index];
    if (!option) return;
    requestAnimationFrame(() => {
      document.getElementById(`${ringId}-${option.value}`)?.focus();
    });
  };

  const move = (delta: number) => {
    const total = options.length;
    if (total === 0) return;
    const next = (selectedIndex + delta + total) % total;
    const option = options[next];
    if (option) {
      onPick(option.value, "keyboard");
      focusOption(next);
    }
  };

  const jump = (index: number) => {
    const option = options[index];
    if (option) {
      onPick(option.value, "keyboard");
      focusOption(index);
    }
  };

  const valueFromPoint = (clientX: number, clientY: number): number | null => {
    const rect = faceRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return null;
    const sx = ((clientX - rect.left) / rect.width) * DIAL_SIZE;
    const sy = ((clientY - rect.top) / rect.height) * DIAL_SIZE;
    const dx = sx - DIAL_CENTER;
    const dy = sy - DIAL_CENTER;
    const tau = Math.PI * 2;
    const fraction = (((Math.atan2(dx, -dy) / tau) % 1) + 1) % 1;
    return pickAt(fraction, Math.hypot(dx, dy));
  };

  const hand = dialPoint(handAngle, handRadius);

  return (
    <div
      ref={faceRef}
      role="radiogroup"
      aria-label={label}
      data-slot="time-picker-dial-face"
      data-testid="kern-time-dial-face"
      onPointerDown={(event) => {
        // A press that starts ON a number belongs to that number's click: the
        // face stays out of it, or one press reports two values (the pointer
        // snap, then the radio). Drags start on empty face, where this owns it.
        const target = event.target as Element | null;
        if (target?.closest?.('[role="radio"]')) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;
        dragging.current = true;
        try {
          faceRef.current?.setPointerCapture?.(event.pointerId);
        } catch {
          /* setPointerCapture is best-effort (absent outside browsers) */
        }
        const picked = valueFromPoint(event.clientX, event.clientY);
        if (picked !== null) onPick(picked, "pointer");
      }}
      onPointerMove={(event) => {
        if (!dragging.current) return;
        const picked = valueFromPoint(event.clientX, event.clientY);
        if (picked !== null) onPick(picked, "pointer");
      }}
      onPointerUp={() => {
        if (!dragging.current) return;
        dragging.current = false;
        onConfirm?.();
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      className="kern-time-picker-dial-face relative touch-none select-none"
      style={{ width: DIAL_SIZE, height: DIAL_SIZE }}
    >
      <svg
        viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
        width={DIAL_SIZE}
        height={DIAL_SIZE}
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0"
      >
        <circle
          cx={DIAL_CENTER}
          cy={DIAL_CENTER}
          r={DIAL_FACE_RADIUS}
          fill="var(--sys-color-surface-container)"
          stroke="var(--sys-color-outline-variant)"
          strokeWidth={1}
        />
        <circle
          cx={DIAL_CENTER}
          cy={DIAL_CENTER}
          r={DIAL_RING_RADIUS}
          fill="none"
          stroke="var(--sys-color-outline-variant)"
          strokeWidth={1}
        />
        {showInnerRing ? (
          <circle
            cx={DIAL_CENTER}
            cy={DIAL_CENTER}
            r={DIAL_INNER_RADIUS}
            fill="none"
            stroke="var(--sys-color-outline-variant)"
            strokeWidth={1}
          />
        ) : null}
        {/* Halo under the selected number, then the hand, then the hub. */}
        <circle
          cx={hand.x}
          cy={hand.y}
          r={20}
          fill="var(--sys-color-primary-container)"
        />
        <line
          x1={DIAL_CENTER}
          y1={DIAL_CENTER}
          x2={hand.x}
          y2={hand.y}
          stroke="var(--sys-color-primary)"
          strokeWidth={2}
        />
        <circle
          cx={DIAL_CENTER}
          cy={DIAL_CENTER}
          r={4}
          fill="var(--sys-color-primary)"
        />
      </svg>
      {options.map((option, index) => {
        const point = dialPoint(option.angle, option.radius);
        return (
          // biome-ignore lint/a11y/useSemanticElements: clock-face numbers are angle-positioned radios in a radiogroup (APG pattern) — native radio inputs cannot be drag targets or sit on a circle.
          <button
            key={option.value}
            type="button"
            role="radio"
            id={`${ringId}-${option.value}`}
            aria-checked={option.selected}
            aria-label={option.text}
            data-selected={option.selected || undefined}
            tabIndex={index === selectedIndex ? 0 : -1}
            onClick={() => {
              onPick(option.value, "pointer");
              onConfirm?.();
            }}
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
                  jump(0);
                  break;
                case "End":
                  event.preventDefault();
                  jump(options.length - 1);
                  break;
                default:
                  break;
              }
            }}
            className={cn(
              "kern-time-picker-dial-option absolute flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--sys-color-secondary)",
              option.selected
                ? "bg-(--sys-color-primary-container) font-semibold text-(--sys-color-on-primary-container)"
                : "text-(--sys-color-on-surface)",
            )}
            style={{
              left: point.x,
              top: point.y,
              width: option.dot,
              height: option.dot,
              transform: "translate(-50%, -50%)",
            }}
          >
            {option.labeled ? (
              option.text
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  "block h-2 w-2 rounded-full",
                  option.selected
                    ? "bg-(--sys-color-on-primary-container)"
                    : "bg-(--sys-color-on-surface-variant)",
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
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
      className="kern-time-picker-field flex h-56 w-24 flex-col overflow-y-auto rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) bg-(--sys-color-surface-container)"
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
            "kern-time-picker-option flex h-12 shrink-0 items-center justify-center text-lg outline-none select-none focus-visible:bg-(--sys-color-surface-container-high)",
            option.selected
              ? "rounded-(--sys-shape-corner-small) bg-(--sys-color-primary-container) font-semibold text-(--sys-color-on-primary-container)"
              : "text-(--sys-color-on-surface)",
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
  presentation = "listbox",
}: TimePickerProps) {
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState<TimePickerValue>(
    defaultValue ?? { hours: 9, minutes: 0 },
  );
  // Normalise on READ as well as on commit. A controlled host can hold anything
  // — `value={{ hours: 30, minutes: 90 }}` used to render literally as "30:90",
  // which is not a time, while `commit` normalised the same value on the way
  // out. It also left no option selected, because `hours === 30` matches
  // nothing in a 0-23 grid. Normalising here makes the display, the selection
  // and the reported value agree on one value.
  const current = normaliseTime(controlled ? value : uncontrolled);

  const effectiveStep = useMemo(() => normaliseStep(step), [step]);
  const minutes = useMemo(() => minuteOptions(effectiveStep), [effectiveStep]);

  // Dial-only: which face is showing. Always declared (hooks cannot be
  // conditional), ignored by the listbox presentation.
  const [dialMode, setDialMode] = useState<"hour" | "minute">("hour");

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
      text: formatTimeParts({ hours, minutes: 0 }, "12h").hours,
      selected: format === "12h" ? display === hour12 : hours === current.hours,
    };
  });

  const hourOptions24 = Array.from({ length: 24 }, (_, hours) => ({
    value: hours,
    text: formatTimeParts({ hours, minutes: 0 }, "24h").hours,
    selected: hours === current.hours,
  }));

  const minuteFieldOptions = minutes.map((minute) => ({
    value: minute,
    text: formatTimeParts({ hours: 0, minutes: minute }, format).minutes,
    selected: minute === current.minutes,
  }));

  const periodOptions = (["am", "pm"] as const).map((value_) => ({
    value: value_ === "am" ? 0 : 1,
    text:
      formatTimeParts({ hours: value_ === "am" ? 9 : 15, minutes: 0 }, "12h")
        .period ?? value_.toUpperCase(),
    selected: value_ === period,
  }));

  const pickerLabel = (
    <span
      data-slot="time-picker-value"
      className="text-sm text-(--sys-color-on-surface-variant)"
    >
      {formatValue ? formatValue(current) : formatClock(current, format)}
    </span>
  );

  const dial = (
    <div
      data-slot="time-picker-dial"
      data-testid="kern-time-dial"
      className="flex flex-col items-center gap-3"
    >
      {/* biome-ignore lint/a11y/useSemanticElements: a mode switch for the dial face, not a form grouping — a fieldset would imply a form control grouping this is not. */}
      <div
        role="group"
        aria-label="Select hour or minute"
        className="flex items-center gap-2"
      >
        {(["hour", "minute"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={dialMode === mode}
            data-testid={`kern-time-dial-mode-${mode}`}
            onClick={() => setDialMode(mode)}
            className={cn(
              "kern-time-picker-dial-tab h-10 rounded-(--sys-shape-corner-full) px-4 text-sm font-medium",
              dialMode === mode
                ? "bg-(--sys-color-primary-container) text-(--sys-color-on-primary-container)"
                : "text-(--sys-color-on-surface-variant)",
            )}
          >
            {mode === "hour" ? "Hour" : "Minute"}
          </button>
        ))}
      </div>

      {dialMode === "hour" ? (
        <DialRing
          ringId={`${baseId}-dial-hour`}
          label={format === "12h" ? "Hour" : "Hour (24 hour)"}
          options={dialHourOptions(
            format,
            period as "am" | "pm",
            current.hours,
          )}
          handAngle={dialHourHand(format, current.hours).angle}
          handRadius={dialHourHand(format, current.hours).radius}
          showInnerRing={format === "24h"}
          pickAt={(fraction, distance) => {
            const index = Math.round(fraction * 12) % 12;
            if (format === "12h") {
              return toHours(index === 0 ? 12 : index, period as "am" | "pm");
            }
            // Two rings: the press's distance from the centre decides. Past the
            // midpoint it is the outer ring (00, 13–23), else the inner
            // (12, 1–11) — the top of each ring is its 12-equivalent.
            if (distance > DIAL_RING_BOUNDARY) {
              return index === 0 ? 0 : index + 12;
            }
            return index === 0 ? 12 : index;
          }}
          onPick={(picked, via) => {
            commit({ hours: picked, minutes: current.minutes });
            if (via === "pointer") setDialMode("minute");
          }}
          onConfirm={() => setDialMode("minute")}
        />
      ) : (
        <DialRing
          ringId={`${baseId}-dial-minute`}
          label="Minute"
          options={dialMinuteOptions(minutes, current.minutes)}
          handAngle={(current.minutes / 60) * Math.PI * 2}
          handRadius={DIAL_RING_RADIUS}
          showInnerRing={false}
          pickAt={(fraction) =>
            (Math.round((fraction * 60) / effectiveStep) * effectiveStep) % 60
          }
          onPick={(picked) => commit({ hours: current.hours, minutes: picked })}
        />
      )}

      {format === "12h" ? (
        // biome-ignore lint/a11y/useSemanticElements: a period switch for the dial face, not a form grouping — a fieldset would imply a form control grouping this is not.
        <div
          role="group"
          aria-label="AM or PM"
          className="flex items-center gap-2"
        >
          {(["am", "pm"] as const).map((value_) => (
            <button
              key={value_}
              type="button"
              aria-pressed={value_ === period}
              onClick={() =>
                commit({
                  hours: toHours(hour12, value_),
                  minutes: current.minutes,
                })
              }
              className={cn(
                "kern-time-picker-dial-period h-10 rounded-(--sys-shape-corner-full) px-4 text-sm font-medium",
                value_ === period
                  ? "bg-(--sys-color-primary-container) text-(--sys-color-on-primary-container)"
                  : "text-(--sys-color-on-surface-variant)",
              )}
            >
              {value_.toUpperCase()}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      data-slot="time-picker"
      data-testid={testID ?? "kern-time-picker"}
      className={cn(
        "kern-time-picker inline-flex flex-col gap-2 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-high) p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          id={`${baseId}-label`}
          className="text-xs font-medium tracking-wide text-(--sys-color-on-surface-variant) uppercase"
        >
          {label}
        </span>
        {pickerLabel}
      </div>

      {presentation === "dial" ? (
        dial
      ) : (
        /* biome-ignore lint/a11y/useSemanticElements: a labelled group of the three pickers; a fieldset would imply a form control grouping this is not. */
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
            onPick={(picked) =>
              commit({ hours: current.hours, minutes: picked })
            }
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
      )}
    </div>
  );
}

export { formatClock };
