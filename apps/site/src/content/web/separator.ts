import type { ComponentDoc } from "../types";

export const separator: ComponentDoc = {
  slug: "separator",
  name: "Separator",
  oneLiner: "Separators divide one region of content from the next.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Separator",
    variants: [],
    elevation: "surface",
  },
  parts: ["Separator"],
  // M2: a divider is a presentational rule — it takes no focus and has no
  // state, so there is nothing to contract for.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` is passed through and merged after the separator's own classes.",
      "It renders the separator element with its orientation, so the role is the element's rather than a role bolted onto a line.",
      "Colour and thickness come from the outline roles and the theme.",
    ],
    notSupported: [
      "There is no `variant` prop for solid versus dashed versus thick. A different rule is `className`.",
      "There is no `label` prop. A separator that needs a label is a heading with a rule under it.",
    ],
  },
  api: [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      note: "Which way it runs. The element carries the matching role, so a vertical divider is announced as one rather than as a horizontal rule.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the separator's own classes.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state: SeparatorState) => CSSProperties | undefined) | undefined",
      note: "Style for the divider, or a function of its state returning style.",
    },
    {
      name: "render",
      type: "ReactElement<unknown, string | JSXElementConstructor<any>> | ComponentRenderFn<HTMLProps, SeparatorState> | undefined",
      note: "Replaces the divider element with another tag or composes it with another component.",
    },
    {
      name: "inset",
      type: '"none" | "start" | "middle" | undefined',
      note: "M3 divider insets: `none` full-bleed, `start` a leading inset, `middle` insets on both sides.",
    },
  ],
  aria: [
    "The separator element carries the separator role, and its orientation is announced with it.",
    "`decorative` is the honest state for a line that only reinforces a division the content already makes — an announced separator where content already breaks is noise.",
    "A separator that divides two related groups and is NOT decorative gives those groups their boundary in the accessibility tree.",
  ],
};
