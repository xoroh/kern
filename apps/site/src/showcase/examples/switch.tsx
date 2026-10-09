import { Switch } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Switch examples — the binary control with M3 thumb icons.
 */
export const SWITCH_EXAMPLES: ExampleSpec[] = [
  {
    id: "switch-states",
    title: "Off and on",
    description:
      "The track flips to primary and the thumb to on-primary when checked; the thumb icons (close, check) ride along.",
    render: () => (
      <>
        <Switch aria-label="Notifications off" />
        <Switch aria-label="Notifications on" defaultChecked />
      </>
    ),
    code: `<Switch aria-label="Notifications off" />
<Switch aria-label="Notifications on" defaultChecked />`,
  },
  {
    id: "switch-disabled",
    title: "Disabled stays readable",
    description:
      "Disabled removes the control from the interaction order; the state remains announced.",
    render: () => <Switch aria-label="Notifications" disabled />,
    code: `<Switch aria-label="Notifications" disabled />`,
  },
];
