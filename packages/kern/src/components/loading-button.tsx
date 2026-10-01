import type { LoadingIndicatorStyle } from "@xoroh/kern-tokens";
import { cn } from "../utils/cn";
import { type ButtonProps, buttonVariants } from "./button";
import { CircularProgress } from "./circular-progress";

export type LoadingButtonProps = ButtonProps & {
  /** Shows the embedded progress indicator and blocks interaction. */
  loading?: boolean;
  /** 0–1 determinate progress while loading. Omit for the loop. */
  value?: number;
  /** Style of the embedded indicator. Defaults to the M3 ring (`spinner`). */
  loaderStyle?: LoadingIndicatorStyle;
};

/**
 * LoadingButton — button with embedded progress. Keeps its label and
 * footprint while loading (M3: never resize chrome for progress) and
 * hands the wait to a CircularProgress in the leading slot.
 */
export function LoadingButton({
  loading = false,
  value,
  loaderStyle,
  variant,
  size,
  type = "button",
  className,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      data-slot="loading-button"
      data-testid="loading-button"
      data-loading={loading ? "" : undefined}
      aria-busy={loading ? true : undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <CircularProgress
          value={value}
          loaderStyle={loaderStyle}
          size="sm"
          label="Loading"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
}
