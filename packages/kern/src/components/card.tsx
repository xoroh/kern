import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef, ElementType } from "react";
import { cn } from "../utils/cn";

const cardVariants = cva(
  "kern-card rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface)",
  {
    variants: {
      variant: {
        filled: "shadow-none",
        outlined: "border border-(--md-sys-color-outline-variant)",
        elevated: "shadow-(--md-sys-elevation-level1)",
      },
    },
    defaultVariants: { variant: "filled" },
  },
);

export type CardProps<T extends ElementType = "div"> = {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, "as" | "className"> &
  VariantProps<typeof cardVariants> & { className?: string };

export function Card<T extends ElementType = "div">({
  as,
  variant,
  className,
  ...props
}: CardProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}

export { cardVariants };
