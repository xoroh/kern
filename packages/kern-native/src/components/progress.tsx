import {
  ProgressRoot as AxisProgressRoot,
  ProgressIndicator,
  ProgressTrack,
} from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { defaultScheme, useKernScheme } from "../theme";

export function progressStyles(
  ratio: number,
  scheme: ResolvedTheme = defaultScheme(),
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

/**
 * M3 progress — the determinate bar, on Axis `ProgressRoot`.
 *
 * Determinate-only per the component contract (unknown waits use `Loader`):
 * an omitted `value` reads 0%, never indeterminate-busy. The part owns the
 * progressbar role, the clamped value and the min/max reading; the track
 * and fill stay Kern-styled via `style`/`barStyle`.
 */
export function Progress({
  value = 0,
  max = 100,
  accessibilityLabel = "Progress",
  style,
  testID,
  ...props
}: NativeProgressProps) {
  const scheme = useKernScheme();
  const styles = progressStyles(value / max, scheme);
  return (
    <AxisProgressRoot
      {...props}
      value={value}
      max={max}
      accessibilityLabel={accessibilityLabel}
      testID={testID ?? "kern-progress"}
      style={[styles.track, style]}
    >
      <ProgressTrack style={styles.track}>
        <ProgressIndicator style={styles.fill} />
      </ProgressTrack>
    </AxisProgressRoot>
  );
}
