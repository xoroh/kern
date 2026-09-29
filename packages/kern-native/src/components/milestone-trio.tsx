import {
  BRAND_TRIO,
  FEEDBACK_SIZE_DP,
  type FeedbackShapeKind,
  type FeedbackSize,
  type ResolvedTheme,
  resolveThemeDetails,
} from "@xoroh/kern-theme";
import {
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { CircularProgress } from "./circular-progress";
import { Shape } from "./shape";

export type MilestoneTrioProps = Omit<ViewProps, "children" | "style"> & {
  /** Step labels, e.g. ['Auth', 'Organisation', 'Workspace']. */
  steps: readonly string[];
  /** Completed step count (0..steps.length). */
  progress: number;
  size?: FeedbackSize;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * milestoneStepStyles — one step of the trio: done = full, current =
 * pulsing loader, todo = dim. Labels follow the step state.
 */
export function milestoneStepStyles(
  state: "done" | "current" | "todo",
  scheme: ResolvedTheme = resolveThemeDetails(),
): { step: ViewStyle; glyph: ViewStyle; label: TextStyle } {
  return {
    step: {
      alignItems: "center",
      gap: 8,
      minWidth: 72,
    },
    glyph: {
      opacity: state === "todo" ? 0.25 : 1,
    },
    label: {
      fontSize: 12,
      lineHeight: 16,
      textAlign: "center",
      color:
        state === "todo"
          ? scheme.color.onSurfaceVariant
          : scheme.color.onSurface,
    },
  };
}

/**
 * MilestoneTrio — determinate waiting as information.
 * One shape per step: done = full, current = pulsing loader, todo = dim.
 * M3 law: switch indeterminate → determinate as soon as progress is known.
 */
export function MilestoneTrio({
  steps,
  progress,
  size = "md",
  color,
  style,
  testID,
  ...props
}: MilestoneTrioProps) {
  const scheme = useKernScheme();
  const edge = FEEDBACK_SIZE_DP[size].shape;
  const gap = FEEDBACK_SIZE_DP[size].gap;
  const fill = color ?? scheme.color.onSurface;
  const kinds: readonly FeedbackShapeKind[] =
    steps.length <= 3
      ? BRAND_TRIO.slice(0, steps.length)
      : steps.map((_, index) => BRAND_TRIO[index % BRAND_TRIO.length]);
  return (
    <View
      {...props}
      testID={testID ?? "kern-milestone-trio"}
      accessibilityRole="progressbar"
      accessibilityLabel={`Loading step ${Math.min(
        progress + 1,
        steps.length,
      )} of ${steps.length}`}
      style={[
        {
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          gap,
        },
        style,
      ]}
    >
      {steps.map((step, index) => {
        const done = index < progress;
        const current = index === progress;
        const state: "done" | "current" | "todo" = done
          ? "done"
          : current
            ? "current"
            : "todo";
        const metrics = milestoneStepStyles(state, scheme);
        return (
          <View key={step} style={metrics.step}>
            <View style={metrics.glyph}>
              {current && !done ? (
                <CircularProgress
                  loaderStyle="shapes"
                  shapes={[kinds[index]]}
                  size={size}
                  label={step}
                  color={fill}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
              ) : (
                <Shape kind={kinds[index]} size={edge} color={fill} />
              )}
            </View>
            <Text style={metrics.label}>{step}</Text>
          </View>
        );
      })}
    </View>
  );
}
