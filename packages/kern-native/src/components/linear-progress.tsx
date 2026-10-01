import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

export type LinearProgressProps = Omit<ViewProps, "children" | "style"> & {
  /**
   * 0–1. Determinate only.
   * @open Indeterminate linear motion is a tracked open item — M3 has the
   * role, the engine for its loop is not shipped yet.
   */
  value: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * linearProgressStyles — M3 linear progress, determinate. Track uses the
 * tonal surface role, the fill the primary role.
 */
export function linearProgressStyles(
  ratio: number,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { track: ViewStyle; fill: ViewStyle } {
  const clamped = clamp01(ratio);
  const radius = Number.parseFloat(scheme.shape.full);
  return {
    track: {
      height: 4,
      width: "100%",
      overflow: "hidden",
      borderRadius: radius,
      backgroundColor: scheme.color.surfaceTonal,
    },
    fill: {
      height: 4,
      width: `${clamped * 100}%`,
      borderRadius: radius,
      backgroundColor: scheme.color.primary,
    },
  };
}

/**
 * LinearProgress — M3 linear progress, determinate. Width transitions
 * stay inside Kern's 200ms utility cap on the web projection.
 */
export function LinearProgress({
  value,
  label = "Progress",
  style,
  testID,
  ...props
}: LinearProgressProps) {
  const scheme = useKernScheme();
  const ratio = clamp01(value);
  const styles = linearProgressStyles(ratio, scheme);
  return (
    <View
      {...props}
      testID={testID ?? "kern-linear-progress"}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ now: Math.round(ratio * 100), min: 0, max: 100 }}
      style={[styles.track, style]}
    >
      <View testID="kern-linear-progress-indicator" style={styles.fill} />
    </View>
  );
}
