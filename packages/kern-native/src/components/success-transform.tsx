import {
  FEEDBACK_SIZE_DP,
  type FeedbackSize,
  feedbackTiming,
} from "@xoroh/kern-m3";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { CircularProgress } from "./circular-progress";

export type SuccessState = "loading" | "success";

export type SuccessTransformProps = Omit<ViewProps, "children" | "style"> & {
  state: SuccessState;
  size?: FeedbackSize;
  color?: string;
  successColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * successTransformStyles — the completion check: success disc and the
 * tick drawn with the border trick. Radii come from the shape scale.
 */
export function successTransformStyles(
  size: FeedbackSize,
  success: string,
  scheme: ResolvedTheme = defaultScheme(),
): { check: ViewStyle; tick: ViewStyle } {
  const edge = FEEDBACK_SIZE_DP[size].shape * 1.6;
  return {
    check: {
      width: edge,
      height: edge,
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: success,
      alignItems: "center",
      justifyContent: "center",
    },
    tick: {
      width: edge * 0.32,
      height: edge * 0.18,
      borderLeftWidth: Math.max(3, edge * 0.09),
      borderBottomWidth: Math.max(3, edge * 0.09),
      borderColor: scheme.color.onSuccess,
      borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
      transform: [{ rotate: "-45deg" }, { translateY: -2 }],
    },
  };
}

/**
 * SuccessTransform — trio → check on completion.
 * Tightly scoped celebration for task-done / payment-sent / ticket-solved.
 * The one place a shape is allowed to become a glyph.
 *
 * WP9 Part E decision (2026-11-04, generic-vs-product): GENERIC, native-only.
 * The two states (`loading` | `success`) and the split wait/outcome colors
 * carry no product strings — the doc examples above are usage moments, not
 * coupled flows — and the render is generic M3 material only (loader style
 * from the shared spec, disc/tick radii from the shape scale, timing from
 * `feedbackTiming`). There is no `error` state by design: a failure is a
 * message, not a transform. No web twin: web composes the same moment from
 * `CircularProgress` at the app layer, and no in-repo caller needs a shared
 * twin. The site already records this as a NATIVE-ONLY export.
 */
export function SuccessTransform({
  state,
  size = "md",
  color,
  successColor,
  style,
  testID,
  ...props
}: SuccessTransformProps) {
  const scheme = useKernScheme();
  const ok = successColor ?? scheme.color.success;
  const styles = successTransformStyles(size, ok, scheme);
  const pop = useRef(new Animated.Value(0)).current;
  const succeeded = state === "success";

  useEffect(() => {
    if (!succeeded) {
      pop.setValue(0);
      return;
    }
    const timing = Animated.timing(pop, {
      toValue: 1,
      duration: feedbackTiming.fadeMs,
      easing: Easing.bezier(...feedbackTiming.easing),
      useNativeDriver: true,
    });
    timing.start();
    return () => timing.stop();
  }, [pop, succeeded]);

  if (!succeeded) {
    return (
      <View
        {...props}
        testID={testID ?? "kern-success-transform"}
        style={style}
      >
        <CircularProgress
          loaderStyle="shapes"
          size={size}
          label="Loading"
          color={color ?? scheme.color.onSurface}
        />
      </View>
    );
  }

  return (
    <Animated.View
      {...props}
      testID={testID ?? "kern-success-transform"}
      accessibilityRole="progressbar"
      accessibilityLabel="Done"
      accessibilityValue={{ text: "Done" }}
      style={[
        styles.check,
        {
          opacity: pop,
          transform: [
            {
              scale: pop.interpolate({
                inputRange: [0, 0.6, 1],
                outputRange: [0.5, 1.12, 1],
              }),
            },
          ],
        },
        style,
      ]}
    >
      <View testID="kern-success-transform-tick" style={styles.tick} />
    </Animated.View>
  );
}
