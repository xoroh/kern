import { Field as FieldPrimitive } from "@base-ui/react/field";
import type { ComponentPropsWithRef } from "react";
import { cnState } from "../utils/cnState";

export type InputProps = ComponentPropsWithRef<
  typeof FieldPrimitive.Control
> & {
  error?: boolean;
};

export function Input({
  error = false,
  "aria-invalid": ariaInvalid,
  className,
  type,
  ...props
}: InputProps) {
  return (
    <FieldPrimitive.Control
      data-slot="input"
      type={type}
      aria-invalid={error || ariaInvalid || undefined}
      className={cnState(
        "kern-input h-14 w-full rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-4 text-base text-(--md-sys-color-on-surface) outline-none transition-colors placeholder:text-(--md-sys-color-on-surface-variant) focus:border-(--md-sys-color-primary) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-(--md-sys-color-error)",
        error && "border-(--md-sys-color-error)",
        className,
      )}
      {...props}
    />
  );
}
