import {
  FEEDBACK_SIZE_DP,
  type FeedbackShapeKind,
  type FeedbackSize,
  feedbackTiming,
  isLoadingStyleRendered,
  type LoadingIndicatorStyle,
  type ResolvedTheme,
  resolveFeedbackVariant,
  resolveThemeDetails,
} from "@xoroh/kern-theme";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Shape } from "./shape";

export type CircularProgressProps = Omit<ViewProps, "children" | "style"> & {
  /** 0–1. Omit for the indeterminate loading indicator. */
  value?: number;
  /**
   * Loading-indicator style for indeterminate waits. Determinate renders
   * the M3 circular arc regardless of style (known progress ⇒ determinate).
   * Reserved styles (`conveyor`, `contained`, `orbit`, `morph`, `assembly`)
   * are defined in the spec but not rendered yet — they throw.
   */
  loaderStyle?: LoadingIndicatorStyle;
  size?: FeedbackSize;
  /** Shapes for the `shapes` style. Defaults to the brand trio. */
  shapes?: readonly FeedbackShapeKind[];
  /** Tenant variant override; unknown ids fail loud. */
  tenantId?: string;
  label?: string;
  /** Fill override — the native stand-in for `currentColor`. */
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const BAR_WIDTH: Record<FeedbackSize, number> = { sm: 2, md: 4, lg: 6 };
const BAR_HEIGHTS = ["60%", "100%", "80%", "50%"] as const;
const DOT_SLOTS = ["dot-lead", "dot-mid", "dot-trail"] as const;
const LOOP_KINDS = ["hop", "pulse", "sweep", "spin"] as const;

type LoopKind = (typeof LOOP_KINDS)[number];

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * arcRotations — the two-half clipped-disc rotations (degrees) for a
 * determinate arc. `lead` sweeps the first 50% from twelve o'clock,
 * `trail` the rest; both sit at -180° while their half is empty.
 */
export function arcRotations(ratio: number): { lead: number; trail: number } {
  const clamped = clamp01(ratio);
  return {
    lead: Math.min(clamped, 0.5) * 360 - 180,
    trail: Math.max(clamped - 0.5, 0) * 360 - 180,
  };
}

/**
 * ringStyles — M3 circular ring metrics from `FEEDBACK_SIZE_DP`:
 * footprint, tonal track, progress arc and the spinning quarter arc.
 */
export function ringStyles(
  size: FeedbackSize,
  fill: string,
  scheme: ResolvedTheme = resolveThemeDetails(),
): {
  box: ViewStyle;
  track: ViewStyle;
  arc: ViewStyle;
  spinner: ViewStyle;
} {
  const edge = FEEDBACK_SIZE_DP[size].container;
  const stroke = edge / 10;
  const radius = Number.parseFloat(scheme.shape.full);
  return {
    box: { width: edge, height: edge },
    track: {
      position: "absolute",
      width: edge,
      height: edge,
      borderRadius: radius,
      borderWidth: stroke,
      borderColor: fill,
      opacity: 0.25,
    },
    arc: {
      width: edge,
      height: edge,
      borderRadius: radius,
      borderWidth: stroke,
      borderColor: fill,
    },
    spinner: {
      width: edge,
      height: edge,
      borderRadius: radius,
      borderWidth: stroke,
      borderColor: "transparent",
      borderTopColor: fill,
      borderRightColor: "transparent",
      borderBottomColor: "transparent",
      borderLeftColor: "transparent",
    },
  };
}

/**
 * barStyles — the `bar` loading style: four equalizer bars whose heights
 * and widths match the web metrics.
 */
export function barStyles(
  size: FeedbackSize,
  fill: string,
  scheme: ResolvedTheme = resolveThemeDetails(),
): {
  row: ViewStyle;
  bar: ViewStyle;
  bars: readonly ViewStyle[];
} {
  const edge = FEEDBACK_SIZE_DP[size].shape;
  const width = BAR_WIDTH[size];
  const radius = Number.parseFloat(scheme.shape.full);
  return {
    row: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 2,
      height: edge,
    },
    bar: {
      width,
      borderRadius: radius,
      backgroundColor: fill,
    },
    bars: BAR_HEIGHTS.map((height) => ({ height })),
  };
}

