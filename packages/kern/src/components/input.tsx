import { Field as FieldPrimitive } from "@base-ui/react/field";
import { type ComponentPropsWithRef, useId } from "react";
import { cnState } from "../utils/cnState";
import { FieldMessage } from "./field-message";

export type InputProps = ComponentPropsWithRef<
  typeof FieldPrimitive.Control
> & {
  error?: boolean;
  /**
   * The error TEXT, not just the error state. Present ⇒ `error` is implied
   * (`aria-invalid` fires) and the message renders as a `FieldMessage
   * variant="error"` — already `role="alert"` — associated to the field via
   * `aria-describedby`.
   *
   * This is the web half of a contract the native renderer already honours
   * (`NativeInputProps.errorMessage`), where the message is folded into the
   * announced hint because RN has no `accessibilityState.invalid`. The delivery
   * attributes stay asymmetric and documented; the public prop surface does
   * not. Do not also pass a sibling `FieldMessage` — this prop owns it.
   */
  errorMessage?: string;
};

export function Input({
  error = false,
  errorMessage,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  className,
  type,
  ...props
}: InputProps) {
  const errorMessageId = useId();
  // The message implies the state: a field carrying error text is an invalid
  // field, so a host must not have to pass both to get one announcement.
  const invalid = error || Boolean(errorMessage);
  const describedBy = !errorMessage
    ? ariaDescribedBy
    : ariaDescribedBy
      ? `${ariaDescribedBy} ${errorMessageId}`
      : errorMessageId;

  return (
    <>
      <FieldPrimitive.Control
        data-slot="input"
        type={type}
        aria-invalid={invalid || ariaInvalid || undefined}
        aria-describedby={describedBy}
        className={cnState(
          "kern-input h-14 w-full rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-4 text-base text-(--md-sys-color-on-surface) outline-none transition-colors placeholder:text-(--md-sys-color-on-surface-variant) focus:border-(--md-sys-color-primary) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-(--md-sys-color-error)",
          invalid && "border-(--md-sys-color-error)",
          className,
        )}
        {...props}
      />
      {errorMessage ? (
        <FieldMessage id={errorMessageId} variant="error">
          {errorMessage}
        </FieldMessage>
      ) : null}
    </>
  );
}
