import { Fab } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import type { ExampleSpec } from "../example";

/**
 * Fab examples — the one primary action, sized to its emphasis.
 *
 * Size is the FAB's emphasis axis (`sm`, default, `md` here). An icon-only
 * FAB takes an accessible name — without it the loudest control on the
 * screen is silent. Sizes mirror the registry demo.
 */
export const FAB_EXAMPLES: ExampleSpec[] = [
  {
    id: "fab-compose",
    title: "One action, three sizes",
    description:
      "Extended for a labelled action, icon-only where the action is obvious. The icon-only one is named, because emphasis without a name is noise.",
    render: () => (
      <>
        <Fab size="sm">
          <Icon name="add" />
          Compose
        </Fab>
        <Fab>
          <Icon name="add" />
          Compose
        </Fab>
        <Fab size="md" aria-label="Compose">
          <Icon name="add" />
        </Fab>
      </>
    ),
    code: `<Fab size="sm">
  <Icon name="add" />
  Compose
</Fab>
<Fab>
  <Icon name="add" />
  Compose
</Fab>
<Fab size="md" aria-label="Compose">
  <Icon name="add" />
</Fab>`,
  },
];
