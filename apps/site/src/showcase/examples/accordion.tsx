import { Accordion } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Accordion examples — a stack of disclosure sections.
 *
 * The trigger is a real button inside a heading, and the panel is plain
 * content: whatever goes inside is the caller's to lay out. A closed section's
 * panel is out of the tab order, so a collapsed stack never parks focus on
 * hidden controls.
 *
 * WEB composition. The native accordion takes `sections` as data and keys the
 * open set by section index; the mobile page carries its own live demo.
 */
export const ACCORDION_EXAMPLES: ExampleSpec[] = [
  {
    id: "accordion-sections",
    title: "A long page, scannable as headings first",
    description:
      "Each section is a heading with a button in it, so a reader can walk the questions without opening anything. The panel is the caller's content — the component supplies the disclosure and nothing else.",
    render: () => (
      <Accordion.Root>
        <Accordion.Item value="what">
          <Accordion.Header>
            <Accordion.Trigger>What is Kern?</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            An open-source design system following Material Design 3.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="which">
          <Accordion.Header>
            <Accordion.Trigger>Which platforms?</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Web and React Native, from one token set.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    ),
    code: `<Accordion.Root>
  <Accordion.Item value="what">
    <Accordion.Header>
      <Accordion.Trigger>What is Kern?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      An open-source design system following Material Design 3.
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>`,
  },
];
