import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";

export function dividerStyles(
  orientation: "horizontal" | "vertical",
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  return orientation === "vertical"
    ? {
        width: 1,
        alignSelf: "stretch" as const,
        backgroundColor: scheme.color.outlineVariant,
      }
    : {
        height: 1,
        width: "100%" as const,
        backgroundColor: scheme.color.outlineVariant,
      };
}

export type SeparatorProps = ViewProps & {
  orientation?: "horizontal" | "vertical";
  style?: StyleProp<ViewStyle>;
};

export function Separator({
  orientation = "horizontal",
  style,
  testID,
  ...props
}: SeparatorProps) {
  const { scheme } = useKernTheme();
  return (
    <View
      testID={testID ?? "kern-divider"}
      accessibilityRole="none"
      style={[dividerStyles(orientation, scheme), style]}
      {...props}
    />
  );
}
