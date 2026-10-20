import { Button, MenuSheet } from "@xoroh/kern";
import { useState } from "react";
import type { ExampleSpec } from "../example";

/**
 * Menu sheet examples — a grouped action menu in a bottom sheet.
 *
 * The menu DATA is the point: `groups` is the same shape `MenuScreen` takes,
 * so a screen's worth of actions moves into a sheet without being rewritten.
 * A destructive action is a ROLE on the action, not a variant on the sheet.
 *
 * The sheet is a SHELL: the host owns `open` and `onOpenChange`, and the
 * shell supplies the scrim, the focus trap and the dismissal paths. So the
 * live demo drives that pair and the fence is the uncontrolled form, which
 * stands on its own.
 *
 * WEB composition. The native menu sheet is a React Native modal with the
 * same grouped data; the mobile page carries its own live demo.
 */
function MenuSheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="tonal" onClick={() => setOpen(true)}>
        Open menu
      </Button>
      <MenuSheet
        title="Document"
        open={open}
        onOpenChange={setOpen}
        groups={[
          {
            heading: "Share",
            actions: [
              { key: "copy", label: "Copy link" },
              { key: "mail", label: "Email", supporting: "Send by email" },
            ],
          },
        ]}
      />
    </>
  );
}

export const MENU_SHEET_EXAMPLES: ExampleSpec[] = [
  {
    id: "menu-sheet-grouped-actions",
    title: "Grouped actions, with a way out",
    description:
      '`groups` is the shared menu data: a heading and a flat list of actions. A destructive action is a role on the action, so the sheet does not grow a "danger" axis.',
    render: () => <MenuSheetDemo />,
    code: `<MenuSheet
  title="Document"
  defaultOpen
  groups={[
    {
      heading: "Share",
      actions: [
        { key: "copy", label: "Copy link" },
        { key: "mail", label: "Email", supporting: "Send by email" },
      ],
    },
  ]}
/>`,
  },
];
