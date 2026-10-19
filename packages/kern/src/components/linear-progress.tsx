import type { ComponentPropsWithRef } from "react";
import { useId } from "react";
import { cn } from "../utils/cn";

export type LinearProgressProps = Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  /**
   * 0–1 determinate progress. `null` is the indeterminate loop for unknown
   * durations (Axis `value={null}` convention — no separate boolean, so a
   * value and a mode can never contradict each other).
   */
  value?: number | null;
  /**
   * Cycle the indeterminate bars through primary → primary-container →
   * tertiary → tertiary-container instead of holding primary.
   */
  fourColor?: boolean;
  /**
   * 0–1 buffer level rendered as dots behind the bar: known progress in the
   * bar, unknown progress in the buffer.
   */
  buffer?: number;
  /**
   * M3 stop indicator: a 4dp primary circle marking the end of the track.
   * Determinate only.
   */
  stop?: boolean;
  /**
   * M3 expressive wavy indicator (determinate only): a sine wave at the
   * platform wave geometry — 3dp amplitude, 40dp wavelength
   * (MDC-Android `m3_comp_progress_indicator_linear_*`). Indeterminate
   * ignores it; the loops have no wave phase. Web-only: native has no SVG
   * engine to draw the wave with.
   */
  wavy?: boolean;
  label?: string;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * LinearProgress — M3 linear progress. Track `surface-container-highest` at
 * 4px; indicator `primary` at 4px. Determinate by value, indeterminate by
 * loop, four-color by cycle, buffer by dots. Width transitions stay inside
 * Kern's 200ms utility cap; the indeterminate loop runs 2s linear infinite.
 */
export function LinearProgress({
  value = 0,
  fourColor = false,
  buffer,
  stop = false,
  wavy = false,
  label = "Progress",
  className,
  ...props
}: LinearProgressProps) {
  const indeterminate = value === null;
  const ratio = clamp01(value ?? 0);
  const buffered = buffer === undefined ? null : clamp01(buffer);
  // Pattern ids must be document-unique and URL-safe (`useId` emits colons).
  const waveId = `kern-wave-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div
      data-slot="linear-progress"
      data-testid="linear-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(ratio * 100)}
      className={cn(
        "kern-linear-progress relative h-1 w-full overflow-hidden rounded-full bg-(--sys-color-surface-container-highest)",
        className,
      )}
      {...props}
    >
      {buffered !== null && !indeterminate ? (
        <div
          data-slot="linear-progress-buffer"
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-(--sys-color-primary)/24"
          style={{ width: `${buffered * 100}%` }}
        />
      ) : null}
      {indeterminate ? (
        <>
          <div
            data-slot="linear-progress-indicator"
            aria-hidden="true"
            className="absolute inset-y-0 left-0 h-full w-full origin-left rounded-full bg-(--sys-color-primary) [animation:kern-linear-indeterminate_2s_linear_infinite]"
            style={
              fourColor
                ? {
                    animation:
                      "kern-linear-indeterminate 2s linear infinite, kern-linear-four-color 8s linear infinite",
                  }
                : undefined
            }
          />
          <div
            data-slot="linear-progress-indicator-secondary"
            aria-hidden="true"
            className="absolute inset-y-0 left-0 h-full w-full origin-left rounded-full bg-(--sys-color-primary) [animation:kern-linear-indeterminate-secondary_2s_linear_infinite]"
            style={
              fourColor
                ? {
                    animation:
                      "kern-linear-indeterminate-secondary 2s linear infinite, kern-linear-four-color 8s linear infinite",
                  }
                : undefined
            }
          />
        </>
      ) : wavy ? (
        <svg
          data-slot="linear-progress-wave"
          aria-hidden="true"
          className="kern-linear-progress-wave h-3 transition-[width] duration-200"
          style={{ width: `${ratio * 100}%` }}
          preserveAspectRatio="none"
          viewBox="0 0 40 12"
        >
          <defs>
            <pattern
              id={waveId}
              width="40"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 6 Q 10 0 20 6 T 40 6"
                fill="none"
                stroke="var(--sys-color-primary)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="12" fill={`url(#${waveId})`} />
        </svg>
      ) : (
        <div
          data-slot="linear-progress-indicator"
          className="kern-linear-progress-indicator h-full rounded-full bg-(--sys-color-primary) transition-[width] duration-200"
          style={{ width: `${ratio * 100}%` }}
        />
      )}
      {stop && !indeterminate ? (
        <div
          data-slot="linear-progress-stop"
          aria-hidden="true"
          className="absolute top-1/2 right-0 size-1 -translate-y-1/2 translate-x-1/2 rounded-full bg-(--sys-color-primary)"
        />
      ) : null}
    </div>
  );
}
