import {
  cssLengthToDp,
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";

export type NativeCardVariant = "filled" | "outlined" | "elevated";

export function cardStyles(
  variant: NativeCardVariant,
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  const base: ViewStyle = {
    borderRadius: cssLengthToDp(
      scheme.comp?.["card-container-shape"],
      Number.parseFloat(scheme.shape.medium),
    ),
    backgroundColor: scheme.color.surfaceContainerHighest,
  };
  if (variant === "outlined") {
    return {
      ...base,
      backgroundColor: scheme.color.surface,
      borderWidth: 1,
      borderColor: scheme.color.outlineVariant,
    };
  }
  if (variant === "elevated") {
    return {
      ...base,
      backgroundColor: scheme.color.surfaceContainerLow,
      shadowColor: tokens.base.black.srgb,
      shadowOpacity: 0.3,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: tokens.elevation.level1.dp,
    };
  }
  return base;
}

export type NativeCardProps = ViewProps & {
  variant?: NativeCardVariant;
  style?: StyleProp<ViewStyle>;
};

export function Card({
  variant = "filled",
  style,
  testID,
  ...props
}: NativeCardProps) {
  const { scheme } = useKernTheme();
  return (
    <View
      {...props}
      testID={testID ?? "kern-card"}
      style={[cardStyles(variant, scheme), style]}
    />
  );
}

/**
 * M3 card anatomy slots: 16dp content padding, 8dp end-aligned action rows.
 */
export function CardHeader({
  style,
  testID,
  ...props
}: ViewProps & { style?: StyleProp<ViewStyle> }) {
  return (
    <View
      {...props}
      testID={testID ?? "kern-card-header"}
      style={[{ padding: 16, paddingBottom: 0, gap: 4 }, style]}
    />
  );
}

export function CardContent({
  style,
  testID,
  ...props
}: ViewProps & { style?: StyleProp<ViewStyle> }) {
  return (
    <View
      {...props}
      testID={testID ?? "kern-card-content"}
      style={[{ padding: 16 }, style]}
    />
  );
}

export function CardActions({
  style,
  testID,
  ...props
}: ViewProps & { style?: StyleProp<ViewStyle> }) {
  return (
    <View
      {...props}
      testID={testID ?? "kern-card-actions"}
      accessibilityRole="none"
      style={[
        { flexDirection: "row", justifyContent: "flex-end", gap: 8, padding: 8 },
        style,
      ]}
    />
  );
}
