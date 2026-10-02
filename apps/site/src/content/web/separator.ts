import type { ComponentDoc } from "../types";

export const separator: ComponentDoc = {
  slug: "separator",
  name: "Separator",
  oneLiner: "Separators divide one region of content from the next.",
  features:
    "Reach for a separator when a boundary between two runs of content would otherwise be invisible: between sections of a menu, above a footer, between a form's groups. It is a rule, not a spacer — if the two things are separate enough to need a line, they are usually separate enough to be two sections with their own headings. Keep separators few; a list where every row is divided is a list where the divider has stopped meaning anything.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Separator",
    variants: [],
    elevation: "surface",
  },
  parts: ["Separator"],
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
      name: "decorative",
      type: "boolean",
      note: "Marks the line as decoration. Set it when the division is purely visual — otherwise assistive tech announces a separator where the content already breaks naturally.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the separator's own classes.",
    },
  ],
  aria: [
    "The separator element carries the separator role, and its orientation is announced with it.",
    "`decorative` is the honest state for a line that only reinforces a division the content already makes — an announced separator where content already breaks is noise.",
    "A separator that divides two related groups and is NOT decorative gives those groups their boundary in the accessibility tree.",
  ],
};
