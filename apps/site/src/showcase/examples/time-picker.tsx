import { TimePicker } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Time picker examples — one normalised value in two presentations.
 *
 * `hours` is 0–23 whatever `format` renders: 12-hour is a PRESENTATION of
 * 24-hour state, so switching formats never alters the value a host holds.
 */
export const TIME_PICKER_EXAMPLES: ExampleSpec[] = [
  {
    id: "time-picker-fields",
    title: "Hour, minute, and the clock they add up to",
    description:
      "The listbox face is three fields — the keyboard-correct one. `step` is the minute granularity, and the value that comes back is always normalised.",
    render: () => (
      <TimePicker
        defaultValue={{ hours: 9, minutes: 30 }}
        format="24h"
        step={15}
        label="Start time"
      />
    ),
    code: `<TimePicker
  defaultValue={{ hours: 9, minutes: 30 }}
  format="24h"
  step={15}
  label="Start time"
/>`,
  },
];
