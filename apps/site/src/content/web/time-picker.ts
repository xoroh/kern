import type { ComponentDoc } from "../types";

export const timePicker: ComponentDoc = {
  slug: "time-picker",
  name: "Time picker",
  oneLiner:
    "Time pickers set a time of day with explicit hour and minute fields.",
  features:
    "Reach for a time picker when the answer is a time of day and precision matters: a scheduled send, an appointment, a reminder. The fields are explicit rather than a single text box, so nobody has to guess the expected format. The invariant that matters is that the state is always 24-hour, whatever the display format — `12h` adds an AM/PM field without changing what is stored, so switching the display never changes the value. If the answer is a duration rather than a time of day, this is not the tool.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/time-pickers",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "TimePicker",
    variants: ["format: 12h · 24h"],
    elevation: "surface",
  },
  parts: ["TimePicker"],
  customization: {
    supported: [
      "`format` chooses between a 24-hour display and a 12-hour one with an AM/PM field. It changes what is RENDERED, never what is stored.",
      "`step` sets the minute granularity, and `formatValue` overrides the rendered clock text for a locale.",
      "`className` is passed through and merged after the picker's own classes.",
    ],
    notSupported: [
      "There is no `seconds` prop. This is hours and minutes, which is what a time of day means in an interface.",
      "There is no `timezone` prop. A time of day has no zone; an instant does, and an instant is not this component.",
      "There is no `min`/`max` prop. Bounding the settable range is the caller's to enforce.",
    ],
  },
  api: [
    {
      name: "value",
      type: "{ hours: number; minutes: number }",
      note: "Controlled value. `hours` is 0–23 ALWAYS, whatever `format` renders — the state is 24-hour and only the display changes, so switching formats never alters the value.",
    },
    {
      name: "defaultValue",
      type: "{ hours: number; minutes: number }",
      note: "Initial value when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value: TimePickerValue) => void",
      note: "Fires with the new time, in the same 24-hour shape as `value`.",
    },
    {
      name: "format",
      type: '"12h" | "24h"',
      default: '"24h"',
      note: 'Display format. `"12h"` adds the AM/PM field; the stored state stays 24-hour either way.',
    },
    {
      name: "step",
      type: "number",
      default: "1",
      note: "Minute granularity. It MUST divide 60 — anything else falls back to 1 rather than producing a clock that cannot round-trip.",
    },
    {
      name: "formatValue",
      type: "(value: TimePickerValue) => string",
      note: 'Overrides the rendered clock text — `"09:30"` in a 24-hour locale, for instance. Display only.',
    },
    {
      name: "label",
      type: "string",
      note: "The accessible name of the control.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the picker's own classes.",
    },
  ],
  aria: [
    "The hour and minute fields are real inputs, so they take numeric entry and are reachable one at a time by keyboard.",
    "`label` names the whole control, so the fields are announced as parts of one time rather than as loose numbers.",
    "The 24-hour invariant means the announced value does not depend on the display format — the same time is reported whichever way it is drawn.",
  ],
};
