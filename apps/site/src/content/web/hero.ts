import type { ComponentDoc } from "../types";

export const hero: ComponentDoc = {
  slug: "hero",
  name: "Hero",
  oneLiner:
    "Hero opens a page with its main heading, supporting copy, actions, and optional art.",
  features:
    "Reach for Hero when a page needs one clear opening statement and a next step. It gives you slots for the eyebrow, heading, supporting copy, actions, and optional art, while the host supplies the actual content and controls. The layout stacks on narrow screens and places the art beside the message at wider widths.",
  meta: {
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern/start",
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["Hero"],
  customization: {
    supported: [
      "`eyebrow`, `title`, and `lede` carry host-provided content; `title` becomes the page's primary `<h1>`.",
      "`actions` and `art` accept React nodes, so the host chooses both the controls and visual treatment.",
      "`id` names the section and derives the heading id; `className` and the other section props pass through.",
    ],
    notSupported: [
      "Hero does not supply copy, buttons, images, or decorative artwork.",
      "There is no `size` or `variant` axis; the composition responds to the available width.",
    ],
  },
  api: [
    {
      name: "eyebrow",
      type: "ReactNode",
      required: true,
      note: "Short context above the main heading.",
    },
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: "Rendered as the page's primary `<h1>` and used to name the section.",
    },
    {
      name: "lede",
      type: "ReactNode",
      required: true,
      note: "Supporting copy below the heading.",
    },
    {
      name: "actions",
      type: "ReactNode",
      note: "Optional host-supplied actions, usually one primary and one secondary action.",
    },
    {
      name: "art",
      type: "ReactNode",
      note: "Optional host-supplied illustration, preview, or interactive composition.",
    },
    {
      name: "id",
      type: "string",
      note: "Optional section id; the heading id is derived from it.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the section's own classes.",
    },
  ],
  aria: [
    "The section is labelled by its heading, which is rendered as an `<h1>`; one Hero per page keeps the heading outline clear.",
    "Actions and art remain ordinary host content. Give meaningful images alternative text and make interactive art keyboard-operable.",
  ],
  keyboard: [
    {
      key: "Tab",
      action:
        "Moves through any interactive content supplied in `actions` or `art` in DOM order.",
    },
  ],
  usage: {
    do: [
      "Use one Hero for the primary opening on a page, with a concise heading and a next step.",
      "Keep decorative art decorative, and provide alternative text for meaningful images in the art slot.",
    ],
    dont: [
      "Don't use Hero for a section heading halfway down a page; use a heading and ordinary layout instead.",
      "Don't put essential copy only in the art slot, where it may be visually hidden or harder to scan.",
    ],
  },
};
