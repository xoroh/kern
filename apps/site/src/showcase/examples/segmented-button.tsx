import { SegmentedButton } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Segmented button examples — one choice, shown as chosen.
 *
 * The GROUP owns the exclusivity: pressing a segment presses it and releases
 * the others, so the bar reads as one control rather than as three adjacent
 * buttons. The value is a list even in the exclusive case, because the group
 * is a toggle group — one entry when one segment is chosen.
 *
 * WEB composition. The native bar takes `options` as data over React Native
 * pressables; the mobile page carries its own live demo.
 */
export const SEGMENTED_BUTTON_EXAMPLES: ExampleSpec[] = [
  {
    id: "segmented-button-one-choice",
    title: "One choice, and the bar shows which",
    description:
      "Exactly one segment is pressed, and the pressed one carries the M3 selection check. The group owns the exclusivity, so the segments are one control rather than three — and the bar takes a label of its own, because a question with no name is not a question.",
    render: () => (
      <SegmentedButton.Root defaultValue={["day"]} aria-label="Range">
        <SegmentedButton.Item value="day">Day</SegmentedButton.Item>
        <SegmentedButton.Item value="week">Week</SegmentedButton.Item>
        <SegmentedButton.Item value="month">Month</SegmentedButton.Item>
      </SegmentedButton.Root>
    ),
    code: `<SegmentedButton.Root defaultValue={["day"]} aria-label="Range">
  <SegmentedButton.Item value="day">Day</SegmentedButton.Item>
  <SegmentedButton.Item value="week">Week</SegmentedButton.Item>
  <SegmentedButton.Item value="month">Month</SegmentedButton.Item>
</SegmentedButton.Root>`,
  },
];
