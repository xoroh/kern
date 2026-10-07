import type { ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { useKernTheme } from "../theme";
import { Text } from "./text";

export type NativeSettingsRowProps = {
  label: string;
  supporting?: string;
  trailing?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Native `SettingsRow` — one settings row: label + supporting text + a
 * trailing control slot.
 *
 * Mirrors web `SettingsRow` in `packages/kern/src/start/blocks.tsx`: the
 * label is the accessible name, the supporting line is supplementary text,
 * and the trailing slot carries whatever control the row owns. The row
 * itself is not pressable — activation belongs to the trailing control,
 * so the row carries no accessibility role beyond its label.
 */
export function SettingsRow({
  label,
  supporting,
  trailing,
  accessibilityLabel,
  style,
  testID,
}: NativeSettingsRowProps) {
  const { scheme } = useKernTheme();
  return (
    <View
      testID={testID ?? "kern-settings-row"}
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="summary"
      style={[
        {
          minHeight: 56,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: scheme.color.surface,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, minWidth: 0, flexDirection: "column" }}>
        <Text variant="title" numberOfLines={1}>
          {label}
        </Text>
        {supporting ? (
          <Text variant="label" numberOfLines={2}>
            {supporting}
          </Text>
        ) : null}
      </View>
      {trailing ? <View style={{ flexShrink: 0 }}>{trailing}</View> : null}
    </View>
  );
}
