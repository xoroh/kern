import type { ComponentDoc } from "../types";

export const shape: ComponentDoc = {
  slug: "shape",
  name: "Shape",
  oneLiner:
    "Shapes are the six basic forms in the kern radius language, drawn from the shape scale rather than freehand.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only kern brand/feedback surface. No web export to name.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["Shape"],
  // A shape is a static mark: a view with no role, no state and no focus, so
  // there is no keyboard contract to write. The aria contract below says what
  // it means instead.
  nonInteractive: true,
  customization: {
    supported: [
      "`kind` is one of the six forms in the kern radius language.",
      "`size` is the box edge in dp, defaulting to the `md` shape metric.",
      "`rotationDeg` rotates the shape — which is how the diamond is drawn.",
    ],
    notSupported: [
      "There is no arbitrary radius. The radii come from the SHAPE SCALE, so the form is kern's and not a freehand curve.",
      "`color` is a FILL OVERRIDE FOR CLASSIFICATION HUES ONLY. A shape carries meaning; it is not a swatch.",
      "There is no gradient or multi-fill.",
    ],
  },
  api: [
    {
      name: "kind",
      type: "FeedbackShapeKind",
      note: "One of the six basic shapes in the kern radius language.",
    },
    {
      name: "size",
      type: "number",
      note: "Box edge in dp. Defaults to the `md` shape metric, so an unstyled shape is on scale.",
    },
    {
      name: "color",
      type: "string",
      note: "Fill override — CLASSIFICATION HUES ONLY. Restricted on purpose: a shape carries meaning and is not an arbitrary swatch.",
    },
    {
      name: "rotationDeg",
      type: "number",
      note: "Rotation. The diamond is a rotated rounded square, which is what keeps it on the same scale as the other forms.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
    {
      name: "shapeStyles",
      type: "(…) => Styles",
      note: "Exported helper for the form, if you want the radii without the component.",
    },
  ],
  aria: [
    "A shape is decoration unless the content around it says otherwise — it carries no name of its own.",
    "When it stands for something (a classification, a category), the meaning must be available in text too, because colour and form alone reach only some people.",
    "The radii being on the shape scale is what makes the mark recognisable as kern's rather than as any rounded square.",
  ],
};
