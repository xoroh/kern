import { Field as FieldPrimitive } from "@base-ui/react/field";
import {
  type ComponentPropsWithRef,
  type ReactNode,
  useId,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { cnState } from "../utils/cnState";
import { FieldMessage } from "./field-message";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type InputVariant = "outlined" | "filled";

export type InputProps = ComponentPropsWithRef<
  typeof FieldPrimitive.Control
> & {
  /**
   * M3 text-field treatment. `outlined` (default) draws the 1px outline that
   * moves to `primary` on focus; `filled` fills `surface-container-highest`
   * with a bottom active indicator. Functionally identical — pick by surface.
   */
  variant?: InputVariant;
  /**
   * Affix text rendered inside the field before the value (`$` in `$0.00`).
   * Set in `on-surface-variant`, per M3's prefix-text role.
   */
  prefix?: ReactNode;
  /**
   * Affix text rendered inside the field after the value (`.00` in `$0.00`).
   * Set in `on-surface-variant`, per M3's suffix-text role.
   */
  suffix?: ReactNode;
  /**
   * Shows a `current/maxlength` counter beneath the field when `maxLength`
   * is set. Per M3, the counter appears automatically with `maxlength`.
   */
  showCounter?: boolean;
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
  variant = "outlined",
  error = false,
  errorMessage,
  prefix,
  suffix,
  showCounter = false,
  maxLength,
  defaultValue,
  value,
  onChange,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  className,
  type,
  ...props
}: InputProps) {
  const errorMessageId = useId();
  const counterId = useId();
  // The message implies the state: a field carrying error text is an invalid
  // field, so a host must not have to pass both to get one announcement.
  const invalid = error || Boolean(errorMessage);
  const describedBy = [ariaDescribedBy, errorMessage ? errorMessageId : null]
    .filter(Boolean)
    .join(" ");
  const hasAffixes = prefix !== undefined || suffix !== undefined;
  // Character counter: controlled length wins; otherwise track edits locally
  // from the default. Only rendered when maxLength caps the field. Base UI
  // types maxLength as string-or-function; the counter needs a number.
  const maxLengthNumber =
    typeof maxLength === "number"
      ? maxLength
      : typeof maxLength === "string"
        ? Number.parseInt(maxLength, 10)
        : Number.NaN;
  const [localLength, setLocalLength] = useState(
    String(defaultValue ?? value ?? "").length,
  );
  const showCount =
    showCounter &&
    Number.isFinite(maxLengthNumber) &&
    (maxLengthNumber as number) > 0;
  const count = value !== undefined ? String(value).length : localLength;
  const boxClass = cn(
    variant === "filled"
      ? "rounded-t-(--sys-shape-corner-extra-small) border-b border-(--sys-color-on-surface-variant) bg-(--sys-color-surface-container-highest) focus-within:border-b-2 focus-within:border-(--sys-color-primary)"
      : "rounded-(--sys-shape-corner-extra-small) border border-(--sys-color-outline) bg-(--sys-color-surface) hover:border-(--sys-color-on-surface) focus-within:border-2 focus-within:border-(--sys-color-primary)",
  );
  const controlClass = cnState(
    "kern-input h-14 w-full text-base text-(--sys-color-on-surface) outline-none transition-colors placeholder:text-(--sys-color-on-surface-variant) " +
      FOCUS_RING_CLASS +
      " disabled:cursor-not-allowed disabled:text-(--sys-color-on-surface)/38 disabled:placeholder:text-(--sys-color-on-surface)/38" +
      (hasAffixes
        ? " border-0 bg-transparent px-0"
        : variant === "filled"
          ? " rounded-t-(--sys-shape-corner-extra-small) border-b border-(--sys-color-on-surface-variant) bg-(--sys-color-surface-container-highest) px-4 focus:border-b-2 focus:border-(--sys-color-primary) disabled:border-(--sys-color-on-surface)/38 disabled:bg-(--sys-color-on-surface)/4 data-invalid:border-(--sys-color-error)"
          : " rounded-(--sys-shape-corner-extra-small) border border-(--sys-color-outline) bg-(--sys-color-surface) px-4 hover:border-(--sys-color-on-surface) focus:border-2 focus:border-(--sys-color-primary) focus:px-[15px] disabled:border-(--sys-color-on-surface)/12 disabled:bg-transparent disabled:text-(--sys-color-on-surface)/38 data-invalid:border-(--sys-color-error)"),
    invalid && "data-invalid:border-(--sys-color-error)",
    invalid &&
      variant === "outlined" &&
      !hasAffixes &&
      "border-(--sys-color-error)",
    className,
  );

  const control = (
    <FieldPrimitive.Control
      data-slot="input"
      data-variant={variant}
      type={type}
      aria-invalid={invalid || ariaInvalid || undefined}
      aria-describedby={
        [describedBy, showCount ? counterId : null].filter(Boolean).join(" ") ||
        undefined
      }
      maxLength={maxLength}
      defaultValue={defaultValue}
      value={value}
      onChange={(event) => {
        setLocalLength(event.target.value.length);
        (onChange as React.ChangeEventHandler<HTMLInputElement> | undefined)?.(
          event,
        );
      }}
      className={controlClass}
      {...props}
    />
  );

  return (
    <>
      {hasAffixes ? (
        <div
          data-slot="input-affix-box"
          className={cn(boxClass, "flex items-center gap-2 px-4")}
        >
          {prefix ? (
            <span
              data-slot="input-prefix"
              aria-hidden="true"
              className="shrink-0 text-base text-(--sys-color-on-surface-variant)"
            >
              {prefix}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">{control}</div>
          {suffix ? (
            <span
              data-slot="input-suffix"
              aria-hidden="true"
              className="shrink-0 text-base text-(--sys-color-on-surface-variant)"
            >
              {suffix}
            </span>
          ) : null}
        </div>
      ) : (
        control
      )}
      {showCount ? (
        <span
          id={counterId}
          data-slot="input-counter"
          className="block text-right text-xs text-(--sys-color-on-surface-variant)"
        >
          {count}/{maxLengthNumber}
        </span>
      ) : null}
      {errorMessage ? (
        <FieldMessage id={errorMessageId} variant="error">
          {errorMessage}
        </FieldMessage>
      ) : null}
    </>
  );
}
