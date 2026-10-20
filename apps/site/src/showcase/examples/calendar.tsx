import { Calendar } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Calendar examples — one month grid, one selected date.
 *
 * The value is a `Date` at MIDNIGHT LOCAL TIME, so two selections on the
 * same day compare equal rather than differing by an hour.
 */
export const CALENDAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "calendar-month-grid",
    title: "One month, one selected day",
    description:
      "The grid is the whole component: the day buttons are the only focusable things, and the month name is announced when it changes. `defaultValue` picks the day that starts selected.",
    render: () => (
      <Calendar
        defaultValue={new Date(2026, 1, 17)}
        aria-label="Release date"
      />
    ),
    code: `<Calendar defaultValue={new Date(2026, 1, 17)} aria-label="Release date" />`,
  },
];
