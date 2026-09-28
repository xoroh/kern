import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

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

export function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { badgeVariants };
