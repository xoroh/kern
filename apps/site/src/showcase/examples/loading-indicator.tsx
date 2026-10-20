import { LoadingIndicator } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Loading indicator examples — the labelled spinner.
 *
 * The LABEL is the accessible name and, with `showLabel`, the visible text
 * too: one string doing both jobs is why setting it matters, because what a
 * sighted reader reads and what a screen reader announces cannot drift apart.
 * The indicator itself takes no focus — a wait is a state, not an event.
 *
 * WEB composition. The native ring is the same contract over a React Native
 * view; the mobile page carries its own live demo.
 */
export const LOADING_INDICATOR_EXAMPLES: ExampleSpec[] = [
  {
    id: "loading-indicator-named",
    title: "A wait with its name attached",
    description:
      "The label names the wait whether or not it is visible, so a screen reader user gets the explanation even when a sighted user sees only the ring. There is no value to read: this is an unmeasured wait, and a measured one is `Progress`.",
    render: () => (
      <>
        <LoadingIndicator label="Loading your bookings" showLabel />
        <LoadingIndicator label="Loading" size="sm" />
      </>
    ),
    code: `<LoadingIndicator label="Loading your bookings" showLabel />
<LoadingIndicator label="Loading" size="sm" />`,
  },
];
