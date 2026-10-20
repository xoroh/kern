import { Sheet } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Sheet examples — the edge-anchored panel.
 *
 * The panel is full height and scrolls its own content, so a long form inside
 * a sheet keeps working rather than growing past the viewport. `side` picks
 * the edge; the panel is a dialog, so the page behind it is inert while it is
 * open.
 *
 * WEB composition. The native sheet is a bottom-anchored modal with its own
 * dismissal path; the mobile page carries its own live demo.
 */
export const SHEET_EXAMPLES: ExampleSpec[] = [
  {
    id: "sheet-edge-panel",
    title: "A focused task, beside the content behind it",
    description:
      "The trigger opens the panel and the panel is a dialog: the page behind it is inert while it is open, and the focus goes back to the trigger when it closes. The title is the panel's accessible name.",
    render: () => (
      <Sheet.Root>
        <Sheet.Trigger>Open sheet</Sheet.Trigger>
        <Sheet.Content side="right">
          <Sheet.Title>Filters</Sheet.Title>
          <Sheet.Description>Narrow the result set.</Sheet.Description>
        </Sheet.Content>
      </Sheet.Root>
    ),
    code: `<Sheet.Root>
  <Sheet.Trigger>Open sheet</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Title>Filters</Sheet.Title>
    <Sheet.Description>Narrow the result set.</Sheet.Description>
  </Sheet.Content>
</Sheet.Root>`,
  },
];
