import { SettingsRow, Switch } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * Settings row examples — a label, a supporting line, and the control.
 *
 * The row NAMES the setting; the trailing control ACTS on it. The row is
 * not pressable by design — pressability there would steal the control's
 * activation — so the control in the slot is what the screen reader reaches.
 */
export const SETTINGS_ROW_EXAMPLES: ExampleSpec[] = [
  {
    id: "settings-row-control",
    title: "The row names it, the control acts on it",
    description:
      "`label` is the row's accessible name, `supporting` is the second line, and `trailing` holds the control the setting owns. The row itself is a `summary`, not a control.",
    package: "@xoroh/kern-native",
    render: () => (
      <SettingsRow
        label="Notifications"
        supporting="Alerts about mentions and direct messages"
        trailing={<Switch defaultChecked aria-label="Notifications" />}
      />
    ),
    code: `<SettingsRow
  label="Notifications"
  supporting="Alerts about mentions and direct messages"
  trailing={<Switch defaultChecked aria-label="Notifications" />}
/>`,
  },
];
