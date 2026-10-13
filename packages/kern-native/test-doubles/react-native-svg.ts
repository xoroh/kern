// Test double for react-native-svg: prop-passthrough stand-ins so suite
// logic runs headless. Jest (RNTL) maps here via moduleNameMapper; vitest
// maps here via resolve.alias. Do NOT add behavior — queries assert on the
// props (testID, accessibility*) that components set.
import type { ReactNode } from "react";

const stub = (name: string) => {
  const C = ({ children, ..._props }: { children?: ReactNode }) =>
    children ?? null;
  C.displayName = name;
  return C;
};

export const Svg = stub("Svg");
export const Circle = stub("Circle");
export const Ellipse = stub("Ellipse");
export const G = stub("G");
export const Text = stub("SvgText");
export const TSpan = stub("TSpan");
export const TextPath = stub("TextPath");
export const Path = stub("Path");
export const Polygon = stub("Polygon");
export const Polyline = stub("Polyline");
export const Line = stub("Line");
export const Rect = stub("Rect");
export const Use = stub("Use");
export const Image = stub("SvgImage");
// `Symbol` shadows the global, so it is declared under an alias and
// re-exported — the module shape still matches `react-native-svg`.
const SvgSymbol = stub("SvgSymbol");

export { SvgSymbol as Symbol };

export const Defs = stub("Defs");
export const LinearGradient = stub("LinearGradient");
export const RadialGradient = stub("RadialGradient");
export const Stop = stub("Stop");
export const ClipPath = stub("ClipPath");
export const Pattern = stub("Pattern");
export const Mask = stub("Mask");
export const Marker = stub("Marker");
export const ForeignObject = stub("ForeignObject");

export default {
  Svg,
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
  Marker,
  ForeignObject,
};
