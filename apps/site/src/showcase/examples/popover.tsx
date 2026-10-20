import { Button, Popover } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Popover examples — the anchored, NON-modal panel.
 *
 * The compound, not a single control: `Popover.Trigger` is a slot, so the
 * button that opens the panel belongs to the caller, and the panel itself
 * belongs to the library. The trigger is a `<button>` underneath, so it is
 * reachable and operable without a mouse.
 *
 * WEB composition. The native popover is the same idea with a different
 * surface (a press-triggered overlay rather than a hover-capable one); the
 * mobile page carries its own live demo.
 */
export const POPOVER_EXAMPLES: ExampleSpec[] = [
  {
    id: "popover-trigger-and-panel",
    title: "A named panel anchored to a control you name",
    description:
      "The trigger is a slot, so the button that opens the panel is yours. The title names the panel, so it is announced as something rather than as an unnamed region.",
    render: () => (
      <Popover.Root>
        <Popover.Trigger render={<Button variant="outlined">Details</Button>} />
        <Popover.Content>
          <Popover.Title>Build 482</Popover.Title>
          <Popover.Description>
            The panel is anchored to the trigger and leaves the page behind it
            operable.
          </Popover.Description>
          <Popover.Close render={<Button variant="text">Close</Button>} />
        </Popover.Content>
      </Popover.Root>
    ),
    code: `<Popover.Root>
  <Popover.Trigger render={<Button variant="outlined">Details</Button>} />
  <Popover.Content>
    <Popover.Title>Build 482</Popover.Title>
    <Popover.Description>The panel is anchored to the trigger.</Popover.Description>
    <Popover.Close render={<Button variant="text">Close</Button>} />
  </Popover.Content>
</Popover.Root>`,
  },
];
