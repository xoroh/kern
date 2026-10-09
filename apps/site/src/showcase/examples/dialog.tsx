import { Button, Dialog } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Dialog examples — the modal surface with trigger, title and close.
 */
export const DIALOG_EXAMPLES: ExampleSpec[] = [
  {
    id: "dialog-confirm",
    title: "Confirm a destructive action",
    description:
      "Trigger opens, title names the decision, Close returns focus to the trigger. The destructive action is error roles, not a variant.",
    render: () => (
      <Dialog.Root>
        <Dialog.Trigger
          render={<Button variant="tonal">Delete project</Button>}
        />
        <Dialog.Content>
          <Dialog.Title>Delete this project?</Dialog.Title>
          <Dialog.Description>
            This removes the project and its build history.
          </Dialog.Description>
          <Dialog.Close render={<Button variant="ghost">Cancel</Button>} />
        </Dialog.Content>
      </Dialog.Root>
    ),
    code: `<Dialog.Root>
  <Dialog.Trigger render={<Button variant="tonal">Delete project</Button>} />
  <Dialog.Content>
    <Dialog.Title>Delete this project?</Dialog.Title>
    <Dialog.Description>This removes the project.</Dialog.Description>
    <Dialog.Close render={<Button variant="ghost">Cancel</Button>} />
  </Dialog.Content>
</Dialog.Root>`,
  },
];
