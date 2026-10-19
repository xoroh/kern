import type { ResolvedTheme } from "@xoroh/kern-tokens";
import {
  type StyleProp,
  Text,
  type TextProps,
  type TextStyle,
} from "react-native";
import { defaultScheme, useKernTheme } from "../theme";

export function fieldMessageStyles(
  variant: "description" | "error",
  scheme: ResolvedTheme = defaultScheme(),
): TextStyle {
  return {
    fontSize: 12,
    color:
      variant === "error" ? scheme.color.error : scheme.color.onSurfaceVariant,
  };
}

export type NativeFieldMessageProps = TextProps & {
  variant?: "description" | "error";
  style?: StyleProp<TextStyle>;
};

export function FieldMessage({
  variant = "description",
  style,
  testID,
  ...props
}: NativeFieldMessageProps) {
  const { scheme } = useKernTheme();
  return (
    <Text
      testID={testID ?? "kern-field-message"}
      accessibilityRole={variant === "error" ? "alert" : "none"}
      style={[fieldMessageStyles(variant, scheme), style]}
      {...props}
    />
  );
}
