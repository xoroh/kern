import { Calendar } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Calendar configurator — the nineteenth Part-4 configurator (move #19),
 * first hand-built date surface (no Base UI passthrough — kern owns the grid,
 * the roving tabindex, and the midnight-local value contract). Knobs are the
 * Root axes the component doc leaves open: uncontrolled `defaultValue`
 * (which day starts selected; `value` is controlled so NOT a knob — same rule
 * as `checked`/`open` everywhere) and the `min`/`max` bounds as one Bounds
 * switch (out-of-range days go unselectable, never removed — pinned by the
 * guard test in calendar.test.tsx). No locale/first-day/mode/highlight (the
 * doc rules all four out). Dates are fixed (Feb 17 2026 in a Jan–Dec 2026
 * window), the CalendarDemo precedent — a moving "today" would make the fence
 * lie by tomorrow. The stage remounts by key on every knob so it cannot drift
 * from the fence.
 */
function preselectedOf(v: ConfigValues): boolean {
  return v.preselected !== false;
}

function boundsOf(v: ConfigValues): boolean {
  return v.bounds !== false;
}

function rootPropsOf(v: ConfigValues): string {
  const out = [`aria-label="Release date"`];
  if (preselectedOf(v)) out.push("defaultValue={new Date(2026, 1, 17)}");
  if (boundsOf(v))
    out.push("min={new Date(2026, 0, 1)}", "max={new Date(2026, 11, 31)}");
  return ` ${out.join(" ")}`;
}

export const CALENDAR_CONFIGURATOR: ConfiguratorSpec = {
  id: "calendar-knobs",
  title: "Configure the calendar",
  description:
    "One date out of a month grid, preselected or not, bounded or open. Bounds never remove days — out-of-range days go unselectable where they sit. With Preselected off no initial date is passed, so the calendar starts on today (its designed fallback, not a selection the knobs made). The knobs describe the next mount (the stage remounts by key): picking a live day does not flip them back, so a changed stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "preselected",
      label: "Preselected",
      default: true,
    },
    {
      kind: "boolean",
      name: "bounds",
      label: "Bounds",
      default: true,
    },
  ],
  render: (v) => (
    <Calendar
      key={`${preselectedOf(v) ? "set" : "unset"}-${boundsOf(v) ? "bound" : "open"}`}
      aria-label="Release date"
      defaultValue={preselectedOf(v) ? new Date(2026, 1, 17) : undefined}
      min={boundsOf(v) ? new Date(2026, 0, 1) : undefined}
      max={boundsOf(v) ? new Date(2026, 11, 31) : undefined}
    />
  ),
  code: (v) => `<Calendar${rootPropsOf(v)} />`,
};
