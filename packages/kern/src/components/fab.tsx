import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

const fabVariants = cva(
  "kern-fab relative inline-flex shrink-0 items-center justify-center gap-2 rounded-(--md-sys-shape-corner-large) bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container) text-sm font-medium shadow-(--md-sys-elevation-level3) transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-50 after:absolute after:-inset-2 after:content-[''] [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      // M3's FAB variants are a SIZE axis — "Three variants: FAB, medium FAB,
      // large FAB" (m3.material.io/components/floating-action-button/overview) —
      // not an emphasis axis. The previous `variant: primary | tonal` conflated
      // two things M3 keeps separate: the FAB is `surface-primary-container`
      // filled; emphasis belongs to the Extended FAB's tonal treatment.
      size: {
        // small FAB (default, 56dp), medium FAB (96dp), large FAB (128dp)
        default: "h-14 px-5",
        medium: "h-24 w-24 px-0",
        large: "h-32 w-32 px-0",
        sm: "h-10 px-4",
        icon: "h-14 w-14 px-0",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export type FabProps = ComponentPropsWithRef<"button"> &
  VariantProps<typeof fabVariants> & {
    /** Accessible name for icon-only fabs. */
    "aria-label"?: string;
  };

/** Floating action button for the single primary screen action. */
export function Fab({ size, type = "button", className, ...props }: FabProps) {
  return (
    <button
      data-slot="fab"
      className={cn(fabVariants({ size }), className)}
      type={type}
      {...props}
    />
  );
}

export { fabVariants };
