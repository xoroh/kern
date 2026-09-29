import {
  FEEDBACK_SIZE_DP,
  type FeedbackShapeKind,
  type ResolvedTheme,
  resolveThemeDetails,
} from "@xoroh/kern-theme";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

export type ShapeProps = Omit<ViewProps, "style"> & {
  kind: FeedbackShapeKind;
  /** Box edge in dp. Defaults to the `md` shape metric. */
  size?: number;
  /** Fill override — classification hues only. */
  color?: string;
  rotationDeg?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * shapeStyles — one of the six basic shapes in the Kern radius language.
 * Radii come from the shape scale; the diamond is a rotated rounded square.
 */
export function shapeStyles(
  kind: FeedbackShapeKind,
  size: number,
  fill: string,
  scheme: ResolvedTheme = resolveThemeDetails(),
  rotationDeg = 0,
): ViewStyle {
  const rotate = `${(kind === "diamond" ? 45 : 0) + rotationDeg}deg`;
  switch (kind) {
    case "triangle":
      return {
        width: 0,
        height: 0,
        borderLeftWidth: size / 2,
        borderRightWidth: size / 2,
        borderBottomWidth: size * 0.9,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: fill,
        transform: [{ rotate }],
      };
    case "circle":
      return {
        width: size,
        height: size,
        borderRadius: Number.parseFloat(scheme.shape.full),
        backgroundColor: fill,
        transform: [{ rotate }],
      };
    case "square":
      return {
        width: size,
        height: size,
        borderRadius: Number.parseFloat(scheme.shape.small),
        backgroundColor: fill,
        transform: [{ rotate }],
      };
    case "pill":
      return {
        width: size,
        height: size * 0.55,
        borderRadius: Number.parseFloat(scheme.shape.full),
        backgroundColor: fill,
        transform: [{ rotate }],
      };
    case "diamond":
      return {
        width: size * 0.71,
        height: size * 0.71,
        borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
        backgroundColor: fill,
        transform: [{ rotate }],
      };
    case "arch":
      return {
        width: size,
        height: size,
        borderTopLeftRadius: Number.parseFloat(scheme.shape.full),
        borderTopRightRadius: Number.parseFloat(scheme.shape.full),
        borderBottomLeftRadius: Number.parseFloat(scheme.shape.small),
        borderBottomRightRadius: Number.parseFloat(scheme.shape.small),
        backgroundColor: fill,
        transform: [{ rotate }],
      };
  }
}

/**
 * Shape — a single static basic shape. The building block for the
 * loading indicator styles, the brand trio and shape compositions.
 * Color defaults to the theme on-surface role.
 */
export function Shape({
  kind,
  size = FEEDBACK_SIZE_DP.md.shape,
  color,
  rotationDeg = 0,
  style,
  testID,
  ...props
}: ShapeProps) {
  const scheme = useKernScheme();
  const fill = color ?? scheme.color.onSurface;
  return (
    <View
      {...props}
      testID={testID ?? "kern-shape"}
      style={[shapeStyles(kind, size, fill, scheme, rotationDeg), style]}
    />
  );
}
