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
      className="kern-number-field-group flex h-14 items-stretch overflow-hidden rounded-(--md-sys-shape-corner-extra-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) transition-colors hover:border-(--md-sys-color-on-surface) focus-within:border-2 focus-within:border-(--md-sys-color-primary)"
    >
      <NumberFieldPrimitive.Decrement
        data-slot="number-field-decrement"
        aria-label="Decrease"
        className="kern-number-field-stepper relative flex w-12 cursor-pointer items-center justify-center text-lg text-(--md-sys-color-on-surface) outline-none transition-colors duration-200 ease-(--md-sys-motion-easing-standard) focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:text-(--md-sys-color-on-surface)/38 before:absolute before:inset-0 before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--md-sys-color-on-surface) hover:before:opacity-[var(--md-sys-state-hover)] focus-visible:before:opacity-[var(--md-sys-state-focus)] active:before:opacity-[var(--md-sys-state-press)] disabled:before:opacity-0"
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
        className="kern-number-field-stepper relative flex w-12 cursor-pointer items-center justify-center text-lg text-(--md-sys-color-on-surface) outline-none transition-colors duration-200 ease-(--md-sys-motion-easing-standard) focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:text-(--md-sys-color-on-surface)/38 before:absolute before:inset-0 before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--md-sys-color-on-surface) hover:before:opacity-[var(--md-sys-state-hover)] focus-visible:before:opacity-[var(--md-sys-state-focus)] active:before:opacity-[var(--md-sys-state-press)] disabled:before:opacity-0"
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
