import { Button, SheetSurface } from "@xoroh/kern";
import { useState } from "react";
import type { ExampleSpec } from "../example";

/**
 * Sheet surface examples — the shared modal and scrim shell.
 *
 * The surface is a SHELL, not a trigger: the host owns `open` and
 * `onOpenChange`, and the shell supplies the scrim, the focus trap, Escape and
 * the focus return. `label` is required — a dialog must be nameable, so the
 * prop has no default.
 */
function SheetSurfaceDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="tonal" onClick={() => setOpen(true)}>
        Open surface
      </Button>
      <SheetSurface label="Filters" open={open} onOpenChange={setOpen}>
        Narrow the result set.
      </SheetSurface>
    </>
  );
}

export const SHEET_SURFACE_EXAMPLES: ExampleSpec[] = [
  {
    id: "sheet-surface-dismissal",
    title: "The one place a sheet gets its way out",
    description:
      "Scrim press, Escape and the focus return all live in the shell, so every sheet below inherits them instead of re-implementing them. The snippet mounts it open so it stands alone; an app drives `open` and `onOpenChange` instead.",
    render: () => <SheetSurfaceDemo />,
    code: `<SheetSurface label="Filters" defaultOpen>
  Narrow the result set.
</SheetSurface>`,
  },
];
