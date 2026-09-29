import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

export type LinearProgressProps = Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  /**
   * 0–1. Determinate only.
   * @open Indeterminate linear motion is a tracked open item — M3 has the
   * role, the engine for its loop is not shipped yet.
   */
  value: number;
  label?: string;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * LinearProgress — M3 linear progress, determinate. Track uses the tonal
 * surface role, the fill the primary role; width transitions stay inside
 * Kern's 200ms utility cap.
 */
export function LinearProgress({
  value,
  label = "Progress",
  className,
  ...props
}: LinearProgressProps) {
  const ratio = clamp01(value);
  return (
    <div
      data-slot="linear-progress"
      data-testid="linear-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
      className={cn(
        "kern-linear-progress h-1 w-full overflow-hidden rounded-full bg-(--md-sys-color-surface-tonal)",
        className,
      )}
      {...props}
    >
      <div
        data-slot="linear-progress-indicator"
        className="kern-linear-progress-indicator h-full rounded-full bg-(--md-sys-color-primary) transition-[width] duration-200"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
