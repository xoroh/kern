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
  inset: "none" | "start" | "middle" = "none",
): ViewStyle {
  const base =
    orientation === "vertical"
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
  if (inset === "none") return base;
  const both = inset === "middle";
  return orientation === "vertical"
    ? { ...base, marginTop: 16, ...(both ? { marginBottom: 16 } : null) }
    : { ...base, marginLeft: 16, ...(both ? { marginRight: 16 } : null) };
}

export type SeparatorProps = ViewProps & {
  orientation?: "horizontal" | "vertical";
  /**
   * M3 divider insets: `none` full-bleed, `start` 16dp leading inset,
   * `middle` 16dp on both sides.
   */
  inset?: "none" | "start" | "middle";
  style?: StyleProp<ViewStyle>;
};

export function Separator({
  orientation = "horizontal",
  inset = "none",
  style,
  testID,
  ...props
}: SeparatorProps) {
  const { scheme } = useKernTheme();
  return (
    <View
      testID={testID ?? "kern-divider"}
      accessibilityRole="none"
      style={[dividerStyles(orientation, scheme, inset), style]}
      {...props}
    />
  );
}
