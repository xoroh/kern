import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef, ElementType } from "react";
import { cn } from "../utils/cn";

const cardVariants = cva(
  "kern-card rounded-(--sys-shape-corner-medium) bg-(--sys-color-surface)",
  {
    variants: {
      variant: {
        filled: "bg-(--sys-color-surface-container-highest) shadow-none",
        outlined:
          "border border-(--sys-color-outline-variant) bg-(--sys-color-surface)",
        elevated:
          "bg-(--sys-color-surface-container-low) shadow-(--sys-elevation-level1)",
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

/**
 * M3 card anatomy slots. The root is deliberately bare — these carry the
 * spec's content geometry so hosts stop re-deriving it: 16dp content
 * padding, 8dp action rows with 8dp gaps (text-button actions, end-aligned).
 */
export function CardHeader({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("kern-card-header flex flex-col gap-1 p-4 pb-0", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("kern-card-content p-4", className)}
      {...props}
    />
  );
}

export function CardActions({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="card-actions"
      role="group"
      className={cn("kern-card-actions flex items-center justify-end gap-2 p-2", className)}
      {...props}
    />
  );
}

export { cardVariants };
