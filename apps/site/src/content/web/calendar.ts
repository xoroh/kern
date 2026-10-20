import type { ComponentDoc } from "../types";

export const calendar: ComponentDoc = {
  slug: "calendar",
  name: "Calendar",
  oneLiner: "Calendars pick a single date from a month grid.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Calendar",
    // No variant axis. Which date is chosen is state.
    variants: [],
    elevation: "surface",
  },
  parts: ["Calendar"],
  // The grid contract, read off the day buttons and the Axis calendar model
  // the handler calls: the days are a roving-tabindex grid, and the model
  // decides where each key lands.
  keyboard: [
    {
      key: "Arrow keys",
      action:
        "Move the day cursor: left and right by a day, up and down by a week. The focused day follows the cursor, so the two cannot disagree.",
    },
    {
      key: "Home / End",
      action: "Jump to the first or the last day of the week the cursor is in.",
    },
    {
      key: "PageUp / PageDown",
      action:
        "Move the same day of the month one month back or forward, so the cursor can cross a month boundary without leaving the grid.",
    },
    {
      key: "Tab",
      action:
        "Enters and leaves the grid as one stop. The days carry a roving tabindex, so only the cursor day is a tab stop at a time — and a day outside `min` and `max` is skipped rather than focused.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the calendar's own classes.",
      "`min` and `max` bound the selectable range, so an impossible date is unselectable rather than selectable-and-rejected.",
      "The value is a `Date` at midnight local time, so comparing two selected dates is a whole-day comparison rather than an instant one.",
    ],
    notSupported: [
      "There is no locale or first-day-of-week prop. The weekday names and the month names resolve from the Axis date model (English, Sunday-first, by default), so a non-English interface needs a different calendar or a change here — this is a real limitation, not an oversight to work around silently.",
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
