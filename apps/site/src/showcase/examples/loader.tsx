import { Loader } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Loader examples — the spinner for a wait whose length is unknown.
 *
 * A loader is a STATUS, not a control: it takes no focus and handles no key.
 * So the example is about the two things a reader can actually get wrong —
 * the size, and whether the spinner is the only signal — and the description
 * says what to do when it is not.
 *
 * WEB composition. The native loader is the same idea as a React Native
 * `ActivityIndicator`; the mobile page carries its own live demo.
 */
export const LOADER_EXAMPLES: ExampleSpec[] = [
  {
    id: "loader-unmeasured-wait",
    title: "Three sizes, one job",
    description:
      "`size` picks the spinner, and the label is what a screen reader hears while it spins. Where the surrounding content already says what is loading, mark the spinner `aria-hidden` so it is not announced as stray content; where it is the only signal, the container needs `aria-busy`.",
    render: () => (
      <div className="flex items-center gap-6">
        <Loader size="sm" />
        <Loader size="default" />
        <Loader size="lg" />
      </div>
    ),
    code: `<Loader size="sm" />
<Loader size="default" />
<Loader size="lg" />`,
  },
];
