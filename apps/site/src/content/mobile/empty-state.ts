import type { ComponentDoc } from "../types";

export const emptyState: ComponentDoc = {
  slug: "empty-state",
  name: "Empty state",
  oneLiner:
    "The empty state tells someone what is missing, why it is missing, and what to do about it — in place of the content that would be there.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "EmptyState",
    variants: [],
    elevation: "surface",
  },
  parts: ["EmptyState"],
  // M2: an empty state is a STATE, not a control. It takes no focus and
  // answers no key of its own — the control in the `action` slot is what the
  // screen reader reaches, and the row never speaks for it.
  nonInteractive: true,
  customization: {
    supported: [
      "`visual` is a slot for an illustration or glyph above the message.",
      "`title` and `description` are text; `action` is a slot for the next step — a button, a link, whatever the fix is.",
      "`style` is a React Native `ViewStyle`, merged after the centered stack's spacing.",
    ],
    notSupported: [
      "There is no `variant` axis for the reason (no results vs. no permission vs. error). Say it in the text — the shape is the same, the words are not.",
      "There is no built-in loading or skeleton state. An empty state is for emptiness that is STABLE; a wait is a `Skeleton` or a progress component.",
      "The visual slot does not size or constrain its content — the illustration's box is yours.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      required: true,
      note: "What is missing, said plainly. Rendered as the `title` text variant.",
    },
    {
      name: "visual",
      type: "ReactNode",
      note: "An illustration or glyph above the message. Optional — the message stands without it.",
    },
    {
      name: "description",
      type: "string",
      note: "Why it is missing, and what would change that. Centered under the title; omit when the title says everything.",
    },
    {
      name: "action",
      type: "ReactNode",
      note: "The next step. A control the user can act on — an empty state without one only describes the dead end.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles, merged after the stack's spacing.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-empty-state"',
      note: "Test hook for the stack.",
    },
  ],
  aria: [
    "The empty state adds no roles: the title is text, and the action is the named control inside it.",
    "It should be announced when it appears in place of content — the host replacing a list with an empty state is a change worth reporting, not a silent swap.",
  ],
};
