/**
 * Block: settings-screen — a settings page composed from shipped components.
 *
 * Category: Settings. Install with `kern add settings-screen`.
 * Dependencies: @xoroh/kern, @xoroh/kern/start, react.
 */
import { Card, Separator, Switch } from "@xoroh/kern";
import { SettingsRow, ThemeToggle } from "@xoroh/kern/start";
import { useState } from "react";

export function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [mode, setMode] = useState<"light" | "dark">("light");
  return (
    <Card variant="filled" style={{ padding: 8, maxWidth: 480 }}>
      <SettingsRow
        label="Notifications"
        supporting="Badges, sounds and banners"
        trailing={
          <Switch
            aria-label="Notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        }
      />
      <Separator />
      <SettingsRow
        label="Appearance"
        supporting={mode === "light" ? "Light theme" : "Dark theme"}
        trailing={
          <ThemeToggle
            mode={mode}
            onToggle={() => setMode((m) => (m === "light" ? "dark" : "light"))}
          />
        }
      />
    </Card>
  );
}
