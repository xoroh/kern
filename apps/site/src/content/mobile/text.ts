import type { ComponentDoc } from "../types";

export const text: ComponentDoc = {
  slug: "text",
  name: "Text",
  oneLiner:
    "Text renders a string in one of the four kern type roles, with the theme's ink and nothing else decided for you.",
  features:
    "Reach for this Text whenever you are drawing words on a kern surface and you want them to sit on the type scale rather than in it by hand. `variant` names a TYPE ROLE — body, label, title, headline — and the size, line height, tracking, weight and font face all resolve from the kern typography tokens, so text cannot drift off-scale. The colour defaults to the theme's on-surface ink and `style` comes last, so a deliberate override wins while an accidental one stays visible in review. Everything a React Native `Text` accepts it still accepts — it is a `Text`, not a wrapper around one.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Text",
    variants: ["variant: body · label · title · headline"],
    elevation: "surface",
  },
  parts: ["Text"],
  customization: {
    supported: [
      "`variant` is a type role from the kern typography tokens; the metrics come with it.",
      "`style` is a React Native `TextStyle`, merged AFTER the role and the ink — an override is possible but visible.",
      "`textStyles` is exported for the role's metrics without the component.",
    ],
    notSupported: [
      "There is no size or weight prop. Those are the type scale's decisions; pick a role instead of a number.",
      "There is no colour prop. The ink follows the theme's on-surface role; a coloured run is a `style` override you can see in review.",
      "There is no truncation, ellipsis or max-lines convenience beyond what React Native `Text` already gives you in `style` and props.",
    ],
  },
  api: [
    {
      name: "variant",
      type: 'NativeTextVariant ("body" | "label" | "title" | "headline")',
      default: '"body"',
      note: "The type role. Size, line height, tracking, weight and font face all resolve from the kern typography tokens for this name.",
    },
    {
      name: "style",
      type: "StyleProp<TextStyle>",
      note: "React Native text styles, merged after the role and the ink colour — the last word, deliberately.",
    },
    {
      name: "textStyles",
      type: "(variant: NativeTextVariant) => TextStyle",
      note: "Exported helper for the role's metrics — the scale without the component.",
    },
  ],
  aria: [
    "Text is a React Native `Text`: it announces as text, in reading order, and nesting Text inside Text keeps one continuous run.",
    "The type role is a VISUAL decision — body, label, title and headline are all just text to assistive technology. Structure (a heading is a heading) belongs to the layout around it, not to the role name.",
  ],
};
