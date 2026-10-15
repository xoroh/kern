import {
  cssLengthToDp,
  type ResolvedTheme,
} from "@xoroh/kern-tokens";
import {
  type StyleProp,
  TextInput,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import { useNativeField } from "../field-context";
import { useKernTheme } from "../theme";

function withAlpha(color: string, alpha: number): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    const byte = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `${color}${byte}`;
  }
  return color;
}

export type NativeInputVariant = "outlined" | "filled";

export function inputStyles(
  error: boolean,
  multiline: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
  disabled = false,
  variant: NativeInputVariant = "outlined",
): TextStyle {
  const filled = variant === "filled";
  const radius = cssLengthToDp(
    scheme.comp?.["text-field-container-shape"],
    Number.parseFloat(scheme.shape["extra-small"]),
  );
  return {
    minHeight: multiline ? 112 : 56,
    // Filled rounds only the top (extra-small-top); outlined rounds all.
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    borderBottomLeftRadius: filled ? 0 : radius,
    borderBottomRightRadius: filled ? 0 : radius,
    borderWidth: filled ? 0 : 1,
    borderBottomWidth: 1,
    borderColor: error
      ? scheme.color.error
      : disabled
        ? withAlpha(scheme.color.onSurface, filled ? 0.38 : 0.12)
        : filled
          ? scheme.color.onSurfaceVariant
          : scheme.color.outline,
    backgroundColor: filled
      ? disabled
        ? withAlpha(scheme.color.onSurface, 0.04)
        : scheme.color.surfaceContainerHighest
      : scheme.color.surface,
    paddingHorizontal: 16,
    paddingVertical: multiline ? 12 : 0,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    color: disabled
      ? withAlpha(scheme.color.onSurface, 0.38)
      : scheme.color.onSurface,
    textAlignVertical: multiline ? "top" : "center",
  };
}

export type NativeInputProps = TextInputProps & {
  /**
   * M3 text-field treatment. `outlined` (default) draws the 1px outline;
   * `filled` fills `surface-container-highest` with a bottom active
   * indicator. Functionally identical — pick by surface.
   */
  variant?: NativeInputVariant;
  error?: boolean;
  errorMessage?: string;
  style?: StyleProp<TextStyle>;
};

export function Input({
  variant = "outlined",
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
  const isDisabled = props.editable === false;
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
      placeholderTextColor={
        isDisabled
          ? withAlpha(scheme.color.onSurface, 0.38)
          : scheme.color.onSurfaceVariant
      }
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      style={[
        inputStyles(hasError, multiline, scheme, isDisabled, variant),
        style,
      ]}
    />
  );
}
