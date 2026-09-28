import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const chipVariants = cva(
  "kern-chip inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-black/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        assist: "bg-[#efefef] text-black hover:bg-[#e5e5e5]",
        filter:
          "bg-[#efefef] text-black hover:bg-[#e5e5e5] data-selected:bg-black data-selected:text-white",
        suggestion:
          "border border-black/10 bg-white text-black hover:bg-[#efefef]",
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
