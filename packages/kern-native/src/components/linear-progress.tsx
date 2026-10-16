import type { ResolvedTheme } from "@xoroh/kern-tokens";
import { useEffect, useId, useRef } from "react";
import {
  Animated,
  Easing,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Defs, Path, Pattern, Rect, Svg } from "react-native-svg";
import { defaultScheme, useKernMotion, useKernScheme } from "../theme";

export type LinearProgressProps = Omit<ViewProps, "children" | "style"> & {
  /**
   * 0–1 determinate progress. Ignored when `indeterminate` is set.
   */
  value?: number;
  /**
   * Looping motion with no endpoint for unknown durations. Per M3 the two
   * bars slide on a 2s linear cycle.
   */
  indeterminate?: boolean;
  /**
   * Cycle the indeterminate bars through primary → primary-container →
   * tertiary → tertiary-container instead of holding primary.
   */
  fourColor?: boolean;
  /**
   * 0–1 buffer level rendered behind the bar: known progress in the bar,
   * unknown progress in the buffer. Determinate only.
   */
  buffer?: number;
  /**
   * M3 expressive wavy indicator (determinate only): a sine wave at the
   * platform wave geometry — 3dp amplitude, 40dp wavelength. Indeterminate
   * ignores it; the loops have no wave phase.
   */
  wavy?: boolean;
  /**
   * M3 stop indicator: a 4dp primary circle marking the end of the track.
   * Determinate only.
   */
  stop?: boolean;
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
  scheme: ResolvedTheme = defaultScheme,
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
 * LINEAR_WAVE_GEOMETRY — the platform wave geometry shared with web
 * (`M0 6 Q 10 0 20 6 T 40 6` in a 40x12 viewBox): 3dp amplitude over a
 * 40dp wavelength, drawn with a 4px stroke. The 12dp wave height is
 * clipped by the 4dp track, exactly like the web's `h-3` svg in the `h-1`
 * track.
 */
export const LINEAR_WAVE_GEOMETRY = {
  amplitudeDp: 3,
  wavelengthDp: 40,
  viewBox: "0 0 40 12",
  path: "M0 6 Q 10 0 20 6 T 40 6",
  strokeWidth: 4,
  waveHeight: 12,
} as const;

/** 2s linear cycle per M3 (`kern-linear-indeterminate*` on web). */
export const LINEAR_INDETERMINATE_DURATION_MS = 2000;

/** 8s color cycle per M3 (`kern-linear-four-color` on web). */
export const LINEAR_FOUR_COLOR_DURATION_MS = 8000;

/**
 * LINEAR_INDETERMINATE_BARS — the two indeterminate bars. Web drives them
 * with `translateX` (% of the bar's own width) plus `scaleX`; native
 * transforms take dp, not percentages, so the same three keyframe stops
 * are expressed as `left` (% of the track) plus a fixed `width` (the
 * web `scaleX` fraction of the full-width bar):
 *
 * - bar 0: `translateX(-100%/35%/240%) scaleX(0.45)` → left −100/35/240%,
 *   width 45% (`kern-linear-indeterminate`).
 * - bar 1: `translateX(-150%/0%/200%) scaleX(0.3)` → left −150/0/200%,
 *   width 30% (`kern-linear-indeterminate-secondary`).
 */
export const LINEAR_INDETERMINATE_BARS = [
  {
    width: "45%",
    inputRange: [0, 0.5, 1],
    leftRange: ["-100%", "35%", "240%"],
  },
  {
    width: "30%",
    inputRange: [0, 0.5, 1],
    leftRange: ["-150%", "0%", "200%"],
  },
] as const;

/** Stops of the 8s four-color cycle, in web keyframe order. */
export const LINEAR_FOUR_COLOR_INPUT_RANGE = [0, 0.25, 0.5, 0.75, 1] as const;

/**
 * linearFourColorStops — primary → primary-container → tertiary →
 * tertiary-container, the web `kern-linear-four-color` keyframe order.
 * Native blends linearly between stops; web steps discretely.
 */
export function linearFourColorStops(
  scheme: ResolvedTheme = defaultScheme,
): [string, string, string, string] {
  return [
    scheme.color.primary,
    scheme.color.primaryContainer,
    scheme.color.tertiary,
    scheme.color.tertiaryContainer,
  ];
}

/**
 * linearBufferStyles — the buffer wash behind the bar: primary at 24%,
 * matching the web's `bg-primary/24` buffer layer.
 */
export function linearBufferStyles(
  buffer: number,
  scheme: ResolvedTheme = defaultScheme,
): { buffer: ViewStyle } {
  const clamped = clamp01(buffer);
  return {
    buffer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: `${clamped * 100}%`,
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: scheme.color.primary,
      opacity: 0.24,
    },
  };
}

