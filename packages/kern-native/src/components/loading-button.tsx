import type { LoadingIndicatorStyle } from "@xoroh/kern-tokens";
import { type GestureResponderEvent, Pressable, Text } from "react-native";
import { useKernScheme } from "../theme";
import {
  buttonStyles,
  NATIVE_BUTTON_VARIANT_ALIASES,
  type NativeButtonM3Variant,
  type NativeButtonProps,
  type NativeButtonVariant,
} from "./button";
import { CircularProgress } from "./circular-progress";

export type LoadingButtonProps = NativeButtonProps & {
  /** Shows the embedded progress indicator and blocks interaction. */
  loading?: boolean;
  /** 0–1 determinate progress while loading. Omit for the loop. */
  value?: number;
  /** Style of the embedded indicator. Defaults to the M3 ring (`spinner`). */
  loaderStyle?: LoadingIndicatorStyle;
};

/**
 * LoadingButton — button with embedded progress. Keeps its label and
 * footprint while loading (M3: never resize chrome for progress) and
 * hands the wait to a CircularProgress in the leading slot.
 */
export function LoadingButton({
  loading = false,
  value,
  loaderStyle,
  variant: variantInput = "primary",
  size = "default",
  children,
  onPress,
  style,
  labelStyle,
  disabled,
  testID,
  ...props
}: LoadingButtonProps) {
  const scheme = useKernScheme();
  const blocked = Boolean(disabled) || loading;
  // Same M3-alias normalization as Button — buttonStyles only sees Kern names.
  const variant: NativeButtonVariant =
    variantInput in NATIVE_BUTTON_VARIANT_ALIASES
      ? NATIVE_BUTTON_VARIANT_ALIASES[variantInput as NativeButtonM3Variant]
      : (variantInput as NativeButtonVariant);
  const styles = buttonStyles(variant, size, blocked, scheme);
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-loading-button"}
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      hitSlop={size === "sm" ? 8 : 4}
      onPress={(event: GestureResponderEvent) => onPress?.(event)}
      style={({ pressed }) => [
        styles.container,
        loading ? { gap: 8 } : undefined,
        pressed && !blocked ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      {loading ? (
        <CircularProgress
          value={value}
          loaderStyle={loaderStyle}
          size="sm"
          label="Loading"
          color={
            variant === "primary"
              ? scheme.color.onPrimary
              : scheme.color.onSurface
          }
        />
      ) : null}
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[styles.label, labelStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
