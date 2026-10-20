import { ExtendedFab } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import type { ExampleSpec } from "../example";

/**
 * Extended FAB examples — the labelled floating action button.
 *
 * The label is not decoration: it is the accessible name, and it stays the
 * accessible name when the FAB collapses to its icon. That is the one
 * behaviour worth showing, because it is the failure mode of every hand-rolled
 * icon-only button.
 *
 * WEB composition. The native extended fab is a React Native pressable with
 * the same label-and-icon contract; the mobile page carries its own live demo.
 */
export const EXTENDED_FAB_EXAMPLES: ExampleSpec[] = [
  {
    id: "extended-fab-labelled-action",
    title: "The one primary action, with its name",
    description:
      "`label` is the visible name AND the accessible name, so collapsing the bar to its icon never leaves the button anonymous. The collapse is driven by an imperative handle rather than a gesture kern would have to invent, because the component cannot see the host's scroll position.",
    render: () => <ExtendedFab label="Compose" icon={<Icon name="add" />} />,
    code: `<ExtendedFab label="Compose" icon={<Icon name="add" />} />`,
  },
];
