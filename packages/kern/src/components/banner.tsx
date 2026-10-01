import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../utils/cn";

/**
 * `variants` = intent, the same axis as `FieldMessage` (informative,
 * positive, cautionary, negative). One prop name, one meaning across the set.
 */
const bannerVariants = cva(
  "kern-banner flex items-start gap-3 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) px-4 py-3 text-sm shadow-(--md-sys-elevation-level1)",
  {
    variants: {
      variant: {
        info: "bg-(--md-sys-color-info-container) text-(--md-sys-color-on-info-container)",
        success:
          "bg-(--md-sys-color-success-container) text-(--md-sys-color-on-success-container)",
        warning:
          "bg-(--md-sys-color-warning-container) text-(--md-sys-color-on-warning-container)",
        error:
          "bg-(--md-sys-color-error-container) text-(--md-sys-color-on-error-container)",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export type BannerProps = ComponentProps<"div"> &
  VariantProps<typeof bannerVariants> & {
    /** Leading slot: usually an `Icon` matching the intent. */
    icon?: ReactNode;
    /** When true the banner takes `role="alert"` (assertive announcement). */
    assertive?: boolean;
    /** Renders a dismiss button and calls back when it is pressed. */
    onDismiss?: () => void;
  };

export function Banner({
  variant,
  icon,
  assertive,
  onDismiss,
  className,
  children,
  ...props
}: BannerProps) {
  return (
    <div
      data-slot="banner"
      data-variant={variant ?? "info"}
      role={assertive ? "alert" : "status"}
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    >
      {icon ? (
        <span data-slot="banner-icon" className="shrink-0 leading-none">
          {icon}
        </span>
      ) : null}
      <span data-slot="banner-text" className="min-w-0 flex-1">
        {children}
      </span>
      {onDismiss ? (
        <button
          data-slot="banner-dismiss"
          type="button"
          aria-label="Dismiss"
          className={cn(
            "kern-banner-dismiss shrink-0 cursor-pointer rounded-(--md-sys-shape-corner-extra-small) px-2 py-1 font-medium outline-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-on-surface)",
          )}
          onClick={onDismiss}
        />
      ) : null}
    </div>
  );
}

export type BannerActionProps = ComponentProps<"button">;

/** Inline action rendered in the banner's trailing slot. */
export function BannerAction({ className, ...props }: BannerActionProps) {
  return (
    <button
      data-slot="banner-action"
      type="button"
      className={cn(
        "kern-banner-action shrink-0 cursor-pointer rounded-(--md-sys-shape-corner-full) px-3 py-1 font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export { bannerVariants };
