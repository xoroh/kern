import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";

export function dividerStyles(
  orientation: "horizontal" | "vertical",
): ViewStyle {
  return orientation === "vertical"
    ? {
        width: 1,
        alignSelf: "stretch" as const,
        backgroundColor: tokens.palettes.neutral["200"].srgb,
      }
    : {
        height: 1,
        width: "100%" as const,
        backgroundColor: tokens.palettes.neutral["200"].srgb,
      };
}

export type NativeDividerProps = ViewProps & {
  orientation?: "horizontal" | "vertical";
  style?: StyleProp<ViewStyle>;
};

export function Divider({
  orientation = "horizontal",
  style,
  testID,
  ...props
}: NativeDividerProps) {
  return (
    <View
      testID={testID ?? "kern-divider"}
      accessibilityRole="none"
      style={[dividerStyles(orientation), style]}
      {...props}
    />
  );
}
