import type { ComponentDoc } from "../types";

export const kernComposer: ComponentDoc = {
  slug: "kern-composer",
  name: "Kern composer",
  oneLiner:
    "Kern composer is the message composer with modes, panels, reply and draft affordances.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "KernComposer",
    variants: ["mode: public · internal · note"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernComposer"],
  keyboard: [
    {
      key: "Press",
      action:
        "Sends through the labelled send control — software keyboards own the return key, so send is the send pressable only, never Enter.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the mode choice, the draft field, the panels and the send control in order.",
    },
  ],
  customization: {
    supported: [
      "Affordances are opt-in: passing state, a default, or the change callback renders the row — absent props mean absent UI for scheduling, drafts and out-of-office alike.",
      "`value` plus `onSend` is the minimal composer; `panels`, `replyTo`, `mode`, `cannedInserts` and the knowledge flyout layer on.",
      "The mode bar, reply bar, attachment tray and canned picker are exported slots sharing this contract.",
    ],
    notSupported: [
      "There is no transport inside. `onSend` carries the draft out; delivery, retries and history stay host-owned.",
      "There is no second option list. The canned picker composes `KernPicker` — inline popover on web, owned-trigger sheet on native.",
      "There is no rich text. The draft is a string; formatting is the host's renderer, not the composer's model.",
    ],
  },
  api: [
    {
      name: "value",
      type: "string",
    },
    {
      name: "defaultValue",
      type: "string",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
    },
    {
      name: "onSend",
      type: "(text: string) => void",
      note: "Send (DOMAIN action; receives the current text).",
    },
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
      name: "replyTo",
      type: "{ author: string",
    },
    {
      name: "excerpt",
      type: "string }",
      required: true,
    },
    {
      name: "onDismissReply",
      type: "() => void",
    },
    {
      name: "panels",
      type: "ReactNode",
    },
    {
      name: "attachments",
      type: "readonly ComposerAttachment[]",
    },
    {
      name: "onRemoveAttachment",
      type: "(id: string) => void",
    },
    {
      name: "cannedInserts",
      type: "readonly CannedInsert[]",
    },
    {
      name: "onCannedSelect",
      type: "(insert: CannedInsert) => void",
    },
    {
      name: "knowledge",
      type: "ReactNode",
    },
    {
      name: "knowledgeLabel",
      type: "string",
    },
    {
      name: "scheduledFor",
      type: "Date | null",
      note: "Scheduling affordance (sheet date-time picker). Passing state, a * default, or the change callback renders the row; `null` = send now.",
    },
    {
      name: "defaultScheduledFor",
      type: "Date | null",
    },
    {
      name: "onScheduledChange",
      type: "(date: Date | null) => void",
    },
    {
      name: "draftStatus",
      type: "ComposerDraftStatus",
    },
    {
      name: "onSaveDraft",
      type: "() => void",
    },
    {
      name: "onDiscardDraft",
      type: "() => void",
    },
    {
      name: "outOfOffice",
      type: "boolean",
      note: "Out-of-office affordance. Passing state, a default, or the change * callback renders the banner + toggle.",
    },
    {
      name: "defaultOutOfOffice",
      type: "boolean",
    },
    {
      name: "onOutOfOfficeChange",
      type: "(next: boolean) => void",
    },
    {
      name: "sending",
      type: "boolean",
    },
    {
      name: "disabled",
      type: "boolean",
    },
    {
      name: "label",
      type: "string",
    },
    {
      name: "placeholder",
      type: "string",
    },
    {
      name: "sendLabel",
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
    "The mode bar is a radiogroup, so visibility announces as a counted choice rather than three buttons.",
    "The draft field is a labelled multiline input; the send control is a pressable with its own label.",
    "Draft state reads as text — saved, saving, unsaved — and the knowledge panel reports expanded state on its trigger.",
  ],
};
