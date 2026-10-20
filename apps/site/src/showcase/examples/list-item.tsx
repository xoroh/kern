import { ListItem } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * List item examples — one row of a list.
 *
 * A row is static until you give it a reason to act: `onPress` makes it a
 * real button and `href` makes it a real link. A row that merely LOOKS
 * clickable would be a trap, so the component never renders one.
 */
export const LIST_ITEM_EXAMPLES: ExampleSpec[] = [
  {
    id: "list-item-rows",
    title: "Static rows and actionable rows",
    description:
      "A row with no `onPress` and no `href` is a display row; pass `onPress` and it becomes a real button, so it carries control semantics and is keyboard-operable instead of only looking clickable.",
    render: () => (
      <ul className="w-full max-w-sm divide-y divide-(--sys-color-outline-variant)">
        <ListItem headline="Inbox" supporting="12 unread" />
        <ListItem headline="Sent" supporting="Last 7 days" onPress={() => {}} />
      </ul>
    ),
    code: `<ul className="w-full max-w-sm divide-y divide-(--sys-color-outline-variant)">
  <ListItem headline="Inbox" supporting="12 unread" />
  <ListItem headline="Sent" supporting="Last 7 days" onPress={() => {}} />
</ul>`,
  },
];
