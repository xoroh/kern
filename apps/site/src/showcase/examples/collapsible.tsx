import { Collapsible } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Collapsible examples — one section behind a trigger.
 *
 * Three parts, one job: a root that owns the open state, a trigger that
 * flips it, and a panel that is the content. The trigger is a real button
 * carrying `aria-expanded`, so the state is announced rather than implied.
 */
export const COLLAPSIBLE_EXAMPLES: ExampleSpec[] = [
  {
    id: "collapsible-reveal",
    title: "A section that opens on demand",
    description:
      "The trigger is a real button carrying `aria-expanded`, so a screen reader hears the section open and close instead of the content simply appearing.",
    render: () => (
      <Collapsible.Root>
        <Collapsible.Trigger>What is included?</Collapsible.Trigger>
        <Collapsible.Panel>
          Tokens, components, theme presets and a CLI scaffold.
        </Collapsible.Panel>
      </Collapsible.Root>
    ),
    code: `<Collapsible.Root>
  <Collapsible.Trigger>What is included?</Collapsible.Trigger>
  <Collapsible.Panel>
    Tokens, components, theme presets and a CLI scaffold.
  </Collapsible.Panel>
</Collapsible.Root>`,
  },
];
