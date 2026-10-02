import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "kern-button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-(--md-sys-shape-corner-full) text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-50 after:absolute after:content-[''] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      // M3's FIVE color configurations (m3.material.io/components/buttons/overview):
      // elevated, filled, tonal, outlined, text. `destructive` is NOT one of them —
      // an error-coloured button is a filled button using the error roles, so it is
      // expressed by the caller rather than as a sixth axis. `ghost` maps to M3's
      // `text` button.
      variant: {
        elevated:
          "bg-(--md-sys-color-surface-container-low) text-(--md-sys-color-primary) shadow-(--md-sys-elevation-level1)",
        primary:
          "bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) hover:opacity-[var(--md-sys-state-hover)]",
        tonal:
          "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)",
        outlined:
          "border border-(--md-sys-color-outline) text-(--md-sys-color-primary)",
        ghost:
          "text-(--md-sys-color-primary) hover:bg-(--md-sys-color-surface-tonal)",
      },
      size: {
        default: "h-10 px-4 after:-inset-1",
        sm: "h-8 px-3 text-[13px] after:-inset-2",
        icon: "h-10 w-10 px-0 after:-inset-1",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export type ButtonProps = ComponentPropsWithRef<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({
  variant,
  size,
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}

export { buttonVariants };
