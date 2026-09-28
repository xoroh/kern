import {
  Text as RNText,
  type TextProps as RNTextProps,
  type StyleProp,
  type TextStyle,
} from "react-native";

export type NativeTextVariant = "body" | "label" | "title" | "headline";

const SIZES: Record<
  NativeTextVariant,
  { fontSize: number; fontWeight: NonNullable<TextStyle["fontWeight"]> }
> = {
  body: { fontSize: 14, fontWeight: "400" },
  label: { fontSize: 14, fontWeight: "500" },
  title: { fontSize: 18, fontWeight: "600" },
  headline: { fontSize: 24, fontWeight: "600" },
};

export function textStyles(variant: NativeTextVariant): TextStyle {
  return {
    fontSize: SIZES[variant].fontSize,
    fontWeight: SIZES[variant].fontWeight,
  };
}

export type NativeTextProps = RNTextProps & {
  variant?: NativeTextVariant;
  style?: StyleProp<TextStyle>;
};

export function Text({ variant = "body", style, ...props }: NativeTextProps) {
  return <RNText style={[textStyles(variant), style]} {...props} />;
}
