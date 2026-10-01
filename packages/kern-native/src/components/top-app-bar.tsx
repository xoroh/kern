import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-theme";
import type { ReactNode } from "react";
import { Pressable, type StyleProp, View, type ViewStyle } from "react-native";
import { useKernTheme } from "../theme";
import { Text } from "./text";

/**
 * M3 top app bar, all three mobile sizes. Small = 64dp, center = 64dp with
 * the title optically centered (M3 "small" on web maps here to `center`),
 * medium = 112dp with a headline that wraps to two lines.
 */

export type TopAppBarSize = "small" | "center" | "medium";

export const TOP_APP_BAR_HEIGHTS: Record<TopAppBarSize, number> = {
  small: 64,
  center: 64,
  medium: 112,
};

export function topAppBarStyles(
  size: TopAppBarSize,
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  const padding = Number.parseFloat(tokens.spacing["space-100"]);
  return {
    minHeight: TOP_APP_BAR_HEIGHTS[size],
    flexDirection: "row",
    alignItems: size === "medium" ? "flex-end" : "center",
    gap: padding,
    paddingHorizontal: padding,
    paddingBottom:
      size === "medium" ? Number.parseFloat(tokens.spacing["space-150"]) : 0,
    backgroundColor: scheme.color.surface,
    borderBottomWidth: 1,
    borderBottomColor: scheme.color.outlineVariant,
  };
}

export type NativeTopAppBarProps = {
  title: string;
  size?: TopAppBarSize;
  /** Menu / back affordance — a 48dp touch target, never a bare glyph. */
  leading?: ReactNode;
  /** Overflow actions, right-aligned. */
  trailing?: ReactNode;
  supporting?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function TopAppBar({
  title,
  size = "small",
  leading,
  trailing,
  supporting,
  style,
  testID,
}: NativeTopAppBarProps) {
  const { scheme } = useKernTheme();
  const barStyle = topAppBarStyles(size, scheme);
  const isCenter = size === "center";
  return (
    <View testID={testID ?? "kern-top-app-bar"} style={[barStyle, style]}>
      {leading}
      <View
        style={{
          flex: 1,
          alignItems: isCenter ? "center" : "flex-start",
          justifyContent: "center",
        }}
      >
        <Text
          variant={size === "medium" ? "headline" : "title"}
          numberOfLines={size === "medium" ? 2 : 1}
        >
          {title}
        </Text>
        {supporting ? (
          <Text
            variant="label"
            style={{ color: scheme.color.onSurfaceVariant }}
          >
            {supporting}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}

export type TopAppBarActionProps = {
  /** Icon node. */
  children: ReactNode;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
};

/** A 48dp icon action for {@link NativeTopAppBar}'s `trailing`/`leading` slot. */
export function TopAppBarAction({
  children,
  label,
  onPress,
  disabled,
  testID,
}: TopAppBarActionProps) {
  return (
    <Pressable
      testID={testID ?? "kern-top-app-bar-action"}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minWidth: 48,
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.38 : pressed ? 0.82 : 1,
      })}
    >
      {children}
    </Pressable>
  );
}
