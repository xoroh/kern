import { Pane } from "@xoroh/kern/start";
import type { ExampleSpec } from "../example";

/**
 * Pane examples — the content region on a width scale.
 *
 * A pane is LAYOUT: it is a `<section>` with a measure applied, and it has no
 * state, no focus of its own and no keys. So the example is about the one
 * decision it makes — the width scale — and about naming the region, because
 * an unnamed `<section>` is not a landmark.
 *
 * WEB composition. `@xoroh/kern/start` is the composition tier, so the pane
 * is a shell layout rather than a primitive; the native pane is a React
 * Native surface and the mobile page carries its own live demo.
 */
export const PANE_EXAMPLES: ExampleSpec[] = [
  {
    id: "pane-width-scale",
    title: "A region with a readable measure",
    description:
      "`width` is the four-step scale, so content stays inside a line length that can be read. The pane is a real `<section>`, so an `aria-label` is what turns it into a navigable region rather than a styled box.",
    package: "@xoroh/kern/start",
    render: () => (
      <Pane width="narrow" aria-label="Release notes" className="p-6">
        <h3 id="pane-example-release-notes">Release notes</h3>
        <p>
          The measure belongs to the pane, so the same content reads the same
          way on a wide screen.
        </p>
      </Pane>
    ),
    code: `<Pane width="narrow" aria-label="Release notes">
  <h3 id="pane-example-release-notes">Release notes</h3>
  <p>The measure is the pane's job.</p>
</Pane>`,
  },
];
