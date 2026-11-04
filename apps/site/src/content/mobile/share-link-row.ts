import type { ComponentDoc } from "../types";

export const shareLinkRow: ComponentDoc = {
  slug: "share-link-row",
  name: "Share link row",
  oneLiner: "Share link row mints, copies and revokes scoped share links.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ShareLinkRow",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ShareLinkRow"],
  keyboard: [
    {
      key: "Press",
      action:
        "Copies the link, changes scope, or opens the revoke confirm — every one a labelled pressable.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Reads the link state first — Active, Copied, Revoked — then the actions.",
    },
  ],
  customization: {
    supported: [
      "`link` is the required share-link model; `onCopy` and `onRevoke` carry the actions out to the host.",
      "`scopes` with `onScopeSelect` sets the per-recipient scope without leaving the row.",
      "Copy and revoke labels are props, so the row speaks the host's language.",
    ],
    notSupported: [
      "There is no clipboard write inside. `onCopy` fires and the host writes — the row never touches the clipboard.",
      "There is no scope model inside. Minting and per-recipient scope live wherever links come from; the row renders and reports.",
    ],
  },
  api: [
    {
      name: "link",
      type: "ShareLink",
      required: true,
    },
    {
      name: "onCopy",
      type: "(link: ShareLink) => void",
      note: "Copy (DOMAIN action; the host writes the clipboard).",
    },
    {
      name: "onRevoke",
      type: "(link: ShareLink) => void",
      note: "Revoke (DOMAIN action; fires after the alert confirms).",
    },
    {
      name: "scopes",
      type: "readonly { value: string",
    },
    {
      name: "label",
      type: "string }[]",
      required: true,
    },
    {
      name: "onScopeSelect",
      type: "(scope: string) => void",
    },
    {
      name: "copied",
      type: "boolean",
    },
    {
      name: "copyLabel",
      type: "string",
    },
    {
      name: "revokeLabel",
      type: "string",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "Scope picking stays an inline picker with the picker's option contract — no nested surface.",
    "The link state reads through the `StatusPill`: Active, Copied, Revoked — one registry, one announcement.",
    "Revoking confirms through the overlay alert on web and the confirm expression on native, so destruction always asks first.",
  ],
};
