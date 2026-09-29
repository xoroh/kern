import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

export function progressStyles(
  ratio: number,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { track: ViewStyle; fill: ViewStyle } {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return {
    track: {
      height: 4,
      borderRadius: 2,
      backgroundColor: scheme.color.surfaceTonal,
      overflow: "hidden",
    },
    fill: {
      height: 4,
      width: `${clamped * 100}%`,
      borderRadius: 2,
      backgroundColor: scheme.color.primary,
    },
  };
}

export type NativeProgressProps = Omit<ViewProps, "children" | "style"> & {
  value?: number;
  max?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Progress({
  value,
  max = 100,
  accessibilityLabel = "Progress",
  style,
  testID,
  ...props
}: NativeProgressProps) {
  const scheme = useKernScheme();
  const ratio = value === undefined ? 0 : value / max;
  const styles = progressStyles(value === undefined ? 0 : ratio, scheme);
  return (
    <View
      {...props}
      testID={testID ?? "kern-progress"}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={
        value === undefined ? { text: "Loading" } : { now: value, min: 0, max }
      }
      style={style}
    >
      <View style={styles.track}>
        <View style={styles.fill} />
      </View>
    </View>
  );
}
