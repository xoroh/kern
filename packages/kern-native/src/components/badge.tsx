import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import {
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";

export type NativeBadgeVariant = "dot" | "count";

export function badgeStyles(
  variant: NativeBadgeVariant,
  scheme: ResolvedTheme = resolveThemeDetails(),
): {
  container: ViewStyle;
  label: TextStyle;
} {
  const container: ViewStyle =
    variant === "dot"
      ? {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: scheme.color.error,
        }
      : {
          height: 16,
          minWidth: 16,
          borderRadius: 8,
          paddingHorizontal: 4,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: scheme.color.error,
        };
  const label: TextStyle = {
    fontSize: 11,
    fontWeight: "500",
    color: scheme.color.onError,
  };
  return { container, label };
}

export type NativeBadgeProps = {
  variant?: NativeBadgeVariant;
  children?: string | number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
};

export function Badge({
  variant = "count",
  children,
  accessibilityLabel,
  style,
  labelStyle,
  testID,
}: NativeBadgeProps) {
  const { scheme } = useKernTheme();
  const styles = badgeStyles(variant, scheme);
  return (
    <View
      testID={testID ?? "kern-badge"}
      accessible={variant === "count" || Boolean(accessibilityLabel)}
      accessibilityRole="text"
      accessibilityLabel={
        accessibilityLabel ??
        (variant === "count" && children !== undefined
          ? `Count: ${children}`
          : undefined)
      }
      style={[styles.container, style]}
    >
      {variant === "count" && children !== undefined ? (
        <Text style={[styles.label, labelStyle]}>{children}</Text>
      ) : null}
    </View>
  );
}
