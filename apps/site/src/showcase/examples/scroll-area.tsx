import { ScrollArea } from "@xoroh/kern";
import { T_BODY_SM } from "../../domains/shared/systems/type-scale";
import type { ExampleSpec } from "../example";

/**
 * Scroll area examples — a scrollable region with a themed scrollbar.
 *
 * The region is `role="group"` and the scroll affordance sits INSIDE it, so
 * the region is announced as one named thing rather than as loose content.
 *
 * WEB composition. The native scroll area is React Native's `ScrollView` with
 * the same labelled region; the mobile page carries its own live demo.
 */
export const SCROLL_AREA_EXAMPLES: ExampleSpec[] = [
  {
    id: "scroll-area-clipped-overflow",
    title: "A region that scrolls instead of growing",
    description:
      "The viewport is the scroll container and the scrollbar belongs to it, so the region reads as one named group rather than as a page that happens to be long.",
    render: () => (
      <ScrollArea.Root className="h-40 w-full max-w-xs rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant)">
        <ScrollArea.Viewport className="h-full p-4">
          <ul className={`m-0 flex list-none flex-col gap-2 p-0 ${T_BODY_SM}`}>
            {[
              "Overview",
              "Details",
              "History",
              "Members",
              "Access",
              "Billing",
              "Usage",
              "Limits",
              "Events",
              "Logs",
              "Exports",
              "Archive",
            ].map((row) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    ),
    code: `<ScrollArea.Root className="h-40 w-full max-w-xs">
  <ScrollArea.Viewport className="h-full p-4">
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      <li>Scrollable row 1</li>
    </ul>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar />
</ScrollArea.Root>`,
  },
];
