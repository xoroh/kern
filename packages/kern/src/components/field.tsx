import { Field as FieldPrimitive } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { Input } from "./input";

export type FieldRootProps = ComponentProps<typeof FieldPrimitive.Root>;
export type FieldLabelProps = ComponentProps<typeof FieldPrimitive.Label>;
export type FieldDescriptionProps = ComponentProps<
  typeof FieldPrimitive.Description
>;
export type FieldErrorProps = ComponentProps<typeof FieldPrimitive.Error>;

export function FieldRoot({ className, ...props }: FieldRootProps) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cnState("kern-field flex w-full flex-col gap-1.5", className)}
      {...props}
    />
  );
}

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cnState(
        "kern-field-label text-sm font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: FieldDescriptionProps) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cnState(
        "kern-field-description text-xs text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      role="alert"
      className={cnState(
        "kern-field-error text-xs text-(--md-sys-color-error)",
        className,
      )}
      {...props}
    />
  );
}

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Control: Input,
};
