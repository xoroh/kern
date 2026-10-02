import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Text as RNText,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

/**
 * M3 Meter — a static scalar display: storage used, battery level.
 *
 * ## Why this is not `Progress`
 *
 * Both are a bar with a value, and both expose `min`/`max`/`now` to assistive
 * tech. They differ in MEANING, and M3 names them separately:
 *
 *   Meter    a static scalar in a range. "3.2 GB of 8 GB used".
 *   Progress the completion of a TASK. "Uploading… 40%".
 *
 * That difference is why this is a separate component rather than a `kind` prop
 * on `Progress`: a consumer picking the wrong one is describing the wrong thing
 * to a screen-reader user, and the M3 naming is what keeps them apart.
 *
 * ## Why `role`, not `accessibilityRole`
 *
 * RN's platform-trait `AccessibilityRole` union has `progressbar` but NOT
 * `meter`; the ARIA-aligned `Role` union (the `role` prop) has both. So this sets
 * `role="meter"`, exactly as `drawer.tsx` documents for `role="dialog"`. Passing
 * `accessibilityRole="meter"` would not compile — and a prop value that does not
 * exist in the union is a type error or a silently ignored prop, never a styling
 * choice.
 *
 * ## Determinate vs indeterminate
 *
 * Passing no `value` is INDETERMINATE: there is no number to report, so no `now`
 * is announced — mirroring what the web implementation documents about
 * `aria-valuenow`. A meter with no reading is not a meter reading zero, and
 * announcing `0 of 100` for an unknown value is a lie.
 */

export function meterStyles(
  ratio: number,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { track: ViewStyle; indicator: ViewStyle } {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return {
    track: {
      height: 8,
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: scheme.color.surfaceTonal,
      overflow: "hidden",
    },
    indicator: {
      height: "100%",
      width: `${clamped * 100}%`,
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: scheme.color.secondary,
    },
  };
}

export type NativeMeterProps = Omit<ViewProps, "children" | "style"> & {
  /** The reading. Omit for an indeterminate meter. */
  value?: number;
  min?: number;
  max?: number;
  /**
   * Formatted reading announced instead of the bare number — "3.2 GB of 8 GB".
   * Falls back to `${value}`.
   */
  valueText?: string;
  /** Accessible name. M3 pairs a meter with a label. */
  accessibilityLabel?: string;
  /** Optional visible label and value row above the bar. */
  label?: ReactNode;
  showValue?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Meter({
  value,
  min = 0,
  max = 100,
  valueText,
  accessibilityLabel,
  label,
  showValue = false,
  style,
  testID,
  ...props
}: NativeMeterProps) {
  const scheme = useKernScheme();
  const indeterminate = value === undefined;
  // Clamp against the real range, and guard a zero-width range so the indicator
  // cannot divide by zero.
  const span = max - min;
  const ratio = indeterminate || span <= 0 ? 0 : (value - min) / span;
  const styles = meterStyles(ratio, scheme);
  const text = valueText ?? (indeterminate ? undefined : String(value));

  return (
    <View {...props} testID={testID ?? "kern-meter"} style={style}>
      {label || showValue ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: Number.parseFloat(tokens.spacing["space-50"]),
          }}
        >
          {label ? (
            <RNText
              style={{ fontSize: 12, color: scheme.color.onSurfaceVariant }}
            >
              {label}
            </RNText>
          ) : (
            <View />
          )}
          {showValue && text !== undefined ? (
            <RNText
              style={{ fontSize: 12, color: scheme.color.onSurfaceVariant }}
            >
              {text}
            </RNText>
          ) : null}
        </View>
      ) : null}

      <View
        // `role`, not `accessibilityRole` — see the header. RN's ARIA-aligned
        // Role union is the only one carrying `meter`.
        role="meter"
        accessibilityLabel={accessibilityLabel}
        // Indeterminate announces NO `now`: there is no reading to report.
        accessibilityValue={
          indeterminate ? undefined : { now: value, min, max, text }
        }
        style={styles.track}
      >
        <View style={styles.indicator} />
      </View>
    </View>
  );
}
