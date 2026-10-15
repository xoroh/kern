import {
  type ResolvedTheme,
} from "@xoroh/kern-tokens";
import {
  EXPRESSIVE_SHAPE_BOX,
  expressiveShapePath,
  type FeedbackShapeKind,
} from "@xoroh/kern-material-3";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { defaultScheme, useKernScheme } from "../theme";
import { Shape } from "./shape";

export type ShapeArtLayout = "scatter" | "stack" | "arch";

export type ShapeArtProps = Omit<ViewProps, "style"> & {
  layout?: ShapeArtLayout;
  size?: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

type Piece = {
  kind: FeedbackShapeKind;
  /** Glyph edge as a fraction of the composition size. */
  edge: number;
  /** Position as a fraction of the composition size. */
  x: number;
  y: number;
  rotationDeg?: number;
  /** Palette slot: soft background, mid outline, accent primary. */
  tone: "soft" | "mid" | "accent";
};

const COMPOSITIONS: Record<ShapeArtLayout, readonly Piece[]> = {
  stack: [
    { kind: "square", edge: 0.62, x: 0, y: 0, tone: "soft" },
    { kind: "square", edge: 0.62, x: 0.1, y: 0.1, tone: "mid" },
    { kind: "circle", edge: 0.34, x: 0.59, y: 0.59, tone: "accent" },
  ],
  arch: [
    { kind: "arch", edge: 0.7, x: 0.15, y: 0.3, tone: "soft" },
    { kind: "circle", edge: 0.3, x: 0.35, y: 0.05, tone: "mid" },
  ],
  scatter: [
    {
      kind: "triangle",
      edge: 0.3,
      x: 0,
      y: 0.07,
      rotationDeg: -8,
      tone: "soft",
    },
    { kind: "circle", edge: 0.26, x: 0.34, y: 0, tone: "mid" },
    {
      kind: "square",
      edge: 0.24,
      x: 0.62,
      y: 0.12,
      rotationDeg: 10,
      tone: "soft",
    },
    { kind: "pill", edge: 0.2, x: 0.8, y: 0.4, tone: "accent" },
  ],
};

/**
 * shapeArtStyles — static shape compositions (empty states, brand art):
 * `scatter`, `stack` and `arch`. Returns the root box plus one absolute
 * slot per piece, positioned on the composition size.
 */
export function shapeArtStyles(
  layout: ShapeArtLayout,
  size: number,
  scheme: ResolvedTheme = defaultScheme,
): { root: ViewStyle; pieces: readonly ViewStyle[] } {
  const height = layout === "scatter" ? size * 0.6 : size;
  return {
    root: {
      width: size,
      height,
      borderRadius: Number.parseFloat(scheme.shape.large),
    },
    pieces: COMPOSITIONS[layout].map((piece) => ({
      position: "absolute",
      left: piece.x * size,
      top: piece.y * height,
    })),
  };
}

/**
 * ShapeArt — brand shape compositions. Decorative only: the pieces stay
 * out of the accessibility tree and carry no product vocabulary.
 */
export function ShapeArt({
  layout = "scatter",
  size = 120,
  opacity = 1,
  style,
  testID,
  ...props
}: ShapeArtProps) {
  const scheme = useKernScheme();
  const styles = shapeArtStyles(layout, size, scheme);
  const pieces = COMPOSITIONS[layout];
  return (
    <View
      {...props}
      testID={testID ?? "kern-shape-art"}
      style={[styles.root, { opacity }, style]}
    >
      {pieces.map((piece, index) => (
        <View
          key={`${piece.kind}-${piece.tone}-${piece.edge}`}
          style={styles.pieces[index]}
        >
          <Shape
            kind={piece.kind}
            size={piece.edge * size}
            color={
              piece.tone === "soft"
                ? scheme.color.surfaceContainerHighest
                : piece.tone === "mid"
                  ? scheme.color.outline
                  : scheme.color.primary
            }
            rotationDeg={piece.rotationDeg ?? 0}
          />
        </View>
      ))}
    </View>
  );
}

export type ExpressiveShapeProps = Omit<ViewProps, "style"> & {
  /** Expressive form id from `@xoroh/kern-tokens` (built-in or registered). */
  shape?: string;
  /** Box edge in dp. The path always draws in a square viewBox. */
  size?: number;
  /** Fill override — classification hues only. */
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * expressiveShapeArtStyles — root box for one expressive form. The SVG
 * viewBox is always square (`EXPRESSIVE_SHAPE_BOX`), so width and height
 * stay equal: no distortion, no per-shape metrics.
 */
export function expressiveShapeArtStyles(size: number): ViewStyle {
  return { width: size, height: size };
}

/**
 * ExpressiveShape — one static M3-Expressive-family form (cookie, burst,
 * floral…) rendered as vector art via react-native-svg. Decorative only:
 * hidden from the accessibility tree, carrying no product vocabulary, and
 * never morphed — Kern pins static radii, so the form is fixed at render.
 * The `d` string comes from `expressiveShapePath`, the same builder the web
 * renderer uses, so both sides draw byte-identical art.
 */
export function ExpressiveShape({
  shape = "flower-8",
  size = 48,
  color,
  style,
  testID,
  ...props
}: ExpressiveShapeProps) {
  const scheme = useKernScheme();
  const fill = color ?? scheme.color.primary;
  return (
    <View
      {...props}
      testID={testID ?? "kern-expressive-shape"}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[expressiveShapeArtStyles(size), style]}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${EXPRESSIVE_SHAPE_BOX} ${EXPRESSIVE_SHAPE_BOX}`}
      >
        <Path
          testID="kern-expressive-shape-path"
          d={expressiveShapePath(shape, EXPRESSIVE_SHAPE_BOX)}
          fill={fill}
        />
      </Svg>
    </View>
  );
}
