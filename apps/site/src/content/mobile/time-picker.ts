import type { ComponentDoc } from "../types";

export const timePicker: ComponentDoc = {
  slug: "time-picker",
  name: "Time picker",
  oneLiner:
    "The time picker is hour and minute — plus the period in 12-hour mode — as traversable listboxes, with the value kept in 24-hour state.",
  features:
    "Reach for a time picker when the answer is a time of day: a reminder, a booking slot, a schedule entry. Each field is its OWN traversal axis — the web contract is one tab stop per field, and the picker mirrors it with a roving model per field — so a keyboard user can reach the minutes without passing through the hours. Twelve-hour is PRESENTATION, never state: the value is 24-hour internally and always normalised before it is reported, so a consumer that persists it cannot drift. `step` sets minute granularity, and an out-of-range value can never reach `onValueChange`.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "TimePicker",
    variants: ["format: 24h · 12h"],
    elevation: "surface",
  },
  parts: ["TimePicker"],
  customization: {
    supported: [
      "`value` / `defaultValue` / `onValueChange` are the controlled-uncontrolled pair; the callback always receives the NORMALISED value.",
      "`format` is `24h` or `12h` — 12-hour adds the AM/PM field and still reports 24-hour state.",
      "`step` is the minute granularity; `timeFieldStyles` is exported for the field and option treatments without the component.",
    ],
    notSupported: [
      "There is no seconds field and no timezone. The value is a wall-clock hour and minute — a timezone-aware instant is the host's job.",
      "There is no clock dial or input box. The fields ARE the input: an alternative presentation is a composed control.",
      "A `step` that is not an integer divisor of 60 falls back to 1 rather than being coerced — invalid granularity is rejected, not guessed at.",
    ],
  },
  api: [
    {
      name: "value",
      type: "TimePickerValue (`{ hours, minutes }`)",
      note: "Controlled value, 24-hour. Normalised against `step` before it is ever read back.",
    },
    {
      name: "defaultValue",
      type: "TimePickerValue",
      note: "Uncontrolled starting value. Omit `value` to let the picker own the state.",
    },
    {
      name: "onValueChange",
      type: "(value: TimePickerValue) => void",
      note: "Receives the NORMALISED value only — a consumer must never receive an out-of-range time.",
    },
    {
      name: "format",
      type: 'TimePickerFormat ("24h" | "12h")',
      default: '"24h"',
      note: "Presentation axis. `12h` adds the period field and labels hours 1–12; the STATE stays 24-hour either way.",
    },
    {
      name: "step",
      type: "number",
      default: "1",
      note: "Minute granularity. Must be an integer that divides 60; anything else falls back to 1 rather than being coerced.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      default: '"Time picker"',
      note: "The group's name for assistive technology.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles for the group. `timeFieldStyles` is exported for the field and option treatments.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-time-picker"',
      note: "Test hook for the group; each field and option derives its own testID from its label.",
    },
  ],
  aria: [
    "Each field is its own traversal axis — three tab stops, not one — because a shared axis would make the whole picker one stop and the minutes unreachable.",
    'Each option reports `option` role with `selected` and `disabled`, labelled "<field> <value>" so the field context travels with the option.',
    "Platform difference, recorded rather than papered over: React Native's role union carries no `listbox`, so a field announces as a LIST where web says listbox — the per-option `selected` state is what carries the selection, so the information survives even though the container's promise does not.",
  ],
};
