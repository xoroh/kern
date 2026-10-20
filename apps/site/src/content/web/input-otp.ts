import type { ComponentDoc } from "../types";

export const inputOtp: ComponentDoc = {
  slug: "input-otp",
  name: "Input OTP",
  oneLiner:
    "OTP inputs take a short numeric code one character at a time, as it is typed.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "InputOTP",
    // No variant axis. The code length is a value, not a treatment.
    variants: [],
    elevation: "surface",
  },
  parts: ["InputOTP", "InputOTPRoot", "InputOTPInput"],
  // The keyboard contract, read off the cells: the code is ONE field, so the
  // arrow keys move within it rather than out of it.
  keyboard: [
    {
      key: "0–9",
      action:
        "Fills the cell and moves the focus to the next one — the code advances as it is typed, so nobody has to go back and find the next box. A code that allows letters types the same way.",
    },
    {
      key: "ArrowLeft / ArrowRight",
      action:
        "Moves the focus to the previous or the next cell. The cells are one field, so the arrow keys travel within the code instead of out of it.",
    },
    {
      key: "Home / End",
      action: "Jumps to the first cell, or to the last filled one.",
    },
    {
      key: "Backspace",
      action:
        "Steps the focus back one cell, clearing a character on the way: the current cell's if it has one, the previous cell's if it is already empty.",
    },
    {
      key: "Delete",
      action: "Removes the character in this cell without moving the focus.",
    },
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
      for: ["InputOTPRoot"],
      type: "string",
      note: "Initial code when uncontrolled.",
    },
    {
      name: "onValueChange",
      for: ["InputOTPRoot"],
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
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `OTPFieldRootState` on the root, `OTPFieldInputState` on a cell.",
    },
    {
      name: "form",
      for: ["InputOTPRoot"],
      type: "string | undefined",
      note: "Id of the form that owns the hidden input, so the field can live outside the `<form>` and still submit with it.",
    },
    {
      name: "mask",
      for: ["InputOTPRoot"],
      type: "boolean | undefined",
      note: "Whether cells mask what was typed. For a custom input type, pass `type` to the individual cells instead.",
    },
    {
      name: "id",
      for: ["InputOTPRoot"],
      type: "string | undefined",
      note: "Id of the first cell. Later cells derive theirs (`{id}-2`, `{id}-3`, …).",
    },
    {
      name: "inputMode",
      for: ["InputOTPRoot"],
      type: '"search" | "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | undefined',
      note: "Virtual keyboard hint for the cells and the hidden validation input. Built-in validation modes set a sensible default; override it when the code is not what the mode assumes.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state.",
    },
    {
      name: "length",
      for: ["InputOTPRoot"],
      type: "number",
      note: "How many cells the code has. Required: the root clamps values, detects completion and writes validation markup off it.",
    },
    {
      name: "name",
      for: ["InputOTPRoot"],
      type: "string | undefined",
      note: "Field name submitted with the form. What the server receives under.",
    },
    {
      name: "autoComplete",
      for: ["InputOTPRoot"],
      type: "string | undefined",
      note: "Autofill hint, applied to the first cell and the hidden validation input.",
    },
    {
      name: "required",
      for: ["InputOTPRoot"],
      type: "boolean | undefined",
      note: "Whether a complete code is required before form submission.",
    },
    {
      name: "readOnly",
      for: ["InputOTPRoot"],
      type: "boolean | undefined",
      note: "Whether the code is fixed: cells show their digits but take no input.",
    },
    {
      name: "autoSubmit",
      for: ["InputOTPRoot"],
      type: "boolean | undefined",
      note: "Whether the owning form submits as soon as the code completes.",
    },
    {
      name: "validationType",
      for: ["InputOTPRoot"],
      type: "OTPValidationType | undefined",
      note: "What counts as a valid character for the code.",
    },
    {
      name: "normalizeValue",
      for: ["InputOTPRoot"],
      type: "((value: string) => string) | undefined",
      note: "Normalizes the value after whitespace and `validationType` filtering — runs on initial, controlled and typed values, so it must be idempotent. The result is filtered and clamped again.",
    },
    {
      name: "onValueInvalid",
      for: ["InputOTPRoot"],
      type: "((value: string, eventDetails: OTPFieldRootInvalidEventDetails) => void) | undefined",
      note: "Fires when typed text is rejected by validation or normalization, with the attempted string before filtering.",
    },
    {
      name: "onValueComplete",
      for: ["InputOTPRoot"],
      type: "((value: string, eventDetails: OTPFieldRootCompleteEventDetails) => void) | undefined",
      note: "Fires when the code completes — later than `onValueChange`, after the internal update lands. With `autoSubmit` it runs right before submitting.",
    },
  ],
  aria: [
    "Each cell is a real text input, so the numeric keyboard appears on touch devices and screen readers treat each as editable text.",
    "The value is one code, so it is announced progressively as characters arrive rather than as disconnected boxes.",
    "Give the field a label through a `Field` as you would any other — the cells have no shared label of their own.",
  ],
};
