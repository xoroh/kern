import { ProgressRoot as AxisProgressRoot } from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import {
  ActivityIndicator,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";

export type NativeLoaderSize = "small" | "large";

export function loaderColor(scheme: ResolvedTheme = defaultScheme()): string {
  return scheme.color.primary;
}

export type NativeLoaderProps = {
  size?: NativeLoaderSize;
  label?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * M3 loader — the spinner for an unmeasured wait, on Axis `ProgressRoot`.
 *
 * The open state is `value={null}` (Axis indeterminate): the part owns the
 * progressbar role and the busy state, while the spinner itself stays
 * Kern-styled (primary, two sizes) via `render`. A measurable amount is
 * `Progress`; this is the unmeasured wait.
 */
export function Loader({
  size = "large",
  label = "Loading",
  style,
  testID,
}: NativeLoaderProps) {
  const scheme = useKernScheme();
  return (
    <AxisProgressRoot
      value={null}
      accessibilityLabel={label}
      testID={testID ?? "kern-loader"}
      style={style}
      render={(slotProps: Record<string, unknown>) => (
        // Axis reports its indeterminate progress through its own slot prop;
        // Loader is always indeterminate (`value={null}`), so the busy state
        // is constant here and lands directly on the aria-* half of the pair.
        <View
          accessible={slotProps.accessible as boolean | undefined}
          accessibilityRole={
            slotProps.accessibilityRole as
              | React.ComponentProps<typeof View>["accessibilityRole"]
              | undefined
          }
          aria-busy
          accessibilityLabel={
            slotProps.accessibilityLabel as string | undefined
          }
          testID={slotProps.testID as string | undefined}
          style={slotProps.style as React.ComponentProps<typeof View>["style"]}
        >
          {/* Unlabeled: the host above carries the accessible name; naming
              the spinner too would announce the wait twice. */}
          <ActivityIndicator size={size} color={loaderColor(scheme)} />
        </View>
      )}
    />
  );
}
