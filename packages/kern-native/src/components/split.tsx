import { Children, isValidElement, type ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";

/** Width of the hairline between columns. Matches web's `gap-px`. */
export const SPLIT_GAP = 1;

export type NativeSplitProps = {
  /** Two or three equal columns. Matches the web `Split`'s `2 | 3`. */
  columns?: 2 | 3;
  accessibilityLabel?: string;
  children?: ReactNode;
  style?: ViewStyle;
  testID?: string;
};

/**
 * An N-column split layout: the last genuine gap in the composition tranche.
 *
 * Native had `Pane` (one region) and `ListDetail` (a FIXED navigation / list /
 * detail arrangement), so nothing could split an arbitrary column count.
 *
 * The dividers are drawn the same way web draws them — a hairline GAP over an
 * outline-variant CONTAINER background, so the background shows through. Putting
 * `borderRightWidth` on each child instead would look plausible and be wrong
 * twice: the first column would get a leading border and the last a trailing
 * one, at every column count.
 */
export function Split({
  columns = 2,
  accessibilityLabel = "Split",
  children,
  style,
  testID,
}: NativeSplitProps) {
  const scheme = useKernScheme();
  const items = Children.toArray(children);
  // `columns` is a hint, not a promise: render what the caller actually passed
  // rather than padding or truncating to match a declared number.
  void columns;

  return (
    <View
      testID={testID ?? "kern-split"}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          flex: 1,
          flexDirection: "row",
          // The container's background IS the divider colour; the gap lets it
          // show through between children. See the note above.
          backgroundColor: scheme.color.outlineVariant,
          gap: SPLIT_GAP,
        },
        style,
      ]}
    >
      {items.map((child, i) => (
        <View
          key={isValidElement(child) && child.key != null ? child.key : i}
          // Each column is individually addressable. Two of the five mutations
          // below target the COLUMN style, and a suite that only ever reads the
          // container cannot see them -- so the columns carry their own testIDs
          // and the assertions look there.
          testID={`${testID ?? "kern-split"}-column-${i}`}
          // `flex: 1` with `minWidth: 0` is the native equivalent of web's
          // `minmax(0, 1fr)`: equal share, but a long child may still shrink
          // below its content instead of pushing a sibling off screen.
          style={{ flex: 1, minWidth: 0, backgroundColor: scheme.color.surface }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
