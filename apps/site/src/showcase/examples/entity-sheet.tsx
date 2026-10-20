import { Button, EntitySheet } from "@xoroh/kern";
import { useState } from "react";
import type { ExampleSpec } from "../example";

/**
 * Entity sheet examples — the read-mostly detail for one record.
 *
 * The sheet is a SHELL: the host owns `open` and `onOpenChange`, and the
 * shell supplies the scrim, the focus trap and the dismissal paths. So the
 * live demo drives that pair and the fence is the uncontrolled form, which
 * stands on its own.
 *
 * The fields are a real description list, so the label-value relationship is
 * structural rather than visual — which is the one thing this example has to
 * make visible.
 *
 * WEB composition. The native entity sheet is a React Native bottom sheet
 * with the same data; the mobile page carries its own live demo.
 */
function EntitySheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="tonal" onClick={() => setOpen(true)}>
        Open record
      </Button>
      <EntitySheet
        label="Deployment"
        title="Deployment"
        subtitle="api · 4 minutes ago"
        open={open}
        onOpenChange={setOpen}
        fields={[
          { label: "Status", value: "Live" },
          { label: "Commit", value: "9f2c41a", data: true },
        ]}
        action={<Button variant="tonal">Roll back</Button>}
      />
    </>
  );
}

export const ENTITY_SHEET_EXAMPLES: ExampleSpec[] = [
  {
    id: "entity-sheet-record-detail",
    title: "One record, read-only",
    description:
      "`fields` is the data: a label, a value, and the `data` flag for a machine-shaped value. There is no editing here — the values are text, and the one `action` slot is the only thing that changes anything.",
    render: () => <EntitySheetDemo />,
    code: `<EntitySheet
  label="Deployment"
  title="Deployment"
  subtitle="api · 4 minutes ago"
  defaultOpen
  fields={[
    { label: "Status", value: "Live" },
    { label: "Commit", value: "9f2c41a", data: true },
  ]}
  action={<Button variant="tonal">Roll back</Button>}
/>`,
  },
];
