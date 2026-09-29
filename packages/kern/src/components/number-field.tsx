import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type NumberFieldRootProps = ComponentProps<
  typeof NumberFieldPrimitive.Root
>;
export type NumberFieldInputProps = ComponentProps<
  typeof NumberFieldPrimitive.Input
>;

export function NumberFieldRoot({ className, ...props }: NumberFieldRootProps) {
  return (
    <NumberFieldPrimitive.Root
      data-slot="number-field"
      className={cnState("kern-number-field grid gap-1.5", className)}
      {...props}
    />
  );
}

export function NumberFieldInput({
  className,
  ...props
}: NumberFieldInputProps) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className="kern-number-field-group flex h-14 items-stretch overflow-hidden rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) transition-colors focus-within:border-(--md-sys-color-primary)"
    >
      <NumberFieldPrimitive.Decrement
        data-slot="number-field-decrement"
        aria-label="Decrease"
        className="kern-number-field-stepper flex w-12 cursor-pointer items-center justify-center text-lg text-(--md-sys-color-on-surface) outline-none hover:bg-(--md-sys-color-surface-tonal) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-50"
      >
        −
      </NumberFieldPrimitive.Decrement>
      <NumberFieldPrimitive.Input
        data-slot="number-field-input"
        className={cnState(
          "kern-number-field-input min-w-0 flex-1 border-x border-(--md-sys-color-outline-variant) bg-transparent px-4 text-center text-base text-(--md-sys-color-on-surface) outline-none",
          className,
        )}
        {...props}
      />
      <NumberFieldPrimitive.Increment
        data-slot="number-field-increment"
        aria-label="Increase"
        className="kern-number-field-stepper flex w-12 cursor-pointer items-center justify-center text-lg text-(--md-sys-color-on-surface) outline-none hover:bg-(--md-sys-color-surface-tonal) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-50"
      >
        +
      </NumberFieldPrimitive.Increment>
    </NumberFieldPrimitive.Group>
  );
}

/** Stepped numeric input with increment/decrement buttons. */
export const NumberField = {
  Root: NumberFieldRoot,
  Input: NumberFieldInput,
};
