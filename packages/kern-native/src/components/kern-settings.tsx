import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, type StyleProp, View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { KernPicker } from "./kern-picker";
import { Switch } from "./switch";
import { Text } from "./text";

/**
 * KernSettings — native twin of web `KernSettings` (CL-014; D925).
 *
 * Same contract (`KernSettingsRow` control kinds, sections, screen,
 * setting-def adapter, presets incl. the A-004 auto-claim pair); only
 * the interaction idiom differs (N):
 *
 * - The screen is ALWAYS the grouped list (M3 N settings pattern) —
 *   there is no `layout` prop: no sidebar, no vertical tabs on a phone.
 *   Section switching is the host navigator's job; `value`/
 *   `defaultValue`/`onValueChange` pick the *highlighted* section.
 * - `select` rows open the sheet picker (KernPicker `bottom-sheet`,
 *   real snap physics from the host sheet); W uses the anchored popup.
 * - `segmented` rows are pressable pills (secondary-container active);
 *   W uses the SegmentedButton compound.
 * - `button` (navigational) rows are one Pressable (select-then-push);
 *   every other kind keeps activation on the trailing control.
 * - No hover/focus-ring classes (platform-gated); 48dp targets.
 */

export type SettingsControlKind =
  | "switch"
  | "segmented"
  | "select"
  | "button"
  | "custom";

