import type { ComponentDoc } from "../types";

export const timePicker: ComponentDoc = {
  slug: "time-picker",
  name: "Time picker",
  oneLiner:
    "Time pickers set a time of day with explicit hour and minute fields.",
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
  // The contract, read off the listboxes: each field is its own roving axis,
  // so the picker is three tab stops rather than one.
  keyboard: [
    {
      key: "Arrow keys",
      action:
        "Move within a field and select as they go — the hour, minute and period fields each have their own roving axis, so the value is never out of step with the focus. The dial face traverses the same way over its radio ring.",
    },
    {
      key: "Home / End",
      action:
        "Jump to the first or the last option of the focused field — the first hour, the last minute.",
    },
    {
      key: "Tab",
      action:
        "Moves between the fields, which are three stops rather than one, so the minutes are reachable without arrowing through every hour.",
    },
  ],
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
    {
      name: "testID",
      type: "string | undefined",
      note: "Test selector, rendered as `data-testid` on the picker. Opt-in only — no default.",
    },
    {
      name: "presentation",
      type: "TimePickerPresentation | undefined",
      note: "Which face the picker shows. `listbox` (default) is three listboxes; `dial` is the M3 clock face. Same state, same value contract.",
    },
  ],
  aria: [
    "The hour and minute fields are real inputs, so they take numeric entry and are reachable one at a time by keyboard.",
    "`label` names the whole control, so the fields are announced as parts of one time rather than as loose numbers.",
    "The 24-hour invariant means the announced value does not depend on the display format — the same time is reported whichever way it is drawn.",
  ],
};
