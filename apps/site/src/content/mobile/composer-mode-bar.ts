import type { ComponentDoc } from "../types";

export const composerModeBar: ComponentDoc = {
  slug: "composer-mode-bar",
  name: "Composer mode bar",
  oneLiner: "Composer mode bar is the message-visibility radio group.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ComposerModeBar",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ComposerModeBar"],
  keyboard: [
    {
      key: "Press",
      action:
        "Chooses the visibility mode — options carry radio roles in one radiogroup, so the counted choice survives without arrow keys.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Reads the three modes with the checked one marked; double-tap chooses it.",
    },
  ],
  customization: {
    supported: [
      "`mode`/`defaultMode`/`onModeChange` make it controlled or uncontrolled over the fixed trio.",
      "`label` renames the group for assistive technology.",
      "It is the composer's mode control, but it is exported because hosts place it outside the composer too.",
    ],
    notSupported: [
      "There are exactly three modes. A fourth visibility is a product decision, not a prop.",
      "There is no `options` prop. The trio is fixed, which is what keeps every composer labelling it the same way.",
    ],
  },
  api: [
    {
      name: "mode",
      type: "ComposerMode",
    },
    {
      name: "defaultMode",
      type: "ComposerMode",
    },
    {
      name: "onModeChange",
      type: "(mode: ComposerMode) => void",
    },
    {
      name: "label",
      type: "string",
    },
    {
      name: "disabled",
      type: "boolean",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
  ],
  aria: [
    "The bar is a radiogroup named by `label` — Message visibility by default — with Public, Internal and Note as its three radio options.",
    "The checked mode paints with the secondary-container treatment, so the painted and announced modes agree.",
    "`disabled` dims the whole group and removes it from the order.",
  ],
};
