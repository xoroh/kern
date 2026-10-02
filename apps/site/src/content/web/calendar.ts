import type { ComponentDoc } from "../types";

export const calendar: ComponentDoc = {
  slug: "calendar",
  name: "Calendar",
  oneLiner: "Calendars pick a single date from a month grid.",
  features:
    "Reach for a calendar when the answer is one date and seeing the week around it helps: a birthday, a deadline, an appointment. The month grid is the point — people pick a date by its position as much as by its number. Constrain it with `min` and `max` rather than letting someone choose a date you will only reject. It is a month calendar for single-date picking: a range, or a date with a time, is not this component. Arrow keys move between the days, so it works without a pointer.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Calendar",
    // No variant axis. Which date is chosen is state.
    variants: [],
    elevation: "surface",
  },
  parts: ["Calendar"],
  customization: {
    supported: [
      "`className` is passed through and merged after the calendar's own classes.",
      "`min` and `max` bound the selectable range, so an impossible date is unselectable rather than selectable-and-rejected.",
      "The value is a `Date` at midnight local time, so comparing two selected dates is a whole-day comparison rather than an instant one.",
    ],
    notSupported: [
      "There is no locale or first-day-of-week prop. The weekday initials and the month names are English and fixed in the component, so a non-English interface needs a different calendar or a change to this one — this is a real limitation, not an oversight to work around silently.",
      "There is no `mode` prop for ranges. This is single-date picking; a range needs two dates and a different control.",
      "There is no `highlightDates` or `events` prop. The grid shows dates, not what happens on them.",
    ],
  },
  api: [
    {
      name: "value",
      type: "Date",
      note: "Controlled selection. A `Date` at MIDNIGHT LOCAL TIME — the time part is not meaningful and is normalised, so two selections on the same day compare equal.",
    },
    {
      name: "defaultValue",
      type: "Date",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(date: Date) => void",
      note: "Fires when a day is chosen, with that day at midnight local time. Note the prop is `onValueChange`, not `onChange` — the usual name is deliberately not on offer.",
    },
    {
      name: "min",
      type: "Date",
      note: "Earliest selectable date. Days before it are unselectable rather than selectable-and-rejected.",
    },
    {
      name: "max",
      type: "Date",
      note: "Latest selectable date.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the calendar's own classes.",
    },
  ],
  aria: [
    "The grid is a calendar of day buttons, so each day is reachable and selectable from the keyboard.",
    "Arrow keys move between the days — the interaction a date picker is expected to have and the reason this is not a plain grid of buttons.",
    "The month and the weekdays are labelled, so the grid is announced with its context rather than as bare numbers.",
    "Days outside `min` and `max` are unselectable rather than hidden, so the shape of the month is never misleading.",
  ],
};
