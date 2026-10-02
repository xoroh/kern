import type { ComponentDoc } from "../types";

export const inputOTP: ComponentDoc = {
  slug: "input-otp",
  name: "Input OTP",
  oneLiner:
    "Input OTP is the one-code-per-position field, with a completion callback and a per-position keyboard.",
  features:
    "Reach for it when the answer is a short fixed-length code: a one-time code, a PIN, an invite code. The length is a number of POSITIONS rather than a character cap, and the field fills one position at a time. Two props do the work. `onComplete` fires once every position is filled, which is where you submit — no separate done button to miss. And `keyboardType` restricts the per-position keyboard, with `numeric` matching `inputmode=numeric`, so a numeric code asks for a number pad instead of a full keyboard.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory. The web one binds
    // the cell count to rendered inputs; this one takes `length`.
    nativePeer: "InputOTP",
    variants: [],
    elevation: "surface",
  },
  parts: ["InputOTP"],
  customization: {
    supported: [
      "`length` sets the number of positions.",
      "`keyboardType` restricts the per-position keyboard to `numeric` or `default`.",
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled.",
    ],
    notSupported: [
      "There is no `pattern` or per-position mask. It takes characters into fixed positions.",
      "There is no `separator` or grouping prop. The positions are the positions.",
      "`length` is a number here — the web variant derives its count from the rendered inputs instead.",
    ],
  },
  api: [
    {
      name: "length",
      type: "number",
      note: "The number of character POSITIONS, not a character cap. Note the difference from the web `InputOTP`, which derives its cell count from the rendered inputs rather than taking a length.",
    },
    {
      name: "onComplete",
      type: "(value: string) => void",
      note: "Fires ONCE every position is filled. This is where submission belongs — there is no separate done button to miss.",
    },
    {
      name: "keyboardType",
      type: '"numeric" | "default"',
      note: "Restricts the per-position keyboard. `numeric` matches `inputmode=numeric`, so a numeric code gets a number pad.",
    },
    {
      name: "value / defaultValue / onValueChange",
      type: "string",
      note: "The code as a string. Controlled or uncontrolled.",
    },
    {
      name: "toOTPPositions(value, length)",
      type: "(value: string, length: number) => string[]",
      note: "A pure helper exported for placing characters into positions. Not a component and not a registry row — documented here rather than given a page of its own.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the field. A row of boxes with no name is not a code field to anyone who cannot see it.",
    },
  ],
  aria: [
    "`accessibilityLabel` is essential: the control renders as a row of boxes, which means nothing without a name.",
    "`onComplete` firing at a fixed point is what makes the flow predictable — the code is submitted when it is whole, not when a button happens to be pressed.",
    "`keyboardType` is an accessibility improvement as much as a convenience: the right keyboard is the difference between a quick entry and a hunt for the number row.",
  ],
};
