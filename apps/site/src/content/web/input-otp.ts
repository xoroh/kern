import type { ComponentDoc } from "../types";

export const inputOtp: ComponentDoc = {
  slug: "input-otp",
  name: "Input OTP",
  oneLiner:
    "OTP inputs take a short numeric code one character at a time, as it is typed.",
  features:
    "Reach for an OTP input when the code is short, numeric and read off a device or a message: a login code, a confirmation digit, a pairing pin. Splitting it into cells makes the length obvious and stops anyone pasting in the wrong thing. Keep the code length to what the sender actually issues, because a field that asks for six digits when the message sends eight is a dead end. If the value is a password or anything a person invents, that is a plain input — the OTP pattern is for codes someone else generates.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "InputOTP",
    // No variant axis. The code length is a value, not a treatment.
    variants: [],
    elevation: "surface",
  },
  parts: ["InputOTP", "InputOTPRoot", "InputOTPInput"],
  anatomy: [
    {
      name: "InputOTPRoot",
      role: "The field. Owns the code as one value, and lays out one cell per character.",
    },
    {
      name: "InputOTPInput",
      role: "One character cell. Focus and typing move through the cells while the value stays a single string.",
    },
    { name: "InputOTP", role: "The namespace object: Root and Input." },
  ],
  customization: {
    supported: [
      "`className` on the root lays out the row of cells; `className` on an input styles one cell.",
      "The cells use the input's border and shape, so an OTP field sits level with the other fields in a form.",
      "The value is one string however it is entered, so the caller never assembles it from parts.",
    ],
    notSupported: [
      "There is no `length` prop on the component. The number of cells comes from how many `InputOTPInput` you render, which is also what makes the length visible.",
      "There is no `mask` or `secret` mode. If the code should not be readable as it is typed, that is not this component.",
      "There is no `autoSubmit` prop. Submitting when the last cell is filled is the form's decision.",
    ],
  },
  api: [
    {
      name: "value",
      type: "string",
      note: "Controlled code on `InputOTPRoot` — one string for the whole code, not one per cell. Omit for uncontrolled.",
    },
    {
      name: "defaultValue",
      type: "string",
      note: "Initial code when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      note: "Fires as the code changes, with the whole string so far.",
    },
    {
      name: "className",
      type: "string",
      note: "On the root, lays out the cells. On `InputOTPInput`, styles a single cell.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Disables every cell together.",
    },
  ],
  aria: [
    "Each cell is a real text input, so the numeric keyboard appears on touch devices and screen readers treat each as editable text.",
    "The value is one code, so it is announced progressively as characters arrive rather than as disconnected boxes.",
    "Give the field a label through a `Field` as you would any other — the cells have no shared label of their own.",
  ],
};
