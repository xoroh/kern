import {
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";

export type NativeBadgeVariant = "dot" | "count";

export function badgeStyles(variant: NativeBadgeVariant): {
  container: ViewStyle;
  label: TextStyle;
} {
  const container: ViewStyle =
    variant === "dot"
      ? {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: tokens.palettes.red["600"].srgb,
        }
      : {
          height: 16,
          minWidth: 16,
          borderRadius: 8,
          paddingHorizontal: 4,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: tokens.palettes.red["600"].srgb,
        };
  const label: TextStyle = {
    fontSize: 11,
    fontWeight: "500",
    color: tokens.base.white.srgb,
  };
  return { container, label };
}

export type NativeBadgeProps = {
  variant?: NativeBadgeVariant;
  children?: string | number;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
};

export function Badge({
  variant = "count",
  children,
  style,
  labelStyle,
  testID,
}: NativeBadgeProps) {
  const styles = badgeStyles(variant);
  return (
    <View testID={testID ?? "kern-badge"} style={[styles.container, style]}>
      {variant === "count" && children !== undefined ? (
        <Text style={[styles.label, labelStyle]}>{children}</Text>
      ) : null}
    </View>
  );
}
