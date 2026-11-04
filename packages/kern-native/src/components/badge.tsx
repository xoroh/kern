import { type StatusTone, statusToneSolid } from "@xoroh/kern-tokens";
import {
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernTheme } from "../theme";

export type { StatusTone };

export type NativeBadgeVariant = "dot" | "count";

export function badgeStyles(
  variant: NativeBadgeVariant,
  scheme = defaultScheme(),
  tone: StatusTone = "error",
): {
  container: ViewStyle;
  label: TextStyle;
} {
  // Solid emphasis (KernStatus, CL-010): a badge is a filled mark. Default
  // `error` preserves the M3 badge mapping.
  const { bg, fg } = statusToneSolid(scheme.color, tone);
  const container: ViewStyle =
    variant === "dot"
      ? {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: bg,
        }
      : {
          height: 16,
          minWidth: 16,
          borderRadius: 8,
          paddingHorizontal: 4,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
        };
  const label: TextStyle = {
    fontSize: 11,
    fontWeight: "500",
    color: fg,
  };
  return { container, label };
}

export type NativeBadgeProps = {
  variant?: NativeBadgeVariant;
  children?: string | number;
  /**
   * Registry tone (KernStatus, CL-010). Default `error` — the M3 badge
   * mapping; any of the 7 registry tones may replace it where contrast
   * against the anchor is proven.
   */
  tone?: StatusTone;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
};

export function Badge({
  variant = "count",
  children,
  tone = "error",
  accessibilityLabel,
  style,
  labelStyle,
  testID,
}: NativeBadgeProps) {
  const { scheme } = useKernTheme();
  const styles = badgeStyles(variant, scheme, tone);
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
