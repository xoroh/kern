import { Field } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type TextareaProps = Omit<
  ComponentProps<typeof Field.Control>,
  "render"
> & {
  error?: boolean;
};

export function Textarea({
  error = false,
  "aria-invalid": ariaInvalid,
  className,
  ...props
}: TextareaProps) {
  return (
    <Field.Control
      render={<textarea />}
      data-slot="textarea"
      aria-invalid={error || ariaInvalid || undefined}
      className={cnState(
        "kern-textarea min-h-[112px] w-full rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-4 py-3 text-base text-(--md-sys-color-on-surface) outline-none transition-colors placeholder:text-(--md-sys-color-on-surface-variant) focus:border-(--md-sys-color-primary) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-(--md-sys-color-error)",
        error && "border-(--md-sys-color-error)",
        className,
      )}
      {...props}
    />
  );
}
