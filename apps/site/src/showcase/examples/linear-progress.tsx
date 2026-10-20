import { LinearProgress } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Linear progress examples — the measured bar.
 *
 * There is no `indeterminate` boolean: `value={null}` IS the unknown-length
 * case, so a value and a mode can never contradict each other. The example
 * shows both, because that convention is the thing a reader gets wrong.
 *
 * WEB composition. The native linear progress is the same bar drawn with
 * React Native views; the mobile page carries its own live demo.
 */
export const LINEAR_PROGRESS_EXAMPLES: ExampleSpec[] = [
  {
    id: "linear-progress-both-modes",
    title: "Measured, and not yet measured",
    description:
      "A number fills the bar and `aria-valuenow` reports it as a figure. `value={null}` runs the travelling loop and omits `aria-valuenow`, so the remainder is announced as unknown rather than as a number that is not true.",
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LinearProgress value={0.4} label="Uploading" />
        <LinearProgress value={null} label="Working" />
      </div>
    ),
    code: `<LinearProgress value={0.4} label="Uploading" />
<LinearProgress value={null} label="Working" />`,
  },
];
