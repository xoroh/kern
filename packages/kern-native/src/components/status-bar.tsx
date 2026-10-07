import type { ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { useKernTheme } from "../theme";
import { Text } from "./text";

export type NativeStatusBarProps = {
  children?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Native `StatusBar` — a status strip: leading + centered status + trailing.
 *
 * Mirrors web `StatusBar` in `packages/kern/src/start/blocks.tsx`. The
 * centered child is the status text; leading and trailing are slots for
 * indicators or actions. Announced as a summary landmark so a screen reader
 * can find the status without entering the content region.
 */
export function StatusBar({
  children,
  leading,
  trailing,
  accessibilityLabel = "Status",
  style,
  testID,
}: NativeStatusBarProps) {
  const { scheme } = useKernTheme();
  return (
    <View
      testID={testID ?? "kern-status-bar"}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="summary"
      style={[
        {
          minHeight: 32,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 12,
          borderTopWidth: 1,
          borderTopColor: scheme.color.outlineVariant,
          backgroundColor: scheme.color.surfaceContainer,
        },
        style,
      ]}
    >
      {leading ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {leading}
        </View>
      ) : null}
      <View
        style={{ flex: 1, minWidth: 0, alignItems: "center" }}
        accessibilityLabel={typeof children === "string" ? children : undefined}
      >
        {typeof children === "string" ? (
          <Text variant="label" numberOfLines={1}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
      {trailing ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {trailing}
        </View>
      ) : null}
    </View>
  );
}
