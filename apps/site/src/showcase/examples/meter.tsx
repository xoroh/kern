import { Meter } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Meter examples — a value against a range.
 *
 * A meter REPORTS a reading; it does not collect one. It takes no focus and
 * answers no key, which is why there is no keyboard contract on this page —
 * the ARIA meter role carries the whole story.
 */
export const METER_EXAMPLES: ExampleSpec[] = [
  {
    id: "meter-reading",
    title: "A reading, not a control",
    description:
      "The label says what is being measured and the value is rendered from the same state as the fill, so the number and the bar cannot disagree.",
    render: () => (
      <Meter.Root value={0.4}>
        <Meter.Label>Storage used</Meter.Label>
        <Meter.Value />
      </Meter.Root>
    ),
    code: `<Meter.Root value={0.4}>
  <Meter.Label>Storage used</Meter.Label>
  <Meter.Value />
</Meter.Root>`,
  },
];
