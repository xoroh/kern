import type { ComponentDoc } from "../types";

export const successTransform: ComponentDoc = {
  slug: "success-transform",
  name: "Success transform",
  oneLiner:
    "Success transforms are the completion moment — a disc and a tick, or the loader that precedes it.",
  features:
    "Reach for a success transform when finishing should look like finishing: a form submitted, a payment taken, a step done. It has exactly two states and that is the design — `loading` and `success` — so the moment of completion is one component rather than a loader swapped for a tick by hand. The tick is drawn with the border trick rather than an icon, and the radii come from the shape scale, so it belongs to the same family as `Shape` and the loading indicators around it. The two colours are separate props (`color` and `successColor`), so the wait and the outcome can be told apart.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only kern feedback surface. No web export to name.
    nativePeer: "none",
    variants: ["state: loading · success"],
    elevation: "surface",
  },
  parts: ["SuccessTransform"],
  customization: {
    supported: [
      "`state` is the two moments, `loading` and `success`.",
      "`color` and `successColor` are separate, so the wait and the outcome can be told apart.",
      "`size` is the shared feedback size axis.",
    ],
    notSupported: [
      "There is no `error` or `failure` state. This is the completion moment; a failure is a message, not a transform.",
      "There is no `progress` value. `loading` is unmeasured — a measured wait is `Progress`.",
      "There is no custom glyph. The tick is drawn with the border trick and the radii come from the shape scale.",
    ],
  },
  api: [
    {
      name: "state",
      type: '"loading" | "success"',
      note: "The two moments. Exactly two — the completion is one component rather than a loader swapped for a tick by hand.",
    },
    {
      name: "color / successColor",
      type: "string",
      note: "Separate colours for the wait and the outcome, so the two can be told apart.",
    },
    {
      name: "size",
      type: "FeedbackSize",
      note: "The shared feedback size axis.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
    {
      name: "successTransformStyles",
      type: "(…) => Styles",
      note: "Exported helper — the success disc and the tick drawn with the border trick, radii from the shape scale.",
    },
  ],
  aria: [
    "The change from `loading` to `success` is the message, so it should be announced — a completed step that only changes appearance is one some people never learn about.",
    "There is no error state here: a failure is a message (`Snackbar`, `Banner`, `FieldMessage`), not a transform.",
    "`loading` is unmeasured, so it says \"working\" without implying a quantity. A measured wait is `Progress` or `Meter`.",
  ],
};
