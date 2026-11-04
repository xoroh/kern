import type { ComponentDoc } from "../types";

export const composerReplyBar: ComponentDoc = {
  slug: "composer-reply-bar",
  name: "Composer reply bar",
  oneLiner:
    "Composer reply bar names the message being answered with a dismiss control.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ComposerReplyBar",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ComposerReplyBar"],
  keyboard: [
    {
      key: "Press",
      action:
        "Dismisses the reply — the control is a labelled button, so activation is the platform's own.",
    },
  ],
  customization: {
    supported: [
      "`replyTo` is the required author-plus-excerpt pair; without it there is no bar.",
      "The dismiss control is labelled, so its purpose survives icon-only rendering.",
    ],
    notSupported: [
      "There is no editing here. The bar quotes; the draft field composes.",
      "There is no thread model. One quoted message at a time — stacking quotes is the host's.",
    ],
  },
  api: [
    {
      name: "replyTo",
      type: "{ author: string",
      required: true,
    },
    {
      name: "excerpt",
      type: "string }",
      required: true,
    },
    {
      name: "onDismissReply",
      type: "() => void",
      note: "Reply dismissal (DOMAIN action, not state).",
    },
    {
      name: "dismissLabel",
      type: "string",
    },
  ],
  aria: [
    "The bar pairs the author with the excerpt, so the quoted context reads as one unit.",
    "Dismissal reports through `onDismissReply` — the host clears the reply target, the bar only asks.",
  ],
};
