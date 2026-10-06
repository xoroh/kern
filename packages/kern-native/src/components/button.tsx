import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";

// M3: elevated, filled, tonal, outlined, text (m3.material.io/components/buttons/overview).
// Mirrors the web union exactly — the variant law requires one MEANING, not one name count.
export type NativeButtonVariant =
  | "elevated"
  | "primary"
  | "tonal"
  | "outlined"
  | "ghost";
export type NativeButtonSize = "default" | "sm" | "icon";

/**
 * R2 variant map, re-homed (T1): M3 names as aliases onto the Kern styles.
 * `filled`/`text` resolve to existing styles — no new visuals. `elevated`
 * already exists here, so it is not an alias. Exhaustive Record — new M3
 * names break typecheck here.
 */
export type NativeButtonM3Variant = "filled" | "text";
export const NATIVE_BUTTON_VARIANT_ALIASES: Record<
  NativeButtonM3Variant,
  NativeButtonVariant
> = {
  filled: "primary",
  text: "ghost",
};

/** Accepted variant prop: Kern names or M3 aliases (normalized internally). */
export type NativeButtonVariantInput =
  | NativeButtonVariant
  | NativeButtonM3Variant;

/**
 * R2 size foundation, re-homed (T1): Button sizes onto `KernSize`.
 * `default` renders at md metrics, `sm` is `sm`; `icon` is shape, not
 * scale, and is intentionally absent — same rule as the platform source.
 */
export const NATIVE_BUTTON_SIZE_TO_KERN_SIZE = {
  default: "md",
  sm: "sm",
} as const;

const HEIGHTS: Record<NativeButtonSize, number> = {
  default: 40,
  sm: 32,
  icon: 40,
};

export function buttonStyles(
  variant: NativeButtonVariant,
  size: NativeButtonSize,
  disabled: boolean,
  theme: ResolvedTheme = resolveThemeDetails(),
): { container: ViewStyle; label: TextStyle } {
  const container: ViewStyle = {
    height: HEIGHTS[size],
    minWidth: size === "icon" ? HEIGHTS[size] : 64,
    borderRadius: Number.parseFloat(theme.shape.full),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: size === "icon" ? 0 : 16,
    backgroundColor:
      variant === "primary"
        ? theme.color.primary
        : variant === "tonal"
          ? theme.color.secondaryContainer
          : variant === "elevated"
            ? theme.color.surfaceContainerLow
            : "transparent",
    borderWidth: variant === "outlined" ? 1 : 0,
    borderColor: variant === "outlined" ? theme.color.outline : "transparent",
    opacity: disabled ? 0.5 : 1,
  };
  const label: TextStyle = {
    fontSize: size === "sm" ? 13 : 14,
    fontWeight: "500",
    color:
      variant === "primary"
        ? theme.color.onPrimary
        : variant === "tonal"
          ? theme.color.onSecondaryContainer
          : variant === "elevated" ||
              variant === "outlined" ||
              variant === "ghost"
            ? theme.color.primary
            : theme.color.onSurface,
  };
  return { container, label };
}

export type NativeButtonProps = Omit<
  PressableProps,
  "onPress" | "accessibilityRole" | "accessibilityState"
> & {
  variant?: NativeButtonVariantInput;
  size?: NativeButtonSize;
  children: ReactNode;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
  labelStyle?: StyleProp<TextStyle>;
};

export function Button({
  variant: variantInput = "primary",
  size = "default",
  children,
  onPress,
  style,
  labelStyle,
  disabled,
  testID,
  ...props
}: NativeButtonProps) {
  const { scheme } = useKernTheme();
  // M3 aliases normalize to Kern names once, here — buttonStyles and the
  // ripple below only ever see Kern names, so rendering cannot change.
  const variant: NativeButtonVariant =
    variantInput in NATIVE_BUTTON_VARIANT_ALIASES
      ? NATIVE_BUTTON_VARIANT_ALIASES[variantInput as NativeButtonM3Variant]
      : (variantInput as NativeButtonVariant);
  const styles = buttonStyles(variant, size, Boolean(disabled), scheme);
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-button"}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      hitSlop={size === "sm" ? 8 : 4}
      android_ripple={{
        color: `${variant === "primary" ? scheme.color.onPrimary : scheme.color.onSurface}20`,
        borderless: size === "icon",
      }}
      onPress={(event: GestureResponderEvent) => onPress?.(event)}
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[styles.label, labelStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
