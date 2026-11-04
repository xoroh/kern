import {
  KernSettingsRow,
  KernSettingsScreen,
  KernSettingsSection,
  notificationSettingsSection,
  poolAutoClaimSection,
  preferenceSettingsSection,
  profileSettingsSection,
  securitySettingsSection,
} from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Settings examples — one row family, four control kinds, two page
 * layouts. The row names the setting; the trailing control acts on it.
 * The screen composes the sidebar-pane navigation (full page) or the
 * vertical tab pills (dialog-tabs pattern) over the same sections.
 */
export const KERN_SETTINGS_EXAMPLES: ExampleSpec[] = [
  {
    id: "kern-settings-rows",
    title: "One row, four controls",
    description:
      "Switch, segmented, select and navigational rows share the label + supporting + icon contract — the control kind is a prop, not a fork.",
    render: () => (
      <div className="flex w-full max-w-xl flex-col gap-px overflow-hidden rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container)">
        <KernSettingsRow
          label="Push notifications"
          supporting="Alerts on this device"
          control="switch"
          defaultChecked
        />
        <KernSettingsRow
          label="Theme"
          control="segmented"
          segmentedOptions={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
          defaultSegmentedValue="light"
        />
        <KernSettingsRow
          label="Language"
          control="select"
          selectOptions={[
            { value: "en", label: "English" },
            { value: "nl", label: "Nederlands" },
          ]}
          defaultSelectValue="en"
        />
        <KernSettingsRow
          label="Email"
          supporting="Sign-in and receipts"
          control="button"
          href="#settings-email"
        />
      </div>
    ),
    code: `<KernSettingsRow label="Push notifications" control="switch" defaultChecked />
<KernSettingsRow label="Theme" control="segmented" segmentedOptions={[...]} />
<KernSettingsRow label="Language" control="select" selectOptions={[...]} />
<KernSettingsRow label="Email" control="button" href="#settings-email" />`,
  },
  {
    id: "kern-settings-screen",
    title: "Settings page, two layouts",
    description:
      "Sidebar for full pages, vertical pills for dialogs — same sections, same rows. Presets (profile, security, preferences, notifications, pool auto-claim) are data, spread into `sections`.",
    render: () => (
      <div className="flex w-full flex-col gap-8">
        <KernSettingsScreen
          layout="tabs"
          sections={[profileSettingsSection, securitySettingsSection]}
        />
        <KernSettingsSection
          {...poolAutoClaimSection}
          testID="kern-settings-auto-claim"
        />
        <KernSettingsScreen
          layout="tabs"
          sections={[preferenceSettingsSection, notificationSettingsSection]}
        />
      </div>
    ),
    code: `<KernSettingsScreen
  layout="tabs"
  sections={[profileSettingsSection, securitySettingsSection]}
/>
<KernSettingsSection {...poolAutoClaimSection} />`,
  },
];
