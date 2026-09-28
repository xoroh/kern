import {
  type StyleProp,
  Text,
  type TextProps,
  type TextStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";

export function fieldMessageStyles(
  variant: "description" | "error",
): TextStyle {
  return {
    fontSize: 12,
    color:
      variant === "error"
        ? tokens.palettes.red["600"].srgb
        : tokens.palettes.neutral["600"].srgb,
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
  return (
    <Text
      testID={testID ?? "kern-field-message"}
      accessibilityRole={variant === "error" ? "alert" : "none"}
      style={[fieldMessageStyles(variant), style]}
      {...props}
    />
  );
}
