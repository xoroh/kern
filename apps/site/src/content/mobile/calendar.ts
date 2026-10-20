import type { ComponentDoc } from "../types";

export const calendar: ComponentDoc = {
  slug: "calendar",
  name: "Calendar",
  oneLiner:
    "The calendar is a month grid for picking one date — bounded by min and max, driven by a controlled or uncontrolled value.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Calendar",
    variants: [],
    elevation: "surface",
  },
  parts: ["Calendar"],
  // The touch contract: there are no arrow keys on a phone, so traversal is
  // by press. The month steppers and the days are separate named controls.
  keyboard: [
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Picks the focused day. Each day is a `button` pressable named with its full date and reporting `selected`, so the press lands on a date rather than on a number.",
    },
    {
      key: "Swipe (TalkBack / VoiceOver)",
      action:
        "Moves through the month name, the two month steppers and the days in reading order; the selected day announces as selected.",
    },
  ],
  customization: {
    supported: [
      "`value` / `defaultValue` / `onValueChange` are the controlled-uncontrolled pair for the selected date.",
      "`min` and `max` bound the selectable range; days outside it are rendered disabled, not hidden.",
      "`style` is a React Native `ViewStyle` for the framed grid.",
    ],
    notSupported: [
      "There is no range selection and no multi-select. One date is the whole contract — a booking range is two calendars or a composed pair.",
      "No locale or first-day-of-week control: weekday order and month names resolve from the Axis date model (English, Sunday-first, by default), so a non-English interface still needs a different calendar or a change here.",
      "There is no day-content slot. Days are day numbers — an availability dot or a price per day is a composed grid, not this one.",
    ],
  },
  api: [
    {
      name: "value",
      type: "Date",
      note: "Controlled selected date, normalised to the start of the day. `onValueChange` reports the same shape back.",
    },
    {
      name: "defaultValue",
      type: "Date",
      note: "Uncontrolled starting date. Omit `value` to let the calendar own the selection.",
    },
    {
      name: "onValueChange",
      type: "(date: Date) => void",
      note: "Fires with the picked date — the start of that day — and also moves the visible month to it.",
    },
    {
      name: "min",
      type: "Date",
      note: "Earliest selectable day. Days before it render disabled rather than disappearing.",
    },
    {
      name: "max",
      type: "Date",
      note: "Latest selectable day. Days after it render disabled rather than disappearing.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      default: '"Calendar"',
      note: "The grid region's name for assistive technology.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles for the framed grid.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-calendar"',
      note: "Test hook for the grid.",
    },
  ],
  aria: [
    "Each day is a `button` role pressable labelled with its full date string and reporting `selected` and `disabled` — a day is named, never just numbered.",
    'The month steppers are `button` role pressables labelled "Previous month" and "Next month" — glyph arrows that name themselves.',
    "The selected day is painted and announced from the same source, so the two signals cannot disagree.",
  ],
};
