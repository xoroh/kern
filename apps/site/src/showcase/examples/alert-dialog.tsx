import { AlertDialog, Button } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Alert dialog examples — the blocking confirmation.
 *
 * The primitive keeps focus inside until the user picks an explicit action:
 * an alert that can be waved away is not an alert, so the backdrop does not
 * dismiss it and Escape cancels rather than closes.
 *
 * WEB composition. The native alert dialog is a React Native `Modal` with the
 * same two decisions; the mobile page carries its own live demo.
 */
export const ALERT_DIALOG_EXAMPLES: ExampleSpec[] = [
  {
    id: "alert-dialog-two-decisions",
    title: "Two decisions, and no third one",
    description:
      "The title states the decision and the actions make it. There is no `severity` prop: whether the consequence is dangerous is said by the actions and their roles, not by a flag on the dialog.",
    render: () => (
      <AlertDialog.Root>
        <AlertDialog.Trigger
          render={<Button variant="tonal">Delete project</Button>}
        />
        <AlertDialog.Content>
          <AlertDialog.Title>Delete this project?</AlertDialog.Title>
          <AlertDialog.Description>
            This removes the project and its build history.
          </AlertDialog.Description>
          <AlertDialog.Close render={<Button variant="text">Cancel</Button>} />
        </AlertDialog.Content>
      </AlertDialog.Root>
    ),
    code: `<AlertDialog.Root>
  <AlertDialog.Trigger render={<Button variant="tonal">Delete project</Button>} />
  <AlertDialog.Content>
    <AlertDialog.Title>Delete this project?</AlertDialog.Title>
    <AlertDialog.Description>This removes the project and its build history.</AlertDialog.Description>
    <AlertDialog.Close render={<Button variant="text">Cancel</Button>} />
  </AlertDialog.Content>
</AlertDialog.Root>`,
  },
];