function useLoop(index: number, kind: LoopKind): Animated.Value {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const easing =
      kind === "spin" ? Easing.linear : Easing.bezier(...feedbackTiming.easing);
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: feedbackTiming.cycleMs,
        easing,
        useNativeDriver: true,
      }),
    );
    const phase = index * feedbackTiming.staggerMs;
    const anim =
      phase > 0 ? Animated.sequence([Animated.delay(phase), loop]) : loop;
    anim.start();
    return () => anim.stop();
  }, [index, kind, progress]);
  return progress;
}

function ArcHalf({
  side,
  rotation,
  edge,
  arc,
}: {
  side: "left" | "right";
  rotation: number;
  edge: number;
  arc: ViewStyle;
}) {
  const half = edge / 2;
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: half,
        overflow: "hidden",
        left: side === "left" ? 0 : undefined,
        right: side === "right" ? 0 : undefined,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: side === "left" ? 0 : -half,
          width: edge,
          height: edge,
          transform: [{ rotate: `${rotation}deg` }],
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            width: half,
            height: edge,
            overflow: "hidden",
            left: side === "left" ? 0 : undefined,
            right: side === "right" ? 0 : undefined,
          }}
        >
          <View
            testID="kern-circular-progress-arc"
            style={[
              arc,
              {
                position: "absolute",
                top: 0,
                left: side === "left" ? 0 : -half,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

function DeterminateArc({
  value,
  size,
  fill,
  scheme,
}: {
  value: number;
  size: FeedbackSize;
  fill: string;
  scheme: ResolvedTheme;
}) {
  const ratio = clamp01(value);
  const { lead, trail } = arcRotations(ratio);
  const edge = FEEDBACK_SIZE_DP[size].container;
  const ring = ringStyles(size, fill, scheme);
  return (
    <View style={ring.box}>
      <View testID="kern-circular-progress-track" style={ring.track} />
      <ArcHalf side="right" rotation={lead} edge={edge} arc={ring.arc} />
      <ArcHalf side="left" rotation={trail} edge={edge} arc={ring.arc} />
    </View>
  );
}

function SpinnerRing({
  size,
  fill,
  scheme,
}: {
  size: FeedbackSize;
  fill: string;
  scheme: ResolvedTheme;
}) {
  const progress = useLoop(0, "spin");
  const ring = ringStyles(size, fill, scheme);
  return (
    <Animated.View
      testID="kern-circular-progress-ring"
      style={[
        ring.spinner,
        {
          transform: [
            {
              rotate: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        },
      ]}
    />
  );
}

function Dots({
  size,
  fill,
  scheme,
}: {
  size: FeedbackSize;
  fill: string;
  scheme: ResolvedTheme;
}) {
  const edge = FEEDBACK_SIZE_DP[size].shape / 2;
  const gap = FEEDBACK_SIZE_DP[size].gap;
  const radius = Number.parseFloat(scheme.shape.full);
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap }}>
      {DOT_SLOTS.map((id, index) => (
        <Dot key={id} index={index} edge={edge} radius={radius} fill={fill} />
      ))}
    </View>
  );
}

function Dot({
  index,
  edge,
  radius,
  fill,
}: {
  index: number;
  edge: number;
  radius: number;
  fill: string;
}) {
  const progress = useLoop(index, "pulse");
  return (
    <Animated.View
      testID="kern-circular-progress-dot"
      style={{
        width: edge,
        height: edge,
        borderRadius: radius,
        backgroundColor: fill,
        opacity: progress.interpolate({
          inputRange: [0, 0.4, 0.8, 1],
          outputRange: [0.25, 1, 0.25, 0.25],
        }),
        transform: [
          {
            scale: progress.interpolate({
              inputRange: [0, 0.4, 0.8, 1],
              outputRange: [0.8, 1, 0.8, 0.8],
            }),
          },
        ],
      }}
    />
  );
}

function Equalizer({
  size,
  fill,
  scheme,
}: {
  size: FeedbackSize;
  fill: string;
  scheme: ResolvedTheme;
}) {
  const metrics = barStyles(size, fill, scheme);
  return (
    <View style={metrics.row}>
      {BAR_HEIGHTS.map((height, index) => (
        <Bar
          key={height}
          index={index}
          width={BAR_WIDTH[size]}
          style={[metrics.bar, metrics.bars[index]]}
        />
      ))}
    </View>
  );
}

function Bar({
  index,
  width,
  style,
}: {
  index: number;
  width: number;
  style: StyleProp<ViewStyle>;
}) {
  const progress = useLoop(index, "sweep");
  return (
    <Animated.View
      testID="kern-circular-progress-bar"
      style={[
        style,
        {
          transform: [
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-width, width * 4],
              }),
            },
          ],
        },
      ]}
    />
  );
}