function IndeterminateBars({
  fourColor,
  scheme,
}: {
  fourColor: boolean;
  scheme: ResolvedTheme;
}) {
  const slide = useRef(new Animated.Value(0)).current;
  const cycle = useRef(new Animated.Value(0)).current;
  const { suppressSpatial } = useKernMotion();

  useEffect(() => {
    // Reduced motion means "do not move this", not "show nothing": the
    // bars stay rendered, they simply hold their mid-cycle positions.
    if (suppressSpatial) return;
    const loop = Animated.loop(
      Animated.timing(slide, {
        toValue: 1,
        duration: LINEAR_INDETERMINATE_DURATION_MS,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [slide, suppressSpatial]);

  useEffect(() => {
    if (!fourColor || suppressSpatial) return;
    const loop = Animated.loop(
      Animated.timing(cycle, {
        toValue: 1,
        duration: LINEAR_FOUR_COLOR_DURATION_MS,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [cycle, fourColor, suppressSpatial]);

  const stops = linearFourColorStops(scheme);
  const animatedColor =
    fourColor && !suppressSpatial
      ? cycle.interpolate({
          inputRange: [...LINEAR_FOUR_COLOR_INPUT_RANGE],
          outputRange: [...stops, stops[0]],
        })
      : scheme.color.primary;
  // Data mapping only (no hooks, no JSX): the two bars render explicitly
  // below, so neither needs an array-index key.
  const lefts = LINEAR_INDETERMINATE_BARS.map((bar) =>
    suppressSpatial
      ? bar.leftRange[1]
      : slide.interpolate({
          inputRange: [...bar.inputRange],
          outputRange: [...bar.leftRange],
        }),
  );

  return (
    <>
      <IndeterminateBar
        testID="kern-linear-progress-indicator"
        width={LINEAR_INDETERMINATE_BARS[0].width}
        left={lefts[0]}
        backgroundColor={animatedColor}
        scheme={scheme}
      />
      <IndeterminateBar
        testID="kern-linear-progress-indicator-secondary"
        width={LINEAR_INDETERMINATE_BARS[1].width}
        left={lefts[1]}
        backgroundColor={animatedColor}
        scheme={scheme}
      />
    </>
  );
}

function IndeterminateBar({
  testID,
  width,
  left,
  backgroundColor,
  scheme,
}: {
  testID: string;
  width: string;
  left: string | Animated.AnimatedInterpolation<string>;
  backgroundColor: string | Animated.AnimatedInterpolation<string>;
  scheme: ResolvedTheme;
}) {
  return (
    <Animated.View
      testID={testID}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width,
        borderRadius: Number.parseFloat(scheme.shape.full),
        backgroundColor,
        left,
      }}
    />
  );
}

function WavyIndicator({ ratio, color }: { ratio: number; color: string }) {
  // Pattern ids must be document-unique and URL-safe (`useId` emits colons).
  const patternId = `kern-wave-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <View
      style={{
        width: `${ratio * 100}%`,
        height: LINEAR_WAVE_GEOMETRY.waveHeight,
        overflow: "hidden",
      }}
    >
      <Svg
        testID="kern-linear-progress-wave"
        viewBox={LINEAR_WAVE_GEOMETRY.viewBox}
        preserveAspectRatio="none"
        width="100%"
        height={LINEAR_WAVE_GEOMETRY.waveHeight}
      >
        <Defs>
          <Pattern
            id={patternId}
            width={LINEAR_WAVE_GEOMETRY.wavelengthDp}
            height={LINEAR_WAVE_GEOMETRY.waveHeight}
            patternUnits="userSpaceOnUse"
          >
            <Path
              testID="kern-linear-progress-wave-path"
              d={LINEAR_WAVE_GEOMETRY.path}
              fill="none"
              stroke={color}
              strokeWidth={LINEAR_WAVE_GEOMETRY.strokeWidth}
              strokeLinecap="round"
            />
          </Pattern>
        </Defs>
        <Rect
          x={0}
          y={0}
          width="100%"
          height={LINEAR_WAVE_GEOMETRY.waveHeight}
          fill={`url(#${patternId})`}
        />
      </Svg>
    </View>
  );
}

/**
 * LinearProgress — M3 linear progress. Determinate by value (bar, wavy, or
 * buffer), indeterminate by loop, four-color by cycle. Width transitions
 * stay inside Kern's 200ms utility cap on the web projection.
 */
export function LinearProgress({
  value = 0,
  indeterminate = false,
  fourColor = false,
  buffer,
  wavy = false,
  label = "Progress",
  stop = false,
  style,
  testID,
  ...props
}: LinearProgressProps) {
  const scheme = useKernScheme();
  const ratio = clamp01(value);
  const buffered = buffer === undefined ? null : clamp01(buffer);
  const styles = linearProgressStyles(ratio, scheme);
  const bufferStyles =
    buffered === null ? null : linearBufferStyles(buffered, scheme);
  return (
    <View
      {...props}
      testID={testID ?? "kern-linear-progress"}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={
        indeterminate
          ? undefined
          : { now: Math.round(ratio * 100), min: 0, max: 100 }
      }
      style={[styles.track, style]}
    >
      {buffered !== null && !indeterminate && bufferStyles ? (
        <View
          testID="kern-linear-progress-buffer"
          style={bufferStyles.buffer}
        />
      ) : null}
      {indeterminate ? (
        <IndeterminateBars fourColor={fourColor} scheme={scheme} />
      ) : wavy ? (
        <WavyIndicator ratio={ratio} color={scheme.color.primary} />
      ) : (
        <View testID="kern-linear-progress-indicator" style={styles.fill} />
      )}
      {stop && !indeterminate ? (
        <View
          testID="kern-linear-progress-stop"
          style={{
            position: "absolute",
            right: -2,
            top: 0,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: scheme.color.primary,
          }}
        />
      ) : null}
    </View>
  );
}
