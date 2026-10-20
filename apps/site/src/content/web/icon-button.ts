import type { ComponentDoc } from "../types";

export const iconButton: ComponentDoc = {
  slug: "icon-button",
  name: "Icon button",
  oneLiner: "Icon buttons are buttons whose content is a single glyph.",
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
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the button. In the toggle form the press flips the state and `aria-pressed` follows it.",
    },
    {
      key: "Tab",
      action:
        "Moves focus to the icon button. A soft-disabled button keeps its tab stop on purpose, so the control stays discoverable.",
    },
  ],
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
    {
      name: "toggle",
      type: "boolean | null | undefined",
      note: "Renders the button as a toggle that reports its state. The selected treatment follows the variant.",
    },
    {
      name: "size",
      type: '"sm" | "default" | "lg" | "md" | "xs" | "xl" | "2xl" | null | undefined',
      note: "Density size from `xs` to `2xl`; default is the standard control. `2xl` is the Expressive L size — already past the minimum touch target, so it carries no extra target inset.",
    },
    {
      name: "width",
      type: '"default" | "narrow" | "wide" | null | undefined',
      note: "Horizontal proportion: `narrow` (3/4), `default` square, `wide` (4/3).",
    },
    {
      name: "shape",
      type: '"square" | "pill" | null | undefined',
      note: "Container shape: `pill` (default) or `square`.",
    },
    {
      name: "selected",
      type: "boolean | null | undefined",
      note: "Selected treatment for toggle buttons. Pairs with `toggle`; a plain button has no selected state to show.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Icon content. Hidden from assistive tech; the name comes from `label`.",
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible name, and the text of the M3 tooltip. Required in practice: an icon-only button with no name is unusable with a screen reader.",
    },
    {
      name: "selectedLabel",
      type: "string | undefined",
      note: 'Accessible name when the toggle is selected (`aria-label-selected`). Only meaningful with `toggle` — a favorite button reads "Add to favorites" unselected and "Remove from favorites" selected.',
    },
    {
      name: "softDisabled",
      type: "boolean | undefined",
      note: "Soft-disabled: paints the disabled treatment but stays focusable, so the control remains discoverable (the toolbar pattern for disabled controls).",
    },
    {
      name: "loading",
      type: "boolean | undefined",
      note: "Shows a loading spinner in place of the icon and blocks interaction.",
    },
    {
      name: "flipIcon",
      type: "boolean | undefined",
      note: "Mirrors the icon horizontally in RTL contexts. Opt into it for directional glyphs only; symmetric icons must not flip.",
    },
    {
      name: "pressed",
      type: "boolean | undefined",
      note: "Controlled pressed state. Only meaningful with `toggle`.",
    },
    {
      name: "defaultPressed",
      type: "boolean | undefined",
      note: "Initial pressed state for the uncontrolled toggle case.",
    },
    {
      name: "onPressedChange",
      type: "((pressed: boolean) => void) | undefined",
      note: "Fires when the toggle flips, with the new pressed state.",
    },
  ],
  aria: [
    '`aria-label` is not optional in practice. A glyph-only button with no name is announced as "button" and is unusable with a screen reader.',
    "It is a real button, so it is reachable and activatable by keyboard.",
    "A tooltip is a visual aid for sighted users; the accessible name is what a screen reader uses, and the two should say the same thing.",
  ],
};
