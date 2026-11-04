import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { LinearProgress } from "./linear-progress";
import { LoadingIndicator } from "./loading-indicator";
import { Skeleton } from "./skeleton";

/**
 * KernLoading — native twin of the web `KernLoading` (D951 WP1b, CL-011).
 * Same four kinds on the same contract (`kind/label/count/value`),
 * composing the native primitives: `Skeleton` rows, `LoadingIndicator`
 * (spinner), `LinearProgress` (determinate bar, `wavy` waveform, or the
 * indeterminate loop), and the shimmer-card composition.
 *
 * a11y mirrors web: skeleton compositions are decorative rows inside one
 * announced `status` region; the spinner/progress primitives carry their
 * own names.
 */

export type KernLoadingKind =
  | "skeleton-list"
  | "spinner"
  | "progress"
  | "shimmer-card";

export type NativeKernLoadingProps = Omit<ViewProps, "children" | "style"> & {
  kind?: KernLoadingKind;
  label?: string;
  count?: number;
  value?: number | null;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function KernLoading({
  kind = "spinner",
  label = "Loading",
  count = 3,
  value = null,
  style,
  testID,
  ...props
}: NativeKernLoadingProps) {
  const scheme = useKernScheme();

  if (kind === "spinner") {
    return (
      <View {...props} testID={testID ?? "kern-loading"} style={style}>
        <LoadingIndicator label={label} />
      </View>
    );
  }

  if (kind === "progress") {
    return (
      <View {...props} testID={testID ?? "kern-loading"} style={style}>
        <LinearProgress value={value} label={label} />
      </View>
    );
  }

  if (kind === "shimmer-card") {
    return (
      <View
        {...props}
        testID={testID ?? "kern-loading"}
        role="status"
        accessibilityLabel={label}
        style={[
          {
            gap: 12,
            borderRadius: Number.parseFloat(scheme.shape.medium),
            borderWidth: 1,
            borderColor: scheme.color.outlineVariant,
            backgroundColor: scheme.color.surface,
            padding: 16,
          },
          style,
        ]}
      >
        <Skeleton style={{ height: 20, width: "66%" }} />
        <Skeleton style={{ height: 16, width: "100%" }} />
        <Skeleton style={{ height: 16, width: "83%" }} />
        <View style={{ flexDirection: "row", gap: 8, paddingTop: 4 }}>
          <Skeleton
            style={{
              height: 32,
              width: 80,
              borderRadius: Number.parseFloat(scheme.shape.full),
            }}
          />
          <Skeleton
            style={{
              height: 32,
              width: 80,
              borderRadius: Number.parseFloat(scheme.shape.full),
            }}
          />
        </View>
      </View>
    );
  }

  // skeleton-list
  return (
    <View
      {...props}
      testID={testID ?? "kern-loading"}
      role="status"
      accessibilityLabel={label}
      style={[{ gap: 8 }, style]}
    >
      {Array.from({ length: Math.max(1, count) }, (_, index) => (
        <Skeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholder rows are identical and never reorder.
          key={index}
          style={{
            height: 48,
            width: "100%",
            borderRadius: Number.parseFloat(scheme.shape.small),
          }}
        />
      ))}
    </View>
  );
}
