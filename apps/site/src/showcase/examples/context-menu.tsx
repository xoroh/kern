import { ContextMenu } from "@xoroh/kern";
import { T_BODY_SM } from "../../domains/shared/systems/type-scale";
import type { ExampleSpec } from "../example";

/**
 * Context menu examples — the actions for a thing, where the thing is.
 *
 * The menu opens at the POINTER rather than anchoring to a control, which is
 * what makes it feel attached to the thing under the cursor. The item recipe
 * is `Menu`'s, so a command looks the same wherever it is offered.
 */
export const CONTEXT_MENU_EXAMPLES: ExampleSpec[] = [
  {
    id: "context-menu-actions",
    title: "The actions for a thing, where the thing is",
    description:
      "The trigger is the thing itself, and the menu opens at the pointer. A separator divides the group that acts on the thing from the group that removes it.",
    render: () => (
      <ContextMenu.Root>
        <ContextMenu.Trigger
          className={`flex h-24 w-56 items-center justify-center rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) ${T_BODY_SM}`}
        >
          Right-click here
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onClick={() => {}}>Copy</ContextMenu.Item>
          <ContextMenu.Item onClick={() => {}}>Duplicate</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item onClick={() => {}}>Delete</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    ),
    // type-scale-exempt: the class names below are EXAMPLE CODE shown to
    // the reader, not rendered typography. A consumer's own class names are
    // theirs to choose; the rule governs what OUR pages paint.
    code: `<ContextMenu.Root>
  <ContextMenu.Trigger className="flex h-24 w-56 items-center justify-center rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) text-sm">
    Right-click here
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onClick={() => {}}>Copy</ContextMenu.Item>
    <ContextMenu.Item onClick={() => {}}>Duplicate</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item onClick={() => {}}>Delete</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`,
  },
];
