import { FabMenu } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import type { ExampleSpec } from "../example";

/**
 * FabMenu examples — several related actions behind one floating button.
 *
 * The actions are DATA, so the menu owns the order, the dismissal and the
 * focus return. The trigger is named: an unnamed FAB announces as a bare
 * button, and the default name is the first action's label — a fallback,
 * not a plan.
 */
export const FAB_MENU_EXAMPLES: ExampleSpec[] = [
  {
    id: "fab-menu-actions",
    title: "One button, several actions",
    description:
      "Each action is a row in the menu, and a disabled one stays visible but cannot be chosen. Picking an action dismisses the menu — the host never has to close it by hand.",
    render: () => (
      <FabMenu
        label="Actions"
        icon={<Icon name="add" />}
        actions={[
          { key: "create", label: "Create", onSelect: () => {} },
          { key: "upload", label: "Upload", onSelect: () => {} },
          { key: "archive", label: "Archive", disabled: true, separated: true },
        ]}
      />
    ),
    code: `<FabMenu
  label="Actions"
  icon={<Icon name="add" />}
  actions={[
    { key: "create", label: "Create", onSelect: () => {} },
    { key: "upload", label: "Upload", onSelect: () => {} },
    { key: "archive", label: "Archive", disabled: true, separated: true },
  ]}
/>`,
  },
];
