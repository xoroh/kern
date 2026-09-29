import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-theme";
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
    borderRadius: Number.parseFloat(scheme.shape.small),
    backgroundColor: scheme.color.surface,
  };
  if (variant === "outlined") {
    return {
      ...base,
      borderWidth: 1,
      borderColor: scheme.color.outlineVariant,
    };
  }
  if (variant === "elevated") {
    return {
      ...base,
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
