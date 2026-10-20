import type { ComponentDoc } from "../types";

export const emptyState: ComponentDoc = {
  slug: "empty-state",
  name: "Empty state",
  oneLiner:
    "Empty states say what is missing, and offer the one thing that would fix it.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "EmptyState",
    variants: [],
    elevation: "surface",
  },
  parts: ["EmptyState"],
  // M2: an empty state is a STATE, not a control. It takes no focus and
  // answers no key of its own — the recovery control in the `action` slot is
  // what the keyboard reaches, and it is a real button because the caller
  // put a real button there.
  nonInteractive: true,
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  customization: {
    supported: [
      "`className` is passed through and merged after the empty state's own classes.",
      "`visual` is a slot for an icon, an illustration, or a `Loader` — the component does not own the picture.",
      "`action` is a slot for the recovery control, usually a `Button`.",
    ],
    notSupported: [
      "There is no `variant` or `tone` prop. An empty state is not an error and should not be coloured as one.",
      "There is no `actions` plural. One recovery action is the point; a second one is a decision, and decisions belong somewhere the user is choosing rather than stuck.",
      "There is no `icon` prop distinct from `visual`. The visual slot is any node, so narrowing it to an icon would only get in the way.",
    ],
  },
  api: [
    {
      name: "title",
      type: "ReactNode",
      note: "What is missing. Required — an empty state with no title is the blank region it was supposed to explain.",
    },
    {
      name: "description",
      type: "ReactNode",
      note: 'Why it is empty, or what would fill it. This is where the difference between "nothing yet" and "nothing matching your filter" gets stated.',
    },
    {
      name: "visual",
      type: "ReactNode",
      note: "Slot for an icon, illustration or `Loader` above the text.",
    },
    {
      name: "action",
      type: "ReactNode",
      note: "Slot for the single recovery control. Usually a `Button`.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the empty state's own classes.",
    },
  ],
  aria: [
    "The title and description are ordinary text, so they are read in order like any other copy.",
    "The visual slot is decoration unless it carries meaning, in which case it needs a name of its own.",
    "The action is whatever control you pass — a real `Button` is keyboard-operable without anything from this component.",
    "An empty state is a state, not an alert. It should not announce itself; it should be there when the reader arrives.",
  ],
};
