import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { useKernTheme } from "../theme";
import { Text } from "./text";

export type NativeThemeToggleProps = {
  mode: "light" | "dark";
  onToggle: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Native `ThemeToggle` — toggles light/dark; the host owns the mode state.
 *
 * Mirrors web `ThemeToggle` in `packages/kern/src/start/blocks.tsx`: the
 * accessible name says where the press GOES ("Switch to light" while dark),
 * never where it is. A 48dp touch target per the platform minimum; the glyph
 * is decorative and hidden from the tree.
 */
export function ThemeToggle({
  mode,
  onToggle,
  disabled,
  style,
  testID,
}: NativeThemeToggleProps) {
  const { scheme } = useKernTheme();
  const label = mode === "dark" ? "Switch to light" : "Switch to dark";
  return (
    <Pressable
      testID={testID ?? "kern-theme-toggle"}
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled ?? false }}
      disabled={disabled}
      onPress={onToggle}
      style={[
        {
          width: 48,
          height: 48,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 24,
          backgroundColor: "transparent",
          opacity: disabled ? 0.38 : 1,
        },
        style,
      ]}
    >
      <Text
        variant="title"
        accessible={false}
        style={{ color: scheme.color.onSurface }}
      >
        {mode === "dark" ? "☾" : "☀"}
      </Text>
    </Pressable>
  );
}