function ShapeHop({
  list,
  size,
  fill,
}: {
  list: readonly FeedbackShapeKind[];
  size: FeedbackSize;
  fill: string;
}) {
  const edge = FEEDBACK_SIZE_DP[size].shape;
  const gap = FEEDBACK_SIZE_DP[size].gap;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap }}>
      {list.map((kind, index) => (
        <HopGlyph
          key={kind}
          kind={kind}
          index={index}
          edge={edge}
          fill={fill}
        />
      ))}
    </View>
  );
}

function HopGlyph({
  kind,
  index,
  edge,
  fill,
}: {
  kind: FeedbackShapeKind;
  index: number;
  edge: number;
  fill: string;
}) {
  const progress = useLoop(index, "hop");
  return (
    <Animated.View
      testID="kern-circular-progress-shape"
      style={{
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, -feedbackTiming.hopDp, 0],
            }),
          },
          {
            scale: progress.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 1.05, 1],
            }),
          },
        ],
      }}
    >
      <Shape kind={kind} size={edge} color={fill} />
    </Animated.View>
  );
}

/**
 * CircularProgress — M3 circular progress: determinate arc and the
 * indeterminate loading indicator. The loading indicator ships four styles
 * (`spinner`, `dots`, `bar`, `shapes`); `spinner` is the M3 ring, `shapes`
 * is the branded heritage trio.
 */
export function CircularProgress({
  value,
  loaderStyle,
  size = "md",
  shapes,
  tenantId,
  label = "Loading",
  color,
  style,
  testID,
  ...props
}: CircularProgressProps) {
  const scheme = useKernScheme();
  const variant = resolveFeedbackVariant(tenantId);
  const styleId =
    loaderStyle ?? (tenantId === undefined ? "spinner" : variant.style);
  const list = shapes ?? variant.shapes;
  if (!isLoadingStyleRendered(styleId)) {
    throw new Error(
      `CircularProgress: loading style "${styleId}" is reserved and not rendered yet`,
    );
  }
  const fill = color ?? scheme.color.onSurface;
  return (
    <View
      {...props}
      testID={testID ?? "kern-circular-progress"}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={
        value === undefined
          ? { text: label }
          : {
              now: Math.round(clamp01(value) * 100),
              min: 0,
              max: 100,
            }
      }
      style={style}
    >
      {value !== undefined ? (
        <DeterminateArc value={value} size={size} fill={fill} scheme={scheme} />
      ) : styleId === "dots" ? (
        <Dots size={size} fill={fill} scheme={scheme} />
      ) : styleId === "bar" ? (
        <Equalizer size={size} fill={fill} scheme={scheme} />
      ) : styleId === "shapes" ? (
        <ShapeHop list={list} size={size} fill={fill} />
      ) : (
        <SpinnerRing size={size} fill={fill} scheme={scheme} />
      )}
    </View>
  );
}
