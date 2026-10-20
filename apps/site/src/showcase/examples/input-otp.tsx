import { InputOTP } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Input OTP examples — one boxed character per position.
 *
 * The root carries the LENGTH and the value; the cells are the inputs. The
 * number of cells is what makes the length visible, and the value is one
 * string however it was entered, so the caller never assembles it from
 * parts.
 *
 * WEB composition. The native field takes `length` as a prop and draws its
 * own boxes; the mobile page carries its own live demo.
 */
export const INPUT_OTP_EXAMPLES: ExampleSpec[] = [
  {
    id: "input-otp-cells",
    title: "One code, one string, however it was typed",
    description:
      "The root holds the length and the value; each cell is a real text input, so the numeric keyboard appears and the code is announced as one field rather than as disconnected boxes. Typing a character advances to the next cell, and a paste fills the row from one entry.",
    render: () => (
      <InputOTP.Root length={4} aria-label="One-time code">
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
      </InputOTP.Root>
    ),
    code: `<InputOTP.Root length={4} aria-label="One-time code">
  <InputOTP.Input />
  <InputOTP.Input />
  <InputOTP.Input />
  <InputOTP.Input />
</InputOTP.Root>`,
  },
];
