import type { LabelHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: associated via htmlFor at usage.
    <label
      data-slot="label"
      className={cn("kern-label text-sm font-medium", className)}
      {...props}
    />
  );
}
