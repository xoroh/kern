/**
 * Settings-screen block, native variant — labelled rows with controls.
 *
 * Same contract as `settings-screen.tsx`: real source composed ONLY from
 * shipped packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add settings-screen --platform native`.
 */
import {
  Card,
  Separator,
  SettingsRow,
  Switch,
  ThemeToggle,
} from "@xoroh/kern-native";
import { useState } from "react";

export function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  return (
    <Card variant="filled">
      <SettingsRow
        label="Notifications"
        supporting="Badges, sounds and banners"
        trailing={
          <Switch
            aria-label="Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
        }
      />
      <Separator />
      <SettingsRow
        label="Appearance"
        supporting="Light or dark theme"
        trailing={<ThemeToggle />}
      />
    </Card>
  );
}
