import { CircularProgress } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * CircularProgress examples — the ring, measured and unmeasured.
 *
 * A value makes the ring determinate; leaving the value out runs the
 * indeterminate loop. `label` names the ring either way, so it is announced
 * rather than being an anonymous shape.
 */
export const CIRCULAR_PROGRESS_EXAMPLES: ExampleSpec[] = [
  {
    id: "circular-progress-states",
    title: "A ring that measures, and one that waits",
    description:
      "The same component in both states: a value fills the arc, and no value runs the loop. Known progress and an unmeasured wait are told apart by what is announced, not by a different component.",
    render: () => (
      <>
        <CircularProgress value={0.75} label="Uploading" />
        <CircularProgress label="Waiting" />
      </>
    ),
    code: `<CircularProgress value={0.75} label="Uploading" />
<CircularProgress label="Waiting" />`,
  },
];
