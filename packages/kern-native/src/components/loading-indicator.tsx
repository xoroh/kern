import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Text as RNText,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

/**
 * M3 Loading indicator — indeterminate activity feedback.
 *
 * This is the component M3's "Loading indicator" names. It replaces the
 * *indeterminate* case of the circular-progress pattern rather than sitting
 * beside it; `CircularProgress` remains for the DETERMINATE case, which is a
 * different question the user asks.
 *
 * ## The behaviour this owns
 *
 * - **`role="status"` + a polite live region.** A spinner with only a visual
 *   label tells a screen reader nothing. `status` is what makes "Loading" be
 *   announced when the indicator appears, without interrupting whatever is being
 *   read. This is the native counterpart of the web's `role="status"`.
 * - **An accessible name is mandatory.** It comes from `label`. Kern will not
 *   render an unnamed spinner, because an unnamed spinner is announced as
 *   nothing at all.
 * - **No numeric value.** Indeterminate means there is no reading to report, so
 *   this publishes no `accessibilityValue` at all. See the note on
 *   CircularProgress below — announcing `progressbar` with no `now` is worse
 *   than announcing nothing, because it claims a quantity it does not have.
 * - **The spinner itself is hidden from assistive tech.** It carries no
 *   information; the status region carries the information. A visible-but-
 *   unnamed spinning element is noise in the accessibility tree.
 * - **Reduced motion stops the rotation, not the element.** The ring stays
 *   rendered. "The feedback does not move" is the correct outcome;
 *   "the feedback disappeared" is worse than either.
 * - **No `delay`/`showAfter`.** Suppressing a spinner for N ms hides the pending
 *   state from exactly the users on slow connections. Hosts that want a delay
 *   compose it around the region.
 *
 * ## Relationship to CircularProgress
 *
 * `CircularProgress` with a `value` is determinate and announces a percentage as
 * a `progressbar`. `CircularProgress` WITHOUT a `value` is indeterminate — and
 * this component is the one that should be used for that, because an
 * indeterminate bar is a *status*, not a measurement. The two are different
 * questions: "is this still happening" versus "how far along is it".
 *
 * ## `aria-busy` belongs to the region, not here
 *
 * The web places `aria-busy` on the region being loaded. The indicator cannot do
 * that — it is a descendant, not an ancestor of the content. Hosts set
 * `accessibilityState={{ busy: true }}` on the region they wrap; this component
 * deliberately does not try to reach outward and do it for them.
 */

export type LoadingIndicatorSize = "sm" | "default" | "lg";

export function loadingIndicatorStyles(
  size: LoadingIndicatorSize = "default",
  scheme: ResolvedTheme = resolveThemeDetails(),
): { ring: ViewStyle } {
  const diameter =
    size === "sm"
      ? 16
      : size === "lg"
        ? 40
        : Number.parseFloat(tokens.spacing["space-300"]);
  const borderWidth = size === "lg" ? 4 : 2;
  return {
    ring: {
      width: diameter,
      height: diameter,
      borderRadius: diameter / 2,
      borderWidth,
      borderColor: scheme.color.primary,
      // The gap the "spin" is perceived through. Static under reduced motion —
      // the ring still reads as incomplete, it just stops turning.
      borderTopColor: "transparent",
      borderRightColor: "transparent",
    },
  };
}

function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((enabled) => {
        if (mounted) setReduce(Boolean(enabled));
      })
      .catch(() => {
        // Unavailable is not reduced-motion: keep the animation.
      });
    return () => {
      mounted = false;
    };
  }, []);
  return reduce;
}

export type LoadingIndicatorProps = Omit<ViewProps, "children" | "style"> & {
  /** Accessible name. Also the visible text when `showLabel`. */
  label?: string;
  size?: LoadingIndicatorSize;
  /** Renders `label` as visible text beside the ring. */
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function LoadingIndicator({
  label = "Loading",
  size = "default",
  showLabel = false,
  style,
  testID,
  ...props
}: LoadingIndicatorProps) {
  const scheme = useKernScheme();
  const reduceMotion = useReduceMotion();
  const styles = loadingIndicatorStyles(size, scheme);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reduced motion means "do not move this", not "show nothing": the ring is
    // still rendered, it simply does not rotate.
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, spin]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      {...props}
      testID={testID ?? "kern-loading-indicator"}
      // `role`, not `accessibilityRole`: the ARIA-aligned Role union carries
      // `status`; the platform-trait union is not the vocabulary M3 speaks.
      role="status"
      // Polite: announce the pending state without cutting off what is being
      // read. `assertive` here would be actively hostile.
      accessibilityLiveRegion="polite"
      // When the label is VISIBLE it is already the accessible name, so naming
      // the region again would duplicate it. Mirrors the web, which omits
      // aria-label in exactly this case.
      accessibilityLabel={showLabel ? undefined : label}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: Number.parseFloat(tokens.spacing["space-100"]),
        },
        style,
      ]}
    >
      {/* The ring carries no information the status region does not already
          carry, so it is removed from the accessibility tree entirely. */}
      <Animated.View
        testID={`${testID ?? "kern-loading-indicator"}-ring`}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.ring, { transform: [{ rotate: rotation }] }]}
      />
      {showLabel ? (
        <RNText style={{ fontSize: 14, color: scheme.color.onSurface }}>
          {label}
        </RNText>
      ) : null}
    </View>
  );
}
