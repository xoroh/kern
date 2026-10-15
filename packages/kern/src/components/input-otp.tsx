import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type InputOTPRootProps = ComponentProps<typeof OTPFieldPrimitive.Root>;
export type InputOTPInputProps = ComponentProps<typeof OTPFieldPrimitive.Input>;

export function InputOTPRoot({ className, ...props }: InputOTPRootProps) {
  return (
    <OTPFieldPrimitive.Root
      data-slot="input-otp"
      className={cnState("kern-input-otp flex items-center gap-2", className)}
      {...props}
    />
  );
}

export function InputOTPInput({ className, ...props }: InputOTPInputProps) {
  return (
    <OTPFieldPrimitive.Input
      data-slot="input-otp-input"
      className={cnState(
        "kern-input-otp-input h-14 w-12 rounded-(--sys-shape-corner-small) border border-(--sys-color-outline) bg-(--sys-color-surface) text-center text-base text-(--sys-color-on-surface) outline-none transition-colors focus:border-(--sys-color-primary) data-filled:border-(--sys-color-primary)",
        className,
      )}
      {...props}
    />
  );
}

/** One-time-code input: one boxed character per position. */
export const InputOTP = {
  Root: InputOTPRoot,
  Input: InputOTPInput,
};
