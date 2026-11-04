import type { ComponentDoc } from "../types";

export const inviteAccept: ComponentDoc = {
  slug: "invite-accept",
  name: "Invite accept",
  oneLiner:
    "Invite accept is the invitation acceptance block over overlay, role picker and composer note.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "InviteAccept",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["InviteAccept"],
  keyboard: [
    {
      key: "Back / swipe-down",
      action:
        "Dismisses the invitation sheet — dismissal is platform-owned on native.",
    },
    {
      key: "Press",
      action:
        "Accepts or declines through the footer's buttons; the role rows keep the inline picker's option press model.",
    },
  ],
  customization: {
    supported: [
      "`invite` carries the invitation details; `defaultOpen` opens the surface without a controlled flag.",
      "`onAccept` receives the optional note and `onDecline` closes the loop — both host-owned.",
      "Role options, labels and the message toggle are props, so the block adapts without forking.",
    ],
    notSupported: [
      "There is no plan-Q7 behaviour. The excluded scope stays excluded by design — no prop reopens it.",
      "There is no nested modal. The role picker is inline by contract; nesting would trap focus twice.",
    ],
  },
  api: [
    {
      name: "invite",
      type: "InviteDetails",
      required: true,
    },
    {
      name: "open",
      type: "boolean",
    },
    {
      name: "defaultOpen",
      type: "boolean",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
    },
    {
      name: "roleOptions",
      type: "readonly { value: string",
    },
    {
      name: "label",
      type: "string }[]",
      required: true,
    },
    {
      name: "roleValue",
      type: "string",
    },
    {
      name: "defaultRoleValue",
      type: "string",
    },
    {
      name: "onRoleChange",
      type: "(role: string) => void",
    },
    {
      name: "messageEnabled",
      type: "boolean",
    },
    {
      name: "messageValue",
      type: "string",
    },
    {
      name: "defaultMessageValue",
      type: "string",
    },
    {
      name: "onMessageChange",
      type: "(message: string) => void",
    },
    {
      name: "onAccept",
      type: "(note?: string) => void",
      note: "Accept receives the note when `messageEnabled`.",
    },
    {
      name: "onDecline",
      type: "() => void",
    },
    {
      name: "acceptLabel",
      type: "string",
    },
    {
      name: "declineLabel",
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
    "The invitation renders in the overlay modal on web and a sheet on native, named by the invitation.",
    "Role picking stays an inline picker — never a nested modal — so focus never stacks two surfaces.",
    "The accept note composes the composer, so the message field keeps the composer's own contract.",
  ],
};
