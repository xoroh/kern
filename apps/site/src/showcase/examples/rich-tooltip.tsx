import {
  Button,
  RichTooltipActions,
  RichTooltipContent,
  RichTooltipTitle,
  Tooltip,
} from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * RichTooltip examples — the tooltip that needs more than a label.
 *
 * The rich surface is a tooltip popup with three parts: a title, the
 * supporting text, and plain-text actions. The trigger is the caller's own
 * control, so the explanation is attached to the thing it explains.
 */
export const RICH_TOOLTIP_EXAMPLES: ExampleSpec[] = [
  {
    id: "rich-tooltip-explanation",
    title: "An explanation with an action in it",
    description:
      "A plain tooltip holds a label and nothing else. The rich one carries a title, supporting text and real buttons — so the surface is reachable without a pointer.",
    render: () => (
      <div className="w-full max-w-xs">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger render={<Button variant="tonal">Deploy</Button>} />
            <RichTooltipContent>
              <RichTooltipTitle>Deploy the current build</RichTooltipTitle>
              <p className="m-0">
                The build named for this release goes to production.
              </p>
              <RichTooltipActions>
                <Button variant="text">Deploy</Button>
                <Button variant="text">Not now</Button>
              </RichTooltipActions>
            </RichTooltipContent>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    ),
    code: `<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger render={<Button variant="tonal">Deploy</Button>} />
    <RichTooltipContent>
      <RichTooltipTitle>Deploy the current build</RichTooltipTitle>
      <p>The build named for this release goes to production.</p>
      <RichTooltipActions>
        <Button variant="text">Deploy</Button>
        <Button variant="text">Not now</Button>
      </RichTooltipActions>
    </RichTooltipContent>
  </Tooltip.Root>
</Tooltip.Provider>`,
  },
];
