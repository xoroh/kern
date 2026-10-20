import { Progress } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Progress examples — the bar, the label and the figure.
 *
 * Determinate and indeterminate are states of the SAME control, so both are
 * here: a value fills the bar, and no value runs the loop. `ProgressValue` is
 * its own part, so the figure can sit with the label or be left off.
 */
export const PROGRESS_EXAMPLES: ExampleSpec[] = [
  {
    id: "progress-determinate",
    title: "A measured bar, and one that is still running",
    description:
      "The root carries the value, the label names what is running and the value says how far along it is. Leave the value out and the same control runs the indeterminate loop.",
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Progress.Root value={60}>
          <Progress.Label>Uploading</Progress.Label>
          <Progress.Value />
        </Progress.Root>
        <Progress.Root value={null}>
          <Progress.Label>Connecting</Progress.Label>
        </Progress.Root>
      </div>
    ),
    code: `<Progress.Root value={60}>
  <Progress.Label>Uploading</Progress.Label>
  <Progress.Value />
</Progress.Root>
<Progress.Root value={null}>
  <Progress.Label>Connecting</Progress.Label>
</Progress.Root>`,
  },
];
