import { Button, Tooltip } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Tooltip examples — a hover-and-focus hint on an action.
 *
 * The trigger renders the real control (`render`, not a wrapper), so focus
 * and keyboard behavior belong to the button itself. The provider owns
 * timing for the whole tree. Props mirror the registry demo.
 */
export const TOOLTIP_EXAMPLES: ExampleSpec[] = [
  {
    id: "tooltip-deploy",
    title: "Say what the button will do",
    description:
      "Hover or focus the trigger and the hint appears. The content is plain text — a tooltip explains, it never carries the action itself.",
    render: () => (
      <div className="w-full max-w-xs">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger render={<Button variant="tonal">Deploy</Button>} />
            <Tooltip.Content>Deploy the current build</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    ),
    code: `<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger render={<Button variant="tonal">Deploy</Button>} />
    <Tooltip.Content>Deploy the current build</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>`,
  },
];
