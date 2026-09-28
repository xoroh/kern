import {
  type StyleProp,
  TextInput,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";

export function inputStyles(error: boolean): TextStyle {
  return {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: error
      ? tokens.palettes.red["600"].srgb
      : tokens.palettes.neutral["300"].srgb,
    backgroundColor: tokens.base.white.srgb,
    paddingHorizontal: 16,
    fontSize: 16,
    color: tokens.palettes.neutral["800"].srgb,
  };
}

export type NativeInputProps = TextInputProps & {
  error?: boolean;
  style?: StyleProp<TextStyle>;
};

export function Input({ error = false, style, ...props }: NativeInputProps) {
  return (
    <TextInput
      testID={props.testID ?? "kern-input"}
      aria-invalid={error || undefined}
      placeholderTextColor={tokens.palettes.neutral["400"].srgb}
      style={[inputStyles(error), style]}
      {...props}
    />
  );
}
