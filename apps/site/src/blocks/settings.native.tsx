/**
 * Settings block, native variant — grouped settings list with presets.
 *
 * Same contract as `settings.tsx`: real source composed ONLY from shipped
 * packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add settings --platform native`. One data contract with the web
 * twin (sections + density); a phone shows every group, section switching
 * is the host navigator's job.
 */
import {
  KernSettingsScreen,
  notificationSettingsSection,
  preferenceSettingsSection,
  profileSettingsSection,
} from "@xoroh/kern-native";

export function SettingsBlock() {
  return (
    <KernSettingsScreen
      sections={[
        profileSettingsSection,
        notificationSettingsSection,
        preferenceSettingsSection,
      ]}
    />
  );
}
