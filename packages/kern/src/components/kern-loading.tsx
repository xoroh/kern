import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";
import { LinearProgress } from "./linear-progress";
import { LoadingIndicator } from "./loading-indicator";
import { Skeleton } from "./skeleton";

/**
 * KernLoading — the ONE loading composition (D951 WP1b, CL-011; M3
 * https://m3.material.io/components/progress-indicators/overview).
 *
 * Four kinds, one contract — `kind` + `label` — composing the primitives
 * that each own a distinct M3 role (never re-implemented here):
 *
 * - `skeleton-list`: `Skeleton` rows for list/detail placeholders.
 * - `spinner`: `LoadingIndicator` for indeterminate waits.
 * - `progress`: `LinearProgress` for known progress (determinate) or the
 *   indeterminate loop (`value={null}`).
 * - `shimmer-card`: card-shaped `Skeleton` composition for dashboard grids.
 *
 * Rationale (what this does NOT merge): `Loader`, `CircularProgress`
 * (determinate arc), `Progress`, `Meter` (static scalar — not a task) and
 * `PageLoader` (app-chrome overlay) each own a separate M3 meaning —
 * collapsing them into one prop would let a consumer describe the wrong
 * thing to a screen-reader user. They are distinct components, not
 * one-offs; the one-offs this kills are the per-app loader copies
 * (transfer phase, platform-side).
 *
 * Usage: `<KernLoading kind="skeleton-list" count={3} label="Loading rides" />`.
 * Props table: `kind` skeleton-list|spinner|progress|shimmer-card ·
 * `label` (announced name) · `count` (skeleton rows) ·
 * `value` (progress 0–1, null = indeterminate loop).
 */

export type KernLoadingKind =
  | "skeleton-list"
  | "spinner"
  | "progress"
  | "shimmer-card";

export type KernLoadingProps = Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  kind?: KernLoadingKind;
  /** Accessible name announced while loading. */
  label?: string;
  /** Skeleton rows for `skeleton-list`. */
  count?: number;
  /**
   * Progress 0–1 for `progress`. `null` (default) is the indeterminate
   * loop for unknown durations.
   */
  value?: number | null;
};

export function KernLoading({
  kind = "spinner",
  label = "Loading",
  count = 3,
  value = null,
  className,
  ...props
}: KernLoadingProps) {
  if (kind === "spinner") {
    return (
      <div
        data-slot="kern-loading"
        data-kind={kind}
        className={cn("kern-loading inline-flex", className)}
        {...props}
      >
        <LoadingIndicator label={label} />
      </div>
    );
  }

  if (kind === "progress") {
    return (
      <div
        data-slot="kern-loading"
        data-kind={kind}
        role="status"
        aria-label={label}
        className={cn("kern-loading flex flex-col gap-2", className)}
        {...props}
      >
        <LinearProgress value={value} label={label} />
      </div>
    );
  }

  if (kind === "shimmer-card") {
    return (
      <div
        data-slot="kern-loading"
        data-kind={kind}
        role="status"
        aria-label={label}
        className={cn(
          "kern-loading flex flex-col gap-3 rounded-(--sys-shape-corner-medium) border border-(--sys-color-outline-variant) bg-(--sys-color-surface) p-4",
          className,
        )}
        {...props}
      >
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-8 w-20 rounded-(--sys-shape-corner-full)" />
          <Skeleton className="h-8 w-20 rounded-(--sys-shape-corner-full)" />
        </div>
      </div>
    );
  }

  // skeleton-list: decorative rows (aria-hidden Skeletons) inside one
  // announced status region — the region carries the name, the rows carry
  // no information a screen reader needs row by row.
  return (
    <div
      data-slot="kern-loading"
      data-kind={kind}
      role="status"
      aria-label={label}
      className={cn("kern-loading flex flex-col gap-2", className)}
      {...props}
    >
      {Array.from({ length: Math.max(1, count) }, (_, index) => (
        <Skeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholder rows are identical and never reorder.
          key={index}
          className="h-12 w-full rounded-(--sys-shape-corner-small)"
        />
      ))}
    </div>
  );
}
