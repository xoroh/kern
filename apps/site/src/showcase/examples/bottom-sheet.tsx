import { BottomSheet, Button } from "@xoroh/kern";
import { useState } from "react";
import type { ExampleSpec } from "../example";

/**
 * BottomSheet examples — the modal surface at the bottom edge.
 *
 * The sheet is a SHELL, not a trigger: the host owns `open` and
 * `onOpenChange`, and the sheet supplies the scrim, the focus trap and the
 * dismissal paths. The live demo below drives that controlled pair; the
 * snippet is the uncontrolled form, so it stands on its own.
 */
function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="tonal" onClick={() => setOpen(true)}>
        Open sheet
      </Button>
      <BottomSheet
        label="Filters"
        title="Filters"
        open={open}
        onOpenChange={setOpen}
        onClose={() => setOpen(false)}
      >
        Narrow the result set.
      </BottomSheet>
    </>
  );
}

export const BOTTOM_SHEET_EXAMPLES: ExampleSpec[] = [
  {
    id: "bottom-sheet-surface",
    title: "A named surface with a way out",
    description:
      "`label` names the surface even when there is no title, so the dialog is never anonymous. Escape and a scrim press both close it and the focus goes back to the trigger; the snippet mounts it open so it stands alone, and an app drives `open` and `onOpenChange` instead.",
    render: () => <SheetDemo />,
    code: `<BottomSheet label="Filters" title="Filters" defaultOpen>
  Narrow the result set.
</BottomSheet>`,
  },
];
