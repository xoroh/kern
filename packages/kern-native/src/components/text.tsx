import { tokens } from "@xoroh/kern-tokens";
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { useKernTheme } from "../theme";

export type NativeTextVariant = "body" | "label" | "title" | "headline";

function scaleEntry(variant: NativeTextVariant) {
  const name = tokens.typography.roles[
    variant
  ] as keyof typeof tokens.typography.scale;
  return tokens.typography.scale[name];
}

export function textStyles(variant: NativeTextVariant): TextStyle {
  const type = scaleEntry(variant);
  const fontFamily =
    type.weight >= 600
      ? tokens.typography.fontFaces.semibold
      : type.weight >= 500
        ? tokens.typography.fontFaces.medium
        : tokens.typography.fontFaces.regular;
  return {
    fontFamily,
    fontSize: Number.parseFloat(type.size),
    lineHeight: Number.parseFloat(type.lineHeight),
    letterSpacing: Number.parseFloat(type.tracking),
    fontWeight: String(type.weight) as TextStyle["fontWeight"],
  };
}

export type NativeTextProps = RNTextProps & {
  variant?: NativeTextVariant;
  style?: StyleProp<TextStyle>;
};

export function Text({ variant = "body", style, ...props }: NativeTextProps) {
  const { scheme } = useKernTheme();
  return (
    <RNText
      style={[textStyles(variant), { color: scheme.color.onSurface }, style]}
      {...props}
    />
  );
}
