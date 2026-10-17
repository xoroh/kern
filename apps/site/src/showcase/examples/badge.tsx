import { Badge } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Badge examples — a count, and a dot that says no more than "new".
 *
 * A dot carries no number, so it always takes an accessible name: a badge
 * nobody can read the value of still has to be announced. Props mirror the
 * registry demo.
 */
export const BADGE_EXAMPLES: ExampleSpec[] = [
  {
    id: "badge-count",
    title: "Counts, and a nameless-looking dot",
    description:
      "Two counts and one dot. The dot looks empty but is named — without the label a screen reader gets silence where sighted users get news.",
    render: () => (
      <>
        <Badge>7</Badge>
        <Badge aria-label="3 unread">3</Badge>
        <Badge variant="dot" aria-label="New activity" />
      </>
    ),
    code: `<Badge>7</Badge>
<Badge aria-label="3 unread">3</Badge>
<Badge variant="dot" aria-label="New activity" />`,
  },
];
