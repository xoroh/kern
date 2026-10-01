import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";

/**
 * M3 navigation bar. Destinations carry an icon slot + label; the active one
 * gets the M3 active indicator (a `secondaryContainer` pill behind the icon).
 * Height is fixed at 80dp so the bar never reflows when labels change.
 */

export const NAVIGATION_BAR_HEIGHT = 80;

export type NavigationDestination = {
  key: string;
  label: string;
  /** Icon node — an SVG-less glyph from `@xoroh/kern-icons` or any RN view. */
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
};

export type NativeNavigationBarProps = {
  destinations: NavigationDestination[];
  value: string;
  onValueChange: (key: string) => void;
  /** Rendered under the bar (a FAB dock sits here in M3). */
  floating?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function navigationBarStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
): {
  bar: ViewStyle;
  destination: ViewStyle;
  indicator: ViewStyle;
  label: TextStyle;
  activeLabel: TextStyle;
} {
  return {
    bar: {
      height: NAVIGATION_BAR_HEIGHT,
      flexDirection: "row",
      alignItems: "stretch",
      backgroundColor: scheme.color.surfaceContainer,
      borderTopWidth: Number.parseFloat(tokens.spacing["space-0"]) || 1,
      borderTopColor: scheme.color.outlineVariant,
    },
    destination: {
      flex: 1,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      paddingHorizontal: Number.parseFloat(tokens.spacing["space-100"]),
    },
    indicator: {
      minWidth: 64,
      height: 32,
      borderRadius: Number.parseFloat(scheme.shape.full),
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      fontSize: 12,
      fontWeight: "500",
      color: scheme.color.onSurfaceVariant,
    },
    activeLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: scheme.color.onSurface,
    },
  };
}

export function NavigationBar({
  destinations,
  value,
  onValueChange,
  floating,
  style,
  testID,
}: NativeNavigationBarProps) {
  const { scheme } = useKernTheme();
  const styles = navigationBarStyles(scheme);
  return (
    <View>
      <View
        testID={testID ?? "kern-navigation-bar"}
        style={[styles.bar, style]}
      >
        {destinations.map((destination) => {
          const selected = destination.key === value;
          return (
            <Pressable
              key={destination.key}
              accessibilityRole="tab"
              accessibilityState={{
                selected,
                disabled: Boolean(destination.disabled),
              }}
              accessibilityLabel={destination.label}
              disabled={destination.disabled}
              onPress={() => onValueChange(destination.key)}
              style={({ pressed }) => [
                styles.destination,
                pressed && !destination.disabled
                  ? { opacity: 0.82 }
                  : undefined,
              ]}
            >
              <View
                style={[
                  styles.indicator,
                  selected
                    ? { backgroundColor: scheme.color.secondaryContainer }
                    : null,
                ]}
              >
                {destination.icon}
                {destination.badge}
              </View>
              <Text
                numberOfLines={1}
                style={selected ? styles.activeLabel : styles.label}
              >
                {destination.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {floating}
    </View>
  );
}

export type NavigationBarItemProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityRole" | "accessibilityState"
> & {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
};

/**
 * One destination row for vertical containers (drawer, rail, sidebar list):
 * 56dp minimum with the `secondaryContainer` pill when selected. Same
 * destination data as {@link NavigationBar} — only the container differs.
 */
export function NavigationBarItem({
  label,
  selected = false,
  icon,
  badge,
  onPress,
  style,
  accessibilityLabel,
  testID,
  ...props
}: NavigationBarItemProps) {
  const { scheme } = useKernTheme();
  const styles = navigationBarStyles(scheme);
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-navigation-bar-item"}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 56,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
          gap: Number.parseFloat(tokens.spacing["space-150"]),
          borderRadius: Number.parseFloat(scheme.shape.full),
          backgroundColor: selected
            ? scheme.color.secondaryContainer
            : "transparent",
        },
        pressed ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      {icon}
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          { flex: 1 },
          selected ? styles.activeLabel : null,
        ]}
      >
        {label}
      </Text>
      {badge}
    </Pressable>
  );
}
