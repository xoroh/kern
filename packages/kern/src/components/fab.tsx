import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

const fabVariants = cva(
  "kern-fab relative inline-flex shrink-0 items-center justify-center gap-2 rounded-(--md-sys-shape-corner-large) text-sm font-medium shadow-(--md-sys-elevation-level1) transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-50 after:absolute after:-inset-2 after:content-[''] [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) hover:bg-(--md-sys-color-primary)/90",
        tonal:
          "bg-(--md-sys-color-surface-tonal) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)",
      },
      size: {
        default: "h-14 px-5",
        sm: "h-10 px-4",
        icon: "h-14 w-14 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export type FabProps = ComponentPropsWithRef<"button"> &
  VariantProps<typeof fabVariants> & {
    /** Accessible name for icon-only fabs. */
    "aria-label"?: string;
  };

/** Floating action button for the single primary screen action. */
export function Fab({
  variant,
  size,
  type = "button",
  className,
  ...props
}: FabProps) {
  return (
    <button
      data-slot="fab"
      className={cn(fabVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}

export { fabVariants };