export type SettingsSegmentOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SettingsSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type NativeKernSettingsRowProps = {
  label: string;
  supporting?: string;
  control?: SettingsControlKind;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  segmentedOptions?: readonly SettingsSegmentOption[];
  segmentedValue?: string;
  defaultSegmentedValue?: string;
  onSegmentedChange?: (value: string) => void;
  selectOptions?: readonly SettingsSelectOption[];
  selectValue?: string;
  defaultSelectValue?: string;
  onSelectChange?: (value: string) => void;
  selectPlaceholder?: string;
  /** Navigational activation (DOMAIN action, not state). */
  onPress?: () => void;
  badge?: ReactNode;
  /** `custom` control slot. */
  trailing?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** ONE settings row, native renderer. */
export function KernSettingsRow({
  label,
  supporting,
  control = "custom",
  checked,
  defaultChecked,
  onCheckedChange,
  segmentedOptions = [],
  segmentedValue,
  defaultSegmentedValue,
  onSegmentedChange,
  selectOptions = [],
  selectValue,
  defaultSelectValue,
  onSelectChange,
  selectPlaceholder = "Select",
  onPress,
  badge,
  trailing,
  disabled = false,
  style,
  testID,
}: NativeKernSettingsRowProps) {
  const scheme = useKernScheme();
  const [uncontrolledSegment, setUncontrolledSegment] = useState(
    defaultSegmentedValue,
  );
  const segment = segmentedValue ?? uncontrolledSegment;
  // The sheet picker is triggerless by contract (host-owned `open`), so
  // the select row owns its trigger chrome + open state and drives the
  // sheet controlled — the sheet physics stay the picker's.
  const [selectOpen, setSelectOpen] = useState(false);
  const selectCurrent = selectValue ?? defaultSelectValue;
  const selectLabel =
    selectOptions.find((option) => option.value === selectCurrent)?.label ??
    selectPlaceholder;
  const rowStyle: ViewStyle = {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: scheme.color.surface,
  };
  const body = (
    <>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="title" numberOfLines={1}>
          {label}
        </Text>
        {supporting ? (
          <Text
            variant="label"
            numberOfLines={2}
            style={{ color: scheme.color.onSurfaceVariant }}
          >
            {supporting}
          </Text>
        ) : null}
      </View>
      {control === "switch" ? (
        <Switch
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          accessibilityLabel={label}
          testID="kern-settings-row-switch"
        />
      ) : null}
      {control === "segmented" ? (
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel={label}
          testID="kern-settings-row-segmented"
          style={{
            flexDirection: "row",
            gap: 4,
            borderRadius: Number.parseFloat(scheme.shape.full),
            borderWidth: 1,
            borderColor: scheme.color.outline,
            padding: 4,
          }}
        >
          {segmentedOptions.map((option) => {
            const active = option.value === segment;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityState={{
                  selected: active,
                  disabled: disabled || option.disabled,
                }}
                disabled={disabled || option.disabled}
                onPress={() => {
                  if (segmentedValue === undefined)
                    setUncontrolledSegment(option.value);
                  onSegmentedChange?.(option.value);
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  minHeight: 40,
                  justifyContent: "center",
                  borderRadius: Number.parseFloat(scheme.shape.full),
                  backgroundColor: active
                    ? scheme.color.secondaryContainer
                    : "transparent",
                }}
              >
                <Text
                  variant="label"
                  style={{
                    color: active
                      ? scheme.color.onSecondaryContainer
                      : scheme.color.onSurfaceVariant,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
      {control === "select" ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => setSelectOpen(true)}
            testID="kern-settings-row-select"
            style={{
              minHeight: 48,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 16,
              borderRadius: Number.parseFloat(scheme.shape.small),
              borderWidth: 1,
              borderColor: scheme.color.outline,
              opacity: disabled ? 0.38 : 1,
            }}
          >
            <Text variant="label" numberOfLines={1}>
              {selectLabel}
            </Text>
            <Text variant="label">▾</Text>
          </Pressable>
          <KernPicker
            mode="option-list"
            variant="bottom-sheet"
            label={label}
            options={selectOptions.map((option) => ({
              value: option.value,
              label: option.label,
              disabled: option.disabled,
            }))}
            value={selectValue}
            defaultValue={defaultSelectValue}
            open={selectOpen}
            onOpenChange={setSelectOpen}
            onSelect={(next) => onSelectChange?.(next)}
            testID="kern-settings-row-select-sheet"
          />
        </>
      ) : null}
      {control === "button" ? (
        <View
          style={{
            flexShrink: 0,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {badge}
          <Text
            variant="title"
            style={{ color: scheme.color.onSurfaceVariant }}
          >
            ›
          </Text>
        </View>
      ) : null}
      {control === "custom" && trailing ? (
        <View style={{ flexShrink: 0 }}>{trailing}</View>
      ) : null}
    </>
  );
  if (control === "button") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        testID={testID ?? "kern-settings-row"}
        style={[rowStyle, style]}
      >
        {body}
      </Pressable>
    );
  }
  return (
    <View
      accessible
      accessibilityLabel={label}
      accessibilityRole="summary"
      testID={testID ?? "kern-settings-row"}
      style={[rowStyle, style]}
    >
      {body}
    </View>
  );
}

export type KernSettingsSectionDef = {
  id: string;
  title: string;
  description?: string;
  rows: readonly NativeKernSettingsRowProps[];
};

export type NativeKernSettingsSectionProps = KernSettingsSectionDef & {
  density?: "compact" | "medium";
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** One titled row group (an ITEM_PANEL preset shape, CMP-0674). */
export function KernSettingsSection({
  id,
  title,
  description,
  rows,
  density = "medium",
  style,
  testID,
}: NativeKernSettingsSectionProps) {
  const scheme = useKernScheme();
  return (
    <View
      testID={testID ?? `kern-settings-section-${id}`}
      style={[{ flexDirection: "column", gap: 8 }, style]}
    >
      <View style={{ paddingHorizontal: 16 }}>
        <Text variant="label" style={{ color: scheme.color.onSurfaceVariant }}>
          {title.toUpperCase()}
        </Text>
        {description ? (
          <Text
            variant="label"
            style={{ color: scheme.color.onSurfaceVariant }}
          >
            {description}
          </Text>
        ) : null}
      </View>
      <View
        style={{
          flexDirection: "column",
          borderRadius: Number.parseFloat(scheme.shape.medium),
          overflow: "hidden",
          backgroundColor: scheme.color.surfaceContainer,
          gap: density === "compact" ? 0 : 1,
        }}
      >
        {rows.map((row, index) => (
          <KernSettingsRow
            // biome-ignore lint/suspicious/noArrayIndexKey: rows are static section config, never reordered.
            key={`${id}-row-${index}`}
            {...row}
          />
        ))}
      </View>
    </View>
  );
}

export type SettingDef = {
  key: string;
  label: string;
  supporting?: string;
  kind: "toggle" | "choice" | "select" | "link";
  choices?: readonly SettingsSegmentOption[];
  options?: readonly SettingsSelectOption[];
};

export function settingDefToRow(def: SettingDef): NativeKernSettingsRowProps {
  switch (def.kind) {
    case "toggle":
      return {
        label: def.label,
        supporting: def.supporting,
        control: "switch",
      };
    case "choice":
      return {
        label: def.label,
        supporting: def.supporting,
        control: "segmented",
        segmentedOptions: def.choices ?? [],
      };
    case "select":
      return {
        label: def.label,
        supporting: def.supporting,
        control: "select",
        selectOptions: def.options ?? [],
      };
    case "link":
      return {
        label: def.label,
        supporting: def.supporting,
        control: "button",
      };
  }
}

export type NativeKernSettingsScreenProps = {
  sections: readonly KernSettingsSectionDef[];
  density?: "compact" | "medium";
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * SettingsPage block, native renderer: the grouped list. One data
 * contract with web `KernSettingsScreen` (sections + density); the
 * sidebar/tab-strip layouts and the active-section value do not exist
 * on N — a phone shows every group, section switching is the host
 * navigator's job.
 */
export function KernSettingsScreen({
  sections,
  density = "medium",
  style,
  testID,
}: NativeKernSettingsScreenProps) {
  return (
    <View
      testID={testID ?? "kern-settings-screen"}
      style={[{ flexDirection: "column", gap: 16 }, style]}
    >
      {sections.map((section) => (
        <KernSettingsSection key={section.id} {...section} density={density} />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section presets (data — same shapes as the web twin, N-typed)
// ---------------------------------------------------------------------------

export const profileSettingsSection: KernSettingsSectionDef = {
  id: "profile",
  title: "Profile",
  rows: [
    {
      label: "Name",
      supporting: "Shown to staff and partners",
      control: "button",
    },
    { label: "Email", supporting: "Sign-in and receipts", control: "button" },
    {
      label: "Avatar",
      supporting: "Initials disc or photo",
      control: "button",
    },
  ],
};

export const securitySettingsSection: KernSettingsSectionDef = {
  id: "security",
  title: "Security",
  rows: [
    {
      label: "Passkey",
      supporting: "Sign in without a password",
      control: "button",
    },
    {
      label: "Active sessions",
      supporting: "Devices signed in now",
      control: "button",
    },
    {
      label: "Two-step verification",
      supporting: "Code on every new device",
      control: "switch",
      defaultChecked: true,
    },
  ],
};

export const preferenceSettingsSection: KernSettingsSectionDef = {
  id: "preferences",
  title: "Preferences",
  rows: [
    {
      label: "Theme",
      supporting: "Light, dark, or system",
      control: "segmented",
      segmentedOptions: [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" },
      ],
      defaultSegmentedValue: "system",
    },
    {
      label: "Language",
      supporting: "Display language (RTL mirrors layout)",
      control: "select",
      selectOptions: [
        { value: "en", label: "English" },
        { value: "nl", label: "Nederlands" },
        { value: "ar", label: "العربية" },
      ],
      defaultSelectValue: "en",
    },
  ],
};

export const notificationSettingsSection: KernSettingsSectionDef = {
  id: "notifications",
  title: "Notifications",
  rows: [
    {
      label: "Push notifications",
      supporting: "Alerts on this device",
      control: "switch",
      defaultChecked: true,
    },
    { label: "Email digests", supporting: "Daily summary", control: "switch" },
  ],
};

/** A-004 / MS-003 preset: pool auto-claim platform-default editor (shape only). */
export const poolAutoClaimSection: KernSettingsSectionDef = {
  id: "pool-auto-claim",
  title: "Pool auto-claim",
  description:
    "Platform default. Partners choose within these bounds (see Partner auto-claim).",
  rows: [
    {
      label: "Auto-claim mode",
      supporting: "Off, limited, or automatic pool claiming",
      control: "segmented",
      segmentedOptions: [
        { value: "off", label: "Off" },
        { value: "limited", label: "Limited" },
        { value: "auto", label: "Auto" },
      ],
      defaultSegmentedValue: "limited",
    },
    {
      label: "Auto-claim bound",
      supporting: "Platform ceiling; wired to dispatch bounds at transfer",
      control: "select",
      selectOptions: [
        { value: "b1", label: "Up to 1 concurrent" },
        { value: "b2", label: "Up to 2 concurrent" },
        { value: "b4", label: "Up to 4 concurrent" },
      ],
      defaultSelectValue: "b2",
    },
  ],
};

/** A-004 / MS-004 preset: partner auto-claim choice within platform bounds. */
export const partnerAutoClaimSection: KernSettingsSectionDef = {
  id: "partner-auto-claim",
  title: "Partner auto-claim",
  description: "Your choice, within the platform default bounds.",
  rows: [
    {
      label: "My auto-claim",
      supporting: "Follows the platform ceiling",
      control: "segmented",
      segmentedOptions: [
        { value: "off", label: "Off" },
        { value: "limited", label: "Limited" },
        { value: "auto", label: "Auto" },
      ],
      defaultSegmentedValue: "off",
    },
  ],
};
