import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "kern-button inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-black/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) hover:bg-(--md-sys-color-primary)/90",
        tonal: "bg-[#efefef] text-black hover:bg-[#e5e5e5]",
        ghost: "text-black hover:bg-[#efefef]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-[13px]",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
