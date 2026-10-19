// Jest module map for react-native-svg: headless stand-ins (see
// test-doubles/react-native-svg.ts for the contract). Implemented in CJS so
// no transform entry is needed.
//
// Each element renders a real host `View` carrying the received props, so
// `testID` / accessibility queries work exactly as they do against the
// components' RN host wrappers. Vector-specific props (`d`, `fill`, …) land
// on the View harmlessly.
//
// The module itself IS the Svg stub function, with every named stub attached
// as a property. This shape is load-bearing: tsup-compiled consumers
// (kern-icons `dist/index.native.cjs`) import via esbuild `__toESM(mod, 1)`
// — node mode — which unconditionally sets `.default` to the module object
// itself. A namespace object here therefore renders as "got: object" the
// moment an Icon mounts. A function export makes `.default` the Svg
// component, and `__copyProps` picks the named stubs up off its properties.
const React = require("react");
const { View } = require("react-native");

const stub = (name) => {
  const C = ({ children, ...props }) =>
    React.createElement(View, props, children);
  C.displayName = name;
  return C;
};

const Svg = stub("Svg");

const names = [
  "Circle",
  "Ellipse",
  "G",
  "Text",
  "TSpan",
  "TextPath",
  "Path",
  "Polygon",
  "Polyline",
  "Line",
  "Rect",
  "Use",
  "Image",
  "Symbol",
  "Defs",
  "LinearGradient",
  "RadialGradient",
  "Stop",
  "ClipPath",
  "Pattern",
  "Mask",
  "Marker",
  "ForeignObject",
];

for (const name of names) Svg[name] = stub(name);
// The real package also exports `Svg` by name — components import
// `{ Circle, Line, Svg }` — so the function carries a self-reference.
Svg.Svg = Svg;
// Self-reference for Babel-style interop readers (`mod.__esModule` is
// deliberately NOT set: see above).
Svg.default = Svg;
module.exports = Svg;
