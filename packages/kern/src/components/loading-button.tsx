import type { LoadingIndicatorStyle } from "@xoroh/kern-m3";
import { assignRef } from "../utils/assignRef";
import { cn } from "../utils/cn";
import type { ButtonButtonProps } from "./button";
import { buttonVariants } from "./button";
import { CircularProgress } from "./circular-progress";

export type LoadingButtonProps = Omit<
  ButtonButtonProps,
  "href" | "target" | "rel" | "download"
> & {
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
  color,
  shape,
  block,
  icon,
  iconPosition = "start",
  flipIcon = false,
  softDisabled = false,
  testID,
  type = "button",
  className,
  disabled,
  children,
  ref,
  ...props
}: LoadingButtonProps) {
  const blocked = disabled || loading || softDisabled;
  const iconNode = loading ? (
    <CircularProgress
      value={value}
      loaderStyle={loaderStyle}
      size="sm"
      label="Loading"
      aria-hidden="true"
    />
  ) : icon ? (
    <span
      data-slot="button-icon"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center",
        flipIcon && "rtl:scale-x-[-1]",
      )}
    >
      {icon}
    </span>
  ) : null;

  return (
    <button
      data-slot="loading-button"
      data-testid={testID ?? "loading-button"}
      data-loading={loading ? "" : undefined}
      aria-busy={loading ? true : undefined}
      aria-disabled={softDisabled ? true : undefined}
      className={cn(
        buttonVariants({ variant, size, color, shape, block }),
        className,
      )}
      disabled={disabled || loading}
      type={type}
      ref={(node) => {
        assignRef(ref, node);
      }}
      {...props}
      onClick={(event) => {
        if (blocked) {
          event.preventDefault();
          return;
        }
        props.onClick?.(event);
      }}
    >
      {iconPosition === "start" || loading ? iconNode : null}
      {children}
      {!loading && iconPosition === "end" ? iconNode : null}
    </button>
  );
}
