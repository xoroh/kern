import { ActionSheet } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Action sheet examples — the titled list of actions in a bottom sheet.
 *
 * The actions are DATA, and picking one is the host's: `onSelect` reports
 * which action was taken, and closing the sheet afterwards is the host's
 * call too, through `onOpenChange`.
 */
export const ACTION_SHEET_EXAMPLES: ExampleSpec[] = [
  {
    id: "action-sheet-actions",
    title: "A titled list of actions, and nothing else",
    description:
      "The sheet carries the title and the list; it stores no selection. `onSelect` reports the action, and `onOpenChange` is how the host closes it afterwards.",
    render: () => (
      <ActionSheet
        defaultOpen
        label="Share"
        title="Share"
        actions={[
          { id: "copy", label: "Copy link", onSelect: () => {} },
          { id: "mail", label: "Send by mail", onSelect: () => {} },
        ]}
      />
    ),
    code: `<ActionSheet
  defaultOpen
  label="Share"
  title="Share"
  actions={[
    { id: "copy", label: "Copy link", onSelect: () => {} },
    { id: "mail", label: "Send by mail", onSelect: () => {} },
  ]}
/>`,
  },
];
