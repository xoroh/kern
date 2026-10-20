import { Button, EmptyState } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Empty state examples — what is missing, and the one thing that fixes it.
 *
 * The component owns the words and the shape; the `action` slot is yours, so
 * the recovery control is a real `Button` and is keyboard-operable without
 * anything from here.
 */
export const EMPTY_STATE_EXAMPLES: ExampleSpec[] = [
  {
    id: "empty-state-recovery",
    title: "The one thing that would fix it",
    description:
      "The title says what is missing, the description says why, and the `action` slot holds the one control that recovers. There is no `actions` plural — a second choice is a decision, and decisions belong somewhere the reader is choosing.",
    render: () => (
      <EmptyState
        title="No messages yet"
        description="Compose a message and it will show up here."
        action={<Button variant="tonal">Compose</Button>}
      />
    ),
    code: `<EmptyState
  title="No messages yet"
  description="Compose a message and it will show up here."
  action={<Button variant="tonal">Compose</Button>}
/>`,
  },
];
