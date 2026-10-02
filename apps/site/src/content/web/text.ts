import type { ComponentDoc } from "../types";

export const text: ComponentDoc = {
  slug: "text",
  name: "Text",
  oneLiner: "Text renders a line of type at one of the typescale's styles.",
  features:
    "Reach for text when a line of copy should sit on the typescale rather than on whatever size the browser defaults to. The variant picks the style; the element picks the meaning — a title rendered as a paragraph is a heading to everyone who can see it and a paragraph to everyone who cannot. Choose `as` for the semantics and `variant` for the look, and do not let one stand in for the other. If the line is a heading, it is a heading element regardless of how large it is drawn.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Text",
    // A real variant axis: the typescale styles, not ad-hoc sizes.
    variants: ["variant: body · label · title · headline"],
    elevation: "surface",
  },
  parts: ["Text"],
  customization: {
    supported: [
      "`variant` selects one of the typescale's styles, and every property it sets — size, line height, letter spacing, weight — comes from the typescale tokens rather than from numbers in the component.",
      "`as` changes the rendered element, so the semantics can follow the content's meaning rather than its size.",
      "`className` is passed through and merged after the variant's classes.",
    ],
    notSupported: [
      "There is no `size` or `weight` prop. Those are the typescale's, not the text's — reaching for a numeric size means the type has stopped following the system.",
      "There is no `color` prop. Colour is the role of whatever the text sits on; a text colour is `className` against a system role.",
      "There is no `truncate` or `lines` prop. Truncation is layout, and it is `className`.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"body" | "label" | "title" | "headline"',
      default: '"body"',
      note: "Which typescale style to use. Each one sets size, line height, letter spacing and weight from the typescale tokens together, so the four never drift apart.",
    },
    {
      name: "as",
      type: "ElementType",
      default: '"p"',
      note: "Polymorphic: the element to render. Pick it for MEANING — a heading is a heading element however large or small it is drawn. The props follow the element you choose.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the variant's classes.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLElement>",
      note: "Forwarded to the rendered element.",
    },
  ],
  aria: [
    '`as` decides what assistive tech hears. A `title` variant rendered with `as="p"` looks like a heading and is not one.',
    "Heading levels belong to the document outline, not to the type size — choose `as` from the structure and `variant` from the design.",
    "The variant carries no ARIA of its own; it is a type style, and meaning stays with the element.",
  ],
};
