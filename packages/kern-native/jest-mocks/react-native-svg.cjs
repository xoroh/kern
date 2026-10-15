// Jest module map for react-native-svg: headless stand-ins (see
// test-doubles/react-native-svg.ts for the contract). Implemented in CJS so
// no transform entry is needed.
//
// Each element renders a real host `View` carrying the received props, so
// `testID` / accessibility queries work exactly as they do against the
// components' RN host wrappers. Vector-specific props (`d`, `fill`, …) land
// on the View harmlessly.
const React = require("react");
const { View } = require("react-native");

const stub = (name) => {
  const C = ({ children, ...props }) =>
    React.createElement(View, props, children);
  C.displayName = name;
  return C;
};

const names = [
  "Svg",
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

const out = {};
for (const name of names) out[name] = stub(name);
out.default = out;
module.exports = out;
