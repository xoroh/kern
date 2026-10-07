import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { useKernTheme } from "../theme";
import { Text } from "./text";

export type NativeContrastToggleProps = {
  contrast: "standard" | "high";
  onToggle: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Native `ContrastToggle` — toggles standard/high contrast; the host owns
 * the contrast state.
 *
 * Mirrors web `ContrastToggle` in `packages/kern/src/start/blocks.tsx`: the
 * accessible name says where the press GOES ("Use high contrast" while
 * standard), never where it is. A 48dp touch target; the "Aa" glyph is
 * decorative and hidden from the tree.
 */
export function ContrastToggle({
  contrast,
  onToggle,
  disabled,
  style,
  testID,
}: NativeContrastToggleProps) {
  const { scheme } = useKernTheme();
  const label =
    contrast === "high" ? "Use standard contrast" : "Use high contrast";
  return (
    <Pressable
      testID={testID ?? "kern-contrast-toggle"}
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
        Aa
      </Text>
    </Pressable>
  );
}
