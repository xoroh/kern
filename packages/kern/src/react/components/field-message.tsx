import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const fieldMessageVariants = cva("kern-field-message text-xs", {
  variants: {
    variant: {
      description: "text-black/60",
      error: "text-[#dc2626]",
    },
  },
  defaultVariants: { variant: "description" },
});

export type FieldMessageProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof fieldMessageVariants>;

export function FieldMessage({
  variant,
  className,
  ...props
}: FieldMessageProps) {
  return (
    <p
      data-slot="field-message"
      role={variant === "error" ? "alert" : undefined}
      className={cn(fieldMessageVariants({ variant }), className)}
      {...props}
    />
  );
}

export { fieldMessageVariants };
