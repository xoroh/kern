import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../utils/cn";

/**
 * M3 loading indicator — indeterminate activity feedback. **This is the
 * component M3's "Loading indicator" names; it replaces the indeterminate
 * circular-progress pattern** rather than sitting beside it (ruling T4-M5 in
 * `.team/decisions/D-026-kern-council-forks.md`, which rejected declaring a
 * second name for one surface as an `ext:`). `CircularProgress` remains for the
 * *determinate* case, which is a different question the user asks.
 *
 * Behaviour this component owns, rather than delegating to a primitive:
 *
 * - **`aria-busy` on the region being loaded, `role="status"` on the
 *   indicator.** A spinner with only a visual label tells a screen reader
 *   nothing; `role="status"` is what makes "Loading" announced when it appears.
 * - **An accessible name is mandatory.** The name comes from `label`, which is
 *   also the visible text when `showLabel` is on. Kern will not render an
 *   unnamed spinner: it is announced as nothing at all.
 * - **Indeterminate has no `aria-valuenow`.** There is no progress to report,
 *   and a fabricated value (or an animated `0`) is worse than none. Determinate
 *   progress stays in `LinearProgress`, which owns `role="progressbar"` with
 *   real `aria-valuenow`.
 * - **`prefers-reduced-motion` stops the animation.** The indicator becomes a
 *   static ring; it does not disappear, because "we removed the feedback" is a
 *   worse outcome than "the feedback does not move".
 * - **`delay`/`showAfter` is deliberately absent.** Suppressing a spinner for N
 *   ms is a real pattern but it hides the pending state from exactly the users
 *   on slow connections; hosts that want it compose it around the region.
 */

const loadingIndicatorVariants = cva(
  // `motion-reduce:` stops the rotation rather than hiding the element: reduced
  // motion means "do not move this", not "show nothing".
  "kern-loading-indicator inline-flex animate-spin rounded-full border-2 border-(--md-sys-color-primary) border-t-transparent motion-reduce:animate-none",
  {
    variants: {
      size: {
        sm: "size-4 border-2",
        default: "size-6 border-2",
        lg: "size-10 border-4",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export type LoadingIndicatorProps = Omit<
  ComponentPropsWithRef<"span">,
  "children"
> &
  VariantProps<typeof loadingIndicatorVariants> & {
    /** Accessible name. Also the visible text when `showLabel`. */
    label?: string;
    /** Renders `label` as visible text beside the indicator. */
    showLabel?: boolean;
  };

export function LoadingIndicator({
  size,
  label = "Loading",
  showLabel = false,
  className,
  ...props
}: LoadingIndicatorProps) {
  return (
    <span
      data-slot="loading-indicator"
      data-testid="kern-loading-indicator"
      // role="status" is a polite live region: the label is announced when the
      // indicator appears, without interrupting whatever is being read.
      role="status"
      aria-label={showLabel ? undefined : label}
      className="inline-flex items-center gap-2"
    >
      <span
        aria-hidden="true"
        className={cn(loadingIndicatorVariants({ size }), className)}
        {...props}
      />
      {showLabel ? (
        <span data-slot="loading-indicator-label" className="text-sm">
          {label}
        </span>
      ) : null}
    </span>
  );
}

/**
 * A region plus its loading indicator — the shape a consumer almost always
 * wants, because `aria-busy` has to land on the region being loaded, not on the
 * spinner. Split out so the pairing cannot be forgotten at each call site.
 */
export type LoadingRegionProps = {
  loading: boolean;
  /** Content rendered while not loading. */
  children: ReactNode;
  /** Content rendered while loading. Defaults to nothing. */
  fallback?: ReactNode;
  label?: string;
  className?: string;
};

export function LoadingRegion({
  loading,
  children,
  fallback,
  label = "Loading",
  className,
}: LoadingRegionProps) {
  return (
    <div
      data-slot="loading-region"
      aria-busy={loading || undefined}
      aria-live="polite"
      className={className}
    >
      {loading ? (fallback ?? <LoadingIndicator label={label} />) : children}
    </div>
  );
}

export { loadingIndicatorVariants };
