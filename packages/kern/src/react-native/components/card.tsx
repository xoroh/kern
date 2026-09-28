import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";

export type NativeCardVariant = "filled" | "outlined" | "elevated";

export function cardStyles(variant: NativeCardVariant): ViewStyle {
  const base: ViewStyle = {
    borderRadius: 8,
    backgroundColor: tokens.base.white.srgb,
  };
  if (variant === "outlined") {
    return {
      ...base,
      borderWidth: 1,
      borderColor: tokens.palettes.neutral["200"].srgb,
    };
  }
  if (variant === "elevated") {
    return {
      ...base,
      shadowColor: "#000",
      shadowOpacity: 0.16,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    };
  }
  return {
    ...base,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  };
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
  return (
    <View
      testID={testID ?? "kern-card"}
      style={[cardStyles(variant), style]}
      {...props}
    />
  );
}
