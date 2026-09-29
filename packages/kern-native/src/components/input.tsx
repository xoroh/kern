import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import {
  type StyleProp,
  TextInput,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import { useNativeField } from "../field-context";
import { useKernTheme } from "../theme";

export function inputStyles(
  error: boolean,
  multiline: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): TextStyle {
  return {
    minHeight: multiline ? 112 : 56,
    borderRadius: Number.parseFloat(scheme.shape.small),
    borderWidth: 1,
    borderColor: error ? scheme.color.error : scheme.color.outline,
    backgroundColor: scheme.color.surface,
    paddingHorizontal: 16,
    paddingVertical: multiline ? 12 : 0,
    fontSize: 16,
    color: scheme.color.onSurface,
    textAlignVertical: multiline ? "top" : "center",
  };
}

export type NativeInputProps = TextInputProps & {
  error?: boolean;
  errorMessage?: string;
  style?: StyleProp<TextStyle>;
};

export function Input({
  error = false,
  errorMessage,
  style,
  accessibilityHint,
  accessibilityLabel,
  multiline = false,
  ...props
}: NativeInputProps) {
  const { scheme } = useKernTheme();
  const field = useNativeField();
  const hasError = error || Boolean(field?.error);
  // RN has no accessibilityState.invalid. Announce the error through the
  // focused field hint; FieldMessage adds the live alert nearby.
  const hint = [
    accessibilityHint,
    field?.description,
    hasError ? (errorMessage ?? field?.error ?? "Invalid input") : undefined,
  ]
    .filter(Boolean)
    .join(". ");
  return (
    <TextInput
      {...props}
      testID={props.testID ?? "kern-input"}
      accessibilityLabel={accessibilityLabel ?? field?.label}
      accessibilityHint={hint || undefined}
      accessibilityState={{ disabled: Boolean(props.editable === false) }}
      placeholderTextColor={scheme.color.onSurfaceVariant}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      style={[inputStyles(hasError, multiline, scheme), style]}
    />
  );
}
