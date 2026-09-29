import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn";

const badgeVariants = cva("kern-badge shrink-0", {
  variants: {
    variant: {
      dot: "size-1.5 rounded-full bg-(--md-sys-color-error)",
      count:
        "inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-(--md-sys-color-error) px-1 text-[11px] font-medium text-(--md-sys-color-on-error)",
    },
  },
  defaultVariants: { variant: "count" },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({
  variant,
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: BadgeProps) {
  const isDot = variant === "dot";
  return (
    <span
      data-slot="badge"
      role="img"
      aria-hidden={(isDot && !ariaLabel) || undefined}
      aria-label={ariaLabel}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { badgeVariants };
