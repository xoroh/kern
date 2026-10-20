import { Button, SnapSheet } from "@xoroh/kern";
import { useState } from "react";
import type { ExampleSpec } from "../example";

/**
 * SnapSheet examples — a bottom sheet with declared detents.
 *
 * `snapPoints` are viewport fractions, and the sheet is at one of them or
 * another — never between. The detent control cycles the set; the snippet
 * is the uncontrolled form so it stands on its own.
 */
function SnapSheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="tonal" onClick={() => setOpen(true)}>
        Open snap sheet
      </Button>
      <SnapSheet
        label="Stops"
        snapPoints={[0.25, 0.5, 0.9]}
        open={open}
        onOpenChange={setOpen}
      >
        Settles at quarter, half, full.
      </SnapSheet>
    </>
  );
}

export const SNAP_SHEET_EXAMPLES: ExampleSpec[] = [
  {
    id: "snap-sheet-detents",
    title: "A sheet that settles at declared heights",
    description:
      "The detents are fractions of the viewport, and the same children render at every one of them — a peek that shows DIFFERENT content is a host decision, not a detent. The detent control is a slider, so the height is announced as the value it is.",
    render: () => <SnapSheetDemo />,
    code: `<SnapSheet label="Stops" snapPoints={[0.25, 0.5, 0.9]} defaultOpen>
  Settles at quarter, half, full.
</SnapSheet>`,
  },
];
