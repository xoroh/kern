import { Button, DockSheet } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Dock sheet examples — the PERSISTENT bottom panel.
 *
 * Docked is not dialog: the panel takes no interaction lock and the content
 * behind it stays operable, so it is a labelled region rather than a modal
 * surface. That is also why it carries no elevation token — a persistent
 * panel at modal elevation misreads as an overlay.
 *
 * WEB composition. The native dock sheet is a React Native view with the same
 * persistent behaviour; the mobile page carries its own live demo.
 */
export const DOCK_SHEET_EXAMPLES: ExampleSpec[] = [
  {
    id: "dock-sheet-persistent-panel",
    title: "A panel that is there, not one that interrupts",
    description:
      "The dock is a labelled region, not a dialog: nothing behind it is inert, so the page stays usable while the panel is up.",
    render: () => (
      <DockSheet label="Quick actions">
        <Button variant="tonal">Duplicate</Button>
        <Button variant="tonal">Archive</Button>
      </DockSheet>
    ),
    code: `<DockSheet label="Quick actions">
  <Button variant="tonal">Duplicate</Button>
  <Button variant="tonal">Archive</Button>
</DockSheet>`,
  },
];
