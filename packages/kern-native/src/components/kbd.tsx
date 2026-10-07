import type { StyleProp, TextStyle } from "react-native";
import { useKernTheme } from "../theme";
import { Text } from "./text";

export type NativeKbdProps = {
  children: string;
  accessibilityLabel?: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
};

/**
 * Native `Kbd` — a keyboard-shortcut hint.
 *
 * Web renders `<kbd>` with a monospace face, an outline-variant border and a
 * tonal fill. There is no kbd element on this platform, so the behaviour is
 * the text itself: a single non-wrapping label in a monospace face, exposed
 * on the accessibility tree as static text. Chords are composed by the caller
 * with a space between `Kbd` parts, the same contract as web.
 */
export function Kbd({
  children,
  accessibilityLabel,
  style,
  testID,
}: NativeKbdProps) {
  const { scheme } = useKernTheme();
  return (
    <Text
      testID={testID ?? "kern-kbd"}
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityRole="text"
      numberOfLines={1}
      variant="label"
      style={[
        {
          fontFamily: "monospace",
          borderWidth: 1,
          borderColor: scheme.color.outlineVariant,
          backgroundColor: scheme.color.surfaceContainerHigh,
          color: scheme.color.onSurface,
          borderRadius: 4,
          paddingHorizontal: 6,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
