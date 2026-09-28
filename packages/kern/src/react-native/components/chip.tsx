import {
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";

export type NativeChipVariant = "assist" | "filter" | "suggestion";

export function chipStyles(
  variant: NativeChipVariant,
  selected: boolean,
): { container: ViewStyle; label: TextStyle } {
  const container: ViewStyle = {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      variant === "suggestion"
        ? tokens.base.white.srgb
        : selected
          ? tokens.base.black.srgb
          : tokens.palettes.neutral["200"].srgb,
    ...(variant === "suggestion"
      ? { borderWidth: 1, borderColor: tokens.palettes.neutral["300"].srgb }
      : null),
  };
  const label: TextStyle = {
    fontSize: 12,
    fontWeight: "500",
    color: selected
      ? tokens.base.white.srgb
      : tokens.palettes.neutral["800"].srgb,
  };
  return { container, label };
}

export type NativeChipProps = Omit<PressableProps, "children"> & {
  variant?: NativeChipVariant;
  selected?: boolean;
  label: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function Chip({
  variant = "assist",
  selected = false,
  label,
  style,
  labelStyle,
  testID,
  ...props
}: NativeChipProps) {
  const styles = chipStyles(variant, selected);
  return (
    <Pressable
      testID={testID ?? "kern-chip"}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.container, style]}
      {...props}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </Pressable>
  );
}
