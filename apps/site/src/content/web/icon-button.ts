import type { ComponentDoc } from "../types";

export const iconButton: ComponentDoc = {
  slug: "icon-button",
  name: "Icon button",
  oneLiner: "Icon buttons are buttons whose content is a single glyph.",
  features:
    "Reach for an icon button when the action is familiar enough to survive without words and space is tight: a close, a favourite, an overflow menu. The name is the hard part — a glyph means nothing to a screen reader and something different to everyone at first, so the button needs an accessible name and usually a tooltip. Use it for actions, not for navigation, which is a link. If you cannot name the action in two words, it needs a label and is a regular button.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/icon-buttons",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "IconButton",
    variants: ["variant: IconButtonVariant"],
    elevation: "surface",
  },
  parts: ["IconButton"],
  customization: {
    supported: [
      "`className` is passed through and merged after the button's own classes.",
      "`variant` selects the emphasis, from the same family of treatments the buttons use.",
      "The glyph is the caller's content, so the component owns the shape and the states rather than a fixed icon set.",
    ],
    notSupported: [
      "There is no `label` prop that renders visible text. An icon button with a visible label is a button; the glyph is the content.",
      "There is no `tooltip` prop. The hint is the caller's to render — the button cannot know where the tooltip should sit.",
    ],
  },
  api: [
    {
      name: "aria-label",
      type: "string",
      note: 'The accessible name. With no text content and no name, the button is announced as "button" and means nothing — this is the prop that makes an icon button usable.',
    },
    {
      name: "variant",
      type: "IconButtonVariant",
      note: "The emphasis, from the same family of treatments the regular buttons use.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the button's own classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Blocks interaction and dims the button.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLButtonElement>",
      note: "Forwarded to the underlying `<button>`.",
    },
  ],
  aria: [
    '`aria-label` is not optional in practice. A glyph-only button with no name is announced as "button" and is unusable with a screen reader.',
    "It is a real button, so it is reachable and activatable by keyboard.",
    "A tooltip is a visual aid for sighted users; the accessible name is what a screen reader uses, and the two should say the same thing.",
  ],
};
