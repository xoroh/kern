import type { ComponentDoc } from "../types";

export const hero: ComponentDoc = {
  slug: "hero",
  name: "Hero",
  oneLiner:
    "Hero opens a page with its main heading, supporting copy, actions, and optional art.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
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
};
