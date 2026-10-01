import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
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
  variant?: NativeButtonVariant;
  size?: NativeButtonSize;
  children: ReactNode;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
  labelStyle?: StyleProp<TextStyle>;
};

export function Button({
  variant = "primary",
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
