import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const chipVariants = cva(
  "kern-chip inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        assist:
          "bg-(--md-sys-color-surface-tonal) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)",
        filter:
          "bg-(--md-sys-color-surface-tonal) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high) data-selected:bg-(--md-sys-color-primary) data-selected:text-(--md-sys-color-on-primary)",
        suggestion:
          "border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-tonal)",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    defaultVariants: { variant: "assist", selected: false },
  },
);

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof chipVariants>;

export function Chip({ variant, selected, className, ...props }: ChipProps) {
  return (
    <button
      data-slot="chip"
      aria-pressed={variant === "filter" ? Boolean(selected) : undefined}
      data-selected={selected || undefined}
      className={cn(chipVariants({ variant, selected }), className)}
      {...props}
    />
  );
}

export { chipVariants };
