import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const cardVariants = cva("kern-card rounded-lg bg-(--md-sys-color-surface)", {
  variants: {
    variant: {
      filled: "shadow-[0_4px_16px_rgba(0,0,0,0.12)]",
      outlined: "border border-black/10",
      elevated: "shadow-[0_8px_30px_rgba(0,0,0,0.16)]",
    },
  },
  defaultVariants: { variant: "filled" },
});

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ variant, className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}

export { cardVariants };
