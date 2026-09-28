import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const textVariants = cva("kern-text", {
  variants: {
    variant: {
      body: "text-sm",
      label: "text-sm font-medium",
      title: "text-lg font-semibold",
      headline: "text-2xl font-semibold tracking-tight",
    },
  },
  defaultVariants: { variant: "body" },
});

export type TextProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textVariants>;

export function Text({ variant, className, ...props }: TextProps) {
  return (
    <p
      data-slot="text"
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}

export { textVariants };
