import {
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";

export type NativeButtonVariant = "primary" | "tonal" | "ghost";
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
): { container: ViewStyle; label: TextStyle } {
  const container: ViewStyle = {
    height: HEIGHTS[size],
    minWidth: size === "icon" ? HEIGHTS[size] : 64,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: size === "icon" ? 0 : 16,
    backgroundColor:
      variant === "primary"
        ? tokens.base.black.srgb
        : variant === "tonal"
          ? tokens.palettes.neutral["200"].srgb
          : "transparent",
    opacity: disabled ? 0.5 : 1,
  };
  const label: TextStyle = {
    fontSize: size === "sm" ? 13 : 14,
    fontWeight: "500",
    color:
      variant === "primary"
        ? tokens.base.white.srgb
        : tokens.palettes.neutral["800"].srgb,
  };
  return { container, label };
}

export type NativeButtonProps = Omit<PressableProps, "style" | "children"> & {
  variant?: NativeButtonVariant;
  size?: NativeButtonSize;
  label: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function Button({
  variant = "primary",
  size = "default",
  label,
  style,
  labelStyle,
  disabled,
  testID,
  ...props
}: NativeButtonProps) {
  const styles = buttonStyles(variant, size, Boolean(disabled));
  return (
    <Pressable
      testID={testID ?? "kern-button"}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      style={[styles.container, style]}
      {...props}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </Pressable>
  );
}
