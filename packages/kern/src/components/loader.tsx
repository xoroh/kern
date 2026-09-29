import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

const loaderVariants = cva(
  "kern-loader inline-block animate-spin rounded-full border-2 border-(--md-sys-color-outline-variant) border-t-(--md-sys-color-primary) motion-reduce:animate-none",
  {
    variants: {
      size: {
        sm: "size-4",
        default: "size-6",
        lg: "size-10",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export type LoaderProps = Omit<ComponentPropsWithRef<"span">, "children"> &
  VariantProps<typeof loaderVariants> & {
    /** Accessible label announced while loading. */
    label?: string;
  };

/** Indeterminate activity spinner. Always needs a label for assistive tech. */
export function Loader({
  size,
  label = "Loading",
  className,
  ...props
}: LoaderProps) {
  return (
    <span
      data-slot="loader"
      role="status"
      aria-label={label}
      className={cn(loaderVariants({ size }), className)}
      {...props}
    />
  );
}

export { loaderVariants };
