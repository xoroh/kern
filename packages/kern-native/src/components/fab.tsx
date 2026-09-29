import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import type { ReactNode } from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

export type NativeFabVariant = "primary" | "tonal";
export type NativeFabSize = "default" | "small" | "icon";

export function fabStyles(
  variant: NativeFabVariant,
  size: NativeFabSize,
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  const dimension = size === "small" ? 40 : 56;
  return {
    minHeight: dimension,
    minWidth: size === "icon" ? dimension : 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: Number.parseFloat(scheme.shape.large),
    paddingHorizontal: size === "icon" ? 0 : 20,
    backgroundColor:
      variant === "primary" ? scheme.color.primary : scheme.color.surfaceTonal,
    elevation: 3,
    shadowColor: scheme.color.scrim,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  };
}

export type NativeFabProps = Omit<
  PressableProps,
  "children" | "style" | "onPress"
> & {
  children: ReactNode;
  label?: string;
  variant?: NativeFabVariant;
  size?: NativeFabSize;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
};

export function Fab({
  children,
  label,
  variant = "primary",
  size = "default",
  onPress,
  disabled = false,
  hitSlop,
  style,
  testID,
  ...props
}: NativeFabProps) {
  const scheme = useKernScheme();
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-fab"}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={hitSlop ?? { top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={onPress}
      style={({ pressed }) => [
        fabStyles(variant, size, scheme),
        { opacity: disabled ? 0.5 : pressed ? 0.9 : 1 },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <Text
        variant="label"
        style={
          variant === "primary" ? { color: scheme.color.onPrimary } : undefined
        }
      >
        {children}
      </Text>
    </Pressable>
  );
}
