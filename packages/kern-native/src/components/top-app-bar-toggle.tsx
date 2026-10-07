import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { useKernTheme } from "../theme";
import { Text } from "./text";

export type NativeTopAppBarToggleProps = {
  open: boolean;
  onToggle: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Native `TopAppBarToggle` — the leading button that opens/closes the
 * shell's rail or drawer.
 *
 * Mirrors web `TopAppBarToggle` in `packages/kern/src/start/top-app-bar.tsx`:
 * the accessible name says what the press DOES ("Open navigation" while
 * closed), and `accessibilityState.expanded` carries the open state so a
 * screen reader announces it without relying on the name alone. A 48dp
 * touch target; the glyph is decorative.
 */
export function TopAppBarToggle({
  open,
  onToggle,
  disabled,
  style,
  testID,
}: NativeTopAppBarToggleProps) {
  const { scheme } = useKernTheme();
  return (
    <Pressable
      testID={testID ?? "kern-top-app-bar-toggle"}
      accessible
      accessibilityRole="button"
      accessibilityLabel={open ? "Close navigation" : "Open navigation"}
      accessibilityState={{ expanded: open, disabled: disabled ?? false }}
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
        ☰
      </Text>
    </Pressable>
  );
}
