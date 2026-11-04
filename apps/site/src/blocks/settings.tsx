/**
 * Settings block — full settings page with section presets.
 *
 * A block is a real source file composed ONLY from shipped packages
 * (`@xoroh/kern`, `react`). It renders the shipped `KernSettingsScreen`
 * with the profile, notification and preference preset sections — copy it,
 * then replace the preset sections with the host's own section defs.
 */
import {
  KernSettingsScreen,
  notificationSettingsSection,
  preferenceSettingsSection,
  profileSettingsSection,
} from "@xoroh/kern";

export function SettingsBlock() {
  return (
    <KernSettingsScreen
      label="Settings"
      sections={[
        profileSettingsSection,
        notificationSettingsSection,
        preferenceSettingsSection,
      ]}
    />
  );
}
